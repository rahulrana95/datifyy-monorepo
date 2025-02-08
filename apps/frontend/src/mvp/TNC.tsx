import { Box, Heading, Text, Container } from "@chakra-ui/react";

const TermsAndConditions = () => {
    return (
        <Container maxW="4xl" py={10}>
            <Heading fontSize="3xl" mb={4}>📜 Terms & Conditions</Heading>
            <Text fontSize="lg" mb={3}>
                By using Datifyy, you agree to our terms of service. Please read them carefully.
            </Text>
            <Text fontSize="md" mb={3}>
                ✅ **Eligibility:** You must be 18+ to use our platform.
            </Text>
            <Text fontSize="md" mb={3}>
                🚫 **Prohibited Activities:** No harassment, fake profiles, or illegal activities.
            </Text>
            <Text fontSize="md" mb={3}>
                🔄 **Changes to Terms:** We may update our terms, and continued use means acceptance.
            </Text>
            <Text fontSize="md">
                For questions, contact us at <b>admin@datifyy.com</b>.
            </Text>
        </Container>
    );
};

export default TermsAndConditions;
