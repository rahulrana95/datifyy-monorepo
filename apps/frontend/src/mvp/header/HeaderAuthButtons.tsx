// apps/frontend/src/mvp/components/header/HeaderAuthButtons.tsx
import React from 'react';
import { Button, HStack } from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import { useAuthStore } from '../login-signup';

interface HeaderAuthButtonsProps {
    isMobile?: boolean;
    onButtonClick?: () => void;
}

const HeaderAuthButtons: React.FC<HeaderAuthButtonsProps> = ({
    isMobile = false,
    onButtonClick
}) => {
    // Your existing auth store logic
    const { showHideLogin, showHideSignup } = useAuthStore();

    const handleSignUp = () => {
        showHideSignup(true);
        onButtonClick?.(); // Close mobile menu if needed
    };

    const handleLogin = () => {
        showHideLogin(true);
        onButtonClick?.(); // Close mobile menu if needed
    };

    return (
        <HStack spacing={isMobile ? 4 : 3} w={isMobile ? 'full' : 'auto'}>
            <Button
                variant="ghost"
                colorScheme="brand"
                size={isMobile ? 'md' : 'sm'}
                onClick={handleSignUp}
                w={isMobile ? 'full' : 'auto'}
                _hover={{ bg: 'brand.50' }}
                cursor="pointer"
            >
                Sign Up
            </Button>

            <Button
                variant="love"
                size={isMobile ? 'md' : 'sm'}
                rightIcon={<FaHeart />}
                onClick={handleLogin}
                w={isMobile ? 'full' : 'auto'}
                className="heart-beat"
                cursor="pointer"
                _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 25px rgba(232, 93, 117, 0.4)',
                }}
            >
                Login
            </Button>
        </HStack>
    );
};

export default HeaderAuthButtons;