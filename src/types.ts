export type OtterState = 'idle' | 'sleeping' | 'grooming' | 'diving' | 'surfaced' | 'cracking';

export type TimeOfDay = 'aurora' | 'sunset' | 'night' | 'day';

export type TreasureType = 'postcard' | 'relic' | 'letter';

export type Rarity = 'common' | 'rare' | 'legendary';

export interface Treasure {
  id: string;
  title: string;
  type: TreasureType;
  rarity: Rarity;
  description: string;
  flavorText: string;
  icon: string;
  imageUrl?: string;
  author?: string; // for postcards or letters
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
