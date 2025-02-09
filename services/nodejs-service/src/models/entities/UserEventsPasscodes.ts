import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyEvents } from "./DatifyyEvents";

@Index("user_events_passcodes_email_event_id_key", ["email", "eventId"], {
  unique: true,
})
@Index("user_events_passcodes_email_key", ["email"], { unique: true })
@Index("user_events_passcodes_pkey", ["id"], { unique: true })
@Entity("user_events_passcodes", { schema: "public" })
export class UserEventsPasscodes {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "event_id", unique: true })
  eventId: number;

  @Column("character varying", { name: "passcode", length: 10 })
  passcode: string;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(
    () => DatifyyEvents,
    (datifyyEvents) => datifyyEvents.userEventsPasscodes,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: DatifyyEvents;
}
