// apps/frontend/src/mvp/profile/components/ProfileTabs.tsx
import React from 'react';
import {
    HStack,
    Button,
    Box,
    useBreakpointValue,
} from '@chakra-ui/react';
import { FaCamera, FaUser, FaHeart, FaCog } from 'react-icons/fa';
import { ProfileTab } from '../types/index';

interface ProfileTabsProps {
    activeTab: ProfileTab;
    onTabChange: (tab: ProfileTab) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
    activeTab,
    onTabChange,
}) => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const tabs = [
        {
            id: 'photos' as ProfileTab,
            label: 'Photos',
            icon: FaCamera,
        },
        {
            id: 'about' as ProfileTab,
            label: 'About',
            icon: FaUser,
        },
        {
            id: 'preferences' as ProfileTab,
            label: 'Preferences',
            icon: FaHeart,
        },
        {
            id: 'settings' as ProfileTab,
            label: 'Settings',
            icon: FaCog,
        },
    ];

    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={2}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
        >
            <HStack spacing={1} w="full">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <Button
                            key={tab.id}
                            variant="ghost"
                            size={isMobile ? 'sm' : 'md'}
                            flex={1}
                            py={3}
                            borderRadius="lg"
                            color={isActive ? 'white' : 'gray.600'}
                            bg={isActive ? 'brand.500' : 'transparent'}
                            fontWeight={isActive ? 'bold' : 'medium'}
                            leftIcon={<Icon size={isMobile ? '14px' : '16px'} />}
                            onClick={() => onTabChange(tab.id)}
                            _hover={{
                                bg: isActive ? 'brand.600' : 'brand.50',
                                color: isActive ? 'white' : 'brand.600',
                                transform: 'translateY(-1px)',
                            }}
                            _active={{
                                transform: 'scale(0.98)',
                            }}
                            transition="all 0.2s ease"
                            cursor="pointer"
                        >
                            {!isMobile && tab.label}
                        </Button>
                    );
                })}
            </HStack>
        </Box>
    );
};

export default ProfileTabs;