import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Compass, Mail, Lock, Heart, Check } from 'lucide-react';
import { Treasure, TreasureType } from '../types';
import { ALL_TREASURES } from '../data/treasures';

interface CollectionModalProps {
  unlockedIds: string[];
  onClose: () => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({ unlockedIds, onClose }) => {
  const [activeTab, setActiveTab] = useState<TreasureType | 'all'>('all');
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredTreasures = ALL_TREASURES.filter((t) => {
    if (activeTab === 'all') return true;
    return t.type === activeTab;
  });

  const unlockedCount = unlockedIds.length;
  const totalCount = ALL_TREASURES.length;

  const handleShareQuote = (treasure: Treasure) => {
    const text = `❄️ Ice Otter found: "${treasure.title}"\n${treasure.flavorText}\n— Discovered in Aurora Drift at iceotter.com 🦦✨`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[88vh] bg-[#0a1b2e] rounded-3xl p-4 sm:p-6 flex flex-col overflow-hidden border border-sky-400/40 shadow-2xl modal-crisp"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-800/50">
          <div className="flex items-center gap-4 sm:gap-4.5">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-sky-900/80 text-sky-300 border border-sky-500/40 shadow-sm shrink-0 mr-1">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
                Polar Memory Album
              </h3>
              <p className="text-xs text-sky-300 font-medium mt-0.5">
                Unlocked {unlockedCount} of {totalCount} polar treasures ({Math.round((unlockedCount / totalCount) * 100)}%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sky-300 hover:text-white hover:bg-sky-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-3 sm:gap-3.5 py-3.5 px-1 overflow-x-auto no-scrollbar scrollbar-none">
          {[
            { id: 'all', label: 'All Items', shortLabel: 'All', icon: Sparkles },
            { id: 'postcard', label: 'Postcards', shortLabel: 'Postcards', icon: BookOpen },
            { id: 'relic', label: 'Ancient Relics', shortLabel: 'Relics', icon: Compass },
            { id: 'letter', label: 'Bottle Letters', shortLabel: 'Letters', icon: Mail },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TreasureType | 'all')}
                className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-colors border-none outline-none ${
                  isActive
                    ? 'bg-sky-400 text-sky-950 shadow-md shadow-sky-400/25 border border-sky-300'
                    : 'bg-sky-900/50 text-sky-300 hover:text-white hover:bg-sky-800/60 border border-sky-700/50'
                }`}
              >
                <IconComp className="w-3.5 h-3.5 shrink-0" />
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid of Treasures */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-2">
          {filteredTreasures.map((treasure) => {
            const isUnlocked = unlockedIds.includes(treasure.id);

            return (
              <div
                key={treasure.id}
                onClick={() => isUnlocked && setSelectedTreasure(treasure)}
                className={`relative rounded-2xl p-3.5 flex flex-col items-center text-center transition-all border ${
                  isUnlocked
                    ? 'bg-sky-950/60 hover:bg-sky-900/60 border-sky-400/40 cursor-pointer shadow-lg hover:scale-105 group'
                    : 'bg-sky-950/30 border-sky-900/40 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Icon box */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-2 transition-transform ${
                    isUnlocked
                      ? 'bg-sky-400/20 group-hover:scale-110 shadow-inner'
                      : 'bg-sky-950/80 text-sky-800'
                  }`}
                >
                  {isUnlocked ? treasure.icon : <Lock className="w-5 h-5 text-sky-700" />}
                </div>

                {/* Title */}
                <span className="text-xs font-bold text-white truncate w-full">
                  {isUnlocked ? treasure.title : '???'}
                </span>

                {/* Rarity tag */}
                <span
                  className={`mt-1 text-[10px] px-2 py-0.5 rounded-full capitalize font-medium ${
                    !isUnlocked
                      ? 'bg-sky-950 text-sky-700'
                      : treasure.rarity === 'legendary'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : treasure.rarity === 'rare'
                      ? 'bg-purple-400/20 text-purple-300 border border-purple-400/30'
                      : 'bg-sky-400/20 text-sky-300'
                  }`}
                >
                  {isUnlocked ? treasure.rarity : 'Undiscovered'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Detail Inspection Modal */}
        {selectedTreasure && (
          <div className="absolute inset-0 z-20 bg-[#0a1b2e]/98 rounded-3xl p-6 flex flex-col items-center justify-center text-center animate-scaleUp border border-sky-400/40">
            <button
              onClick={() => setSelectedTreasure(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-sky-300 hover:text-white hover:bg-sky-900/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-24 h-24 rounded-3xl bg-sky-400/20 border border-sky-300/40 flex items-center justify-center text-5xl mb-3 shadow-xl">
              {selectedTreasure.icon}
            </div>

            <span className="text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold bg-sky-400/20 text-sky-300 mb-1">
              {selectedTreasure.rarity} {selectedTreasure.type}
            </span>

            <h4 className="text-2xl font-bold text-white mb-2">{selectedTreasure.title}</h4>
            {selectedTreasure.author && (
              <p className="text-xs text-sky-300 mb-3 font-semibold">From {selectedTreasure.author}</p>
            )}

            <p className="text-sm text-sky-100/90 max-w-md mb-4 leading-relaxed">
              {selectedTreasure.description}
            </p>

            <div className="bg-sky-900/40 p-4 rounded-2xl border border-sky-700/40 italic text-sm text-amber-200/95 max-w-md mb-6 shadow-inner">
              {selectedTreasure.flavorText}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleShareQuote(selectedTreasure)}
                className="px-5 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-sky-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-sky-950" /> Copy & Share Card
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedTreasure(null)}
                className="px-5 py-2.5 rounded-xl glass-panel text-sky-200 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
