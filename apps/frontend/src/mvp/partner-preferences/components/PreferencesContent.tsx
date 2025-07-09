// apps/frontend/src/mvp/partner-preferences/components/PreferencesContent.tsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import { PreferencePage, PartnerPreferences } from '../types';
import BasicsPage from './pages/BasicsPage';
import LifestylePage from './pages/LifestylePage';
import PhysicalPage from './pages/PhysicalPage';
import ValuesPage from './pages/ValuesPage';

interface PreferencesContentProps {
    currentPage: PreferencePage;
    preferences: PartnerPreferences;
    onUpdate: (updates: Partial<PartnerPreferences>) => void;
}

const PreferencesContent: React.FC<PreferencesContentProps> = ({
    currentPage,
    preferences,
    onUpdate,
}) => {
    const renderPage = () => {
        switch (currentPage) {
            case 'basics':
                return (
                    <BasicsPage
                        preferences={preferences}
                        onUpdate={onUpdate}
                    />
                );

            case 'lifestyle':
                return (
                    <LifestylePage
                        preferences={preferences}
                        onUpdate={onUpdate}
                    />
                );

            case 'physical':
                return (
                    <PhysicalPage
                        preferences={preferences}
                        onUpdate={onUpdate}
                    />
                );

            case 'values':
                return (
                    <ValuesPage
                        preferences={preferences}
                        onUpdate={onUpdate}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={6}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            minH="500px"
            className="fade-in"
        >
            {renderPage()}
        </Box>
    );
};

export default PreferencesContent;