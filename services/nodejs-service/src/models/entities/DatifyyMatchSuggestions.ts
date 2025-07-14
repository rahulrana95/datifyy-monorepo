import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";

@Index("idx_match_suggestions_active", ["expiresAt", "isUsed"], {})
@Index("idx_match_suggestions_target", ["expiresAt", "targetUserId"], {})
@Index("idx_match_suggestions_admin", ["generatedAt", "requestingAdminId"], {})
@Index("datifyy_match_suggestions_pkey", ["id"], { unique: true })
@Entity("datifyy_match_suggestions", { schema: "public" })
export class DatifyyMatchSuggestions {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "requesting_admin_id" })
  requestingAdminId: number;

  @Column("integer", { name: "target_user_id" })
  targetUserId: number;

  @Column("jsonb", { name: "suggested_matches" })
  suggestedMatches: object;

  @Column("jsonb", { name: "filters_applied", nullable: true })
  filtersApplied: object | null;

  @Column("character varying", {
    name: "suggestion_algorithm",
    nullable: true,
    length: 50,
    default: () => "'preference_based'",
  })
  suggestionAlgorithm: string | null;

  @Column("integer", {
    name: "compatibility_threshold",
    nullable: true,
    default: () => "70",
  })
  compatibilityThreshold: number | null;

  @Column("timestamp without time zone", {
    name: "generated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  generatedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "expires_at",
    nullable: true,
    default: () => "(CURRENT_TIMESTAMP + '24:00:00')",
  })
  expiresAt: Date | null;

  @Column("boolean", {
    name: "is_used",
    nullable: true,
    default: () => "false",
  })
  isUsed: boolean | null;

  @Column("jsonb", { name: "usage_details", nullable: true })
  usageDetails: object | null;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyMatchSuggestions,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "requesting_admin_id", referencedColumnName: "id" }])
  requestingAdmin: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyMatchSuggestions2,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "target_user_id", referencedColumnName: "id" }])
  targetUser: DatifyyUsersLogin;
}
