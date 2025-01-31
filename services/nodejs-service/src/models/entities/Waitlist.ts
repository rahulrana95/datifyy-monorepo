import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("waitlist_email_key", ["email"], { unique: true })
@Index("waitlist_pkey", ["id"], { unique: true })
@Entity("waitlist", { schema: "public" })
export class Waitlist {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("character varying", {
    name: "phone_number",
    nullable: true,
    length: 20,
  })
  phoneNumber: string | null;

  @Column("character varying", {
    name: "status",
    nullable: true,
    length: 50,
    default: () => "'waiting'",
  })
  status: string | null;

  @Column("timestamp without time zone", {
    name: "preferred_date",
    nullable: true,
  })
  preferredDate: Date | null;

  @Column("character varying", {
    name: "ip_address",
    nullable: true,
    length: 255,
  })
  ipAddress: string | null;

  @Column("character varying", {
    name: "user_agent",
    nullable: true,
    length: 255,
  })
  userAgent: string | null;

  @Column("character varying", { name: "source", nullable: true, length: 255 })
  source: string | null;

  @Column("character varying", { name: "city", nullable: true, length: 255 })
  city: string | null;

  @Column("character varying", { name: "state", nullable: true, length: 255 })
  state: string | null;

  @Column("character varying", { name: "country", nullable: true, length: 255 })
  country: string | null;

  @Column("bigint", {
    name: "created_at",
    nullable: true,
    default: () => "EXTRACT(epoch FROM now())",
  })
  createdAt: string | null;

  @Column("bigint", { name: "created_at_unix", nullable: true })
  createdAtUnix: string | null;
}
