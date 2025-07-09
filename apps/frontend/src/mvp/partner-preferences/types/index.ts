// apps/frontend/src/mvp/partner-preferences/types/index.ts
/**
 * Partner Preferences Types - now using shared types
 * Only frontend-specific component types remain here
 */

import { PartnerPreferences, PreferencePage } from '@datifyy/shared-types';

// Re-export from shared types
export type {
  PartnerPreferences,
  PreferencePage,
  PreferenceCategory,
  DatifyyUserPartnerPreferences
} from '@datifyy/shared-types';

// Frontend-specific component props
export interface PreferencesHeaderProps {
  currentPage: PreferencePage;
  onSave: () => void;
  saving: boolean;
}

export interface PreferencesNavigationProps {
  currentPage: PreferencePage;
  onPageChange: (page: PreferencePage) => void;
}

export interface PreferencesContentProps {
  currentPage: PreferencePage;
  preferences: PartnerPreferences;
  onUpdate: (updates: Partial<PartnerPreferences>) => void;
}

export interface PreferencesPageProps {
  preferences: PartnerPreferences;
  onUpdate: (updates: Partial<PartnerPreferences>) => void;
}