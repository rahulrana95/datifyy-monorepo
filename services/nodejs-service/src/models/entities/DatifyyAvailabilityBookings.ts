import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyUserAvailability } from "./DatifyyUserAvailability";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";

@Index(
  "idx_datifyy_availability_bookings_availability_id",
  ["availabilityId"],
  {}
)
@Index("idx_datifyy_availability_bookings_booked_by", ["bookedByUserId"], {})
@Index("idx_datifyy_availability_bookings_status", ["bookingStatus"], {})
@Index("datifyy_availability_bookings_pkey", ["id"], { unique: true })
@Entity("datifyy_availability_bookings", { schema: "public" })
export class DatifyyAvailabilityBookings {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "availability_id" })
  availabilityId: number;

  @Column("integer", { name: "booked_by_user_id" })
  bookedByUserId: number;

  @Column("character varying", {
    name: "booking_status",
    length: 20,
    default: () => "'pending'",
  })
  bookingStatus: string;

  @Column("enum", {
    name: "selected_activity",
    enum: [
      "activity",
      "casual",
      "coffee",
      "dinner",
      "drinks",
      "formal",
      "lunch",
      "movie",
      "walk",
    ],
  })
  selectedActivity:
    | "activity"
    | "casual"
    | "coffee"
    | "dinner"
    | "drinks"
    | "formal"
    | "lunch"
    | "movie"
    | "walk";

  @Column("text", { name: "booking_notes", nullable: true })
  bookingNotes: string | null;

  @Column("timestamp without time zone", {
    name: "confirmed_at",
    nullable: true,
  })
  confirmedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "cancelled_at",
    nullable: true,
  })
  cancelledAt: Date | null;

  @Column("text", { name: "cancellation_reason", nullable: true })
  cancellationReason: string | null;

  @Column("boolean", { name: "within_policy", nullable: true })
  withinPolicy: boolean | null;

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

  @ManyToOne(
    () => DatifyyUserAvailability,
    (datifyyUserAvailability) =>
      datifyyUserAvailability.datifyyAvailabilityBookings,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "availability_id", referencedColumnName: "id" }])
  availability: DatifyyUserAvailability;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyAvailabilityBookings,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "booked_by_user_id", referencedColumnName: "id" }])
  bookedByUser: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyAvailabilityBookings2,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "cancelled_by_user_id", referencedColumnName: "id" }])
  cancelledByUser: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyAvailabilityBookings3,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "confirmed_by_user_id", referencedColumnName: "id" }])
  confirmedByUser: DatifyyUsersLogin;
}
