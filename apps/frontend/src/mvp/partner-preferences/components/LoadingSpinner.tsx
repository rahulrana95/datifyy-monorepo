// apps/frontend/src/mvp/partner-preferences/components/LoadingSpinner.tsx
import React from 'react';
import {
    Box,
    VStack,
    Spinner,
    Text,
    Container,
} from '@chakra-ui/react';

const LoadingSpinner: React.FC = () => {
    return (
        <Container maxW="4xl" py={8}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minH="60vh"
            >
                <VStack spacing={4}>
                    <Spinner
                        thickness="4px"
                        speed="0.8s"
                        emptyColor="brand.100"
                        color="brand.500"
                        size="xl"
                    />
                    <VStack spacing={1}>
                        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                            Loading your preferences...
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            Setting up your perfect match criteria 💕
                        </Text>
                    </VStack>
                </VStack>
            </Box>
        </Container>
    );
};

export default LoadingSpinner;