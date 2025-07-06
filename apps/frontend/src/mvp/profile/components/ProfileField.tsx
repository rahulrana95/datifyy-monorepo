// apps/frontend/src/mvp/profile/components/ProfileField.tsx

import React, { useCallback } from 'react';
import {
    Input,
    Textarea,
    Select,
    Checkbox,
    NumberInput,
    NumberInputField,
    Text,
    Box,
    HStack,
    VStack,
    Badge,
    Icon,
    Image,
    Button,
    Tag,
    TagLabel,
    TagCloseButton,
    Wrap,
    WrapItem,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import {
    FaCheck,
    FaTimes,
    FaExclamationCircle,
    FaCalendarAlt,
    FaCamera,
    FaPlus
} from 'react-icons/fa';

import { FormFieldConfig } from '../types/ProfileFormTypes';
import { ValidationError } from '../hooks/useProfileValidation';
import CitySelect from '../CitySelect';

interface ProfileFieldProps {
    field: FormFieldConfig;
    value: any;
    isEditing: boolean;
    onChange: (value: any) => void;
    error?: ValidationError;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({
    field,
    value,
    isEditing,
    onChange,
    error
}) => {

    /**
     * Render field based on type in edit mode
     */
    const renderEditField = useCallback(() => {
        const commonProps = {
            isInvalid: error?.type === 'error',
            isDisabled: field.readOnly,
            placeholder: field.placeholder,
        };

        switch (field.type) {
            case 'text':
            case 'email':
                return (
                    <Input
                        {...commonProps}
                        type={field.type}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        maxLength={field.maxLength}
                    />
                );

            case 'textarea':
                return (
                    <Textarea
                        {...commonProps}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        maxLength={field.maxLength}
                        rows={4}
                        resize="vertical"
                    />
                );

            case 'number':
                return (
                    <NumberInput
                        min={field.min}
                        max={field.max}
                        value={value || ''}
                        onChange={(valueString) => {
                            const numValue = parseFloat(valueString);
                            onChange(isNaN(numValue) ? null : numValue);
                        }}
                        isInvalid={error?.type === 'error'}
                        isDisabled={field.readOnly}
                    >
                        <NumberInputField placeholder={field.placeholder} />
                    </NumberInput>
                );

            case 'date':
                return (
                    <InputGroup>
                        <Input
                            {...commonProps}
                            type="date"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                        />
                        <InputRightElement>
                        {/* @ts-ignore */}
                            <Icon as={FaCalendarAlt} color="gray.400" />
                        </InputRightElement>
                    </InputGroup>
                );

            case 'select':
                return (
                    <Select
                        {...commonProps}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </Select>
                );

            case 'checkbox':
                return (
                    <Checkbox
                        isChecked={Boolean(value)}
                        onChange={(e) => onChange(e.target.checked)}
                        isDisabled={field.readOnly}
                        colorScheme="blue"
                    >
                        {field.label}
                    </Checkbox>
                );

            case 'city':
                return (
                    <CitySelect
                        value={value || ''}
                        onChangeCity={(city) => onChange(city)}
                    />
                );

            case 'tag-input':
                return <RenderTagInput />;

            case 'image':
                return renderImageUpload();

            case 'verification':
                return renderVerificationField();

            default:
                return (
                    <Text fontSize="sm" color="gray.500">
                        Unsupported field type: {field.type}
                    </Text>
                );
        }
    }, [field, value, onChange, error]);

    /**
     * Render tag input for arrays of strings
     */
    const RenderTagInput = () => {
        const tags = Array.isArray(value) ? value : [];
        const [inputValue, setInputValue] = React.useState('');

        const addTag = () => {
            if (inputValue.trim() && !tags.includes(inputValue.trim())) {
                const newTags = [...tags, inputValue.trim()];
                if (field.maxTags && newTags.length <= field.maxTags) {
                    onChange(newTags);
                    setInputValue('');
                }
            }
        };

        const removeTag = (tagToRemove: string) => {
            onChange(tags.filter((tag: string) => tag !== tagToRemove));
        };

        const handleKeyPress = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
            }
        };

        return (
            <VStack align="stretch" spacing={3}>
                <HStack>
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={field.placeholder}
                        isDisabled={field.maxTags ? tags.length >= field.maxTags : false}
                    />
                    <Button
                        size="sm"
                        onClick={addTag}
                        isDisabled={!inputValue.trim() || (field.maxTags ? tags.length >= field.maxTags : false)}
                        // @ts-ignore
                        leftIcon={<FaPlus />}
                    >
                        Add
                    </Button>
                </HStack>

                {tags.length > 0 && (
                    <Wrap>
                        {tags.map((tag: string, index: number) => (
                            <WrapItem key={index}>
                                <Tag size="md" colorScheme="blue" borderRadius="full">
                                    <TagLabel>{tag}</TagLabel>
                                    {!field.readOnly && (
                                        <TagCloseButton onClick={() => removeTag(tag)} />
                                    )}
                                </Tag>
                            </WrapItem>
                        ))}
                    </Wrap>
                )}

                {field.maxTags && (
                    <Text fontSize="xs" color="gray.500">
                        {tags.length}/{field.maxTags} tags
                    </Text>
                )}
            </VStack>
        );
    };

    /**
     * Render image upload component
     */
    const renderImageUpload = useCallback(() => {
        const images = Array.isArray(value) ? value : [];

        const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                // In production, upload to cloud storage and get URL
                const imageUrl = URL.createObjectURL(file);
                const newImages = [imageUrl, ...images.slice(0, 5)];
                onChange(newImages);
            }
        };

        const removeImage = (indexToRemove: number) => {
            const newImages = images.filter((_: any, index: number) => index !== indexToRemove);
            onChange(newImages);
        };

        return (
            <VStack align="stretch" spacing={4}>
                {/* Upload Button */}
                {images.length < 6 && (
                    <Box>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            id={`image-upload-${field.name}`}
                        />
                        <Button
                            as="label"
                            htmlFor={`image-upload-${field.name}`}
                            // @ts-ignore
                            leftIcon={<FaCamera />}
                            colorScheme="blue"
                            variant="outline"
                            cursor="pointer"
                            size="sm"
                        >
                            Upload Photo
                        </Button>
                    </Box>
                )}

                {/* Image Grid */}
                {images.length > 0 && (
                    <Box>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                            {images.length}/6 photos
                        </Text>
                        <Wrap spacing={2}>
                            {images.map((imageUrl: string, index: number) => (
                                <WrapItem key={index}>
                                    <Box position="relative">
                                        <Image
                                            src={imageUrl}
                                            alt={`Profile ${index + 1}`}
                                            boxSize="80px"
                                            objectFit="cover"
                                            borderRadius="md"
                                            border="2px solid"
                                            borderColor={index === 0 ? 'blue.500' : 'gray.200'}
                                        />
                                        {index === 0 && (
                                            <Badge
                                                position="absolute"
                                                top="-1"
                                                right="-1"
                                                colorScheme="blue"
                                                fontSize="xs"
                                                borderRadius="full"
                                            >
                                                Main
                                            </Badge>
                                        )}
                                        {!field.readOnly && (
                                            <Button
                                                position="absolute"
                                                top="1"
                                                right="1"
                                                size="xs"
                                                colorScheme="red"
                                                borderRadius="full"
                                                minW="auto"
                                                h="auto"
                                                p="1"
                                                onClick={() => removeImage(index)}
                                            >
                                                {/* @ts-ignore */}
                                                <FaTimes size="8px" />
                                            </Button>
                                        )}
                                    </Box>
                                </WrapItem>
                            ))}
                        </Wrap>
                    </Box>
                )}
            </VStack>
        );
    }, [field, value, onChange]);

    /**
     * Render verification status field
     */
    const renderVerificationField = useCallback(() => {
        const isVerified = Boolean(value);

        return (
            <HStack spacing={2}>
                <Icon
                // @ts-ignore
                    as={isVerified ? FaCheck : FaTimes}
                    color={isVerified ? 'green.500' : 'red.500'}
                    boxSize={4}
                />
                <Text
                    fontSize="sm"
                    color={isVerified ? 'green.600' : 'red.600'}
                    fontWeight="medium"
                >
                    {isVerified ? 'Verified' : 'Not Verified'}
                </Text>
                {!isVerified && (
                    <Button size="xs" colorScheme="blue" variant="outline">
                        Verify Now
                    </Button>
                )}
            </HStack>
        );
    }, [value]);

    /**
     * Render field in read-only mode
     */
    const renderReadOnlyField = useCallback(() => {
        // Handle empty/null values
        if (value === null || value === undefined || value === '') {
            return (
                <Box
                    p={3}
                    bg="gray.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    <Text fontSize="sm" color="gray.500" fontStyle="italic">
                        Not provided
                    </Text>
                </Box>
            );
        }

        // Handle different field types in read-only mode
        switch (field.type) {
            case 'verification':
                return renderVerificationField();

            case 'checkbox':
                return (
                    <HStack spacing={2}>
                        <Icon
                        // @ts-ignore
                            as={value ? FaCheck : FaTimes}
                            color={value ? 'green.500' : 'gray.400'}
                            boxSize={4}
                        />
                        <Text fontSize="sm" color={value ? 'green.600' : 'gray.500'}>
                            {value ? 'Yes' : 'No'}
                        </Text>
                    </HStack>
                );

            case 'tag-input':
                if (!Array.isArray(value) || value.length === 0) {
                    return (
                        <Text fontSize="sm" color="gray.500" fontStyle="italic">
                            None added
                        </Text>
                    );
                }
                return (
                    <Wrap>
                        {value.map((tag: string, index: number) => (
                            <WrapItem key={index}>
                                <Tag size="sm" colorScheme="blue" borderRadius="full">
                                    <TagLabel>{tag}</TagLabel>
                                </Tag>
                            </WrapItem>
                        ))}
                    </Wrap>
                );

            case 'image':
                if (!Array.isArray(value) || value.length === 0) {
                    return (
                        <Box
                            p={6}
                            bg="gray.50"
                            borderRadius="md"
                            border="2px dashed"
                            borderColor="gray.300"
                            textAlign="center"
                        >
                            {/*  @ts-ignore */}
                            <Icon as={FaCamera} color="gray.400" boxSize={8} mb={2} />
                            <Text fontSize="sm" color="gray.500">
                                No photos uploaded
                            </Text>
                        </Box>
                    );
                }
                return (
                    <Wrap spacing={2}>
                        {value.slice(0, 3).map((imageUrl: string, index: number) => (
                            <WrapItem key={index}>
                                <Box position="relative">
                                    <Image
                                        src={imageUrl}
                                        alt={`Profile ${index + 1}`}
                                        boxSize="60px"
                                        objectFit="cover"
                                        borderRadius="md"
                                        border="2px solid"
                                        borderColor={index === 0 ? 'blue.500' : 'gray.200'}
                                    />
                                    {index === 0 && (
                                        <Badge
                                            position="absolute"
                                            top="-1"
                                            right="-1"
                                            colorScheme="blue"
                                            fontSize="xs"
                                            borderRadius="full"
                                        >
                                            Main
                                        </Badge>
                                    )}
                                </Box>
                            </WrapItem>
                        ))}
                        {value.length > 3 && (
                            <WrapItem>
                                <Box
                                    boxSize="60px"
                                    bg="gray.100"
                                    borderRadius="md"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    border="2px solid"
                                    borderColor="gray.200"
                                >
                                    <Text fontSize="xs" color="gray.600" fontWeight="bold">
                                        +{value.length - 3}
                                    </Text>
                                </Box>
                            </WrapItem>
                        )}
                    </Wrap>
                );

            case 'date':
                const date = new Date(value);
                const age = calculateAge(value);
                return (
                    <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="medium">
                            {date.toLocaleDateString()}
                        </Text>
                        {age && (
                            <Text fontSize="xs" color="gray.500">
                                {age} years old
                            </Text>
                        )}
                    </VStack>
                );

            case 'textarea':
                return (
                    <Text fontSize="sm" whiteSpace="pre-wrap">
                        {value}
                    </Text>
                );

            default:
                return (
                    <Text fontSize="sm" fontWeight="medium">
                        {String(value)}
                    </Text>
                );
        }
    }, [field, value]);

    /**
     * Render the complete field component
     */
    if (!isEditing) {
        return (
            <Box
                p={3}
                bg="white"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ borderColor: 'gray.300' }}
                transition="border-color 0.2s"
            >
                <VStack align="start" spacing={2}>
                    <Text fontSize="xs" color="gray.600" fontWeight="medium" textTransform="uppercase">
                        {field.label}
                    </Text>
                    {renderReadOnlyField()}
                </VStack>
            </Box>
        );
    }

    return (
        <Box>
            {renderEditField()}

            {/* Character count for text fields */}
            {(field.type === 'text' || field.type === 'textarea') && field.maxLength && (
                <Text fontSize="xs" color="gray.500" mt={1} textAlign="right">
                    {String(value || '').length}/{field.maxLength}
                </Text>
            )}
        </Box>
    );
};

// Helper function
function calculateAge(dob: string): number | null {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 0 && age <= 150 ? age : null;
}