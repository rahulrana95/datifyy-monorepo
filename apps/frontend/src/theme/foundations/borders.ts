// apps/frontend/src/theme/foundations/borders.ts
/**
 * Border system for dating app
 * Optimized for modern, rounded interfaces
 */

export const borders = {
  // Border radius scale
  radii: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',   // Perfect circle
  },
  
  // Border widths
  borders: {
    none: '0',
    sm: '1px',
    base: '1px',
    md: '2px',
    lg: '4px',
    xl: '8px',
  },
};

export const shadows = {
  boxShadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    
    // Brand shadows
    brand: '0 4px 14px 0 rgba(232, 93, 117, 0.25)',
    brandLg: '0 10px 40px 0 rgba(232, 93, 117, 0.3)',
    
    // Feature shadows
    like: '0 4px 14px 0 rgba(34, 197, 94, 0.25)',
    nope: '0 4px 14px 0 rgba(239, 68, 68, 0.25)',
    superLike: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
    
    // Dark mode shadows
    darkLg: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px',
  },
};