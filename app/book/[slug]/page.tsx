"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import {
  getClientBySlug,
  getServices,
  getBookings,
  addPublicBooking,
  type Service,
  type Booking,
  triggerBookingReminder,
} from "@/lib/firestore";

const DEMO_SLUG = "demo-barber"; // ← slug demo tidak simpan ke DB

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const isDemo = slug === DEMO_SLUG;

  const [clientUid, setClientUid] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingInit, setLoadingInit] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [businessName, setBusinessName] = useState("");

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const SLOTS = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  // Demo services fallback
  const DEMO_SERVICES: Service[] = [
    {
      id: "1",
      name: "Haircut",
      duration: "30 mnt",
      price: "Rp 50.000",
      bookingCount: 0,
      color: "#d4f72c",
    },
    {
      id: "2",
      name: "Haircut + Beard",
      duration: "45 mnt",
      price: "Rp 75.000",
      bookingCount: 0,
      color: "#60a5fa",
    },
    {
      id: "3",
      name: "Coloring",
      duration: "90 mnt",
      price: "Rp 150.000",
      bookingCount: 0,
      color: "#a78bfa",
    },
    {
      id: "4",
      name: "Keramas",
      duration: "15 mnt",
      price: "Rp 25.000",
      bookingCount: 0,
      color: "#f97316",
    },
  ];

  useEffect(() => {
    if (isDemo) {
      setBusinessName("Demo Barber");
      setServices(DEMO_SERVICES);
      setLoadingInit(false);
      return;
    }
    // Fetch real client data
    async function init() {
      const client = await getClientBySlug(slug);
      if (!client) {
        setNotFound(true);
        setLoadingInit(false);
        return;
      }
      setClientUid(client.uid);
      setBusinessName(client.businessName);
      const [svcs, bkgs] = await Promise.all([
        getServices(client.uid),
        getBookings(client.uid),
      ]);
      setServices(svcs);
      // booked slots untuk hari ini (akan di-update saat date dipilih)
      setLoadingInit(false);
    }
    init();
  }, [slug]);

  // Update booked slots ketika tanggal berubah
  useEffect(() => {
    if (!selectedDate || !clientUid) return;
    const formatted = selectedDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    getBookings(clientUid).then((bkgs) => {
      const slots = bkgs
        .filter((b) => b.date === formatted && b.status !== "cancelled")
        .map((b) => b.time);
      setBookedSlots(slots);
    });
  }, [selectedDate, clientUid]);

  const selectedServiceData = services.find(
    (s) => s.id === selectedService || s.name === selectedService,
  );

  function isValidEmail(email: string) {
    if (!email.trim()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }

  function isValidPhone(phone: string) {
    if (!phone.trim()) return false;
    const cleaned = phone.replace(/[\s\-().]/g, "");
    return /^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(cleaned);
  }

  const canProceed: Record<number, boolean> = {
    1: selectedService !== null,
    2: selectedDate !== null && selectedSlot !== null,
    3:
      form.name.trim() !== "" &&
      isValidPhone(form.phone) &&
      isValidEmail(form.email),
  };

  async function handleSubmit() {
    if (!canProceed[3]) return;
    setSubmitting(true);

    try {
      if (isDemo) {
        // ── Demo: tidak simpan ke DB, langsung redirect ──
        router.push(`/book/${slug}/success?ref=demo_${Date.now()}`);
        return;
      }

      if (!clientUid) {
        console.error("clientUid not found");
        setSubmitting(false);
        return;
      }

      const formatted = selectedDate!.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      // ── Simpan booking ke Firestore ──
      const bookingId = await addPublicBooking(clientUid, {
        customerName: form.name,
        service: selectedServiceData?.name ?? "",
        date: formatted,
        time: selectedSlot!,
        phone: form.phone,
        email: form.email,
        note: form.note,
        status: "pending", // ← tunggu admin confirm
        duration: selectedServiceData?.duration ?? "—",
        price: selectedServiceData?.price ?? "—",
      });

      console.log("Booking created:", bookingId);

      // ── Redirect ke success ──
      router.push(`/book/${slug}/success?ref=${bookingId}`);
    } catch (err) {
      console.error("Error submitting booking:", err);
      setSubmitting(false);
    }
  }

  // ── Loading / Not Found ──
  if (loadingInit) {
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
              borderTop: "3px solid var(--accent)",
              margin: "0 auto 12px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Memuat halaman booking...
          </p>
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  if (notFound) {
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
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</p>
          <h1
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 900,
              fontSize: "24px",
              marginBottom: "10px",
            }}
          >
            Halaman Tidak Ditemukan
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>
            Link booking{" "}
            <code
              style={{
                background: "var(--surface)",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              /{slug}
            </code>{" "}
            tidak terdaftar.
          </p>
        </div>
      </div>
    );
  }

  const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  function getNext14Days() {
    const days: Date[] = [];
    const now = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      days.push(d);
    }
    return days;
  }

  const days = getNext14Days();
  const stepLabels = ["Layanan", "Jadwal", "Data Diri"];

  return (
    <div
      className="book-page"
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        paddingBottom: "80px",
      }}
    >
      {/* Demo banner */}
      {isDemo && (
        <div
          style={{
            background: "rgba(249,115,22,0.1)",
            border: "none",
            borderBottom: "1px solid rgba(249,115,22,0.2)",
            padding: "10px 24px",
            textAlign: "center",
            color: "var(--orange)",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          ⚠️ Ini adalah <strong>halaman demo</strong>. Booking tidak akan
          tersimpan.
        </div>
      )}

      {/* Top bar */}
      <div
        className="book-topbar"
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "var(--surface)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "9px",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            flexShrink: 0,
          }}
        >
          ✂️
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "16px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {businessName}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            Booking online{isDemo ? " · Demo" : ""}
          </p>
        </div>
        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  transition: "all 0.2s",
                  background:
                    step > s
                      ? "var(--accent)"
                      : step === s
                        ? "var(--accent-muted)"
                        : "var(--surface-3)",
                  border:
                    step >= s
                      ? "1px solid var(--accent-border)"
                      : "1px solid var(--border)",
                  color:
                    step > s
                      ? "#08090c"
                      : step === s
                        ? "var(--accent)"
                        : "var(--text-muted)",
                }}
              >
                {step > s ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  style={{
                    width: "24px",
                    height: "1px",
                    background: step > s ? "var(--accent)" : "var(--border)",
                    transition: "background 0.3s",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step label bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        {stepLabels.map((label, i) => {
          const s = i + 1;
          const active = step === s;
          const done = step > s;
          return (
            <div
              key={s}
              style={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: active ? 700 : 400,
                color: active
                  ? "var(--accent)"
                  : done
                    ? "var(--text-dim)"
                    : "var(--text-muted)",
                borderBottom: active
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
                transition: "all 0.2s",
                cursor: done ? "pointer" : "default",
              }}
              onClick={() => done && setStep(s)}
            >
              {done ? "✓ " : ""}
              {label}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div
        className="book-content"
        style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* STEP 1 */}
        {step === 1 && (
          <div className="anim-fade-up">
            <h2
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontSize: "22px",
                fontWeight: 900,
                marginBottom: "6px",
              }}
            >
              Pilih Layanan
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              Apa yang ingin kamu booking?
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {services.map((s) => {
                const active =
                  selectedService === s.id || selectedService === s.name;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedService(s.id)}
                    style={{
                      padding: "18px 20px",
                      borderRadius: "var(--r)",
                      background: active
                        ? "var(--accent-muted)"
                        : "var(--surface)",
                      border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "Cabinet Grotesk, sans-serif",
                          fontWeight: 700,
                          fontSize: "15px",
                          color: active ? "var(--accent)" : "var(--text)",
                          marginBottom: "4px",
                        }}
                      >
                        {s.name}
                      </p>
                      <p
                        style={{ color: "var(--text-muted)", fontSize: "13px" }}
                      >
                        ⏱ {s.duration}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Cabinet Grotesk, sans-serif",
                          fontWeight: 800,
                          fontSize: "16px",
                          color: active ? "var(--accent)" : "var(--text)",
                        }}
                      >
                        {s.price}
                      </p>
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          border: `2px solid ${active ? "var(--accent)" : "var(--border)"}`,
                          background: active ? "var(--accent)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11px",
                          color: "#08090c",
                          fontWeight: 700,
                          transition: "all 0.15s",
                          flexShrink: 0,
                        }}
                      >
                        {active && "✓"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="anim-fade-up">
            <h2
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontSize: "22px",
                fontWeight: 900,
                marginBottom: "6px",
              }}
            >
              Pilih Tanggal & Jam
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              {selectedServiceData?.name} · {selectedServiceData?.duration} ·{" "}
              {selectedServiceData?.price}
            </p>
            {/* Date */}
            <div style={{ marginBottom: "28px" }}>
              <p style={sectionLabelStyle}>Tanggal</p>
              <div
                className="date-scroll"
                style={{
                  display: "flex",
                  gap: "8px",
                  overflowX: "auto",
                  paddingBottom: "8px",
                }}
              >
                {days.map((d, i) => {
                  const isSun = d.getDay() === 0;
                  const isSelected =
                    selectedDate?.toDateString() === d.toDateString();
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (isSun) return;
                        setSelectedDate(d);
                        setSelectedSlot(null);
                      }}
                      style={{
                        flexShrink: 0,
                        width: "58px",
                        padding: "10px 8px",
                        borderRadius: "var(--r-sm)",
                        textAlign: "center",
                        cursor: isSun ? "not-allowed" : "pointer",
                        opacity: isSun ? 0.3 : 1,
                        background: isSelected
                          ? "var(--accent)"
                          : "var(--surface)",
                        border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                        transition: "all 0.15s",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: isSelected ? "#08090c" : "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "4px",
                        }}
                      >
                        {DAYS_SHORT[d.getDay()]}
                      </p>
                      <p
                        style={{
                          fontFamily: "Cabinet Grotesk, sans-serif",
                          fontWeight: 900,
                          fontSize: "20px",
                          color: isSelected ? "#08090c" : "var(--text)",
                          lineHeight: 1,
                        }}
                      >
                        {d.getDate()}
                      </p>
                      <p
                        style={{
                          fontSize: "10px",
                          color: isSelected ? "#08090c80" : "var(--text-muted)",
                          marginTop: "3px",
                        }}
                      >
                        {MONTHS[d.getMonth()]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Slots */}
            {selectedDate ? (
              <div className="anim-fade-in">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <p style={sectionLabelStyle}>Jam Tersedia</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                    {SLOTS.length - bookedSlots.length} slot kosong
                  </p>
                </div>
                <TimeSlotPicker
                  slots={SLOTS}
                  bookedSlots={bookedSlots}
                  selected={selectedSlot}
                  onSelect={setSelectedSlot}
                />
                <div
                  style={{ display: "flex", gap: "16px", marginTop: "12px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: "var(--accent)",
                      }}
                    />
                    <span
                      style={{ color: "var(--text-muted)", fontSize: "12px" }}
                    >
                      Dipilih
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: "var(--surface-3)",
                        border: "1px solid var(--border)",
                      }}
                    />
                    <span
                      style={{ color: "var(--text-muted)", fontSize: "12px" }}
                    >
                      Tersedia
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: "var(--surface-3)",
                        opacity: 0.4,
                      }}
                    />
                    <span
                      style={{ color: "var(--text-muted)", fontSize: "12px" }}
                    >
                      Sudah dibooking
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "32px",
                  borderRadius: "var(--r)",
                  background: "var(--surface)",
                  border: "1px dashed var(--border)",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "14px",
                }}
              >
                ← Pilih tanggal terlebih dahulu
              </div>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="anim-fade-up">
            <h2
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontSize: "22px",
                fontWeight: 900,
                marginBottom: "6px",
              }}
            >
              Isi Data Diri
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              Hampir selesai! Isi info kamu dulu ya.
            </p>
            {/* Summary */}
            <div
              style={{
                padding: "16px 18px",
                borderRadius: "var(--r-sm)",
                background: "var(--accent-muted)",
                border: "1px solid var(--accent-border)",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "Cabinet Grotesk, sans-serif",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "var(--accent)",
                  }}
                >
                  {selectedServiceData?.name}
                </p>
                <p style={{ color: "var(--text-dim)", fontSize: "13px" }}>
                  📅{" "}
                  {selectedDate?.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  · 🕐 {selectedSlot}
                </p>
              </div>
              <p
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  fontWeight: 900,
                  fontSize: "18px",
                  color: "var(--accent)",
                  flexShrink: 0,
                  marginLeft: "12px",
                }}
              >
                {selectedServiceData?.price}
              </p>
            </div>
            {/* Form */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label style={formLabelStyle}>
                  Nama Lengkap <span style={{ color: "var(--red)" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="cth: Budi Santoso"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={formInputStyle}
                />
              </div>
              <div>
                <label style={formLabelStyle}>
                  Nomor WhatsApp <span style={{ color: "var(--red)" }}>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="cth: 08123456789"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={{
                    ...formInputStyle,
                    border:
                      form.phone && !isValidPhone(form.phone)
                        ? "1px solid rgba(244,63,94,0.6)"
                        : "1px solid var(--border)",
                  }}
                />
                {form.phone && !isValidPhone(form.phone) && (
                  <p
                    style={{
                      color: "var(--red)",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    Format tidak valid. Gunakan: 08xx, +628xx, atau 628xx
                  </p>
                )}
              </div>
              <div>
                <label style={formLabelStyle}>
                  Email{" "}
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    (opsional)
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="cth: budi@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    ...formInputStyle,
                    border:
                      form.email && !isValidEmail(form.email)
                        ? "1px solid rgba(244,63,94,0.6)"
                        : "1px solid var(--border)",
                  }}
                />
                {form.email && !isValidEmail(form.email) && (
                  <p
                    style={{
                      color: "var(--red)",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    Format email tidak valid. Contoh: nama@gmail.com
                  </p>
                )}
              </div>
              <div>
                <label style={formLabelStyle}>
                  Catatan{" "}
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    (opsional)
                  </span>
                </label>
                <textarea
                  placeholder="cth: Mau model undercut..."
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                  style={{
                    ...formInputStyle,
                    resize: "none",
                    lineHeight: 1.5,
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                marginTop: "20px",
                padding: "12px 16px",
                borderRadius: "var(--r-sm)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: "16px", flexShrink: 0 }}>🔔</span>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                Kamu akan menerima{" "}
                <strong style={{ color: "var(--text-dim)" }}>
                  reminder otomatis
                </strong>{" "}
                via WhatsApp sehari sebelum dan satu jam sebelum jadwal.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                padding: "12px 22px",
                borderRadius: "var(--r-sm)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-dim)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              ← Kembali
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              disabled={!canProceed[step]}
              onClick={() => canProceed[step] && setStep(step + 1)}
              style={{
                padding: "12px 28px",
                borderRadius: "var(--r-sm)",
                background: canProceed[step]
                  ? "var(--accent)"
                  : "var(--surface-3)",
                border: "none",
                color: canProceed[step] ? "#08090c" : "var(--text-muted)",
                fontSize: "14px",
                fontWeight: 700,
                cursor: canProceed[step] ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}
            >
              Lanjut →
            </button>
          ) : (
            <button
              disabled={!canProceed[3] || submitting}
              onClick={handleSubmit}
              style={{
                padding: "12px 28px",
                borderRadius: "var(--r-sm)",
                background:
                  canProceed[3] && !submitting
                    ? "var(--accent)"
                    : "var(--surface-3)",
                border: "none",
                color:
                  canProceed[3] && !submitting
                    ? "#08090c"
                    : "var(--text-muted)",
                fontSize: "14px",
                fontWeight: 700,
                cursor:
                  canProceed[3] && !submitting ? "pointer" : "not-allowed",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {submitting ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  >
                    ◌
                  </span>{" "}
                  Memproses...
                </>
              ) : (
                "✓ Konfirmasi Booking"
              )}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .date-scroll::-webkit-scrollbar { height: 4px; }
        .date-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (max-width: 600px) { .book-topbar { padding: 12px 16px !important; } .book-content { padding: 24px 16px !important; } }
      `}</style>
    </div>
  );
}

const sectionLabelStyle: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "12px",
  display: "block",
};
const formLabelStyle: React.CSSProperties = {
  display: "block",
  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "8px",
};
const formInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "var(--r-sm)",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
};
