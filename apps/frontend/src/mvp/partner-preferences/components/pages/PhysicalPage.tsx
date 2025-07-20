// apps/frontend/src/mvp/partner-preferences/components/pages/PhysicalPage.tsx
import React from 'react';
import {
    VStack,
    Box,
    Text,
    HStack,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    SimpleGrid,
    Badge,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import { FaRuler, FaWeight, FaEye, FaPalette } from 'react-icons/fa';
import { PartnerPreferences } from '../../types';

interface PhysicalPageProps {
    preferences: PartnerPreferences;
    onUpdate: (updates: Partial<PartnerPreferences>) => void;
}

const PhysicalPage: React.FC<PhysicalPageProps> = ({ preferences, onUpdate }) => {
    const bodyTypes = [
        'Slim',
        'Athletic',
        'Average',
        'Curvy',
        'Plus Size',
        'Muscular',
        'Petite',
        'Tall'
    ];

    const ethnicities = [
        'Asian',
        'Black/African',
        'Hispanic/Latino',
        'White/Caucasian',
        'Mixed Race',
        'Middle Eastern',
        'Native American',
        'Pacific Islander',
        'Other'
    ];

    const toggleBodyType = (bodyType: string) => {
        const bodyTypePrefix = 'bodyType:';
        const currentInterests = preferences.interests || [];
        const bodyTypeInterests = currentInterests.filter(i => i.startsWith(bodyTypePrefix));
        const otherInterests = currentInterests.filter(i => !i.startsWith(bodyTypePrefix));
        
        const hasBodyType = bodyTypeInterests.some(i => i === `${bodyTypePrefix}${bodyType}`);
        const newBodyTypes = hasBodyType
            ? bodyTypeInterests.filter((t: string) => t !== `${bodyTypePrefix}${bodyType}`)
            : [...bodyTypeInterests, `${bodyTypePrefix}${bodyType}`];

        onUpdate({ interests: [...otherInterests, ...newBodyTypes] });
    };

    const toggleEthnicity = (ethnicity: string) => {
        const ethnicityPrefix = 'ethnicity:';
        const currentInterests = preferences.interests || [];
        const ethnicityInterests = currentInterests.filter(i => i.startsWith(ethnicityPrefix));
        const otherInterests = currentInterests.filter(i => !i.startsWith(ethnicityPrefix) && !i.startsWith('bodyType:'));
        
        const hasEthnicity = ethnicityInterests.some(i => i === `${ethnicityPrefix}${ethnicity}`);
        const newEthnicities = hasEthnicity
            ? ethnicityInterests.filter((e: string) => e !== `${ethnicityPrefix}${ethnicity}`)
            : [...ethnicityInterests, `${ethnicityPrefix}${ethnicity}`];

        onUpdate({ interests: [...otherInterests, ...currentInterests.filter(i => i.startsWith('bodyType:')), ...newEthnicities] });
    };

    const formatHeight = (cm: number) => {
        const feet = Math.floor(cm / 30.48);
        const inches = Math.round((cm / 30.48 - feet) * 12);
        return `${cm}cm (${feet}'${inches}")`;
    };

    return (
        <VStack spacing={8} align="stretch">
            {/* Height Range */}
            <Box>
                <HStack mb={4}>
                    <FaRuler color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Height Preference
                    </Text>
                </HStack>
                <Text fontSize="md" color="gray.600" mb={4}>
                    {formatHeight(preferences.heightRange?.minHeightCm || 150)} - {formatHeight(preferences.heightRange?.maxHeightCm || 200)}
                </Text>
                <RangeSlider
                    value={[preferences.heightRange?.minHeightCm || 150, preferences.heightRange?.maxHeightCm || 200]}
                    min={140}
                    max={220}
                    step={1}
                    onChange={([min, max]) => onUpdate({
                        heightRange: { minHeightCm: min, maxHeightCm: max }
                    })}
                    colorScheme="brand"
                >
                    <RangeSliderTrack bg="brand.100" h={2}>
                        <RangeSliderFilledTrack bg="brand.500" />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} boxSize={6} bg="brand.500" />
                    <RangeSliderThumb index={1} boxSize={6} bg="brand.500" />
                </RangeSlider>
                <HStack justify="space-between" mt={2}>
                    <Text fontSize="sm" color="gray.500">4'7" (140cm)</Text>
                    <Text fontSize="sm" color="gray.500">7'2" (220cm)</Text>
                </HStack>
            </Box>

            {/* Body Type Preferences */}
            <Box>
                <HStack mb={4}>
                    <FaWeight color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Body Type Preferences
                    </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" mb={4}>
                    Select body types you're attracted to ({preferences.interests?.filter(i => i.startsWith('bodyType:')).length || 0} selected)
                </Text>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                    {bodyTypes.map((bodyType) => {
                        const isSelected = preferences.interests?.some(i => i === `bodyType:${bodyType}`);
                        return (
                            <Badge
                                key={bodyType}
                                variant={isSelected ? 'solid' : 'outline'}
                                colorScheme={isSelected ? 'blue' : 'gray'}
                                p={3}
                                textAlign="center"
                                cursor="pointer"
                                onClick={() => toggleBodyType(bodyType)}
                                borderRadius="lg"
                                fontSize="xs"
                                fontWeight="semibold"
                                _hover={{
                                    transform: 'scale(1.05)',
                                    boxShadow: 'sm',
                                }}
                                _active={{
                                    transform: 'scale(0.98)',
                                }}
                                transition="all 0.2s"
                            >
                                {bodyType}
                            </Badge>
                        );
                    })}
                </SimpleGrid>
            </Box>

            {/* Ethnicity Preferences */}
            <Box>
                <HStack mb={4}>
                    <FaPalette color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Ethnicity Preferences
                    </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" mb={4}>
                    Select ethnicities you're open to dating ({preferences.interests?.filter(i => i.startsWith('ethnicity:')).length || 0} selected)
                </Text>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                    {ethnicities.map((ethnicity) => {
                        const isSelected = preferences.interests?.some(i => i === `ethnicity:${ethnicity}`);
                        return (
                            <Badge
                                key={ethnicity}
                                variant={isSelected ? 'solid' : 'outline'}
                                colorScheme={isSelected ? 'purple' : 'gray'}
                                p={3}
                                textAlign="center"
                                cursor="pointer"
                                onClick={() => toggleEthnicity(ethnicity)}
                                borderRadius="lg"
                                fontSize="xs"
                                fontWeight="semibold"
                                _hover={{
                                    transform: 'scale(1.05)',
                                    boxShadow: 'sm',
                                }}
                                _active={{
                                    transform: 'scale(0.98)',
                                }}
                                transition="all 0.2s"
                            >
                                {ethnicity}
                            </Badge>
                        );
                    })}
                </SimpleGrid>
            </Box>

            {/* Deal Breakers */}
            <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>
                    Physical Deal Breakers
                </Text>
                <Text fontSize="sm" color="gray.600" mb={4}>
                    Optional: Add specific physical attributes that are absolute no-gos for you
                </Text>
                <Box
                    p={4}
                    border="2px dashed"
                    borderColor="gray.300"
                    borderRadius="lg"
                    textAlign="center"
                    color="gray.500"
                    _hover={{
                        borderColor: "brand.300",
                        color: "brand.500"
                    }}
                    cursor="pointer"
                >
                    <Text fontSize="sm">
                        Click to add deal breakers (Coming Soon)
                    </Text>
                </Box>
            </Box>

            {/* Privacy Notice */}
            <Box
                bg="blue.50"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="blue.200"
            >
                <Text fontSize="sm" color="blue.700">
                    🔒 <strong>Privacy Note:</strong> Your physical preferences are private and only used for matching.
                    We believe attraction is personal and everyone deserves to find someone who appreciates them.
                </Text>
            </Box>

            {/* Inclusivity Message */}
            <Box
                bg="green.50"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="green.200"
            >
                <Text fontSize="sm" color="green.700">
                    💚 <strong>Remember:</strong> True compatibility goes beyond physical appearance.
                    Keep an open mind - some of the best relationships start with emotional connection!
                </Text>
            </Box>
        </VStack>
    );
};

export default PhysicalPage;