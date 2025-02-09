import React, { useState, useEffect } from 'react';
import { Select, FormControl, FormLabel, Input, Box, Spinner, FormHelperText } from '@chakra-ui/react';

const apiKey = process.env.REACT_APP_GEO_API;


const CitySelect = ({ value, onChangeCity }: { value: any, onChangeCity: (lcoation: string) => void }) => {
    const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Function to fetch cities from an API
    const fetchCities = async (search: string) => {
        setLoading(true);
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${search}&apiKey=${apiKey}`);
        const data = await response.json();
        const cityOptions = data.features.map((feature: { properties: { formatted: string } }) => ({
            label: feature.properties.formatted,
            value: feature.properties.formatted,
        }));
        setCities(cityOptions);
        setLoading(false);
    };

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value.length >= 3) {
            fetchCities(value); // Trigger the API call when the search term has 3 or more characters
        } else {
            setCities([]);
        }
    };

    const onSelect = (location: any) => {
        onChangeCity(location.target.value);
    }

    return (
        <Box width="100%">
            <FormControl>
                <Input
                    id="city"
                    placeholder="Search for a city..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Select placeholder="Select city" isDisabled={loading} onChange={onSelect}>
                    {loading ? (
                        <option value="" disabled>
                            <Spinner size="sm" />
                            Loading...
                        </option>
                    ) : (
                        cities.map((city) => (
                            <option key={city.value} value={city.value}>
                                {city.label}
                            </option>
                        ))
                    )}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CitySelect;
