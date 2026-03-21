import Link from "next/link";

export default function SuccessPage({ params }: { params: { slug: string } }) {
  const businessName = params.slug
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
        style={{
          width: "100%",
          maxWidth: "460px",
          textAlign: "center",
        }}
      >
        {/* Check icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(34,197,94,0.1)",
            border: "2px solid rgba(34,197,94,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            margin: "0 auto 24px",
          }}
        >
          ✓
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
          terkonfirmasi. Kami akan kirim reminder via WhatsApp sehari sebelum
          jadwal. 🔔
        </p>

        {/* Booking summary */}
        <div
          style={{
            padding: "20px",
            borderRadius: "var(--r)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            marginBottom: "24px",
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
            Detail Booking
          </p>
          {[
            { label: "Layanan", value: "Haircut" },
            { label: "Tanggal", value: "Rabu, 22 Juni 2025" },
            { label: "Jam", value: "10:00 WIB" },
            { label: "Durasi", value: "30 menit" },
            { label: "Harga", value: "Rp 50.000" },
            { label: "Status", value: "✅ Confirmed" },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid var(--border)",
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
            📱{" "}
            <strong style={{ color: "var(--accent)" }}>
              Reminder otomatis
            </strong>{" "}
            akan dikirim H-1 hari dan H-1 jam sebelum jadwal via WhatsApp.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href={`/book/${params.slug}`}
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
            }}
          >
            Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}
