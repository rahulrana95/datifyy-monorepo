import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";
import { DatifyyTicketPurchases } from "./DatifyyTicketPurchases";
import { Rooms } from "./Rooms";
import { UserEventsPasscodes } from "./UserEventsPasscodes";
import { VideoChatSessions } from "./VideoChatSessions";

@Index("datifyy_events_pkey", ["id"], { unique: true })
@Entity("datifyy_events", { schema: "public" })
export class DatifyyEvents {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", { name: "eventdate" })
  eventdate: Date;

  @Column("integer", { name: "totalmenstickets" })
  totalmenstickets: number;

  @Column("integer", { name: "totalfemaletickets" })
  totalfemaletickets: number;

  @Column("numeric", { name: "menticketprice", precision: 10, scale: 2 })
  menticketprice: string;

  @Column("numeric", { name: "womenticketprice", precision: 10, scale: 2 })
  womenticketprice: string;

  @Column("character", { name: "currencycode", length: 3 })
  currencycode: string;

  @Column("character varying", { name: "mode", length: 10 })
  mode: string;

  @Column("character varying", { name: "type", length: 20 })
  type: string;

  @Column("character varying", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("varchar", { name: "photos", nullable: true, array: true })
  photos: string[] | null;

  @Column("boolean", {
    name: "isdeleted",
    nullable: true,
    default: () => "false",
  })
  isdeleted: boolean | null;

  @Column("timestamp without time zone", {
    name: "createdat",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdat: Date | null;

  @Column("timestamp without time zone", {
    name: "updatedat",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedat: Date | null;

  @Column("character varying", { name: "status", length: 20 })
  status: string;

  @Column("character varying", {
    name: "location",
    nullable: true,
    length: 255,
  })
  location: string | null;

  @Column("interval", { name: "duration" })
  duration: any;

  @Column("character varying", {
    name: "coverimageurl",
    nullable: true,
    length: 255,
  })
  coverimageurl: string | null;

  @Column("integer", { name: "maxcapacity" })
  maxcapacity: number;

  @Column("timestamp without time zone", {
    name: "registrationdeadline",
    nullable: true,
  })
  registrationdeadline: Date | null;

  @Column("text", { name: "refundpolicy", nullable: true })
  refundpolicy: string | null;

  @Column("varchar", { name: "tags", nullable: true, array: true })
  tags: string[] | null;

  @Column("varchar", { name: "socialmedialinks", nullable: true, array: true })
  socialmedialinks: string[] | null;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyEvents,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "createdby", referencedColumnName: "id" }])
  createdby: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyEvents2,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "updatedby", referencedColumnName: "id" }])
  updatedby: DatifyyUsersLogin;

  @OneToMany(
    () => DatifyyTicketPurchases,
    (datifyyTicketPurchases) => datifyyTicketPurchases.event
  )
  datifyyTicketPurchases: DatifyyTicketPurchases[];

  @OneToMany(() => Rooms, (rooms) => rooms.event)
  rooms: Rooms[];

  @OneToMany(
    () => UserEventsPasscodes,
    (userEventsPasscodes) => userEventsPasscodes.event
  )
  userEventsPasscodes: UserEventsPasscodes[];

  @OneToMany(
    () => VideoChatSessions,
    (videoChatSessions) => videoChatSessions.event
  )
  videoChatSessions: VideoChatSessions[];
}
