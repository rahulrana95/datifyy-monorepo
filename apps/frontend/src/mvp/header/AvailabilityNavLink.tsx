// apps/frontend/src/mvp/header/AvailabilityNavLink.tsx
/**
 * Availability Navigation Link
 * 
 * Component to be added to your existing header navigation.
 * Highlights the availability feature prominently.
 */

import React from 'react';
import {
    Button,
    Badge,
    HStack,
    Text,
    useBreakpointValue,
    Tooltip
} from '@chakra-ui/react';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAvailabilityStore } from '../availability/store/availabilityStore';

interface AvailabilityNavLinkProps {
    variant?: 'button' | 'link';
    showBadge?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const AvailabilityNavLink: React.FC<AvailabilityNavLinkProps> = ({
    variant = 'button',
    showBadge = true,
    size = 'md'
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const { upcomingSlots } = useAvailabilityStore();

    const isActive = location.pathname === '/availability';
    const availableSlots = upcomingSlots.filter(slot => !slot.isBooked).length;
    const hasUpcoming = upcomingSlots.length > 0;

    const handleClick = () => {
        navigate('/availability');
    };

    const getButtonVariant = () => {
        if (isActive) return 'solid';
        if (hasUpcoming) return 'love';
        return 'outline';
    };

    const getButtonColorScheme = () => {
        if (isActive) return 'brand';
        if (hasUpcoming) return 'brand';
        return 'gray';
    };

    if (variant === 'link') {
        return (
            <Tooltip
                label={`${availableSlots} available slots`}
                placement="bottom"
                isDisabled={!showBadge || availableSlots === 0}
            >
                <Button
                    variant="ghost"
                    size={size}
                    onClick={handleClick}
                    color={isActive ? 'brand.500' : 'gray.600'}
                    fontWeight={isActive ? 'bold' : 'medium'}
                    position="relative"
                    _hover={{
                        color: 'brand.500',
                        bg: 'brand.50'
                    }}
                >
                    <HStack spacing={2}>
                        <FaCalendarAlt size={isMobile ? '16px' : '18px'} />
                        {!isMobile && <Text>Availability</Text>}
                    </HStack>

                    {showBadge && availableSlots > 0 && (
                        <Badge
                            colorScheme="green"
                            variant="solid"
                            borderRadius="full"
                            fontSize="xs"
                            position="absolute"
                            top="-1"
                            right="-1"
                            minW="20px"
                            h="20px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            {availableSlots}
                        </Badge>
                    )}
                </Button>
            </Tooltip>
        );
    }

    return (
        <Tooltip
            label={hasUpcoming ? "Manage your dating availability" : "Set up your availability"}
            placement="bottom"
        >
            <Button
                variant={getButtonVariant()}
                colorScheme={getButtonColorScheme()}
                size={size}
                onClick={handleClick}
                leftIcon={<FaCalendarAlt />}
                position="relative"
                className={hasUpcoming ? "heart-beat" : undefined}
                _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: hasUpcoming ? '0 8px 25px rgba(232, 93, 117, 0.4)' : 'md'
                }}
            >
                <HStack spacing={2}>
                    <Text>{isMobile ? 'Dates' : 'Availability'}</Text>
                    {hasUpcoming && !isMobile && (
                        <FaClock size="14px" />
                    )}
                </HStack>

                {showBadge && availableSlots > 0 && (
                    <Badge
                        colorScheme={isActive ? "white" : "green"}
                        variant="solid"
                        borderRadius="full"
                        fontSize="2xs"
                        position="absolute"
                        top="-1"
                        right="-1"
                        minW="18px"
                        h="18px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="2px solid white"
                    >
                        {availableSlots}
                    </Badge>
                )}
            </Button>
        </Tooltip>
    );
};

export default AvailabilityNavLink;