import { Request, Response, NextFunction } from 'express';
import { DataSource, QueryRunner } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../infrastructure/logging/Logger';
import { DatifyyUsersLogin } from '../../models/entities/DatifyyUsersLogin';
import { DatifyyUsersInformation } from '../../models/entities/DatifyyUsersInformation';
import { 
  UserAlreadyExistsError, 
  WeakPasswordError, 
  InvalidEmailError,
  InternalServerError,
  UserNotFoundError,
  InvalidVerificationCodeError,
  VerificationCodeExpiredError,
  InvalidCredentialsError
} from '../../domain/errors/AuthErrors';
import { 
  SignupRequestDto, 
  LoginRequestDto, 
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  VerifyEmailRequestDto,
  SendVerificationCodeRequestDto 
} from '../../application/dtos/AuthDtos';
import { AuthResponse, AuthResponseCreator } from '../../application/responses/ApiResponse';
import { getCodeForVerifyingEmail, verifyCodeForEmail } from '../../methods/code-verify/code-verifying';
import { sendEmail, from } from '../emailController';
import forgotPasswordTemplate from '../../methods/templates/forgotPassword';

export class AuthController {
  private readonly logger: Logger;
  private readonly jwtSecret: string;
  private readonly saltRounds: number = 12;
  private readonly mailerKey: string;

  constructor(
    private readonly dataSource: DataSource,
    logger?: Logger
  ) {
    this.logger = logger || Logger.getInstance();
    this.jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
    this.mailerKey = process.env.MAILERSEND_API_KEY ?? '';
    
    if (!process.env.JWT_SECRET) {
      this.logger.warn('JWT_SECRET not set in environment variables');
    }
  }

  /**
   * Send verification code for signup
   */
  async sendVerificationCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('Send verification code initiated', {
        requestId,
        email: req.body.email,
        timestamp: new Date().toISOString()
      });

      const { email } = req.body as SendVerificationCodeRequestDto;

      // Check if user already exists in either table
      const userExists = await this.checkUserExistsForVerification(email, requestId);
      if (userExists) {
        throw new UserAlreadyExistsError('User already exists with this email', { email });
      }

      // Generate verification code
      const verificationCode = getCodeForVerifyingEmail(email);

      // Send verification email
      await this.sendVerificationEmail(email, verificationCode, requestId);

      this.logger.info('Verification code sent successfully', {
        requestId,
        email,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({
        success: true,
        message: 'Verification code sent to your email',
        data: {
          email,
          expiresIn: '5 minutes'
        },
        requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Send verification code failed', {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        email: req.body?.email
      });

      next(error);
    }
  }

    private async checkUserExistsForVerification(email: string, requestId: string): Promise<boolean> {
  // Gets repositories for both tables
  const userLoginRepo = this.dataSource.getRepository(DatifyyUsersLogin);
  const userInfoRepo = this.dataSource.getRepository(DatifyyUsersInformation);

  // Checks both tables simultaneously 
  const [userLogin, userInfo] = await Promise.all([
    userLoginRepo.findOne({ where: { email: email.toLowerCase() } }),
    userInfoRepo.findOne({ where: { officialEmail: email.toLowerCase() } })
  ]);

  // Returns true if user exists in either table
  if (userLogin || userInfo) {
    return true;
  }

  return false;
    }
    
  /**
   * User signup with email verification code
   */
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();
    let queryRunner: QueryRunner | null = null;

    try {
      this.logger.info('Signup attempt initiated', {
        requestId,
        email: req.body.email,
        timestamp: new Date().toISOString()
      });

      // Extract and validate data
      const { email, password, verificationCode } = req.body as SignupRequestDto;
      
      // Verify the email verification code first
      const isCodeValid = verifyCodeForEmail({ email, code: verificationCode });
      if (!isCodeValid) {
        throw new InvalidVerificationCodeError('Invalid or expired verification code');
      }

      // Additional validation
      await this.validateSignupData({ email, password });

      // Start database transaction
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      this.logger.debug('Database transaction started', { requestId });

      // Check if user already exists (double-check after code verification)
      const userExists = await this.checkUserExists(queryRunner, email, requestId);
      if (userExists) {
        throw new UserAlreadyExistsError('User already exists with this email', { email });
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password, requestId);

      // Create user login record
      const userLogin = await this.createUserLogin(queryRunner, {
        email,
        password: hashedPassword
      }, requestId);

      // Create user information record with verified email
      const userInformation = await this.createUserInformation(queryRunner, {
        email,
        userLogin,
        isEmailVerified: true // Mark as verified since code was validated
      }, requestId);

      // Generate JWT token
      const authResponse = await this.generateAuthResponse(userLogin, requestId);

      // Commit transaction
      await queryRunner.commitTransaction();
      
      this.logger.info('User signup completed successfully', {
        requestId,
        userId: userLogin.id,
        email: userLogin.email,
        timestamp: new Date().toISOString()
      });

      // Set secure cookie
      this.setAuthCookie(res, authResponse.token);

      // Send success response
      const response = AuthResponseCreator.signupSuccess(authResponse, requestId);
      res.status(201).json(response);

    } catch (error) {
      // Rollback transaction on error
      if (queryRunner && queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
        this.logger.debug('Database transaction rolled back', { requestId });
      }

      this.logger.error('Signup failed', {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        email: req.body?.email
      });

      next(error);
    } finally {
      // Always release the query runner
      if (queryRunner) {
        await queryRunner.release();
        this.logger.debug('Database connection released', { requestId });
      }
    }
  }

  /**
   * Validate signup data beyond DTO validation
   */
  private async validateSignupData(data: { email: string; password: string }): Promise<void> {
    const { email, password } = data;

    // Additional email validation
    if (!this.isValidEmailDomain(email)) {
      throw new InvalidEmailError('Email domain not allowed');
    }

    // Additional password validation
    if (!this.isPasswordComplex(password)) {
      throw new WeakPasswordError('Password does not meet complexity requirements');
    }
  }

  /**
   * Check if user already exists
   */
  private async checkUserExists(
    queryRunner: QueryRunner, 
    email: string, 
    requestId: string
  ): Promise<DatifyyUsersLogin | null> {
    this.logger.debug('Checking if user exists', { requestId, email });

    const existingUser = await queryRunner.manager.findOne(DatifyyUsersLogin, {
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      this.logger.warn('Signup attempted for existing user', {
        requestId,
        email,
        existingUserId: existingUser.id
      });
    }

    return existingUser;
  }

  /**
   * Hash password securely
   */
  private async hashPassword(password: string, requestId: string): Promise<string> {
    this.logger.debug('Hashing password', { requestId });
    
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      this.logger.error('Password hashing failed', { requestId, error });
      throw new InternalServerError('Failed to process password');
    }
  }

  /**
   * Create user login record
   */
  private async createUserLogin(
    queryRunner: QueryRunner,
    userData: { email: string; password: string },
    requestId: string
  ): Promise<DatifyyUsersLogin> {
    this.logger.debug('Creating user login record', { requestId, email: userData.email });

    const userLogin = queryRunner.manager.create(DatifyyUsersLogin, {
      email: userData.email.toLowerCase(),
      password: userData.password,
      isactive: true,
      isadmin: false,
      gender: 'male' // Default value, can be updated later
    });

    const savedUser = await queryRunner.manager.save(DatifyyUsersLogin, userLogin);
    
    this.logger.info('User login record created', {
      requestId,
      userId: savedUser.id,
      email: savedUser.email
    });

    return savedUser;
  }

  /**
   * Create user information record
   */
  private async createUserInformation(
    queryRunner: QueryRunner,
    userData: { email: string; userLogin: DatifyyUsersLogin; isEmailVerified?: boolean },
    requestId: string
  ): Promise<DatifyyUsersInformation> {
    this.logger.debug('Creating user information record', { 
      requestId, 
      userId: userData.userLogin.id 
    });

    const userInformation = queryRunner.manager.create(DatifyyUsersInformation, {
      id: uuidv4(),
      firstName: '',
      lastName: '',
      gender: 'male',
      officialEmail: userData.email.toLowerCase(),
      userLogin: userData.userLogin,
      bio: null,
      images: null,
      dob: null,
      isOfficialEmailVerified: userData.isEmailVerified || false,
      isAadharVerified: false,
      isPhoneVerified: false,
      height: null,
      favInterest: null,
      causesYouSupport: null,
      qualityYouValue: null,
      prompts: null,
      education: null,
      currentCity: null,
      hometown: null,
      exercise: 'None',
      educationLevel: 'High School',
      drinking: 'Never',
      smoking: 'Never',
      lookingFor: 'Friendship',
      settleDownInMonths: '0-6',
      haveKids: false,
      wantsKids: false,
      starSign: 'Aries',
      birthTime: null,
      kundliBeliever: false,
      religion: null,
      pronoun: 'He/Him',
      isDeleted: false
    });

    const savedUserInfo = await queryRunner.manager.save(DatifyyUsersInformation, userInformation);
    
    this.logger.info('User information record created', {
      requestId,
      userInfoId: savedUserInfo.id,
      userId: userData.userLogin.id,
      emailVerified: userData.isEmailVerified
    });

    return savedUserInfo;
  }

  /**
   * Generate authentication response with JWT
   */
  private async generateAuthResponse(
    user: DatifyyUsersLogin,
    requestId: string
  ): Promise<AuthResponse> {
    this.logger.debug('Generating authentication response', {
      requestId,
      userId: user.id
    });

    const tokenPayload = {
      id: user.id,
      email: user.email,
      isadmin: user.isadmin || false
    };

    const expiresIn = '48h';
    const token = jwt.sign(tokenPayload, this.jwtSecret, { expiresIn });
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    return {
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isadmin || false
      },
      token,
      expiresAt: expiresAt.toISOString()
    };
  }

  /**
   * Set secure authentication cookie
   */
  private setAuthCookie(res: Response, token: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 48 * 60 * 60 * 1000, // 48 hours
      path: '/'
    });
  }

  /**
   * Validate email domain (can be extended with allowed domains list)
   */
  private isValidEmailDomain(email: string): boolean {
    // Add domain validation logic here
    // For now, accept all domains
    return true;
  }

  /**
   * User login with credential validation
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('Login attempt initiated', {
        requestId,
        email: req.body.email,
        timestamp: new Date().toISOString()
      });

      // Extract and validate data
      const { email, password } = req.body as LoginRequestDto;

      // Find user by email
      const user = await this.findUserByEmail(email, requestId);
      if (!user) {
        throw new InvalidCredentialsError('Invalid email or password', { email });
      }

      // Verify user is active
      if (!user.isactive) {
        this.logger.warn('Login attempt for inactive user', {
          requestId,
          email,
          userId: user.id
        });
        throw new InvalidCredentialsError('Account is deactivated', { email });
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, user.password, requestId);
      if (!isPasswordValid) {
        this.logger.warn('Invalid password attempt', {
          requestId,
          email,
          userId: user.id
        });
        throw new InvalidCredentialsError('Invalid email or password', { email });
      }

      // Update last login timestamp
      await this.updateLastLogin(user, requestId);

      // Generate authentication response
      const authResponse = await this.generateAuthResponse(user, requestId);

      this.logger.info('User login completed successfully', {
        requestId,
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString()
      });

      // Set secure cookie
      this.setAuthCookie(res, authResponse.token);

      // Send success response
      const response = AuthResponseCreator.loginSuccess(authResponse, requestId);
      res.status(200).json(response);

    } catch (error) {
      this.logger.error('Login failed', {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        email: req.body?.email
      });

      next(error);
    }
  }

  /**
   * User logout - clear authentication cookie
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('Logout initiated', {
        requestId,
        timestamp: new Date().toISOString()
      });

      // Clear authentication cookie
      this.clearAuthCookie(res);

      this.logger.info('User logout completed successfully', {
        requestId,
        timestamp: new Date().toISOString()
      });

      // Send success response
      const response = AuthResponseCreator.logoutSuccess(requestId);
      res.status(200).json(response);

    } catch (error) {
      this.logger.error('Logout failed', {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      next(error);
    }
  }

  /**
   * Validate JWT token and return user info
   */
  async validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      // Extract token from header or cookies
      const token = this.extractToken(req);
      
      if (!token) {
        throw new InvalidCredentialsError('No token provided');
      }

      // Verify and decode token
      const decoded = jwt.verify(token, this.jwtSecret) as any;

      this.logger.debug('Token validation successful', {
        requestId,
        userId: decoded.id,
        email: decoded.email
      });

      res.status(200).json({
        success: true,
        data: {
          valid: true,
          user: {
            id: decoded.id,
            email: decoded.email,
            isAdmin: decoded.isadmin || false
          }
        },
        requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        this.logger.warn('Invalid token provided', { requestId });
        next(new InvalidCredentialsError('Invalid token'));
      } else if (error instanceof jwt.TokenExpiredError) {
        this.logger.warn('Expired token provided', { requestId });
        next(new InvalidCredentialsError('Token expired'));
      } else {
        this.logger.error('Token validation failed', {
          requestId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        next(error);
      }
    }
  }

  /**
   * Find user by email
   */
  private async findUserByEmail(email: string, requestId: string): Promise<DatifyyUsersLogin | null> {
    this.logger.debug('Finding user by email', { requestId, email });

    const userRepository = this.dataSource.getRepository(DatifyyUsersLogin);
    const user = await userRepository.findOne({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      this.logger.warn('User not found', { requestId, email });
    }

    return user;
  }

  /**
   * Verify password against hash
   */
  private async verifyPassword(password: string, hashedPassword: string, requestId: string): Promise<boolean> {
    this.logger.debug('Verifying password', { requestId });

    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      this.logger.error('Password verification failed', { requestId, error });
      throw new InternalServerError('Failed to verify password');
    }
  }

  /**
   * Update user's last login timestamp
   */
  private async updateLastLogin(user: DatifyyUsersLogin, requestId: string): Promise<void> {
    this.logger.debug('Updating last login timestamp', {
      requestId,
      userId: user.id
    });

    try {
      const userRepository = this.dataSource.getRepository(DatifyyUsersLogin);
      user.lastLoginAt = new Date();
      await userRepository.save(user);
    } catch (error) {
      // Don't fail login if we can't update timestamp
      this.logger.warn('Failed to update last login timestamp', {
        requestId,
        userId: user.id,
        error
      });
    }
  }
  

  /**
   * Clear authentication cookie
   */
  private clearAuthCookie(res: Response): void {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
  }

  /**
   * Send verification code for email verification
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('Email verification initiated', {
        requestId,
        email: req.body.email,
        timestamp: new Date().toISOString()
      });

      const { email, verificationCode } = req.body as VerifyEmailRequestDto;

      // Verify the code
      const isCodeValid = verifyCodeForEmail({ email, code: verificationCode });

      if (!isCodeValid) {
        throw new InvalidVerificationCodeError('Invalid or expired verification code');
      }

      // Update user's email verification status
      await this.updateEmailVerificationStatus(email, requestId);

      this.logger.info('Email verification completed successfully', {
        requestId,
        email,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Email verification failed', {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        email: req.body?.email
      });

      next(error);
    }
  }

  /**
   * Send password reset code via email
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('Forgot password initiated', {
        requestId,
        email: req.body.email,
        timestamp: new Date().toISOString()
      });

      const { email } = req.body as ForgotPasswordRequestDto;

      // Check if user exists
      const user = await this.findUserByEmail(email, requestId);
      if (!user) {
        // Don't reveal if user exists or not for security
        this.logger.warn('Password reset requested for non-existent user', {
          requestId,
          email
        });
      }

      // Generate verification code (always generate to prevent timing attacks)
      const verificationCode = getCodeForVerifyingEmail(email);

      // Send email only if user exists
      if (user && user.isactive) {
        await this.sendPasswordResetEmail(email, verificationCode, requestId);
        
        this.logger.info('Password reset email sent successfully', {
          requestId,
          email,
          userId: user.id
        });
      } else {
        this.logger.warn('Password reset email not sent - user inactive or non-existent', {
          requestId,
          email
        });
      }

      // Always return success to prevent user enumeration
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset code has been sent',
        requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Forgot password failed', {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        email: req.body?.email
      });

      next(error);
    }
  }

  /**
   * Reset password with verification code
   */
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestId = (req as any).id || uuidv4();

    try {
      this.logger.info('Password reset initiated', {
        requestId,
        email: req.body.email,
        timestamp: new Date().toISOString()
      });

      const { email, resetCode, newPassword } = req.body as ResetPasswordRequestDto;

      // Verify the reset code
      const isCodeValid = verifyCodeForEmail({ email, code: resetCode });
      if (!isCodeValid) {
        throw new InvalidVerificationCodeError('Invalid or expired reset code');
      }

      // Find user
      const user = await this.findUserByEmail(email, requestId);
      if (!user) {
        throw new UserNotFoundError('User not found');
      }

      if (!user.isactive) {
        throw new UserNotFoundError('Account is deactivated');
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(newPassword, requestId);

      // Update password in database
      await this.updateUserPassword(user, hashedPassword, requestId);

      this.logger.info('Password reset completed successfully', {
        requestId,
        email,
        userId: user.id,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
        requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('Password reset failed', {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
        email: req.body?.email
      });

      next(error);
    }
  }

  /**
   * Update user's email verification status
   */
  private async updateEmailVerificationStatus(email: string, requestId: string): Promise<void> {
    this.logger.debug('Updating email verification status', { requestId, email });

    try {
      const userInfoRepository = this.dataSource.getRepository(DatifyyUsersInformation);
      
      await userInfoRepository.update(
        { officialEmail: email.toLowerCase() },
        { isOfficialEmailVerified: true }
      );

    } catch (error) {
      this.logger.error('Failed to update email verification status', {
        requestId,
        email,
        error
      });
      throw new InternalServerError('Failed to update email verification status');
    }
  }

  /**
   * Send verification email for signup
   */
  private async sendVerificationEmail(email: string, code: string, requestId: string): Promise<void> {
    this.logger.debug('Sending verification email', { requestId, email });

    try {
      // Import verification email template
      const verifyEmailTemplate = (await import('../../methods/templates/verifyEmail')).default;
      await sendEmail(
        this.mailerKey,
        from,
        [{ email, name: email }],
        'Verify Your Email',
        verifyEmailTemplate(code),
        verifyEmailTemplate(code)
      );

    } catch (error) {
        console.log(error);
      this.logger.error('Failed to send verification email', {
        requestId,
        email,
        error
      });
      throw new InternalServerError('Failed to send verification email');
    }
  }

  /**
   * Send password reset email
   */
  private async sendPasswordResetEmail(email: string, code: string, requestId: string): Promise<void> {
    this.logger.debug('Sending password reset email', { requestId, email });

    try {
      await sendEmail(
        this.mailerKey,
        from,
        [{ email, name: email }],
        'Reset Your Password',
        forgotPasswordTemplate(code),
        forgotPasswordTemplate(code)
      );

    } catch (error) {
      this.logger.error('Failed to send password reset email', {
        requestId,
        email,
        error
      });
      throw new InternalServerError('Failed to send password reset email');
    }
  }

  /**
   * Update user password in database
   */
  private async updateUserPassword(user: DatifyyUsersLogin, hashedPassword: string, requestId: string): Promise<void> {
    this.logger.debug('Updating user password', {
      requestId,
      userId: user.id
    });

    try {
      const userRepository = this.dataSource.getRepository(DatifyyUsersLogin);
      user.password = hashedPassword;
      await userRepository.save(user);

    } catch (error) {
      this.logger.error('Failed to update user password', {
        requestId,
        userId: user.id,
        error
      });
      throw new InternalServerError('Failed to update password');
    }
  }

  /**
   * Extract token from request (header or cookie)
   */
  private extractToken(req: Request): string | null {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    // Check cookies
    if (req.cookies?.token) {
      return req.cookies.token;
    }
    
    // Check Authorization header without Bearer prefix (for backward compatibility)
    if (authHeader) {
      return authHeader;
    }
    
    return null;
  }

  /**
   * Enhanced password complexity validation
   */
  private isPasswordComplex(password: string): boolean {
    // Already validated by DTO, but add additional checks if needed
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return hasUppercase && hasLowercase && hasNumbers && hasSpecialChar && isLongEnough;
  }
}