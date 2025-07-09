// apps/frontend/src/mvp/partner-preferences/components/pages/LifestylePage.tsx
import React from 'react';
import { VStack, Text, Box } from '@chakra-ui/react';
import { PartnerPreferences } from '../../types';

interface LifestylePageProps {
    preferences: PartnerPreferences;
    onUpdate: (updates: Partial<PartnerPreferences>) => void;
}

const LifestylePage: React.FC<LifestylePageProps> = ({ preferences, onUpdate }) => {
    return (
        <VStack spacing={6} align="stretch">
            <Box textAlign="center" py={10}>
                <Text fontSize="6xl" mb={4}>🍷</Text>
                <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={2}>
                    Lifestyle Preferences
                </Text>
                <Text color="gray.500">
                    Coming soon! Set preferences for smoking, drinking, and lifestyle choices.
                </Text>
            </Box>
        </VStack>
    );
};

// apps/frontend/src/mvp/partner-preferences/components/pages/PhysicalPage.tsx
const PhysicalPage: React.FC<LifestylePageProps> = ({ preferences, onUpdate }) => {
    return (
        <VStack spacing={6} align="stretch">
            <Box textAlign="center" py={10}>
                <Text fontSize="6xl" mb={4}>📏</Text>
                <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={2}>
                    Physical Preferences
                </Text>
                <Text color="gray.500">
                    Coming soon! Set preferences for height, body type, and physical attributes.
                </Text>
            </Box>
        </VStack>
    );
};

// apps/frontend/src/mvp/partner-preferences/components/pages/ValuesPage.tsx
const ValuesPage: React.FC<LifestylePageProps> = ({ preferences, onUpdate }) => {
    return (
        <VStack spacing={6} align="stretch">
            <Box textAlign="center" py={10}>
                <Text fontSize="6xl" mb={4}>🙏</Text>
                <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={2}>
                    Values & Beliefs
                </Text>
                <Text color="gray.500">
                    Coming soon! Set preferences for religion, family plans, and core values.
                </Text>
            </Box>
        </VStack>
    );
};

export { LifestylePage, PhysicalPage, ValuesPage };
export default LifestylePage;