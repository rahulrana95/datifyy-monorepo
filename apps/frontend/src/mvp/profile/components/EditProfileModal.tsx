// apps/frontend/src/mvp/profile/components/EditProfileModal.tsx
import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    HStack,
    useToast,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import { UserProfile } from '../types/index';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: UserProfile;
    onUpdate: (data: Partial<UserProfile>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    profile,
    onUpdate,
}) => {
    const [formData, setFormData] = useState({
        name: profile.name,
        bio: profile.bio || '',
        city: profile.city || '',
        height: profile.height?.toString() || '',
        occupation: profile.occupation || '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSave = async () => {
        setIsLoading(true);

        try {
            await onUpdate({
                name: formData.name,
                bio: formData.bio,
                city: formData.city,
                height: Number(formData.height) || undefined,
                occupation: formData.occupation,
            });

            onClose();

            toast({
                title: 'Profile updated! 💕',
                description: 'Your changes have been saved successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Update failed',
                description: 'Please try again',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: profile.name,
            bio: profile.bio || '',
            city: profile.city || '',
            height: profile.height?.toString() || '',
            occupation: profile.occupation || '',
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl">
                <ModalHeader
                    bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)"
                    borderTopRadius="xl"
                >
                    Edit Profile ✨
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody p={6}>
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel fontWeight="semibold">Name</FormLabel>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your name"
                                size="lg"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel fontWeight="semibold">Bio</FormLabel>
                            <Textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell others about yourself..."
                                rows={3}
                                resize="vertical"
                            />
                        </FormControl>

                        <HStack w="full" spacing={4}>
                            <FormControl>
                                <FormLabel fontWeight="semibold">City</FormLabel>
                                <Input
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="Your city"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight="semibold">Height (cm)</FormLabel>
                                <Input
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    placeholder="170"
                                    type="number"
                                />
                            </FormControl>
                        </HStack>

                        <FormControl>
                            <FormLabel fontWeight="semibold">Occupation</FormLabel>
                            <Input
                                value={formData.occupation}
                                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                placeholder="What do you do?"
                            />
                        </FormControl>

                        <HStack w="full" spacing={4} pt={4}>
                            <Button
                                variant="outline"
                                flex={1}
                                onClick={handleCancel}
                                cursor="pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="love"
                                flex={1}
                                rightIcon={<FaHeart />}
                                onClick={handleSave}
                                isLoading={isLoading}
                                loadingText="Saving..."
                                cursor="pointer"
                            >
                                Save Changes
                            </Button>
                        </HStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditProfileModal;