// Partner preferences related types

/** Preference page navigation */
export type PreferencePage = 'basics' | 'interests' | 'lifestyle' | 'values' | 'physical';

/** Preference category */
export enum PreferenceCategory {
  BASICS = 'BASICS',
  INTERESTS = 'INTERESTS',
  LIFESTYLE = 'LIFESTYLE',
  VALUES = 'VALUES',
  PHYSICAL = 'PHYSICAL'
}

/** Extended partner preferences for UI (wraps proto type) */
export interface DatifyyUserPartnerPreferences {
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
  interests?: string[];
  dealBreakers?: string[];
  education?: string[];
  lifestyle?: string[];
  bodyType?: string[];
  ethnicity?: string[];
  religion?: string[];
  smoking?: string;
  drinking?: string;
  hasKids?: string;
  wantsKids?: string;
  height?: { min: number; max: number };
  income?: { min: number; max: number };
}