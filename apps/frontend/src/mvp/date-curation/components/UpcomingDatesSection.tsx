// apps/frontend/src/mvp/date-curation/components/UpcomingDatesSection.tsx
import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Avatar,
    Badge,
    Button,
    Card,
    CardBody,
    Icon,
    Flex,
    useBreakpointValue,
    useDisclosure,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaVideo,
    FaHeart,
    FaTimes,
    FaCheckCircle,
    FaClock
} from 'react-icons/fa';
import { CancellationCategory, CuratedDateCard, DateAction } from '../types';

interface UpcomingDatesSectionProps {
    dates: CuratedDateCard[];
    onDateAction: (action: DateAction) => void;
    isLoading?: boolean;
}

const UpcomingDatesSection: React.FC<UpcomingDatesSectionProps> = ({
    dates,
    onDateAction,
    isLoading = false
}) => {
    const [processingDateId, setProcessingDateId] = useState<string | null>(null);

    // Responsive values
    const cardPadding = useBreakpointValue({ base: 4, md: 6 });
    const avatarSize = useBreakpointValue({ base: "lg", md: "xl" });
    const buttonSize = useBreakpointValue({ base: "sm", md: "md" });

    const handleDateAction = async (action: DateAction) => {
        setProcessingDateId(action.dateId);
        try {
            await onDateAction(action);
        } finally {
            setProcessingDateId(null);
        }
    };

    const formatDateTime = (dateTime: string): string => {
        const date = new Date(dateTime);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'green';
            case 'pending': return 'orange';
            case 'cancelled': return 'red';
            default: return 'gray';
        }
    };

    const getUrgencyBadge = (hoursUntilDate: number) => {
        if (hoursUntilDate <= 2) {
            return { text: 'Starting Soon!', colorScheme: 'red' };
        } else if (hoursUntilDate <= 24) {
            return { text: 'Tomorrow', colorScheme: 'orange' };
        } else if (hoursUntilDate <= 72) {
            return { text: 'This Week', colorScheme: 'blue' };
        }
        return null;
    };

    if (dates.length === 0) {
        return (
            <Box>
                <Heading size="lg" mb={4} color="gray.700">
                    Upcoming Dates
                </Heading>
                <Alert
                    status="info"
                    variant="left-accent"
                    borderRadius="xl"
                    bg="brand.50"
                    borderColor="brand.200"
                >
                    <AlertIcon color="brand.500" />
                    <Box>
                        <Text fontWeight="semibold" color="brand.700">
                            No upcoming dates yet! 💕
                        </Text>
                        <Text color="brand.600" fontSize="sm" mt={1}>
                            Our matchmakers are working on finding you perfect connections. Check back soon!
                        </Text>
                    </Box>
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <HStack justify="space-between" align="center" mb={6}>
                <Heading size="lg" color="gray.700">
                    Upcoming Dates
                </Heading>
                <Badge
                    variant="subtle"
                    colorScheme="brand"
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                >
                    {dates.length} {dates.length === 1 ? 'Date' : 'Dates'}
                </Badge>
            </HStack>

            <VStack spacing={4}>
                {dates.map((date) => {
                    const urgencyBadge = getUrgencyBadge(date.hoursUntilDate);
                    const isProcessing = processingDateId === date.id;

                    return (
                        <Card
                            key={date.id}
                            variant="elevated"
                            w="full"
                            overflow="hidden"
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                            }}
                            transition="all 0.2s ease"
                            opacity={isProcessing ? 0.7 : 1}
                        >
                            <CardBody p={cardPadding}>
                                <VStack spacing={4} align="stretch">
                                    {/* Header with urgency badge */}
                                    {urgencyBadge && (
                                        <Flex justify="flex-end">
                                            <Badge
                                                colorScheme={urgencyBadge.colorScheme}
                                                variant="solid"
                                                fontSize="xs"
                                                px={2}
                                                py={1}
                                                borderRadius="full"
                                            >
                                                {urgencyBadge.text}
                                            </Badge>
                                        </Flex>
                                    )}

                                    {/* Match Info */}
                                    <HStack spacing={4} align="start">
                                        <Box position="relative">
                                            <Avatar
                                                size={avatarSize}
                                                name={date.matchName}
                                                src={date.matchImage}
                                                border="3px solid"
                                                borderColor="brand.200"
                                            />
                                            {date.isVerified && (
                                                <Box
                                                    position="absolute"
                                                    bottom="-2px"
                                                    right="-2px"
                                                    bg="blue.500"
                                                    borderRadius="full"
                                                    p={1}
                                                    border="2px solid white"
                                                >
                                                    <Icon as={FaCheckCircle} color="white" boxSize={3} />
                                                </Box>
                                            )}
                                        </Box>

                                        <VStack align="start" spacing={2} flex={1}>
                                            <HStack spacing={3} wrap="wrap">
                                                <Text fontWeight="bold" fontSize="lg" color="gray.800">
                                                    {date.matchName}, {date.matchAge}
                                                </Text>
                                                <Badge
                                                    colorScheme={getStatusColor(date.status)}
                                                    variant="subtle"
                                                    textTransform="capitalize"
                                                >
                                                    {date.status}
                                                </Badge>
                                            </HStack>

                                            {/* Compatibility Score */}
                                            <HStack spacing={2}>
                                                <Icon as={FaHeart} color="brand.500" boxSize={4} />
                                                <Text fontSize="sm" color="brand.600" fontWeight="medium">
                                                    {date.compatibilityScore}% Match
                                                </Text>
                                            </HStack>

                                            {/* Date & Time */}
                                            <HStack spacing={2}>
                                                <Icon as={FaCalendarAlt} color="gray.500" boxSize={4} />
                                                <Text fontSize="sm" color="gray.600">
                                                    {formatDateTime(date.dateTime)}
                                                </Text>
                                                <Icon as={FaClock} color="gray.400" boxSize={3} />
                                                <Text fontSize="xs" color="gray.500">
                                                    in {Math.round(date.hoursUntilDate)}h
                                                </Text>
                                            </HStack>

                                            {/* Location/Mode */}
                                            <HStack spacing={2}>
                                                <Icon
                                                    as={date.mode === 'online' ? FaVideo : FaMapMarkerAlt}
                                                    color="gray.500"
                                                    boxSize={4}
                                                />
                                                <Text fontSize="sm" color="gray.600">
                                                    {date.mode === 'online' ? 'Video Date' : date.location}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </HStack>

                                    {/* Admin Notes */}
                                    {date.adminNote && (
                                        <Box
                                            bg="blue.50"
                                            borderLeft="4px solid"
                                            borderColor="blue.400"
                                            p={3}
                                            borderRadius="md"
                                        >
                                            <Text fontSize="sm" color="blue.700" fontStyle="italic">
                                                💌 Note from your matchmaker: {date.adminNote}
                                            </Text>
                                        </Box>
                                    )}

                                    {/* Dress Code */}
                                    {date.dressCode && (
                                        <HStack spacing={2}>
                                            <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                                👔 Dress Code:
                                            </Text>
                                            <Text fontSize="sm" color="gray.700">
                                                {date.dressCode}
                                            </Text>
                                        </HStack>
                                    )}

                                    {/* Action Buttons */}
                                    {(date.canConfirm || date.canCancel) && (
                                        <HStack spacing={3} justify="center" pt={2}>
                                            {date.canConfirm && date.status === 'pending' && (
                                                <Button
                                                    variant="love"
                                                    size={buttonSize}
                                                    leftIcon={<FaCheckCircle />}
                                                    isLoading={isProcessing}
                                                    loadingText="Confirming..."
                                                    onClick={() => handleDateAction({
                                                        type: 'accept',
                                                        dateId: date.id
                                                    })}
                                                    className="heart-beat"
                                                    flex={1}
                                                    maxW="200px"
                                                >
                                                    Accept Date
                                                </Button>
                                            )}

                                            {date.canCancel && (
                                                <Button
                                                    variant="outline"
                                                    colorScheme="red"
                                                    size={buttonSize}
                                                    leftIcon={<FaTimes />}
                                                    isLoading={isProcessing}
                                                    loadingText="Cancelling..."
                                                    onClick={() => handleDateAction({
                                                        type: 'cancel',
                                                        dateId: date.id,
                                                        category: CancellationCategory.OTHER // Will be handled by modal later
                                                    })}
                                                    flex={1}
                                                    maxW="200px"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </HStack>
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>
                    );
                })}
            </VStack>
        </Box>
    );
};

export default UpcomingDatesSection;