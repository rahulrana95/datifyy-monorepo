import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";
import { DatifyyAdminSessions } from "./DatifyyAdminSessions";

@Index("idx_admin_logs_user_action", ["actionType", "adminUserId"], {})
@Index("idx_admin_logs_created", ["createdAt"], {})
@Index("idx_admin_logs_risk", ["createdAt", "riskLevel"], {})
@Index("datifyy_admin_activity_logs_pkey", ["id"], { unique: true })
@Index("idx_admin_logs_resource", ["resourceId", "resourceType"], {})
@Entity("datifyy_admin_activity_logs", { schema: "public" })
export class DatifyyAdminActivityLogs {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "admin_user_id" })
  adminUserId: number;

  @Column("character varying", { name: "action_type", length: 100 })
  actionType: string;

  @Column("character varying", {
    name: "resource_type",
    nullable: true,
    length: 50,
  })
  resourceType: string | null;

  @Column("character varying", {
    name: "resource_id",
    nullable: true,
    length: 100,
  })
  resourceId: string | null;

  @Column("jsonb", { name: "action_details", nullable: true })
  actionDetails: object | null;

  @Column("inet", { name: "ip_address", nullable: true })
  ipAddress: string | null;

  @Column("text", { name: "user_agent", nullable: true })
  userAgent: string | null;

  @Column("integer", { name: "risk_level", nullable: true, default: () => "1" })
  riskLevel: number | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyAdminActivityLogs,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "admin_user_id", referencedColumnName: "id" }])
  adminUser: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyAdminSessions,
    (datifyyAdminSessions) => datifyyAdminSessions.datifyyAdminActivityLogs,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "session_id", referencedColumnName: "id" }])
  session: DatifyyAdminSessions;
}
