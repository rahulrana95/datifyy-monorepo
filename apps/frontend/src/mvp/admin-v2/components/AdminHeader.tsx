// apps/frontend/src/mvp/admin-v2/components/AdminHeader.tsx

import React from 'react';
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Text,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Badge,
    Button,
    useColorModeValue,
    Tooltip,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
} from '@chakra-ui/react';
import {
    FiMenu,
    FiBell,
    FiSearch,
    FiSettings,
    FiLogOut,
    FiUser,
    FiShield,
    FiHelpCircle,
    FiRefreshCw,
} from 'react-icons/fi';
import { useAuthStore } from '../../login-signup';
import authService from '../../../service/authService';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
    onToggleSidebar?: () => void;
    isSidebarCollapsed?: boolean;
    pageTitle?: string;
    breadcrumb?: string[];
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
    onToggleSidebar,
    isSidebarCollapsed = false,
    pageTitle,
    breadcrumb = [],
}) => {
    const navigate = useNavigate();
    const authStore = useAuthStore();
    const { isOpen: isNotificationsOpen, onOpen: onNotificationsOpen, onClose: onNotificationsClose } = useDisclosure();

    // Theme colors
    const headerBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.800', 'white');
    const mutedColor = useColorModeValue('gray.600', 'gray.300');

    // Handle logout
    const handleLogout = async () => {
        try {
            await authService.logout();
            // authStore.logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API call fails
            // authStore.logout();
            navigate('/admin/login');
        }
    };

    // Mock notifications data
    const notifications = [
        {
            id: '1',
            title: 'New user registration spike',
            message: '25 new users registered in the last hour',
            time: '5 minutes ago',
            isRead: false,
            type: 'info',
        },
        {
            id: '2',
            title: 'Revenue milestone reached',
            message: 'Monthly revenue target achieved',
            time: '1 hour ago',
            isRead: false,
            type: 'success',
        },
        {
            id: '3',
            title: 'System maintenance scheduled',
            message: 'Planned maintenance tonight at 2 AM',
            time: '2 hours ago',
            isRead: true,
            type: 'warning',
        },
    ];

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const MenuIcon = () => <FiMenu />;

    return (
        <>
            <Box
                bg={headerBg}
                borderBottom="1px solid"
                borderColor={borderColor}
                px={6}
                py={4}
                position="fixed"
                top={0}
                left={isSidebarCollapsed ? '80px' : '280px'}
                right={0}
                zIndex={15}
                transition="left 0.2s"
            >
                <Flex justify="space-between" align="center">
                    {/* Left Section */}
                    <HStack spacing={4}>
                        <IconButton
                            aria-label="Toggle sidebar"
                            icon={<MenuIcon />}
                            variant="ghost"
                            size="sm"
                            onClick={onToggleSidebar}
                        />

                        <VStack align="flex-start" spacing={0}>
                            {pageTitle && (
                                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                                    {pageTitle}
                                </Text>
                            )}
                            {breadcrumb.length > 0 && (
                                <Text fontSize="sm" color={mutedColor}>
                                    {breadcrumb.join(' / ')}
                                </Text>
                            )}
                        </VStack>
                    </HStack>

                    {/* Right Section */}
                    <HStack spacing={3}>
                        {/* Search */}
                        <Tooltip label="Global search (Coming soon)" hasArrow>
                            <IconButton
                                aria-label="Search"
                                icon={<FiSearch /> as React.ReactElement}
                                variant="ghost"
                                size="sm"
                                isDisabled
                            />
                        </Tooltip>

                        {/* Refresh */}
                        <Tooltip label="Refresh data" hasArrow>
                            <IconButton
                                aria-label="Refresh"
                                icon={<FiRefreshCw /> as React.ReactElement}
                                variant="ghost"
                                size="sm"
                                onClick={() => window.location.reload()}
                            />
                        </Tooltip>

                        {/* Notifications */}
                        <Box position="relative">
                            <IconButton
                                aria-label="Notifications"
                                icon={<FiBell /> as React.ReactElement}
                                variant="ghost"
                                size="sm"
                                onClick={onNotificationsOpen}
                            />
                            {unreadCount > 0 && (
                                <Badge
                                    colorScheme="red"
                                    variant="solid"
                                    fontSize="xs"
                                    position="absolute"
                                    top="-1"
                                    right="-1"
                                    borderRadius="full"
                                    minW="18px"
                                    h="18px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                        </Box>

                        {/* Admin Profile Menu */}
                        <Menu>
                            <MenuButton as={Button} variant="ghost" size="sm" p={1}>
                                <HStack spacing={2}>
                                    <Avatar
                                        size="sm"
                                        name={authStore.user?.name || 'Admin'}
                                        bg="brand.500"
                                        color="white"
                                    />
                                    <VStack align="flex-start" spacing={0} display={{ base: 'none', md: 'flex' }}>
                                        <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                            {authStore.user?.name || 'Admin'}
                                        </Text>
                                        <Text fontSize="xs" color={mutedColor}>
                                            Administrator
                                        </Text>
                                    </VStack>
                                </HStack>
                            </MenuButton>

                            <MenuList>
                                <MenuItem icon={<FiUser /> as React.ReactElement} isDisabled>
                                    Profile Settings
                                </MenuItem>
                                <MenuItem icon={<FiShield /> as React.ReactElement} isDisabled>
                                    Security
                                </MenuItem>
                                <MenuItem icon={<FiSettings /> as React.ReactElement} isDisabled>
                                    Preferences
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem icon={<FiHelpCircle /> as React.ReactElement} isDisabled>
                                    Help & Support
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem icon={<FiLogOut /> as React.ReactElement} onClick={handleLogout} color="red.500">
                                    Sign Out
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                </Flex>
            </Box>

            {/* Notifications Modal */}
            <Modal isOpen={isNotificationsOpen} onClose={onNotificationsClose} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display="flex" alignItems="center" justifyContent="space-between">
                        <Text>Notifications</Text>
                        {unreadCount > 0 && (
                            <Badge colorScheme="red" variant="solid">
                                {unreadCount} new
                            </Badge>
                        )}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={6}>
                        <VStack spacing={3} align="stretch">
                            {notifications.length === 0 ? (
                                <Text color="gray.500" textAlign="center" py={8}>
                                    No notifications
                                </Text>
                            ) : (
                                notifications.map((notification) => (
                                    <Box
                                        key={notification.id}
                                        p={4}
                                        borderRadius="lg"
                                        bg={notification.isRead ? 'gray.50' : 'blue.50'}
                                        borderLeft="4px solid"
                                        borderLeftColor={
                                            notification.type === 'success' ? 'green.400' :
                                                notification.type === 'warning' ? 'orange.400' :
                                                    notification.type === 'error' ? 'red.400' : 'blue.400'
                                        }
                                        cursor="pointer"
                                        _hover={{ bg: notification.isRead ? 'gray.100' : 'blue.100' }}
                                    >
                                        <VStack align="flex-start" spacing={1}>
                                            <HStack justify="space-between" w="full">
                                                <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                                                    {notification.title}
                                                </Text>
                                                {!notification.isRead && (
                                                    <Box w="8px" h="8px" bg="blue.500" borderRadius="full" />
                                                )}
                                            </HStack>
                                            <Text fontSize="sm" color="gray.600">
                                                {notification.message}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                                {notification.time}
                                            </Text>
                                        </VStack>
                                    </Box>
                                ))
                            )}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AdminHeader;