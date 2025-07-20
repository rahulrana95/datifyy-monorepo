// apps/frontend/src/mvp/header/HeaderNavigation.tsx
import React from 'react';
import { Box, Button, HStack, VStack, Icon, Badge } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import AvailabilityNavLink from './AvailabilityNavLink';
import { useDateCuration } from '../date-curation/hooks/useDateCuration';
import { useAuthStore } from '../login-signup';

interface NavItem {
    label: string;
    path: string;
    icon?: React.ComponentType;
    requiresAuth?: boolean;
    showBadge?: boolean;
}

interface HeaderNavigationProps {
    isMobile?: boolean;
    onItemClick?: () => void;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
    isMobile = false,
    onItemClick
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuthStore();

    // Get pending dates count for badge
    const { summary } = useDateCuration();

    // Your existing active link logic
    const isActive = (path: string) => location.pathname === path;

    // Updated navigation items with enhanced dates link
    const navItems: NavItem[] = [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/about-us' },
        { label: 'Partner Preferences', path: '/partner-preferences', requiresAuth: true },
        {
            label: "My Dates",
            path: "/dates",
            icon: FaHeart,
            requiresAuth: true,
            showBadge: true
        }
    ];

    const handleNavClick = (item: NavItem) => {
        navigate(item.path);
        onItemClick?.(); // Close mobile menu if needed
    };

    // Filter nav items based on auth status
    const visibleNavItems = navItems.filter(item =>
        !item.requiresAuth || (item.requiresAuth && isAuthenticated)
    );

    const Container = isMobile ? VStack : HStack;
    const containerProps = isMobile
        ? { spacing: 2, align: 'stretch' as const }
        : { spacing: 6 };

    const getPendingDatesCount = () => {
        return summary.pendingConfirmation + summary.upcomingDates;
    };

    return (
        <Container {...containerProps}>
            {visibleNavItems.map((item) => (
                <Box key={item.path} position="relative">
                    <Button
                        variant="ghost"
                        size={isMobile ? 'md' : 'sm'}
                        onClick={() => handleNavClick(item)}
                        justifyContent={isMobile ? 'flex-start' : 'center'}
                        w={isMobile ? 'full' : 'auto'}
                        color={isActive(item.path) ? 'brand.500' : 'gray.600'}
                        fontWeight={isActive(item.path) ? 'bold' : 'medium'}
                        leftIcon={item.icon ? <Icon as={item.icon} /> : undefined}
                        _hover={{
                            bg: 'brand.50',
                            color: 'brand.600',
                            transform: 'scale(1.05)',
                            transition: '0.2s ease-in-out'
                        }}
                        cursor="pointer"
                        className={item.path === '/dates' ? 'heart-beat' : ''}
                    >
                        {item.label}

                        {/* Badge for pending dates */}
                        {item.showBadge && item.path === '/dates' && isAuthenticated && getPendingDatesCount() > 0 && (
                            <Badge
                                ml={2}
                                colorScheme="brand"
                                variant="solid"
                                borderRadius="full"
                                fontSize="xs"
                                minW="18px"
                                h="18px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {getPendingDatesCount()}
                            </Badge>
                        )}
                    </Button>

                    {/* Active indicator for desktop */}
                    {isActive(item.path) && !isMobile && (
                        <Box
                            position="absolute"
                            bottom="-2px"
                            left="50%"
                            transform="translateX(-50%)"
                            w="80%"
                            h="2px"
                            bg="brand.500"
                            borderRadius="full"
                        />
                    )}
                </Box>
            ))}
            <AvailabilityNavLink variant="button" showBadge={true} />
        </Container>
    );
};

export default HeaderNavigation;