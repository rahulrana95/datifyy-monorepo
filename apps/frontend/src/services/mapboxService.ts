/**
 * Mapbox Service
 * Handles all Mapbox API interactions for location search and geocoding
 */

export interface MapboxLocation {
  id: string;
  place_name: string;
  place_type: string[];
  text: string;
  properties?: {
    short_code?: string;
    wikidata?: string;
  };
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
  center: [number, number]; // [longitude, latitude]
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  relevance: number;
}

export interface ParsedLocation {
  id: string;
  displayName: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  stateCode?: string;
  country: string;
  countryCode?: string;
  postalCode?: string;
  googleMapsUrl: string;
  mapboxPlaceId: string;
  placeType: string;
}

interface MapboxSearchResponse {
  type: string;
  features: MapboxLocation[];
  attribution: string;
}

class MapboxService {
  private readonly accessToken: string;
  private readonly baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
  
  constructor() {
    this.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';
    if (!this.accessToken) {
      console.warn('Mapbox access token not found in environment variables');
    }
  }

  /**
   * Search for locations using Mapbox Geocoding API
   * @param query - Search query
   * @param options - Search options
   * @returns Array of parsed locations
   */
  async searchLocations(
    query: string,
    options: {
      limit?: number;
      types?: string[]; // e.g., ['place', 'locality', 'address', 'poi']
      countries?: string[]; // ISO 3166-1 alpha-2 country codes
      proximity?: [number, number]; // [longitude, latitude] for proximity bias
      language?: string; // Language code
    } = {}
  ): Promise<ParsedLocation[]> {
    if (!this.accessToken) {
      throw new Error('Mapbox access token is not configured');
    }

    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const params = new URLSearchParams({
        access_token: this.accessToken,
        limit: String(options.limit || 5),
        ...(options.types && { types: options.types.join(',') }),
        ...(options.countries && { country: options.countries.join(',') }),
        ...(options.proximity && { proximity: options.proximity.join(',') }),
        ...(options.language && { language: options.language }),
      });

      const url = `${this.baseUrl}/${encodeURIComponent(query)}.json?${params}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
      }

      const data: MapboxSearchResponse = await response.json();
      
      return data.features.map(feature => this.parseLocation(feature));
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  }

  /**
   * Get location details by coordinates (reverse geocoding)
   * @param latitude - Latitude
   * @param longitude - Longitude
   * @returns Parsed location or null
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<ParsedLocation | null> {
    if (!this.accessToken) {
      throw new Error('Mapbox access token is not configured');
    }

    try {
      const params = new URLSearchParams({
        access_token: this.accessToken,
        limit: '1',
      });

      const url = `${this.baseUrl}/${longitude},${latitude}.json?${params}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
      }

      const data: MapboxSearchResponse = await response.json();
      
      if (data.features.length === 0) {
        return null;
      }

      return this.parseLocation(data.features[0]);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }

  /**
   * Parse Mapbox location to our standardized format
   */
  private parseLocation(feature: MapboxLocation): ParsedLocation {
    const [longitude, latitude] = feature.center;
    
    // Extract location components from context
    let city = '';
    let state = '';
    let stateCode = '';
    let country = '';
    let countryCode = '';
    let postalCode = '';

    // Parse the main text (usually the most specific part)
    if (feature.place_type.includes('address') || feature.place_type.includes('poi')) {
      // For addresses and POIs, the text is usually the street or place name
      // City might be in the context
    } else if (feature.place_type.includes('place')) {
      city = feature.text;
    }

    // Parse context for additional information
    if (feature.context) {
      feature.context.forEach(context => {
        if (context.id.startsWith('place.')) {
          city = city || context.text;
        } else if (context.id.startsWith('region.')) {
          state = context.text;
          stateCode = context.short_code?.replace(/^[A-Z]{2}-/, '') || '';
        } else if (context.id.startsWith('country.')) {
          country = context.text;
          countryCode = context.short_code?.toUpperCase() || '';
        } else if (context.id.startsWith('postcode.')) {
          postalCode = context.text;
        }
      });
    }

    // Generate Google Maps URL
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    return {
      id: feature.id,
      displayName: feature.text,
      fullAddress: feature.place_name,
      latitude,
      longitude,
      city: city || feature.text, // Fallback to main text if city not found
      state,
      stateCode,
      country,
      countryCode,
      postalCode,
      googleMapsUrl,
      mapboxPlaceId: feature.id,
      placeType: feature.place_type[0] || 'unknown',
    };
  }

  /**
   * Validate if the service is properly configured
   */
  isConfigured(): boolean {
    return !!this.accessToken;
  }
}

// Export singleton instance
export default new MapboxService();