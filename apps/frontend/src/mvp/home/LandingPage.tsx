import {
    Box, Button, Container, Flex, Heading, Icon, Image, Link, Stack, Text, VStack
} from "@chakra-ui/react";
import { FaShieldAlt, FaCheckCircle, FaHeart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useTheme } from "@chakra-ui/react";
import CandlaeLight from '../../assets/images/candle_light_view_couple.jpg';
import DatifyLogo from '../../assets/images/datifyy-logo-v2.png'
import { useAuthStore } from "../login-signup/authStore";

const LandingPage = () => {
    const theme = useTheme();
    const accentColor = theme.colors.pink[500]; // Using your custom pink theme
    const authStore = useAuthStore();

    const onStartJourney = () => {
        if (!authStore.isAuthenticated) {
            authStore.showHideLogin(true);
        }
    }

    return (
        <Box bg="gray.50" className="landing-page">
            {/* Hero Section */}
            <Box
                position="relative"
                w="100%"
                h={{ base: "80vh", md: "100vh" }}
                backgroundImage={`url(${CandlaeLight})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
            >
                {/* Dark Overlay for better text contrast */}
                <Box position="absolute" top={0} left={0} w="100%" h="100%" bg="blackAlpha.600" />

                {/* Text Overlay */}
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    textAlign="center"
                    color="white"
                    maxW="4xl"
                    px={4}
                >
                    <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold">
                        Aadhar Verified Profiles – Real People, Real Love
                    </Heading>
                    <Text fontSize={{ base: "lg", md: "xl" }} mt={3} fontWeight="medium">
                        Best Matching Interests · Offline & Online Dates
                    </Text>
                    <Text fontSize={{ base: "md", md: "lg" }} mt={4} fontWeight="light" maxW="3xl">
                        Find your perfect match, create unforgettable moments, and build your own love story.
                        With Datifyy, every connection is meaningful, every conversation brings you closer,
                        and every date could be the start of something beautiful.
                    </Text>
                    {!authStore.isAuthenticated && <Button mt={6} colorScheme="pink" size="lg" px={8} fontSize="xl" _hover={{ bg: accentColor }} onClick={onStartJourney}>
                        Start Your Journey
                    </Button>}
                </Flex>
            </Box>


            {/* Features Section */}
            <Container maxW="5xl" py={16}>
                <Flex direction={{ base: "column", md: "row" }} gap={8} justify="center">
                    {features.map((feature) => (
                        <VStack
                            key={feature.title}
                            p={6}
                            bg="white"
                            boxShadow="lg"
                            rounded="lg"
                            textAlign="center"
                            spacing={4}
                            w={{ base: "100%", md: "30%" }}
                            transition="0.3s"
                            _hover={{ transform: "scale(1.05)", boxShadow: "2xl" }}
                        >
                            <Icon as={feature.icon} w={14} h={14} color={accentColor} />
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
                            <Image src={DatifyLogo} alt="Datifyy Logo" w={40} />
                            <Text fontSize="sm">
                                Datifyy is a secure platform for meaningful connections.
                                Verified profiles & genuine matches.
                            </Text>
                        </VStack>

                        {/* Middle Section - Company Links */}
                        <Stack direction={{ base: "column", md: "row" }} spacing={8} mt={{ base: 6, md: 0 }}>
                            <VStack align="start">
                                <Heading fontSize="md" color="white">Company</Heading>
                                <Link href="/about-us" _hover={{ color: accentColor }}>About</Link>
                                {/* <Link href="/careers" _hover={{ color: accentColor }}>Careers</Link> */}
                                {/* <Link href="/help" _hover={{ color: accentColor }}>Help Center</Link> */}
                            </VStack>

                            <VStack align="start">
                                <Heading fontSize="md" color="white">Support</Heading>
                                <Link href="/contact-us" _hover={{ color: accentColor }}>Contact Us</Link>
                                <Link href="/privacy-policy" _hover={{ color: accentColor }}>Privacy Policy</Link>
                                <Link href="/tnc" _hover={{ color: accentColor }}>Terms & Conditions</Link>
                            </VStack>
                        </Stack>

                        {/* Right Section - Social Links */}
                        <VStack align="start" mt={{ base: 6, md: 0 }}>
                            <Heading fontSize="md" color="white">Follow Us</Heading>
                            <Stack direction="row" spacing={4}>
                                {/* <Link href="https://facebook.com" isExternal>
                                    <Icon as={FaFacebook} w={6} h={6} _hover={{ color: accentColor }} />
                                </Link> */}
                                <Link href="https://twitter.com" isExternal>
                                    <Icon as={FaTwitter} w={6} h={6} _hover={{ color: accentColor }} />
                                </Link>
                                <Link href="https://instagram.com" isExternal>
                                    <Icon as={FaInstagram} w={6} h={6} _hover={{ color: accentColor }} />
                                </Link>
                                <Link href="https://www.linkedin.com/company/datifyy/" isExternal>
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
