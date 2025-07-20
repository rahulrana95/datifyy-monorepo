// apps/frontend/src/mvp/availability/components/AvailabilitySlotEditModal.tsx
/**
 * Enhanced Mobile-Friendly Slot Edit Modal Component
 * 
 * Features:
 * - Responsive modal/drawer design
 * - Smart form validation
 * - Booking conflict prevention
 * - Touch-optimized controls
 */

import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Select,
    Textarea,
    Button,
    Text,
    Badge,
    Alert,
    AlertIcon,
    AlertDescription,
    useToast,
    useBreakpointValue,
    Box,
    Grid,
    GridItem,
    Card,
    CardBody,
    Icon,
    RadioGroup,
    Radio,
    Stack,
    Divider
} from '@chakra-ui/react';
import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaSave,
    FaTimes,
    FaExclamationTriangle,
    FaVideo,
    FaInfoCircle,
    FaUser
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
    const isMobile = useBreakpointValue({ base: true, md: false });

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
    const [isValidating, setIsValidating] = useState(false);

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

        if (durationHours < 0.5) {
            newErrors.general = 'Slot duration must be at least 30 minutes';
        } else if (durationHours > 4) {
            newErrors.general = 'Slot duration cannot exceed 4 hours';
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
        setIsValidating(true);

        if (!validateForm()) {
            setIsValidating(false);
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
            setIsValidating(false);
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

        setIsValidating(false);

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
            // Reset form data
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

        // Auto-adjust end time when start time changes (maintain 1 hour duration)
        if (field === 'startTime') {
            const startDate = new Date(`2000-01-01T${value}`);
            startDate.setHours(startDate.getHours() + 1);
            const endTime = startDate.toTimeString().slice(0, 5);
            newFormData.endTime = endTime;
        }

        setFormData(newFormData);

        // Clear related errors
        if (errors.startTime || errors.endTime || errors.general) {
            setErrors(prev => ({
                ...prev,
                startTime: undefined,
                endTime: undefined,
                general: undefined
            }));
        }
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

    const renderFormContent = () => (
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

            {/* Time Selection */}
            <Card variant="subtle">
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <HStack spacing={2}>
                            <Icon as={FaClock} color="brand.500" />
                            <Text fontWeight="semibold">Time Settings</Text>
                        </HStack>

                        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                            <GridItem>
                                <FormControl isInvalid={!!errors.startTime}>
                                    <FormLabel fontSize="sm" fontWeight="medium">Start Time</FormLabel>
                                    <Select
                                        value={formData.startTime}
                                        onChange={(e) => handleTimeChange('startTime', e.target.value)}
                                        size="lg"
                                        borderRadius="lg"
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

                            <GridItem>
                                <FormControl isInvalid={!!errors.endTime}>
                                    <FormLabel fontSize="sm" fontWeight="medium">End Time</FormLabel>
                                    <Select
                                        value={formData.endTime}
                                        onChange={(e) => handleTimeChange('endTime', e.target.value)}
                                        size="lg"
                                        borderRadius="lg"
                                    >
                                        {AVAILABILITY_CONSTANTS.TIME_SLOTS.map((timeSlot) => (
                                            <option key={timeSlot.endTime} value={timeSlot.endTime}>
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

                        <FormHelperText fontSize="sm" color="gray.500">
                            ⏰ Duration: {(() => {
                                const startDate = new Date(`2000-01-01T${formData.startTime}`);
                                const endDate = new Date(`2000-01-01T${formData.endTime}`);
                                const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
                                if (duration <= 0) return 'Invalid';
                                const hours = Math.floor(duration / 60);
                                const minutes = duration % 60;
                                return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m` : ''}`.trim();
                            })()}
                        </FormHelperText>
                    </VStack>
                </CardBody>
            </Card>

            {/* Date Type Selection */}
            <Card variant="subtle">
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <HStack spacing={2}>
                            <Icon as={FaMapMarkerAlt} color="brand.500" />
                            <Text fontWeight="semibold">Date Type</Text>
                        </HStack>

                        <RadioGroup
                            value={formData.dateType}
                            onChange={(value) => setFormData({
                                ...formData,
                                dateType: value as DateType,
                                locationPreference: value === DateType.ONLINE ? '' : formData.locationPreference
                            })}
                        >
                            <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
                                <Radio value={DateType.ONLINE} colorScheme="brand" size="lg">
                                    <VStack align="start" spacing={1} ml={2}>
                                        <HStack spacing={2}>
                                            <Icon as={FaVideo} color="blue.500" />
                                            <Text fontWeight="medium">Online</Text>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.500">Video/Voice call</Text>
                                    </VStack>
                                </Radio>
                                <Radio value={DateType.OFFLINE} colorScheme="brand" size="lg">
                                    <VStack align="start" spacing={1} ml={2}>
                                        <HStack spacing={2}>
                                            <Icon as={FaMapMarkerAlt} color="orange.500" />
                                            <Text fontWeight="medium">In-Person</Text>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.500">Meet in real life</Text>
                                    </VStack>
                                </Radio>
                            </Stack>
                        </RadioGroup>
                    </VStack>
                </CardBody>
            </Card>

            {/* Location Preference for Offline */}
            {formData.dateType === DateType.OFFLINE && (
                <FormControl isInvalid={!!errors.locationPreference}>
                    <FormLabel fontWeight="semibold">
                        <HStack spacing={2}>
                            <Icon as={FaMapMarkerAlt} color="orange.500" />
                            <Text>Preferred Location</Text>
                        </HStack>
                    </FormLabel>
                    <Select
                        value={formData.locationPreference}
                        onChange={(e) => setFormData({ ...formData, locationPreference: e.target.value })}
                        placeholder="Choose your preferred meeting place"
                        size="lg"
                        borderRadius="lg"
                    >
                        <option value="Coffee Shop">☕ Coffee Shop</option>
                        <option value="Restaurant">🍽️ Restaurant</option>
                        <option value="Park">🌳 Park</option>
                        <option value="Mall">🛍️ Shopping Mall</option>
                        <option value="Museum">🏛️ Museum</option>
                        <option value="Beach">🏖️ Beach</option>
                        <option value="Other">📍 Other</option>
                    </Select>
                    <FormHelperText>Where would you prefer to meet for offline dates?</FormHelperText>
                    <FormErrorMessage>{errors.locationPreference}</FormErrorMessage>
                </FormControl>
            )}

            {/* Notes */}
            <FormControl isInvalid={!!errors.notes}>
                <FormLabel fontWeight="semibold">
                    <HStack spacing={2}>
                        <Icon as={FaInfoCircle} color="brand.500" />
                        <Text>Additional Notes (Optional)</Text>
                    </HStack>
                </FormLabel>
                <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special instructions or what kind of date you're looking for..."
                    rows={4}
                    resize="vertical"
                    maxLength={500}
                    borderRadius="lg"
                />
                <FormHelperText>
                    {formData.notes.length}/500 characters • This helps others understand what kind of date you're interested in
                </FormHelperText>
                <FormErrorMessage>{errors.notes}</FormErrorMessage>
            </FormControl>

            {/* Action Buttons */}
            <VStack spacing={3} pt={4}>
                <Button
                    variant="love"
                    size="lg"
                    leftIcon={<FaSave />}
                    onClick={handleSave}
                    isLoading={isSaving || isValidating}
                    loadingText="Saving..."
                    isDisabled={!hasChanges}
                    className={hasChanges ? "heart-beat" : undefined}
                    w="full"
                >
                    Save Changes
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<FaTimes />}
                    onClick={handleCancel}
                    isDisabled={isSaving || isValidating}
                    w="full"
                >
                    Cancel
                </Button>
            </VStack>
        </VStack>
    );

    const headerContent = (
        <VStack spacing={2} align="start" w="full">
            <HStack spacing={3}>
                <FaCalendarAlt color="#e85d75" size="20px" />
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    Edit Availability Slot
                </Text>
            </HStack>
            <HStack spacing={2} flexWrap="wrap">
                <Badge colorScheme="brand" variant="subtle" px={2} py={1}>
                    {formatSlotDate()}
                </Badge>
                {isSlotBooked && (
                    <Badge colorScheme="green" variant="solid" display="flex" alignItems="center" gap={1}>
                        <Icon as={FaUser} boxSize={3} />
                        Booked
                    </Badge>
                )}
                <Badge
                    colorScheme={slot.dateType === DateType.ONLINE ? 'blue' : 'orange'}
                    variant="subtle"
                >
                    {slot.dateType === DateType.ONLINE ? 'Online' : 'In-Person'}
                </Badge>
            </HStack>
        </VStack>
    );

    // Mobile: Use Drawer
    if (isMobile) {
        return (
            <Drawer isOpen={isOpen} placement="bottom" onClose={handleCancel} size="full">
                <DrawerOverlay bg="rgba(0, 0, 0, 0.6)" />
                <DrawerContent borderTopRadius="xl" maxH="95vh">
                    <DrawerCloseButton />
                    <DrawerHeader
                        bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)"
                        borderTopRadius="xl"
                        pb={4}
                    >
                        {headerContent}
                    </DrawerHeader>

                    <DrawerBody p={6} overflowY="auto">
                        {renderFormContent()}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        );
    }

    // Desktop: Use Modal
    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            size="xl"
            isCentered
            scrollBehavior="inside"
        >
            <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" maxH="90vh">
                <ModalHeader
                    bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)"
                    borderTopRadius="xl"
                    pb={4}
                >
                    {headerContent}
                </ModalHeader>

                <ModalCloseButton />

                <ModalBody p={6} overflowY="auto">
                    {renderFormContent()}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AvailabilitySlotEditModal;