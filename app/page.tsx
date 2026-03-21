import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      icon: "⚡",
      title: "Booking Tanpa Login",
      desc: "Customer cukup buka link barbermu dan langsung pilih jadwal. Zero friction.",
    },
    {
      icon: "🔔",
      title: "Reminder Otomatis",
      desc: "Sistem kirim WhatsApp & email H-1 hari dan H-1 jam sebelum jadwal potong.",
    },
    {
      icon: "🗓️",
      title: "Jadwal Fleksibel",
      desc: "Set jam buka per hari, libur nasional, tanpa tabrakan jadwal antar customer.",
    },
    {
      icon: "🔗",
      title: "Link Personal",
      desc: "bookyourcut.app/book/nama-barber — bagikan ke IG, WA, atau linktree kamu.",
    },
    {
      icon: "📊",
      title: "Dashboard Lengkap",
      desc: "Pantau semua booking, omzet, dan layanan terlaris dalam satu layar.",
    },
    {
      icon: "🛡️",
      title: "Anti Double Booking",
      desc: "Sistem otomatis blokir slot yang sudah penuh. Tidak ada lagi tabrakan jadwal.",
    },
  ];

  const steps = [
    {
      n: "01",
      title: "Daftar & setup barber",
      desc: "Isi nama barber, layanan (haircut, coloring, dll), dan jam buka kamu.",
    },
    {
      n: "02",
      title: "Bagikan link booking",
      desc: "Kirim link personalmu ke pelanggan via WA, IG Story, atau bio.",
    },
    {
      n: "03",
      title: "Terima booking masuk",
      desc: "Pelanggan pilih layanan, tanggal & jam, isi nama & WA — selesai.",
    },
    {
      n: "04",
      title: "Reminder jalan otomatis",
      desc: "Sistem kirim reminder ke pelanggan tanpa kamu perlu melakukan apa-apa.",
    },
  ];

  const services = [
    {
      name: "Haircut",
      price: "Rp 50.000",
      duration: "30 mnt",
      color: "#d4f72c",
    },
    {
      name: "Haircut + Beard",
      price: "Rp 75.000",
      duration: "45 mnt",
      color: "#60a5fa",
    },
    {
      name: "Coloring",
      price: "Rp 150.000",
      duration: "90 mnt",
      color: "#a78bfa",
    },
    {
      name: "Keramas",
      price: "Rp 25.000",
      duration: "15 mnt",
      color: "#f97316",
    },
  ];

  const painPoints = [
    {
      before: "Pelanggan chat WA satu-satu untuk booking",
      after: "Pelanggan booking sendiri via link",
    },
    {
      before: "Lupa ingatkan pelanggan sebelum jadwal",
      after: "Reminder otomatis H-1 hari & H-1 jam",
    },
    {
      before: "Jadwal bentrok karena double booking",
      after: "Sistem otomatis blokir slot penuh",
    },
    {
      before: "Tidak tahu berapa omzet bulan ini",
      after: "Dashboard real-time semua statistik",
    },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* ── NAV ── */}
      <nav className="landing-nav">
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
              flexShrink: 0,
            }}
          >
            B
          </div>
          <span
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "20px",
            }}
          >
            BookYourCut
          </span>
          <span className="nav-badge">✂️ for Barber</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/book/alfito-barber" className="nav-link-ghost">
            Demo
          </Link>
          <Link href="/dashboard" className="nav-link-accent">
            Dashboard →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section">
        {/* bg glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "500px",
            background:
              "radial-gradient(ellipse at top, rgba(212,247,44,0.06) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        {/* grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.25,
            pointerEvents: "none",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 50% 0%, black 0%, transparent 100%)",
          }}
        />

        <div className="anim-fade-up" style={{ position: "relative" }}>
          <div className="hero-badge">✂️ Sistem Booking untuk Barber Shop</div>

          <h1 className="hero-title">
            Booking barber jadi mudah,
            <br className="hero-br" />
            <span style={{ color: "var(--accent)" }}>reminder otomatis.</span>
          </h1>

          <p className="hero-desc">
            Buat halaman booking barbermu dalam menit. Pelanggan pilih jadwal
            potong, sistem kirim reminder otomatis via WhatsApp.
          </p>

          <div className="hero-cta-group">
            <Link href="/dashboard" className="btn-accent">
              Daftarkan Barber Kamu →
            </Link>
            <Link href="/book/alfito-barber" className="btn-ghost">
              ▶ Coba Demo Booking
            </Link>
          </div>
        </div>

        {/* URL preview */}
        <div className="anim-fade-up delay-3" style={{ marginTop: "48px" }}>
          <div className="url-preview">
            <span style={{ color: "var(--text-muted)" }}>
              bookyourcut.app/book/
            </span>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>
              nama-barber-kamu
              <span className="cursor-blink">|</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── LAYANAN PREVIEW ── */}
      <section className="section-pad">
        <p className="section-overline">Contoh Layanan yang Bisa Ditambahkan</p>
        <div className="services-preview-grid">
          {services.map((s) => (
            <div key={s.name} className="service-preview-card">
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  background: s.color,
                  borderRadius: "3px 0 0 3px",
                }}
              />
              <div style={{ paddingLeft: "10px" }}>
                <p
                  style={{
                    fontFamily: "Cabinet Grotesk, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    marginBottom: "4px",
                  }}
                >
                  {s.name}
                </p>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    marginBottom: "8px",
                  }}
                >
                  ⏱ {s.duration}
                </p>
                <p
                  style={{
                    fontFamily: "Cabinet Grotesk, sans-serif",
                    fontWeight: 800,
                    fontSize: "16px",
                    color: s.color,
                  }}
                >
                  {s.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-pad section-border">
        <p className="section-label">Cara Kerja</p>
        <h2 className="section-title">Setup dalam 5 menit.</h2>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div
              key={i}
              style={{ padding: "32px 28px", background: "var(--surface)" }}
            >
              <div
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  fontSize: "40px",
                  fontWeight: 900,
                  color: "var(--border-light)",
                  marginBottom: "16px",
                  lineHeight: 1,
                }}
              >
                {s.n}
              </div>
              <h3
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  fontSize: "17px",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  color: "var(--text-dim)",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section-pad section-border">
        <p className="section-label">Fitur</p>
        <h2 className="section-title">Semua yang barber kamu butuhkan.</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--surface-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  marginBottom: "16px",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: "var(--text-dim)",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PAIN POINTS ── */}
      <section className="section-pad section-border">
        <p className="section-label">Masalah yang Kami Selesaikan</p>
        <h2 className="section-title">Capek ngatur jadwal manual lewat WA?</h2>
        <div className="pain-grid">
          {painPoints.map((p, i) => (
            <div key={i} className="pain-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <span className="badge-before">Sebelum</span>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  {p.before}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <span className="badge-after">Sesudah</span>
                <p
                  style={{
                    color: "var(--text)",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {p.after}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse at bottom, rgba(212,247,44,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "100px",
            border: "1px solid var(--accent-border)",
            background: "var(--accent-muted)",
            color: "var(--accent)",
            fontSize: "12px",
            fontWeight: 600,
            marginBottom: "24px",
          }}
        >
          ✂️ Gratis · Setup 5 Menit · Tanpa Kartu Kredit
        </div>
        <h2 className="cta-title">Siap digitalkan barbermu?</h2>
        <p className="cta-desc">
          Bergabung dengan ratusan barber yang sudah pakai BookYourCut untuk
          kelola jadwal mereka.
        </p>
        <Link href="/dashboard" className="btn-accent">
          Daftarkan Barber Kamu →
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              background: "var(--accent)",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 900,
              fontSize: "11px",
              color: "#08090c",
            }}
          >
            B
          </div>
          <span
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "15px",
            }}
          >
            BookYourCut
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            · for Barber
          </span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          © 2025 BookYourCut · Dibuat untuk barber Indonesia 🇮🇩
        </p>
      </footer>

      {/* ── ALL RESPONSIVE STYLES ── */}
      <style>{`

        /* ── NAV ── */
        .landing-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 48px;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(8,9,12,0.88);
          backdrop-filter: blur(16px);
          gap: 12px;
        }
        .nav-badge {
          padding: 3px 10px;
          border-radius: 100px;
          background: var(--accent-muted);
          border: 1px solid var(--accent-border);
          color: var(--accent);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .nav-link-ghost {
          padding: 8px 16px;
          border-radius: var(--r-sm);
          color: var(--text-dim);
          font-size: 14px;
          font-weight: 500;
          border: 1px solid var(--border);
          text-decoration: none;
          white-space: nowrap;
        }
        .nav-link-accent {
          padding: 8px 18px;
          border-radius: var(--r-sm);
          background: var(--accent);
          color: #08090c;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
        }

        /* ── HERO ── */
        .hero-section {
          padding: 110px 48px 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid var(--accent-border);
          background: var(--accent-muted);
          color: var(--accent);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .hero-title {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: clamp(36px, 6vw, 80px);
          font-weight: 900;
          line-height: 1.02;
          margin-bottom: 24px;
          letter-spacing: -2px;
        }
        .hero-br { display: block; }
        .hero-desc {
          color: var(--text-dim);
          font-size: 18px;
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto 44px;
        }
        .hero-cta-group {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ── BUTTONS ── */
        .btn-accent {
          padding: 14px 32px;
          border-radius: var(--r-sm);
          background: var(--accent);
          color: #08090c;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          white-space: nowrap;
        }
        .btn-ghost {
          padding: 14px 32px;
          border-radius: var(--r-sm);
          border: 1px solid var(--border);
          color: var(--text-dim);
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          white-space: nowrap;
        }

        /* ── URL PREVIEW ── */
        .url-preview {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border-radius: var(--r-sm);
          background: var(--surface);
          border: 1px solid var(--border);
          font-family: monospace;
          font-size: 13px;
        }
        .cursor-blink {
          animation: blink 1s step-end infinite;
          margin-left: 1px;
        }

        /* ── SECTIONS ── */
        .section-pad {
          padding: 80px 48px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-border {
          border-top: 1px solid var(--border);
        }
        .section-overline {
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          text-align: center;
          margin-bottom: 20px;
        }
        .section-label {
          color: var(--accent);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: clamp(26px, 4vw, 44px);
          font-weight: 800;
          margin-bottom: 48px;
          letter-spacing: -1px;
        }

        /* ── SERVICES PREVIEW ── */
        .services-preview-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .service-preview-card {
          padding: 16px 18px;
          border-radius: var(--r);
          background: var(--surface);
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }

        /* ── STEPS ── */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border);
          border-radius: var(--r-lg);
          overflow: hidden;
          border: 1px solid var(--border);
        }

        /* ── FEATURES ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .feature-card {
          padding: 28px;
          border-radius: var(--r);
          background: var(--surface);
          border: 1px solid var(--border);
        }

        /* ── PAIN POINTS ── */
        .pain-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .pain-card {
          padding: 20px;
          border-radius: var(--r);
          background: var(--surface);
          border: 1px solid var(--border);
        }
        .badge-before {
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(244,63,94,0.1);
          border: 1px solid rgba(244,63,94,0.2);
          color: var(--red);
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .badge-after {
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(212,247,44,0.1);
          border: 1px solid rgba(212,247,44,0.2);
          color: var(--accent);
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
          white-space: nowrap;
        }

        /* ── CTA ── */
        .cta-section {
          padding: 100px 48px 120px;
          text-align: center;
          border-top: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .cta-title {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: clamp(28px, 5vw, 56px);
          font-weight: 900;
          letter-spacing: -2px;
          margin-bottom: 16px;
        }
        .cta-desc {
          color: var(--text-dim);
          margin-bottom: 36px;
          font-size: 16px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        /* ── FOOTER ── */
        .landing-footer {
          border-top: 1px solid var(--border);
          padding: 24px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        /* ── ANIMATIONS ── */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* ════════════════════════════
           RESPONSIVE BREAKPOINTS
        ════════════════════════════ */

        /* Tablet landscape — 1024px */
        @media (max-width: 1024px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .services-preview-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Tablet portrait — 768px */
        @media (max-width: 768px) {
          .landing-nav {
            padding: 14px 20px;
          }
          .nav-badge {
            display: none;
          }
          .hero-section {
            padding: 72px 24px 60px;
          }
          .hero-title {
            letter-spacing: -1px;
          }
          .hero-desc {
            font-size: 16px;
          }
          .section-pad {
            padding: 56px 24px;
          }
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .pain-grid {
            grid-template-columns: 1fr;
          }
          .cta-section {
            padding: 72px 24px 80px;
          }
          .landing-footer {
            padding: 20px 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }

        /* Mobile — 480px */
        @media (max-width: 480px) {
          .landing-nav {
            padding: 12px 16px;
          }
          .nav-link-ghost {
            display: none;
          }
          .nav-link-accent {
            padding: 8px 14px;
            font-size: 13px;
          }
          .hero-section {
            padding: 56px 16px 48px;
          }
          .hero-badge {
            font-size: 11px;
            padding: 5px 12px;
          }
          .hero-br {
            display: none;
          }
          .hero-desc {
            font-size: 15px;
            margin-bottom: 32px;
          }
          .hero-cta-group {
            flex-direction: column;
            align-items: center;
          }
          .btn-accent, .btn-ghost {
            width: 100%;
            text-align: center;
            padding: 13px 24px;
          }
          .url-preview {
            font-size: 12px;
            padding: 9px 14px;
          }
          .section-pad {
            padding: 48px 16px;
          }
          .section-title {
            margin-bottom: 32px;
          }
          .services-preview-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .steps-grid {
            grid-template-columns: 1fr;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .pain-grid {
            grid-template-columns: 1fr;
          }
          .cta-section {
            padding: 56px 16px 72px;
          }
          .landing-footer {
            padding: 20px 16px;
          }
        }

        /* Very small — 360px */
        @media (max-width: 360px) {
          .services-preview-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
