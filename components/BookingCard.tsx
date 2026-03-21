import Badge from "./Badge";

interface BookingCardProps {
  customerName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  duration?: string;
  price?: string;
}

const statusMap = {
  confirmed: { label: "Confirmed", variant: "success" as const },
  pending: { label: "Pending", variant: "warning" as const },
  cancelled: { label: "Cancelled", variant: "danger" as const },
  completed: { label: "Selesai", variant: "default" as const },
};

export default function BookingCard({
  customerName,
  service,
  date,
  time,
  phone,
  status,
  duration,
  price,
}: BookingCardProps) {
  const s = statusMap[status];
  const initials = customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        padding: "18px 20px",
        borderRadius: "var(--r)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "border-color 0.15s",
      }}
    >
      {/* avatar */}
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "10px",
          background: "var(--surface-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Cabinet Grotesk, sans-serif",
          fontWeight: 800,
          fontSize: "15px",
          color: "var(--accent)",
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      {/* info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <p
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            {customerName}
          </p>
          <Badge variant={s.variant}>{s.label}</Badge>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          {service} · {phone}
        </p>
      </div>

      {/* time */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p
          style={{
            fontFamily: "Cabinet Grotesk, sans-serif",
            fontWeight: 700,
            fontSize: "14px",
          }}
        >
          {time}
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>{date}</p>
        {duration && (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "11px",
              marginTop: "2px",
            }}
          >
            {duration}
          </p>
        )}
      </div>

      {price && (
        <div
          style={{
            padding: "6px 12px",
            borderRadius: "var(--r-sm)",
            background: "var(--surface-3)",
            fontFamily: "Cabinet Grotesk, sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            color: "var(--accent)",
            flexShrink: 0,
          }}
        >
          {price}
        </div>
      )}
    </div>
  );
}
