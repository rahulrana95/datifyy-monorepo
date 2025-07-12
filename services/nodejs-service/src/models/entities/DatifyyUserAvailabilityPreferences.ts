import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";

@Index("datifyy_user_availability_preferences_pkey", ["id"], { unique: true })
@Index("datifyy_user_availability_preferences_user_id_key", ["userId"], {
  unique: true,
})
@Entity("datifyy_user_availability_preferences", { schema: "public" })
export class DatifyyUserAvailabilityPreferences {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id", unique: true })
  userId: number;

  @Column("integer", {
    name: "default_buffer_time_minutes",
    default: () => "30",
  })
  defaultBufferTimeMinutes: number;

  @Column("integer", {
    name: "default_preparation_time_minutes",
    default: () => "15",
  })
  defaultPreparationTimeMinutes: number;

  @Column("enum", {
    name: "default_cancellation_policy",
    enum: ["24_hours", "48_hours", "flexible", "strict"],
    default: () => "'24_hours'",
  })
  defaultCancellationPolicy: "24_hours" | "48_hours" | "flexible" | "strict";

  @Column("integer", { name: "max_daily_slots", default: () => "3" })
  maxDailySlots: number;

  @Column("integer", { name: "max_weekly_hours", default: () => "20" })
  maxWeeklyHours: number;

  @Column("character varying", {
    name: "default_timezone",
    length: 50,
    default: () => "'UTC'",
  })
  defaultTimezone: string;

  @Column("integer", { name: "offline_radius_km", default: () => "25" })
  offlineRadiusKm: number;

  @Column("boolean", { name: "auto_approve_bookings", default: () => "true" })
  autoApproveBookings: boolean;

  @Column("boolean", {
    name: "allow_back_to_back_dates",
    default: () => "false",
  })
  allowBackToBackDates: boolean;

  @Column("boolean", {
    name: "weekend_availability_only",
    default: () => "false",
  })
  weekendAvailabilityOnly: boolean;

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

  @OneToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyUserAvailabilityPreferences,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: DatifyyUsersLogin;
}
