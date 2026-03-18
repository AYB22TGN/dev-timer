"use client";

interface SessionDotsProps {
  completed: number;
}

const TOTAL = 4;

export default function SessionDots({ completed }: SessionDotsProps) {
  const cyclePosition = completed % TOTAL;
  const filledInCycle = cyclePosition;

  return (
    <div
      className="flex flex-col items-center gap-2"
      aria-label={`${completed} pomodoro${completed !== 1 ? "s" : ""} completed`}
    >
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL }, (_, i) => {
          const filled = i < filledInCycle;
          return (
            <div
              key={i}
              aria-hidden="true"
              style={{
                width: filled ? 10 : 8,
                height: filled ? 10 : 8,
                borderRadius: "50%",
                backgroundColor: filled ? "var(--accent)" : "var(--bg-subtle)",
                border: filled ? "none" : "1px solid var(--border)",
                transition: "all 200ms ease-out",
                flexShrink: 0,
              }}
            />
          );
        })}
      </div>

      <span
        style={{
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {completed === 0
          ? "First session"
          : `${completed} session${completed !== 1 ? "s" : ""} done`}
      </span>
    </div>
  );
}
