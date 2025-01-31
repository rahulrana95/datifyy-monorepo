import React, { useState, useEffect } from 'react';
import { Select, FormControl, FormLabel, Input, Box, Spinner, FormHelperText } from '@chakra-ui/react';

const CitySelect = () => {
    const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Function to fetch cities from an API
    const fetchCities = async (search: string) => {
        setLoading(true);
        const response = await fetch(`https://api.example.com/cities?search=${search}`);
        const data = await response.json();
        const cityOptions = data.map((city: { name: string }) => ({
            label: city.name,
            value: city.name,
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

    return (
        <Box width="100%">
            <FormControl>
                <FormLabel htmlFor="city">City</FormLabel>
                <Input
                    id="city"
                    placeholder="Search for a city..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Select placeholder="Select city" isDisabled={loading}>
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
                <FormHelperText>Select a city from the list</FormHelperText>
            </FormControl>
        </Box>
    );
};

export default CitySelect;
