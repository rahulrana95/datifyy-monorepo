// apps/frontend/src/mvp/availability/components/AvailabilityDesktopCalendarGrid.tsx
/**
 * Enhanced Desktop Calendar Grid Component
 * 
 * Features:
 * - Full week grid view with time slots
 * - Enhanced booking visibility
 * - Quick actions on hover
 * - Detailed slot information
 */

import React, { useState } from 'react';
import {
    Box,
    Grid,
    Text,
    VStack,
    HStack,
    Card,
    CardBody,
    Badge,
    Tooltip,
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue,
    useToast,
    Avatar,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    Button,
    Divider,
    Flex
} from '@chakra-ui/react';
import {
    FaVideo,
    FaMapMarkerAlt,
    FaClock,
    FaUser,
    FaCheckCircle,
    FaUserClock,
    FaExclamationTriangle,
    FaEllipsisV,
    FaEdit,
    FaTrash,
    FaGlobeAmericas,
    FaPhone,
    FaEnvelope,
    FaEye,
    FaCalendarAlt,
    FaHeart
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import { AvailabilitySlot, DateType, BookingStatus, AVAILABILITY_CONSTANTS } from '../types';

interface CalendarSlot {
    slot?: AvailabilitySlot;
    timeSlot: string;
    date: string;
    isEmpty: boolean;
}

interface SlotPopoverProps {
    slot: AvailabilitySlot;
    children: React.ReactNode;
    onEdit: (slot: AvailabilitySlot) => void;
    onDelete: (slot: AvailabilitySlot) => void;
}

const SlotPopover: React.FC<SlotPopoverProps> = ({ slot, children, onEdit, onDelete }) => {
    const isBooked = slot.isBooked && slot.booking;
    const toast = useToast();

    const formatTime = (timeStr: string) => {
        const time = new Date(`2000-01-01T${timeStr}`);
        return time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleContact = (type: 'email' | 'phone') => {
        if (!isBooked) return;

        toast({
            title: `${type === 'email' ? 'Email' : 'Call'} ${slot.booking!.bookedByUser.firstName}`,
            description: `Opening ${type === 'email' ? 'email client' : 'phone app'}...`,
            status: 'info',
            duration: 2000,
        });
    };

    return (
        <Popover trigger="hover" placement="auto">
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent w="320px" boxShadow="xl" borderRadius="xl">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader borderBottomWidth="1px" bg="gray.50" borderTopRadius="xl">
                    <VStack spacing={1} align="start">
                        <HStack spacing={2}>
                            <Icon
                                as={slot.dateType === DateType.ONLINE ? FaVideo : FaMapMarkerAlt}
                                color={slot.dateType === DateType.ONLINE ? 'blue.500' : 'orange.500'}
                            />
                            <Text fontWeight="bold">
                                {slot.dateType === DateType.ONLINE ? 'Online' : 'Offline'} Slot
                            </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </Text>
                    </VStack>
                </PopoverHeader>
                <PopoverBody p={4}>
                    <VStack spacing={4} align="stretch">
                        {/* Booking Status */}
                        {isBooked ? (
                            <Box
                                bg="green.50"
                                p={3}
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="green.200"
                            >
                                <VStack spacing={3} align="stretch">
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" fontWeight="bold" color="green.800">
                                            Booked by
                                        </Text>
                                        <Badge colorScheme="green" size="sm">
                                            {slot.booking!.bookingStatus}
                                        </Badge>
                                    </HStack>

                                    <HStack spacing={3}>
                                        <Avatar
                                            size="sm"
                                            name={`${slot.booking!.bookedByUser.firstName} ${slot.booking!.bookedByUser.lastName}`}
                                            src={slot.booking!.bookedByUser.profileImage}
                                        />
                                        <VStack align="start" spacing={0}>
                                            <Text fontSize="sm" fontWeight="medium">
                                                {slot.booking!.bookedByUser.firstName} {slot.booking!.bookedByUser.lastName}
                                            </Text>
                                            <Text fontSize="xs" color="green.600">
                                                {slot.booking!.selectedActivity}
                                            </Text>
                                        </VStack>
                                    </HStack>

                                    {slot.booking!.bookingNotes && (
                                        <Box bg="white" p={2} borderRadius="md" border="1px solid" borderColor="green.200">
                                            <Text fontSize="xs" color="green.700" fontStyle="italic">
                                                "{slot.booking!.bookingNotes}"
                                            </Text>
                                        </Box>
                                    )}

                                    {/* Quick Contact */}
                                    <HStack spacing={2}>
                                        <Button
                                            size="xs"
                                            colorScheme="blue"
                                            leftIcon={<FaEnvelope />}
                                            onClick={() => handleContact('email')}
                                            flex={1}
                                        >
                                            Email
                                        </Button>
                                        <Button
                                            size="xs"
                                            colorScheme="green"
                                            leftIcon={<FaPhone />}
                                            onClick={() => handleContact('phone')}
                                            flex={1}
                                        >
                                            Call
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Box>
                        ) : (
                            <Box
                                bg="gray.50"
                                p={3}
                                borderRadius="lg"
                                textAlign="center"
                                border="1px dashed"
                                borderColor="gray.300"
                            >
                                <VStack spacing={2}>
                                    <Icon as={FaUserClock} color="gray.400" boxSize={5} />
                                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                        Available for Booking
                                    </Text>
                                </VStack>
                            </Box>
                        )}

                        {/* Location/Notes */}
                        {(slot.locationPreference || slot.notes) && (
                            <>
                                <Divider />
                                <VStack spacing={2} align="stretch">
                                    {slot.locationPreference && (
                                        <HStack spacing={2}>
                                            <Icon as={FaMapMarkerAlt} color="orange.500" boxSize={3} />
                                            <Text fontSize="xs" color="gray.600">
                                                {slot.locationPreference}
                                            </Text>
                                        </HStack>
                                    )}
                                    {slot.notes && (
                                        <Text fontSize="xs" color="gray.600" fontStyle="italic">
                                            {slot.notes}
                                        </Text>
                                    )}
                                </VStack>
                            </>
                        )}

                        {/* Actions */}
                        <Divider />
                        <HStack spacing={2}>
                            <Button
                                size="xs"
                                variant="outline"
                                leftIcon={<FaEdit />}
                                onClick={() => onEdit(slot)}
                                flex={1}
                            >
                                Edit
                            </Button>
                            <Button
                                size="xs"
                                variant="outline"
                                colorScheme="red"
                                leftIcon={<FaTrash />}
                                onClick={() => onDelete(slot)}
                                flex={1}
                            >
                                Delete
                            </Button>
                        </HStack>
                    </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

interface DesktopCalendarGridProps {
    onEdit: (slot: AvailabilitySlot) => void;
    onDelete: (slot: AvailabilitySlot) => void;
}

const AvailabilityDesktopCalendarGrid: React.FC<DesktopCalendarGridProps> = ({
    onEdit,
    onDelete
}) => {
    const toast = useToast();

    const {
        upcomingSlots,
        availableDays,
        deleteAvailability,
        isDeleting
    } = useAvailabilityStore();

    // Color mode values
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const timeHeaderBg = useColorModeValue('gray.50', 'gray.700');
    const dayHeaderBg = useColorModeValue('brand.50', 'brand.900');
    const emptySlotBg = useColorModeValue('white', 'gray.800');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');

    const handleDeleteSlot = async (slot: AvailabilitySlot) => {
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

    // Create calendar matrix
    const createCalendarMatrix = (): CalendarSlot[][] => {
        const matrix: CalendarSlot[][] = [];

        // For each time slot
        AVAILABILITY_CONSTANTS.TIME_SLOTS.forEach((timeSlot) => {
            const row: CalendarSlot[] = [];

            // For each day
            availableDays.slice(0, 7).forEach((day) => {
                const existingSlot = upcomingSlots.find(
                    slot => slot.availabilityDate === day.date && slot.startTime === timeSlot.value
                );

                row.push({
                    slot: existingSlot,
                    timeSlot: timeSlot.value,
                    date: day.date,
                    isEmpty: !existingSlot
                });
            });

            matrix.push(row);
        });

        return matrix;
    };

    const getSlotStyles = (calendarSlot: CalendarSlot) => {
        if (calendarSlot.isEmpty) {
            return {
                bg: emptySlotBg,
                borderColor: borderColor,
                _hover: { bg: hoverBg }
            };
        }

        const slot = calendarSlot.slot!;
        const isBooked = slot.isBooked && slot.booking;
        const isOnline = slot.dateType === DateType.ONLINE;

        if (isBooked) {
            return {
                bg: 'green.50',
                borderColor: 'green.300',
                borderWidth: '2px',
                _hover: {
                    bg: 'green.100',
                    transform: 'scale(1.02)'
                }
            };
        }

        if (isOnline) {
            return {
                bg: 'blue.50',
                borderColor: 'blue.300',
                borderWidth: '2px',
                _hover: {
                    bg: 'blue.100',
                    transform: 'scale(1.02)'
                }
            };
        }

        return {
            bg: 'orange.50',
            borderColor: 'orange.300',
            borderWidth: '2px',
            _hover: {
                bg: 'orange.100',
                transform: 'scale(1.02)'
            }
        };
    };

    const getSlotIcon = (slot: AvailabilitySlot) => {
        if (slot.isBooked && slot.booking) {
            const status = slot.booking.bookingStatus;
            switch (status) {
                case BookingStatus.CONFIRMED:
                    return { icon: FaCheckCircle, color: 'green.600' };
                case BookingStatus.PENDING:
                    return { icon: FaUserClock, color: 'yellow.600' };
                case BookingStatus.CANCELLED:
                    return { icon: FaExclamationTriangle, color: 'red.500' };
                default:
                    return { icon: FaUser, color: 'green.600' };
            }
        }

        if (slot.dateType === DateType.ONLINE) {
            return { icon: FaVideo, color: 'blue.600' };
        }

        return { icon: FaMapMarkerAlt, color: 'orange.600' };
    };

    const formatTime = (timeStr: string) => {
        const time = new Date(`2000-01-01T${timeStr}`);
        return time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        return {
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' })
        };
    };

    const renderSlotCell = (calendarSlot: CalendarSlot) => {
        const cellStyles = getSlotStyles(calendarSlot);

        if (calendarSlot.isEmpty) {
            return (
                <Box
                    key={`${calendarSlot.date}-${calendarSlot.timeSlot}`}
                    minH="80px"
                    border="1px solid"
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    transition="all 0.2s ease"
                    {...cellStyles}
                >
                    <Text fontSize="xs" color="gray.400">
                        Available
                    </Text>
                </Box>
            );
        }

        const slot = calendarSlot.slot!;
        const iconInfo = getSlotIcon(slot);
        const isBooked = slot.isBooked && slot.booking;

        return (
            <SlotPopover
                key={`${calendarSlot.date}-${calendarSlot.timeSlot}`}
                slot={slot}
                onEdit={onEdit}
                onDelete={handleDeleteSlot}
            >
                <Box
                    position="relative"
                    minH="80px"
                    border="1px solid"
                    borderRadius="lg"
                    p={3}
                    cursor="pointer"
                    transition="all 0.2s ease"
                    {...cellStyles}
                    role="group"
                >
                    <VStack spacing={2} h="full" justify="space-between">
                        {/* Top section - Icon and status */}
                        <HStack spacing={2} w="full" justify="space-between">
                            <Icon as={iconInfo.icon} color={iconInfo.color} boxSize={4} />
                            {isBooked && (
                                <Badge
                                    size="xs"
                                    colorScheme="green"
                                    variant="solid"
                                    fontSize="2xs"
                                    borderRadius="full"
                                >
                                    ✓
                                </Badge>
                            )}
                        </HStack>

                        {/* Middle section - Type */}
                        <Text fontSize="xs" color="gray.600" textAlign="center" fontWeight="medium">
                            {slot.dateType === DateType.ONLINE ? 'Online' : 'In-person'}
                        </Text>

                        {/* Bottom section - User info if booked */}
                        {isBooked ? (
                            <VStack spacing={1} w="full">
                                <Avatar
                                    size="xs"
                                    name={`${slot.booking!.bookedByUser.firstName} ${slot.booking!.bookedByUser.lastName}`}
                                    src={slot.booking!.bookedByUser.profileImage}
                                />
                                <Text fontSize="2xs" color="green.700" textAlign="center" noOfLines={1} fontWeight="medium">
                                    {slot.booking!.bookedByUser.firstName}
                                </Text>
                            </VStack>
                        ) : (
                            <Text fontSize="2xs" color="gray.500" textAlign="center">
                                Open
                            </Text>
                        )}

                        {/* Location indicator */}
                        {slot.locationPreference && (
                            <Text fontSize="2xs" color="gray.400" textAlign="center" noOfLines={1}>
                                📍 {slot.locationPreference}
                            </Text>
                        )}
                    </VStack>

                    {/* Quick action menu - appears on hover */}
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            icon={<FaEllipsisV />}
                            variant="ghost"
                            size="xs"
                            position="absolute"
                            top={1}
                            right={1}
                            isDisabled={isDeleting}
                            opacity={0}
                            _groupHover={{ opacity: 1 }}
                            _hover={{ opacity: 1 }}
                            bg="white"
                            boxShadow="sm"
                        />
                        <MenuList fontSize="sm">
                            <MenuItem icon={<FaEye />} fontSize="sm">
                                View Details
                            </MenuItem>
                            <MenuItem icon={<FaEdit />} fontSize="sm" onClick={() => onEdit(slot)}>
                                Edit Slot
                            </MenuItem>
                            <MenuItem
                                icon={<FaTrash />}
                                fontSize="sm"
                                color="red.500"
                                onClick={() => handleDeleteSlot(slot)}
                                _hover={{ bg: 'red.50' }}
                            >
                                Delete Slot
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </SlotPopover>
        );
    };

    const calendarMatrix = createCalendarMatrix();
    const days = availableDays.slice(0, 7);

    return (
        <Box overflow="auto" maxW="full">
            <Card variant="elevated" boxShadow="lg">
                <CardBody p={0}>
                    <VStack spacing={0} align="stretch">
                        {/* Header with Days */}
                        <Grid
                            templateColumns={`120px repeat(${days.length}, 1fr)`}
                            gap={0}
                            borderBottom="2px solid"
                            borderColor={borderColor}
                        >
                            {/* Time column header */}
                            <Box
                                bg={timeHeaderBg}
                                p={4}
                                borderRight="1px solid"
                                borderColor={borderColor}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <VStack spacing={1}>
                                    <HStack spacing={2}>
                                        <Icon as={FaClock} color="gray.500" boxSize={4} />
                                        <Text fontSize="sm" color="gray.600" fontWeight="bold">
                                            Time
                                        </Text>
                                    </HStack>
                                    <HStack spacing={1}>
                                        <Icon as={FaGlobeAmericas} color="gray.500" boxSize={3} />
                                        <Text fontSize="xs" color="gray.500">
                                            {Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1] || 'Local'}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Box>

                            {/* Day headers */}
                            {days.map((day) => {
                                const dateInfo = formatDate(day.date);
                                const daySlots = upcomingSlots.filter(slot => slot.availabilityDate === day.date);
                                const bookedSlots = daySlots.filter(slot => slot.isBooked).length;

                                return (
                                    <Box
                                        key={day.date}
                                        bg={dayHeaderBg}
                                        p={4}
                                        borderRight="1px solid"
                                        borderColor={borderColor}
                                        textAlign="center"
                                        _last={{ borderRight: 'none' }}
                                    >
                                        <VStack spacing={2}>
                                            <Text fontSize="sm" fontWeight="bold" color="brand.700">
                                                {dateInfo.dayName}
                                            </Text>
                                            <Text fontSize="xl" fontWeight="bold" color="brand.800">
                                                {dateInfo.dayNumber}
                                            </Text>
                                            <Text fontSize="xs" color="brand.600">
                                                {dateInfo.month}
                                            </Text>

                                            {/* Day badges */}
                                            <VStack spacing={1}>
                                                {day.isToday && (
                                                    <Badge colorScheme="brand" size="sm" variant="solid">
                                                        Today
                                                    </Badge>
                                                )}
                                                {daySlots.length > 0 && (
                                                    <HStack spacing={1}>
                                                        <Badge colorScheme="blue" size="sm" variant="subtle">
                                                            {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''}
                                                        </Badge>
                                                        {bookedSlots > 0 && (
                                                            <Badge colorScheme="green" size="sm" variant="solid">
                                                                {bookedSlots} <Icon as={FaHeart} boxSize={2} ml={1} />
                                                            </Badge>
                                                        )}
                                                    </HStack>
                                                )}
                                            </VStack>
                                        </VStack>
                                    </Box>
                                );
                            })}
                        </Grid>

                        {/* Time rows */}
                        {calendarMatrix.map((row, timeIndex) => (
                            <Grid
                                key={AVAILABILITY_CONSTANTS.TIME_SLOTS[timeIndex].value}
                                templateColumns={`120px repeat(${days.length}, 1fr)`}
                                gap={0}
                                borderBottom="1px solid"
                                borderColor={borderColor}
                                _last={{ borderBottom: 'none' }}
                                minH="80px"
                            >
                                {/* Time label */}
                                <Box
                                    bg={timeHeaderBg}
                                    p={4}
                                    borderRight="1px solid"
                                    borderColor={borderColor}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <VStack spacing={1}>
                                        <Text fontSize="md" fontWeight="bold" color="gray.700">
                                            {AVAILABILITY_CONSTANTS.TIME_SLOTS[timeIndex].label}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            1 hour
                                        </Text>
                                    </VStack>
                                </Box>

                                {/* Slot cells */}
                                {row.map((calendarSlot, dayIndex) => (
                                    <Box
                                        key={`${dayIndex}-${timeIndex}`}
                                        borderRight="1px solid"
                                        borderColor={borderColor}
                                        p={2}
                                        _last={{ borderRight: 'none' }}
                                    >
                                        {renderSlotCell(calendarSlot)}
                                    </Box>
                                ))}
                            </Grid>
                        ))}
                    </VStack>
                </CardBody>
            </Card>
        </Box>
    );
};

export default AvailabilityDesktopCalendarGrid;