// apps/frontend/src/mvp/partner-preferences/types/index.ts

export interface PartnerPreferences {
  id?: string;
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
  height?: {
    min?: number;
    max?: number;
  };
  income?: {
    min?: number;
    max?: number;
  };
}

export interface PreferenceCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  options: string[];
}

export type PreferencePage = 'basics' | 'lifestyle' | 'physical' | 'values';