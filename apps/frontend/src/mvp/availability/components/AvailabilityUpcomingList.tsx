// apps/frontend/src/mvp/availability/components/AvailabilityUpcomingList.tsx
/**
 * Updated Availability Upcoming List Component
 * 
 * Now integrates:
 * - Enhanced mobile calendar view
 * - Desktop grid with booking visibility
 * - Improved slot edit modal
 */

import React, { useState } from 'react';
import {
    VStack,
    HStack,
    Grid,
    Card,
    CardBody,
    Text,
    Badge,
    Button,
    useDisclosure,
    useBreakpointValue,
    Box,
    Icon,
    ButtonGroup
} from '@chakra-ui/react';
import {
    FaCalendarAlt,
    FaClock,
    FaUser,
    FaHeart,
    FaVideo,
    FaMapMarkerAlt,
    FaTh,
    FaList
} from 'react-icons/fa';
import { useAvailabilityStore } from '../store/availabilityStore';
import { AvailabilitySlot } from '../types';
import AvailabilityCalendarView from './AvailabilityCalendarView';
import AvailabilitySlotEditModal from './AvailabilitySlotEditModal';

type ViewMode = 'calendar' | 'list';

const AvailabilityUpcomingList: React.FC = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    const {
        upcomingSlots,
        startCreating
    } = useAvailabilityStore();

    const handleEdit = (slot: AvailabilitySlot) => {
        setEditingSlot(slot);
        onEditOpen();
    };

    const handleSlotUpdated = () => {
        setEditingSlot(null);
        onEditClose();
        // Optionally refresh data here if needed
    };

    // Empty state
    if (upcomingSlots.length === 0) {
        return (
            <VStack spacing={6} py={12} textAlign="center">
                <Box fontSize="6xl">📅</Box>
                <VStack spacing={2}>
                    <Text fontSize="xl" fontWeight="bold" color="gray.700">
                        No Upcoming Availability
                    </Text>
                    <Text color="gray.500" maxW="400px">
                        You haven't created any availability slots yet. Start by creating your first availability to let others book time with you.
                    </Text>
                </VStack>
                <Button
                    variant="love"
                    size="lg"
                    leftIcon={<FaCalendarAlt />}
                    onClick={startCreating}
                    className="heart-beat"
                >
                    Create Your First Availability
                </Button>
            </VStack>
        );
    }

    const availableCount = upcomingSlots.filter(s => !s.isBooked).length;
    const bookedCount = upcomingSlots.filter(s => s.isBooked).length;
    const onlineCount = upcomingSlots.filter(s => s.dateType === 'online').length;
    const offlineCount = upcomingSlots.filter(s => s.dateType === 'offline').length;

    return (
        <VStack spacing={6} align="stretch">
            {/* Enhanced Header with Statistics */}
            <Box
                bg="linear-gradient(135deg, #fef7f7 0%, #ffffff 100%)"
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
            >
                <VStack spacing={4}>
                    <HStack justify="space-between" w="full" align="center">
                        <VStack align="start" spacing={1}>
                            <Text fontSize="lg" fontWeight="bold" color="gray.800">
                                Your Upcoming Availability
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                {upcomingSlots.length} total slot{upcomingSlots.length !== 1 ? 's' : ''} available
                            </Text>
                        </VStack>

                        <HStack spacing={2}>
                            {/* View Toggle - Desktop only */}
                            {!isMobile && (
                                <ButtonGroup size="sm" isAttached variant="outline">
                                    <Button
                                        leftIcon={<FaTh />}
                                        onClick={() => setViewMode('calendar')}
                                        variant={viewMode === 'calendar' ? 'solid' : 'outline'}
                                        colorScheme="brand"
                                    >
                                        Calendar
                                    </Button>
                                    <Button
                                        leftIcon={<FaList />}
                                        onClick={() => setViewMode('list')}
                                        variant={viewMode === 'list' ? 'solid' : 'outline'}
                                        colorScheme="brand"
                                    >
                                        List
                                    </Button>
                                </ButtonGroup>
                            )}

                            <Button
                                variant="love"
                                leftIcon={<FaCalendarAlt />}
                                onClick={startCreating}
                                size={isMobile ? "sm" : "md"}
                                className="heart-beat"
                            >
                                {isMobile ? "Add Slots" : "Add More Slots"}
                            </Button>
                        </HStack>
                    </HStack>

                    {/* Statistics */}
                    <Grid templateColumns="repeat(4, 1fr)" gap={4} w="full">
                        <VStack spacing={1} textAlign="center">
                            <HStack spacing={1} color="blue.500" justify="center">
                                <Icon as={FaVideo} boxSize={4} />
                                <Text fontSize="lg" fontWeight="bold">{onlineCount}</Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Online
                            </Text>
                        </VStack>

                        <VStack spacing={1} textAlign="center">
                            <HStack spacing={1} color="orange.500" justify="center">
                                <Icon as={FaMapMarkerAlt} boxSize={4} />
                                <Text fontSize="lg" fontWeight="bold">{offlineCount}</Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Offline
                            </Text>
                        </VStack>

                        <VStack spacing={1} textAlign="center">
                            <HStack spacing={1} color="green.500" justify="center">
                                <Icon as={FaUser} boxSize={4} />
                                <Text fontSize="lg" fontWeight="bold">{bookedCount}</Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Booked
                            </Text>
                        </VStack>

                        <VStack spacing={1} textAlign="center">
                            <HStack spacing={1} color="gray.500" justify="center">
                                <Icon as={FaClock} boxSize={4} />
                                <Text fontSize="lg" fontWeight="bold">{availableCount}</Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                                Available
                            </Text>
                        </VStack>
                    </Grid>
                </VStack>
            </Box>

            {/* Main Content */}
            <Box>
                {/* Always use calendar view for now - can add list view later */}
                <AvailabilityCalendarView />
            </Box>

            {/* Edit Modal */}
            {editingSlot && (
                <AvailabilitySlotEditModal
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    slot={editingSlot}
                    onSlotUpdated={handleSlotUpdated}
                />
            )}
        </VStack>
    );
};

export default AvailabilityUpcomingList;