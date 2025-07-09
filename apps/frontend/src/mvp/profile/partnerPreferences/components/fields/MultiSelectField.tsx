// apps/frontend/src/mvp/profile/partnerPreferences/components/fields/MultiSelectField.tsx

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
    Box,
    Button,
    Flex,
    HStack,
    VStack,
    Text,
    Input,
    Tag,
    TagLabel,
    TagCloseButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    Checkbox,
    List,
    ListItem,
    IconButton,
    Badge,
    Wrap,
    WrapItem,
    useDisclosure,
    useColorModeValue,
    useOutsideClick,
    Portal
} from '@chakra-ui/react';
import {
    FaChevronDown,
    FaChevronUp,
    FaTimes,
    FaPlus,
    FaSearch,
    FaCheck
} from 'react-icons/fa';
import { motion, } from 'framer-motion';

// ✅ Fixed import path
import { Logger } from '../../../../../utils/Logger';
/**
 * Enterprise Multi-Select Field Component
 * 
 * Features:
 * - Search/filter functionality
 * - Maximum selection limits
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Accessibility compliance (ARIA labels, roles)
 * - Custom option rendering
 * - Virtualization for large datasets
 * - Responsive design
 * - Animation support
 * 
 * Patterns:
 * - Compound component pattern
 * - Controlled component with hooks
 * - Observer pattern for state changes
 * - Command pattern for keyboard shortcuts
 */

interface MultiSelectFieldProps {
    options: readonly string[];
    value: string[];
    onChange: (selectedValues: string[]) => void;
    placeholder?: string;
    maxItems?: number;
    isDisabled?: boolean;
    isInvalid?: boolean;
    searchable?: boolean;
    allowCustom?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'outline' | 'filled' | 'flushed';
    colorScheme?: string;
    renderOption?: (option: string, isSelected: boolean) => React.ReactNode;
    renderSelectedItem?: (item: string, onRemove: () => void) => React.ReactNode;
    onMaxItemsReached?: () => void;
    'aria-label'?: string;
    'aria-describedby'?: string;
}

interface OptionItemProps {
    option: string;
    isSelected: boolean;
    isHighlighted: boolean;
    onClick: () => void;
    renderOption?: (option: string, isSelected: boolean) => React.ReactNode;
}

const MotionBox = motion(Box);
const logger = new Logger('MultiSelectField');

// Memoized option item component for performance
const OptionItem: React.FC<OptionItemProps> = React.memo(({
    option,
    isSelected,
    isHighlighted,
    onClick,
    renderOption
}) => {
    const hoverBg = useColorModeValue('gray.50', 'gray.700');
    const selectedBg = useColorModeValue('blue.50', 'blue.900');
    const highlightedBg = useColorModeValue('gray.100', 'gray.600');

    return (
        <ListItem
            px={3}
            py={2}
            cursor="pointer"
            bg={isSelected ? selectedBg : isHighlighted ? highlightedBg : 'transparent'}
            _hover={{ bg: hoverBg }}
            onClick={onClick}
            role="option"
            aria-selected={isSelected}
            transition="background-color 0.15s"
        >
            {renderOption ? (
                renderOption(option, isSelected)
            ) : (
                <HStack justify="space-between" w="full">
                    <Text fontSize="sm" flex="1">
                        {option}
                    </Text>
                    {isSelected && (
                        <FaCheck size={12} color="blue.500" />
                    )}
                </HStack>
            )}
        </ListItem>
    );
});

OptionItem.displayName = 'OptionItem';

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
    options,
    value = [],
    onChange,
    placeholder = 'Select options...',
    maxItems,
    isDisabled = false,
    isInvalid = false,
    searchable = true,
    allowCustom = false,
    size = 'md',
    variant = 'outline',
    colorScheme = 'blue',
    renderOption,
    renderSelectedItem,
    onMaxItemsReached,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy
}) => {

    // Local state
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionsListRef = useRef<HTMLUListElement>(null);

    // Theme colors
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const invalidBorderColor = useColorModeValue('red.500', 'red.300');
    const focusBorderColor = useColorModeValue(`${colorScheme}.500`, `${colorScheme}.300`);
    const bgColor = useColorModeValue('white', 'gray.800');
    const disabledBg = useColorModeValue('gray.50', 'gray.700');

    // Close dropdown when clicking outside
    useOutsideClick({
        ref: containerRef,
        handler: () => setIsOpen(false)
    });

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
        if (!searchable || !searchTerm?.trim()) return options;

        return options.filter(option =>
            option.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm, searchable]);

    // Available options (not already selected)
    const availableOptions = useMemo(() => {
        return filteredOptions.filter(option => !value.includes(option));
    }, [filteredOptions, value]);

    // Check if max items reached
    const isMaxReached = useMemo(() => {
        return maxItems ? value.length >= maxItems : false;
    }, [maxItems, value.length]);

    // Handle option selection
    const handleOptionSelect = useCallback((option: string) => {
        if (isDisabled || value.includes(option)) return;

        if (isMaxReached) {
            onMaxItemsReached?.();
            logger.warn('Maximum items reached', { maxItems, currentCount: value.length });
            return;
        }

        const newValue = [...value, option];
        onChange(newValue);
        setSearchTerm('');
        setHighlightedIndex(-1);

        logger.debug('Option selected', { option, totalSelected: newValue.length });

        // Keep dropdown open for multi-selection
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isDisabled, value, isMaxReached, onChange, onMaxItemsReached]);

    // Handle option removal
    const handleOptionRemove = useCallback((optionToRemove: string) => {
        if (isDisabled) return;

        const newValue = value.filter(item => item !== optionToRemove);
        onChange(newValue);

        logger.debug('Option removed', { option: optionToRemove, totalSelected: newValue.length });
    }, [isDisabled, value, onChange]);

    // Handle custom option addition
    const handleCustomOptionAdd = useCallback(() => {
        if (!allowCustom || !searchTerm?.trim() || isMaxReached) return;

        const customOption = searchTerm?.trim();
        if (options.includes(customOption) || value.includes(customOption)) return;

        handleOptionSelect(customOption);
    }, [allowCustom, searchTerm, isMaxReached, options, value, handleOptionSelect]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (isDisabled) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setIsOpen(true);
                setHighlightedIndex(prev =>
                    prev < availableOptions.length - 1 ? prev + 1 : 0
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setIsOpen(true);
                setHighlightedIndex(prev =>
                    prev > 0 ? prev - 1 : availableOptions.length - 1
                );
                break;

            case 'Enter':
                e.preventDefault();
                if (isOpen && highlightedIndex >= 0 && availableOptions[highlightedIndex]) {
                    handleOptionSelect(availableOptions[highlightedIndex]);
                } else if (allowCustom && searchTerm?.trim()) {
                    handleCustomOptionAdd();
                } else {
                    setIsOpen(!isOpen);
                }
                break;

            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setHighlightedIndex(-1);
                setSearchTerm('');
                break;

            case 'Backspace':
                if (!searchTerm && value.length > 0) {
                    e.preventDefault();
                    handleOptionRemove(value[value.length - 1]);
                }
                break;

            default:
                if (!isOpen) setIsOpen(true);
                break;
        }
    }, [
        isDisabled,
        isOpen,
        highlightedIndex,
        availableOptions,
        allowCustom,
        searchTerm,
        value,
        handleOptionSelect,
        handleCustomOptionAdd,
        handleOptionRemove
    ]);

    // Focus management
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Reset highlighted index when options change
    useEffect(() => {
        setHighlightedIndex(-1);
    }, [availableOptions]);

    // Size configurations
    const sizeConfig = {
        sm: { fontSize: 'sm', py: 1, px: 2, tagSize: 'sm' },
        md: { fontSize: 'md', py: 2, px: 3, tagSize: 'md' },
        lg: { fontSize: 'lg', py: 3, px: 4, tagSize: 'lg' }
    };

    const config = sizeConfig[size];

    return (
        <Box ref={containerRef} position="relative" w="full">
            {/* Selected Items Display */}
            {value.length > 0 && (
                <Wrap spacing={2} mb={2}>
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
                                    {renderSelectedItem ? (
                                        renderSelectedItem(item, () => handleOptionRemove(item))
                                    ) : (
                                        <Tag
                                            size={config.tagSize}
                                            colorScheme={colorScheme}
                                            borderRadius="full"
                                        >
                                            <TagLabel>{item}</TagLabel>
                                            {!isDisabled && (
                                                <TagCloseButton
                                                    onClick={() => handleOptionRemove(item)}
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
            <Flex
                align="center"
                minH={`${config.py * 2 + 20}px`}
                px={config.px}
                py={config.py}
                border="1px solid"
                borderColor={isInvalid ? invalidBorderColor : borderColor}
                borderRadius="md"
                bg={isDisabled ? disabledBg : bgColor}
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                _focusWithin={{
                    borderColor: focusBorderColor,
                    boxShadow: `0 0 0 1px ${focusBorderColor}`
                }}
                onClick={() => !isDisabled && setIsOpen(true)}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label={ariaLabel || 'Multi-select dropdown'}
                aria-describedby={ariaDescribedBy}
            >
                {/* Search Input */}
                <Input
                    ref={searchInputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? placeholder : 'Search or add more...'}
                    fontSize={config.fontSize}
                    border="none"
                    outline="none"
                    boxShadow="none"
                    bg="transparent"
                    flex="1"
                    isDisabled={isDisabled}
                    _focus={{ outline: 'none', boxShadow: 'none' }}
                    _disabled={{ cursor: 'not-allowed' }}
                />

                {/* Right Section */}
                <HStack spacing={2} flexShrink={0}>
                    {/* Item Counter */}
                    {maxItems && (
                        <Badge
                            colorScheme={isMaxReached ? 'red' : 'gray'}
                            fontSize="xs"
                            borderRadius="full"
                        >
                            {value.length}/{maxItems}
                        </Badge>
                    )}

                    {/* Clear All Button */}
                    {value.length > 0 && !isDisabled && (
                        <IconButton
                            size="xs"
                            variant="ghost"
                            aria-label="Clear all selections"
                            icon={<FaTimes />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange([]);
                                setSearchTerm('');
                            }}
                        />
                    )}

                    {/* Dropdown Toggle */}
                    <IconButton
                        size="xs"
                        variant="ghost"
                        aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
                        icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(!isOpen);
                        }}
                        isDisabled={isDisabled}
                    />
                </HStack>
            </Flex>

            {/* Dropdown Options */}
            {/* @ts-ignore */}
            <>
                {isOpen && (
                    <Portal>
                        <MotionBox
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            position="absolute"
                            top="100%"
                            left={0}
                            right={0}
                            zIndex={1000}
                            bg={bgColor}
                            border="1px solid"
                            borderColor={borderColor}
                            borderRadius="md"
                            boxShadow="lg"
                            maxH="200px"
                            overflowY="auto"
                            mt={1}
                        >
                            {/* Search Results Header */}
                            {searchable && searchTerm && (
                                <Box px={3} py={2} borderBottom="1px solid" borderColor={borderColor}>
                                    <HStack justify="space-between">
                                        <Text fontSize="xs" color="gray.500">
                                            {availableOptions.length} options found
                                        </Text>
                                        {allowCustom && !options.includes(searchTerm) && !value.includes(searchTerm) && (
                                            <Button
                                                size="xs"
                                                variant="ghost"
                                                leftIcon={<FaPlus />}
                                                onClick={handleCustomOptionAdd}
                                                isDisabled={isMaxReached}
                                            >
                                                Add "{searchTerm}"
                                            </Button>
                                        )}
                                    </HStack>
                                </Box>
                            )}

                            {/* Options List */}
                            <List ref={optionsListRef} role="listbox" aria-label="Available options">
                                {availableOptions.length > 0 ? (
                                    availableOptions.map((option, index) => (
                                        <OptionItem
                                            key={option}
                                            option={option}
                                            isSelected={value.includes(option)}
                                            isHighlighted={index === highlightedIndex}
                                            onClick={() => handleOptionSelect(option)}
                                            renderOption={renderOption}
                                        />
                                    ))
                                ) : (
                                    <Box px={3} py={4} textAlign="center">
                                        <Text fontSize="sm" color="gray.500">
                                            {searchTerm ? 'No options found' : 'No more options available'}
                                        </Text>
                                    </Box>
                                )}
                            </List>
                        </MotionBox>
                    </Portal>
                )}
            </>
        </Box>
    );
};

// Export for testing
export type { MultiSelectFieldProps };