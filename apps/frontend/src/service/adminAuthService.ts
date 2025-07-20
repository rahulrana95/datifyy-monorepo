// apps/frontend/src/service/adminAuthService.ts
import apiService from "./apiService";
import { ServiceResponse } from "./ErrorTypes";
import cookieService from "../utils/cookieService";
import { 
    ADMIN_AUTH_ENDPOINTS, 
    AUTH_STORAGE_KEYS, 
    ERROR_MESSAGES,
    DeviceType,
    EXPIRY_DAYS
} from '../constants';
import { getDeviceInfo } from '../utils/browser.utils';

const ADMIN_API_PREFIX = ADMIN_AUTH_ENDPOINTS.PREFIX;

/**
 * Device information interface for admin login tracking
 */
interface DeviceInfo {
  userAgent: string;
  ipAddress: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
}

/**
 * Admin login request interface
 */
interface AdminLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceInfo?: DeviceInfo;
}

/**
 * Admin profile response interface
 */
interface AdminProfile {
  id: number;
  email: string;
  permissionLevel: string;
  accountStatus: string;
  isActive: boolean;
  twoFactorMethods: string[];
  lastLoginAt: string;
  lastActiveAt: string;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin login response interface
 */
interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    expiresIn: number;
    admin: AdminProfile;
    sessionId: string;
    requires2FA: boolean;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    processingTime: number;
  };
}

/**
 * Admin Authentication Service
 * Handles admin authentication operations with proper error handling
 */
class AdminAuthService {
  
  /**
   * Admin login with email and password
   * 
   * @param {string} email - Admin email address
   * @param {string} password - Admin password
   * @param {boolean} rememberMe - Whether to remember the session
   * @returns {Promise<ServiceResponse<AdminLoginResponse>>} Login response
   * 
   * @example
   * const result = await adminAuthService.login('admin@datifyy.com', 'password', true);
   * if (result.response) {
   *   console.log('Login successful:', result.response.data.admin);
   * } else {
   *   console.error('Login failed:', result.error);
   * }
   */
  async login(
    email: string, 
    password: string,
    rememberMe: boolean = false
  ): Promise<ServiceResponse<AdminLoginResponse>> {
    try {
      console.log('🔐 Admin login attempt...', { email, rememberMe });
      
      const deviceInfo = getDeviceInfo();
      
      const loginData: AdminLoginRequest = {
        email: email.toLowerCase().trim(),
        password,
        rememberMe,
        deviceInfo
      };

      const response = await apiService.post<AdminLoginResponse>(
        ADMIN_AUTH_ENDPOINTS.LOGIN, 
        loginData
      );

      if (response.error) {
        console.error('❌ Admin login failed:', response.error);
        return { response: undefined, error: response.error };
      }

      if (!response.response?.success || !response.response?.data?.accessToken) {
        console.error('❌ Invalid admin login response');
        return { 
          response: undefined, 
          error: { code: 401, message: ERROR_MESSAGES.INVALID_RESPONSE } 
        };
      }

      // Store tokens securely
      await this.setAdminTokens(
        response.response.data.accessToken,
        response.response.data.sessionId,
        rememberMe
      );

      console.log('✅ Admin login successful', {
        adminId: response.response.data.admin.id,
        email: response.response.data.admin.email,
        permissionLevel: response.response.data.admin.permissionLevel
      });

      return { response: response.response, error: undefined };
      
    } catch (error: any) {
      console.error('❌ Admin login error:', error);
      return { 
        response: undefined, 
        error: { code: 500, message: ERROR_MESSAGES.SERVER_ERROR } 
      };
    }
  }

  /**
   * Check if admin is currently authenticated
   * 
   * @returns {boolean} Authentication status
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  /**
   * Get current admin from stored data
   * 
   * @returns {AdminProfile | null} Admin profile or null
   */
  getCurrentAdmin(): AdminProfile | null {
    const adminData = localStorage.getItem('admin_profile') || sessionStorage.getItem('admin_profile');
    if (!adminData) return null;
    
    try {
      return JSON.parse(adminData);
    } catch {
      return null;
    }
  }

  /**
   * Logout admin user and clear tokens
   */
  async logout(): Promise<void> {
    try {
      console.log('🚪 Admin logout...');
      
      // Clear all admin tokens and data
      await this.clearAdminTokens();
      
      console.log('✅ Admin logout successful');
      
    } catch (error: any) {
      console.error('❌ Admin logout error:', error);
      // Clear tokens even if there's an error
      await this.clearAdminTokens();
    }
  }

  // ===== PRIVATE TOKEN MANAGEMENT METHODS =====

  /**
   * Store admin tokens and profile securely in cookies
   * 
   * @param {string} accessToken - JWT access token
   * @param {string} sessionId - Session ID
   * @param {boolean} rememberMe - Whether to persist tokens
   * @private
   */
  private async setAdminTokens(
    accessToken: string, 
    sessionId: string, 
    rememberMe: boolean
  ): Promise<void> {
    // Store tokens in secure cookies
    cookieService.setCookie(AUTH_STORAGE_KEYS.TOKEN, accessToken, rememberMe);
    cookieService.setCookie(AUTH_STORAGE_KEYS.ADMIN_SESSION_ID, sessionId, rememberMe);
    cookieService.setCookie(AUTH_STORAGE_KEYS.ADMIN_REMEMBER_ME, rememberMe.toString(), rememberMe);
    
    // Set token in API service for immediate use
    await apiService.setAuthToken(accessToken);
  }

  /**
   * Get admin access token from cookies
   * 
   * @returns {string | null} Access token or null
   * @private
   */
  private getAccessToken(): string | null {
    return cookieService.getCookie(AUTH_STORAGE_KEYS.TOKEN);
  }

  /**
   * Clear all admin tokens and data from cookies and storage
   * 
   * @private
   */
  private async clearAdminTokens(): Promise<void> {
    // Clear cookies
    cookieService.clearAuthCookies();
    
    // Clear from both storages to be safe (for backward compatibility)
    const items = [
      AUTH_STORAGE_KEYS.ADMIN_TOKEN,
      AUTH_STORAGE_KEYS.ADMIN_SESSION_ID, 
      AUTH_STORAGE_KEYS.ADMIN_REMEMBER_ME,
      AUTH_STORAGE_KEYS.ADMIN_PROFILE
    ];
    
    items.forEach(item => {
      localStorage.removeItem(item);
      sessionStorage.removeItem(item);
    });
    
    // Clear token from API service
    await apiService.clearToken();
  }

  // Device detection methods moved to browser.utils.ts
}

// Export singleton instance
const adminAuthService = new AdminAuthService();
export default adminAuthService;