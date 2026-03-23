"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllClients, type ClientData } from "@/lib/admin";
import { Users, CheckCircle, XCircle, Star, ArrowRight } from "lucide-react";

export default function AdminOverviewPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllClients().then((data) => {
      setClients(data);
      setLoading(false);
    });
  }, []);

  const stats = [
    {
      label: "Total Client",
      value: clients.length,
      color: "var(--text)",
      icon: <Users size={18} />,
      bg: "var(--surface-3)",
    },
    {
      label: "Active",
      value: clients.filter((c) => c.status === "active").length,
      color: "#22c55e",
      icon: <CheckCircle size={18} />,
      bg: "rgba(34,197,94,0.1)",
    },
    {
      label: "Inactive",
      value: clients.filter((c) => c.status === "inactive").length,
      color: "var(--red)",
      icon: <XCircle size={18} />,
      bg: "rgba(244,63,94,0.1)",
    },
    {
      label: "Pro Plan",
      value: clients.filter((c) => c.plan === "pro").length,
      color: "var(--purple)",
      icon: <Star size={18} />,
      bg: "rgba(167,139,250,0.1)",
    },
  ];

  return (
    <div className="admin-overview-page">
      {/* ── HEADER ── */}
      <div style={{ marginBottom: "32px" }}>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "13px",
            marginBottom: "6px",
          }}
        >
          Admin Panel
        </p>
        <h1 className="admin-page-title">Overview</h1>
      </div>

      {/* ── STATS ── */}
      <div className="admin-stats-grid" style={{ marginBottom: "32px" }}>
        {stats.map((s) => (
          <div key={s.label} className="admin-stat-card">
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: s.color,
                marginBottom: "14px",
              }}
            >
              {s.icon}
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "11px",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "32px",
                color: s.color,
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              {loading ? "—" : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── RECENT CLIENTS ── */}
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
            fontSize: "17px",
            fontWeight: 800,
          }}
        >
          Client Terbaru
        </h2>
        <Link
          href="/admin/clients"
          style={{
            color: "var(--purple)",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          Lihat semua <ArrowRight size={13} />
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <div className="admin-spinner" style={{ margin: "0 auto" }} />
        </div>
      ) : clients.length === 0 ? (
        <div className="admin-empty">
          <p style={{ fontSize: "36px", marginBottom: "12px" }}>👥</p>
          <p
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              marginBottom: "6px",
            }}
          >
            Belum ada client
          </p>
          <Link
            href="/admin/clients"
            style={{
              color: "var(--purple)",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Tambah client pertama →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {clients.slice(0, 8).map((c) => {
            const initials = c.businessName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            return (
              <div key={c.uid} className="overview-client-row">
                <div className="overview-client-avatar">{initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "Cabinet Grotesk, sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      marginBottom: "2px",
                    }}
                  >
                    {c.businessName}
                  </p>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.email} · /{c.slug}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    flexShrink: 0,
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "100px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background:
                        c.plan === "pro"
                          ? "rgba(167,139,250,0.1)"
                          : "var(--surface-3)",
                      color:
                        c.plan === "pro"
                          ? "var(--purple)"
                          : "var(--text-muted)",
                      border:
                        c.plan === "pro"
                          ? "1px solid rgba(167,139,250,0.25)"
                          : "1px solid var(--border)",
                    }}
                  >
                    {c.plan === "pro" ? "Pro" : "Free"}
                  </span>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "100px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background:
                        c.status === "active"
                          ? "rgba(34,197,94,0.1)"
                          : "rgba(244,63,94,0.1)",
                      color: c.status === "active" ? "#22c55e" : "var(--red)",
                      border:
                        c.status === "active"
                          ? "1px solid rgba(34,197,94,0.25)"
                          : "1px solid rgba(244,63,94,0.25)",
                    }}
                  >
                    {c.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .admin-overview-page {
          padding: 36px 40px;
          box-sizing: border-box;
          width: 100%;
        }
        .admin-page-title {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .admin-stat-card {
          padding: 22px;
          border-radius: var(--r);
          background: var(--surface);
          border: 1px solid var(--border);
          min-width: 0;
        }
        .overview-client-row {
          padding: 14px 18px;
          border-radius: var(--r);
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 14px;
          transition: border-color 0.15s;
        }
        .overview-client-row:hover {
          border-color: var(--border-light);
        }
        .overview-client-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(167,139,250,0.12);
          border: 1px solid rgba(167,139,250,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cabinet Grotesk', sans-serif;
          font-weight: 800;
          font-size: 13px;
          color: var(--purple);
          flex-shrink: 0;
        }
        .admin-empty {
          padding: 60px 20px;
          text-align: center;
          background: var(--surface);
          border: 1px dashed var(--border);
          border-radius: var(--r);
          color: var(--text-muted);
        }
        .admin-spinner {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid var(--border);
          border-top: 3px solid var(--purple);
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .admin-overview-page { padding: 20px 16px; }
          .admin-page-title { font-size: 22px; }
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .overview-client-row { flex-wrap: wrap; gap: 10px; }
        }
        @media (max-width: 480px) {
          .admin-overview-page { padding: 16px 12px; }
          .admin-stats-grid { gap: 8px; }
        }
      `}</style>
    </div>
  );
}
