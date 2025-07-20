import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  VStack,
  HStack,
  Text,
  Icon,
  Spinner,
  Badge,
  Collapse,
  useColorModeValue,
  useOutsideClick,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  FiMapPin,
  FiSearch,
  FiX,
  FiCheck,
} from 'react-icons/fi';
import mapboxService, { ParsedLocation } from '../../../services/mapboxService';
import { debounce } from '../../../utils/debounce';

export interface LocationSearchProps {
  placeholder?: string;
  onLocationSelect?: (location: ParsedLocation) => void;
  onLocationsChange?: (locations: ParsedLocation[]) => void;
  multiSelect?: boolean;
  selectedLocations?: ParsedLocation[];
  defaultValue?: string;
  minSearchLength?: number;
  searchDelay?: number;
  maxResults?: number;
  countries?: string[];
  types?: string[];
  showSelectedTags?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  error?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  placeholder = 'Search for a location...',
  onLocationSelect,
  onLocationsChange,
  multiSelect = false,
  selectedLocations = [],
  defaultValue = '',
  minSearchLength = 3,
  searchDelay = 300,
  maxResults = 5,
  countries = ['IN'], // Default to India
  types = ['place', 'locality', 'address', 'poi'],
  showSelectedTags = true,
  isDisabled = false,
  size = 'md',
  required = false,
  error,
}) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ParsedLocation[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(selectedLocations.map(loc => loc.id))
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const selectedBgColor = useColorModeValue('brand.50', 'brand.900');
  const errorColor = useColorModeValue('red.500', 'red.300');

  // Close dropdown when clicking outside
  useOutsideClick({
    ref: dropdownRef,
    handler: () => setIsDropdownOpen(false),
  });

  // Check if Mapbox is configured
  const isMapboxConfigured = mapboxService.isConfigured();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!isMapboxConfigured || query.length < minSearchLength) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const results = await mapboxService.searchLocations(query, {
          limit: maxResults,
          types,
          countries,
        });
        setSearchResults(results);
        setIsDropdownOpen(true);
      } catch (error) {
        console.error('Location search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, searchDelay),
    [isMapboxConfigured, minSearchLength, maxResults, types, countries]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= minSearchLength) {
      setIsSearching(true);
      debouncedSearch(query);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: ParsedLocation) => {
    if (multiSelect) {
      const newSelectedIds = new Set(selectedIds);
      
      if (newSelectedIds.has(location.id)) {
        newSelectedIds.delete(location.id);
      } else {
        newSelectedIds.add(location.id);
      }
      
      setSelectedIds(newSelectedIds);
      
      const newSelectedLocations = searchResults.filter(loc => 
        newSelectedIds.has(loc.id)
      );
      
      onLocationsChange?.(newSelectedLocations);
    } else {
      setSelectedIds(new Set([location.id]));
      setSearchQuery(location.displayName);
      setIsDropdownOpen(false);
      onLocationSelect?.(location);
    }
  };

  // Remove selected location (for multi-select)
  const handleRemoveLocation = (locationId: string) => {
    const newSelectedIds = new Set(selectedIds);
    newSelectedIds.delete(locationId);
    setSelectedIds(newSelectedIds);
    
    const newSelectedLocations = selectedLocations.filter(
      loc => loc.id !== locationId
    );
    
    onLocationsChange?.(newSelectedLocations);
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  // Get location type badge color
  const getLocationTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'place':
        return 'blue';
      case 'locality':
        return 'green';
      case 'address':
        return 'purple';
      case 'poi':
        return 'orange';
      default:
        return 'gray';
    }
  };

  if (!isMapboxConfigured) {
    return (
      <Alert status="warning" borderRadius="md">
        <AlertIcon />
        <Text>Location search is not configured. Please add Mapbox access token.</Text>
      </Alert>
    );
  }

  return (
    <VStack align="stretch" spacing={3} position="relative" ref={dropdownRef}>
      {/* Search Input */}
      <InputGroup size={size}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiMapPin} color="gray.400" />
        </InputLeftElement>
        
        <Input
          ref={inputRef}
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          isDisabled={isDisabled}
          isRequired={required}
          isInvalid={!!error}
          borderColor={error ? errorColor : borderColor}
          _focus={{
            borderColor: error ? errorColor : 'brand.500',
            boxShadow: error ? `0 0 0 1px ${errorColor}` : '0 0 0 1px var(--chakra-colors-brand-500)',
          }}
          pr="4rem"
        />
        
        <InputRightElement width="4rem">
          {isSearching ? (
            <Spinner size="sm" color="brand.500" />
          ) : searchQuery ? (
            <IconButton
              aria-label="Clear search"
              icon={<FiX />}
              size="sm"
              variant="ghost"
              onClick={handleClear}
            />
          ) : (
            <Icon as={FiSearch} color="gray.400" />
          )}
        </InputRightElement>
      </InputGroup>

      {/* Error Message */}
      {error && (
        <Text fontSize="sm" color={errorColor}>
          {error}
        </Text>
      )}

      {/* Selected Locations Tags (Multi-select) */}
      {multiSelect && showSelectedTags && selectedLocations.length > 0 && (
        <Wrap>
          {selectedLocations.map(location => (
            <WrapItem key={location.id}>
              <Tag
                size={size}
                borderRadius="full"
                variant="solid"
                colorScheme="brand"
              >
                <TagLabel>{location.displayName}</TagLabel>
                <TagCloseButton
                  onClick={() => handleRemoveLocation(location.id)}
                />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      )}

      {/* Search Results Dropdown */}
      <Collapse in={isDropdownOpen && searchResults.length > 0}>
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={1}
          bg={bgColor}
          borderRadius="md"
          boxShadow="lg"
          border="1px solid"
          borderColor={borderColor}
          maxH="300px"
          overflowY="auto"
          zIndex={1000}
        >
          <VStack align="stretch" spacing={0}>
            {searchResults.map((location, index) => {
              const isSelected = selectedIds.has(location.id);
              
              return (
                <Box
                  key={location.id}
                  px={4}
                  py={3}
                  cursor="pointer"
                  bg={isSelected ? selectedBgColor : 'transparent'}
                  _hover={{ bg: isSelected ? selectedBgColor : hoverBgColor }}
                  borderBottom={index < searchResults.length - 1 ? '1px solid' : 'none'}
                  borderColor={borderColor}
                  onClick={() => handleLocationSelect(location)}
                >
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack>
                        <Text fontWeight="medium" fontSize="sm">
                          {location.displayName}
                        </Text>
                        <Badge
                          colorScheme={getLocationTypeBadgeColor(location.placeType)}
                          size="sm"
                        >
                          {location.placeType}
                        </Badge>
                      </HStack>
                      
                      <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        {location.fullAddress}
                      </Text>
                      
                      <HStack spacing={2}>
                        {location.city && location.city !== location.displayName && (
                          <Text fontSize="xs" color="gray.400">
                            {location.city}
                          </Text>
                        )}
                        {location.state && (
                          <Text fontSize="xs" color="gray.400">
                            {location.state}
                          </Text>
                        )}
                        {location.postalCode && (
                          <Text fontSize="xs" color="gray.400">
                            {location.postalCode}
                          </Text>
                        )}
                      </HStack>
                    </VStack>
                    
                    {multiSelect && isSelected && (
                      <Icon as={FiCheck} color="brand.500" />
                    )}
                  </HStack>
                </Box>
              );
            })}
          </VStack>
        </Box>
      </Collapse>
    </VStack>
  );
};

// Missing import for IconButton
import { IconButton } from '@chakra-ui/react';

export default LocationSearch;