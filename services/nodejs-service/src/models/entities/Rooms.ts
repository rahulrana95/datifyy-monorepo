import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyEvents } from "./DatifyyEvents";

@Index("unique_event_user_email", ["eventId", "userEmail"], { unique: true })
@Index("rooms_pkey", ["id"], { unique: true })
@Index("idx_room_id", ["roomId"], {})
@Index("idx_user_email", ["userEmail"], {})
@Entity("rooms", { schema: "public" })
export class Rooms {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "room_id", length: 255 })
  roomId: string;

  @Column("character varying", {
    name: "user_email",
    unique: true,
    length: 255,
  })
  userEmail: string;

  @Column("integer", { name: "event_id", unique: true })
  eventId: number;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "true",
  })
  isActive: boolean | null;

  @Column("timestamp without time zone", { name: "starts_at", nullable: true })
  startsAt: Date | null;

  @Column("integer", { name: "duration", nullable: true })
  duration: number | null;

  @Column("boolean", {
    name: "is_completed",
    nullable: true,
    default: () => "false",
  })
  isCompleted: boolean | null;

  @Column("character varying", {
    name: "gender",
    nullable: true,
    length: 10,
    default: () => "'male'",
  })
  gender: string | null;

  @ManyToOne(() => DatifyyEvents, (datifyyEvents) => datifyyEvents.rooms, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: DatifyyEvents;
}
