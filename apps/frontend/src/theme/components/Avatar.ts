// apps/frontend/src/theme/components/Avatar.ts
/**
 * Avatar Component Theme for Dating App
 * Optimized for profile pictures with status indicators
 */

import { avatarAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(avatarAnatomy.keys);

// Base styles
const baseStyle = definePartsStyle({
  container: {
    bg: 'gray.100',
    color: 'gray.600',
    borderColor: 'white',
    verticalAlign: 'top',
    position: 'relative',
    overflow: 'hidden',
  },
  excessLabel: {
    bg: 'gray.200',
    color: 'gray.700',
    borderColor: 'white',
  },
  badge: {
    transform: 'translate(25%, 25%)',
    borderRadius: 'full',
    border: '2px solid',
    borderColor: 'white',
  },
});

// Size variations
const sizes = {
  '2xs': definePartsStyle({
    container: {
      width: 4,
      height: 4,
      fontSize: 'calc(16px / 2.5)',
    },
    excessLabel: {
      width: 4,
      height: 4,
      fontSize: 'calc(16px / 2.5)',
    },
    badge: {
      width: 2,
      height: 2,
    },
  }),
  xs: definePartsStyle({
    container: {
      width: 6,
      height: 6,
      fontSize: 'calc(24px / 2.5)',
    },
    excessLabel: {
      width: 6,
      height: 6,
      fontSize: 'calc(24px / 2.5)',
    },
    badge: {
      width: 2.5,
      height: 2.5,
    },
  }),
  sm: definePartsStyle({
    container: {
      width: 8,
      height: 8,
      fontSize: 'calc(32px / 2.5)',
    },
    excessLabel: {
      width: 8,
      height: 8,
      fontSize: 'calc(32px / 2.5)',
    },
    badge: {
      width: 3,
      height: 3,
    },
  }),
  md: definePartsStyle({
    container: {
      width: 12,
      height: 12,
      fontSize: 'calc(48px / 2.5)',
    },
    excessLabel: {
      width: 12,
      height: 12,
      fontSize: 'calc(48px / 2.5)',
    },
    badge: {
      width: 4,
      height: 4,
    },
  }),
  lg: definePartsStyle({
    container: {
      width: 16,
      height: 16,
      fontSize: 'calc(64px / 2.5)',
    },
    excessLabel: {
      width: 16,
      height: 16,
      fontSize: 'calc(64px / 2.5)',
    },
    badge: {
      width: 5,
      height: 5,
    },
  }),
  xl: definePartsStyle({
    container: {
      width: 24,
      height: 24,
      fontSize: 'calc(96px / 2.5)',
    },
    excessLabel: {
      width: 24,
      height: 24,
      fontSize: 'calc(96px / 2.5)',
    },
    badge: {
      width: 6,
      height: 6,
    },
  }),
  '2xl': definePartsStyle({
    container: {
      width: 32,
      height: 32,
      fontSize: 'calc(128px / 2.5)',
    },
    excessLabel: {
      width: 32,
      height: 32,
      fontSize: 'calc(128px / 2.5)',
    },
    badge: {
      width: 8,
      height: 8,
    },
  }),
  // Profile sizes for dating app
  profile: definePartsStyle({
    container: {
      width: 20,
      height: 20,
      fontSize: 'calc(80px / 2.5)',
    },
    excessLabel: {
      width: 20,
      height: 20,
      fontSize: 'calc(80px / 2.5)',
    },
    badge: {
      width: 6,
      height: 6,
    },
  }),
  hero: definePartsStyle({
    container: {
      width: 40,
      height: 40,
      fontSize: 'calc(160px / 2.5)',
    },
    excessLabel: {
      width: 40,
      height: 40,
      fontSize: 'calc(160px / 2.5)',
    },
    badge: {
      width: 10,
      height: 10,
    },
  }),
};

// Variant styles
const variants = {
  // Standard avatar
  standard: definePartsStyle({
    container: {
      bg: 'gray.100',
      color: 'gray.600',
    },
  }),

  // Profile avatar with brand styling
  profile: definePartsStyle({
    container: {
      bg: 'brand.50',
      color: 'brand.600',
      border: '3px solid',
      borderColor: 'brand.200',
      transition: 'all 0.2s ease-in-out',
      
      _hover: {
        borderColor: 'brand.300',
        transform: 'scale(1.05)',
      },
    },
  }),

  // Online status avatar
  online: definePartsStyle({
    container: {
      bg: 'gray.100',
      color: 'gray.600',
      position: 'relative',
      
      _after: {
        content: '""',
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '25%',
        height: '25%',
        bg: 'status.online',
        borderRadius: 'full',
        border: '2px solid white',
      },
    },
  }),

  // Verified user avatar
  verified: definePartsStyle({
    container: {
      bg: 'gray.100',
      color: 'gray.600',
      position: 'relative',
      
      _after: {
        content: '"✓"',
        position: 'absolute',
        bottom: '-2px',
        right: '-2px',
        width: '30%',
        height: '30%',
        bg: 'status.verified',
        color: 'white',
        borderRadius: 'full',
        border: '2px solid white',
        fontSize: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
      },
    },
  }),

  // Premium user avatar
  premium: definePartsStyle({
    container: {
      bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      color: 'white',
      border: '3px solid',
      borderColor: 'purple.200',
      position: 'relative',
      
      _after: {
        content: '"👑"',
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        fontSize: '30%',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
      },
    },
  }),

  // Match avatar with heart indicator
  match: definePartsStyle({
    container: {
      bg: 'gray.100',
      color: 'gray.600',
      border: '3px solid',
      borderColor: 'brand.300',
      position: 'relative',
      
      _after: {
        content: '"❤️"',
        position: 'absolute',
        bottom: '-5%',
        right: '-5%',
        fontSize: '25%',
        animation: 'heartBeat 1.5s ease-in-out infinite',
      },
    },
  }),

  // New user avatar
  newUser: definePartsStyle({
    container: {
      bg: 'gray.100',
      color: 'gray.600',
      position: 'relative',
      
      _after: {
        content: '"✨"',
        position: 'absolute',
        top: '-5%',
        right: '-5%',
        fontSize: '25%',
      },
    },
  }),

  // Away status avatar
  away: definePartsStyle({
    container: {
      bg: 'gray.100',
      color: 'gray.600',
      position: 'relative',
      
      _after: {
        content: '""',
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '25%',
        height: '25%',
        bg: 'status.away',
        borderRadius: 'full',
        border: '2px solid white',
      },
    },
  }),

  // Offline status avatar
  offline: definePartsStyle({
    container: {
      bg: 'gray.100',
      color: 'gray.600',
      opacity: 0.7,
      position: 'relative',
      
      _after: {
        content: '""',
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '25%',
        height: '25%',
        bg: 'status.offline',
        borderRadius: 'full',
        border: '2px solid white',
      },
    },
  }),

  // Floating avatar with shadow
  floating: definePartsStyle({
    container: {
      bg: 'gray.100',
      color: 'gray.600',
      boxShadow: 'lg',
      border: '3px solid white',
      
      _hover: {
        boxShadow: 'xl',
        transform: 'translateY(-2px)',
      },
    },
  }),

  // Minimal avatar
  minimal: definePartsStyle({
    container: {
      bg: 'transparent',
      color: 'gray.600',
      border: 'none',
    },
  }),

  // Story ring avatar (like Instagram)
  story: definePartsStyle({
    container: {
      bg: 'gray.100',
      color: 'gray.600',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #e85d75, #d14361, #8b5cf6)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'content-box, border-box',
      
      _hover: {
        transform: 'scale(1.05)',
      },
    },
  }),

  // Group avatar for multiple people
  group: definePartsStyle({
    container: {
      bg: 'brand.50',
      color: 'brand.600',
      border: '2px solid',
      borderColor: 'brand.200',
      position: 'relative',
      
      _before: {
        content: '"👥"',
        position: 'absolute',
        bottom: '-5%',
        right: '-5%',
        fontSize: '30%',
        bg: 'white',
        borderRadius: 'full',
        padding: '2px',
      },
    },
  }),
};

// Default props
const defaultProps = {
  size: 'md',
  variant: 'standard',
};

export const Avatar = defineMultiStyleConfig({
  baseStyle,
  sizes,
    variants,
  // @ts-ignore
  defaultProps,
});

export default Avatar;