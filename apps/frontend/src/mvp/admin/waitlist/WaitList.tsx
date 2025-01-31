import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Grid,
    Spinner,
    Stack,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    useToast,
    Center,
} from "@chakra-ui/react";
import waitService from "../../../service/waitListService";
import AdminHeader from "../AdminHeader";

function convertUnixToLocalTime(unixTimestamp: number): string {
    let date = new Date(unixTimestamp);
    if (date.getFullYear() < 1971) date = new Date(unixTimestamp * 1000);

    return date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
}

const WaitList = () => {
    interface WaitlistData {
        counts: { [key: string]: number };
        data: { id: string; name: string; email: string; status: string; createdAt: string }[];
        totalCount: number;
    }

    const [data, setData] = useState<WaitlistData>({ counts: {}, data: [], totalCount: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const toast = useToast();

    const handleDelete = useCallback((id: string) => {
        console.log("Deleting item with ID:", id);
        toast({
            title: "Deleted",
            description: `User with ID ${id} deleted successfully.`,
            status: "warning",
            duration: 2000,
            isClosable: true,
        });
    }, []);

    const handleSendMail = useCallback((email: string) => {
        console.log("Sending email to:", email);
        toast({
            title: "Mail Sent",
            description: `Mail sent to ${email}.`,
            status: "success",
            duration: 2000,
            isClosable: true,
        });
    }, []);

    const handleCheckboxChange = (id: string) => {
        setSelectedItems((prev) => {
            const newSelectedItems = new Set(prev);
            newSelectedItems.has(id) ? newSelectedItems.delete(id) : newSelectedItems.add(id);
            return newSelectedItems;
        });
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await waitService.getWaitlistData();
            if (response.error) throw new Error(response.error.message);

            setData({
                ...response.response,
                data: response.response.data.sort((a: { createdAt: string }, b: { createdAt: string }) => Number(b.createdAt) - Number(a.createdAt)),
            });
        } catch (error) {
            console.error("Error fetching waitlist data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 1000 * 60);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box p={6}>
            <Flex justify="center" align="center" h="50px">
                {loading && <Spinner size="xl" />}
            </Flex>
            <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={4} mb={6}>
                {Object.entries(data.counts).map(([key, value]) => (
                    <StatCard key={key} title={key} value={value} />
                ))}
            </Grid>


            <Box overflowX="auto">
                {data?.data?.length > 0 ? <Table variant="simple" size="sm">
                    <Thead bg="gray.200">
                        <Tr>
                            <Th>Select</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Date</Th>
                            <Th>Send Mail</Th>
                            <Th>Delete</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.data.map((entry) => (
                            <Tr key={entry.id}>
                                <Td>
                                    <Checkbox isChecked={selectedItems.has(entry.id)} onChange={() => handleCheckboxChange(entry.id)} />
                                </Td>
                                <Td>{entry.name}</Td>
                                <Td>{entry.email}</Td>
                                <Td>{convertUnixToLocalTime(Number(entry.createdAt))}</Td>
                                <Td>
                                    <Button size="sm" colorScheme="blue" onClick={() => handleSendMail(entry.email)}>
                                        Send Mail
                                    </Button>
                                </Td>
                                <Td>
                                    <Button size="sm" colorScheme="red" onClick={() => handleDelete(entry.id)}>
                                        Delete
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table> :
                    <Center py={10}>
                        <Text fontSize="lg" fontWeight="medium" color="gray.500">
                            🚀 No data to display
                        </Text>
                    </Center>
                }
            </Box>

        </Box>
    );
};

const StatCard: React.FC<{ title: string; value: number }> = ({ title, value }) => {
    return (
        <Box p={4} borderWidth={1} borderRadius="md" bg="white" boxShadow="sm">
            <Text fontSize="sm" fontWeight="bold" color="gray.500">
                {title}
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
                {value}
            </Text>
        </Box>
    );
};

export default WaitList;
