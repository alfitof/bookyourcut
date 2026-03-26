import Badge from "./Badge";

interface BookingCardProps {
  customerName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  duration?: string;
  price?: string;
  onStatusChange?: (
    status: "confirmed" | "pending" | "completed" | "cancelled",
  ) => void;
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
  onStatusChange,
}: BookingCardProps) {
  const s = statusMap[status];
  const initials = customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [open, setOpen] = require("react").useState(false);

  const nextStatuses = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  } as Record<string, string[]>;

  const available = nextStatuses[status];

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
        position: "relative",
      }}
    >
      {/* Avatar */}
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

      {/* Info */}
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

      {/* Time */}
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

      {/* Price */}
      {price && (
        <div
          style={{
            padding: "6px 12px",
            borderRadius: "var(--r-sm)",
            background: "var(--surface-3)",
            fontFamily: "Cabinet Grotesk, sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            color: status === "completed" ? "#22c55e" : "var(--accent)",
            flexShrink: 0,
          }}
        >
          {price}
        </div>
      )}

      {/* Status change button */}
      {available.length > 0 && onStatusChange && (
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              padding: "6px 10px",
              borderRadius: "var(--r-sm)",
              background: "var(--surface-3)",
              border: "1px solid var(--border)",
              color: "var(--text-dim)",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ⋯
          </button>
          {open && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 6px)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-sm)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                zIndex: 50,
                minWidth: "160px",
                overflow: "hidden",
              }}
            >
              {available.map((ns) => (
                <button
                  key={ns}
                  onClick={() => {
                    onStatusChange(ns as any);
                    setOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 14px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    color:
                      ns === "completed"
                        ? "#22c55e"
                        : ns === "cancelled"
                          ? "var(--red)"
                          : "var(--text)",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {ns === "completed"
                    ? "✓ Tandai Selesai"
                    : ns === "confirmed"
                      ? "✓ Konfirmasi"
                      : "✕ Batalkan"}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
