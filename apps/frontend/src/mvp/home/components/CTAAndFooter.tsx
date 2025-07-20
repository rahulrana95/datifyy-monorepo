// apps/frontend/src/mvp/home/components/CTAAndFooter.tsx
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
    Flex,
} from '@chakra-ui/react';

const CTASection: React.FC = () => (
    <Box bg="brand.500" py={{ base: 16, md: 20 }}>
        <Container maxW="7xl">
            <VStack spacing={8} textAlign="center" color="white">
                <VStack spacing={4}>
                    <Heading size="xl">
                        Ready to Find Your Perfect Match?
                    </Heading>
                    <Text fontSize="lg" opacity={0.9} maxW="600px" lineHeight="relaxed">
                        Join thousands of singles who are serious about finding love. Start your journey today and discover meaningful connections.
                    </Text>
                </VStack>

                <VStack spacing={4} w="full" maxW="400px">
                    <Button
                        variant="solid"
                        colorScheme="white"
                        color="brand.500"
                        size="xl"
                        w="full"
                        py={6}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                        }}
                        className="heart-beat"
                    >
                        Create Free Account
                    </Button>

                    <Text fontSize="sm" opacity={0.8}>
                        Free to join • No hidden fees • Cancel anytime
                    </Text>
                </VStack>
            </VStack>
        </Container>
    </Box>
);

const Footer: React.FC = () => (
    <Box bg="gray.900" py={{ base: 12, md: 16 }} color="white">
        <Container maxW="7xl">
            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={8}>
                <VStack align="flex-start" spacing={4}>
                    <HStack spacing={2}>
                        <Text fontSize="2xl">💕</Text>
                        <Heading size="md" color="white">datifyy</Heading>
                    </HStack>
                    <Text fontSize="sm" color="gray.400" maxW="250px" lineHeight="relaxed">
                        Helping people find meaningful connections and lasting relationships through genuine dating.
                    </Text>
                </VStack>

                <VStack align="flex-start" spacing={3}>
                    <Heading size="sm" color="white">Company</Heading>
                    <VStack align="flex-start" spacing={2} fontSize="sm" color="gray.400">
                        <Text cursor="pointer" _hover={{ color: 'white' }}>About Us</Text>
                        <Text cursor="pointer" _hover={{ color: 'white' }}>Careers</Text>
                        <Text cursor="pointer" _hover={{ color: 'white' }}>Press</Text>
                        <Text cursor="pointer" _hover={{ color: 'white' }}>Blog</Text>
                    </VStack>
                </VStack>

                <VStack align="flex-start" spacing={3}>
                    <Heading size="sm" color="white">Support</Heading>
                    <VStack align="flex-start" spacing={2} fontSize="sm" color="gray.400">
                        <Text cursor="pointer" _hover={{ color: 'white' }}>Help Center</Text>
                        <Text cursor="pointer" _hover={{ color: 'white' }}>Safety</Text>
                        <Text cursor="pointer" _hover={{ color: 'white' }}>Contact Us</Text>
                        <Text cursor="pointer" _hover={{ color: 'white' }}>Community</Text>
                    </VStack>
                </VStack>

                <VStack align="flex-start" spacing={3}>
                    <Heading size="sm" color="white">Legal</Heading>
                    <VStack align="flex-start" spacing={2} fontSize="sm" color="gray.400">
                        <Text cursor="pointer" _hover={{ color: 'white' }}>Privacy Policy</Text>
                        <Text cursor="pointer" _hover={{ color: 'white' }}>Terms of Service</Text>
                        <Text cursor="pointer" _hover={{ color: 'white' }}>Cookie Policy</Text>
                        <Text cursor="pointer" _hover={{ color: 'white' }}>GDPR</Text>
                    </VStack>
                </VStack>
            </Grid>

            <Box borderTop="1px" borderColor="gray.700" mt={12} pt={8}>
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    align="center"
                    gap={4}
                >
                    <Text fontSize="sm" color="gray.400">
                        © 2024 Datifyy. All rights reserved.
                    </Text>
                    <HStack spacing={6} fontSize="sm" color="gray.400">
                        <Text cursor="pointer" _hover={{ color: 'white' }}>English</Text>
                        <Text cursor="pointer" _hover={{ color: 'white' }}>Follow us</Text>
                    </HStack>
                </Flex>
            </Box>
        </Container>
    </Box>
);

const CTAAndFooter: React.FC = () => (
    <>
        <CTASection />
        <Footer />
    </>
);

export default CTAAndFooter;