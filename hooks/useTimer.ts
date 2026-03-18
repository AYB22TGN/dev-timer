"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type Mode = "pomodoro" | "shortBreak" | "longBreak";

export interface Settings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStart: boolean;
  sound: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStart: false,
  sound: true,
};

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem("devtimer-settings");
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(s: Settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem("devtimer-settings", JSON.stringify(s));
}

/** Web Audio API oscillator beep — no external files needed */
function playBeep(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);

  gain.gain.setValueAtTime(0.0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
  gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.5);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
}

export function useTimer() {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load settings on mount
  useEffect(() => {
    const s = loadSettings();
    setSettingsState(s);
    setTimeLeft(s.pomodoro * 60);
  }, []);

  const getModeDuration = useCallback(
    (m: Mode, s: Settings) => {
      const map: Record<Mode, number> = {
        pomodoro: s.pomodoro,
        shortBreak: s.shortBreak,
        longBreak: s.longBreak,
      };
      return map[m] * 60;
    },
    []
  );

  const triggerSound = useCallback(() => {
    if (!settings.sound) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      // Resume if suspended (browser autoplay policy)
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().then(() => {
          playBeep(audioCtxRef.current!);
        });
      } else {
        playBeep(audioCtxRef.current);
      }
    } catch {
      // Audio not available — silently ignore
    }
  }, [settings.sound]);

  const switchMode = useCallback(
    (nextMode: Mode, completed: number) => {
      setMode(nextMode);
      setTimeLeft(getModeDuration(nextMode, settings));
      setIsRunning(settings.autoStart);
      setCompletedPomodoros(completed);
    },
    [settings, getModeDuration]
  );

  // Countdown tick
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          triggerSound();

          // Determine next mode
          setCompletedPomodoros((c) => {
            const newCount = mode === "pomodoro" ? c + 1 : c;
            const nextMode: Mode =
              mode === "pomodoro"
                ? newCount % 4 === 0
                  ? "longBreak"
                  : "shortBreak"
                : "pomodoro";

            // Schedule mode switch after state settles
            setTimeout(() => {
              setMode(nextMode);
              setTimeLeft(getModeDuration(nextMode, settings));
              if (settings.autoStart) setIsRunning(true);
            }, 0);

            return newCount;
          });

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, settings, triggerSound, getModeDuration]);

  const start = useCallback(() => {
    // Unlock audio context on first user interaction
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new AudioContext();
      } catch {
        // ignore
      }
    }
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(getModeDuration(mode, settings));
  }, [mode, settings, getModeDuration]);

  const selectMode = useCallback(
    (m: Mode) => {
      setIsRunning(false);
      setMode(m);
      setTimeLeft(getModeDuration(m, settings));
    },
    [settings, getModeDuration]
  );

  const updateSettings = useCallback(
    (partial: Partial<Settings>) => {
      setSettingsState((prev) => {
        const next = { ...prev, ...partial };
        saveSettings(next);

        // Update timeLeft if the current mode's duration changed
        const modeKey = mode as keyof Pick<Settings, "pomodoro" | "shortBreak" | "longBreak">;
        if (
          !isRunning &&
          partial[modeKey] !== undefined &&
          partial[modeKey] !== prev[modeKey]
        ) {
          setTimeLeft(getModeDuration(mode, next));
        }

        return next;
      });
    },
    [mode, isRunning, getModeDuration]
  );

  const totalSeconds = getModeDuration(mode, settings);
  const progress = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;

  return {
    mode,
    timeLeft,
    isRunning,
    completedPomodoros,
    settings,
    progress,
    totalSeconds,
    start,
    pause,
    reset,
    selectMode,
    updateSettings,
    switchMode,
  };
}
