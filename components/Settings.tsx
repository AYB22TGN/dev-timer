"use client";

import { useState, useEffect, useRef } from "react";
import { IconSettings as SettingsIcon, IconX as X } from "@/components/icons";
import type { Settings as SettingsType } from "@/hooks/useTimer";

interface SettingsProps {
  settings: SettingsType;
  onUpdate: (partial: Partial<SettingsType>) => void;
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  label: string;
  description?: string;
}

function Toggle({ checked, onChange, id, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={id}
          style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)", cursor: "pointer" }}
        >
          {label}
        </label>
        {description && (
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            {description}
          </span>
        )}
      </div>

      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="btn flex-shrink-0"
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          backgroundColor: checked ? "var(--accent)" : "var(--bg-subtle)",
          border: "1px solid var(--border)",
          padding: 2,
          position: "relative",
          transition: "background-color 200ms ease-out",
        }}
      >
        <span
          style={{
            display: "block",
            width: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: "#fff",
            transform: checked ? "translateX(20px)" : "translateX(0px)",
            transition: "transform 200ms ease-out",
          }}
        />
      </button>
    </div>
  );
}

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
  id: string;
}

function NumberInput({ value, onChange, min = 1, max = 90, label, id }: NumberInputProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label
        htmlFor={id}
        style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}
      >
        {label}
      </label>

      <div className="flex items-center gap-2">
        <button
          className="btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            backgroundColor: "var(--bg-subtle)",
            color: "var(--text-secondary)",
            fontSize: "1rem",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
          }}
        >
          −
        </button>

        <input
          id={id}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v >= min && v <= max) onChange(v);
          }}
          style={{
            width: 52,
            textAlign: "center",
            backgroundColor: "var(--bg-subtle)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            fontWeight: 600,
            padding: "4px 8px",
            outline: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-bright)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        />

        <button
          className="btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            backgroundColor: "var(--bg-subtle)",
            color: "var(--text-secondary)",
            fontSize: "1rem",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
          }}
        >
          +
        </button>

        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", minWidth: 24 }}>min</span>
      </div>
    </div>
  );
}

export default function Settings({ settings, onUpdate }: SettingsProps) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Trap focus & restore on close
  useEffect(() => {
    if (open && drawerRef.current) {
      const firstFocusable = drawerRef.current.querySelector<HTMLElement>(
        "button, input, [tabindex]"
      );
      firstFocusable?.focus();
    } else if (!open && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="btn"
        aria-label="Open settings"
        aria-haspopup="dialog"
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: "transparent",
          color: "var(--text-muted)",
          border: "1px solid transparent",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-subtle)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
        }}
      >
        <SettingsIcon style={{ width: 16, height: 16 }} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 40,
            animation: "fadeIn 150ms ease-out",
          }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      {open && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Timer settings"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "20px 20px 0 0",
            padding: "1.5rem",
            maxHeight: "85dvh",
            overflowY: "auto",
            animation: "slideUp 200ms ease-out",
          }}
        >
          {/* Handle bar */}
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: "var(--bg-subtle)",
              margin: "0 auto 1.5rem",
            }}
            aria-hidden="true"
          />

          {/* Header */}
          <div className="flex items-center justify-between" style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
              Settings
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="btn"
              aria-label="Close settings"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: "var(--bg-subtle)",
                color: "var(--text-secondary)",
              }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* Duration settings */}
          <div
            className="glass"
            style={{ padding: "1rem 1.25rem", marginBottom: "1rem", borderRadius: "var(--radius-md)" }}
          >
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Duration
            </p>
            <div className="flex flex-col gap-4">
              <NumberInput
                id="setting-pomodoro"
                label="Pomodoro"
                value={settings.pomodoro}
                onChange={(v) => onUpdate({ pomodoro: v })}
              />
              <NumberInput
                id="setting-short"
                label="Short Break"
                value={settings.shortBreak}
                onChange={(v) => onUpdate({ shortBreak: v })}
              />
              <NumberInput
                id="setting-long"
                label="Long Break"
                value={settings.longBreak}
                onChange={(v) => onUpdate({ longBreak: v })}
              />
            </div>
          </div>

          {/* Toggle settings */}
          <div
            className="glass"
            style={{ padding: "1rem 1.25rem", borderRadius: "var(--radius-md)" }}
          >
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Behavior
            </p>
            <div className="flex flex-col gap-4">
              <Toggle
                id="setting-autostart"
                label="Auto-start"
                description="Automatically start next session"
                checked={settings.autoStart}
                onChange={(v) => onUpdate({ autoStart: v })}
              />
              <div
                style={{
                  height: 1,
                  backgroundColor: "var(--border)",
                }}
                aria-hidden="true"
              />
              <Toggle
                id="setting-sound"
                label="Sound alerts"
                description="Beep when session ends"
                checked={settings.sound}
                onChange={(v) => onUpdate({ sound: v })}
              />
            </div>
          </div>
        </div>
      )}

    </>
  );
}
