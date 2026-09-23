export type OtterState = 'idle' | 'sleeping' | 'grooming' | 'diving' | 'surfaced' | 'cracking';

export type TimeOfDay = 'aurora' | 'sunset' | 'night' | 'day';

export type TreasureType = 'postcard' | 'relic' | 'letter';

export type Rarity = 'common' | 'rare' | 'legendary';

export type Language = 'en' | 'zh';

export interface Treasure {
  id: string;
  title: string;
  title_zh?: string;
  type: TreasureType;
  rarity: Rarity;
  description: string;
  description_zh?: string;
  flavorText: string;
  flavorText_zh?: string;
  icon: string;
  imageUrl?: string;
  author?: string; // for postcards or letters
  author_zh?: string;
  unlockedAt?: number;
  effectType?: 'music' | 'light' | 'gem';
}

export interface AudioSettings {
  masterVolume: number;
  windVolume: number;
  fireVolume: number;
  wavesVolume: number;
  musicVolume: number;
  isMuted: boolean;
}

export interface CampDecorations {
  hasFairyLights: boolean;
  hasCozyQuilt: boolean;
  hasHotCocoa: boolean;
  hasGramophone: boolean;
}

export interface PlayerProgress {
  pearls: number;
  totalFocusMinutes: number;
  totalShellsCracked: number;
  unlockedTreasureIds: string[];
  decorations: CampDecorations;
  streakDays: number;
  lastPlayedDate: string;
}
