// apps/frontend/src/mvp/login-signup/components/AuthModal.tsx
import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Box,
    VStack,
    HStack,
    Text,
    IconButton,
    useBreakpointValue,
    Slide,
    ScaleFade,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useAuthStore } from "../store/authStore";
import { AuthView } from "../types/auth.types";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import AuthModalHeader from "./AuthModalHeader";

const AuthModal: React.FC = () => {
    const {
        isLoginOpen,
        isSignupOpen,
        isForgotPasswordOpen,
        hideAllModals,
        showLogin,
        showSignup,
        showForgotPassword,
        clearError
    } = useAuthStore();

    const [currentView, setCurrentView] = useState<AuthView>(AuthView.LOGIN);
    const [isAnimating, setIsAnimating] = useState(false);

    const isOpen = isLoginOpen || isSignupOpen || isForgotPasswordOpen;

    // Responsive modal size
    const modalSize = useBreakpointValue({
        base: 'full',
        sm: 'md',
        md: 'lg'
    });

    const isMobile = useBreakpointValue({ base: true, sm: false });

    // Update view based on store state
    useEffect(() => {
        if (isLoginOpen) setCurrentView(AuthView.LOGIN);
        else if (isSignupOpen) setCurrentView(AuthView.SIGNUP);
        else if (isForgotPasswordOpen) setCurrentView(AuthView.FORGOT_PASSWORD);
    }, [isLoginOpen, isSignupOpen, isForgotPasswordOpen]);

    const handleViewChange = async (newView: AuthView) => {
        if (newView === currentView) return;

        setIsAnimating(true);
        clearError();

        // Small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 150));

        switch (newView) {
            case AuthView.LOGIN:
                showLogin();
                break;
            case AuthView.SIGNUP:
                showSignup();
                break;
            case AuthView.FORGOT_PASSWORD:
                showForgotPassword();
                break;
        }

        setIsAnimating(false);
    };

    const handleClose = () => {
        clearError();
        hideAllModals();
    };

    const getViewConfig = () => {
        switch (currentView) {
            case AuthView.LOGIN:
                return {
                    title: "Welcome Back! 💕",
                    subtitle: "Sign in to find your perfect match",
                    gradient: "linear(135deg, brand.50, love.50)"
                };
            case AuthView.SIGNUP:
                return {
                    title: "Join Datifyy ✨",
                    subtitle: "Let's help you find love",
                    gradient: "linear(135deg, connection.50, brand.50)"
                };
            case AuthView.FORGOT_PASSWORD:
                return {
                    title: "Reset Password 🔐",
                    subtitle: "We'll help you get back to finding love",
                    gradient: "linear(135deg, gray.50, brand.50)"
                };
        }
    };

    const config = getViewConfig();

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size={modalSize}
            isCentered
            closeOnOverlayClick={false}
            motionPreset={isMobile ? "slideInBottom" : "scale"}
        >
            <ModalOverlay
                bg="rgba(0, 0, 0, 0.6)"
                backdropFilter="blur(8px)"
            />

            <ModalContent
                bg="white"
                borderRadius={isMobile ? { base: "0", sm: "xl" } : "xl"}
                boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                mx={isMobile ? 0 : 4}
                my={isMobile ? 0 : 16}
                maxH={isMobile ? "100vh" : "90vh"}
                overflow="hidden"
                position="relative"
            >
                {/* Background Gradient */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    height="120px"
                    bgGradient={config.gradient}
                    opacity={0.7}
                    zIndex={0}
                />

                {/* Close Button */}
                <IconButton
                    aria-label="Close modal"
                    icon={<CloseIcon />}
                    position="absolute"
                    top={4}
                    right={4}
                    size="sm"
                    variant="ghost"
                    colorScheme="gray"
                    borderRadius="full"
                    zIndex={10}
                    onClick={handleClose}
                    _hover={{
                        bg: "blackAlpha.100",
                        transform: "scale(1.1)"
                    }}
                />

                <ModalBody p={0}>
                    <VStack spacing={0} position="relative" zIndex={1}>
                        {/* Header */}
                        <AuthModalHeader
                            title={config.title}
                            subtitle={config.subtitle}
                            currentView={currentView}
                            onViewChange={handleViewChange}
                        />

                        {/* Form Content */}
                        <Box
                            w="full"
                            px={{ base: 6, sm: 8 }}
                            pb={{ base: 8, sm: 10 }}
                            pt={4}
                        >
                            <ScaleFade
                                in={!isAnimating}
                                initialScale={0.95}
                                unmountOnExit
                            >
                                {currentView === AuthView.LOGIN && (
                                    <LoginForm
                                        onSignup={() => handleViewChange(AuthView.SIGNUP)}
                                        onForgotPassword={() => handleViewChange(AuthView.FORGOT_PASSWORD)}
                                    />
                                )}

                                {currentView === AuthView.SIGNUP && (
                                    <SignupForm
                                        onLogin={() => handleViewChange(AuthView.LOGIN)}
                                    />
                                )}

                                {currentView === AuthView.FORGOT_PASSWORD && (
                                    <ForgotPasswordForm
                                        onLogin={() => handleViewChange(AuthView.LOGIN)}
                                    />
                                )}
                            </ScaleFade>
                        </Box>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AuthModal;