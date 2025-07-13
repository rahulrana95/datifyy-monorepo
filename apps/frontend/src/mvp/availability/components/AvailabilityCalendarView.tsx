// apps/frontend/src/mvp/availability/components/AvailabilityCalendarView.tsx
/**
 * Mobile-Optimized Availability Calendar View Component
 * 
 * Enhanced with:
 * - Mobile-first responsive design
 * - Better booking visibility
 * - Improved slot actions
 * - Touch-friendly interactions
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
    Button,
    useColorModeValue,
    useBreakpointValue,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Avatar,
    Flex,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
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
    FaEye,
    FaPhone,
    FaEnvelope,
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import { AvailabilitySlot, DateType, BookingStatus, AVAILABILITY_CONSTANTS } from '../types';
import AvailabilityDesktopCalendarGrid from './AvailabilityDesktopCalendarGrid';

interface CalendarSlot {
    slot?: AvailabilitySlot;
    timeSlot: string;
    date: string;
    isEmpty: boolean;
}

interface SlotDetailsProps {
    slot: AvailabilitySlot;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (slot: AvailabilitySlot) => void;
    onDelete: (slot: AvailabilitySlot) => void;
}

const SlotDetailsDrawer: React.FC<SlotDetailsProps> = ({
    slot,
    isOpen,
    onClose,
    onEdit,
    onDelete
}) => {
    const isBooked = slot.isBooked && slot.booking;
    const { deleteAvailability, isDeleting } = useAvailabilityStore();
    const toast = useToast();

    const handleDelete = async () => {
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
            onClose();
        }
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
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} size="lg">
            <DrawerOverlay />
            <DrawerContent borderTopRadius="xl" maxH="80vh">
                <DrawerCloseButton />
                <DrawerHeader
                    bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)"
                    borderTopRadius="xl"
                    pb={4}
                >
                    <VStack spacing={2} align="start">
                        <HStack spacing={3}>
                            <Icon
                                as={slot.dateType === DateType.ONLINE ? FaVideo : FaMapMarkerAlt}
                                color={slot.dateType === DateType.ONLINE ? 'blue.500' : 'orange.500'}
                            />
                            <Text fontSize="lg" fontWeight="bold">
                                {slot.dateType === DateType.ONLINE ? 'Online' : 'Offline'} Availability
                            </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                            {formatDate(slot.availabilityDate)}
                        </Text>
                    </VStack>
                </DrawerHeader>

                <DrawerBody p={6}>
                    <VStack spacing={6} align="stretch">
                        {/* Time Details */}
                        <Card variant="subtle">
                            <CardBody>
                                <VStack spacing={3} align="stretch">
                                    <HStack spacing={3}>
                                        <Icon as={FaClock} color="brand.500" />
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="bold" fontSize="lg">
                                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                1 hour duration
                                            </Text>
                                        </VStack>
                                    </HStack>

                                    <HStack spacing={2}>
                                        <Icon as={FaGlobeAmericas} color="gray.400" boxSize={3} />
                                        <Text fontSize="xs" color="gray.500">
                                            {slot.timezone || 'Local timezone'}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </CardBody>
                        </Card>

                        {/* Booking Status */}
                        {isBooked ? (
                            <Card variant="elevated" bg="green.50" borderColor="green.200">
                                <CardBody>
                                    <VStack spacing={4} align="stretch">
                                        <HStack justify="space-between">
                                            <Text fontSize="md" fontWeight="bold" color="green.800">
                                                Booked by
                                            </Text>
                                            <Badge
                                                colorScheme="green"
                                                variant="solid"
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                            >
                                                <Icon as={FaCheckCircle} boxSize={3} />
                                                {slot.booking!.bookingStatus}
                                            </Badge>
                                        </HStack>

                                        <HStack spacing={3}>
                                            <Avatar
                                                size="md"
                                                name={`${slot.booking!.bookedByUser.firstName} ${slot.booking!.bookedByUser.lastName}`}
                                                src={slot.booking!.bookedByUser.profileImage}
                                            />
                                            <VStack align="start" spacing={1}>
                                                <Text fontWeight="bold">
                                                    {slot.booking!.bookedByUser.firstName} {slot.booking!.bookedByUser.lastName}
                                                </Text>
                                                <Text fontSize="sm" color="green.600">
                                                    Activity: {slot.booking!.selectedActivity}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    Booked: {new Date(slot.booking!.createdAt).toLocaleDateString()}
                                                </Text>
                                            </VStack>
                                        </HStack>

                                        {slot.booking!.bookingNotes && (
                                            <Box bg="white" p={3} borderRadius="md" border="1px solid" borderColor="green.200">
                                                <Text fontSize="xs" color="green.600" mb={1} fontWeight="semibold">
                                                    Their message:
                                                </Text>
                                                <Text fontSize="sm" color="green.800">
                                                    "{slot.booking!.bookingNotes}"
                                                </Text>
                                            </Box>
                                        )}

                                        {/* Contact Actions */}
                                        <HStack spacing={2} pt={2}>
                                            <Button
                                                size="sm"
                                                colorScheme="blue"
                                                leftIcon={<FaEnvelope />}
                                                flex={1}
                                            >
                                                Message
                                            </Button>
                                            <Button
                                                size="sm"
                                                colorScheme="green"
                                                leftIcon={<FaPhone />}
                                                flex={1}
                                            >
                                                Call
                                            </Button>
                                        </HStack>
                                    </VStack>
                                </CardBody>
                            </Card>
                        ) : (
                            <Card variant="outline" borderStyle="dashed">
                                <CardBody textAlign="center" py={8}>
                                    <VStack spacing={3}>
                                        <Icon as={FaUserClock} color="gray.400" boxSize={8} />
                                        <VStack spacing={1}>
                                            <Text fontWeight="semibold" color="gray.600">
                                                Available for Booking
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                This slot is open and waiting for someone to book it
                                            </Text>
                                        </VStack>
                                    </VStack>
                                </CardBody>
                            </Card>
                        )}

                        {/* Location Preference */}
                        {slot.dateType === DateType.OFFLINE && slot.locationPreference && (
                            <Card variant="subtle">
                                <CardBody>
                                    <HStack spacing={3}>
                                        <Icon as={FaMapMarkerAlt} color="orange.500" />
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="semibold">Preferred Location</Text>
                                            <Text color="gray.600">{slot.locationPreference}</Text>
                                        </VStack>
                                    </HStack>
                                </CardBody>
                            </Card>
                        )}

                        {/* Your Notes */}
                        {slot.notes && (
                            <Card variant="subtle">
                                <CardBody>
                                    <VStack spacing={2} align="stretch">
                                        <Text fontWeight="semibold" fontSize="sm">Your Notes:</Text>
                                        <Text color="gray.700" lineHeight="relaxed">
                                            {slot.notes}
                                        </Text>
                                    </VStack>
                                </CardBody>
                            </Card>
                        )}

                        {/* Actions */}
                        <VStack spacing={3} pt={4}>
                            <Button
                                variant="outline"
                                leftIcon={<FaEdit />}
                                onClick={() => onEdit(slot)}
                                w="full"
                                size="lg"
                            >
                                Edit Slot
                            </Button>
                            <Button
                                variant="outline"
                                colorScheme="red"
                                leftIcon={<FaTrash />}
                                onClick={handleDelete}
                                isLoading={isDeleting}
                                w="full"
                                size="lg"
                            >
                                Delete Slot
                            </Button>
                        </VStack>
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

const AvailabilityCalendarView: React.FC = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const toast = useToast();

    const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const { isOpen: isSlotDetailsOpen, onOpen: onSlotDetailsOpen, onClose: onSlotDetailsClose } = useDisclosure();

    const {
        upcomingSlots,
        availableDays,
        isDeleting,
        deleteAvailability
    } = useAvailabilityStore();

    // Color mode values
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const timeHeaderBg = useColorModeValue('gray.50', 'gray.700');
    const dayHeaderBg = useColorModeValue('brand.50', 'brand.900');
    const emptySlotBg = useColorModeValue('white', 'gray.800');

    // Generate days for current week
    const getCurrentWeekDays = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() + (currentWeekOffset * 7));

        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateString = date.toISOString().split('T')[0];

            days.push({
                date: dateString,
                dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNumber: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                isToday: dateString === today.toISOString().split('T')[0],
                isPast: date < today && dateString !== today.toISOString().split('T')[0]
            });
        }

        return days;
    };

    const currentDays = getCurrentWeekDays();

    const handleSlotClick = (slot: AvailabilitySlot) => {
        setSelectedSlot(slot);
        onSlotDetailsOpen();
    };

    const handleEdit = (slot: AvailabilitySlot) => {
        // Implementation will be added in next component
        console.log('Edit slot:', slot);
        onSlotDetailsClose();
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

    // Create calendar matrix for mobile
    const createMobileCalendarData = () => {
        const calendarData: { [date: string]: AvailabilitySlot[] } = {};

        currentDays.forEach(day => {
            calendarData[day.date] = upcomingSlots.filter(
                slot => slot.availabilityDate === day.date
            ).sort((a, b) => a.startTime.localeCompare(b.startTime));
        });

        return calendarData;
    };

    const formatTime = (timeStr: string) => {
        const time = new Date(`2000-01-01T${timeStr}`);
        return time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getSlotStatusColor = (slot: AvailabilitySlot) => {
        if (slot.isBooked && slot.booking) {
            return 'green';
        }
        return slot.dateType === DateType.ONLINE ? 'blue' : 'orange';
    };

    const getSlotIcon = (slot: AvailabilitySlot) => {
        if (slot.isBooked && slot.booking) {
            return FaUser;
        }
        return slot.dateType === DateType.ONLINE ? FaVideo : FaMapMarkerAlt;
    };

    // Mobile view
    if (isMobile) {
        const mobileCalendarData = createMobileCalendarData();

        return (
            <VStack spacing={4} align="stretch">
                {/* Week Navigation */}
                <Card variant="subtle">
                    <CardBody p={4}>
                        <HStack justify="space-between" align="center">
                            <IconButton
                                icon={<FaChevronLeft />}
                                aria-label="Previous week"
                                variant="ghost"
                                onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                                isDisabled={currentWeekOffset <= 0}
                            />

                            <VStack spacing={0}>
                                <Text fontSize="lg" fontWeight="bold">
                                    {currentDays[0].month} {currentDays[0].dayNumber} - {currentDays[6].month} {currentDays[6].dayNumber}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    {currentWeekOffset === 0 ? 'This week' : `${Math.abs(currentWeekOffset)} week${Math.abs(currentWeekOffset) > 1 ? 's' : ''} ${currentWeekOffset > 0 ? 'ahead' : 'ago'}`}
                                </Text>
                            </VStack>

                            <IconButton
                                icon={<FaChevronRight />}
                                aria-label="Next week"
                                variant="ghost"
                                onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                                isDisabled={currentWeekOffset >= 4} // Limit to 4 weeks ahead
                            />
                        </HStack>
                    </CardBody>
                </Card>

                {/* Daily Slots */}
                <VStack spacing={3} align="stretch">
                    {currentDays.map((day) => {
                        const daySlots = mobileCalendarData[day.date] || [];
                        const hasSlots = daySlots.length > 0;

                        return (
                            <Card key={day.date} variant="elevated">
                                <CardBody p={4}>
                                    <VStack spacing={4} align="stretch">
                                        {/* Day Header */}
                                        <HStack justify="space-between" align="center">
                                            <VStack align="start" spacing={0}>
                                                <HStack spacing={2}>
                                                    <Text fontSize="lg" fontWeight="bold">
                                                        {day.dayOfWeek}
                                                    </Text>
                                                    {day.isToday && (
                                                        <Badge colorScheme="brand" size="sm">Today</Badge>
                                                    )}
                                                </HStack>
                                                <Text color="gray.500" fontSize="sm">
                                                    {day.month} {day.dayNumber}
                                                </Text>
                                            </VStack>

                                            <Badge
                                                colorScheme={hasSlots ? 'green' : 'gray'}
                                                variant="subtle"
                                            >
                                                {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''}
                                            </Badge>
                                        </HStack>

                                        {/* Slots */}
                                        {hasSlots ? (
                                            <VStack spacing={2} align="stretch">
                                                {daySlots.map((slot) => {
                                                    const SlotIcon = getSlotIcon(slot);
                                                    const colorScheme = getSlotStatusColor(slot);
                                                    const isBooked = slot.isBooked && slot.booking;

                                                    return (
                                                        <Card
                                                            key={slot.id}
                                                            variant="outline"
                                                            borderColor={`${colorScheme}.200`}
                                                            bg={`${colorScheme}.50`}
                                                            cursor="pointer"
                                                            onClick={() => handleSlotClick(slot)}
                                                            _active={{ transform: 'scale(0.98)' }}
                                                            transition="all 0.2s"
                                                        >
                                                            <CardBody p={3}>
                                                                <HStack justify="space-between" align="center">
                                                                    <HStack spacing={3}>
                                                                        <Icon as={SlotIcon} color={`${colorScheme}.600`} />
                                                                        <VStack align="start" spacing={0}>
                                                                            <Text fontWeight="semibold">
                                                                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                                            </Text>
                                                                            <HStack spacing={2}>
                                                                                <Text fontSize="xs" color="gray.500">
                                                                                    {slot.dateType === DateType.ONLINE ? 'Online' : 'Offline'}
                                                                                </Text>
                                                                                {isBooked && (
                                                                                    <>
                                                                                        <Text fontSize="xs" color="gray.400">•</Text>
                                                                                        <Text fontSize="xs" color={`${colorScheme}.600`} fontWeight="medium">
                                                                                            {slot.booking!.bookedByUser.firstName}
                                                                                        </Text>
                                                                                    </>
                                                                                )}
                                                                            </HStack>
                                                                        </VStack>
                                                                    </HStack>

                                                                    <Icon as={FaEye} color="gray.400" boxSize={4} />
                                                                </HStack>
                                                            </CardBody>
                                                        </Card>
                                                    );
                                                })}
                                            </VStack>
                                        ) : (
                                            <Box
                                                textAlign="center"
                                                py={6}
                                                color="gray.500"
                                                fontSize="sm"
                                                borderRadius="md"
                                                bg="gray.50"
                                                border="1px dashed"
                                                borderColor="gray.200"
                                            >
                                                No availability slots
                                            </Box>
                                        )}
                                    </VStack>
                                </CardBody>
                            </Card>
                        );
                    })}
                </VStack>

                {/* Slot Details Drawer */}
                {selectedSlot && (
                    <SlotDetailsDrawer
                        slot={selectedSlot}
                        isOpen={isSlotDetailsOpen}
                        onClose={onSlotDetailsClose}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </VStack>
        );
    }

    // Desktop view - use enhanced grid
    return (
        <VStack spacing={6} align="stretch">
            {/* Import and use the desktop component */}
            <Box>
                <AvailabilityDesktopCalendarGrid
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Box>

            {/* Slot Details Drawer for desktop too (when needed) */}
            {selectedSlot && (
                <SlotDetailsDrawer
                    slot={selectedSlot}
                    isOpen={isSlotDetailsOpen}
                    onClose={onSlotDetailsClose}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </VStack>
    );
};

export default AvailabilityCalendarView;