// apps/frontend/src/theme/foundations/shadows.ts
/**
 * Shadow System for Dating Apps
 * Creates depth and hierarchy for premium feel
 * Optimized for both light and dark modes
 */

export const shadows = {
  // Base shadow system
  boxShadows: {
    none: 'none',
    
    // Subtle shadows for cards and elements
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    
    // Dating app specific shadows
    brand: '0 4px 14px 0 rgba(232, 93, 117, 0.25)',
    brandLg: '0 10px 40px 0 rgba(232, 93, 117, 0.3)',
    brandXl: '0 20px 60px 0 rgba(232, 93, 117, 0.4)',
    
    // Swipe action shadows
    like: '0 4px 14px 0 rgba(34, 197, 94, 0.25)',
    nope: '0 4px 14px 0 rgba(239, 68, 68, 0.25)',
    superLike: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
    boost: '0 4px 14px 0 rgba(245, 158, 11, 0.25)',
    
    // Premium shadows with glow effects
    premium: '0 8px 32px 0 rgba(139, 92, 246, 0.3)',
    premiumHover: '0 12px 48px 0 rgba(139, 92, 246, 0.4)',
    
    // Card-specific shadows
    profileCard: '0 8px 32px rgba(0, 0, 0, 0.12)',
    profileCardHover: '0 12px 48px rgba(0, 0, 0, 0.18)',
    
    matchCard: '0 4px 20px rgba(232, 93, 117, 0.15)',
    matchCardHover: '0 8px 32px rgba(232, 93, 117, 0.25)',
    
    floatingCard: '0 20px 64px rgba(0, 0, 0, 0.15)',
    floatingCardHover: '0 28px 80px rgba(0, 0, 0, 0.2)',
    
    // Dark mode shadows
    darkXs: 'rgba(0, 0, 0, 0.2) 0px 1px 2px 0px',
    darkSm: 'rgba(0, 0, 0, 0.3) 0px 1px 3px 0px, rgba(0, 0, 0, 0.2) 0px 1px 2px 0px',
    darkMd: 'rgba(0, 0, 0, 0.4) 0px 4px 6px -1px, rgba(0, 0, 0, 0.3) 0px 2px 4px -1px',
    darkLg: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px',
    darkXl: 'rgba(0, 0, 0, 0.6) 0px 20px 25px -5px, rgba(0, 0, 0, 0.4) 0px 10px 10px -5px',
    
    // Focus shadows for accessibility
    outline: '0 0 0 3px rgba(232, 93, 117, 0.3)',
    outlineError: '0 0 0 3px rgba(239, 68, 68, 0.3)',
    outlineSuccess: '0 0 0 3px rgba(34, 197, 94, 0.3)',
    outlineWarning: '0 0 0 3px rgba(245, 158, 11, 0.3)',
    outlineInfo: '0 0 0 3px rgba(59, 130, 246, 0.3)',
  },
  
  // Text shadows for special effects
  textShadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
    base: '0 1px 3px rgba(0, 0, 0, 0.1)',
    lg: '0 2px 4px rgba(0, 0, 0, 0.1)',
    
    // Glow effects for premium text
    brandGlow: '0 0 10px rgba(232, 93, 117, 0.5)',
    premiumGlow: '0 0 10px rgba(139, 92, 246, 0.5)',
    goldGlow: '0 0 10px rgba(245, 158, 11, 0.5)',
  },
  
  // Drop shadows for images and media
  dropShadows: {
    sm: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
    base: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))',
    md: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
    lg: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
    xl: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15))',
    
    // Colored drop shadows
    brand: 'drop-shadow(0 4px 8px rgba(232, 93, 117, 0.2))',
    like: 'drop-shadow(0 4px 8px rgba(34, 197, 94, 0.2))',
    nope: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.2))',
  },
};