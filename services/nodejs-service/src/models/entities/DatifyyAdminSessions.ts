import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyAdminActivityLogs } from "./DatifyyAdminActivityLogs";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";

@Index("idx_admin_sessions_active", ["adminUserId", "isActive"], {})
@Index("idx_admin_sessions_expires", ["expiresAt"], {})
@Index("datifyy_admin_sessions_pkey", ["id"], { unique: true })
@Index("idx_admin_sessions_activity", ["lastActivityAt"], {})
@Index("datifyy_admin_sessions_session_token_key", ["sessionToken"], {
  unique: true,
})
@Entity("datifyy_admin_sessions", { schema: "public" })
export class DatifyyAdminSessions {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "admin_user_id" })
  adminUserId: number;

  @Column("character varying", {
    name: "session_token",
    unique: true,
    length: 255,
  })
  sessionToken: string;

  @Column("inet", { name: "ip_address", nullable: true })
  ipAddress: string | null;

  @Column("text", { name: "user_agent", nullable: true })
  userAgent: string | null;

  @Column("jsonb", { name: "device_info", nullable: true })
  deviceInfo: object | null;

  @Column("character varying", {
    name: "login_method",
    nullable: true,
    length: 50,
    default: () => "'password'",
  })
  loginMethod: string | null;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "true",
  })
  isActive: boolean | null;

  @Column("timestamp without time zone", { name: "expires_at" })
  expiresAt: Date;

  @Column("timestamp without time zone", {
    name: "last_activity_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  lastActivityAt: Date | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", {
    name: "terminated_at",
    nullable: true,
  })
  terminatedAt: Date | null;

  @OneToMany(
    () => DatifyyAdminActivityLogs,
    (datifyyAdminActivityLogs) => datifyyAdminActivityLogs.session
  )
  datifyyAdminActivityLogs: DatifyyAdminActivityLogs[];

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyAdminSessions,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "admin_user_id", referencedColumnName: "id" }])
  adminUser: DatifyyUsersLogin;
}
