// apps/frontend/src/mvp/availability/components/AvailabilityStats.tsx
/**
 * Availability Stats Component
 * 
 * Displays quick statistics about user's availability performance.
 * Shows metrics like booking rate, upcoming slots, and trends.
 */

import React from 'react';
import {
    Box,
    HStack,
    VStack,
    Text,
    Progress,
    Grid,
    GridItem,
    Icon,
    useBreakpointValue,
    Tooltip,
    Badge
} from '@chakra-ui/react';
import {
    FaCalendarAlt,
    FaHeart,
    FaClock,
    FaUsers,
    FaChartLine,
    FaFire
} from 'react-icons/fa';

interface AvailabilityStatsProps {
    stats: {
        totalSlots: number;
        bookedSlots: number;
        availableSlots: number;
        upcomingSlots: number;
    };
}

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: number | string;
    color: string;
    tooltip?: string;
    badge?: string;
    progress?: {
        value: number;
        max: number;
        colorScheme: string;
    };
}

const StatCard: React.FC<StatCardProps> = ({
    icon,
    label,
    value,
    color,
    tooltip,
    badge,
    progress
}) => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const card = (
        <Box
            bg="white"
            p={4}
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.100"
            _hover={{
                borderColor: `${color}.200`,
                transform: 'translateY(-1px)',
                boxShadow: 'md'
            }}
            transition="all 0.2s ease"
            cursor={tooltip ? 'pointer' : 'default'}
            position="relative"
        >
            {badge && (
                <Badge
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme={color}
                    variant="subtle"
                    fontSize="2xs"
                    borderRadius="full"
                >
                    {badge}
                </Badge>
            )}

            <VStack spacing={3} align="center">
                <HStack spacing={2}>
                    <Icon as={icon} color={`${color}.500`} boxSize={isMobile ? 4 : 5} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium" textAlign="center">
                        {label}
                    </Text>
                </HStack>

                <Text fontSize={isMobile ? 'xl' : '2xl'} fontWeight="bold" color="gray.800">
                    {value}
                </Text>

                {progress && (
                    <Box w="full">
                        <Progress
                            value={progress.value}
                            max={progress.max}
                            colorScheme={progress.colorScheme}
                            size="sm"
                            borderRadius="full"
                            bg="gray.100"
                        />
                        <Text fontSize="2xs" color="gray.500" textAlign="center" mt={1}>
                            {Math.round((progress.value / progress.max) * 100)}%
                        </Text>
                    </Box>
                )}
            </VStack>
        </Box>
    );

    if (tooltip) {
        return (
            <Tooltip label={tooltip} placement="top" hasArrow>
                {card}
            </Tooltip>
        );
    }

    return card;
};

const AvailabilityStats: React.FC<AvailabilityStatsProps> = ({ stats }) => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const bookingRate = stats.totalSlots > 0
        ? Math.round((stats.bookedSlots / stats.totalSlots) * 100)
        : 0;

    const getBookingRateColor = (rate: number) => {
        if (rate >= 70) return 'green';
        if (rate >= 40) return 'yellow';
        return 'red';
    };

    const getBookingRateBadge = (rate: number) => {
        if (rate >= 70) return 'Excellent';
        if (rate >= 40) return 'Good';
        if (rate >= 20) return 'Fair';
        return 'Low';
    };

    const statCards = [
        {
            icon: FaCalendarAlt,
            label: 'Total Slots',
            value: stats.totalSlots,
            color: 'blue',
            tooltip: 'Total availability slots created'
        },
        {
            icon: FaClock,
            label: 'Upcoming',
            value: stats.upcomingSlots,
            color: 'brand',
            tooltip: 'Slots available for booking in the future',
            badge: stats.upcomingSlots > 5 ? 'Active' : undefined
        },
        {
            icon: FaHeart,
            label: 'Booked',
            value: stats.bookedSlots,
            color: 'green',
            tooltip: 'Slots that have been booked by others',
            badge: stats.bookedSlots > 0 ? 'Popular' : undefined
        },
        {
            icon: FaUsers,
            label: 'Available',
            value: stats.availableSlots,
            color: 'purple',
            tooltip: 'Open slots ready for booking'
        }
    ];

    // Add booking rate card if there are total slots
    if (stats.totalSlots > 0) {
        statCards.push({
            icon: FaChartLine,
            label: 'Booking Rate',
            value: bookingRate,
            color: getBookingRateColor(bookingRate),
            tooltip: 'Percentage of your slots that get booked',
            badge: getBookingRateBadge(bookingRate)
        });
    }

    return (
        <Box>
            <VStack spacing={4} align="stretch">
                {/* Header */}
                <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                        <HStack spacing={2}>
                            <Icon as={FaFire} color="orange.500" />
                            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                                Quick Stats
                            </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                            Your availability performance overview
                        </Text>
                    </VStack>

                    {/* Overall Performance Badge */}
                    {stats.totalSlots > 0 && (
                        <Badge
                            colorScheme={getBookingRateColor(bookingRate)}
                            variant="solid"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="sm"
                        >
                            {getBookingRateBadge(bookingRate)} Performance
                        </Badge>
                    )}
                </HStack>
            </VStack>

            {/* Stats Grid */}
            <Grid
                templateColumns={{
                    base: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)',
                    lg: `repeat(${Math.min(statCards.length, 5)}, 1fr)`
                }}
                gap={4}
            >
                {statCards.map((stat, index) => (
                    <GridItem key={index}>
                        <StatCard {...stat} />
                    </GridItem>
                ))}
            </Grid>

            {/* Booking Rate Progress Bar (if applicable) */}
            {stats.totalSlots > 0 && (
                <Box
                    bg="white"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    <VStack spacing={3}>
                        <HStack justify="space-between" w="full">
                            <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                    Booking Success Rate
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    {stats.bookedSlots} out of {stats.totalSlots} slots booked
                                </Text>
                            </VStack>
                            <Text fontSize="lg" fontWeight="bold" color={`${getBookingRateColor(bookingRate)}.500`}>
                                {bookingRate}%
                            </Text>
                        </HStack>

                        <Progress
                            value={bookingRate}
                            max={100}
                            colorScheme={getBookingRateColor(bookingRate)}
                            size="lg"
                            borderRadius="full"
                            bg="gray.100"
                            w="full"
                        />

                        <HStack justify="space-between" w="full" fontSize="xs" color="gray.500">
                            <Text>0%</Text>
                            <Text>50%</Text>
                            <Text>100%</Text>
                        </HStack>
                    </VStack>
                </Box>
            )}

            {/* Tips for Improvement */}
            {stats.totalSlots > 0 && bookingRate < 50 && (
                <Box
                    bg="blue.50"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="blue.200"
                >
                    <VStack align="start" spacing={2}>
                        <HStack spacing={2}>
                            <Icon as={FaChartLine} color="blue.500" />
                            <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                                💡 Tips to Increase Bookings
                            </Text>
                        </HStack>
                        <VStack align="start" spacing={1} fontSize="xs" color="blue.600">
                            <Text>• Create more slots during popular times (evenings & weekends)</Text>
                            <Text>• Add detailed notes about what kind of date you're looking for</Text>
                            <Text>• Try offering both online and offline date options</Text>
                            <Text>• Keep your profile updated with recent photos and interests</Text>
                        </VStack>
                    </VStack>
                </Box>
            )}
        </Box >
    );
};

export default AvailabilityStats;