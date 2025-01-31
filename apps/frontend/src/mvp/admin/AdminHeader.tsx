import { Box, Heading, Text, Flex } from "@chakra-ui/react";

interface AdminHeaderProps {
    title: string;
    description: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, description }) => {
    return (
        <Box w="full" py={4} px={6} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
            <Flex direction="column" gap={2}>
                <Heading size={{ base: "md", md: "lg" }} color="gray.700">
                    {title}
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
                    {description}
                </Text>
            </Flex>
        </Box>
    );
};

export default AdminHeader;
