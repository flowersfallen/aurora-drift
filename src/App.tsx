import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  Maximize2,
  Sun,
  Moon,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { ArcticCanvas } from './components/ArcticCanvas';
import { IceOtter } from './components/IceOtter';
import { FocusTimer } from './components/FocusTimer';
import { ClamCrackingModal } from './components/ClamCrackingModal';
import { CollectionModal } from './components/CollectionModal';
import { AudioMixerModal } from './components/AudioMixerModal';
import { CampDecorModal } from './components/CampDecorModal';
import { ShareModal } from './components/ShareModal';
import { OtterState, TimeOfDay, PlayerProgress, AudioSettings, Treasure } from './types';
import { ALL_TREASURES } from './data/treasures';
import { audioEngine } from './services/audioEngine';

const STORAGE_KEY_PROGRESS = 'aurora_drift_progress_v1';
const STORAGE_KEY_AUDIO = 'aurora_drift_audio_v1';

const DEFAULT_PROGRESS: PlayerProgress = {
  pearls: 20,
  totalFocusMinutes: 0,
  totalShellsCracked: 1,
  unlockedTreasureIds: ['postcard-aurora-fox'],
  decorations: {
    hasHotCocoa: true,
    hasFairyLights: false,
    hasCozyQuilt: false,
    hasGramophone: false,
  },
  streakDays: 1,
  lastPlayedDate: new Date().toISOString(),
};

const DEFAULT_AUDIO: AudioSettings = {
  masterVolume: 0.7,
  windVolume: 0.35,
  fireVolume: 0.45,
  wavesVolume: 0.4,
  musicVolume: 0.45,
  isMuted: false,
};

export const App: React.FC = () => {
  // State
  const [otterState, setOtterState] = useState<OtterState>('idle');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('aurora');

  // Persistence: Player Progress
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return saved ? { ...DEFAULT_PROGRESS, ...JSON.parse(saved) } : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  // Persistence: Audio Settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUDIO);
      return saved ? { ...DEFAULT_AUDIO, ...JSON.parse(saved) } : DEFAULT_AUDIO;
    } catch {
      return DEFAULT_AUDIO;
    }
  });

  // Modals
  const [activeModal, setActiveModal] = useState<'collection' | 'audio' | 'decor' | 'info' | 'share' | null>(null);
  const [shareTreasure, setShareTreasure] = useState<Treasure | null>(null);
  const [currentTreasure, setCurrentTreasure] = useState<Treasure | null>(null);

  // Save Progress
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  }, [progress]);

  // Save Audio
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AUDIO, JSON.stringify(audioSettings));
  }, [audioSettings]);

  // Cross-browser & iOS Safari dynamic viewport height handler
  useEffect(() => {
    const updateAppHeight = () => {
      const vh = window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
    };

    updateAppHeight();
    window.addEventListener('resize', updateAppHeight);
    window.addEventListener('orientationchange', updateAppHeight);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateAppHeight);
    }

    return () => {
      window.removeEventListener('resize', updateAppHeight);
      window.removeEventListener('orientationchange', updateAppHeight);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateAppHeight);
      }
    };
  }, []);

  // Start Dive Handler
  const handleStartDive = (durationMinutes: number) => {
    audioEngine.init();
    audioEngine.playBubbleSplash();
    setOtterState('diving');
    setProgress((prev) => ({
      ...prev,
      totalFocusMinutes: prev.totalFocusMinutes + durationMinutes,
    }));
  };

  // Cancel Dive Handler
  const handleCancelDive = () => {
    setOtterState('idle');
  };

  // Complete Dive Handler (Surfaced with Clam!)
  const handleCompleteDive = () => {
    // Pick next treasure (prefer undiscovered items)
    const undiscovered = ALL_TREASURES.filter((t) => !progress.unlockedTreasureIds.includes(t.id));
    const pool = undiscovered.length > 0 ? undiscovered : ALL_TREASURES;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    setCurrentTreasure(selected);
    setOtterState('surfaced');
  };

  // Clam Cracking modal closed
  const handleCrackingClosed = (unlockedTreasure: Treasure, earnedPearls: number) => {
    setCurrentTreasure(null);
    setOtterState('idle');

    setProgress((prev) => {
      const ids = prev.unlockedTreasureIds.includes(unlockedTreasure.id)
        ? prev.unlockedTreasureIds
        : [...prev.unlockedTreasureIds, unlockedTreasure.id];
      return {
        ...prev,
        pearls: prev.pearls + earnedPearls,
        totalShellsCracked: prev.totalShellsCracked + 1,
        unlockedTreasureIds: ids,
      };
    });
  };

  // Unlock Camp Decor
  const handleUnlockDecor = (itemKey: keyof PlayerProgress['decorations'], cost: number) => {
    if (progress.pearls < cost) return;
    setProgress((prev) => ({
      ...prev,
      pearls: prev.pearls - cost,
      decorations: {
        ...prev.decorations,
        [itemKey]: true,
      },
    }));
    audioEngine.playGentleChime(784, 1.8);
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative w-full app-viewport overflow-x-hidden flex flex-col justify-between select-none">
      {/* 1. Dynamic Canvas Layer (Aurora, Stars, Snow, Waves) */}
      <ArcticCanvas timeOfDay={timeOfDay} isDiving={otterState === 'diving'} />

      {/* 2. Top Header Navigation Bar */}
      <header className="relative z-30 px-4 sm:px-6 pt-[max(0.5rem,env(safe-area-inset-top))] pb-1 sm:py-3 flex items-center justify-between w-full max-w-6xl mx-auto">
        {/* Brand & Mascot */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-sky-950/80 border border-sky-400/40 flex items-center justify-center shadow-lg overflow-hidden p-0.5 shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
              <defs>
                <linearGradient id="logoIceTop" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="100%" stopColor="#bae6fd" />
                </linearGradient>
                <linearGradient id="logoIceFront" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7dd3fc" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* Tiny Ears (Centered around Y=17) */}
              <ellipse cx="20" cy="17" rx="4.5" ry="6" fill="#3c4556" stroke="#2e384d" strokeWidth="2" transform="rotate(-18 20 17)" />
              <ellipse cx="44" cy="17" rx="4.5" ry="6" fill="#3c4556" stroke="#2e384d" strokeWidth="2" transform="rotate(18 44 17)" />

              {/* Chubby Cream Body / Head (Centered Y=13 to 53) */}
              <path
                d="M 21 21
                   C 21 13 43 13 43 21
                   C 43 27 48 37 46 47
                   C 44 53 20 53 18 47
                   C 16 37 21 27 21 21 Z"
                fill="#fdfbf7"
                stroke="#2e384d"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />

              {/* Whiskers */}
              <path d="M 14 29 Q 18 30 22 30" stroke="#2e384d" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              <path d="M 14 34 Q 18 34 22 33" stroke="#2e384d" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              <path d="M 50 29 Q 46 30 42 30" stroke="#2e384d" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              <path d="M 50 34 Q 46 34 42 33" stroke="#2e384d" strokeWidth="1.4" strokeLinecap="round" fill="none" />

              {/* Eyes with twinkle */}
              <ellipse cx="27" cy="27" rx="2" ry="2.8" fill="#2e384d" />
              <circle cx="26.3" cy="25.8" r="0.7" fill="#ffffff" />
              <ellipse cx="37" cy="27" rx="2" ry="2.8" fill="#2e384d" />
              <circle cx="36.3" cy="25.8" r="0.7" fill="#ffffff" />

              {/* Soft Blush */}
              <ellipse cx="22" cy="30" rx="3.5" ry="2" fill="#fecdd3" opacity="0.9" />
              <ellipse cx="42" cy="30" rx="3.5" ry="2" fill="#fecdd3" opacity="0.9" />

              {/* Cute Nose & Mouth */}
              <path d="M 30.5 28.5 Q 32 27.5 33.5 28.5 Q 32 30.5 30.5 28.5 Z" fill="#2e384d" />

              {/* Mini Isometric Glowing Ice Cube (Centered at X=32, Y=37 to 51) */}
              <polygon points="32,37 39,41 32,45 25,41" fill="url(#logoIceTop)" stroke="#60a5fa" strokeWidth="1.2" strokeLinejoin="round" />
              <polygon points="25,41 32,45 32,51 25,47" fill="url(#logoIceFront)" stroke="#60a5fa" strokeWidth="1.2" strokeLinejoin="round" />
              <polygon points="32,45 39,41 39,47 32,51" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1.2" strokeLinejoin="round" />
              <polygon points="32,38.5 36,40.5 32,42.5 28,40.5" fill="#ffffff" opacity="0.75" />

              {/* Paws hugging ice cube */}
              <path d="M 23 42 C 26 42 28 45 25 49" stroke="#2e384d" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 41 42 C 38 42 36 45 39 49" stroke="#2e384d" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <div>
            <h1 className="text-xs sm:text-base font-bold text-white tracking-wide flex items-center gap-1.5 sm:gap-2 leading-none whitespace-nowrap">
              <span>Aurora Drift</span>
              <span className="hidden sm:inline-flex items-center justify-center h-[18px] px-2 text-[10px] font-semibold leading-none rounded-full bg-sky-400/20 text-sky-300 border border-sky-400/30 self-center">
                Cozy Web
              </span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-sky-300/80 font-medium leading-none mt-1">iceotter.com</p>
          </div>
        </div>

        {/* Currency & Quick Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Pearls Currency Badge */}
          <div
            onClick={() => setActiveModal('decor')}
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl glass-panel text-[11px] sm:text-xs font-bold text-amber-300 hover:scale-105 cursor-pointer transition-all border border-amber-400/30 shrink-0"
            title="Your Ice Pearls - Click to open Camp Shop"
          >
            <span>🦪</span>
            <span>{progress.pearls}</span>
          </div>

          {/* Sky / Time Switcher (Mobile: 1-click cycle button; Desktop: 3-button segmented pill) */}
          <div className="flex items-center shrink-0">
            {/* Mobile: single cycle button */}
            <button
              onClick={() => {
                const next = timeOfDay === 'aurora' ? 'sunset' : timeOfDay === 'sunset' ? 'night' : 'aurora';
                setTimeOfDay(next);
              }}
              className="sm:hidden p-1.5 rounded-2xl glass-panel text-xs flex items-center justify-center border border-sky-800/50 shadow-sm transition-transform active:scale-95 shrink-0"
              title={`Theme: ${timeOfDay} - Tap to cycle sky`}
            >
              {timeOfDay === 'aurora' && <Sparkles className="w-3.5 h-3.5 text-sky-400" />}
              {timeOfDay === 'sunset' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
              {timeOfDay === 'night' && <Moon className="w-3.5 h-3.5 text-indigo-300" />}
            </button>

            {/* Desktop: 3-button segmented pill */}
            <div className="hidden sm:flex items-center glass-panel rounded-2xl p-0.5 sm:p-1 border border-sky-800/40">
              <button
                onClick={() => setTimeOfDay('aurora')}
                className={`p-1 sm:p-1.5 rounded-xl text-xs transition-all border-none outline-none ${
                  timeOfDay === 'aurora' ? 'bg-sky-400 text-sky-950 shadow-sm' : 'bg-transparent text-sky-300 hover:text-white'
                }`}
                title="Northern Lights Aurora"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTimeOfDay('sunset')}
                className={`p-1 sm:p-1.5 rounded-xl text-xs transition-all border-none outline-none ${
                  timeOfDay === 'sunset' ? 'bg-amber-400 text-amber-950 shadow-sm' : 'bg-transparent text-sky-300 hover:text-white'
                }`}
                title="Polar Sunset"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTimeOfDay('night')}
                className={`p-1 sm:p-1.5 rounded-xl text-xs transition-all border-none outline-none ${
                  timeOfDay === 'night' ? 'bg-indigo-400 text-indigo-950 shadow-sm' : 'bg-transparent text-sky-300 hover:text-white'
                }`}
                title="Quiet Midnight"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sound Mixer Toggle */}
          <button
            onClick={() => {
              audioEngine.init();
              setActiveModal('audio');
            }}
            className="p-1.5 sm:p-2 rounded-2xl glass-panel text-sky-300 hover:text-white transition-all hover:scale-105 shrink-0"
            title="Ambient Sound Mixer"
          >
            {audioSettings.isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Collection Album Button (Mobile: icon with corner badge; Desktop: text pill) */}
          <button
            onClick={() => setActiveModal('collection')}
            className="relative p-1.5 sm:px-3 sm:py-1.5 rounded-2xl glass-panel text-xs font-semibold text-sky-200 hover:text-white hover:scale-105 transition-all border border-sky-400/30 flex items-center sm:gap-1.5 shrink-0"
            title="Open Polar Memory Album"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
            <span className="hidden sm:inline">Album</span>
            <span className="absolute -top-1 -right-1 sm:static sm:top-auto sm:right-auto bg-sky-400 text-sky-950 text-[9px] sm:text-[10px] font-black w-3.5 h-3.5 sm:w-auto sm:h-auto sm:px-1.5 sm:py-0.2 rounded-full flex items-center justify-center shadow-sm">
              {progress.unlockedTreasureIds.length}
            </span>
          </button>

          {/* Info Modal */}
          <button
            onClick={() => setActiveModal('info')}
            className="p-1.5 sm:p-2 rounded-2xl glass-panel text-sky-300 hover:text-white transition-all shrink-0"
            title="About Ice Otter"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Share Poster Generator (Desktop) */}
          <button
            onClick={() => {
              setShareTreasure(null);
              setActiveModal('share');
            }}
            className="hidden sm:flex p-1.5 sm:p-2 rounded-2xl glass-panel text-sky-300 hover:text-white transition-all hover:scale-105 shrink-0"
            title="Share & Generate Poster"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden md:block p-2 rounded-2xl glass-panel text-sky-300 hover:text-white transition-all shrink-0"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. Center Interactive World (Ice Otter & Floating Campsite) */}
      <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center my-auto py-1 sm:py-4">
        <IceOtter
          state={otterState}
          decorations={progress.decorations}
          onOtterClick={() => {
            audioEngine.init();
            if (otterState === 'surfaced') {
              // Directly open the cracking ritual modal
              setActiveModal(null);
            }
          }}
        />
      </main>

      {/* 4. Bottom Focus & Dive Control Dock */}
      <footer className="relative z-30 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pb-6 px-3 sm:px-4 w-full">
        <FocusTimer
          otterState={otterState}
          onStartDive={handleStartDive}
          onCancelDive={handleCancelDive}
          onCompleteDive={handleCompleteDive}
        />
      </footer>

      {/* --- MODALS & DIALOGS --- */}

      {/* Clam Cracking Climax Ritual Modal */}
      {otterState === 'surfaced' && currentTreasure && (
        <ClamCrackingModal
          treasure={currentTreasure}
          onClose={handleCrackingClosed}
        />
      )}

      {/* Collection Album Modal */}
      {activeModal === 'collection' && (
        <CollectionModal
          unlockedIds={progress.unlockedTreasureIds}
          onShareTreasure={(t) => {
            setShareTreasure(t);
            setActiveModal('share');
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Audio Mixer Modal */}
      {activeModal === 'audio' && (
        <AudioMixerModal
          settings={audioSettings}
          onUpdateSettings={(newSettings) => setAudioSettings(newSettings)}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Camp Decor Modal */}
      {activeModal === 'decor' && (
        <CampDecorModal
          pearls={progress.pearls}
          decorations={progress.decorations}
          onUnlockItem={handleUnlockDecor}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Share Poster Generator Modal */}
      {activeModal === 'share' && (
        <ShareModal
          treasure={shareTreasure}
          progress={progress}
          onClose={() => {
            setActiveModal(null);
            setShareTreasure(null);
          }}
        />
      )}

      {/* About / Vision Modal */}
      {activeModal === 'info' && (
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#0a1b2e] rounded-3xl p-6 text-center flex flex-col items-center border border-sky-400/40 shadow-2xl modal-crisp"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-400/20 border border-sky-300/30 flex items-center justify-center text-3xl mb-3 shadow-inner">
              🦦
            </div>
            <h3 className="text-xl font-bold text-white mb-1">About Aurora Drift</h3>
            <p className="text-xs text-sky-300 font-semibold mb-3">Crafted for iceotter.com</p>

            <div className="text-xs text-sky-100/90 space-y-2.5 text-left bg-sky-950/60 p-4 rounded-2xl border border-sky-800/40 mb-4 leading-relaxed">
              <p>
                ❄️ <strong>Cozy Ambient Focus:</strong> A peaceful haven designed for deep work, study, or simple relaxation.
              </p>
              <p>
                🤿 <strong>The Arctic Dive:</strong> While you focus, your little Ice Otter explores the deep glacial waters and returns with mysterious shells.
              </p>
              <p>
                ✨ <strong>Tactile ASMR:</strong> Tap with your lucky pebble to crack shells and uncover 16 collectible polar postcards, ancient relics, and heartwarming bottle letters.
              </p>
              <p className="text-amber-200/90 italic">
                “Slide on your belly whenever you find snow. Keep your favourite stone close.”
              </p>
            </div>

            <button
              onClick={() => {
                setShareTreasure(null);
                setActiveModal('share');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-teal-300 hover:from-sky-300 hover:to-teal-200 text-sky-950 font-bold text-xs shadow-lg transition-all mb-2 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4" /> Generate Share Poster
            </button>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 rounded-xl bg-sky-900/60 hover:bg-sky-800 text-sky-200 font-semibold text-xs border border-sky-700/50 transition-all"
            >
              Back to Campsite
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
