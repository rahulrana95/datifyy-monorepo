import { Box, Heading, Text, Container, Input, Textarea, Button, VStack } from "@chakra-ui/react";

const ContactUs = () => {
    return (
        <Container maxW="4xl" py={10}>
            <Heading fontSize="3xl" mb={4}>📞 Contact Us</Heading>
            <Text fontSize="lg" mb={6}>
                Have questions? We'd love to hear from you! Fill out the form below, or email us at <b>contact@datifyy.com</b>.
            </Text>

            <VStack spacing={4} align="stretch">
                <Input placeholder="Your Name" size="lg" />
                <Input placeholder="Your Email" size="lg" />
                <Textarea placeholder="Your Message" size="lg" rows={5} />
                <Button colorScheme="blue" size="lg">Send Message</Button>
            </VStack>
        </Container>
    );
};

export default ContactUs;
