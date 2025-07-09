// apps/frontend/src/mvp/profile/partnerPreferences/components/fields/PreferenceReadOnlyField.tsx

import React, { useMemo } from 'react';
import {
    Box,
    HStack,
    VStack,
    Text,
    Tag,
    TagLabel,
    Badge,
    Icon,
    Flex,
    Wrap,
    WrapItem,
    Progress,
    Tooltip,
    Link,
    Image,
    useColorModeValue
} from '@chakra-ui/react';
import {
    FaMapMarkerAlt,
    FaHeart,
    FaGlobe,
    FaCalendarAlt,
    FaRuler,
    FaWeight,
    FaMoneyBillWave,
    FaGraduationCap,
    FaBriefcase,
    FaSmokingBan,
    FaGlassCheers,
    FaRunning,
    FaPaw,
    FaInfoCircle,
    FaUsers,
    FaChild,
    FaMusic,
    FaBook,
    FaPlane,
    FaStar,
    FaClock
} from 'react-icons/fa';

import { FormField, FormFieldType } from '../../config/preferenceFormConfig';
import { Logger } from '../../../../../utils/Logger';

/**
 * Enterprise Read-Only Field Display Component
 * 
 * Features:
 * - Beautiful visual formatting for each field type
 * - Smart value interpretation and display
 * - Context-aware styling and icons
 * - Empty state handling with helpful messages
 * - Rich formatting for complex data types
 * - Responsive design with mobile optimization
 * 
 * Patterns:
 * - Strategy pattern for different display types
 * - Presenter pattern for data formatting
 * - Factory pattern for component rendering
 */

interface PreferenceReadOnlyFieldProps {
    field: FormField;
    value: any;
    showIcon?: boolean;
    compactMode?: boolean;
    showFieldName?: boolean;
    variant?: 'default' | 'card' | 'inline' | 'minimal';
    size?: 'sm' | 'md' | 'lg';
    colorScheme?: string;
    onValueClick?: (field: FormField, value: any) => void;
}

interface FormattedValue {
    display: string | React.ReactNode;
    isEmpty: boolean;
    type: 'text' | 'number' | 'array' | 'range' | 'location' | 'complex';
    metadata?: {
        unit?: string;
        count?: number;
        prefix?: string;
        suffix?: string;
        description?: string;
    };
}

const logger = new Logger('PreferenceReadOnlyField');

// Value formatters for different field types
const formatFieldValue = (field: FormField, value: any): FormattedValue => {
    // Handle empty values
    if (value === null || value === undefined || value === '') {
        return {
            display: 'Not specified',
            isEmpty: true,
            type: 'text'
        };
    }

    // Handle arrays (empty check)
    if (Array.isArray(value) && value.length === 0) {
        return {
            display: 'None selected',
            isEmpty: true,
            type: 'array'
        };
    }

    // Format based on field type and name
    switch (field.name) {
        case 'minAge':
        case 'maxAge':
            return {
                display: `${value} years`,
                isEmpty: false,
                type: 'number',
                metadata: { unit: 'years', suffix: 'old' }
            };

        case 'minHeight':
        case 'maxHeight':
            return {
                display: `${value} cm`,
                isEmpty: false,
                type: 'number',
                metadata: { unit: 'cm', description: `${Math.round(value / 30.48 * 12)} ft ${Math.round((value / 30.48 * 12) % 12)} in` }
            };

        case 'minIncome':
        case 'maxIncome':
            const currency = 'INR'; // You might want to get this from context
            const suffix = currency === 'INR' ? 'Lakhs/year' : 'K/year';
            return {
                display: `${value} ${suffix}`,
                isEmpty: false,
                type: 'number',
                metadata: { prefix: currency === 'INR' ? '₹' : '$', suffix }
            };

        case 'locationPreference':
            if (typeof value === 'object' && value !== null) {
                const parts = [];
                if (value.cities?.length > 0) parts.push(`Cities: ${value.cities.join(', ')}`);
                if (value.states?.length > 0) parts.push(`States: ${value.states.join(', ')}`);
                if (value.countries?.length > 0) parts.push(`Countries: ${value.countries.join(', ')}`);
                if (value.radiusKm) parts.push(`${value.radiusKm}km radius`);
                if (value.willingToRelocate) parts.push('Willing to relocate');

                return {
                    display: parts.length > 0 ? parts.join(' • ') : 'No preferences set',
                    isEmpty: parts.length === 0,
                    type: 'location',
                    metadata: { description: 'Location preferences' }
                };
            }
            return {
                display: String(value),
                isEmpty: false,
                type: 'location',
                metadata: { description: 'Click to view on map' }
            };
        // @ts-ignore
        case 'currentCity':
        // @ts-ignore
        case 'hometown':
            return {
                display: value,
                isEmpty: false,
                type: 'location',
                metadata: { description: 'Click to view on map' }
            };

        case 'locationPreferenceRadius':
            return {
                display: `${value} km radius`,
                isEmpty: false,
                type: 'number',
                metadata: { unit: 'km', description: 'Maximum distance for matches' }
            };

        case 'hobbies':
        case 'interests':
        case 'educationLevel':
        case 'profession':
        case 'personalityTraits':
            if (Array.isArray(value)) {
                return {
                    display: value,
                    isEmpty: false,
                    type: 'array',
                    metadata: { count: value.length }
                };
            }
            break;

        case 'booksReading':
        case 'music':
        case 'movies':
        case 'travel':
        case 'sports':
        case 'lifestylePreference':
            if (Array.isArray(value)) {
                return {
                    display: value,
                    isEmpty: false,
                    type: 'array',
                    metadata: {
                        count: value.length,
                        description: getArrayFieldDescription(field.name, value.length)
                    }
                };
            }
            break;

        case 'whatOtherPersonShouldKnow':
            return {
                display: value,
                isEmpty: false,
                type: 'text',
                metadata: { description: `${value.length} characters` }
            };

        default:
            // Handle generic types
            if (Array.isArray(value)) {
                return {
                    display: value,
                    isEmpty: false,
                    type: 'array',
                    metadata: { count: value.length }
                };
            }

            return {
                display: String(value),
                isEmpty: false,
                type: 'text'
            };
    }

    return {
        display: String(value),
        isEmpty: false,
        type: 'text'
    };
};

// Get description for array fields
const getArrayFieldDescription = (fieldName: string, count: number): string => {
    const descriptions: Record<string, string> = {
        booksReading: `${count} book${count !== 1 ? 's' : ''} or genre${count !== 1 ? 's' : ''}`,
        music: `${count} music preference${count !== 1 ? 's' : ''}`,
        movies: `${count} movie preference${count !== 1 ? 's' : ''}`,
        travel: `${count} travel destination${count !== 1 ? 's' : ''}`,
        sports: `${count} sport${count !== 1 ? 's' : ''}`,
        lifestylePreference: `${count} lifestyle choice${count !== 1 ? 's' : ''}`
    };

    return descriptions[fieldName] || `${count} item${count !== 1 ? 's' : ''}`;
};

// Get appropriate icon for field
const getFieldIcon = (field: FormField): React.ComponentType => {
    // Use field icon if provided
    if (field.icon) return field.icon;

    // Fallback based on field name
    const iconMap: Record<string, React.ComponentType> = {
        genderPreference: FaUsers,
        minAge: FaCalendarAlt,
        maxAge: FaCalendarAlt,
        minHeight: FaRuler,
        maxHeight: FaRuler,
        locationPreference: FaMapMarkerAlt,
        locationPreferenceRadius: FaGlobe,
        minIncome: FaMoneyBillWave,
        maxIncome: FaMoneyBillWave,
        currency: FaMoneyBillWave,
        educationLevel: FaGraduationCap,
        profession: FaBriefcase,
        smokingPreference: FaSmokingBan,
        drinkingPreference: FaGlassCheers,
        maritalStatus: FaHeart,
        childrenPreference: FaChild,
        hobbies: FaStar,
        interests: FaMusic,
        booksReading: FaBook,
        music: FaMusic,
        movies: FaStar,
        travel: FaPlane,
        sports: FaRunning,
        personalityTraits: FaHeart,
        relationshipGoals: FaHeart,
        activityLevel: FaRunning,
        petPreference: FaPaw,
        whatOtherPersonShouldKnow: FaInfoCircle
    };

    return iconMap[field.name] || FaInfoCircle;
};

// Get color scheme for field
const getFieldColorScheme = (field: FormField, value: any): string => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
        return 'gray';
    }

    // Color based on field importance
    if (field.priority === 'high') return 'red';
    if (field.priority === 'medium') return 'blue';
    return 'green';
};

export const PreferenceReadOnlyField: React.FC<PreferenceReadOnlyFieldProps> = ({
    field,
    value,
    showIcon = true,
    compactMode = false,
    showFieldName = true,
    variant = 'default',
    size = 'md',
    colorScheme: propColorScheme,
    onValueClick
}) => {

    // Theme colors
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const labelColor = useColorModeValue('gray.600', 'gray.300');
    const valueColor = useColorModeValue('gray.800', 'gray.100');
    const emptyColor = useColorModeValue('gray.400', 'gray.500');
    const metaColor = useColorModeValue('gray.500', 'gray.400');

    // Format the value
    const formattedValue = useMemo(() => formatFieldValue(field, value), [field, value]);

    // Determine colors and styling
    const fieldIcon = getFieldIcon(field);
    const colorScheme = propColorScheme || getFieldColorScheme(field, value);
    const isEmpty = formattedValue.isEmpty;

    // Size configurations
    const sizeConfig = {
        sm: {
            fontSize: 'sm',
            iconSize: 3,
            spacing: 2,
            padding: 2,
            tagSize: 'sm' as const
        },
        md: {
            fontSize: 'md',
            iconSize: 4,
            spacing: 3,
            padding: 3,
            tagSize: 'md' as const
        },
        lg: {
            fontSize: 'lg',
            iconSize: 5,
            spacing: 4,
            padding: 4,
            tagSize: 'lg' as const
        }
    };

    const config = sizeConfig[size];

    // Render different display types
    const renderDisplayValue = () => {
        if (isEmpty) {
            return (
                <HStack spacing={1}>
                    <Icon as={FaInfoCircle} boxSize={3} color={emptyColor} />
                    <Text fontSize={config.fontSize} color={emptyColor} fontStyle="italic">
                        {formattedValue.display}
                    </Text>
                </HStack>
            );
        }

        switch (formattedValue.type) {
            case 'array':
                if (Array.isArray(formattedValue.display)) {
                    return (
                        <VStack align="start" spacing={2}>
                            <Wrap spacing={1}>
                                {formattedValue.display.slice(0, compactMode ? 3 : 10).map((item, index) => (
                                    <WrapItem key={index}>
                                        <Tag
                                            size={config.tagSize}
                                            colorScheme={colorScheme}
                                            borderRadius="full"
                                            variant="subtle"
                                        >
                                            <TagLabel>{item}</TagLabel>
                                        </Tag>
                                    </WrapItem>
                                ))}
                                {formattedValue.display.length > (compactMode ? 3 : 10) && (
                                    <WrapItem>
                                        <Tag size={config.tagSize} colorScheme="gray" variant="outline">
                                            <TagLabel>+{formattedValue.display.length - (compactMode ? 3 : 10)} more</TagLabel>
                                        </Tag>
                                    </WrapItem>
                                )}
                            </Wrap>
                            {formattedValue.metadata?.description && (
                                <Text fontSize="xs" color={metaColor}>
                                    {formattedValue.metadata.description}
                                </Text>
                            )}
                        </VStack>
                    );
                }
                break;

            case 'location':
                return (
                    <VStack align="start" spacing={1}>
                        <HStack spacing={2}>
                            <Icon as={FaMapMarkerAlt} boxSize={3} color={`${colorScheme}.500`} />
                            <Text
                                fontSize={config.fontSize}
                                color={valueColor}
                                fontWeight="medium"
                                cursor={onValueClick ? 'pointer' : 'default'}
                                _hover={onValueClick ? { color: `${colorScheme}.500` } : {}}
                                onClick={() => onValueClick?.(field, value)}
                            >
                                {formattedValue.display}
                            </Text>
                        </HStack>
                        {formattedValue.metadata?.description && (
                            <Text fontSize="xs" color={metaColor}>
                                {formattedValue.metadata.description}
                            </Text>
                        )}
                    </VStack>
                );

            case 'number':
                return (
                    <VStack align="start" spacing={1}>
                        <HStack spacing={2}>
                            {formattedValue.metadata?.prefix && (
                                <Text fontSize={config.fontSize} color={`${colorScheme}.500`} fontWeight="bold">
                                    {formattedValue.metadata.prefix}
                                </Text>
                            )}
                            <Text fontSize={config.fontSize} color={valueColor} fontWeight="medium">
                                {formattedValue.display}
                            </Text>
                        </HStack>
                        {formattedValue.metadata?.description && (
                            <Text fontSize="xs" color={metaColor}>
                                {formattedValue.metadata.description}
                            </Text>
                        )}
                    </VStack>
                );

            case 'range':
                // Handle age range, height range, etc.
                return (
                    <HStack spacing={3}>
                        <Badge colorScheme={colorScheme} variant="subtle" fontSize="xs">
                            {formattedValue.display}
                        </Badge>
                        {formattedValue.metadata?.description && (
                            <Text fontSize="xs" color={metaColor}>
                                {formattedValue.metadata.description}
                            </Text>
                        )}
                    </HStack>
                );

            default:
                return (
                    <VStack align="start" spacing={1}>
                        <Text
                            fontSize={config.fontSize}
                            color={valueColor}
                            fontWeight="medium"
                            noOfLines={compactMode ? 2 : undefined}
                        >
                            {formattedValue.display}
                        </Text>
                        {formattedValue.metadata?.description && (
                            <Text fontSize="xs" color={metaColor}>
                                {formattedValue.metadata.description}
                            </Text>
                        )}
                    </VStack>
                );
        }
    };

    // Render based on variant
    const renderContent = () => (
        <>
            {/* Field Header */}
            {showFieldName && (
                <HStack spacing={config.spacing} mb={2}>
                    {showIcon && (
                        <Icon
                            as={fieldIcon}
                            boxSize={config.iconSize}
                            color={isEmpty ? emptyColor : `${colorScheme}.500`}
                        />
                    )}
                    <Text
                        fontSize="xs"
                        color={labelColor}
                        fontWeight="medium"
                        textTransform="uppercase"
                        letterSpacing="wider"
                    >
                        {field.label}
                    </Text>
                    {field.priority === 'high' && (
                        <Badge colorScheme="red" size="xs">
                            Important
                        </Badge>
                    )}
                </HStack>
            )}

            {/* Field Value */}
            {renderDisplayValue()}

            {/* Field Help Text */}
            {field.helpText && !compactMode && (
                <Text fontSize="xs" color={metaColor} mt={1} fontStyle="italic">
                    {field.helpText}
                </Text>
            )}
        </>
    );

    // Render different variants
    switch (variant) {
        case 'card':
            return (
                <Box
                    p={config.padding}
                    bg={cardBg}
                    border="1px solid"
                    borderColor={isEmpty ? 'gray.200' : `${colorScheme}.200`}
                    borderRadius="md"
                    _hover={{
                        borderColor: isEmpty ? 'gray.300' : `${colorScheme}.300`,
                        shadow: 'sm'
                    }}
                    transition="all 0.2s"
                    cursor={onValueClick ? 'pointer' : 'default'}
                    onClick={() => onValueClick?.(field, value)}
                >
                    {renderContent()}
                </Box>
            );

        case 'inline':
            return (
                <HStack spacing={config.spacing} align="start">
                    {showIcon && (
                        <Icon
                            as={fieldIcon}
                            boxSize={config.iconSize}
                            color={isEmpty ? emptyColor : `${colorScheme}.500`}
                            mt={1}
                        />
                    )}
                    <VStack align="start" spacing={1} flex="1">
                        {showFieldName && (
                            <Text fontSize="xs" color={labelColor} fontWeight="medium">
                                {field.label}:
                            </Text>
                        )}
                        {renderDisplayValue()}
                    </VStack>
                </HStack>
            );

        case 'minimal':
            return (
                <Box>
                    {renderDisplayValue()}
                </Box>
            );

        default:
            return (
                <Box
                    p={config.padding}
                    borderRadius="md"
                    bg={isEmpty ? 'gray.50' : 'transparent'}
                    _hover={{ bg: isEmpty ? 'gray.100' : 'gray.50' }}
                    transition="background 0.2s"
                    cursor={onValueClick ? 'pointer' : 'default'}
                    onClick={() => onValueClick?.(field, value)}
                >
                    {renderContent()}
                </Box>
            );
    }
};

// Export for testing
export type { PreferenceReadOnlyFieldProps, FormattedValue };