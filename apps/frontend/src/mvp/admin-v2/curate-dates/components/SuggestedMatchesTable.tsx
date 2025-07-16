/**
 * SuggestedMatchesTable Component
 * Displays suggested matches with slot availability
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
  Avatar,
  Text,
  HStack,
  VStack,
  Badge,
  Button,
  useColorModeValue,
  Tooltip,
  Progress,
  Select,
  FormControl,
  FormLabel,
  Checkbox,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { FiCalendar, FiVideo, FiMapPin, FiFilter } from 'react-icons/fi';
import { SuggestedMatch, SuggestedMatchFilters } from '../types';

interface SuggestedMatchesTableProps {
  matches: SuggestedMatch[];
  onMatchSelect: (match: SuggestedMatch) => void;
  selectedMatch: SuggestedMatch | null;
  filters: SuggestedMatchFilters;
  onFiltersChange: (filters: Partial<SuggestedMatchFilters>) => void;
  isLoading?: boolean;
}

const SuggestedMatchesTable: React.FC<SuggestedMatchesTableProps> = ({
  matches,
  onMatchSelect,
  selectedMatch,
  filters,
  onFiltersChange,
  isLoading = false,
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('brand.50', 'brand.900');

  return (
    <Box bg={bgColor} borderRadius="lg" border="1px solid" borderColor={borderColor}>
      {/* Header and Filters */}
      <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
        <HStack justify="space-between" mb={4}>
          <Text fontSize="lg" fontWeight="bold">Suggested Matches</Text>
          <Button
            leftIcon={<FiFilter />}
            size="sm"
            variant="outline"
            onClick={onToggle}
          >
            Filters
          </Button>
        </HStack>

        <Collapse in={isOpen} animateOpacity>
          <VStack spacing={3} align="stretch" bg="gray.50" p={3} borderRadius="md">
            <HStack spacing={4}>
              <FormControl flex={1}>
                <FormLabel fontSize="sm">Min Match Score</FormLabel>
                <Select
                  size="sm"
                  value={filters.minMatchScore || ''}
                  onChange={(e) => onFiltersChange({ minMatchScore: Number(e.target.value) || undefined })}
                >
                  <option value="">Any Score</option>
                  <option value="70">70%+</option>
                  <option value="80">80%+</option>
                  <option value="90">90%+</option>
                </Select>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel fontSize="sm">Common Slots</FormLabel>
                <Select
                  size="sm"
                  value={filters.hasCommonSlots || 'all'}
                  onChange={(e) => onFiltersChange({ hasCommonSlots: e.target.value as any })}
                >
                  <option value="all">All</option>
                  <option value="online">Online Only</option>
                  <option value="offline">Offline Only</option>
                  <option value="both">Both Types</option>
                </Select>
              </FormControl>
            </HStack>

            <HStack>
              <Checkbox
                isChecked={filters.noPreviousDates}
                onChange={(e) => onFiltersChange({ noPreviousDates: e.target.checked })}
              >
                <Text fontSize="sm">No Previous Dates</Text>
              </Checkbox>
            </HStack>
          </VStack>
        </Collapse>
      </Box>

      {/* Table */}
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg={headerBg}>
            <Tr>
              <Th>User</Th>
              <Th>Match Score</Th>
              <Th>Available Slots</Th>
              <Th>Previous Dates</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {matches.map((match) => (
              <Tr
                key={match.user.id}
                bg={selectedMatch?.user.id === match.user.id ? selectedBg : 'transparent'}
                _hover={{ bg: selectedMatch?.user.id === match.user.id ? selectedBg : 'gray.50' }}
                cursor="pointer"
                onClick={() => onMatchSelect(match)}
              >
                <Td>
                  <HStack>
                    <Avatar src={match.user.profilePicture} size="sm" name={match.user.firstName} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">
                        {match.user.firstName} {match.user.lastName}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {match.user.age}y • {match.user.city}
                      </Text>
                    </VStack>
                  </HStack>
                </Td>
                
                <Td>
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <Progress
                        value={match.matchScore}
                        size="sm"
                        colorScheme={match.matchScore > 80 ? 'green' : match.matchScore > 60 ? 'yellow' : 'red'}
                        width="60px"
                      />
                      <Text fontSize="sm" fontWeight="bold">
                        {match.matchScore}%
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      {match.compatibilityReasons[0]}
                    </Text>
                  </VStack>
                </Td>
                
                <Td>
                  <HStack spacing={3}>
                    <Tooltip label="Online slots available">
                      <Badge colorScheme="blue" variant="solid">
                        <HStack spacing={1}>
                          <FiVideo size={12} />
                          <Text>{match.matchingSlotsCounts.online}</Text>
                        </HStack>
                      </Badge>
                    </Tooltip>
                    <Tooltip label="Offline slots available">
                      <Badge colorScheme="purple" variant="solid">
                        <HStack spacing={1}>
                          <FiMapPin size={12} />
                          <Text>{match.matchingSlotsCounts.offline}</Text>
                        </HStack>
                      </Badge>
                    </Tooltip>
                  </HStack>
                </Td>
                
                <Td>
                  {match.previousDates && match.previousDates.length > 0 ? (
                    <Badge colorScheme="orange">{match.previousDates.length} dates</Badge>
                  ) : (
                    <Badge colorScheme="green">First time</Badge>
                  )}
                  {match.alreadyHasDateThisWeek && (
                    <Badge colorScheme="red" ml={1}>Busy this week</Badge>
                  )}
                </Td>
                
                <Td>
                  <Button
                    size="xs"
                    colorScheme="brand"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMatchSelect(match);
                    }}
                  >
                    View Slots
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {matches.length === 0 && !isLoading && (
        <Box p={8} textAlign="center">
          <Text color="gray.500">No matches found</Text>
        </Box>
      )}
    </Box>
  );
};

export default SuggestedMatchesTable;