// apps/frontend/src/mvp/profile/types/index.ts

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  images?: string[];
  city?: string;
  isVerified?: boolean;
  height?: number;
  occupation?: string;
}

export interface ProfileStats {
  likes: number;
  matches: number;
  views: number;
  profileCompletion: number;
}

export type ProfileTab = 'photos' | 'about' | 'preferences' | 'settings';

export interface DatifyyUserPartnerPreferences {
  id?: string;
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
  interests?: string[];
  dealBreakers?: string[];
}