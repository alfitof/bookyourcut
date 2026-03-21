"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Mobile topbar */}
        <div
          className="mobile-topbar"
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          {/* Hamburger button */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)",
              color: "var(--text)",
              cursor: "pointer",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              padding: 0,
            }}
          >
            <svg
              width="18"
              height="14"
              viewBox="0 0 18 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0"
                y="0"
                width="18"
                height="2"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="0"
                y="6"
                width="18"
                height="2"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="0"
                y="12"
                width="18"
                height="2"
                rx="1"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Logo center — sama persis dengan Sidebar */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                background: "var(--accent)",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "13px",
                color: "#08090c",
              }}
            >
              B
            </div>
            <span
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "16px",
              }}
            >
              BookYourCut
            </span>
          </div>

          {/* Spacer kanan agar logo tetap center */}
          <div style={{ width: "36px", flexShrink: 0 }} />
        </div>

        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-topbar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
