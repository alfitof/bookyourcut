"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!form.businessName.trim()) return "Nama barber wajib diisi.";
    if (!form.email.trim()) return "Email wajib diisi.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(form.email)) return "Format email tidak valid.";
    if (form.password.length < 6) return "Password minimal 6 karakter.";
    if (form.password !== form.confirm)
      return "Konfirmasi password tidak cocok.";
    return null;
  }

  function getErrorMessage(code: string) {
    switch (code) {
      case "auth/email-already-in-use":
        return "Email sudah terdaftar. Silakan login.";
      case "auth/invalid-email":
        return "Format email tidak valid.";
      case "auth/weak-password":
        return "Password terlalu lemah. Gunakan minimal 6 karakter.";
      default:
        return "Terjadi kesalahan. Silakan coba lagi.";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await registerUser(form.email, form.password, form.businessName);
      router.push("/dashboard");
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength = () => {
    if (form.password.length === 0) return null;
    if (form.password.length < 6)
      return { label: "Lemah", color: "var(--red)", width: "33%" };
    if (form.password.length < 10)
      return { label: "Sedang", color: "var(--orange)", width: "66%" };
    return { label: "Kuat", color: "#22c55e", width: "100%" };
  };
  const strength = passwordStrength();

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
      {/* bg glow */}
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

      <div style={{ width: "100%", maxWidth: "440px" }}>
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
                background: "var(--accent)",
                borderRadius: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 900,
                fontSize: "18px",
                color: "#08090c",
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
            border: "1px solid var(--border)",
          }}
        >
          <h1
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontSize: "24px",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              marginBottom: "6px",
            }}
          >
            Daftarkan barbermu
          </h1>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "14px",
              marginBottom: "28px",
            }}
          >
            Sudah punya akun?{" "}
            <Link
              href="/login"
              style={{
                color: "var(--accent)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Masuk di sini
            </Link>
          </p>

          {/* Error */}
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
            {/* Nama Barber */}
            <div>
              <label style={labelStyle}>Nama Barber Shop *</label>
              <input
                type="text"
                placeholder="cth: Alfito Barber"
                value={form.businessName}
                onChange={(e) =>
                  setForm({ ...form, businessName: e.target.value })
                }
                style={inputStyle}
                autoComplete="organization"
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                placeholder="nama@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password *</label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={inputStyle}
                autoComplete="new-password"
              />
              {/* Strength bar */}
              {strength && (
                <div style={{ marginTop: "8px" }}>
                  <div
                    style={{
                      height: "3px",
                      background: "var(--surface-3)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: strength.width,
                        background: strength.color,
                        borderRadius: "2px",
                        transition: "width 0.3s ease, background 0.3s ease",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      color: strength.color,
                      fontSize: "11px",
                      marginTop: "4px",
                      fontWeight: 600,
                    }}
                  >
                    Password {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label style={labelStyle}>Konfirmasi Password *</label>
              <input
                type="password"
                placeholder="Ulangi password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                style={{
                  ...inputStyle,
                  border:
                    form.confirm && form.confirm !== form.password
                      ? "1px solid rgba(244,63,94,0.6)"
                      : "1px solid var(--border)",
                }}
                autoComplete="new-password"
              />
              {form.confirm && form.confirm !== form.password && (
                <p
                  style={{
                    color: "var(--red)",
                    fontSize: "12px",
                    marginTop: "5px",
                  }}
                >
                  Password tidak cocok
                </p>
              )}
              {form.confirm &&
                form.confirm === form.password &&
                form.password.length >= 6 && (
                  <p
                    style={{
                      color: "#22c55e",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    ✓ Password cocok
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "var(--r-sm)",
                background: loading ? "var(--surface-3)" : "var(--accent)",
                color: loading ? "var(--text-muted)" : "#08090c",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
                transition: "all 0.15s",
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
                  Membuat akun...
                </>
              ) : (
                "Buat Akun Gratis →"
              )}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "12px",
            marginTop: "24px",
          }}
        >
          Dengan mendaftar, kamu menyetujui{" "}
          <span style={{ color: "var(--text-dim)" }}>Syarat & Ketentuan</span>{" "}
          dan{" "}
          <span style={{ color: "var(--text-dim)" }}>Kebijakan Privasi</span>
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
