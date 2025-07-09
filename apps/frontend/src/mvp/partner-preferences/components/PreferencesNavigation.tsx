// apps/frontend/src/mvp/partner-preferences/components/PreferencesNavigation.tsx
import React from 'react';
import {
    HStack,
    Button,
    Box,
    useBreakpointValue,
} from '@chakra-ui/react';
import { FaHeart, FaCoffee, FaRuler, FaPray } from 'react-icons/fa';
import { PreferencePage } from '../types';

interface PreferencesNavigationProps {
    currentPage: PreferencePage;
    onPageChange: (page: PreferencePage) => void;
}

const PreferencesNavigation: React.FC<PreferencesNavigationProps> = ({
    currentPage,
    onPageChange,
}) => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const pages = [
        {
            id: 'basics' as PreferencePage,
            label: 'Basics',
            icon: FaHeart,
            color: 'brand.500',
        },
        {
            id: 'lifestyle' as PreferencePage,
            label: 'Lifestyle',
            icon: FaCoffee,
            color: 'orange.500',
        },
        {
            id: 'physical' as PreferencePage,
            label: 'Physical',
            icon: FaRuler,
            color: 'blue.500',
        },
        {
            id: 'values' as PreferencePage,
            label: 'Values',
            icon: FaPray,
            color: 'purple.500',
        },
    ];

    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={2}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
        >
            <HStack spacing={1} w="full">
                {pages.map((page) => {
                    const Icon = page.icon;
                    const isActive = currentPage === page.id;

                    return (
                        <Button
                            key={page.id}
                            variant="ghost"
                            size={isMobile ? 'sm' : 'md'}
                            flex={1}
                            py={3}
                            borderRadius="lg"
                            color={isActive ? 'white' : 'gray.600'}
                            bg={isActive ? page.color : 'transparent'}
                            fontWeight={isActive ? 'bold' : 'medium'}
                            leftIcon={<Icon size={isMobile ? '14px' : '16px'} />}
                            onClick={() => onPageChange(page.id)}
                            _hover={{
                                bg: isActive ? page.color : `${page.color.split('.')[0]}.50`,
                                color: isActive ? 'white' : page.color,
                                transform: 'translateY(-1px)',
                            }}
                            _active={{
                                transform: 'scale(0.98)',
                            }}
                            transition="all 0.2s ease"
                            cursor="pointer"
                        >
                            {!isMobile && page.label}
                        </Button>
                    );
                })}
            </HStack>
        </Box>
    );
};

export default PreferencesNavigation;