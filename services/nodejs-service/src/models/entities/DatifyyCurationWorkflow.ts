import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";
import { DatifyyCuratedDates } from "./DatifyyCuratedDates";

@Index("idx_workflow_assigned_admin", ["assignedAdminId", "stageStatus"], {})
@Index("idx_workflow_due_date", ["dueAt"], {})
@Index("datifyy_curation_workflow_pkey", ["id"], { unique: true })
@Index("idx_workflow_stage_status", ["stage", "stageStatus"], {})
@Entity("datifyy_curation_workflow", { schema: "public" })
export class DatifyyCurationWorkflow {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "stage", length: 50 })
  stage: string;

  @Column("character varying", {
    name: "stage_status",
    nullable: true,
    length: 20,
    default: () => "'pending'",
  })
  stageStatus: string | null;

  @Column("text", { name: "stage_notes", nullable: true })
  stageNotes: string | null;

  @Column("integer", { name: "assigned_admin_id", nullable: true })
  assignedAdminId: number | null;

  @Column("timestamp without time zone", {
    name: "started_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  startedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "completed_at",
    nullable: true,
  })
  completedAt: Date | null;

  @Column("timestamp without time zone", { name: "due_at", nullable: true })
  dueAt: Date | null;

  @Column("boolean", {
    name: "is_automated",
    nullable: true,
    default: () => "false",
  })
  isAutomated: boolean | null;

  @Column("character varying", {
    name: "automation_trigger",
    nullable: true,
    length: 100,
  })
  automationTrigger: string | null;

  @Column("timestamp without time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyCurationWorkflows,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "assigned_admin_id", referencedColumnName: "id" }])
  assignedAdmin: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyCurationWorkflows2,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdBy: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyCuratedDates,
    (datifyyCuratedDates) => datifyyCuratedDates.datifyyCurationWorkflows,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "curated_date_id", referencedColumnName: "id" }])
  curatedDate: DatifyyCuratedDates;
}
