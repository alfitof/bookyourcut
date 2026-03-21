interface ServiceCardProps {
  name: string;
  duration: string;
  price: string;
  bookingCount?: number;
  color?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ServiceCard({
  name,
  duration,
  price,
  bookingCount,
  color = "#d4f72c",
  onEdit,
  onDelete,
}: ServiceCardProps) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "var(--r)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          background: color,
          borderRadius: "3px 0 0 3px",
        }}
      />

      <div style={{ paddingLeft: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "12px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                marginBottom: "4px",
              }}
            >
              {name}
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              {duration} ·{" "}
              {bookingCount !== undefined ? `${bookingCount} booking` : ""}
            </p>
          </div>
          <p
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "18px",
              color: color,
            }}
          >
            {price}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onEdit}
            style={{
              flex: 1,
              padding: "7px",
              borderRadius: "var(--r-sm)",
              background: "var(--surface-3)",
              border: "1px solid var(--border)",
              color: "var(--text-dim)",
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: "7px 14px",
              borderRadius: "var(--r-sm)",
              background: "rgba(244,63,94,0.08)",
              border: "1px solid rgba(244,63,94,0.2)",
              color: "#f43f5e",
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
