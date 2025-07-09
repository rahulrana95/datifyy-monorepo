// apps/frontend/src/mvp/profile/partnerPreferences/components/fields/MultiSelectTextField.tsx

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
    Box,
    Input,
    HStack,
    VStack,
    Text,
    Tag,
    TagLabel,
    TagCloseButton,
    IconButton,
    Button,
    Wrap,
    WrapItem,
    Tooltip,
    Badge,
    Alert,
    AlertIcon,
    useColorModeValue,
    useToast
} from '@chakra-ui/react';
import {
    FaPlus,
    FaTimes,
    FaCheck,
    FaInfoCircle,
    FaKeyboard
} from 'react-icons/fa';
import { motion, } from 'framer-motion';

import { Logger } from '../../../../../utils/Logger';

/**
 * Enterprise Multi-Select Text Field Component
 * 
 * Features:
 * - Custom text input with validation
 * - Duplicate prevention
 * - Character limits per tag and total
 * - Keyboard shortcuts (Enter, Comma, Tab)
 * - Paste support (comma/newline separated)
 * - Input sanitization and formatting
 * - Accessibility compliance
 * - Real-time validation feedback
 * - Undo/Redo functionality
 * - Smart suggestions based on input
 * 
 * Patterns:
 * - Controlled component with validation
 * - Command pattern for keyboard shortcuts
 * - Observer pattern for state changes
 * - Strategy pattern for input parsing
 */

interface MultiSelectTextFieldProps {
    value: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    maxItems?: number;
    maxCharactersPerItem?: number;
    maxTotalCharacters?: number;
    isDisabled?: boolean;
    isInvalid?: boolean;
    allowDuplicates?: boolean;
    caseSensitive?: boolean;
    separator?: string | string[];
    size?: 'sm' | 'md' | 'lg';
    colorScheme?: string;
    validateItem?: (item: string) => string | null;
    formatItem?: (item: string) => string;
    suggestions?: string[];
    renderTag?: (item: string, onRemove: () => void) => React.ReactNode;
    onMaxItemsReached?: () => void;
    onInvalidInput?: (input: string, reason: string) => void;
    'aria-label'?: string;
    'aria-describedby'?: string;
}

interface ValidationResult {
    isValid: boolean;
    error?: string;
    warning?: string;
}

const MotionBox = motion(Box);
const logger = new Logger('MultiSelectTextField');

// Default validation and formatting functions
const defaultValidateItem = (item: string): string | null => {
    if (!item.trim()) return 'Item cannot be empty';
    if (item.length < 2) return 'Item must be at least 2 characters';
    if (item.length > 50) return 'Item must be less than 50 characters';
    if (!/^[a-zA-Z0-9\s\-'&.]+$/i.test(item)) return 'Item contains invalid characters';
    return null;
};

const defaultFormatItem = (item: string): string => {
    return item
        .trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/^./, (char) => char.toUpperCase()); // Capitalize first letter
};

export const MultiSelectTextField: React.FC<MultiSelectTextFieldProps> = ({
    value = [],
    onChange,
    placeholder = 'Type and press Enter to add...',
    maxItems = 10,
    maxCharactersPerItem = 50,
    maxTotalCharacters = 500,
    isDisabled = false,
    isInvalid = false,
    allowDuplicates = false,
    caseSensitive = false,
    separator = [',', '\n', '\t'],
    size = 'md',
    colorScheme = 'blue',
    validateItem = defaultValidateItem,
    formatItem = defaultFormatItem,
    suggestions = [],
    renderTag,
    onMaxItemsReached,
    onInvalidInput,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy
}) => {

    // Local state
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [undoStack, setUndoStack] = useState<string[][]>([]);
    const [redoStack, setRedoStack] = useState<string[][]>([]);

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);

    // Toast for user feedback
    const toast = useToast();

    // Theme colors
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const invalidBorderColor = useColorModeValue('red.500', 'red.300');
    const focusBorderColor = useColorModeValue(`${colorScheme}.500`, `${colorScheme}.300`);
    const bgColor = useColorModeValue('white', 'gray.800');
    const disabledBg = useColorModeValue('gray.50', 'gray.700');
    const suggestionBg = useColorModeValue('gray.50', 'gray.700');

    // Calculate current stats
    const stats = useMemo(() => {
        const totalCharacters = value.join('').length;
        const isMaxItemsReached = value.length >= maxItems;
        const isMaxCharactersReached = totalCharacters >= maxTotalCharacters;

        return {
            itemCount: value.length,
            totalCharacters,
            isMaxItemsReached,
            isMaxCharactersReached,
            remainingItems: maxItems - value.length,
            remainingCharacters: maxTotalCharacters - totalCharacters
        };
    }, [value, maxItems, maxTotalCharacters]);

    // Parse separators into array
    const separatorArray = useMemo(() => {
        return Array.isArray(separator) ? separator : [separator];
    }, [separator]);

    // Filter suggestions based on input
    const filteredSuggestions = useMemo(() => {
        if (!inputValue.trim() || !suggestions.length) return [];

        const input = inputValue.toLowerCase();
        return suggestions
            .filter(suggestion => {
                const suggestionLower = suggestion.toLowerCase();
                const isMatch = suggestionLower.includes(input);
                const isNotSelected = caseSensitive
                    ? !value.includes(suggestion)
                    : !value.some(v => v.toLowerCase() === suggestionLower);
                return isMatch && isNotSelected;
            })
            .slice(0, 5); // Limit to 5 suggestions
    }, [inputValue, suggestions, value, caseSensitive]);

    // Validate input item
    const validateInputItem = useCallback((item: string): ValidationResult => {
        const trimmedItem = item.trim();

        if (!trimmedItem) {
            return { isValid: false, error: 'Cannot add empty item' };
        }

        // Custom validation
        const customError = validateItem(trimmedItem);
        if (customError) {
            return { isValid: false, error: customError };
        }

        // Check duplicates
        if (!allowDuplicates) {
            const exists = caseSensitive
                ? value.includes(trimmedItem)
                : value.some(v => v.toLowerCase() === trimmedItem.toLowerCase());

            if (exists) {
                return { isValid: false, error: 'Item already exists' };
            }
        }

        // Check limits
        if (stats.isMaxItemsReached) {
            return { isValid: false, error: `Maximum ${maxItems} items allowed` };
        }

        if (trimmedItem.length > maxCharactersPerItem) {
            return { isValid: false, error: `Item too long (max ${maxCharactersPerItem} characters)` };
        }

        if (stats.totalCharacters + trimmedItem.length > maxTotalCharacters) {
            return { isValid: false, error: 'Total character limit exceeded' };
        }

        return { isValid: true };
    }, [
        validateItem,
        allowDuplicates,
        caseSensitive,
        value,
        stats,
        maxItems,
        maxCharactersPerItem,
        maxTotalCharacters
    ]);

    // Add item to list
    const addItem = useCallback((item: string) => {
        const validation = validateInputItem(item);

        if (!validation.isValid) {
            setInputError(validation.error || 'Invalid input');
            onInvalidInput?.(item, validation.error || 'Invalid input');

            toast({
                title: 'Cannot add item',
                description: validation.error,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
                size: 'sm'
            });

            logger.warn('Failed to add item', { item, error: validation.error });
            return false;
        }

        // Save state for undo
        setUndoStack(prev => [...prev.slice(-9), value]); // Keep last 10 states
        setRedoStack([]); // Clear redo stack

        // Format and add item
        const formattedItem = formatItem(item);
        const newValue = [...value, formattedItem];
        onChange(newValue);

        // Clear input and error
        setInputValue('');
        setInputError(null);
        setShowSuggestions(false);

        logger.info('Item added successfully', {
            item: formattedItem,
            totalItems: newValue.length
        });

        // Check if max reached
        if (newValue.length >= maxItems) {
            onMaxItemsReached?.();
        }

        return true;
    }, [
        validateInputItem,
        onInvalidInput,
        toast,
        value,
        formatItem,
        onChange,
        maxItems,
        onMaxItemsReached
    ]);

    // Remove item from list
    const removeItem = useCallback((indexToRemove: number) => {
        if (isDisabled) return;

        // Save state for undo
        setUndoStack(prev => [...prev.slice(-9), value]);
        setRedoStack([]);

        const newValue = value.filter((_, index) => index !== indexToRemove);
        onChange(newValue);

        logger.info('Item removed', {
            removedItem: value[indexToRemove],
            totalItems: newValue.length
        });
    }, [isDisabled, value, onChange]);

    // Parse and add multiple items
    const parseAndAddItems = useCallback((text: string) => {
        const items = text
            .split(new RegExp(`[${separatorArray.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')}]`))
            .map(item => item.trim())
            .filter(item => item.length > 0);

        let addedCount = 0;
        const errors: string[] = [];

        items.forEach(item => {
            if (addItem(item)) {
                addedCount++;
            } else {
                errors.push(item);
            }
        });

        if (addedCount > 0) {
            toast({
                title: `Added ${addedCount} item${addedCount > 1 ? 's' : ''}`,
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
                size: 'sm'
            });
        }

        if (errors.length > 0) {
            logger.warn('Some items failed to add', { errors });
        }
    }, [separatorArray, addItem, toast]);

    // Handle keyboard events
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isDisabled) return;

        const { key, ctrlKey, metaKey } = e;
        const isModifier = ctrlKey || metaKey;

        switch (key) {
            case 'Enter':
                e.preventDefault();
                if (inputValue.trim()) {
                    addItem(inputValue);
                }
                break;

            case 'Tab':
                if (inputValue.trim()) {
                    e.preventDefault();
                    addItem(inputValue);
                }
                break;

            case ',':
                if (separatorArray.includes(',')) {
                    e.preventDefault();
                    if (inputValue.trim()) {
                        addItem(inputValue);
                    }
                }
                break;

            case 'Backspace':
                if (!inputValue && value.length > 0) {
                    e.preventDefault();
                    removeItem(value.length - 1);
                }
                break;

            case 'z':
                if (isModifier && !e.shiftKey) {
                    e.preventDefault();
                    handleUndo();
                } else if (isModifier && e.shiftKey) {
                    e.preventDefault();
                    handleRedo();
                }
                break;

            case 'Escape':
                setInputValue('');
                setInputError(null);
                setShowSuggestions(false);
                break;

            default:
                setInputError(null);
                break;
        }
    }, [isDisabled, inputValue, addItem, separatorArray, value, removeItem]);

    // Handle input changes
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setInputError(null);
        setShowSuggestions(newValue.trim().length > 0 && filteredSuggestions.length > 0);
    }, [filteredSuggestions.length]);

    // Handle paste events
    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');

        if (pastedText.includes(',') || pastedText.includes('\n')) {
            parseAndAddItems(pastedText);
        } else {
            setInputValue(pastedText.trim());
        }
    }, [parseAndAddItems]);

    // Undo functionality
    const handleUndo = useCallback(() => {
        if (undoStack.length === 0) return;

        const previousState = undoStack[undoStack.length - 1];
        setRedoStack(prev => [...prev, value]);
        setUndoStack(prev => prev.slice(0, -1));
        onChange(previousState);

        logger.info('Undo performed', {
            previousItems: previousState.length,
            currentItems: value.length
        });
    }, [undoStack, value, onChange]);

    // Redo functionality
    const handleRedo = useCallback(() => {
        if (redoStack.length === 0) return;

        const nextState = redoStack[redoStack.length - 1];
        setUndoStack(prev => [...prev, value]);
        setRedoStack(prev => prev.slice(0, -1));
        onChange(nextState);

        logger.info('Redo performed', {
            nextItems: nextState.length,
            currentItems: value.length
        });
    }, [redoStack, value, onChange]);

    // Add suggestion
    const addSuggestion = useCallback((suggestion: string) => {
        addItem(suggestion);
        inputRef.current?.focus();
    }, [addItem]);

    // Size configurations
    const sizeConfig = {
        sm: { fontSize: 'sm', py: 1, px: 2, tagSize: 'sm' as const },
        md: { fontSize: 'md', py: 2, px: 3, tagSize: 'md' as const },
        lg: { fontSize: 'lg', py: 3, px: 4, tagSize: 'lg' as const }
    };

    const config = sizeConfig[size];

    return (
        <Box w="full">
            {/* Selected Tags */}
            {value.length > 0 && (
                <Wrap spacing={2} mb={3}>
                    {value.map((item, index) => (
                        <WrapItem key={`${item}-${index}`}>
                            {/* @ts-ignore */}
                            <>
                                <MotionBox
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {renderTag ? (
                                        renderTag(item, () => removeItem(index))
                                    ) : (
                                        <Tag
                                            size={config.tagSize}
                                            colorScheme={colorScheme}
                                            borderRadius="full"
                                            variant="solid"
                                        >
                                            <TagLabel>{item}</TagLabel>
                                            {!isDisabled && (
                                                <TagCloseButton
                                                    onClick={() => removeItem(index)}
                                                    aria-label={`Remove ${item}`}
                                                />
                                            )}
                                        </Tag>
                                    )}
                                </MotionBox>
                            </>
                        </WrapItem>
                    ))}
                </Wrap>
            )}

            {/* Input Field */}
            <VStack spacing={2} align="stretch">
                <HStack>
                    <Box flex="1" position="relative">
                        <Input
                            ref={inputRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            placeholder={stats.isMaxItemsReached ? 'Maximum items reached' : placeholder}
                            fontSize={config.fontSize}
                            isDisabled={isDisabled || stats.isMaxItemsReached}
                            isInvalid={isInvalid || Boolean(inputError)}
                            bg={isDisabled ? disabledBg : bgColor}
                            borderColor={inputError ? invalidBorderColor : borderColor}
                            _focus={{
                                borderColor: focusBorderColor,
                                boxShadow: `0 0 0 1px ${focusBorderColor}`
                            }}
                            maxLength={maxCharactersPerItem}
                            aria-label={ariaLabel || 'Add new item'}
                            aria-describedby={ariaDescribedBy}
                        />

                        {/* Suggestions Dropdown */}
                        {/* @ts-ignore */}
                        <>
                            {showSuggestions && filteredSuggestions.length > 0 && (
                                <MotionBox
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    position="absolute"
                                    top="100%"
                                    left={0}
                                    right={0}
                                    zIndex={1000}
                                    bg={suggestionBg}
                                    border="1px solid"
                                    borderColor={borderColor}
                                    borderRadius="md"
                                    boxShadow="md"
                                    mt={1}
                                    maxH="150px"
                                    overflowY="auto"
                                >
                                    {filteredSuggestions.map((suggestion, index) => (
                                        <Box
                                            key={suggestion}
                                            px={3}
                                            py={2}
                                            cursor="pointer"
                                            _hover={{ bg: 'gray.100' }}
                                            onClick={() => addSuggestion(suggestion)}
                                            fontSize="sm"
                                        >
                                            {suggestion}
                                        </Box>
                                    ))}
                                </MotionBox>
                            )}
                        </>
                    </Box>

                    {/* Add Button */}
                    <Button
                        size={size}
                        colorScheme={colorScheme}
                        leftIcon={<FaPlus />}
                        onClick={() => inputValue.trim() && addItem(inputValue)}
                        isDisabled={isDisabled || !inputValue.trim() || stats.isMaxItemsReached}
                        variant="outline"
                    >
                        Add
                    </Button>
                </HStack>

                {/* Error Message */}
                {inputError && (
                    <Alert status="error" size="sm" borderRadius="md">
                        <AlertIcon />
                        <Text fontSize="sm">{inputError}</Text>
                    </Alert>
                )}

                {/* Stats and Controls */}
                <HStack justify="space-between" fontSize="xs" color="gray.500">
                    <HStack spacing={4}>
                        <Text>
                            Items: {stats.itemCount}/{maxItems}
                        </Text>
                        <Text>
                            Characters: {stats.totalCharacters}/{maxTotalCharacters}
                        </Text>
                    </HStack>

                    <HStack spacing={2}>
                        {/* Undo/Redo */}
                        <Tooltip label="Undo (Ctrl+Z)">
                            <IconButton
                                size="xs"
                                variant="ghost"
                                aria-label="Undo"
                                icon={<FaTimes />}
                                onClick={handleUndo}
                                isDisabled={undoStack.length === 0}
                                transform="rotate(45deg)"
                            />
                        </Tooltip>

                        <Tooltip label="Keyboard shortcuts">
                            <IconButton
                                size="xs"
                                variant="ghost"
                                aria-label="Keyboard shortcuts"
                                icon={<FaKeyboard />}
                            />
                        </Tooltip>

                        {/* Clear All */}
                        {value.length > 0 && (
                            <Button
                                size="xs"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => {
                                    setUndoStack(prev => [...prev.slice(-9), value]);
                                    setRedoStack([]);
                                    onChange([]);
                                }}
                                isDisabled={isDisabled}
                            >
                                Clear All
                            </Button>
                        )}
                    </HStack>
                </HStack>

                {/* Help Text */}
                <Text fontSize="xs" color="gray.500">
                    Press Enter, Tab, or comma to add items. Paste comma-separated values for bulk add.
                </Text>
            </VStack>
        </Box>
    );
};

// Export for testing
export type { MultiSelectTextFieldProps, ValidationResult };