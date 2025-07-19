/**
 * SearchableTable Component
 * Reusable table with search, sort, and pagination
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  HStack,
  Text,
  IconButton,
  Button,
  useColorModeValue,
  Highlight,
  Flex,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FiSearch, FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

interface SearchableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  subtitle?: string;
  onRowClick?: (item: T) => void;
  selectedRow?: T;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
}

function SearchableTable<T extends { id: string }>({
  data,
  columns,
  title,
  subtitle,
  onRowClick,
  selectedRow,
  searchValue = '',
  onSearchChange,
  pageSize = 10,
  currentPage = 1,
  totalItems,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: SearchableTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debouncedSearch = useDebounce(localSearch, 300);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('brand.50', 'brand.900');

  // Trigger search callback when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== searchValue) {
      onSearchChange?.(debouncedSearch);
    }
  }, [debouncedSearch, searchValue, onSearchChange]);

  // Update local search when prop changes
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortColumn];
      const bValue = (b as any)[sortColumn];

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  // Calculate pagination
  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : 1;
  const showingFrom = (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalItems || data.length);

  // Highlight search text
  const highlightText = (text: string) => {
    if (!debouncedSearch) return text;
    return (
      <Highlight query={debouncedSearch} styles={{ bg: 'yellow.200' }}>
        {text}
      </Highlight>
    );
  };

  // Get value from nested path
  const getValue = (item: any, key: string): any => {
    return key.split('.').reduce((obj, k) => obj?.[k], item);
  };

  return (
    <Box 
      bg={bgColor} 
      borderRadius="lg" 
      border="1px solid" 
      borderColor={borderColor} 
      overflow="hidden"
      h="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      {(title || subtitle) && (
        <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
          {title && (
            <Text fontSize="lg" fontWeight="semibold" mb={subtitle ? 1 : 0}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text fontSize="sm" color="gray.500">
              {subtitle}
            </Text>
          )}
        </Box>
      )}
      
      {/* Search and Controls */}
      <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
        <HStack justify="space-between">
          <InputGroup maxW="400px">
            <InputLeftElement 
              pointerEvents="none" 
              h="32px"
              width="32px"
            >
              <FiSearch color="gray.400" size="16" />
            </InputLeftElement>
            <Input
              placeholder="Search users..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              size="sm"
              pl="32px"
              pr={localSearch ? "32px" : 3}
              h="32px"
              _placeholder={{ color: 'gray.400' }}
            />
            {localSearch && (
              <InputRightElement
                h="32px"
                width="32px"
              >
                <IconButton
                  aria-label="Clear search"
                  icon={<FiX />}
                  size="xs"
                  variant="ghost"
                  onClick={() => setLocalSearch('')}
                />
              </InputRightElement>
            )}
          </InputGroup>

          <HStack>
            <Text fontSize="sm" color="gray.500">
              Show:
            </Text>
            <Select
              size="sm"
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              w="80px"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
          </HStack>
        </HStack>
      </Box>

      {/* Table */}
      <Box overflowX="auto" flex={1} position="relative">
        <Table variant="simple" size="sm" minW="100%">
          <Thead bg={headerBg}>
            <Tr>
              {columns.map((column) => (
                <Th
                  key={String(column.key)}
                  cursor={column.sortable ? 'pointer' : 'default'}
                  onClick={() => column.sortable && handleSort(column.key as string)}
                  width={column.width}
                  _hover={column.sortable ? { bg: hoverBg } : {}}
                >
                  <HStack spacing={1}>
                    <Text>{column.label}</Text>
                    {column.sortable && sortColumn === column.key && (
                      <Box>
                        {sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
                      </Box>
                    )}
                  </HStack>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <>
                {Array.from({ length: pageSize }).map((_, index) => (
                  <Tr key={`loading-${index}`} h="52px">
                    {columns.map((column, colIndex) => (
                      <Td key={String(column.key)} borderColor="gray.100">
                        {index === Math.floor(pageSize / 2) && colIndex === Math.floor(columns.length / 2) ? (
                          <Center>
                            <Spinner size="sm" color="brand.500" />
                          </Center>
                        ) : (
                          <Box>&nbsp;</Box>
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </>
            ) : sortedData.length === 0 ? (
              <>
                <Tr>
                  <Td colSpan={columns.length} border="none">
                    <Center py={4}>
                      <Text color="gray.500">
                        {debouncedSearch ? 'No results found' : 'No data available'}
                      </Text>
                    </Center>
                  </Td>
                </Tr>
                {/* Fill empty rows */}
                {Array.from({ length: pageSize - 1 }).map((_, index) => (
                  <Tr key={`empty-${index}`} h="52px">
                    {columns.map((column) => (
                      <Td key={String(column.key)} borderColor="gray.100">&nbsp;</Td>
                    ))}
                  </Tr>
                ))}
              </>
            ) : (
              <>
                {sortedData.map((item) => (
              <Tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                cursor={onRowClick ? 'pointer' : 'default'}
                bg={selectedRow?.id === item.id ? selectedBg : 'transparent'}
                _hover={{ bg: selectedRow?.id === item.id ? selectedBg : hoverBg }}
                h="52px"
              >
                {columns.map((column) => (
                  <Td key={String(column.key)}>
                    {column.render
                      ? column.render(getValue(item, column.key as string), item)
                      : highlightText(String(getValue(item, column.key as string) || ''))}
                  </Td>
                ))}
              </Tr>
                ))}
                {/* Fill empty rows to maintain consistent height */}
                {sortedData.length < pageSize && Array.from({ length: pageSize - sortedData.length }).map((_, index) => (
                  <Tr key={`empty-${index}`} h="52px">
                    {columns.map((column) => (
                      <Td key={String(column.key)} borderColor="gray.100">&nbsp;</Td>
                    ))}
                  </Tr>
                ))}
              </>
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <Box p={4} borderTop="1px solid" borderColor={borderColor}>
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color="gray.500">
            Showing {showingFrom} to {showingTo} of {totalItems || data.length} results
          </Text>

          <HStack spacing={1}>
            <IconButton
              aria-label="Previous page"
              icon={<FiChevronLeft />}
              size="xs"
              variant="outline"
              colorScheme="gray"
              isDisabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            />
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  size="xs"
                  variant={currentPage === pageNum ? 'solid' : 'outline'}
                  colorScheme={currentPage === pageNum ? 'brand' : 'gray'}
                  onClick={() => onPageChange?.(pageNum)}
                  minW="7"
                >
                  {pageNum}
                </Button>
              );
            })}

            {totalPages > 5 && <Text fontSize="sm" px={1}>...</Text>}

            <IconButton
              aria-label="Next page"
              icon={<FiChevronRight />}
              size="xs"
              variant="outline"
              colorScheme="gray"
              isDisabled={currentPage === totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}

export default SearchableTable;