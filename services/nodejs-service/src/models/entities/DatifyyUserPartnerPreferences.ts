import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";

@Index("datifyy_user_partner_preferences_pkey", ["id"], { unique: true })
@Entity("datifyy_user_partner_preferences", { schema: "public" })
export class DatifyyUserPartnerPreferences {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "gender_preference",
    nullable: true,
    length: 20,
    default: () => "'Both'",
  })
  genderPreference: string | null;

  @Column("integer", { name: "min_age", nullable: true })
  minAge: number | null;

  @Column("integer", { name: "max_age", nullable: true })
  maxAge: number | null;

  @Column("integer", { name: "min_height", nullable: true })
  minHeight: number | null;

  @Column("integer", { name: "max_height", nullable: true })
  maxHeight: number | null;

  @Column("character varying", { name: "religion", nullable: true, length: 50 })
  religion: string | null;

  @Column("text", { name: "education_level", nullable: true, array: true })
  educationLevel: string[] | null;

  @Column("text", { name: "profession", nullable: true, array: true })
  profession: string[] | null;

  @Column("numeric", {
    name: "min_income",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  minIncome: string | null;

  @Column("numeric", {
    name: "max_income",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  maxIncome: string | null;

  @Column("character varying", { name: "currency", nullable: true, length: 3 })
  currency: string | null;

  @Column("jsonb", { name: "location_preference", nullable: true })
  locationPreference: object | null;

  @Column("character varying", {
    name: "smoking_preference",
    nullable: true,
    length: 20,
    default: () => "'No'",
  })
  smokingPreference: string | null;

  @Column("character varying", {
    name: "drinking_preference",
    nullable: true,
    length: 20,
    default: () => "'No'",
  })
  drinkingPreference: string | null;

  @Column("character varying", {
    name: "marital_status",
    nullable: true,
    length: 20,
    default: () => "'Single'",
  })
  maritalStatus: string | null;

  @Column("character varying", {
    name: "children_preference",
    nullable: true,
    length: 20,
    default: () => "'Doesnt matter'",
  })
  childrenPreference: string | null;

  @Column("character varying", {
    name: "religion_preference",
    nullable: true,
    length: 50,
  })
  religionPreference: string | null;

  @Column("character varying", {
    name: "ethnicity_preference",
    nullable: true,
    length: 50,
  })
  ethnicityPreference: string | null;

  @Column("character varying", {
    name: "caste_preference",
    nullable: true,
    length: 50,
  })
  castePreference: string | null;

  @Column("text", { name: "partner_description", nullable: true })
  partnerDescription: string | null;

  @Column("text", { name: "hobbies", nullable: true, array: true })
  hobbies: string[] | null;

  @Column("text", { name: "interests", nullable: true, array: true })
  interests: string[] | null;

  @Column("text", { name: "books_reading", nullable: true, array: true })
  booksReading: string[] | null;

  @Column("text", { name: "music", nullable: true, array: true })
  music: string[] | null;

  @Column("text", { name: "movies", nullable: true, array: true })
  movies: string[] | null;

  @Column("text", { name: "travel", nullable: true, array: true })
  travel: string[] | null;

  @Column("text", { name: "sports", nullable: true, array: true })
  sports: string[] | null;

  @Column("text", { name: "personality_traits", nullable: true, array: true })
  personalityTraits: string[] | null;

  @Column("character varying", {
    name: "relationship_goals",
    nullable: true,
    length: 100,
  })
  relationshipGoals: string | null;

  @Column("jsonb", { name: "lifestyle_preference", nullable: true })
  lifestylePreference: object | null;

  @Column("integer", { name: "location_preference_radius", nullable: true })
  locationPreferenceRadius: number | null;

  @Column("text", { name: "what_other_person_should_know", nullable: true })
  whatOtherPersonShouldKnow: string | null;

  @Column("character varying", {
    name: "activity_level",
    nullable: true,
    length: 20,
  })
  activityLevel: string | null;

  @Column("character varying", {
    name: "pet_preference",
    nullable: true,
    length: 20,
  })
  petPreference: string | null;

  @Column("integer", { name: "religion_compatibility_score", nullable: true })
  religionCompatibilityScore: number | null;

  @Column("integer", { name: "income_compatibility_score", nullable: true })
  incomeCompatibilityScore: number | null;

  @Column("integer", { name: "education_compatibility_score", nullable: true })
  educationCompatibilityScore: number | null;

  @Column("integer", { name: "appearance_compatibility_score", nullable: true })
  appearanceCompatibilityScore: number | null;

  @Column("integer", {
    name: "personality_compatibility_score",
    nullable: true,
  })
  personalityCompatibilityScore: number | null;

  @Column("integer", { name: "values_compatibility_score", nullable: true })
  valuesCompatibilityScore: number | null;

  @Column("integer", { name: "matching_score", nullable: true })
  matchingScore: number | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyUserPartnerPreferences,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: DatifyyUsersLogin;
}
