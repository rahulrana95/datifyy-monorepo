import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";
import { DatifyyUserAvailability } from "./DatifyyUserAvailability";

@Index("idx_datifyy_availability_audit_action", ["action"], {})
@Index("idx_datifyy_availability_audit_availability_id", ["availabilityId"], {})
@Index("idx_datifyy_availability_audit_created_at", ["createdAt"], {})
@Index("datifyy_user_availability_audit_pkey", ["id"], { unique: true })
@Index("idx_datifyy_availability_audit_user_id", ["userId"], {})
@Entity("datifyy_user_availability_audit", { schema: "public" })
export class DatifyyUserAvailabilityAudit {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "availability_id", nullable: true })
  availabilityId: number | null;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("character varying", { name: "action", length: 50 })
  action: string;

  @Column("character varying", { name: "table_name", length: 50 })
  tableName: string;

  @Column("jsonb", { name: "old_values", nullable: true })
  oldValues: object | null;

  @Column("jsonb", { name: "new_values", nullable: true })
  newValues: object | null;

  @Column("text", { name: "changed_fields", nullable: true, array: true })
  changedFields: string[] | null;

  @Column("inet", { name: "ip_address", nullable: true })
  ipAddress: string | null;

  @Column("text", { name: "user_agent", nullable: true })
  userAgent: string | null;

  @Column("character varying", {
    name: "request_id",
    nullable: true,
    length: 100,
  })
  requestId: string | null;

  @Column("text", { name: "reason", nullable: true })
  reason: string | null;

  @Column("boolean", { name: "performed_by_admin", default: () => "false" })
  performedByAdmin: boolean;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyUserAvailabilityAudits,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "admin_user_id", referencedColumnName: "id" }])
  adminUser: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUserAvailability,
    (datifyyUserAvailability) =>
      datifyyUserAvailability.datifyyUserAvailabilityAudits,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "availability_id", referencedColumnName: "id" }])
  availability: DatifyyUserAvailability;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyUserAvailabilityAudits2,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: DatifyyUsersLogin;
}
