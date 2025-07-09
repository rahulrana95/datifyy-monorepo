// apps/frontend/src/theme/components/Modal.ts
/**
 * Modal Component Theme for Dating App
 * Optimized for profile views, settings, and match celebrations
 */

import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

// Base styles
const baseStyle = definePartsStyle({
  overlay: {
    bg: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
  },
  dialogContainer: {
    display: 'flex',
    zIndex: 'modal',
    justifyContent: 'center',
    alignItems: 'center',
    p: 4,
  },
  dialog: {
    borderRadius: 'xl',
    bg: 'white',
    color: 'inherit',
    my: '16',
    mx: 4,
    zIndex: 'modal',
    maxH: 'calc(100vh - 7.5rem)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    position: 'relative',
  },
  header: {
    px: 6,
    py: 4,
    fontSize: 'xl',
    fontWeight: 'semibold',
    borderBottom: '1px solid',
    borderColor: 'gray.100',
  },
  closeButton: {
    position: 'absolute',
    top: 2,
    right: 3,
    borderRadius: 'full',
    _hover: {
      bg: 'gray.100',
    },
    _focus: {
      boxShadow: '0 0 0 3px rgba(232, 93, 117, 0.3)',
    },
  },
  body: {
    px: 6,
    py: 4,
    flex: '1',
    overflow: 'auto',
  },
  footer: {
    px: 6,
    py: 4,
    borderTop: '1px solid',
    borderColor: 'gray.100',
  },
});

// Size variations
const sizes = {
  xs: definePartsStyle({
    dialog: {
      maxW: 'xs',
    },
  }),
  sm: definePartsStyle({
    dialog: {
      maxW: 'sm',
    },
  }),
  md: definePartsStyle({
    dialog: {
      maxW: 'md',
    },
  }),
  lg: definePartsStyle({
    dialog: {
      maxW: 'lg',
    },
  }),
  xl: definePartsStyle({
    dialog: {
      maxW: 'xl',
    },
  }),
  '2xl': definePartsStyle({
    dialog: {
      maxW: '2xl',
    },
  }),
  '3xl': definePartsStyle({
    dialog: {
      maxW: '3xl',
    },
  }),
  '4xl': definePartsStyle({
    dialog: {
      maxW: '4xl',
    },
  }),
  '5xl': definePartsStyle({
    dialog: {
      maxW: '5xl',
    },
  }),
  '6xl': definePartsStyle({
    dialog: {
      maxW: '6xl',
    },
  }),
  full: definePartsStyle({
    dialog: {
      maxW: '100vw',
      minH: '100vh',
      my: 0,
      borderRadius: 0,
    },
  }),
  // Mobile-optimized full screen
  mobile: definePartsStyle({
    dialog: {
      maxW: '100vw',
      maxH: '100vh',
      m: 0,
      borderRadius: { base: 0, md: 'xl' },
    },
  }),
};

// Variant styles for different modal types
const variants = {
  // Standard modal
  standard: definePartsStyle({
    dialog: {
      bg: 'white',
      borderRadius: 'xl',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
  }),

  // Profile view modal
  profile: definePartsStyle({
    overlay: {
      bg: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
    },
    dialog: {
      bg: 'white',
      borderRadius: '2xl',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      maxH: '90vh',
      overflow: 'hidden',
    },
    header: {
      borderBottom: 'none',
      bg: 'linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)',
    },
    body: {
      p: 0,
    },
  }),

  // Match celebration modal
  celebration: definePartsStyle({
    overlay: {
      bg: 'linear-gradient(135deg, rgba(232, 93, 117, 0.9), rgba(209, 67, 97, 0.9))',
      backdropFilter: 'blur(10px)',
    },
    dialog: {
      bg: 'white',
      borderRadius: '2xl',
      boxShadow: '0 25px 50px -12px rgba(232, 93, 117, 0.5)',
      border: '2px solid',
      borderColor: 'brand.200',
      textAlign: 'center',
    },
    header: {
      bg: 'linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)',
      borderBottom: 'none',
      color: 'brand.700',
    },
    body: {
      bg: 'linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)',
    },
    footer: {
      bg: 'linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)',
      borderTop: 'none',
    },
  }),

  // Settings/form modal
  form: definePartsStyle({
    dialog: {
      bg: 'white',
      borderRadius: 'xl',
    },
    header: {
      bg: 'gray.50',
      borderColor: 'gray.200',
    },
    footer: {
      bg: 'gray.50',
      borderColor: 'gray.200',
    },
  }),

  // Premium feature modal
  premium: definePartsStyle({
    overlay: {
      bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(124, 58, 237, 0.8))',
      backdropFilter: 'blur(10px)',
    },
    dialog: {
      bg: 'white',
      borderRadius: '2xl',
      boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.5)',
      border: '2px solid',
      borderColor: 'purple.200',
    },
    header: {
      bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      color: 'white',
      borderBottom: 'none',
    },
    closeButton: {
      color: 'white',
      _hover: {
        bg: 'rgba(255, 255, 255, 0.1)',
      },
    },
  }),

  // Alert/confirmation modal
  alert: definePartsStyle({
    dialog: {
      bg: 'white',
      borderRadius: 'lg',
      boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.3)',
    },
    header: {
      color: 'error.600',
      borderColor: 'error.100',
      bg: 'error.50',
    },
    footer: {
      borderColor: 'error.100',
      bg: 'error.50',
    },
  }),

  // Success modal
  success: definePartsStyle({
    dialog: {
      bg: 'white',
      borderRadius: 'lg',
      boxShadow: '0 20px 40px -12px rgba(34, 197, 94, 0.3)',
      border: '1px solid',
      borderColor: 'success.200',
    },
    header: {
      color: 'success.700',
      borderColor: 'success.100',
      bg: 'success.50',
    },
    footer: {
      borderColor: 'success.100',
      bg: 'success.50',
    },
  }),

  // Glass morphism modal
  glass: definePartsStyle({
    overlay: {
      bg: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px)',
    },
    dialog: {
      bg: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 'xl',
      backdropFilter: 'blur(20px)',
      border: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    },
    header: {
      bg: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    footer: {
      bg: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
  }),

  // Bottom sheet style (mobile-first)
  bottomSheet: definePartsStyle({
    dialogContainer: {
      alignItems: 'flex-end',
    },
    dialog: {
      mb: 0,
      borderTopRadius: 'xl',
      borderBottomRadius: 0,
      maxH: '80vh',
      w: 'full',
      maxW: 'full',
    },
    header: {
      borderTopRadius: 'xl',
      position: 'relative',
      _before: {
        content: '""',
        position: 'absolute',
        top: 3,
        left: '50%',
        transform: 'translateX(-50%)',
        w: 12,
        h: 1,
        bg: 'gray.300',
        borderRadius: 'full',
      },
    },
  }),
};

// Default props
const defaultProps = {
  size: 'md',
  variant: 'standard',
};

export const Modal = defineMultiStyleConfig({
  baseStyle,
  sizes,
    variants,
  // @ts-ignore
  defaultProps,
});

export default Modal;