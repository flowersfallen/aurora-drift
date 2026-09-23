import React, { useState } from 'react';
import { X, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language, WaypointId } from '../types';
import { DRIFT_WAYPOINTS } from '../data/waypoints';
import { TRANSLATIONS } from '../i18n/translations';

interface DriftMapModalProps {
  currentMiles: number;
  visitedWaypointIds?: string[];
  lang: Language;
  onClose: () => void;
}

export const DriftMapModal: React.FC<DriftMapModalProps> = ({
  currentMiles,
  visitedWaypointIds: _visitedWaypointIds,
  lang,
  onClose,
}) => {
  const t = TRANSLATIONS[lang].voyage;
  const isZh = lang === 'zh';

  // Determine current active waypoint (the next one being sailed to, or the last one if reached 600)
  const nextWaypoint =
    DRIFT_WAYPOINTS.find((wp) => currentMiles < wp.requiredMiles) ||
    DRIFT_WAYPOINTS[DRIFT_WAYPOINTS.length - 1];

  const [selectedWaypointId, setSelectedWaypointId] = useState<WaypointId>(nextWaypoint.id);
  const selectedWaypoint =
    DRIFT_WAYPOINTS.find((wp) => wp.id === selectedWaypointId) || DRIFT_WAYPOINTS[0];

  const totalMaxMiles = 600;
  const progressPercent = Math.min(100, Math.round((currentMiles / totalMaxMiles) * 100));

  const isCurrentTarget = nextWaypoint.id === selectedWaypoint.id && currentMiles < 600;
  const isReached = currentMiles >= selectedWaypoint.requiredMiles;
  const remainingMiles = Math.max(0, selectedWaypoint.requiredMiles - currentMiles);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-sky-950/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-sky-950/95 border border-sky-400/30 rounded-3xl shadow-2xl shadow-sky-900/60 p-4 sm:p-6 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Arctic Aurora Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-800/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-sm">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                {t.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-sky-300/80 leading-snug">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sky-300 hover:text-white hover:bg-sky-800/50 transition-colors shrink-0"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voyage Miles Status Pill */}
        <div className="my-3 p-3.5 rounded-2xl bg-gradient-to-r from-sky-900/50 via-teal-950/40 to-sky-900/50 border border-sky-700/50 shrink-0">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5 font-medium text-sky-200">
              <span>🧭</span>
              <span>{t.milesAccumulated}:</span>
              <span className="text-amber-300 font-bold text-sm">
                {currentMiles} {t.nmUnit}
              </span>
            </div>
            <div className="text-sky-300 text-[11px]">
              {currentMiles >= 600 ? (
                <span className="text-teal-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {isZh ? '已完成极地全航程' : 'Polar Drift Completed'}
                </span>
              ) : (
                <span>
                  {t.sailingTo}:{' '}
                  <strong className="text-white">
                    {isZh ? nextWaypoint.name_zh : nextWaypoint.name}
                  </strong>{' '}
                  ({Math.max(0, nextWaypoint.requiredMiles - currentMiles)} {t.nmUnit})
                </span>
              )}
            </div>
          </div>

          {/* Progress Track */}
          <div className="relative w-full h-3 bg-sky-950/80 rounded-full overflow-hidden border border-sky-700/40">
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-sky-400/80 mt-1.5 px-0.5">
            <span>0 {t.nmUnit} (Camp)</span>
            <span>100 {t.nmUnit} (Fox)</span>
            <span>300 {t.nmUnit} (Lighthouse)</span>
            <span>600 {t.nmUnit} (Oasis)</span>
          </div>
        </div>

        {/* Waypoints Interactive Route Map */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 my-1 shrink-0">
          {DRIFT_WAYPOINTS.map((wp) => {
            const reached = currentMiles >= wp.requiredMiles;
            const isSelected = wp.id === selectedWaypointId;
            const isCurrent = wp.id === nextWaypoint.id && currentMiles < 600;

            return (
              <button
                key={wp.id}
                onClick={() => setSelectedWaypointId(wp.id)}
                className={`relative flex flex-col items-center p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 text-center ${
                  isSelected
                    ? 'bg-sky-800/60 border-teal-400/90 shadow-lg shadow-teal-500/20 scale-[1.02]'
                    : reached
                    ? 'bg-sky-900/35 border-teal-500/40 hover:bg-sky-800/40'
                    : isCurrent
                    ? 'bg-amber-950/30 border-amber-400/50 hover:bg-amber-950/40 animate-pulse'
                    : 'bg-sky-950/40 border-sky-800/30 opacity-60 hover:opacity-85'
                }`}
              >
                {/* Milestone Node Badge */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl mb-1.5 transition-transform ${
                    reached
                      ? 'bg-teal-500/25 border border-teal-400/50 text-white'
                      : isCurrent
                      ? 'bg-amber-500/20 border border-amber-400/60 text-amber-200 ring-2 ring-amber-400/30'
                      : 'bg-sky-900/40 border border-sky-700/30 text-sky-400'
                  }`}
                >
                  {wp.icon}
                </div>

                {/* Waypoint Title */}
                <span className="text-[11px] sm:text-xs font-bold text-white line-clamp-1">
                  {isZh ? wp.name_zh : wp.name}
                </span>

                {/* Miles Subtext */}
                <span className="text-[10px] text-sky-300/80 font-mono mt-0.5">
                  {wp.requiredMiles} {t.nmUnit}
                </span>

                {/* Status Dot */}
                <div className="mt-1">
                  {reached ? (
                    <span className="inline-flex items-center text-[9px] text-teal-300 font-semibold gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {t.legendUnlocked}
                    </span>
                  ) : isCurrent ? (
                    <span className="inline-flex items-center text-[9px] text-amber-300 font-semibold gap-0.5">
                      <Compass className="w-2.5 h-2.5 animate-spin-slow" />
                      {t.legendCurrent}
                    </span>
                  ) : (
                    <span className="text-[9px] text-sky-400/60">{t.legendLocked}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Waypoint Detailed Lore & Story Card */}
        <div
          className="flex-1 min-h-0 mt-3 p-4 sm:p-4.5 rounded-2xl bg-sky-900/30 border border-sky-700/50 overflow-y-auto modal-scrollbar overscroll-contain flex flex-col justify-between"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div>
            {/* Waypoint Header */}
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedWaypoint.icon}</span>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {isZh ? selectedWaypoint.name_zh : selectedWaypoint.name}
                  </h4>
                </div>
                <p className="text-xs text-teal-300 font-medium mt-0.5">
                  {isZh ? selectedWaypoint.subtitle_zh : selectedWaypoint.subtitle}
                </p>
              </div>

              {/* Status Tag */}
              <div className="shrink-0">
                {isReached ? (
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-400/40 flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.arrived}
                  </span>
                ) : isCurrentTarget ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-400/40 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                    {remainingMiles} {t.nmUnit} {t.milesRemaining}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-sky-900/40 text-sky-400 text-[11px] font-medium border border-sky-700/40 flex items-center gap-1">
                    {remainingMiles} {t.nmUnit}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed bg-sky-950/40 p-3 rounded-xl border border-sky-800/40 mb-3">
              {isZh ? selectedWaypoint.description_zh : selectedWaypoint.description}
            </p>

            {/* Lore Story */}
            <div className="text-xs text-sky-200/80 leading-relaxed border-l-2 border-teal-400/70 pl-3 py-1 italic mb-3">
              {isZh ? selectedWaypoint.story_zh : selectedWaypoint.story}
            </div>
          </div>

          {/* Reward / Special Feature Pill */}
          <div className="mt-2 pt-2.5 border-t border-sky-800/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-200/90">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="font-medium">
                {isZh ? selectedWaypoint.rewardText_zh : selectedWaypoint.rewardText}
              </span>
            </div>
            {selectedWaypoint.guestId === 'fox' && isReached && (
              <span className="px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-300 text-[10px] font-semibold border border-orange-400/30 shrink-0">
                🐾 {t.guestBadge}
              </span>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-3 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-800 hover:bg-sky-700 text-white text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
