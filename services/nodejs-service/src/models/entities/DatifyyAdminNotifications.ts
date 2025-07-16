import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";

@Index("idx_admin_notifications_status", ["createdAt", "status"], {})
@Index("datifyy_admin_notifications_pkey", ["id"], { unique: true })
@Index("idx_admin_notifications_type", ["notificationType", "triggerEvent"], {})
@Index("idx_admin_notifications_recipient", ["recipientAdminId", "status"], {})
@Entity("datifyy_admin_notifications", { schema: "public" })
export class DatifyyAdminNotifications {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "notification_type", length: 50 })
  notificationType: string;

  @Column("character varying", { name: "trigger_event", length: 100 })
  triggerEvent: string;

  @Column("integer", { name: "recipient_admin_id", nullable: true })
  recipientAdminId: number | null;

  @Column("character varying", {
    name: "recipient_channel",
    nullable: true,
    length: 255,
  })
  recipientChannel: string | null;

  @Column("character varying", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "message" })
  message: string;

  @Column("jsonb", { name: "metadata", nullable: true })
  metadata: object | null;

  @Column("character varying", {
    name: "status",
    nullable: true,
    length: 20,
    default: () => "'pending'",
  })
  status: string | null;

  @Column("timestamp without time zone", { name: "sent_at", nullable: true })
  sentAt: Date | null;

  @Column("timestamp without time zone", {
    name: "delivery_confirmed_at",
    nullable: true,
  })
  deliveryConfirmedAt: Date | null;

  @Column("text", { name: "failure_reason", nullable: true })
  failureReason: string | null;

  @Column("integer", { name: "priority", nullable: true, default: () => "2" })
  priority: number | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @Column("integer", { name: "retry_count", nullable: true, default: () => "0" })
  retryCount: number | null;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyAdminNotifications,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "recipient_admin_id", referencedColumnName: "id" }])
  recipientAdmin: DatifyyUsersLogin;
}
