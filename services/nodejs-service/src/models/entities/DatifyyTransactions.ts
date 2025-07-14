import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatifyyUsersLogin } from "./DatifyyUsersLogin";

@Index("datifyy_transactions_pkey", ["transactionId"], { unique: true })
@Entity("datifyy_transactions", { schema: "public" })
export class DatifyyTransactions {
  @PrimaryGeneratedColumn({ type: "integer", name: "transaction_id" })
  transactionId: number;

  @Column("character varying", { name: "transaction_type", length: 50 })
  transactionType: string;

  @Column("character varying", {
    name: "transaction_status",
    nullable: true,
    length: 20,
    default: () => "'Pending'",
  })
  transactionStatus: string | null;

  @Column("timestamp without time zone", {
    name: "transaction_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  transactionDate: Date | null;

  @Column("numeric", { name: "amount", precision: 10, scale: 2 })
  amount: string;

  @Column("character varying", { name: "currency", length: 3 })
  currency: string;

  @Column("character varying", {
    name: "payment_method",
    nullable: true,
    length: 50,
  })
  paymentMethod: string | null;

  @Column("character varying", { name: "payment_gateway", length: 50 })
  paymentGateway: string;

  @Column("character varying", {
    name: "gateway_transaction_id",
    nullable: true,
    length: 255,
  })
  gatewayTransactionId: string | null;

  @Column("character varying", {
    name: "gateway_status",
    nullable: true,
    length: 20,
    default: () => "'Pending'",
  })
  gatewayStatus: string | null;

  @Column("character varying", {
    name: "payment_reference",
    nullable: true,
    length: 255,
  })
  paymentReference: string | null;

  @Column("jsonb", { name: "payment_details", nullable: true })
  paymentDetails: object | null;

  @Column("jsonb", { name: "billing_address", nullable: true })
  billingAddress: object | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("numeric", {
    name: "transaction_fee",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  transactionFee: string | null;

  @Column("numeric", {
    name: "gateway_fee",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  gatewayFee: string | null;

  @Column("numeric", {
    name: "net_amount",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  netAmount: string | null;

  @Column("character varying", {
    name: "gateway_refund_id",
    nullable: true,
    length: 255,
  })
  gatewayRefundId: string | null;

  @Column("character varying", {
    name: "refund_status",
    nullable: true,
    length: 20,
    default: () => "'Pending'",
  })
  refundStatus: string | null;

  @Column("character varying", {
    name: "payment_status",
    nullable: true,
    length: 20,
    default: () => "'Pending'",
  })
  paymentStatus: string | null;

  @Column("numeric", {
    name: "refund_amount",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  refundAmount: string | null;

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

  @Column("boolean", {
    name: "audited",
    nullable: true,
    default: () => "false",
  })
  audited: boolean | null;

  @Column("text", { name: "audit_reason", nullable: true })
  auditReason: string | null;

  @Column("jsonb", { name: "audit_details", nullable: true })
  auditDetails: object | null;

  @Column("character varying", {
    name: "revenue_category",
    nullable: true,
    length: 50,
  })
  revenueCategory: string | null;

  @Column("timestamp without time zone", {
    name: "admin_reviewed_at",
    nullable: true,
  })
  adminReviewedAt: Date | null;

  @Column("character varying", {
    name: "dispute_status",
    nullable: true,
    length: 20,
    default: () => "'none'",
  })
  disputeStatus: string | null;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyTransactions,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "admin_reviewed_by", referencedColumnName: "id" }])
  adminReviewedBy: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyTransactions2,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "authorized_by", referencedColumnName: "id" }])
  authorizedBy: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyTransactions3,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "initiated_by", referencedColumnName: "id" }])
  initiatedBy: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyTransactions4,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: DatifyyUsersLogin;

  @ManyToOne(
    () => DatifyyUsersLogin,
    (datifyyUsersLogin) => datifyyUsersLogin.datifyyTransactions5,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user_2: DatifyyUsersLogin;
}
