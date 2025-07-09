// apps/frontend/src/mvp/components/header/HeaderMobileMenu.tsx
import React from 'react';
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VStack,
    HStack,
    Heading,
    Text,
    Box,
} from '@chakra-ui/react';
import HeaderNavigation from './HeaderNavigation';
import HeaderAuthButtons from './HeaderAuthButtons';
import { useAuthStore } from '../login-signup';
// import UserMenu from '../../UserMenu';

interface HeaderMobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
    isOpen,
    onClose
}) => {
    // Your existing auth store logic
    const { isAuthenticated } = useAuthStore();

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px" borderColor="gray.100">
                    <HStack spacing={2}>
                        <Text fontSize="xl">💕</Text>
                        <Heading size="md" color="brand.500">
                            datifyy
                        </Heading>
                    </HStack>
                </DrawerHeader>

                <DrawerBody>
                    <VStack spacing={6} align="stretch" pt={6}>
                        {/* Navigation Items */}
                        <VStack spacing={2} align="stretch">
                            <HeaderNavigation isMobile onItemClick={onClose} />
                        </VStack>

                        {/* Auth Buttons or User Menu */}
                        <VStack spacing={4} pt={6} borderTop="1px" borderColor="gray.200">
                            {!isAuthenticated ? (
                                <HeaderAuthButtons isMobile onButtonClick={onClose} />
                            ) : (
                                <Box w="full">
                                    {/* <UserMenu /> */}
                                </Box>
                            )}
                        </VStack>
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default HeaderMobileMenu;