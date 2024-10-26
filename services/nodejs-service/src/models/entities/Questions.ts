import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("questions_pkey", ["id"], { unique: true })
@Entity("questions", { schema: "public" })
export class Questions {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("text", { name: "examples", nullable: true })
  examples: string | null;

  @Column("boolean", {
    name: "has_solution",
    nullable: true,
    default: () => "false",
  })
  hasSolution: boolean | null;

  @Column("boolean", {
    name: "has_video_solution",
    nullable: true,
    default: () => "false",
  })
  hasVideoSolution: boolean | null;

  @Column("integer", { name: "created_by" })
  createdBy: number;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("int4", { name: "company_tags", nullable: true, array: true })
  companyTags: number[] | null;

  @Column("enum", {
    name: "difficulty",
    enum: ["easy", "medium", "difficult", "expert"],
  })
  difficulty: "easy" | "medium" | "difficult" | "expert";

  @Column("boolean", {
    name: "is_frontend_app",
    nullable: true,
    default: () => "false",
  })
  isFrontendApp: boolean | null;

  @Column("boolean", {
    name: "has_template",
    nullable: true,
    default: () => "false",
  })
  hasTemplate: boolean | null;

  @Column("jsonb", { name: "template", nullable: true })
  template: object | null;

  @Column("jsonb", { name: "solution", nullable: true })
  solution: object | null;

  @Column("text", { name: "tags", nullable: true, array: true })
  tags: string[] | null;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @Column("integer", { name: "updated_by", nullable: true })
  updatedBy: number | null;

  @Column("text", { name: "official_solution", nullable: true })
  officialSolution: string | null;

  @Column("int4", { name: "comments", nullable: true, array: true })
  comments: number[] | null;

  @Column("text", { name: "video_solution_url", nullable: true })
  videoSolutionUrl: string | null;
}
