import { Box, Button, Container, Flex, Heading, Icon, Image, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { FaShieldAlt, FaCheckCircle, FaHeart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useTheme } from "@chakra-ui/react";

const LandingPage = () => {
    const theme = useTheme();
    const accentColor = theme.colors.pink[500]; // Using your custom pink theme

    return (
        <Box bg="gray.50" p={0} className="landing-page">
            {/* Banner Section */}
            <Box
                bg={accentColor}
                color="white"
                py={{ base: 16, md: 24 }}
                textAlign="center"
            >
                <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
                    Aadhar Verified Profiles
                </Heading>
                <Text fontSize={{ base: "lg", md: "xl" }} mt={2}>
                    Best Matching Interests · Offline & Online Dates
                </Text>
                <Button mt={6} colorScheme="pink" size="lg">
                    Get Started
                </Button>
            </Box>

            {/* Features Section */}
            <Container maxW="5xl" py={16}>
                <Flex direction={{ base: "column", md: "row" }} gap={8} justify="center">
                    {features.map((feature) => (
                        <VStack
                            key={feature.title}
                            p={6}
                            bg="white"
                            boxShadow="md"
                            rounded="lg"
                            textAlign="center"
                            spacing={4}
                            w={{ base: "100%", md: "30%" }}
                        >
                            <Icon as={feature.icon} w={12} h={12} color={accentColor} />
                            <Heading fontSize="xl" color={accentColor}>
                                {feature.title}
                            </Heading>
                            <Text color="gray.600">{feature.description}</Text>
                        </VStack>
                    ))}
                </Flex>
            </Container>

            {/* Footer Section */}
            <Box bg="black" color="gray.300" py={12}>
                <Container maxW="6xl">
                    <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="start">

                        {/* Left Section - Logo & Description */}
                        <VStack align="start" spacing={3}>
                            <Image src="/logo.png" alt="Datifyy Logo" w={40} />
                            <Text fontSize="sm">
                                Datifyy is a secure platform for meaningful connections.
                                Verified profiles & genuine matches.
                            </Text>
                        </VStack>

                        {/* Middle Section - Company Links */}
                        <Stack direction={{ base: "column", md: "row" }} spacing={8} mt={{ base: 6, md: 0 }}>
                            <VStack align="start">
                                <Heading fontSize="md" color="white">Company</Heading>
                                <Link href="/about" _hover={{ color: accentColor }}>About</Link>
                                <Link href="/careers" _hover={{ color: accentColor }}>Careers</Link>
                                <Link href="/help" _hover={{ color: accentColor }}>Help Center</Link>
                            </VStack>

                            <VStack align="start">
                                <Heading fontSize="md" color="white">Support</Heading>
                                <Link href="/contact" _hover={{ color: accentColor }}>Contact Us</Link>
                                <Link href="/privacy" _hover={{ color: accentColor }}>Privacy Policy</Link>
                                <Link href="/terms" _hover={{ color: accentColor }}>Terms & Conditions</Link>
                            </VStack>
                        </Stack>

                        {/* Right Section - Social Links */}
                        <VStack align="start" mt={{ base: 6, md: 0 }}>
                            <Heading fontSize="md" color="white">Follow Us</Heading>
                            <Stack direction="row" spacing={4}>
                                <Link href="https://facebook.com" isExternal>
                                    <Icon as={FaFacebook} w={6} h={6} _hover={{ color: accentColor }} />
                                </Link>
                                <Link href="https://twitter.com" isExternal>
                                    <Icon as={FaTwitter} w={6} h={6} _hover={{ color: accentColor }} />
                                </Link>
                                <Link href="https://instagram.com" isExternal>
                                    <Icon as={FaInstagram} w={6} h={6} _hover={{ color: accentColor }} />
                                </Link>
                                <Link href="https://linkedin.com" isExternal>
                                    <Icon as={FaLinkedin} w={6} h={6} _hover={{ color: accentColor }} />
                                </Link>
                            </Stack>
                        </VStack>
                    </Flex>

                    {/* Bottom Footer Text */}
                    <Text fontSize="sm" textAlign="center" mt={8}>
                        © {new Date().getFullYear()} Datifyy. All Rights Reserved.
                    </Text>
                </Container>
            </Box>
        </Box>
    );
};

const features = [
    {
        title: "Safety",
        icon: FaShieldAlt,
        description: "We ensure your privacy and security in every interaction."
    },
    {
        title: "Authentic",
        icon: FaCheckCircle,
        description: "All profiles are verified to create a safe dating environment."
    },
    {
        title: "Love",
        icon: FaHeart,
        description: "Helping you find meaningful connections with real people."
    }
];

export default LandingPage;
