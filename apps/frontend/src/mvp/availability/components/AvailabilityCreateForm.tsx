// apps/frontend/src/mvp/availability/components/AvailabilityCreateForm.tsx
/**
 * Availability Create Form Component
 * 
 * Allows users to select availability slots for the next 7 days.
 * Features:
 * - Calendar view of next 7 days
 * - Time slot selection (up to 4 per day, 1 hour each)
 * - Date type selection (online/offline)
 * - Location preferences for offline dates
 * - Real-time validation and conflict checking
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
    Tooltip
} from '@chakra-ui/react';
import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaCheck,
    FaTimes,
    FaPlus,
    FaMinus,
    FaInfoCircle
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import {
    DateType,
    CreateAvailabilityRequest,
    AVAILABILITY_CONSTANTS,
    TimeSlot,
    DayAvailability
} from '../types';

const AvailabilityCreateForm: React.FC = () => {
    const toast = useToast();
    const isMobile = useBreakpointValue({ base: true, md: false });

    // Store state
    const {
        availableDays,
        selectedTimeSlots,
        isSaving,
        error,
        toggleTimeSlot,
        clearSelectedSlots,
        createAvailability,
        setCurrentView,
        getSelectedSlotsCount,
        canAddMoreSlots
    } = useAvailabilityStore();

    // Local form state
    const [dateType, setDateType] = useState<DateType>(DateType.ONLINE);
    const [locationPreference, setLocationPreference] = useState('');
    const [notes, setNotes] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Reset form when component mounts
    useEffect(() => {
        clearSelectedSlots();
        return () => {
            clearSelectedSlots();
        };
    }, [clearSelectedSlots]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (getSelectedSlotsCount() === 0) {
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

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast({
                title: 'Validation Error',
                description: 'Please fix the errors before submitting',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            return;
        }

        // Convert selected slots to API format
        const requests: CreateAvailabilityRequest[] = [];

        selectedTimeSlots.forEach((slots, date) => {
            slots.forEach(slot => {
                requests.push({
                    availabilityDate: date,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    timezone: AVAILABILITY_CONSTANTS.DEFAULT_TIMEZONE,
                    dateType,
                    notes: notes.trim() || undefined,
                    locationPreference: dateType === DateType.OFFLINE ? locationPreference.trim() : undefined,
                    bufferTimeMinutes: AVAILABILITY_CONSTANTS.MIN_BUFFER_MINUTES,
                    preparationTimeMinutes: AVAILABILITY_CONSTANTS.MIN_BUFFER_MINUTES
                });
            });
        });

        const success = await createAvailability(requests);

        if (success) {
            toast({
                title: 'Availability Created! 🎉',
                description: `Successfully created ${requests.length} availability slots`,
                status: 'success',
                duration: 4000,
                isClosable: true
            });
        }
    };

    const handleCancel = () => {
        clearSelectedSlots();
        setDateType(DateType.ONLINE);
        setLocationPreference('');
        setNotes('');
        setValidationErrors({});
        setCurrentView('upcoming');
    };

    const handleTimeSlotClick = (day: DayAvailability, timeSlot: TimeSlot) => {
        if (timeSlot.isBooked) return; // Can't select booked slots

        const daySlots = selectedTimeSlots.get(day.date) || [];
        const isSelected = daySlots.some(s => s.startTime === timeSlot.startTime);

        if (!isSelected && !canAddMoreSlots(day.date)) {
            toast({
                title: 'Slot Limit Reached',
                description: `You can only select up to ${AVAILABILITY_CONSTANTS.MAX_SLOTS_PER_DAY} slots per day`,
                status: 'warning',
                duration: 3000,
                isClosable: true
            });
            return;
        }

        toggleTimeSlot(day.date, timeSlot);
    };

    const renderDayCard = (day: DayAvailability) => {
        const daySlots = selectedTimeSlots.get(day.date) || [];
        const selectedCount = daySlots.length;

        return (
            <Card
                key={day.date}
                variant="elevated"
                className="interactive"
                border="2px solid"
                borderColor={selectedCount > 0 ? 'brand.200' : 'gray.100'}
                bg={selectedCount > 0 ? 'brand.50' : 'white'}
                _hover={{
                    borderColor: 'brand.300',
                    transform: 'translateY(-2px)'
                }}
            >
                <CardBody p={4}>
                    <VStack spacing={3} align="stretch">
                        {/* Day Header */}
                        <VStack spacing={1}>
                            <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                {day.dayOfWeek}
                            </Text>
                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </Text>
                            {day.isToday && (
                                <Badge colorScheme="brand" size="sm">Today</Badge>
                            )}
                        </VStack>

                        {/* Slot Count Indicator */}
                        <HStack justify="center" spacing={2}>
                            <Text fontSize="xs" color="gray.500">
                                {selectedCount}/{AVAILABILITY_CONSTANTS.MAX_SLOTS_PER_DAY} slots
                            </Text>
                            {selectedCount >= AVAILABILITY_CONSTANTS.MAX_SLOTS_PER_DAY && (
                                <Badge colorScheme="green" size="sm">Full</Badge>
                            )}
                        </HStack>

                        {/* Time Slots Grid */}
                        <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                            {day.timeSlots.slice(0, isMobile ? 8 : 12).map((timeSlot) => {
                                const isSelected = daySlots.some(s => s.startTime === timeSlot.startTime);
                                const isBooked = timeSlot.isBooked;
                                const canSelect = !isBooked && (isSelected || canAddMoreSlots(day.date));

                                return (
                                    <Button
                                        key={timeSlot.id}
                                        size="xs"
                                        variant={isSelected ? 'solid' : 'outline'}
                                        colorScheme={isSelected ? 'brand' : isBooked ? 'red' : 'gray'}
                                        isDisabled={isBooked || (!isSelected && !canSelect)}
                                        onClick={() => handleTimeSlotClick(day, timeSlot)}
                                        fontSize="2xs"
                                        py={1}
                                        px={2}
                                        _hover={{
                                            transform: canSelect ? 'scale(1.05)' : 'none'
                                        }}
                                    >
                                        {AVAILABILITY_CONSTANTS.TIME_SLOTS.find(t => t.value === timeSlot.startTime)?.label}
                                    </Button>
                                );
                            })}
                        </Grid>
                    </VStack>
                </CardBody>
            </Card>
        );
    };

    const selectedSlotsCount = getSelectedSlotsCount();

    return (
        <Box maxW="6xl" mx="auto">
            <VStack spacing={8} align="stretch">
                {/* Header */}
                <VStack spacing={4} textAlign="center">
                    <HStack spacing={3}>
                        <FaCalendarAlt color="#e85d75" size="24px" />
                        <Heading size="lg" color="gray.800">
                            Create Your Availability
                        </Heading>
                    </HStack>
                    <Text color="gray.600" maxW="600px">
                        Select your available time slots for the next 7 days. Others can book these times for dates and activities.
                    </Text>
                </VStack>

                {/* Progress Indicator */}
                {selectedSlotsCount > 0 && (
                    <Alert status="info" borderRadius="lg" bg="blue.50" border="1px solid" borderColor="blue.200">
                        <AlertIcon color="blue.500" />
                        <AlertDescription>
                            <HStack spacing={2}>
                                <Text color="blue.700" fontWeight="medium">
                                    {selectedSlotsCount} time slot{selectedSlotsCount !== 1 ? 's' : ''} selected
                                </Text>
                                <Badge colorScheme="blue" variant="subtle">
                                    {Array.from(selectedTimeSlots.keys()).length} day{Array.from(selectedTimeSlots.keys()).length !== 1 ? 's' : ''}
                                </Badge>
                            </HStack>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Calendar Grid */}
                <Box>
                    <VStack spacing={4} align="stretch">
                        <HStack justify="space-between" align="center">
                            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                                Select Available Time Slots
                            </Text>
                            <Button
                                size="sm"
                                variant="ghost"
                                leftIcon={<FaTimes />}
                                onClick={clearSelectedSlots}
                                isDisabled={selectedSlotsCount === 0}
                            >
                                Clear All
                            </Button>
                        </HStack>

                        <Grid
                            templateColumns={{
                                base: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)',
                                xl: 'repeat(7, 1fr)'
                            }}
                            gap={4}
                        >
                            {availableDays.map(renderDayCard)}
                        </Grid>
                    </VStack>
                </Box>

                {/* Form Options */}
                <Card variant="subtle">
                    <CardBody>
                        <VStack spacing={6} align="stretch">
                            <Heading size="md" color="gray.700">
                                Availability Preferences
                            </Heading>

                            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                                {/* Date Type */}
                                <FormControl isInvalid={!!validationErrors.dateType}>
                                    <FormLabel fontWeight="semibold">
                                        <HStack spacing={2}>
                                            <FaMapMarkerAlt size="14px" />
                                            <Text>Date Type</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Select
                                        value={dateType}
                                        onChange={(e) => setDateType(e.target.value as DateType)}
                                        size="lg"
                                    >
                                        <option value={DateType.ONLINE}>Online (Video/Voice call)</option>
                                        <option value={DateType.OFFLINE}>Offline (In-person meeting)</option>
                                    </Select>
                                    <FormHelperText>
                                        Choose how you'd like to meet with potential matches
                                    </FormHelperText>
                                    <FormErrorMessage>{validationErrors.dateType}</FormErrorMessage>
                                </FormControl>

                                {/* Location Preference (only for offline) */}
                                {dateType === DateType.OFFLINE && (
                                    <FormControl isInvalid={!!validationErrors.locationPreference}>
                                        <FormLabel fontWeight="semibold">
                                            <HStack spacing={2}>
                                                <FaMapMarkerAlt size="14px" />
                                                <Text>Preferred Location</Text>
                                            </HStack>
                                        </FormLabel>
                                        <Select
                                            value={locationPreference}
                                            onChange={(e) => setLocationPreference(e.target.value)}
                                            placeholder="Select preferred location"
                                            size="lg"
                                        >
                                            <option value="Coffee Shop">Coffee Shop</option>
                                            <option value="Restaurant">Restaurant</option>
                                            <option value="Park">Park</option>
                                            <option value="Mall">Shopping Mall</option>
                                            <option value="Museum">Museum</option>
                                            <option value="Beach">Beach</option>
                                            <option value="Other">Other</option>
                                        </Select>
                                        <FormHelperText>
                                            Where would you prefer to meet for offline dates?
                                        </FormHelperText>
                                        <FormErrorMessage>{validationErrors.locationPreference}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Grid>

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
                                    placeholder="Any special instructions or preferences for your dates..."
                                    rows={3}
                                    resize="vertical"
                                    maxLength={500}
                                />
                                <FormHelperText>
                                    {notes.length}/500 characters
                                </FormHelperText>
                                <FormErrorMessage>{validationErrors.notes}</FormErrorMessage>
                            </FormControl>
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
                <HStack spacing={4} justify="flex-end" pt={4}>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleCancel}
                        isDisabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="love"
                        size="lg"
                        leftIcon={<FaCheck />}
                        onClick={handleSubmit}
                        isLoading={isSaving}
                        loadingText="Creating..."
                        isDisabled={selectedSlotsCount === 0}
                        className="heart-beat"
                    >
                        Create Availability ({selectedSlotsCount} slot{selectedSlotsCount !== 1 ? 's' : ''})
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default AvailabilityCreateForm;