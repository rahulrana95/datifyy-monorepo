// apps/frontend/src/mvp/profile/index.ts
/**
 * Profile Module Exports
 * Clean barrel exports for the profile feature
 */

// Main Container
export { default as ProfileContainer } from './ProfileContainer';

// Components
export { default as ProfileHeader } from './components/ProfileHeader';
export { default as ProfileTabs } from './components/ProfileTabs';
export { default as ProfileContent } from './components/ProfileContent';
export { default as EditProfileModal } from './components/EditProfileModal';
export { default as LoadingSpinner } from './components/LoadingSpinner';

// Tab Components
export { default as PhotosTab } from './components/tabs/PhotosTab';
export { default as AboutTab } from './components/tabs/AboutTab';
export { default as PreferencesTab } from './components/tabs/PreferencesTab';
export { default as SettingsTab } from './components/tabs/SettingsTab';

// Types
export type { 
  UserProfile, 
  ProfileStats, 
  ProfileTab,
  DatifyyUserPartnerPreferences 
} from './types/index';