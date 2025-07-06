import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Progress,
    Button,
    Badge,
    Icon,
    useColorModeValue,
    Spinner
} from '@chakra-ui/react';
import { FaChartLine, FaCheckCircle, FaExclamationCircle, FaArrowRight } from 'react-icons/fa';
import { ProfileCompletionStats } from '../hooks/useUserProfile';

interface ProfileCompletionBannerProps {
    stats: ProfileCompletionStats;
    onActionClick: (field: string) => void;
}

export const ProfileCompletionBanner: React.FC<ProfileCompletionBannerProps> = ({
    stats,
    onActionClick
}) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const getProgressColor = (percentage: number) => {
        if (percentage >= 90) return 'green';
        if (percentage >= 70) return 'blue';
        if (percentage >= 50) return 'yellow';
        return 'red';
    };

    const getStrengthColor = (strength: string) => {
        switch (strength) {
            case 'complete': return 'green';
            case 'strong': return 'blue';
            case 'moderate': return 'yellow';
            default: return 'red';
        }
    };

    return (
        <Box
            bg={bgColor}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="xl"
            p={6}
            shadow="sm"
        >
            <VStack spacing={4} align="stretch">

                {/* Header */}
                <HStack justify="space-between" align="center">
                    <HStack spacing={3}>
                        <Icon as={FaChartLine} color="blue.500" boxSize={5} />
                        <Text fontSize="lg" fontWeight="bold">
                            Profile Completion
                        </Text>
                        <Badge
                            colorScheme={getStrengthColor(stats.profileStrength)}
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="full"
                        >
                            {stats.profileStrength.toUpperCase()}
                        </Badge>
                    </HStack>

                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                        {stats.completionPercentage}%
                    </Text>
                </HStack>

                {/* Progress Bar */}
                <Progress
                    value={stats.completionPercentage}
                    colorScheme={getProgressColor(stats.completionPercentage)}
                    size="lg"
                    borderRadius="full"
                    bg="gray.100"
                />

                {/* Recommendations */}
                {stats.recommendations.length > 0 && (
                    <VStack spacing={2} align="stretch">
                        <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                            Quick Wins to Boost Your Profile:
                        </Text>
                        {stats.recommendations.slice(0, 2).map((recommendation, index) => (
                            <HStack key={index} spacing={3}>
                                <Icon as={FaExclamationCircle} color="orange.500" boxSize={4} />
                                <Text fontSize="sm" flex="1">
                                    {recommendation}
                                </Text>
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    colorScheme="blue"
                                    rightIcon={<FaArrowRight />}
                                    onClick={() => {
                                        // Extract field name from recommendation if possible
                                        const field = extractFieldFromRecommendation(recommendation);
                                        if (field) onActionClick(field);
                                    }}
                                >
                                    Fix
                                </Button>
                            </HStack>
                        ))}
                    </VStack>
                )}

                {/* Completion Achievement */}
                {stats.completionPercentage >= 90 && (
                    <HStack spacing={2} p={3} bg="green.50" borderRadius="md">
                        <Icon as={FaCheckCircle} color="green.500" />
                        <Text fontSize="sm" color="green.700" fontWeight="medium">
                            Awesome! Your profile is almost complete. You're 300% more likely to get matches!
                        </Text>
                    </HStack>
                )}
            </VStack>
        </Box>
    );
};

// Helper function to extract field names from recommendations
function extractFieldFromRecommendation(recommendation: string): string | null {
    if (recommendation.includes('photos') || recommendation.includes('images')) return 'images';
    if (recommendation.includes('bio')) return 'bio';
    if (recommendation.includes('height')) return 'height';
    if (recommendation.includes('interests')) return 'favInterest';
    return null;
}

// apps/frontend/src/mvp/common/LoadingSpinner.tsx
export const LoadingSpinner: React.FC<{ message?: string }> = ({ message }) => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="400px"
        textAlign="center"
    >
        <Spinner size="xl" color="blue.500" thickness="4px" />
        {message && (
            <Text mt={4} fontSize="lg" color="gray.600">
                {message}
            </Text>
        )}
    </Box>
);
