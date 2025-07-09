// apps/frontend/src/theme/components/Card.ts
/**
 * Card Component Theme for Dating App
 * Specialized for profile cards, match cards, and content cards
 * Optimized for swipe gestures and visual hierarchy
 */

import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys);

// Base styles for all card parts
const baseStyle = definePartsStyle({
  container: {
    backgroundColor: 'white',
    borderRadius: 'xl',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    
    _hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    },
  },
  header: {
    padding: '1.5rem 1.5rem 0',
  },
  body: {
    padding: '1.5rem',
    flex: '1',
  },
  footer: {
    padding: '0 1.5rem 1.5rem',
  },
});

// Size variations
const sizes = {
  sm: definePartsStyle({
    container: {
      borderRadius: 'lg',
    },
    header: {
      padding: '1rem 1rem 0',
    },
    body: {
      padding: '1rem',
    },
    footer: {
      padding: '0 1rem 1rem',
    },
  }),
  
  md: definePartsStyle({
    container: {
      borderRadius: 'xl',
    },
    header: {
      padding: '1.5rem 1.5rem 0',
    },
    body: {
      padding: '1.5rem',
    },
    footer: {
      padding: '0 1.5rem 1.5rem',
    },
  }),
  
  lg: definePartsStyle({
    container: {
      borderRadius: '2xl',
    },
    header: {
      padding: '2rem 2rem 0',
    },
    body: {
      padding: '2rem',
    },
    footer: {
      padding: '0 2rem 2rem',
    },
  }),
};

// Variant styles for different card types
const variants = {
  // Standard elevated card
  elevated: definePartsStyle({
    container: {
      bg: 'white',
      borderRadius: 'xl',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '1px solid',
      borderColor: 'gray.100',
      
      _hover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
      },
    },
  }),

  // Profile card for dating app
  profile: definePartsStyle({
    container: {
      bg: 'white',
      borderRadius: '2xl',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      border: 'none',
      overflow: 'hidden',
      position: 'relative',
      
      // Swipe gesture optimization
      touchAction: 'pan-y pinch-zoom',
      userSelect: 'none',
      
      _hover: {
        transform: 'scale(1.02)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.18)',
      },
      
      _active: {
        transform: 'scale(0.98)',
      },
    },
    body: {
      padding: '0',
      position: 'relative',
    },
  }),

  // Match card for connections
  match: definePartsStyle({
    container: {
      bg: 'linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)',
      borderRadius: 'xl',
      boxShadow: '0 4px 20px rgba(232, 93, 117, 0.15)',
      border: '2px solid',
      borderColor: 'brand.200',
      
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(232, 93, 117, 0.25)',
        borderColor: 'brand.300',
      },
    },
  }),

  // Message/chat card
  message: definePartsStyle({
    container: {
      bg: 'white',
      borderRadius: 'lg',
      boxShadow: 'sm',
      border: '1px solid',
      borderColor: 'gray.200',
      
      _hover: {
        bg: 'gray.50',
        borderColor: 'brand.200',
      },
      
      _active: {
        bg: 'brand.50',
      },
    },
  }),

  // Floating card with strong shadow
  floating: definePartsStyle({
    container: {
      bg: 'white',
      borderRadius: '2xl',
      boxShadow: '0 20px 64px rgba(0, 0, 0, 0.15)',
      border: 'none',
      
      _hover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 28px 80px rgba(0, 0, 0, 0.2)',
      },
    },
  }),

  // Subtle card with minimal styling
  subtle: definePartsStyle({
    container: {
      bg: 'gray.50',
      borderRadius: 'lg',
      boxShadow: 'none',
      border: '1px solid',
      borderColor: 'gray.200',
      
      _hover: {
        bg: 'white',
        boxShadow: 'sm',
      },
    },
  }),

  // Premium card with gradient
  premium: definePartsStyle({
    container: {
      bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      borderRadius: 'xl',
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
      border: 'none',
      color: 'white',
      
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 48px rgba(139, 92, 246, 0.4)',
      },
    },
    header: {
      color: 'white',
    },
    body: {
      color: 'white',
    },
    footer: {
      color: 'white',
    },
  }),

  // Success/like state card
  liked: definePartsStyle({
    container: {
      bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      borderRadius: 'xl',
      boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
      border: '2px solid',
      borderColor: 'swipe.like.200',
      
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(34, 197, 94, 0.25)',
      },
    },
  }),

  // Error/nope state card  
  passed: definePartsStyle({
    container: {
      bg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      borderRadius: 'xl',
      boxShadow: '0 4px 20px rgba(239, 68, 68, 0.15)',
      border: '2px solid',
      borderColor: 'swipe.nope.200',
      opacity: 0.7,
      
      _hover: {
        opacity: 0.8,
      },
    },
  }),

  // Interactive card (for lists, feeds)
  interactive: definePartsStyle({
    container: {
      bg: 'white',
      borderRadius: 'lg',
      boxShadow: 'sm',
      border: '1px solid',
      borderColor: 'gray.200',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      
      _hover: {
        transform: 'translateY(-1px)',
        boxShadow: 'md',
        borderColor: 'brand.300',
      },
      
      _active: {
        transform: 'scale(0.98)',
      },
      
      _focus: {
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(232, 93, 117, 0.3)',
      },
    },
  }),

  // Minimal card with border
  outline: definePartsStyle({
    container: {
      bg: 'transparent',
      borderRadius: 'lg',
      boxShadow: 'none',
      border: '2px solid',
      borderColor: 'gray.200',
      
      _hover: {
        borderColor: 'brand.300',
        bg: 'brand.50',
      },
    },
  }),

  // Glass morphism effect
  glass: definePartsStyle({
    container: {
      bg: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 'xl',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      
      _hover: {
        bg: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-2px)',
      },
    },
  }),
};

// Default props
const defaultProps = {
  size: 'md',
  variant: 'elevated',
};

export const Card = defineMultiStyleConfig({
  baseStyle,
  sizes,
    variants,
  // @ts-ignore
  defaultProps,
});

export default Card;