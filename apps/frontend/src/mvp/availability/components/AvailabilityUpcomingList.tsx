// apps/frontend/src/mvp/availability/components/AvailabilityUpcomingList.tsx
/**
 * Enhanced Availability Upcoming List Component
 * 
 * Displays upcoming availability slots with improved visual distinction
 * between online/offline dates, timezone support, and better status indicators.
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
    Divider,
    Icon,
    useColorModeValue,
    useBreakpointValue,
    ButtonGroup
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
    FaCommentDots,
    FaGlobeAmericas,
    FaUserClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaTh,
    FaList
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import { AvailabilitySlot, DateType, BookingStatus } from '../types';
import AvailabilitySlotEditModal from './AvailabilitySlotEditModal';
import AvailabilityCalendarView from './AvailabilityCalendarView';

const AvailabilityUpcomingList: React.FC = () => {
    const toast = useToast();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
    const [viewMode, setViewMode] = useState<'calendar' | 'cards'>('calendar');

    const {
        upcomingSlots,
        isDeleting,
        deleteAvailability,
        startCreating
    } = useAvailabilityStore();

    // Color mode values
    const cardBg = useColorModeValue('white', 'gray.800');
    const onlineCardBg = useColorModeValue('blue.50', 'blue.900');
    const offlineCardBg = useColorModeValue('orange.50', 'orange.900');
    const bookedCardBg = useColorModeValue('green.50', 'green.900');
    const emptySlotBg = useColorModeValue('gray.50', 'gray.700');

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
            day: 'numeric',
            year: 'numeric'
        });

        // Format time with timezone
        const startTime = new Date(`${slot.availabilityDate}T${slot.startTime}`);
        const endTime = new Date(`${slot.availabilityDate}T${slot.endTime}`);

        const timeStr = `${startTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })} - ${endTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })}`;

        // Add timezone info
        const timezone = slot.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneAbbr = new Date().toLocaleDateString('en-US', {
            timeZoneName: 'short'
        }).split(', ')[1] || timezone;

        return { dateStr, timeStr, timezone, timezoneAbbr };
    };

    const getStatusBadge = (slot: AvailabilitySlot) => {
        if (slot.isBooked && slot.booking) {
            const status = slot.booking.bookingStatus;
            switch (status) {
                case BookingStatus.CONFIRMED:
                    return (
                        <Badge colorScheme="green" variant="solid" display="flex" alignItems="center" gap={1}>
                            <Icon as={FaCheckCircle} boxSize={3} />
                            Confirmed
                        </Badge>
                    );
                case BookingStatus.PENDING:
                    return (
                        <Badge colorScheme="yellow" variant="solid" display="flex" alignItems="center" gap={1}>
                            <Icon as={FaUserClock} boxSize={3} />
                            Pending
                        </Badge>
                    );
                case BookingStatus.CANCELLED:
                    return (
                        <Badge colorScheme="red" variant="subtle" display="flex" alignItems="center" gap={1}>
                            <Icon as={FaExclamationTriangle} boxSize={3} />
                            Cancelled
                        </Badge>
                    );
                default:
                    return (
                        <Badge colorScheme="blue" variant="solid" display="flex" alignItems="center" gap={1}>
                            <Icon as={FaUser} boxSize={3} />
                            Booked
                        </Badge>
                    );
            }
        }
        return (
            <Badge colorScheme="gray" variant="outline" display="flex" alignItems="center" gap={1}>
                <Icon as={FaClock} boxSize={3} />
                Available
            </Badge>
        );
    };

    const getCardStyleProps = (slot: AvailabilitySlot) => {
        const isBooked = slot.isBooked && slot.booking;
        const isOnline = slot.dateType === DateType.ONLINE;

        if (isBooked) {
            return {
                bg: bookedCardBg,
                borderColor: 'green.300',
                borderWidth: '2px',
                _hover: {
                    borderColor: 'green.400',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.15)'
                }
            };
        }

        if (isOnline) {
            return {
                bg: onlineCardBg,
                borderColor: 'blue.300',
                borderWidth: '2px',
                _hover: {
                    borderColor: 'blue.400',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)'
                }
            };
        }

        return {
            bg: offlineCardBg,
            borderColor: 'orange.300',
            borderWidth: '2px',
            _hover: {
                borderColor: 'orange.400',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.15)'
            }
        };
    };

    const getDateTypeIcon = (slot: AvailabilitySlot) => {
        if (slot.dateType === DateType.ONLINE) {
            return {
                icon: FaVideo,
                color: 'blue.500',
                label: 'Online Date',
                bgColor: 'blue.100'
            };
        }
        return {
            icon: FaMapMarkerAlt,
            color: 'orange.500',
            label: 'Offline Date',
            bgColor: 'orange.100'
        };
    };

    const renderSlotCard = (slot: AvailabilitySlot) => {
        const { dateStr, timeStr, timezone, timezoneAbbr } = formatDateTime(slot);
        const isBooked = slot.isBooked && slot.booking;
        const cardProps = getCardStyleProps(slot);
        const dateTypeInfo = getDateTypeIcon(slot);

        return (
            <Card
                key={slot.id}
                variant="elevated"
                className="interactive"
                {...cardProps}
                transition="all 0.2s ease-in-out"
            >
                <CardBody p={4}>
                    <VStack spacing={4} align="stretch">
                        {/* Header with Date Type Indicator */}
                        <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={2} flex={1}>
                                {/* Date Type Badge */}
                                <HStack spacing={2}>
                                    <Box
                                        p={2}
                                        borderRadius="lg"
                                        bg={dateTypeInfo.bgColor}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Icon
                                            as={dateTypeInfo.icon}
                                            color={dateTypeInfo.color}
                                            boxSize={4}
                                        />
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="sm" fontWeight="bold" color={dateTypeInfo.color}>
                                            {dateTypeInfo.label}
                                        </Text>
                                        <HStack spacing={1} align="center">
                                            <Icon as={FaCalendarAlt} color="gray.500" boxSize={3} />
                                            <Text fontSize="xs" color="gray.600">
                                                {dateStr}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </HStack>

                                {/* Time with Timezone */}
                                <Box
                                    bg={cardBg}
                                    p={3}
                                    borderRadius="lg"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    w="full"
                                >
                                    <VStack spacing={1} align="start">
                                        <HStack spacing={2} align="center">
                                            <Icon as={FaClock} color="gray.600" boxSize={4} />
                                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                                {timeStr}
                                            </Text>
                                        </HStack>
                                        <HStack spacing={1} align="center">
                                            <Icon as={FaGlobeAmericas} color="gray.400" boxSize={3} />
                                            <Text fontSize="xs" color="gray.500">
                                                {timezoneAbbr} ({timezone})
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </Box>
                            </VStack>

                            <VStack spacing={2} align="end">
                                {getStatusBadge(slot)}
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<FaEllipsisV />}
                                        variant="ghost"
                                        size="sm"
                                        isDisabled={isDeleting}
                                        _hover={{ bg: 'gray.100' }}
                                    />
                                    <MenuList>
                                        <MenuItem icon={<FaEdit />} onClick={() => handleEdit(slot)}>
                                            Edit Slot
                                        </MenuItem>
                                        <MenuItem
                                            icon={<FaTrash />}
                                            onClick={() => handleDelete(slot)}
                                            color="red.500"
                                            _hover={{ bg: 'red.50' }}
                                        >
                                            Delete Slot
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </VStack>
                        </HStack>

                        {/* Location Preference for Offline Dates */}
                        {slot.dateType === DateType.OFFLINE && slot.locationPreference && (
                            <Box
                                bg="orange.100"
                                p={3}
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="orange.200"
                            >
                                <HStack spacing={2}>
                                    <Icon as={FaMapMarkerAlt} color="orange.600" boxSize={4} />
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="sm" fontWeight="semibold" color="orange.800">
                                            Preferred Location
                                        </Text>
                                        <Text fontSize="sm" color="orange.700">
                                            {slot.locationPreference}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        )}

                        {/* Booking Details */}
                        {isBooked && slot.booking ? (
                            <>
                                <Divider />
                                <Box
                                    bg="green.100"
                                    p={4}
                                    borderRadius="lg"
                                    border="1px solid"
                                    borderColor="green.200"
                                >
                                    <VStack spacing={3} align="stretch">
                                        <HStack justify="space-between" align="center">
                                            <Text fontSize="sm" fontWeight="bold" color="green.800">
                                                Booking Details
                                            </Text>
                                            <Badge
                                                colorScheme={slot.booking.bookingStatus === BookingStatus.CONFIRMED ? 'green' : 'yellow'}
                                                variant="solid"
                                                size="sm"
                                            >
                                                {slot.booking.bookingStatus}
                                            </Badge>
                                        </HStack>

                                        <HStack spacing={3} align="start">
                                            <Avatar
                                                size="md"
                                                name={`${slot.booking.bookedByUser.firstName} ${slot.booking.bookedByUser.lastName}`}
                                                src={slot.booking.bookedByUser.profileImage}
                                                border="2px solid"
                                                borderColor="green.300"
                                            />
                                            <VStack align="start" spacing={1} flex={1}>
                                                <Text fontSize="md" fontWeight="bold" color="green.900">
                                                    {slot.booking.bookedByUser.firstName} {slot.booking.bookedByUser.lastName}
                                                </Text>
                                                <HStack spacing={4} fontSize="sm" color="green.700">
                                                    <HStack spacing={1}>
                                                        <Icon as={FaHeart} color="green.600" boxSize={3} />
                                                        <Text>Activity: {slot.booking.selectedActivity}</Text>
                                                    </HStack>
                                                    <HStack spacing={1}>
                                                        <Icon as={FaCalendarAlt} color="green.600" boxSize={3} />
                                                        <Text>
                                                            Booked: {new Date(slot.booking.createdAt).toLocaleDateString()}
                                                        </Text>
                                                    </HStack>
                                                </HStack>

                                                {slot.booking.bookingNotes && (
                                                    <Box
                                                        bg="white"
                                                        p={3}
                                                        borderRadius="md"
                                                        border="1px solid"
                                                        borderColor="green.200"
                                                        w="full"
                                                        mt={2}
                                                    >
                                                        <Text fontSize="xs" color="green.600" mb={1} fontWeight="semibold">
                                                            Their message:
                                                        </Text>
                                                        <Text fontSize="sm" color="green.800" fontStyle="italic">
                                                            "{slot.booking.bookingNotes}"
                                                        </Text>
                                                    </Box>
                                                )}
                                            </VStack>
                                        </HStack>
                                    </VStack>
                                </Box>
                            </>
                        ) : (
                            <Box
                                bg={emptySlotBg}
                                p={3}
                                borderRadius="lg"
                                border="1px dashed"
                                borderColor="gray.300"
                                textAlign="center"
                            >
                                <VStack spacing={2}>
                                    <Icon as={FaUserClock} color="gray.400" boxSize={6} />
                                    <VStack spacing={0}>
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                            Available for Booking
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            This slot is open and waiting for someone to book it
                                        </Text>
                                    </VStack>
                                </VStack>
                            </Box>
                        )}

                        {/* Your Notes */}
                        {slot.notes && (
                            <>
                                <Divider />
                                <Box
                                    bg={cardBg}
                                    p={3}
                                    borderRadius="lg"
                                    border="1px solid"
                                    borderColor="gray.200"
                                >
                                    <HStack spacing={2} mb={2} align="center">
                                        <Icon as={FaCommentDots} color="gray.500" boxSize={4} />
                                        <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                                            Your Notes
                                        </Text>
                                    </HStack>
                                    <Text fontSize="sm" color="gray.700" lineHeight="relaxed">
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
    const onlineCount = upcomingSlots.filter(s => s.dateType === DateType.ONLINE).length;
    const offlineCount = upcomingSlots.filter(s => s.dateType === DateType.OFFLINE).length;

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
                    <HStack justify="space-between" w="full" align="center">
                        <VStack align="start" spacing={1}>
                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                Your Upcoming Availability
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                {upcomingSlots.length} total slot{upcomingSlots.length !== 1 ? 's' : ''} available
                            </Text>
                        </VStack>

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

            {/* Main Content - Calendar or Cards View */}
            {viewMode === 'calendar' ? (
                <AvailabilityCalendarView />
            ) : (
                <Grid
                    templateColumns={{
                        base: '1fr',
                        md: 'repeat(2, 1fr)',
                        lg: 'repeat(2, 1fr)',
                        xl: 'repeat(3, 1fr)'
                    }}
                    gap={6}
                >
                    {upcomingSlots.map(renderSlotCard)}
                </Grid>
            )}

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