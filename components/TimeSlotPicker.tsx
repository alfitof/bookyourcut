"use client";

interface TimeSlotPickerProps {
  slots: string[];
  bookedSlots: string[];
  selected: string | null;
  onSelect: (slot: string) => void;
}

export default function TimeSlotPicker({
  slots,
  bookedSlots,
  selected,
  onSelect,
}: TimeSlotPickerProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        gap: "8px",
      }}
    >
      {slots.map((slot) => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selected === slot;

        return (
          <button
            key={slot}
            disabled={isBooked}
            onClick={() => !isBooked && onSelect(slot)}
            style={{
              padding: "10px 8px",
              borderRadius: "var(--r-sm)",
              border: isSelected
                ? "2px solid var(--accent)"
                : "1px solid var(--border)",
              background: isSelected
                ? "var(--accent)"
                : isBooked
                  ? "var(--surface-3)"
                  : "var(--surface-2)",
              color: isSelected
                ? "#08090c"
                : isBooked
                  ? "var(--text-muted)"
                  : "var(--text)",
              fontSize: "13px",
              fontWeight: isSelected ? 700 : 500,
              cursor: isBooked ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              textDecoration: isBooked ? "line-through" : "none",
            }}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
