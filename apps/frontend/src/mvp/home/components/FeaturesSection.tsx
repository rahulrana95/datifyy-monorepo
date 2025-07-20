// apps/frontend/src/mvp/home/components/FeaturesSection.tsx
import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    SimpleGrid,
    Card,
    CardBody,
} from '@chakra-ui/react';

interface FeatureProps {
    icon: string;
    title: string;
    description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
    <Card variant="subtle" textAlign="center" h="full" className="interactive">
        <CardBody>
            <VStack spacing={4}>
                <Box p={4} bg="brand.50" borderRadius="full" w="fit-content">
                    <Text fontSize="3xl">{icon}</Text>
                </Box>
                <VStack spacing={2}>
                    <Heading size="md" color="gray.800">{title}</Heading>
                    <Text fontSize="sm" color="gray.600" lineHeight="relaxed">
                        {description}
                    </Text>
                </VStack>
            </VStack>
        </CardBody>
    </Card>
);

const FeaturesSection: React.FC = () => {
    const features = [
        {
            icon: "💕",
            title: "Serious Dating",
            description: "Connect with people who want real relationships and meaningful connections"
        },
        {
            icon: "🛡️",
            title: "Safe & Secure",
            description: "Verified profiles, secure messaging, and comprehensive safety features"
        },
        {
            icon: "🧠",
            title: "Smart Matching",
            description: "AI-powered algorithm finds your perfect match based on compatibility"
        },
        {
            icon: "✨",
            title: "Premium Experience",
            description: "Ad-free browsing, unlimited likes, and exclusive premium features"
        }
    ];

    return (
        <Box py={{ base: 16, md: 20 }} bg="white">
            <Container maxW="7xl">
                <VStack spacing={12}>
                    <VStack spacing={4} textAlign="center">
                        <Heading size="xl" color="gray.800">
                            Why Choose Datifyy?
                        </Heading>
                        <Text fontSize="lg" color="gray.600" maxW="600px" lineHeight="relaxed">
                            We're different because we focus on creating genuine connections, not just matches.
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
                        {features.map((feature, index) => (
                            <Feature key={index} {...feature} />
                        ))}
                    </SimpleGrid>
                </VStack>
            </Container>
        </Box>
    );
};

export default FeaturesSection;