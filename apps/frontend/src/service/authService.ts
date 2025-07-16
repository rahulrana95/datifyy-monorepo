// apps/frontend/src/service/authService.ts
import apiService from "./apiService";
import { 
  ServiceResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  EmailVerificationRequest,
  TokenValidationResponse,
} from "../proto-types";
import { DatifyyUsersInformation } from "./userService/UserProfileTypes";

const AUTH_API_PREFIX = "auth";

export const login = async (
  username: string, 
  password: string
): Promise<ServiceResponse<LoginResponse>> => {
  try {
    const loginData: LoginRequest = {
      email: username,
      password,
    };

    const { response }: {response?: LoginResponse | undefined} = await apiService.post<LoginResponse>(`${AUTH_API_PREFIX}/login`, loginData);

    if (!response?.accessToken) {
      return { response: undefined, error: { code: 401, message: "Login failed" } };
    }

    const token = response.accessToken;
    apiService.setTokenInCookies(token);

    return { response: response, error: undefined };
  } catch (error) {
    console.log(error);
    return { response: undefined, error: { code: 500, message: "Login failed" } };
  }
};

export const verifyToken = async (): Promise<ServiceResponse<TokenValidationResponse>> => {
  try {
    await apiService.getTokenFromCookies();
    const {response} = await apiService.post<TokenValidationResponse>(`${AUTH_API_PREFIX}/validate-token`);
  
    
    return { response: response, error: undefined };
  } catch (error) {
    return { response: undefined, error: { code: 500, message: "validate-token failed" } };
  }
};

export const register = async (
  password: string, 
  email: string, 
  verificationCode: string,
  firstName: string = '',
  lastName: string = ''
): Promise<ServiceResponse<SignupResponse>> => {
  try {
    const signupData: SignupRequest = {
      password,
      email,
      firstName,
      lastName,
      agreeToTerms: true
    };

    const {response}: {response?: SignupResponse} = await apiService.post<SignupResponse>(`${AUTH_API_PREFIX}/signup`, signupData);
    
    return { response: response, error: undefined };
  } catch (error) {
    return { response: undefined, error: { code: 500, message: "Registration failed" } };
  }
};

export const logout = async (): Promise<ServiceResponse<any>> => {
  try {
    const {response} = await apiService.post(`${AUTH_API_PREFIX}/logout`);


    return { response: response, error: undefined };
  } catch (error) {
    return { response: undefined, error: { code: 500, message: "Logout failed" } };
  }
};

export const getCurrentUser = async (): Promise<ServiceResponse<DatifyyUsersInformation>> => {
  try {
const {response} = await apiService.get<DatifyyUsersInformation>("user-profile");
  
    
    return { response, error: undefined };
  } catch (error) {
    return { response: undefined, error: { code: 500, message: "Failed to fetch current user" } };
  }
};

export const sendEmailCode = async (
  email: string
): Promise<ServiceResponse<any>> => {
  try {
    const {response} = await apiService.post(
      `${AUTH_API_PREFIX}/send-verification-code`, 
      { email }
    );
    
    return { response: response, error: undefined };
  } catch (error) {
    return { response: undefined, error: { code: 500, message: "Failed to send verification code" } };
  }
};

export const verifyEmailCode = async ({
  email,
  verificationCode,
}: {
  email: string;
  verificationCode: string;
}): Promise<ServiceResponse<any>> => {
  try {
    const {response} = await apiService.post("/verify-email-code", {
      email,
      verificationCode,
    });
    
    // if (response.error) {
    //   return { response: undefined, error: { code: 400, message: "Something is wrong." } };
    // }
    
    return { response: response, error: undefined };
  } catch (error) {
    return { response: undefined, error: { code: 500, message: "Failed to verify email code" } };
  }
};

export const sendForgotPasswordCode = async (
  email: string
): Promise<ServiceResponse<any>> => {
  try {
    const forgotPasswordData: ForgotPasswordRequest = { email };
    
    const response = await apiService.post(
      `${AUTH_API_PREFIX}/forgot-password`,
      forgotPasswordData
    );
    
    if (response.error) {
      return { response: undefined, error: { code: 400, message: "Something is wrong." } };
    }
    
    return { response: response.response, error: undefined };
  } catch (error) {
    return { response: undefined, error: { code: 500, message: "Failed to send forgot password code" } };
  }
};

export const verifyForgotPasswordCode = async ({
  email,
  verificationCode,
}: {
  email: string;
  verificationCode: string;
}): Promise<ServiceResponse<any>> => {
  try {
    const response = await apiService.post(`${AUTH_API_PREFIX}/verify-email`, {
      email,
      verificationCode,
    });
    
    if (response.error) {
      return { response: undefined, error: { code: 400, message: "Something is wrong." } };
    }
    
    return { response: response.response, error: undefined };
  } catch (error) {
    return { response: undefined, error: { code: 500, message: "Failed to verify forgot password code" } };
  }
};

export const resetPassword = async (
  resetData: ResetPasswordRequest
): Promise<ServiceResponse<any>> => {
  try {
    const response = await apiService.post(
      `${AUTH_API_PREFIX}/reset-password`,
      resetData
    );
    
    if (response.error) {
      return { response: undefined, error: { code: 400, message: "Something is wrong." } };
    }
    
    return { response: response.response, error: undefined };
  } catch (error) {
    return { response: undefined, error: { code: 500, message: "Failed to reset password" } };
  }
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  sendEmailCode,
  verifyEmailCode,
  verifyToken,
  sendForgotPasswordCode,
  verifyForgotPasswordCode,
  resetPassword,
};

export default authService;