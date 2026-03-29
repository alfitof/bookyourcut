"use client";
import { useState } from "react";
import Badge from "./Badge";

interface BookingCardProps {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  duration?: string;
  price?: string;
  clientUid?: string;
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

const nextStatuses: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export default function BookingCard({
  id,
  customerName,
  service,
  date,
  time,
  phone,
  status,
  duration,
  price,
  clientUid,
  onStatusChange,
}: BookingCardProps) {
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const s = statusMap[status];
  const initials = customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const available = nextStatuses[status] ?? [];

  async function handleStatusChange(newStatus: string) {
    setOpen(false);
    setProcessing(true);

    try {
      // ── Panggil API update-booking-status ──
      // API ini yang handle trigger/cancel n8n
      const res = await fetch("/api/update-booking-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: id,
          clientUid,
          newStatus,
        }),
      });

      const data = await res.json();
      console.log("Status update response:", data);

      if (!res.ok) {
        console.error("Status update failed:", data.error);
        return;
      }

      // ── Update UI ──
      onStatusChange?.(newStatus as any);
    } catch (err) {
      console.error("handleStatusChange error:", err);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div
      style={{
        padding: "18px 20px",
        borderRadius: "var(--r)",
        background: "var(--surface)",
        border: `1px solid ${status === "cancelled" ? "rgba(244,63,94,0.2)" : "var(--border)"}`,
        display: "flex",
        alignItems: "center",
        gap: "16px",
        position: "relative",
        opacity: processing ? 0.6 : 1,
        transition: "all 0.15s",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "10px",
          background:
            status === "cancelled" ? "var(--surface-3)" : "var(--surface-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Cabinet Grotesk, sans-serif",
          fontWeight: 800,
          fontSize: "15px",
          color: status === "cancelled" ? "var(--text-muted)" : "var(--accent)",
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
              textDecoration: status === "cancelled" ? "line-through" : "none",
              color:
                status === "cancelled" ? "var(--text-muted)" : "var(--text)",
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
            color:
              status === "completed"
                ? "#22c55e"
                : status === "cancelled"
                  ? "var(--text-muted)"
                  : "var(--accent)",
            flexShrink: 0,
          }}
        >
          {price}
        </div>
      )}

      {/* Status change button */}
      {available.length > 0 && onStatusChange && !processing && (
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              padding: "6px 10px",
              borderRadius: "var(--r-sm)",
              background: "var(--surface-3)",
              border: "1px solid var(--border)",
              color: "var(--text-dim)",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "inherit",
              lineHeight: 1,
            }}
          >
            ⋯
          </button>
          {open && (
            <>
              {/* Backdrop */}
              <div
                style={{ position: "fixed", inset: 0, zIndex: 49 }}
                onClick={() => setOpen(false)}
              />
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
                  minWidth: "170px",
                  overflow: "hidden",
                }}
              >
                {available.map((ns) => (
                  <button
                    key={ns}
                    onClick={() => handleStatusChange(ns)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px 14px",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid var(--border)",
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
            </>
          )}
        </div>
      )}

      {processing && (
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: "2px solid var(--border)",
            borderTop: "2px solid var(--accent)",
            animation: "spin 0.8s linear infinite",
            flexShrink: 0,
          }}
        />
      )}

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
