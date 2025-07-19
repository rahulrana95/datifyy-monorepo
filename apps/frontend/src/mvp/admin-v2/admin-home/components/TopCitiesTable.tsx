/**
 * TopCitiesTable Component
 * Displays top revenue generating cities
 */

import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Badge,
  Text,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  HStack,
  Progress,
} from '@chakra-ui/react';
import { CityRevenue } from '../types';

interface TopCitiesTableProps {
  cities: CityRevenue[];
  isLoading?: boolean;
}

const TopCitiesTable: React.FC<TopCitiesTableProps> = ({ cities, isLoading = false }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  
  // Calculate max revenue for percentage calculation
  const maxRevenue = cities.length > 0 ? Math.max(...cities.map(c => c.revenue)) : 0;

  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <Skeleton height="30px" width="200px" mb={4} />
        <Box>
          {[...Array(5)].map((_, i) => (
            <Box key={i} py={2}>
              <SkeletonText noOfLines={1} spacing={4} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
      overflow="hidden"
    >
      <Box p={6} pb={0}>
        <Heading size="md" mb={4}>
          Top Revenue Cities
        </Heading>
      </Box>
      
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg={headerBg}>
            <Tr>
              <Th>Rank</Th>
              <Th>City</Th>
              <Th isNumeric>Users</Th>
              <Th isNumeric>Revenue</Th>
              <Th>Trend</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cities.slice(0, 10).map((city, index) => (
              <Tr key={city.city} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                <Td>
                  <Badge
                    colorScheme={index < 3 ? 'green' : 'gray'}
                    variant={index < 3 ? 'solid' : 'subtle'}
                    borderRadius="full"
                    px={2}
                  >
                    {index + 1}
                  </Badge>
                </Td>
                <Td>
                  <Box>
                    <Text fontWeight="medium">{city.city}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {city.state}, {city.country}
                    </Text>
                  </Box>
                </Td>
                <Td isNumeric>
                  <Text fontWeight="medium">
                    {city.userCount.toLocaleString('en-IN')}
                  </Text>
                </Td>
                <Td isNumeric>
                  <Text fontWeight="bold" color="green.500">
                    ₹{city.revenue.toLocaleString('en-IN')}
                  </Text>
                </Td>
                <Td>
                  <Box width="80px">
                    <Progress
                      value={(city.revenue / maxRevenue) * 100}
                      size="sm"
                      colorScheme="brand"
                      borderRadius="full"
                    />
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default TopCitiesTable;