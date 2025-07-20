import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyCuratedDateFeedback } from "./DatifyyCuratedDateFeedback";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";
import { DatifyyCurationWorkflow } from "./DatifyyCurationWorkflow";

@Index("idx_curated_dates_series", ["dateSeriesId"], {})
@Index("idx_curated_dates_upcoming", ["dateTime"], {})
@Index("idx_curated_dates_datetime_status", ["dateTime", "status"], {})
@Index("datifyy_curated_dates_pkey", ["id"], { unique: true })
@Index("idx_curated_dates_user2_status", ["status", "user2Id"], {})
@Index("idx_curated_dates_user1_status", ["status", "user1Id"], {})
@Entity("datifyy_curated_dates", { schema: "public" })
export class DatifyyCuratedDates {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user1_id" })
  user1Id: number;

  @Column("integer", { name: "user2_id" })
  user2Id: number;

  @Column("timestamp without time zone", { name: "date_time" })
  dateTime: Date;

  @Column("integer", {
    name: "duration_minutes",
    nullable: true,
    default: () => "60",
  })
  durationMinutes: number | null;

  @Column("character varying", { name: "mode", length: 10 })
  mode: string;

  @Column("character varying", {
    name: "location_name",
    nullable: true,
    length: 255,
  })
  locationName: string | null;

  @Column("text", { name: "location_address", nullable: true })
  locationAddress: string | null;

  @Column("jsonb", { name: "location_coordinates", nullable: true })
  locationCoordinates: object | null;

  @Column("text", { name: "location_google_maps_url", nullable: true })
  locationGoogleMapsUrl: string | null;

  @Column("text", { name: "meeting_link", nullable: true })
  meetingLink: string | null;

  @Column("character varying", {
    name: "meeting_id",
    nullable: true,
    length: 255,
  })
  meetingId: string | null;

  @Column("character varying", {
    name: "meeting_password",
    nullable: true,
    length: 50,
  })
  meetingPassword: string | null;

  @Column("character varying", {
    name: "status",
    length: 20,
    default: () => "'pending'",
  })
  status: string;

  @Column("uuid", { name: "date_series_id", nullable: true })
  dateSeriesId: string | null;

  @Column("integer", {
    name: "date_number_in_series",
    nullable: true,
    default: () => "1",
  })
  dateNumberInSeries: number | null;

  @Column("text", { name: "admin_notes", nullable: true })
  adminNotes: string | null;

  @Column("text", { name: "special_instructions", nullable: true })
  specialInstructions: string | null;

  @Column("character varying", {
    name: "dress_code",
    nullable: true,
    length: 100,
  })
  dressCode: string | null;

  @Column("text", {
    name: "suggested_conversation_topics",
    nullable: true,
    array: true,
  })
  suggestedConversationTopics: string[] | null;

  @Column("timestamp without time zone", {
    name: "user1_confirmed_at",
    nullable: true,
  })
  user1ConfirmedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "user2_confirmed_at",
    nullable: true,
  })
  user2ConfirmedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "cancelled_at",
    nullable: true,
  })
  cancelledAt: Date | null;

  @Column("text", { name: "cancellation_reason", nullable: true })
  cancellationReason: string | null;

  @Column("character varying", {
    name: "cancellation_category",
    nullable: true,
    length: 50,
  })
  cancellationCategory: string | null;

  @Column("timestamp without time zone", {
    name: "completed_at",
    nullable: true,
  })
  completedAt: Date | null;

  @Column("integer", { name: "actual_duration_minutes", nullable: true })
  actualDurationMinutes: number | null;

  @Column("boolean", {
    name: "reminder_sent_24h",
    nullable: true,
    default: () => "false",
  })
  reminderSent_24h: boolean | null;

  @Column("boolean", {
    name: "reminder_sent_2h",
    nullable: true,
    default: () => "false",
  })
  reminderSent_2h: boolean | null;

  @Column("boolean", {
    name: "follow_up_sent",
    nullable: true,
    default: () => "false",
  })
  followUpSent: boolean | null;

  @Column("integer", { name: "compatibility_score", nullable: true })
  compatibilityScore: number | null;

  @Column("text", { name: "match_reason", nullable: true })
  matchReason: string | null;

  @Column("numeric", {
    name: "algorithm_confidence",
    nullable: true,
    precision: 3,
    scale: 2,
  })
  algorithmConfidence: string | null;

  @Column("integer", {
    name: "tokens_cost_user1",
    nullable: true,
    default: () => "0",
  })
  tokensCostUser1: number | null;

  @Column("integer", {
    name: "tokens_cost_user2",
    nullable: true,
    default: () => "0",
  })
  tokensCostUser2: number | null;

  @Column("timestamp without time zone", {
    name: "curated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  curatedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @Column("integer", {
    name: "admin_priority",
    nullable: true,
    default: () => "2",
  })
  adminPriority: number | null;

  @Column("text", { name: "internal_notes", nullable: true })
  internalNotes: string | null;

  @Column("numeric", {
    name: "success_probability",
    nullable: true,
    precision: 3,
    scale: 2,
  })
  successProbability: string | null;

  @Column("numeric", {
    name: "revenue_impact",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "0",
  })
  revenueImpact: string | null;

  @OneToMany(
    () => DatifyyCuratedDateFeedback,
    (datifyyCuratedDateFeedback) => datifyyCuratedDateFeedback.curatedDate
  )
  datifyyCuratedDateFeedbacks: DatifyyCuratedDateFeedback[];

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyCuratedDates,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "cancelled_by_user_id", referencedColumnName: "id" }])
  cancelledByUser: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyCuratedDates2,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "curated_by", referencedColumnName: "id" }])
  curatedBy: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyCuratedDates3,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedBy: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyCuratedDates4,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user1_id", referencedColumnName: "id" }])
  user1: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyCuratedDates5,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user2_id", referencedColumnName: "id" }])
  user2: DatifyyUsersLogin;

  @OneToMany(
    () => DatifyyCurationWorkflow,
    (datifyyCurationWorkflow) => datifyyCurationWorkflow.curatedDate
  )
  datifyyCurationWorkflows: DatifyyCurationWorkflow[];
}
