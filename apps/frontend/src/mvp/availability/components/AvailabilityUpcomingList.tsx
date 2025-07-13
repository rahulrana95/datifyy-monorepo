// apps/frontend/src/mvp/availability/components/AvailabilityCalendarView.tsx
/**
 * Calendar-Based Availability View Component
 * 
 * Intuitive calendar interface showing:
 * - Weekly/Monthly calendar grid
 * - Time slots for each day
 * - Visual indicators for booked/available slots
 * - Mobile-optimized with swipe gestures
 * - Easy slot management with inline actions
 */

import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Grid,
    GridItem,
    Text,
    Button,
    IconButton,
    Badge,
    Card,
    CardBody,
    useBreakpointValue,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Portal,
    Tooltip,
    Flex,
    Circle,
    Divider,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Avatar,
    Spinner
} from '@chakra-ui/react';
import {
    FaChevronLeft,
    FaChevronRight,
    FaCalendarAlt,
    FaPlus,
    FaEllipsisH,
    FaEdit,
    FaTrash,
    FaUser,
    FaVideo,
    FaMapMarkerAlt,
    FaClock,
    FaHeart,
    FaExclamationTriangle
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import { AvailabilitySlot, DateType, BookingStatus } from '../types';

interface CalendarDay {
    date: string;
    dayNumber: number;
    dayName: string;
    isToday: boolean;
    isCurrentMonth: boolean;
    slots: AvailabilitySlot[];
}

interface TimeSlotProps {
    slot: AvailabilitySlot;
    onEdit: (slot: AvailabilitySlot) => void;
    onDelete: (slot: AvailabilitySlot) => void;
    isDeleting: boolean;
    deletingSlotId: number | null;
}

const TimeSlotCard: React.FC<TimeSlotProps> = ({
    slot,
    onEdit,
    onDelete,
    isDeleting,
    deletingSlotId
}) => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement>(null);

    const isBooked = slot.isBooked && slot.booking;
    const isCurrentlyDeleting = isDeleting && deletingSlotId === slot.id;

    const getTimeRange = () => {
        const start = new Date(`2000-01-01T${slot.startTime}`);
        const end = new Date(`2000-01-01T${slot.endTime}`);
        return `${start.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
        })} - ${end.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
        })}`;
    };

    const handleDeleteConfirm = () => {
        onClose();
        onDelete(slot);
    };

    return (
        <>
            <Box
                position="relative"
                p={2}
                borderRadius="md"
                bg={isBooked ? 'green.50' : 'blue.50'}
                border="1px solid"
                borderColor={isBooked ? 'green.200' : 'blue.200'}
                _hover={{
                    borderColor: isBooked ? 'green.300' : 'blue.300',
                    transform: !isCurrentlyDeleting ? 'translateY(-1px)' : 'none'
                }}
                transition="all 0.2s ease"
                opacity={isCurrentlyDeleting ? 0.6 : 1}
                cursor="pointer"
                minH="60px"
            >
                {/* Loading Overlay */}
                {isCurrentlyDeleting && (
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        bg="rgba(255, 255, 255, 0.9)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="md"
                        zIndex={10}
                    >
                        <Spinner size="sm" color="red.500" />
                    </Box>
                )}

                <VStack spacing={1} align="stretch">
                    {/* Time and Status */}
                    <HStack justify="space-between" align="center">
                        <HStack spacing={2}>
                            <FaClock size="10px" color={isBooked ? '#16a34a' : '#3b82f6'} />
                            <Text fontSize="xs" fontWeight="bold" color="gray.700">
                                {getTimeRange()}
                            </Text>
                        </HStack>

                        {/* Quick Actions Menu */}
                        <Menu placement="bottom-end">
                            <MenuButton
                                as={IconButton}
                                icon={<FaEllipsisH />}
                                size="xs"
                                variant="ghost"
                                isDisabled={isCurrentlyDeleting}
                                _hover={{ bg: 'white' }}
                                aria-label="Options"
                            />
                            <Portal>
                                <MenuList fontSize="sm" minW="120px" zIndex={1500}>
                                    <MenuItem
                                        icon={<FaEdit size="12px" />}
                                        onClick={() => onEdit(slot)}
                                    >
                                        Edit
                                    </MenuItem>
                                    <MenuItem
                                        icon={<FaTrash size="12px" />}
                                        onClick={onOpen}
                                        color="red.600"
                                    >
                                        Delete
                                    </MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </HStack>

                    {/* Booking Status */}
                    <HStack spacing={2} align="center">
                        {isBooked ? (
                            <>
                                <Avatar
                                    size="xs"
                                    src={slot.booking?.bookedByUser.profileImage}
                                    name={`${slot.booking?.bookedByUser.firstName} ${slot.booking?.bookedByUser.lastName}`}
                                />
                                <VStack spacing={0} align="start" flex={1}>
                                    <Text fontSize="2xs" fontWeight="medium" color="green.700">
                                        {slot.booking?.bookedByUser.firstName}
                                    </Text>
                                    <Text fontSize="2xs" color="green.600">
                                        {slot.booking?.selectedActivity}
                                    </Text>
                                </VStack>
                            </>
                        ) : (
                            <HStack spacing={1}>
                                <Circle size="4px" bg="blue.400" />
                                <Text fontSize="2xs" color="blue.600" fontWeight="medium">
                                    Available
                                </Text>
                            </HStack>
                        )}
                    </HStack>

                    {/* Date Type Indicator */}
                    <HStack spacing={1}>
                        {slot.dateType === DateType.ONLINE ? (
                            <FaVideo size="8px" color="#3b82f6" />
                        ) : (
                            <FaMapMarkerAlt size="8px" color="#ef4444" />
                        )}
                        <Text fontSize="2xs" color="gray.500">
                            {slot.dateType === DateType.ONLINE ? 'Online' : slot.locationPreference || 'In-person'}
                        </Text>
                    </HStack>
                </VStack>
            </Box>

            {/* Delete Confirmation */}
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent mx={4}>
                        <AlertDialogHeader>
                            <HStack spacing={2}>
                                <FaExclamationTriangle color="#f56565" />
                                <Text>Delete Slot</Text>
                            </HStack>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <VStack spacing={3} align="start">
                                <Text>Delete this {getTimeRange()} slot?</Text>
                                {isBooked && (
                                    <Box bg="yellow.50" p={2} borderRadius="md" w="full">
                                        <Text fontSize="sm" color="yellow.700">
                                            ⚠️ This will cancel {slot.booking?.bookedByUser.firstName}'s booking
                                        </Text>
                                    </Box>
                                )}
                            </VStack>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>Cancel</Button>
                            <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

const AvailabilityCalendarView: React.FC = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const toast = useToast();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [deletingSlotId, setDeletingSlotId] = useState<number | null>(null);

    const {
        upcomingSlots,
        isDeleting,
        deleteAvailability,
        startCreating,
        isLoading
    } = useAvailabilityStore();

    // Generate calendar days
    const generateCalendarDays = (): CalendarDay[] => {
        const days: CalendarDay[] = [];
        const startDate = new Date(currentDate);

        if (viewMode === 'week') {
            // Get start of week (Sunday)
            const dayOfWeek = startDate.getDay();
            startDate.setDate(startDate.getDate() - dayOfWeek);

            for (let i = 0; i < 7; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                days.push(createCalendarDay(date));
            }
        } else {
            // Month view logic (simplified)
            startDate.setDate(1);
            const firstDayOfWeek = startDate.getDay();
            startDate.setDate(startDate.getDate() - firstDayOfWeek);

            for (let i = 0; i < 42; i++) { // 6 weeks
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                days.push(createCalendarDay(date));
            }
        }

        return days;
    };

    const createCalendarDay = (date: Date): CalendarDay => {
        const dateString = date.toISOString().split('T')[0];
        const today = new Date();
        const isToday = dateString === today.toISOString().split('T')[0];
        const isCurrentMonth = date.getMonth() === currentDate.getMonth();

        const daySlots = upcomingSlots.filter(slot => slot.availabilityDate === dateString);

        return {
            date: dateString,
            dayNumber: date.getDate(),
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            isToday,
            isCurrentMonth,
            slots: daySlots
        };
    };

    const handlePrevious = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setMonth(newDate.getMonth() - 1);
        }
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const handleEdit = (slot: AvailabilitySlot) => {
        // Implement edit functionality
        console.log('Edit slot:', slot);
    };

    const handleDelete = async (slot: AvailabilitySlot) => {
        if (!slot.id) return;

        setDeletingSlotId(slot.id);

        try {
            const success = await deleteAvailability(slot.id);
            if (success) {
                toast({
                    title: 'Slot Deleted',
                    description: 'Availability slot removed successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                });
            }
        } catch (error) {
            toast({
                title: 'Delete Failed',
                description: 'Failed to delete slot. Please try again.',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'top'
            });
        } finally {
            setDeletingSlotId(null);
        }
    };

    const calendarDays = generateCalendarDays();
    const currentPeriod = viewMode === 'week'
        ? `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const totalSlots = upcomingSlots.length;
    const bookedSlots = upcomingSlots.filter(slot => slot.isBooked).length;
    const availableSlots = totalSlots - bookedSlots;

    return (
        <VStack spacing={6} align="stretch">
            {/* Header Controls */}
            <VStack spacing={4} align="stretch">
                <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                        <Text fontSize="lg" fontWeight="bold" color="gray.800">
                            Your Availability Calendar
                        </Text>
                        <HStack spacing={4} fontSize="sm" color="gray.600">
                            <Text>📅 {totalSlots} total</Text>
                            <Text>💚 {bookedSlots} booked</Text>
                            <Text>⏰ {availableSlots} available</Text>
                        </HStack>
                    </VStack>

                    <Button
                        variant="love"
                        size={isMobile ? 'sm' : 'md'}
                        leftIcon={<FaPlus />}
                        onClick={startCreating}
                        className="heart-beat"
                    >
                        {isMobile ? 'Add' : 'Add Slots'}
                    </Button>
                </HStack>

                {/* Calendar Navigation */}
                <HStack justify="space-between" align="center">
                    <HStack spacing={3}>
                        <IconButton
                            icon={<FaChevronLeft />}
                            onClick={handlePrevious}
                            size="sm"
                            variant="outline"
                            aria-label="Previous"
                        />
                        <Text fontSize="md" fontWeight="semibold" minW="150px" textAlign="center">
                            {currentPeriod}
                        </Text>
                        <IconButton
                            icon={<FaChevronRight />}
                            onClick={handleNext}
                            size="sm"
                            variant="outline"
                            aria-label="Next"
                        />
                    </HStack>

                    <HStack spacing={2}>
                        <Button
                            size="sm"
                            variant={viewMode === 'week' ? 'solid' : 'outline'}
                            colorScheme="brand"
                            onClick={() => setViewMode('week')}
                        >
                            Week
                        </Button>
                        <Button
                            size="sm"
                            variant={viewMode === 'month' ? 'solid' : 'outline'}
                            colorScheme="brand"
                            onClick={() => setViewMode('month')}
                        >
                            Month
                        </Button>
                    </HStack>
                </HStack>
            </VStack>

            {/* Calendar Grid */}
            <Card variant="elevated">
                <CardBody p={isMobile ? 2 : 4}>
                    <VStack spacing={4} align="stretch">
                        {/* Day Headers */}
                        <Grid
                            templateColumns={`repeat(${viewMode === 'week' ? 7 : 7}, 1fr)`}
                            gap={2}
                        >
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <Text
                                    key={day}
                                    fontSize="sm"
                                    fontWeight="bold"
                                    textAlign="center"
                                    color="gray.600"
                                    py={2}
                                >
                                    {isMobile ? day.charAt(0) : day}
                                </Text>
                            ))}
                        </Grid>

                        <Divider />

                        {/* Calendar Days */}
                        <Grid
                            templateColumns={`repeat(${viewMode === 'week' ? 7 : 7}, 1fr)`}
                            gap={2}
                            minH={viewMode === 'week' ? '200px' : '600px'}
                        >
                            {calendarDays.slice(0, viewMode === 'week' ? 7 : 42).map((day, index) => (
                                <GridItem key={index}>
                                    <Box
                                        minH={viewMode === 'week' ? '180px' : '120px'}
                                        p={2}
                                        borderRadius="lg"
                                        bg={day.isToday ? 'brand.50' : 'white'}
                                        border="1px solid"
                                        borderColor={day.isToday ? 'brand.200' : 'gray.100'}
                                        opacity={!day.isCurrentMonth && viewMode === 'month' ? 0.3 : 1}
                                        position="relative"
                                    >
                                        {/* Day Number */}
                                        <HStack justify="space-between" mb={2}>
                                            <Text
                                                fontSize="sm"
                                                fontWeight={day.isToday ? 'bold' : 'medium'}
                                                color={day.isToday ? 'brand.600' : 'gray.700'}
                                            >
                                                {day.dayNumber}
                                            </Text>
                                            {day.slots.length > 0 && (
                                                <Badge
                                                    size="sm"
                                                    colorScheme={day.slots.some(s => s.isBooked) ? 'green' : 'blue'}
                                                    variant="solid"
                                                >
                                                    {day.slots.length}
                                                </Badge>
                                            )}
                                        </HStack>

                                        {/* Time Slots */}
                                        <VStack spacing={1} align="stretch">
                                            {day.slots.slice(0, viewMode === 'week' ? 6 : 3).map(slot => (
                                                <TimeSlotCard
                                                    key={slot.id}
                                                    slot={slot}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                    isDeleting={isDeleting}
                                                    deletingSlotId={deletingSlotId}
                                                />
                                            ))}

                                            {day.slots.length > (viewMode === 'week' ? 6 : 3) && (
                                                <Text fontSize="2xs" color="gray.500" textAlign="center">
                                                    +{day.slots.length - (viewMode === 'week' ? 6 : 3)} more
                                                </Text>
                                            )}
                                        </VStack>

                                        {/* Quick Add Button */}
                                        {day.slots.length === 0 && day.isCurrentMonth && (
                                            <Button
                                                size="xs"
                                                variant="ghost"
                                                leftIcon={<FaPlus />}
                                                onClick={startCreating}
                                                w="full"
                                                mt={2}
                                                color="gray.400"
                                                _hover={{ color: 'brand.500', bg: 'brand.50' }}
                                            >
                                                Add
                                            </Button>
                                        )}
                                    </Box>
                                </GridItem>
                            ))}
                        </Grid>
                    </VStack>
                </CardBody>
            </Card>

            {/* Quick Stats */}
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <Card variant="subtle">
                    <CardBody textAlign="center" py={4}>
                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                            {availableSlots}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Available Slots
                        </Text>
                    </CardBody>
                </Card>

                <Card variant="subtle">
                    <CardBody textAlign="center" py={4}>
                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                            {bookedSlots}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Booked Slots
                        </Text>
                    </CardBody>
                </Card>

                <Card variant="subtle">
                    <CardBody textAlign="center" py={4}>
                        <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                            {Math.round((bookedSlots / Math.max(totalSlots, 1)) * 100)}%
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Booking Rate
                        </Text>
                    </CardBody>
                </Card>
            </Grid>
        </VStack>
    );
};

export default AvailabilityCalendarView;