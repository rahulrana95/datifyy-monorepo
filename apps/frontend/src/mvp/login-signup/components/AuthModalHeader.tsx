// apps/frontend/src/mvp/login-signup/components/AuthModalHeader.tsx
import React from "react";
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    Button,
    useBreakpointValue,
} from "@chakra-ui/react";
import { AuthView } from "../types/auth.types";

interface AuthModalHeaderProps {
    title: string;
    subtitle: string;
    currentView: AuthView;
    onViewChange: (view: AuthView) => void;
}

const AuthModalHeader: React.FC<AuthModalHeaderProps> = ({
    title,
    subtitle,
    currentView,
    onViewChange,
}) => {
    const headerPadding = useBreakpointValue({
        base: { px: 6, pt: 8, pb: 6 },
        sm: { px: 8, pt: 10, pb: 8 }
    });

    const titleSize = useBreakpointValue({
        base: "xl",
        sm: "2xl"
    });

    const isLogin = currentView === AuthView.LOGIN;
    const isSignup = currentView === AuthView.SIGNUP;
    const isForgotPassword = currentView === AuthView.FORGOT_PASSWORD;

    return (
        <VStack spacing={6} w="full" {...headerPadding}>
            {/* Title & Subtitle */}
            <VStack spacing={2} textAlign="center">
                <Heading
                    size={titleSize}
                    color="gray.800"
                    fontWeight="bold"
                    letterSpacing="-0.02em"
                    className="fade-in"
                >
                    {title}
                </Heading>

                <Text
                    fontSize={{ base: "md", sm: "lg" }}
                    color="gray.600"
                    maxW="320px"
                    lineHeight="1.5"
                >
                    {subtitle}
                </Text>
            </VStack>

            {/* Navigation Tabs - Only show for Login/Signup */}
            {!isForgotPassword && (
                <HStack
                    spacing={0}
                    bg="gray.100"
                    borderRadius="xl"
                    p={1}
                    w="full"
                    maxW="300px"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        flex={1}
                        py={3}
                        fontSize="md"
                        fontWeight="semibold"
                        borderRadius="lg"
                        color={isLogin ? "white" : "gray.600"}
                        bg={isLogin ? "brand.500" : "transparent"}
                        _hover={{
                            bg: isLogin ? "brand.600" : "white",
                            color: isLogin ? "white" : "brand.500",
                            transform: "translateY(-1px)",
                        }}
                        _active={{
                            transform: "scale(0.98)",
                        }}
                        transition="all 0.2s ease"
                        onClick={() => onViewChange(AuthView.LOGIN)}
                        cursor="pointer"
                    >
                        Sign In
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        flex={1}
                        py={3}
                        fontSize="md"
                        fontWeight="semibold"
                        borderRadius="lg"
                        color={isSignup ? "white" : "gray.600"}
                        bg={isSignup ? "brand.500" : "transparent"}
                        _hover={{
                            bg: isSignup ? "brand.600" : "white",
                            color: isSignup ? "white" : "brand.500",
                            transform: "translateY(-1px)",
                        }}
                        _active={{
                            transform: "scale(0.98)",
                        }}
                        transition="all 0.2s ease"
                        onClick={() => onViewChange(AuthView.SIGNUP)}
                        cursor="pointer"
                    >
                        Sign Up
                    </Button>
                </HStack>
            )}

            {/* Back to Login for Forgot Password */}
            {isForgotPassword && (
                <Button
                    variant="ghost"
                    size="sm"
                    colorScheme="brand"
                    onClick={() => onViewChange(AuthView.LOGIN)}
                    leftIcon={<Text>←</Text>}
                    _hover={{
                        bg: "brand.50",
                        transform: "translateX(-2px)",
                    }}
                    cursor="pointer"
                >
                    Back to Sign In
                </Button>
            )}
        </VStack>
    );
};

export default AuthModalHeader;