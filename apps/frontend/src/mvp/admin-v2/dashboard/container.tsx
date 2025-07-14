// apps/frontend/src/mvp/admin-v2/dashboard/container.tsx

import React, { useEffect } from 'react';
import {
    Box,
    Flex,
    Select,
    Text,
    useColorModeValue,
    Spinner,
    Center,
    VStack,
} from '@chakra-ui/react';
import DashboardOverview from './components/DashboardOverview';
import StatusWrapper from '../../common/StatusWrapper/StatusWrapper';
import { useDashboardStore, useDashboardLoading, useDashboardError } from './store/dashboardStore';
import { formatTimeRangeLabel } from './utils/formatters';
import { TIME_RANGE_OPTIONS } from './types';
import type { DashboardTimeRange } from './types';
import { DashboardTimeRange as DashboardTimeRangeEnum } from './types';

interface DashboardContainerProps {
    initialTimeRange?: DashboardTimeRange;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
    initialTimeRange = DashboardTimeRangeEnum.LAST_7_DAYS
}) => {
    // Theme colors
    const headerBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    // Store state
    const {
        selectedTimeRange,
        setTimeRange,
        reset,
    } = useDashboardStore();

    const isLoading = useDashboardLoading();
    const error = useDashboardError();

    // Initialize with default time range
    useEffect(() => {
        if (selectedTimeRange !== initialTimeRange) {
            setTimeRange(initialTimeRange);
        }
    }, [initialTimeRange, selectedTimeRange, setTimeRange]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    // Handle time range change
    const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newTimeRange = event.target.value as DashboardTimeRange;
        setTimeRange(newTimeRange);
    };

    return (
        <Box minH="100vh" bg="gray.50">
            {/* Time Range Selector Header */}
            <Box
                bg={headerBg}
                borderBottom="1px solid"
                borderColor={borderColor}
                px={6}
                py={4}
                position="sticky"
                top={0}
                zIndex={10}
                boxShadow="sm"
            >
                <Flex justify="space-between" align="center" maxW="7xl" mx="auto">
                    <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                        Admin Dashboard
                    </Text>

                    <Flex align="center" gap={3}>
                        <Text fontSize="sm" color={textColor} fontWeight="medium">
                            Time Range:
                        </Text>
                        <Select
                            value={selectedTimeRange}
                            onChange={handleTimeRangeChange}
                            size="sm"
                            width="180px"
                            bg="white"
                            borderColor="gray.300"
                            _focus={{
                                borderColor: 'brand.500',
                                boxShadow: '0 0 0 1px rgba(232, 93, 117, 0.6)',
                            }}
                        >
                            {TIME_RANGE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </Flex>
                </Flex>
            </Box>

            {/* Main Dashboard Content */}
            <StatusWrapper
                isLoading={isLoading && !useDashboardStore.getState().overview}
                error={error ?? ''}
                p={0}
                minH="calc(100vh - 80px)"
            // loadingComponent={
            //     <Center h="calc(100vh - 80px)">
            //         <VStack spacing={4}>
            //             <Spinner
            //                 thickness="4px"
            //                 speed="0.65s"
            //                 emptyColor="gray.200"
            //                 color="brand.500"
            //                 size="xl"
            //             />
            //             <Text color="gray.600" fontSize="lg">
            //                 Loading dashboard data...
            //             </Text>
            //             <Text color="gray.500" fontSize="sm">
            //                 Fetching metrics for {formatTimeRangeLabel(selectedTimeRange).toLowerCase()}
            //             </Text>
            //         </VStack>
            //     </Center>
            // }
            // errorComponent={
            //     <Center h="calc(100vh - 80px)">
            //         <VStack spacing={4} textAlign="center">
            //             <Text color="red.500" fontSize="xl" fontWeight="semibold">
            //                 Failed to load dashboard
            //             </Text>
            //             <Text color="gray.600" maxW="md">
            //                 We couldn't load the dashboard data. Please check your connection and try again.
            //             </Text>
            //         </VStack>
            //     </Center>
            // }
            >
                <DashboardOverview />
            </StatusWrapper>
        </Box>
    );
};

export default DashboardContainer;