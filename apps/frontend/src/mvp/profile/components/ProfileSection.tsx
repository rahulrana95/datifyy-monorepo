import React, { useState, useCallback } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    SimpleGrid,
    Flex,
    Icon,
    Collapse,
    useDisclosure,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Spinner,
} from '@chakra-ui/react';
import { FaEdit, FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { FormSectionConfig } from '../types/ProfileFormTypes';
import { DatifyyUsersInformation } from '../../../service/userService/UserProfileTypes';
import { ValidationError } from '../hooks/useProfileValidation';
import { ProfileField } from './ProfileField';

interface ProfileSectionProps {
    section: FormSectionConfig;
    profile: DatifyyUsersInformation | null;
    onUpdate: (data: Partial<DatifyyUsersInformation>) => Promise<boolean>;
    onValidate: (data: Partial<DatifyyUsersInformation>) => ValidationError[];
    getFieldError: (field: string) => ValidationError | undefined;
    clearErrors: (fields?: string[]) => void;
    isUpdating: boolean;
    theme: any;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
    section,
    profile,
    onUpdate,
    onValidate,
    getFieldError,
    clearErrors,
    isUpdating,
    theme
}) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<DatifyyUsersInformation>>({});
    const [isSaving, setIsSaving] = useState(false);
    const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

    /**
     * Enter edit mode and initialize form data
     */
    const handleEdit = useCallback(() => {
        if (!profile) return;

        // Initialize form with current profile data for this section
        const sectionFields = section.fields.flat().map(field => field.name);
        const initialData: Partial<DatifyyUsersInformation> = {};

        sectionFields.forEach(fieldName => {
            const value = profile[fieldName];
            if (value !== undefined) {
                (initialData as any)[fieldName] = value;
            }
        });

        setFormData(initialData);
        setIsEditMode(true);
        clearErrors(sectionFields);
    }, [profile, section.fields, clearErrors]);

    /**
     * Cancel edit mode and revert changes
     */
    const handleCancel = useCallback(() => {
        setIsEditMode(false);
        setFormData({});

        const sectionFields = section.fields.flat().map(field => field.name);
        clearErrors(sectionFields);
    }, [section.fields, clearErrors]);

    /**
     * Save changes with validation
     */
    const handleSave = useCallback(async () => {
        setIsSaving(true);

        try {
            // Validate form data
            const validationErrors = onValidate(formData);
            const hasErrors = validationErrors.some(error => error.type === 'error');

            if (hasErrors) {
                console.warn('⚠️ Validation errors found:', validationErrors);
                setIsSaving(false);
                return;
            }

            // Save changes
            const success = await onUpdate(formData);

            if (success) {
                setIsEditMode(false);
                setFormData({});
            }

        } catch (error) {
            console.error('❌ Save error:', error);
        } finally {
            setIsSaving(false);
        }
    }, [formData, onValidate, onUpdate]);

    /**
     * Handle field value changes
     */
    const handleFieldChange = useCallback((fieldName: keyof DatifyyUsersInformation, value: any) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));

        // Clear field error when user starts typing
        clearErrors([fieldName]);
    }, [clearErrors]);

    /**
     * Render field in read-only mode
     */
    const renderReadOnlyField = useCallback((field: any) => {
        if (!profile) return null;
        // @ts-expect-error
        const value = profile[field.name];

        return (
            <ProfileField
                field={field}
                value={value}
                isEditing={false}
                onChange={() => { }}
                error={undefined}
            />
        );
    }, [profile]);

    /**
     * Render field in edit mode
     */
    const renderEditField = useCallback((field: any) => {
        // @ts-expect-error
        const value = formData[field.name] ?? (profile?.[field.name] ?? undefined);
        const error = getFieldError(field.name);

        return (
            <ProfileField
                field={field}
                value={value}
                isEditing={true}
                onChange={(newValue) => handleFieldChange(field.name, newValue)}
                error={error}
            />
        );
    }, [formData, profile, getFieldError, handleFieldChange]);

    /**
     * Calculate section completion percentage
     */
    const getSectionCompletion = useCallback(() => {
        if (!profile) return 0;

        const allFields = section.fields.flat();
        const requiredFields = allFields.filter(field => field.required);
        const filledRequired = requiredFields.filter(field => {
            const value = profile[field.name];
            return value !== null && value !== undefined && value !== '';
        });

        return requiredFields.length > 0 ? (filledRequired.length / requiredFields.length) * 100 : 100;
    }, [profile, section.fields]);

    const completionPercentage = getSectionCompletion();
    const isComplete = completionPercentage === 100;

    return (
        <Box
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            overflow="hidden"
            shadow="sm"
            _hover={{ shadow: 'md' }}
            transition="all 0.2s"
        >
            {/* Section Header */}
            <Flex
                p={6}
                justify="space-between"
                align="center"
                cursor="pointer"
                onClick={onToggle}
                bg={isComplete ? 'green.50' : 'gray.50'}
                _hover={{ bg: isComplete ? 'green.100' : 'gray.100' }}
                transition="background 0.2s"
            >
                <HStack spacing={4}>
                    {section.icon && (
                        <Icon
                            as={section.icon}
                            color={isComplete ? 'green.500' : 'gray.500'}
                            boxSize={5}
                        />
                    )}
                    <VStack align="start" spacing={1}>
                        <HStack>
                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                {section.title}
                            </Text>
                            {isComplete && (
                                <Icon as={FaCheck} color="green.500" boxSize={4} />
                            )}
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                            {section.description}
                        </Text>
                    </VStack>
                </HStack>

                <HStack spacing={3}>
                    {/* Completion Badge */}
                    <Box
                        px={3}
                        py={1}
                        bg={isComplete ? 'green.100' : 'orange.100'}
                        color={isComplete ? 'green.700' : 'orange.700'}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="medium"
                    >
                        {Math.round(completionPercentage)}% Complete
                    </Box>

                    {/* Edit Button */}
                    {!isEditMode && (
                        <Button
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            leftIcon={<FaEdit />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit();
                            }}
                        >
                            Edit
                        </Button>
                    )}

                    {/* Collapse Indicator */}
                    <Icon
                        as={isOpen ? FaChevronUp : FaChevronDown}
                        color="gray.400"
                        boxSize={4}
                    />
                </HStack>
            </Flex>

            {/* Section Content */}
            <Collapse in={isOpen}>
                <Box p={6} pt={0}>
                    {isEditMode ? (
                        // Edit Mode
                        <VStack spacing={6} align="stretch">
                            <SimpleGrid
                                columns={{ base: 1, md: section.fields.length }}
                                spacing={6}
                            >
                                {section.fields.map((fieldColumn, colIndex) => (
                                    <VStack key={colIndex} spacing={4} align="stretch">
                                        {fieldColumn.map((field) => (
                                            <FormControl
                                                key={field.name}
                                                isRequired={field.required}
                                                isInvalid={getFieldError(field.name)?.type === 'error'}
                                                id={`field-${field.name}`}
                                            >
                                                <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                                                    {field.label}
                                                    {field.required && (
                                                        <Text as="span" color="red.500" ml={1}>*</Text>
                                                    )}
                                                </FormLabel>

                                                {renderEditField(field)}

                                                {/* Error Message */}
                                                {getFieldError(field.name)?.type === 'error' && (
                                                    <FormErrorMessage fontSize="xs">
                                                        {getFieldError(field.name)?.message}
                                                    </FormErrorMessage>
                                                )}

                                                {/* Warning Message */}
                                                {getFieldError(field.name)?.type === 'warning' && (
                                                    <FormHelperText fontSize="xs" color="orange.500">
                                                        {getFieldError(field.name)?.message}
                                                    </FormHelperText>
                                                )}

                                                {/* Help Text */}
                                                {field.helpText && !getFieldError(field.name) && (
                                                    <FormHelperText fontSize="xs">
                                                        {field.helpText}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        ))}
                                    </VStack>
                                ))}
                            </SimpleGrid>

                            {/* Action Buttons */}
                            <HStack spacing={3} justify="flex-end">
                                <Button
                                    variant="ghost"
                                    onClick={handleCancel}
                                    disabled={isSaving || isUpdating}
                                    size="sm"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    onClick={handleSave}
                                    isLoading={isSaving || isUpdating}
                                    loadingText="Saving..."
                                    leftIcon={!isSaving && !isUpdating ? <FaCheck /> : undefined}
                                    size="sm"
                                >
                                    Save Changes
                                </Button>
                            </HStack>
                        </VStack>
                    ) : (
                        // Read-Only Mode
                        <SimpleGrid
                            columns={{ base: 1, md: section.fields.length }}
                            spacing={6}
                        >
                            {section.fields.map((fieldColumn, colIndex) => (
                                <VStack key={colIndex} spacing={4} align="stretch">
                                    {fieldColumn.map((field) => (
                                        <Box key={field.name}>
                                            {renderReadOnlyField(field)}
                                        </Box>
                                    ))}
                                </VStack>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};