import React from 'react';
import { X, Volume2, VolumeX, Wind, Flame, Waves, Music, Sparkles } from 'lucide-react';
import { AudioSettings } from '../types';
import { audioEngine } from '../services/audioEngine';

interface AudioMixerModalProps {
  settings: AudioSettings;
  onUpdateSettings: (newSettings: AudioSettings) => void;
  onClose: () => void;
}

export const AudioMixerModal: React.FC<AudioMixerModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const handleVolumeChange = (key: keyof AudioSettings, val: number) => {
    const updated = { ...settings, [key]: val };
    onUpdateSettings(updated);

    audioEngine.init();
    if (key === 'masterVolume') audioEngine.setMasterVolume(val);
    if (key === 'windVolume') audioEngine.setWindVolume(val);
    if (key === 'fireVolume') audioEngine.setFireVolume(val);
    if (key === 'wavesVolume') audioEngine.setWavesVolume(val);
    if (key === 'musicVolume') audioEngine.setMusicVolume(val);
  };

  const toggleMute = () => {
    const nextMuted = !settings.isMuted;
    onUpdateSettings({ ...settings, isMuted: nextMuted });
    audioEngine.setMasterVolume(nextMuted ? 0 : settings.masterVolume);
  };

  const soundChannels = [
    {
      key: 'windVolume' as const,
      label: 'Arctic Wind',
      icon: Wind,
      color: 'text-sky-300',
      val: settings.windVolume,
    },
    {
      key: 'fireVolume' as const,
      label: 'Campfire Crackle',
      icon: Flame,
      color: 'text-amber-400',
      val: settings.fireVolume,
    },
    {
      key: 'wavesVolume' as const,
      label: 'Ocean Waves',
      icon: Waves,
      color: 'text-teal-300',
      val: settings.wavesVolume,
    },
    {
      key: 'musicVolume' as const,
      label: 'Lo-fi Chimes',
      icon: Music,
      color: 'text-purple-300',
      val: settings.musicVolume,
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[calc(var(--app-height,100svh)-2rem)] sm:max-h-[88vh] bg-[#0a1b2e] rounded-3xl p-4 sm:p-6 flex flex-col overflow-hidden border border-sky-400/40 shadow-2xl modal-crisp"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-sky-800/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Ambient Sound Mixer</h3>
              <p className="text-[11px] sm:text-xs text-sky-300/80">Craft your personal arctic focus sanctuary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sky-400 hover:text-white hover:bg-sky-800/40 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Mute & Volume */}
        <div className="py-3 border-b border-sky-900/40 flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleMute}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                settings.isMuted
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                  : 'bg-sky-500/20 text-sky-200 border border-sky-400/30'
              }`}
            >
              {settings.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {settings.isMuted ? 'Muted' : 'Sound Active'}
            </button>

            <div className="flex items-center gap-1.5 text-xs text-sky-300/80 font-semibold">
              <span>Master Volume:</span>
              <span className="font-mono text-white text-xs w-9 text-right font-bold">
                {settings.isMuted ? '0%' : `${Math.round(settings.masterVolume * 100)}%`}
              </span>
            </div>
          </div>

          <div className="w-full px-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.isMuted ? 0 : settings.masterVolume}
              onChange={(e) => handleVolumeChange('masterVolume', parseFloat(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Individual Sound Sliders */}
        <div
          className="flex-1 min-h-0 flex flex-col gap-3 sm:gap-4 py-3 overflow-y-auto pr-1 modal-scrollbar overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {soundChannels.map((ch) => {
            const IconComp = ch.icon;
            return (
              <div key={ch.key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <IconComp className={`w-4 h-4 ${ch.color}`} />
                    <span>{ch.label}</span>
                  </div>
                  <span className="text-[11px] text-sky-300/90 font-mono font-bold">
                    {Math.round(ch.val * 100)}%
                  </span>
                </div>
                <div className="w-full px-1">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ch.val}
                    onChange={(e) => handleVolumeChange(ch.key, parseFloat(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Play chime test button */}
        <button
          onClick={() => audioEngine.playGentleChime(587.33, 2.5)}
          className="mt-2 py-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-700/40 text-xs font-semibold text-sky-300 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" /> Play Gentle Kalimba Chime
        </button>
      </div>
    </div>
  );
};
