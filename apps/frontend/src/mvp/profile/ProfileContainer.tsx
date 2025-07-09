// apps/frontend/src/mvp/profile/ProfileContainer.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { useAuthStore } from '../login-signup/store/authStore';
import userProfileService from '../../service/userService/userProfileService';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import ProfileContent from './components/ProfileContent';
import LoadingSpinner from './components/LoadingSpinner';
import { UserProfile, ProfileStats, ProfileTab } from './types/index';

const ProfileContainer: React.FC = () => {
    const { user } = useAuthStore();
    const toast = useToast();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats] = useState<ProfileStats>({
        likes: 127,
        matches: 23,
        views: 1250,
        profileCompletion: 85
    });
    const [activeTab, setActiveTab] = useState<ProfileTab>('photos');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const response = await userProfileService.getUserProfile();
            if (response.response) {
                const userData = response.response;
                setProfile({
                    id: userData.id,
                    name: `${userData.firstName} ${userData.lastName}`.trim(),
                    email: userData.officialEmail,
                    age: userData.dob ? calculateAge(userData.dob) : undefined,
                    bio: userData.bio || undefined,
                    images: userData.images || [],
                    city: userData.currentCity || undefined,
                    isVerified: userData.isOfficialEmailVerified || false,
                    height: userData.height || undefined,
                    occupation: 'Dating enthusiast', // You can add this field to backend
                });
            }
        } catch (error) {
            toast({
                title: 'Error loading profile',
                description: 'Please try again later',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (dob: string): number => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const handleProfileUpdate = async (updatedData: Partial<UserProfile>) => {
        if (!profile) return;

        try {
            const updatePayload = {
                firstName: updatedData.name?.split(' ')[0],
                lastName: updatedData.name?.split(' ').slice(1).join(' '),
                bio: updatedData.bio,
                currentCity: updatedData.city,
                height: updatedData.height,
                images: updatedData.images,
            };

            const response = await userProfileService.updateUserProfile(updatePayload);

            if (response.response) {
                setProfile({ ...profile, ...updatedData });
                toast({
                    title: 'Profile updated! 💕',
                    description: 'Your changes have been saved',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Update failed',
                description: 'Please try again',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!profile) {
        return (
            <Container maxW="4xl" py={8}>
                <Box textAlign="center" py={10}>
                    <VStack spacing={4}>
                        <Box fontSize="6xl">😔</Box>
                        <Box>
                            <Box fontSize="xl" fontWeight="bold" color="gray.700">
                                Profile not found
                            </Box>
                            <Box color="gray.500">
                                Please try refreshing the page
                            </Box>
                        </Box>
                    </VStack>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="4xl" py={6}>
            <VStack spacing={6} align="stretch">
                {/* Profile Header */}
                <ProfileHeader
                    profile={profile}
                    stats={stats}
                    onUpdate={handleProfileUpdate}
                />

                {/* Tab Navigation */}
                <ProfileTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Tab Content */}
                <ProfileContent
                    activeTab={activeTab}
                    profile={profile}
                    onUpdate={handleProfileUpdate}
                />
            </VStack>
        </Container>
    );
};

export default ProfileContainer;