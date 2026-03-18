"use client";

import type { Mode } from "@/hooks/useTimer";

interface ModeSelectorProps {
  activeMode: Mode;
  onSelect: (mode: Mode) => void;
}

const MODES: { key: Mode; label: string }[] = [
  { key: "pomodoro", label: "Pomodoro" },
  { key: "shortBreak", label: "Short Break" },
  { key: "longBreak", label: "Long Break" },
];

export default function ModeSelector({ activeMode, onSelect }: ModeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Timer mode"
      className="flex items-center gap-1 p-1 rounded-xl"
      style={{ backgroundColor: "var(--bg-subtle)" }}
    >
      {MODES.map(({ key, label }) => {
        const isActive = activeMode === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(key)}
            className="btn rounded-lg"
            style={{
              paddingInline: "0.875rem",
              paddingBlock: "0.5rem",
              fontSize: "0.8125rem",
              fontWeight: isActive ? 600 : 400,
              backgroundColor: isActive ? "var(--bg-elevated)" : "transparent",
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              border: isActive ? "1px solid var(--border)" : "1px solid transparent",
              transition: "all 200ms ease-out",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
              }
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
