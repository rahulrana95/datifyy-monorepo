import { Box, Heading, Text, Container } from "@chakra-ui/react";

const PrivacyPolicy = () => {
    return (
        <Container maxW="4xl" py={10}>
            <Heading fontSize="3xl" mb={4}>🔒 Privacy Policy</Heading>
            <Text fontSize="lg" mb={3}>
                Welcome to Datifyy! Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information.
            </Text>
            <Text fontSize="md" mb={3}>
                📌 **Information We Collect:** Your name, email, preferences, and interactions with the platform.
            </Text>
            <Text fontSize="md" mb={3}>
                🔐 **How We Protect Data:** We use encryption and secure servers to keep your data safe.
            </Text>
            <Text fontSize="md" mb={3}>
                ⚖ **Your Rights:** You can request data deletion or modification at any time.
            </Text>
            <Text fontSize="md">
                For any concerns, email us at <b>privacy@datifyy.com</b>.
            </Text>
        </Container>
    );
};

export default PrivacyPolicy;
