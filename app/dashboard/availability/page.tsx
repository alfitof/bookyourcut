"use client";
import { useState } from "react";

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
  const [avail, setAvail] = useState(initialAvail);
  const [saved, setSaved] = useState(false);

  function toggle(day: string) {
    setAvail({
      ...avail,
      [day]: { ...avail[day], enabled: !avail[day].enabled },
    });
  }

  function update(
    day: string,
    field: keyof DayConfig,
    value: string | boolean,
  ) {
    setAvail({ ...avail, [day]: { ...avail[day], [field]: value } });
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ padding: "36px 40px" }}>
      <div
        className="anim-fade-up"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontSize: "28px",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              marginBottom: "6px",
            }}
          >
            Jam Kerja
          </h1>
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
          }}
        >
          {saved ? "✓ Tersimpan!" : "Simpan Perubahan"}
        </button>
      </div>

      <div
        className="anim-fade-up delay-1"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {DAYS.map((day) => {
          const d = avail[day];
          return (
            <div
              key={day}
              style={{
                padding: "20px 24px",
                borderRadius: "var(--r)",
                background: "var(--surface)",
                border: `1px solid ${d.enabled ? "var(--border)" : "var(--border)"}`,
                display: "flex",
                alignItems: "center",
                gap: "20px",
                opacity: d.enabled ? 1 : 0.5,
                transition: "opacity 0.2s",
              }}
            >
              {/* Toggle */}
              <div
                onClick={() => toggle(day)}
                style={{
                  width: "40px",
                  height: "22px",
                  borderRadius: "11px",
                  background: d.enabled ? "var(--accent)" : "var(--surface-3)",
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

              {/* Day name */}
              <div style={{ width: "70px", flexShrink: 0 }}>
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

              {/* Time inputs */}
              {d.enabled ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <label
                      style={{ color: "var(--text-muted)", fontSize: "12px" }}
                    >
                      Buka
                    </label>
                    <input
                      type="time"
                      value={d.start}
                      onChange={(e) => update(day, "start", e.target.value)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "var(--r-sm)",
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <label
                      style={{ color: "var(--text-muted)", fontSize: "12px" }}
                    >
                      Tutup
                    </label>
                    <input
                      type="time"
                      value={d.end}
                      onChange={(e) => update(day, "end", e.target.value)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "var(--r-sm)",
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        color: "var(--text)",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 12px",
                      borderRadius: "var(--r-sm)",
                      background: "var(--surface-3)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{ color: "var(--text-muted)", fontSize: "12px" }}
                    >
                      Istirahat:
                    </span>
                    <input
                      type="time"
                      value={d.breakStart}
                      onChange={(e) =>
                        update(day, "breakStart", e.target.value)
                      }
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-dim)",
                        fontSize: "12px",
                        outline: "none",
                      }}
                    />
                    <span
                      style={{ color: "var(--text-muted)", fontSize: "12px" }}
                    >
                      –
                    </span>
                    <input
                      type="time"
                      value={d.breakEnd}
                      onChange={(e) => update(day, "breakEnd", e.target.value)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-dim)",
                        fontSize: "12px",
                        outline: "none",
                      }}
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

      {/* Buffer time setting */}
      <div
        className="anim-fade-up delay-2"
        style={{
          marginTop: "24px",
          padding: "24px",
          borderRadius: "var(--r)",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}
      >
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
          <select
            defaultValue="10 menit"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--r-sm)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: "14px",
              outline: "none",
            }}
          >
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
          <select
            defaultValue="2 jam"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "var(--r-sm)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: "14px",
              outline: "none",
            }}
          >
            <option>1 jam</option>
            <option>2 jam</option>
            <option>4 jam</option>
            <option>1 hari</option>
          </select>
        </div>
      </div>
    </div>
  );
}
