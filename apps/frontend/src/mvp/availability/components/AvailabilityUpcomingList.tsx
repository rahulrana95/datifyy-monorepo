// apps/frontend/src/mvp/availability/components/AvailabilityUpcomingList.tsx
/**
 * Fixed Availability Upcoming List Component
 * 
 * Fixes:
 * 1. Working calendar/list view toggle
 * 2. Proper booking data display in calendar
 * 3. Enhanced list view with better booking visibility
 * 4. Improved mobile responsiveness
 */

import React, { useState } from 'react';
import {
    VStack,
    HStack,
    Grid,
    Card,
    CardBody,
    Text,
    Badge,
    Button,
    useDisclosure,
    useBreakpointValue,
    Box,
    Icon,
    ButtonGroup,
    Avatar,
    Divider,
    SimpleGrid,
    Flex,
    Tooltip,
    useColorModeValue
} from '@chakra-ui/react';
import {
    FaCalendarAlt,
    FaClock,
    FaUser,
    FaHeart,
    FaVideo,
    FaMapMarkerAlt,
    FaTh,
    FaList,
    FaEdit,
    FaTrash,
    FaEye,
    FaCommentDots,
    FaPhone,
    FaEnvelope
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import { AvailabilitySlot, DateType, BookingStatus } from '../types';
import AvailabilityCalendarView from './AvailabilityCalendarView';
import AvailabilitySlotEditModal from './AvailabilitySlotEditModal';

type ViewMode = 'calendar' | 'list';

const AvailabilityUpcomingList: React.FC = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    const {
        upcomingSlots,
        startCreating,
        deleteAvailability,
        isDeleting
    } = useAvailabilityStore();

    const handleEdit = (slot: AvailabilitySlot) => {
        setEditingSlot(slot);
        onEditOpen();
    };

    const handleDelete = async (slot: AvailabilitySlot) => {
        if (!slot.id) return;
        await deleteAvailability(slot.id);
    };

    const handleSlotUpdated = () => {
        setEditingSlot(null);
        onEditClose();
    };

    // Format date and time utilities
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

    // Enhanced List View Component
    const renderListView = () => {
        // Group slots by date for better organization
        const groupedSlots = upcomingSlots.reduce((groups, slot) => {
            const date = slot.availabilityDate;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(slot);
            return groups;
        }, {} as Record<string, AvailabilitySlot[]>);

        const sortedDates = Object.keys(groupedSlots).sort();

        return (
            <VStack spacing={6} align="stretch">
                {sortedDates.map(date => {
                    const daySlots = groupedSlots[date].sort((a, b) =>
                        a.startTime.localeCompare(b.startTime)
                    );

                    const dateObj = new Date(date + 'T00:00:00');
                    const isToday = date === new Date().toISOString().split('T')[0];
                    const dayLabel = isToday ? 'Today' : dateObj.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    });

                    return (
                        <Box key={date}>
                            {/* Date Header */}
                            <HStack spacing={3} mb={4} align="center">
                                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                    {dayLabel}
                                </Text>
                                {isToday && (
                                    <Badge colorScheme="brand" variant="solid">Today</Badge>
                                )}
                                <Badge colorScheme="blue" variant="subtle">
                                    {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''}
                                </Badge>
                                <Box flex={1} height="1px" bg={borderColor} />
                            </HStack>

                            {/* Slots for this date */}
                            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                                {daySlots.map(slot => (
                                    <SlotListCard
                                        key={slot.id}
                                        slot={slot}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        isDeleting={isDeleting}
                                    />
                                ))}
                            </SimpleGrid>
                        </Box>
                    );
                })}
            </VStack>
        );
    };

    // Empty state
    if (upcomingSlots.length === 0) {
        return (
            <VStack spacing={6} py={12} textAlign="center">
                <Box fontSize="6xl">📅</Box>
                <VStack spacing={2}>
                    <Text fontSize="xl" fontWeight="bold" color="gray.700">
                        No Upcoming Availability
                    </Text>
                    <Text color="gray.500" maxW="400px">
                        You haven't created any availability slots yet. Start by creating your first availability to let others book time with you.
                    </Text>
                </VStack>
                <Button
                    variant="love"
                    size="lg"
                    leftIcon={<FaCalendarAlt />}
                    onClick={startCreating}
                    className="heart-beat"
                >
                    Create Your First Availability
                </Button>
            </VStack>
        );
    }

    const availableCount = upcomingSlots.filter(s => !s.isBooked).length;
    const bookedCount = upcomingSlots.filter(s => s.isBooked).length;
    const onlineCount = upcomingSlots.filter(s => s.dateType === 'online').length;
    const offlineCount = upcomingSlots.filter(s => s.dateType === 'offline').length;

    return (
        <VStack spacing={6} align="stretch">
            {/* Enhanced Header with Statistics */}
            <Box
                bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)"
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
            >
                <VStack spacing={4}>
                    <HStack justify="space-between" w="full" align="center" flexWrap="wrap" gap={4}>
                        <VStack align="start" spacing={1}>
                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                Your Upcoming Availability
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                {upcomingSlots.length} total slot{upcomingSlots.length !== 1 ? 's' : ''} available
                            </Text>
                        </VStack>

                        <HStack spacing={3} flexWrap="wrap">
                            {/* View Toggle - Desktop only */}
                            {!isMobile && (
                                <ButtonGroup size="sm" isAttached variant="outline">
                                    <Button
                                        leftIcon={<FaTh />}
                                        onClick={() => setViewMode('calendar')}
                                        variant={viewMode === 'calendar' ? 'solid' : 'outline'}
                                        colorScheme="brand"
                                    >
                                        Calendar
                                    </Button>
                                    <Button
                                        leftIcon={<FaList />}
                                        onClick={() => setViewMode('list')}
                                        variant={viewMode === 'list' ? 'solid' : 'outline'}
                                        colorScheme="brand"
                                    >
                                        List
                                    </Button>
                                </ButtonGroup>
                            )}

                            <Button
                                variant="love"
                                leftIcon={<FaCalendarAlt />}
                                onClick={startCreating}
                                size={isMobile ? "sm" : "md"}
                                className="heart-beat"
                            >
                                {isMobile ? "Add Slots" : "Add More Slots"}
                            </Button>
                        </HStack>
                    </HStack>

                    {/* Statistics */}
                    <Grid templateColumns="repeat(4, 1fr)" gap={4} w="full">
                        <VStack spacing={1} textAlign="center">
                            <HStack spacing={1} color="blue.500" justify="center">
                                <Icon as={FaVideo} boxSize={4} />
                                <Text fontSize="lg" fontWeight="bold">{onlineCount}</Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Online
                            </Text>
                        </VStack>

                        <VStack spacing={1} textAlign="center">
                            <HStack spacing={1} color="orange.500" justify="center">
                                <Icon as={FaMapMarkerAlt} boxSize={4} />
                                <Text fontSize="lg" fontWeight="bold">{offlineCount}</Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Offline
                            </Text>
                        </VStack>

                        <VStack spacing={1} textAlign="center">
                            <HStack spacing={1} color="green.500" justify="center">
                                <Icon as={FaUser} boxSize={4} />
                                <Text fontSize="lg" fontWeight="bold">{bookedCount}</Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Booked
                            </Text>
                        </VStack>

                        <VStack spacing={1} textAlign="center">
                            <HStack spacing={1} color="gray.500" justify="center">
                                <Icon as={FaClock} boxSize={4} />
                                <Text fontSize="lg" fontWeight="bold">{availableCount}</Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Available
                            </Text>
                        </VStack>
                    </Grid>
                </VStack>
            </Box>

            {/* Main Content - Conditional Rendering */}
            <Box>
                {isMobile || viewMode === 'calendar' ? (
                    <AvailabilityCalendarView />
                ) : (
                    renderListView()
                )}
            </Box>

            {/* Edit Modal */}
            {editingSlot && (
                <AvailabilitySlotEditModal
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    slot={editingSlot}
                    onSlotUpdated={handleSlotUpdated}
                />
            )}
        </VStack>
    );
};

// Enhanced Slot List Card Component
const SlotListCard: React.FC<{
    slot: AvailabilitySlot;
    onEdit: (slot: AvailabilitySlot) => void;
    onDelete: (slot: AvailabilitySlot) => void;
    isDeleting: boolean;
}> = ({ slot, onEdit, onDelete, isDeleting }) => {
    const cardBg = useColorModeValue('white', 'gray.800');
    const isBooked = slot.isBooked && slot.booking;

    const formatTime = (timeStr: string) => {
        const time = new Date(`2000-01-01T${timeStr}`);
        return time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusColor = () => {
        if (isBooked) return 'green';
        return slot.dateType === DateType.ONLINE ? 'blue' : 'orange';
    };

    return (
        <Card
            variant="elevated"
            className="interactive"
            _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg'
            }}
            bg={cardBg}
            border="1px solid"
            borderColor={`${getStatusColor()}.200`}
            position="relative"
        >
            <CardBody p={4}>
                <VStack spacing={4} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1} flex={1}>
                            <HStack spacing={2}>
                                <Icon
                                    as={slot.dateType === DateType.ONLINE ? FaVideo : FaMapMarkerAlt}
                                    color={`${getStatusColor()}.500`}
                                />
                                <Text fontSize="md" fontWeight="bold" color="gray.700">
                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </Text>
                            </HStack>
                            <Text fontSize="sm" color="gray.500">
                                {slot.dateType === DateType.ONLINE ? 'Online Date' : 'In-Person Date'}
                            </Text>
                        </VStack>

                        <VStack spacing={2} align="end">
                            <Badge
                                colorScheme={getStatusColor()}
                                variant={isBooked ? 'solid' : 'subtle'}
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                {isBooked ? (
                                    <>
                                        <Icon as={FaUser} boxSize={3} />
                                        Booked
                                    </>
                                ) : (
                                    <>
                                        <Icon as={FaClock} boxSize={3} />
                                        Available
                                    </>
                                )}
                            </Badge>
                        </VStack>
                    </HStack>

                    {/* Booking Details */}
                    {isBooked && slot.booking && (
                        <>
                            <Divider />
                            <Box
                                bg="green.50"
                                p={3}
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="green.200"
                            >
                                <VStack spacing={3} align="stretch">
                                    <HStack spacing={3}>
                                        <Avatar
                                            size="sm"
                                            name={`${slot.booking.bookedByUser.firstName} ${slot.booking.bookedByUser.lastName}`}
                                            src={slot.booking.bookedByUser.profileImage}
                                        />
                                        <VStack align="start" spacing={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="medium" color="green.800">
                                                {slot.booking.bookedByUser.firstName} {slot.booking.bookedByUser.lastName}
                                            </Text>
                                            <Text fontSize="xs" color="green.600">
                                                Activity: {slot.booking.selectedActivity}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                                Status: {slot.booking.bookingStatus}
                                            </Text>
                                        </VStack>
                                    </HStack>

                                    {slot.booking.bookingNotes && (
                                        <Box bg="white" p={2} borderRadius="md" border="1px solid" borderColor="green.200">
                                            <Text fontSize="xs" color="green.600" mb={1} fontWeight="semibold">
                                                Their message:
                                            </Text>
                                            <Text fontSize="sm" color="green.800" fontStyle="italic">
                                                "{slot.booking.bookingNotes}"
                                            </Text>
                                        </Box>
                                    )}

                                    {/* Quick Contact Actions */}
                                    <HStack spacing={2}>
                                        <Tooltip label="Send message">
                                            <Button size="xs" colorScheme="blue" leftIcon={<FaEnvelope />}>
                                                Message
                                            </Button>
                                        </Tooltip>
                                        <Tooltip label="Call them">
                                            <Button size="xs" colorScheme="green" leftIcon={<FaPhone />}>
                                                Call
                                            </Button>
                                        </Tooltip>
                                    </HStack>
                                </VStack>
                            </Box>
                        </>
                    )}

                    {/* Location Preference */}
                    {slot.locationPreference && (
                        <>
                            <Divider />
                            <HStack spacing={2}>
                                <Icon as={FaMapMarkerAlt} color="orange.500" boxSize={3} />
                                <Text fontSize="sm" color="gray.600">
                                    Preferred location: {slot.locationPreference}
                                </Text>
                            </HStack>
                        </>
                    )}

                    {/* Notes */}
                    {slot.notes && (
                        <>
                            <Divider />
                            <HStack spacing={2} align="start">
                                <Icon as={FaCommentDots} color="gray.400" boxSize={3} mt={0.5} />
                                <Text fontSize="sm" color="gray.600" lineHeight="relaxed">
                                    {slot.notes}
                                </Text>
                            </HStack>
                        </>
                    )}

                    {/* Actions */}
                    <Divider />
                    <HStack spacing={2} justify="flex-end">
                        <Tooltip label="View details">
                            <Button size="sm" variant="ghost" leftIcon={<FaEye />}>
                                View
                            </Button>
                        </Tooltip>
                        <Tooltip label="Edit slot">
                            <Button
                                size="sm"
                                variant="outline"
                                leftIcon={<FaEdit />}
                                onClick={() => onEdit(slot)}
                            >
                                Edit
                            </Button>
                        </Tooltip>
                        <Tooltip label="Delete slot">
                            <Button
                                size="sm"
                                variant="outline"
                                colorScheme="red"
                                leftIcon={<FaTrash />}
                                onClick={() => onDelete(slot)}
                                isLoading={isDeleting}
                            >
                                Delete
                            </Button>
                        </Tooltip>
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
};

export default AvailabilityUpcomingList;