// apps/frontend/src/theme/foundations/typography.ts
/**
 * Typography system for dating app
 * Optimized for readability and emotional connection
 */

export const typography = {
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
  },

  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem',    // 128px
  },

  fontWeights: {
    thin: 100,
    extraLight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
  },

  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  textStyles: {
    hero: {
      fontSize: ['2xl', '3xl', '4xl'],
      fontWeight: 'black',
      lineHeight: 'tight',
      letterSpacing: 'tighter',
    },
    
    h1: {
      fontSize: ['xl', '2xl', '3xl'],
      fontWeight: 'bold',
      lineHeight: 'tight',
    },
    
    h2: {
      fontSize: ['lg', 'xl', '2xl'],
      fontWeight: 'bold',
      lineHeight: 'tight',
    },
    
    h3: {
      fontSize: ['md', 'lg', 'xl'],
      fontWeight: 'semiBold',
      lineHeight: 'snug',
    },
    
    body: {
      fontSize: 'md',
      fontWeight: 'normal',
      lineHeight: 'normal',
    },
    
    profileName: {
      fontSize: ['lg', 'xl'],
      fontWeight: 'bold',
      lineHeight: 'tight',
    },
    
    profileBio: {
      fontSize: 'md',
      lineHeight: 'relaxed',
    },
    
    buttonText: {
      fontSize: 'md',
      fontWeight: 'semiBold',
      letterSpacing: 'wide',
    },
    
    caption: {
      fontSize: 'xs',
      fontWeight: 'medium',
      textTransform: 'uppercase',
      letterSpacing: 'wider',
    },
  },
};