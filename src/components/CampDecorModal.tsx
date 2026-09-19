import React from 'react';
import { X, Check } from 'lucide-react';
import { CampDecorations } from '../types';

interface CampDecorModalProps {
  pearls: number;
  decorations: CampDecorations;
  onUnlockItem: (itemKey: keyof CampDecorations, cost: number) => void;
  onClose: () => void;
}

interface DecorShopItem {
  key: keyof CampDecorations;
  title: string;
  desc: string;
  cost: number;
}

const renderDecorThumbnail = (key: keyof CampDecorations) => {
  switch (key) {
    case 'hasHotCocoa':
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-md">
          {/* Base Shadow */}
          <ellipse cx="19" cy="33.5" rx="11" ry="3.2" fill="#0f172a" opacity="0.4" />
          {/* Mug Handle */}
          <path d="M 27 19 C 33.5 19 33.5 28 27 28" stroke="#991b1b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M 27 19 C 31.5 19 31.5 28 27 28" stroke="#ef4444" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          {/* Ceramic Mug Body */}
          <rect x="10.5" y="16" width="17" height="15.5" rx="3.5" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.8" />
          {/* Mug Gloss Highlight */}
          <path d="M 12.5 18 L 12.5 27" stroke="#fca5a5" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          {/* Snowflake Motif */}
          <text x="19" y="26" fontSize="7.5" fill="#ffffff" opacity="0.9" textAnchor="middle" fontWeight="bold">❄</text>
          {/* Mug Rim */}
          <ellipse cx="19" cy="16" rx="8.5" ry="3.2" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.4" />
          {/* Hot Chocolate */}
          <ellipse cx="19" cy="16" rx="7.4" ry="2.5" fill="#451a03" />
          <ellipse cx="19" cy="16" rx="5.8" ry="1.8" fill="#78350f" />
          {/* 3 Marshmallows */}
          <ellipse cx="16" cy="15" rx="2.2" ry="1.5" fill="#ffffff" />
          <ellipse cx="22" cy="16.2" rx="2" ry="1.4" fill="#fef08a" />
          <circle cx="19.5" cy="15.2" r="1.3" fill="#ffffff" />
          {/* Rising Steam Wisps */}
          <path d="M 16 12 C 13.5 8.5 17 6 15.5 3" stroke="#bae6fd" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M 22 11 C 24.5 7.5 21 5 23.5 2" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.9" />
          <path d="M 19 11.5 C 17.5 8 20.5 6 19 3.5" stroke="#e0f2fe" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.75" />
        </svg>
      );

    case 'hasFairyLights':
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-md">
          {/* Festive Twin Garland Wires */}
          <path d="M 3 13 Q 20 24 37 13" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.8" />
          <path d="M 5 22 Q 20 33 35 22" stroke="#64748b" strokeWidth="1.2" fill="none" opacity="0.65" />

          {/* Top Tier Bulbs */}
          {[
            { cx: 7, cy: 15.5, col: '#38bdf8', glow: 'rgba(56,189,248,0.45)' },
            { cx: 15, cy: 19.5, col: '#fde047', glow: 'rgba(253,224,71,0.45)' },
            { cx: 25, cy: 19.5, col: '#c084fc', glow: 'rgba(192,132,252,0.45)' },
            { cx: 33, cy: 15.5, col: '#f472b6', glow: 'rgba(244,114,182,0.45)' },
          ].map((b, i) => (
            <g key={`top-${i}`}>
              <circle cx={b.cx} cy={b.cy} r="5.5" fill={b.glow} />
              <rect x={b.cx - 1} y={b.cy - 3.5} width="2" height="1.8" fill="#475569" rx="0.4" />
              <circle cx={b.cx} cy={b.cy} r="2.8" fill={b.col} stroke="#ffffff" strokeWidth="0.8" />
              <circle cx={b.cx - 0.8} cy={b.cy - 0.8} r="0.9" fill="#ffffff" opacity="0.8" />
            </g>
          ))}

          {/* Bottom Tier Bulbs */}
          {[
            { cx: 10, cy: 24.5, col: '#f472b6', glow: 'rgba(244,114,182,0.4)' },
            { cx: 20, cy: 28, col: '#38bdf8', glow: 'rgba(56,189,248,0.4)' },
            { cx: 30, cy: 24.5, col: '#fde047', glow: 'rgba(253,224,71,0.4)' },
          ].map((b, i) => (
            <g key={`bot-${i}`}>
              <circle cx={b.cx} cy={b.cy} r="5" fill={b.glow} />
              <rect x={b.cx - 0.9} y={b.cy - 3} width="1.8" height="1.5" fill="#475569" rx="0.4" />
              <circle cx={b.cx} cy={b.cy} r="2.4" fill={b.col} stroke="#ffffff" strokeWidth="0.7" />
            </g>
          ))}
        </svg>
      );

    case 'hasCozyQuilt':
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-md">
          {/* Base Contact Shadow */}
          <ellipse cx="20" cy="30" rx="17" ry="4.5" fill="#0f172a" opacity="0.35" />

          {/* Bottom Fold Layer */}
          <ellipse cx="20" cy="23" rx="16" ry="6.5" fill="#0284c7" stroke="#1e293b" strokeWidth="1.6" />
          {/* Top Folded Quilt Surface */}
          <ellipse cx="19" cy="18" rx="14.5" ry="5.8" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.6" />

          {/* Scandinavian Stitch Pattern */}
          <path d="M 8 18 Q 20 22 30 18" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2.5 1.5" fill="none" />
          <path d="M 10 16 Q 20 19.5 28 16" stroke="#fde047" strokeWidth="1.2" fill="none" opacity="0.85" />

          {/* Soft Fringe Tassels */}
          <line x1="8" y1="25" x2="5" y2="29" stroke="#bae6fd" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="26" x2="10" y2="31" stroke="#bae6fd" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="17" y1="27" x2="16" y2="32" stroke="#bae6fd" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="22" y1="27" x2="22" y2="32" stroke="#bae6fd" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="27" y1="26" x2="28" y2="31" stroke="#bae6fd" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'hasGramophone':
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-md">
          {/* Base Shadow */}
          <ellipse cx="19" cy="33.5" rx="14" ry="4" fill="#0f172a" opacity="0.35" />

          {/* Mahogany Cabinet */}
          <rect x="7.5" y="21.5" width="23" height="10.5" rx="2.5" fill="#78350f" stroke="#1e1005" strokeWidth="1.5" />
          <rect x="6.5" y="20" width="25" height="2.5" rx="1" fill="#9a3412" stroke="#1e1005" strokeWidth="1" />
          {/* Brass Crank Handle */}
          <line x1="7.5" y1="26.5" x2="3.5" y2="26.5" stroke="#eab308" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="3.5" cy="26.5" r="1.3" fill="#ca8a04" />

          {/* Turntable & Vinyl Record */}
          <ellipse cx="17.5" cy="20" rx="9" ry="3" fill="#0f172a" />
          <circle cx="17.5" cy="20" r="2.2" fill="#f59e0b" />
          {/* Tone Arm */}
          <path d="M 24 20 L 21 20 L 19 21" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* Brass Horn Neck */}
          <path d="M 12.5 20 C 12.5 13.5 17 10 21 9.5" stroke="#ca8a04" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Flared Horn Bell */}
          <path d="M 21 9.5 C 28 4 35 5 36.5 12 C 33.5 16 26.5 14 21 9.5 Z" fill="#eab308" stroke="#854d0e" strokeWidth="1.4" />
          <ellipse cx="32.5" cy="11" rx="3.5" ry="5.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="0.8" transform="rotate(20 32.5 11)" />
          <path d="M 23 8.5 Q 29 5.5 33.5 7" stroke="#fef08a" strokeWidth="1" fill="none" opacity="0.8" />

          {/* Balanced Floating Musical Notes */}
          <text x="33" y="5.5" fontSize="8.5" fill="#38bdf8" fontWeight="bold">♪</text>
          <text x="7" y="12" fontSize="7.5" fill="#7dd3fc" fontWeight="bold">♫</text>
        </svg>
      );
  }
};

const SHOP_ITEMS: DecorShopItem[] = [
  {
    key: 'hasHotCocoa',
    title: 'Steaming Hot Cocoa',
    desc: 'Ceramic snowflake mug of melted dark chocolate with mini marshmallows and steam.',
    cost: 15,
  },
  {
    key: 'hasFairyLights',
    title: 'Aurora Fairy Lights',
    desc: 'Twinkling festive pastel string lights illuminating the icy rim of your campsite.',
    cost: 25,
  },
  {
    key: 'hasCozyQuilt',
    title: 'Nordic Wool Blanket',
    desc: 'Handwoven blue wool quilt with Scandinavian pattern and soft fringe tassels.',
    cost: 30,
  },
  {
    key: 'hasGramophone',
    title: 'Polar Gramophone',
    desc: 'Antique mahogany & brass horn phonograph softly turning with floating musical notes.',
    cost: 50,
  },
];

export const CampDecorModal: React.FC<CampDecorModalProps> = ({
  pearls,
  decorations,
  onUnlockItem,
  onClose,
}) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#0a1b2e] rounded-3xl p-4 sm:p-6 flex flex-col overflow-hidden border border-sky-400/40 shadow-2xl modal-crisp"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-800/50">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⛺</span> Iceberg Camp Decor
            </h3>
            <p className="text-xs text-sky-300">Make your floating ice sanctuary warm & cozy</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sky-300 hover:text-white hover:bg-sky-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Display */}
        <div className="flex items-center justify-between py-3 px-4 bg-sky-900/40 rounded-2xl border border-sky-700/50 my-3">
          <span className="text-xs text-sky-200 font-medium">Your Ice Pearls:</span>
          <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <span>🦪</span> {pearls} Pearls
          </span>
        </div>

        {/* Shop Items List */}
        <div className="flex flex-col gap-3 py-1 overflow-y-auto max-h-[50vh]">
          {SHOP_ITEMS.map((item) => {
            const isOwned = decorations[item.key];
            const canAfford = pearls >= item.cost;

            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-950/70 border border-sky-800/60 shadow-md gap-2.5 sm:gap-3"
              >
                {/* Left: Thumbnail and Description with clean, guaranteed separation */}
                <div className="flex items-start flex-1 min-w-0">
                  {/* Dedicated, spacious thumbnail box */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-900/80 to-sky-950/90 border border-sky-400/35 flex items-center justify-center p-2 shadow-inner shrink-0 mr-3.5 sm:mr-4">
                    {renderDecorThumbnail(item.key)}
                  </div>
                  {/* Text Details */}
                  <div className="flex-1 min-w-0 pr-1.5">
                    <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                    <p className="text-xs text-sky-200/80 leading-relaxed mt-1 break-words">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Right: Buy / Placed Button */}
                {isOwned ? (
                  <span className="px-3 py-2 rounded-xl bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30 flex items-center gap-1 shrink-0 ml-1">
                    <Check className="w-3.5 h-3.5" /> Placed
                  </span>
                ) : (
                  <button
                    onClick={() => canAfford && onUnlockItem(item.key, item.cost)}
                    disabled={!canAfford}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0 ml-1 ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-sky-950 shadow-amber-500/25 active:scale-95 cursor-pointer'
                        : 'bg-sky-900/30 text-sky-600 border border-sky-800/40 cursor-not-allowed'
                    }`}
                  >
                    <span>🦪</span> {item.cost}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
