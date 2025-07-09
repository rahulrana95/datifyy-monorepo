// apps/frontend/src/theme/index.ts
/**
 * Main Chakra UI Theme for Datifyy Dating App
 * Combines all foundations and component themes
 * Optimized for modern dating app experience
 */

import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// Foundations
import { colors } from './foundations/colors';
import { typography } from './foundations/typography';
import { spacing } from './foundations/spacing';
import { shadows } from './foundations/shadows';
import { borders } from './foundations/borders';

// Component themes
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Input } from './components/Input';
import { Modal } from './components/Modal';
import { Avatar } from './components/Avatar';

// Global styles
import { globalStyles } from './styles/global';

// Theme configuration
const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: false,
    disableTransitionOnChange: false,
};

// Breakpoints for responsive design
const breakpoints = {
    base: '0em',    // 0px
    sm: '30em',     // ~480px
    md: '48em',     // ~768px
    lg: '62em',     // ~992px
    xl: '80em',     // ~1280px
    '2xl': '96em',  // ~1536px
};

// Create the theme
const theme = extendTheme({
    config,

    // Design tokens
    colors,
    fonts: typography.fonts,
    fontSizes: typography.fontSizes,
    fontWeights: typography.fontWeights,
    lineHeights: typography.lineHeights,
    letterSpacings: typography.letterSpacings,
    space: spacing.space,
    sizes: spacing.space, // Chakra uses same scale for sizes
    radii: borders.radii,
    borders: borders.borders,
    shadows: shadows.boxShadows,
    breakpoints,

    // Text styles
    textStyles: typography.textStyles,

    // Global styles
    styles: {
        global: (props: any) => ({
            // Base body styles
            body: {
                bg: mode('white', 'gray.900')(props),
                color: mode('gray.800', 'gray.100')(props),
                lineHeight: 'normal',
                fontFamily: 'body',

                // Optimize for mobile
                '-webkit-font-smoothing': 'antialiased',
                '-moz-osx-font-smoothing': 'grayscale',

                // Prevent horizontal scroll on mobile
                overflowX: 'hidden',
            },

            // Optimize text rendering
            '*': {
                '-webkit-font-smoothing': 'antialiased',
                '-moz-osx-font-smoothing': 'grayscale',
            },

            // Placeholder styles
            '*::placeholder': {
                color: mode('gray.400', 'gray.500')(props),
                opacity: 1,
            },

            // Focus styles
            '*:focus': {
                outline: 'none',
            },

            // Selection styles
            '*::selection': {
                bg: mode('brand.100', 'brand.700')(props),
                color: mode('brand.900', 'brand.100')(props),
            },

            // Scrollbar styles (webkit)
            '*::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
            },

            '*::-webkit-scrollbar-track': {
                bg: mode('gray.100', 'gray.700')(props),
                borderRadius: 'full',
            },

            '*::-webkit-scrollbar-thumb': {
                bg: mode('gray.300', 'gray.500')(props),
                borderRadius: 'full',

                _hover: {
                    bg: mode('gray.400', 'gray.400')(props),
                },
            },

            // Border color fallback
            '*, *::before, *::after': {
                borderColor: mode('gray.200', 'gray.600')(props),
            },

            // Dating app specific global styles
            '.swipe-card': {
                touchAction: 'pan-y pinch-zoom',
                userSelect: 'none',
            },

            '.chat-message': {
                wordBreak: 'break-word',
                hyphens: 'auto',
            },

            // Animation classes
            '.fade-in': {
                animation: 'fadeIn 0.3s ease-in-out',
            },

            '.slide-up': {
                animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },

            '.bounce-in': {
                animation: 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },

            // Keyframe animations
            '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
            },

            '@keyframes slideUp': {
                from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                },
                to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                },
            },

            '@keyframes bounceIn': {
                '0%': {
                    opacity: 0,
                    transform: 'scale(0.3)',
                },
                '50%': {
                    opacity: 1,
                    transform: 'scale(1.05)',
                },
                '70%': {
                    transform: 'scale(0.9)',
                },
                '100%': {
                    opacity: 1,
                    transform: 'scale(1)',
                },
            },

            // Heart animation for likes
            '@keyframes heartBeat': {
                '0%': {
                    transform: 'scale(1)',
                },
                '14%': {
                    transform: 'scale(1.3)',
                },
                '28%': {
                    transform: 'scale(1)',
                },
                '42%': {
                    transform: 'scale(1.3)',
                },
                '70%': {
                    transform: 'scale(1)',
                },
            },

            '.heart-beat': {
                animation: 'heartBeat 1s ease-in-out',
            },

            // Swipe animations
            '@keyframes swipeRight': {
                to: {
                    transform: 'translateX(100vw) rotate(30deg)',
                    opacity: 0,
                },
            },

            '@keyframes swipeLeft': {
                to: {
                    transform: 'translateX(-100vw) rotate(-30deg)',
                    opacity: 0,
                },
            },

            '.swipe-right': {
                animation: 'swipeRight 0.3s ease-out forwards',
            },

            '.swipe-left': {
                animation: 'swipeLeft 0.3s ease-out forwards',
            },
        }),
    },

    // Component themes
    components: {
        Button,
        Card,
        Input,
        // Modal,
        // Badge,
        // Avatar,

        // Quick component overrides
        Heading: {
            baseStyle: {
                fontWeight: 'bold',
                letterSpacing: '-0.025em',
            },
            variants: {
                brand: {
                    color: 'brand.500',
                    bgGradient: 'linear(to-r, brand.500, brand.600)',
                    bgClip: 'text',
                },
                love: {
                    bgGradient: 'linear(135deg, brand.500, brand.700)',
                    bgClip: 'text',
                    fontWeight: 'extrabold',
                },
            },
        },

        Link: {
            baseStyle: {
                color: 'brand.500',
                _hover: {
                    textDecoration: 'none',
                    color: 'brand.600',
                },
                _focus: {
                    boxShadow: '0 0 0 3px rgba(232, 93, 117, 0.3)',
                },
            },
        },

        Text: {
            variants: {
                brand: {
                    color: 'brand.500',
                },
                muted: {
                    color: 'gray.500',
                },
                subtle: {
                    color: 'gray.600',
                },
            },
        },

        // Form components
        FormLabel: {
            baseStyle: {
                fontWeight: 'medium',
                color: 'gray.700',
                _invalid: {
                    color: 'error.500',
                },
            },
        },

        FormError: {
            baseStyle: {
                text: {
                    color: 'error.500',
                    fontSize: 'sm',
                    mt: 1,
                },
            },
        },

        // Divider
        Divider: {
            baseStyle: {
                borderColor: 'gray.200',
                opacity: 1,
            },
            variants: {
                brand: {
                    borderColor: 'brand.200',
                },
            },
        },
    },

    // Layer styles for common patterns
    layerStyles: {
        card: {
            bg: 'white',
            borderRadius: 'xl',
            boxShadow: 'md',
            p: 6,
        },

        profileCard: {
            bg: 'white',
            borderRadius: '2xl',
            boxShadow: 'xl',
            overflow: 'hidden',
            position: 'relative',
        },

        modalContent: {
            bg: 'white',
            borderRadius: 'xl',
            boxShadow: '2xl',
            p: 6,
        },

        floatingButton: {
            bg: 'brand.500',
            color: 'white',
            borderRadius: 'full',
            boxShadow: 'lg',
            _hover: {
                bg: 'brand.600',
                transform: 'translateY(-2px)',
                boxShadow: 'xl',
            },
        },
    },
});

export default theme;
export { colors, typography, spacing, shadows, borders };