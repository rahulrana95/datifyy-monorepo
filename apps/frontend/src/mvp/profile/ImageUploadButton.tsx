import React, { useRef } from 'react';
import { Button, useTheme } from '@chakra-ui/react';

const ImageUploadButton = ({ handleImageUpload }: { handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const theme = useTheme();

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            {/* Custom button with accent color */}
            <Button
                onClick={handleClick}
                colorScheme="accent" // Or you can use the accent color from the theme like theme.colors.blue[9]
                variant="solid"
                _hover={{ bg: theme.colors.accent }}
            >
                Upload Image
            </Button>

            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default ImageUploadButton;
