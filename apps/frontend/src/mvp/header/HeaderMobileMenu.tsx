// apps/frontend/src/mvp/header/HeaderMobileMenu.tsx
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
    Badge,
    Divider,
    Avatar,
    Button,
    Icon,
} from '@chakra-ui/react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import HeaderNavigation from './HeaderNavigation';
import HeaderAuthButtons from './HeaderAuthButtons';
import { useAuthStore } from '../login-signup';
import { useDateCuration } from '../date-curation/hooks/useDateCuration';

interface HeaderMobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
    isOpen,
    onClose
}) => {
    const { isAuthenticated, user, clearUser, setIsAuthenticated } = useAuthStore();
    const { summary } = useDateCuration();

    const handleLogout = () => {
        clearUser();
        setIsAuthenticated(false);
        onClose();
        // Could add logout API call here if needed
    };

    const getPendingDatesCount = () => {
        if (!isAuthenticated) return 0;
        return summary.pendingConfirmation + summary.upcomingDates;
    };

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay bg="blackAlpha.600" />
            <DrawerContent>
                <DrawerCloseButton
                    color="gray.600"
                    _hover={{ color: 'brand.500', bg: 'brand.50' }}
                />

                <DrawerHeader borderBottomWidth="1px" borderColor="gray.100" pb={4}>
                    <HStack spacing={2} justify="space-between">
                        <HStack spacing={2}>
                            <Text fontSize="xl">💕</Text>
                            <Heading size="md" color="brand.500">
                                datifyy
                            </Heading>
                        </HStack>

                        {/* Show dates badge in header if there are pending items */}
                        {isAuthenticated && getPendingDatesCount() > 0 && (
                            <Badge
                                colorScheme="brand"
                                variant="solid"
                                borderRadius="full"
                                fontSize="xs"
                                px={2}
                                py={1}
                            >
                                {getPendingDatesCount()} pending
                            </Badge>
                        )}
                    </HStack>
                </DrawerHeader>

                <DrawerBody p={0}>
                    <VStack spacing={0} align="stretch" h="full">

                        {/* User Info Section (if authenticated) */}
                        {isAuthenticated && user && (
                            <>
                                <Box p={6} bg="brand.50">
                                    <HStack spacing={3} align="center">
                                        <Avatar
                                            size="md"
                                            name={user.name || user.email}
                                            bg="brand.500"
                                            color="white"
                                        />
                                        <VStack align="start" spacing={0} flex={1}>
                                            <Text fontWeight="semibold" color="gray.800">
                                                {user.name || 'Welcome!'}
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                {user.email}
                                            </Text>
                                        </VStack>
                                    </HStack>

                                    {/* Quick stats */}
                                    {summary.totalDates > 0 && (
                                        <HStack spacing={4} mt={3} pt={3} borderTop="1px" borderColor="brand.200">
                                            <VStack spacing={0}>
                                                <Text fontSize="lg" fontWeight="bold" color="brand.600">
                                                    {summary.totalDates}
                                                </Text>
                                                <Text fontSize="xs" color="gray.600">
                                                    Total Dates
                                                </Text>
                                            </VStack>
                                            <VStack spacing={0}>
                                                <Text fontSize="lg" fontWeight="bold" color="brand.600">
                                                    {summary.completedDates}
                                                </Text>
                                                <Text fontSize="xs" color="gray.600">
                                                    Completed
                                                </Text>
                                            </VStack>
                                            <VStack spacing={0}>
                                                <Text fontSize="lg" fontWeight="bold" color="brand.600">
                                                    {summary.upcomingDates}
                                                </Text>
                                                <Text fontSize="xs" color="gray.600">
                                                    Upcoming
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    )}
                                </Box>
                                <Divider />
                            </>
                        )}

                        {/* Navigation Items */}
                        <Box p={6} flex={1}>
                            <VStack spacing={2} align="stretch">
                                <HeaderNavigation isMobile onItemClick={onClose} />
                            </VStack>
                        </Box>

                        {/* Auth Section */}
                        <Box borderTop="1px" borderColor="gray.200" p={6}>
                            {!isAuthenticated ? (
                                <HeaderAuthButtons isMobile onButtonClick={onClose} />
                            ) : (
                                <VStack spacing={3} align="stretch">
                                    <Button
                                        variant="ghost"
                                        leftIcon={<Icon as={FaUser} />}
                                        justifyContent="flex-start"
                                        onClick={onClose}
                                        _hover={{ bg: 'gray.50' }}
                                    >
                                        Profile Settings
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        leftIcon={<Icon as={FaSignOutAlt} />}
                                        justifyContent="flex-start"
                                        onClick={handleLogout}
                                        color="red.500"
                                        _hover={{ bg: 'red.50', color: 'red.600' }}
                                    >
                                        Sign Out
                                    </Button>
                                </VStack>
                            )}
                        </Box>
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default HeaderMobileMenu;