// apps/frontend/src/mvp/availability/components/AvailabilityCreateForm.tsx
/**
 * Improved Availability Create Form Component
 * 
 * Modern, intuitive interface for setting availability:
 * 1. Select days of the week
 * 2. Choose time periods (Morning, Afternoon, Evening, Night)
 * 3. Set preferences (online/offline, location, notes)
 * 
 * Mobile-first design with smooth animations and better UX.
 */

import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Grid,
    GridItem,
    Button,
    Text,
    Heading,
    Card,
    CardBody,
    Select,
    Textarea,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    Badge,
    useToast,
    useBreakpointValue,
    Alert,
    AlertIcon,
    AlertDescription,
    Divider,
    Flex,
    IconButton,
    Tooltip,
    Switch,
    RadioGroup,
    Radio,
    Stack
} from '@chakra-ui/react';
import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaCheck,
    FaTimes,
    FaPlus,
    FaMinus,
    FaInfoCircle,
    FaSun,
    FaCloudSun,
    FaMoon,
    FaStar
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import {
    DateType,
    CreateAvailabilityRequest,
    AVAILABILITY_CONSTANTS
} from '../types';

interface DayOption {
    id: string;
    label: string;
    shortLabel: string;
    date: string;
    isToday: boolean;
    isWeekend: boolean;
}

interface SelectedTimeSlot {
    dayId: string;
    slotId: string;
}

interface TimeSlot {
    id: string;
    label: string;
    startTime: string;
    endTime: string;
    category: 'morning' | 'afternoon' | 'evening' | 'night';
    description: string;
}

interface TimeCategory {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
    description: string;
    slots: TimeSlot[];
}

const TIME_CATEGORIES: TimeCategory[] = [
    {
        id: 'morning',
        label: 'Morning',
        icon: FaSun,
        color: 'yellow',
        description: 'Perfect for coffee dates',
        slots: [
            { id: 'morning-8', label: '8:00 AM', startTime: '08:00', endTime: '09:00', category: 'morning', description: 'Early morning coffee' },
            { id: 'morning-9', label: '9:00 AM', startTime: '09:00', endTime: '10:00', category: 'morning', description: 'Morning coffee date' },
            { id: 'morning-10', label: '10:00 AM', startTime: '10:00', endTime: '11:00', category: 'morning', description: 'Mid-morning meet' },
            { id: 'morning-11', label: '11:00 AM', startTime: '11:00', endTime: '12:00', category: 'morning', description: 'Late morning chat' }
        ]
    },
    {
        id: 'afternoon',
        label: 'Afternoon',
        icon: FaCloudSun,
        color: 'orange',
        description: 'Great for lunch or activities',
        slots: [
            { id: 'afternoon-12', label: '12:00 PM', startTime: '12:00', endTime: '13:00', category: 'afternoon', description: 'Lunch date' },
            { id: 'afternoon-1', label: '1:00 PM', startTime: '13:00', endTime: '14:00', category: 'afternoon', description: 'Afternoon lunch' },
            { id: 'afternoon-2', label: '2:00 PM', startTime: '14:00', endTime: '15:00', category: 'afternoon', description: 'Afternoon activity' },
            { id: 'afternoon-3', label: '3:00 PM', startTime: '15:00', endTime: '16:00', category: 'afternoon', description: 'Afternoon coffee' },
            { id: 'afternoon-4', label: '4:00 PM', startTime: '16:00', endTime: '17:00', category: 'afternoon', description: 'Late afternoon' },
            { id: 'afternoon-5', label: '5:00 PM', startTime: '17:00', endTime: '18:00', category: 'afternoon', description: 'End of work day' }
        ]
    },
    {
        id: 'evening',
        label: 'Evening',
        icon: FaMoon,
        color: 'purple',
        description: 'Ideal for dinner dates',
        slots: [
            { id: 'evening-6', label: '6:00 PM', startTime: '18:00', endTime: '19:00', category: 'evening', description: 'Early dinner' },
            { id: 'evening-7', label: '7:00 PM', startTime: '19:00', endTime: '20:00', category: 'evening', description: 'Dinner time' },
            { id: 'evening-8', label: '8:00 PM', startTime: '20:00', endTime: '21:00', category: 'evening', description: 'Evening date' },
            { id: 'evening-9', label: '9:00 PM', startTime: '21:00', endTime: '22:00', category: 'evening', description: 'Late dinner' }
        ]
    },
    {
        id: 'night',
        label: 'Night',
        icon: FaStar,
        color: 'blue',
        description: 'Late night conversations',
        slots: [
            { id: 'night-10', label: '10:00 PM', startTime: '22:00', endTime: '23:00', category: 'night', description: 'Night chat' },
            { id: 'night-11', label: '11:00 PM', startTime: '23:00', endTime: '24:00', category: 'night', description: 'Late night call' }
        ]
    }
];

const AvailabilityCreateForm: React.FC = () => {
    const toast = useToast();
    const isMobile = useBreakpointValue({ base: true, md: false });

    // Store state
    const {
        isSaving,
        error,
        createAvailability,
        setCurrentView,
        clearError
    } = useAvailabilityStore();

    // Form state
    const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<SelectedTimeSlot[]>([]);
    const [dateType, setDateType] = useState<DateType>(DateType.ONLINE);
    const [locationPreference, setLocationPreference] = useState('');
    const [notes, setNotes] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [currentStep, setCurrentStep] = useState<'days' | 'times' | 'preferences'>('days');

    // Generate next 7 days
    const [availableDays, setAvailableDays] = useState<DayOption[]>([]);

    useEffect(() => {
        const days: DayOption[] = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayId = date.toISOString().split('T')[0];
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
            const shortLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            days.push({
                id: dayId,
                label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayOfWeek,
                shortLabel: i === 0 ? 'Today' : shortLabel,
                date: dayId,
                isToday: i === 0,
                isWeekend
            });
        }

        setAvailableDays(days);
    }, []);

    const getAllTimeSlots = (): TimeSlot[] => {
        return TIME_CATEGORIES.flatMap(category => category.slots);
    };

    const toggleDay = (dayId: string) => {
        const newSelectedDays = new Set(selectedDays);
        if (newSelectedDays.has(dayId)) {
            newSelectedDays.delete(dayId);
            // Remove time slots for this day
            setSelectedTimeSlots(prev => prev.filter(slot => slot.dayId !== dayId));
        } else {
            newSelectedDays.add(dayId);
        }
        setSelectedDays(newSelectedDays);
    };

    const toggleTimeSlot = (dayId: string, slotId: string) => {
        const existingIndex = selectedTimeSlots.findIndex(
            slot => slot.dayId === dayId && slot.slotId === slotId
        );

        if (existingIndex !== -1) {
            // Remove existing slot
            setSelectedTimeSlots(prev => prev.filter((_, index) => index !== existingIndex));
        } else {
            // Add new slot
            setSelectedTimeSlots(prev => [...prev, { dayId, slotId }]);
        }
    };

    const isTimeSlotSelected = (dayId: string, slotId: string): boolean => {
        return selectedTimeSlots.some(slot => slot.dayId === dayId && slot.slotId === slotId);
    };

    const getSelectedSlotsForDay = (dayId: string): SelectedTimeSlot[] => {
        return selectedTimeSlots.filter(slot => slot.dayId === dayId);
    };

    // Calculate total 1-hour slots that will be created
    const getTotalHourlySlots = (): number => {
        return selectedTimeSlots.length;
    };

    const totalHourlySlots = getTotalHourlySlots();

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (selectedDays.size === 0) {
            errors.days = 'Please select at least one day';
        }

        if (selectedTimeSlots.length === 0) {
            errors.timeSlots = 'Please select at least one time slot';
        }

        if (dateType === DateType.OFFLINE && !locationPreference.trim()) {
            errors.locationPreference = 'Location preference is required for offline dates';
        }

        if (notes.length > 500) {
            errors.notes = 'Notes cannot exceed 500 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Helper function to generate 1-hour slots from time periods
    const generateHourlySlots = (startTime: string, endTime: string): Array<{ startTime: string, endTime: string }> => {
        const slots: Array<{ startTime: string, endTime: string }> = [];

        // Parse start and end times
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        // Convert to minutes for easier calculation
        let currentMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        // Generate 1-hour slots
        while (currentMinutes + 60 <= endMinutes) {
            const slotStartHour = Math.floor(currentMinutes / 60);
            const slotStartMin = currentMinutes % 60;
            const slotEndHour = Math.floor((currentMinutes + 60) / 60);
            const slotEndMin = (currentMinutes + 60) % 60;

            const slotStart = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMin.toString().padStart(2, '0')}`;
            const slotEnd = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMin.toString().padStart(2, '0')}`;

            slots.push({
                startTime: slotStart,
                endTime: slotEnd
            });

            currentMinutes += 60; // Move to next hour
        }

        return slots;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast({
                title: 'Please fix the errors',
                description: 'Check your selections and try again',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            return;
        }

        // Convert selections to API requests (each selection is already 1 hour)
        const requests: CreateAvailabilityRequest[] = [];
        const allTimeSlots = getAllTimeSlots();

        selectedTimeSlots.forEach(selectedSlot => {
            const timeSlot = allTimeSlots.find(slot => slot.id === selectedSlot.slotId);
            if (timeSlot) {
                requests.push({
                    availabilityDate: selectedSlot.dayId,
                    startTime: timeSlot.startTime,
                    endTime: timeSlot.endTime,
                    timezone: AVAILABILITY_CONSTANTS.DEFAULT_TIMEZONE,
                    dateType,
                    notes: notes.trim() || undefined,
                    locationPreference: dateType === DateType.OFFLINE ? locationPreference.trim() : undefined,
                    bufferTimeMinutes: AVAILABILITY_CONSTANTS.MIN_BUFFER_MINUTES,
                    preparationTimeMinutes: AVAILABILITY_CONSTANTS.MIN_BUFFER_MINUTES
                });
            }
        });

        const success = await createAvailability(requests);

        if (success) {
            toast({
                title: 'Availability Created! 🎉',
                description: `Successfully created ${requests.length} one-hour slots`,
                status: 'success',
                duration: 4000,
                isClosable: true
            });
        }
    };

    const handleCancel = () => {
        setSelectedDays(new Set());
        setSelectedTimeSlots([]);
        setDateType(DateType.ONLINE);
        setLocationPreference('');
        setNotes('');
        setValidationErrors({});
        setCurrentView('upcoming');
    };

    const renderStepIndicator = () => (
        <HStack spacing={4} justify="center" mb={6}>
            {['days', 'times', 'preferences'].map((step, index) => {
                const isActive = currentStep === step;
                const isCompleted =
                    (step === 'days' && selectedDays.size > 0) ||
                    (step === 'times' && selectedTimeSlots.length > 0) ||
                    (step === 'preferences');

                return (
                    <HStack key={step} spacing={2}>
                        <Box
                            w={8}
                            h={8}
                            borderRadius="full"
                            bg={isActive ? 'brand.500' : isCompleted ? 'green.500' : 'gray.200'}
                            color="white"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize="sm"
                            fontWeight="bold"
                        >
                            {isCompleted && !isActive ? <FaCheck /> : index + 1}
                        </Box>
                        <Text
                            fontSize="sm"
                            fontWeight={isActive ? 'bold' : 'medium'}
                            color={isActive ? 'brand.500' : isCompleted ? 'green.500' : 'gray.500'}
                            textTransform="capitalize"
                        >
                            {step}
                        </Text>
                        {index < 2 && (
                            <Box w={8} h={0.5} bg={isCompleted ? 'green.200' : 'gray.200'} />
                        )}
                    </HStack>
                );
            })}
        </HStack>
    );

    const renderDaySelection = () => (
        <VStack spacing={6} align="stretch">
            <VStack spacing={2} textAlign="center">
                <Heading size="md" color="gray.800">
                    Select Your Available Days
                </Heading>
                <Text color="gray.600">
                    Choose the days when you're free for dates
                </Text>
            </VStack>

            <Grid
                templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(7, 1fr)' }}
                gap={3}
            >
                {availableDays.map((day) => {
                    const isSelected = selectedDays.has(day.id);

                    return (
                        <Card
                            key={day.id}
                            variant={isSelected ? 'elevated' : 'outline'}
                            className="interactive"
                            onClick={() => toggleDay(day.id)}
                            cursor="pointer"
                            bg={isSelected ? 'brand.50' : 'white'}
                            borderColor={isSelected ? 'brand.300' : 'gray.200'}
                            borderWidth={isSelected ? '2px' : '1px'}
                            _hover={{
                                transform: 'translateY(-2px)',
                                borderColor: 'brand.300',
                                boxShadow: 'md'
                            }}
                            transition="all 0.2s ease"
                        >
                            <CardBody p={4} textAlign="center">
                                <VStack spacing={2}>
                                    <Text
                                        fontSize="lg"
                                        fontWeight="bold"
                                        color={isSelected ? 'brand.600' : 'gray.700'}
                                    >
                                        {isMobile ? day.shortLabel : day.label}
                                    </Text>
                                    <Text
                                        fontSize="sm"
                                        color={isSelected ? 'brand.500' : 'gray.500'}
                                    >
                                        {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </Text>
                                    {day.isToday && (
                                        <Badge colorScheme="green" size="sm">Today</Badge>
                                    )}
                                    {day.isWeekend && !day.isToday && (
                                        <Badge colorScheme="purple" size="sm">Weekend</Badge>
                                    )}
                                    {isSelected && (
                                        <Box
                                            position="absolute"
                                            top={2}
                                            right={2}
                                            w={6}
                                            h={6}
                                            borderRadius="full"
                                            bg="brand.500"
                                            color="white"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <FaCheck size="12px" />
                                        </Box>
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>
                    );
                })}
            </Grid>

            {validationErrors.days && (
                <Text color="red.500" fontSize="sm" textAlign="center">
                    {validationErrors.days}
                </Text>
            )}

            <HStack justify="center" pt={4}>
                <Button
                    variant="love"
                    size="lg"
                    onClick={() => setCurrentStep('times')}
                    isDisabled={selectedDays.size === 0}
                    rightIcon={<FaPlus />}
                >
                    Select Time Slots ({selectedDays.size} day{selectedDays.size !== 1 ? 's' : ''})
                </Button>
            </HStack>
        </VStack>
    );

    const renderTimeSelection = () => (
        <VStack spacing={6} align="stretch">
            <VStack spacing={2} textAlign="center">
                <Heading size="md" color="gray.800">
                    Choose Your Time Preferences
                </Heading>
                <Text color="gray.600">
                    Select when you're available on each day
                </Text>
            </VStack>

            <VStack spacing={4} align="stretch">
                {Array.from(selectedDays).map(dayId => {
                    const day = availableDays.find(d => d.id === dayId);
                    if (!day) return null;

                    const selectedSlotsForDay = getSelectedSlotsForDay(dayId);

                    return (
                        <Card key={dayId} variant="subtle">
                            <CardBody p={4}>
                                <VStack spacing={4} align="stretch">
                                    <HStack justify="space-between" align="center">
                                        <HStack spacing={3}>
                                            <FaCalendarAlt color="#e85d75" />
                                            <Text fontSize="lg" fontWeight="bold">
                                                {day.label}
                                            </Text>
                                        </HStack>
                                        <Badge
                                            colorScheme={selectedSlotsForDay.length > 0 ? 'green' : 'gray'}
                                            variant="subtle"
                                        >
                                            {selectedSlotsForDay.length} slot{selectedSlotsForDay.length !== 1 ? 's' : ''}
                                        </Badge>
                                    </HStack>

                                    <VStack spacing={4} align="stretch">
                                        {TIME_CATEGORIES.map(category => {
                                            const IconComponent = category.icon;
                                            const selectedSlotsInCategory = selectedSlotsForDay.filter(slot => {
                                                const timeSlot = getAllTimeSlots().find(ts => ts.id === slot.slotId);
                                                return timeSlot?.category === category.id;
                                            });

                                            return (
                                                <Box key={category.id}>
                                                    <HStack spacing={3} mb={3}>
                                                        <IconComponent
                                                            size="16px"
                                                            color={`var(--chakra-colors-${category.color}-500)`}
                                                        />
                                                        <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                                            {category.label}
                                                        </Text>
                                                        <Text fontSize="sm" color="gray.500">
                                                            {category.description}
                                                        </Text>
                                                        {selectedSlotsInCategory.length > 0 && (
                                                            <Badge colorScheme={category.color} size="sm">
                                                                {selectedSlotsInCategory.length} selected
                                                            </Badge>
                                                        )}
                                                    </HStack>

                                                    <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={2}>
                                                        {category.slots.map(timeSlot => {
                                                            const isSelected = isTimeSlotSelected(dayId, timeSlot.id);

                                                            return (
                                                                <Button
                                                                    key={timeSlot.id}
                                                                    size="sm"
                                                                    variant={isSelected ? 'solid' : 'outline'}
                                                                    colorScheme={category.color}
                                                                    onClick={() => toggleTimeSlot(dayId, timeSlot.id)}
                                                                    leftIcon={isSelected ? <FaCheck size="10px" /> : undefined}
                                                                    _hover={{
                                                                        transform: 'translateY(-1px)',
                                                                        boxShadow: 'sm'
                                                                    }}
                                                                    transition="all 0.2s ease"
                                                                    position="relative"
                                                                >
                                                                    <VStack spacing={0}>
                                                                        <Text fontSize="xs" fontWeight="bold">
                                                                            {timeSlot.label}
                                                                        </Text>
                                                                        <Text fontSize="2xs" opacity={0.8}>
                                                                            {timeSlot.description}
                                                                        </Text>
                                                                    </VStack>
                                                                </Button>
                                                            );
                                                        })}
                                                    </Grid>
                                                </Box>
                                            );
                                        })}
                                    </VStack>
                                </VStack>
                            </CardBody>
                        </Card>
                    );
                })}
            </VStack>

            {validationErrors.timeSlots && (
                <Text color="red.500" fontSize="sm" textAlign="center">
                    {validationErrors.timeSlots}
                </Text>
            )}

            <HStack justify="space-between" pt={4}>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep('days')}
                    leftIcon={<FaTimes />}
                >
                    Back to Days
                </Button>
                <Button
                    variant="love"
                    size="lg"
                    onClick={() => setCurrentStep('preferences')}
                    isDisabled={selectedTimeSlots.length === 0}
                    rightIcon={<FaPlus />}
                >
                    Set Preferences ({selectedTimeSlots.length} slot{selectedTimeSlots.length !== 1 ? 's' : ''})
                </Button>
            </HStack>
        </VStack>
    );

    const renderPreferences = () => (
        <VStack spacing={6} align="stretch">
            <VStack spacing={2} textAlign="center">
                <Heading size="md" color="gray.800">
                    Finalize Your Preferences
                </Heading>
                <Text color="gray.600">
                    Set your date preferences and any special notes
                </Text>
            </VStack>

            <Card variant="subtle">
                <CardBody>
                    <VStack spacing={6} align="stretch">
                        {/* Date Type Selection */}
                        <FormControl>
                            <FormLabel fontWeight="semibold">
                                <HStack spacing={2}>
                                    <FaMapMarkerAlt size="14px" />
                                    <Text>Date Type</Text>
                                </HStack>
                            </FormLabel>
                            <RadioGroup
                                value={dateType}
                                onChange={(value) => setDateType(value as DateType)}
                            >
                                <Stack direction="row" spacing={6}>
                                    <Radio value={DateType.ONLINE} colorScheme="brand">
                                        <VStack align="start" spacing={1}>
                                            <Text fontWeight="medium">Online</Text>
                                            <Text fontSize="sm" color="gray.500">Video/Voice call</Text>
                                        </VStack>
                                    </Radio>
                                    <Radio value={DateType.OFFLINE} colorScheme="brand">
                                        <VStack align="start" spacing={1}>
                                            <Text fontWeight="medium">In-Person</Text>
                                            <Text fontSize="sm" color="gray.500">Meet in real life</Text>
                                        </VStack>
                                    </Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>

                        {/* Location Preference for Offline */}
                        {dateType === DateType.OFFLINE && (
                            <FormControl isInvalid={!!validationErrors.locationPreference}>
                                <FormLabel fontWeight="semibold">Preferred Location</FormLabel>
                                <Select
                                    value={locationPreference}
                                    onChange={(e) => setLocationPreference(e.target.value)}
                                    placeholder="Choose your preferred meeting place"
                                    size="lg"
                                >
                                    <option value="Coffee Shop">☕ Coffee Shop</option>
                                    <option value="Restaurant">🍽️ Restaurant</option>
                                    <option value="Park">🌳 Park</option>
                                    <option value="Mall">🛍️ Shopping Mall</option>
                                    <option value="Museum">🏛️ Museum</option>
                                    <option value="Beach">🏖️ Beach</option>
                                    <option value="Other">📍 Other</option>
                                </Select>
                                <FormErrorMessage>{validationErrors.locationPreference}</FormErrorMessage>
                            </FormControl>
                        )}

                        {/* Notes */}
                        <FormControl isInvalid={!!validationErrors.notes}>
                            <FormLabel fontWeight="semibold">
                                <HStack spacing={2}>
                                    <FaInfoCircle size="14px" />
                                    <Text>Additional Notes (Optional)</Text>
                                </HStack>
                            </FormLabel>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any special instructions or what kind of date you're looking for..."
                                rows={4}
                                resize="vertical"
                                maxLength={500}
                            />
                            <FormHelperText>
                                {notes.length}/500 characters • This helps others understand what kind of date you're interested in
                            </FormHelperText>
                            <FormErrorMessage>{validationErrors.notes}</FormErrorMessage>
                        </FormControl>
                    </VStack>
                </CardBody>
            </Card>

            {/* Summary */}
            <Card variant="elevated" bg="brand.50" borderColor="brand.200">
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <Text fontSize="lg" fontWeight="bold" color="brand.700">
                            📋 Summary
                        </Text>

                        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                            <VStack align="start" spacing={1}>
                                <Text fontSize="sm" fontWeight="semibold" color="brand.600">
                                    Selected Days
                                </Text>
                                <Text fontSize="sm" color="gray.700">
                                    {selectedDays.size} day{selectedDays.size !== 1 ? 's' : ''}
                                </Text>
                            </VStack>

                            <VStack align="start" spacing={1}>
                                <Text fontSize="sm" fontWeight="semibold" color="brand.600">
                                    Time Slots
                                </Text>
                                <Text fontSize="sm" color="gray.700">
                                    {totalHourlySlots} one-hour slot{totalHourlySlots !== 1 ? 's' : ''}
                                </Text>
                            </VStack>

                            <VStack align="start" spacing={1}>
                                <Text fontSize="sm" fontWeight="semibold" color="brand.600">
                                    Date Type
                                </Text>
                                <Text fontSize="sm" color="gray.700">
                                    {dateType === DateType.ONLINE ? '💻 Online' : '🤝 In-Person'}
                                </Text>
                            </VStack>
                        </Grid>
                    </VStack>
                </CardBody>
            </Card>

            {/* Error Display */}
            {error && (
                <Alert status="error" borderRadius="lg">
                    <AlertIcon />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Action Buttons */}
            <HStack spacing={4} justify="space-between" pt={4}>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep('times')}
                    leftIcon={<FaTimes />}
                    isDisabled={isSaving}
                >
                    Back to Times
                </Button>
                <Button
                    variant="love"
                    size="lg"
                    leftIcon={<FaCheck />}
                    onClick={handleSubmit}
                    isLoading={isSaving}
                    loadingText="Creating..."
                    className="heart-beat"
                    flex={1}
                >
                    Create {totalHourlySlots} Availability Slot{totalHourlySlots !== 1 ? 's' : ''}
                </Button>
            </HStack>
        </VStack>
    );

    return (
        <Box maxW="4xl" mx="auto" p={6}>
            <VStack spacing={8} align="stretch">
                {/* Step Indicator */}
                {renderStepIndicator()}

                {/* Step Content */}
                {currentStep === 'days' && renderDaySelection()}
                {currentStep === 'times' && renderTimeSelection()}
                {currentStep === 'preferences' && renderPreferences()}

                {/* Quick Cancel */}
                <Box textAlign="center" pt={4}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        color="gray.500"
                        _hover={{ color: 'gray.700' }}
                    >
                        Cancel and go back
                    </Button>
                </Box>
            </VStack>
        </Box>
    );
};

export default AvailabilityCreateForm;