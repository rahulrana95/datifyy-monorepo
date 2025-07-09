// apps/frontend/src/mvp/profile/components/tabs/SettingsTab.tsx
import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Switch,
    Button,
    Divider,
    Alert,
    AlertIcon,
    useToast,
} from '@chakra-ui/react';
import { FaCog, FaBell, FaEye, FaShieldAlt, FaTrash } from 'react-icons/fa';
import { useAuthStore } from '../../../login-signup/store/authStore';
import { UserProfile } from '../../types/index';

interface SettingsTabProps {
    profile: UserProfile;
    onUpdate: (data: Partial<UserProfile>) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ profile, onUpdate }) => {
    const { clearUser } = useAuthStore();
    const toast = useToast();

    const handleLogout = () => {
        clearUser();
        toast({
            title: 'Logged out successfully',
            description: 'Come back soon! 💕',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleDeleteAccount = () => {
        toast({
            title: 'Account deletion',
            description: 'This feature will be available soon',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <HStack>
                <FaCog color="#e85d75" size="20px" />
                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    Settings & Privacy
                </Text>
            </HStack>

            {/* Notifications */}
            <Box>
                <HStack mb={4}>
                    <FaBell color="#e85d75" size="16px" />
                    <Text fontWeight="semibold" color="gray.700">
                        Notifications
                    </Text>
                </HStack>
                <VStack spacing={3} pl={6}>
                    <HStack justify="space-between" w="full">
                        <Text>New matches</Text>
                        <Switch colorScheme="brand" defaultChecked />
                    </HStack>
                    <HStack justify="space-between" w="full">
                        <Text>Messages</Text>
                        <Switch colorScheme="brand" defaultChecked />
                    </HStack>
                    <HStack justify="space-between" w="full">
                        <Text>Profile views</Text>
                        <Switch colorScheme="brand" />
                    </HStack>
                </VStack>
            </Box>

            <Divider />

            {/* Privacy */}
            <Box>
                <HStack mb={4}>
                    <FaEye color="#e85d75" size="16px" />
                    <Text fontWeight="semibold" color="gray.700">
                        Privacy
                    </Text>
                </HStack>
                <VStack spacing={3} pl={6}>
                    <HStack justify="space-between" w="full">
                        <Text>Show me on discovery</Text>
                        <Switch colorScheme="brand" defaultChecked />
                    </HStack>
                    <HStack justify="space-between" w="full">
                        <Text>Show distance</Text>
                        <Switch colorScheme="brand" defaultChecked />
                    </HStack>
                    <HStack justify="space-between" w="full">
                        <Text>Show age</Text>
                        <Switch colorScheme="brand" defaultChecked />
                    </HStack>
                </VStack>
            </Box>

            <Divider />

            {/* Safety */}
            <Box>
                <HStack mb={4}>
                    <FaShieldAlt color="#e85d75" size="16px" />
                    <Text fontWeight="semibold" color="gray.700">
                        Safety & Support
                    </Text>
                </HStack>
                <VStack spacing={2} pl={6} align="start">
                    <Button variant="ghost" size="sm" justifyContent="start" cursor="pointer">
                        Safety tips
                    </Button>
                    <Button variant="ghost" size="sm" justifyContent="start" cursor="pointer">
                        Report a problem
                    </Button>
                    <Button variant="ghost" size="sm" justifyContent="start" cursor="pointer">
                        Block/unblock contacts
                    </Button>
                </VStack>
            </Box>

            <Divider />

            {/* Account Actions */}
            <VStack spacing={4}>
                <Button
                    variant="outline"
                    colorScheme="gray"
                    w="full"
                    onClick={handleLogout}
                    cursor="pointer"
                >
                    Log Out
                </Button>

                <Button
                    variant="outline"
                    colorScheme="red"
                    w="full"
                    leftIcon={<FaTrash />}
                    onClick={handleDeleteAccount}
                    cursor="pointer"
                >
                    Delete Account
                </Button>
            </VStack>

            {/* Warning */}
            <Alert status="warning" borderRadius="lg">
                <AlertIcon />
                <Box>
                    <Text fontSize="sm" fontWeight="semibold">
                        Account Safety
                    </Text>
                    <Text fontSize="xs">
                        Never share personal information like your address or financial details with matches.
                    </Text>
                </Box>
            </Alert>
        </VStack>
    );
};

export default SettingsTab;