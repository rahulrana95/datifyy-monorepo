// apps/frontend/src/mvp/profile/components/ProfileContent.tsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import { ProfileTab, UserProfile } from '../types/index';
import PhotosTab from './tabs/PhotosTab';
import AboutTab from './tabs/AboutTab';
import PreferencesTab from './tabs/PreferencesTab';
import SettingsTab from './tabs/SettingsTab';

interface ProfileContentProps {
    activeTab: ProfileTab;
    profile: UserProfile;
    onUpdate: (data: Partial<UserProfile>) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
    activeTab,
    profile,
    onUpdate,
}) => {
    const renderTabContent = () => {
        switch (activeTab) {
            case 'photos':
                return (
                    <PhotosTab
                        photos={profile.images || []}
                        onUpdate={(images) => onUpdate({ images })}
                    />
                );

            case 'about':
                return (
                    <AboutTab
                        profile={profile}
                        onUpdate={onUpdate}
                    />
                );

            case 'preferences':
                return (
                    <PreferencesTab />
                );

            case 'settings':
                return (
                    <SettingsTab
                        profile={profile}
                        onUpdate={onUpdate}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={6}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            minH="400px"
            className="fade-in"
        >
            {renderTabContent()}
        </Box>
    );
};

export default ProfileContent;