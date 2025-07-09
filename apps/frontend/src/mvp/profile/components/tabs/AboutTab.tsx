// apps/frontend/src/mvp/profile/components/tabs/AboutTab.tsx
import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Input,
    Textarea,
    Button,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    useToast,
    SimpleGrid,
    Badge,
} from '@chakra-ui/react';
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { FaUser, FaMapMarkerAlt, FaRuler, FaBriefcase } from 'react-icons/fa';
import { UserProfile } from '../../types/index';

interface AboutTabProps {
    profile: UserProfile;
    onUpdate: (data: Partial<UserProfile>) => void;
}

const AboutTab: React.FC<AboutTabProps> = ({ profile, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        bio: profile.bio || '',
        city: profile.city || '',
        height: profile.height || '',
        occupation: profile.occupation || '',
    });
    const toast = useToast();

    const handleSave = () => {
        onUpdate({
            bio: editData.bio,
            city: editData.city,
            height: Number(editData.height) || undefined,
            occupation: editData.occupation,
        });
        setIsEditing(false);

        toast({
            title: 'Profile updated! ✨',
            description: 'Your information has been saved',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleCancel = () => {
        setEditData({
            bio: profile.bio || '',
            city: profile.city || '',
            height: profile.height || '',
            occupation: profile.occupation || '',
        });
        setIsEditing(false);
    };

    const infoItems = [
        {
            icon: FaMapMarkerAlt,
            label: 'Location',
            value: profile.city || 'Not specified',
            key: 'city',
        },
        {
            icon: FaRuler,
            label: 'Height',
            value: profile.height ? `${profile.height} cm` : 'Not specified',
            key: 'height',
        },
        {
            icon: FaBriefcase,
            label: 'Occupation',
            value: profile.occupation || 'Not specified',
            key: 'occupation',
        },
    ];

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <HStack justify="space-between">
                <HStack>
                    <FaUser color="#e85d75" size="20px" />
                    <Text fontSize="xl" fontWeight="bold" color="gray.800">
                        About Me
                    </Text>
                </HStack>

                <Button
                    size="sm"
                    variant={isEditing ? "solid" : "outline"}
                    colorScheme="brand"
                    leftIcon={isEditing ? <CheckIcon /> : <EditIcon />}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    cursor="pointer"
                >
                    {isEditing ? 'Save' : 'Edit'}
                </Button>
            </HStack>

            {/* Bio Section */}
            <Box>
                <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700" mb={3}>
                        Bio
                    </FormLabel>
                    {isEditing ? (
                        <Textarea
                            value={editData.bio}
                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                            placeholder="Tell others about yourself..."
                            rows={4}
                            resize="vertical"
                            borderColor="gray.300"
                            _focus={{
                                borderColor: 'brand.500',
                                boxShadow: '0 0 0 1px rgba(232, 93, 117, 0.6)',
                            }}
                        />
                    ) : (
                        <Box
                            p={4}
                            bg="gray.50"
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="gray.200"
                            minH="100px"
                        >
                            {profile.bio ? (
                                <Text color="gray.700" lineHeight="1.6">
                                    {profile.bio}
                                </Text>
                            ) : (
                                <Text color="gray.500" fontStyle="italic">
                                    Add a bio to tell others about yourself
                                </Text>
                            )}
                        </Box>
                    )}
                </FormControl>
            </Box>

            {/* Info Grid */}
            <Box>
                <Text fontWeight="semibold" color="gray.700" mb={4}>
                    Basic Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {infoItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Box
                                key={item.key}
                                p={4}
                                bg="white"
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="lg"
                                _hover={{ borderColor: 'brand.200' }}
                                transition="border-color 0.2s"
                            >
                                <HStack spacing={3}>
                                    <Box
                                        p={2}
                                        bg="brand.50"
                                        borderRadius="lg"
                                        color="brand.500"
                                    >
                                        <Icon size="16px" />
                                    </Box>
                                    <VStack align="start" spacing={1} flex={1}>
                                        <Text fontSize="sm" color="gray.500" fontWeight="medium">
                                            {item.label}
                                        </Text>
                                        {isEditing && item.key !== 'age' ? (
                                            <Input
                                                size="sm"
                                                value={editData[item.key as keyof typeof editData]}
                                                onChange={(e) =>
                                                    setEditData({
                                                        ...editData,
                                                        [item.key]: e.target.value,
                                                    })
                                                }
                                                placeholder={`Enter ${item.label.toLowerCase()}`}
                                            />
                                        ) : (
                                            <Text fontWeight="semibold" color="gray.700">
                                                {item.value}
                                            </Text>
                                        )}
                                    </VStack>
                                </HStack>
                            </Box>
                        );
                    })}
                </SimpleGrid>
            </Box>

            {/* Age Display (Non-editable) */}
            <Box
                p={4}
                bg="brand.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="brand.200"
            >
                <HStack spacing={3}>
                    <Badge colorScheme="brand" fontSize="sm" px={3} py={1}>
                        AGE
                    </Badge>
                    <Text fontWeight="semibold" color="brand.700">
                        {profile.age ? `${profile.age} years old` : 'Age not specified'}
                    </Text>
                    <Text fontSize="sm" color="brand.600">
                        (Calculated from date of birth)
                    </Text>
                </HStack>
            </Box>

            {/* Cancel Button for Editing */}
            {isEditing && (
                <Button
                    variant="outline"
                    leftIcon={<CloseIcon />}
                    onClick={handleCancel}
                    w="full"
                    cursor="pointer"
                >
                    Cancel Changes
                </Button>
            )}

            {/* Tips */}
            <Box
                bg="blue.50"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="blue.200"
            >
                <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                        💡 Profile Tips
                    </Text>
                    <Text fontSize="xs" color="blue.600" lineHeight="1.5">
                        A complete profile gets 3x more matches! Add a bio that shows your personality
                        and interests. Be authentic and specific about what makes you unique.
                    </Text>
                </VStack>
            </Box>
        </VStack>
    );
};

export default AboutTab;