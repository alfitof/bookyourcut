"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getReminderLogs, type ReminderLog } from "@/lib/firestore";
import Badge from "@/components/Badge";
import Toggle from "@/components/Toggle";

export default function RemindersPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [waEnabled, setWaEnabled] = useState(true);
  const [teleEnabled, setTeleEnabled] = useState(true);
  const [h1Day, setH1Day] = useState(true);
  const [h1Hour, setH1Hour] = useState(true);
  const [sendTime, setSendTime] = useState("08:00");
  const [templateSaved, setTemplateSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoadingLogs(true);
    getReminderLogs(user.uid)
      .then((data) => {
        setLogs(data);
      })
      .catch((err) => {
        console.error("Failed to load reminder logs:", err);
      })
      .finally(() => {
        setLoadingLogs(false);
      });
  }, [user]);

  function handleSaveTemplate() {
    setTemplateSaved(true);
    setTimeout(() => setTemplateSaved(false), 2000);
  }

  const stats = {
    total: logs.length,
    scheduled: logs.filter((l) => l.status === "scheduled").length,
    sent: logs.filter((l) => l.status === "sent").length,
    failed: logs.filter((l) => l.status === "failed").length,
  };

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
          Kelola kapan dan bagaimana reminder dikirim ke customer.
        </p>
      </div>

      {/* Stats */}
      <div
        className="anim-fade-up delay-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        {[
          { label: "Total Reminder", value: stats.total, color: "var(--text)" },
          { label: "Terjadwal", value: stats.scheduled, color: "var(--blue)" },
          { label: "Terkirim", value: stats.sent, color: "#22c55e" },
          { label: "Gagal", value: stats.failed, color: "var(--red)" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: "16px 20px",
              borderRadius: "var(--r)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: "6px",
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "26px",
                color: s.color,
              }}
            >
              {loadingLogs ? "—" : s.value}
            </p>
          </div>
        ))}
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
          {/* Channel */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Channel Notifikasi</h3>
            {[
              {
                label: "Telegram",
                sub: "Simulasi aktif · via Bot",
                icon: "✈️",
                color: "#60a5fa",
                value: teleEnabled,
                onChange: () => setTeleEnabled(!teleEnabled),
              },
              {
                label: "WhatsApp",
                sub: "via Fonnte / Wablas · coming soon",
                icon: "📱",
                color: "#22c55e",
                value: waEnabled,
                onChange: () => setWaEnabled(!waEnabled),
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

            {/* Telegram bot info */}
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "var(--r-sm)",
                background: "rgba(96,165,250,0.06)",
                border: "1px solid rgba(96,165,250,0.15)",
              }}
            >
              <p
                style={{
                  color: "var(--blue)",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                ✈️ Telegram Bot Aktif
              </p>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  lineHeight: 1.5,
                }}
              >
                Reminder dikirim ke Telegram sebagai simulasi. Set{" "}
                <code
                  style={{
                    background: "var(--surface-3)",
                    padding: "1px 5px",
                    borderRadius: "3px",
                    fontSize: "11px",
                  }}
                >
                  TELEGRAM_CHAT_ID
                </code>{" "}
                di .env untuk menerima notifikasi.
              </p>
            </div>
          </div>

          {/* Waktu */}
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
              <label style={fieldLabelStyle}>Jam Kirim H-1 Hari</label>
              <input
                type="time"
                value={sendTime}
                onChange={(e) => setSendTime(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Template */}
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
              Variabel:{" "}
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
                "✂️ Reminder Booking\n\nHalo {{nama}}!\nJadwal {{layanan}} besok jam {{jam}} di barber kamu.\n\nSampai jumpa! 🙌"
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
          {/* n8n info */}
          <div
            style={{
              padding: "20px",
              borderRadius: "var(--r)",
              background: "var(--accent-muted)",
              border: "1px solid var(--accent-border)",
            }}
          >
            <p
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "15px",
                color: "var(--accent)",
                marginBottom: "10px",
              }}
            >
              ⚙️ n8n Automation Flow
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {[
                {
                  step: "1",
                  label: "Booking dibuat",
                  desc: "API route trigger n8n webhook",
                },
                {
                  step: "2",
                  label: "n8n menerima data",
                  desc: "Booking ID, nama, tanggal, jam",
                },
                {
                  step: "3",
                  label: "Wait H-1 Hari",
                  desc: "Node Wait sampai jam 08:00 sehari sebelum",
                },
                {
                  step: "4",
                  label: "Kirim Telegram",
                  desc: "Bot kirim pesan reminder pertama",
                },
                {
                  step: "5",
                  label: "Wait H-1 Jam",
                  desc: "Node Wait 1 jam sebelum jadwal",
                },
                {
                  step: "6",
                  label: "Kirim Telegram lagi",
                  desc: "Bot kirim reminder terakhir",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      color: "#08090c",
                      fontSize: "11px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600 }}>
                      {s.label}
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Log */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Log Reminder</h3>
            {loadingLogs ? (
              <div style={{ padding: "30px", textAlign: "center" }}>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "3px solid var(--border)",
                    borderTop: "3px solid var(--accent)",
                    margin: "0 auto",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
            ) : logs.length === 0 ? (
              <div
                style={{
                  padding: "30px 20px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "13px",
                }}
              >
                <p style={{ fontSize: "24px", marginBottom: "8px" }}>📭</p>
                <p>Belum ada reminder yang dikirim.</p>
                <p style={{ fontSize: "12px", marginTop: "4px" }}>
                  Reminder akan muncul setelah ada booking.
                </p>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {logs.map((r) => (
                  <div
                    key={r.id}
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
                        {r.via === "telegram"
                          ? "✈️"
                          : r.via === "whatsapp"
                            ? "📱"
                            : "📧"}
                      </span>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 500 }}>
                          {r.customerName}
                        </p>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "11px",
                          }}
                        >
                          {r.type === "h1_day" ? "H-1 Hari" : "H-1 Jam"} ·{" "}
                          {r.via} ·{" "}
                          {new Date(r.scheduledAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (max-width: 900px) { .reminders-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .reminders-page { padding: 20px 16px !important; } }
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
