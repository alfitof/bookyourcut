"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllClients,
  updateClientStatus,
  updateClientPlan,
  deleteClientFirestore,
  type ClientData,
} from "@/lib/admin";
import {
  Search,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Users,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    const data = await getAllClients();
    setClients(data);
    setLoading(false);
  }

  async function handleToggleStatus(
    uid: string,
    current: "active" | "inactive",
  ) {
    setProcessing(uid);
    const next = current === "active" ? "inactive" : "active";
    await updateClientStatus(uid, next);
    setClients((prev) =>
      prev.map((c) => (c.uid === uid ? { ...c, status: next } : c)),
    );
    setProcessing(null);
  }

  async function handleTogglePlan(uid: string, current: "free" | "pro") {
    setProcessing(uid);
    const next = current === "free" ? "pro" : "free";
    await updateClientPlan(uid, next);
    setClients((prev) =>
      prev.map((c) => (c.uid === uid ? { ...c, plan: next } : c)),
    );
    setProcessing(null);
  }

  async function handleDelete(uid: string) {
    setDeleting(true);
    try {
      // Hapus dari Firebase Auth via API route
      await fetch("/api/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      // Hapus dari Firestore
      await deleteClientFirestore(uid);
      setClients((prev) => prev.filter((c) => c.uid !== uid));
      setDeleteId(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  }

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.businessName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  const stats = [
    {
      label: "Total",
      value: clients.length,
      color: "var(--text)",
      icon: <Users size={16} />,
    },
    {
      label: "Active",
      value: clients.filter((c) => c.status === "active").length,
      color: "#22c55e",
      icon: <CheckCircle size={16} />,
    },
    {
      label: "Inactive",
      value: clients.filter((c) => c.status === "inactive").length,
      color: "var(--red)",
      icon: <XCircle size={16} />,
    },
    {
      label: "Pro Plan",
      value: clients.filter((c) => c.plan === "pro").length,
      color: "var(--purple)",
      icon: <Star size={16} />,
    },
  ];

  return (
    <div className="admin-clients-page">
      {/* ── HEADER ── */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Clients</h1>
          <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>
            {clients.length} client terdaftar
          </p>
        </div>
        <Link href="/admin/clients/new" className="btn-purple">
          <Plus size={15} />
          Tambah Client
        </Link>
      </div>

      {/* ── STATS ── */}
      <div className="admin-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <p className="admin-stat-label">{s.label}</p>
              <span style={{ color: s.color, opacity: 0.8 }}>{s.icon}</span>
            </div>
            <p className="admin-stat-value" style={{ color: s.color }}>
              {loading ? "—" : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── SEARCH ── */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <Search
          size={15}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
          }}
        />
        <input
          type="text"
          placeholder="Cari nama, email, atau slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px 10px 36px",
            borderRadius: "var(--r-sm)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* ── LIST ── */}
      {loading ? (
        <div className="admin-empty">
          <div className="admin-spinner" />
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              marginTop: "12px",
            }}
          >
            Memuat data...
          </p>
        </div>
      ) : filtered.length === 0 ? (
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
            {search ? "Tidak ada hasil" : "Belum ada client"}
          </p>
          {!search && (
            <Link
              href="/admin/clients/new"
              style={{
                color: "var(--purple)",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Tambah client pertama →
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map((client) => {
            const initials = client.businessName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const isProc = processing === client.uid;
            return (
              <div
                key={client.uid}
                className="client-card"
                style={{ opacity: isProc ? 0.6 : 1 }}
              >
                {/* Avatar */}
                <div className="client-avatar">{initials}</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "Cabinet Grotesk, sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                      marginBottom: "3px",
                    }}
                  >
                    {client.businessName}
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
                    {client.email}
                  </p>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "11px",
                      marginTop: "2px",
                    }}
                  >
                    /{client.slug} · {client.phone}
                  </p>
                </div>

                {/* Actions */}
                <div className="client-actions">
                  {/* Plan badge */}
                  <button
                    onClick={() => handleTogglePlan(client.uid, client.plan)}
                    disabled={isProc}
                    className={`plan-badge ${client.plan === "pro" ? "plan-pro" : "plan-free"}`}
                  >
                    {client.plan === "pro" ? "⭐ Pro" : "Free"}
                  </button>

                  {/* Status toggle */}
                  <button
                    onClick={() =>
                      handleToggleStatus(client.uid, client.status)
                    }
                    disabled={isProc}
                    title={
                      client.status === "active" ? "Nonaktifkan" : "Aktifkan"
                    }
                    className="status-toggle"
                    style={{
                      color:
                        client.status === "active"
                          ? "#22c55e"
                          : "var(--text-muted)",
                    }}
                  >
                    {client.status === "active" ? (
                      <ToggleRight size={26} />
                    ) : (
                      <ToggleLeft size={26} />
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteId(client.uid)}
                    disabled={isProc}
                    className="delete-btn"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL DELETE ── */}
      {deleteId && (
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
            if (e.target === e.currentTarget && !deleting) setDeleteId(null);
          }}
        >
          <div
            className="anim-scale-in"
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "var(--surface)",
              border: "1px solid rgba(244,63,94,0.2)",
              borderRadius: "var(--r-lg)",
              padding: "28px",
            }}
          >
            {deleting ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  className="admin-spinner"
                  style={{ margin: "0 auto 16px" }}
                />
                <p
                  style={{
                    fontFamily: "Cabinet Grotesk, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  Menghapus akun...
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(244,63,94,0.1)",
                    border: "1px solid rgba(244,63,94,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    marginBottom: "16px",
                  }}
                >
                  🗑
                </div>
                <h2
                  style={{
                    fontFamily: "Cabinet Grotesk, sans-serif",
                    fontWeight: 900,
                    fontSize: "20px",
                    marginBottom: "8px",
                  }}
                >
                  Hapus Client?
                </h2>
                <p
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    marginBottom: "8px",
                  }}
                >
                  Client{" "}
                  <strong style={{ color: "var(--text)" }}>
                    {clients.find((c) => c.uid === deleteId)?.businessName}
                  </strong>{" "}
                  akan dihapus permanen.
                </p>
                <p
                  style={{
                    color: "var(--red)",
                    fontSize: "13px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  ⚠ Akun email juga akan dihapus dari sistem.
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => setDeleteId(null)}
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
                    onClick={() => handleDelete(deleteId)}
                    style={{
                      flex: 1,
                      padding: "11px",
                      borderRadius: "var(--r-sm)",
                      background: "var(--red)",
                      border: "none",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Ya, Hapus
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .admin-clients-page {
          padding: 36px 40px;
          box-sizing: border-box;
          width: 100%;
        }
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .admin-page-title {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .btn-purple {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: var(--r-sm);
          background: var(--purple);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .admin-stat-card {
          padding: 20px;
          border-radius: var(--r);
          background: var(--surface);
          border: 1px solid var(--border);
          min-width: 0;
        }
        .admin-stat-label {
          color: var(--text-muted);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }
        .admin-stat-value {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-weight: 900;
          font-size: 28px;
          letter-spacing: -1px;
        }
        .client-card {
          padding: 16px 20px;
          border-radius: var(--r);
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 14px;
          transition: border-color 0.15s, opacity 0.15s;
        }
        .client-card:hover {
          border-color: var(--border-light);
        }
        .client-avatar {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(167,139,250,0.12);
          border: 1px solid rgba(167,139,250,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cabinet Grotesk', sans-serif;
          font-weight: 800;
          font-size: 14px;
          color: var(--purple);
          flex-shrink: 0;
        }
        .client-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-shrink: 0;
        }
        .plan-badge {
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-family: inherit;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .plan-pro {
          background: rgba(167,139,250,0.15);
          color: var(--purple);
        }
        .plan-free {
          background: var(--surface-3);
          color: var(--text-muted);
        }
        .status-toggle {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
          transition: opacity 0.15s;
        }
        .status-toggle:hover { opacity: 0.8; }
        .delete-btn {
          background: rgba(244,63,94,0.08);
          border: 1px solid rgba(244,63,94,0.2);
          border-radius: var(--r-sm);
          color: var(--red);
          cursor: pointer;
          padding: 7px 9px;
          display: flex;
          align-items: center;
          transition: all 0.15s;
        }
        .delete-btn:hover {
          background: rgba(244,63,94,0.15);
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

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .admin-clients-page { padding: 20px 16px; }
          .admin-page-title { font-size: 22px; }
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .client-card { flex-wrap: wrap; gap: 10px; }
          .client-actions { width: 100%; justify-content: flex-end; }
        }
        @media (max-width: 480px) {
          .admin-clients-page { padding: 16px 12px; }
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
