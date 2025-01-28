import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyEvents } from "./DatifyyEvents";
import { DatifyyTicketPurchases } from "./DatifyyTicketPurchases";
import { DatifyyUsersInformation } from "./DatifyyUsersInformation";

@Index("datifyy_users_login_email_key", ["email"], { unique: true })
@Index("datifyy_users_login_pkey", ["id"], { unique: true })
@Entity("datifyy_users_login", { schema: "public" })
export class DatifyyUsersLogin {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("character varying", { name: "password", length: 255 })
  password: string;

  @Column("timestamp without time zone", { name: "lastlogin", nullable: true })
  lastlogin: Date | null;

  @Column("boolean", {
    name: "isactive",
    nullable: true,
    default: () => "true",
  })
  isactive: boolean | null;

  @Column("boolean", {
    name: "isadmin",
    nullable: true,
    default: () => "false",
  })
  isadmin: boolean | null;

  @Column("character varying", {
    name: "gender",
    nullable: true,
    length: 10,
    default: () => "'male'",
  })
  gender: string | null;

  @OneToMany(() => DatifyyEvents, (datifyyEvents) => datifyyEvents.createdby)
  datifyyEvents: DatifyyEvents[];

  @OneToMany(() => DatifyyEvents, (datifyyEvents) => datifyyEvents.updatedby)
  datifyyEvents2: DatifyyEvents[];

  @OneToMany(
    () => DatifyyTicketPurchases,
    (datifyyTicketPurchases) => datifyyTicketPurchases.user
  )
  datifyyTicketPurchases: DatifyyTicketPurchases[];

  @OneToMany(
    () => DatifyyUsersInformation,
    (datifyyUsersInformation) => datifyyUsersInformation.userLogin
  )
  datifyyUsersInformations: DatifyyUsersInformation[];
}
