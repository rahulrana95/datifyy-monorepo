// apps/frontend/src/mvp/availability/components/AvailabilityPastList.tsx
/**
 * Availability Past List Component
 * 
 * Displays past/expired availability slots with completion status.
 * Shows historical data and booking outcomes.
 */

import React from 'react';
import {
    VStack,
    HStack,
    Grid,
    Card,
    CardBody,
    Text,
    Badge,
    Box,
    Avatar,
    Divider,
    Icon,
    useBreakpointValue
} from '@chakra-ui/react';
import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaUser,
    FaCheckCircle,
    FaTimesCircle,
    FaVideo,
    FaCommentDots,
    FaHeart
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import { AvailabilitySlot, DateType, BookingStatus } from '../types';

const AvailabilityPastList: React.FC = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const { pastSlots, startCreating } = useAvailabilityStore();

    const formatDateTime = (slot: AvailabilitySlot) => {
        const date = new Date(slot.availabilityDate + 'T00:00:00');
        const dateStr = date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const startTime = new Date(`2000-01-01T${slot.startTime}`);
        const endTime = new Date(`2000-01-01T${slot.endTime}`);
        const timeStr = `${startTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })} - ${endTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })}`;

        return { dateStr, timeStr };
    };

    const getStatusInfo = (slot: AvailabilitySlot) => {
        if (!slot.isBooked || !slot.booking) {
            return {
                status: 'Expired',
                color: 'gray',
                icon: FaTimesCircle,
                description: 'No one booked this slot'
            };
        }

        const booking = slot.booking;
        switch (booking.bookingStatus) {
            case BookingStatus.COMPLETED:
                return {
                    status: 'Completed',
                    color: 'green',
                    icon: FaCheckCircle,
                    description: 'Date was completed successfully'
                };
            case BookingStatus.CANCELLED:
                return {
                    status: 'Cancelled',
                    color: 'red',
                    icon: FaTimesCircle,
                    description: booking.cancellationReason || 'Booking was cancelled'
                };
            case BookingStatus.CONFIRMED:
                return {
                    status: 'Was Confirmed',
                    color: 'blue',
                    icon: FaCheckCircle,
                    description: 'Date was confirmed but outcome unknown'
                };
            default:
                return {
                    status: 'Expired',
                    color: 'gray',
                    icon: FaTimesCircle,
                    description: 'Booking expired'
                };
        }
    };

    const renderSlotCard = (slot: AvailabilitySlot) => {
        const { dateStr, timeStr } = formatDateTime(slot);
        const statusInfo = getStatusInfo(slot);
        const isBooked = slot.isBooked && slot.booking;

        return (
            <Card
                key={slot.id}
                variant="subtle"
                className="interactive"
                _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'md'
                }}
                border="1px solid"
                borderColor="gray.200"
                bg="gray.50"
                opacity={0.8}
            >
                <CardBody p={4}>
                    <VStack spacing={4} align="stretch">
                        {/* Header */}
                        <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={1} flex={1}>
                                <HStack spacing={2}>
                                    <FaCalendarAlt color="#9ca3af" size="14px" />
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                        {dateStr}
                                    </Text>
                                </HStack>
                                <HStack spacing={2}>
                                    <FaClock color="#9ca3af" size="14px" />
                                    <Text fontSize="md" fontWeight="bold" color="gray.700">
                                        {timeStr}
                                    </Text>
                                </HStack>
                            </VStack>

                            <VStack spacing={2} align="end">
                                <Badge
                                    colorScheme={statusInfo.color}
                                    variant="solid"
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                >
                                    <Icon as={statusInfo.icon} boxSize={3} />
                                    {statusInfo.status}
                                </Badge>
                            </VStack>
                        </HStack>

                        {/* Date Type & Location */}
                        <HStack spacing={4}>
                            <HStack spacing={2}>
                                {slot.dateType === DateType.ONLINE ? (
                                    <FaVideo color="#6b7280" size="14px" />
                                ) : (
                                    <FaMapMarkerAlt color="#6b7280" size="14px" />
                                )}
                                <Text fontSize="sm" color="gray.500">
                                    {slot.dateType === DateType.ONLINE ? 'Online Date' : 'Offline Date'}
                                </Text>
                            </HStack>

                            {slot.locationPreference && (
                                <Text fontSize="sm" color="gray.400">
                                    • {slot.locationPreference}
                                </Text>
                            )}
                        </HStack>

                        {/* Status Description */}
                        <Box
                            bg="white"
                            p={3}
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="gray.200"
                        >
                            <Text fontSize="sm" color="gray.600" fontStyle="italic">
                                {statusInfo.description}
                            </Text>
                        </Box>

                        {/* Booking Details */}
                        {isBooked && slot.booking && (
                            <>
                                <Divider />
                                <Box>
                                    <VStack spacing={3} align="stretch">
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                            Booking Details:
                                        </Text>

                                        <HStack spacing={3}>
                                            <Avatar
                                                size="sm"
                                                name={`${slot.booking.bookedByUser.firstName} ${slot.booking.bookedByUser.lastName}`}
                                                src={slot.booking.bookedByUser.profileImage}
                                            />
                                            <VStack align="start" spacing={0} flex={1}>
                                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                                    {slot.booking.bookedByUser.firstName} {slot.booking.bookedByUser.lastName}
                                                </Text>
                                                <HStack spacing={4} fontSize="xs" color="gray.500">
                                                    <Text>Activity: {slot.booking.selectedActivity}</Text>
                                                    <Text>
                                                        Booked: {new Date(slot.booking.createdAt).toLocaleDateString()}
                                                    </Text>
                                                </HStack>
                                            </VStack>
                                        </HStack>

                                        {slot.booking.bookingNotes && (
                                            <Box bg="gray.100" p={3} borderRadius="md">
                                                <Text fontSize="xs" color="gray.500" mb={1}>Their message:</Text>
                                                <Text fontSize="sm" color="gray.700" fontStyle="italic">
                                                    "{slot.booking.bookingNotes}"
                                                </Text>
                                            </Box>
                                        )}
                                    </VStack>
                                </Box>
                            </>
                        )}

                        {/* Your Notes */}
                        {slot.notes && (
                            <>
                                <Divider />
                                <Box>
                                    <HStack spacing={2} mb={2}>
                                        <FaCommentDots color="#9ca3af" size="12px" />
                                        <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                            Your Notes:
                                        </Text>
                                    </HStack>
                                    <Text fontSize="sm" color="gray.600" fontStyle="italic">
                                        {slot.notes}
                                    </Text>
                                </Box>
                            </>
                        )}
                    </VStack>
                </CardBody>
            </Card>
        );
    };

    // Group slots by month for better organization
    const groupSlotsByMonth = (slots: AvailabilitySlot[]) => {
        const groups: Record<string, AvailabilitySlot[]> = {};

        slots.forEach(slot => {
            const date = new Date(slot.availabilityDate + 'T00:00:00');
            const monthKey = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            });

            if (!groups[monthKey]) {
                groups[monthKey] = [];
            }
            groups[monthKey].push(slot);
        });

        // Sort months by date (most recent first)
        const sortedMonths = Object.keys(groups).sort((a, b) => {
            const dateA = new Date(a + ' 1');
            const dateB = new Date(b + ' 1');
            return dateB.getTime() - dateA.getTime();
        });

        return sortedMonths.map(month => ({
            month,
            slots: groups[month].sort((a, b) =>
                new Date(b.availabilityDate).getTime() - new Date(a.availabilityDate).getTime()
            )
        }));
    };

    // Empty state
    if (pastSlots.length === 0) {
        return (
            <VStack spacing={6} py={12} textAlign="center">
                <Box fontSize="6xl">📚</Box>
                <VStack spacing={2}>
                    <Text fontSize="xl" fontWeight="bold" color="gray.700">
                        No Past Availability
                    </Text>
                    <Text color="gray.500" maxW="400px">
                        You haven't had any past availability slots yet. Your completed and expired slots will appear here.
                    </Text>
                </VStack>
                <Text fontSize="sm" color="gray.400">
                    💡 Create your first availability to start building your dating history
                </Text>
            </VStack>
        );
    }

    const monthGroups = groupSlotsByMonth(pastSlots);
    const completedCount = pastSlots.filter(slot =>
        slot.booking?.bookingStatus === BookingStatus.COMPLETED
    ).length;
    const bookedCount = pastSlots.filter(slot => slot.isBooked).length;

    return (
        <VStack spacing={6} align="stretch">
            {/* Header Stats */}
            <Box
                bg="white"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
            >
                <VStack spacing={3}>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                        Your Dating History
                    </Text>

                    <HStack spacing={8} justify="center">
                        <VStack spacing={1}>
                            <HStack spacing={2} color="gray.600">
                                <FaCalendarAlt />
                                <Text fontSize="lg" fontWeight="bold">
                                    {pastSlots.length}
                                </Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Total Slots
                            </Text>
                        </VStack>

                        <VStack spacing={1}>
                            <HStack spacing={2} color="blue.500">
                                <FaUser />
                                <Text fontSize="lg" fontWeight="bold">
                                    {bookedCount}
                                </Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Were Booked
                            </Text>
                        </VStack>

                        <VStack spacing={1}>
                            <HStack spacing={2} color="green.500">
                                <FaHeart />
                                <Text fontSize="lg" fontWeight="bold">
                                    {completedCount}
                                </Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Completed
                            </Text>
                        </VStack>
                    </HStack>

                    {pastSlots.length > 0 && (
                        <Text fontSize="sm" color="gray.500">
                            Success Rate: {Math.round((completedCount / pastSlots.length) * 100)}%
                        </Text>
                    )}
                </VStack>
            </Box>

            {/* Monthly Groups */}
            {monthGroups.map(({ month, slots }) => (
                <VStack key={month} spacing={4} align="stretch">
                    <HStack spacing={3} align="center">
                        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                            {month}
                        </Text>
                        <Badge colorScheme="gray" variant="subtle">
                            {slots.length} slot{slots.length !== 1 ? 's' : ''}
                        </Badge>
                        <Box flex={1} height="1px" bg="gray.200" />
                    </HStack>

                    <Grid
                        templateColumns={{
                            base: '1fr',
                            md: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)'
                        }}
                        gap={4}
                    >
                        {slots.map(renderSlotCard)}
                    </Grid>
                </VStack>
            ))}
        </VStack>
    );
};

export default AvailabilityPastList;