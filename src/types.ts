export const PLAYTHROUGH_TYPES = [
  "100% Walkthrough",
  "Blind Playthrough",
  "Challenge Run",
  "Ongoing",
  "Lore & Story Walkthrough",
  "Speedrun",
  "Modded Run",
  "Other",
] as const;

export type PlaythroughTypeOption = (typeof PLAYTHROUGH_TYPES)[number];

export type QuestCategory = "Main Story" | "Side Quest" | "Character Arc" | "Secret/Optional" | "Point of No Return";
export type QuestStatus = "planned" | "in_progress" | "completed" | "missed";

export interface QuestEntry {
  id: string;
  title: string;
  category: QuestCategory;
  actOrWorld: string; // e.g. "World of Balance", "Act 1", "Limgrave", "World of Ruin"
  location: string;
  episodePart?: number; // Linked episode number e.g. Part 12
  recommendedLevel?: string;
  prerequisites?: string; // e.g. "Needs Rust Key", "Recruit Shadow first"
  keyRewards?: string; // e.g. "Excalibur", "Shadow's Memory", "Esper Bahamut"
  isMissable: boolean;
  status: QuestStatus;
  notes?: string;
}

export interface PlaythroughSeries {
  id: string;
  gameTitle: string;
  gameTitleLogo?: string; // DataURL or image URL for custom game title logo
  useTitleLogo?: boolean; // Toggles displaying image logo vs plain text (default true if logo exists)
  gameSynopsis?: string; // AI web-scraped plot & story overview of the active game
  gameSynopsisSource?: string; // e.g. "Web Scraped via Google Search Grounding"
  synopsis?: string; // Compatibility alias
  synopsisSource?: string; // Compatibility alias
  subtitle: string;
  badgeText: string;
  accentColor: string;
  coverImage?: string;
  genre?: string;
  playthroughType?: string; // e.g., "Blind Playthrough", "100% Walkthrough", "Challenge Run", or custom
  createdAt?: string; // e.g., "2026-08-01" or ISO date string
  episodes: Episode[];
  quests?: QuestEntry[];
}

export type EpisodeStatus = "not_started" | "recorded" | "edited" | "uploaded" | "published";

export interface Chapter {
  timestamp: string; // "00:00" format
  title: string;
}

export interface VideoStats {
  views: number;
  likes: number;
  comments: number;
  lastUpdated?: string;
  videoId?: string;
}

export interface Episode {
  id: number;
  partNumber: number;
  world: string; // e.g. "World of Balance", "Main Quest", "Limgrave", "Act I"
  title: string;
  shortTitle: string;
  altTitles: string[];
  estDurationMinutes: number; // e.g., 90 - 120
  startPoint: string;
  endPoint: string;
  keyEvents: string[];
  keyItemsAndEspers: string[];
  partyMembers: string[];
  heroAvatars?: Record<string, string>; // Maps hero name to uploaded avatar image URL or data URL
  status: EpisodeStatus;
  
  // YouTube Fields & Analytics
  description: string;
  chapters: Chapter[];
  tags: string[];
  youtubeVideoId?: string;
  videoStats?: VideoStats;
  
  // Thumbnail Customization
  thumbnailConfig: {
    backgroundPreset: string;
    featuredCharacter: string;
    overlayText: string;
    subText?: string;
    themeColor: string;
    customImage?: string;
  };

  // Strategy & Notes
  bossStrategies?: string[];
  equipmentNotes?: string;
  thumbnailText?: string;
  suggestedThumbnailPrompt?: string;
  missableAlerts?: MissableAlert[];
}

export interface MissableAlert {
  id?: string;
  episodePart?: number; // Optional reference to which episode it belongs
  itemName: string;
  category: "Weapon" | "Armor" | "Tool" | "Rune" | "Gesture" | "Key Item" | "NPC Quest" | "Secret Area" | "Boss / Ending" | "Collectible" | "Ability / Magic" | "Trophy / Achievement";
  location: string;
  howToGet: string;
  lockoutTrigger: string; // Point of No Return / trigger that permanently disables this item
  warning: string; // Emphasizes permanent unavailability if not obtained right here
  isSecured?: boolean; // User checkoff tracking
}

export interface BossEntry {
  id: string;
  name: string;
  episodePart: number;
  location: string;
  world: string;
  hp: string;
  weakness: string;
  stealCommon: string;
  stealRare: string;
  dropLoot: string;
  strategyTip: string;
  isMissable: boolean;
  defeated: boolean;
}

export interface LootEntry {
  id: string;
  name: string;
  category: "Esper" | "Tool" | "Key Item" | "Relic" | "Missable Chest" | "Weapon/Armor";
  episodePart: number;
  location: string;
  description: string;
  isMissable: boolean;
  collected: boolean;
}

export interface ThumbnailConfig {
  backgroundPreset: string;
  featuredCharacter: string;
  overlayText: string;
  subText?: string;
  themeColor: string;
  showEpisodeBadge: boolean;
  showLogo: boolean;
  showDuration: boolean;
  customImage?: string;

  // Title Position & Sizing
  titleX?: number; // 0 to 1280 (default ~70)
  titleY?: number; // 0 to 720 (default ~480)
  titleFontSize?: number; // 20 to 120 (default ~64)
  titleRotation?: number; // -30 to 30 (default 0)
  titleFontFamily?: string; // 'sans', 'impact', 'bebas', 'cinematic', 'serif', 'futuristic', 'comic', 'brush', 'anton', 'display', 'mono'
  titleStrokeWidth?: number; // 0 to 12 (default 0 or 4)
  titleStrokeColor?: string; // e.g. '#000000'
  titleColor?: string; // Fill color (default #ffffff)

  // Subtitle Position & Sizing
  subX?: number; // 0 to 1280 (default ~70)
  subY?: number; // 0 to 720 (default ~535)
  subFontSize?: number; // 12 to 60 (default ~28)
  subRotation?: number; // -30 to 30
  subColor?: string;
  subFontFamily?: string; // 'sans', 'impact', 'bebas', 'cinematic', 'serif', 'futuristic', 'comic', 'brush', 'anton', 'display', 'mono'
  subStrokeWidth?: number; // 0 to 12 (default 0 or 2)
  subStrokeColor?: string; // e.g. '#000000'

  // Episode Badge Position & Sizing
  badgeX?: number; // 0 to 1280 (default ~1080)
  badgeY?: number; // 0 to 720 (default ~65)
  badgeScale?: number; // 0.5 to 2.0 (default 1.0)
  badgeStyle?: "pill" | "banner" | "box" | "shield" | "hexagon" | "ribbon" | "diamond" | "starburst" | "circle" | "tag";
  badgeColor?: string; // Fill color for the badge shape (default themeColor)
  badgeTextColor?: string; // Fill color for the episode badge text (default #020617)

  // Character Graphic / Watermark Position & Sizing
  charX?: number; // 0 to 1280 (default ~900)
  charY?: number; // 0 to 720 (default ~380)
  charScale?: number; // 0.5 to 2.5 (default 1.0)

  // Background Adjustments
  overlayOpacity?: number; // 0 to 0.9 (default 0.4)
  frameStyle?:
    | "snes"
    | "neon"
    | "minimal"
    | "gold_rpg"
    | "cyber_glitch"
    | "anime_speed"
    | "vintage_crt"
    | "boss_flame"
    | "double_line"
    | "gradient_glow"
    | "tech_corner"
    | "comic_action"
    | "royal_crest"
    | "arcadium"
    | "polaroid_card"
    | "cyber_circuit"
    | "retro_vhs"
    | "heavy_metal"
    | "manga_halftone"
    | "eldritch_portal"
    | "none";
}

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";
export type AchievementCategory = "production" | "seo" | "thumbnail" | "lore_boss" | "branding";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number; // Gamerscore value
  category: AchievementCategory;
  rarity: AchievementRarity;
  iconName: string; // Lucide icon identifier
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string; // ISO date string or formatted date
  secret?: boolean; // Secret achievement badge
}

export interface AchievementUnlockToastData {
  achievement: Achievement;
  timestamp: number;
}

