import { extendTheme  } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    accent: {
      50: "rgba(245, 152, 229, 0.1)",
      100: "rgba(245, 152, 229, 0.2)",
      200: "rgba(245, 152, 229, 0.3)",
      300: "rgba(214, 77, 131, 0.4)",
      400: "rgba(214, 77, 131, 0.5)",
      500: "rgba(214, 77, 131, 1)", // Main accent color
      600: "rgba(180, 60, 110, 1)", // Deeper romantic pink
      700: "rgba(150, 45, 90, 1)", // Rich wine tone
      800: "rgba(120, 30, 70, 1)", // Darker passion color
      900: "rgba(90, 20, 50, 1)", // Deepest romantic tone
    },
    lightBg: "rgb(244, 241, 243)", // Light background
    gradient: {
      romantic: "linear-gradient(to right, rgb(244, 204, 241), rgba(246, 157, 231, 0.5))",
    },
    buttonAccent50: "rgba(245, 152, 229, 0.1)",
    buttonAccent100: "rgba(245, 152, 229, 0.2)",
    buttonAccent200: "rgba(245, 152, 229, 0.3)",
    buttonAccent300: "rgba(214, 77, 131, 0.3)",
    buttonAccent400: "rgba(214, 77, 131, 0.4)",
    buttonAccent500: "rgba(214, 77, 131, 1)",
    buttonAccent600: "rgba(180, 60, 110, 1)",
    buttonAccent700: "rgba(150, 45, 90, 1)",
    buttonAccent800: "rgba(120, 30, 70, 1)",
    buttonAccent900: "rgba(90, 20, 50, 1)",

  },
  styles: {
    global: {
      body: {
        bg: "lightBg",
        color: "accent.900",
      },
    },
  },
});

export default theme;
