"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getAvailability,
  saveAvailability,
  type Availability,
  type DayAvailability,
} from "@/lib/firestore";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

type DayConfig = {
  enabled: boolean;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
};

const initialAvail: Record<string, DayConfig> = {
  Senin: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  Selasa: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  Rabu: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  Kamis: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  },
  Jumat: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    breakStart: "11:30",
    breakEnd: "13:30",
  },
  Sabtu: {
    enabled: true,
    start: "09:00",
    end: "15:00",
    breakStart: "",
    breakEnd: "",
  },
  Minggu: {
    enabled: false,
    start: "09:00",
    end: "17:00",
    breakStart: "",
    breakEnd: "",
  },
};

export default function AvailabilityPage() {
  const { user } = useAuth();
  const [avail, setAvail] = useState<Availability>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    getAvailability(user.uid).then((data) => {
      setAvail(data);
      setLoading(false);
    });
  }, [user]);

  function toggle(day: string) {
    setAvail({
      ...avail,
      [day]: { ...avail[day], enabled: !avail[day].enabled },
    });
  }

  function update(
    day: string,
    field: keyof DayAvailability,
    value: string | boolean,
  ) {
    setAvail({ ...avail, [day]: { ...avail[day], [field]: value } });
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await saveAvailability(user.uid, avail);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Error saving availability:", err);
    } finally {
      setSaving(false);
    }
  }
  if (loading) {
    return (
      <div style={{ padding: "36px 40px" }}>
        <div style={{ padding: "80px", textAlign: "center" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "3px solid var(--border)",
              borderTop: "3px solid var(--accent)",
              margin: "0 auto 12px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Memuat jadwal...
          </p>
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }
  return (
    <div className="avail-page">
      {/* Header */}
      <div className="anim-fade-up avail-header">
        <div>
          <h1 className="avail-title">Jam Kerja</h1>
          <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>
            Atur kapan customermu bisa melakukan booking.
          </p>
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
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {saved ? "✓ Tersimpan!" : "Simpan Perubahan"}
        </button>
      </div>

      {/* Day rows */}
      <div
        className="anim-fade-up delay-1"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {DAYS.map((day) => {
          const d = avail[day];
          return (
            <div
              key={day}
              className="avail-row"
              style={{ opacity: d.enabled ? 1 : 0.5 }}
            >
              {/* Toggle + Day name — always left, fixed width */}
              <div className="avail-left">
                <div
                  onClick={() => toggle(day)}
                  style={{
                    width: "40px",
                    height: "22px",
                    borderRadius: "11px",
                    background: d.enabled
                      ? "var(--accent)"
                      : "var(--surface-3)",
                    border: `1px solid ${d.enabled ? "var(--accent)" : "var(--border)"}`,
                    position: "relative",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: d.enabled ? "18px" : "2px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: d.enabled ? "#08090c" : "var(--text-muted)",
                      transition: "left 0.2s",
                    }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "Cabinet Grotesk, sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                    }}
                  >
                    {day}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                    {d.enabled ? "Buka" : "Tutup"}
                  </p>
                </div>
              </div>

              {/* Controls */}
              {d.enabled ? (
                <div className="avail-controls">
                  {/* Jam buka - tutup */}
                  <div className="avail-open-close">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <label style={timeLabelStyle}>Buka</label>
                      <input
                        type="time"
                        value={d.start}
                        onChange={(e) => update(day, "start", e.target.value)}
                        className="time-input"
                      />
                    </div>
                    <span style={{ color: "var(--text-muted)" }}>—</span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <label style={timeLabelStyle}>Tutup</label>
                      <input
                        type="time"
                        value={d.end}
                        onChange={(e) => update(day, "end", e.target.value)}
                        className="time-input"
                      />
                    </div>
                  </div>

                  {/* Istirahat — di kanan, style kotak */}
                  <div className="avail-break">
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      Istirahat:
                    </span>
                    <input
                      type="time"
                      value={d.breakStart}
                      onChange={(e) =>
                        update(day, "breakStart", e.target.value)
                      }
                      className="time-input time-input-sm"
                    />
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "12px",
                        flexShrink: 0,
                      }}
                    >
                      –
                    </span>
                    <input
                      type="time"
                      value={d.breakEnd}
                      onChange={(e) => update(day, "breakEnd", e.target.value)}
                      className="time-input time-input-sm"
                    />
                  </div>
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                  Tidak menerima booking
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Buffer & Min Notice */}
      <div className="anim-fade-up delay-2 avail-extra">
        <div>
          <p
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              marginBottom: "4px",
            }}
          >
            Buffer Waktu
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              marginBottom: "12px",
            }}
          >
            Jeda antar booking agar tidak terlalu mepet.
          </p>
          <select defaultValue="10 menit" style={selectStyle}>
            <option>Tidak ada</option>
            <option>5 menit</option>
            <option>10 menit</option>
            <option>15 menit</option>
            <option>30 menit</option>
          </select>
        </div>
        <div>
          <p
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              marginBottom: "4px",
            }}
          >
            Minimum Notice
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              marginBottom: "12px",
            }}
          >
            Berapa jam sebelumnya customer bisa booking.
          </p>
          <select defaultValue="2 jam" style={selectStyle}>
            <option>1 jam</option>
            <option>2 jam</option>
            <option>4 jam</option>
            <option>1 hari</option>
          </select>
        </div>
      </div>

      <style>{`
        .avail-page {
          padding: 36px 40px;
          box-sizing: border-box;
        }
        .avail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          gap: 12px;
        }
        .avail-title {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        /* ── ROW ── */
        .avail-row {
          padding: 18px 20px;
          border-radius: var(--r);
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: opacity 0.2s;
          box-sizing: border-box;
          width: 100%;
        }

        /* Toggle + nama */
        .avail-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          width: 110px;
        }

        /* All controls: jam buka-tutup + istirahat */
        .avail-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
          flex-wrap: wrap;
        }

        /* Jam buka - tutup */
        .avail-open-close {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        /* Istirahat — kotak abu di kanan */
        .avail-break {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: var(--r-sm);
          background: var(--surface-3);
          border: 1px solid var(--border);
          margin-left: auto;
          flex-shrink: 0;
        }

        /* Time inputs */
        .time-input {
          padding: 6px 8px;
          border-radius: var(--r-sm);
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 13px;
          outline: none;
          font-family: inherit;
          width: 108px;
          box-sizing: border-box;
        }
        .time-input-sm {
          width: 120px;
        }
        .time-input::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(2);
          cursor: pointer;
          opacity: 0.6;
        }
        .time-input::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }

        /* Extra settings */
        .avail-extra {
          margin-top: 24px;
          padding: 24px;
          border-radius: var(--r);
          background: var(--surface);
          border: 1px solid var(--border);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        /* ══════════════════════
           RESPONSIVE
        ══════════════════════ */

        /* 900px — istirahat turun ke baris baru tapi tetap di kanan */
        @media (max-width: 900px) {
          .avail-break {
            margin-left: 0;
          }
        }

        /* 768px — row jadi 2 baris: atas (toggle+nama), bawah (controls) */
        @media (max-width: 768px) {
          .avail-page { padding: 20px 16px; }
          .avail-title { font-size: 22px; }

          .avail-row {
            flex-wrap: wrap;
            padding: 14px 16px;
            gap: 12px;
          }
          .avail-left {
            width: 100%;
          }
          .avail-controls {
            width: 100%;
            flex-wrap: wrap;
            gap: 10px;
          }
          /* istirahat full width di mobile, tidak margin-left auto */
          .avail-break {
            margin-left: 0;
            width: 100%;
            box-sizing: border-box;
            flex-wrap: wrap;
          }
          .avail-extra {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        /* 480px */
        @media (max-width: 480px) {
          .avail-page { padding: 16px 12px; }
          .time-input {
            width: 92px;
            font-size: 12px;
          }
          .time-input-sm {
            width: 86px;
          }
          .avail-open-close {
            flex-wrap: wrap;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
}

const timeLabelStyle: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "12px",
  flexShrink: 0,
};

const selectStyle: React.CSSProperties = {
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
