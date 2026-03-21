interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: string;
  accent?: boolean;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export default function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <div
      style={{
        padding: "24px",
        borderRadius: "var(--r)",
        background: accent ? "var(--accent-muted)" : "var(--surface)",
        border: `1px solid ${accent ? "var(--accent-border)" : "var(--border)"}`,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "12px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
          }}
        >
          {label}
        </p>
        {icon && (
          <span
            style={{
              fontSize: "18px",
              opacity: 0.7,
              background: "var(--surface-3)",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </span>
        )}
      </div>

      <p
        style={{
          fontFamily: "Cabinet Grotesk, sans-serif",
          fontSize: "32px",
          fontWeight: 900,
          color: accent ? "var(--accent)" : "var(--text)",
          letterSpacing: "-1px",
          lineHeight: 1.1,
          marginTop: "8px",
        }}
      >
        {value}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "4px",
        }}
      >
        {trend && trendValue && (
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color:
                trend === "up"
                  ? "#22c55e"
                  : trend === "down"
                    ? "#f43f5e"
                    : "var(--text-muted)",
            }}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"} {trendValue}
          </span>
        )}
        {sub && (
          <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>{sub}</p>
        )}
      </div>
    </div>
  );
}
