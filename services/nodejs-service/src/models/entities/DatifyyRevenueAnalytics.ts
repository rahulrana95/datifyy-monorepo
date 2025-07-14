import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_revenue_analytics_date", ["analyticsDate"], {})
@Index(
  "datifyy_revenue_analytics_analytics_date_time_period_key",
  ["analyticsDate", "timePeriod"],
  { unique: true }
)
@Index("idx_revenue_analytics_period", ["analyticsDate", "timePeriod"], {})
@Index("datifyy_revenue_analytics_pkey", ["id"], { unique: true })
@Entity("datifyy_revenue_analytics", { schema: "public" })
export class DatifyyRevenueAnalytics {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "analytics_date", unique: true })
  analyticsDate: string;

  @Column("character varying", {
    name: "time_period",
    unique: true,
    length: 20,
  })
  timePeriod: string;

  @Column("numeric", {
    name: "total_revenue",
    nullable: true,
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  totalRevenue: string | null;

  @Column("integer", {
    name: "total_transactions",
    nullable: true,
    default: () => "0",
  })
  totalTransactions: number | null;

  @Column("jsonb", { name: "revenue_by_type", nullable: true })
  revenueByType: object | null;

  @Column("jsonb", { name: "revenue_by_city", nullable: true })
  revenueByCity: object | null;

  @Column("integer", {
    name: "active_paying_users",
    nullable: true,
    default: () => "0",
  })
  activePayingUsers: number | null;

  @Column("integer", {
    name: "new_paying_users",
    nullable: true,
    default: () => "0",
  })
  newPayingUsers: number | null;

  @Column("numeric", {
    name: "refunds_amount",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "0",
  })
  refundsAmount: string | null;

  @Column("integer", {
    name: "refunds_count",
    nullable: true,
    default: () => "0",
  })
  refundsCount: number | null;

  @Column("numeric", {
    name: "average_transaction_value",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "0",
  })
  averageTransactionValue: string | null;

  @Column("numeric", {
    name: "conversion_rate",
    nullable: true,
    precision: 5,
    scale: 2,
    default: () => "0",
  })
  conversionRate: string | null;

  @Column("jsonb", { name: "metadata", nullable: true })
  metadata: object | null;

  @Column("timestamp without time zone", {
    name: "calculated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  calculatedAt: Date | null;
}
