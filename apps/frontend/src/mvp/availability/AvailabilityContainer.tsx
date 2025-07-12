// apps/frontend/src/mvp/availability/AvailabilityContainer.tsx
/**
 * Availability Container Component
 * 
 * Main container for the availability management feature.
 * Handles routing between different views and coordinates state.
 */

import React, { useEffect } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    Heading,
    Button,
    Text,
    useBreakpointValue,
    useToast,
    Alert,
    AlertIcon,
    AlertDescription,
    Spinner,
    Center
} from '@chakra-ui/react';
import { FaCalendarPlus, FaCalendarAlt, FaHistory, FaClock } from 'react-icons/fa';
import { useAvailabilityStore } from './store/availabilityStore';
import AvailabilityTabs from './components/AvailabilityTabs';
import AvailabilityCreateForm from './components/AvailabilityCreateForm';
import AvailabilityUpcomingList from './components/AvailabilityUpcomingList';
import AvailabilityPastList from './components/AvailabilityPastList';
import AvailabilityHeader from './components/AvailabilityHeader';
import AvailabilityStats from './components/AvailabilityStats';

const AvailabilityContainer: React.FC = () => {
    const toast = useToast();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const {
        currentView,
        isLoading,
        error,
        upcomingSlots,
        pastSlots,
        getSelectedSlotsCount,
        loadAvailability,
        setCurrentView,
        clearError,
        startCreating
    } = useAvailabilityStore();

    // Load data on mount
    useEffect(() => {
        loadAvailability();
    }, [loadAvailability]);

    // Show error toast
    useEffect(() => {
        if (error) {
            toast({
                title: 'Error',
                description: error,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            clearError();
        }
    }, [error, toast, clearError]);

    const handleCreateNew = () => {
        startCreating();
    };

    const handleTabChange = (tab: 'upcoming' | 'past' | 'create') => {
        setCurrentView(tab);
    };

    // Loading state
    if (isLoading && upcomingSlots.length === 0 && pastSlots.length === 0) {
        return (
            <Container maxW="6xl" py={8}>
                <Center minH="60vh">
                    <VStack spacing={4}>
                        <Spinner
                            thickness="4px"
                            speed="0.8s"
                            emptyColor="brand.100"
                            color="brand.500"
                            size="xl"
                        />
                        <Text color="gray.600">Loading your availability...</Text>
                    </VStack>
                </Center>
            </Container>
        );
    }

    const renderContent = () => {
        switch (currentView) {
            case 'create':
                return <AvailabilityCreateForm />;
            case 'past':
                return <AvailabilityPastList />;
            case 'upcoming':
            default:
                return <AvailabilityUpcomingList />;
        }
    };

    const getStats = () => {
        const totalSlots = upcomingSlots.length + pastSlots.length;
        const bookedSlots = [...upcomingSlots, ...pastSlots].filter(slot => slot.isBooked).length;
        const availableSlots = upcomingSlots.filter(slot => !slot.isBooked).length;

        return {
            totalSlots,
            bookedSlots,
            availableSlots,
            upcomingSlots: upcomingSlots.length
        };
    };

    const stats = getStats();

    return (
        <Box bg="gray.50" minH="100vh" py={8}>
            <Container maxW="6xl">
                <VStack spacing={8} align="stretch">
                    {/* Header Section */}
                    <AvailabilityHeader />

                    {/* Quick Stats */}
                    {(upcomingSlots.length > 0 || pastSlots.length > 0) && (
                        <AvailabilityStats stats={stats} />
                    )}

                    {/* Main Content */}
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="lg"
                        overflow="hidden"
                        border="1px solid"
                        borderColor="gray.100"
                    >
                        {/* Navigation Tabs */}
                        <AvailabilityTabs
                            currentView={currentView}
                            onTabChange={handleTabChange}
                            upcomingCount={upcomingSlots.length}
                            pastCount={pastSlots.length}
                        />

                        {/* Content Area */}
                        <Box p={6}>
                            {renderContent()}
                        </Box>
                    </Box>

                    {/* Quick Actions (Mobile) */}
                    {isMobile && currentView !== 'create' && (
                        <Box
                            position="fixed"
                            bottom={6}
                            right={6}
                            zIndex={10}
                        >
                            <Button
                                variant="fab"
                                leftIcon={<FaCalendarPlus />}
                                onClick={handleCreateNew}
                                className="heart-beat"
                                boxShadow="0 8px 32px rgba(232, 93, 117, 0.3)"
                            >
                                Add Slots
                            </Button>
                        </Box>
                    )}

                    {/* First Time User Guide */}
                    {stats.totalSlots === 0 && currentView === 'upcoming' && (
                        <Alert
                            status="info"
                            borderRadius="xl"
                            bg="blue.50"
                            border="1px solid"
                            borderColor="blue.200"
                        >
                            <AlertIcon color="blue.500" />
                            <AlertDescription>
                                <VStack align="start" spacing={2}>
                                    <Text fontWeight="semibold" color="blue.700">
                                        Welcome to Availability Management! 🎉
                                    </Text>
                                    <Text color="blue.600" fontSize="sm">
                                        Start by creating your availability slots for the next 7 days.
                                        This helps other users find and book time with you for dates and activities.
                                    </Text>
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        leftIcon={<FaCalendarPlus />}
                                        onClick={handleCreateNew}
                                        mt={2}
                                    >
                                        Create Your First Availability
                                    </Button>
                                </VStack>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Loading Overlay */}
                    {isLoading && (
                        <Box
                            position="fixed"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bg="rgba(0, 0, 0, 0.1)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            zIndex={1000}
                        >
                            <Box
                                bg="white"
                                p={6}
                                borderRadius="xl"
                                boxShadow="xl"
                                textAlign="center"
                            >
                                <Spinner
                                    thickness="4px"
                                    speed="0.8s"
                                    emptyColor="brand.100"
                                    color="brand.500"
                                    size="lg"
                                    mb={4}
                                />
                                <Text color="gray.600">Updating availability...</Text>
                            </Box>
                        </Box>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default AvailabilityContainer;