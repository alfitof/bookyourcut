"use client";
import { useState } from "react";
import BookingCard from "@/components/BookingCard";
import Badge from "@/components/Badge";

const allBookings = [
  {
    customerName: "Budi Santoso",
    service: "Haircut",
    date: "21 Jun 2025",
    time: "10:00",
    phone: "0812-3456-7890",
    status: "confirmed" as const,
    duration: "30 mnt",
    price: "Rp 50rb",
  },
  {
    customerName: "Reza Firmansyah",
    service: "Haircut + Beard",
    date: "21 Jun 2025",
    time: "11:30",
    phone: "0813-2233-4455",
    status: "confirmed" as const,
    duration: "45 mnt",
    price: "Rp 75rb",
  },
  {
    customerName: "Dani Prasetyo",
    service: "Haircut",
    date: "21 Jun 2025",
    time: "13:00",
    phone: "0857-9988-7766",
    status: "pending" as const,
    duration: "30 mnt",
    price: "Rp 50rb",
  },
  {
    customerName: "Hendra Wijaya",
    service: "Coloring",
    date: "22 Jun 2025",
    time: "09:00",
    phone: "0821-5544-3322",
    status: "confirmed" as const,
    duration: "90 mnt",
    price: "Rp 150rb",
  },
  {
    customerName: "Fajar Nugroho",
    service: "Haircut",
    date: "22 Jun 2025",
    time: "14:00",
    phone: "0878-1122-3344",
    status: "confirmed" as const,
    duration: "30 mnt",
    price: "Rp 50rb",
  },
  {
    customerName: "Andi Kurniawan",
    service: "Haircut + Beard",
    date: "20 Jun 2025",
    time: "10:00",
    phone: "0811-9988-1234",
    status: "completed" as const,
    duration: "45 mnt",
    price: "Rp 75rb",
  },
  {
    customerName: "Surya Darma",
    service: "Haircut",
    date: "20 Jun 2025",
    time: "15:00",
    phone: "0852-4433-5566",
    status: "cancelled" as const,
    duration: "30 mnt",
    price: "Rp 50rb",
  },
  {
    customerName: "Rizal Mahmud",
    service: "Coloring",
    date: "19 Jun 2025",
    time: "11:00",
    phone: "0819-7766-5544",
    status: "completed" as const,
    duration: "90 mnt",
    price: "Rp 150rb",
  },
];

const filters = ["Semua", "Confirmed", "Pending", "Completed", "Cancelled"];

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = allBookings.filter((b) => {
    const matchFilter =
      activeFilter === "Semua" || b.status === activeFilter.toLowerCase();
    const matchSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.service.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    total: allBookings.length,
    confirmed: allBookings.filter((b) => b.status === "confirmed").length,
    pending: allBookings.filter((b) => b.status === "pending").length,
    revenue: "Rp 650rb",
  };

  return (
    <div style={{ padding: "36px 40px" }}>
      {/* Header */}
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
            Semua Booking
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>
            {allBookings.length} total booking · 3 hari terakhir
          </p>
        </div>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "var(--r-sm)",
            background: "var(--accent)",
            color: "#08090c",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
          }}
        >
          + Booking Manual
        </button>
      </div>

      {/* Mini stats */}
      <div
        className="anim-fade-up delay-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        {[
          { label: "Total", value: counts.total, color: "var(--text)" },
          { label: "Confirmed", value: counts.confirmed, color: "#22c55e" },
          { label: "Pending", value: counts.pending, color: "#f97316" },
          { label: "Revenue", value: counts.revenue, color: "var(--accent)" },
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
                fontSize: "24px",
                color: s.color,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div
        className="anim-fade-up delay-2"
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "6px",
            padding: "4px",
            borderRadius: "var(--r-sm)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                border: "none",
                background:
                  activeFilter === f ? "var(--accent)" : "transparent",
                color: activeFilter === f ? "#08090c" : "var(--text-dim)",
                fontSize: "13px",
                fontWeight: activeFilter === f ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Cari nama atau layanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "9px 16px",
            borderRadius: "var(--r-sm)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>

      {/* List */}
      <div
        className="anim-fade-up delay-3"
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "14px",
            }}
          >
            Tidak ada booking yang cocok.
          </div>
        ) : (
          filtered.map((b, i) => <BookingCard key={i} {...b} />)
        )}
      </div>
    </div>
  );
}
