// src/controllers/auth/AuthController.ts

import { Request, Response, NextFunction } from 'express';
import { DataSource, QueryRunner } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../../infrastructure/logging/Logger';
import { DatifyyUsersLogin } from '../../models/entities/DatifyyUsersLogin';
import { DatifyyUsersInformation } from '../../models/entities/DatifyyUsersInformation';
import { 
  UserAlreadyExistsError, 
  WeakPasswordError, 
  InvalidEmailError,
  InternalServerError 
} from '../../domain/errors/AuthErrors';
import { SignupRequestDto, LoginRequestDto } from '../../application/dtos/AuthDtos';
import { AuthResponse, AuthResponseCreator } from '../../application/responses/ApiResponse';

export class AuthController {
  private readonly logger: Logger;
  private readonly jwtSecret: string;
  private readonly saltRounds: number = 12;

  constructor(
    private readonly dataSource: DataSource,
    logger?: Logger
  ) {
    this.logger = logger || Logger.getInstance();
    this.jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
    
    if (!process.env.JWT_SECRET) {
      this.logger.warn('JWT_SECRET not set in environment variables');
    }
  }

  /**
   * User signup with comprehensive validation and transaction management
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
      const { email, password } = req.body as SignupRequestDto;
      
      // Additional validation
      await this.validateSignupData({ email, password });

      // Start database transaction
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      this.logger.debug('Database transaction started', { requestId });

      // Check if user already exists
      const existingUser = await this.checkUserExists(queryRunner, email, requestId);
      if (existingUser) {
        throw new UserAlreadyExistsError('User already exists with this email', { email });
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password, requestId);

      // Create user login record
      const userLogin = await this.createUserLogin(queryRunner, {
        email,
        password: hashedPassword
      }, requestId);

      // Create user information record
      const userInformation = await this.createUserInformation(queryRunner, {
        email,
        userLogin
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
  private async validateSignupData(data: SignupRequestDto): Promise<void> {
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
    userData: { email: string; userLogin: DatifyyUsersLogin },
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
      isOfficialEmailVerified: false, // Should be verified via email
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
      userId: userData.userLogin.id
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