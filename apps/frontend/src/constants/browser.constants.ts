// apps/frontend/src/constants/browser.constants.ts

/**
 * Browser detection constants
 */

// Browser names
export const BROWSERS = {
  CHROME: 'Chrome',
  FIREFOX: 'Firefox',
  SAFARI: 'Safari',
  EDGE: 'Edge',
  OPERA: 'Opera',
  IE: 'Internet Explorer',
  UNKNOWN: 'Unknown',
} as const;

// Operating systems
export const OPERATING_SYSTEMS = {
  WINDOWS: 'Windows',
  MAC: 'macOS',
  LINUX: 'Linux',
  ANDROID: 'Android',
  IOS: 'iOS',
  UNKNOWN: 'Unknown',
} as const;

// Device detection patterns
export const DEVICE_PATTERNS = {
  TABLET: /tablet|ipad/i,
  MOBILE: /mobile|android|iphone/i,
  IOS: /iPad|iPhone|iPod/i,
  ANDROID: /Android/i,
} as const;

// Browser detection patterns
export const BROWSER_PATTERNS = {
  CHROME: /Chrome/i,
  FIREFOX: /Firefox/i,
  SAFARI: /Safari/i,
  EDGE: /Edge/i,
  OPERA: /Opera|OPR/i,
  IE: /MSIE|Trident/i,
} as const;

// OS detection patterns
export const OS_PATTERNS = {
  WINDOWS: /Windows/i,
  MAC: /Mac/i,
  LINUX: /Linux/i,
  ANDROID: /Android/i,
  IOS: /iPad|iPhone|iPod/i,
} as const;