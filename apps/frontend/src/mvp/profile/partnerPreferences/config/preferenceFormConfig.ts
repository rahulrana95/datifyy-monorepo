// apps/frontend/src/mvp/profile/partnerPreferences/config/preferenceFormConfig.ts

import { IconType } from 'react-icons';
import { 
  FaVenusMars, FaRuler, FaMapMarkerAlt, FaHeart, FaGraduationCap, 
  FaBriefcase, FaMoneyBillWave, FaSmokingBan, FaGlassCheers, 
  FaPalette, FaMusic, FaBook, FaPlane, FaRunning, FaPaw 
} from 'react-icons/fa';
import {
  GenderPreference, SmokingPreference, DrinkingPreference, MaritalStatus,
  ChildrenPreference, Currency, EducationLevel, Profession, Sports,
  Hobbies, FamousInterests, PersonalityTraits, RelationshipGoals,
  ActivityLevel, PetPreference
} from '../../types';
import { DatifyyUserPartnerPreferences } from '../../types';

/**
 * Enterprise Form Configuration
 * 
 * Principles:
 * - Single source of truth for form structure
 * - Type-safe configuration with enums
 * - Internationalization ready
 * - Validation rules co-located
 * - Progressive disclosure support
 * - Accessibility-first design
 */

export enum FormFieldType {
  TEXT = 'text',
  EMAIL = 'email',
  NUMBER = 'number',
  SELECT = 'select',
  MULTI_SELECT = 'multi-select',
  MULTI_SELECT_TEXT = 'multi-select-text',
  CITY_SEARCH = 'city-search',
  TEXTAREA = 'textarea',
  SLIDER_RANGE = 'slider-range',
  TOGGLE = 'toggle'
}

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FormField {
  name: keyof DatifyyUserPartnerPreferences;
  label: string;
  type: FormFieldType;
  icon?: IconType;
  placeholder?: string;
  helpText?: string;
  validation?: ValidationRule;
  options?: readonly string[];
  conditional?: {
    dependsOn: keyof DatifyyUserPartnerPreferences;
    condition: (value: any) => boolean;
  };
  grid?: {
    colSpan?: number;
    rowSpan?: number;
  };
  priority: 'high' | 'medium' | 'low'; // For progressive disclosure
}

export interface FormSection {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  priority: 'essential' | 'important' | 'optional';
  fields: FormField[];
  estimatedTime?: number; // Minutes to complete
}

/**
 * Field definitions with comprehensive validation
 */
const createBasicPreferencesFields = (): FormField[] => [
  {
    name: 'genderPreference',
    label: 'Gender Preference',
    type: FormFieldType.SELECT,
    icon: FaVenusMars,
    placeholder: 'Select preferred gender',
    helpText: 'Who would you like to meet?',
    options: Object.values(GenderPreference),
    validation: { required: true },
    priority: 'high',
    grid: { colSpan: 1 }
  },
  {
    name: 'minAge',
    label: 'Minimum Age',
    type: FormFieldType.NUMBER,
    icon: FaRuler,
    placeholder: '18',
    validation: { 
      required: true, 
      min: 18, 
      max: 100,
      custom: (value: number) => {
        if (value < 18) return 'Minimum age must be 18 or older';
        return null;
      }
    },
    priority: 'high',
    grid: { colSpan: 1 }
  },
  {
    name: 'maxAge',
    label: 'Maximum Age',
    type: FormFieldType.NUMBER,
    icon: FaRuler,
    placeholder: '35',
    validation: { 
      required: true, 
      min: 18, 
      max: 100,
      custom: (value: number) => {
        // Note: Cross-field validation handled in form logic
        return null;
      }
    },
    priority: 'high',
    grid: { colSpan: 1 }
  },
  {
    name: 'minHeight',
    label: 'Minimum Height (cm)',
    type: FormFieldType.NUMBER,
    icon: FaRuler,
    placeholder: '150',
    helpText: 'Height preference in centimeters',
    validation: { min: 120, max: 250 },
    priority: 'medium',
    grid: { colSpan: 1 }
  },
  {
    name: 'maxHeight',
    label: 'Maximum Height (cm)',
    type: FormFieldType.NUMBER,
    icon: FaRuler,
    placeholder: '180',
    validation: { min: 120, max: 250 },
    priority: 'medium',
    grid: { colSpan: 1 }
  }
];

const createLocationFields = (): FormField[] => [
  {
    name: 'locationPreference',
    label: 'Preferred Location',
    type: FormFieldType.CITY_SEARCH,
    icon: FaMapMarkerAlt,
    placeholder: 'Search for a city...',
    helpText: 'Where would you like to meet people?',
    validation: { required: true },
    priority: 'high',
    grid: { colSpan: 2 }
  },
  {
    name: 'locationPreferenceRadius',
    label: 'Search Radius (km)',
    type: FormFieldType.SLIDER_RANGE,
    icon: FaMapMarkerAlt,
    helpText: 'How far are you willing to travel?',
    validation: { min: 1, max: 1000 },
    priority: 'medium',
    grid: { colSpan: 1 }
  }
];

const createEducationCareerFields = (): FormField[] => [
  {
    name: 'educationLevel',
    label: 'Education Level',
    type: FormFieldType.MULTI_SELECT,
    icon: FaGraduationCap,
    placeholder: 'Select education levels',
    helpText: 'What education backgrounds interest you?',
    options: Object.values(EducationLevel),
    validation: { custom: (value: string[]) => value?.length > 5 ? 'Maximum 5 education levels allowed' : null },
    priority: 'medium',
    grid: { colSpan: 2 }
  },
  {
    name: 'profession',
    label: 'Preferred Professions',
    type: FormFieldType.MULTI_SELECT,
    icon: FaBriefcase,
    placeholder: 'Select professions',
    helpText: 'What careers do you find attractive?',
    options: Object.values(Profession),
    validation: { custom: (value: string[]) => value?.length > 10 ? 'Maximum 10 professions allowed' : null },
    priority: 'medium',
    grid: { colSpan: 2 }
  },
  {
    name: 'minIncome',
    label: 'Minimum Income',
    type: FormFieldType.NUMBER,
    icon: FaMoneyBillWave,
    placeholder: '0',
    helpText: 'Minimum annual income preference',
    validation: { min: 0 },
    priority: 'low',
    grid: { colSpan: 1 }
  },
  {
    name: 'maxIncome',
    label: 'Maximum Income',
    type: FormFieldType.NUMBER,
    icon: FaMoneyBillWave,
    placeholder: '1000',
    validation: { min: 0 },
    priority: 'low',
    grid: { colSpan: 1 }
  },
  {
    name: 'currency',
    label: 'Currency',
    type: FormFieldType.SELECT,
    icon: FaMoneyBillWave,
    options: Object.values(Currency),
    validation: { required: true },
    priority: 'low',
    conditional: {
      dependsOn: 'minIncome',
      condition: (value) => value !== null && value !== undefined
    },
    grid: { colSpan: 1 }
  }
];

const createLifestyleFields = (): FormField[] => [
  {
    name: 'smokingPreference',
    label: 'Smoking Preference',
    type: FormFieldType.SELECT,
    icon: FaSmokingBan,
    placeholder: 'Select smoking preference',
    options: Object.values(SmokingPreference),
    priority: 'medium',
    grid: { colSpan: 1 }
  },
  {
    name: 'drinkingPreference',
    label: 'Drinking Preference',
    type: FormFieldType.SELECT,
    icon: FaGlassCheers,
    placeholder: 'Select drinking preference',
    options: Object.values(DrinkingPreference),
    priority: 'medium',
    grid: { colSpan: 1 }
  },
  {
    name: 'maritalStatus',
    label: 'Preferred Marital Status',
    type: FormFieldType.SELECT,
    icon: FaHeart,
    placeholder: 'Select marital status',
    options: Object.values(MaritalStatus),
    priority: 'high',
    grid: { colSpan: 1 }
  },
  {
    name: 'childrenPreference',
    label: 'Children Preference',
    type: FormFieldType.SELECT,
    icon: FaHeart,
    placeholder: 'Select children preference',
    helpText: 'Your preference about partners with children',
    options: Object.values(ChildrenPreference),
    priority: 'high',
    grid: { colSpan: 1 }
  }
];

const createInterestsFields = (): FormField[] => [
  {
    name: 'hobbies',
    label: 'Hobbies',
    type: FormFieldType.MULTI_SELECT,
    icon: FaPalette,
    placeholder: 'Select hobbies',
    helpText: 'What hobbies do you want your partner to enjoy?',
    options: Object.values(Hobbies),
    validation: { custom: (value: string[]) => value?.length > 10 ? 'Maximum 10 hobbies allowed' : null },
    priority: 'medium',
    grid: { colSpan: 2 }
  },
  {
    name: 'interests',
    label: 'Interests',
    type: FormFieldType.MULTI_SELECT,
    icon: FaMusic,
    placeholder: 'Select interests',
    options: Object.values(FamousInterests),
    validation: { custom: (value: string[]) => value?.length > 10 ? 'Maximum 10 interests allowed' : null },
    priority: 'medium',
    grid: { colSpan: 2 }
  },
  {
    name: 'booksReading',
    label: 'Favorite Books/Genres',
    type: FormFieldType.MULTI_SELECT_TEXT,
    icon: FaBook,
    placeholder: 'Add books or genres...',
    helpText: 'Books or genres you\'d like to discuss',
    priority: 'low',
    grid: { colSpan: 2 }
  },
  {
    name: 'music',
    label: 'Music Preferences',
    type: FormFieldType.MULTI_SELECT_TEXT,
    icon: FaMusic,
    placeholder: 'Add artists or genres...',
    priority: 'low',
    grid: { colSpan: 2 }
  },
  {
    name: 'movies',
    label: 'Movie Preferences',
    type: FormFieldType.MULTI_SELECT_TEXT,
    icon: FaMusic,
    placeholder: 'Add movies or genres...',
    priority: 'low',
    grid: { colSpan: 2 }
  },
  {
    name: 'travel',
    label: 'Travel Destinations',
    type: FormFieldType.MULTI_SELECT_TEXT,
    icon: FaPlane,
    placeholder: 'Add countries or cities...',
    helpText: 'Places you\'ve been or want to visit',
    priority: 'low',
    grid: { colSpan: 2 }
  },
  {
    name: 'sports',
    label: 'Sports',
    type: FormFieldType.MULTI_SELECT,
    icon: FaRunning,
    placeholder: 'Select sports',
    options: Object.values(Sports),
    priority: 'low',
    grid: { colSpan: 2 }
  }
];

const createPersonalityFields = (): FormField[] => [
  {
    name: 'personalityTraits',
    label: 'Personality Traits',
    type: FormFieldType.MULTI_SELECT,
    icon: FaHeart,
    placeholder: 'Select traits',
    helpText: 'What personality traits do you value?',
    options: Object.values(PersonalityTraits),
    validation: { custom: (value: string[]) => value?.length > 8 ? 'Maximum 8 traits allowed' : null },
    priority: 'high',
    grid: { colSpan: 2 }
  },
  {
    name: 'relationshipGoals',
    label: 'Relationship Goals',
    type: FormFieldType.SELECT,
    icon: FaHeart,
    placeholder: 'Select relationship goal',
    helpText: 'What are you looking for?',
    options: Object.values(RelationshipGoals),
    validation: { required: true },
    priority: 'high',
    grid: { colSpan: 1 }
  },
  {
    name: 'activityLevel',
    label: 'Activity Level',
    type: FormFieldType.SELECT,
    icon: FaRunning,
    placeholder: 'Select activity level',
    options: Object.values(ActivityLevel),
    priority: 'medium',
    grid: { colSpan: 1 }
  },
  {
    name: 'petPreference',
    label: 'Pet Preference',
    type: FormFieldType.SELECT,
    icon: FaPaw,
    placeholder: 'Select pet preference',
    options: Object.values(PetPreference),
    priority: 'low',
    grid: { colSpan: 1 }
  },
  {
    name: 'lifestylePreference',
    label: 'Lifestyle Preferences',
    type: FormFieldType.MULTI_SELECT_TEXT,
    icon: FaHeart,
    placeholder: 'Add lifestyle preferences...',
    helpText: 'Describe your ideal lifestyle together',
    priority: 'medium',
    grid: { colSpan: 2 }
  }
];

const createAdditionalFields = (): FormField[] => [
  {
    name: 'whatOtherPersonShouldKnow',
    label: 'What Should They Know About You?',
    type: FormFieldType.TEXTAREA,
    icon: FaHeart,
    placeholder: 'Share something meaningful about yourself...',
    helpText: 'A personal note that helps others understand you better',
    validation: { maxLength: 1000 },
    priority: 'medium',
    grid: { colSpan: 2 }
  },
  {
    name: 'religion',
    label: 'Religious Preference',
    type: FormFieldType.TEXT,
    icon: FaHeart,
    placeholder: 'Your religious preference (optional)',
    priority: 'low',
    grid: { colSpan: 1 }
  }
];

/**
 * Main form configuration export
 */
export const PARTNER_PREFERENCES_FORM_CONFIG: FormSection[] = [
  {
    id: 'basic-preferences',
    title: 'Basic Preferences',
    description: 'Essential criteria for your ideal partner',
    icon: FaHeart,
    priority: 'essential',
    fields: createBasicPreferencesFields(),
    estimatedTime: 2
  },
  {
    id: 'location-preferences',
    title: 'Location & Distance',
    description: 'Where would you like to meet people?',
    icon: FaMapMarkerAlt,
    priority: 'essential',
    fields: createLocationFields(),
    estimatedTime: 1
  },
  {
    id: 'education-career',
    title: 'Education & Career',
    description: 'Professional and educational preferences',
    icon: FaGraduationCap,
    priority: 'important',
    fields: createEducationCareerFields(),
    estimatedTime: 3
  },
  {
    id: 'lifestyle-habits',
    title: 'Lifestyle & Habits',
    description: 'Important lifestyle compatibility factors',
    icon: FaGlassCheers,
    priority: 'important',
    fields: createLifestyleFields(),
    estimatedTime: 2
  },
  {
    id: 'interests-hobbies',
    title: 'Interests & Hobbies',
    description: 'Shared interests and activities',
    icon: FaPalette,
    priority: 'optional',
    fields: createInterestsFields(),
    estimatedTime: 5
  },
  {
    id: 'personality-goals',
    title: 'Personality & Goals',
    description: 'Deep compatibility and relationship goals',
    icon: FaHeart,
    priority: 'important',
    fields: createPersonalityFields(),
    estimatedTime: 3
  },
  {
    id: 'additional-info',
    title: 'Additional Information',
    description: 'Personal touches and special preferences',
    icon: FaHeart,
    priority: 'optional',
    fields: createAdditionalFields(),
    estimatedTime: 2
  }
];

/**
 * Utility functions for form configuration
 */
export const getFieldByName = (name: keyof DatifyyUserPartnerPreferences): FormField | undefined => {
  return PARTNER_PREFERENCES_FORM_CONFIG
    .flatMap(section => section.fields)
    .find(field => field.name === name);
};

export const getHighPriorityFields = (): FormField[] => {
  return PARTNER_PREFERENCES_FORM_CONFIG
    .flatMap(section => section.fields)
    .filter(field => field.priority === 'high');
};

export const getEssentialSections = (): FormSection[] => {
  return PARTNER_PREFERENCES_FORM_CONFIG
    .filter(section => section.priority === 'essential');
};

export const getTotalEstimatedTime = (): number => {
  return PARTNER_PREFERENCES_FORM_CONFIG
    .reduce((total, section) => total + (section.estimatedTime || 0), 0);
};

export const validateFieldValue = (field: FormField, value: any): string | null => {
  const { validation } = field;
  if (!validation) return null;

  if (validation.required && (value === null || value === undefined || value === '')) {
    return `${field.label} is required`;
  }

  if (validation.min !== undefined && typeof value === 'number' && value < validation.min) {
    return `${field.label} must be at least ${validation.min}`;
  }

  if (validation.max !== undefined && typeof value === 'number' && value > validation.max) {
    return `${field.label} must be at most ${validation.max}`;
  }

  if (validation.minLength !== undefined && typeof value === 'string' && value.length < validation.minLength) {
    return `${field.label} must be at least ${validation.minLength} characters`;
  }

  if (validation.maxLength !== undefined && typeof value === 'string' && value.length > validation.maxLength) {
    return `${field.label} must be at most ${validation.maxLength} characters`;
  }

  if (validation.pattern && typeof value === 'string' && !validation.pattern.test(value)) {
    return `${field.label} format is invalid`;
  }

  if (validation.custom) {
    return validation.custom(value);
  }

  return null;
};