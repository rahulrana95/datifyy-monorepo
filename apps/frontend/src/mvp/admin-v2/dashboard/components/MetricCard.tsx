// apps/frontend/src/mvp/admin-v2/dashboard/components/MetricCard.tsx

import React from 'react';
import {
    Box,
    Card,
    CardBody,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Flex,
    Icon,
    Skeleton,
    Badge,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { formatMetricValue, formatRevenue, getTrendDisplay } from '../utils/formatters';
import type { MetricCardProps } from '../types';
import { METRIC_CARD_VARIANTS, MetricVariant, TrendDirection } from '../types';

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    trend,
    icon,
    format = 'number',
    isLoading = false,
    variant = MetricVariant.DEFAULT,
}) => {
    // Theme colors
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const numberColor = useColorModeValue('gray.900', 'white');

    // Get variant styles
    const variantStyles = METRIC_CARD_VARIANTS[variant];

    // Format the main value based on type
    const formatValue = (val: number | string): string => {
        const numValue = typeof val === 'string' ? parseFloat(val) : val;

        if (isNaN(numValue)) return '0';

        switch (format) {
            case 'currency':
                return formatRevenue(numValue);
            case 'percentage':
                return `${numValue.toFixed(1)}%`;
            default:
                return formatMetricValue(numValue);
        }
    };

    // Get trend display info
    const trendDisplay = trend ? getTrendDisplay(trend.direction, trend.percentage) : null;

    if (isLoading) {
        return (
            <Card
                bg={cardBg}
                borderColor={borderColor}
                borderWidth="1px"
                borderRadius="xl"
                overflow="hidden"
                transition="all 0.2s"
                _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                }}
            >
                <CardBody p={6}>
                    <Flex justify="space-between" align="flex-start" mb={4}>
                        <Box flex="1">
                            <Skeleton height="16px" width="120px" mb={2} />
                            <Skeleton height="32px" width="80px" />
                        </Box>
                        {icon && (
                            <Skeleton
                                width="40px"
                                height="40px"
                                borderRadius="lg"
                            />
                        )}
                    </Flex>
                    <Skeleton height="14px" width="100px" />
                </CardBody>
            </Card>
        );
    }

    return (
        <Card
            bg={variant !== MetricVariant.DEFAULT ? variantStyles.bg : cardBg}
            borderColor={variant !== MetricVariant.DEFAULT ? variantStyles.borderColor : borderColor}
            borderWidth="1px"
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.2s"
            _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
            }}
        >
            <CardBody p={6}>
                <Flex justify="space-between" align="flex-start" mb={4}>
                    <Box flex="1">
                        <Stat>
                            <StatLabel
                                color={textColor}
                                fontSize="sm"
                                fontWeight="medium"
                                mb={2}
                                noOfLines={2}
                            >
                                {title}
                            </StatLabel>

                            <StatNumber
                                color={numberColor}
                                fontSize="2xl"
                                fontWeight="bold"
                                lineHeight="1.2"
                                mb={2}
                            >
                                {formatValue(value)}
                            </StatNumber>

                            {trend && (
                                <StatHelpText mb={0} display="flex" alignItems="center" gap={2}>
                                    <Flex
                                        align="center"
                                        gap={1}
                                        bg={trendDisplay?.bgColor}
                                        color={trendDisplay?.color}
                                        px={2}
                                        py={1}
                                        borderRadius="md"
                                        fontSize="xs"
                                        fontWeight="semibold"
                                    >
                                        <StatArrow type={trend.direction === TrendDirection.UP ? 'increase' : 'decrease'} />
                                        <Text>{trendDisplay?.label}</Text>
                                    </Flex>

                                    {trend.label && (
                                        <Text
                                            fontSize="xs"
                                            color={textColor}
                                            fontWeight="medium"
                                        >
                                            {trend.label}
                                        </Text>
                                    )}
                                </StatHelpText>
                            )}
                        </Stat>
                    </Box>

                    {icon && (
                        <Flex
                            align="center"
                            justify="center"
                            w="48px"
                            h="48px"
                            bg={variant !== MetricVariant.DEFAULT ? 'rgba(255, 255, 255, 0.1)' : 'gray.100'}
                            borderRadius="lg"
                            color={variant !== MetricVariant.DEFAULT ? variantStyles.iconColor : 'gray.500'}
                            fontSize="20px"
                        >
                            {React.isValidElement(icon) ? icon : <Icon as={icon as any} />}
                        </Flex>
                    )}
                </Flex>

                {/* Additional badges or status indicators can go here */}
                {variant === MetricVariant.REVENUE && (
                    <Badge
                        colorScheme="green"
                        variant="subtle"
                        fontSize="xs"
                        fontWeight="medium"
                    >
                        Revenue
                    </Badge>
                )}

                {variant === MetricVariant.USERS && (
                    <Badge
                        colorScheme="blue"
                        variant="subtle"
                        fontSize="xs"
                        fontWeight="medium"
                    >
                        Users
                    </Badge>
                )}

                {variant === MetricVariant.DATES && (
                    <Badge
                        colorScheme="pink"
                        variant="subtle"
                        fontSize="xs"
                        fontWeight="medium"
                    >
                        Dates
                    </Badge>
                )}
            </CardBody>
        </Card>
    );
};

export default MetricCard;