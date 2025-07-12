// apps/frontend/src/mvp/availability/components/AvailabilityHeader.tsx
/**
 * Availability Header Component
 * 
 * Page header with title, description, and quick actions.
 * Responsive design with mobile-optimized layout.
 */

import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Button,
    useBreakpointValue,
    Badge,
    Icon
} from '@chakra-ui/react';
import {
    FaCalendarPlus,
    FaHeart,
    FaClock,
    FaUsers
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';

const AvailabilityHeader: React.FC = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const {
        currentView,
        upcomingSlots,
        startCreating
    } = useAvailabilityStore();

    const availableSlots = upcomingSlots.filter(slot => !slot.isBooked).length;
    const bookedSlots = upcomingSlots.filter(slot => slot.isBooked).length;

    const getHeaderContent = () => {
        switch (currentView) {
            case 'create':
                return {
                    title: 'Create Availability',
                    description: 'Set up your dating schedule for the next 7 days',
                    emoji: '📅'
                };
            case 'past':
                return {
                    title: 'Past Availability',
                    description: 'View your completed and expired availability slots',
                    emoji: '📚'
                };
            default:
                return {
                    title: 'Your Availability',
                    description: 'Manage your dating schedule and bookings',
                    emoji: '💕'
                };
        }
    };

    const headerContent = getHeaderContent();

    return (
        <Box
            bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)"
            borderRadius="2xl"
            p={6}
            border="1px solid"
            borderColor="brand.100"
            position="relative"
            overflow="hidden"
        >
            {/* Background decoration */}
            <Box
                position="absolute"
                top="-50px"
                right="-50px"
                w="150px"
                h="150px"
                bg="brand.50"
                borderRadius="full"
                opacity={0.3}
            />

            <VStack spacing={6} position="relative" zIndex={1}>
                {/* Main Header */}
                <VStack spacing={4} textAlign="center" w="full">
                    <VStack spacing={2}>
                        <HStack spacing={3}>
                            <Text fontSize="3xl">{headerContent.emoji}</Text>
                            <Heading
                                size={isMobile ? 'lg' : 'xl'}
                                color="gray.800"
                                textAlign="center"
                            >
                                {headerContent.title}
                            </Heading>
                        </HStack>

                        <Text
                            color="gray.600"
                            fontSize={isMobile ? 'md' : 'lg'}
                            maxW="600px"
                            textAlign="center"
                            lineHeight="1.6"
                        >
                            {headerContent.description}
                        </Text>
                    </VStack>

                    {/* Quick Stats (only for main view) */}
                    {currentView === 'upcoming' && upcomingSlots.length > 0 && (
                        <HStack
                            spacing={6}
                            bg="white"
                            p={4}
                            borderRadius="xl"
                            boxShadow="sm"
                            border="1px solid"
                            borderColor="gray.100"
                        >
                            <VStack spacing={1}>
                                <HStack spacing={2} color="green.500">
                                    <Icon as={FaClock} />
                                    <Text fontSize="lg" fontWeight="bold">
                                        {availableSlots}
                                    </Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                    Available
                                </Text>
                            </VStack>

                            <VStack spacing={1}>
                                <HStack spacing={2} color="brand.500">
                                    <Icon as={FaHeart} />
                                    <Text fontSize="lg" fontWeight="bold">
                                        {bookedSlots}
                                    </Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                    Booked
                                </Text>
                            </VStack>

                            <VStack spacing={1}>
                                <HStack spacing={2} color="blue.500">
                                    <Icon as={FaUsers} />
                                    <Text fontSize="lg" fontWeight="bold">
                                        {upcomingSlots.length}
                                    </Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                    Total
                                </Text>
                            </VStack>
                        </HStack>
                    )}
                </VStack>

                {/* Action Buttons */}
                {currentView !== 'create' && (
                    <HStack spacing={4} w="full" justify="center">
                        <Button
                            variant="love"
                            size={isMobile ? 'md' : 'lg'}
                            leftIcon={<FaCalendarPlus />}
                            onClick={startCreating}
                            className="heart-beat"
                            px={isMobile ? 4 : 8}
                        >
                            {isMobile ? 'Add Slots' : 'Create New Availability'}
                        </Button>
                    </HStack>
                )}

                {/* Help Text */}
                {currentView === 'upcoming' && upcomingSlots.length === 0 && (
                    <VStack spacing={3} textAlign="center">
                        <Text color="gray.500" fontSize="sm">
                            💡 Tip: Regular availability increases your match rate by 300%
                        </Text>
                        <HStack spacing={4} fontSize="sm" color="gray.400">
                            <HStack spacing={1}>
                                <Text>📅</Text>
                                <Text>Easy scheduling</Text>
                            </HStack>
                            <HStack spacing={1}>
                                <Text>⚡</Text>
                                <Text>Instant bookings</Text>
                            </HStack>
                            <HStack spacing={1}>
                                <Text>💬</Text>
                                <Text>Auto matching</Text>
                            </HStack>
                        </HStack>
                    </VStack>
                )}

                {/* Status Badge for Create View */}
                {currentView === 'create' && (
                    <Badge
                        colorScheme="green"
                        variant="subtle"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                    >
                        Next 7 days available for scheduling
                    </Badge>
                )}
            </VStack>
        </Box>
    );
};

export default AvailabilityHeader;