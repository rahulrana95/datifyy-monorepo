# Location Search Integration for Curate Dates

## Overview
This document shows how to integrate the Mapbox location search component into the curate-dates section for offline date location selection.

## Setup

### 1. Environment Variable
Add your Mapbox access token to `.env`:
```
REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

### 2. Import the Component
```tsx
import { LocationSearch, ParsedLocation } from '../../common/LocationSearch';
```

## Integration Example

### In SlotSelectionModal or Date Configuration Component

```tsx
import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { LocationSearch, ParsedLocation } from '../../common/LocationSearch';

// In your component
const DateLocationSelector: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<ParsedLocation | null>(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleLocationSelect = (location: ParsedLocation) => {
    setSelectedLocation(location);
    
    // Save the location data you need
    console.log({
      displayName: location.displayName,
      fullAddress: location.fullAddress,
      latitude: location.latitude,
      longitude: location.longitude,
      city: location.city,
      state: location.state,
      postalCode: location.postalCode,
      googleMapsUrl: location.googleMapsUrl,
    });
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Select Date Location</FormLabel>
        <LocationSearch
          placeholder="Search for cafes, restaurants, parks..."
          onLocationSelect={handleLocationSelect}
          types={['poi', 'address']} // Points of interest and addresses
          countries={['IN']} // Limit to India
          maxResults={8}
          size="md"
          required
        />
      </FormControl>

      {selectedLocation && (
        <Box bg={bgColor} p={4} borderRadius="md">
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">{selectedLocation.displayName}</Text>
            <Text fontSize="sm" color="gray.600">
              {selectedLocation.fullAddress}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {selectedLocation.city}, {selectedLocation.state} {selectedLocation.postalCode}
            </Text>
            <a 
              href={selectedLocation.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'var(--chakra-colors-brand-500)', fontSize: '14px' }}
            >
              View on Google Maps →
            </a>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};
```

### In SlotSelector Component (for offline slots)

```tsx
// Add to the offline slot selection section
{selectedSlots.offline && (
  <Box mt={4}>
    <FormControl isRequired>
      <FormLabel>Meeting Location</FormLabel>
      <LocationSearch
        placeholder="Search for a meeting location..."
        onLocationSelect={(location) => {
          // Update the offline slot with location
          onSlotUpdate({
            ...selectedSlots.offline,
            location: {
              id: location.id,
              name: location.displayName,
              address: location.fullAddress,
              latitude: location.latitude,
              longitude: location.longitude,
              googleMapsUrl: location.googleMapsUrl,
              city: location.city,
              state: location.state,
              postalCode: location.postalCode,
            }
          });
        }}
        types={['poi', 'address']}
        countries={['IN']}
        size="sm"
      />
    </FormControl>
  </Box>
)}
```

### In Date Summary/Configuration

```tsx
// Show selected location in the date summary
{curatedDate.mode === 'offline' && curatedDate.location && (
  <HStack spacing={3}>
    <Icon as={FiMapPin} color="purple.500" />
    <VStack align="start" spacing={0}>
      <Text fontWeight="medium">{curatedDate.location.name}</Text>
      <Text fontSize="sm" color="gray.600">
        {curatedDate.location.address}
      </Text>
      <Link
        href={curatedDate.location.googleMapsUrl}
        isExternal
        color="brand.500"
        fontSize="sm"
      >
        View on Map
      </Link>
    </VStack>
  </HStack>
)}
```

## Data Structure

When a location is selected, you'll receive:

```typescript
interface ParsedLocation {
  id: string;                // Unique Mapbox ID
  displayName: string;       // Short name (e.g., "Starbucks")
  fullAddress: string;       // Full address string
  latitude: number;          // Latitude coordinate
  longitude: number;         // Longitude coordinate
  city: string;              // City name
  state: string;             // State name
  stateCode?: string;        // State code (e.g., "MH")
  country: string;           // Country name
  countryCode?: string;      // Country code (e.g., "IN")
  postalCode?: string;       // Postal/PIN code
  googleMapsUrl: string;     // Direct Google Maps link
  mapboxPlaceId: string;     // Mapbox place ID
  placeType: string;         // Type of place (poi, address, etc.)
}
```

## Features

### 1. Search Debouncing
- Searches are debounced by 300ms to avoid excessive API calls
- Loading spinner shows during search

### 2. Minimum Search Length
- Requires at least 3 characters to search
- Configurable via `minSearchLength` prop

### 3. Location Types
- `poi`: Points of interest (cafes, restaurants, parks)
- `address`: Street addresses
- `place`: Cities and towns
- `locality`: Neighborhoods

### 4. Country Filtering
- Default limited to India (`['IN']`)
- Can be changed to any ISO country codes

### 5. Error Handling
- Shows warning if Mapbox token not configured
- Graceful error handling for API failures

## Storing Location Data

When creating the curated date, include the location data:

```typescript
const curatedDate = {
  // ... other date fields
  mode: 'offline',
  location: {
    id: selectedLocation.id,
    name: selectedLocation.displayName,
    address: selectedLocation.fullAddress,
    coordinates: {
      lat: selectedLocation.latitude,
      lng: selectedLocation.longitude,
    },
    googleMapsUrl: selectedLocation.googleMapsUrl,
    city: selectedLocation.city,
    state: selectedLocation.state,
    postalCode: selectedLocation.postalCode,
  }
};
```

## Testing

1. **Without Token**: Component shows warning message
2. **With Token**: Search functionality works
3. **Search**: Type at least 3 characters to see results
4. **Selection**: Click a result to select it
5. **Clear**: Click X to clear search

## Best Practices

1. **Save Complete Location Data**: Store all location fields for future use
2. **Show Google Maps Link**: Always provide users a way to view on Google Maps
3. **Validate Selection**: For offline dates, make location required
4. **Display Full Address**: Show complete address in summaries
5. **Handle Loading States**: Show spinner during search