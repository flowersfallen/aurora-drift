import React from 'react';
import { X, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import { DriftWaypoint, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface WaypointArrivalModalProps {
  waypoint: DriftWaypoint;
  lang: Language;
  onClose: () => void;
  onOpenMap: () => void;
}

export const WaypointArrivalModal: React.FC<WaypointArrivalModalProps> = ({
  waypoint,
  lang,
  onClose,
  onOpenMap,
}) => {
  const t = TRANSLATIONS[lang].voyage;
  const isZh = lang === 'zh';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-sky-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-sky-900/95 via-sky-950/98 to-slate-950 border border-sky-400/40 rounded-3xl shadow-2xl shadow-cyan-950/80 p-5 sm:p-7 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luminous Celestial Halo Background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-0 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-sky-300 hover:text-white hover:bg-sky-800/50 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Grand Waypoint Icon with Animated Glow */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="relative mb-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-sky-600/30 via-teal-500/20 to-amber-300/20 border-2 border-teal-300/60 shadow-xl shadow-teal-500/30 flex items-center justify-center text-4xl sm:text-5xl animate-bounce" style={{ animationDuration: '2.5s' }}>
              {waypoint.icon}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-bold text-xs">
              ★
            </div>
          </div>

          {/* Milestone Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-semibold mb-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{waypoint.requiredMiles} {t.nmUnit} · {t.arrivalTitle}</span>
          </div>

          {/* Waypoint Title */}
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
            {isZh ? waypoint.name_zh : waypoint.name}
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/80 mt-1 max-w-sm font-medium">
            {isZh ? waypoint.subtitle_zh : waypoint.subtitle}
          </p>
        </div>

        {/* Story Narrative Box */}
        <div className="p-4 rounded-2xl bg-sky-900/40 border border-sky-600/30 backdrop-blur-sm text-xs sm:text-sm text-sky-100/90 leading-relaxed mb-4 text-center">
          <p className="italic">
            "{isZh ? waypoint.story_zh : waypoint.story}"
          </p>
        </div>

        {/* Unlocked Wonders / Companions Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-teal-500/15 to-sky-500/15 border border-amber-400/40 mb-5 flex items-start gap-3 shadow-md">
          <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-300 tracking-wider uppercase">
              {t.arrivalEffectTitle}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-white mt-0.5">
              {isZh ? waypoint.rewardText_zh : waypoint.rewardText}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              onClose();
              onOpenMap();
            }}
            className="py-2.5 px-4 rounded-2xl bg-sky-800/60 hover:bg-sky-700/80 border border-sky-500/40 text-sky-100 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg"
          >
            <Compass className="w-4 h-4 text-teal-300" />
            <span>{t.arrivalViewMapBtn}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{t.arrivalContinueBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
