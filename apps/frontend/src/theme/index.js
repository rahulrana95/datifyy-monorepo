// theme/index.js
import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

// Color palette inspired by your logo
const colors = {
    brand: {
        50: '#fef7f7',
        100: '#fce8e8',
        200: '#f8d5d5',
        300: '#f2b3b3',
        400: '#ea8a8a',
        500: '#e85d75', // Main pink from logo
        600: '#d14361',
        700: '#b8344d',
        800: '#9c2a40',
        900: '#842439',
    },
    pink: {
        50: '#fef7f7',
        100: '#fce8e8',
        200: '#f8d5d5',
        300: '#f2b3b3',
        400: '#ea8a8a',
        500: '#e85d75',
        600: '#d14361',
        700: '#b8344d',
        800: '#9c2a40',
        900: '#842439',
    },
    love: {
        light: '#fef7f7',
        main: '#e85d75',
        dark: '#b8344d',
    },
    gray: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
    }
}

// Typography
const fonts = {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, "Liberation Mono", Menlo, Courier, monospace',
}

// Global styles
const styles = {
    global: (props) => ({
        body: {
            bg: mode('white', 'gray.900')(props),
            color: mode('gray.800', 'gray.100')(props),
            lineHeight: 1.6,
        },
        '*::placeholder': {
            color: mode('gray.400', 'gray.500')(props),
        },
        '*, *::before, &::after': {
            borderColor: mode('gray.200', 'gray.600')(props),
        },
    }),
}

// Component customizations
const components = {
    // Button component
    Button: {
        baseStyle: {
            fontWeight: 'semibold',
            borderRadius: 'lg',
            _focus: {
                boxShadow: '0 0 0 3px rgba(232, 93, 117, 0.3)',
            },
        },
        sizes: {
            sm: {
                fontSize: 'sm',
                px: 4,
                py: 2,
            },
            md: {
                fontSize: 'md',
                px: 6,
                py: 3,
            },
            lg: {
                fontSize: 'lg',
                px: 8,
                py: 4,
            },
        },
        variants: {
            solid: (props) => ({
                bg: props.colorScheme === 'brand' ? 'brand.500' : `${props.colorScheme}.500`,
                color: 'white',
                _hover: {
                    bg: props.colorScheme === 'brand' ? 'brand.600' : `${props.colorScheme}.600`,
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg',
                },
                _active: {
                    bg: props.colorScheme === 'brand' ? 'brand.700' : `${props.colorScheme}.700`,
                    transform: 'translateY(0)',
                },
            }),
            outline: (props) => ({
                border: '2px solid',
                borderColor: props.colorScheme === 'brand' ? 'brand.500' : `${props.colorScheme}.500`,
                color: props.colorScheme === 'brand' ? 'brand.500' : `${props.colorScheme}.500`,
                _hover: {
                    bg: props.colorScheme === 'brand' ? 'brand.50' : `${props.colorScheme}.50`,
                    transform: 'translateY(-1px)',
                },
            }),
            ghost: (props) => ({
                color: props.colorScheme === 'brand' ? 'brand.500' : `${props.colorScheme}.500`,
                _hover: {
                    bg: props.colorScheme === 'brand' ? 'brand.50' : `${props.colorScheme}.50`,
                },
            }),
            love: {
                bg: 'linear-gradient(135deg, #e85d75 0%, #d14361 100%)',
                color: 'white',
                _hover: {
                    bg: 'linear-gradient(135deg, #d14361 0%, #b8344d 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px rgba(232, 93, 117, 0.3)',
                },
            },
        },
        defaultProps: {
            colorScheme: 'brand',
        },
    },

    // Input component
    Input: {
        baseStyle: {
            field: {
                borderRadius: 'lg',
                _focus: {
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px #e85d75',
                },
                _hover: {
                    borderColor: 'brand.300',
                },
            },
        },
        variants: {
            outline: (props) => ({
                field: {
                    border: '2px solid',
                    borderColor: mode('gray.200', 'gray.600')(props),
                    bg: mode('white', 'gray.800')(props),
                    _focus: {
                        borderColor: 'brand.500',
                        boxShadow: '0 0 0 1px #e85d75',
                    },
                },
            }),
            filled: (props) => ({
                field: {
                    bg: mode('gray.50', 'gray.700')(props),
                    _focus: {
                        bg: mode('white', 'gray.800')(props),
                        borderColor: 'brand.500',
                    },
                },
            }),
        },
    },

    // Card component
    Card: {
        baseStyle: (props) => ({
            container: {
                bg: mode('white', 'gray.800')(props),
                borderRadius: 'xl',
                boxShadow: mode('sm', 'dark-lg')(props),
                border: '1px solid',
                borderColor: mode('gray.100', 'gray.700')(props),
                _hover: {
                    transform: 'translateY(-2px)',
                    boxShadow: mode('md', 'dark-lg')(props),
                },
                transition: 'all 0.2s ease-in-out',
            },
        }),
    },

    // Heading component
    Heading: {
        baseStyle: {
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
        },
        sizes: {
            xs: {
                fontSize: 'sm',
                lineHeight: 1.4,
            },
            sm: {
                fontSize: 'md',
                lineHeight: 1.4,
            },
            md: {
                fontSize: 'lg',
                lineHeight: 1.4,
            },
            lg: {
                fontSize: 'xl',
                lineHeight: 1.4,
            },
            xl: {
                fontSize: '2xl',
                lineHeight: 1.3,
            },
            '2xl': {
                fontSize: '3xl',
                lineHeight: 1.2,
            },
        },
        variants: {
            brand: {
                color: 'brand.500',
                bgGradient: 'linear(to-r, brand.500, brand.600)',
                bgClip: 'text',
            },
            love: {
                bgGradient: 'linear(135deg, #e85d75 0%, #d14361 100%)',
                bgClip: 'text',
                fontWeight: 'extrabold',
            },
        },
    },

    // Link component
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

    // Badge component
    Badge: {
        baseStyle: {
            borderRadius: 'full',
            fontWeight: 'semibold',
            fontSize: 'xs',
            px: 2,
            py: 1,
        },
        variants: {
            solid: (props) => ({
                bg: props.colorScheme === 'brand' ? 'brand.500' : `${props.colorScheme}.500`,
                color: 'white',
            }),
            subtle: (props) => ({
                bg: props.colorScheme === 'brand' ? 'brand.50' : `${props.colorScheme}.50`,
                color: props.colorScheme === 'brand' ? 'brand.700' : `${props.colorScheme}.700`,
            }),
            love: {
                bg: 'linear-gradient(135deg, #e85d75 0%, #d14361 100%)',
                color: 'white',
            },
        },
    },

    // Checkbox component
    Checkbox: {
        baseStyle: {
            control: {
                borderRadius: 'md',
                _checked: {
                    bg: 'brand.500',
                    borderColor: 'brand.500',
                    _hover: {
                        bg: 'brand.600',
                        borderColor: 'brand.600',
                    },
                },
                _focus: {
                    boxShadow: '0 0 0 3px rgba(232, 93, 117, 0.3)',
                },
            },
        },
    },

    // Radio component
    Radio: {
        baseStyle: {
            control: {
                _checked: {
                    bg: 'brand.500',
                    borderColor: 'brand.500',
                    _hover: {
                        bg: 'brand.600',
                        borderColor: 'brand.600',
                    },
                },
                _focus: {
                    boxShadow: '0 0 0 3px rgba(232, 93, 117, 0.3)',
                },
            },
        },
    },

    // Switch component
    Switch: {
        baseStyle: {
            track: {
                _checked: {
                    bg: 'brand.500',
                },
            },
        },
    },

    // Tabs component
    Tabs: {
        variants: {
            line: {
                tab: {
                    _selected: {
                        color: 'brand.500',
                        borderBottomColor: 'brand.500',
                    },
                },
            },
            enclosed: {
                tab: {
                    _selected: {
                        color: 'brand.500',
                        borderColor: 'brand.500',
                        borderBottom: '1px solid',
                        borderBottomColor: 'white',
                    },
                },
            },
        },
    },

    // Progress component
    Progress: {
        baseStyle: {
            filledTrack: {
                bg: 'brand.500',
            },
        },
    },

    // Alert component
    Alert: {
        variants: {
            subtle: (props) => ({
                container: {
                    bg: props.status === 'error' ? 'red.50' :
                        props.status === 'warning' ? 'yellow.50' :
                            props.status === 'success' ? 'green.50' : 'brand.50',
                },
            }),
        },
    },
}

// Custom theme configuration
const config = {
    initialColorMode: 'light',
    useSystemColorMode: false,
}

const theme = extendTheme({
    config,
    colors,
    fonts,
    styles,
    components,
    space: {
        px: '1px',
        0.5: '0.125rem',
        1: '0.25rem',
        1.5: '0.375rem',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        3.5: '0.875rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
    },
    radii: {
        none: '0',
        sm: '0.125rem',
        base: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
    },
    shadows: {
        xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        outline: '0 0 0 3px rgba(232, 93, 117, 0.3)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
        'dark-lg': 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px',
    },
})

export default theme