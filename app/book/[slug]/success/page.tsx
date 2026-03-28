import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref } = await searchParams;

  // ── Validasi: harus ada ref (booking ID) ──
  // Kalau tidak ada ref, redirect ke halaman booking
  if (!ref) {
    redirect(`/book/${slug}`);
  }

  const businessName = (slug ?? "")
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        className="anim-scale-in"
        style={{ width: "100%", maxWidth: "460px", textAlign: "center" }}
      >
        {/* Check icon */}
        <div
          style={{
            width: "88px",
            height: "88px",
            borderRadius: "50%",
            background: "rgba(34,197,94,0.1)",
            border: "2px solid rgba(34,197,94,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
          }}
        >
          <CheckCircle size={48} color="#22c55e" strokeWidth={1.8} />
        </div>

        <h1
          style={{
            fontFamily: "Cabinet Grotesk, sans-serif",
            fontSize: "28px",
            fontWeight: 900,
            letterSpacing: "-0.5px",
            marginBottom: "10px",
          }}
        >
          Booking Berhasil!
        </h1>
        <p
          style={{
            color: "var(--text-dim)",
            fontSize: "15px",
            lineHeight: 1.6,
            marginBottom: "32px",
          }}
        >
          Booking kamu di{" "}
          <strong style={{ color: "var(--text)" }}>{businessName}</strong> sudah
          diterima. Kami akan kirim reminder via Telegram/WhatsApp sehari
          sebelum jadwal. 🔔
        </p>

        {/* Info */}
        <div
          style={{
            padding: "20px",
            borderRadius: "var(--r)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            marginBottom: "20px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "14px",
            }}
          >
            Info Booking
          </p>
          {[
            { label: "Ref ID", value: `#${ref.slice(-8).toUpperCase()}` },
            { label: "Status", value: "⏳ Menunggu Konfirmasi" },
            { label: "Reminder", value: "📱 Via Telegram / WhatsApp" },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "9px 0",
                borderBottom:
                  i < arr.length - 1 ? "1px solid var(--border)" : "none",
                fontSize: "14px",
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
              <span style={{ fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Reminder info */}
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "var(--r-sm)",
            background: "var(--accent-muted)",
            border: "1px solid var(--accent-border)",
            marginBottom: "28px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-dim)",
              lineHeight: 1.5,
            }}
          >
            🔔{" "}
            <strong style={{ color: "var(--accent)" }}>
              Reminder otomatis
            </strong>{" "}
            akan dikirim H-1 hari dan H-1 jam sebelum jadwal.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href={`/book/${slug}`}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text-dim)",
              fontSize: "14px",
              fontWeight: 500,
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Booking Lagi
          </Link>
          <Link
            href="/"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "var(--r-sm)",
              background: "var(--accent)",
              color: "#08090c",
              fontSize: "14px",
              fontWeight: 700,
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}
