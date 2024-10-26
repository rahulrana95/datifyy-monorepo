import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("unique_date", ["date"], { unique: true })
@Index("smallcaseinvestment_pkey", ["id"], { unique: true })
@Entity("smallcaseinvestment", { schema: "public" })
export class Smallcaseinvestment {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "date", nullable: true, unique: true })
  date: string | null;

  @Column("double precision", {
    name: "totalvalue",
    nullable: true,
    precision: 53,
  })
  totalvalue: number | null;

  @Column("double precision", {
    name: "totalreturns",
    nullable: true,
    precision: 53,
  })
  totalreturns: number | null;

  @Column("double precision", {
    name: "totalreturnpercentage",
    nullable: true,
    precision: 53,
  })
  totalreturnpercentage: number | null;
}
