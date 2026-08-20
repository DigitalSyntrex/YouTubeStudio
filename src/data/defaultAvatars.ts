// 47 Resized 128x128 Creator Avatars served from permanent static public directory /avatars_128

export type AvatarCategory = "Gaming & Genres" | "Cyber & Heroes" | "Icons & Mythos" | "Gear & Tech";

export interface CreatorAvatarPreset {
  id: string;
  name: string;
  role: string;
  color: string;
  url: string;
  category: AvatarCategory;
}

export const DEFAULT_CREATOR_AVATARS: CreatorAvatarPreset[] = [
  // --- Cyber & Heroes ---
  {
    id: "cyber",
    name: "Cyber",
    role: "Cyber Visor",
    color: "#00f2fe",
    url: "/avatars_128/cyber.png",
    category: "Cyber & Heroes",
  },
  {
    id: "action",
    name: "Action",
    role: "Action Hero",
    color: "#f97316",
    url: "/avatars_128/action.png",
    category: "Cyber & Heroes",
  },
  {
    id: "brawler",
    name: "Brawler",
    role: "Combat Brawler",
    color: "#ef4444",
    url: "/avatars_128/brawler.png",
    category: "Cyber & Heroes",
  },
  {
    id: "fighting",
    name: "Fighting",
    role: "Fighter Pro",
    color: "#f59e0b",
    url: "/avatars_128/fighting.png",
    category: "Cyber & Heroes",
  },
  {
    id: "scispace",
    name: "SciSpace",
    role: "Cosmic Vanguard",
    color: "#06b6d4",
    url: "/avatars_128/scispace.png",
    category: "Cyber & Heroes",
  },
  {
    id: "ruti",
    name: "Ruti",
    role: "Companion Ruti",
    color: "#06b6d4",
    url: "/avatars_128/ruti.png",
    category: "Cyber & Heroes",
  },
  {
    id: "baxter",
    name: "Baxter",
    role: "Guardian Baxter",
    color: "#f59e0b",
    url: "/avatars_128/baxter.png",
    category: "Cyber & Heroes",
  },

  // --- Gaming & Genres ---
  {
    id: "rpg",
    name: "RPG",
    role: "Quest Legend",
    color: "#8b5cf6",
    url: "/avatars_128/rpg.png",
    category: "Gaming & Genres",
  },
  {
    id: "soulslike",
    name: "Soulslike",
    role: "Ember Knight",
    color: "#e11d48",
    url: "/avatars_128/soulslike.png",
    category: "Gaming & Genres",
  },
  {
    id: "fps",
    name: "FPS",
    role: "Tactical Operative",
    color: "#10b981",
    url: "/avatars_128/fps.png",
    category: "Gaming & Genres",
  },
  {
    id: "dungcrawl",
    name: "Dungeon",
    role: "Dungeon Delver",
    color: "#d97706",
    url: "/avatars_128/dungcrawl.png",
    category: "Gaming & Genres",
  },
  {
    id: "deckbuilder",
    name: "Deckbuilder",
    role: "Card Strategist",
    color: "#6366f1",
    url: "/avatars_128/deckbuilder.png",
    category: "Gaming & Genres",
  },
  {
    id: "openworld",
    name: "OpenWorld",
    role: "Realm Explorer",
    color: "#3b82f6",
    url: "/avatars_128/openworld.png",
    category: "Gaming & Genres",
  },
  {
    id: "platformer",
    name: "Platformer",
    role: "Jump Master",
    color: "#ec4899",
    url: "/avatars_128/platformer.png",
    category: "Gaming & Genres",
  },
  {
    id: "puzzle",
    name: "Puzzle",
    role: "Enigma Solver",
    color: "#a855f7",
    url: "/avatars_128/puzzle.png",
    category: "Gaming & Genres",
  },
  {
    id: "racing",
    name: "Racing",
    role: "Apex Driver",
    color: "#ef4444",
    url: "/avatars_128/racing.png",
    category: "Gaming & Genres",
  },
  {
    id: "horror",
    name: "Horror",
    role: "Survival Dread",
    color: "#991b1b",
    url: "/avatars_128/horror.png",
    category: "Gaming & Genres",
  },
  {
    id: "survival",
    name: "Survival",
    role: "Wilderness Survivor",
    color: "#059669",
    url: "/avatars_128/survival.png",
    category: "Gaming & Genres",
  },
  {
    id: "level",
    name: "Level Up",
    role: "Stage Master",
    color: "#eab308",
    url: "/avatars_128/level.png",
    category: "Gaming & Genres",
  },

  // --- Gear & Tech ---
  {
    id: "joystick",
    name: "Joystick",
    role: "Retro Gamer",
    color: "#06b6d4",
    url: "/avatars_128/joystick.png",
    category: "Gear & Tech",
  },
  {
    id: "robot",
    name: "Robot",
    role: "Cyber Mech",
    color: "#64748b",
    url: "/avatars_128/robot.png",
    category: "Gear & Tech",
  },
  {
    id: "mecha",
    name: "Mecha",
    role: "Titan Frame",
    color: "#3b82f6",
    url: "/avatars_128/mecha.png",
    category: "Gear & Tech",
  },
  {
    id: "retro",
    name: "Retro",
    role: "8-Bit Classic",
    color: "#a855f7",
    url: "/avatars_128/retro.png",
    category: "Gear & Tech",
  },
  {
    id: "sword",
    name: "Sword",
    role: "Blade Master",
    color: "#22c55e",
    url: "/avatars_128/sword.png",
    category: "Gear & Tech",
  },
  {
    id: "shield",
    name: "Shield",
    role: "Aegis Guard",
    color: "#3b82f6",
    url: "/avatars_128/shield.png",
    category: "Gear & Tech",
  },
  {
    id: "glove",
    name: "Glove",
    role: "Power Gauntlet",
    color: "#6366f1",
    url: "/avatars_128/glove.png",
    category: "Gear & Tech",
  },
  {
    id: "car",
    name: "Car",
    role: "Speed Racer",
    color: "#ef4444",
    url: "/avatars_128/car.png",
    category: "Gear & Tech",
  },
  {
    id: "cell",
    name: "Cell",
    role: "Bio Tech",
    color: "#10b981",
    url: "/avatars_128/cell.png",
    category: "Gear & Tech",
  },
  {
    id: "server",
    name: "Server",
    role: "Core Mainframe",
    color: "#0ea5e9",
    url: "/avatars_128/server.png",
    category: "Gear & Tech",
  },
  {
    id: "enhancement",
    name: "Enhancement",
    role: "Overclock Node",
    color: "#f59e0b",
    url: "/avatars_128/enhancement.png",
    category: "Gear & Tech",
  },
  {
    id: "ability",
    name: "Ability",
    role: "Skill Mastery",
    color: "#14b8a6",
    url: "/avatars_128/ability.png",
    category: "Gear & Tech",
  },
  {
    id: "economy",
    name: "Economy",
    role: "Tycoon Strategist",
    color: "#84cc16",
    url: "/avatars_128/economy.png",
    category: "Gear & Tech",
  },

  // --- Icons & Mythos ---
  {
    id: "dragon",
    name: "Dragon",
    role: "Mythic Dragon",
    color: "#dc2626",
    url: "/avatars_128/dragon.png",
    category: "Icons & Mythos",
  },
  {
    id: "wolf",
    name: "Wolf",
    role: "Alpha Wolf",
    color: "#94a3b8",
    url: "/avatars_128/wolf.png",
    category: "Icons & Mythos",
  },
  {
    id: "fox",
    name: "Fox",
    role: "Shadow Fox",
    color: "#f97316",
    url: "/avatars_128/fox.png",
    category: "Icons & Mythos",
  },
  {
    id: "bird",
    name: "Bird",
    role: "Avian Scout",
    color: "#38bdf8",
    url: "/avatars_128/bird.png",
    category: "Icons & Mythos",
  },
  {
    id: "spider",
    name: "Spider",
    role: "Night Crawler",
    color: "#e11d48",
    url: "/avatars_128/spider.png",
    category: "Icons & Mythos",
  },
  {
    id: "magic",
    name: "Magic",
    role: "Arcane Wizard",
    color: "#8b5cf6",
    url: "/avatars_128/magic.png",
    category: "Icons & Mythos",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    role: "High Fantasy",
    color: "#c084fc",
    url: "/avatars_128/fantasy.png",
    category: "Icons & Mythos",
  },
  {
    id: "crown",
    name: "Crown",
    role: "Royal Monarch",
    color: "#eab308",
    url: "/avatars_128/crown.png",
    category: "Icons & Mythos",
  },
  {
    id: "trophy",
    name: "Trophy",
    role: "Golden Champion",
    color: "#facc15",
    url: "/avatars_128/trophy.png",
    category: "Icons & Mythos",
  },
  {
    id: "eye",
    name: "Eye",
    role: "All-Seeing Eye",
    color: "#8b5cf6",
    url: "/avatars_128/eye.png",
    category: "Icons & Mythos",
  },
  {
    id: "heart",
    name: "Heart",
    role: "Life Crystal",
    color: "#ec4899",
    url: "/avatars_128/heart.png",
    category: "Icons & Mythos",
  },
  {
    id: "shard",
    name: "Shard",
    role: "Prism Shard",
    color: "#a855f7",
    url: "/avatars_128/shard.png",
    category: "Icons & Mythos",
  },
  {
    id: "space",
    name: "Space",
    role: "Cosmic Void",
    color: "#7c3aed",
    url: "/avatars_128/space.png",
    category: "Icons & Mythos",
  },
  {
    id: "compass",
    name: "Compass",
    role: "Wayfinder",
    color: "#f59e0b",
    url: "/avatars_128/compass.png",
    category: "Icons & Mythos",
  },
  {
    id: "tree",
    name: "Tree",
    role: "World Tree",
    color: "#16a34a",
    url: "/avatars_128/tree.png",
    category: "Icons & Mythos",
  },
];

/** Map of preset IDs to their static URLs */
export const AVATAR_URL_BY_ID: Record<string, string> = DEFAULT_CREATOR_AVATARS.reduce((acc, a) => {
  acc[a.id.toLowerCase()] = a.url;
  return acc;
}, {} as Record<string, string>);

/**
 * Resolves any avatar string (stored preset URL from old builds, asset hash, relative public path, ID name, or data URL)
 * into a valid, guaranteed-to-load permanent static image URL in /avatars_128/*.
 */
export function resolveAvatarUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== "string") {
    return "/avatars_128/cyber.png";
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return "/avatars_128/cyber.png";
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

  // 2. Direct match against known preset URLs or IDs
  const directMatch = DEFAULT_CREATOR_AVATARS.find(
    (p) => p.url === trimmed || p.id.toLowerCase() === trimmed.toLowerCase() || p.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (directMatch) {
    return directMatch.url;
  }

  // 3. Check for specific avatar names inside the path or hash (e.g. "/assets/brawler-fdC0c1iu.png", "/avatars_128/brawler.png", "brawler.png")
  const lower = trimmed.toLowerCase();
  for (const preset of DEFAULT_CREATOR_AVATARS) {
    const pId = preset.id.toLowerCase();
    if (
      lower === pId ||
      lower.includes(`/${pId}.`) ||
      lower.includes(`/${pId}-`) ||
      lower.includes(`avatars_128/${pId}`) ||
      lower.endsWith(`${pId}.png`) ||
      lower.endsWith(`${pId}.jpg`) ||
      lower.startsWith(pId)
    ) {
      return preset.url;
    }
  }

  // 4. Extract base identifier from regex if possible
  const fileNameMatch = trimmed.match(/([a-zA-Z0-9_-]+)(?:-[a-zA-Z0-9_-]+)?\.(?:png|jpg|jpeg|webp|svg)$/i) || trimmed.match(/([a-zA-Z0-9_-]+)$/i);
  if (fileNameMatch && fileNameMatch[1]) {
    const rawName = fileNameMatch[1].toLowerCase();
    const cleanId = rawName.split("-")[0];
    if (AVATAR_URL_BY_ID[cleanId]) {
      return AVATAR_URL_BY_ID[cleanId];
    }
    if (AVATAR_URL_BY_ID[rawName]) {
      return AVATAR_URL_BY_ID[rawName];
    }
  }

  // If already a valid public path (e.g. /avatars_128/...) return it
  if (trimmed.startsWith("/avatars_128/")) {
    return trimmed;
  }

  return "/avatars_128/cyber.png";
}
