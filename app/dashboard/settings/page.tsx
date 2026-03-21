"use client";
import { useState } from "react";
import Toggle from "@/components/Toggle";

const integrations = [
  { name: "WhatsApp (Fonnte)", status: "connected", icon: "💬" },
  { name: "n8n Automation", status: "connected", icon: "⚡" },
  { name: "Email (Resend)", status: "disconnected", icon: "📧" },
  { name: "Midtrans Payment", status: "disconnected", icon: "💳" },
];

const notificationItems = [
  { label: "Booking baru masuk", key: "new_booking" },
  { label: "Reminder H-1 terkirim", key: "reminder_sent" },
  { label: "Booking dibatalkan", key: "booking_cancelled" },
  { label: "Laporan mingguan", key: "weekly_report" },
];

type DeleteStep = "idle" | "confirm" | "typing" | "deleting" | "done";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    new_booking: true,
    reminder_sent: true,
    booking_cancelled: true,
    weekly_report: false,
  });
  const [saved, setSaved] = useState(false);
  const [deleteStep, setDeleteStep] = useState<DeleteStep>("idle");
  const [deleteInput, setDeleteInput] = useState("");

  const DELETE_KEYWORD = "HAPUS SEMUA";

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDeleteStart() {
    setDeleteStep("confirm");
    setDeleteInput("");
  }

  function handleDeleteCancel() {
    setDeleteStep("idle");
    setDeleteInput("");
  }

  function handleDeleteConfirm() {
    if (deleteInput !== DELETE_KEYWORD) return;
    setDeleteStep("deleting");
    setTimeout(() => {
      setDeleteStep("done");
    }, 1800);
  }

  return (
    <div style={{ padding: "36px 40px" }} className="settings-page">
      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontFamily: "Cabinet Grotesk, sans-serif",
            fontSize: "28px",
            fontWeight: 900,
            letterSpacing: "-0.5px",
            marginBottom: "6px",
          }}
        >
          Settings
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>
          Kelola profil bisnis kamu.
        </p>
      </div>

      <div
        className="anim-fade-up delay-1 settings-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* ── KOLOM KIRI — Profil Bisnis ── */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Profil Bisnis</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div>
              <label style={labelStyle}>Nama Bisnis</label>
              <input defaultValue="Alfito Barber Studio" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Slug / URL</label>
              <div
                style={{
                  display: "flex",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-sm)",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    padding: "10px 12px",
                    background: "var(--surface-3)",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    borderRight: "1px solid var(--border)",
                    whiteSpace: "nowrap",
                  }}
                >
                  bookyourcut.app/book/
                </span>
                <input
                  defaultValue="alfito-barber"
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    background: "var(--surface-2)",
                    border: "none",
                    color: "var(--text)",
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Nomor WhatsApp</label>
              <input defaultValue="6281234567890" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                defaultValue="alfito@barber.com"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Alamat</label>
              <textarea
                rows={3}
                defaultValue="Jl. Sudirman No. 12, Jakarta Pusat"
                style={{
                  ...inputStyle,
                  resize: "none",
                  lineHeight: 1.5,
                  fontFamily: "inherit",
                }}
              />
            </div>
            <button
              onClick={handleSave}
              style={{
                padding: "10px 20px",
                borderRadius: "var(--r-sm)",
                background: saved ? "#22c55e" : "var(--accent)",
                color: "#08090c",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                transition: "background 0.2s",
                alignSelf: "flex-start",
              }}
            >
              {saved ? "✓ Tersimpan!" : "Simpan Profil"}
            </button>
          </div>
        </div>

        {/* ── KOLOM KANAN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Integrasi */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Integrasi</h3>
            {integrations.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom:
                    i < integrations.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      background: "var(--surface-3)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500 }}>
                      {item.name}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        marginTop: "2px",
                        color:
                          item.status === "connected"
                            ? "#22c55e"
                            : "var(--text-muted)",
                      }}
                    >
                      {item.status === "connected"
                        ? "● Terhubung"
                        : "Belum terhubung"}
                    </p>
                  </div>
                </div>
                <button
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--r-sm)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    ...(item.status === "connected"
                      ? {
                          background: "var(--surface-3)",
                          border: "1px solid var(--border)",
                          color: "var(--text-dim)",
                        }
                      : {
                          background: "var(--accent)",
                          border: "none",
                          color: "#08090c",
                        }),
                  }}
                >
                  {item.status === "connected" ? "Konfigurasi" : "Hubungkan"}
                </button>
              </div>
            ))}
          </div>

          {/* Notifikasi */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Notifikasi</h3>
            {notificationItems.map((n, i) => (
              <div
                key={n.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "11px 0",
                  borderBottom:
                    i < notificationItems.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                <span style={{ fontSize: "14px", color: "var(--text-dim)" }}>
                  {n.label}
                </span>
                <Toggle
                  active={notifications[n.key]}
                  onChange={(val) =>
                    setNotifications((prev) => ({ ...prev, [n.key]: val }))
                  }
                />
              </div>
            ))}
          </div>

          {/* Danger Zone */}
          <div
            style={{
              padding: "24px 28px",
              borderRadius: "var(--r)",
              background: "var(--surface)",
              border: "1px solid rgba(244,63,94,0.2)",
            }}
          >
            <h3
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "15px",
                color: "var(--red)",
                marginBottom: "6px",
              }}
            >
              Danger Zone
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              Tindakan ini tidak bisa dibatalkan. Lanjutkan dengan hati-hati.
            </p>

            {deleteStep === "done" ? (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "var(--r-sm)",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  color: "#22c55e",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                ✓ Semua data booking telah dihapus. (simulasi)
              </div>
            ) : (
              <button
                onClick={handleDeleteStart}
                style={{
                  padding: "8px 18px",
                  borderRadius: "var(--r-sm)",
                  background: "rgba(244,63,94,0.08)",
                  border: "1px solid rgba(244,63,94,0.25)",
                  color: "var(--red)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🗑 Hapus Semua Data Booking
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL DELETE CONFIRMATION ── */}
      {(deleteStep === "confirm" ||
        deleteStep === "typing" ||
        deleteStep === "deleting") && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && deleteStep !== "deleting")
              handleDeleteCancel();
          }}
        >
          <div
            className="anim-scale-in"
            style={{
              width: "100%",
              maxWidth: "440px",
              background: "var(--surface)",
              border: "1px solid rgba(244,63,94,0.25)",
              borderRadius: "var(--r-lg)",
              padding: "28px",
            }}
          >
            {deleteStep === "deleting" ? (
              /* Loading state */
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: "3px solid var(--border)",
                    borderTop: "3px solid var(--red)",
                    margin: "0 auto 20px",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <p
                  style={{
                    fontFamily: "Cabinet Grotesk, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    marginBottom: "6px",
                  }}
                >
                  Menghapus data...
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                  Mohon tunggu sebentar.
                </p>
              </div>
            ) : (
              <>
                {/* Icon */}
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: "rgba(244,63,94,0.1)",
                    border: "1px solid rgba(244,63,94,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    marginBottom: "18px",
                  }}
                >
                  ⚠️
                </div>

                <h2
                  style={{
                    fontFamily: "Cabinet Grotesk, sans-serif",
                    fontWeight: 900,
                    fontSize: "20px",
                    marginBottom: "10px",
                  }}
                >
                  Hapus Semua Data Booking?
                </h2>
                <p
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    marginBottom: "20px",
                  }}
                >
                  Tindakan ini akan{" "}
                  <strong style={{ color: "var(--red)" }}>
                    menghapus permanen
                  </strong>{" "}
                  seluruh data booking, riwayat, dan reminder. Data tidak dapat
                  dipulihkan.
                </p>

                {/* Confirmation input */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    Ketik{" "}
                    <code
                      style={{
                        background: "var(--surface-3)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        color: "var(--red)",
                        fontFamily: "monospace",
                      }}
                    >
                      {DELETE_KEYWORD}
                    </code>{" "}
                    untuk konfirmasi
                  </label>
                  <input
                    type="text"
                    placeholder={DELETE_KEYWORD}
                    value={deleteInput}
                    onChange={(e) => {
                      setDeleteInput(e.target.value);
                      setDeleteStep("typing");
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "var(--r-sm)",
                      background: "var(--surface-2)",
                      border: `1px solid ${deleteInput === DELETE_KEYWORD ? "rgba(244,63,94,0.5)" : "var(--border)"}`,
                      color: "var(--text)",
                      fontSize: "14px",
                      outline: "none",
                      fontFamily: "monospace",
                      transition: "border-color 0.2s",
                    }}
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleDeleteCancel}
                    style={{
                      flex: 1,
                      padding: "11px",
                      borderRadius: "var(--r-sm)",
                      background: "var(--surface-3)",
                      border: "1px solid var(--border)",
                      color: "var(--text-dim)",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleteInput !== DELETE_KEYWORD}
                    style={{
                      flex: 1,
                      padding: "11px",
                      borderRadius: "var(--r-sm)",
                      background:
                        deleteInput === DELETE_KEYWORD
                          ? "var(--red)"
                          : "var(--surface-3)",
                      border: "none",
                      color:
                        deleteInput === DELETE_KEYWORD
                          ? "#fff"
                          : "var(--text-muted)",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor:
                        deleteInput === DELETE_KEYWORD
                          ? "pointer"
                          : "not-allowed",
                      transition: "all 0.2s",
                    }}
                  >
                    Ya, Hapus Semua
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .settings-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .settings-page { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: "28px",
  borderRadius: "var(--r)",
  background: "var(--surface)",
  border: "1px solid var(--border)",
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily: "Cabinet Grotesk, sans-serif",
  fontWeight: 800,
  fontSize: "16px",
  marginBottom: "20px",
};

const labelStyle: React.CSSProperties = {
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
