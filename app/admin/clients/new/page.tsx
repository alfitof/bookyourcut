"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/admin";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Eye,
  EyeOff,
  Zap,
  Building2,
  KeyRound,
  Star,
} from "lucide-react";

const STEPS = [
  { n: 1, label: "Identitas", icon: Building2, desc: "Info barber shop" },
  { n: 2, label: "Akun Login", icon: KeyRound, desc: "Email & password" },
  { n: 3, label: "Plan", icon: Star, desc: "Pilih paket" },
];

export default function NewClientPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [copied, setCopied] = useState<"password" | "all" | null>(null);

  const [form, setForm] = useState({
    businessName: "",
    phone: "",
    slug: "",
    email: "",
    password: "",
    plan: "free" as "free" | "pro",
  });

  const [createdData, setCreatedData] = useState<{
    businessName: string;
    email: string;
    password: string;
    slug: string;
  } | null>(null);

  // ── helpers ──
  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  function generatePassword() {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
    let pw = "";
    for (let i = 0; i < 12; i++)
      pw += chars[Math.floor(Math.random() * chars.length)];
    setForm((f) => ({ ...f, password: pw }));
  }

  function handleCopy(type: "password" | "all") {
    if (!createdData) return;
    const text =
      type === "password"
        ? createdData.password
        : `Barber   : ${createdData.businessName}\nEmail    : ${createdData.email}\nPassword : ${createdData.password}\nBooking  : https://bookyourcut.alfitofebriansyah.blog/${createdData.slug}\nLogin    : https://bookyourcut.app/login`;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  // ── validation per step ──
  function validateStep(s: number): string | null {
    if (s === 1) {
      if (!form.businessName.trim()) return "Nama barber wajib diisi.";
      if (!form.phone.trim()) return "Nomor WhatsApp wajib diisi.";
      if (!form.slug.trim()) return "Link booking wajib diisi.";
    }
    if (s === 2) {
      if (!form.email.trim()) return "Email wajib diisi.";
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!re.test(form.email)) return "Format email tidak valid.";
      if (form.password.length < 6) return "Password minimal 6 karakter.";
    }
    return null;
  }

  function handleNext() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep((s) => s + 1);
  }

  function handleBack() {
    setError("");
    setStep((s) => s - 1);
  }

  function getErrorMessage(code: string) {
    switch (code) {
      case "auth/email-already-in-use":
        return "Email sudah terdaftar.";
      case "auth/invalid-email":
        return "Format email tidak valid.";
      case "auth/weak-password":
        return "Password terlalu lemah.";
      default:
        return "Terjadi kesalahan. Coba lagi.";
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      await createClient(form);
      setCreatedData({
        businessName: form.businessName,
        email: form.email,
        password: form.password,
        slug: form.slug,
      });
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      setLoading(false);
    }
  }

  const canNext: Record<number, boolean> = {
    1:
      form.businessName.trim() !== "" &&
      form.phone.trim() !== "" &&
      form.slug.trim() !== "",
    2: form.email.trim() !== "" && form.password.length >= 6,
    3: true,
  };

  // ────────────────────────────────────────────────
  // SUCCESS SCREEN
  // ────────────────────────────────────────────────
  if (createdData) {
    return (
      <div className="ncp-page">
        <div className="ncp-success-wrap">
          {/* Top */}
          <div className="ncp-success-top">
            <div className="ncp-success-check">✅</div>
            <div>
              <h2 className="ncp-success-h2">Client berhasil ditambahkan!</h2>
              <p className="ncp-success-sub">
                Kirimkan kredensial di bawah ke client melalui WhatsApp atau
                email.
              </p>
            </div>
          </div>

          {/* Creds grid */}
          <div className="ncp-creds-grid">
            {[
              { label: "Nama Barber", value: createdData.businessName },
              {
                label: "Link Booking",
                value: `bookyourcut.alfitofebriansyah.blog/${createdData.slug}`,
                mono: true,
                color: "var(--purple)",
              },
              { label: "Email Login", value: createdData.email, mono: true },
            ].map((item) => (
              <div key={item.label} className="ncp-cred-block">
                <p className="ncp-cred-block-label">{item.label}</p>
                <p
                  className="ncp-cred-block-value"
                  style={{
                    fontFamily: item.mono ? "monospace" : "inherit",
                    color: item.color ?? "var(--text)",
                    fontSize: item.mono ? "13px" : "14px",
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}

            {/* Password — full width */}
            <div className="ncp-cred-block ncp-cred-password">
              <p className="ncp-cred-block-label">Password</p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "4px",
                }}
              >
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "var(--accent)",
                    flex: 1,
                    letterSpacing: showPass ? "1px" : "6px",
                    wordBreak: "break-all",
                  }}
                >
                  {showPass
                    ? createdData.password
                    : "•".repeat(createdData.password.length)}
                </p>
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="ncp-icon-btn"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
                <button
                  onClick={() => handleCopy("password")}
                  className={`ncp-copy-btn ${copied === "password" ? "ncp-copied" : ""}`}
                >
                  {copied === "password" ? (
                    <Check size={13} />
                  ) : (
                    <Copy size={13} />
                  )}
                  {copied === "password" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="ncp-warning">
            <span style={{ flexShrink: 0 }}>⚠️</span>
            <p>
              Password hanya ditampilkan sekali. Setelah meninggalkan halaman
              ini, password tidak bisa dilihat lagi.
            </p>
          </div>

          {/* Actions */}
          <div className="ncp-success-actions">
            <button
              onClick={() => handleCopy("all")}
              className={`ncp-btn-outline ${copied === "all" ? "ncp-btn-outline-copied" : ""}`}
            >
              {copied === "all" ? <Check size={14} /> : <Copy size={14} />}
              {copied === "all" ? "Tersalin!" : "Copy Semua Kredensial"}
            </button>
            <button
              onClick={() => router.push("/admin/clients")}
              className="ncp-btn-purple"
            >
              Ke Halaman Clients →
            </button>
            <button
              onClick={() => {
                setCreatedData(null);
                setForm({
                  businessName: "",
                  phone: "",
                  slug: "",
                  email: "",
                  password: "",
                  plan: "free",
                });
                setStep(1);
                setShowPass(false);
              }}
              className="ncp-btn-ghost"
            >
              + Tambah Client Lain
            </button>
          </div>
        </div>

        <style>{ncp_styles}</style>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // FORM — WIZARD
  // ────────────────────────────────────────────────
  return (
    <div className="ncp-page">
      {/* Back nav */}
      <Link href="/admin/clients" className="ncp-back-link">
        <ArrowLeft size={14} /> Kembali ke Clients
      </Link>

      {/* Page heading */}
      <div className="ncp-heading">
        <h1 className="ncp-h1">Tambah Client Baru</h1>
        <p className="ncp-h1-sub">
          Daftarkan barber baru ke sistem BookYourCut.
        </p>
      </div>

      {/* ── STEPPER ── */}
      <div className="ncp-stepper">
        {STEPS.map((s, i) => {
          const done = step > s.n;
          const current = step === s.n;
          const Icon = s.icon;
          return (
            <div key={s.n} className="ncp-stepper-outer">
              {/* connector sebelum item, kecuali pertama */}
              {i > 0 && (
                <div
                  className="ncp-step-connector"
                  style={{
                    background: step >= s.n ? "var(--purple)" : "var(--border)",
                  }}
                />
              )}

              <div className="ncp-stepper-item">
                <div
                  className={`ncp-step-circle ${
                    current ? "ncp-step-current" : done ? "ncp-step-done" : ""
                  }`}
                >
                  {done ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <Icon size={16} strokeWidth={current ? 2.5 : 1.8} />
                  )}
                </div>
                <div className="ncp-step-meta">
                  <p
                    className={`ncp-step-label ${current ? "ncp-step-label-active" : ""}`}
                  >
                    {s.label}
                  </p>
                  <p className="ncp-step-desc">{s.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* ── STEP CONTENT ── */}
      <div className="ncp-card">
        {/* Error */}
        {error && (
          <div className="ncp-error">
            <span>⚠</span> {error}
          </div>
        )}

        {/* ── STEP 1: Identitas ── */}
        {step === 1 && (
          <div className="ncp-step-content anim-fade-up">
            <div className="ncp-step-header">
              <div
                className="ncp-step-header-icon"
                style={{
                  background: "rgba(167,139,250,0.1)",
                  color: "var(--purple)",
                }}
              >
                <Building2 size={22} />
              </div>
              <div>
                <h3 className="ncp-step-h3">Identitas Bisnis</h3>
                <p className="ncp-step-h3-sub">
                  Informasi dasar barber shop yang akan didaftarkan.
                </p>
              </div>
            </div>

            <div className="ncp-fields-grid">
              <div className="ncp-field-full">
                <label style={labelStyle}>Nama Barber Shop *</label>
                <input
                  type="text"
                  placeholder="cth: Alfito Barber Studio"
                  value={form.businessName}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm({
                      ...form,
                      businessName: name,
                      slug: generateSlug(name),
                    });
                  }}
                  style={inputStyle}
                  autoFocus
                />
              </div>

              <div className="ncp-field-full">
                <label style={labelStyle}>Link Booking *</label>
                <div className="ncp-slug-wrap">
                  <span className="ncp-slug-prefix">
                    bookyourcut.alfitofebriansyah.blog/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, ""),
                      })
                    }
                    style={{
                      flex: 1,
                      padding: "11px 12px",
                      background: "var(--surface-2)",
                      border: "none",
                      color: "var(--accent)",
                      fontSize: "14px",
                      fontWeight: 600,
                      outline: "none",
                      fontFamily: "monospace",
                      minWidth: 0,
                    }}
                  />
                </div>
                {form.slug && (
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      marginTop: "6px",
                    }}
                  >
                    Preview:{" "}
                    <span style={{ color: "var(--purple)" }}>
                      bookyourcut.alfitofebriansyah.blog/{form.slug}
                    </span>
                  </p>
                )}
              </div>

              <div className="ncp-field-full">
                <label style={labelStyle}>Nomor WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="cth: 08123456789"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Akun Login ── */}
        {step === 2 && (
          <div className="ncp-step-content anim-fade-up">
            <div className="ncp-step-header">
              <div
                className="ncp-step-header-icon"
                style={{
                  background: "rgba(212,247,44,0.08)",
                  color: "var(--accent)",
                }}
              >
                <KeyRound size={22} />
              </div>
              <div>
                <h3 className="ncp-step-h3">Akun Login</h3>
                <p className="ncp-step-h3-sub">
                  Kredensial yang akan digunakan client untuk masuk ke
                  dashboard.
                </p>
              </div>
            </div>

            <div className="ncp-fields-grid">
              <div className="ncp-field-full">
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  placeholder="nama@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  autoFocus
                />
              </div>

              <div className="ncp-field-full">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label style={{ ...labelStyle, marginBottom: 0 }}>
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "var(--accent-muted)",
                      border: "1px solid var(--accent-border)",
                      borderRadius: "6px",
                      color: "var(--accent)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: "4px 12px",
                      fontFamily: "inherit",
                    }}
                  >
                    <Zap size={12} /> Generate Otomatis
                  </button>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="no-browser-eye"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      flexShrink: 0,
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--surface-3)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--r-sm)",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength bar */}
                {form.password.length > 0 &&
                  (() => {
                    const len = form.password.length;
                    const strength =
                      len < 6
                        ? { label: "Lemah", color: "var(--red)", w: "33%" }
                        : len < 10
                          ? {
                              label: "Sedang",
                              color: "var(--orange)",
                              w: "66%",
                            }
                          : { label: "Kuat", color: "#22c55e", w: "100%" };
                    return (
                      <div style={{ marginTop: "10px" }}>
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
                              width: strength.w,
                              background: strength.color,
                              transition: "all 0.3s ease",
                              borderRadius: "2px",
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
                    );
                  })()}

                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    marginTop: "8px",
                    lineHeight: 1.5,
                  }}
                >
                  💡 Gunakan tombol "Generate Otomatis" untuk membuat password
                  acak yang kuat.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Plan ── */}
        {step === 3 && (
          <div className="ncp-step-content anim-fade-up">
            <div className="ncp-step-header">
              <div
                className="ncp-step-header-icon"
                style={{
                  background: "rgba(212,247,44,0.08)",
                  color: "var(--accent)",
                }}
              >
                <Star size={22} />
              </div>
              <div>
                <h3 className="ncp-step-h3">Pilih Plan</h3>
                <p className="ncp-step-h3-sub">
                  Plan bisa diubah kapan saja dari halaman clients.
                </p>
              </div>
            </div>

            <div className="ncp-plan-grid">
              {/* FREE */}
              <div
                onClick={() => setForm({ ...form, plan: "free" })}
                className={`ncp-plan-card ${form.plan === "free" ? "ncp-plan-selected" : ""}`}
              >
                <div className="ncp-plan-top">
                  <div className="ncp-plan-icon ncp-plan-icon-free">
                    <span style={{ fontSize: "20px" }}>🆓</span>
                  </div>
                  <div
                    className={`ncp-plan-radio ${form.plan === "free" ? "ncp-plan-radio-active" : ""}`}
                  >
                    {form.plan === "free" && (
                      <div className="ncp-plan-radio-dot" />
                    )}
                  </div>
                </div>
                <p
                  className="ncp-plan-name"
                  style={{
                    color:
                      form.plan === "free" ? "var(--accent)" : "var(--text)",
                  }}
                >
                  Free
                </p>
                <p className="ncp-plan-price">
                  Rp 0 <span>/bulan</span>
                </p>
                <div className="ncp-plan-features">
                  {[
                    "Halaman booking",
                    "Reminder WhatsApp",
                    "Max 50 booking/bln",
                    "1 layanan",
                  ].map((f) => (
                    <div key={f} className="ncp-plan-feature">
                      <span
                        style={{ color: "var(--accent)", fontSize: "12px" }}
                      >
                        ✓
                      </span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRO */}
              <div
                onClick={() => setForm({ ...form, plan: "pro" })}
                className={`ncp-plan-card ${form.plan === "pro" ? "ncp-plan-selected-pro" : ""}`}
              >
                <div className="ncp-plan-top">
                  <div className="ncp-plan-icon ncp-plan-icon-pro">
                    <span style={{ fontSize: "20px" }}>⭐</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: "100px",
                        background: "rgba(167,139,250,0.15)",
                        color: "var(--purple)",
                        fontSize: "10px",
                        fontWeight: 700,
                        border: "1px solid rgba(167,139,250,0.25)",
                      }}
                    >
                      POPULER
                    </span>
                    <div
                      className={`ncp-plan-radio ${form.plan === "pro" ? "ncp-plan-radio-pro-active" : ""}`}
                    >
                      {form.plan === "pro" && (
                        <div className="ncp-plan-radio-dot-pro" />
                      )}
                    </div>
                  </div>
                </div>
                <p
                  className="ncp-plan-name"
                  style={{
                    color:
                      form.plan === "pro" ? "var(--purple)" : "var(--text)",
                  }}
                >
                  Pro
                </p>
                <p className="ncp-plan-price">
                  Rp 99rb <span>/bulan</span>
                </p>
                <div className="ncp-plan-features">
                  {[
                    "Semua fitur Free",
                    "Unlimited booking",
                    "Unlimited layanan",
                    "Analytics & laporan",
                    "Priority support",
                  ].map((f) => (
                    <div key={f} className="ncp-plan-feature">
                      <span
                        style={{ color: "var(--purple)", fontSize: "12px" }}
                      >
                        ✓
                      </span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary sebelum submit */}
            <div className="ncp-summary">
              <p className="ncp-summary-title">Ringkasan Client</p>
              <div className="ncp-summary-rows">
                {[
                  { label: "Nama", value: form.businessName },
                  { label: "Slug", value: `/${form.slug}` },
                  { label: "WhatsApp", value: form.phone },
                  { label: "Email", value: form.email },
                  {
                    label: "Plan",
                    value: form.plan === "pro" ? "⭐ Pro" : "🆓 Free",
                  },
                ].map((r) => (
                  <div key={r.label} className="ncp-summary-row">
                    <span className="ncp-summary-label">{r.label}</span>
                    <span className="ncp-summary-value">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── NAVIGATION ── */}
        <div className="ncp-nav">
          {step > 1 ? (
            <button onClick={handleBack} className="ncp-btn-back">
              <ArrowLeft size={15} /> Kembali
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={!canNext[step]}
              className={`ncp-btn-next ${canNext[step] ? "" : "ncp-btn-disabled"}`}
            >
              Lanjut <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`ncp-btn-submit ${loading ? "ncp-btn-disabled" : ""}`}
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
                <>Tambah Client ✓</>
              )}
            </button>
          )}
        </div>
      </div>

      <style>{ncp_styles}</style>
    </div>
  );
}

// ── STYLES ──────────────────────────────────────────────────────
const ncp_styles = `
  .ncp-page {
    padding: 36px 40px;
    box-sizing: border-box;
    width: 100%;
  }
  .ncp-back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text-muted);
    font-size: 13px;
    text-decoration: none;
    margin-bottom: 24px;
    transition: color 0.15s;
  }
  .ncp-back-link:hover { color: var(--text); }

  .ncp-heading { margin-bottom: 36px; }
  .ncp-h1 {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 900;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }
  .ncp-h1-sub { color: var(--text-dim); font-size: 14px; }

  /* ── STEPPER ── */
.ncp-stepper {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px 28px;
  border-radius: var(--r);
  background: var(--surface);
  border: 1px solid var(--border);
  width: 100%;
  box-sizing: border-box;
}
/* wrapper per step — flex:1 agar tiap step dapat ruang sama */
.ncp-stepper-outer {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}
/* khusus item pertama tidak perlu flex:1 pada connector */
.ncp-stepper-outer:first-child {
  flex: 0 0 auto;
}
.ncp-stepper-item {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.ncp-step-connector {
  flex: 1;
  height: 2px;
  min-width: 20px;
  border-radius: 1px;
  transition: background 0.3s ease;
  margin: 0 8px;
}
.ncp-step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid var(--border);
  background: var(--surface-3);
  color: var(--text-muted);
  transition: all 0.25s;
}
.ncp-step-current {
  border-color: var(--purple);
  background: rgba(167,139,250,0.12);
  color: var(--purple);
  box-shadow: 0 0 0 4px rgba(167,139,250,0.1);
}
.ncp-step-done {
  border-color: var(--purple);
  background: var(--purple);
  color: #fff;
}
.ncp-step-meta { min-width: 0; }
.ncp-step-label {
  font-family: 'Cabinet Grotesk', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--text-muted);
  transition: color 0.2s;
  white-space: nowrap;
}
.ncp-step-label-active { color: var(--purple); }
.ncp-step-desc {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 1px;
  white-space: nowrap;
}

  /* ── CARD ── */
  .ncp-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .ncp-step-content {
    padding: 32px 36px;
    border-bottom: 1px solid var(--border);
  }
  .ncp-step-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
  }
  .ncp-step-header-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ncp-step-h3 {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 20px; font-weight: 800;
    letter-spacing: -0.3px; margin-bottom: 4px;
  }
  .ncp-step-h3-sub { color: var(--text-dim); font-size: 13px; }

  .ncp-error {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 36px;
    background: rgba(244,63,94,0.08);
    border-bottom: 1px solid rgba(244,63,94,0.15);
    color: var(--red); font-size: 13px;
  }

  .ncp-fields-grid {
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-width: 560px;
  }
  .ncp-field-full { width: 100%; }

  .ncp-slug-wrap {
    display: flex;
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    overflow: hidden;
    align-items: stretch;
  }
  .ncp-slug-prefix {
    padding: 11px 12px;
    background: var(--surface-3);
    color: var(--text-muted);
    font-size: 12px;
    border-right: 1px solid var(--border);
    white-space: nowrap;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  /* ── PLAN ── */
  .ncp-plan-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    max-width: 640px;
    margin-bottom: 28px;
  }
  .ncp-plan-card {
    padding: 22px;
    border-radius: var(--r);
    border: 2px solid var(--border);
    background: var(--surface-2);
    cursor: pointer;
    transition: all 0.18s;
  }
  .ncp-plan-card:hover { border-color: var(--border-light); }
  .ncp-plan-selected {
    border-color: var(--accent) !important;
    background: var(--accent-muted) !important;
  }
  .ncp-plan-selected-pro {
    border-color: var(--purple) !important;
    background: rgba(167,139,250,0.06) !important;
  }
  .ncp-plan-top {
    display: flex; justify-content: space-between;
    align-items: flex-start; margin-bottom: 14px;
  }
  .ncp-plan-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .ncp-plan-icon-free { background: rgba(212,247,44,0.08); }
  .ncp-plan-icon-pro  { background: rgba(167,139,250,0.1); }
  .ncp-plan-radio {
    width: 20px; height: 20px;
    border-radius: 50%;
    border: 2px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .ncp-plan-radio-active { border-color: var(--accent); background: var(--accent-muted); }
  .ncp-plan-radio-pro-active { border-color: var(--purple); background: rgba(167,139,250,0.1); }
  .ncp-plan-radio-dot {
    width: 8px; height: 8px;
    border-radius: 50%; background: var(--accent);
  }
  .ncp-plan-radio-dot-pro {
    width: 8px; height: 8px;
    border-radius: 50%; background: var(--purple);
  }
  .ncp-plan-name {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 18px; font-weight: 800;
    margin-bottom: 4px;
    transition: color 0.15s;
  }
  .ncp-plan-price {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 22px; font-weight: 900;
    color: var(--text); margin-bottom: 16px;
  }
  .ncp-plan-price span { font-size: 13px; color: var(--text-muted); font-weight: 400; }
  .ncp-plan-features { display: flex; flex-direction: column; gap: 6px; }
  .ncp-plan-feature {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: var(--text-dim);
  }

  /* ── SUMMARY ── */
  .ncp-summary {
    padding: 20px;
    border-radius: var(--r);
    background: var(--surface-2);
    border: 1px solid var(--border);
    max-width: 640px;
  }
  .ncp-summary-title {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-weight: 800; font-size: 13px;
    margin-bottom: 12px; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .ncp-summary-rows { display: flex; flex-direction: column; }
  .ncp-summary-row {
    display: flex; justify-content: space-between;
    align-items: center; padding: 8px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .ncp-summary-row:last-child { border-bottom: none; }
  .ncp-summary-label { color: var(--text-muted); }
  .ncp-summary-value { font-weight: 600; font-family: 'Cabinet Grotesk', sans-serif; }

  /* ── NAV BUTTONS ── */
  .ncp-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 36px;
  }
  .ncp-btn-back {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 20px;
    border-radius: var(--r-sm);
    background: var(--surface-3);
    border: 1px solid var(--border);
    color: var(--text-dim);
    font-size: 14px; font-weight: 500;
    cursor: pointer; font-family: inherit;
    transition: all 0.15s;
  }
  .ncp-btn-back:hover { color: var(--text); }
  .ncp-btn-next {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 24px;
    border-radius: var(--r-sm);
    background: var(--purple);
    border: none; color: #fff;
    font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: all 0.15s;
  }
  .ncp-btn-submit {
    display: flex; align-items: center; gap: 7px;
    padding: 11px 28px;
    border-radius: var(--r-sm);
    background: var(--purple);
    border: none; color: #fff;
    font-size: 15px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: all 0.15s;
  }
  .ncp-btn-disabled {
    background: var(--surface-3) !important;
    color: var(--text-muted) !important;
    cursor: not-allowed !important;
  }

  /* ── SUCCESS ── */
  .ncp-success-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
    }
  .ncp-success-top {
    display: flex; align-items: center; gap: 16px;
    padding: 28px 32px;
    border-bottom: 1px solid var(--border);
    background: rgba(34,197,94,0.03);
  }
  .ncp-success-check {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; flex-shrink: 0;
  }
  .ncp-success-h2 {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 20px; font-weight: 900;
    margin-bottom: 4px; letter-spacing: -0.3px;
  }
  .ncp-success-sub { color: var(--text-dim); font-size: 13px; }

  .ncp-creds-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border-bottom: 1px solid var(--border);
}
.ncp-cred-block {
  padding: 18px 24px;
  background: var(--surface);
}
.ncp-cred-password {
  grid-column: 1 / -1;
  background: var(--surface-2);
  padding: 18px 24px;
}
  .ncp-cred-block-label {
    color: var(--text-muted); font-size: 11px;
    text-transform: uppercase; letter-spacing: 0.5px;
    font-weight: 600; margin-bottom: 6px;
  }
  .ncp-cred-block-value {
    font-size: 14px; font-weight: 600; word-break: break-all;
  }
  .ncp-icon-btn {
    background: none; border: none;
    color: var(--text-muted); cursor: pointer;
    padding: 4px; display: flex; align-items: center;
    flex-shrink: 0; transition: color 0.15s;
  }
  .ncp-icon-btn:hover { color: var(--text); }
  .ncp-copy-btn {
    display: flex; align-items: center; gap: 4px;
    padding: 6px 12px; border-radius: 6px;
    background: var(--surface-3);
    border: 1px solid var(--border);
    color: var(--text-dim);
    font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: all 0.15s; flex-shrink: 0;
  }
  .ncp-copied {
    background: rgba(34,197,94,0.1) !important;
    border-color: rgba(34,197,94,0.25) !important;
    color: #22c55e !important;
  }
  .ncp-warning {
    display: flex; gap: 10px; align-items: flex-start;
    padding: 14px 24px;
    background: rgba(249,115,22,0.05);
    border-bottom: 1px solid rgba(249,115,22,0.15);
  }
  .ncp-warning p { color: var(--orange); font-size: 12px; line-height: 1.5; }

  .ncp-success-actions {
    display: flex; gap: 10px;
    padding: 20px 24px;
    flex-wrap: wrap;
  }
  .ncp-btn-outline {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 18px;
    border-radius: var(--r-sm);
    background: var(--surface-3);
    border: 1px solid var(--border);
    color: var(--text-dim);
    font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: all 0.15s; white-space: nowrap;
  }
  .ncp-btn-outline-copied {
    background: rgba(34,197,94,0.1) !important;
    border-color: rgba(34,197,94,0.25) !important;
    color: #22c55e !important;
  }
  .ncp-btn-purple {
    padding: 10px 20px;
    border-radius: var(--r-sm);
    background: var(--purple);
    border: none; color: #fff;
    font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    white-space: nowrap;
  }
  .ncp-btn-ghost {
    padding: 10px 18px;
    border-radius: var(--r-sm);
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 13px; font-weight: 500;
    cursor: pointer; font-family: inherit;
    transition: all 0.15s; white-space: nowrap;
  }
  .ncp-btn-ghost:hover { color: var(--text); border-color: var(--border-light); }

  /* no browser eye */
  .no-browser-eye::-ms-reveal,
  .no-browser-eye::-ms-clear { display: none !important; }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .ncp-plan-grid { grid-template-columns: 1fr 1fr; }
    .ncp-creds-grid { grid-template-columns: repeat(2, 1fr); }
    .ncp-cred-password { grid-column: 1 / -1; }
  }
  @media (max-width: 768px) {
    .ncp-page { padding: 20px 16px; }
    .ncp-stepper { padding: 16px 20px; overflow-x: auto; }
    overflow-x: auto;
  }
    .ncp-step-desc { display: none; }
    .ncp-step-content { padding: 24px 20px; }
    .ncp-nav { padding: 16px 20px; }
    .ncp-plan-grid { grid-template-columns: 1fr; max-width: 100%; }
    .ncp-fields-grid { max-width: 100%; }
    .ncp-summary { max-width: 100%; }
    .ncp-success-top { flex-direction: column; align-items: flex-start; }
    .ncp-success-actions { flex-direction: column; }
    .ncp-btn-outline, .ncp-btn-purple, .ncp-btn-ghost {
      width: 100%; justify-content: center; text-align: center;
    }
    .ncp-error { padding: 11px 20px; }
    .ncp-step-connector { min-width: 16px; margin: 0 4px; }
    .ncp-step-label { font-size: 12px; }
    .ncp-creds-grid { grid-template-columns: 1fr; }
    .ncp-cred-password { grid-column: 1; }
  }
  @media (max-width: 480px) {
    .ncp-page { padding: 16px 12px; }
    .ncp-stepper { padding: 14px 16px; }
    .ncp-step-label { font-size: 11px; }
    .ncp-step-circle { width: 30px; height: 30px; }
    .ncp-creds-grid { grid-template-columns: 1fr; }
    .ncp-cred-password { grid-column: 1; }
  }
`;

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
