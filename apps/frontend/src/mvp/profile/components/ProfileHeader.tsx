// apps/frontend/src/mvp/profile/components/ProfileHeader.tsx
import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Avatar,
    Badge,
    IconButton,
    Button,
    Progress,
    useDisclosure,
    Tooltip,
} from '@chakra-ui/react';
import { EditIcon, ViewIcon, StarIcon } from '@chakra-ui/icons';
import { FaHeart, FaFire, FaMapMarkerAlt, FaRuler } from 'react-icons/fa';
import { UserProfile, ProfileStats } from '../types/index';
import EditProfileModal from './EditProfileModal';

interface ProfileHeaderProps {
    profile: UserProfile;
    stats: ProfileStats;
    onUpdate: (data: Partial<UserProfile>) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    profile,
    stats,
    onUpdate,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box
                bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)"
                borderRadius="2xl"
                p={6}
                boxShadow="0 4px 20px rgba(232, 93, 117, 0.1)"
                border="1px solid"
                borderColor="brand.100"
                position="relative"
                overflow="hidden"
            >
                {/* Background decoration */}
                <Box
                    position="absolute"
                    top="-50px"
                    right="-50px"
                    w="150px"
                    h="150px"
                    bg="brand.50"
                    borderRadius="full"
                    opacity={0.3}
                />

                <VStack spacing={6} position="relative" zIndex={1}>
                    {/* Main Profile Info */}
                    <HStack spacing={6} w="full" align="start">
                        {/* Avatar Section */}
                        <VStack spacing={3}>
                            <Box position="relative">
                                <Avatar
                                    size="2xl"
                                    name={profile.name}
                                    src={profile.images?.[0]}
                                    border="4px solid white"
                                    boxShadow="0 8px 32px rgba(0,0,0,0.1)"
                                />
                                {profile.isVerified && (
                                    <Badge
                                        position="absolute"
                                        bottom="2px"
                                        right="2px"
                                        bg="blue.500"
                                        color="white"
                                        borderRadius="full"
                                        p={1}
                                        fontSize="xs"
                                    >
                                        ✓
                                    </Badge>
                                )}
                            </Box>

                            <Button
                                size="sm"
                                variant="outline"
                                colorScheme="brand"
                                leftIcon={<EditIcon />}
                                onClick={onOpen}
                                borderRadius="full"
                                _hover={{
                                    bg: 'brand.50',
                                    transform: 'translateY(-1px)',
                                }}
                            >
                                Edit Profile
                            </Button>
                        </VStack>

                        {/* Profile Details */}
                        <VStack align="start" flex={1} spacing={3}>
                            <VStack align="start" spacing={1}>
                                <HStack>
                                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                        {profile.name}
                                    </Text>
                                    {profile.age && (
                                        <Text fontSize="2xl" color="gray.600">
                                            {profile.age}
                                        </Text>
                                    )}
                                </HStack>

                                <HStack spacing={4} color="gray.600">
                                    {profile.city && (
                                        <HStack spacing={1}>
                                            <FaMapMarkerAlt size="14px" />
                                            <Text fontSize="sm">{profile.city}</Text>
                                        </HStack>
                                    )}
                                    {profile.height && (
                                        <HStack spacing={1}>
                                            <FaRuler size="14px" />
                                            <Text fontSize="sm">{profile.height}cm</Text>
                                        </HStack>
                                    )}
                                    {profile.occupation && (
                                        <Text fontSize="sm">{profile.occupation}</Text>
                                    )}
                                </HStack>
                            </VStack>

                            {/* Bio */}
                            {profile.bio && (
                                <Text color="gray.700" lineHeight="1.6" maxW="400px">
                                    {profile.bio}
                                </Text>
                            )}

                            {/* Profile Completion */}
                            <Box w="full" maxW="300px">
                                <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                        Profile Completion
                                    </Text>
                                    <Text fontSize="sm" color="brand.500" fontWeight="bold">
                                        {stats.profileCompletion}%
                                    </Text>
                                </HStack>
                                <Progress
                                    value={stats.profileCompletion}
                                    size="sm"
                                    colorScheme="brand"
                                    borderRadius="full"
                                    bg="brand.50"
                                />
                            </Box>
                        </VStack>
                    </HStack>

                    {/* Stats Row */}
                    <HStack
                        spacing={8}
                        w="full"
                        justify="center"
                        bg="white"
                        p={4}
                        borderRadius="xl"
                        boxShadow="sm"
                    >
                        <Tooltip label="People who liked you" placement="top">
                            <VStack spacing={1} cursor="pointer" className="interactive">
                                <HStack spacing={2} color="swipe.like.500">
                                    <FaHeart />
                                    <Text fontSize="xl" fontWeight="bold">
                                        {stats.likes}
                                    </Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                    Likes
                                </Text>
                            </VStack>
                        </Tooltip>

                        <Tooltip label="Mutual matches" placement="top">
                            <VStack spacing={1} cursor="pointer" className="interactive">
                                <HStack spacing={2} color="brand.500">
                                    <FaFire />
                                    <Text fontSize="xl" fontWeight="bold">
                                        {stats.matches}
                                    </Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                    Matches
                                </Text>
                            </VStack>
                        </Tooltip>

                        <Tooltip label="Profile views" placement="top">
                            <VStack spacing={1} cursor="pointer" className="interactive">
                                <HStack spacing={2} color="connection.500">
                                    <ViewIcon />
                                    <Text fontSize="xl" fontWeight="bold">
                                        {stats.views}
                                    </Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                    Views
                                </Text>
                            </VStack>
                        </Tooltip>
                    </HStack>
                </VStack>
            </Box>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isOpen}
                onClose={onClose}
                profile={profile}
                onUpdate={onUpdate}
            />
        </>
    );
};

export default ProfileHeader;