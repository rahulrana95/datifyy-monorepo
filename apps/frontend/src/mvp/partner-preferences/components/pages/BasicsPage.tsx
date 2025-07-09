// apps/frontend/src/mvp/partner-preferences/components/pages/BasicsPage.tsx
import React from 'react';
import {
    VStack,
    Box,
    Text,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    SimpleGrid,
    Badge,
    HStack,
} from '@chakra-ui/react';
import { FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { PartnerPreferences } from '../../types';

interface BasicsPageProps {
    preferences: PartnerPreferences;
    onUpdate: (updates: Partial<PartnerPreferences>) => void;
}

const BasicsPage: React.FC<BasicsPageProps> = ({ preferences, onUpdate }) => {
    const commonInterests = [
        'Travel', 'Movies', 'Music', 'Sports', 'Cooking', 'Reading',
        'Fitness', 'Art', 'Photography', 'Dancing', 'Gaming', 'Hiking',
        'Fashion', 'Technology', 'Books', 'Wine', 'Comedy', 'Nature'
    ];

    const toggleInterest = (interest: string) => {
        const currentInterests = preferences.interests || [];
        const updatedInterests = currentInterests.includes(interest)
            ? currentInterests.filter(i => i !== interest)
            : [...currentInterests, interest];

        onUpdate({ interests: updatedInterests });
    };

    return (
        <VStack spacing={8} align="stretch">
            {/* Age Range */}
            <Box>
                <HStack mb={4}>
                    <FaHeart color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Age Range
                    </Text>
                </HStack>
                <Text fontSize="md" color="gray.600" mb={4}>
                    {preferences.minAge} - {preferences.maxAge} years old
                </Text>
                <RangeSlider
                    value={[preferences.minAge || 22, preferences.maxAge || 35]}
                    min={18}
                    max={65}
                    step={1}
                    onChange={([min, max]) => onUpdate({ minAge: min, maxAge: max })}
                    colorScheme="brand"
                >
                    <RangeSliderTrack bg="brand.100" h={2}>
                        <RangeSliderFilledTrack bg="brand.500" />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} boxSize={6} bg="brand.500" />
                    <RangeSliderThumb index={1} boxSize={6} bg="brand.500" />
                </RangeSlider>
                <HStack justify="space-between" mt={2}>
                    <Text fontSize="sm" color="gray.500">18</Text>
                    <Text fontSize="sm" color="gray.500">65</Text>
                </HStack>
            </Box>

            {/* Distance (Future Feature) */}
            <Box>
                <HStack mb={4}>
                    <FaMapMarkerAlt color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Maximum Distance
                    </Text>
                </HStack>
                <Text fontSize="md" color="gray.600" mb={4}>
                    Within {preferences.maxDistance || 50} km
                </Text>
                <RangeSlider
                    value={[preferences.maxDistance || 50]}
                    min={1}
                    max={100}
                    step={1}
                    onChange={([distance]) => onUpdate({ maxDistance: distance })}
                    colorScheme="brand"
                >
                    <RangeSliderTrack bg="brand.100" h={2}>
                        <RangeSliderFilledTrack bg="brand.500" />
                    </RangeSliderTrack>
                    <RangeSliderThumb boxSize={6} index={0} bg="brand.500" />
                </RangeSlider>
                <HStack justify="space-between" mt={2}>
                    <Text fontSize="sm" color="gray.500">1 km</Text>
                    <Text fontSize="sm" color="gray.500">100 km</Text>
                </HStack>
            </Box>

            {/* Interests */}
            <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>
                    Interests & Hobbies
                </Text>
                <Text fontSize="sm" color="gray.600" mb={4}>
                    Select interests you'd like to share with your match ({preferences.interests?.length || 0} selected)
                </Text>
                <SimpleGrid columns={{ base: 3, md: 6 }} spacing={3}>
                    {commonInterests.map((interest) => {
                        const isSelected = preferences.interests?.includes(interest);
                        return (
                            <Badge
                                key={interest}
                                variant={isSelected ? 'solid' : 'outline'}
                                colorScheme={isSelected ? 'brand' : 'gray'}
                                p={3}
                                textAlign="center"
                                cursor="pointer"
                                onClick={() => toggleInterest(interest)}
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
                                {interest}
                            </Badge>
                        );
                    })}
                </SimpleGrid>
            </Box>

            {/* Tips */}
            <Box
                bg="blue.50"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="blue.200"
            >
                <Text fontSize="sm" color="blue.700">
                    💡 <strong>Tip:</strong> People with shared interests are 3x more likely to match!
                    Select interests that truly matter to you for better compatibility.
                </Text>
            </Box>
        </VStack>
    );
};

export default BasicsPage;