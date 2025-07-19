import React from 'react';
import { HStack, Button, IconButton, Text } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxButtons?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxButtons = 5,
}) => {
  const getPageNumbers = () => {
    const pages: number[] = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <HStack spacing={2} justify="center">
      {showFirstLast && (
        <IconButton
          aria-label="First page"
          icon={<FiChevronsLeft />}
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(1)}
          isDisabled={currentPage === 1}
        />
      )}
      
      <IconButton
        aria-label="Previous page"
        icon={<FiChevronLeft />}
        size="sm"
        variant="ghost"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
      />

      {pageNumbers[0] > 1 && (
        <>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {pageNumbers[0] > 2 && <Text>...</Text>}
        </>
      )}

      {pageNumbers.map((pageNum) => (
        <Button
          key={pageNum}
          size="sm"
          variant={currentPage === pageNum ? 'solid' : 'ghost'}
          colorScheme={currentPage === pageNum ? 'brand' : 'gray'}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </Button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <Text>...</Text>}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <IconButton
        aria-label="Next page"
        icon={<FiChevronRight />}
        size="sm"
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
      />

      {showFirstLast && (
        <IconButton
          aria-label="Last page"
          icon={<FiChevronsRight />}
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(totalPages)}
          isDisabled={currentPage === totalPages}
        />
      )}
    </HStack>
  );
};