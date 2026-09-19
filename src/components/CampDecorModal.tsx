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
  icon: string;
  cost: number;
}

const SHOP_ITEMS: DecorShopItem[] = [
  {
    key: 'hasHotCocoa',
    title: 'Steaming Hot Cocoa',
    desc: 'A warm enamel mug of melted dark chocolate with floating mini marshmallows.',
    icon: '☕',
    cost: 15,
  },
  {
    key: 'hasFairyLights',
    title: 'Aurora Fairy Lights',
    desc: 'Twinkling festive string lights illuminating the icy rim of your campsite.',
    icon: '✨',
    cost: 25,
  },
  {
    key: 'hasCozyQuilt',
    title: 'Nordic Wool Blanket',
    desc: 'A handwoven thick wool blanket to keep the campfire spot extra toasty.',
    icon: '🧣',
    cost: 30,
  },
  {
    key: 'hasGramophone',
    title: 'Polar Gramophone',
    desc: 'An antique brass phonograph softly turning and playing vintage polar airs.',
    icon: '📻',
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
                  <div className="w-12 h-12 rounded-xl bg-sky-900/60 border border-sky-700/40 flex items-center justify-center text-2xl">
                    {item.icon}
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
