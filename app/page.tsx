"use client";

import { useEffect } from "react";
import { useTimer } from "@/hooks/useTimer";
import Timer from "@/components/Timer";
import Controls from "@/components/Controls";
import ModeSelector from "@/components/ModeSelector";
import SessionDots from "@/components/SessionDots";
import Settings from "@/components/Settings";

const MODE_LABELS = {
  pomodoro: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
} as const;

const MODE_BG_ACCENT = {
  pomodoro: "rgba(13, 148, 136, 0.04)",
  shortBreak: "rgba(20, 184, 166, 0.04)",
  longBreak: "rgba(249, 115, 22, 0.04)",
} as const;

export default function HomePage() {
  const {
    mode,
    timeLeft,
    isRunning,
    completedPomodoros,
    settings,
    progress,
    start,
    pause,
    reset,
    selectMode,
    updateSettings,
  } = useTimer();

  // Update document title with countdown
  useEffect(() => {
    const mm = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const ss = (timeLeft % 60).toString().padStart(2, "0");
    document.title = `${mm}:${ss} — ${MODE_LABELS[mode]} | DevTimer`;
    return () => {
      document.title = "DevTimer — Minimalist Pomodoro";
    };
  }, [timeLeft, mode]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg)",
        backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 20%, ${MODE_BG_ACCENT[mode]}, transparent)`,
        transition: "background-image 600ms ease-out",
        padding: "clamp(1.5rem, 4vw, 3rem) 1rem",
        gap: "2rem",
      }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between"
        style={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <div className="flex items-center gap-2">
          {/* Logo mark */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="13" r="8" stroke="var(--accent)" strokeWidth="1.5" />
            <path d="M12 13L12 8" stroke="var(--accent-bright)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 13L16 11" stroke="var(--accent-cta)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="13" r="1.25" fill="var(--accent-bright)" />
            <path d="M9.5 2H14.5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            DevTimer
          </span>
        </div>

        <Settings settings={settings} onUpdate={updateSettings} />
      </header>

      {/* Mode selector */}
      <ModeSelector activeMode={mode} onSelect={selectMode} />

      {/* Timer ring */}
      <section aria-label="Timer">
        <Timer
          timeLeft={timeLeft}
          progress={progress}
          isRunning={isRunning}
          mode={mode}
        />
      </section>

      {/* Mode label */}
      <div className="flex flex-col items-center gap-1">
        <span
          style={{
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "var(--text-secondary)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {MODE_LABELS[mode]}
        </span>
      </div>

      {/* Controls */}
      <Controls
        isRunning={isRunning}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />

      {/* Session progress */}
      <SessionDots completed={completedPomodoros} />

      {/* Footer */}
      <footer
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.6875rem",
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
          letterSpacing: "0.04em",
        }}
      >
        Stay focused. Ship more.
      </footer>
    </main>
  );
}
