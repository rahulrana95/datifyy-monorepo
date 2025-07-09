// apps/frontend/src/theme/components/Button.ts
/**
 * Button Component Theme for Dating App
 * Includes all dating-specific button variants
 * Optimized for touch interactions and emotional connections
 */

import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';

// Base button styles
const baseStyle = defineStyle({
  fontWeight: 'semibold',
  borderRadius: 'xl', // More rounded for modern feel
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  
  _focus: {
    boxShadow: '0 0 0 3px rgba(232, 93, 117, 0.3)',
    outline: 'none',
  },
  
  _disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none !important',
  },
  
  _active: {
    transform: 'scale(0.98)',
  },
});

// Size variations optimized for mobile touch
const sizes = {
  xs: defineStyle({
    fontSize: 'xs',
    px: 3,
    py: 2,
    minW: 'auto',
    minH: '32px', // Minimum touch target
  }),
  
  sm: defineStyle({
    fontSize: 'sm', 
    px: 4,
    py: 2.5,
    minW: 'auto',
    minH: '36px',
  }),
  
  md: defineStyle({
    fontSize: 'md',
    px: 6,
    py: 3,
    minW: 'auto', 
    minH: '44px', // Comfortable touch target
  }),
  
  lg: defineStyle({
    fontSize: 'lg',
    px: 8,
    py: 4,
    minW: 'auto',
    minH: '48px', // Large touch target
  }),
  
  xl: defineStyle({
    fontSize: 'xl',
    px: 10,
    py: 5,
    minW: 'auto',
    minH: '56px', // Extra large for primary actions
  }),
};

// Variant definitions
const variants = {
  // Primary brand button
  solid: defineStyle((props) => {
    const { colorScheme } = props;
    
    if (colorScheme === 'brand') {
      return {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(232, 93, 117, 0.25)',
        },
        _active: {
          bg: 'brand.700',
          transform: 'scale(0.98)',
        },
      };
    }
    
    return {
      bg: `${colorScheme}.500`,
      color: 'white',
      _hover: {
        bg: `${colorScheme}.600`,
        transform: 'translateY(-1px)',
        boxShadow: 'md',
      },
      _active: {
        bg: `${colorScheme}.700`,
        transform: 'scale(0.98)',
      },
    };
  }),

  // Outline button
  outline: defineStyle((props) => {
    const { colorScheme } = props;
    
    if (colorScheme === 'brand') {
      return {
        border: '2px solid',
        borderColor: 'brand.500',
        color: 'brand.500',
        bg: 'transparent',
        _hover: {
          bg: 'brand.50',
          borderColor: 'brand.600',
          color: 'brand.600',
          transform: 'translateY(-1px)',
        },
        _active: {
          bg: 'brand.100',
          transform: 'scale(0.98)',
        },
      };
    }
    
    return {
      border: '2px solid',
      borderColor: `${colorScheme}.500`,
      color: `${colorScheme}.500`,
      bg: 'transparent',
      _hover: {
        bg: `${colorScheme}.50`,
        borderColor: `${colorScheme}.600`,
        color: `${colorScheme}.600`,
        transform: 'translateY(-1px)',
      },
    };
  }),

  // Ghost button
  ghost: defineStyle((props) => {
    const { colorScheme } = props;
    
    return {
      color: colorScheme === 'brand' ? 'brand.500' : `${colorScheme}.500`,
      bg: 'transparent',
      _hover: {
        bg: colorScheme === 'brand' ? 'brand.50' : `${colorScheme}.50`,
        transform: 'translateY(-1px)',
      },
      _active: {
        bg: colorScheme === 'brand' ? 'brand.100' : `${colorScheme}.100`,
        transform: 'scale(0.98)',
      },
    };
  }),

  // Love button - Special gradient variant
  love: defineStyle({
    bg: 'linear-gradient(135deg, #e85d75 0%, #d14361 100%)',
    color: 'white',
    fontWeight: 'bold',
    _hover: {
      bg: 'linear-gradient(135deg, #d14361 0%, #b8344d 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(232, 93, 117, 0.4)',
    },
    _active: {
      transform: 'scale(0.95)',
    },
  }),

  // Dating app specific variants
  swipeLike: defineStyle({
    bg: 'swipe.like.500',
    color: 'white',
    borderRadius: 'full',
    aspectRatio: '1',
    minW: '56px',
    minH: '56px',
    p: 0,
    _hover: {
      bg: 'swipe.like.600',
      transform: 'scale(1.1)',
      boxShadow: '0 8px 25px rgba(34, 197, 94, 0.4)',
    },
    _active: {
      transform: 'scale(0.95)',
    },
  }),

  swipeNope: defineStyle({
    bg: 'swipe.nope.500',
    color: 'white', 
    borderRadius: 'full',
    aspectRatio: '1',
    minW: '56px',
    minH: '56px',
    p: 0,
    _hover: {
      bg: 'swipe.nope.600',
      transform: 'scale(1.1)',
      boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
    },
    _active: {
      transform: 'scale(0.95)',
    },
  }),

  swipeSuperLike: defineStyle({
    bg: 'swipe.superLike.500',
    color: 'white',
    borderRadius: 'full', 
    aspectRatio: '1',
    minW: '56px',
    minH: '56px',
    p: 0,
    _hover: {
      bg: 'swipe.superLike.600',
      transform: 'scale(1.1)',
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
    },
    _active: {
      transform: 'scale(0.95)',
    },
  }),

  boost: defineStyle({
    bg: 'swipe.boost.500',
    color: 'white',
    borderRadius: 'full',
    aspectRatio: '1', 
    minW: '56px',
    minH: '56px',
    p: 0,
    _hover: {
      bg: 'swipe.boost.600',
      transform: 'scale(1.1)',
      boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
    },
    _active: {
      transform: 'scale(0.95)',
    },
  }),

  // Floating Action Button
  fab: defineStyle({
    bg: 'brand.500',
    color: 'white',
    borderRadius: 'full',
    minW: '64px',
    minH: '64px',
    p: 0,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    _hover: {
      bg: 'brand.600',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(232, 93, 117, 0.4)',
    },
    _active: {
      transform: 'scale(0.95)',
    },
  }),

  // Subtle button for secondary actions
  subtle: defineStyle((props) => {
    const { colorScheme } = props;
    
    return {
      bg: colorScheme === 'brand' ? 'brand.50' : `${colorScheme}.50`,
      color: colorScheme === 'brand' ? 'brand.700' : `${colorScheme}.700`,
      _hover: {
        bg: colorScheme === 'brand' ? 'brand.100' : `${colorScheme}.100`,
        transform: 'translateY(-1px)',
      },
      _active: {
        bg: colorScheme === 'brand' ? 'brand.200' : `${colorScheme}.200`,
        transform: 'scale(0.98)',
      },
    };
  }),

  // Premium button with gradient and special effects
  premium: defineStyle({
    bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white',
    fontWeight: 'bold',
    position: 'relative',
    overflow: 'hidden',
    _before: {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      transition: 'left 0.5s',
    },
    _hover: {
      bg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
      _before: {
        left: '100%',
      },
    },
    _active: {
      transform: 'scale(0.95)',
    },
  }),
};

// Default props
const defaultProps: {
    size: "sm" | "md" | "lg" | "xl" | "xs" | undefined,
    variant: 'solid',
    colorScheme: 'brand'
} = {
  size: 'md',
  variant: 'solid',
  colorScheme: 'brand',
};

export const Button = defineStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps,
});

export default Button;