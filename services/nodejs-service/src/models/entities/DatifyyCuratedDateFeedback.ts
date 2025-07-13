import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyCuratedDates } from "./DatifyyCuratedDates";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";

@Index("idx_feedback_curated_date", ["curatedDateId"], {})
@Index("unique_user_date_feedback", ["curatedDateId", "userId"], {
  unique: true,
})
@Index("datifyy_curated_date_feedback_pkey", ["id"], { unique: true })
@Index("idx_feedback_user_rating", ["overallRating", "userId"], {})
@Index("idx_feedback_submitted_at", ["submittedAt"], {})
@Entity("datifyy_curated_date_feedback", { schema: "public" })
export class DatifyyCuratedDateFeedback {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "curated_date_id", unique: true })
  curatedDateId: number;

  @Column("integer", { name: "user_id", unique: true })
  userId: number;

  @Column("integer", { name: "overall_rating", nullable: true })
  overallRating: number | null;

  @Column("boolean", { name: "would_meet_again", nullable: true })
  wouldMeetAgain: boolean | null;

  @Column("integer", { name: "chemistry_rating", nullable: true })
  chemistryRating: number | null;

  @Column("integer", { name: "conversation_quality", nullable: true })
  conversationQuality: number | null;

  @Column("text", { name: "what_went_well", nullable: true })
  whatWentWell: string | null;

  @Column("text", { name: "what_could_improve", nullable: true })
  whatCouldImprove: string | null;

  @Column("text", { name: "favorite_moment", nullable: true })
  favoriteMoment: string | null;

  @Column("integer", { name: "partner_punctuality", nullable: true })
  partnerPunctuality: number | null;

  @Column("integer", { name: "partner_appearance_match", nullable: true })
  partnerAppearanceMatch: number | null;

  @Column("text", { name: "suggested_improvements", nullable: true })
  suggestedImprovements: string | null;

  @Column("character varying", {
    name: "preferred_next_date_activity",
    nullable: true,
    length: 100,
  })
  preferredNextDateActivity: string | null;

  @Column("character varying", {
    name: "preferred_next_date_timing",
    nullable: true,
    length: 50,
  })
  preferredNextDateTiming: string | null;

  @Column("boolean", {
    name: "safety_concerns",
    nullable: true,
    default: () => "false",
  })
  safetyConcerns: boolean | null;

  @Column("text", { name: "red_flags", nullable: true, array: true })
  redFlags: string[] | null;

  @Column("boolean", {
    name: "report_user",
    nullable: true,
    default: () => "false",
  })
  reportUser: boolean | null;

  @Column("text", { name: "report_reason", nullable: true })
  reportReason: string | null;

  @Column("integer", { name: "venue_rating", nullable: true })
  venueRating: number | null;

  @Column("integer", { name: "timing_satisfaction", nullable: true })
  timingSatisfaction: number | null;

  @Column("integer", { name: "duration_satisfaction", nullable: true })
  durationSatisfaction: number | null;

  @Column("boolean", { name: "interested_in_second_date", nullable: true })
  interestedInSecondDate: boolean | null;

  @Column("character varying", {
    name: "preferred_contact_method",
    nullable: true,
    length: 50,
  })
  preferredContactMethod: string | null;

  @Column("text", { name: "additional_comments", nullable: true })
  additionalComments: string | null;

  @Column("timestamp without time zone", {
    name: "submitted_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  submittedAt: Date | null;

  @Column("boolean", {
    name: "is_anonymous",
    nullable: true,
    default: () => "false",
  })
  isAnonymous: boolean | null;

  @ManyToOne(
    () => DatifyyCuratedDates,
    (datifyyCuratedDates) => datifyyCuratedDates.datifyyCuratedDateFeedbacks,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "curated_date_id", referencedColumnName: "id" }])
  curatedDate: DatifyyCuratedDates;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyCuratedDateFeedbacks,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: DatifyyUsersLogin;
}
