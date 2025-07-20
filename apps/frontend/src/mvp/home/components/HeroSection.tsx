// apps/frontend/src/mvp/home/components/HeroSection.tsx
import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Grid,
    Badge,
    useBreakpointValue,
    Stack,
} from '@chakra-ui/react';

const HeroSection: React.FC = () => {
    const heroSize = useBreakpointValue({ base: 'xl', md: '2xl', lg: '3xl' });
    const subtitleSize = useBreakpointValue({ base: 'md', md: 'lg' });

    return (
        <Box
            minH="100vh"
            bg="linear-gradient(135deg, #fef7f7 0%, #fce8e8 50%, #f8d5d5 100%)"
            position="relative"
            overflow="hidden"
        >
            {/* Background decorative elements */}
            <Box
                position="absolute"
                top="-10%"
                right="-10%"
                w="300px"
                h="300px"
                bg="brand.200"
                borderRadius="full"
                opacity={0.3}
                filter="blur(100px)"
            />
            <Box
                position="absolute"
                bottom="-10%"
                left="-10%"
                w="400px"
                h="400px"
                bg="brand.300"
                borderRadius="full"
                opacity={0.2}
                filter="blur(120px)"
            />

            <Container maxW="7xl" py={{ base: 16, md: 24 }}>
                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
                    {/* Left side - Content */}
                    <VStack spacing={8} align={{ base: 'center', lg: 'flex-start' }} textAlign={{ base: 'center', lg: 'left' }}>
                        <VStack spacing={6} align={{ base: 'center', lg: 'flex-start' }}>
                            <Badge variant="love" className="bounce-in" size="lg">
                                Let's be serious about love 💕
                            </Badge>

                            <Heading
                                size={heroSize}
                                variant="love"
                                lineHeight="shorter"
                                maxW="600px"
                            >
                                Find Your Perfect Match Today
                            </Heading>

                            <Text
                                fontSize={subtitleSize}
                                color="gray.700"
                                maxW="500px"
                                lineHeight="relaxed"
                                fontWeight="medium"
                            >
                                Join millions of singles who are serious about finding meaningful connections and lasting relationships through genuine dating.
                            </Text>
                        </VStack>

                        <VStack spacing={4} w="full" maxW="400px">
                            <Button
                                variant="love"
                                size="xl"
                                w="full"
                                className="heart-beat"
                                rightIcon={<Text fontSize="xl">→</Text>}
                                py={6}
                            >
                                Start Your Love Story
                            </Button>

                            <Text fontSize="sm" color="gray.600">
                                Free to join • No hidden fees • Safe & Secure
                            </Text>
                        </VStack>

                        {/* Stats */}
                        <Stack direction={{ base: 'column', sm: 'row' }} spacing={8} pt={4} w="full" justify={{ base: 'center', lg: 'flex-start' }}>
                            <VStack spacing={1}>
                                <Text fontWeight="bold" fontSize="3xl" color="brand.500">2M+</Text>
                                <Text fontSize="sm" color="gray.600" textAlign="center">Active Users</Text>
                            </VStack>
                            <VStack spacing={1}>
                                <Text fontWeight="bold" fontSize="3xl" color="brand.500">500K+</Text>
                                <Text fontSize="sm" color="gray.600" textAlign="center">Matches Made</Text>
                            </VStack>
                            <VStack spacing={1}>
                                <Text fontWeight="bold" fontSize="3xl" color="brand.500">95%</Text>
                                <Text fontSize="sm" color="gray.600" textAlign="center">Success Rate</Text>
                            </VStack>
                        </Stack>
                    </VStack>

                    {/* Right side - Visual Elements */}
                    <Box position="relative" display={{ base: 'none', lg: 'block' }}>
                        <VStack spacing={6} className="float">
                            {/* Profile Card 1 */}
                            <Box
                                bg="white"
                                borderRadius="2xl"
                                p={6}
                                boxShadow="brand"
                                transform="rotate(-5deg)"
                                maxW="280px"
                                className="interactive"
                            >
                                <VStack spacing={4} align="flex-start">
                                    <HStack justify="space-between" w="full">
                                        <VStack align="flex-start" spacing={1}>
                                            <Text fontWeight="bold" fontSize="lg" color="gray.800">Sarah, 25</Text>
                                            <Text fontSize="sm" color="gray.600">Marketing Manager</Text>
                                        </VStack>
                                        <Badge variant="verified" size="sm">✓</Badge>
                                    </HStack>

                                    <Box w="full" h="150px" bg="brand.100" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                                        <Text fontSize="4xl">📸</Text>
                                    </Box>

                                    <Text fontSize="sm" color="gray.700" lineHeight="relaxed">
                                        "Love hiking, coffee, and deep conversations. Looking for someone genuine! ✨"
                                    </Text>

                                    <HStack spacing={2}>
                                        <Badge variant="interest" size="sm">Photography</Badge>
                                        <Badge variant="interest" size="sm">Travel</Badge>
                                    </HStack>

                                    <Text fontSize="xs" color="gray.500">📍 2km away</Text>
                                </VStack>
                            </Box>

                            {/* Profile Card 2 */}
                            <Box
                                bg="white"
                                borderRadius="2xl"
                                p={6}
                                boxShadow="brandLg"
                                transform="rotate(8deg) translateX(-20px)"
                                maxW="280px"
                                className="interactive"
                                mt="-40px"
                            >
                                <VStack spacing={4} align="flex-start">
                                    <HStack justify="space-between" w="full">
                                        <VStack align="flex-start" spacing={1}>
                                            <Text fontWeight="bold" fontSize="lg" color="gray.800">Alex, 28</Text>
                                            <Text fontSize="sm" color="gray.600">Software Engineer</Text>
                                        </VStack>
                                        <Badge variant="premium" size="sm">👑</Badge>
                                    </HStack>

                                    <Box w="full" h="150px" bg="blue.100" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                                        <Text fontSize="4xl">🎸</Text>
                                    </Box>

                                    <Text fontSize="sm" color="gray.700" lineHeight="relaxed">
                                        "Musician by night, coder by day. Let's create something beautiful together! 🎵"
                                    </Text>

                                    <HStack spacing={2}>
                                        <Badge variant="interest" size="sm">Music</Badge>
                                        <Badge variant="interest" size="sm">Tech</Badge>
                                    </HStack>

                                    <Text fontSize="xs" color="gray.500">📍 5km away</Text>
                                </VStack>
                            </Box>

                            {/* Floating hearts */}
                            <Box position="absolute" top="10%" right="10%" className="love-pulse">
                                <Text fontSize="3xl">💕</Text>
                            </Box>
                            <Box position="absolute" bottom="20%" left="10%" className="heart-beat">
                                <Text fontSize="2xl">❤️</Text>
                            </Box>
                            <Box position="absolute" top="60%" right="20%" className="bounce-in">
                                <Text fontSize="xl">✨</Text>
                            </Box>
                        </VStack>
                    </Box>
                </Grid>
            </Container>
        </Box>
    );
};

export default HeroSection;