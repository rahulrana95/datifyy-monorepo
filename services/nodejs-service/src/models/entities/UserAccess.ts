import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("user_access_pkey", ["userId"], { unique: true })
@Entity("user_access", { schema: "public" })
export class UserAccess {
  @PrimaryGeneratedColumn({ type: "integer", name: "user_id" })
  userId: number;

  @Column("enum", {
    name: "access_type",
    enum: ["Admin", "SuperAdmin", "User"],
  })
  accessType: "Admin" | "SuperAdmin" | "User";

  @Column("boolean", { name: "isactive" })
  isactive: boolean;
}
