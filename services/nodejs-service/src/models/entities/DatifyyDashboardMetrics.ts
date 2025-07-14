import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_dashboard_metrics_date", ["calculatedForDate", "expiresAt"], {})
@Index(
  "datifyy_dashboard_metrics_metric_type_metric_key_calculated_key",
  ["calculatedForDate", "metricKey", "metricType"],
  { unique: true }
)
@Index("idx_dashboard_metrics_expires", ["expiresAt"], {})
@Index("datifyy_dashboard_metrics_pkey", ["id"], { unique: true })
@Index("idx_dashboard_metrics_type", ["metricKey", "metricType"], {})
@Entity("datifyy_dashboard_metrics", { schema: "public" })
export class DatifyyDashboardMetrics {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "metric_type",
    unique: true,
    length: 50,
  })
  metricType: string;

  @Column("character varying", {
    name: "metric_key",
    unique: true,
    length: 100,
  })
  metricKey: string;

  @Column("numeric", {
    name: "metric_value",
    nullable: true,
    precision: 15,
    scale: 2,
  })
  metricValue: string | null;

  @Column("jsonb", { name: "metric_data", nullable: true })
  metricData: object | null;

  @Column("date", { name: "calculated_for_date", unique: true })
  calculatedForDate: string;

  @Column("timestamp without time zone", {
    name: "calculated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  calculatedAt: Date | null;

  @Column("timestamp without time zone", {
    name: "expires_at",
    nullable: true,
    default: () => "(CURRENT_TIMESTAMP + '01:00:00')",
  })
  expiresAt: Date | null;
}
