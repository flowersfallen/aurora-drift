import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Compass } from 'lucide-react';
import { OtterState, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface FocusTimerProps {
  otterState: OtterState;
  lang?: Language;
  isDriftMode?: boolean;
  onStartDive: (durationMinutes: number) => void;
  onCancelDive: () => void;
  onCompleteDive: () => void;
}

const PRESET_MINUTES: (1 | 5 | 25 | 45)[] = [1, 5, 25, 45];

export const FocusTimer: React.FC<FocusTimerProps> = ({
  otterState,
  lang = 'en',
  isDriftMode = false,
  onStartDive,
  onCancelDive,
  onCompleteDive,
}) => {
  const t = TRANSLATIONS[lang].timer;
  const [selectedMinutes, setSelectedMinutes] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [totalTime, setTotalTime] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);

  const isDiving = otterState === 'diving';
  const isCruising = otterState === 'cruising';
  const isFocusing = isDiving || isCruising;

  // Preset switch
  const handleSelectPreset = (minutes: number) => {
    if (isFocusing) return;
    setSelectedMinutes(minutes);
    setTimeLeft(minutes * 60);
    setTotalTime(minutes * 60);
  };

  // Start Dive / Cruise
  const handleToggleStart = () => {
    if (isFocusing) {
      // Pause or cancel
      const confirmText = isDriftMode ? t.stopCruiseConfirm : t.cancelConfirm;
      if (confirm(confirmText)) {
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
    if (isFocusing) {
      onCancelDive();
    }
    setIsActive(false);
    setTimeLeft(selectedMinutes * 60);
  };

  // Timer Tick
  useEffect(() => {
    let interval: number | null = null;
    if (isActive && isFocusing && timeLeft > 0) {
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
  }, [isActive, isFocusing, timeLeft, selectedMinutes, onCompleteDive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.max(0, Math.min(100, ((totalTime - timeLeft) / totalTime) * 100));

  return (
    <div className="glass-panel-glow px-3.5 sm:px-6 py-2.5 sm:py-4 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-between min-h-[138px] sm:min-h-[175px] w-full max-w-md mx-auto shadow-2xl">
      {/* Top Header Row: Preset buttons (when idle) or Status Indicator (when focusing) */}
      <div className="h-8 flex items-center justify-center w-full">
        {!isFocusing ? (
          <div className="flex items-center gap-1 sm:gap-2 p-0.5 sm:p-1 bg-sky-950/60 rounded-xl sm:rounded-2xl border border-sky-800/40">
            {PRESET_MINUTES.map((m) => (
              <button
                key={m}
                onClick={() => handleSelectPreset(m)}
                className={`px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all border-none outline-none ${
                  selectedMinutes === m
                    ? 'bg-sky-400 text-sky-950 shadow-md scale-105'
                    : 'bg-transparent text-sky-300/80 hover:text-white hover:bg-sky-900/40'
                }`}
              >
                {t.presets[m].label}
              </button>
            ))}
          </div>
        ) : isCruising ? (
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1 bg-teal-950/80 rounded-xl sm:rounded-2xl border border-teal-500/40 text-teal-300 text-[11px] sm:text-xs font-semibold animate-pulse shadow-inner">
            <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '5s' }} />
            <span>
              {t.cruisingStatus.replace(
                '{miles}',
                String(Math.max(1, Math.round((progressPercent / 100) * selectedMinutes)))
              )}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1 bg-sky-950/80 rounded-xl sm:rounded-2xl border border-sky-600/40 text-sky-300 text-[11px] sm:text-xs font-semibold animate-pulse shadow-inner">
            <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t.divingDepth.replace('{depth}', String(Math.round(progressPercent * 2)))}</span>
          </div>
        )}
      </div>

      {/* Timer Display & Submarine Depth / Nautical Distance Meter */}
      <div className="relative flex flex-col items-center my-0.5 sm:my-1">
        <div className="text-3xl sm:text-4xl font-bold tracking-wider font-sans tabular-nums text-white drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
          {formatTime(timeLeft)}
        </div>

        {/* Progress bar (reserved space so height never changes) */}
        <div className="w-48 sm:w-56 h-1.5 bg-sky-950/80 rounded-full mt-1 sm:mt-1.5 overflow-hidden border border-sky-700/40">
          <div
            className={`h-full bg-gradient-to-r ${
              isCruising ? 'from-teal-400 via-emerald-400 to-sky-400' : 'from-teal-400 via-sky-400 to-indigo-400'
            } transition-all duration-1000 ease-linear ${
              !isFocusing ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center gap-4 sm:gap-5">
        <button
          onClick={handleToggleStart}
          className={`flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all transform active:scale-95 ${
            isFocusing
              ? 'bg-rose-500/80 hover:bg-rose-600 text-white border border-rose-400/40 shadow-rose-900/40'
              : isDriftMode
              ? 'bg-gradient-to-r from-teal-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-sky-950 shadow-teal-500/25 hover:shadow-teal-400/40 hover:scale-105'
              : 'bg-gradient-to-r from-sky-400 to-teal-400 hover:from-sky-300 hover:to-teal-300 text-sky-950 shadow-sky-500/25 hover:shadow-sky-400/40 hover:scale-105'
          }`}
        >
          {isFocusing ? (
            <>
              <Pause className="w-4 h-4" /> {isDriftMode ? t.stopCruise : t.cancelDive}
            </>
          ) : (
            <>
              {isDriftMode ? (
                <>
                  <Compass className="w-4 h-4 text-sky-950" /> {t.startCruise}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-sky-950" /> {t.startDive}
                </>
              )}
            </>
          )}
        </button>

        {!isFocusing && (
          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-sky-950/80 border border-sky-700/50 text-sky-300 hover:text-white hover:bg-sky-800/50 shadow-md transition-all active:scale-95 flex items-center justify-center"
            title={t.resetTimer}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
