"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import BookingCard from "@/components/BookingCard";
import { useAuth } from "@/context/AuthContext";
import {
  getBookings,
  addBooking,
  updateBookingStatus,
  type Booking,
  getServices,
  type Service,
  triggerBookingReminder,
} from "@/lib/firestore";

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

// ── Inner component (pakai useSearchParams) ──
function BookingsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const filterFromUrl = searchParams.get("filter");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(filterFromUrl ?? "Semua");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: SLOTS[0],
  });

  useEffect(() => {
    if (!user) return;
    fetchAll();
  }, [user]);

  async function fetchAll() {
    if (!user) return;
    setLoading(true);
    try {
      const [bkgs, svcs] = await Promise.all([
        getBookings(user.uid),
        getServices(user.uid),
      ]);
      setBookings(bkgs);
      setServices(svcs);
      if (svcs.length > 0 && !form.service) {
        setForm((f) => ({ ...f, service: svcs[0].name }));
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookings() {
    if (!user) return;
    const bkgs = await getBookings(user.uid);
    setBookings(bkgs);
  }

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
    revenue: (() => {
      const total = bookings
        .filter((b) => b.status === "completed")
        .reduce(
          (acc, b) => acc + (parseInt(b.price.replace(/\D/g, "")) || 0),
          0,
        );
      return total >= 1000000
        ? `Rp ${(total / 1000000).toFixed(1)}jt`
        : total >= 1000
          ? `Rp ${(total / 1000).toFixed(0)}rb`
          : `Rp ${total}`;
    })(),
  };

  function getServiceInfo(name: string) {
    const found = services.find((s) => s.name === name);
    return found
      ? { duration: found.duration, price: found.price }
      : { duration: "—", price: "—" };
  }

  async function fetchBookedSlots(dateStr: string) {
    if (!user || !dateStr) return;
    setLoadingSlots(true);
    try {
      const dateObj = new Date(dateStr);
      const formatted = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const allBookings = await getBookings(user.uid);
      const taken = allBookings
        .filter((b) => b.date === formatted && b.status !== "cancelled")
        .map((b) => b.time);
      setBookedSlots(taken);
    } finally {
      setLoadingSlots(false);
    }
  }

  const isSubmittingRef = useRef(false);

  async function handleAddBooking() {
    // ── Guard: prevent double call ──
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    if (!user) {
      isSubmittingRef.current = false;
      return;
    }
    if (!form.name.trim() || !form.phone.trim() || !form.date) {
      setFormError("Nama, nomor HP, dan tanggal wajib diisi.");
      isSubmittingRef.current = false;
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      const dateObj = new Date(form.date);
      const formatted = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const info = getServiceInfo(form.service);

      const bookingId = await addBooking(user.uid, {
        customerName: form.name,
        service: form.service,
        date: formatted,
        time: form.time,
        phone: form.phone,
        status: "confirmed",
        duration: info.duration,
        price: info.price,
      });

      console.log("Booking manual created:", bookingId);

      // ── Trigger n8n via API route (confirmed langsung) ──
      const triggerRes = await fetch("/api/update-booking-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          clientUid: user.uid,
          newStatus: "confirmed",
        }),
      });
      const triggerData = await triggerRes.json();
      console.log("Trigger result:", triggerData);

      await fetchBookings();
      setForm({
        name: "",
        phone: "",
        service: services[0]?.name ?? "",
        date: "",
        time: SLOTS[0],
      });
      setBookedSlots([]);
      setShowModal(false);
    } catch (err) {
      console.error("Error adding booking:", err);
      setFormError("Gagal menambahkan booking. Coba lagi.");
    } finally {
      setSubmitting(false);
      isSubmittingRef.current = false;
    }
  }

  async function handleStatusChange(
    bookingId: string,
    status: Booking["status"],
  ) {
    if (!user) return;
    await updateBookingStatus(user.uid, bookingId, status);
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b)),
    );
  }

  function handleCloseModal() {
    setShowModal(false);
    setFormError("");
    setForm({
      name: "",
      phone: "",
      service: services[0]?.name ?? "",
      date: "",
      time: SLOTS[0],
    });
  }

  return (
    <div className="bookings-page">
      {/* Header */}
      <div className="anim-fade-up bookings-header">
        <div>
          <h1 className="bookings-title">Semua Booking</h1>
          <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>
            {loading ? "Memuat..." : `${bookings.length} total booking`}
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

      {/* Stats */}
      <div className="anim-fade-up delay-1 booking-stats">
        {[
          {
            label: "Total",
            value: loading ? "—" : counts.total,
            color: "var(--text)",
          },
          {
            label: "Confirmed",
            value: loading ? "—" : counts.confirmed,
            color: "#22c55e",
          },
          {
            label: "Pending",
            value: loading ? "—" : counts.pending,
            color: "#f97316",
          },
          {
            label: "Revenue",
            value: loading ? "—" : counts.revenue,
            color: "var(--accent)",
          },
        ].map((s) => (
          <div key={s.label} className="booking-stat-card">
            <p className="booking-stat-label">{s.label}</p>
            <p className="booking-stat-value" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
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

      {/* Filter */}
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

      {/* Result count */}
      {(search || activeFilter !== "Semua") && (
        <p className="result-count">
          {filtered.length} hasil{search ? ` untuk "${search}"` : ""}
          {activeFilter !== "Semua" ? ` · ${filterLabels[activeFilter]}` : ""}
        </p>
      )}

      {/* List */}
      <div className="anim-fade-up delay-3 bookings-list">
        {loading ? (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              background: "var(--surface)",
              borderRadius: "var(--r)",
              border: "1px solid var(--border)",
            }}
          >
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
              Memuat booking...
            </p>
          </div>
        ) : filtered.length === 0 ? (
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
              {search || activeFilter !== "Semua"
                ? "Tidak ada booking"
                : "Belum ada booking"}
            </p>
            <p style={{ fontSize: "14px" }}>
              {search || activeFilter !== "Semua"
                ? "Coba ubah filter atau pencarian."
                : "Booking yang masuk akan tampil di sini."}
            </p>
          </div>
        ) : (
          filtered.map((b) => (
            <BookingCard
              key={b.id}
              {...b}
              clientUid={user?.uid} // ← tambah ini
              onStatusChange={(status) => {
                // Update local state langsung, API sudah dipanggil di BookingCard
                setBookings((prev) =>
                  prev.map((bk) => (bk.id === b.id ? { ...bk, status } : bk)),
                );
              }}
            />
          ))
        )}
      </div>

      {/* Modal Booking Manual */}
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
                <label style={mLabel}>Nama Customer *</label>
                <input
                  type="text"
                  placeholder="cth: Budi Santoso"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={mInput}
                  autoFocus
                />
              </div>
              <div>
                <label style={mLabel}>Nomor WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="cth: 08123456789"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={mInput}
                />
              </div>
              <div>
                <label style={mLabel}>Layanan</label>
                <select
                  value={form.service}
                  onChange={(e) =>
                    setForm({ ...form, service: e.target.value })
                  }
                  style={mInput}
                >
                  {services.length === 0 ? (
                    <option value="">Belum ada layanan</option>
                  ) : (
                    services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} · {s.price} ({s.duration})
                      </option>
                    ))
                  )}
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
                  <label style={mLabel}>Tanggal *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => {
                      setForm({ ...form, date: e.target.value });
                      fetchBookedSlots(e.target.value);
                    }}
                    className="date-input-light"
                    style={mInput}
                  />
                </div>
                <div>
                  <label style={mLabel}>
                    Jam{loadingSlots ? " (memuat...)" : ""}
                  </label>
                  {form.date ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(72px, 1fr))",
                        gap: "6px",
                        marginTop: "4px",
                      }}
                    >
                      {SLOTS.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = form.time === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() =>
                              !isBooked && setForm({ ...form, time: slot })
                            }
                            style={{
                              padding: "8px 4px",
                              borderRadius: "var(--r-sm)",
                              border: isSelected
                                ? "2px solid var(--accent)"
                                : "1px solid var(--border)",
                              background: isSelected
                                ? "var(--accent)"
                                : isBooked
                                  ? "var(--surface-3)"
                                  : "var(--surface-2)",
                              color: isSelected
                                ? "#08090c"
                                : isBooked
                                  ? "var(--text-muted)"
                                  : "var(--text)",
                              fontSize: "12px",
                              fontWeight: isSelected ? 700 : 500,
                              cursor: isBooked ? "not-allowed" : "pointer",
                              textDecoration: isBooked
                                ? "line-through"
                                : "none",
                              opacity: isBooked ? 0.5 : 1,
                              transition: "all 0.15s",
                              fontFamily: "inherit",
                            }}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "13px",
                        marginTop: "8px",
                        padding: "10px",
                        background: "var(--surface-3)",
                        borderRadius: "var(--r-sm)",
                        textAlign: "center",
                      }}
                    >
                      Pilih tanggal dulu untuk melihat slot tersedia
                    </p>
                  )}
                  {form.date && bookedSlots.length > 0 && (
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "11px",
                        marginTop: "6px",
                      }}
                    >
                      <span style={{ color: "var(--red)" }}>■</span> = sudah
                      dibooking
                    </p>
                  )}
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
                disabled={submitting}
                style={{
                  flex: 2,
                  padding: "11px",
                  borderRadius: "var(--r-sm)",
                  background: submitting ? "var(--surface-3)" : "var(--accent)",
                  border: "none",
                  color: submitting ? "var(--text-muted)" : "#08090c",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {submitting ? "Menyimpan..." : "✓ Simpan Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .bookings-page { padding: 36px 40px; box-sizing: border-box; width: 100%; }
        .bookings-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; gap: 12px; }
        .bookings-title { font-family: 'Cabinet Grotesk', sans-serif; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 6px; }
        .booking-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 16px; width: 100%; box-sizing: border-box; }
        .booking-stat-card { padding: 16px 20px; border-radius: var(--r); background: var(--surface); border: 1px solid var(--border); box-sizing: border-box; min-width: 0; }
        .booking-stat-label { color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .booking-stat-value { font-family: 'Cabinet Grotesk', sans-serif; font-weight: 900; font-size: 22px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .search-wrap { margin-bottom: 10px; width: 100%; box-sizing: border-box; }
        .filter-wrap { margin-top: 0.5rem; margin-bottom: 18px; max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; display: flex; }
        .filter-wrap::-webkit-scrollbar { display: none; }
        .filter-pills { display: inline-flex; flex-wrap: nowrap; gap: 6px; padding: 4px; border-radius: var(--r-sm); background: var(--surface); border: 1px solid var(--border); width: fit-content; flex-shrink: 0; }
        .filter-pill { padding: 7px 14px; border-radius: 6px; border: none; background: transparent; color: var(--text-dim); font-size: 13px; font-weight: 400; cursor: pointer; transition: all 0.15s; white-space: nowrap; font-family: inherit; flex-shrink: 0; }
        .filter-pill-active { background: var(--accent); color: #08090c; font-weight: 700; }
        .result-count { color: var(--text-muted); font-size: 13px; margin-bottom: 12px; }
        .bookings-list { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .empty-state { padding: 60px 20px; text-align: center; color: var(--text-muted); background: var(--surface); border-radius: var(--r); border: 1px solid var(--border); }
        .date-input-light::-webkit-calendar-picker-indicator { filter: invert(1) brightness(2); cursor: pointer; opacity: 0.7; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (max-width: 768px) { .bookings-page { padding: 20px 16px; } .bookings-title { font-size: 22px; } .bookings-header { align-items: center; } .booking-stats { grid-template-columns: repeat(2,1fr); gap: 8px; } .booking-stat-card { padding: 14px 16px; } .booking-stat-value { font-size: 20px; } }
        @media (max-width: 480px) { .bookings-page { padding: 16px 12px; } .booking-stats { grid-template-columns: repeat(2,1fr); gap: 8px; } .booking-stat-card { padding: 12px 14px; } .booking-stat-label { font-size: 10px; } .booking-stat-value { font-size: 18px; } }
      `}</style>
    </div>
  );
}

// ── Loading fallback ──
function BookingsLoading() {
  return (
    <div style={{ padding: "36px 40px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            height: "32px",
            width: "200px",
            borderRadius: "var(--r-sm)",
            background: "var(--surface-3)",
            marginBottom: "8px",
          }}
        />
        <div
          style={{
            height: "16px",
            width: "120px",
            borderRadius: "var(--r-sm)",
            background: "var(--surface-3)",
          }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: "80px",
              borderRadius: "var(--r)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          />
        ))}
      </div>
      <div style={{ padding: "60px", textAlign: "center" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "3px solid var(--border)",
            borderTop: "3px solid var(--accent)",
            margin: "0 auto",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

// ── Default export dengan Suspense wrapper ──
export default function BookingsPage() {
  return (
    <Suspense fallback={<BookingsLoading />}>
      <BookingsContent />
    </Suspense>
  );
}

const mLabel: React.CSSProperties = {
  display: "block",
  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "7px",
};
const mInput: React.CSSProperties = {
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
