/**
 * Gender enum - Single source of truth
 * Database stores lowercase, frontend displays capitalized
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export const GenderLabels: Record<Gender, string> = {
  [Gender.MALE]: 'Male',
  [Gender.FEMALE]: 'Female',
  [Gender.OTHER]: 'Other'
} as const;

export const GenderOptions = Object.entries(GenderLabels).map(([value, label]) => ({
  value: value as Gender,
  label
}));

/**
 * Exercise levels
 */
export enum ExerciseLevel {
  NONE = 'None',
  LIGHT = 'Light',
  MODERATE = 'Moderate', 
  HEAVY = 'Heavy'
}

export const ExerciseLevelLabels: Record<ExerciseLevel, string> = {
  [ExerciseLevel.NONE]: 'No Exercise',
  [ExerciseLevel.LIGHT]: 'Light Exercise', 
  [ExerciseLevel.MODERATE]: 'Moderate Exercise',
  [ExerciseLevel.HEAVY]: 'Heavy Exercise'
} as const;

/**
 * Education levels
 */
export enum EducationLevel {
  HIGH_SCHOOL = 'High School',
  UNDERGRADUATE = 'Undergraduate', 
  GRADUATE = 'Graduate',
  POSTGRADUATE = 'Postgraduate'
}

/**
 * Drinking habits
 */
export enum DrinkingHabit {
  NEVER = 'Never',
  OCCASIONALLY = 'Occasionally',
  REGULARLY = 'Regularly'
}

/**
 * Smoking habits
 */
export enum SmokingHabit {
  NEVER = 'Never', 
  OCCASIONALLY = 'Occasionally',
  REGULARLY = 'Regularly'
}

/**
 * Looking for options
 */
export enum LookingFor {
  FRIENDSHIP = 'Friendship',
  CASUAL = 'Casual',
  RELATIONSHIP = 'Relationship'
}

/**
 * Star signs
 */
export enum StarSign {
  ARIES = 'Aries',
  TAURUS = 'Taurus',
  GEMINI = 'Gemini',
  CANCER = 'Cancer',
  LEO = 'Leo',
  VIRGO = 'Virgo',
  LIBRA = 'Libra',
  SCORPIO = 'Scorpio', 
  SAGITTARIUS = 'Sagittarius',
  CAPRICORN = 'Capricorn',
  AQUARIUS = 'Aquarius',
  PISCES = 'Pisces'
}

/**
 * Pronouns
 */
export enum Pronoun {
  HE_HIM = 'He/Him',
  SHE_HER = 'She/Her',
  THEY_THEM = 'They/Them', 
  OTHER = 'Other'
}
