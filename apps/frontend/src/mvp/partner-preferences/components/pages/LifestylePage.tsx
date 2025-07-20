// apps/frontend/src/mvp/partner-preferences/components/pages/LifestylePage.tsx
import React from 'react';
import {
    VStack,
    Box,
    Text,
    HStack,
    Button,
    SimpleGrid,
    Badge,
    FormControl,
    FormLabel,
    Select,
} from '@chakra-ui/react';
import { FaCoffee, FaSmoking, FaWineGlass, FaChild, FaBaby } from 'react-icons/fa';
import { PartnerPreferences } from '../../types';
import { SmokingPreference, DrinkingPreference } from '../../../../proto-types';

interface LifestylePageProps {
    preferences: PartnerPreferences;
    onUpdate: (updates: Partial<PartnerPreferences>) => void;
}

const LifestylePage: React.FC<LifestylePageProps> = ({ preferences, onUpdate }) => {
    const drinkingOptions = [
        { value: '', label: 'No preference' },
        { value: DrinkingPreference.DRINKING_PREFERENCE_NEVER, label: 'Never drinks' },
        { value: DrinkingPreference.DRINKING_PREFERENCE_SOCIALLY, label: 'Social drinker' },
        { value: DrinkingPreference.DRINKING_PREFERENCE_REGULARLY, label: 'Regular drinker' },
    ];

    const smokingOptions = [
        { value: '', label: 'No preference' },
        { value: SmokingPreference.SMOKING_PREFERENCE_NEVER, label: 'Non-smoker' },
        { value: SmokingPreference.SMOKING_PREFERENCE_SOCIALLY, label: 'Social smoker' },
        { value: SmokingPreference.SMOKING_PREFERENCE_REGULARLY, label: 'Regular smoker' },
    ];

    const kidsOptions = [
        { value: '', label: 'No preference' },
        { value: 'none', label: "Doesn't have kids" },
        { value: 'has', label: 'Has kids' },
        { value: 'wants', label: 'Wants kids someday' },
        { value: 'doesnt_want', label: "Doesn't want kids" },
    ];

    const lifestyleChoices = [
        'Active & Sporty',
        'Homebody',
        'Social Butterfly',
        'Workaholic',
        'Creative',
        'Spiritual',
        'Adventurous',
        'Minimalist',
        'Night Owl',
        'Early Bird',
        'Health Conscious',
        'Foodie'
    ];

    const toggleLifestyle = (lifestyle: string) => {
        const currentInterests = preferences.interests || [];
        const updatedInterests = currentInterests.includes(lifestyle)
            ? currentInterests.filter((l: string) => l !== lifestyle)
            : [...currentInterests, lifestyle];

        onUpdate({ interests: updatedInterests });
    };

    return (
        <VStack spacing={8} align="stretch">
            {/* Drinking Preferences */}
            <Box>
                <HStack mb={4}>
                    <FaWineGlass color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Drinking Preferences
                    </Text>
                </HStack>
                <FormControl>
                    <Select
                        value={preferences.drinkingPreferences?.[0] || ''}
                        onChange={(e) => onUpdate({ drinkingPreferences: e.target.value ? [e.target.value as DrinkingPreference] : [] })}
                        placeholder="Select drinking preference"
                        size="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px rgba(232, 93, 117, 0.6)",
                        }}
                    >
                        {drinkingOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Smoking Preferences */}
            <Box>
                <HStack mb={4}>
                    <FaSmoking color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Smoking Preferences
                    </Text>
                </HStack>
                <FormControl>
                    <Select
                        value={preferences.smokingPreferences?.[0] || ''}
                        onChange={(e) => onUpdate({ smokingPreferences: e.target.value ? [e.target.value as SmokingPreference] : [] })}
                        placeholder="Select smoking preference"
                        size="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px rgba(232, 93, 117, 0.6)",
                        }}
                    >
                        {smokingOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Kids Preferences */}
            <Box>
                <HStack mb={4}>
                    <FaChild color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Children Preferences
                    </Text>
                </HStack>
                <VStack spacing={4} align="stretch">
                    <FormControl>
                        <FormLabel fontSize="md" color="gray.700">
                            Partner having kids
                        </FormLabel>
                        <Select
                            value={preferences.dealBreakers?.find(d => d.startsWith('hasKids:'))?.split(':')[1] || ''}
                            onChange={(e) => {
                                const newDealBreakers = (preferences.dealBreakers || []).filter(d => !d.startsWith('hasKids:'));
                                if (e.target.value) newDealBreakers.push(`hasKids:${e.target.value}`);
                                onUpdate({ dealBreakers: newDealBreakers });
                            }}
                            placeholder="Select preference"
                            size="lg"
                        >
                            {kidsOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize="md" color="gray.700">
                            Wanting kids in future
                        </FormLabel>
                        <Select
                            value={preferences.dealBreakers?.find(d => d.startsWith('wantsKids:'))?.split(':')[1] || ''}
                            onChange={(e) => {
                                const newDealBreakers = (preferences.dealBreakers || []).filter(d => !d.startsWith('wantsKids:'));
                                if (e.target.value) newDealBreakers.push(`wantsKids:${e.target.value}`);
                                onUpdate({ dealBreakers: newDealBreakers });
                            }}
                            placeholder="Select preference"
                            size="lg"
                        >
                            {kidsOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </VStack>
            </Box>

            {/* Lifestyle Choices */}
            <Box>
                <HStack mb={4}>
                    <FaCoffee color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Lifestyle Preferences
                    </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" mb={4}>
                    Select lifestyle traits you prefer in a partner ({preferences.interests?.filter(i => lifestyleChoices.includes(i)).length || 0} selected)
                </Text>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                    {lifestyleChoices.map((lifestyle) => {
                        const isSelected = preferences.interests?.includes(lifestyle);
                        return (
                            <Badge
                                key={lifestyle}
                                variant={isSelected ? 'solid' : 'outline'}
                                colorScheme={isSelected ? 'brand' : 'gray'}
                                p={3}
                                textAlign="center"
                                cursor="pointer"
                                onClick={() => toggleLifestyle(lifestyle)}
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
                                {lifestyle}
                            </Badge>
                        );
                    })}
                </SimpleGrid>
            </Box>

            {/* Tips */}
            <Box
                bg="orange.50"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="orange.200"
            >
                <Text fontSize="sm" color="orange.700">
                    💡 <strong>Tip:</strong> Being specific about lifestyle preferences helps find compatible matches.
                    People with similar lifestyles are more likely to have lasting relationships.
                </Text>
            </Box>
        </VStack>
    );
};

export default LifestylePage;