// apps/frontend/src/mvp/partner-preferences/PartnerPreferencesContainer.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    VStack,
    useToast,
    Text,
    HStack,
    Progress,
    IconButton,
} from '@chakra-ui/react';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import userProfileService from '../../service/userService/userProfileService';
import PreferencesHeader from './components/PreferencesHeader';
import PreferencesNavigation from './components/PreferencesNavigation';
import PreferencesContent from './components/PreferencesContent';
import LoadingSpinner from './components/LoadingSpinner';
import { PartnerPreferences, PreferencePage } from './types';

const PartnerPreferencesContainer: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [preferences, setPreferences] = useState<PartnerPreferences>({
        minAge: 22,
        maxAge: 35,
        maxDistance: 50,
        interests: [],
        dealBreakers: [],
        education: [],
        lifestyle: [],
        bodyType: [],
        ethnicity: [],
        religion: [],
        smoking: '',
        drinking: '',
        hasKids: '',
        wantsKids: '',
        height: { min: 150, max: 200 },
        income: { min: 0, max: 200000 },
    });

    const [currentPage, setCurrentPage] = useState<PreferencePage>('basics');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        setLoading(true);
        try {
            const response = await userProfileService.getPartnerPreferences();
            if (response.response) {
                const data = response.response;
                setPreferences({
                    minAge: data.minAge || 22,
                    maxAge: data.maxAge || 35,
                    maxDistance: 50, // Default since API might not have this
                    interests: data.interests || [],
                    dealBreakers: [], // Not in API yet
                    education: [], // Future feature
                    lifestyle: [], // Future feature
                    bodyType: [], // Future feature
                    ethnicity: [], // Future feature
                    religion: [], // Future feature
                    smoking: '', // Future feature
                    drinking: '', // Future feature
                    hasKids: '', // Future feature
                    wantsKids: '', // Future feature
                    height: { min: 150, max: 200 }, // Future feature
                    income: { min: 0, max: 200000 }, // Future feature
                });
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
            toast({
                title: 'Error loading preferences',
                description: 'Please try again later',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Only send properties that exist in the API
            const updateData = {
                minAge: preferences.minAge,
                maxAge: preferences.maxAge,
                interests: preferences.interests,
            };

            const response = await userProfileService.updatePartnerPreferences(updateData);

            if (response.error) {
                throw new Error('Failed to save preferences');
            }

            toast({
                title: 'Preferences saved! 💕',
                description: 'Your partner preferences have been updated',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Save error:', error);
            toast({
                title: 'Save failed',
                description: 'Please try again',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = (updates: Partial<PartnerPreferences>) => {
        setPreferences(prev => ({ ...prev, ...updates }));
    };

    const getCompletionPercentage = () => {
        const totalFields = 8; // Age, distance, interests, etc.
        let completedFields = 0;

        // Count completed fields
        if (preferences.minAge && preferences.maxAge) completedFields++;
        if (preferences.maxDistance && preferences.maxDistance > 0) completedFields++;
        if (preferences.interests && preferences.interests.length > 0) completedFields++;
        if (preferences.dealBreakers && preferences.dealBreakers.length > 0) completedFields++;
        if (preferences.smoking) completedFields++;
        if (preferences.drinking) completedFields++;
        if (preferences.hasKids) completedFields++;
        if (preferences.wantsKids) completedFields++;

        return Math.round((completedFields / totalFields) * 100);
    };

    const handleBackClick = () => {
        navigate('/profile');
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Container maxW="4xl" py={6}>
            <VStack spacing={6} align="stretch">
                {/* Back Navigation & Title */}
                <HStack spacing={4} align="center">
                    <IconButton
                        aria-label="Go back to profile"
                        icon={<FaArrowLeft />}
                        variant="ghost"
                        size="lg"
                        onClick={handleBackClick}
                        borderRadius="full"
                        _hover={{
                            bg: 'gray.100',
                            transform: 'translateX(-2px)',
                        }}
                        cursor="pointer"
                    />

                    <VStack align="start" spacing={1} flex={1}>
                        <HStack>
                            <FaHeart color="#e85d75" size="20px" />
                            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                Partner Preferences
                            </Text>
                        </HStack>
                        <Text color="gray.600" fontSize="sm">
                            Help us find your perfect match by setting your preferences
                        </Text>
                    </VStack>
                </HStack>

                {/* Progress Bar */}
                <Box
                    bg="white"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.100"
                    boxShadow="sm"
                >
                    <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" color="gray.600" fontWeight="medium">
                            Preferences Completion
                        </Text>
                        <Text fontSize="sm" color="brand.500" fontWeight="bold">
                            {getCompletionPercentage()}%
                        </Text>
                    </HStack>
                    <Progress
                        value={getCompletionPercentage()}
                        size="sm"
                        colorScheme="brand"
                        borderRadius="full"
                        bg="brand.50"
                    />
                    <Text fontSize="xs" color="gray.500" mt={2}>
                        Complete more sections to get better matches
                    </Text>
                </Box>

                {/* Header with Save Button */}
                <PreferencesHeader
                    currentPage={currentPage}
                    onSave={handleSave}
                    saving={saving}
                />

                {/* Tab Navigation */}
                <PreferencesNavigation
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />

                {/* Main Content */}
                <PreferencesContent
                    currentPage={currentPage}
                    preferences={preferences}
                    onUpdate={handleUpdate}
                />

                {/* Bottom Tips */}
                <Box
                    bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)"
                    p={4}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="brand.100"
                >
                    <HStack spacing={3}>
                        <Text fontSize="2xl">💡</Text>
                        <VStack align="start" spacing={1}>
                            <Text fontSize="sm" fontWeight="semibold" color="brand.700">
                                Matching Tip
                            </Text>
                            <Text fontSize="xs" color="brand.600" lineHeight="1.4">
                                Users with detailed preferences get 5x better matches! Take your time to set accurate preferences.
                            </Text>
                        </VStack>
                    </HStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default PartnerPreferencesContainer;