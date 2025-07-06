import { 
  Gender, 
  ExerciseLevel, 
  EducationLevel, 
  DrinkingHabit, 
  SmokingHabit, 
  LookingFor,
  StarSign,
  Pronoun 
} from '../enums/user.enums';

/**
 * Base user profile interface - matches database schema exactly
 */
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  updatedAt: Date | null;
  bio: string | null;
  images: string[] | null;
  dob: string | null; // ISO date string
  gender: Gender | null;
  officialEmail: string;
  isOfficialEmailVerified: boolean | null;
  isAadharVerified: boolean | null;
  isPhoneVerified: boolean | null;
  height: number | null; // in cm
  currentCity: string | null;
  hometown: string | null;
  exercise: ExerciseLevel | null;
  educationLevel: EducationLevel | null;
  drinking: DrinkingHabit | null;
  smoking: SmokingHabit | null;
  lookingFor: LookingFor | null;
  settleDownInMonths: string | null;
  haveKids: boolean | null;
  wantsKids: boolean | null;
  starSign: StarSign | null;
  religion: string | null;
  pronoun: Pronoun | null;
  favInterest: string[] | null;
  causesYouSupport: string[] | null;
  qualityYouValue: string[] | null;
  prompts: object[] | null;
  education: object[] | null;
  birthTime: number | null;
  kundliBeliever: boolean | null;
  isDeleted: boolean | null;
  userLoginId: string | null;
}

/**
 * User profile for API responses (with computed fields)
 */
export interface UserProfileResponse extends UserProfile {
  age?: number; // Computed from dob
  profileCompletionPercentage: number; // Computed
  lastUpdated: string; // ISO string
  createdAt: string; // ISO string
  isVerified: boolean; // Computed from verification fields
}

/**
 * User profile update request (only updatable fields)
 */
export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  bio?: string;
  images?: string[];
  dob?: string; // ISO date string
  height?: number;
  currentCity?: string;
  hometown?: string;
  exercise?: ExerciseLevel;
  educationLevel?: EducationLevel;
  drinking?: DrinkingHabit;
  smoking?: SmokingHabit;
  lookingFor?: LookingFor;
  settleDownInMonths?: string;
  haveKids?: boolean;
  wantsKids?: boolean;
  starSign?: StarSign;
  religion?: string;
  pronoun?: Pronoun;
  favInterest?: string[];
  causesYouSupport?: string[];
  qualityYouValue?: string[];
  prompts?: object[];
  education?: object[];
}
