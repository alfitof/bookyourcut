"use client";

interface ToggleProps {
  active: boolean;
  onChange: (v: boolean) => void;
}

export default function Toggle({ active, onChange }: ToggleProps) {
  return (
    <div
      onClick={() => onChange(!active)}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        background: active ? "var(--accent)" : "var(--surface-3)",
        border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Glow ring */}
      <div
        style={{
          position: "absolute",
          inset: "-3px",
          borderRadius: "14px",
          background: active ? "rgba(212,247,44,0.15)" : "transparent",
          transition: "background 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Thumb */}
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: active ? "20px" : "2px",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: active ? "#08090c" : "var(--text-muted)",
          transition:
            "left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.25s ease",
          boxShadow: active
            ? "0 1px 4px rgba(0,0,0,0.3)"
            : "0 1px 3px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: active ? "var(--accent)" : "transparent",
            transition: "background 0.2s ease 0.05s, transform 0.2s ease",
            transform: active ? "scale(1)" : "scale(0)",
          }}
        />
      </div>
    </div>
  );
}
