// apps/frontend/src/mvp/Header.tsx
import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Text,
  Spacer,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';

// Import smaller components
import HeaderLogo from './header/HeaderLogo';
import HeaderNavigation from './header/HeaderNavigation';
import HeaderAuthButtons from './header/HeaderAuthButtons';
import HeaderMobileMenu from './header/HeaderMobileMenu';
import { AuthModal, useAuthStore } from './login-signup';

const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Your existing auth store logic
  const { isAuthenticated } = useAuthStore();
  const authStore = useAuthStore();
  const navigate = useNavigate();

  // Your existing redirect logic
  useEffect(() => {
    if (!authStore.isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [authStore.isAuthenticated, navigate]);

  return (
    <>
      <Box
        as="header"
        bg="white"
        borderBottom="3px solid"
        borderColor="brand.400"
        boxShadow="lg"
        position="sticky"
        top={0}
        zIndex={1000}
        className="safe-top global-header"
      >
        <Container maxW="7xl" py={4} px={6}>
          <Flex align="center">
            {/* Logo */}
            <HeaderLogo />

            <Spacer />

            {/* Desktop Navigation */}
            <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
              <HeaderNavigation />
            </HStack>

            <Spacer />

            {/* Desktop Auth/User Section */}
            <Box display={{ base: 'none', md: 'block' }}>
              {!isAuthenticated ? (
                <HeaderAuthButtons />
              ) : (
                <UserMenu />
              )}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              aria-label="Open menu"
              icon={<Text fontSize="xl">☰</Text>}
              variant="ghost"
              size="sm"
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              _hover={{ bg: 'brand.50' }}
              cursor="pointer"
            />
          </Flex>
        </Container>
      </Box>

      {/* Mobile Menu */}
      <HeaderMobileMenu isOpen={isOpen} onClose={onClose} />

      {/* Your existing Authentication Modal */}
      <AuthModal />
    </>
  );
};

export default Header;