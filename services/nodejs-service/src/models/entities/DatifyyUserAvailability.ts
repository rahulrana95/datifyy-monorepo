import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyAvailabilityBookings } from "./DatifyyAvailabilityBookings";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";
import { DatifyyUserAvailabilityAudit } from "./DatifyyUserAvailabilityAudit";

@Index(
  "idx_datifyy_user_availability_time_overlap",
  ["availabilityDate", "endTime", "startTime", "userId"],
  {}
)
@Index("idx_datifyy_user_availability_date", ["availabilityDate"], {})
@Index(
  "idx_datifyy_user_availability_date_status",
  ["availabilityDate", "status"],
  {}
)
@Index(
  "idx_datifyy_user_availability_user_date",
  ["availabilityDate", "userId"],
  {}
)
@Index(
  "idx_datifyy_user_availability_active_slots",
  ["availabilityDate", "status", "userId"],
  {}
)
@Index("datifyy_user_availability_pkey", ["id"], { unique: true })
@Index(
  "idx_datifyy_user_availability_recurring",
  ["isRecurring", "parentAvailabilityId"],
  {}
)
@Index("idx_datifyy_user_availability_status", ["status"], {})
@Index("idx_datifyy_user_availability_timezone", ["timezone"], {})
@Index("idx_datifyy_user_availability_user_id", ["userId"], {})
@Entity("datifyy_user_availability", { schema: "public" })
export class DatifyyUserAvailability {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("date", { name: "availability_date" })
  availabilityDate: string;

  @Column("time without time zone", { name: "start_time" })
  startTime: string;

  @Column("time without time zone", { name: "end_time" })
  endTime: string;

  @Column("character varying", {
    name: "timezone",
    length: 50,
    default: () => "'UTC'",
  })
  timezone: string;

  @Column("enum", {
    name: "date_type",
    enum: ["offline", "online"],
    default: () => "'offline'",
  })
  dateType: "offline" | "online";

  @Column("enum", {
    name: "status",
    enum: ["active", "cancelled", "completed", "deleted"],
    default: () => "'active'",
  })
  status: "active" | "cancelled" | "completed" | "deleted";

  @Column("boolean", { name: "is_recurring", default: () => "false" })
  isRecurring: boolean;

  @Column("enum", {
    name: "recurrence_type",
    enum: ["custom", "none", "weekly"],
    default: () => "'none'",
  })
  recurrenceType: "custom" | "none" | "weekly";

  @Column("date", { name: "recurrence_end_date", nullable: true })
  recurrenceEndDate: string | null;

  @Column("integer", { name: "parent_availability_id", nullable: true })
  parentAvailabilityId: number | null;

  @Column("integer", { name: "buffer_time_minutes", default: () => "30" })
  bufferTimeMinutes: number;

  @Column("integer", { name: "preparation_time_minutes", default: () => "15" })
  preparationTimeMinutes: number;

  @Column("enum", {
    name: "cancellation_policy",
    enum: ["24_hours", "48_hours", "flexible", "strict"],
    default: () => "'24_hours'",
  })
  cancellationPolicy: "24_hours" | "48_hours" | "flexible" | "strict";

  @Column("character varying", { name: "title", nullable: true, length: 255 })
  title: string | null;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;

  @Column("text", { name: "location_preference", nullable: true })
  locationPreference: string | null;

  @Column("boolean", { name: "is_deleted", default: () => "false" })
  isDeleted: boolean;

  @Column("character varying", {
    name: "deleted_reason",
    nullable: true,
    length: 500,
  })
  deletedReason: string | null;

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
    () => DatifyyAvailabilityBookings,
    (datifyyAvailabilityBookings) => datifyyAvailabilityBookings.availability
  )
  datifyyAvailabilityBookings: DatifyyAvailabilityBookings[];

  @ManyToOne(
    () => DatifyyUserAvailability,
    (datifyyUserAvailability) =>
      datifyyUserAvailability.datifyyUserAvailabilities,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "parent_availability_id", referencedColumnName: "id" }])
  parentAvailability: DatifyyUserAvailability;

  @OneToMany(
    () => DatifyyUserAvailability,
    (datifyyUserAvailability) => datifyyUserAvailability.parentAvailability
  )
  datifyyUserAvailabilities: DatifyyUserAvailability[];

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyUserAvailabilities,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: DatifyyUsersLogin;

  @OneToMany(
    () => DatifyyUserAvailabilityAudit,
    (datifyyUserAvailabilityAudit) => datifyyUserAvailabilityAudit.availability
  )
  datifyyUserAvailabilityAudits: DatifyyUserAvailabilityAudit[];
}
