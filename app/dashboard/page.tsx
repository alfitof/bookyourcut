"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import BookingCard from "@/components/BookingCard";
import Badge from "@/components/Badge";
import { useAuth } from "@/context/AuthContext";

const initialBookings = [
  {
    id: 1,
    customerName: "Budi Santoso",
    service: "Haircut",
    date: "Hari ini",
    time: "10:00",
    phone: "0812-3456-7890",
    status: "confirmed" as const,
    price: "Rp 50rb",
  },
  {
    id: 2,
    customerName: "Reza Firmansyah",
    service: "Haircut + Beard",
    date: "Hari ini",
    time: "11:30",
    phone: "0813-2233-4455",
    status: "confirmed" as const,
    price: "Rp 75rb",
  },
  {
    id: 3,
    customerName: "Dani Prasetyo",
    service: "Haircut",
    date: "Hari ini",
    time: "13:00",
    phone: "0857-9988-7766",
    status: "pending" as const,
    price: "Rp 50rb",
  },
  {
    id: 4,
    customerName: "Hendra Wijaya",
    service: "Coloring",
    date: "Besok",
    time: "09:00",
    phone: "0821-5544-3322",
    status: "confirmed" as const,
    price: "Rp 150rb",
  },
  {
    id: 5,
    customerName: "Fajar Nugroho",
    service: "Haircut",
    date: "Besok",
    time: "14:00",
    phone: "0878-1122-3344",
    status: "confirmed" as const,
    price: "Rp 50rb",
  },
];

const reminderQueue = [
  {
    name: "Reza Firmansyah",
    type: "H-1 Jam",
    time: "10:30",
    status: "Terkirim",
  },
  {
    name: "Hendra Wijaya",
    type: "H-1 Hari",
    time: "08:00",
    status: "Dijadwalkan",
  },
  {
    name: "Fajar Nugroho",
    type: "H-1 Hari",
    time: "08:00",
    status: "Dijadwalkan",
  },
];

const SERVICES = ["Haircut", "Haircut + Beard", "Coloring", "Keramas"];
const SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(initialBookings);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: SERVICES[0],
    date: "",
    time: SLOTS[0],
  });
  const [formError, setFormError] = useState("");
  const [today, setToday] = useState(""); // kosong dulu, isi di client

  // fix hydration: date formatting hanya di client
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  function handleAddBooking() {
    if (!form.name.trim() || !form.phone.trim() || !form.date) {
      setFormError("Nama, nomor HP, dan tanggal wajib diisi.");
      return;
    }
    setFormError("");
    const dateObj = new Date(form.date);
    const formatted = dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    setBookings([
      {
        id: Date.now(),
        customerName: form.name,
        service: form.service,
        date: formatted,
        time: form.time,
        phone: form.phone,
        status: "confirmed",
        price: "",
      },
      ...bookings,
    ]);
    setForm({
      name: "",
      phone: "",
      service: SERVICES[0],
      date: "",
      time: SLOTS[0],
    });
    setShowModal(false);
  }

  function handleCloseModal() {
    setShowModal(false);
    setFormError("");
    setForm({
      name: "",
      phone: "",
      service: SERVICES[0],
      date: "",
      time: SLOTS[0],
    });
  }

  return (
    <div className="dash-page">
      {/* ── HEADER ── */}
      <div className="anim-fade-up dash-header">
        <div>
          {/* today hanya render kalau sudah ada nilainya — hindari mismatch */}
          {today && (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "13px",
                marginBottom: "6px",
              }}
            >
              {today}
            </p>
          )}
          <h1 className="dash-title">
            Selamat datang, {user?.displayName ?? "Barber"} 👋
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "10px 20px",
            borderRadius: "var(--r-sm)",
            background: "var(--accent)",
            color: "#08090c",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          + Booking Manual
        </button>
      </div>

      {/* ── STATS ── */}
      <div className="anim-fade-up delay-1 dash-stats">
        <StatCard
          label="Booking Hari Ini"
          value="8"
          icon="◫"
          accent
          trend="up"
          trendValue="2 dari kemarin"
        />
        <StatCard
          label="Booking Bulan Ini"
          value="94"
          icon="◷"
          trend="up"
          trendValue="12% vs bulan lalu"
        />
        <StatCard
          label="Revenue Bulan Ini"
          value="Rp 4.7jt"
          icon="◈"
          trend="up"
          trendValue="8% vs bulan lalu"
        />
        <StatCard
          label="Reminder Terkirim"
          value="87"
          icon="◎"
          sub="bulan ini"
        />
      </div>

      {/* ── CONTENT GRID ── */}
      <div className="anim-fade-up delay-2 dash-grid">
        {/* Bookings list */}
        <div className="dash-bookings">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontSize: "18px",
                fontWeight: 800,
              }}
            >
              Booking Terbaru
            </h2>
            <Link
              href="/dashboard/bookings"
              style={{
                color: "var(--accent)",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Lihat semua →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {bookings.slice(0, 5).map((b) => (
              <BookingCard key={b.id} {...b} />
            ))}
          </div>
        </div>

        {/* Right panels */}
        <div className="dash-right">
          {/* Today schedule */}
          <div
            style={{
              padding: "20px",
              borderRadius: "var(--r)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "15px",
                marginBottom: "16px",
              }}
            >
              Jadwal Hari Ini
            </h3>
            {[
              "09:00",
              "10:00",
              "11:00",
              "11:30",
              "13:00",
              "14:00",
              "15:30",
              "16:00",
            ].map((t, i) => {
              const booked = ["10:00", "11:30", "13:00"].includes(t);
              return (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 0",
                    borderBottom: i < 7 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      width: "38px",
                      flexShrink: 0,
                    }}
                  >
                    {t}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "6px",
                      borderRadius: "3px",
                      background: booked ? "var(--accent)" : "var(--surface-3)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      color: booked ? "var(--accent)" : "var(--text-muted)",
                    }}
                  >
                    {booked ? "Booked" : "Kosong"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Reminder queue */}
          <div
            style={{
              padding: "20px",
              borderRadius: "var(--r)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <h3
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  fontWeight: 800,
                  fontSize: "15px",
                }}
              >
                ◎ Reminder Queue
              </h3>
              <Link
                href="/dashboard/reminders"
                style={{
                  color: "var(--accent)",
                  fontSize: "12px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Detail →
              </Link>
            </div>
            {reminderQueue.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom:
                    i < reminderQueue.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500 }}>{r.name}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {r.type} · {r.time}
                  </p>
                </div>
                <Badge variant={r.status === "Terkirim" ? "success" : "info"}>
                  {r.status}
                </Badge>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div
            style={{
              padding: "20px",
              borderRadius: "var(--r)",
              background: "var(--accent-muted)",
              border: "1px solid var(--accent-border)",
            }}
          >
            <h3
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "14px",
                color: "var(--accent)",
                marginBottom: "12px",
              }}
            >
              Quick Actions
            </h3>
            {[
              { label: "Tambah Layanan Baru", href: "/dashboard/services" },
              { label: "Edit Availability", href: "/dashboard/availability" },
              { label: "Lihat Halaman Booking", href: "/book/alfito-barber" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 0",
                  borderBottom: "1px solid var(--accent-border)",
                  color: "var(--text-dim)",
                  fontSize: "13px",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                {a.label}
                <span style={{ color: "var(--accent)" }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODAL BOOKING MANUAL ── */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div
            className="anim-scale-in"
            style={{
              width: "100%",
              maxWidth: "480px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              padding: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  fontWeight: 900,
                  fontSize: "20px",
                  letterSpacing: "-0.3px",
                }}
              >
                Booking Manual
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: "20px",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: "2px 6px",
                }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "var(--r-sm)",
                  background: "rgba(244,63,94,0.08)",
                  border: "1px solid rgba(244,63,94,0.2)",
                  color: "var(--red)",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                {formError}
              </div>
            )}

            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label style={modalLabelStyle}>Nama Customer *</label>
                <input
                  type="text"
                  placeholder="cth: Budi Santoso"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={modalInputStyle}
                  autoFocus
                />
              </div>
              <div>
                <label style={modalLabelStyle}>Nomor WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="cth: 08123456789"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={modalInputStyle}
                />
              </div>
              <div>
                <label style={modalLabelStyle}>Layanan</label>
                <select
                  value={form.service}
                  onChange={(e) =>
                    setForm({ ...form, service: e.target.value })
                  }
                  style={modalInputStyle}
                >
                  {SERVICES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label style={modalLabelStyle}>Tanggal *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="date-input-light"
                    style={modalInputStyle}
                  />
                </div>
                <div>
                  <label style={modalLabelStyle}>Jam</label>
                  <select
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    style={modalInputStyle}
                  >
                    {SLOTS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button
                onClick={handleCloseModal}
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
                  fontFamily: "inherit",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleAddBooking}
                style={{
                  flex: 2,
                  padding: "11px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--accent)",
                  border: "none",
                  color: "#08090c",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                ✓ Simpan Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dash-page {
          padding: 36px 40px;
          box-sizing: border-box;
          width: 100%;
        }
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          gap: 12px;
        }
        .dash-title {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 28px;
          width: 100%;
          box-sizing: border-box;
        }
        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          align-items: start;
          width: 100%;
          box-sizing: border-box;
        }
        .dash-bookings {
          min-width: 0;
        }
        .dash-right {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0;
        }
        .date-input-light::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(2);
          cursor: pointer;
          opacity: 0.7;
        }
        .date-input-light::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }

        @media (max-width: 1100px) {
          .dash-grid { grid-template-columns: 1fr 300px; }
        }
        @media (max-width: 900px) {
          .dash-grid  { grid-template-columns: 1fr; }
          .dash-stats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .dash-page    { padding: 20px 16px; }
          .dash-title   { font-size: 22px; }
          .dash-header  { align-items: center; margin-bottom: 24px; }
          .dash-stats   { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
          .dash-grid    { grid-template-columns: 1fr; gap: 16px; }
          .dash-bookings { width: 100%; box-sizing: border-box; overflow: hidden; }
          .dash-right   { width: 100%; box-sizing: border-box; }
        }
        @media (max-width: 480px) {
          .dash-page  { padding: 16px 12px; }
          .dash-stats { grid-template-columns: repeat(2, 1fr); gap: 8px; }
        }
      `}</style>
    </div>
  );
}

const modalLabelStyle: React.CSSProperties = {
  display: "block",
  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "7px",
};

const modalInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "var(--r-sm)",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};
