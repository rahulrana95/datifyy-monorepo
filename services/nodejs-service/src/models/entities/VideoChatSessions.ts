import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyEvents } from "./DatifyyEvents";

@Index("unique_event_man_woman", ["eventId", "manEmail", "womanEmail"], {
  unique: true,
})
@Index("video_chat_sessions_pkey", ["sessionId"], { unique: true })
@Entity("video_chat_sessions", { schema: "public" })
export class VideoChatSessions {
  @PrimaryGeneratedColumn({ type: "integer", name: "session_id" })
  sessionId: number;

  @Column("integer", { name: "event_id", nullable: true, unique: true })
  eventId: number | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("character varying", {
    name: "man_email",
    nullable: true,
    unique: true,
    length: 255,
  })
  manEmail: string | null;

  @Column("character varying", {
    name: "woman_email",
    nullable: true,
    unique: true,
    length: 255,
  })
  womanEmail: string | null;

  @Column("character varying", {
    name: "status",
    nullable: true,
    length: 20,
    default: () => "'available'",
  })
  status: string | null;

  @ManyToOne(
    () => DatifyyEvents,
    (datifyyEvents) => datifyyEvents.videoChatSessions,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: DatifyyEvents;
}
