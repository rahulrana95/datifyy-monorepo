import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyEvents } from "./DatifyyEvents";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";

@Index("datifyy_ticket_purchases_pkey", ["id"], { unique: true })
@Entity("datifyy_ticket_purchases", { schema: "public" })
export class DatifyyTicketPurchases {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", {
    name: "purchase_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  purchaseDate: Date | null;

  @Column("character varying", { name: "ticket_type", length: 10 })
  ticketType: string;

  @Column("integer", { name: "quantity" })
  quantity: number;

  @Column("numeric", { name: "total_price", precision: 10, scale: 2 })
  totalPrice: string;

  @Column("character", { name: "currency_code", length: 3 })
  currencyCode: string;

  @Column("character varying", { name: "payment_status", length: 20 })
  paymentStatus: string;

  @Column("character varying", {
    name: "transaction_id",
    nullable: true,
    length: 255,
  })
  transactionId: string | null;

  @Column("character varying", {
    name: "purchase_source",
    nullable: true,
    length: 50,
  })
  purchaseSource: string | null;

  @Column("text", { name: "user_feedback", nullable: true })
  userFeedback: string | null;

  @Column("integer", { name: "rating", nullable: true })
  rating: number | null;

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
    () => DatifyyEvents,
    (datifyyEvents) => datifyyEvents.datifyyTicketPurchases,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: DatifyyEvents;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyTicketPurchases,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: DatifyyUsersLogin;
}
