"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAsAdmin, loginAsClient } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleHint = searchParams.get("role");
  const isAdminLogin = roleHint === "admin";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function getFirebaseError(code: string) {
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Email atau password salah.";
      case "auth/invalid-email":
        return "Format email tidak valid.";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan. Coba lagi nanti.";
      default:
        return "Terjadi kesalahan. Silakan coba lagi.";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (isAdminLogin) {
        // ── LOGIN ADMIN ──
        await loginAsAdmin(form.email, form.password);
        router.push("/admin");
      } else {
        // ── LOGIN CLIENT ──
        await loginAsClient(form.email, form.password);
        router.push("/dashboard");
      }
    } catch (err: any) {
      // error custom dari kita
      if (err.message === "NOT_ADMIN") {
        setError("Akun ini tidak memiliki akses admin.");
      } else if (err.message === "IS_ADMIN") {
        setError("Akun admin tidak bisa login di sini. Gunakan login admin.");
      } else {
        // error dari Firebase
        setError(getFirebaseError(err.code));
      }
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse at top, rgba(212,247,44,0.05) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background: isAdminLogin ? "var(--purple)" : "var(--accent)",
                borderRadius: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "18px",
                color: isAdminLogin ? "#fff" : "#08090c",
                transition: "background 0.3s",
              }}
            >
              B
            </div>
            <span
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "22px",
                color: "var(--text)",
              }}
            >
              BookYourCut
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          style={{
            padding: "36px",
            borderRadius: "var(--r-lg)",
            background: "var(--surface)",
            border: `1px solid ${isAdminLogin ? "rgba(167,139,250,0.25)" : "var(--border)"}`,
            transition: "border-color 0.3s",
          }}
        >
          {isAdminLogin && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "100px",
                background: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.25)",
                color: "var(--purple)",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              🔐 Admin Login
            </div>
          )}

          <h1
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontSize: "24px",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              marginBottom: "6px",
            }}
          >
            {isAdminLogin ? "Masuk sebagai Admin" : "Masuk ke akun"}
          </h1>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "14px",
              marginBottom: "28px",
            }}
          >
            {isAdminLogin
              ? "Hanya administrator yang bisa mengakses halaman ini."
              : "Masukkan email dan password barber kamu."}
          </p>

          {error && (
            <div
              style={{
                padding: "11px 14px",
                borderRadius: "var(--r-sm)",
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.2)",
                color: "var(--red)",
                fontSize: "13px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚠</span> {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="nama@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                autoComplete="email"
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="Password kamu"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={inputStyle}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "var(--r-sm)",
                background: loading
                  ? "var(--surface-3)"
                  : isAdminLogin
                    ? "var(--purple)"
                    : "var(--accent)",
                color: loading
                  ? "var(--text-muted)"
                  : isAdminLogin
                    ? "#fff"
                    : "#08090c",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "4px",
                fontFamily: "inherit",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  >
                    ◌
                  </span>
                  {isAdminLogin ? "Memverifikasi..." : "Memproses..."}
                </>
              ) : (
                "Masuk →"
              )}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "12px",
            marginTop: "20px",
          }}
        >
          {isAdminLogin ? (
            <>
              Login sebagai barber?{" "}
              <Link
                href="/login"
                style={{
                  color: "var(--accent)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Klik di sini
              </Link>
            </>
          ) : (
            <>
              Admin?{" "}
              <Link
                href="/login?role=admin"
                style={{
                  color: "var(--purple)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Masuk di sini
              </Link>
            </>
          )}
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "var(--r-sm)",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};
