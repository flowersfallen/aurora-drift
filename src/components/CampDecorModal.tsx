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
        <svg viewBox="0 0 40 40" className="w-9 h-9 drop-shadow-md">
          {/* Shadow */}
          <ellipse cx="20" cy="34" rx="12" ry="3.5" fill="#0f172a" opacity="0.4" />
          {/* Mug Handle */}
          <path d="M 28 20 C 35 20 35 29 28 29" stroke="#991b1b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M 28 20 C 33 20 33 29 28 29" stroke="#ef4444" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          {/* Mug Body */}
          <rect x="11" y="16" width="18" height="16" rx="3.5" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.8" />
          {/* Gloss highlight */}
          <path d="M 13 18 L 13 28" stroke="#fca5a5" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          {/* Snowflake motif */}
          <text x="20" y="26.5" fontSize="7.5" fill="#ffffff" opacity="0.9" textAnchor="middle" fontWeight="bold">❄</text>
          {/* Rim */}
          <ellipse cx="20" cy="16" rx="9" ry="3.5" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.4" />
          {/* Hot Chocolate */}
          <ellipse cx="20" cy="16" rx="7.8" ry="2.8" fill="#451a03" />
          <ellipse cx="20" cy="16" rx="6.2" ry="2" fill="#78350f" />
          {/* Marshmallows */}
          <ellipse cx="17" cy="15" rx="2.2" ry="1.5" fill="#ffffff" />
          <ellipse cx="23" cy="16.5" rx="2" ry="1.4" fill="#fef08a" />
          <circle cx="20.5" cy="15.2" r="1.4" fill="#ffffff" />
          {/* Steam wisps */}
          <path d="M 17 12 C 14 8 18 5 16 2" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M 23 11 C 26 7 22 4 25 1" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.9" />
        </svg>
      );

    case 'hasFairyLights':
      return (
        <svg viewBox="0 0 40 40" className="w-9 h-9 drop-shadow-md">
          {/* Wire String */}
          <path d="M 4 14 Q 20 28 36 14" stroke="#94a3b8" strokeWidth="1.6" fill="none" opacity="0.8" />
          {/* Bulbs with soft glow */}
          {[
            { cx: 8, cy: 17, col: '#38bdf8', glow: 'rgba(56,189,248,0.4)' },
            { cx: 16, cy: 23, col: '#fde047', glow: 'rgba(253,224,71,0.4)' },
            { cx: 24, cy: 23, col: '#c084fc', glow: 'rgba(192,132,252,0.4)' },
            { cx: 32, cy: 17, col: '#f472b6', glow: 'rgba(244,114,182,0.4)' },
          ].map((b, i) => (
            <g key={i}>
              <circle cx={b.cx} cy={b.cy} r="6" fill={b.glow} />
              <rect x={b.cx - 1.2} y={b.cy - 4} width="2.4" height="2" fill="#64748b" rx="0.5" />
              <circle cx={b.cx} cy={b.cy} r="3.2" fill={b.col} stroke="#ffffff" strokeWidth="0.8" />
              <circle cx={b.cx - 1} cy={b.cy - 1} r="1" fill="#ffffff" opacity="0.8" />
            </g>
          ))}
        </svg>
      );

    case 'hasCozyQuilt':
      return (
        <svg viewBox="0 0 40 40" className="w-9 h-9 drop-shadow-md">
          {/* Shadow */}
          <ellipse cx="20" cy="31" rx="16" ry="4.5" fill="#0f172a" opacity="0.35" />
          {/* Bottom Fold Layer */}
          <ellipse cx="20" cy="24" rx="15" ry="6" fill="#0284c7" stroke="#1e293b" strokeWidth="1.6" />
          {/* Top Folded Quilt Surface */}
          <ellipse cx="19" cy="20" rx="13.5" ry="5.2" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.6" />
          {/* Scandinavian Stitch Pattern */}
          <path d="M 9 20 Q 20 24 29 20" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2.5 1.5" fill="none" />
          <path d="M 11 18 Q 20 21 27 18" stroke="#fde047" strokeWidth="1" fill="none" opacity="0.85" />
          {/* Tassels */}
          <line x1="8" y1="26" x2="5" y2="30" stroke="#bae6fd" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="27" x2="10" y2="32" stroke="#bae6fd" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="17" y1="28" x2="16" y2="33" stroke="#bae6fd" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="22" y1="28" x2="22" y2="33" stroke="#bae6fd" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="27" y1="27" x2="28" y2="32" stroke="#bae6fd" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'hasGramophone':
      return (
        <svg viewBox="0 0 40 40" className="w-9 h-9 drop-shadow-md">
          {/* Shadow */}
          <ellipse cx="20" cy="33" rx="14" ry="4" fill="#0f172a" opacity="0.35" />
          {/* Mahogany Cabinet */}
          <rect x="8" y="22" width="22" height="10" rx="2.5" fill="#78350f" stroke="#1e1005" strokeWidth="1.5" />
          <rect x="7" y="20.5" width="24" height="2.5" rx="1" fill="#9a3412" stroke="#1e1005" strokeWidth="1" />
          {/* Crank */}
          <line x1="8" y1="27" x2="4" y2="27" stroke="#eab308" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="4" cy="27" r="1.2" fill="#ca8a04" />
          {/* Turntable & Record */}
          <ellipse cx="18" cy="20.5" rx="9" ry="3" fill="#0f172a" />
          <circle cx="18" cy="20.5" r="2.2" fill="#f59e0b" />
          {/* Brass Horn Pipe */}
          <path d="M 13 20.5 C 13 14 17 11 21 10" stroke="#ca8a04" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Morning Glory Horn Bell */}
          <path d="M 21 10 C 28 4 35 5 36 12 C 33 16 26 14 21 10 Z" fill="#eab308" stroke="#854d0e" strokeWidth="1.4" />
          <ellipse cx="32" cy="11" rx="3.5" ry="5.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="0.8" transform="rotate(20 32 11)" />
          <path d="M 23 9 Q 29 6 33 7.5" stroke="#fef08a" strokeWidth="1" fill="none" opacity="0.8" />
          {/* Tiny Music Note */}
          <text x="33" y="6" fontSize="9" fill="#38bdf8">♪</text>
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 flex flex-col overflow-hidden border border-sky-400/30 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-800/40">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⛺</span> Iceberg Camp Decor
            </h3>
            <p className="text-xs text-sky-300/80">Make your floating ice sanctuary warm & cozy</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sky-400 hover:text-white hover:bg-sky-800/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Display */}
        <div className="flex items-center justify-between py-3 px-4 bg-sky-950/70 rounded-2xl border border-sky-800/40 my-3">
          <span className="text-xs text-sky-200">Your Ice Pearls:</span>
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
                className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-950/40 border border-sky-800/40 gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-900/60 border border-sky-700/40 flex items-center justify-center p-1 shadow-inner">
                    {renderDecorThumbnail(item.key)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-sky-300/70 max-w-[200px] leading-tight mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {isOwned ? (
                  <span className="px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Placed
                  </span>
                ) : (
                  <button
                    onClick={() => canAfford && onUnlockItem(item.key, item.cost)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1 ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-sky-950 shadow-amber-500/20 active:scale-95'
                        : 'bg-sky-900/40 text-sky-600 border border-sky-800/30 cursor-not-allowed'
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
