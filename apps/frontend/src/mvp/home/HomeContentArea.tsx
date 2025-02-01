import { Box, Container, VStack, Flex, theme, useTheme } from "@chakra-ui/react";
import { ReactNode } from "react";

interface HomeContentAreaProps {
    children: ReactNode;
    footer: ReactNode;
}

const HomeContentArea = ({ children, footer }: HomeContentAreaProps) => {
    const theme = useTheme();
    return (
        <Flex
            direction="column"
            minH="100vh"
            justify="space-between"
            bg={theme.colors.lightBg}
        // Responsive overflow
        >
            {/* Main Content Area */}
            <Container
                maxW="container.lg"
                py={{ base: 4, md: 8 }} // Responsive spacing
                flex="1"
                overflow={{ base: "scroll", md: "scroll" }}

            >
                <VStack spacing={{ base: 6, md: 10 }} align="stretch">
                    {children}
                </VStack>
            </Container>

            {/* Footer at the bottom */}
            <Box
                w="100%"
                bg="gray.100"
                py={4}
                mt={10} // Adds spacing before footer
                textAlign="center"
            >
                {footer}
            </Box>
        </Flex>
    );
};

export default HomeContentArea;
