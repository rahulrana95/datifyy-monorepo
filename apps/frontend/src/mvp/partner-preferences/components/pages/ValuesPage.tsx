// apps/frontend/src/mvp/partner-preferences/components/pages/ValuesPage.tsx
import React from 'react';
import {
    VStack,
    Box,
    Text,
    HStack,
    SimpleGrid,
    Badge,
    FormControl,
    FormLabel,
    Select,
    Textarea,
    Switch,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import { FaPray, FaHeart, FaGraduationCap, FaDollarSign, FaHandshake } from 'react-icons/fa';
import { PartnerPreferences } from '../../types';

interface ValuesPageProps {
    preferences: PartnerPreferences;
    onUpdate: (updates: Partial<PartnerPreferences>) => void;
}

const ValuesPage: React.FC<ValuesPageProps> = ({ preferences, onUpdate }) => {
    const religions = [
        'Christianity',
        'Islam',
        'Hinduism',
        'Buddhism',
        'Judaism',
        'Sikhism',
        'Atheist',
        'Agnostic',
        'Spiritual',
        'Other',
        'Prefer not to say'
    ];

    const educationLevels = [
        'High School',
        'Some College',
        'Bachelor\'s Degree',
        'Master\'s Degree',
        'PhD/Doctorate',
        'Trade School',
        'Professional Degree',
        'Other'
    ];

    const coreValues = [
        'Family Oriented',
        'Career Focused',
        'Adventurous',
        'Traditional',
        'Progressive',
        'Environmentally Conscious',
        'Health & Fitness',
        'Financial Stability',
        'Creativity & Arts',
        'Education & Learning',
        'Community Service',
        'Travel & Exploration',
        'Spirituality',
        'Honesty & Trust',
        'Humor & Fun',
        'Independence'
    ];

    const toggleReligion = (religion: string) => {
        const currentReligions = preferences.religion || [];
        const updatedReligions = currentReligions.includes(religion)
            ? currentReligions.filter(r => r !== religion)
            : [...currentReligions, religion];

        onUpdate({ religion: updatedReligions });
    };

    const toggleEducation = (education: string) => {
        const currentEducation = preferences.education || [];
        const updatedEducation = currentEducation.includes(education)
            ? currentEducation.filter(e => e !== education)
            : [...currentEducation, education];

        onUpdate({ education: updatedEducation });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <VStack spacing={8} align="stretch">
            {/* Religious Preferences */}
            <Box>
                <HStack mb={4}>
                    <FaPray color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Religious & Spiritual Beliefs
                    </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" mb={4}>
                    Select religious backgrounds you're comfortable with ({preferences.religion?.length || 0} selected)
                </Text>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                    {religions.map((religion) => {
                        const isSelected = preferences.religion?.includes(religion);
                        return (
                            <Badge
                                key={religion}
                                variant={isSelected ? 'solid' : 'outline'}
                                colorScheme={isSelected ? 'purple' : 'gray'}
                                p={3}
                                textAlign="center"
                                cursor="pointer"
                                onClick={() => toggleReligion(religion)}
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
                                {religion}
                            </Badge>
                        );
                    })}
                </SimpleGrid>
            </Box>

            {/* Education Preferences */}
            <Box>
                <HStack mb={4}>
                    <FaGraduationCap color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Education Level Preferences
                    </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" mb={4}>
                    Select education levels you prefer ({preferences.education?.length || 0} selected)
                </Text>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                    {educationLevels.map((education) => {
                        const isSelected = preferences.education?.includes(education);
                        return (
                            <Badge
                                key={education}
                                variant={isSelected ? 'solid' : 'outline'}
                                colorScheme={isSelected ? 'blue' : 'gray'}
                                p={3}
                                textAlign="center"
                                cursor="pointer"
                                onClick={() => toggleEducation(education)}
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
                                {education}
                            </Badge>
                        );
                    })}
                </SimpleGrid>
            </Box>

            {/* Income Preferences */}
            <Box>
                <HStack mb={4}>
                    <FaDollarSign color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Income Range Preference
                    </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" mb={4}>
                    {formatCurrency(preferences.income?.min || 0)} - {formatCurrency(preferences.income?.max || 200000)} annually
                </Text>

                <HStack spacing={4} align="end">
                    <FormControl flex={1}>
                        <FormLabel fontSize="sm">Minimum Income</FormLabel>
                        <NumberInput
                            value={preferences.income?.min || 0}
                            onChange={(_, value) => onUpdate({
                                income: {
                                    ...preferences.income,
                                    min: isNaN(value) ? 0 : value
                                }
                            })}
                            min={0}
                            max={1000000}
                            step={5000}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>

                    <FormControl flex={1}>
                        <FormLabel fontSize="sm">Maximum Income</FormLabel>
                        <NumberInput
                            value={preferences.income?.max || 200000}
                            onChange={(_, value) => onUpdate({
                                income: {
                                    ...preferences.income,
                                    max: isNaN(value) ? 200000 : value
                                }
                            })}
                            min={0}
                            max={1000000}
                            step={5000}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </HStack>

                <HStack mt={2} justify="space-between">
                    <Text fontSize="xs" color="gray.500">Income preferences are optional and private</Text>
                    <Switch
                        size="sm"
                        colorScheme="brand"
                        onChange={(e) => {
                            if (!e.target.checked) {
                                onUpdate({ income: { min: 0, max: 0 } });
                            }
                        }}
                    />
                </HStack>
            </Box>

            {/* Important Values */}
            <Box>
                <HStack mb={4}>
                    <FaHeart color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Important Values & Qualities
                    </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" mb={4}>
                    What values are most important to you in a partner? (Select up to 8)
                </Text>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                    {coreValues.map((value) => {
                        const isSelected = preferences.dealBreakers?.includes(value);
                        const isDisabled = (preferences.dealBreakers?.length || 0) >= 8 && !isSelected;

                        return (
                            <Badge
                                key={value}
                                variant={isSelected ? 'solid' : 'outline'}
                                colorScheme={isSelected ? 'green' : 'gray'}
                                p={3}
                                textAlign="center"
                                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                                opacity={isDisabled ? 0.5 : 1}
                                onClick={() => {
                                    if (!isDisabled) {
                                        const currentValues = preferences.dealBreakers || [];
                                        const updatedValues = currentValues.includes(value)
                                            ? currentValues.filter(v => v !== value)
                                            : [...currentValues, value];
                                        onUpdate({ dealBreakers: updatedValues });
                                    }
                                }}
                                borderRadius="lg"
                                fontSize="xs"
                                fontWeight="semibold"
                                _hover={!isDisabled ? {
                                    transform: 'scale(1.05)',
                                    boxShadow: 'sm',
                                } : {}}
                                _active={!isDisabled ? {
                                    transform: 'scale(0.98)',
                                } : {}}
                                transition="all 0.2s"
                            >
                                {value}
                            </Badge>
                        );
                    })}
                </SimpleGrid>
            </Box>

            {/* Additional Notes */}
            {/* <Box>
                <HStack mb={4}>
                    <FaHandshake color="#e85d75" size="18px" />
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        Additional Notes
                    </Text>
                </HStack>
                <FormControl>
                    <FormLabel fontSize="sm" color="gray.700">
                        What else should potential matches know about your values and what you're looking for?
                    </FormLabel>
                    <Textarea
                        value={preferences.whatOtherPersonShouldKnow || ''}
                        onChange={(e) => onUpdate({ whatOtherPersonShouldKnow: e.target.value })}
                        placeholder="Share your thoughts on relationships, life goals, or anything important to you..."
                        size="lg"
                        rows={4}
                        resize="vertical"
                        borderColor="gray.300"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px rgba(232, 93, 117, 0.6)",
                        }}
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                        {(preferences.whatOtherPersonShouldKnow || '').length}/500 characters
                    </Text>
                </FormControl>
            </Box> */}

            {/* Wisdom Box */}
            <Box
                bg="purple.50"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="purple.200"
            >
                <Text fontSize="sm" color="purple.700">
                    🧠 <strong>Remember:</strong> Shared values are the foundation of lasting relationships.
                    While opposites can attract, similar core values help couples navigate life's challenges together.
                </Text>
            </Box>
        </VStack>
    );
};

export default ValuesPage;