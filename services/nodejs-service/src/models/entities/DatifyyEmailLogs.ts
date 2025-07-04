import { Column, Entity, Index } from "typeorm";

@Index("datifyy_email_logs_pkey", ["id"], { unique: true })
@Index("idx_email_logs_sent_at", ["sentAt"], {})
@Index("idx_email_logs_status", ["status"], {})
@Index("idx_email_logs_user_id", ["userId"], {})
@Entity("datifyy_email_logs", { schema: "public" })
export class DatifyyEmailLogs {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("integer", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("character varying", { name: "email_type", length: 50 })
  emailType: string;

  @Column("timestamp with time zone", {
    name: "sent_at",
    default: () => "now()",
  })
  sentAt: Date;

  @Column("character varying", { name: "status", length: 20 })
  status: string;

  @Column("text", { name: "failure_reason", nullable: true })
  failureReason: string | null;

  @Column("jsonb", { name: "metadata", nullable: true })
  metadata: object | null;

  @Column("character varying", {
    name: "email",
    length: 255,
    default: () => "''",
  })
  email: string;
}
