/**
 * DatesTable Component
 * Table for displaying curated dates
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
  HStack,
  VStack,
  Text,
  Avatar,
  AvatarGroup,
  Badge,
  IconButton,
  Tooltip,
  useColorModeValue,
  Flex,
  Select,
} from '@chakra-ui/react';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiVideo, 
  FiMapPin,
  FiInfo,
  FiMessageSquare,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { CuratedDateDetails } from '../types';
import DateStatusBadge from './DateStatusBadge';

interface DatesTableProps {
  dates: CuratedDateDetails[];
  onDateSelect: (date: CuratedDateDetails) => void;
  selectedDate: CuratedDateDetails | null;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

const DatesTable: React.FC<DatesTableProps> = ({
  dates,
  onDateSelect,
  selectedDate,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('brand.50', 'brand.900');

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / pageSize);
  const showingFrom = (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalItems);

  return (
    <Box bg={bgColor} borderRadius="lg" border="1px solid" borderColor={borderColor} overflow="hidden">
      {/* Table */}
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
            <Tr>
              <Th>Date ID</Th>
              <Th>Users</Th>
              <Th>Type</Th>
              <Th>Scheduled</Th>
              <Th>Status</Th>
              <Th>Match Score</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dates.map((date) => (
              <Tr
                key={date.id}
                onClick={() => onDateSelect(date)}
                cursor="pointer"
                bg={selectedDate?.id === date.id ? selectedBg : 'transparent'}
                _hover={{ bg: selectedDate?.id === date.id ? selectedBg : hoverBg }}
              >
                <Td>
                  <Text fontWeight="medium" fontSize="sm">
                    {date.dateId}
                  </Text>
                </Td>
                <Td>
                  <HStack spacing={3}>
                    <AvatarGroup size="sm" max={2}>
                      <Avatar 
                        src={date.user1.profilePicture} 
                        name={`${date.user1.firstName} ${date.user1.lastName}`}
                      />
                      <Avatar 
                        src={date.user2.profilePicture} 
                        name={`${date.user2.firstName} ${date.user2.lastName}`}
                      />
                    </AvatarGroup>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs">{date.user1.firstName} & {date.user2.firstName}</Text>
                      <Text fontSize="xs" color="gray.500">{date.user1.city}</Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td>
                  <Badge colorScheme={date.dateType === 'online' ? 'blue' : 'green'}>
                    <HStack spacing={1}>
                      {date.dateType === 'online' ? <FiVideo size={10} /> : <FiMapPin size={10} />}
                      <Text>{date.dateType}</Text>
                    </HStack>
                  </Badge>
                </Td>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm">
                      {format(new Date(date.scheduledAt), 'MMM dd, yyyy')}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {format(new Date(date.scheduledAt), 'hh:mm a')}
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <DateStatusBadge status={date.status} />
                </Td>
                <Td>
                  <Badge colorScheme={date.matchScore > 80 ? 'green' : 'yellow'}>
                    {date.matchScore}%
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={1} onClick={(e) => e.stopPropagation()}>
                    <Tooltip label="View Details">
                      <IconButton
                        aria-label="View details"
                        icon={<FiInfo />}
                        size="xs"
                        variant="ghost"
                        onClick={() => onDateSelect(date)}
                      />
                    </Tooltip>
                    {date.notes && (
                      <Tooltip label="Has notes">
                        <Box>
                          <FiMessageSquare size={14} color="orange" />
                        </Box>
                      </Tooltip>
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <Box p={4} borderTop="1px solid" borderColor={borderColor}>
        <Flex justify="space-between" align="center">
          <HStack>
            <Text fontSize="sm" color="gray.500">
              Show:
            </Text>
            <Select
              size="sm"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              w="80px"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
            <Text fontSize="sm" color="gray.500">
              Showing {showingFrom} to {showingTo} of {totalItems} dates
            </Text>
          </HStack>

          <HStack>
            <IconButton
              aria-label="Previous page"
              icon={<FiChevronLeft />}
              size="sm"
              variant="outline"
              isDisabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            />
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <IconButton
                  key={pageNum}
                  aria-label={`Page ${pageNum}`}
                  size="sm"
                  variant={currentPage === pageNum ? 'solid' : 'outline'}
                  colorScheme={currentPage === pageNum ? 'brand' : 'gray'}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </IconButton>
              );
            })}

            {totalPages > 5 && <Text>...</Text>}

            <IconButton
              aria-label="Next page"
              icon={<FiChevronRight />}
              size="sm"
              variant="outline"
              isDisabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};

export default DatesTable;