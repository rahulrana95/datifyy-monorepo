import { Box, Button, Container, Flex, Heading, Icon, Stack, Text, VStack } from "@chakra-ui/react";
import { FaShieldAlt, FaCheckCircle, FaHeart, FaUsers, FaHandshake, FaRocket } from "react-icons/fa";
import { useTheme } from "@chakra-ui/react";
import { useAuthStore } from "./login-signup/authStore";

const AboutUs = () => {
    const theme = useTheme();
    const accentColor = theme.colors.pink[500];
    const authStore = useAuthStore();

    return (
        <Box bg="gray.50" py={16}>
            <Container maxW="5xl" textAlign="center">
                {/* Header */}
                <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold" color={accentColor}>
                    About Datifyy ❤️
                </Heading>
                <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" mt={4}>
                    Connecting real people with verified identities. Your journey to love starts here! ✨
                </Text>
            </Container>

            {/* Mission & Values Section */}
            <Container maxW="6xl" mt={12}>
                <Flex direction={{ base: "column", md: "row" }} gap={8} justify="center">
                    {coreValues.map((value) => (
                        <VStack
                            key={value.title}
                            p={6}
                            bg="white"
                            boxShadow="lg"
                            rounded="lg"
                            textAlign="center"
                            spacing={4}
                            w={{ base: "100%", md: "30%" }}
                        >
                            <Icon as={value.icon} w={12} h={12} color={accentColor} />
                            <Heading fontSize="xl" color={accentColor}>
                                {value.title} {value.emoji}
                            </Heading>
                            <Text color="gray.600">{value.description}</Text>
                        </VStack>
                    ))}
                </Flex>
            </Container>

            {/* CTA Section */}
            <Box textAlign="center" mt={16}>
                <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold" color={accentColor}>
                    Find Your Love Story Today! 💕
                </Heading>
                <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" mt={4}>
                    Join Datifyy and start meaningful connections with real people.
                </Text>
                {!authStore.isAuthenticated && <Button mt={6} colorScheme="pink" size="lg" px={8} fontSize="xl" onClick={() => authStore.showHideLogin(true)}>
                    Join Now 🚀
                </Button>}
            </Box>
        </Box>
    );
};

const coreValues = [
    {
        title: "Trust & Safety",
        icon: FaShieldAlt,
        emoji: "🛡️",
        description: "We prioritize your security with verified profiles and safe interactions."
    },
    {
        title: "Authenticity",
        icon: FaCheckCircle,
        emoji: "✅",
        description: "All users are verified, ensuring genuine connections and real people."
    },
    {
        title: "Meaningful Connections",
        icon: FaHeart,
        emoji: "💖",
        description: "Find partners who share your interests and values for lasting relationships."
    },
    {
        title: "Community & Support",
        icon: FaUsers,
        emoji: "🌍",
        description: "Join a community of like-minded individuals looking for love and friendship."
    },
    {
        title: "Commitment to You",
        icon: FaHandshake,
        emoji: "🤝",
        description: "We’re dedicated to helping you build meaningful relationships."
    },
    {
        title: "Innovation & Growth",
        icon: FaRocket,
        emoji: "🚀",
        description: "We constantly evolve to offer the best dating experience."
    }
];

export default AboutUs;
