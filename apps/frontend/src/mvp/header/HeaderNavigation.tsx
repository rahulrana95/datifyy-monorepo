// apps/frontend/src/mvp/header/HeaderNavigation.tsx
import React from 'react';
import { Box, Button, HStack, VStack } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import AvailabilityNavLink from './AvailabilityNavLink';

interface NavItem {
    label: string;
    path: string;
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

    // Your existing active link logic
    const isActive = (path: string) => location.pathname === path;

    // Updated navigation items with Partner Preferences
    const navItems: NavItem[] = [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/about-us' },
        { label: 'Partner Preferences', path: '/partner-preferences' },
    ];

    const handleNavClick = (item: NavItem) => {
        navigate(item.path);
        onItemClick?.(); // Close mobile menu if needed
    };

    const Container = isMobile ? VStack : HStack;
    const containerProps = isMobile
        ? { spacing: 2, align: 'stretch' as const }
        : { spacing: 6 };

    return (
        <Container {...containerProps}>
            {navItems.map((item) => (
                <Box key={item.path} position="relative">
                    <Button
                        variant="ghost"
                        size={isMobile ? 'md' : 'sm'}
                        onClick={() => handleNavClick(item)}
                        justifyContent={isMobile ? 'flex-start' : 'center'}
                        w={isMobile ? 'full' : 'auto'}
                        color={isActive(item.path) ? 'brand.500' : 'gray.600'}
                        fontWeight={isActive(item.path) ? 'bold' : 'medium'}
                        _hover={{
                            bg: 'brand.50',
                            color: 'brand.600',
                            transform: 'scale(1.05)',
                            transition: '0.2s ease-in-out'
                        }}
                        cursor="pointer"
                    >
                        {item.label}
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