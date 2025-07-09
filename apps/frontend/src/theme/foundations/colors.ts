// apps/frontend/src/theme/foundations/colors.ts
/**
 * Dating App Color System for Chakra UI
 * Inspired by Tinder, Bumble, Hinge design systems
 * Optimized for love, connection, and premium feel
 */

export const colors = {
  // Enhanced Brand Colors (from your logo)
  brand: {
    50: '#fef7f7',   // Ultra light - backgrounds, hover states
    100: '#fce8e8',  // Very light - subtle backgrounds  
    200: '#f8d5d5',  // Light - disabled states, borders
    300: '#f2b3b3',  // Medium-light - secondary elements
    400: '#ea8a8a',  // Medium - secondary buttons
    500: '#e85d75',  // Main brand pink - primary actions ❤️
    600: '#d14361',  // Darker - hover states
    700: '#b8344d',  // Dark - pressed states
    800: '#9c2a40',  // Very dark - text on light
    900: '#842439',  // Darkest - high contrast text
  },

  // Dating App Action Colors
  swipe: {
    // Like/Yes actions (Green - universal positive)
    like: {
      50: '#f0fdf4',
      100: '#dcfce7', 
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',  // Main like green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },

    // Pass/Nope actions (Red/Orange - rejection)
    nope: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca', 
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',  // Main nope red
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },

    // Super Like actions (Blue - special)
    superLike: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd', 
      400: '#60a5fa',
      500: '#3b82f6',  // Main super like blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // Boost/Premium features (Gold/Orange)
    boost: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',  // Main boost gold
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
  },

  // Status & Feedback Colors
  status: {
    online: '#22c55e',     // Green dot
    away: '#f59e0b',       // Yellow/orange
    offline: '#6b7280',    // Gray
    busy: '#ef4444',       // Red
    
    verified: '#3b82f6',   // Blue checkmark
    premium: '#8b5cf6',    // Purple crown
    newUser: '#10b981',    // Emerald for new users
    
    // Message status
    sent: '#9ca3af',       // Gray
    delivered: '#6b7280',  // Darker gray  
    read: '#3b82f6',       // Blue
    typing: '#22c55e',     // Green
  },

  // Enhanced Grays with warm undertones
  gray: {
    50: '#fafafa',   // Almost white with warm tint
    100: '#f5f5f5',  // Very light warm gray
    200: '#eeeeee',  // Light gray - perfect for borders
    300: '#e0e0e0',  // Medium-light - dividers
    400: '#bdbdbd',  // Medium - placeholder text
    500: '#9e9e9e',  // True middle gray
    600: '#757575',  // Dark - secondary text
    700: '#616161',  // Darker - body text  
    800: '#424242',  // Very dark - headings
    900: '#212121',  // Almost black - primary text
  },

  // Semantic Alert Colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },

  error: {
    50: '#fef2f2', 
    500: '#ef4444',
    600: '#dc2626',
  },

  warning: {
    50: '#fffbeb',
    500: '#f59e0b', 
    600: '#d97706',
  },

  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
  },

  // Feature-specific colors
  features: {
    // Video call feature
    video: {
      bg: '#10b981',
      hover: '#059669',
      icon: '#ffffff',
    },

    // Voice message
    voice: {
      bg: '#8b5cf6',
      hover: '#7c3aed', 
      icon: '#ffffff',
    },

    // Photo sharing
    photo: {
      bg: '#f59e0b',
      hover: '#d97706',
      icon: '#ffffff', 
    },

    // Location sharing
    location: {
      bg: '#ef4444',
      hover: '#dc2626',
      icon: '#ffffff',
    },

    // Heart animations
    heart: '#e85d75',
    heartGlow: 'rgba(232, 93, 117, 0.3)',
  },

  // Background variants
  bg: {
    // Light mode backgrounds
    primary: '#ffffff',
    secondary: '#fafafa', 
    tertiary: '#f5f5f5',
    surface: '#ffffff',
    
    // Brand backgrounds
    brandSubtle: '#fef7f7',
    brandGradient: 'linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)',
    
    // Special backgrounds
    success: '#f0fdf4',
    error: '#fef2f2',
    warning: '#fffbeb',
    info: '#eff6ff',
  },

  // Text color variants
  text: {
    primary: '#212121',
    secondary: '#616161', 
    tertiary: '#9e9e9e',
    inverse: '#ffffff',
    brand: '#e85d75',
    muted: '#757575',
  },

  // Border colors
  border: {
    light: '#f5f5f5',
    medium: '#eeeeee',
    dark: '#e0e0e0', 
    brand: '#f8d5d5',
    focus: '#e85d75',
  },
};

// Type exports for TypeScript
export type ColorKeys = keyof typeof colors;
export type BrandColorKeys = keyof typeof colors.brand;
export type SwipeColorKeys = keyof typeof colors.swipe;