// apps/frontend/src/mvp/profile/components/tabs/PhotosTab.tsx
import React, { useState } from 'react';
import {
    Box,
    VStack,
    SimpleGrid,
    Image,
    IconButton,
    Button,
    Text,
    Input,
    HStack,
    useToast,
    AspectRatio,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, StarIcon } from '@chakra-ui/icons';
import { FaCamera, FaUpload } from 'react-icons/fa';

interface PhotosTabProps {
    photos: string[];
    onUpdate: (photos: string[]) => void;
}

const PhotosTab: React.FC<PhotosTabProps> = ({ photos, onUpdate }) => {
    const [newPhotoUrl, setNewPhotoUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const toast = useToast();

    const handleAddPhoto = () => {
        if (!newPhotoUrl.trim()) return;

        if (photos.length >= 6) {
            toast({
                title: 'Photo limit reached',
                description: 'You can only have up to 6 photos',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const updatedPhotos = [...photos, newPhotoUrl.trim()];
        onUpdate(updatedPhotos);
        setNewPhotoUrl('');
        setIsAdding(false);

        toast({
            title: 'Photo added! 📸',
            description: 'Your new photo has been added',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleRemovePhoto = (index: number) => {
        const updatedPhotos = photos.filter((_, i) => i !== index);
        onUpdate(updatedPhotos);

        toast({
            title: 'Photo removed',
            description: 'Photo has been deleted from your profile',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleSetMainPhoto = (index: number) => {
        const updatedPhotos = [...photos];
        const [mainPhoto] = updatedPhotos.splice(index, 1);
        updatedPhotos.unshift(mainPhoto);
        onUpdate(updatedPhotos);

        toast({
            title: 'Main photo updated! ⭐',
            description: 'This is now your main profile photo',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <VStack spacing={6} align="stretch">
            {/* Header */}
            <VStack spacing={2} align="start">
                <HStack>
                    <FaCamera color="#e85d75" size="20px" />
                    <Text fontSize="xl" fontWeight="bold" color="gray.800">
                        Your Photos
                    </Text>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                    Add up to 6 photos to show your personality. Your first photo will be your main profile picture.
                </Text>
            </VStack>

            {/* Photos Grid */}
            {photos.length > 0 ? (
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                    {photos.map((photo, index) => (
                        <Box key={index} position="relative" className="interactive">
                            <AspectRatio ratio={4 / 5}>
                                <Box
                                    borderRadius="xl"
                                    overflow="hidden"
                                    border="2px solid"
                                    borderColor={index === 0 ? 'brand.300' : 'gray.200'}
                                    position="relative"
                                >
                                    <Image
                                        src={photo}
                                        alt={`Profile photo ${index + 1}`}
                                        objectFit="cover"
                                        w="full"
                                        h="full"
                                        fallback={
                                            <Box
                                                w="full"
                                                h="full"
                                                bg="gray.100"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <FaCamera color="#9CA3AF" size="24px" />
                                            </Box>
                                        }
                                    />

                                    {/* Main photo indicator */}
                                    {index === 0 && (
                                        <Box
                                            position="absolute"
                                            top={2}
                                            left={2}
                                            bg="brand.500"
                                            color="white"
                                            px={2}
                                            py={1}
                                            borderRadius="md"
                                            fontSize="xs"
                                            fontWeight="bold"
                                        >
                                            MAIN
                                        </Box>
                                    )}

                                    {/* Action buttons */}
                                    <Box
                                        position="absolute"
                                        top={2}
                                        right={2}
                                        opacity={0}
                                        transition="opacity 0.2s"
                                        _groupHover={{ opacity: 1 }}
                                    >
                                        <VStack spacing={1}>
                                            {index !== 0 && (
                                                <IconButton
                                                    aria-label="Set as main photo"
                                                    icon={<StarIcon />}
                                                    size="sm"
                                                    colorScheme="yellow"
                                                    borderRadius="full"
                                                    onClick={() => handleSetMainPhoto(index)}
                                                    cursor="pointer"
                                                />
                                            )}
                                            <IconButton
                                                aria-label="Remove photo"
                                                icon={<DeleteIcon />}
                                                size="sm"
                                                colorScheme="red"
                                                borderRadius="full"
                                                onClick={() => handleRemovePhoto(index)}
                                                cursor="pointer"
                                            />
                                        </VStack>
                                    </Box>
                                </Box>
                            </AspectRatio>
                        </Box>
                    ))}
                </SimpleGrid>
            ) : (
                <Box
                    border="2px dashed"
                    borderColor="gray.300"
                    borderRadius="xl"
                    p={12}
                    textAlign="center"
                    bg="gray.50"
                >
                    <VStack spacing={4}>
                        <FaCamera size="48px" color="#9CA3AF" />
                        <VStack spacing={2}>
                            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                                No photos yet
                            </Text>
                            <Text color="gray.500">
                                Add your first photo to get started
                            </Text>
                        </VStack>
                    </VStack>
                </Box>
            )}

            {/* Add Photo Section */}
            {photos.length < 6 && (
                <Box>
                    {!isAdding ? (
                        <Button
                            leftIcon={<AddIcon />}
                            colorScheme="brand"
                            variant="outline"
                            size="lg"
                            w="full"
                            onClick={() => setIsAdding(true)}
                            cursor="pointer"
                        >
                            Add Photo
                        </Button>
                    ) : (
                        <VStack spacing={3}>
                            <Input
                                placeholder="Enter photo URL"
                                value={newPhotoUrl}
                                onChange={(e) => setNewPhotoUrl(e.target.value)}
                                size="lg"
                            />
                            <HStack w="full">
                                <Button
                                    variant="outline"
                                    flex={1}
                                    onClick={() => {
                                        setIsAdding(false);
                                        setNewPhotoUrl('');
                                    }}
                                    cursor="pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    colorScheme="brand"
                                    flex={1}
                                    onClick={handleAddPhoto}
                                    isDisabled={!newPhotoUrl.trim()}
                                    cursor="pointer"
                                >
                                    Add Photo
                                </Button>
                            </HStack>
                        </VStack>
                    )}
                </Box>
            )}

            {/* Upload tip */}
            <Box
                bg="brand.50"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="brand.200"
            >
                <HStack spacing={3}>
                    <FaUpload color="#e85d75" />
                    <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="semibold" color="brand.700">
                            Photo Tips
                        </Text>
                        <Text fontSize="xs" color="brand.600">
                            Use clear, recent photos that show your face. Avoid group photos or heavily filtered images.
                        </Text>
                    </VStack>
                </HStack>
            </Box>
        </VStack>
    );
};

export default PhotosTab;