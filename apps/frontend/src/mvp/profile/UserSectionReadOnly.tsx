import React from "react";
import { Box, Text, Icon, HStack, VStack, Divider, useTheme, SimpleGrid } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa"; // Edit icon
import { FormField, ProfileData } from "./UserProfile";


interface UserSectionReadonlyProps {
    title: string;
    description: string;
    fields: FormField[];
    onEdit: () => void;
    value: string;
    data: ProfileData;
}

const UserSectionReadonly: React.FC<UserSectionReadonlyProps> = ({
    title,
    description,
    fields,
    onEdit,
    value,
    data
}) => {
    const theme = useTheme();

    return (
        <Box
            bg={theme.colors.white}
            p={8}
            borderRadius={10}
            boxShadow="md"
            mb={6}
            w="full"
            fontSize={{ base: "sm", md: "md" }}
        >
            <HStack justify="space-between" mb={4} fontSize={{ base: "md", md: "md" }}>
                <VStack align="flex-start" spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold">{title}</Text>
                    <Text fontSize="sm" color="gray.500">{description}</Text>
                </VStack>
                <Icon
                    as={FaEdit}
                    boxSize={6}
                    color={theme.colors.blue[9]}
                    cursor="pointer"
                    size={6}
                    onClick={onEdit}
                />
            </HStack>

            <Divider mb={4} />

            <SimpleGrid columns={2} spacing={6}>
                {fields.map((field, index) => (
                    <Box
                        key={index}
                        p={4}
                        borderWidth={1}
                        borderColor="gray.200"
                        borderRadius={8}
                        display="flex"
                        alignItems="center"
                    >
                        <Icon as={field.icon} boxSize={5} color="gray.600" mr={4} />
                        <VStack align="flex-start" spacing={0} flex="1">
                            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                {field.label}
                            </Text>
                            <Text fontSize="md" color="gray.900">
                                {data[field.name] ?? "N/A"}
                            </Text>
                        </VStack>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default UserSectionReadonly;
