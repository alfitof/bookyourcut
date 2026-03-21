"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Scissors,
  Clock,
  Bell,
  Settings,
  ExternalLink,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/bookings", icon: CalendarDays, label: "Bookings" },
  { href: "/dashboard/services", icon: Scissors, label: "Services" },
  { href: "/dashboard/availability", icon: Clock, label: "Availability" },
  { href: "/dashboard/reminders", icon: Bell, label: "Reminders" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          onClick={onClose}
          className="mobile-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 99,
            display: "none",
          }}
        />
      )}

      <aside
        className={`sidebar ${open ? "sidebar-open" : ""}`}
        style={{
          width: "230px",
          flexShrink: 0,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          overflowY: "auto",
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "22px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                background: "var(--accent)",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "15px",
                color: "#08090c",
              }}
            >
              B
            </div>
            <span
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "18px",
              }}
            >
              BookYourCut
            </span>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="sidebar-close-btn"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "none",
              padding: "4px",
              borderRadius: "6px",
              lineHeight: 1,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Business profile chip */}
        <div
          style={{
            margin: "16px 14px",
            padding: "12px 14px",
            borderRadius: "var(--r-sm)",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              marginBottom: "2px",
            }}
          >
            Alfito Barber
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "11px" }}>
            bookyourcut.app/book/alfito-barber
          </p>
        </div>

        {/* Nav */}
        <nav style={{ padding: "8px 12px", flex: 1 }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "var(--r-sm)",
                  marginBottom: "2px",
                  background: active ? "var(--accent-muted)" : "transparent",
                  border: active
                    ? "1px solid var(--accent-border)"
                    : "1px solid transparent",
                  color: active ? "var(--accent)" : "var(--text-dim)",
                  fontSize: "14px",
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.15s",
                  textDecoration: "none",
                }}
              >
                <Icon
                  size={16}
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{ flexShrink: 0 }}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Share link button */}
        <div style={{ padding: "14px", borderTop: "1px solid var(--border)" }}>
          <Link
            href="/book/alfito-barber"
            target="_blank"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px",
              borderRadius: "var(--r-sm)",
              background: "var(--accent)",
              color: "#08090c",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <ExternalLink size={14} strokeWidth={2.5} />
            Buka Halaman Booking
          </Link>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            height: 100vh;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
          }
          .sidebar.sidebar-open {
            transform: translateX(0);
          }
          .sidebar-close-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .mobile-overlay {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
