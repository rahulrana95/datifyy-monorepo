import { useState } from "react";
import {
    Box,
    Tag,
    TagLabel,
    TagCloseButton,
    HStack,
    Select,
} from "@chakra-ui/react";

interface MultiSelectProps {
    options: string[];
    placeholder?: string;
    fontSize?: number;
    onChange: (name: string, selectedValues: string[]) => void;
    name: string;
    value?: string[];
    isReadOnly?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    placeholder = "Select options...",
    value = [],
    fontSize = 12,
    onChange,
    name,
    isReadOnly = false,
}) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(value);

    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value && !selectedValues.includes(value)) {
            setSelectedValues([...selectedValues, value]);
            onChange(name, [...selectedValues, value]);
        }
    };

    const removeTag = (valueToRemove: string) => {
        if (isReadOnly) return;
        setSelectedValues(selectedValues.filter((value) => value !== valueToRemove));
        onChange(name, selectedValues.filter((value) => value !== valueToRemove));
    };

    return (
        <Box width="300px">
            {/* Select Dropdown */}
            <Select placeholder={placeholder} onChange={handleSelect} fontSize={fontSize} disabled={isReadOnly}>
                {options
                    .filter((option) => !selectedValues.includes(option)) // Hide already selected values
                    .map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
            </Select>
            {/* Display Selected Tags */}
            <HStack spacing={2} mb={2} wrap="wrap" mt={4}>
                {selectedValues.map((value) => (
                    <Tag key={value} size="sm" colorScheme="blue" borderRadius="full">
                        <TagLabel>{value}</TagLabel>
                        <TagCloseButton onClick={() => removeTag(value)} />
                    </Tag>
                ))}
            </HStack>
        </Box>
    );
};

export default MultiSelect;
