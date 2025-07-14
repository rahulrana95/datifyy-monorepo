import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyAdminActivityLogs } from "./DatifyyAdminActivityLogs";
import { DatifyyAdminNotifications } from "./DatifyyAdminNotifications";
import { DatifyyAdminSessions } from "./DatifyyAdminSessions";
import { DatifyyAvailabilityBookings } from "./DatifyyAvailabilityBookings";
import { DatifyyCuratedDateFeedback } from "./DatifyyCuratedDateFeedback";
import { DatifyyCuratedDates } from "./DatifyyCuratedDates";
import { DatifyyCurationWorkflow } from "./DatifyyCurationWorkflow";
import { DatifyyDateSeries } from "./DatifyyDateSeries";
import { DatifyyEvents } from "./DatifyyEvents";
import { DatifyyMatchSuggestions } from "./DatifyyMatchSuggestions";
import { DatifyyTicketPurchases } from "./DatifyyTicketPurchases";
import { DatifyyTransactions } from "./DatifyyTransactions";
import { DatifyyUserAvailability } from "./DatifyyUserAvailability";
import { DatifyyUserAvailabilityAudit } from "./DatifyyUserAvailabilityAudit";
import { DatifyyUserAvailabilityPreferences } from "./DatifyyUserAvailabilityPreferences";
import { DatifyyUserPartnerPreferences } from "./DatifyyUserPartnerPreferences";
import { DatifyyUserTrustScores } from "./DatifyyUserTrustScores";
import { DatifyyUsersInformation } from "./DatifyyUsersInformation";

@Index("idx_datifyy_users_login_account_status", ["accountStatus"], {})
@Index("idx_datifyy_users_login_created_at", ["createdAt"], {})
@Index("datifyy_users_login_email_key", ["email"], { unique: true })
@Index("datifyy_users_login_pkey", ["id"], { unique: true })
@Index("idx_datifyy_users_login_last_active_at", ["lastActiveAt"], {})
@Index("idx_datifyy_users_login_last_login_at", ["lastLoginAt"], {})
@Index("idx_datifyy_users_login_locked_at", ["lockedAt"], {})
@Index("idx_datifyy_users_login_permission_level", ["permissionLevel"], {})
@Entity("datifyy_users_login", { schema: "public" })
export class DatifyyUsersLogin {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("character varying", { name: "password", length: 255 })
  password: string;

  @Column("timestamp without time zone", {
    name: "last_login_at",
    nullable: true,
  })
  lastLoginAt: Date | null;

  @Column("boolean", {
    name: "isactive",
    nullable: true,
    default: () => "true",
  })
  isactive: boolean | null;

  @Column("boolean", {
    name: "isadmin",
    nullable: true,
    default: () => "false",
  })
  isadmin: boolean | null;

  @Column("character varying", {
    name: "gender",
    nullable: true,
    length: 10,
    default: () => "'male'",
  })
  gender: string | null;

  @Column("enum", {
    name: "permission_level",
    nullable: true,
    enum: ["admin", "moderator", "owner", "super_admin", "viewer"],
    default: () => "'viewer'",
  })
  permissionLevel:
    | "admin"
    | "moderator"
    | "owner"
    | "super_admin"
    | "viewer"
    | null;

  @Column("enum", {
    name: "account_status",
    nullable: true,
    enum: ["active", "deactivated", "locked", "pending", "suspended"],
    default: () => "'active'",
  })
  accountStatus:
    | "active"
    | "deactivated"
    | "locked"
    | "pending"
    | "suspended"
    | null;

  @Column("integer", { name: "failed_login_attempts", default: () => "0" })
  failedLoginAttempts: number;

  @Column("timestamp without time zone", { name: "locked_at", nullable: true })
  lockedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "lock_expires_at",
    nullable: true,
  })
  lockExpiresAt: Date | null;

  @Column("timestamp without time zone", {
    name: "last_active_at",
    nullable: true,
  })
  lastActiveAt: Date | null;

  @Column("inet", { name: "last_login_ip", nullable: true })
  lastLoginIp: string | null;

  @Column("text", { name: "last_login_user_agent", nullable: true })
  lastLoginUserAgent: string | null;

  @Column("integer", { name: "login_count", default: () => "0" })
  loginCount: number;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp without time zone", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @OneToMany(
    () => DatifyyAdminActivityLogs,
    (datifyyAdminActivityLogs) => datifyyAdminActivityLogs.adminUser
  )
  datifyyAdminActivityLogs: DatifyyAdminActivityLogs[];

  @OneToMany(
    () => DatifyyAdminNotifications,
    (datifyyAdminNotifications) => datifyyAdminNotifications.recipientAdmin
  )
  datifyyAdminNotifications: DatifyyAdminNotifications[];

  @OneToMany(
    () => DatifyyAdminSessions,
    (datifyyAdminSessions) => datifyyAdminSessions.adminUser
  )
  datifyyAdminSessions: DatifyyAdminSessions[];

  @OneToMany(
    () => DatifyyAvailabilityBookings,
    (datifyyAvailabilityBookings) => datifyyAvailabilityBookings.bookedByUser
  )
  datifyyAvailabilityBookings: DatifyyAvailabilityBookings[];

  @OneToMany(
    () => DatifyyAvailabilityBookings,
    (datifyyAvailabilityBookings) => datifyyAvailabilityBookings.cancelledByUser
  )
  datifyyAvailabilityBookings2: DatifyyAvailabilityBookings[];

  @OneToMany(
    () => DatifyyAvailabilityBookings,
    (datifyyAvailabilityBookings) => datifyyAvailabilityBookings.confirmedByUser
  )
  datifyyAvailabilityBookings3: DatifyyAvailabilityBookings[];

  @OneToMany(
    () => DatifyyCuratedDateFeedback,
    (datifyyCuratedDateFeedback) => datifyyCuratedDateFeedback.user
  )
  datifyyCuratedDateFeedbacks: DatifyyCuratedDateFeedback[];

  @OneToMany(
    () => DatifyyCuratedDates,
    (datifyyCuratedDates) => datifyyCuratedDates.cancelledByUser
  )
  datifyyCuratedDates: DatifyyCuratedDates[];

  @OneToMany(
    () => DatifyyCuratedDates,
    (datifyyCuratedDates) => datifyyCuratedDates.curatedBy
  )
  datifyyCuratedDates2: DatifyyCuratedDates[];

  @OneToMany(
    () => DatifyyCuratedDates,
    (datifyyCuratedDates) => datifyyCuratedDates.updatedBy
  )
  datifyyCuratedDates3: DatifyyCuratedDates[];

  @OneToMany(
    () => DatifyyCuratedDates,
    (datifyyCuratedDates) => datifyyCuratedDates.user1
  )
  datifyyCuratedDates4: DatifyyCuratedDates[];

  @OneToMany(
    () => DatifyyCuratedDates,
    (datifyyCuratedDates) => datifyyCuratedDates.user2
  )
  datifyyCuratedDates5: DatifyyCuratedDates[];

  @OneToMany(
    () => DatifyyCurationWorkflow,
    (datifyyCurationWorkflow) => datifyyCurationWorkflow.assignedAdmin
  )
  datifyyCurationWorkflows: DatifyyCurationWorkflow[];

  @OneToMany(
    () => DatifyyCurationWorkflow,
    (datifyyCurationWorkflow) => datifyyCurationWorkflow.createdBy
  )
  datifyyCurationWorkflows2: DatifyyCurationWorkflow[];

  @OneToMany(
    () => DatifyyDateSeries,
    (datifyyDateSeries) => datifyyDateSeries.endedByUser
  )
  datifyyDateSeries: DatifyyDateSeries[];

  @OneToMany(
    () => DatifyyDateSeries,
    (datifyyDateSeries) => datifyyDateSeries.user1
  )
  datifyyDateSeries2: DatifyyDateSeries[];

  @OneToMany(
    () => DatifyyDateSeries,
    (datifyyDateSeries) => datifyyDateSeries.user2
  )
  datifyyDateSeries3: DatifyyDateSeries[];

  @OneToMany(() => DatifyyEvents, (datifyyEvents) => datifyyEvents.createdby)
  datifyyEvents: DatifyyEvents[];

  @OneToMany(() => DatifyyEvents, (datifyyEvents) => datifyyEvents.updatedby)
  datifyyEvents2: DatifyyEvents[];

  @OneToMany(
    () => DatifyyMatchSuggestions,
    (datifyyMatchSuggestions) => datifyyMatchSuggestions.requestingAdmin
  )
  datifyyMatchSuggestions: DatifyyMatchSuggestions[];

  @OneToMany(
    () => DatifyyMatchSuggestions,
    (datifyyMatchSuggestions) => datifyyMatchSuggestions.targetUser
  )
  datifyyMatchSuggestions2: DatifyyMatchSuggestions[];

  @OneToMany(
    () => DatifyyTicketPurchases,
    (datifyyTicketPurchases) => datifyyTicketPurchases.user
  )
  datifyyTicketPurchases: DatifyyTicketPurchases[];

  @OneToMany(
    () => DatifyyTransactions,
    (datifyyTransactions) => datifyyTransactions.adminReviewedBy
  )
  datifyyTransactions: DatifyyTransactions[];

  @OneToMany(
    () => DatifyyTransactions,
    (datifyyTransactions) => datifyyTransactions.authorizedBy
  )
  datifyyTransactions2: DatifyyTransactions[];

  @OneToMany(
    () => DatifyyTransactions,
    (datifyyTransactions) => datifyyTransactions.initiatedBy
  )
  datifyyTransactions3: DatifyyTransactions[];

  @OneToMany(
    () => DatifyyTransactions,
    (datifyyTransactions) => datifyyTransactions.user
  )
  datifyyTransactions4: DatifyyTransactions[];

  @OneToMany(
    () => DatifyyTransactions,
    (datifyyTransactions) => datifyyTransactions.user_2
  )
  datifyyTransactions5: DatifyyTransactions[];

  @OneToMany(
    () => DatifyyUserAvailability,
    (datifyyUserAvailability) => datifyyUserAvailability.user
  )
  datifyyUserAvailabilities: DatifyyUserAvailability[];

  @OneToMany(
    () => DatifyyUserAvailabilityAudit,
    (datifyyUserAvailabilityAudit) => datifyyUserAvailabilityAudit.adminUser
  )
  datifyyUserAvailabilityAudits: DatifyyUserAvailabilityAudit[];

  @OneToMany(
    () => DatifyyUserAvailabilityAudit,
    (datifyyUserAvailabilityAudit) => datifyyUserAvailabilityAudit.user
  )
  datifyyUserAvailabilityAudits2: DatifyyUserAvailabilityAudit[];

  @OneToOne(
    () => DatifyyUserAvailabilityPreferences,
    (datifyyUserAvailabilityPreferences) =>
      datifyyUserAvailabilityPreferences.user
  )
  datifyyUserAvailabilityPreferences: DatifyyUserAvailabilityPreferences;

  @OneToMany(
    () => DatifyyUserPartnerPreferences,
    (datifyyUserPartnerPreferences) => datifyyUserPartnerPreferences.user
  )
  datifyyUserPartnerPreferences: DatifyyUserPartnerPreferences[];

  @OneToMany(
    () => DatifyyUserTrustScores,
    (datifyyUserTrustScores) => datifyyUserTrustScores.manualAdjustmentBy
  )
  datifyyUserTrustScores: DatifyyUserTrustScores[];

  @OneToOne(
    () => DatifyyUserTrustScores,
    (datifyyUserTrustScores) => datifyyUserTrustScores.user
  )
  datifyyUserTrustScores2: DatifyyUserTrustScores;

  @OneToMany(
    () => DatifyyUsersInformation,
    (datifyyUsersInformation) => datifyyUsersInformation.userLogin
  )
  datifyyUsersInformations: DatifyyUsersInformation[];
}
