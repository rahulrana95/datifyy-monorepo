// apps/frontend/src/mvp/partner-preferences/index.ts
/**
 * Partner Preferences Module Exports
 * Clean barrel exports for the partner preferences feature
 */

// Main Container
export { default as PartnerPreferencesContainer } from './PartnerPreferencesContainer';

// Components
export { default as PreferencesHeader } from './components/PreferencesHeader';
export { default as PreferencesNavigation } from './components/PreferencesNavigation';
export { default as PreferencesContent } from './components/PreferencesContent';
export { default as LoadingSpinner } from './components/LoadingSpinner';

// Pages
export { default as BasicsPage } from './components/pages/BasicsPage';
export { LifestylePage, PhysicalPage, ValuesPage } from './components/pages/LifestylePage';

// Types
export type { 
  PartnerPreferences, 
  PreferenceCategory,
  PreferencePage 
} from './types';