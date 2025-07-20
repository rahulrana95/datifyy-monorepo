// apps/frontend/src/mvp/admin-v2/dashboard/components/TrendChart.tsx

import React, { useMemo } from 'react';
import {
    Box,
    Card,
    CardHeader,
    CardBody,
    Text,
    Skeleton,
    useColorModeValue,
    Flex,
    Badge,
} from '@chakra-ui/react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { formatChartLabel, formatDashboardDate } from '../utils/formatters';
import type { TrendChartProps, ChartDataPoint } from '../types';
import { CHART_COLORS, ChartType } from '../types';

const TrendChart: React.FC<TrendChartProps> = ({
    title,
    data,
    type = ChartType.LINE,
    color = CHART_COLORS.primary,
    height = 300,
    isLoading = false,
    showGrid = true,
    showTooltip = true,
}) => {
    // Theme colors
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const gridColor = useColorModeValue('gray.100', 'gray.700');
    const tooltipBg = useColorModeValue('white', 'gray.700');
    const tooltipBorder = useColorModeValue('gray.200', 'gray.600');

    // Process data for chart - ALWAYS call useMemo
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        return data.map((point: ChartDataPoint) => ({
            ...point,
            date: formatDashboardDate(point.date),
            displayValue: formatChartLabel(point.value),
        }));
    }, [data]);

    // Calculate trend info - ALWAYS call useMemo
    const trendInfo = useMemo(() => {
        if (!chartData || chartData.length < 2) return null;

        const firstValue = chartData[0].value;
        const lastValue = chartData[chartData.length - 1].value;
        const change = lastValue - firstValue;
        const percentChange = firstValue !== 0 ? (change / firstValue) * 100 : 0;

        return {
            change,
            percentChange,
            isPositive: change >= 0,
            isSignificant: Math.abs(percentChange) >= 5,
        };
    }, [chartData]);

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload || !payload.length) return null;

        const data = payload[0];

        return (
            <Box
                bg={tooltipBg}
                border="1px solid"
                borderColor={tooltipBorder}
                borderRadius="md"
                p={3}
                boxShadow="lg"
                fontSize="sm"
            >
                <Text fontWeight="semibold" color={textColor} mb={1}>
                    {label}
                </Text>
                <Flex align="center" gap={2}>
                    <Box
                        w={3}
                        h={3}
                        bg={color}
                        borderRadius="full"
                    />
                    <Text color={textColor}>
                        {title}: {data.payload.displayValue}
                    </Text>
                </Flex>
            </Box>
        );
    };

    // Render chart based on type - moved inside component to avoid conditional hook calls
    const renderChart = () => {
        const commonProps = {
            width: 100,
            height,
            data: chartData,
            margin: { top: 5, right: 30, left: 20, bottom: 5 },
        };

        const xAxisProps = {
            dataKey: 'date',
            axisLine: false,
            tickLine: false,
            tick: { fontSize: 12, fill: textColor },
        };

        const yAxisProps = {
            axisLine: false,
            tickLine: false,
            tick: { fontSize: 12, fill: textColor },
            tickFormatter: (value: number) => formatChartLabel(value),
        };

        switch (type) {
            case ChartType.AREA:
                return (
                    <AreaChart {...commonProps}>
                        {showGrid && (
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        )}
                        <XAxis {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        {showTooltip && <Tooltip content={<CustomTooltip />} />}
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            fill={color}
                            fillOpacity={0.1}
                            strokeWidth={2}
                            dot={{ fill: color, strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                        />
                    </AreaChart>
                );

            case ChartType.BAR:
                return (
                    <BarChart {...commonProps}>
                        {showGrid && (
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        )}
                        <XAxis {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        {showTooltip && <Tooltip content={<CustomTooltip />} />}
                        <Bar
                            dataKey="value"
                            fill={color}
                            radius={[4, 4, 0, 0]}
                            opacity={0.8}
                        />
                    </BarChart>
                );

            default: // ChartType.LINE
                return (
                    <LineChart {...commonProps}>
                        {showGrid && (
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        )}
                        <XAxis {...xAxisProps} />
                        <YAxis {...yAxisProps} />
                        {showTooltip && <Tooltip content={<CustomTooltip />} />}
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            dot={{ fill: color, strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                        />
                    </LineChart>
                );
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <Card
                bg={cardBg}
                borderColor={borderColor}
                borderWidth="1px"
                borderRadius="xl"
                overflow="hidden"
            >
                <CardHeader pb={3}>
                    <Flex justify="space-between" align="center">
                        <Skeleton height="20px" width="150px" />
                        <Skeleton height="20px" width="60px" />
                    </Flex>
                </CardHeader>
                <CardBody pt={0}>
                    <Skeleton height={`${height}px`} borderRadius="md" />
                </CardBody>
            </Card>
        );
    }

    // Empty state
    if (!chartData || chartData.length === 0) {
        return (
            <Card
                bg={cardBg}
                borderColor={borderColor}
                borderWidth="1px"
                borderRadius="xl"
                overflow="hidden"
            >
                <CardHeader pb={3}>
                    <Flex justify="space-between" align="center">
                        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                            {title}
                        </Text>
                        <Badge colorScheme="gray" variant="subtle">
                            No Data
                        </Badge>
                    </Flex>
                </CardHeader>
                <CardBody pt={0}>
                    <Flex
                        align="center"
                        justify="center"
                        height={`${height}px`}
                        bg="gray.50"
                        borderRadius="md"
                        flexDirection="column"
                        gap={2}
                    >
                        <Text color="gray.500" fontSize="md" fontWeight="medium">
                            No data available
                        </Text>
                        <Text color="gray.400" fontSize="sm">
                            Data will appear here when available
                        </Text>
                    </Flex>
                </CardBody>
            </Card>
        );
    }

    // Main chart render
    return (
        <Card
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.2s"
            _hover={{
                boxShadow: 'md',
            }}
        >
            <CardHeader pb={3}>
                <Flex justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                        {title}
                    </Text>

                    {trendInfo && (
                        <Badge
                            colorScheme={trendInfo.isPositive ? 'green' : 'red'}
                            variant="subtle"
                            fontSize="xs"
                            fontWeight="medium"
                        >
                            {trendInfo.isPositive ? '+' : ''}
                            {trendInfo.percentChange.toFixed(1)}%
                        </Badge>
                    )}
                </Flex>
            </CardHeader>

            <CardBody pt={0}>
                <Box height={`${height}px`}>
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                    </ResponsiveContainer>
                </Box>

                {/* Chart summary */}
                <Flex justify="space-between" align="center" mt={4} pt={4} borderTop="1px solid" borderColor={borderColor}>
                    <Text fontSize="sm" color={textColor}>
                        {chartData.length} data points
                    </Text>

                    {trendInfo && trendInfo.isSignificant && (
                        <Text fontSize="sm" color={trendInfo.isPositive ? 'green.600' : 'red.600'} fontWeight="medium">
                            {trendInfo.isPositive ? 'Trending up' : 'Trending down'}
                        </Text>
                    )}
                </Flex>
            </CardBody>
        </Card>
    );
};

export default TrendChart;