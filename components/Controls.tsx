"use client";

import { IconPlay, IconPause, IconReset } from "@/components/icons";

interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function Controls({ isRunning, onStart, onPause, onReset }: ControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Reset */}
      <button
        onClick={onReset}
        className="btn"
        aria-label="Reset timer"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: "var(--bg-subtle)",
          color: "var(--text-secondary)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-elevated)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-subtle)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
        }}
      >
        <IconReset style={{ width: 16, height: 16 }} />
      </button>

      {/* Start / Pause — primary CTA */}
      <button
        onClick={isRunning ? onPause : onStart}
        className="btn"
        aria-label={isRunning ? "Pause timer" : "Start timer"}
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: "var(--accent)",
          color: "#fff",
          fontSize: "1rem",
          boxShadow: "0 0 0 0 var(--accent)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-bright)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent)";
        }}
      >
        {isRunning ? (
          <IconPause style={{ width: 22, height: 22 }} />
        ) : (
          <IconPlay style={{ width: 22, height: 22, transform: "translateX(1px)" }} />
        )}
      </button>

      {/* Spacer to balance layout */}
      <div style={{ width: 44, height: 44 }} aria-hidden="true" />
    </div>
  );
}
