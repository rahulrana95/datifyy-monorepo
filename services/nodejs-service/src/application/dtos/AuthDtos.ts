// src/application/dtos/AuthDtos.ts - Updated with verification code support

import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength, 
  Matches, 
  IsNotEmpty,
} from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass, Transform } from 'class-transformer';
import { WeakPasswordError, InvalidEmailError } from '../../domain/errors/AuthErrors';

// Password validation regex - strong password requirements
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

// Transform decorators for cleaning input
const trimTransform = Transform(({ value }) => typeof value === 'string' ? value.trim() : value);
const lowerCaseTransform = Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value);

export class SendVerificationCodeRequestDto {
  @IsEmail({}, { 
    message: 'Please provide a valid email address' 
  })
  @IsNotEmpty({ 
    message: 'Email is required' 
  })
  @MaxLength(255, { 
    message: 'Email must not exceed 255 characters' 
  })
  @trimTransform
  @lowerCaseTransform
  email: string;
}

export class SignupRequestDto {
  @IsEmail({}, { 
    message: 'Please provide a valid email address' 
  })
  @IsNotEmpty({ 
    message: 'Email is required' 
  })
  @MaxLength(255, { 
    message: 'Email must not exceed 255 characters' 
  })
  @trimTransform
  @lowerCaseTransform
  email: string;

  @IsString({ 
    message: 'Password must be a string' 
  })
  @IsNotEmpty({ 
    message: 'Password is required' 
  })
  @MinLength(8, { 
    message: 'Password must be at least 8 characters long' 
  })
  @MaxLength(128, { 
    message: 'Password must not exceed 128 characters' 
  })
  @Matches(PASSWORD_REGEX, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
  })
  password: string;

  @IsString({ 
    message: 'Verification code must be a string' 
  })
  @IsNotEmpty({ 
    message: 'Verification code is required' 
  })
  @Matches(/^\d{6}$/, { 
    message: 'Verification code must be exactly 6 digits' 
  })
  @trimTransform
  verificationCode: string;
}

export class LoginRequestDto {
  @IsEmail({}, { 
    message: 'Please provide a valid email address' 
  })
  @IsNotEmpty({ 
    message: 'Email is required' 
  })
  @trimTransform
  @lowerCaseTransform
  email: string;

  @IsString({ 
    message: 'Password must be a string' 
  })
  @IsNotEmpty({ 
    message: 'Password is required' 
  })
  password: string;
}

export class VerifyEmailRequestDto {
  @IsEmail({}, { 
    message: 'Please provide a valid email address' 
  })
  @IsNotEmpty({ 
    message: 'Email is required' 
  })
  @trimTransform
  @lowerCaseTransform
  email: string;

  @IsString({ 
    message: 'Verification code must be a string' 
  })
  @IsNotEmpty({ 
    message: 'Verification code is required' 
  })
  @Matches(/^\d{6}$/, { 
    message: 'Verification code must be exactly 6 digits' 
  })
  @trimTransform
  verificationCode: string;
}

export class ForgotPasswordRequestDto {
  @IsEmail({}, { 
    message: 'Please provide a valid email address' 
  })
  @IsNotEmpty({ 
    message: 'Email is required' 
  })
  @trimTransform
  @lowerCaseTransform
  email: string;
}

export class ResetPasswordRequestDto {
  @IsEmail({}, { 
    message: 'Please provide a valid email address' 
  })
  @IsNotEmpty({ 
    message: 'Email is required' 
  })
  @trimTransform
  @lowerCaseTransform
  email: string;

  @IsString({ 
    message: 'Reset code must be a string' 
  })
  @IsNotEmpty({ 
    message: 'Reset code is required' 
  })
  @Matches(/^\d{6}$/, { 
    message: 'Reset code must be exactly 6 digits' 
  })
  @trimTransform
  resetCode: string;

  @IsString({ 
    message: 'New password must be a string' 
  })
  @IsNotEmpty({ 
    message: 'New password is required' 
  })
  @MinLength(8, { 
    message: 'New password must be at least 8 characters long' 
  })
  @MaxLength(128, { 
    message: 'New password must not exceed 128 characters' 
  })
  @Matches(PASSWORD_REGEX, {
    message: 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
  })
  newPassword: string;
}

// Validation middleware factory
export function validateDto<T extends object>(DtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Transform plain object to class instance with transformations applied
      const dto = plainToClass(DtoClass, req.body);
      
      // Validate the DTO
      const errors = await validate(dto as any, {
        whitelist: true, // Strip properties that don't have decorators
        forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are found
        transform: true, // Apply transformations
      });

      if (errors.length > 0) {
        // Format validation errors and throw appropriate error
        const formattedErrors = formatValidationErrors(errors);
        const errorMessage = formattedErrors.map(err => err.constraints.join(', ')).join('; ');
        
        // Determine specific error type based on validation failures
        if (formattedErrors.some(err => err.field === 'password')) {
          throw new WeakPasswordError(errorMessage);
        } else if (formattedErrors.some(err => err.field === 'email')) {
          throw new InvalidEmailError(errorMessage);
        } else {
          throw new WeakPasswordError(`Validation failed: ${errorMessage}`);
        }
      }

      // Attach validated and transformed data to request
      req.body = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
}

function formatValidationErrors(errors: ValidationError[]): any[] {
  return errors.map(error => ({
    field: error.property,
    value: error.value,
    constraints: Object.values(error.constraints || {}),
  }));
}

// Export validation middleware for each DTO
export const validateSendVerificationCode = validateDto(SendVerificationCodeRequestDto);
export const validateSignup = validateDto(SignupRequestDto);
export const validateLogin = validateDto(LoginRequestDto);
export const validateVerifyEmail = validateDto(VerifyEmailRequestDto);
export const validateForgotPassword = validateDto(ForgotPasswordRequestDto);
export const validateResetPassword = validateDto(ResetPasswordRequestDto);