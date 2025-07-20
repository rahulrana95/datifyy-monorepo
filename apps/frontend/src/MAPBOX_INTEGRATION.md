# Mapbox Integration Guide

## Overview
This guide covers the Mapbox location search integration in the Datifyy application, providing a reusable component for location selection with geocoding capabilities.

## Setup

### 1. Get Mapbox Access Token
1. Go to https://console.mapbox.com/account/access-tokens
2. Create or copy your access token
3. Add to your `.env` file:
```bash
REACT_APP_MAPBOX_ACCESS_TOKEN=your_token_here
```

### 2. Component Structure

```
src/
├── services/
│   └── mapboxService.ts          # Mapbox API service layer
├── mvp/common/LocationSearch/
│   ├── LocationSearch.tsx        # Main component
│   └── index.ts                  # Exports
└── utils/
    └── debounce.ts              # Debounce utility
```

## Usage

### Basic Usage
```tsx
import { LocationSearch } from '../common/LocationSearch';

<LocationSearch
  placeholder="Search for a location..."
  onLocationSelect={(location) => {
    console.log('Selected:', location);
  }}
/>
```

### Advanced Usage with All Props
```tsx
<LocationSearch
  placeholder="Search cafes, restaurants, parks..."
  onLocationSelect={handleLocationSelect}
  multiSelect={false}                    // Single selection
  minSearchLength={3}                    // Min 3 chars to search
  searchDelay={300}                      // 300ms debounce
  maxResults={5}                         // Show 5 results
  countries={['IN']}                     // India only
  types={['poi', 'address', 'place']}   // Location types
  showSelectedTags={true}                // Show selected tags
  isDisabled={false}                     // Enable/disable
  size="md"                              // sm, md, lg
  required={true}                        // Required field
  error="Please select a location"      // Error message
/>
```

### Multi-Select Mode
```tsx
const [selectedLocations, setSelectedLocations] = useState<ParsedLocation[]>([]);

<LocationSearch
  multiSelect={true}
  selectedLocations={selectedLocations}
  onLocationsChange={setSelectedLocations}
  placeholder="Select multiple locations..."
/>
```

## API Service

### mapboxService Methods

#### searchLocations
```typescript
const results = await mapboxService.searchLocations(query, {
  limit: 5,
  types: ['place', 'poi'],
  countries: ['IN'],
  language: 'en'
});
```

#### reverseGeocode
```typescript
const location = await mapboxService.reverseGeocode(latitude, longitude);
```

#### isConfigured
```typescript
if (mapboxService.isConfigured()) {
  // Service is ready to use
}
```

## Data Structure

### ParsedLocation Interface
```typescript
interface ParsedLocation {
  id: string;                // Unique identifier
  displayName: string;       // Short display name
  fullAddress: string;       // Complete address
  latitude: number;          // Latitude
  longitude: number;         // Longitude
  city: string;              // City name
  state: string;             // State/region name
  stateCode?: string;        // State code (e.g., "MH")
  country: string;           // Country name
  countryCode?: string;      // ISO country code
  postalCode?: string;       // ZIP/postal code
  googleMapsUrl: string;     // Google Maps link
  mapboxPlaceId: string;     // Mapbox place ID
  placeType: string;         // Type of location
}
```

## Location Types

- `poi`: Points of Interest (cafes, restaurants, landmarks)
- `address`: Street addresses
- `place`: Cities, towns, villages
- `locality`: Neighborhoods, districts
- `postcode`: Postal codes
- `country`: Countries
- `region`: States, provinces

## Features

### 1. Search Debouncing
- Prevents excessive API calls
- Default 300ms delay
- Configurable via `searchDelay` prop

### 2. Loading States
- Spinner during search
- Minimum height maintained

### 3. Dropdown Results
- Click outside to close
- Hover effects
- Type badges with colors

### 4. Error Handling
- No token warning
- API error handling
- Network failure graceful degradation

### 5. Clear Functionality
- X button to clear search
- Maintains focus after clear

## Integration Examples

### In Forms
```tsx
<FormControl isRequired>
  <FormLabel>Meeting Location</FormLabel>
  <LocationSearch
    placeholder="Search for meeting location..."
    onLocationSelect={handleLocationSelect}
    required
    error={errors.location}
  />
  {selectedLocation && (
    <FormHelperText>
      Selected: {selectedLocation.displayName}
    </FormHelperText>
  )}
</FormControl>
```

### With Validation
```tsx
const [locationError, setLocationError] = useState('');

const validateLocation = (location: ParsedLocation | null) => {
  if (!location) {
    setLocationError('Location is required');
    return false;
  }
  setLocationError('');
  return true;
};

<LocationSearch
  onLocationSelect={(location) => {
    setSelectedLocation(location);
    validateLocation(location);
  }}
  error={locationError}
  required
/>
```

### Storing in Database
```typescript
// When saving to database
const dateLocation = {
  mapboxId: location.id,
  name: location.displayName,
  address: location.fullAddress,
  coordinates: {
    lat: location.latitude,
    lng: location.longitude,
  },
  city: location.city,
  state: location.state,
  postalCode: location.postalCode,
  googleMapsUrl: location.googleMapsUrl,
};
```

## Styling

The component uses Chakra UI and respects color modes:
- Light mode: White background, gray borders
- Dark mode: Dark background, lighter borders
- Brand colors for selection states
- Responsive sizing (sm, md, lg)

## Performance Considerations

1. **Debouncing**: Reduces API calls during typing
2. **Result Limit**: Default 5 results, max 10 recommended
3. **Country Filter**: Limits results to specific countries
4. **Type Filter**: Reduces irrelevant results

## Troubleshooting

### Component shows "not configured" warning
- Check if `REACT_APP_MAPBOX_ACCESS_TOKEN` is set
- Restart dev server after adding env variable

### No search results
- Check minimum search length (default 3)
- Verify location types match query
- Check country filter settings

### API errors
- Verify token is valid
- Check network connectivity
- Monitor API rate limits

## Security

- Never commit access tokens
- Use environment variables
- Validate and sanitize location data
- Consider server-side geocoding for sensitive apps

## Future Enhancements

1. **Proximity Bias**: Search near user's location
2. **Recent Locations**: Store and show recent searches
3. **Favorite Locations**: Save frequently used locations
4. **Map Preview**: Show mini map in dropdown
5. **Custom Styling**: More theme customization options