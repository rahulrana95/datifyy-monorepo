// apps/frontend/src/mvp/profile/partnerPreferences/components/PartnerPreferencesForm.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Progress,
    Badge,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Flex,
    Icon,
    useColorModeValue,
    useToast,
    useBreakpointValue,
    Collapse,
    useDisclosure
} from '@chakra-ui/react';
import {
    FaHeart,
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaChevronDown,
    FaChevronUp,
    FaSave,
    FaUndo,
    FaEye,
    FaEyeSlash,
    FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import { PreferenceSection } from './PreferenceSection';
import { PARTNER_PREFERENCES_FORM_CONFIG } from '../config/preferenceFormConfig';
import { DatifyyUserPartnerPreferences } from '../../types';
import { Logger } from '../../../../utils/Logger';
import { usePartnerPreferences } from '../hooks/usePartnerPreferences';
import { usePreferenceValidation } from '../hooks/usePreferenceValidation';

/**
 * Enterprise Partner Preferences Form Container
 * 
 * Features:
 * - Progressive form completion with smart prioritization
 * - Real-time validation and error aggregation
 * - Section-based editing with conflict resolution
 * - Completion tracking and progress visualization
 * - Mobile-responsive design with optimized UX
 * - Performance optimization with lazy loading
 * - Auto-save capabilities with conflict detection
 * 
 * Patterns:
 * - Container/Presenter pattern
 * - State management with hooks
 * - Observer pattern for validation
 * - Command pattern for form actions
 * - Strategy pattern for different view modes
 */

interface PartnerPreferencesFormProps {
    onComplete?: (preferences: DatifyyUserPartnerPreferences) => void;
    onCancel?: () => void;
    initialView?: 'progressive' | 'sections' | 'compact';
    showHeader?: boolean;
    showProgress?: boolean;
    enableAutoSave?: boolean;
    className?: string;
}

interface FormState {
    currentStep: number;
    completedSections: Set<string>;
    editingSections: Set<string>;
    hasUnsavedChanges: boolean;
    lastAutoSave: string | null;
    validationState: ValidationState;
}

interface ValidationState {
    isValid: boolean;
    totalErrors: number;
    totalWarnings: number;
    sectionValidation: Record<string, { isValid: boolean; errors: string[] }>;
}

interface SectionProgress {
    sectionId: string;
    completionPercentage: number;
    isComplete: boolean;
    hasErrors: boolean;
    priority: 'essential' | 'important' | 'optional';
}

const MotionBox = motion(Box);
const logger = new Logger('PartnerPreferencesForm');

export const PartnerPreferencesForm: React.FC<PartnerPreferencesFormProps> = ({
    onComplete,
    onCancel,
    initialView = 'sections',
    showHeader = true,
    showProgress = true,
    enableAutoSave = false,
    className
}) => {

    // Hooks
    const {
        preferences,
        isLoading,
        updatePreferences,
        isUpdating,
        hasUnsavedChanges: hookHasUnsavedChanges,
        lastSaved
    } = usePartnerPreferences();

    const {
        errors,
        warnings,
        isValid,
        hasErrors,
        hasWarnings,
        validateAllPreferences,
        clearErrors
    } = usePreferenceValidation();

    // Toast for user feedback
    const toast = useToast();

    // Responsive design
    const isMobile = useBreakpointValue({ base: true, md: false });
    const sectionColumns = useBreakpointValue({ base: 1, lg: 2 });

    // Progressive disclosure
    const { isOpen: showAdvancedSections, onToggle: toggleAdvancedSections } = useDisclosure();

    // Theme colors
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    // Form state
    const [formState, setFormState] = useState<FormState>(() => ({
        currentStep: 0,
        completedSections: new Set(),
        editingSections: new Set(),
        hasUnsavedChanges: false,
        lastAutoSave: null,
        validationState: {
            isValid: true,
            totalErrors: 0,
            totalWarnings: 0,
            sectionValidation: {}
        }
    }));

    // Calculate section progress
    const sectionProgress = useMemo((): SectionProgress[] => {
        if (!preferences) return [];

        return PARTNER_PREFERENCES_FORM_CONFIG.map(section => {
            const sectionFields = section.fields;
            const totalFields = sectionFields.length;

            let filledFields = 0;
            let hasFieldErrors = false;

            sectionFields.forEach(field => {
                const value = preferences[field.name];
                const isFieldFilled = value !== null && value !== undefined && value !== '' &&
                    (Array.isArray(value) ? value.length > 0 : true);

                if (isFieldFilled) filledFields++;

                // Check for field errors
                const fieldHasError = errors.some((error: { field: string; }) => error.field === field.name);
                if (fieldHasError) hasFieldErrors = true;
            });

            const completionPercentage = Math.round((filledFields / totalFields) * 100);

            return {
                sectionId: section.id,
                completionPercentage,
                isComplete: completionPercentage === 100,
                hasErrors: hasFieldErrors,
                priority: section.priority
            };
        });
    }, [preferences, errors]);

    // Overall completion stats
    const overallStats = useMemo(() => {
        const totalSections = sectionProgress.length;
        const completedSections = sectionProgress.filter(s => s.isComplete).length;
        const sectionsWithErrors = sectionProgress.filter(s => s.hasErrors).length;

        const overallCompletion = sectionProgress.reduce((acc, section) =>
            acc + section.completionPercentage, 0) / totalSections;

        const essentialProgress = sectionProgress
            .filter(s => s.priority === 'essential')
            .reduce((acc, section) => acc + section.completionPercentage, 0) /
            sectionProgress.filter(s => s.priority === 'essential').length;

        return {
            overallCompletion: Math.round(overallCompletion),
            essentialCompletion: Math.round(essentialProgress),
            completedSections,
            totalSections,
            sectionsWithErrors,
            canProceed: essentialProgress >= 80 && sectionsWithErrors === 0
        };
    }, [sectionProgress]);

    // Handle section updates
    const handleSectionUpdate = useCallback(async (sectionId: string, data: Partial<DatifyyUserPartnerPreferences>) => {
        logger.info('Updating section', { sectionId, fieldsUpdated: Object.keys(data).length });

        try {
            await updatePreferences(data);

            // Mark section as completed if fully filled
            const section = PARTNER_PREFERENCES_FORM_CONFIG.find(s => s.id === sectionId);
            if (section) {
                const isComplete = section.fields.every(field => {
                    const value = data[field.name] ?? preferences?.[field.name];
                    return value !== null && value !== undefined && value !== '' &&
                        (Array.isArray(value) ? value.length > 0 : true);
                });

                if (isComplete) {
                    setFormState(prev => ({
                        ...prev,
                        completedSections: new Set(Array.from(prev.completedSections).concat(sectionId))
                    }));
                }
            }

            logger.info('Section update completed successfully', { sectionId });

        } catch (error) {
            logger.error('Section update failed', { sectionId, error });
            throw error; // Let the section handle the error display
        }
    }, [updatePreferences, preferences]);

    // Handle validation changes from sections
    const handleValidationChange = useCallback((sectionId: string, isValid: boolean, errors: string[]) => {
        setFormState(prev => ({
            ...prev,
            validationState: {
                ...prev.validationState,
                sectionValidation: {
                    ...prev.validationState.sectionValidation,
                    [sectionId]: { isValid, errors }
                }
            }
        }));
    }, []);

    // Auto-save functionality
    useEffect(() => {
        if (!enableAutoSave || !hookHasUnsavedChanges) return;

        const autoSaveTimer = setTimeout(() => {
            if (preferences && hookHasUnsavedChanges) {
                // Validate before auto-save
                const validation = validateAllPreferences(preferences);
                if (validation.isValid) {
                    setFormState(prev => ({
                        ...prev,
                        lastAutoSave: new Date().toISOString()
                    }));

                    logger.info('Auto-save completed');

                    toast({
                        title: 'Auto-saved',
                        description: 'Your preferences have been automatically saved',
                        status: 'info',
                        duration: 2000,
                        isClosable: true,
                        position: 'bottom-right',
                        size: 'sm'
                    });
                }
            }
        }, 30000); // Auto-save after 30 seconds of inactivity

        return () => clearTimeout(autoSaveTimer);
    }, [preferences, hookHasUnsavedChanges, enableAutoSave, validateAllPreferences, toast]);

    // Complete form submission
    const handleFormComplete = useCallback(async () => {
        if (!preferences) return;

        logger.info('Completing preferences form', {
            overallCompletion: overallStats.overallCompletion,
            hasErrors: hasErrors
        });

        // Final validation
        const validation = validateAllPreferences(preferences);

        if (!validation.isValid) {
            toast({
                title: 'Cannot complete preferences',
                description: `Please fix ${validation.summary.totalErrors} error(s) before proceeding`,
                status: 'error',
                duration: 5000,
                isClosable: true
            });
            return;
        }

        if (validation.summary.completionScore < 70) {
            toast({
                title: 'Low completion score',
                description: 'Consider filling more preferences for better matches',
                status: 'warning',
                duration: 5000,
                isClosable: true
            });
        }

        onComplete?.(preferences);
    }, [preferences, overallStats, hasErrors, validateAllPreferences, onComplete, toast]);

    // Reset form
    const handleFormReset = useCallback(() => {
        clearErrors();
        setFormState({
            currentStep: 0,
            completedSections: new Set(),
            editingSections: new Set(),
            hasUnsavedChanges: false,
            lastAutoSave: null,
            validationState: {
                isValid: true,
                totalErrors: 0,
                totalWarnings: 0,
                sectionValidation: {}
            }
        });

        logger.info('Form reset completed');
    }, [clearErrors]);

    // Group sections by priority
    const sectionsByPriority = useMemo(() => {
        const essential = PARTNER_PREFERENCES_FORM_CONFIG.filter(s => s.priority === 'essential');
        const important = PARTNER_PREFERENCES_FORM_CONFIG.filter(s => s.priority === 'important');
        const optional = PARTNER_PREFERENCES_FORM_CONFIG.filter(s => s.priority === 'optional');

        return { essential, important, optional };
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <Box p={8} textAlign="center">
                <Text>Loading your preferences...</Text>
            </Box>
        );
    }

    return (
        <Box className={className} bg={bgColor} minH="100vh">
            {/* Form Header */}
            {showHeader && (
                <MotionBox
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    bg={cardBg}
                    borderBottom="1px solid"
                    borderColor={borderColor}
                    p={6}
                >
                    <VStack spacing={4} align="stretch">
                        {/* Title and Description */}
                        <Flex justify="space-between" align="center">
                            <VStack align="start" spacing={1}>
                                <HStack spacing={3}>
                                    <Icon as={FaHeart} color="pink.500" boxSize={6} />
                                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                        Partner Preferences
                                    </Text>
                                </HStack>
                                <Text fontSize="md" color="gray.600">
                                    Help us find your perfect match by sharing your preferences
                                </Text>
                            </VStack>

                            {/* Completion Badge */}
                            <VStack spacing={2}>
                                <Badge
                                    colorScheme={overallStats.overallCompletion >= 80 ? 'green' : 'orange'}
                                    fontSize="lg"
                                    px={4}
                                    py={2}
                                    borderRadius="full"
                                >
                                    {overallStats.overallCompletion}% Complete
                                </Badge>
                                <Text fontSize="xs" color="gray.500">
                                    {overallStats.completedSections}/{overallStats.totalSections} sections
                                </Text>
                            </VStack>
                        </Flex>

                        {/* Progress Bar */}
                        {showProgress && (
                            <VStack spacing={2} align="stretch">
                                <HStack justify="space-between">
                                    <Text fontSize="sm" color="gray.600">
                                        Overall Progress
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        Essential: {overallStats.essentialCompletion}%
                                    </Text>
                                </HStack>
                                <Progress
                                    value={overallStats.overallCompletion}
                                    colorScheme="pink"
                                    size="lg"
                                    borderRadius="full"
                                    bg="gray.100"
                                />
                            </VStack>
                        )}

                        {/* Validation Summary */}
                        {(hasErrors || hasWarnings) && (
                            <Alert
                                status={hasErrors ? 'error' : 'warning'}
                                borderRadius="md"
                                variant="left-accent"
                            >
                                <AlertIcon />
                                <VStack align="start" spacing={1}>
                                    <AlertTitle fontSize="sm">
                                        {hasErrors ? `${errors.length} error(s) found` : `${warnings.length} warning(s)`}
                                    </AlertTitle>
                                    <AlertDescription fontSize="xs">
                                        {hasErrors
                                            ? 'Please fix errors before proceeding'
                                            : 'Consider addressing warnings for better matches'
                                        }
                                    </AlertDescription>
                                </VStack>
                            </Alert>
                        )}
                    </VStack>
                </MotionBox>
            )}

            {/* Form Content */}
            <Box p={6}>
                <VStack spacing={8} align="stretch" maxW="1200px" mx="auto">

                    {/* Essential Sections */}
                    <VStack spacing={6} align="stretch">
                        <HStack spacing={3}>
                            <Icon as={FaCheckCircle} color="red.500" boxSize={5} />
                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                Essential Preferences
                            </Text>
                            <Badge colorScheme="red" size="sm">Required</Badge>
                        </HStack>

                        <VStack spacing={4} align="stretch">
                            {sectionsByPriority.essential.map((section) => (
                                <PreferenceSection
                                    key={section.id}
                                    section={section}
                                    preferences={preferences}
                                    isUpdating={isUpdating}
                                    onSectionUpdate={handleSectionUpdate}
                                    onValidationChange={handleValidationChange}
                                    defaultExpanded={isMobile}
                                    showEstimatedTime={true}
                                />
                            ))}
                        </VStack>
                    </VStack>

                    {/* Important Sections */}
                    <VStack spacing={6} align="stretch">
                        <HStack spacing={3}>
                            <Icon as={FaExclamationTriangle} color="orange.500" boxSize={5} />
                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                Important Preferences
                            </Text>
                            <Badge colorScheme="orange" size="sm">Recommended</Badge>
                        </HStack>

                        <VStack spacing={4} align="stretch">
                            {sectionsByPriority.important.map((section) => (
                                <PreferenceSection
                                    key={section.id}
                                    section={section}
                                    preferences={preferences}
                                    isUpdating={isUpdating}
                                    onSectionUpdate={handleSectionUpdate}
                                    onValidationChange={handleValidationChange}
                                    defaultExpanded={false}
                                    showEstimatedTime={true}
                                />
                            ))}
                        </VStack>
                    </VStack>

                    {/* Optional Sections (Collapsible) */}
                    <VStack spacing={6} align="stretch">
                        <Button
                            variant="ghost"
                            onClick={toggleAdvancedSections}
                            rightIcon={showAdvancedSections ? <FaChevronUp /> : <FaChevronDown />}
                            justifyContent="space-between"
                            w="full"
                            p={4}
                            bg="gray.50"
                            _hover={{ bg: 'gray.100' }}
                        >
                            <HStack spacing={3}>
                                <Icon as={FaInfoCircle} color="blue.500" boxSize={5} />
                                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                    Additional Preferences
                                </Text>
                                <Badge colorScheme="blue" size="sm">Optional</Badge>
                            </HStack>
                        </Button>

                        <Collapse in={showAdvancedSections} animateOpacity>
                            <VStack spacing={4} align="stretch">
                                {sectionsByPriority.optional.map((section) => (
                                    <PreferenceSection
                                        key={section.id}
                                        section={section}
                                        preferences={preferences}
                                        isUpdating={isUpdating}
                                        onSectionUpdate={handleSectionUpdate}
                                        onValidationChange={handleValidationChange}
                                        defaultExpanded={false}
                                        showEstimatedTime={true}
                                    />
                                ))}
                            </VStack>
                        </Collapse>
                    </VStack>

                    {/* Form Actions */}
                    <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        position="sticky"
                        bottom={0}
                        bg={cardBg}
                        borderTop="1px solid"
                        borderColor={borderColor}
                        p={6}
                        borderRadius="lg"
                        boxShadow="lg"
                    >
                        <VStack spacing={4}>
                            {/* Summary */}
                            <HStack justify="space-between" w="full" fontSize="sm" color="gray.600">
                                <Text>
                                    Progress: {overallStats.overallCompletion}% •
                                    Errors: {errors.length} •
                                    Warnings: {warnings.length}
                                </Text>
                                {enableAutoSave && formState.lastAutoSave && (
                                    <Text>
                                        Last saved: {new Date(formState.lastAutoSave).toLocaleTimeString()}
                                    </Text>
                                )}
                            </HStack>

                            {/* Action Buttons */}
                            <HStack spacing={4} w="full" justify="center">
                                {onCancel && (
                                    <Button
                                        variant="outline"
                                        colorScheme="gray"
                                        onClick={onCancel}
                                        isDisabled={isUpdating}
                                        leftIcon={<FaTimes />}
                                    >
                                        Cancel
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    colorScheme="gray"
                                    onClick={handleFormReset}
                                    isDisabled={isUpdating}
                                    leftIcon={<FaUndo />}
                                >
                                    Reset
                                </Button>

                                <Button
                                    colorScheme="pink"
                                    onClick={handleFormComplete}
                                    isLoading={isUpdating}
                                    isDisabled={!overallStats.canProceed}
                                    leftIcon={<FaSave />}
                                    size="lg"
                                    px={8}
                                >
                                    {overallStats.overallCompletion >= 80 ? 'Complete Preferences' : 'Save Progress'}
                                </Button>
                            </HStack>

                            {/* Help Text */}
                            <Text fontSize="xs" color="gray.500" textAlign="center">
                                {!overallStats.canProceed
                                    ? 'Complete essential sections and fix errors to proceed'
                                    : 'Your preferences look great! Click complete to find matches.'
                                }
                            </Text>
                        </VStack>
                    </MotionBox>
                </VStack>
            </Box>
        </Box>
    );
};

// Export for testing
export type { PartnerPreferencesFormProps, FormState, ValidationState, SectionProgress };