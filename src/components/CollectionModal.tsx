import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Compass, Mail, Lock, Heart, Check } from 'lucide-react';
import { Treasure, TreasureType, Language } from '../types';
import { ALL_TREASURES } from '../data/treasures';
import { TRANSLATIONS } from '../i18n/translations';

interface CollectionModalProps {
  unlockedIds: string[];
  onClose: () => void;
  onShareTreasure?: (treasure: Treasure) => void;
  lang?: Language;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({ unlockedIds, onClose, onShareTreasure, lang = 'en' }) => {
  const [activeTab, setActiveTab] = useState<TreasureType | 'all'>('all');
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null);
  const [copied, setCopied] = useState(false);

  const t = TRANSLATIONS[lang].album;

  const filteredTreasures = ALL_TREASURES.filter((tr) => {
    if (activeTab === 'all') return true;
    return tr.type === activeTab;
  });

  const unlockedCount = unlockedIds.length;
  const totalCount = ALL_TREASURES.length;

  const handleShareQuote = (treasure: Treasure) => {
    const title = lang === 'zh' && treasure.title_zh ? treasure.title_zh : treasure.title;
    const flavor = lang === 'zh' && treasure.flavorText_zh ? treasure.flavorText_zh : treasure.flavorText;
    const text =
      lang === 'zh'
        ? `❄️ 极光水獭找到了珍宝：【${title}】\n${flavor}\n—— 发现于 Aurora Drift 极光漂流 (iceotter.com) 🦦✨`
        : `❄️ Ice Otter found: "${title}"\n${flavor}\n— Discovered in Aurora Drift at iceotter.com 🦦✨`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch {}
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn touch-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[calc(var(--app-height,100svh)-2rem)] sm:max-h-[88vh] bg-[#0a1b2e] rounded-3xl p-4 sm:p-6 flex flex-col overflow-hidden border border-sky-400/40 shadow-2xl modal-crisp touch-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-sky-800/50 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4.5">
            <div className="p-2 sm:p-3 rounded-2xl bg-sky-900/80 text-sky-300 border border-sky-500/40 shadow-sm shrink-0 mr-1">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
                {t.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-sky-300 font-medium mt-0.5">
                {t.unlockedCount
                  .replace('{count}', unlockedCount.toString())
                  .replace('{total}', totalCount.toString())
                  .replace('{percent}', Math.round((unlockedCount / totalCount) * 100).toString())}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sky-300 hover:text-white hover:bg-sky-800/50 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 sm:gap-3.5 py-2.5 sm:py-3.5 px-0.5 overflow-x-auto no-scrollbar scrollbar-none shrink-0">
          {[
            { id: 'all', label: t.tabs.all.label, shortLabel: t.tabs.all.shortLabel, icon: Sparkles },
            { id: 'postcard', label: t.tabs.postcard.label, shortLabel: t.tabs.postcard.shortLabel, icon: BookOpen },
            { id: 'relic', label: t.tabs.relic.label, shortLabel: t.tabs.relic.shortLabel, icon: Compass },
            { id: 'letter', label: t.tabs.letter.label, shortLabel: t.tabs.letter.shortLabel, icon: Mail },
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
        <div
          className="flex-1 min-h-0 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 py-2 modal-scrollbar overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {filteredTreasures.map((treasure) => {
            const isUnlocked = unlockedIds.includes(treasure.id);
            const treasureTitle = isUnlocked
              ? (lang === 'zh' && treasure.title_zh ? treasure.title_zh : treasure.title)
              : '???';
            const rarityLabel = isUnlocked
              ? t.rarity[treasure.rarity as 'common' | 'rare' | 'legendary'] || treasure.rarity
              : lang === 'zh'
              ? '未探索'
              : 'Undiscovered';

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
                  {treasureTitle}
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
                  {rarityLabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Detail Inspection Modal */}
        {selectedTreasure && (
          <div
            style={{ backgroundColor: '#07172b', WebkitOverflowScrolling: 'touch' }}
            className="absolute inset-0 z-30 bg-[#07172b] rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center text-center animate-scaleUp border-2 border-sky-400/50 shadow-2xl overflow-y-auto modal-scrollbar overscroll-contain"
          >
            <button
              onClick={() => setSelectedTreasure(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-xl text-sky-300 hover:text-white bg-sky-900/70 hover:bg-sky-800/80 border border-sky-700/50 shadow-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-sky-400/20 border border-sky-300/40 flex items-center justify-center text-4xl sm:text-5xl mb-2 sm:mb-3 shadow-xl shrink-0 mt-auto">
              {selectedTreasure.icon}
            </div>

            <span className="text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold bg-sky-400/20 text-sky-300 mb-1">
              {t.rarity[selectedTreasure.rarity as 'common' | 'rare' | 'legendary'] || selectedTreasure.rarity}{' '}
              {t.tabs[selectedTreasure.type as 'postcard' | 'relic' | 'letter']?.shortLabel || selectedTreasure.type}
            </span>

            <h4 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {lang === 'zh' && selectedTreasure.title_zh ? selectedTreasure.title_zh : selectedTreasure.title}
            </h4>
            {selectedTreasure.author && (
              <p className="text-xs text-sky-300 mb-2 sm:mb-3 font-semibold">
                {t.fromAuthor.replace(
                  '{author}',
                  lang === 'zh' && selectedTreasure.author_zh ? selectedTreasure.author_zh : selectedTreasure.author
                )}
              </p>
            )}

            <p className="text-xs sm:text-sm text-sky-100/90 max-w-md mb-3 sm:mb-4 leading-relaxed px-2">
              {lang === 'zh' && selectedTreasure.description_zh
                ? selectedTreasure.description_zh
                : selectedTreasure.description}
            </p>

            <div className="bg-sky-950/80 p-3 sm:p-4 rounded-2xl border border-sky-700/50 italic text-xs sm:text-sm text-amber-200/95 max-w-md mb-4 sm:mb-6 shadow-inner mx-2">
              {lang === 'zh' && selectedTreasure.flavorText_zh
                ? selectedTreasure.flavorText_zh
                : selectedTreasure.flavorText}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-auto">
              {onShareTreasure && (
                <button
                  onClick={() => onShareTreasure(selectedTreasure)}
                  className="px-4 py-2 sm:py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-sky-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  {t.generatePoster}
                </button>
              )}
              <button
                onClick={() => handleShareQuote(selectedTreasure)}
                className="px-3.5 py-2 sm:py-2.5 rounded-xl bg-sky-900/70 hover:bg-sky-800 text-sky-200 border border-sky-600/40 font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> {t.copied}
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 text-sky-300" /> {t.copyQuote}
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedTreasure(null)}
                className="px-3.5 py-2 sm:py-2.5 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-800/60 text-sky-300 hover:text-white text-xs font-semibold transition-all active:scale-95"
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
