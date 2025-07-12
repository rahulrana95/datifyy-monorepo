// apps/frontend/src/mvp/admin-v2/components/AdminLayout.tsx
import React from 'react';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Button,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Badge,
    useToast
} from '@chakra-ui/react';
import { ChevronDownIcon, SettingsIcon } from '@chakra-ui/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../login/store/adminAuthStore';

/**
 * Admin Layout Component
 * Provides consistent layout structure for admin pages
 * 
 * Features:
 * - Navigation header
 * - User menu with logout
 * - Permission level display
 * - Responsive design
 * - Quick actions
 * 
 * @returns {JSX.Element} Admin layout wrapper
 */
const AdminLayout: React.FC = () => {
    const { admin, logout } = useAdminAuthStore();
    const navigate = useNavigate();
    const toast = useToast();

    /**
     * Handle admin logout
     */
    const handleLogout = async () => {
        try {
            await logout();

            toast({
                title: 'Logged Out',
                description: 'You have been successfully logged out.',
                status: 'success',
                duration: 3000,
            });

            navigate('/admin/login', { replace: true });

        } catch (error) {
            toast({
                title: 'Logout Error',
                description: 'There was an error logging out. Please try again.',
                status: 'error',
                duration: 5000,
            });
        }
    };

    /**
     * Get permission level color
     */
    const getPermissionColor = (level: string) => {
        switch (level) {
            case 'owner': return 'purple';
            case 'super_admin': return 'red';
            case 'admin': return 'blue';
            case 'moderator': return 'green';
            case 'viewer': return 'gray';
            default: return 'gray';
        }
    };

    return (
        <Box minH="100vh" bg="gray.50">
            {/* Header */}
            <Box bg="white" borderBottom="1px" borderColor="gray.200" px={6} py={4}>
                <Flex justify="space-between" align="center">

                    {/* Logo/Brand */}
                    <HStack spacing={3}>
                        <Text fontSize="xl" fontWeight="bold" color="brand.500">
                            💕 Datifyy
                        </Text>
                        <Badge colorScheme="blue" variant="subtle">
                            Admin Panel
                        </Badge>
                    </HStack>

                    {/* User Menu */}
                    {admin && (
                        <Menu>
                            <MenuButton as={Button} variant="ghost" rightIcon={<ChevronDownIcon />}>
                                <HStack spacing={3}>
                                    <Avatar size="sm" name={admin.email} />
                                    <VStack align="flex-start" spacing={0}>
                                        <Text fontSize="sm" fontWeight="medium">
                                            {admin.email}
                                        </Text>
                                        <Badge
                                            size="xs"
                                            colorScheme={getPermissionColor(admin.permissionLevel)}
                                            variant="subtle"
                                        >
                                            {admin.permissionLevel}
                                        </Badge>
                                    </VStack>
                                </HStack>
                            </MenuButton>

                            <MenuList>
                                <MenuItem icon={<SettingsIcon />}>
                                    Account Settings
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem
                                    icon={<SettingsIcon />}
                                    onClick={handleLogout}
                                    color="red.500"
                                >
                                    Logout
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    )}

                </Flex>
            </Box>

            {/* Main Content */}
            <Box p={6}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;

// ========================================