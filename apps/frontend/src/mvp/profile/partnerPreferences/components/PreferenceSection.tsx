// apps/frontend/src/mvp/profile/partnerPreferences/components/PreferenceSection.tsx

import React, { useState, useCallback, useMemo } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Flex,
    Icon,
    Collapse,
    useDisclosure,
    Badge,
    Progress,
    Tooltip,
    useColorModeValue
} from '@chakra-ui/react';
import { FaEdit, FaCheck, FaTimes, FaChevronDown, FaChevronUp, FaClock, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import { FormSection, FormField } from '../config/preferenceFormConfig';
import { PreferenceFieldGroup } from './PreferenceFieldGroup';
import { PreferenceSaveActions } from './PreferenceSaveActions';
import { Logger } from '../../../../utils/Logger';
import { DatifyyUserPartnerPreferences } from '../../types';
import { usePreferenceValidation } from '../hooks/usePreferenceValidation';

/**
 * Enterprise Preference Section Component
 * 
 * Responsibilities:
 * - Section-level editing state management
 * - Field grouping and layout
 * - Validation display and error handling
 * - Progressive disclosure and UX animations
 * - Completion tracking and visual feedback
 * 
 * Patterns:
 * - Compound component pattern
 * - Controlled/uncontrolled hybrid
 * - Observer pattern for validation
 * - State machine for edit modes
 */

interface PreferenceSectionProps {
    section: FormSection;
    preferences: DatifyyUserPartnerPreferences | null;
    isUpdating: boolean;
    onSectionUpdate: (sectionId: string, data: Partial<DatifyyUserPartnerPreferences>) => Promise<void>;
    onValidationChange?: (sectionId: string, isValid: boolean, errors: string[]) => void;
    className?: string;
    defaultExpanded?: boolean;
    showEstimatedTime?: boolean;
}

interface SectionState {
    isEditing: boolean;
    hasChanges: boolean;
    localData: Partial<DatifyyUserPartnerPreferences>;
    completionPercentage: number;
}

const MotionBox = motion(Box);

export const PreferenceSection: React.FC<PreferenceSectionProps> = ({
    section,
    preferences,
    isUpdating,
    onSectionUpdate,
    onValidationChange,
    className,
    defaultExpanded = false,
    showEstimatedTime = true
}) => {

    const logger = useMemo(() => new Logger(`PreferenceSection:${section.id}`), [section.id]);
    const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: defaultExpanded });

    // Theme-aware colors
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const completeBgColor = useColorModeValue('green.50', 'green.900');
    const completeTextColor = useColorModeValue('green.700', 'green.200');

    // Local state for section editing
    const [sectionState, setSectionState] = useState<SectionState>(() => ({
        isEditing: false,
        hasChanges: false,
        localData: {},
        completionPercentage: 0
    }));

    // Validation hook for real-time feedback
    const {
        validateSection,
        getFieldErrors,
        hasErrors,
        clearErrors
    } = usePreferenceValidation();

    // Calculate section completion
    const completionStats = useMemo(() => {
        if (!preferences) return { completed: 0, total: section.fields.length, percentage: 0 };

        const completed = section.fields.filter(field => {
            const value = preferences[field.name];
            return value !== null && value !== undefined && value !== '' &&
                (Array.isArray(value) ? value.length > 0 : true);
        }).length;

        return {
            completed,
            total: section.fields.length,
            percentage: Math.round((completed / section.fields.length) * 100)
        };
    }, [preferences, section.fields]);

    // Determine section priority styling
    const priorityColors = {
        essential: { bg: 'red.50', border: 'red.200', badge: 'red' },
        important: { bg: 'orange.50', border: 'orange.200', badge: 'orange' },
        optional: { bg: 'blue.50', border: 'blue.200', badge: 'blue' }
    };

    const priorityStyle = priorityColors[section.priority];
    const isComplete = completionStats.percentage === 100;

    // Handle edit mode toggle
    const handleEditToggle = useCallback(() => {
        if (sectionState.isEditing) {
            // Cancel editing - revert changes
            setSectionState(prev => ({
                ...prev,
                isEditing: false,
                hasChanges: false,
                localData: {}
            }));
            clearErrors(section.fields.map(f => f.name));
            logger.info('Edit mode cancelled', { sectionId: section.id });
        } else {
            // Start editing
            setSectionState(prev => ({
                ...prev,
                isEditing: true,
                localData: {}
            }));
            logger.info('Edit mode started', { sectionId: section.id });
        }
    }, [sectionState.isEditing, section.id, section.fields, clearErrors, logger]);

    // Handle field value changes
    const handleFieldChange = useCallback((fieldName: keyof DatifyyUserPartnerPreferences, value: any) => {
        setSectionState(prev => {
            const newLocalData = { ...prev.localData, [fieldName]: value };

            // Validate the updated data
            const sectionData = { ...preferences, ...newLocalData };
            const validationResults = validateSection(section.fields, sectionData);

            // Notify parent of validation changes
            if (onValidationChange) {
                const errors = validationResults.filter((r: { type: string; }) => r.type === 'error').map((r: { message: any; }) => r.message);
                onValidationChange(section.id, errors.length === 0, errors);
            }

            logger.debug('Field value changed', {
                fieldName,
                hasValue: value !== null && value !== undefined,
                sectionId: section.id
            });

            return {
                ...prev,
                localData: newLocalData,
                hasChanges: Object.keys(newLocalData).length > 0
            };
        });
    }, [preferences, section.fields, section.id, validateSection, onValidationChange, logger]);

    // Handle section save
    const handleSave = useCallback(async () => {
        if (!sectionState.hasChanges) return;

        try {
            logger.info('Saving section data', {
                sectionId: section.id,
                fieldsToUpdate: Object.keys(sectionState.localData)
            });

            await onSectionUpdate(section.id, sectionState.localData);

            setSectionState(prev => ({
                ...prev,
                isEditing: false,
                hasChanges: false,
                localData: {}
            }));

            logger.info('Section saved successfully', { sectionId: section.id });
        } catch (error: any) {
            logger.error('Failed to save section', {
                sectionId: section.id,
                error: error.message
            });
            // Error handling is done in the parent hook
        }
    }, [sectionState.hasChanges, sectionState.localData, section.id, onSectionUpdate, logger]);

    // Handle section discard
    const handleDiscard = useCallback(() => {
        setSectionState(prev => ({
            ...prev,
            isEditing: false,
            hasChanges: false,
            localData: {}
        }));
        clearErrors(section.fields.map(f => f.name));
        logger.info('Section changes discarded', { sectionId: section.id });
    }, [section.fields, section.id, clearErrors, logger]);

    // Get current field values (preferences + local changes)
    const getCurrentValues = useCallback(() => {
        return { ...preferences, ...sectionState.localData };
    }, [preferences, sectionState.localData]);

    const AnimatedContent = ({ children }: { children: any }) => {
        return (
            // @ts-ignore
            <AnimatePresence mode="wait">
                {children}
            </AnimatePresence>
        );
    };

    return (
        <MotionBox
            className={className}
            bg={bgColor}
            borderRadius="xl"
            border="1px solid"
            borderColor={isComplete ? completeTextColor : borderColor}
            overflow="hidden"
            shadow="sm"
            _hover={{ shadow: 'md' }}
            // @ts-ignore
            transition="all 0.2s"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            {/* Section Header */}
            <Box
                p={6}
                cursor="pointer"
                onClick={onToggle}
                bg={isComplete ? completeBgColor : priorityStyle.bg}
                borderBottom={isOpen ? '1px solid' : 'none'}
                borderColor={borderColor}
                _hover={{ bg: isComplete ? completeTextColor + '20' : priorityStyle.bg }}
                transition="background 0.2s"
            >
                <Flex justify="space-between" align="center">
                    <HStack spacing={4} flex="1">
                        {/* Section Icon */}
                        <Icon
                            as={section.icon}
                            color={isComplete ? completeTextColor : `${priorityStyle.badge}.500`}
                            boxSize={6}
                        />

                        {/* Section Info */}
                        <VStack align="start" spacing={1} flex="1">
                            <HStack spacing={3}>
                                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                    {section.title}
                                </Text>

                                {/* Priority Badge */}
                                <Badge
                                    colorScheme={priorityStyle.badge}
                                    size="sm"
                                    textTransform="capitalize"
                                >
                                    {section.priority}
                                </Badge>

                                {/* Completion Badge */}
                                {isComplete && (
                                    <Badge colorScheme="green" size="sm">
                                        <HStack spacing={1}>
                                            <Icon as={FaCheck} boxSize={3} />
                                            <Text>Complete</Text>
                                        </HStack>
                                    </Badge>
                                )}
                            </HStack>

                            <Text fontSize="sm" color="gray.600">
                                {section.description}
                            </Text>

                            {/* Progress and Time Info */}
                            <HStack spacing={4} mt={2}>
                                <HStack spacing={2}>
                                    <Progress
                                        value={completionStats.percentage}
                                        size="sm"
                                        colorScheme={isComplete ? 'green' : priorityStyle.badge}
                                        w="80px"
                                        borderRadius="full"
                                    />
                                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                        {completionStats.completed}/{completionStats.total}
                                    </Text>
                                </HStack>

                                {showEstimatedTime && section.estimatedTime && (
                                    <Tooltip label="Estimated completion time" placement="top">
                                        <HStack spacing={1}>
                                            <Icon as={FaClock} boxSize={3} color="gray.400" />
                                            <Text fontSize="xs" color="gray.500">
                                                {section.estimatedTime} min
                                            </Text>
                                        </HStack>
                                    </Tooltip>
                                )}
                            </HStack>
                        </VStack>
                    </HStack>

                    {/* Action Buttons */}
                    <HStack spacing={3}>
                        {/* Edit Button */}
                        {!sectionState.isEditing && (
                            <Tooltip label="Edit section" placement="top">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    colorScheme={priorityStyle.badge}
                                    leftIcon={<FaEdit />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditToggle();
                                    }}
                                >
                                    Edit
                                </Button>
                            </Tooltip>
                        )}

                        {/* Expand/Collapse Icon */}
                        <Icon
                            as={isOpen ? FaChevronUp : FaChevronDown}
                            color="gray.400"
                            boxSize={4}
                            transition="transform 0.2s"
                        />
                    </HStack>
                </Flex>
            </Box>

            {/* Section Content */}
            <Collapse in={isOpen} animateOpacity>
                <Box p={6} pt={0}>

                    <AnimatedContent>
                        {sectionState.isEditing ? (
                            <MotionBox
                                key="editing"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <VStack spacing={6} align="stretch">
                                    {/* Form Fields */}
                                    <PreferenceFieldGroup
                                        fields={section.fields}
                                        values={getCurrentValues()}
                                        isEditing={true}
                                        onFieldChange={handleFieldChange}
                                        fieldErrors={getFieldErrors()}
                                        isUpdating={isUpdating}
                                    />

                                    {/* Save Actions */}
                                    <PreferenceSaveActions
                                        onSave={handleSave}
                                        onDiscard={handleDiscard}
                                        hasChanges={sectionState.hasChanges}
                                        hasErrors={hasErrors}
                                        isLoading={isUpdating}
                                        saveText="Save Changes"
                                        discardText="Cancel"
                                    />
                                </VStack>
                            </MotionBox>
                        ) : (
                            <MotionBox
                                key="viewing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Read-only Field Display */}
                                <PreferenceFieldGroup
                                    fields={section.fields}
                                    values={preferences || {}}
                                    isEditing={false}
                                    onFieldChange={() => { }} // No-op in read mode
                                    fieldErrors={{}}
                                    isUpdating={false}
                                />
                            </MotionBox>
                        )}
                    </AnimatedContent>

                </Box>
            </Collapse>
        </MotionBox>
    );
};

// Export for testing
export type { PreferenceSectionProps, SectionState };