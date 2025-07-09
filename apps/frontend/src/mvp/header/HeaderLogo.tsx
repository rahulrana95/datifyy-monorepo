// apps/frontend/src/mvp/components/header/HeaderLogo.tsx
import React from 'react';
import { Box, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import DatifyLogo from '../../assets/images/datifyy-logo-v2.png';

const HeaderLogo: React.FC = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <Box>
            <Image
                src={DatifyLogo}
                alt="Datifyy Logo"
                boxSize="60px"
                objectFit="contain"
                cursor="pointer"
                onClick={handleLogoClick}
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.1)" }}
            />
        </Box>
    );
};

export default HeaderLogo;