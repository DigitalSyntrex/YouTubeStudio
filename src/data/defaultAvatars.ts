// 56 Creator Avatars served exclusively from /main/public/avatars_128

export type AvatarCategory = "Gaming & Genres" | "Cyber & Heroes" | "Icons & Mythos" | "Gear & Tech";

export interface CreatorAvatarPreset {
  id: string;
  name: string;
  role: string;
  color: string;
  url: string;
  category: AvatarCategory;
}

export const AVATAR_DIR = "/main/public/avatars_128";

export function getAvatarAssetUrl(id: string): string {
  const cleanId = id.toLowerCase().trim();
  return `${AVATAR_DIR}/${cleanId}.png`;
}

export const DEFAULT_CREATOR_AVATARS: CreatorAvatarPreset[] = [
  // --- Cyber & Heroes ---
  {
    id: "cyber",
    name: "Cyber",
    role: "Cyber Visor",
    color: "#00f2fe",
    url: "/main/public/avatars_128/cyber.png",
    category: "Cyber & Heroes",
  },
  {
    id: "action",
    name: "Action",
    role: "Action Hero",
    color: "#f97316",
    url: "/main/public/avatars_128/action.png",
    category: "Cyber & Heroes",
  },
  {
    id: "brawler",
    name: "Brawler",
    role: "Combat Brawler",
    color: "#ef4444",
    url: "/main/public/avatars_128/brawler.png",
    category: "Cyber & Heroes",
  },
  {
    id: "fighting",
    name: "Fighting",
    role: "Fighter Pro",
    color: "#f59e0b",
    url: "/main/public/avatars_128/fighting.png",
    category: "Cyber & Heroes",
  },
  {
    id: "scispace",
    name: "SciSpace",
    role: "Cosmic Vanguard",
    color: "#06b6d4",
    url: "/main/public/avatars_128/scispace.png",
    category: "Cyber & Heroes",
  },
  {
    id: "ruti",
    name: "Ruti",
    role: "Companion Ruti",
    color: "#06b6d4",
    url: "/main/public/avatars_128/ruti.png",
    category: "Cyber & Heroes",
  },
  {
    id: "baxter",
    name: "Baxter",
    role: "Guardian Baxter",
    color: "#f59e0b",
    url: "/main/public/avatars_128/baxter.png",
    category: "Cyber & Heroes",
  },
  {
    id: "blitz",
    name: "Blitz",
    role: "Blitz Raider",
    color: "#eab308",
    url: "/main/public/avatars_128/blitz.png",
    category: "Cyber & Heroes",
  },
  {
    id: "byte",
    name: "Byte",
    role: "Data Hacker",
    color: "#06b6d4",
    url: "/main/public/avatars_128/byte.png",
    category: "Cyber & Heroes",
  },
  {
    id: "glitch",
    name: "Glitch",
    role: "Matrix Runner",
    color: "#ec4899",
    url: "/main/public/avatars_128/glitch.png",
    category: "Cyber & Heroes",
  },
  {
    id: "kairo",
    name: "Kairo",
    role: "Chrono Scout",
    color: "#8b5cf6",
    url: "/main/public/avatars_128/kairo.png",
    category: "Cyber & Heroes",
  },
  {
    id: "nex",
    name: "Nex",
    role: "Nexus Operative",
    color: "#3b82f6",
    url: "/main/public/avatars_128/nex.png",
    category: "Cyber & Heroes",
  },
  {
    id: "nyx",
    name: "Nyx",
    role: "Shadow Vanguard",
    color: "#a855f7",
    url: "/main/public/avatars_128/nyx.png",
    category: "Cyber & Heroes",
  },
  {
    id: "raze",
    name: "Raze",
    role: "Heavy Demolition",
    color: "#ef4444",
    url: "/main/public/avatars_128/raze.png",
    category: "Cyber & Heroes",
  },
  {
    id: "rogue",
    name: "Rogue",
    role: "Stealth Operative",
    color: "#10b981",
    url: "/main/public/avatars_128/rogue.png",
    category: "Cyber & Heroes",
  },
  {
    id: "vex",
    name: "Vex",
    role: "Void Assassin",
    color: "#6366f1",
    url: "/main/public/avatars_128/vex.png",
    category: "Cyber & Heroes",
  },

  // --- Gaming & Genres ---
  {
    id: "rpg",
    name: "RPG",
    role: "Quest Legend",
    color: "#8b5cf6",
    url: "/main/public/avatars_128/rpg.png",
    category: "Gaming & Genres",
  },
  {
    id: "soulslike",
    name: "Soulslike",
    role: "Ember Knight",
    color: "#e11d48",
    url: "/main/public/avatars_128/soulslike.png",
    category: "Gaming & Genres",
  },
  {
    id: "fps",
    name: "FPS",
    role: "Tactical Operative",
    color: "#10b981",
    url: "/main/public/avatars_128/fps.png",
    category: "Gaming & Genres",
  },
  {
    id: "dungcrawl",
    name: "Dungeon",
    role: "Dungeon Delver",
    color: "#d97706",
    url: "/main/public/avatars_128/dungcrawl.png",
    category: "Gaming & Genres",
  },
  {
    id: "deckbuilder",
    name: "Deckbuilder",
    role: "Card Strategist",
    color: "#6366f1",
    url: "/main/public/avatars_128/deckbuilder.png",
    category: "Gaming & Genres",
  },
  {
    id: "openworld",
    name: "OpenWorld",
    role: "Realm Explorer",
    color: "#3b82f6",
    url: "/main/public/avatars_128/openworld.png",
    category: "Gaming & Genres",
  },
  {
    id: "platformer",
    name: "Platformer",
    role: "Jump Master",
    color: "#ec4899",
    url: "/main/public/avatars_128/platformer.png",
    category: "Gaming & Genres",
  },
  {
    id: "puzzle",
    name: "Puzzle",
    role: "Enigma Solver",
    color: "#a855f7",
    url: "/main/public/avatars_128/puzzle.png",
    category: "Gaming & Genres",
  },
  {
    id: "racing",
    name: "Racing",
    role: "Apex Driver",
    color: "#ef4444",
    url: "/main/public/avatars_128/racing.png",
    category: "Gaming & Genres",
  },
  {
    id: "horror",
    name: "Horror",
    role: "Survival Dread",
    color: "#991b1b",
    url: "/main/public/avatars_128/horror.png",
    category: "Gaming & Genres",
  },
  {
    id: "survival",
    name: "Survival",
    role: "Wilderness Survivor",
    color: "#059669",
    url: "/main/public/avatars_128/survival.png",
    category: "Gaming & Genres",
  },
  {
    id: "level",
    name: "Level Up",
    role: "Stage Master",
    color: "#eab308",
    url: "/main/public/avatars_128/level.png",
    category: "Gaming & Genres",
  },

  // --- Gear & Tech ---
  {
    id: "joystick",
    name: "Joystick",
    role: "Retro Gamer",
    color: "#06b6d4",
    url: "/main/public/avatars_128/joystick.png",
    category: "Gear & Tech",
  },
  {
    id: "robot",
    name: "Robot",
    role: "Cyber Mech",
    color: "#64748b",
    url: "/main/public/avatars_128/robot.png",
    category: "Gear & Tech",
  },
  {
    id: "mecha",
    name: "Mecha",
    role: "Titan Frame",
    color: "#3b82f6",
    url: "/main/public/avatars_128/mecha.png",
    category: "Gear & Tech",
  },
  {
    id: "retro",
    name: "Retro",
    role: "8-Bit Classic",
    color: "#a855f7",
    url: "/main/public/avatars_128/retro.png",
    category: "Gear & Tech",
  },
  {
    id: "sword",
    name: "Sword",
    role: "Blade Master",
    color: "#22c55e",
    url: "/main/public/avatars_128/sword.png",
    category: "Gear & Tech",
  },
  {
    id: "shield",
    name: "Shield",
    role: "Aegis Guard",
    color: "#3b82f6",
    url: "/main/public/avatars_128/shield.png",
    category: "Gear & Tech",
  },
  {
    id: "glove",
    name: "Glove",
    role: "Power Gauntlet",
    color: "#6366f1",
    url: "/main/public/avatars_128/glove.png",
    category: "Gear & Tech",
  },
  {
    id: "car",
    name: "Car",
    role: "Speed Racer",
    color: "#ef4444",
    url: "/main/public/avatars_128/car.png",
    category: "Gear & Tech",
  },
  {
    id: "cell",
    name: "Cell",
    role: "Bio Tech",
    color: "#10b981",
    url: "/main/public/avatars_128/cell.png",
    category: "Gear & Tech",
  },
  {
    id: "server",
    name: "Server",
    role: "Core Mainframe",
    color: "#0ea5e9",
    url: "/main/public/avatars_128/server.png",
    category: "Gear & Tech",
  },
  {
    id: "enhancement",
    name: "Enhancement",
    role: "Overclock Node",
    color: "#f59e0b",
    url: "/main/public/avatars_128/enhancement.png",
    category: "Gear & Tech",
  },
  {
    id: "ability",
    name: "Ability",
    role: "Skill Mastery",
    color: "#14b8a6",
    url: "/main/public/avatars_128/ability.png",
    category: "Gear & Tech",
  },
  {
    id: "economy",
    name: "Economy",
    role: "Tycoon Strategist",
    color: "#84cc16",
    url: "/main/public/avatars_128/economy.png",
    category: "Gear & Tech",
  },

  // --- Icons & Mythos ---
  {
    id: "dragon",
    name: "Dragon",
    role: "Mythic Dragon",
    color: "#dc2626",
    url: "/main/public/avatars_128/dragon.png",
    category: "Icons & Mythos",
  },
  {
    id: "wolf",
    name: "Wolf",
    role: "Alpha Wolf",
    color: "#94a3b8",
    url: "/main/public/avatars_128/wolf.png",
    category: "Icons & Mythos",
  },
  {
    id: "fox",
    name: "Fox",
    role: "Shadow Fox",
    color: "#f97316",
    url: "/main/public/avatars_128/fox.png",
    category: "Icons & Mythos",
  },
  {
    id: "bird",
    name: "Bird",
    role: "Avian Scout",
    color: "#38bdf8",
    url: "/main/public/avatars_128/bird.png",
    category: "Icons & Mythos",
  },
  {
    id: "spider",
    name: "Spider",
    role: "Night Crawler",
    color: "#e11d48",
    url: "/main/public/avatars_128/spider.png",
    category: "Icons & Mythos",
  },
  {
    id: "magic",
    name: "Magic",
    role: "Arcane Wizard",
    color: "#8b5cf6",
    url: "/main/public/avatars_128/magic.png",
    category: "Icons & Mythos",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    role: "High Fantasy",
    color: "#c084fc",
    url: "/main/public/avatars_128/fantasy.png",
    category: "Icons & Mythos",
  },
  {
    id: "crown",
    name: "Crown",
    role: "Royal Monarch",
    color: "#eab308",
    url: "/main/public/avatars_128/crown.png",
    category: "Icons & Mythos",
  },
  {
    id: "trophy",
    name: "Trophy",
    role: "Golden Champion",
    color: "#facc15",
    url: "/main/public/avatars_128/trophy.png",
    category: "Icons & Mythos",
  },
  {
    id: "eye",
    name: "Eye",
    role: "All-Seeing Eye",
    color: "#8b5cf6",
    url: "/main/public/avatars_128/eye.png",
    category: "Icons & Mythos",
  },
  {
    id: "heart",
    name: "Heart",
    role: "Life Crystal",
    color: "#ec4899",
    url: "/main/public/avatars_128/heart.png",
    category: "Icons & Mythos",
  },
  {
    id: "shard",
    name: "Shard",
    role: "Prism Shard",
    color: "#a855f7",
    url: "/main/public/avatars_128/shard.png",
    category: "Icons & Mythos",
  },
  {
    id: "space",
    name: "Space",
    role: "Cosmic Void",
    color: "#7c3aed",
    url: "/main/public/avatars_128/space.png",
    category: "Icons & Mythos",
  },
  {
    id: "compass",
    name: "Compass",
    role: "Wayfinder",
    color: "#f59e0b",
    url: "/main/public/avatars_128/compass.png",
    category: "Icons & Mythos",
  },
  {
    id: "tree",
    name: "Tree",
    role: "World Tree",
    color: "#16a34a",
    url: "/main/public/avatars_128/tree.png",
    category: "Icons & Mythos",
  },
];

/** Map of preset IDs to their static URLs in /main/public/avatars_128 */
export const AVATAR_URL_BY_ID: Record<string, string> = DEFAULT_CREATOR_AVATARS.reduce((acc, a) => {
  acc[a.id.toLowerCase()] = a.url;
  return acc;
}, {} as Record<string, string>);

/**
 * Resolves any avatar string (stored preset URL, ID name, or data URL)
 * exclusively to /main/public/avatars_128/*.png
 */
export function resolveAvatarUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== "string") {
    return `${AVATAR_DIR}/cyber.png`;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return `${AVATAR_DIR}/cyber.png`;
  }

  // 1. Data URLs (uploaded base64 images) or external http(s) links or blob URLs - use directly
  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();

  // 2. Direct match against known preset IDs or names
  const directMatch = DEFAULT_CREATOR_AVATARS.find(
    (p) => p.url === trimmed || p.id.toLowerCase() === lower || p.name.toLowerCase() === lower
  );
  if (directMatch) {
    return directMatch.url;
  }

  // 3. Extract identifier from filename or path
  const fileNameMatch = trimmed.match(/([a-zA-Z0-9_-]+)(?:-[a-zA-Z0-9_-]+)?\.(?:png|jpg|jpeg|webp|svg)$/i) || trimmed.match(/([a-zA-Z0-9_-]+)$/i);
  if (fileNameMatch && fileNameMatch[1]) {
    const cleanId = fileNameMatch[1].toLowerCase().split("-")[0];
    if (AVATAR_URL_BY_ID[cleanId]) {
      return AVATAR_URL_BY_ID[cleanId];
    }
  }

  // 4. Check if ID is directly in the preset map
  if (AVATAR_URL_BY_ID[lower]) {
    return AVATAR_URL_BY_ID[lower];
  }

  // Default fallback to cyber in /main/public/avatars_128
  return `${AVATAR_DIR}/cyber.png`;
}
