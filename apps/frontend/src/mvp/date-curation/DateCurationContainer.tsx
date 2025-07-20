// apps/frontend/src/mvp/date-curation/DateCurationContainer.tsx
import React from 'react';
import {
    Container,
    VStack,
    Heading,
    Text,
    Box,
    useBreakpointValue,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
    HStack,
    Icon,
} from '@chakra-ui/react';
import { FaSyncAlt } from 'react-icons/fa';
import { useAuthStore } from '../login-signup';
import StatusWrapper from '../common/StatusWrapper/StatusWrapper';
import UpcomingDatesSection from './components/UpcomingDatesSection';
import { useDateCuration } from './hooks/useDateCuration';

const DateCurationContainer: React.FC = () => {
    const { user, isAuthenticated } = useAuthStore();
    const {
        upcomingDates,
        isLoading,
        error,
        handleDateAction,
        refreshDates
    } = useDateCuration();

    // Responsive layout
    const containerPadding = useBreakpointValue({
        base: 4,
        md: 6,
        lg: 8
    });

    const headingSize = useBreakpointValue({
        base: "xl",
        md: "2xl",
        lg: "3xl"
    });

    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        return (
            <Container maxW="7xl" py={8} px={containerPadding}>
                <Alert
                    status="info"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    height="300px"
                    borderRadius="xl"
                >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                        Sign in to view your dates! 💕
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">
                        Access your personalized match and date management hub by signing in to your Datifyy account.
                    </AlertDescription>
                </Alert>
            </Container>
        );
    }

    return (
        <Container
            maxW="7xl"
            py={8}
            px={containerPadding}
            className="safe-top"
        >
            <VStack spacing={8} align="stretch">
                {/* Header Section */}
                <Box textAlign="center">
                    <Heading
                        size={headingSize}
                        color="brand.600"
                        mb={3}
                        fontWeight="bold"
                    >
                        Your Dates 💘
                    </Heading>
                    <Text
                        fontSize={{ base: "md", md: "lg" }}
                        color="gray.600"
                        maxW="600px"
                        mx="auto"
                        lineHeight="relaxed"
                    >
                        Manage your curated dates, view match details, and track your dating journey
                    </Text>

                    {/* Refresh Button */}
                    <HStack justify="center" mt={4}>
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Icon as={FaSyncAlt} />}
                            onClick={refreshDates}
                            isLoading={isLoading}
                            loadingText="Refreshing..."
                            color="gray.600"
                            _hover={{ color: 'brand.500', bg: 'brand.50' }}
                        >
                            Refresh
                        </Button>
                    </HStack>
                </Box>

                {/* Main Content Area */}
                <StatusWrapper
                    isLoading={isLoading}
                    error={error ?? ''}
                    minH="400px"
                >
                    <VStack spacing={6} align="stretch">
                        {/* Upcoming Dates Section */}
                        <UpcomingDatesSection
                            dates={upcomingDates}
                            onDateAction={handleDateAction}
                            isLoading={isLoading}
                        />

                        {/* Placeholder for date history - will be next component */}
                        <Box
                            bg="white"
                            borderRadius="xl"
                            p={6}
                            boxShadow="md"
                            border="1px solid"
                            borderColor="gray.200"
                        >
                            <Text color="gray.500" textAlign="center" py={8}>
                                Date history section will be added next...
                            </Text>
                        </Box>
                    </VStack>
                </StatusWrapper>
            </VStack>
        </Container>
    );
};

export default DateCurationContainer;