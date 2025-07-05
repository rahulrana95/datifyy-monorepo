// src/application/responses/ApiResponse.ts

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
  requestId?: string;
}

// Specific response types for authentication
export interface AuthResponse {
  user: {
    id: number;
    email: string;
    isAdmin: boolean;
  };
  token: string;
  expiresAt: string;
}

export interface VerificationResponse {
  email: string;
  message: string;
  expiresAt: string;
}

// Response builder utility
export class ResponseBuilder {
  private response: Partial<ApiResponse> = {
    success: true,
    timestamp: new Date().toISOString(),
  };

  static success<T>(data?: T): ResponseBuilder {
    const builder = new ResponseBuilder();
    builder.response.data = data;
    return builder;
  }

  withMessage(message: string): ResponseBuilder {
    this.response.message = message;
    return this;
  }

  withRequestId(requestId: string): ResponseBuilder {
    this.response.requestId = requestId;
    return this;
  }

  build(): ApiResponse {
    return this.response as ApiResponse;
  }
}

// Pre-built response creators for authentication flows
export class AuthResponseCreator {
  static loginSuccess(authData: AuthResponse, requestId?: string): ApiResponse<AuthResponse> {
    return ResponseBuilder
      .success(authData)
      .withMessage('Login successful')
      .withRequestId(requestId || '')
      .build();
  }

  static signupSuccess(authData: AuthResponse, requestId?: string): ApiResponse<AuthResponse> {
    return ResponseBuilder
      .success(authData)
      .withMessage('Account created successfully')
      .withRequestId(requestId || '')
      .build();
  }

  static logoutSuccess(requestId?: string): ApiResponse {
    return ResponseBuilder
      .success()
      .withMessage('Logged out successfully')
      .withRequestId(requestId || '')
      .build();
  }

  static verificationCodeSent(
    email: string, 
    expiresAt: string, 
    requestId?: string
  ): ApiResponse<VerificationResponse> {
    const data: VerificationResponse = {
      email,
      message: `Verification code sent to ${email}`,
      expiresAt,
    };

    return ResponseBuilder
      .success(data)
      .withMessage('Verification code sent successfully')
      .withRequestId(requestId || '')
      .build();
  }

  static emailVerified(requestId?: string): ApiResponse {
    return ResponseBuilder
      .success()
      .withMessage('Email verified successfully')
      .withRequestId(requestId || '')
      .build();
  }

  static passwordResetCodeSent(
    email: string, 
    expiresAt: string, 
    requestId?: string
  ): ApiResponse<VerificationResponse> {
    const data: VerificationResponse = {
      email,
      message: `Password reset code sent to ${email}`,
      expiresAt,
    };

    return ResponseBuilder
      .success(data)
      .withMessage('Password reset code sent successfully')
      .withRequestId(requestId || '')
      .build();
  }

  static passwordResetSuccess(requestId?: string): ApiResponse {
    return ResponseBuilder
      .success()
      .withMessage('Password reset successfully')
      .withRequestId(requestId || '')
      .build();
  }
}

// Express response helper middleware
export function responseHelpers(req: any, res: any, next: any): void {
  const requestId = req.id;

  // Add success helper to response object
  res.success = function<T>(data?: T, message: string = 'Operation successful') {
    const response = ResponseBuilder
      .success(data)
      .withMessage(message)
      .withRequestId(requestId)
      .build();
    
    return this.status(200).json(response);
  };

  // Add created helper for 201 responses
  res.created = function<T>(data?: T, message: string = 'Resource created successfully') {
    const response = ResponseBuilder
      .success(data)
      .withMessage(message)
      .withRequestId(requestId)
      .build();
    
    return this.status(201).json(response);
  };

  next();
}

// Extend Express Response interface
declare global {
  namespace Express {
    interface Response {
      success<T>(data?: T, message?: string): Response;
      created<T>(data?: T, message?: string): Response;
    }
  }
}