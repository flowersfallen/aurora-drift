export type OtterState = 'idle' | 'sleeping' | 'grooming' | 'diving' | 'surfaced' | 'cracking' | 'cruising';

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

export type WaypointId = 'still_floe' | 'echo_straits' | 'lighthouse' | 'aurora_oasis';

export interface DriftWaypoint {
  id: WaypointId;
  name: string;
  name_zh: string;
  requiredMiles: number;
  subtitle: string;
  subtitle_zh: string;
  description: string;
  description_zh: string;
  story: string;
  story_zh: string;
  icon: string;
  guestId?: string;
  rewardText: string;
  rewardText_zh: string;
}

export interface PlayerProgress {
  pearls: number;
  totalFocusMinutes: number;
  totalShellsCracked: number;
  unlockedTreasureIds: string[];
  decorations: CampDecorations;
  streakDays: number;
  lastPlayedDate: string;
  driftMiles?: number;
  visitedWaypointIds?: string[];
}
