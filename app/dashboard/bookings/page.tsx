"use client";
import { useState } from "react";
import BookingCard from "@/components/BookingCard";

type Booking = {
  id: number;
  customerName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  duration: string;
  price: string;
};

const initialBookings: Booking[] = [
  {
    id: 1,
    customerName: "Budi Santoso",
    service: "Haircut",
    date: "21 Jun 2025",
    time: "10:00",
    phone: "0812-3456-7890",
    status: "confirmed",
    duration: "30 mnt",
    price: "Rp 50rb",
  },
  {
    id: 2,
    customerName: "Reza Firmansyah",
    service: "Haircut + Beard",
    date: "21 Jun 2025",
    time: "11:30",
    phone: "0813-2233-4455",
    status: "confirmed",
    duration: "45 mnt",
    price: "Rp 75rb",
  },
  {
    id: 3,
    customerName: "Dani Prasetyo",
    service: "Haircut",
    date: "21 Jun 2025",
    time: "13:00",
    phone: "0857-9988-7766",
    status: "pending",
    duration: "30 mnt",
    price: "Rp 50rb",
  },
  {
    id: 4,
    customerName: "Hendra Wijaya",
    service: "Coloring",
    date: "22 Jun 2025",
    time: "09:00",
    phone: "0821-5544-3322",
    status: "confirmed",
    duration: "90 mnt",
    price: "Rp 150rb",
  },
  {
    id: 5,
    customerName: "Fajar Nugroho",
    service: "Haircut",
    date: "22 Jun 2025",
    time: "14:00",
    phone: "0878-1122-3344",
    status: "confirmed",
    duration: "30 mnt",
    price: "Rp 50rb",
  },
  {
    id: 6,
    customerName: "Andi Kurniawan",
    service: "Haircut + Beard",
    date: "20 Jun 2025",
    time: "10:00",
    phone: "0811-9988-1234",
    status: "completed",
    duration: "45 mnt",
    price: "Rp 75rb",
  },
  {
    id: 7,
    customerName: "Surya Darma",
    service: "Haircut",
    date: "20 Jun 2025",
    time: "15:00",
    phone: "0852-4433-5566",
    status: "cancelled",
    duration: "30 mnt",
    price: "Rp 50rb",
  },
  {
    id: 8,
    customerName: "Rizal Mahmud",
    service: "Coloring",
    date: "19 Jun 2025",
    time: "11:00",
    phone: "0819-7766-5544",
    status: "completed",
    duration: "90 mnt",
    price: "Rp 150rb",
  },
  {
    id: 9,
    customerName: "Bagas Pratama",
    service: "Keramas",
    date: "19 Jun 2025",
    time: "09:30",
    phone: "0856-1234-5678",
    status: "completed",
    duration: "15 mnt",
    price: "Rp 25rb",
  },
  {
    id: 10,
    customerName: "Yoga Santosa",
    service: "Haircut",
    date: "18 Jun 2025",
    time: "13:00",
    phone: "0877-8765-4321",
    status: "cancelled",
    duration: "30 mnt",
    price: "Rp 50rb",
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

const filters = ["Semua", "confirmed", "pending", "completed", "cancelled"];
const filterLabels: Record<string, string> = {
  Semua: "Semua",
  confirmed: "Confirmed",
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: SERVICES[0],
    date: "",
    time: SLOTS[0],
  });
  const [formError, setFormError] = useState("");

  const filtered = bookings.filter((b) => {
    const matchFilter = activeFilter === "Semua" || b.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      b.customerName.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.date.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const counts = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    revenue: "Rp 675rb",
  };

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
    const serviceInfo: Record<string, { duration: string; price: string }> = {
      Haircut: { duration: "30 mnt", price: "Rp 50rb" },
      "Haircut + Beard": { duration: "45 mnt", price: "Rp 75rb" },
      Coloring: { duration: "90 mnt", price: "Rp 150rb" },
      Keramas: { duration: "15 mnt", price: "Rp 25rb" },
    };
    const info = serviceInfo[form.service] ?? { duration: "—", price: "—" };
    setBookings([
      {
        id: Date.now(),
        customerName: form.name,
        service: form.service,
        date: formatted,
        time: form.time,
        phone: form.phone,
        status: "confirmed",
        duration: info.duration,
        price: info.price,
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
    <div className="bookings-page">
      {/* ── HEADER ── */}
      <div className="anim-fade-up bookings-header">
        <div>
          <h1 className="bookings-title">Semua Booking</h1>
          <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>
            {bookings.length} total · 7 hari terakhir
          </p>
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

      {/* ── MINI STATS ── */}
      <div className="anim-fade-up delay-1 booking-stats">
        {[
          { label: "Total", value: counts.total, color: "var(--text)" },
          { label: "Confirmed", value: counts.confirmed, color: "#22c55e" },
          { label: "Pending", value: counts.pending, color: "#f97316" },
          { label: "Revenue", value: counts.revenue, color: "var(--accent)" },
        ].map((s) => (
          <div key={s.label} className="booking-stat-card">
            <p className="booking-stat-label">{s.label}</p>
            <p className="booking-stat-value" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── SEARCH ── */}
      <div className="anim-fade-up delay-2 search-wrap">
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              fontSize: "15px",
              pointerEvents: "none",
            }}
          >
            ⌕
          </span>
          <input
            type="text"
            placeholder="Cari nama, layanan, atau nomor HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 36px 10px 34px",
              borderRadius: "var(--r-sm)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "14px",
                lineHeight: 1,
                padding: "2px",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── FILTER PILLS ── */}
      <div className="anim-fade-up delay-2 filter-wrap">
        <div className="filter-pills">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`filter-pill ${activeFilter === f ? "filter-pill-active" : ""}`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULT COUNT ── */}
      {(search || activeFilter !== "Semua") && (
        <p className="result-count">
          {filtered.length} hasil
          {search ? ` untuk "${search}"` : ""}
          {activeFilter !== "Semua" ? ` · ${filterLabels[activeFilter]}` : ""}
        </p>
      )}

      {/* ── LIST ── */}
      <div className="anim-fade-up delay-3 bookings-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: "32px", marginBottom: "12px" }}>◎</p>
            <p
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                marginBottom: "6px",
              }}
            >
              Tidak ada booking
            </p>
            <p style={{ fontSize: "14px" }}>
              Coba ubah filter atau kata kunci pencarian.
            </p>
          </div>
        ) : (
          filtered.map((b) => <BookingCard key={b.id} {...b} />)
        )}
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
            {/* Modal header */}
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

            {/* Error */}
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

            {/* Form fields */}
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

              {/* Tanggal & Jam — dengan date input icon putih */}
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

            {/* Buttons */}
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
        /* ── BASE ── */
        .bookings-page {
          padding: 36px 40px;
          box-sizing: border-box;
          width: 100%;
        }
        .bookings-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 12px;
        }
        .bookings-title {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        /* ── STATS ── */
        .booking-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 16px;
          width: 100%;
          box-sizing: border-box;
        }
        .booking-stat-card {
          padding: 16px 20px;
          border-radius: var(--r);
          background: var(--surface);
          border: 1px solid var(--border);
          box-sizing: border-box;
          min-width: 0;
        }
        .booking-stat-label {
          color: var(--text-muted);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .booking-stat-value {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-weight: 900;
          font-size: 22px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── SEARCH ── */
        .search-wrap {
          margin-bottom: 10px;
          width: 100%;
          box-sizing: border-box;
        }

        /* ── FILTER — tidak full width, hanya fit content ── */
        .filter-wrap {
          margin-top: 0.5rem;
          margin-bottom: 18px;
          max-width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          /* kunci: jangan stretch ke full width */
          display: flex;
        }
        .filter-wrap::-webkit-scrollbar { display: none; }
        .filter-pills {
          display: inline-flex;
          flex-wrap: nowrap;
          gap: 6px;
          padding: 4px;
          border-radius: var(--r-sm);
          background: var(--surface);
          border: 1px solid var(--border);
          /* fit content, tidak full width */
          width: fit-content;
          flex-shrink: 0;
        }
        .filter-pill {
          padding: 7px 14px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--text-dim);
          font-size: 13px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          font-family: inherit;
          flex-shrink: 0;
        }
        .filter-pill-active {
          background: var(--accent);
          color: #08090c;
          font-weight: 700;
        }

        /* ── RESULT COUNT ── */
        .result-count {
          color: var(--text-muted);
          font-size: 13px;
          margin-bottom: 12px;
        }

        /* ── LIST ── */
        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }
        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: var(--text-muted);
          background: var(--surface);
          border-radius: var(--r);
          border: 1px solid var(--border);
        }

        /* ── DATE INPUT — icon kalender cerah ── */
        .date-input-light::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(2);
          cursor: pointer;
          opacity: 0.7;
        }
        .date-input-light::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .bookings-page { padding: 20px 16px; }
          .bookings-title { font-size: 22px; }
          .bookings-header { align-items: center; }
          .booking-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .booking-stat-card { padding: 14px 16px; }
          .booking-stat-value { font-size: 20px; }
        }

        @media (max-width: 480px) {
          .bookings-page { padding: 16px 12px; }
          .booking-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .booking-stat-card { padding: 12px 14px; }
          .booking-stat-label { font-size: 10px; }
          .booking-stat-value { font-size: 18px; }
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
