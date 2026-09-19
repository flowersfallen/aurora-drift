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

  const handleClamClick = () => {
    if (isCracked) return;

    const nextStage = (tapStage + 1) as 1 | 2 | 3;
    setTapStage(nextStage);
    audioEngine.playClamTap(nextStage);

    if (nextStage === 3) {
      setTimeout(() => {
        setIsCracked(true);
        // Trigger celebratory cozy ice sparkles
        confetti({
          particleCount: 55,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7dd3fc', '#bae6fd', '#c084fc', '#fde047', '#ffffff'],
        });
      }, 350);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 text-center flex flex-col items-center overflow-hidden border border-sky-400/30">
        {/* Background glow behind clam */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>

        {!isCracked ? (
          /* --- PHASE 1: ASMR CLAM CRACKING RITUAL --- */
          <div className="flex flex-col items-center py-4 w-full">
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <span>✨</span> Deep Sea Arctic Clam
            </h3>
            <p className="text-xs text-sky-300/80 mb-6">
              The Ice Otter surfaced with a mysterious shell! Tap to crack it open.
            </p>

            {/* Interactive Shell & Stone */}
            <div
              onClick={handleClamClick}
              className={`relative cursor-pointer transition-all transform duration-150 active:scale-95 group ${
                tapStage === 1 ? 'animate-wiggle' : tapStage === 2 ? 'scale-105' : ''
              }`}
            >
              {/* Little Otter Pebble Hovering */}
              <div
                className={`absolute -top-6 -right-4 w-10 h-8 bg-stone-400 rounded-[60%] border-2 border-stone-200 shadow-md transform transition-all duration-200 ${
                  tapStage > 0 ? 'rotate-45 translate-y-2' : '-rotate-12 group-hover:translate-y-1'
                }`}
                title="Otter's Lucky Pebble"
              >
                <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-700 font-bold">
                  🪨
                </div>
              </div>

              {/* Clam SVG with Progressive Fissures */}
              <svg
                className={`w-48 h-44 drop-shadow-[0_0_25px_rgba(56,189,248,0.4)] ${
                  tapStage === 2 ? 'animate-pulse' : ''
                }`}
                viewBox="0 0 160 140"
              >
                {/* Clam Base Shell */}
                <path
                  d="M80 15 C130 15 155 70 145 110 C135 130 95 135 80 135 C65 135 25 130 15 110 C5 70 30 15 80 15 Z"
                  fill="#0369a1"
                  stroke="#7dd3fc"
                  strokeWidth="3"
                />
                {/* Shell Ribs */}
                <path d="M80 15 L80 135" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />
                <path d="M80 15 Q115 70 120 125" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />
                <path d="M80 15 Q45 70 40 125" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />

                {/* Stage 1: Fine Hairline Cracks */}
                {tapStage >= 1 && (
                  <path
                    d="M80 60 L72 75 L85 85 L78 98"
                    stroke="#fde047"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    className="animate-pulse"
                  />
                )}

                {/* Stage 2: Radiating Glowing Fissures */}
                {tapStage >= 2 && (
                  <>
                    <path
                      d="M72 75 L55 70 L48 82"
                      stroke="#fde047"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M85 85 L105 82 L112 96"
                      stroke="#fde047"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="80" cy="80" r="14" fill="#fde047" opacity="0.4" className="animate-ping" />
                  </>
                )}
              </svg>
            </div>

            {/* Click prompt & Progress dots */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      tapStage >= step
                        ? 'bg-amber-400 scale-125 shadow-[0_0_8px_#fde047]'
                        : 'bg-sky-900/60 border border-sky-700/60'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-amber-300 animate-pulse">
                {tapStage === 0 && '👉 Click the shell to tap with pebble! (1/3)'}
                {tapStage === 1 && '⚡ Great hit! Tap again to crack deeper! (2/3)'}
                {tapStage === 2 && '🔥 One last strike to shatter the ice! (3/3)'}
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
