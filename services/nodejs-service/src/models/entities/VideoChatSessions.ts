import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyEvents } from "./DatifyyEvents";

@Index("video_chat_sessions_pkey", ["sessionId"], { unique: true })
@Entity("video_chat_sessions", { schema: "public" })
export class VideoChatSessions {
  @PrimaryGeneratedColumn({ type: "integer", name: "session_id" })
  sessionId: number;

  @Column("character varying", { name: "status", nullable: true, length: 20 })
  status: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("character varying", {
    name: "man_email",
    nullable: true,
    length: 255,
  })
  manEmail: string | null;

  @Column("character varying", {
    name: "woman_email",
    nullable: true,
    length: 255,
  })
  womanEmail: string | null;

  @ManyToOne(
    () => DatifyyEvents,
    (datifyyEvents) => datifyyEvents.videoChatSessions,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: DatifyyEvents;
}
