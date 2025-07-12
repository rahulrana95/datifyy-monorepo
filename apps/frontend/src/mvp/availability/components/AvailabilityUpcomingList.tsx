// apps/frontend/src/mvp/availability/components/AvailabilityUpcomingList.tsx
/**
 * Availability Upcoming List Component
 * 
 * Displays upcoming availability slots with booking status and actions.
 * Features edit, cancel, and booking management functionality.
 */

import React, { useState } from 'react';
import {
    VStack,
    HStack,
    Grid,
    GridItem,
    Card,
    CardBody,
    Text,
    Badge,
    Button,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Alert,
    AlertIcon,
    AlertDescription,
    useDisclosure,
    useToast,
    Box,
    Avatar,
    Tooltip,
    Flex,
    Divider
} from '@chakra-ui/react';
import {
    FaEdit,
    FaTrash,
    FaEllipsisV,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaUser,
    FaHeart,
    FaVideo,
    FaCommentDots
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import { AvailabilitySlot, DateType, BookingStatus } from '../types';
import AvailabilitySlotEditModal from './AvailabilitySlotEditModal';

const AvailabilityUpcomingList: React.FC = () => {
    const toast = useToast();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);

    const {
        upcomingSlots,
        isDeleting,
        deleteAvailability,
        startCreating
    } = useAvailabilityStore();

    const handleEdit = (slot: AvailabilitySlot) => {
        setEditingSlot(slot);
        onEditOpen();
    };

    const handleDelete = async (slot: AvailabilitySlot) => {
        if (!slot.id) return;

        const success = await deleteAvailability(slot.id);
        if (success) {
            toast({
                title: 'Slot Deleted',
                description: 'Your availability slot has been removed',
                status: 'info',
                duration: 3000,
                isClosable: true
            });
        }
    };

    const formatDateTime = (slot: AvailabilitySlot) => {
        const date = new Date(slot.availabilityDate + 'T00:00:00');
        const dateStr = date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
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

    const getStatusBadge = (slot: AvailabilitySlot) => {
        if (slot.isBooked && slot.booking) {
            const status = slot.booking.bookingStatus;
            switch (status) {
                case BookingStatus.CONFIRMED:
                    return <Badge colorScheme="green" variant="solid">Confirmed</Badge>;
                case BookingStatus.PENDING:
                    return <Badge colorScheme="yellow" variant="solid">Pending</Badge>;
                case BookingStatus.CANCELLED:
                    return <Badge colorScheme="red" variant="subtle">Cancelled</Badge>;
                default:
                    return <Badge colorScheme="blue" variant="solid">Booked</Badge>;
            }
        }
        return <Badge colorScheme="gray" variant="outline">Available</Badge>;
    };

    const renderSlotCard = (slot: AvailabilitySlot) => {
        const { dateStr, timeStr } = formatDateTime(slot);
        const isBooked = slot.isBooked && slot.booking;

        return (
            <Card
                key={slot.id}
                variant="elevated"
                className="interactive"
                _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg'
                }}
                border="1px solid"
                borderColor={isBooked ? 'green.200' : 'gray.200'}
                bg={isBooked ? 'green.50' : 'white'}
            >
                <CardBody p={4}>
                    <VStack spacing={4} align="stretch">
                        {/* Header */}
                        <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={1} flex={1}>
                                <HStack spacing={2}>
                                    <FaCalendarAlt color="#e85d75" size="14px" />
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                        {dateStr}
                                    </Text>
                                </HStack>
                                <HStack spacing={2}>
                                    <FaClock color="#6b7280" size="14px" />
                                    <Text fontSize="md" fontWeight="bold" color="gray.800">
                                        {timeStr}
                                    </Text>
                                </HStack>
                            </VStack>

                            <HStack spacing={2}>
                                {getStatusBadge(slot)}
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<FaEllipsisV />}
                                        variant="ghost"
                                        size="sm"
                                        isDisabled={isDeleting}
                                    />
                                    <MenuList>
                                        <MenuItem icon={<FaEdit />} onClick={() => handleEdit(slot)}>
                                            Edit Slot
                                        </MenuItem>
                                        <MenuItem
                                            icon={<FaTrash />}
                                            onClick={() => handleDelete(slot)}
                                            color="red.500"
                                        >
                                            Delete Slot
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </HStack>

                        {/* Date Type & Location */}
                        <HStack spacing={4}>
                            <HStack spacing={2}>
                                {slot.dateType === DateType.ONLINE ? (
                                    <FaVideo color="#3b82f6" size="14px" />
                                ) : (
                                    <FaMapMarkerAlt color="#ef4444" size="14px" />
                                )}
                                <Text fontSize="sm" color="gray.600">
                                    {slot.dateType === DateType.ONLINE ? 'Online Date' : 'Offline Date'}
                                </Text>
                            </HStack>

                            {slot.locationPreference && (
                                <Text fontSize="sm" color="gray.500">
                                    • {slot.locationPreference}
                                </Text>
                            )}
                        </HStack>

                        {/* Booking Details */}
                        {isBooked && slot.booking && (
                            <Box
                                bg="white"
                                p={3}
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="green.200"
                            >
                                <VStack spacing={2} align="stretch">
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" fontWeight="semibold" color="green.700">
                                            Booked by:
                                        </Text>
                                        <Badge
                                            colorScheme={slot.booking.bookingStatus === BookingStatus.CONFIRMED ? 'green' : 'yellow'}
                                            size="sm"
                                        >
                                            {slot.booking.bookingStatus}
                                        </Badge>
                                    </HStack>

                                    <HStack spacing={3}>
                                        <Avatar
                                            size="sm"
                                            name={`${slot.booking.bookedByUser.firstName} ${slot.booking.bookedByUser.lastName}`}
                                            src={slot.booking.bookedByUser.profileImage}
                                        />
                                        <VStack align="start" spacing={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="medium">
                                                {slot.booking.bookedByUser.firstName} {slot.booking.bookedByUser.lastName}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                                Activity: {slot.booking.selectedActivity}
                                            </Text>
                                        </VStack>
                                    </HStack>

                                    {slot.booking.bookingNotes && (
                                        <Box>
                                            <Text fontSize="xs" color="gray.500" mb={1}>Message:</Text>
                                            <Text fontSize="sm" color="gray.700" fontStyle="italic">
                                                "{slot.booking.bookingNotes}"
                                            </Text>
                                        </Box>
                                    )}
                                </VStack>
                            </Box>
                        )}

                        {/* Notes */}
                        {slot.notes && (
                            <Box>
                                <HStack spacing={2} mb={1}>
                                    <FaCommentDots color="#6b7280" size="12px" />
                                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                        Your Notes:
                                    </Text>
                                </HStack>
                                <Text fontSize="sm" color="gray.600" fontStyle="italic">
                                    {slot.notes}
                                </Text>
                            </Box>
                        )}
                    </VStack>
                </CardBody>
            </Card>
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

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <HStack justify="space-between" align="center">
                <VStack align="start" spacing={1}>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                        Your Upcoming Availability
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                        {upcomingSlots.length} slot{upcomingSlots.length !== 1 ? 's' : ''} •
                        {upcomingSlots.filter(s => s.isBooked).length} booked •
                        {upcomingSlots.filter(s => !s.isBooked).length} available
                    </Text>
                </VStack>

                <Button
                    variant="outline"
                    colorScheme="brand"
                    leftIcon={<FaCalendarAlt />}
                    onClick={startCreating}
                    size="md"
                >
                    Add More Slots
                </Button>
            </HStack>

            {/* Slots Grid */}
            <Grid
                templateColumns={{
                    base: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)'
                }}
                gap={4}
            >
                {upcomingSlots.map(renderSlotCard)}
            </Grid>

            {/* Edit Modal */}
            {editingSlot && (
                <AvailabilitySlotEditModal
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    slot={editingSlot}
                    onSlotUpdated={() => {
                        setEditingSlot(null);
                        onEditClose();
                    }}
                />
            )}
        </VStack>
    );
};

export default AvailabilityUpcomingList;