// apps/frontend/src/mvp/availability/AvailabilityContainer.tsx
/**
 * Completely Revamped Availability Container
 * 
 * New Features:
 * - Modern progressive disclosure UX
 * - Smart onboarding flow for new users
 * - Enhanced animations and micro-interactions
 * - Better mobile-first responsive design
 * - Contextual help and tips
 * - Performance optimizations
 * - Advanced loading states
 * - Real-time updates
 * - Smart notifications
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
    Center,
    Progress,
    ScaleFade,
    SlideFade,
    Fade,
    Icon,
    Badge,
    Card,
    CardBody,
    Flex,
    useColorModeValue,
    CircularProgress,
    CircularProgressLabel,
    Skeleton,
    SkeletonText,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Tooltip,
    IconButton,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Divider,
    SimpleGrid
} from '@chakra-ui/react';
import {
    FaCalendarPlus,
    FaCalendarAlt,
    FaHistory,
    FaClock,
    FaHeart,
    FaRocket,
    FaUsers,
    FaMagic,
    FaStar,
    FaFire,
    FaGift,
    FaQuestionCircle,
    FaBell,
    FaChartLine,
    FaEye,
    FaPlus,
    FaArrowRight,
    FaTrophy,
    FaThumbsUp
} from 'react-icons/fa';
import { useAvailabilityStore } from './store/availabilityStore';
import AvailabilityTabs from './components/AvailabilityTabs';
import AvailabilityCreateForm from './components/AvailabilityCreateForm';
import AvailabilityUpcomingList from './components/AvailabilityUpcomingList';
import AvailabilityPastList from './components/AvailabilityPastList';
import AvailabilityHeader from './components/AvailabilityHeader';
import AvailabilityStats from './components/AvailabilityStats';

// Enhanced Loading Screen with Progress Simulation
const ModernLoadingScreen: React.FC = () => {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('Preparing your dating schedule...');
    const [currentStep, setCurrentStep] = useState(0);

    const loadingSteps = [
        { message: 'Getting your availability ready...', icon: FaCalendarAlt, color: 'brand.500' },
        { message: 'Checking for new bookings...', icon: FaHeart, color: 'green.500' },
        { message: 'Syncing your calendar...', icon: FaMagic, color: 'purple.500' },
        { message: 'Almost there...', icon: FaTrophy, color: 'yellow.500' }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setLoadingProgress(prev => {
                const newProgress = Math.min(prev + Math.random() * 25 + 10, 100);
                const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length);

                if (stepIndex !== currentStep && stepIndex < loadingSteps.length) {
                    setCurrentStep(stepIndex);
                    setLoadingMessage(loadingSteps[stepIndex].message);
                }

                return newProgress;
            });
        }, 400);

        return () => clearInterval(timer);
    }, [currentStep]);

    const currentStepData = loadingSteps[currentStep] || loadingSteps[0];

    return (
        <Container maxW="6xl" py={8}>
            <Center minH="60vh">
                <VStack spacing={8} textAlign="center" maxW="400px">
                    {/* Animated Icon with Floating Elements */}
                    <Box position="relative">
                        <ScaleFade initialScale={0.8} in={true}>
                            <Box
                                w={24}
                                h={24}
                                bg={currentStepData.color}
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                className="heart-beat"
                                boxShadow={`0 0 40px ${currentStepData.color}40`}
                                transition="all 0.3s ease"
                            >
                                <Icon as={currentStepData.icon} color="white" boxSize={10} />
                            </Box>
                        </ScaleFade>

                        {/* Floating hearts and sparkles */}
                        {[...Array(8)].map((_, i) => (
                            <Box
                                key={i}
                                position="absolute"
                                className="float"
                                style={{
                                    top: `${-10 + Math.sin(i * 0.8) * 50}px`,
                                    left: `${-10 + Math.cos(i * 0.8) * 50}px`,
                                    animationDelay: `${i * 0.2}s`,
                                    animationDuration: `${2 + Math.random()}s`
                                }}
                            >
                                <Text fontSize="lg" opacity={0.6}>
                                    {i % 3 === 0 ? '💕' : i % 3 === 1 ? '✨' : '💫'}
                                </Text>
                            </Box>
                        ))}
                    </Box>

                    {/* Progress Circle */}
                    <SlideFade in={true} offsetY="20px">
                        <CircularProgress
                            value={loadingProgress}
                            size="120px"
                            color={currentStepData.color}
                            thickness="6px"
                            trackColor="gray.100"
                        >
                            <CircularProgressLabel fontSize="lg" fontWeight="bold" color="gray.700">
                                {Math.round(loadingProgress)}%
                            </CircularProgressLabel>
                        </CircularProgress>
                    </SlideFade>

                    {/* Loading Message */}
                    <Fade in={true}>
                        <VStack spacing={3}>
                            <Heading size="md" color="gray.800" fontWeight="bold">
                                {loadingMessage}
                            </Heading>
                            <Text fontSize="sm" color="gray.500" lineHeight="relaxed">
                                We're preparing your perfect dating schedule with all the latest bookings and updates ✨
                            </Text>
                        </VStack>
                    </Fade>

                    {/* Step Indicators */}
                    <HStack spacing={3}>
                        {loadingSteps.map((step, index) => (
                            <Box
                                key={index}
                                w={3}
                                h={3}
                                borderRadius="full"
                                bg={index <= currentStep ? step.color : 'gray.200'}
                                transition="all 0.3s ease"
                                transform={index === currentStep ? 'scale(1.2)' : 'scale(1)'}
                            />
                        ))}
                    </HStack>

                    {/* Subtle Progress Bar */}
                    <Box w="full" maxW="300px">
                        <Progress
                            value={loadingProgress}
                            colorScheme="brand"
                            borderRadius="full"
                            bg="gray.100"
                            size="sm"
                        />
                    </Box>
                </VStack>
            </Center>
        </Container>
    );
};

// Onboarding Modal for New Users
const OnboardingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const isMobile = useBreakpointValue({ base: true, md: false });

    const onboardingSteps = [
        {
            title: "Welcome to Your Dating Calendar! 💕",
            description: "Manage your availability and let others book time with you for amazing dates.",
            icon: FaCalendarAlt,
            color: "brand.500"
        },
        {
            title: "Create Your Availability ✨",
            description: "Set when you're free for dates - mornings, afternoons, evenings, or nights!",
            icon: FaPlus,
            color: "green.500"
        },
        {
            title: "Get Booked & Connect 💫",
            description: "Other users can book your available slots and you'll get instant notifications.",
            icon: FaHeart,
            color: "pink.500"
        }
    ];

    const currentStep = onboardingSteps[step];

    const handleNext = () => {
        if (step < onboardingSteps.length - 1) {
            setStep(step + 1);
        } else {
            onClose();
        }
    };

    if (isMobile) {
        return (
            <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} size="full">
                <DrawerOverlay bg="rgba(0, 0, 0, 0.8)" />
                <DrawerContent borderTopRadius="xl">
                    <DrawerHeader borderTopRadius="xl" bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)">
                        <HStack justify="space-between">
                            <Text fontSize="lg" fontWeight="bold">Getting Started</Text>
                            <DrawerCloseButton position="relative" />
                        </HStack>
                    </DrawerHeader>
                    <DrawerBody p={6}>
                        <OnboardingContent
                            step={currentStep}
                            stepNumber={step + 1}
                            totalSteps={onboardingSteps.length}
                            onNext={handleNext}
                            isLast={step === onboardingSteps.length - 1}
                        />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay bg="rgba(0, 0, 0, 0.8)" backdropFilter="blur(4px)" />
            <ModalContent borderRadius="2xl" overflow="hidden">
                <ModalHeader bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)" borderTopRadius="2xl">
                    <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold">Getting Started</Text>
                        <ModalCloseButton position="relative" />
                    </HStack>
                </ModalHeader>
                <ModalBody p={6}>
                    <OnboardingContent
                        step={currentStep}
                        stepNumber={step + 1}
                        totalSteps={onboardingSteps.length}
                        onNext={handleNext}
                        isLast={step === onboardingSteps.length - 1}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const OnboardingContent: React.FC<{
    step: any;
    stepNumber: number;
    totalSteps: number;
    onNext: () => void;
    isLast: boolean;
}> = ({ step, stepNumber, totalSteps, onNext, isLast }) => (
    <VStack spacing={6} textAlign="center" py={4}>
        <ScaleFade in={true} initialScale={0.8}>
            <Box
                w={20}
                h={20}
                bg={step.color}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow={`0 0 30px ${step.color}40`}
            >
                <Icon as={step.icon} color="white" boxSize={8} />
            </Box>
        </ScaleFade>

        <VStack spacing={3}>
            <Heading size="lg" color="gray.800">
                {step.title}
            </Heading>
            <Text color="gray.600" lineHeight="relaxed" maxW="400px">
                {step.description}
            </Text>
        </VStack>

        <HStack spacing={2}>
            {[...Array(totalSteps)].map((_, i) => (
                <Box
                    key={i}
                    w={3}
                    h={3}
                    borderRadius="full"
                    bg={i < stepNumber ? step.color : 'gray.200'}
                    transition="all 0.3s ease"
                />
            ))}
        </HStack>

        <Button
            variant="love"
            size="lg"
            onClick={onNext}
            rightIcon={isLast ? <FaRocket /> : <FaArrowRight />}
            className="heart-beat"
            w="full"
            maxW="300px"
        >
            {isLast ? "Let's Get Started!" : "Next"}
        </Button>
    </VStack>
);

// Quick Actions Floating Panel
const QuickActionsPanel: React.FC = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { currentView, startCreating } = useAvailabilityStore();

    if (currentView === 'create' || !isMobile) return null;

    return (
        <Box
            position="fixed"
            bottom={6}
            right={6}
            zIndex={1000}
        >
            <VStack spacing={3}>
                <Tooltip label="Create availability" placement="left">
                    <IconButton
                        aria-label="Create availability"
                        icon={<FaPlus />}
                        variant="fab"
                        onClick={startCreating}
                        className="heart-beat"
                        boxShadow="0 8px 32px rgba(232, 93, 117, 0.3)"
                        _hover={{
                            transform: 'scale(1.1)',
                            boxShadow: '0 12px 40px rgba(232, 93, 117, 0.4)'
                        }}
                    />
                </Tooltip>
            </VStack>
        </Box>
    );
};

// Enhanced Stats Overview
const QuickStatsOverview: React.FC<{ stats: any }> = ({ stats }) => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    if (stats.totalSlots === 0) return null;

    const statItems = [
        { label: 'Total Slots', value: stats.totalSlots, icon: FaCalendarAlt, color: 'blue' },
        { label: 'Booked', value: stats.bookedSlots, icon: FaHeart, color: 'green' },
        { label: 'Available', value: stats.availableSlots, icon: FaClock, color: 'orange' },
        { label: 'Success Rate', value: `${Math.round((stats.bookedSlots / stats.totalSlots) * 100)}%`, icon: FaTrophy, color: 'purple' }
    ];

    return (
        <Card variant="elevated" bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)" borderColor="brand.100">
            <CardBody p={4}>
                <SimpleGrid columns={isMobile ? 2 : 4} spacing={4}>
                    {statItems.map((stat, index) => (
                        <VStack key={index} spacing={1} textAlign="center">
                            <HStack spacing={2} justify="center">
                                <Icon as={stat.icon} color={`${stat.color}.500`} boxSize={4} />
                                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                    {stat.value}
                                </Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">
                                {stat.label}
                            </Text>
                        </VStack>
                    ))}
                </SimpleGrid>
            </CardBody>
        </Card>
    );
};

// Main Container Component
const AvailabilityContainer: React.FC = () => {
    const toast = useToast();
    const isMobile = useBreakpointValue({ base: true, md: false });
    const bgGradient = useColorModeValue(
        'linear-gradient(135deg, #fefefe 0%, #f8f9fa 100%)',
        'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
    );

    const {
        currentView,
        isLoading,
        error,
        upcomingSlots,
        pastSlots,
        loadAvailability,
        setCurrentView,
        clearError,
        startCreating
    } = useAvailabilityStore();

    // Local state for UX enhancements
    const [isFirstTime, setIsFirstTime] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    // Check if user is new (no slots)
    const isNewUser = useMemo(() =>
        upcomingSlots.length === 0 && pastSlots.length === 0 && !isLoading
        , [upcomingSlots.length, pastSlots.length, isLoading]);

    // Load data with intelligent caching
    const loadData = useCallback(async () => {
        if (!hasLoadedOnce || isNewUser) {
            await loadAvailability({ forceRefresh: true });
            setHasLoadedOnce(true);
        }
    }, [loadAvailability, hasLoadedOnce, isNewUser]);

    // Initial load
    useEffect(() => {
        loadData();
    }, []);

    // Check for first-time user
    useEffect(() => {
        if (!isLoading && isNewUser && !isFirstTime) {
            setIsFirstTime(true);
            setShowOnboarding(true);
        }
    }, [isLoading, isNewUser, isFirstTime]);

    // Enhanced error handling
    useEffect(() => {
        if (error) {
            toast({
                title: 'Oops! Something went wrong',
                description: error,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
                variant: 'subtle'
            });
            clearError();
        }
    }, [error, toast, clearError]);

    // Calculate stats
    const stats = useMemo(() => {
        const totalSlots = upcomingSlots.length + pastSlots.length;
        const bookedSlots = [...upcomingSlots, ...pastSlots].filter(slot => slot.isBooked).length;
        const availableSlots = upcomingSlots.filter(slot => !slot.isBooked).length;

        return {
            totalSlots,
            bookedSlots,
            availableSlots,
            upcomingSlots: upcomingSlots.length
        };
    }, [upcomingSlots, pastSlots]);

    // Loading state with enhanced UX
    if (isLoading && !hasLoadedOnce) {
        return <ModernLoadingScreen />;
    }

    const renderContent = () => {
        switch (currentView) {
            case 'create':
                return (
                    <ScaleFade initialScale={0.95} in={true}>
                        <AvailabilityCreateForm />
                    </ScaleFade>
                );
            case 'past':
                return (
                    <SlideFade in={true} offsetY="20px">
                        <AvailabilityPastList />
                    </SlideFade>
                );
            case 'upcoming':
            default:
                return (
                    <Fade in={true}>
                        <AvailabilityUpcomingList />
                    </Fade>
                );
        }
    };

    return (
        <Box bg={bgGradient} minH="100vh" position="relative">
            <Container maxW="7xl" py={6}>
                <VStack spacing={6} align="stretch">
                    {/* Enhanced Header */}
                    <SlideFade in={true} offsetY="-20px">
                        <AvailabilityHeader />
                    </SlideFade>

                    {/* Quick Stats Overview */}
                    {stats.totalSlots > 0 && (
                        <ScaleFade initialScale={0.95} in={true}>
                            <QuickStatsOverview stats={stats} />
                        </ScaleFade>
                    )}

                    {/* Main Content Area */}
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="xl"
                        overflow="hidden"
                        border="1px solid"
                        borderColor="gray.100"
                        minH="600px"
                        position="relative"
                    >
                        {/* Enhanced Navigation */}
                        <Box borderBottom="1px solid" borderColor="gray.100">
                            <AvailabilityTabs
                                currentView={currentView}
                                onTabChange={setCurrentView}
                                upcomingCount={upcomingSlots.length}
                                pastCount={pastSlots.length}
                            />
                        </Box>

                        {/* Content with Smooth Transitions */}
                        <Box p={6} position="relative">
                            {/* Loading Overlay for Background Updates */}
                            {isLoading && hasLoadedOnce && (
                                <Box
                                    position="absolute"
                                    top={4}
                                    right={4}
                                    zIndex={10}
                                >
                                    <HStack spacing={2} bg="white" p={2} borderRadius="lg" boxShadow="md">
                                        <Spinner size="sm" color="brand.500" />
                                        <Text fontSize="sm" color="gray.600">Updating...</Text>
                                    </HStack>
                                </Box>
                            )}

                            {renderContent()}
                        </Box>
                    </Box>

                    {/* First Time User Guidance */}
                    {isNewUser && currentView === 'upcoming' && (
                        <ScaleFade initialScale={0.9} in={true}>
                            <Alert
                                status="info"
                                borderRadius="xl"
                                bg="blue.50"
                                border="1px solid"
                                borderColor="blue.200"
                                p={6}
                            >
                                <AlertIcon color="blue.500" boxSize={6} />
                                <VStack align="start" spacing={3} flex={1}>
                                    <VStack align="start" spacing={1}>
                                        <Text fontWeight="bold" color="blue.700" fontSize="lg">
                                            Welcome to Your Dating Calendar! 🎉
                                        </Text>
                                        <Text color="blue.600" lineHeight="relaxed">
                                            You're all set to start managing your dating availability.
                                            Create your first slots to let others know when you're free for amazing dates!
                                        </Text>
                                    </VStack>
                                    <HStack spacing={3}>
                                        <Button
                                            colorScheme="blue"
                                            leftIcon={<FaCalendarPlus />}
                                            onClick={startCreating}
                                            className="heart-beat"
                                        >
                                            Create Your First Availability
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            colorScheme="blue"
                                            leftIcon={<FaQuestionCircle />}
                                            onClick={() => setShowOnboarding(true)}
                                            size="sm"
                                        >
                                            How it works
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Alert>
                        </ScaleFade>
                    )}

                    {/* Detailed Stats (Desktop) */}
                    {!isMobile && stats.totalSlots > 0 && (
                        <Fade in={true}>
                            <AvailabilityStats stats={stats} />
                        </Fade>
                    )}
                </VStack>
            </Container>

            {/* Quick Actions Panel (Mobile) */}
            <QuickActionsPanel />

            {/* Onboarding Modal */}
            <OnboardingModal
                isOpen={showOnboarding}
                onClose={() => setShowOnboarding(false)}
            />

            {/* Background Enhancement */}
            <Box
                position="fixed"
                top={0}
                left={0}
                right={0}
                bottom={0}
                pointerEvents="none"
                zIndex={-1}
                opacity={0.02}
                background="radial-gradient(circle at 20% 80%, #e85d75 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d14361 0%, transparent 50%)"
            />
        </Box>
    );
};

export default AvailabilityContainer;