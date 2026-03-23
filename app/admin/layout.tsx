"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/lib/auth";
import { LayoutDashboard, Users, LogOut, Shield, X, Menu } from "lucide-react";

const adminNav = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/clients", icon: Users, label: "Clients" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdminUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdminUser)) {
      router.push("/login?role=admin");
    }
  }, [user, loading, isAdminUser, router]);

  // tutup sidebar saat navigasi
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await logoutUser();
    router.push("/login?role=admin");
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "3px solid var(--border)",
              borderTop: "3px solid var(--purple)",
              margin: "0 auto 12px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Memuat...
          </p>
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  if (!user || !isAdminUser) return null;

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
    >
      {/* ── OVERLAY mobile ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 99,
          }}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? "admin-sidebar-open" : ""}`}
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
                background: "var(--purple)",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Shield size={15} />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  fontWeight: 800,
                  fontSize: "16px",
                  lineHeight: 1.1,
                }}
              >
                Admin Panel
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "10px" }}>
                BookYourCut
              </p>
            </div>
          </div>

          {/* Close btn — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="admin-sidebar-close"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px", flex: 1 }}>
          {adminNav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href === "/admin/clients" &&
                pathname.startsWith("/admin/clients"));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "var(--r-sm)",
                  marginBottom: "2px",
                  background: active ? "rgba(167,139,250,0.1)" : "transparent",
                  border: active
                    ? "1px solid rgba(167,139,250,0.25)"
                    : "1px solid transparent",
                  color: active ? "var(--purple)" : "var(--text-dim)",
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

        {/* User info + logout */}
        <div style={{ padding: "14px", borderTop: "1px solid var(--border)" }}>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "var(--r-sm)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              marginBottom: "8px",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.displayName ?? "Admin"}
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "11px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "9px",
              borderRadius: "var(--r-sm)",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--red)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            <LogOut size={14} />
            Keluar
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
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
          className="admin-topbar"
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
            <Menu size={18} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                background: "var(--purple)",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Shield size={13} />
            </div>
            <span
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "15px",
              }}
            >
              Admin Panel
            </span>
          </div>

          <div style={{ width: "36px" }} />
        </div>

        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {children}
        </main>
      </div>

      <style>{`
        .admin-sidebar {
          width: 220px;
          flex-shrink: 0;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
          z-index: 100;
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            height: 100vh;
            transform: translateX(-100%);
          }
          .admin-sidebar.admin-sidebar-open {
            transform: translateX(0);
          }
          .admin-sidebar-close {
            display: flex !important;
          }
          .admin-topbar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
