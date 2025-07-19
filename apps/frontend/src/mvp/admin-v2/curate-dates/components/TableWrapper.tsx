/**
 * TableWrapper Component
 * Provides consistent dimensions for tables to prevent layout shifts
 */

import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface TableWrapperProps extends BoxProps {
  children: React.ReactNode;
  pageSize?: number;
  hasHeader?: boolean;
  hasFooter?: boolean;
}

const TableWrapper: React.FC<TableWrapperProps> = ({
  children,
  pageSize = 10,
  hasHeader = true,
  hasFooter = true,
  ...props
}) => {
  // Calculate heights
  const headerHeight = hasHeader ? 120 : 0; // Header with title and search
  const tableHeaderHeight = 40; // Table header row
  const rowHeight = 52; // Each data row
  const footerHeight = hasFooter ? 68 : 0; // Pagination footer
  const paddingHeight = 32; // Additional padding
  
  const minHeight = headerHeight + tableHeaderHeight + (rowHeight * pageSize) + footerHeight + paddingHeight;
  
  return (
    <Box
      position="relative"
      minH={`${minHeight}px`}
      maxH={`${minHeight}px`}
      overflow="hidden"
      display="flex"
      flexDirection="column"
      {...props}
    >
      {children}
    </Box>
  );
};

export default TableWrapper;