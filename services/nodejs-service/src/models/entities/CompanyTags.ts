import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("company_tags_pkey", ["companyId"], { unique: true })
@Entity("company_tags", { schema: "public" })
export class CompanyTags {
  @PrimaryGeneratedColumn({ type: "integer", name: "company_id" })
  companyId: number;

  @Column("character varying", { name: "slug", length: 255 })
  slug: string;

  @Column("character varying", { name: "label", length: 255 })
  label: string;

  @Column("integer", {
    name: "question_count",
    nullable: true,
    default: () => "0",
  })
  questionCount: number | null;
}
