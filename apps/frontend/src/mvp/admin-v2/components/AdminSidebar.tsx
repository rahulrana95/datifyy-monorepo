// apps/frontend/src/mvp/admin-v2/components/AdminSidebar.tsx

import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Icon,
    useColorModeValue,
    Divider,
    Badge,
    Tooltip,
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiUsers,
    FiHeart,
    FiDollarSign,
    FiBarChart,
    FiSettings,
    FiShield,
    FiMessageSquare,
    FiCalendar,
    FiTrendingUp,
    FiAlertTriangle,
    FiList,
} from 'react-icons/fi';

interface SidebarItem {
    label: string;
    path: string;
    icon: React.ElementType;
    badge?: string | number;
    description?: string;
    isNew?: boolean;
    isComingSoon?: boolean;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
    {
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: FiHome,
        description: 'Overview and key metrics',
    },
    {
        label: 'User Management',
        path: '/admin/users',
        icon: FiUsers,
        description: 'Manage platform users',
        isComingSoon: true,
    },
    {
        label: 'Date Curation',
        path: '/admin/curate-dates',
        icon: FiHeart,
        badge: 'New',
        description: 'Curate and manage dates',
        isNew: true,
        isComingSoon: false,
    },
    {
        label: 'Dates Management',
        path: '/admin/dates-management',
        icon: FiList,
        badge: 'New',
        description: 'View and manage curated dates',
        isNew: true,
        isComingSoon: false,
    },
    {
        label: 'Revenue Analytics',
        path: '/admin/revenue',
        icon: FiDollarSign,
        badge: 'New',
        description: 'Financial insights and reports',
        isNew: true,
        isComingSoon: false,
    },
    {
        label: 'Match Analytics',
        path: '/admin/analytics',
        icon: FiBarChart,
        description: 'Matching performance metrics',
        isComingSoon: true,
    },
    {
        label: 'Content Moderation',
        path: '/admin/moderation',
        icon: FiShield,
        description: 'Review reported content',
        isComingSoon: true,
    },
    {
        label: 'Communication',
        path: '/admin/communication',
        icon: FiMessageSquare,
        description: 'Messaging and notifications',
        isComingSoon: true,
    },
    {
        label: 'Events & Scheduling',
        path: '/admin/events',
        icon: FiCalendar,
        description: 'Manage events and availability',
        isComingSoon: true,
    },
    {
        label: 'System Health',
        path: '/admin/system',
        icon: FiTrendingUp,
        description: 'Performance monitoring',
        isComingSoon: true,
    },
    {
        label: 'Settings',
        path: '/admin/settings',
        icon: FiSettings,
        description: 'Platform configuration',
        isComingSoon: true,
    },
];

interface AdminSidebarProps {
    isCollapsed?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed = false }) => {
    const location = useLocation();

    // Theme colors
    const sidebarBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const activeBg = useColorModeValue('brand.50', 'brand.900');
    const activeColor = useColorModeValue('brand.600', 'brand.300');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const mutedColor = useColorModeValue('gray.500', 'gray.400');

    const isActiveRoute = (path: string): boolean => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <Box
            bg={sidebarBg}
            borderRight="1px solid"
            borderColor={borderColor}
            w={isCollapsed ? '80px' : '280px'}
            h="100vh"
            position="fixed"
            left={0}
            top={0}
            transition="width 0.2s"
            overflow="hidden"
            zIndex={20}
        >
            {/* Logo/Brand */}
            <Box p={6} borderBottom="1px solid" borderColor={borderColor}>
                <HStack spacing={3}>
                    <Box
                        w="40px"
                        h="40px"
                        bg="brand.500"
                        borderRadius="lg"
                        display="flex"
                        // align="center"
                        // justify="center"
                        color="white"
                        fontWeight="bold"
                        fontSize="lg"
                    >
                        D
                    </Box>
                    {!isCollapsed && (
                        <VStack align="flex-start" spacing={0}>
                            <Text fontSize="lg" fontWeight="bold" color={textColor}>
                                Datifyy Admin
                            </Text>
                            <Text fontSize="xs" color={mutedColor}>
                                Dashboard
                            </Text>
                        </VStack>
                    )}
                </HStack>
            </Box>

            {/* Navigation Menu */}
            <VStack spacing={1} p={4} align="stretch">
                {SIDEBAR_ITEMS.map((item) => {
                    const isActive = isActiveRoute(item.path);

                    const menuItem = item.isComingSoon ? (
                        <Box
                            w="full"
                            cursor="not-allowed"
                            opacity={0.6}
                        >
                            <HStack
                                p={3}
                                borderRadius="lg"
                                bg={isActive ? activeBg : 'transparent'}
                                color={isActive ? activeColor : textColor}
                                spacing={3}
                                transition="all 0.2s"
                            >
                                <Icon as={item.icon} boxSize="20px" />

                                {!isCollapsed && (
                                    <>
                                        <Text fontSize="sm" fontWeight="medium" flex="1">
                                            {item.label}
                                        </Text>

                                        {/* Badges */}
                                        {item.isNew && (
                                            <Badge colorScheme="green" variant="solid" fontSize="xs">
                                                New
                                            </Badge>
                                        )}

                                        {item.isComingSoon && (
                                            <Badge colorScheme="gray" variant="outline" fontSize="xs">
                                                Soon
                                            </Badge>
                                        )}

                                        {item.badge && !item.isNew && (
                                            <Badge colorScheme="blue" variant="solid" fontSize="xs">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </>
                                )}
                            </HStack>
                        </Box>
                    ) : (
                        <Box
                            as={NavLink}
                            to={item.path}
                            w="full"
                            cursor="pointer"
                            _hover={{ bg: hoverBg }}
                        >
                            <HStack
                                p={3}
                                borderRadius="lg"
                                bg={isActive ? activeBg : 'transparent'}
                                color={isActive ? activeColor : textColor}
                                spacing={3}
                                transition="all 0.2s"
                            >
                                <Icon as={item.icon} boxSize="20px" />

                                {!isCollapsed && (
                                    <>
                                        <Text fontSize="sm" fontWeight="medium" flex="1">
                                            {item.label}
                                        </Text>

                                        {/* Badges */}
                                        {item.isNew && (
                                            <Badge colorScheme="green" variant="solid" fontSize="xs">
                                                New
                                            </Badge>
                                        )}

                                        {item.badge && !item.isNew && (
                                            <Badge colorScheme="blue" variant="solid" fontSize="xs">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </>
                                )}
                            </HStack>
                        </Box>
                    );

                    // Wrap with tooltip when collapsed
                    if (isCollapsed) {
                        return (
                            <Tooltip
                                key={item.path}
                                label={`${item.label}${item.description ? ` - ${item.description}` : ''}`}
                                placement="right"
                                hasArrow
                            >
                                {menuItem}
                            </Tooltip>
                        );
                    }

                    return <Box key={item.path}>{menuItem}</Box>;
                })}
            </VStack>

            {/* Footer */}
            {!isCollapsed && (
                <Box mt="auto" p={4}>
                    <Divider mb={4} />

                    <VStack spacing={3} align="stretch">
                        {/* System Status */}
                        <HStack spacing={3} p={3} bg={hoverBg} borderRadius="lg">
                            <Icon as={FiTrendingUp} color="green.500" />
                            <VStack align="flex-start" spacing={0} flex="1">
                                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                    System Status
                                </Text>
                                <Text fontSize="xs" color="green.600">
                                    All systems operational
                                </Text>
                            </VStack>
                        </HStack>

                        {/* Quick Stats */}
                        <HStack spacing={3} p={3} bg={hoverBg} borderRadius="lg">
                            <Icon as={FiAlertTriangle} color="orange.500" />
                            <VStack align="flex-start" spacing={0} flex="1">
                                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                    Active Alerts
                                </Text>
                                <Text fontSize="xs" color={mutedColor}>
                                    2 pending reviews
                                </Text>
                            </VStack>
                        </HStack>
                    </VStack>
                </Box>
            )}
        </Box>
    );
};

export default AdminSidebar;