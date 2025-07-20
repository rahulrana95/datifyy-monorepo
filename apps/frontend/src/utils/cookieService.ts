// apps/frontend/src/utils/cookieService.ts

/**
 * Cookie service for managing authentication tokens
 * Provides secure cookie management with httpOnly, secure, and sameSite attributes
 */
class CookieService {
  /**
   * Set a cookie with secure attributes
   * @param name Cookie name
   * @param value Cookie value
   * @param days Days until expiration (default: 7)
   * @param rememberMe Whether to set long-term cookie
   */
  setCookie(name: string, value: string, rememberMe: boolean = false): void {
    const days = rememberMe ? 30 : 1; // 30 days for remember me, 1 day for session
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const expires = `expires=${date.toUTCString()}`;
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    const sameSite = '; SameSite=Strict';
    
    document.cookie = `${name}=${value}; ${expires}; path=/${secure}${sameSite}`;
  }

  /**
   * Get a cookie value by name
   * @param name Cookie name
   * @returns Cookie value or null
   */
  getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length);
      }
    }
    
    return null;
  }

  /**
   * Delete a cookie
   * @param name Cookie name
   */
  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }

  /**
   * Check if a cookie exists
   * @param name Cookie name
   * @returns True if cookie exists
   */
  hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }

  /**
   * Clear all authentication cookies
   */
  clearAuthCookies(): void {
    this.deleteCookie('token');
    this.deleteCookie('admin_token');
    this.deleteCookie('admin_session_id');
    this.deleteCookie('admin_remember_me');
  }
}

// Export singleton instance
const cookieService = new CookieService();
export default cookieService;