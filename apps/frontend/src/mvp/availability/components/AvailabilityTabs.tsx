// apps/frontend/src/mvp/availability/components/AvailabilityTabs.tsx
/**
 * Availability Tabs Component
 * 
 * Navigation tabs for switching between different availability views.
 * Features responsive design and shows counts for each section.
 */

import React from 'react';
import {
    HStack,
    Button,
    Badge,
    useBreakpointValue,
    Box,
    Text
} from '@chakra-ui/react';
import {
    FaCalendarPlus,
    FaCalendarAlt,
    FaHistory,
    FaClock
} from 'react-icons/fa';
import { AvailabilityTab } from '../types';

interface AvailabilityTabsProps {
    currentView: AvailabilityTab;
    onTabChange: (tab: AvailabilityTab) => void;
    upcomingCount: number;
    pastCount: number;
}

const AvailabilityTabs: React.FC<AvailabilityTabsProps> = ({
    currentView,
    onTabChange,
    upcomingCount,
    pastCount
}) => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const tabs = [
        {
            id: 'upcoming' as AvailabilityTab,
            label: isMobile ? 'Upcoming' : 'Upcoming Slots',
            icon: FaCalendarAlt,
            count: upcomingCount,
            color: 'brand'
        },
        {
            id: 'past' as AvailabilityTab,
            label: isMobile ? 'Past' : 'Past Slots',
            icon: FaHistory,
            count: pastCount,
            color: 'gray'
        },
        {
            id: 'create' as AvailabilityTab,
            label: isMobile ? 'Create' : 'Create New',
            icon: FaCalendarPlus,
            count: 0,
            color: 'green'
        }
    ];

    return (
        <Box
            bg="gray.50"
            borderBottom="1px solid"
            borderColor="gray.200"
            px={6}
            py={4}
        >
            <HStack spacing={1} w="full" justify="flex-start" overflowX="auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentView === tab.id;

                    return (
                        <Button
                            key={tab.id}
                            variant={isActive ? 'solid' : 'ghost'}
                            colorScheme={isActive ? tab.color : 'gray'}
                            size={isMobile ? 'sm' : 'md'}
                            leftIcon={<Icon size={isMobile ? '14px' : '16px'} />}
                            onClick={() => onTabChange(tab.id)}
                            position="relative"
                            flexShrink={0}
                            px={isMobile ? 3 : 4}
                            py={isMobile ? 2 : 3}
                            borderRadius="lg"
                            fontWeight={isActive ? 'bold' : 'medium'}
                            _hover={{
                                bg: isActive ? undefined : `${tab.color}.50`,
                                color: isActive ? undefined : `${tab.color}.600`,
                                transform: 'translateY(-1px)',
                            }}
                            _active={{
                                transform: 'scale(0.98)',
                            }}
                            transition="all 0.2s ease"
                            cursor="pointer"
                        >
                            <HStack spacing={2}>
                                <Text>{tab.label}</Text>
                                {tab.count > 0 && (
                                    <Badge
                                        colorScheme={isActive ? 'white' : tab.color}
                                        variant={isActive ? 'solid' : 'subtle'}
                                        borderRadius="full"
                                        fontSize="xs"
                                        minW="20px"
                                        h="20px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        {tab.count}
                                    </Badge>
                                )}
                            </HStack>
                        </Button>
                    );
                })}
            </HStack>
        </Box>
    );
};

export default AvailabilityTabs;