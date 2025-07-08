// apps/frontend/src/mvp/profile/partnerPreferences/components/PreferenceFieldGroup.tsx

import React, { memo, useCallback, useMemo } from 'react';
import {
    SimpleGrid,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Select,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Switch,
    Text,
    Box,
    Icon,
    Flex,
    Badge,
    Tooltip,
    useColorModeValue
} from '@chakra-ui/react';
import { FaAsterisk, FaInfoCircle } from 'react-icons/fa';

import { FormField, FormFieldType, validateFieldValue } from '../config/preferenceFormConfig';
import { MultiSelectField } from './fields/MultiSelectField';
import { MultiSelectTextField } from './fields/MultiSelectTextField';
import { CitySearchField } from './fields/CitySearchField';
import { PreferenceReadOnlyField } from './fields/PreferenceReadOnlyField';
import { Logger } from '../../../../utils/Logger';
import { DatifyyUserPartnerPreferences } from '../../types';

/**
 * Enterprise Field Group Component
 * 
 * Responsibilities:
 * - Render different field types with consistent styling
 * - Handle field validation and error display
 * - Provide responsive grid layout
 * - Support read-only and editable modes
 * - Maintain accessibility standards
 * 
 * Patterns:
 * - Factory pattern for field type rendering
 * - Memoization for performance optimization
 * - Compound component pattern
 * - Render props for flexibility
 */

interface PreferenceFieldGroupProps {
    fields: FormField[];
    values: Partial<DatifyyUserPartnerPreferences>;
    isEditing: boolean;
    onFieldChange: (fieldName: keyof DatifyyUserPartnerPreferences, value: any) => void;
    fieldErrors: Record<string, string>;
    isUpdating: boolean;
    gridColumns?: number;
    fieldSpacing?: number;
    showFieldIcons?: boolean;
    compactMode?: boolean;
}

const logger = new Logger('PreferenceFieldGroup');

export const PreferenceFieldGroup: React.FC<PreferenceFieldGroupProps> = memo(({
    fields,
    values,
    isEditing,
    onFieldChange,
    fieldErrors,
    isUpdating,
    gridColumns = 2,
    fieldSpacing = 6,
    showFieldIcons = true,
    compactMode = false
}) => {

    // Theme-aware colors
    const labelColor = useColorModeValue('gray.700', 'gray.200');
    const requiredColor = useColorModeValue('red.500', 'red.300');
    const helperTextColor = useColorModeValue('gray.600', 'gray.400');

    // Memoized field validation
    const getFieldValidation = useCallback((field: FormField) => {
        const value = values[field.name];
        const hasError = Boolean(fieldErrors[field.name]);
        const validationError = validateFieldValue(field, value);

        return {
            isInvalid: hasError || Boolean(validationError),
            errorMessage: fieldErrors[field.name] || validationError,
            isRequired: field.validation?.required || false
        };
    }, [values, fieldErrors]);

    // Field change handler with logging
    const handleFieldChange = useCallback((field: FormField, value: any) => {
        logger.debug('Field value changing', {
            fieldName: field.name,
            fieldType: field.type,
            hasValue: value !== null && value !== undefined && value !== ''
        });

        onFieldChange(field.name, value);
    }, [onFieldChange]);

    // Render field based on type (Factory Pattern)
    const renderFieldInput = useCallback((field: FormField) => {
        const currentValue = values[field.name];
        const { isInvalid } = getFieldValidation(field);

        // Common props for all field types
        const commonProps = {
            isDisabled: isUpdating,
            isInvalid,
            placeholder: field.placeholder,
            'aria-describedby': field.helpText ? `${field.name}-helper` : undefined
        };

        switch (field.type) {
            case FormFieldType.TEXT:
            case FormFieldType.EMAIL:
                return (
                    <Input
                        {...commonProps}
                        type={field.type}
                        value={currentValue || ''}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        maxLength={field.validation?.maxLength}
                    />
                );

            case FormFieldType.NUMBER:
                return (
                    <NumberInput
                        {...commonProps}
                        // @ts-ignore
                        value={currentValue || ''}
                        onChange={(valueString, valueNumber) =>
                            handleFieldChange(field, isNaN(valueNumber) ? null : valueNumber)
                        }
                        min={field.validation?.min}
                        max={field.validation?.max}
                        precision={0}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                );

            case FormFieldType.SELECT:
                return (
                    <Select
                        {...commonProps}
                        value={currentValue || ''}
                        onChange={(e) => handleFieldChange(field, e.target.value || null)}
                    >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </Select>
                );

            case FormFieldType.MULTI_SELECT:
                return (
                    <MultiSelectField
                        {...commonProps}
                        options={field.options || []}
                        value={Array.isArray(currentValue) ? currentValue : []}
                        onChange={(values: any) => handleFieldChange(field, values)}
                        placeholder={field.placeholder}
                        maxItems={field.validation?.custom ? 10 : undefined}
                    />
                );

            case FormFieldType.MULTI_SELECT_TEXT:
                return (
                    <MultiSelectTextField
                        {...commonProps}
                        value={Array.isArray(currentValue) ? currentValue : []}
                        onChange={(values: any) => handleFieldChange(field, values)}
                        placeholder={field.placeholder}
                        maxItems={10}
                    />
                );

            case FormFieldType.CITY_SEARCH:
                return (
                    <CitySearchField
                        {...commonProps}
                        // @ts-ignore
                        value={currentValue || ''}
                        onChange={(city: any) => handleFieldChange(field, city)}
                        placeholder={field.placeholder}
                    />
                );

            case FormFieldType.TEXTAREA:
                return (
                    <Textarea
                        {...commonProps}
                        value={currentValue || ''}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        maxLength={field.validation?.maxLength}
                        rows={compactMode ? 3 : 4}
                        resize="vertical"
                    />
                );

            case FormFieldType.SLIDER_RANGE:
                return (
                    <VStack spacing={3} align="stretch">
                        <Slider
                            // @ts-ignore
                            value={currentValue || field.validation?.min || 0}
                            min={field.validation?.min || 0}
                            max={field.validation?.max || 100}
                            step={field.validation?.min === 0 ? 5 : 1}
                            onChange={(value) => handleFieldChange(field, value)}
                            isDisabled={isUpdating}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                        <Text fontSize="sm" color={helperTextColor} textAlign="center">
                            {currentValue || field.validation?.min || 0} km
                        </Text>
                    </VStack>
                );

            case FormFieldType.TOGGLE:
                return (
                    <HStack justify="space-between" w="full">
                        <Text fontSize="sm">{field.helpText || 'Enable this preference'}</Text>
                        <Switch
                            isChecked={Boolean(currentValue)}
                            onChange={(e) => handleFieldChange(field, e.target.checked)}
                            isDisabled={isUpdating}
                            colorScheme="pink"
                        />
                    </HStack>
                );

            default:
                logger.warn('Unknown field type', { fieldType: field.type, fieldName: field.name });
                return (
                    <Text fontSize="sm" color="red.500">
                        Unsupported field type: {field.type}
                    </Text>
                );
        }
    }, [values, getFieldValidation, isUpdating, handleFieldChange, compactMode, helperTextColor]);

    // Render read-only field
    const renderReadOnlyField = useCallback((field: FormField) => {
        return (
            <PreferenceReadOnlyField
                field={field}
                value={values[field.name]}
                showIcon={showFieldIcons}
                compactMode={compactMode}
            />
        );
    }, [values, showFieldIcons, compactMode]);

    // Calculate responsive grid columns
    const responsiveColumns = useMemo(() => {
        if (compactMode) return { base: 1, md: 1 };
        return { base: 1, md: Math.min(gridColumns, 2) };
    }, [compactMode, gridColumns]);

    // Group fields by conditional dependencies
    const visibleFields = useMemo(() => {
        return fields.filter(field => {
            if (!field.conditional) return true;

            const dependentValue = values[field.conditional.dependsOn];
            return field.conditional.condition(dependentValue);
        });
    }, [fields, values]);

    return (
        <SimpleGrid
            columns={responsiveColumns}
            spacing={fieldSpacing}
            w="full"
        >
            {visibleFields.map((field) => {
                const { isInvalid, errorMessage, isRequired } = getFieldValidation(field);
                const fieldId = `field-${field.name}`;

                return (
                    <FormControl
                        key={field.name}
                        isRequired={isRequired}
                        isInvalid={isInvalid}
                        id={fieldId}
                        gridColumn={field.grid?.colSpan ? `span ${field.grid.colSpan}` : undefined}
                        gridRow={field.grid?.rowSpan ? `span ${field.grid.rowSpan}` : undefined}
                    >
                        {/* Field Label */}
                        {isEditing && (
                            <FormLabel
                                htmlFor={fieldId}
                                fontSize={compactMode ? 'sm' : 'md'}
                                fontWeight="medium"
                                color={labelColor}
                                mb={2}
                            >
                                <HStack spacing={2}>
                                    {/* Field Icon */}
                                    {showFieldIcons && field.icon && (
                                        <Icon as={field.icon} boxSize={4} color="gray.500" />
                                    )}

                                    {/* Label Text */}
                                    <Text>{field.label}</Text>

                                    {/* Required Indicator */}
                                    {isRequired && (
                                        <Icon as={FaAsterisk} boxSize={2} color={requiredColor} />
                                    )}

                                    {/* Priority Badge */}
                                    {field.priority === 'high' && (
                                        <Badge size="xs" colorScheme="red" ml={1}>
                                            Important
                                        </Badge>
                                    )}

                                    {/* Info Tooltip */}
                                    {field.helpText && (
                                        <Tooltip label={field.helpText} placement="top" hasArrow>
                                            <Box cursor="help">
                                                <Icon as={FaInfoCircle} boxSize={3} color="gray.400" />
                                            </Box>
                                        </Tooltip>
                                    )}
                                </HStack>
                            </FormLabel>
                        )}

                        {/* Field Input/Display */}
                        <Box>
                            {isEditing ? renderFieldInput(field) : renderReadOnlyField(field)}
                        </Box>

                        {/* Error Message */}
                        {isInvalid && errorMessage && (
                            <FormErrorMessage fontSize="sm" mt={1}>
                                {errorMessage}
                            </FormErrorMessage>
                        )}

                        {/* Helper Text */}
                        {isEditing && field.helpText && !isInvalid && (
                            <FormHelperText
                                fontSize="xs"
                                color={helperTextColor}
                                mt={1}
                                id={`${field.name}-helper`}
                            >
                                {field.helpText}
                            </FormHelperText>
                        )}

                        {/* Character Count for Text Fields */}
                        {isEditing &&
                            field.validation?.maxLength &&
                            (field.type === FormFieldType.TEXT || field.type === FormFieldType.TEXTAREA) && (
                                <Text fontSize="xs" color={helperTextColor} textAlign="right" mt={1}>
                                    {String(values[field.name] || '').length}/{field.validation.maxLength}
                                </Text>
                            )}
                    </FormControl>
                );
            })}
        </SimpleGrid>
    );
});

// Display name for debugging
PreferenceFieldGroup.displayName = 'PreferenceFieldGroup';

// Export types for testing
export type { PreferenceFieldGroupProps };