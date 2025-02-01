import { Box, Spinner, Text, Icon, VStack, Button } from "@chakra-ui/react";
import { FaExclamationTriangle, FaTimesCircle, FaLock } from "react-icons/fa";

interface StatusWrapperProps {
    isLoading?: boolean;
    error?: string;
    accessDenied?: boolean;
    dataUnavailable?: boolean;
    minH?: string;
    children?: React.ReactNode;
    onRetry?: () => void;
    p?: number;
    h?: string;
    display?: string;
    justifyContent?: string;
    alignItems?: string;
}

const StatusWrapper: React.FC<StatusWrapperProps> = ({
    isLoading,
    error,
    accessDenied,
    dataUnavailable,
    minH = "300px",
    children,
    onRetry,
    p = 6,
    h = "auto",
    display = "",
    justifyContent = "",
    alignItems = "",
}) => {
    let content;

    switch (true) {
        case isLoading:
            content = <Spinner size="xl" color="blue.500" />;
            break;

        case Boolean(error):
            content = (
                <VStack spacing={3} textAlign="center">
                    <Icon as={FaTimesCircle} color="red.500" boxSize={10} />
                    <Text fontSize="lg" fontWeight="semibold" color="red.500">
                        {error}
                    </Text>
                    {onRetry && (
                        <Button colorScheme="red" onClick={onRetry}>
                            Retry
                        </Button>
                    )}
                </VStack>
            );
            break;

        case accessDenied:
            content = (
                <VStack spacing={4} textAlign="center">
                    <Icon as={FaLock} color="orange.500" boxSize={12} />
                    <Text fontSize="xl" fontWeight="bold" color="orange.600">
                        Access Denied
                    </Text>
                    <Text fontSize="md" color="gray.600">
                        You don’t have permission to view this content.
                    </Text>
                    <Button colorScheme="orange" variant="solid" size="sm">
                        Request Access
                    </Button>
                </VStack>
            );
            break;

        case dataUnavailable:
            content = (
                <VStack spacing={3} textAlign="center">
                    <Icon as={FaExclamationTriangle} color="yellow.500" boxSize={10} />
                    <Text fontSize="lg" fontWeight="semibold" color="yellow.600">
                        Data Not Available
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        Please check back later.
                    </Text>
                </VStack>
            );
            break;

        default:
            content = children;
    }

    return (
        <Box
            minH={minH}
            w="100%"
            p={p}
            bg="gray.50"
            borderRadius="lg"
            boxShadow="md"
            className="status-wrapper"
            display={display}
            justifyContent={justifyContent}
            alignItems={alignItems}
            h={h}
        >
            {content}
        </Box>
    );
};

export default StatusWrapper;
