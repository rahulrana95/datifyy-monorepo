export enum Exercise {
  Heavy = "Heavy",
  Light = "Light",
  Moderate = "Moderate",
  None = "None",
}

export enum Gender {
  Male = "Male",
  Female = "Female"
}

export enum EducationLevel {
  Graduate = "Graduate",
  HighSchool = "High School",
  Postgraduate = "Postgraduate",
  Undergraduate = "Undergraduate",
}

export enum Drinking {
  Never = "Never",
  Occasionally = "Occasionally",
  Regularly = "Regularly",
}

export enum Smoking {
  Never = "Never",
  Occasionally = "Occasionally",
  Regularly = "Regularly",
}

export enum LookingFor {
  Casual = "Casual",
  Friendship = "Friendship",
  Relationship = "Relationship",
}

export enum SettleDownInMonths {
  "0-6" = "0-6",
  "12-24" = "12-24",
  "24+" = "24+",
  "6-12" = "6-12",
}

export enum StarSign {
  Aquarius = "Aquarius",
  Aries = "Aries",
  Cancer = "Cancer",
  Capricorn = "Capricorn",
  Gemini = "Gemini",
  Leo = "Leo",
  Libra = "Libra",
  Pisces = "Pisces",
  Sagittarius = "Sagittarius",
  Scorpio = "Scorpio",
  Taurus = "Taurus",
  Virgo = "Virgo",
}

export enum Pronoun {
  HeHim = "He/Him",
  Other = "Other",
  SheHer = "She/Her",
  TheyThem = "They/Them",
}


export interface DatifyyUsersInformation {
  id: string;
  firstName: string;
  lastName: string;
  updatedAt: Date | null;
  bio: string | null;
  images: string[] | null;
  dob: string | null;
  gender: string | null;
  officialEmail: string;
  isOfficialEmailVerified: boolean | null;
  isAadharVerified: boolean | null;
  isPhoneVerified: boolean | null;
  height: number | null;
  favInterest: string[] | null;
  causesYouSupport: string[] | null;
  qualityYouValue: string[] | null;
  prompts: object[] | null;
  education: object[] | null;
  currentCity: string | null;
  hometown: string | null;
  exercise: Exercise | null;
  educationLevel: EducationLevel | null;
  drinking: Drinking | null;
  smoking: Smoking | null;
  lookingFor: LookingFor | null;
  settleDownInMonths: SettleDownInMonths | null;
  haveKids: boolean | null;
  wantsKids: boolean | null;
  starSign: StarSign | null;
  birthTime: number | null;
  kundliBeliever: boolean | null;
  religion: string | null;
  pronoun: Pronoun | null;
  isDeleted: boolean | null;
  userLoginId: string | null; // Reference to the `DatifyyUsersLogin` entity
}
