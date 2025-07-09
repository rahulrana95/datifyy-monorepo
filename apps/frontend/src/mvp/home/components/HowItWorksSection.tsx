// apps/frontend/src/mvp/home/components/HowItWorksSection.tsx
import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Grid,
    Center,
} from '@chakra-ui/react';

interface StepProps {
    number: number;
    title: string;
    description: string;
}

const Step: React.FC<StepProps> = ({ number, title, description }) => (
    <VStack spacing={6} textAlign="center">
        <Center
            w={16}
            h={16}
            bg="brand.500"
            color="white"
            borderRadius="full"
            fontSize="2xl"
            fontWeight="bold"
            className="interactive"
            boxShadow="brand"
        >
            {number}
        </Center>
        <VStack spacing={3}>
            <Heading size="md" color="gray.800">{title}</Heading>
            <Text color="gray.600" lineHeight="relaxed">
                {description}
            </Text>
        </VStack>
    </VStack>
);

const HowItWorksSection: React.FC = () => {
    const steps = [
        {
            number: 1,
            title: "Create Your Profile",
            description: "Add your photos and tell us about yourself. Be authentic and genuine to attract the right person."
        },
        {
            number: 2,
            title: "Discover Matches",
            description: "Browse through profiles and find people who share your interests, values, and relationship goals."
        },
        {
            number: 3,
            title: "Start Conversations",
            description: "When you both like each other, start meaningful conversations and plan your first date."
        }
    ];

    return (
        <Box bg="gray.50" py={{ base: 16, md: 20 }}>
            <Container maxW="7xl">
                <VStack spacing={12}>
                    <VStack spacing={4} textAlign="center">
                        <Heading size="xl" color="gray.800">
                            How It Works
                        </Heading>
                        <Text fontSize="lg" color="gray.600" maxW="600px" lineHeight="relaxed">
                            Finding love shouldn't be complicated. Here's how simple it is with Datifyy.
                        </Text>
                    </VStack>

                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} w="full">
                        {steps.map((step) => (
                            <Step key={step.number} {...step} />
                        ))}
                    </Grid>
                </VStack>
            </Container>
        </Box>
    );
};

export default HowItWorksSection;