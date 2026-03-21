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
    { name: "Haircut", price: "Rp 50.000", duration: "30 mnt" },
    { name: "Haircut + Beard", price: "Rp 75.000", duration: "45 mnt" },
    { name: "Coloring", price: "Rp 150.000", duration: "90 mnt" },
    { name: "Keramas", price: "Rp 25.000", duration: "15 mnt" },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* ── NAV ── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 48px",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(8,9,12,0.88)",
          backdropFilter: "blur(16px)",
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
            S
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
          <span
            style={{
              padding: "3px 10px",
              borderRadius: "100px",
              background: "var(--accent-muted)",
              border: "1px solid var(--accent-border)",
              color: "var(--accent)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            for Barber
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            href="/book/alfito-barber"
            style={{
              padding: "8px 18px",
              borderRadius: "var(--r-sm)",
              color: "var(--text-dim)",
              fontSize: "14px",
              fontWeight: 500,
              border: "1px solid var(--border)",
              textDecoration: "none",
            }}
          >
            Demo Booking
          </Link>
          <Link
            href="/dashboard"
            style={{
              padding: "8px 18px",
              borderRadius: "var(--r-sm)",
              background: "var(--accent)",
              color: "#08090c",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Buka Dashboard →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          padding: "110px 48px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              marginBottom: "28px",
            }}
          >
            ✂️ Sistem Booking untuk Barber Shop
          </div>

          <h1
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontSize: "clamp(44px, 7vw, 82px)",
              fontWeight: 900,
              lineHeight: 1.02,
              marginBottom: "24px",
              letterSpacing: "-2px",
            }}
          >
            Booking barber jadi mudah,
            <br />
            <span style={{ color: "var(--accent)" }}>reminder otomatis.</span>
          </h1>

          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "18px",
              lineHeight: 1.7,
              maxWidth: "520px",
              margin: "0 auto 44px",
            }}
          >
            Buat halaman booking barbermu dalam menit. Pelanggan pilih jadwal
            potong, sistem kirim reminder otomatis via WhatsApp.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/dashboard"
              style={{
                padding: "14px 32px",
                borderRadius: "var(--r-sm)",
                background: "var(--accent)",
                color: "#08090c",
                fontSize: "15px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Daftarkan Barber Kamu →
            </Link>
            <Link
              href="/book/alfito-barber"
              style={{
                padding: "14px 32px",
                borderRadius: "var(--r-sm)",
                border: "1px solid var(--border)",
                color: "var(--text-dim)",
                fontSize: "15px",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              ▶ Coba Demo Booking
            </Link>
          </div>
        </div>

        {/* URL preview */}
        <div
          className="anim-fade-up delay-3"
          style={{ marginTop: "56px", display: "inline-block" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              borderRadius: "var(--r-sm)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              fontFamily: "monospace",
              fontSize: "13px",
            }}
          >
            <span style={{ color: "var(--text-muted)" }}>
              bookyourcut.app/book/
            </span>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>
              nama-barber-kamu
              <span
                style={{
                  animation: "blink 1s step-end infinite",
                  marginLeft: "1px",
                }}
              >
                |
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* ── LAYANAN PREVIEW ── */}
      <section
        style={{
          padding: "0 48px 80px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          Contoh Layanan yang Bisa Kamu Tambahkan
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
            gap: "10px",
          }}
        >
          {services.map((s, i) => {
            const colors = ["#d4f72c", "#60a5fa", "#a78bfa", "#f97316"];
            return (
              <div
                key={i}
                style={{
                  padding: "16px 18px",
                  borderRadius: "var(--r)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "3px",
                    background: colors[i],
                    borderRadius: "3px 0 0 3px",
                  }}
                />
                <div style={{ paddingLeft: "8px" }}>
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
                      color: colors[i],
                    }}
                  >
                    {s.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        style={{
          padding: "80px 48px",
          borderTop: "1px solid var(--border)",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "var(--accent)",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          Cara Kerja
        </p>
        <h2
          style={{
            fontFamily: "Cabinet Grotesk, sans-serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 800,
            marginBottom: "56px",
            letterSpacing: "-1px",
          }}
        >
          Setup dalam 5 menit.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1px",
            background: "var(--border)",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}
        >
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
      <section
        style={{
          padding: "80px 48px",
          borderTop: "1px solid var(--border)",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "var(--accent)",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          Fitur
        </p>
        <h2
          style={{
            fontFamily: "Cabinet Grotesk, sans-serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 800,
            marginBottom: "56px",
            letterSpacing: "-1px",
          }}
        >
          Semua yang barber kamu butuhkan.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "28px",
                borderRadius: "var(--r)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
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
      <section
        style={{
          padding: "80px 48px",
          borderTop: "1px solid var(--border)",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "var(--accent)",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          Masalah yang Kami Selesaikan
        </p>
        <h2
          style={{
            fontFamily: "Cabinet Grotesk, sans-serif",
            fontSize: "clamp(24px, 3.5vw, 38px)",
            fontWeight: 800,
            marginBottom: "40px",
            letterSpacing: "-1px",
          }}
        >
          Capek ngatur jadwal manual lewat WA?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {[
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
          ].map((p, i) => (
            <div
              key={i}
              style={{
                padding: "20px",
                borderRadius: "var(--r)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: "rgba(244,63,94,0.1)",
                    border: "1px solid rgba(244,63,94,0.2)",
                    color: "var(--red)",
                    fontSize: "11px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  Sebelum
                </span>
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
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: "rgba(212,247,44,0.1)",
                    border: "1px solid rgba(212,247,44,0.2)",
                    color: "var(--accent)",
                    fontSize: "11px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  Sesudah
                </span>
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
      <section
        style={{
          padding: "100px 48px 120px",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
        <h2
          style={{
            fontFamily: "Cabinet Grotesk, sans-serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 900,
            letterSpacing: "-2px",
            marginBottom: "16px",
          }}
        >
          Siap digitalkan barbermu?
        </h2>
        <p
          style={{
            color: "var(--text-dim)",
            marginBottom: "36px",
            fontSize: "16px",
            maxWidth: "400px",
            margin: "0 auto 36px",
          }}
        >
          Bergabung dengan ratusan barber yang sudah pakai BookYourCut untuk
          kelola jadwal mereka.
        </p>
        <Link
          href="/dashboard"
          style={{
            padding: "16px 40px",
            borderRadius: "var(--r-sm)",
            background: "var(--accent)",
            color: "#08090c",
            fontSize: "16px",
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Daftarkan Barber Kamu →
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
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
            S
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

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (max-width: 768px) {
          nav { padding: 14px 20px !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
          footer { padding: 20px !important; }
        }
        @media (max-width: 600px) {
          .pain-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
