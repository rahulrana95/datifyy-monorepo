import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";

@Index("datifyy_date_series_pkey", ["id"], { unique: true })
@Index("idx_date_series_last_date", ["lastDateAt"], {})
@Index("idx_date_series_status", ["seriesStatus"], {})
@Index("unique_user_pair_series", ["user1Id", "user2Id"], { unique: true })
@Index("idx_date_series_users", ["user1Id", "user2Id"], {})
@Entity("datifyy_date_series", { schema: "public" })
export class DatifyyDateSeries {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("integer", { name: "user1_id", unique: true })
  user1Id: number;

  @Column("integer", { name: "user2_id", unique: true })
  user2Id: number;

  @Column("character varying", {
    name: "series_status",
    nullable: true,
    length: 20,
    default: () => "'active'",
  })
  seriesStatus: string | null;

  @Column("integer", {
    name: "total_dates_in_series",
    nullable: true,
    default: () => "0",
  })
  totalDatesInSeries: number | null;

  @Column("timestamp without time zone", {
    name: "last_date_at",
    nullable: true,
  })
  lastDateAt: Date | null;

  @Column("timestamp without time zone", {
    name: "next_suggested_date",
    nullable: true,
  })
  nextSuggestedDate: Date | null;

  @Column("character varying", {
    name: "relationship_stage",
    nullable: true,
    length: 50,
    default: () => "'getting_to_know'",
  })
  relationshipStage: string | null;

  @Column("integer", { name: "mutual_interest_level", nullable: true })
  mutualInterestLevel: number | null;

  @Column("text", { name: "admin_notes", nullable: true })
  adminNotes: string | null;

  @Column("character varying", {
    name: "preferred_date_frequency",
    nullable: true,
    length: 50,
  })
  preferredDateFrequency: string | null;

  @Column("text", { name: "preferred_date_types", nullable: true, array: true })
  preferredDateTypes: string[] | null;

  @Column("character varying", {
    name: "series_ended_reason",
    nullable: true,
    length: 100,
  })
  seriesEndedReason: string | null;

  @Column("timestamp without time zone", { name: "ended_at", nullable: true })
  endedAt: Date | null;

  @Column("character varying", {
    name: "final_outcome",
    nullable: true,
    length: 50,
  })
  finalOutcome: string | null;

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

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyDateSeries,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "ended_by_user_id", referencedColumnName: "id" }])
  endedByUser: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyDateSeries2,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user1_id", referencedColumnName: "id" }])
  user1: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyDateSeries3,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user2_id", referencedColumnName: "id" }])
  user2: DatifyyUsersLogin;
}
