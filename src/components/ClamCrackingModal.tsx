import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';
import { Treasure } from '../types';
import { audioEngine } from '../services/audioEngine';

interface ClamCrackingModalProps {
  treasure: Treasure;
  onClose: (unlockedTreasure: Treasure, earnedPearls: number) => void;
}

export const ClamCrackingModal: React.FC<ClamCrackingModalProps> = ({ treasure, onClose }) => {
  const [tapStage, setTapStage] = useState<0 | 1 | 2 | 3>(0);
  const [isCracked, setIsCracked] = useState(false);
  const [isStriking, setIsStriking] = useState(false);
  const [showImpactSpark, setShowImpactSpark] = useState(false);

  const handleClamClick = () => {
    if (isCracked || isStriking) return;

    const nextStage = (tapStage + 1) as 1 | 2 | 3;
    setIsStriking(true);

    // Stone strikes shell at ~190ms (impact point of hammer animation)
    setTimeout(() => {
      setShowImpactSpark(true);
      setTapStage(nextStage);
      audioEngine.playClamTap(nextStage);

      // Trigger tactile haptic feedback on mobile if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(35);
        } catch (e) {
          // ignore
        }
      }
    }, 190);

    // Hide spark flash shortly after impact
    setTimeout(() => {
      setShowImpactSpark(false);
    }, 550);

    // Conclude strike action
    setTimeout(() => {
      setIsStriking(false);

      if (nextStage === 3) {
        setTimeout(() => {
          setIsCracked(true);
          // Trigger celebratory cozy ice sparkles
          confetti({
            particleCount: 65,
            spread: 75,
            origin: { y: 0.58 },
            colors: ['#7dd3fc', '#bae6fd', '#c084fc', '#fde047', '#ffffff'],
          });
        }, 150);
      }
    }, 420);
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-amber-400 to-amber-200 text-sky-950 font-bold border-amber-300';
      case 'rare':
        return 'bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold border-purple-300';
      default:
        return 'bg-sky-500/30 text-sky-200 border-sky-400/40';
    }
  };

  const earnedPearls = treasure.rarity === 'legendary' ? 50 : treasure.rarity === 'rare' ? 25 : 15;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md max-h-[calc(var(--app-height,100svh)-2rem)] sm:max-h-[88vh] bg-[#0a1b2e] rounded-3xl p-5 sm:p-6 text-center flex flex-col items-center overflow-y-auto modal-scrollbar overscroll-contain border border-sky-400/40 shadow-2xl modal-crisp"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Background glow behind clam */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-400/15 rounded-full blur-3xl pointer-events-none"></div>

        {!isCracked ? (
          /* --- PHASE 1: ASMR CLAM CRACKING RITUAL --- */
          <div className="flex flex-col items-center py-3 w-full select-none">
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <span>✨</span> Deep Sea Arctic Clam
            </h3>
            <p className="text-xs text-sky-200/80 mb-5">
              The Ice Otter surfaced with a mysterious shell! Strike with pebble to crack it open.
            </p>

            {/* Interactive Arena: Clam Shell & Lucky Pebble */}
            <div
              onClick={handleClamClick}
              className="relative w-64 h-56 flex items-center justify-center cursor-pointer select-none group"
            >
              {/* Otter's Lucky Pebble */}
              <div
                className={`absolute top-2 right-4 z-20 select-none ${
                  isStriking ? 'animate-pebble-strike pointer-events-none' : 'animate-pebble-idle'
                }`}
                title="Otter's Lucky Pebble"
              >
                {/* Pebble Body */}
                <div className="relative w-14 h-11 bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 rounded-[50%_50%_45%_45%] shadow-[0_8px_20px_rgba(0,0,0,0.6)] border-2 border-stone-100 flex items-center justify-center">
                  {/* Specular gloss highlight */}
                  <div className="absolute top-1 left-2 w-5 h-2 bg-white/75 rounded-full blur-[0.4px] -rotate-12" />
                  {/* Subtle stone imprint */}
                  <span className="text-xs font-black text-stone-700 tracking-tighter drop-shadow-sm select-none">
                    🐾
                  </span>
                </div>
                {/* Otter tool tag */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-amber-300 bg-sky-950/90 px-1.5 py-0.5 rounded-full border border-amber-400/40 shadow-sm pointer-events-none">
                  Lucky Pebble
                </div>
              </div>

              {/* Clam SVG with Dynamic Recoil & Cracks */}
              <svg
                className={`w-48 h-44 drop-shadow-[0_0_25px_rgba(56,189,248,0.45)] transition-transform ${
                  isStriking ? 'animate-clam-recoil' : tapStage === 2 ? 'animate-pulse' : ''
                }`}
                viewBox="0 0 160 140"
              >
                {/* Clam Base Shell */}
                <path
                  d="M80 15 C130 15 155 70 145 110 C135 130 95 135 80 135 C65 135 25 130 15 110 C5 70 30 15 80 15 Z"
                  fill="#0369a1"
                  stroke="#7dd3fc"
                  strokeWidth="3.5"
                />
                {/* Shell Ribs */}
                <path d="M80 15 L80 135" stroke="#38bdf8" strokeWidth="2.5" opacity="0.6" />
                <path d="M80 15 Q115 70 120 125" stroke="#38bdf8" strokeWidth="2.5" opacity="0.6" />
                <path d="M80 15 Q45 70 40 125" stroke="#38bdf8" strokeWidth="2.5" opacity="0.6" />

                {/* Stage 1: Fine Hairline Cracks (Bright Glowing Gold) */}
                {tapStage >= 1 && (
                  <path
                    d="M80 60 L72 75 L85 85 L78 98"
                    stroke="#fde047"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    filter="drop-shadow(0 0 4px #fde047)"
                    className="animate-pulse"
                  />
                )}

                {/* Stage 2: Radiating Glowing Fissures */}
                {tapStage >= 2 && (
                  <>
                    <path
                      d="M72 75 L52 68 L44 82"
                      stroke="#fde047"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                      filter="drop-shadow(0 0 5px #fde047)"
                    />
                    <path
                      d="M85 85 L108 80 L116 96"
                      stroke="#fde047"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                      filter="drop-shadow(0 0 5px #fde047)"
                    />
                    <circle cx="80" cy="80" r="16" fill="#fde047" opacity="0.5" className="animate-ping" />
                  </>
                )}
              </svg>

              {/* Impact Flash Sparks right at collision center */}
              {showImpactSpark && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-amber-300 animate-ping opacity-90" />
                  <div className="absolute w-14 h-14 bg-amber-300/40 rounded-full blur-sm" />
                  <div className="absolute text-2xl animate-spark-flash">
                    💥
                  </div>
                  <div className="absolute -top-4 -left-3 text-amber-300 text-sm animate-ping">
                    ✨
                  </div>
                  <div className="absolute -bottom-3 -right-2 text-cyan-200 text-sm animate-ping">
                    ⚡
                  </div>
                </div>
              )}
            </div>

            {/* Click prompt & Progress dots */}
            <div className="mt-5 flex flex-col items-center gap-2.5">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      tapStage >= step
                        ? 'bg-amber-400 scale-125 shadow-[0_0_10px_#fde047]'
                        : 'bg-sky-950 border border-sky-700/60'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-300 animate-pulse flex items-center gap-1.5">
                {tapStage === 0 && '👉 Tap shell or pebble to smash it open! (1/3)'}
                {tapStage === 1 && '💥 CLACK! First crack opened! Strike again! (2/3)'}
                {tapStage === 2 && '⚡ CRACK! One final heavy smash to open! (3/3)'}
              </p>
            </div>
          </div>
        ) : (
          /* --- PHASE 2: REVEAL CARD --- */
          <div className="flex flex-col items-center py-2 w-full animate-scaleUp">
            {/* Top Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider border ${getRarityBadge(treasure.rarity)}`}>
                {treasure.rarity}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-900/60 text-sky-200 border border-sky-700/40">
                {treasure.type === 'postcard' ? '📬 Polar Postcard' : treasure.type === 'relic' ? '🧭 Ancient Relic' : '📜 Bottle Letter'}
              </span>
            </div>

            {/* Card Frame */}
            <div className="w-full bg-gradient-to-b from-sky-900/50 to-sky-950/80 rounded-2xl p-5 border border-sky-400/40 shadow-inner flex flex-col items-center gap-3">
              {/* Treasure Big Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400/20 to-teal-400/10 border border-sky-300/30 flex items-center justify-center text-5xl shadow-md">
                {treasure.icon}
              </div>

              {/* Title & Author */}
              <div>
                <h4 className="text-xl font-bold text-white tracking-wide">{treasure.title}</h4>
                {treasure.author && (
                  <p className="text-xs text-sky-300 font-medium">By {treasure.author}</p>
                )}
              </div>

              {/* Description & Flavor Text */}
              <p className="text-xs text-sky-100/90 leading-relaxed max-w-sm">
                {treasure.description}
              </p>

              <div className="w-full bg-sky-950/60 p-3 rounded-xl border border-sky-800/40 italic text-xs text-amber-200/90 leading-normal">
                {treasure.flavorText}
              </div>

              {/* Pearls Reward */}
              <div className="flex items-center gap-2 text-sm font-bold text-amber-300 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/30">
                <span>🦪</span> +{earnedPearls} Ice Pearls Collected!
              </div>
            </div>

            {/* Collect & Close Button */}
            <button
              onClick={() => onClose(treasure, earnedPearls)}
              className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-teal-400 hover:from-sky-300 hover:to-teal-300 text-sky-950 font-bold text-sm shadow-lg shadow-sky-400/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-sky-950" /> Place in Collection Album
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
