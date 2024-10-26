import { Column, Entity, Index } from "typeorm";

@Index("users_login_pkey", ["uuid"], { unique: true })
@Entity("users_login", { schema: "public" })
export class UsersLogin {
  @Column("uuid", {
    primary: true,
    name: "uuid",
    default: () => "gen_random_uuid()",
  })
  uuid: string;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @Column("character varying", { name: "password", length: 255 })
  password: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @Column("timestamp with time zone", { name: "last_login", nullable: true })
  lastLogin: Date | null;

  @Column("uuid", { name: "password_reset_token", nullable: true })
  passwordResetToken: string | null;

  @Column("timestamp with time zone", {
    name: "password_reset_expires",
    nullable: true,
  })
  passwordResetExpires: Date | null;

  @Column("character varying", {
    name: "account_status",
    nullable: true,
    length: 50,
    default: () => "'active'",
  })
  accountStatus: string | null;
}
