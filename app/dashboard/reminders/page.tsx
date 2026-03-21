"use client";
import { useState } from "react";
import Badge from "@/components/Badge";
import Toggle from "@/components/Toggle";

const reminderLog = [
  {
    name: "Budi Santoso",
    type: "H-1 Jam",
    via: "WhatsApp",
    time: "09:00",
    date: "21 Jun",
    status: "sent" as const,
  },
  {
    name: "Reza Firmansyah",
    type: "H-1 Hari",
    via: "WhatsApp",
    time: "08:00",
    date: "21 Jun",
    status: "sent" as const,
  },
  {
    name: "Dani Prasetyo",
    type: "H-1 Jam",
    via: "Email",
    time: "12:00",
    date: "21 Jun",
    status: "sent" as const,
  },
  {
    name: "Hendra Wijaya",
    type: "H-1 Hari",
    via: "WhatsApp",
    time: "08:00",
    date: "22 Jun",
    status: "scheduled" as const,
  },
  {
    name: "Fajar Nugroho",
    type: "H-1 Hari",
    via: "WhatsApp",
    time: "08:00",
    date: "22 Jun",
    status: "scheduled" as const,
  },
  {
    name: "Fajar Nugroho",
    type: "H-1 Jam",
    via: "Email",
    time: "13:00",
    date: "22 Jun",
    status: "scheduled" as const,
  },
  {
    name: "Surya Darma",
    type: "H-1 Hari",
    via: "WhatsApp",
    time: "08:00",
    date: "20 Jun",
    status: "failed" as const,
  },
];

export default function RemindersPage() {
  const [waEnabled, setWaEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [h1Day, setH1Day] = useState(true);
  const [h1Hour, setH1Hour] = useState(true);
  const [sendTime, setSendTime] = useState("08:00");
  const [templateSaved, setTemplateSaved] = useState(false);

  function handleSaveTemplate() {
    setTemplateSaved(true);
    setTimeout(() => setTemplateSaved(false), 2000);
  }

  return (
    <div style={{ padding: "36px 40px" }} className="reminders-page">
      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "Cabinet Grotesk, sans-serif",
            fontSize: "28px",
            fontWeight: 900,
            letterSpacing: "-0.5px",
            marginBottom: "6px",
          }}
        >
          Reminder Settings
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>
          Atur kapan dan bagaimana reminder dikirim ke customer.
        </p>
      </div>

      <div
        className="reminders-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* ── KOLOM KIRI ── */}
        <div
          className="anim-fade-up delay-1"
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          {/* Channel Notifikasi */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Channel Notifikasi</h3>

            {[
              {
                label: "WhatsApp",
                sub: "via Fonnte / Wablas",
                icon: "📱",
                color: "#22c55e",
                value: waEnabled,
                onChange: () => setWaEnabled(!waEnabled),
              },
              {
                label: "Email",
                sub: "via Resend / Nodemailer",
                icon: "📧",
                color: "#60a5fa",
                value: emailEnabled,
                onChange: () => setEmailEnabled(!emailEnabled),
              },
            ].map((ch) => (
              <div
                key={ch.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: `${ch.color}18`,
                      border: `1px solid ${ch.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}
                  >
                    {ch.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "14px" }}>
                      {ch.label}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                      {ch.sub}
                    </p>
                  </div>
                </div>
                <Toggle active={ch.value} onChange={ch.onChange} />
              </div>
            ))}
          </div>

          {/* Waktu Pengiriman */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Waktu Pengiriman</h3>

            {[
              {
                label: "H-1 Hari",
                sub: "Sehari sebelum jadwal",
                value: h1Day,
                onChange: () => setH1Day(!h1Day),
              },
              {
                label: "H-1 Jam",
                sub: "Satu jam sebelum jadwal",
                value: h1Hour,
                onChange: () => setH1Hour(!h1Hour),
              },
            ].map((t, i) => (
              <div
                key={t.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: i === 0 ? "1px solid var(--border)" : "none",
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: "14px" }}>{t.label}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                    {t.sub}
                  </p>
                </div>
                <Toggle active={t.value} onChange={t.onChange} />
              </div>
            ))}

            <div style={{ marginTop: "16px" }}>
              <label style={fieldLabelStyle}>Jam Kirim (untuk H-1 Hari)</label>
              <input
                type="time"
                value={sendTime}
                onChange={(e) => setSendTime(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Template Pesan */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Template Pesan</h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "12px",
                marginBottom: "14px",
                lineHeight: 1.5,
              }}
            >
              Gunakan variabel:{" "}
              {["{{nama}}", "{{jam}}", "{{layanan}}", "{{tanggal}}"].map(
                (v) => (
                  <code
                    key={v}
                    style={{
                      background: "var(--surface-3)",
                      padding: "1px 6px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      marginRight: "4px",
                      fontFamily: "monospace",
                      color: "var(--accent)",
                    }}
                  >
                    {v}
                  </code>
                ),
              )}
            </p>
            <textarea
              defaultValue={
                "Halo {{nama}}! 👋\nIngatkan kamu ada jadwal *{{layanan}}* besok jam *{{jam}}* di Alfito Barber.\n\nSampai ketemu ya! ✂️"
              }
              rows={5}
              style={{
                ...inputStyle,
                resize: "vertical",
                lineHeight: 1.6,
                fontFamily: "monospace",
                fontSize: "13px",
              }}
            />
            <button
              onClick={handleSaveTemplate}
              style={{
                marginTop: "12px",
                padding: "9px 20px",
                borderRadius: "var(--r-sm)",
                background: templateSaved ? "#22c55e" : "var(--accent)",
                color: "#08090c",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                transition: "background 0.2s",
              }}
            >
              {templateSaved ? "✓ Tersimpan!" : "Simpan Template"}
            </button>
          </div>
        </div>

        {/* ── KOLOM KANAN ── */}
        <div
          className="anim-fade-up delay-2"
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          {/* Log Reminder */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Log Reminder</h3>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {reminderLog.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: "var(--r-sm)",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>
                      {r.via === "WhatsApp" ? "📱" : "📧"}
                    </span>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 500 }}>
                        {r.name}
                      </p>
                      <p
                        style={{ color: "var(--text-muted)", fontSize: "11px" }}
                      >
                        {r.type} · {r.date} {r.time} · {r.via}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      r.status === "sent"
                        ? "success"
                        : r.status === "scheduled"
                          ? "info"
                          : "danger"
                    }
                  >
                    {r.status === "sent"
                      ? "Terkirim"
                      : r.status === "scheduled"
                        ? "Terjadwal"
                        : "Gagal"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* n8n info */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "var(--r)",
              background: "var(--accent-muted)",
              border: "1px solid var(--accent-border)",
            }}
          >
            <p
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                color: "var(--accent)",
                marginBottom: "8px",
              }}
            >
              ⚙️ Powered by n8n Automation
            </p>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              Reminder dikirim otomatis via n8n workflow. Trigger: booking baru
              → wait H-1 hari → kirim WA → wait H-1 jam → kirim lagi.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .reminders-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .reminders-page { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: "24px",
  borderRadius: "var(--r)",
  background: "var(--surface)",
  border: "1px solid var(--border)",
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily: "Cabinet Grotesk, sans-serif",
  fontWeight: 800,
  fontSize: "15px",
  marginBottom: "18px",
};

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "var(--r-sm)",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
};
