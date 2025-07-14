import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";

@Index("user_information_pkey", ["id"], { unique: true })
@Index("user_information_official_email_key", ["officialEmail"], {
  unique: true,
})
@Entity("datifyy_users_information", { schema: "public" })
export class DatifyyUsersInformation {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("character varying", { name: "first_name", length: 255 })
  firstName: string;

  @Column("character varying", { name: "last_name", length: 255 })
  lastName: string;

  @Column("timestamp without time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @Column("text", { name: "bio", nullable: true })
  bio: string | null;

  @Column("text", { name: "images", nullable: true, array: true })
  images: string[] | null;

  @Column("date", { name: "dob", nullable: true })
  dob: string | null;

  @Column("character varying", { name: "gender", nullable: true, length: 50 })
  gender: string | null;

  @Column("character varying", {
    name: "official_email",
    unique: true,
    length: 255,
  })
  officialEmail: string;

  @Column("boolean", {
    name: "is_official_email_verified",
    nullable: true,
    default: () => "false",
  })
  isOfficialEmailVerified: boolean | null;

  @Column("boolean", {
    name: "is_aadhar_verified",
    nullable: true,
    default: () => "false",
  })
  isAadharVerified: boolean | null;

  @Column("boolean", {
    name: "is_phone_verified",
    nullable: true,
    default: () => "false",
  })
  isPhoneVerified: boolean | null;

  @Column("integer", { name: "height", nullable: true })
  height: number | null;

  @Column("text", { name: "fav_interest", nullable: true, array: true })
  favInterest: string[] | null;

  @Column("text", { name: "causes_you_support", nullable: true, array: true })
  causesYouSupport: string[] | null;

  @Column("text", { name: "quality_you_value", nullable: true, array: true })
  qualityYouValue: string[] | null;

  @Column("jsonb", { name: "prompts", nullable: true, array: true })
  prompts: object[] | null;

  @Column("jsonb", { name: "education", nullable: true, array: true })
  education: object[] | null;

  @Column("character varying", {
    name: "current_city",
    nullable: true,
    length: 255,
  })
  currentCity: string | null;

  @Column("character varying", {
    name: "hometown",
    nullable: true,
    length: 255,
  })
  hometown: string | null;

  @Column("enum", {
    name: "exercise",
    nullable: true,
    enum: ["Heavy", "Light", "Moderate", "None"],
    default: () => "'None'",
  })
  exercise: "Heavy" | "Light" | "Moderate" | "None" | null;

  @Column("enum", {
    name: "education_level",
    nullable: true,
    enum: ["Graduate", "High School", "Postgraduate", "Undergraduate"],
    default: () => "'High School'",
  })
  educationLevel:
    | "Graduate"
    | "High School"
    | "Postgraduate"
    | "Undergraduate"
    | null;

  @Column("enum", {
    name: "drinking",
    nullable: true,
    enum: ["Never", "Occasionally", "Regularly"],
    default: () => "'Never'",
  })
  drinking: "Never" | "Occasionally" | "Regularly" | null;

  @Column("enum", {
    name: "smoking",
    nullable: true,
    enum: ["Never", "Occasionally", "Regularly"],
    default: () => "'Never'",
  })
  smoking: "Never" | "Occasionally" | "Regularly" | null;

  @Column("enum", {
    name: "looking_for",
    nullable: true,
    enum: ["Casual", "Friendship", "Relationship"],
    default: () => "'Friendship'",
  })
  lookingFor: "Casual" | "Friendship" | "Relationship" | null;

  @Column("enum", {
    name: "settle_down_in_months",
    nullable: true,
    enum: ["0-6", "12-24", "24+", "6-12"],
    default: () => "'0-6'",
  })
  settleDownInMonths: "0-6" | "12-24" | "24+" | "6-12" | null;

  @Column("boolean", {
    name: "have_kids",
    nullable: true,
    default: () => "false",
  })
  haveKids: boolean | null;

  @Column("boolean", {
    name: "wants_kids",
    nullable: true,
    default: () => "false",
  })
  wantsKids: boolean | null;

  @Column("enum", {
    name: "star_sign",
    nullable: true,
    enum: [
      "Aquarius",
      "Aries",
      "Cancer",
      "Capricorn",
      "Gemini",
      "Leo",
      "Libra",
      "Pisces",
      "Sagittarius",
      "Scorpio",
      "Taurus",
      "Virgo",
    ],
    default: () => "'Aries'",
  })
  starSign:
    | "Aquarius"
    | "Aries"
    | "Cancer"
    | "Capricorn"
    | "Gemini"
    | "Leo"
    | "Libra"
    | "Pisces"
    | "Sagittarius"
    | "Scorpio"
    | "Taurus"
    | "Virgo"
    | null;

  @Column("integer", { name: "birth_time", nullable: true })
  birthTime: number | null;

  @Column("boolean", {
    name: "kundli_believer",
    nullable: true,
    default: () => "false",
  })
  kundliBeliever: boolean | null;

  @Column("character varying", {
    name: "religion",
    nullable: true,
    length: 100,
  })
  religion: string | null;

  @Column("enum", {
    name: "pronoun",
    nullable: true,
    enum: ["He/Him", "Other", "She/Her", "They/Them"],
    default: () => "'He/Him'",
  })
  pronoun: "He/Him" | "Other" | "She/Her" | "They/Them" | null;

  @Column("boolean", {
    name: "is_deleted",
    nullable: true,
    default: () => "false",
  })
  isDeleted: boolean | null;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyUsersInformations,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "user_login_id", referencedColumnName: "id" }])
  userLogin: DatifyyUsersLogin;
}
