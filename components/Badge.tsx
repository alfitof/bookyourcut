type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default"
  | "accent";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<
  BadgeVariant,
  { bg: string; color: string; border: string }
> = {
  success: {
    bg: "rgba(34,197,94,0.1)",
    color: "#22c55e",
    border: "rgba(34,197,94,0.25)",
  },
  warning: {
    bg: "rgba(249,115,22,0.1)",
    color: "#f97316",
    border: "rgba(249,115,22,0.25)",
  },
  danger: {
    bg: "rgba(244,63,94,0.1)",
    color: "#f43f5e",
    border: "rgba(244,63,94,0.25)",
  },
  info: {
    bg: "rgba(96,165,250,0.1)",
    color: "#60a5fa",
    border: "rgba(96,165,250,0.25)",
  },
  accent: {
    bg: "rgba(212,247,44,0.1)",
    color: "#d4f72c",
    border: "rgba(212,247,44,0.25)",
  },
  default: {
    bg: "rgba(255,255,255,0.05)",
    color: "#8b8d9e",
    border: "rgba(255,255,255,0.1)",
  },
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  const s = variantStyles[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "100px",
        fontSize: "12px",
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
