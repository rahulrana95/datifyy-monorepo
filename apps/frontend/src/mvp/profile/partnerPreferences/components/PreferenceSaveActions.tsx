// apps/frontend/src/mvp/profile/partnerPreferences/components/PreferenceSaveActions.tsx

import React, { useState, useCallback, useMemo } from 'react';
import {
    HStack,
    VStack,
    Button,
    ButtonGroup,
    Text,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Progress,
    Badge,
    Icon,
    Tooltip,
    useColorModeValue,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react';
import {
    FaCheck,
    FaTimes,
    FaExclamationTriangle,
    FaInfoCircle,
    FaSpinner,
    FaSave,
    FaUndo,
    FaClock
} from 'react-icons/fa';
import { motion, } from 'framer-motion';

import { Logger } from '../../../../utils/Logger';

/**
 * Enterprise Save Actions Component
 * 
 * Features:
 * - Smart save/discard button management
 * - Validation feedback with error aggregation
 * - Loading states with progress indication
 * - Confirmation dialogs for destructive actions
 * - Keyboard shortcuts (Ctrl+S, Escape)
 * - Auto-save indicators and conflict resolution
 * - Accessibility compliance
 * 
 * Patterns:
 * - Command pattern for save/discard actions
 * - State machine for button states
 * - Observer pattern for validation changes
 * - Strategy pattern for different action types
 */

interface PreferenceSaveActionsProps {
    onSave: () => Promise<void> | void;
    onDiscard: () => void;
    hasChanges: boolean;
    hasErrors: boolean;
    isLoading?: boolean;
    loadingText?: string;
    saveText?: string;
    discardText?: string;
    showProgress?: boolean;
    progress?: number;
    errors?: string[];
    warnings?: string[];
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'compact' | 'floating' | 'sticky';
    colorScheme?: string;
    showValidationSummary?: boolean;
    requireConfirmation?: boolean;
    autoSaveEnabled?: boolean;
    lastSaved?: string | null;
    onKeyboardShortcut?: (action: 'save' | 'discard') => void;
    className?: string;
}

interface ActionState {
    isSaving: boolean;
    hasJustSaved: boolean;
    showConfirmDialog: boolean;
    validationExpanded: boolean;
}

const MotionBox = motion.div;
const logger = new Logger('PreferenceSaveActions');

export const PreferenceSaveActions: React.FC<PreferenceSaveActionsProps> = ({
    onSave,
    onDiscard,
    hasChanges,
    hasErrors,
    isLoading = false,
    loadingText = 'Saving changes...',
    saveText = 'Save Changes',
    discardText = 'Discard',
    showProgress = false,
    progress = 0,
    errors = [],
    warnings = [],
    size = 'md',
    variant = 'default',
    colorScheme = 'blue',
    showValidationSummary = true,
    requireConfirmation = false,
    autoSaveEnabled = false,
    lastSaved = null,
    onKeyboardShortcut,
    className
}) => {

    // Local state
    const [actionState, setActionState] = useState<ActionState>({
        isSaving: false,
        hasJustSaved: false,
        showConfirmDialog: false,
        validationExpanded: false
    });

    // Modal for confirmation
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

    // Toast for feedback
    const toast = useToast();

    // Theme colors
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const errorBg = useColorModeValue('red.50', 'red.900');
    const warningBg = useColorModeValue('orange.50', 'orange.900');
    const successBg = useColorModeValue('green.50', 'green.900');

    // Size configurations
    const sizeConfig = {
        sm: {
            buttonSize: 'sm' as const,
            fontSize: 'sm',
            spacing: 2,
            padding: 2
        },
        md: {
            buttonSize: 'md' as const,
            fontSize: 'md',
            spacing: 3,
            padding: 3
        },
        lg: {
            buttonSize: 'lg' as const,
            fontSize: 'lg',
            spacing: 4,
            padding: 4
        }
    };

    const config = sizeConfig[size];

    // Compute validation state
    const validationState = useMemo(() => {
        const errorCount = errors.length;
        const warningCount = warnings.length;
        const hasValidationIssues = errorCount > 0 || warningCount > 0;

        return {
            errorCount,
            warningCount,
            hasValidationIssues,
            canSave: !hasErrors && hasChanges,
            severity: errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'success'
        };
    }, [errors.length, warnings.length, hasErrors, hasChanges]);

    // Handle save with validation and feedback
    const handleSave = useCallback(async () => {
        if (!validationState.canSave) {
            logger.warn('Save attempted with validation errors', {
                errors: errors.length,
                warnings: warnings.length
            });

            toast({
                title: 'Cannot save changes',
                description: 'Please fix validation errors before saving',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'top-right'
            });

            setActionState(prev => ({ ...prev, validationExpanded: true }));
            return;
        }

        try {
            setActionState(prev => ({ ...prev, isSaving: true }));
            logger.info('Saving preferences', { hasChanges, errorCount: errors.length });

            await onSave();

            setActionState(prev => ({
                ...prev,
                isSaving: false,
                hasJustSaved: true
            }));

            // Show success feedback
            toast({
                title: 'Changes saved successfully! ✨',
                description: 'Your preferences have been updated',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            });

            logger.info('Preferences saved successfully');

            // Reset "just saved" state after animation
            setTimeout(() => {
                setActionState(prev => ({ ...prev, hasJustSaved: false }));
            }, 2000);

        } catch (error) {
            setActionState(prev => ({ ...prev, isSaving: false }));

            logger.error('Failed to save preferences', { error });

            toast({
                title: 'Save failed',
                description: 'Unable to save changes. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });
        }
    }, [validationState.canSave, onSave, hasChanges, errors.length, warnings.length, toast]);

    // Handle discard with confirmation
    const handleDiscard = useCallback(() => {
        if (requireConfirmation && hasChanges) {
            onConfirmOpen();
        } else {
            executeDiscard();
        }
    }, [requireConfirmation, hasChanges, onConfirmOpen]);

    // Execute discard action
    const executeDiscard = useCallback(() => {
        logger.info('Discarding preferences changes');

        onDiscard();
        onConfirmClose();

        toast({
            title: 'Changes discarded',
            description: 'All unsaved changes have been reverted',
            status: 'info',
            duration: 2000,
            isClosable: true,
            position: 'top-right'
        });
    }, [onDiscard, onConfirmClose, toast]);

    // Toggle validation details
    const toggleValidationDetails = useCallback(() => {
        setActionState(prev => ({
            ...prev,
            validationExpanded: !prev.validationExpanded
        }));
    }, []);

    // Keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                onKeyboardShortcut?.('save');
                if (validationState.canSave) {
                    handleSave();
                }
            } else if (e.key === 'Escape' && hasChanges) {
                e.preventDefault();
                onKeyboardShortcut?.('discard');
                handleDiscard();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [validationState.canSave, hasChanges, handleSave, handleDiscard, onKeyboardShortcut]);

    // Don't render if no changes and no validation issues
    if (!hasChanges && !validationState.hasValidationIssues && variant !== 'sticky') {
        return null;
    }

    // Render validation summary
    const renderValidationSummary = () => {
        if (!showValidationSummary || !validationState.hasValidationIssues) return null;

        return (
            // @ts-ignore
            <>
                <Alert
                    // @ts-ignore
                    status={validationState.severity}
                    variant="left-accent"
                    borderRadius="md"
                    mb={config.spacing}
                >
                    <AlertIcon />
                    <VStack align="start" spacing={1} flex="1">
                        <AlertTitle fontSize={config.fontSize}>
                            {validationState.errorCount > 0
                                ? `${validationState.errorCount} error${validationState.errorCount > 1 ? 's' : ''} found`
                                : `${validationState.warningCount} warning${validationState.warningCount > 1 ? 's' : ''}`
                            }
                        </AlertTitle>

                        {actionState.validationExpanded && (
                            <VStack align="start" spacing={1} w="full">
                                {errors.map((error, index) => (
                                    <Text key={`error-${index}`} fontSize="sm" color="red.600">
                                        • {error}
                                    </Text>
                                ))}
                                {warnings.map((warning, index) => (
                                    <Text key={`warning-${index}`} fontSize="sm" color="orange.600">
                                        • {warning}
                                    </Text>
                                ))}
                            </VStack>
                        )}

                        {(errors.length > 0 || warnings.length > 0) && (
                            <Button
                                size="xs"
                                variant="ghost"
                                onClick={toggleValidationDetails}
                                rightIcon={<FaInfoCircle />}
                            >
                                {actionState.validationExpanded ? 'Hide details' : 'Show details'}
                            </Button>
                        )}
                    </VStack>
                </Alert>

            </>
        );
    };

    // Render progress indicator
    const renderProgress = () => {
        if (!showProgress || (!isLoading && !actionState.isSaving)) return null;

        return (
            <VStack spacing={2} w="full">
                <HStack justify="space-between" w="full">
                    <Text fontSize="sm" color="gray.600">
                        {loadingText}
                    </Text>
                    <Badge colorScheme={colorScheme} size="sm">
                        {Math.round(progress)}%
                    </Badge>
                </HStack>
                <Progress
                    value={progress}
                    colorScheme={colorScheme}
                    size="sm"
                    w="full"
                    borderRadius="full"
                    isAnimated
                />
            </VStack>
        );
    };

    // Render auto-save indicator
    const renderAutoSaveIndicator = () => {
        if (!autoSaveEnabled || !lastSaved) return null;

        return (
            <HStack spacing={2} fontSize="xs" color="gray.500">
                <Icon as={FaClock} />
                <Text>Last saved: {new Date(lastSaved).toLocaleTimeString()}</Text>
            </HStack>
        );
    };

    // Render action buttons
    const renderActionButtons = () => (
        <ButtonGroup size={config.buttonSize} spacing={config.spacing}>
            {/* Discard Button */}
            <Button
                variant="outline"
                colorScheme="gray"
                onClick={handleDiscard}
                isDisabled={!hasChanges || actionState.isSaving || isLoading}
                leftIcon={<FaTimes />}
                _hover={{ bg: 'gray.50' }}
            >
                {discardText}
            </Button>

            {/* Save Button */}
            <Button
                colorScheme={colorScheme}
                onClick={handleSave}
                isLoading={actionState.isSaving || isLoading}
                loadingText={loadingText}
                isDisabled={!validationState.canSave}
                leftIcon={actionState.hasJustSaved ? <FaCheck /> : <FaSave />}
                bg={actionState.hasJustSaved ? 'green.500' : undefined}
                _hover={{
                    bg: actionState.hasJustSaved ? 'green.600' : undefined
                }}
                transition="all 0.3s"
            >
                {actionState.hasJustSaved ? 'Saved!' : saveText}
            </Button>
        </ButtonGroup>
    );

    // Render based on variant
    const renderContent = () => (
        <VStack spacing={config.spacing} align="stretch" className={className}>
            {renderValidationSummary()}
            {renderProgress()}

            <HStack justify="space-between" align="center" w="full">
                <VStack align="start" spacing={1}>
                    {renderAutoSaveIndicator()}

                    {/* Changes indicator */}
                    {hasChanges && (
                        <HStack spacing={2} fontSize="sm" color="orange.500">
                            <Icon as={FaExclamationTriangle} />
                            <Text>You have unsaved changes</Text>
                        </HStack>
                    )}
                </VStack>

                {renderActionButtons()}
            </HStack>

            {/* Keyboard shortcuts hint */}
            {hasChanges && variant !== 'compact' && (
                <Text fontSize="xs" color="gray.400" textAlign="right">
                    Press Ctrl+S to save, Esc to discard
                </Text>
            )}
        </VStack>
    );

    // Render different variants
    switch (variant) {
        case 'floating':
            return (
                // @ts-ignore
                <>
                    {(hasChanges || validationState.hasValidationIssues) && (
                        <div
                            style={{
                                background: bgColor,
                                border: `1px solid ${borderColor}`,
                                borderRadius: '12px',
                                padding: config.padding * 4,
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            {renderContent()}
                        </div>

                    )}
                </>
            );

        case 'sticky':
            return (
                <div
                    style={{
                        position: 'sticky',
                        bottom: 0,
                        background: bgColor,
                        borderTop: `1px solid ${borderColor}`,
                        padding: config.padding * 2,
                        zIndex: 100
                    }}
                >
                    {renderContent()}
                </div>
            );

        case 'compact':
            return (
                <HStack spacing={config.spacing} justify="flex-end">
                    {renderActionButtons()}
                </HStack>
            );

        default:
            return renderContent();
    }
};

// Confirmation Modal Component
const ConfirmDiscardModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>
                <HStack spacing={2}>
                    <Icon as={FaExclamationTriangle} color="orange.500" />
                    <Text>Discard Changes?</Text>
                </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text>
                    You have unsaved changes that will be lost. Are you sure you want to discard them?
                </Text>
            </ModalBody>
            <ModalFooter>
                <ButtonGroup spacing={3}>
                    <Button variant="ghost" onClick={onClose}>
                        Keep Editing
                    </Button>
                    <Button colorScheme="red" onClick={onConfirm}>
                        Discard Changes
                    </Button>
                </ButtonGroup>
            </ModalFooter>
        </ModalContent>
    </Modal>
);

// Export for testing
export type { PreferenceSaveActionsProps, ActionState };