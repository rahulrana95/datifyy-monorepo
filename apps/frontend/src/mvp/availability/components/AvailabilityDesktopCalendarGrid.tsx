// FIXED: AvailabilityDesktopCalendarGrid.tsx - Time Format Issue Resolved

import React, { useState, useEffect } from 'react';
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
    useToast,
    Avatar,
    Button
} from '@chakra-ui/react';
import {
    FaVideo,
    FaMapMarkerAlt,
    FaClock,
    FaHeart,
    FaGlobeAmericas,
    FaCalendarAlt
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import { AvailabilitySlot, DateType, AVAILABILITY_CONSTANTS } from '../types';

interface DesktopCalendarGridProps {
    onEdit: (slot: AvailabilitySlot) => void;
    onDelete: (slot: AvailabilitySlot) => void;
}

const AvailabilityDesktopCalendarGrid: React.FC<DesktopCalendarGridProps> = ({
    onEdit,
    onDelete
}) => {
    const toast = useToast();
    const [debugInfo, setDebugInfo] = useState<any[]>([]);

    const {
        upcomingSlots,
        loadAvailability
    } = useAvailabilityStore();

    // Color mode values
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const timeHeaderBg = useColorModeValue('gray.50', 'gray.700');
    const dayHeaderBg = useColorModeValue('brand.50', 'brand.900');

    // Force refresh on mount
    useEffect(() => {
        console.log('🔄 Desktop calendar mounting, forcing data refresh...');
        loadAvailability({ forceRefresh: true, includeBookings: true });
    }, []);

    // Debug the slots we receive
    useEffect(() => {
        console.log('📊 Desktop calendar received slots:', upcomingSlots);
        console.log('📊 Booked slots:', upcomingSlots.filter(s => s.isBooked));
        console.log('📊 Available slots:', upcomingSlots.filter(s => !s.isBooked));

        // Create debug info
        const debug = upcomingSlots.map(slot => ({
            id: slot.id,
            date: slot.availabilityDate,
            time: slot.startTime,
            isBooked: slot.isBooked,
            booking: slot.booking,
            type: slot.dateType
        }));
        setDebugInfo(debug);
    }, [upcomingSlots]);

    // Generate next 7 days
    const generateAvailableDays = () => {
        const days = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = date.toISOString().split('T')[0];

            days.push({
                date: dateString,
                dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNumber: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                isToday: i === 0
            });
        }

        return days;
    };

    const days = generateAvailableDays();

    // FIXED: Normalize time format function
    const normalizeTime = (time: string): string => {
        // Handle both "09:00:00" and "09:00" formats
        if (time.includes(':')) {
            const parts = time.split(':');
            return `${parts[0]}:${parts[1]}`; // Return HH:MM format
        }
        return time;
    };

    // FIXED: Enhanced slot finder with time normalization
    const findSlotForCell = (date: string, timeSlot: string) => {
        console.log(`🔍 Looking for slot: date=${date}, time=${timeSlot}`);

        const normalizedSearchTime = normalizeTime(timeSlot);

        const foundSlot = upcomingSlots.find(slot => {
            const dateMatch = slot.availabilityDate === date;
            const normalizedSlotTime = normalizeTime(slot.startTime);
            const timeMatch = normalizedSlotTime === normalizedSearchTime;

            console.log(`  🔎 Checking slot ${slot.id}:`);
            console.log(`    📅 Slot date: ${slot.availabilityDate} | Search date: ${date} | Match: ${dateMatch}`);
            console.log(`    ⏰ Slot time: ${slot.startTime} -> ${normalizedSlotTime} | Search time: ${timeSlot} -> ${normalizedSearchTime} | Match: ${timeMatch}`);

            return dateMatch && timeMatch;
        });

        if (foundSlot) {
            console.log(`✅ FOUND SLOT:`, foundSlot);
        } else {
            console.log(`❌ NO SLOT FOUND for ${date} ${timeSlot}`);
            console.log(`   Available slots for ${date}:`, upcomingSlots.filter(s => s.availabilityDate === date));
        }

        return foundSlot;
    };

    const renderSlotCell = (date: string, timeSlot: string) => {
        const slot = findSlotForCell(date, timeSlot);

        if (!slot) {
            return (
                <Box
                    key={`${date}-${timeSlot}`}
                    minH="80px"
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="white"
                    _hover={{ bg: 'gray.50' }}
                >
                    <Text fontSize="xs" color="gray.400">
                        Available
                    </Text>
                </Box>
            );
        }

        const isBooked = slot.isBooked && slot.booking;
        const isOnline = slot.dateType === DateType.ONLINE;

        console.log(`🎨 Rendering slot ${slot.id}: isBooked=${isBooked}, isOnline=${isOnline}`);

        return (
            <Tooltip
                label={
                    <VStack spacing={1} textAlign="center">
                        <Text fontWeight="bold">
                            {isOnline ? '💻 Online' : '🤝 In-Person'} Slot
                        </Text>
                        <Text fontSize="sm">
                            {normalizeTime(slot.startTime)} - {normalizeTime(slot.endTime)}
                        </Text>
                        {isBooked ? (
                            <Text fontSize="sm" color="green.200">
                                💕 Booked by {slot.booking!.bookedByUser.firstName}
                            </Text>
                        ) : (
                            <Text fontSize="sm" color="blue.200">
                                🕐 Available for booking
                            </Text>
                        )}
                    </VStack>
                }
                placement="top"
                bg="gray.800"
                color="white"
                borderRadius="md"
                p={2}
            >
                <Box
                    key={`${date}-${timeSlot}`}
                    minH="80px"
                    border="2px solid"
                    borderColor={isBooked ? 'green.400' : (isOnline ? 'blue.400' : 'orange.400')}
                    borderRadius="lg"
                    p={3}
                    bg={isBooked ? 'green.50' : (isOnline ? 'blue.50' : 'orange.50')}
                    className={isBooked ? "heart-beat" : ""}
                    position="relative"
                    cursor="pointer"
                    _hover={{
                        transform: 'scale(1.02)',
                        boxShadow: 'lg',
                        borderColor: isBooked ? 'green.500' : (isOnline ? 'blue.500' : 'orange.500')
                    }}
                    transition="all 0.2s ease"
                    onClick={() => {
                        toast({
                            title: `${isBooked ? '💕 Booked' : '🕐 Available'} Slot`,
                            description: `${normalizeTime(slot.startTime)} - ${normalizeTime(slot.endTime)} (${isOnline ? 'Online' : 'In-Person'})`,
                            status: isBooked ? 'success' : 'info',
                            duration: 3000,
                            isClosable: true
                        });
                    }}
                >
                    <VStack spacing={2} h="full" justify="space-between">
                        {/* Top section - Icon and status */}
                        <HStack spacing={2} w="full" justify="space-between">
                            <Icon
                                as={isBooked ? FaHeart : (isOnline ? FaVideo : FaMapMarkerAlt)}
                                color={isBooked ? 'green.600' : (isOnline ? 'blue.600' : 'orange.600')}
                                boxSize={4}
                            />
                            {isBooked && (
                                <Badge colorScheme="green" variant="solid" fontSize="2xs" borderRadius="full">
                                    💕
                                </Badge>
                            )}
                        </HStack>

                        {/* Middle section - Type */}
                        <Text fontSize="xs" color="gray.700" textAlign="center" fontWeight="semibold">
                            {isOnline ? 'Online' : 'In-Person'}
                        </Text>

                        {/* Bottom section - User info if booked or status */}
                        {isBooked ? (
                            <VStack spacing={1} w="full">
                                <Avatar
                                    size="xs"
                                    name={`${slot.booking!.bookedByUser.firstName} ${slot.booking!.bookedByUser.lastName}`}
                                    src={slot.booking!.bookedByUser.profileImage}
                                />
                                <Text fontSize="2xs" color="green.700" textAlign="center" noOfLines={1} fontWeight="bold">
                                    {slot.booking!.bookedByUser.firstName}
                                </Text>
                            </VStack>
                        ) : (
                            <VStack spacing={1}>
                                <Text fontSize="2xs" color="gray.600" textAlign="center" fontWeight="medium">
                                    Available
                                </Text>
                                <Text fontSize="2xs" color="gray.500" textAlign="center">
                                    Click to view
                                </Text>
                            </VStack>
                        )}

                        {/* Location indicator */}
                        {slot.locationPreference && (
                            <Text fontSize="2xs" color="gray.500" textAlign="center" noOfLines={1}>
                                📍 {slot.locationPreference}
                            </Text>
                        )}
                    </VStack>

                    {/* Status indicator dot */}
                    <Box
                        position="absolute"
                        top={1}
                        left={1}
                        w={3}
                        h={3}
                        borderRadius="full"
                        bg={isBooked ? 'green.500' : (isOnline ? 'blue.500' : 'orange.500')}
                    />
                </Box>
            </Tooltip>
        );
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        return {
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' })
        };
    };

    if (upcomingSlots.length === 0) {
        return (
            <Box textAlign="center" py={8}>
                <VStack spacing={4}>
                    <Text fontSize="lg" color="gray.600">Loading calendar...</Text>
                    <Text fontSize="sm" color="gray.500">Getting your availability slots with booking data</Text>
                </VStack>
            </Box>
        );
    }

    return (
        <Box>
            {/* Calendar Grid */}
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
                                            Local
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
                                                        TODAY
                                                    </Badge>
                                                )}
                                                {daySlots.length > 0 && (
                                                    <HStack spacing={1}>
                                                        <Badge colorScheme="blue" size="sm" variant="subtle">
                                                            {daySlots.length} SLOTS
                                                        </Badge>
                                                        {bookedSlots > 0 && (
                                                            <Badge colorScheme="green" size="sm" variant="solid">
                                                                {bookedSlots} 💕
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

                        {/* Time rows - Show all time slots */}
                        {AVAILABILITY_CONSTANTS.TIME_SLOTS.map((timeSlot, timeIndex) => (
                            <Grid
                                key={timeSlot.value}
                                templateColumns={`120px repeat(${days.length}, 1fr)`}
                                gap={0}
                                borderBottom="1px solid"
                                borderColor={borderColor}
                                minH="80px"
                                _last={{ borderBottom: 'none' }}
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
                                            {timeSlot.label}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            1 hour
                                        </Text>
                                    </VStack>
                                </Box>

                                {/* Slot cells */}
                                {days.map((day, dayIndex) => (
                                    <Box
                                        key={`${dayIndex}-${timeIndex}`}
                                        borderRight="1px solid"
                                        borderColor={borderColor}
                                        p={2}
                                        _last={{ borderRight: 'none' }}
                                    >
                                        {renderSlotCell(day.date, timeSlot.value)}
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