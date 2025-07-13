// apps/frontend/src/mvp/availability/components/AvailabilityCalendarView.tsx
/**
 * Availability Calendar View Component
 * 
 * Calendar-style grid showing time slots across multiple days.
 * Y-axis: Time slots (9 AM - 9 PM)
 * X-axis: Days of the week
 * Visual distinction for online/offline and booked/available slots
 */

import React from 'react';
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
    useColorModeValue,
    useBreakpointValue,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useToast
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
    FaGlobeAmericas
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import { AvailabilitySlot, DateType, BookingStatus, AVAILABILITY_CONSTANTS } from '../types';

interface CalendarSlot {
    slot?: AvailabilitySlot;
    timeSlot: string;
    date: string;
    isEmpty: boolean;
}

const AvailabilityCalendarView: React.FC = () => {
    const toast = useToast();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const {
        upcomingSlots,
        availableDays,
        isDeleting,
        deleteAvailability
    } = useAvailabilityStore();

    // Color mode values following theme
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
                bg: 'swipe.like.50',
                borderColor: 'swipe.like.300',
                borderWidth: '2px',
                _hover: {
                    bg: 'swipe.like.100',
                    transform: 'scale(1.02)'
                }
            };
        }

        if (isOnline) {
            return {
                bg: 'swipe.superLike.50',
                borderColor: 'swipe.superLike.300',
                borderWidth: '2px',
                _hover: {
                    bg: 'swipe.superLike.100',
                    transform: 'scale(1.02)'
                }
            };
        }

        return {
            bg: 'swipe.boost.50',
            borderColor: 'swipe.boost.300',
            borderWidth: '2px',
            _hover: {
                bg: 'swipe.boost.100',
                transform: 'scale(1.02)'
            }
        };
    };

    const getSlotIcon = (slot: AvailabilitySlot) => {
        if (slot.isBooked && slot.booking) {
            const status = slot.booking.bookingStatus;
            switch (status) {
                case BookingStatus.CONFIRMED:
                    return { icon: FaCheckCircle, color: 'swipe.like.600' };
                case BookingStatus.PENDING:
                    return { icon: FaUserClock, color: 'warning.500' };
                case BookingStatus.CANCELLED:
                    return { icon: FaExclamationTriangle, color: 'swipe.nope.500' };
                default:
                    return { icon: FaUser, color: 'swipe.like.600' };
            }
        }

        if (slot.dateType === DateType.ONLINE) {
            return { icon: FaVideo, color: 'swipe.superLike.600' };
        }

        return { icon: FaMapMarkerAlt, color: 'swipe.boost.600' };
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
                    minH="60px"
                    border="1px solid"
                    borderRadius="md"
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
            <Tooltip
                key={`${calendarSlot.date}-${calendarSlot.timeSlot}`}
                label={
                    <VStack spacing={1} align="start" p={2}>
                        <Text fontWeight="bold">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </Text>
                        <HStack spacing={2}>
                            <Icon as={iconInfo.icon} color={iconInfo.color} />
                            <Text>{slot.dateType === DateType.ONLINE ? 'Online' : 'Offline'}</Text>
                        </HStack>
                        {isBooked && (
                            <Text color="green.400">
                                Booked by {slot.booking?.bookedByUser.firstName}
                            </Text>
                        )}
                        {slot.locationPreference && (
                            <Text fontSize="sm">📍 {slot.locationPreference}</Text>
                        )}
                        {slot.notes && (
                            <Text fontSize="sm" fontStyle="italic">
                                "{slot.notes}"
                            </Text>
                        )}
                    </VStack>
                }
                placement="top"
                hasArrow
            >
                <Box
                    position="relative"
                    minH="60px"
                    border="1px solid"
                    borderRadius="md"
                    p={2}
                    cursor="pointer"
                    transition="all 0.2s ease"
                    {...cellStyles}
                    role="group"
                >
                    <VStack spacing={1} h="full" justify="center">
                        <HStack spacing={1}>
                            <Icon as={iconInfo.icon} color={iconInfo.color} boxSize={3} />
                            {isBooked && (
                                <Badge
                                    size="xs"
                                    colorScheme="green"
                                    variant="solid"
                                    fontSize="2xs"
                                >
                                    Booked
                                </Badge>
                            )}
                        </HStack>

                        <Text fontSize="2xs" color="gray.600" textAlign="center" lineHeight="tight">
                            {slot.dateType === DateType.ONLINE ? 'Online' : 'Offline'}
                        </Text>

                        {slot.locationPreference && (
                            <Text fontSize="2xs" color="gray.500" textAlign="center" noOfLines={1}>
                                {slot.locationPreference}
                            </Text>
                        )}
                    </VStack>

                    {/* Action Menu */}
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
                        />
                        <MenuList>
                            <MenuItem icon={<FaEdit />} fontSize="sm">
                                Edit Slot
                            </MenuItem>
                            <MenuItem
                                icon={<FaTrash />}
                                fontSize="sm"
                                color="swipe.nope.500"
                                onClick={() => handleDeleteSlot(slot)}
                                _hover={{ bg: 'swipe.nope.50' }}
                            >
                                Delete Slot
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Tooltip>
        );
    };

    const calendarMatrix = createCalendarMatrix();
    const days = availableDays.slice(0, 7);

    return (
        <Box overflow="auto" maxW="full">
            <Card variant="elevated">
                <CardBody p={0}>
                    <VStack spacing={0} align="stretch">
                        {/* Header with Days */}
                        <Grid
                            templateColumns={`100px repeat(${days.length}, 1fr)`}
                            gap={0}
                            borderBottom="2px solid"
                            borderColor={borderColor}
                        >
                            {/* Empty corner cell */}
                            <Box
                                bg={timeHeaderBg}
                                p={3}
                                borderRight="1px solid"
                                borderColor={borderColor}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <VStack spacing={1}>
                                    <HStack spacing={1}>
                                        <Icon as={FaClock} color="gray.500" boxSize={3} />
                                        <Text fontSize="xs" color="gray.600" fontWeight="semibold">
                                            Time
                                        </Text>
                                    </HStack>
                                    <HStack spacing={1}>
                                        <Icon as={FaGlobeAmericas} color="gray.500" boxSize={3} />
                                        <Text fontSize="2xs" color="gray.500">
                                            {Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1] || 'Local'}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Box>

                            {/* Day headers */}
                            {days.map((day) => {
                                const dateInfo = formatDate(day.date);
                                return (
                                    <Box
                                        key={day.date}
                                        bg={dayHeaderBg}
                                        p={3}
                                        borderRight="1px solid"
                                        borderColor={borderColor}
                                        textAlign="center"
                                        _last={{ borderRight: 'none' }}
                                    >
                                        <VStack spacing={1}>
                                            <Text fontSize="sm" fontWeight="bold" color="brand.700">
                                                {dateInfo.dayName}
                                            </Text>
                                            <Text fontSize="lg" fontWeight="bold" color="brand.800">
                                                {dateInfo.dayNumber}
                                            </Text>
                                            <Text fontSize="xs" color="brand.600">
                                                {dateInfo.month}
                                            </Text>
                                            {day.isToday && (
                                                <Badge colorScheme="brand" size="sm" variant="solid">
                                                    Today
                                                </Badge>
                                            )}
                                        </VStack>
                                    </Box>
                                );
                            })}
                        </Grid>

                        {/* Time rows */}
                        {calendarMatrix.map((row, timeIndex) => (
                            <Grid
                                key={AVAILABILITY_CONSTANTS.TIME_SLOTS[timeIndex].value}
                                templateColumns={`100px repeat(${days.length}, 1fr)`}
                                gap={0}
                                borderBottom="1px solid"
                                borderColor={borderColor}
                                _last={{ borderBottom: 'none' }}
                                role="group"
                            >
                                {/* Time label */}
                                <Box
                                    bg={timeHeaderBg}
                                    p={3}
                                    borderRight="1px solid"
                                    borderColor={borderColor}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <VStack spacing={0}>
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                            {AVAILABILITY_CONSTANTS.TIME_SLOTS[timeIndex].label}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            1hr slot
                                        </Text>
                                    </VStack>
                                </Box>

                                {/* Slot cells */}
                                {row.map((calendarSlot, dayIndex) => (
                                    <Box
                                        key={`${dayIndex}-${timeIndex}`}
                                        borderRight="1px solid"
                                        borderColor={borderColor}
                                        p={1}
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

            {/* Legend */}
            <Card variant="subtle" mt={4}>
                <CardBody>
                    <VStack spacing={4}>
                        <Text fontSize="md" fontWeight="semibold" color="gray.700">
                            Calendar Legend
                        </Text>

                        <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                            <HStack spacing={3}>
                                <Box
                                    w={4}
                                    h={4}
                                    bg="swipe.superLike.100"
                                    border="2px solid"
                                    borderColor="swipe.superLike.300"
                                    borderRadius="sm"
                                />
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="sm" fontWeight="medium">Online Available</Text>
                                    <HStack spacing={1}>
                                        <Icon as={FaVideo} color="swipe.superLike.600" boxSize={3} />
                                        <Text fontSize="xs" color="gray.500">Video/Voice calls</Text>
                                    </HStack>
                                </VStack>
                            </HStack>

                            <HStack spacing={3}>
                                <Box
                                    w={4}
                                    h={4}
                                    bg="swipe.boost.100"
                                    border="2px solid"
                                    borderColor="swipe.boost.300"
                                    borderRadius="sm"
                                />
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="sm" fontWeight="medium">Offline Available</Text>
                                    <HStack spacing={1}>
                                        <Icon as={FaMapMarkerAlt} color="swipe.boost.600" boxSize={3} />
                                        <Text fontSize="xs" color="gray.500">In-person meetings</Text>
                                    </HStack>
                                </VStack>
                            </HStack>

                            <HStack spacing={3}>
                                <Box
                                    w={4}
                                    h={4}
                                    bg="swipe.like.100"
                                    border="2px solid"
                                    borderColor="swipe.like.300"
                                    borderRadius="sm"
                                />
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="sm" fontWeight="medium">Booked Slots</Text>
                                    <HStack spacing={1}>
                                        <Icon as={FaUser} color="swipe.like.600" boxSize={3} />
                                        <Text fontSize="xs" color="gray.500">Reserved by someone</Text>
                                    </HStack>
                                </VStack>
                            </HStack>

                            <HStack spacing={3}>
                                <Box
                                    w={4}
                                    h={4}
                                    bg="white"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    borderRadius="sm"
                                />
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="sm" fontWeight="medium">Empty Slots</Text>
                                    <Text fontSize="xs" color="gray.500">Available for booking</Text>
                                </VStack>
                            </HStack>
                        </Grid>

                        <Text fontSize="xs" color="gray.500" textAlign="center">
                            💡 Hover over slots for details • Click menu (⋮) to edit or delete
                        </Text>
                    </VStack>
                </CardBody>
            </Card>
        </Box>
    );
};

export default AvailabilityCalendarView;