import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Compass } from 'lucide-react';
import { OtterState } from '../types';

interface FocusTimerProps {
  otterState: OtterState;
  onStartDive: (durationMinutes: number) => void;
  onCancelDive: () => void;
  onCompleteDive: () => void;
}

const PRESETS = [
  { label: '1m Demo', minutes: 1, desc: 'Quick demo' },
  { label: '5m Chill', minutes: 5, desc: 'Short break' },
  { label: '25m Focus', minutes: 25, desc: 'Classic Pomodoro' },
  { label: '45m Deep', minutes: 45, desc: 'Deep flow' },
];

export const FocusTimer: React.FC<FocusTimerProps> = ({
  otterState,
  onStartDive,
  onCancelDive,
  onCompleteDive,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [totalTime, setTotalTime] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);

  const isDiving = otterState === 'diving';

  // Preset switch
  const handleSelectPreset = (minutes: number) => {
    if (isDiving) return;
    setSelectedMinutes(minutes);
    setTimeLeft(minutes * 60);
    setTotalTime(minutes * 60);
  };

  // Start Dive
  const handleToggleStart = () => {
    if (isDiving) {
      // Pause or cancel
      if (confirm('Cancel current deep dive? The otter will return to the iceberg without a treasure.')) {
        setIsActive(false);
        setTimeLeft(selectedMinutes * 60);
        onCancelDive();
      }
    } else {
      setIsActive(true);
      onStartDive(selectedMinutes);
    }
  };

  // Reset
  const handleReset = () => {
    if (isDiving) {
      onCancelDive();
    }
    setIsActive(false);
    setTimeLeft(selectedMinutes * 60);
  };

  // Timer Tick
  useEffect(() => {
    let interval: number | null = null;
    if (isActive && isDiving && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isActive) {
      setIsActive(false);
      setTimeLeft(selectedMinutes * 60);
      onCompleteDive();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isDiving, timeLeft, selectedMinutes, onCompleteDive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.max(0, Math.min(100, ((totalTime - timeLeft) / totalTime) * 100));

  return (
    <div className="glass-panel-glow px-3.5 sm:px-6 py-2.5 sm:py-4 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-between min-h-[148px] sm:min-h-[175px] w-full max-w-md mx-auto shadow-2xl transition-all">
      {/* Top Header Row: Preset buttons (when idle) or Diving Depth Indicator (when diving) - Same Height */}
      <div className="h-8 flex items-center justify-center w-full">
        {!isDiving ? (
          <div className="flex items-center gap-1 sm:gap-2 p-0.5 sm:p-1 bg-sky-950/60 rounded-xl sm:rounded-2xl border border-sky-800/40">
            {PRESETS.map((p) => (
              <button
                key={p.minutes}
                onClick={() => handleSelectPreset(p.minutes)}
                className={`px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
                  selectedMinutes === p.minutes
                    ? 'bg-sky-400 text-sky-950 shadow-md scale-105'
                    : 'text-sky-300/80 hover:text-white hover:bg-sky-900/40'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1 bg-sky-950/80 rounded-xl sm:rounded-2xl border border-sky-600/40 text-sky-300 text-[11px] sm:text-xs font-semibold animate-pulse shadow-inner">
            <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Diving to {Math.round(progressPercent * 2)}m depth</span>
          </div>
        )}
      </div>

      {/* Timer Display & Submarine Depth Meter */}
      <div className="relative flex flex-col items-center my-0.5 sm:my-1">
        <div className="text-3xl sm:text-4xl font-bold tracking-wider font-mono text-white drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
          {formatTime(timeLeft)}
        </div>

        {/* Progress bar (reserved space so height never changes) */}
        <div className="w-48 sm:w-56 h-1.5 bg-sky-950/80 rounded-full mt-1 sm:mt-1.5 overflow-hidden border border-sky-700/40">
          <div
            className={`h-full bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 transition-all duration-1000 ease-linear ${
              !isDiving ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={handleToggleStart}
          className={`flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all transform active:scale-95 ${
            isDiving
              ? 'bg-rose-500/80 hover:bg-rose-600 text-white border border-rose-400/40 shadow-rose-900/40'
              : 'bg-gradient-to-r from-sky-400 to-teal-400 hover:from-sky-300 hover:to-teal-300 text-sky-950 shadow-sky-500/25 hover:shadow-sky-400/40 hover:scale-105'
          }`}
        >
          {isDiving ? (
            <>
              <Pause className="w-4 h-4" /> Cancel Dive
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-sky-950" /> Start Ice Dive
            </>
          )}
        </button>

        {!isDiving && (
          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl glass-panel text-sky-300 hover:text-white hover:bg-sky-800/40 transition-all active:scale-95"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
