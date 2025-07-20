// apps/frontend/src/service/adminAuthService.ts
import apiService from "./apiService";
import { ServiceResponse } from "./ErrorTypes";

const ADMIN_API_PREFIX = "admin/auth";

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
      
      const deviceInfo = this.getDeviceInfo();
      
      const loginData: AdminLoginRequest = {
        email: email.toLowerCase().trim(),
        password,
        rememberMe,
        deviceInfo
      };

      const response = await apiService.post<AdminLoginResponse>(
        `${ADMIN_API_PREFIX}/login`, 
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
          error: { code: 401, message: "Invalid login response" } 
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
        error: { code: 500, message: "Login failed due to server error" } 
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
   * Store admin tokens and profile securely
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
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem('admin_access_token', accessToken);
    storage.setItem('admin_session_id', sessionId);
    storage.setItem('admin_remember_me', rememberMe.toString());
    
    // Set token in API service for immediate use
    await apiService.setAuthToken(accessToken);
  }

  /**
   * Get admin access token from storage
   * 
   * @returns {string | null} Access token or null
   * @private
   */
  private getAccessToken(): string | null {
    return localStorage.getItem('admin_access_token') || 
           sessionStorage.getItem('admin_access_token');
  }

  /**
   * Clear all admin tokens and data from storage
   * 
   * @private
   */
  private async clearAdminTokens(): Promise<void> {
    // Clear from both storages to be safe
    const items = [
      'admin_access_token',
      'admin_session_id', 
      'admin_remember_me',
      'admin_profile'
    ];
    
    items.forEach(item => {
      localStorage.removeItem(item);
      sessionStorage.removeItem(item);
    });
    
    // Clear token from API service
    await apiService.clearToken();
  }

  /**
   * Get current device information for security tracking
   * 
   * @returns {DeviceInfo} Device information object
   * @private
   */
  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    
    return {
      userAgent,
      ipAddress: '', // Will be filled by backend
      deviceType: this.detectDeviceType(userAgent),
      browser: this.detectBrowser(userAgent),
      os: this.detectOS(userAgent)
    };
  }

  /**
   * Detect device type from user agent
   * 
   * @param {string} userAgent - Browser user agent
   * @returns {'desktop' | 'mobile' | 'tablet'} Device type
   * @private
   */
  private detectDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
    if (/tablet|ipad/i.test(userAgent)) return 'tablet';
    if (/mobile|android|iphone/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  /**
   * Detect browser from user agent
   * 
   * @param {string} userAgent - Browser user agent
   * @returns {string} Browser name
   * @private
   */
  private detectBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  /**
   * Detect operating system from user agent
   * 
   * @param {string} userAgent - Browser user agent
   * @returns {string} Operating system name
   * @private
   */
  private detectOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }
}

// Export singleton instance
const adminAuthService = new AdminAuthService();
export default adminAuthService;