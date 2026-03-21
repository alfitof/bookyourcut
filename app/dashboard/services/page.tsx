"use client";
import { useState } from "react";

type Service = {
  id: number;
  name: string;
  duration: string;
  price: string;
  bookingCount: number;
  color: string;
};

const COLORS = [
  "#d4f72c",
  "#60a5fa",
  "#a78bfa",
  "#f97316",
  "#22c55e",
  "#f43f5e",
  "#fb923c",
  "#34d399",
];

const initialServices: Service[] = [
  {
    id: 1,
    name: "Haircut",
    duration: "30 mnt",
    price: "Rp 50.000",
    bookingCount: 48,
    color: "#d4f72c",
  },
  {
    id: 2,
    name: "Haircut + Beard",
    duration: "45 mnt",
    price: "Rp 75.000",
    bookingCount: 31,
    color: "#60a5fa",
  },
  {
    id: 3,
    name: "Coloring",
    duration: "90 mnt",
    price: "Rp 150.000",
    bookingCount: 12,
    color: "#a78bfa",
  },
  {
    id: 4,
    name: "Keramas",
    duration: "15 mnt",
    price: "Rp 25.000",
    bookingCount: 22,
    color: "#f97316",
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    duration: "",
    price: "",
    color: COLORS[0],
  });
  const [formError, setFormError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // ── derived ──
  const isEditing = editingId !== null;

  function openAdd() {
    setEditingId(null);
    setForm({
      name: "",
      duration: "",
      price: "",
      color: COLORS[services.length % COLORS.length],
    });
    setFormError("");
    setShowForm(true);
  }

  function openEdit(s: Service) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      duration: s.duration,
      price: s.price,
      color: s.color,
    });
    setFormError("");
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setFormError("");
    setForm({ name: "", duration: "", price: "", color: COLORS[0] });
  }

  function handleSave() {
    if (!form.name.trim() || !form.duration.trim() || !form.price.trim()) {
      setFormError("Nama, durasi, dan harga wajib diisi.");
      return;
    }
    setFormError("");

    if (isEditing) {
      setServices(
        services.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: form.name,
                duration: form.duration,
                price: form.price,
                color: form.color,
              }
            : s,
        ),
      );
    } else {
      setServices([
        ...services,
        {
          id: Date.now(),
          name: form.name,
          duration: form.duration,
          price: form.price,
          bookingCount: 0,
          color: form.color,
        },
      ]);
    }

    handleCancel();
  }

  function handleDelete(id: number) {
    setServices(services.filter((s) => s.id !== id));
    setDeleteId(null);
  }

  return (
    <div style={{ padding: "36px 40px" }} className="services-page">
      {/* Header */}
      <div
        className="anim-fade-up"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontSize: "28px",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              marginBottom: "6px",
            }}
          >
            Layanan
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>
            {services.length} layanan aktif
          </p>
        </div>
        <button
          onClick={showForm && !isEditing ? handleCancel : openAdd}
          style={{
            padding: "10px 20px",
            borderRadius: "var(--r-sm)",
            background:
              showForm && !isEditing ? "var(--surface-3)" : "var(--accent)",
            color: showForm && !isEditing ? "var(--text-dim)" : "#08090c",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            border: showForm && !isEditing ? "1px solid var(--border)" : "none",
            transition: "all 0.15s",
          }}
        >
          {showForm && !isEditing ? "Batal" : "+ Tambah Layanan"}
        </button>
      </div>

      {/* ── FORM ADD / EDIT ── */}
      {showForm && (
        <div
          className="anim-scale-in"
          style={{
            padding: "24px",
            borderRadius: "var(--r)",
            background: "var(--surface)",
            border: `1px solid ${isEditing ? "rgba(96,165,250,0.4)" : "var(--accent-border)"}`,
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              fontFamily: "Cabinet Grotesk, sans-serif",
              fontWeight: 800,
              fontSize: "16px",
              marginBottom: "20px",
              color: isEditing ? "var(--blue)" : "var(--accent)",
            }}
          >
            {isEditing ? "✎ Edit Layanan" : "+ Tambah Layanan Baru"}
          </h3>

          {formError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "var(--r-sm)",
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.2)",
                color: "var(--red)",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              {formError}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "14px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Nama Layanan</label>
              <input
                type="text"
                placeholder="cth: Haircut"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                autoFocus
              />
            </div>
            <div>
              <label style={labelStyle}>Durasi</label>
              <input
                type="text"
                placeholder="cth: 30 mnt"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Harga</label>
              <input
                type="text"
                placeholder="cth: Rp 50.000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Color picker */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Warna Label</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {COLORS.map((c) => (
                <div
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: c,
                    cursor: "pointer",
                    border:
                      form.color === c
                        ? `3px solid var(--text)`
                        : "3px solid transparent",
                    outline: form.color === c ? `2px solid ${c}` : "none",
                    outlineOffset: "2px",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "var(--r-sm)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "3px",
                alignSelf: "stretch",
                borderRadius: "3px",
                background: form.color,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: "Cabinet Grotesk, sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  color: form.color || "var(--text-muted)",
                }}
              >
                {form.name || "Nama Layanan"}
              </p>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  marginTop: "2px",
                }}
              >
                {form.duration || "—"} · {form.price || "—"}
              </p>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
              Preview
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleCancel}
              style={{
                padding: "9px 20px",
                borderRadius: "var(--r-sm)",
                background: "var(--surface-3)",
                border: "1px solid var(--border)",
                color: "var(--text-dim)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: "9px 24px",
                borderRadius: "var(--r-sm)",
                background: isEditing ? "var(--blue)" : "var(--accent)",
                border: "none",
                color: "#08090c",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isEditing ? "✓ Simpan Perubahan" : "✓ Tambah Layanan"}
            </button>
          </div>
        </div>
      )}

      {/* ── SERVICE GRID ── */}
      <div
        className="anim-fade-up delay-1 services-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "14px",
        }}
      >
        {services.map((s) => (
          <div
            key={s.id}
            style={{
              padding: "20px",
              borderRadius: "var(--r)",
              background: "var(--surface)",
              border: `1px solid ${editingId === s.id ? "rgba(96,165,250,0.4)" : "var(--border)"}`,
              position: "relative",
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
          >
            {/* accent bar */}
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "Cabinet Grotesk, sans-serif",
                      fontWeight: 700,
                      fontSize: "16px",
                      marginBottom: "4px",
                    }}
                  >
                    {s.name}
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                    ⏱ {s.duration}
                    {s.bookingCount > 0 && (
                      <span
                        style={{
                          marginLeft: "8px",
                          color: "var(--text-muted)",
                        }}
                      >
                        · {s.bookingCount} booking
                      </span>
                    )}
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: "Cabinet Grotesk, sans-serif",
                    fontWeight: 800,
                    fontSize: "18px",
                    color: s.color,
                    flexShrink: 0,
                    marginLeft: "8px",
                  }}
                >
                  {s.price}
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => openEdit(s)}
                  style={{
                    flex: 1,
                    padding: "7px",
                    borderRadius: "var(--r-sm)",
                    background:
                      editingId === s.id
                        ? "rgba(96,165,250,0.1)"
                        : "var(--surface-3)",
                    border:
                      editingId === s.id
                        ? "1px solid rgba(96,165,250,0.3)"
                        : "1px solid var(--border)",
                    color:
                      editingId === s.id ? "var(--blue)" : "var(--text-dim)",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "all 0.15s",
                  }}
                >
                  {editingId === s.id ? "✎ Sedang diedit" : "Edit"}
                </button>
                <button
                  onClick={() => setDeleteId(s.id)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "var(--r-sm)",
                    background: "rgba(244,63,94,0.08)",
                    border: "1px solid rgba(244,63,94,0.2)",
                    color: "var(--red)",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {services.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "60px",
              textAlign: "center",
              background: "var(--surface)",
              border: "1px dashed var(--border)",
              borderRadius: "var(--r)",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: "32px", marginBottom: "12px" }}>◈</p>
            <p
              style={{
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                marginBottom: "6px",
              }}
            >
              Belum ada layanan
            </p>
            <p style={{ fontSize: "14px" }}>
              Klik "+ Tambah Layanan" untuk mulai.
            </p>
          </div>
        )}
      </div>

      {/* ── MODAL KONFIRMASI HAPUS SERVICE ── */}
      {deleteId !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteId(null);
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
              Hapus Layanan?
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "14px",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              Layanan{" "}
              <strong style={{ color: "var(--text)" }}>
                {services.find((s) => s.id === deleteId)?.name}
              </strong>{" "}
              akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
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
                }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .services-page { padding: 20px 16px !important; }
          .services-grid { grid-template-columns: 1fr !important; }
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
  padding: "10px 14px",
  borderRadius: "var(--r-sm)",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
};
