"use client";

import { useMemo } from "react";
import type { Mode } from "@/hooks/useTimer";

interface TimerProps {
  timeLeft: number;
  progress: number;
  isRunning: boolean;
  mode: Mode;
}

const SIZE = 280;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const MODE_COLORS: Record<Mode, string> = {
  pomodoro: "#0D9488",
  shortBreak: "#14B8A6",
  longBreak: "#F97316",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Timer({ timeLeft, progress, isRunning, mode }: TimerProps) {
  const strokeDashoffset = useMemo(
    () => CIRCUMFERENCE * (1 - progress),
    [progress]
  );

  const color = MODE_COLORS[mode];
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: SIZE, height: SIZE }}
      role="timer"
      aria-label={`${formatTime(timeLeft)} remaining`}
      aria-live="off"
    >
      {/* SVG ring */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden="true"
        style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}
      >
        {/* Track ring */}
        <circle
          cx={cx}
          cy={cy}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={STROKE_WIDTH}
        />
        {/* Progress ring */}
        <circle
          cx={cx}
          cy={cy}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          className="ring-progress"
        />
      </svg>

      {/* Countdown display */}
      <div className="flex flex-col items-center gap-1 z-10">
        <span
          className="tabular-nums font-semibold tracking-tight select-none"
          style={{
            fontSize: "clamp(3rem, 12vw, 4.5rem)",
            lineHeight: 1,
            color: "var(--text-primary)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatTime(timeLeft)}
        </span>

        {/* Running pulse indicator */}
        <div
          className="flex items-center gap-1.5"
          style={{ height: "16px" }}
        >
          {isRunning && (
            <>
              <span
                className="block rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: color,
                  animation: "pulse 1.4s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                focus
              </span>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
