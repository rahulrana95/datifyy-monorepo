import { useState } from "react";
import { Input, Tag, TagCloseButton, TagLabel, HStack } from "@chakra-ui/react";

interface TagInputProps {
    value: string[]; // Array of strings representing selected tags
    onChange: (name: string, updatedValue: string[]) => void; // Function to update the value
    name: string;
    isReadOnly?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({ value = [], onChange, name, isReadOnly = false }) => {
    const [inputValue, setInputValue] = useState<string>("");

    const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && inputValue.trim()) {
            event.preventDefault(); // Prevent form submission on Enter
            onChange(name, [...value, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onChange(name, value.filter((tag) => tag !== tagToRemove));
    };

    console.log(value);


    return (
        <HStack wrap="wrap" spacing={2} p={2} border="1px solid" borderColor="gray.300" borderRadius="md">
            {value.map((tag, index) => (
                <Tag key={index} size="md" variant="solid" colorScheme="blue">
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                </Tag>
            ))}
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Enter values..."
                variant="unstyled"
                disabled={isReadOnly}
            />
        </HStack>
    );
};

export default TagInput;
