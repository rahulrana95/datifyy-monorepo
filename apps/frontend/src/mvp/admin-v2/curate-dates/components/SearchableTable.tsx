/**
 * SearchableTable Component
 * Reusable table with search, sort, and pagination
 */

import React, { useState, useMemo } from 'react';
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
  Select,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
  Highlight,
  Flex,
} from '@chakra-ui/react';
import { FiSearch, FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
  onRowClick?: (item: T) => void;
  selectedRow?: T;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

function SearchableTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  selectedRow,
  searchValue = '',
  onSearchChange,
  pageSize = 10,
  currentPage = 1,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: SearchableTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [localSearch, setLocalSearch] = useState(searchValue);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('brand.50', 'brand.900');

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
    if (!localSearch) return text;
    return (
      <Highlight query={localSearch} styles={{ bg: 'yellow.200' }}>
        {text}
      </Highlight>
    );
  };

  // Get value from nested path
  const getValue = (item: any, key: string): any => {
    return key.split('.').reduce((obj, k) => obj?.[k], item);
  };

  return (
    <Box bg={bgColor} borderRadius="lg" border="1px solid" borderColor={borderColor} overflow="hidden">
      {/* Search and Controls */}
      <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
        <HStack justify="space-between">
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search users..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                onSearchChange?.(e.target.value);
              }}
              size="sm"
            />
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
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
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
            {sortedData.map((item) => (
              <Tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                cursor={onRowClick ? 'pointer' : 'default'}
                bg={selectedRow?.id === item.id ? selectedBg : 'transparent'}
                _hover={{ bg: selectedRow?.id === item.id ? selectedBg : hoverBg }}
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
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <Box p={4} borderTop="1px solid" borderColor={borderColor}>
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" color="gray.500">
            Showing {showingFrom} to {showingTo} of {totalItems || data.length} results
          </Text>

          <HStack>
            <IconButton
              aria-label="Previous page"
              icon={<FiChevronLeft />}
              size="sm"
              variant="outline"
              isDisabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage - 1)}
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
                  onClick={() => onPageChange?.(pageNum)}
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
              onClick={() => onPageChange?.(currentPage + 1)}
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}

export default SearchableTable;