// apps/frontend/src/mvp/profile/HeaderWithTabs.tsx
/**
 * Simple replacement for the existing HeaderWithTabs component
 * This maintains backward compatibility while using the new profile system
 */
import React from 'react';
import { ProfileContainer } from './index';

const HeaderWithTabs: React.FC = () => {
    return <ProfileContainer />;
};

export default HeaderWithTabs;