// apps/frontend/src/mvp/profile/components/tabs/PreferencesTab.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Button,
    Badge,
    SimpleGrid,
    useToast,
} from '@chakra-ui/react';
import { FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import userProfileService from '../../../../service/userService/userProfileService';

interface PartnerPreferences {
    minAge?: number;
    maxAge?: number;
    locationRadius?: number;
    interests?: string[];
}

const PreferencesTab: React.FC = () => {
    const [preferences, setPreferences] = useState<PartnerPreferences>({
        minAge: 22,
        maxAge: 35,
        locationRadius: 50,
        interests: [],
    });
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const commonInterests = [
        'Travel', 'Movies', 'Music', 'Sports', 'Cooking', 'Reading',
        'Fitness', 'Art', 'Photography', 'Dancing', 'Gaming', 'Hiking'
    ];

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const response = await userProfileService.getPartnerPreferences();
            if (response.response) {
                setPreferences({
                    minAge: response.response.minAge || 22,
                    maxAge: response.response.maxAge || 35,
                    locationRadius: 50, // Default value since this might not be in API
                    interests: response.response.interests || [],
                });
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Only send properties that exist in the API
            const updateData = {
                minAge: preferences.minAge,
                maxAge: preferences.maxAge,
                interests: preferences.interests,
            };

            await userProfileService.updatePartnerPreferences(updateData);

            toast({
                title: 'Preferences saved! 💕',
                description: 'Your dating preferences have been updated',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Save failed',
                description: 'Please try again',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleInterest = (interest: string) => {
        setPreferences(prev => ({
            ...prev,
            interests: prev.interests?.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...(prev.interests || []), interest]
        }));
    };

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <HStack>
                <FaHeart color="#e85d75" size="20px" />
                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    Dating Preferences
                </Text>
            </HStack>

            {/* Age Range */}
            <Box>
                <Text fontWeight="semibold" color="gray.700" mb={4}>
                    Age Range: {preferences.minAge} - {preferences.maxAge} years
                </Text>
                <RangeSlider
                    value={[preferences.minAge || 22, preferences.maxAge || 35]}
                    min={18}
                    max={60}
                    step={1}
                    onChange={([min, max]) =>
                        setPreferences(prev => ({ ...prev, minAge: min, maxAge: max }))
                    }
                    colorScheme="brand"
                >
                    <RangeSliderTrack bg="brand.100">
                        <RangeSliderFilledTrack bg="brand.500" />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} boxSize={6} />
                    <RangeSliderThumb index={1} boxSize={6} />
                </RangeSlider>
            </Box>

            {/* Interests */}
            <Box>
                <Text fontWeight="semibold" color="gray.700" mb={4}>
                    Interests You're Looking For ({preferences.interests?.length || 0} selected)
                </Text>
                <Text fontSize="sm" color="gray.500" mb={4}>
                    Select interests that are important to you in a potential match
                </Text>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
                    {commonInterests.map((interest) => {
                        const isSelected = preferences.interests?.includes(interest);
                        return (
                            <Badge
                                key={interest}
                                variant={isSelected ? 'solid' : 'outline'}
                                colorScheme={isSelected ? 'brand' : 'gray'}
                                p={2}
                                textAlign="center"
                                cursor="pointer"
                                onClick={() => toggleInterest(interest)}
                                _hover={{
                                    transform: 'scale(1.05)',
                                    boxShadow: 'sm',
                                }}
                                transition="all 0.2s"
                            >
                                {interest}
                            </Badge>
                        );
                    })}
                </SimpleGrid>
            </Box>

            {/* Save Button */}
            <Button
                colorScheme="brand"
                size="lg"
                onClick={handleSave}
                isLoading={loading}
                loadingText="Saving preferences..."
                cursor="pointer"
            >
                Save Preferences
            </Button>

            {/* Tips */}
            <VStack spacing={3}>
                <Box
                    bg="brand.50"
                    p={4}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="brand.200"
                >
                    <Text fontSize="sm" color="brand.700">
                        💡 <strong>Tip:</strong> Setting age range and interests helps us find better matches for you!
                    </Text>
                </Box>

                <Box
                    bg="blue.50"
                    p={4}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="blue.200"
                >
                    <Text fontSize="sm" color="blue.700">
                        🔮 <strong>Coming Soon:</strong> Distance preferences, lifestyle choices, and more detailed compatibility settings!
                    </Text>
                </Box>
            </VStack>
        </VStack>
    );
};

export default PreferencesTab;