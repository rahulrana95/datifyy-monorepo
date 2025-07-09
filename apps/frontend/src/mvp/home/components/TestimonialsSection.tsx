// apps/frontend/src/mvp/home/components/TestimonialsSection.tsx
import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    SimpleGrid,
    Card,
    CardBody,
} from '@chakra-ui/react';

interface TestimonialProps {
    quote: string;
    name: string;
    subtitle: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, name, subtitle }) => (
    <Card variant="elevated" className="interactive">
        <CardBody>
            <VStack spacing={4} align="flex-start">
                <HStack>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Text key={star} fontSize="lg" color="yellow.400">⭐</Text>
                    ))}
                </HStack>
                <Text color="gray.700" fontStyle="italic" lineHeight="relaxed">
                    "{quote}"
                </Text>
                <VStack spacing={1} align="flex-start">
                    <Text fontWeight="bold" color="gray.800">{name}</Text>
                    <Text fontSize="sm" color="gray.600">{subtitle}</Text>
                </VStack>
            </VStack>
        </CardBody>
    </Card>
);

const TestimonialsSection: React.FC = () => {
    const testimonials = [
        {
            quote: "I found my soulmate on Datifyy after just 2 months. The quality of matches was incredible and everyone was genuinely looking for something real!",
            name: "Emma & James",
            subtitle: "Married after 1 year"
        },
        {
            quote: "Finally, a dating platform that focuses on real relationships. Met my boyfriend here and we've been together for 8 amazing months!",
            name: "Sarah",
            subtitle: "In a relationship for 8 months"
        },
        {
            quote: "The verification process made me feel safe and secure. Great community of serious daters who are actually looking for love.",
            name: "Michael",
            subtitle: "Found love in 3 months"
        }
    ];

    return (
        <Box py={{ base: 16, md: 20 }} bg="white">
            <Container maxW="7xl">
                <VStack spacing={12}>
                    <VStack spacing={4} textAlign="center">
                        <Heading size="xl" color="gray.800">
                            Success Stories
                        </Heading>
                        <Text fontSize="lg" color="gray.600" maxW="600px" lineHeight="relaxed">
                            Real couples who found love on Datifyy and built meaningful relationships.
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
                        {testimonials.map((testimonial, index) => (
                            <Testimonial key={index} {...testimonial} />
                        ))}
                    </SimpleGrid>
                </VStack>
            </Container>
        </Box>
    );
};

export default TestimonialsSection;