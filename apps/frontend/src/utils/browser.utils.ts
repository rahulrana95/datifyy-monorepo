// apps/frontend/src/utils/browser.utils.ts

import { 
  BROWSERS, 
  OPERATING_SYSTEMS, 
  DeviceType,
  DEVICE_PATTERNS,
  BROWSER_PATTERNS,
  OS_PATTERNS 
} from '../constants';

/**
 * Device information interface
 */
export interface DeviceInfo {
  userAgent: string;
  ipAddress: string;
  deviceType: DeviceType;
  browser?: string;
  os?: string;
}

/**
 * Detect device type from user agent
 */
export const detectDeviceType = (userAgent: string): DeviceType => {
  if (DEVICE_PATTERNS.TABLET.test(userAgent)) return DeviceType.TABLET;
  if (DEVICE_PATTERNS.MOBILE.test(userAgent)) return DeviceType.MOBILE;
  return DeviceType.DESKTOP;
};

/**
 * Detect browser from user agent
 */
export const detectBrowser = (userAgent: string): string => {
  if (BROWSER_PATTERNS.CHROME.test(userAgent)) return BROWSERS.CHROME;
  if (BROWSER_PATTERNS.FIREFOX.test(userAgent)) return BROWSERS.FIREFOX;
  if (BROWSER_PATTERNS.SAFARI.test(userAgent)) return BROWSERS.SAFARI;
  if (BROWSER_PATTERNS.EDGE.test(userAgent)) return BROWSERS.EDGE;
  if (BROWSER_PATTERNS.OPERA.test(userAgent)) return BROWSERS.OPERA;
  if (BROWSER_PATTERNS.IE.test(userAgent)) return BROWSERS.IE;
  return BROWSERS.UNKNOWN;
};

/**
 * Detect operating system from user agent
 */
export const detectOS = (userAgent: string): string => {
  if (OS_PATTERNS.WINDOWS.test(userAgent)) return OPERATING_SYSTEMS.WINDOWS;
  if (OS_PATTERNS.MAC.test(userAgent)) return OPERATING_SYSTEMS.MAC;
  if (OS_PATTERNS.LINUX.test(userAgent)) return OPERATING_SYSTEMS.LINUX;
  if (OS_PATTERNS.ANDROID.test(userAgent)) return OPERATING_SYSTEMS.ANDROID;
  if (OS_PATTERNS.IOS.test(userAgent)) return OPERATING_SYSTEMS.IOS;
  return OPERATING_SYSTEMS.UNKNOWN;
};

/**
 * Get current device information
 */
export const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent;
  
  return {
    userAgent,
    ipAddress: '', // Will be filled by backend
    deviceType: detectDeviceType(userAgent),
    browser: detectBrowser(userAgent),
    os: detectOS(userAgent)
  };
};

/**
 * Check if browser supports a feature
 */
export const isBrowserSupported = (feature: string): boolean => {
  return feature in window;
};

/**
 * Check if running on mobile device
 */
export const isMobileDevice = (): boolean => {
  return detectDeviceType(navigator.userAgent) === DeviceType.MOBILE;
};

/**
 * Check if running on tablet
 */
export const isTabletDevice = (): boolean => {
  return detectDeviceType(navigator.userAgent) === DeviceType.TABLET;
};

/**
 * Check if running on desktop
 */
export const isDesktopDevice = (): boolean => {
  return detectDeviceType(navigator.userAgent) === DeviceType.DESKTOP;
};

/**
 * Get viewport dimensions
 */
export const getViewportDimensions = () => {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  };
};

/**
 * Check if device has touch support
 */
export const hasTouchSupport = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};