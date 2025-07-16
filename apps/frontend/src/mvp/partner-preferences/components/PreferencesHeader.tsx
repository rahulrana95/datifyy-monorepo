// apps/frontend/src/mvp/partner-preferences/components/PreferencesHeader.tsx
import React from 'react';
import {
    Box,
    HStack,
    Text,
    Button,
} from '@chakra-ui/react';
import { FaHeart, FaSave } from 'react-icons/fa';
import { PreferencePage } from '../types';

interface PreferencesHeaderProps {
    currentPage: PreferencePage;
    onSave: () => void;
    saving: boolean;
}

const PreferencesHeader: React.FC<PreferencesHeaderProps> = ({
    currentPage,
    onSave,
    saving,
}) => {
    const getPageInfo = () => {
        switch (currentPage) {
            case 'basics':
                return {
                    title: 'Basic Preferences',
                    description: 'Age range, location, and general interests',
                };
            case 'lifestyle':
                return {
                    title: 'Lifestyle Choices',
                    description: 'Smoking, drinking, and daily habits',
                };
            case 'physical':
                return {
                    title: 'Physical Preferences',
                    description: 'Height, body type, and appearance',
                };
            case 'values':
                return {
                    title: 'Values & Beliefs',
                    description: 'Religion, family plans, and core values',
                };
            default:
                return {
                    title: 'Partner Preferences',
                    description: 'Find your perfect match',
                };
        }
    };

    const pageInfo = getPageInfo();

    return (
        <Box
            bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)"
            borderRadius="xl"
            p={6}
            border="1px solid"
            borderColor="brand.100"
            position="relative"
            overflow="hidden"
        >
            {/* Background decoration */}
            <Box
                position="absolute"
                top="-30px"
                right="-30px"
                w="100px"
                h="100px"
                bg="brand.50"
                borderRadius="full"
                opacity={0.4}
            />

            <HStack justify="space-between" position="relative" zIndex={1}>
                <Box>
                    <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={1}>
                        {pageInfo.title}
                    </Text>
                    <Text color="gray.600" fontSize="sm">
                        {pageInfo.description}
                    </Text>
                </Box>

                <Button
                    variant="love"
                    leftIcon={<FaSave />}
                    onClick={onSave}
                    isLoading={saving}
                    loadingText="Saving..."
                    cursor="pointer"
                    _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(232, 93, 117, 0.3)',
                    }}
                >
                    Save All
                </Button>
            </HStack>
        </Box>
    );
};

export default PreferencesHeader;