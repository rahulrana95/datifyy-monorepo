import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";

@Index("datifyy_user_trust_scores_pkey", ["id"], { unique: true })
@Index("idx_trust_scores_probation", ["isOnProbation", "probationUntil"], {})
@Index("idx_trust_scores_overall", ["overallScore"], {})
@Index("unique_user_trust_score", ["userId"], { unique: true })
@Entity("datifyy_user_trust_scores", { schema: "public" })
export class DatifyyUserTrustScores {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id", unique: true })
  userId: number;

  @Column("integer", {
    name: "overall_score",
    nullable: true,
    default: () => "100",
  })
  overallScore: number | null;

  @Column("integer", {
    name: "attendance_score",
    nullable: true,
    default: () => "100",
  })
  attendanceScore: number | null;

  @Column("integer", {
    name: "punctuality_score",
    nullable: true,
    default: () => "100",
  })
  punctualityScore: number | null;

  @Column("integer", {
    name: "feedback_score",
    nullable: true,
    default: () => "100",
  })
  feedbackScore: number | null;

  @Column("integer", {
    name: "profile_completeness_score",
    nullable: true,
    default: () => "0",
  })
  profileCompletenessScore: number | null;

  @Column("integer", {
    name: "total_dates_attended",
    nullable: true,
    default: () => "0",
  })
  totalDatesAttended: number | null;

  @Column("integer", {
    name: "total_dates_cancelled",
    nullable: true,
    default: () => "0",
  })
  totalDatesCancelled: number | null;

  @Column("integer", {
    name: "total_dates_no_show",
    nullable: true,
    default: () => "0",
  })
  totalDatesNoShow: number | null;

  @Column("integer", {
    name: "last_minute_cancellations",
    nullable: true,
    default: () => "0",
  })
  lastMinuteCancellations: number | null;

  @Column("numeric", {
    name: "average_rating",
    nullable: true,
    precision: 3,
    scale: 2,
    default: () => "0.00",
  })
  averageRating: string | null;

  @Column("integer", {
    name: "consecutive_cancellations",
    nullable: true,
    default: () => "0",
  })
  consecutiveCancellations: number | null;

  @Column("timestamp without time zone", {
    name: "last_cancellation_date",
    nullable: true,
  })
  lastCancellationDate: Date | null;

  @Column("integer", {
    name: "warning_level",
    nullable: true,
    default: () => "0",
  })
  warningLevel: number | null;

  @Column("boolean", {
    name: "is_on_probation",
    nullable: true,
    default: () => "false",
  })
  isOnProbation: boolean | null;

  @Column("timestamp without time zone", {
    name: "probation_until",
    nullable: true,
  })
  probationUntil: Date | null;

  @Column("numeric", {
    name: "second_date_rate",
    nullable: true,
    precision: 3,
    scale: 2,
    default: () => "0.00",
  })
  secondDateRate: string | null;

  @Column("integer", {
    name: "positive_feedback_count",
    nullable: true,
    default: () => "0",
  })
  positiveFeedbackCount: number | null;

  @Column("integer", {
    name: "compliments_received",
    nullable: true,
    default: () => "0",
  })
  complimentsReceived: number | null;

  @Column("boolean", {
    name: "can_book_dates",
    nullable: true,
    default: () => "true",
  })
  canBookDates: boolean | null;

  @Column("integer", {
    name: "max_dates_per_week",
    nullable: true,
    default: () => "3",
  })
  maxDatesPerWeek: number | null;

  @Column("boolean", {
    name: "requires_admin_approval",
    nullable: true,
    default: () => "false",
  })
  requiresAdminApproval: boolean | null;

  @Column("timestamp without time zone", {
    name: "last_calculated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  lastCalculatedAt: Date | null;

  @Column("character varying", {
    name: "calculation_reason",
    nullable: true,
    length: 100,
  })
  calculationReason: string | null;

  @Column("text", { name: "admin_override_reason", nullable: true })
  adminOverrideReason: string | null;

  @Column("timestamp without time zone", {
    name: "manual_adjustment_at",
    nullable: true,
  })
  manualAdjustmentAt: Date | null;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyUserTrustScores,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "manual_adjustment_by", referencedColumnName: "id" }])
  manualAdjustmentBy: DatifyyUsersLogin;

  @OneToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyUserTrustScores2,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: DatifyyUsersLogin;
}
