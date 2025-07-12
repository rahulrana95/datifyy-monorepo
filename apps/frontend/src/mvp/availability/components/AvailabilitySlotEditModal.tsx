// apps/frontend/src/mvp/availability/components/AvailabilitySlotEditModal.tsx
/**
 * Availability Slot Edit Modal Component
 * 
 * Modal for editing individual availability slots.
 * Allows users to modify time, date type, location, and notes.
 */

import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Select,
    Textarea,
    Button,
    Text,
    Badge,
    Alert,
    AlertIcon,
    AlertDescription,
    useToast,
    Grid,
    GridItem,
    Box
} from '@chakra-ui/react';
import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaSave,
    FaTimes,
    FaExclamationTriangle
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import {
    AvailabilitySlot,
    DateType,
    UpdateAvailabilityRequest,
    AVAILABILITY_CONSTANTS
} from '../types';

interface AvailabilitySlotEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    slot: AvailabilitySlot;
    onSlotUpdated: () => void;
}

interface FormData {
    startTime: string;
    endTime: string;
    dateType: DateType;
    locationPreference: string;
    notes: string;
}

interface FormErrors {
    startTime?: string;
    endTime?: string;
    locationPreference?: string;
    notes?: string;
    general?: string;
}

const AvailabilitySlotEditModal: React.FC<AvailabilitySlotEditModalProps> = ({
    isOpen,
    onClose,
    slot,
    onSlotUpdated
}) => {
    const toast = useToast();

    const { updateAvailability, isSaving } = useAvailabilityStore();

    // Form state
    const [formData, setFormData] = useState<FormData>({
        startTime: slot.startTime,
        endTime: slot.endTime,
        dateType: slot.dateType,
        locationPreference: slot.locationPreference || '',
        notes: slot.notes || ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [hasChanges, setHasChanges] = useState(false);

    // Reset form when slot changes
    useEffect(() => {
        setFormData({
            startTime: slot.startTime,
            endTime: slot.endTime,
            dateType: slot.dateType,
            locationPreference: slot.locationPreference || '',
            notes: slot.notes || ''
        });
        setErrors({});
        setHasChanges(false);
    }, [slot]);

    // Track changes
    useEffect(() => {
        const hasFormChanges =
            formData.startTime !== slot.startTime ||
            formData.endTime !== slot.endTime ||
            formData.dateType !== slot.dateType ||
            formData.locationPreference !== (slot.locationPreference || '') ||
            formData.notes !== (slot.notes || '');

        setHasChanges(hasFormChanges);
    }, [formData, slot]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validate time logic
        if (formData.startTime >= formData.endTime) {
            newErrors.endTime = 'End time must be after start time';
        }

        // Calculate duration
        const startDate = new Date(`2000-01-01T${formData.startTime}`);
        const endDate = new Date(`2000-01-01T${formData.endTime}`);
        const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

        if (durationHours !== 1) {
            newErrors.general = 'Slot duration must be exactly 1 hour';
        }

        // Validate location for offline dates
        if (formData.dateType === DateType.OFFLINE && !formData.locationPreference.trim()) {
            newErrors.locationPreference = 'Location preference is required for offline dates';
        }

        // Validate notes length
        if (formData.notes.length > 500) {
            newErrors.notes = 'Notes cannot exceed 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast({
                title: 'Validation Error',
                description: 'Please fix the errors before saving',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            return;
        }

        if (!slot.id) {
            toast({
                title: 'Error',
                description: 'Unable to update slot - missing ID',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
            return;
        }

        const updateData: UpdateAvailabilityRequest = {
            startTime: formData.startTime,
            endTime: formData.endTime,
            dateType: formData.dateType,
            locationPreference: formData.dateType === DateType.OFFLINE
                ? formData.locationPreference.trim()
                : undefined,
            notes: formData.notes.trim() || undefined
        };

        const success = await updateAvailability(slot.id, updateData);

        if (success) {
            toast({
                title: 'Slot Updated! ✨',
                description: 'Your availability slot has been updated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            onSlotUpdated();
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            // You could add a confirmation dialog here
            setFormData({
                startTime: slot.startTime,
                endTime: slot.endTime,
                dateType: slot.dateType,
                locationPreference: slot.locationPreference || '',
                notes: slot.notes || ''
            });
            setErrors({});
            setHasChanges(false);
        }
        onClose();
    };

    const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
        const newFormData = { ...formData, [field]: value };

        // Auto-adjust end time when start time changes
        if (field === 'startTime') {
            const startDate = new Date(`2000-01-01T${value}`);
            startDate.setHours(startDate.getHours() + 1); // Add 1 hour
            const endTime = startDate.toTimeString().slice(0, 5);
            newFormData.endTime = endTime;
        }

        setFormData(newFormData);
    };

    const formatSlotDate = () => {
        const date = new Date(slot.availabilityDate + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isSlotBooked = slot.isBooked && slot.booking;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            size="lg"
            isCentered
        >
            <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl">
                <ModalHeader
                    bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)"
                    borderTopRadius="xl"
                    pb={4}
                >
                    <VStack spacing={2} align="start">
                        <HStack spacing={3}>
                            <FaCalendarAlt color="#e85d75" size="20px" />
                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                Edit Availability Slot
                            </Text>
                        </HStack>
                        <HStack spacing={2}>
                            <Badge colorScheme="brand" variant="subtle" px={2} py={1}>
                                {formatSlotDate()}
                            </Badge>
                            {isSlotBooked && (
                                <Badge colorScheme="green" variant="solid">
                                    Booked
                                </Badge>
                            )}
                        </HStack>
                    </VStack>
                </ModalHeader>

                <ModalCloseButton />

                <ModalBody p={6}>
                    <VStack spacing={6} align="stretch">
                        {/* Booking Warning */}
                        {isSlotBooked && (
                            <Alert status="warning" borderRadius="lg">
                                <AlertIcon />
                                <AlertDescription>
                                    <VStack align="start" spacing={1}>
                                        <Text fontWeight="semibold">
                                            This slot is booked by {slot.booking?.bookedByUser.firstName}
                                        </Text>
                                        <Text fontSize="sm">
                                            Changes may affect the existing booking. Consider contacting them first.
                                        </Text>
                                    </VStack>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* General Error */}
                        {errors.general && (
                            <Alert status="error" borderRadius="lg">
                                <AlertIcon />
                                <AlertDescription>{errors.general}</AlertDescription>
                            </Alert>
                        )}

                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            {/* Start Time */}
                            <GridItem>
                                <FormControl isInvalid={!!errors.startTime}>
                                    <FormLabel fontWeight="semibold">
                                        <HStack spacing={2}>
                                            <FaClock size="14px" />
                                            <Text>Start Time</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Select
                                        value={formData.startTime}
                                        onChange={(e) => handleTimeChange('startTime', e.target.value)}
                                        size="lg"
                                    >
                                        {AVAILABILITY_CONSTANTS.TIME_SLOTS.map((timeSlot) => (
                                            <option key={timeSlot.value} value={timeSlot.value}>
                                                {timeSlot.label}
                                            </option>
                                        ))}
                                    </Select>
                                    <FormErrorMessage>{errors.startTime}</FormErrorMessage>
                                </FormControl>
                            </GridItem>

                            {/* End Time */}
                            <GridItem>
                                <FormControl isInvalid={!!errors.endTime}>
                                    <FormLabel fontWeight="semibold">
                                        <HStack spacing={2}>
                                            <FaClock size="14px" />
                                            <Text>End Time</Text>
                                        </HStack>
                                    </FormLabel>
                                    <Select
                                        value={formData.endTime}
                                        onChange={(e) => handleTimeChange('endTime', e.target.value)}
                                        size="lg"
                                    >
                                        {AVAILABILITY_CONSTANTS.TIME_SLOTS.map((timeSlot) => (
                                            <option key={timeSlot.endTime} value={timeSlot.endTime}>
                                                {/* Convert 24h to 12h format for display */}
                                                {new Date(`2000-01-01T${timeSlot.endTime}`).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </option>
                                        ))}
                                    </Select>
                                    <FormErrorMessage>{errors.endTime}</FormErrorMessage>
                                </FormControl>
                            </GridItem>
                        </Grid>

                        {/* Date Type */}
                        <FormControl>
                            <FormLabel fontWeight="semibold">
                                <HStack spacing={2}>
                                    <FaMapMarkerAlt size="14px" />
                                    <Text>Date Type</Text>
                                </HStack>
                            </FormLabel>
                            <Select
                                value={formData.dateType}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    dateType: e.target.value as DateType,
                                    locationPreference: e.target.value === DateType.ONLINE ? '' : formData.locationPreference
                                })}
                                size="lg"
                            >
                                <option value={DateType.ONLINE}>Online (Video/Voice call)</option>
                                <option value={DateType.OFFLINE}>Offline (In-person meeting)</option>
                            </Select>
                            <FormHelperText>
                                Choose how you'd like to meet with your date
                            </FormHelperText>
                        </FormControl>

                        {/* Location Preference (only for offline) */}
                        {formData.dateType === DateType.OFFLINE && (
                            <FormControl isInvalid={!!errors.locationPreference}>
                                <FormLabel fontWeight="semibold">
                                    <HStack spacing={2}>
                                        <FaMapMarkerAlt size="14px" />
                                        <Text>Preferred Location</Text>
                                    </HStack>
                                </FormLabel>
                                <Select
                                    value={formData.locationPreference}
                                    onChange={(e) => setFormData({ ...formData, locationPreference: e.target.value })}
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
                                <FormErrorMessage>{errors.locationPreference}</FormErrorMessage>
                            </FormControl>
                        )}

                        {/* Notes */}
                        <FormControl isInvalid={!!errors.notes}>
                            <FormLabel fontWeight="semibold">
                                Additional Notes (Optional)
                            </FormLabel>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any special instructions or preferences for your dates..."
                                rows={3}
                                resize="vertical"
                                maxLength={500}
                            />
                            <FormHelperText>
                                {formData.notes.length}/500 characters
                            </FormHelperText>
                            <FormErrorMessage>{errors.notes}</FormErrorMessage>
                        </FormControl>

                        {/* Action Buttons */}
                        <HStack spacing={4} pt={4}>
                            <Button
                                variant="outline"
                                flex={1}
                                onClick={handleCancel}
                                isDisabled={isSaving}
                                leftIcon={<FaTimes />}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="love"
                                flex={1}
                                leftIcon={<FaSave />}
                                onClick={handleSave}
                                isLoading={isSaving}
                                loadingText="Saving..."
                                isDisabled={!hasChanges}
                                className={hasChanges ? "heart-beat" : undefined}
                            >
                                Save Changes
                            </Button>
                        </HStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AvailabilitySlotEditModal;