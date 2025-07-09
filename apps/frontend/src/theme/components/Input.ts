// apps/frontend/src/theme/components/Input.ts
/**
 * Input Component Theme for Dating App
 * Optimized for forms, search, and chat inputs
 * Focus on accessibility and mobile-friendly interactions
 */

import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys);

// Base styles
const baseStyle = definePartsStyle({
  field: {
    width: '100%',
    minWidth: 0,
    outline: 0,
    position: 'relative',
    appearance: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    
    _focus: {
      zIndex: 1,
      borderColor: 'brand.500',
      boxShadow: '0 0 0 1px rgba(232, 93, 117, 0.6)',
    },
    
    _invalid: {
      borderColor: 'error.500',
      boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.6)',
    },
    
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      bg: 'gray.100',
    },
    
    _placeholder: {
      color: 'gray.400',
    },
  },
  
  addon: {
    border: '2px solid',
    borderColor: 'inherit',
    bg: 'gray.50',
  },
  
  element: {
    border: '2px solid',
    borderColor: 'inherit',
  },
});

// Size variations
const sizes = {
  xs: definePartsStyle({
    field: {
      borderRadius: 'md',
      fontSize: 'xs',
      px: 2,
      py: 1,
      h: 8,
    },
    addon: {
      borderRadius: 'md',
      fontSize: 'xs',
      px: 2,
      h: 8,
    },
    element: {
      borderRadius: 'md',
      fontSize: 'xs',
      w: 8,
      h: 8,
    },
  }),
  
  sm: definePartsStyle({
    field: {
      borderRadius: 'md',
      fontSize: 'sm',
      px: 3,
      py: 2,
      h: 9,
    },
    addon: {
      borderRadius: 'md',
      fontSize: 'sm',
      px: 3,
      h: 9,
    },
    element: {
      borderRadius: 'md',
      fontSize: 'sm',
      w: 9,
      h: 9,
    },
  }),
  
  md: definePartsStyle({
    field: {
      borderRadius: 'lg',
      fontSize: 'md',
      px: 4,
      py: 3,
      h: 12, // 48px - comfortable touch target
    },
    addon: {
      borderRadius: 'lg',
      fontSize: 'md',
      px: 4,
      h: 12,
    },
    element: {
      borderRadius: 'lg',
      fontSize: 'md',
      w: 12,
      h: 12,
    },
  }),
  
  lg: definePartsStyle({
    field: {
      borderRadius: 'xl',
      fontSize: 'lg',
      px: 5,
      py: 4,
      h: 14, // 56px - large touch target
    },
    addon: {
      borderRadius: 'xl',
      fontSize: 'lg',
      px: 5,
      h: 14,
    },
    element: {
      borderRadius: 'xl',
      fontSize: 'lg',
      w: 14,
      h: 14,
    },
  }),
};

// Variant styles
const variants = {
  // Standard outline input
  outline: definePartsStyle({
    field: {
      border: '2px solid',
      borderColor: 'gray.200',
      bg: 'white',
      
      _hover: {
        borderColor: 'gray.300',
      },
      
      _focus: {
        borderColor: 'brand.500',
        boxShadow: '0 0 0 1px rgba(232, 93, 117, 0.6)',
        bg: 'white',
      },
      
      _invalid: {
        borderColor: 'error.500',
        _focus: {
          borderColor: 'error.500',
          boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.6)',
        },
      },
    },
    addon: {
      borderColor: 'gray.200',
      bg: 'gray.50',
    },
  }),

  // Filled input variant
  filled: definePartsStyle({
    field: {
      border: '2px solid transparent',
      bg: 'gray.100',
      
      _hover: {
        bg: 'gray.200',
      },
      
      _focus: {
        bg: 'white',
        borderColor: 'brand.500',
        boxShadow: '0 0 0 1px rgba(232, 93, 117, 0.6)',
      },
      
      _invalid: {
        borderColor: 'error.500',
        _focus: {
          borderColor: 'error.500',
          boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.6)',
        },
      },
    },
    addon: {
      border: '2px solid transparent',
      bg: 'gray.100',
    },
  }),

  // Flushed input (borderless with bottom border)
  flushed: definePartsStyle({
    field: {
      borderRadius: 0,
      px: 0,
      bg: 'transparent',
      borderLeft: 0,
      borderRight: 0,
      borderTop: 0,
      borderBottom: '2px solid',
      borderColor: 'gray.200',
      
      _focus: {
        borderColor: 'brand.500',
        boxShadow: '0 1px 0 0 rgba(232, 93, 117, 0.6)',
      },
      
      _invalid: {
        borderColor: 'error.500',
        _focus: {
          borderColor: 'error.500',
          boxShadow: '0 1px 0 0 rgba(239, 68, 68, 0.6)',
        },
      },
    },
    addon: {
      borderRadius: 0,
      px: 0,
      bg: 'transparent',
      borderLeft: 0,
      borderRight: 0,
      borderTop: 0,
      borderBottom: '2px solid',
      borderColor: 'gray.200',
    },
  }),

  // Unstyled input
  unstyled: definePartsStyle({
    field: {
      bg: 'transparent',
      px: 0,
      height: 'auto',
      border: 'none',
      borderRadius: 0,
    },
    addon: {
      bg: 'transparent',
      px: 0,
      height: 'auto',
      border: 'none',
      borderRadius: 0,
    },
  }),

  // Chat input variant
  chat: definePartsStyle({
    field: {
      border: '1px solid',
      borderColor: 'gray.200',
      bg: 'white',
      borderRadius: 'full',
      px: 4,
      py: 2,
      
      _hover: {
        borderColor: 'gray.300',
      },
      
      _focus: {
        borderColor: 'brand.500',
        boxShadow: '0 0 0 2px rgba(232, 93, 117, 0.2)',
      },
      
      _placeholder: {
        color: 'gray.500',
      },
    },
  }),

  // Search input variant
  search: definePartsStyle({
    field: {
      border: '2px solid',
      borderColor: 'gray.200',
      bg: 'gray.50',
      borderRadius: 'full',
      pl: 12, // Space for search icon
      pr: 4,
      
      _hover: {
        bg: 'white',
        borderColor: 'gray.300',
      },
      
      _focus: {
        bg: 'white',
        borderColor: 'brand.500',
        boxShadow: '0 0 0 1px rgba(232, 93, 117, 0.6)',
      },
      
      _placeholder: {
        color: 'gray.400',
      },
    },
  }),

  // Premium input with gradient border
  premium: definePartsStyle({
    field: {
      border: '2px solid transparent',
      bg: 'white',
      backgroundClip: 'padding-box',
      _before: {
        content: '""',
        position: 'absolute',
        inset: 0,
        padding: '2px',
        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        borderRadius: 'inherit',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
      },
      
      _focus: {
        _before: {
          background: 'linear-gradient(135deg, #e85d75, #d14361)',
        },
        boxShadow: '0 0 0 3px rgba(232, 93, 117, 0.3)',
      },
    },
  }),

  // Floating label variant
  floating: definePartsStyle({
    field: {
      border: '2px solid',
      borderColor: 'gray.200',
      bg: 'white',
      pt: 6,
      pb: 2,
      
      _focus: {
        borderColor: 'brand.500',
        boxShadow: '0 0 0 1px rgba(232, 93, 117, 0.6)',
      },
      
      _placeholder: {
        opacity: 0,
      },
      
      '&:not(:placeholder-shown) + label, &:focus + label': {
        transform: 'translateY(-1.5rem) scale(0.85)',
        color: 'brand.500',
      },
    },
  }),

  // Success state
  success: definePartsStyle({
    field: {
      border: '2px solid',
      borderColor: 'success.500',
      bg: 'white',
      
      _focus: {
        borderColor: 'success.500',
        boxShadow: '0 0 0 1px rgba(34, 197, 94, 0.6)',
      },
    },
  }),

  // Error state
  error: definePartsStyle({
    field: {
      border: '2px solid',
      borderColor: 'error.500',
      bg: 'white',
      
      _focus: {
        borderColor: 'error.500',
        boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.6)',
      },
    },
  }),
};

// Default props
const defaultProps = {
  size: 'md',
  variant: 'outline',
};

export const Input = defineMultiStyleConfig({
  baseStyle,
  sizes,
    variants,
  // @ts-ignore
  defaultProps,
});

export default Input;