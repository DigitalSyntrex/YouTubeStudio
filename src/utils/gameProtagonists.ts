// Comprehensive Protagonist & Character Database Engine with Auto-Inference & Local Storage Expansion

import { safeSetLocalStorage, safeGetLocalStorage } from "./storageUtils";

export interface ProtagonistMapping {
  keywords: string[];
  protagonist: string;
  category?: string;
  isCustom?: boolean;
}

// Built-in Game Protagonist & Character Database (120+ Iconic Franchises & Titles)
const BASE_PROTAGONIST_DATABASE: ProtagonistMapping[] = [
  // Capcom & Action Slashers
  { keywords: ["devil may cry 5", "dmc 5", "dmc5"], protagonist: "Nero, Dante, Vergil", category: "Action / Hack & Slash" },
  { keywords: ["devil may cry 4", "dmc 4"], protagonist: "Nero & Dante", category: "Action / Hack & Slash" },
  { keywords: ["devil may cry 3", "dmc 3"], protagonist: "Dante & Vergil", category: "Action / Hack & Slash" },
  { keywords: ["devil may cry", "dmc"], protagonist: "Dante & Nero", category: "Action / Hack & Slash" },
  { keywords: ["dragon's dogma 2", "dragons dogma 2"], protagonist: "The Arisen, Main Pawn, Trickster", category: "Action RPG" },
  { keywords: ["dragon's dogma", "dragons dogma"], protagonist: "The Arisen & Main Pawn", category: "Action RPG" },
  { keywords: ["monster hunter wilds", "mh wilds"], protagonist: "The Hunter, Palico & Seikret", category: "Action RPG" },
  { keywords: ["monster hunter world", "mh world", "mhw"], protagonist: "The Hunter & Palico", category: "Action RPG" },
  { keywords: ["monster hunter rise", "mhr"], protagonist: "Kamura Hunter & Palamute", category: "Action RPG" },
  { keywords: ["monster hunter"], protagonist: "The Hunter & Palico", category: "Action RPG" },
  { keywords: ["street fighter 6", "sf6"], protagonist: "Luke, Ryu, Chun-Li, Juri", category: "Fighting" },
  { keywords: ["street fighter"], protagonist: "Ryu & Ken Masters", category: "Fighting" },

  // Resident Evil Series
  { keywords: ["resident evil 4 remake", "re4 remake", "re4r"], protagonist: "Leon S. Kennedy & Ada Wong", category: "Survival Horror" },
  { keywords: ["resident evil 4", "re4"], protagonist: "Leon S. Kennedy & Ashley Graham", category: "Survival Horror" },
  { keywords: ["resident evil 2", "re2"], protagonist: "Leon S. Kennedy & Claire Redfield", category: "Survival Horror" },
  { keywords: ["resident evil 3", "re3"], protagonist: "Jill Valentine & Carlos Oliveira", category: "Survival Horror" },
  { keywords: ["resident evil village", "re8", "village"], protagonist: "Ethan Winters & Chris Redfield", category: "Survival Horror" },
  { keywords: ["resident evil 7", "re7", "biohazard"], protagonist: "Ethan Winters & Mia", category: "Survival Horror" },
  { keywords: ["resident evil 5", "re5"], protagonist: "Chris Redfield & Sheva Alomar", category: "Survival Horror" },
  { keywords: ["resident evil"], protagonist: "Chris Redfield & Jill Valentine", category: "Survival Horror" },

  // Silent Hill Series
  { keywords: ["silent hill 2 remake", "sh2 remake", "silent hill 2"], protagonist: "James Sunderland & Maria", category: "Survival Horror" },
  { keywords: ["silent hill 3"], protagonist: "Heather Mason (Cheryl)", category: "Survival Horror" },
  { keywords: ["silent hill 4"], protagonist: "Henry Townshend", category: "Survival Horror" },
  { keywords: ["silent hill"], protagonist: "Harry Mason", category: "Survival Horror" },

  // FromSoftware & Soulsborne
  { keywords: ["elden ring shadow of the erdtree", "shadow of the erdtree", "erdtree"], protagonist: "Miquella & The Tarnished", category: "Soulsborne" },
  { keywords: ["elden ring", "eldenring"], protagonist: "The Tarnished & Ranni the Witch", category: "Soulsborne" },
  { keywords: ["armored core 6", "ac6", "fires of rubicon"], protagonist: "Raven (Handler Walter & Ayre)", category: "Mecha Action" },
  { keywords: ["dark souls 3", "ds3"], protagonist: "Ashen One & Fire Keeper", category: "Soulsborne" },
  { keywords: ["dark souls 2", "ds2"], protagonist: "Bearer of the Curse", category: "Soulsborne" },
  { keywords: ["dark souls"], protagonist: "Chosen Undead", category: "Soulsborne" },
  { keywords: ["bloodborne"], protagonist: "The Good Hunter & Plain Doll", category: "Soulsborne" },
  { keywords: ["sekiro shadows die twice", "sekiro"], protagonist: "Wolf (Sekiro) & Kuro", category: "Action Adventure" },
  { keywords: ["demons souls", "demon's souls"], protagonist: "Slayer of Demons", category: "Soulsborne" },

  // Final Fantasy & Square Enix
  { keywords: ["final fantasy vii rebirth", "ff7 rebirth", "ff7r rebirth"], protagonist: "Cloud, Tifa, Aerith, Barret, Red XIII", category: "JRPG" },
  { keywords: ["final fantasy vii remake", "ff7 remake"], protagonist: "Cloud Strife & Tifa Lockhart", category: "JRPG" },
  { keywords: ["final fantasy vii", "ffvii", "ff7"], protagonist: "Cloud Strife, Tifa, Aerith, Sephiroth", category: "JRPG" },
  { keywords: ["final fantasy vi", "ffvi", "ff6"], protagonist: "Terra Branford, Locke, Edgar, Celes", category: "JRPG" },
  { keywords: ["final fantasy xvi", "ff16", "ffxvi"], protagonist: "Clive Rosfield, Joshua, Jill, Cid & Torgal", category: "Action RPG" },
  { keywords: ["final fantasy xv", "ff15", "ffxv"], protagonist: "Noctis, Ignis, Gladiolus, Prompto", category: "Action RPG" },
  { keywords: ["final fantasy x", "ff10", "ffx"], protagonist: "Tidus, Yuna, Auron", category: "JRPG" },
  { keywords: ["final fantasy xiv", "ffxiv", "ff14"], protagonist: "Warrior of Light & Alphinaud", category: "MMORPG" },
  { keywords: ["final fantasy viii", "ff8"], protagonist: "Squall Leonhart & Rinoa", category: "JRPG" },
  { keywords: ["final fantasy ix", "ff9"], protagonist: "Zidane Tribal & Princess Garnet", category: "JRPG" },
  { keywords: ["final fantasy xii", "ff12"], protagonist: "Vaan, Balthier, Fran, Ashe", category: "JRPG" },
  { keywords: ["final fantasy"], protagonist: "Warrior of Light", category: "JRPG" },
  { keywords: ["kingdom hearts 3", "kh3"], protagonist: "Sora, Donald, Goofy & Riku", category: "Action RPG" },
  { keywords: ["kingdom hearts"], protagonist: "Sora, Donald & Goofy", category: "Action RPG" },
  { keywords: ["dragon quest xi", "dq11"], protagonist: "The Luminary & Erik", category: "JRPG" },
  { keywords: ["dragon quest"], protagonist: "Hero of Dragon Quest", category: "JRPG" },
  { keywords: ["octopath traveler"], protagonist: "The Eight Travelers", category: "JRPG" },
  { keywords: ["chrono trigger"], protagonist: "Crono, Marle, Lucca, Frog, Magus", category: "JRPG" },
  { keywords: ["nier automata", "nier: automata"], protagonist: "2B, 9S & A2", category: "Action RPG" },
  { keywords: ["nier replicant"], protagonist: "Nier, Kaine & Grimoire Weiss", category: "Action RPG" },

  // Chinese & Asian Action RPGs
  { keywords: ["black myth wukong", "black myth", "wukong"], protagonist: "The Destined One (Sun Wukong)", category: "Action RPG" },
  { keywords: ["genshin impact", "genshin"], protagonist: "Traveler (Aether / Lumine) & Paimon", category: "Open World RPG" },
  { keywords: ["honkai star rail", "star rail"], protagonist: "Trailblazer (Caelus / Stelle) & March 7th", category: "Turn-Based RPG" },
  { keywords: ["zenless zone zero", "zzz"], protagonist: "Proxy (Wise / Belle) & Anby", category: "Action RPG" },

  // Atlus & Persona
  { keywords: ["persona 5 royal", "p5r", "persona 5"], protagonist: "Joker (Ren Amamiya) & Phantom Thieves", category: "JRPG" },
  { keywords: ["persona 3 reload", "p3r", "persona 3"], protagonist: "Makoto Yuki & SEES", category: "JRPG" },
  { keywords: ["persona 4 golden", "p4g", "persona 4"], protagonist: "Yu Narukami & Investigation Team", category: "JRPG" },
  { keywords: ["shin megami tensei v", "smt v", "smt5"], protagonist: "Nahobino", category: "Turn-Based RPG" },
  { keywords: ["metaphor re fantazio", "metaphor"], protagonist: "Will (The Protagonist) & Gallica", category: "JRPG" },

  // Sony PlayStation Hits
  { keywords: ["god of war ragnarok", "ragnarok"], protagonist: "Kratos, Atreus & Freya", category: "Action Adventure" },
  { keywords: ["god of war", "gow"], protagonist: "Kratos & Atreus", category: "Action Adventure" },
  { keywords: ["the last of us part 2", "tlou2", "tlou 2"], protagonist: "Ellie & Abby Anderson", category: "Story / Horror" },
  { keywords: ["the last of us", "tlou"], protagonist: "Joel Miller & Ellie", category: "Story / Horror" },
  { keywords: ["ghost of tsushima", "ghost of yotei"], protagonist: "Jin Sakai (The Ghost)", category: "Open World Action" },
  { keywords: ["horizon forbidden west"], protagonist: "Aloy & Seyka", category: "Open World Action" },
  { keywords: ["horizon zero dawn"], protagonist: "Aloy", category: "Open World Action" },
  { keywords: ["spider-man 2", "spiderman 2"], protagonist: "Peter Parker & Miles Morales", category: "Action Adventure" },
  { keywords: ["spider-man", "spiderman"], protagonist: "Peter Parker", category: "Action Adventure" },
  { keywords: ["stellar blade"], protagonist: "Eve & Lily", category: "Action RPG" },
  { keywords: ["astro bot", "astrobot"], protagonist: "Astro Bot", category: "Platformer" },
  { keywords: ["death stranding 2", "death stranding"], protagonist: "Sam Porter Bridges & Fragile", category: "Action Adventure" },
  { keywords: ["uncharted 4"], protagonist: "Nathan Drake & Sam Drake", category: "Action Adventure" },
  { keywords: ["uncharted"], protagonist: "Nathan Drake & Victor Sullivan", category: "Action Adventure" },
  { keywords: ["ratchet & clank", "ratchet and clank"], protagonist: "Ratchet, Clank & Rivet", category: "Platformer" },

  // Nintendo
  { keywords: ["legend of zelda tears of the kingdom", "totk"], protagonist: "Link, Zelda & Rauru", category: "Action Adventure" },
  { keywords: ["legend of zelda breath of the wild", "botw"], protagonist: "Link & Princess Zelda", category: "Action Adventure" },
  { keywords: ["zelda echoes of wisdom"], protagonist: "Princess Zelda & Tri", category: "Action Adventure" },
  { keywords: ["legend of zelda", "zelda"], protagonist: "Link & Princess Zelda", category: "Action Adventure" },
  { keywords: ["super mario bros wonder", "mario wonder"], protagonist: "Mario, Luigi, Peach & Toad", category: "Platformer" },
  { keywords: ["super mario odyssey"], protagonist: "Mario & Cappy", category: "Platformer" },
  { keywords: ["mario"], protagonist: "Mario & Luigi", category: "Platformer" },
  { keywords: ["metroid prime 4", "metroid prime"], protagonist: "Samus Aran & Sylux", category: "Action FPS" },
  { keywords: ["metroid dread", "metroid"], protagonist: "Samus Aran", category: "Metroidvania" },
  { keywords: ["pokemon scarlet", "pokemon violet"], protagonist: "Pokemon Trainer, Koraidon/Miraidon", category: "RPG" },
  { keywords: ["pokemon legends arceus"], protagonist: "Akari / Rei & Arceus", category: "RPG" },
  { keywords: ["pokemon"], protagonist: "Pokemon Trainer & Pikachu", category: "RPG" },
  { keywords: ["xenoblade chronicles 3", "xenoblade 3"], protagonist: "Noah & Mio", category: "JRPG" },
  { keywords: ["xenoblade"], protagonist: "Shulk, Rex or Noah", category: "JRPG" },
  { keywords: ["fire emblem engage", "fire emblem"], protagonist: "Alear, Byleth or Ike", category: "Tactical RPG" },
  { keywords: ["kirby"], protagonist: "Kirby & Bandana Waddle Dee", category: "Platformer" },
  { keywords: ["donkey kong"], protagonist: "Donkey Kong & Diddy Kong", category: "Platformer" },

  // Sci-Fi, Shooters & RPGs
  { keywords: ["cyberpunk 2077", "cyberpunk", "phantom liberty"], protagonist: "V & Johnny Silverhand", category: "Open World RPG" },
  { keywords: ["baldur's gate 3", "baldurs gate 3", "bg3"], protagonist: "Tav / Origin Companions (Astarion, Shadowheart)", category: "CRPG" },
  { keywords: ["baldur's gate", "baldurs gate"], protagonist: "Gorion's Ward", category: "CRPG" },
  { keywords: ["fallout 4"], protagonist: "Sole Survivor & Dogmeat", category: "Open World RPG" },
  { keywords: ["fallout new vegas"], protagonist: "The Courier", category: "Open World RPG" },
  { keywords: ["fallout"], protagonist: "Vault Dweller", category: "Open World RPG" },
  { keywords: ["skyrim", "elder scrolls"], protagonist: "Dragonborn (Dovahkiin)", category: "Open World RPG" },
  { keywords: ["starfield"], protagonist: "Constellation Explorer", category: "Open World RPG" },
  { keywords: ["mass effect legendary edition", "mass effect"], protagonist: "Commander Shepard & Squad", category: "Sci-Fi RPG" },
  { keywords: ["dragon age the veilguard", "veilguard"], protagonist: "Rook & Companions", category: "Action RPG" },

  // FPS & Action Shooters
  { keywords: ["doom eternal", "doom dark ages", "doom"], protagonist: "Doom Slayer", category: "FPS" },
  { keywords: ["halo infinite", "halo"], protagonist: "Master Chief (John-117)", category: "FPS" },
  { keywords: ["helldivers 2", "helldivers"], protagonist: "Helldiver for Super Earth", category: "Co-op Shooter" },
  { keywords: ["space marine 2", "warhammer 40k"], protagonist: "Lieutenant Titus & Ultramarines", category: "Action Shooter" },
  { keywords: ["bioshock infinite"], protagonist: "Booker DeWitt & Elizabeth", category: "FPS" },
  { keywords: ["bioshock"], protagonist: "Jack / Big Daddy", category: "FPS" },
  { keywords: ["borderlands 3", "borderlands"], protagonist: "Vault Hunters & Claptrap", category: "Looter Shooter" },
  { keywords: ["far cry 6", "far cry"], protagonist: "Dani Rojas", category: "FPS" },
  { keywords: ["half-life 2", "half-life", "half life"], protagonist: "Gordon Freeman & Alyx Vance", category: "FPS" },

  // Metal Gear & Stealth
  { keywords: ["metal gear solid delta", "mgs3", "snake eater"], protagonist: "Naked Snake (Big Boss)", category: "Stealth Action" },
  { keywords: ["metal gear solid v", "mgsv"], protagonist: "Venom Snake & Quiet", category: "Stealth Action" },
  { keywords: ["metal gear solid", "mgs"], protagonist: "Solid Snake", category: "Stealth Action" },
  { keywords: ["metal gear rising"], protagonist: "Raiden (Jack the Ripper)", category: "Hack & Slash" },
  { keywords: ["dishonored 2", "dishonored"], protagonist: "Corvo Attano & Emily Kaldwin", category: "Stealth Action" },

  // RockStar & Open World
  { keywords: ["red dead redemption 2", "rdr2"], protagonist: "Arthur Morgan & John Marston", category: "Open World Western" },
  { keywords: ["red dead redemption", "rdr"], protagonist: "John Marston", category: "Open World Western" },
  { keywords: ["grand theft auto vi", "gta 6", "gta vi"], protagonist: "Lucia & Jason", category: "Open World Action" },
  { keywords: ["grand theft auto v", "gta 5", "gta v"], protagonist: "Michael, Trevor & Franklin", category: "Open World Action" },
  { keywords: ["mafia definitive edition", "mafia 1 remake", "mafia 1", "mafia definitive", "mafia"], protagonist: "Tommy Angelo, Don Salieri, Paulie Lombardo & Sam Trapani", category: "Action / Crime Drama" },

  // Assassin's Creed
  { keywords: ["assassin's creed shadows", "ac shadows"], protagonist: "Naoe & Yasuke", category: "Action Adventure" },
  { keywords: ["assassin's creed mirage"], protagonist: "Basim Ibn Ishaq", category: "Action Adventure" },
  { keywords: ["assassin's creed valhalla"], protagonist: "Eivor Varinsdottir", category: "Action Adventure" },
  { keywords: ["assassin's creed odyssey"], protagonist: "Kassandra / Alexios", category: "Action Adventure" },
  { keywords: ["assassin's creed"], protagonist: "Ezio Auditore", category: "Action Adventure" },

  // Indie Hits & Classics
  { keywords: ["hollow knight silksong", "silksong"], protagonist: "Hornet", category: "Metroidvania" },
  { keywords: ["hollow knight"], protagonist: "The Knight", category: "Metroidvania" },
  { keywords: ["hades 2", "hades ii"], protagonist: "Melinoë (Princess of the Underworld)", category: "Rogue-like" },
  { keywords: ["hades"], protagonist: "Zagreus (Prince of the Underworld)", category: "Rogue-like" },
  { keywords: ["dead cells"], protagonist: "The Beheaded", category: "Rogue-like" },
  { keywords: ["slay the spire"], protagonist: "Ironclad, Silent, Defect, Watcher", category: "Deckbuilder" },
  { keywords: ["vampire survivors"], protagonist: "Antonio Belpaese & Survivors", category: "Action" },
  { keywords: ["stardew valley"], protagonist: "The Farmer", category: "Simulation" },
  { keywords: ["palworld"], protagonist: "Pal Tamer", category: "Survival Craft" },
  { keywords: ["terraria"], protagonist: "The Terrarian", category: "Sandbox" },
  { keywords: ["minecraft"], protagonist: "Steve & Alex", category: "Sandbox" },
  { keywords: ["undertale"], protagonist: "Frisk & Sans", category: "Indie RPG" },
  { keywords: ["deltarune"], protagonist: "Kris, Susie & Ralsei", category: "Indie RPG" },
  { keywords: ["celeste"], protagonist: "Madeline", category: "Platformer" },
  { keywords: ["cuphead"], protagonist: "Cuphead & Mugman", category: "Action" },
  { keywords: ["sifu"], protagonist: "The Martial Artist", category: "Action" },
  { keywords: ["lies of p"], protagonist: "Pinocchio (P)", category: "Soulsborne" },
  { keywords: ["stray"], protagonist: "The Stray Cat & B-12", category: "Adventure" },
  { keywords: ["outer wilds"], protagonist: "Hearthian Hatchling", category: "Sci-Fi Mystery" },
  { keywords: ["subnautica"], protagonist: "Ryley Robinson", category: "Survival" },
  { keywords: ["yakuza like a dragon", "like a dragon infinite wealth"], protagonist: "Ichiban Kasuga & Kazuma Kiryu", category: "Action RPG" },
  { keywords: ["yakuza", "judgment"], protagonist: "Kazuma Kiryu / Takayuki Yagami", category: "Action Adventure" },
  { keywords: ["alan wake 2"], protagonist: "Alan Wake & Saga Anderson", category: "Survival Horror" },
  { keywords: ["alan wake"], protagonist: "Alan Wake", category: "Survival Horror" },
  { keywords: ["control"], protagonist: "Jesse Faden", category: "Action Sci-Fi" }
];

// Local Storage Key for User-Defined Protagonist Expansions
const CUSTOM_PROTAGONIST_STORAGE_KEY = "yt_custom_protagonist_db";

/**
 * Get all custom mappings from local storage
 */
export function getCustomProtagonistMappings(): ProtagonistMapping[] {
  try {
    const saved = localStorage.getItem(CUSTOM_PROTAGONIST_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({ ...item, isCustom: true }));
      }
    }
  } catch (e) {
    console.error("Failed to parse custom protagonist database", e);
  }
  return [];
}

/**
 * Save or update a custom protagonist mapping
 */
export function saveCustomProtagonistMapping(keyword: string, protagonist: string, category: string = "Custom"): void {
  if (!keyword.trim() || !protagonist.trim()) return;

  const current = getCustomProtagonistMappings();
  const cleanKw = keyword.toLowerCase().trim();

  const filtered = current.filter((item) => !item.keywords.includes(cleanKw));

  const newItem: ProtagonistMapping = {
    keywords: [cleanKw],
    protagonist: protagonist.trim(),
    category: category.trim() || "Custom",
    isCustom: true
  };

  filtered.unshift(newItem);
  safeSetLocalStorage(CUSTOM_PROTAGONIST_STORAGE_KEY, filtered);
}

/**
 * Remove a custom mapping by keyword
 */
export function deleteCustomProtagonistMapping(keyword: string): void {
  const current = getCustomProtagonistMappings();
  const cleanKw = keyword.toLowerCase().trim();
  const filtered = current.filter((item) => !item.keywords.includes(cleanKw));
  safeSetLocalStorage(CUSTOM_PROTAGONIST_STORAGE_KEY, filtered);
}

/**
 * Combine built-in + user-custom database entries
 */
export function getAllProtagonistDatabase(): ProtagonistMapping[] {
  const custom = getCustomProtagonistMappings();
  return [...custom, ...BASE_PROTAGONIST_DATABASE];
}

/**
 * Main Automatic Lookup Engine with Intelligent Heuristics Fallback
 */
export function getProtagonistForGame(gameTitle: string): string {
  if (!gameTitle || !gameTitle.trim()) return "Main Protagonist";

  const lowerTitle = gameTitle.toLowerCase().trim();
  const fullDb = getAllProtagonistDatabase();

  // 1. Exact or keyword sub-string match from database
  for (const entry of fullDb) {
    for (const kw of entry.keywords) {
      if (lowerTitle.includes(kw)) {
        return entry.protagonist;
      }
    }
  }

  // 2. Intelligent Dynamic Heuristic Inferencing
  // Clean up title from common YouTube walkthrough suffixes
  let cleaned = gameTitle
    .replace(/#\d+|part \d+|ep \d+|episode \d+/gi, "")
    .replace(/\b(100%|walkthrough|playthrough|let's play|lets play|remake|remaster|hd|edition|full game|no commentary|longplay|gameplay)\b/gi, "")
    .replace(/[:|\-–].*$/, "") // strip subtitles after colon or dash if long
    .trim();

  if (!cleaned) cleaned = gameTitle.trim();

  const cleanLower = cleaned.toLowerCase();

  // Known prefix heuristics
  if (cleanLower.includes("zelda")) return "Link & Princess Zelda";
  if (cleanLower.includes("mario")) return "Mario & Luigi";
  if (cleanLower.includes("pokemon")) return "Pokemon Trainer & Pikachu";
  if (cleanLower.includes("donkey kong")) return "Donkey Kong";
  if (cleanLower.includes("metroid")) return "Samus Aran";
  if (cleanLower.includes("sonic")) return "Sonic the Hedgehog & Tails";
  if (cleanLower.includes("kirby")) return "Kirby";
  if (cleanLower.includes("crash bandicoot")) return "Crash Bandicoot";
  if (cleanLower.includes("spyro")) return "Spyro the Dragon";
  if (cleanLower.includes("rayman")) return "Rayman";
  if (cleanLower.includes("final fantasy")) return "Warrior of Light / Party Hero";
  if (cleanLower.includes("dragon quest")) return "Hero of Dragon Quest";
  if (cleanLower.includes("tales of")) return "Hero of " + cleaned;
  if (cleanLower.includes("star wars")) return "Jedi Knight";
  if (cleanLower.includes("warhammer")) return "Space Marine";
  if (cleanLower.includes("sims")) return "The Sim";

  // If single word or short title, e.g. "Bayonetta", "Spiderman", "Kratos"
  if (/^[A-Za-z0-9\s]+$/.test(cleaned) && cleaned.split(/\s+/).length <= 2) {
    return cleaned;
  }

  return `${cleaned} Protagonist`;
}

/**
 * Returns a list of game-appropriate character names for any given game & optional episode
 */
export function getGameCharacterList(gameTitle: string, episode?: any): string[] {
  const cleanTitle = (gameTitle || "").toLowerCase().trim();
  const charactersSet = new Set<string>();

  // Include episode party members if present
  if (episode?.partyMembers && Array.isArray(episode.partyMembers)) {
    episode.partyMembers.forEach((member: string) => {
      if (member && !member.toLowerCase().includes("main player") && !member.toLowerCase().includes("full roster")) {
        charactersSet.add(member.trim());
      }
    });
  }

  // Include featured character if explicitly present on episode
  if (episode?.thumbnailConfig?.featuredCharacter) {
    const feat = episode.thumbnailConfig.featuredCharacter;
    if (feat && isCharacterValidForGame(feat, gameTitle)) {
      charactersSet.add(feat.trim());
    }
  }

  // Game-specific character rosters
  if (cleanTitle.includes("chrono trigger")) {
    ["Crono", "Marle", "Lucca", "Frog", "Robo", "Ayla", "Magus", "Yakra", "Lavos"].forEach((c) => charactersSet.add(c));
  } else if (cleanTitle.includes("final fantasy vi") || cleanTitle.includes("final fantasy 6") || cleanTitle.includes("ffvi") || cleanTitle.includes("ff6")) {
    ["Terra", "Locke", "Celes", "Edgar", "Sabin", "Shadow", "Kefka", "Setzer", "Cyan", "Mog", "Relm", "Strago", "Gau", "Umaro", "Gogo"].forEach((c) => charactersSet.add(c));
  } else if (cleanTitle.includes("final fantasy vii") || cleanTitle.includes("final fantasy 7") || cleanTitle.includes("ffvii") || cleanTitle.includes("ff7")) {
    ["Cloud Strife", "Tifa Lockhart", "Aerith Gainsborough", "Barret Wallace", "Sephiroth", "Red XIII", "Yuffie Kisaragi", "Vincent Valentine", "Cid Highwind"].forEach((c) => charactersSet.add(c));
  } else if (cleanTitle.includes("elden ring") || cleanTitle.includes("erdtree")) {
    ["The Tarnished", "Melina", "Ranni the Witch", "Margit", "Malenia", "Miquella", "Radahn", "Blaidd", "Sorcerer Rogier"].forEach((c) => charactersSet.add(c));
  } else if (cleanTitle.includes("zelda") || cleanTitle.includes("tears of the kingdom") || cleanTitle.includes("totk") || cleanTitle.includes("botw")) {
    ["Link", "Princess Zelda", "Ganondorf", "Rauru", "Sidon", "Riju", "Tulin"].forEach((c) => charactersSet.add(c));
  } else if (cleanTitle.includes("resident evil 4") || cleanTitle.includes("re4")) {
    ["Leon S. Kennedy", "Ashley Graham", "Ada Wong", "Luis Serra", "Jack Krauser", "Osmund Saddler"].forEach((c) => charactersSet.add(c));
  } else if (cleanTitle.includes("devil may cry") || cleanTitle.includes("dmc")) {
    ["Nero", "Dante", "Vergil", "V", "Trish", "Lady"].forEach((c) => charactersSet.add(c));
  } else if (cleanTitle.includes("persona")) {
    ["Joker", "Morgana", "Ryuji Sakamoto", "Ann Takamaki", "Yusuke Kitagawa", "Makoto Niijima", "Futaba Sakura", "Haru Okumura", "Goro Akechi"].forEach((c) => charactersSet.add(c));
  } else if (cleanTitle.includes("wukong") || cleanTitle.includes("black myth")) {
    ["The Destined One", "Sun Wukong", "Zhu Bajie (Pigsy)", "Erlang Shen"].forEach((c) => charactersSet.add(c));
  } else if (cleanTitle.includes("cyberpunk")) {
    ["V (Mercenary)", "Johnny Silverhand", "Panam Palmer", "Judy Alvarez", "Adam Smasher"].forEach((c) => charactersSet.add(c));
  } else {
    // Dynamic extraction from database protagonist string
    const protag = getProtagonistForGame(gameTitle);
    if (protag) {
      protag.split(/[,&/]| and /i).forEach((p) => {
        const trimmed = p.trim();
        if (trimmed && !trimmed.toLowerCase().includes("hero of")) {
          charactersSet.add(trimmed);
        }
      });
    }
  }

  const result = Array.from(charactersSet);
  return result.length > 0 ? result : ["Hero", "Protagonist"];
}

/**
 * Checks if a character belongs to a completely different franchise than the specified game
 */
export function isCharacterValidForGame(characterName: string, gameTitle: string): boolean {
  if (!characterName || !gameTitle) return true;
  const charLower = characterName.toLowerCase().trim();
  const gameLower = gameTitle.toLowerCase().trim();

  // FF6 specific characters
  const ff6Chars = ["terra", "locke", "celes", "edgar", "sabin", "shadow", "kefka", "setzer", "cyan", "mog", "relm", "strago", "gau", "umaro", "gogo"];
  const isFF6Game = gameLower.includes("final fantasy vi") || gameLower.includes("final fantasy 6") || gameLower.includes("ffvi") || gameLower.includes("ff6");

  if (ff6Chars.includes(charLower) && !isFF6Game) {
    return false;
  }

  // Chrono Trigger specific characters
  const ctChars = ["crono", "marle", "lucca", "frog", "robo", "ayla", "magus"];
  const isCTGame = gameLower.includes("chrono trigger");
  if (ctChars.includes(charLower) && !isCTGame && isFF6Game) {
    return false;
  }

  return true;
}

/**
 * Returns clean hero name without parenthetical descriptive text or leading emojis
 */
export function cleanHeroName(characterName: string): string {
  if (!characterName) return "";
  return characterName
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/^[\p{Extended_Pictographic}\u{FE00}-\u{FE0F}\u{200D}\s]+/u, "")
    .trim();
}

/**
 * Normalizes hero name to pure lowercase text, stripping parentheticals, emojis, and special characters
 */
export function normalizeHeroName(characterName: string): string {
  if (!characterName) return "";
  const cleaned = cleanHeroName(characterName);
  return cleaned
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
}

/**
 * Returns formatted badge icon/emoji for character names (without parenthetical descriptive text)
 */
export function getCharacterBadgeIcon(characterName: string): string {
  if (!characterName) return "";
  const name = cleanHeroName(characterName.trim());

  // Chrono Trigger
  if (/crono/i.test(name)) return "⚔️ Crono";
  if (/marle/i.test(name)) return "🏹 Marle";
  if (/lucca/i.test(name)) return "🔫 Lucca";
  if (/frog/i.test(name)) return "🐸 Frog";
  if (/robo/i.test(name)) return "🤖 Robo";
  if (/ayla/i.test(name)) return "🦴 Ayla";
  if (/magus/i.test(name)) return "🔮 Magus";

  // FF6 Roster
  if (/terra/i.test(name)) return "✨ Terra";
  if (/locke/i.test(name)) return "🗡️ Locke";
  if (/celes/i.test(name)) return "🎭 Celes";
  if (/edgar/i.test(name)) return "👑 Edgar";
  if (/sabin/i.test(name)) return "🥊 Sabin";
  if (/shadow/i.test(name)) return "🥷 Shadow";
  if (/kefka/i.test(name)) return "🤡 Kefka";
  if (/setzer/i.test(name)) return "🎲 Setzer";
  if (/cyan/i.test(name)) return "⚔️ Cyan";
  if (/mog/i.test(name)) return "🐻 Mog";
  if (/relm/i.test(name)) return "🎨 Relm";
  if (/strago/i.test(name)) return "🧙‍♂️ Strago";
  if (/gau/i.test(name)) return "🌿 Gau";
  if (/umaro/i.test(name)) return "❄️ Umaro";
  if (/gogo/i.test(name)) return "🎭 Gogo";

  // Elden Ring
  if (/tarnished/i.test(name)) return "⚔️ The Tarnished";
  if (/melina/i.test(name)) return "🗡️ Melina";
  if (/ranni/i.test(name)) return "🌙 Ranni the Witch";
  if (/malenia/i.test(name)) return "🌺 Malenia";

  // Resident Evil
  if (/leon/i.test(name)) return "🔫 Leon S. Kennedy";
  if (/ashley/i.test(name)) return "👱‍♀️ Ashley Graham";
  if (/ada/i.test(name)) return "💃 Ada Wong";

  // Zelda
  if (/link/i.test(name)) return "🛡️ Link";
  if (/zelda/i.test(name)) return "👑 Princess Zelda";

  return name;
}

/**
 * Generates a high-quality SVG data URL hero portrait for any character
 */
export function getBuiltInHeroAvatarSvg(heroName: string, stylePreset: string = "default"): string {
  if (!heroName) return "";
  const nameClean = cleanHeroName(heroName) || "Hero";
  const emoji = getCharacterEmojiIcon(heroName);
  const initial = nameClean.charAt(0).toUpperCase() || "H";
  const lower = nameClean.toLowerCase();

  // Character theme color palettes
  let primaryColor = "#4f46e5"; // Indigo
  let secondaryColor = "#7c3aed"; // Purple
  let accentColor = "#06b6d4"; // Cyan
  let borderColor = "#38bdf8"; // Light Cyan

  if (lower.includes("terra") || lower.includes("esper")) {
    primaryColor = "#059669"; secondaryColor = "#0f766e"; accentColor = "#34d399"; borderColor = "#a7f3d0";
  } else if (lower.includes("relm") || lower.includes("sketch") || lower.includes("artist") || lower.includes("paint")) {
    primaryColor = "#db2777"; secondaryColor = "#be185d"; accentColor = "#f472b6"; borderColor = "#fbcfe8";
  } else if (lower.includes("gau") || lower.includes("wild") || lower.includes("veldt")) {
    primaryColor = "#15803d"; secondaryColor = "#166534"; accentColor = "#86efac"; borderColor = "#bbf7d0";
  } else if (lower.includes("strago") || lower.includes("lore") || lower.includes("blue mage")) {
    primaryColor = "#0284c7"; secondaryColor = "#0369a1"; accentColor = "#38bdf8"; borderColor = "#bae6fd";
  } else if (lower.includes("locke") || lower.includes("thief") || lower.includes("treasure")) {
    primaryColor = "#0284c7"; secondaryColor = "#0d9488"; accentColor = "#f59e0b"; borderColor = "#fbbf24";
  } else if (lower.includes("celes") || lower.includes("runic") || lower.includes("ice") || lower.includes("jill") || lower.includes("shiva")) {
    primaryColor = "#0284c7"; secondaryColor = "#38bdf8"; accentColor = "#818cf8"; borderColor = "#e0f2fe";
  } else if (lower.includes("edgar") || lower.includes("machinist") || lower.includes("figaro")) {
    primaryColor = "#d97706"; secondaryColor = "#b45309"; accentColor = "#fbbf24"; borderColor = "#fef08a";
  } else if (lower.includes("sabin") || lower.includes("monk") || lower.includes("blitz")) {
    primaryColor = "#ea580c"; secondaryColor = "#c2410c"; accentColor = "#fdba74"; borderColor = "#ffedd5";
  } else if (lower.includes("shadow") || lower.includes("ninja") || lower.includes("interceptor")) {
    primaryColor = "#1e1b4b"; secondaryColor = "#312e81"; accentColor = "#a855f7"; borderColor = "#c084fc";
  } else if (lower.includes("cyan") || lower.includes("samurai")) {
    primaryColor = "#1e3a8a"; secondaryColor = "#1d4ed8"; accentColor = "#93c5fd"; borderColor = "#bfdbfe";
  } else if (lower.includes("setzer") || lower.includes("gambler") || lower.includes("airship")) {
    primaryColor = "#334155"; secondaryColor = "#1e293b"; accentColor = "#f59e0b"; borderColor = "#fde047";
  } else if (lower.includes("mog") || lower.includes("moogle")) {
    primaryColor = "#e11d48"; secondaryColor = "#f43f5e"; accentColor = "#fef08a"; borderColor = "#ffffff";
  } else if (lower.includes("umaro") || lower.includes("yeti")) {
    primaryColor = "#475569"; secondaryColor = "#334155"; accentColor = "#cbd5e1"; borderColor = "#f1f5f9";
  } else if (lower.includes("gogo") || lower.includes("mimic")) {
    primaryColor = "#7c3aed"; secondaryColor = "#6d28d9"; accentColor = "#c084fc"; borderColor = "#f3e8ff";
  } else if (lower.includes("cloud") || lower.includes("strife") || lower.includes("buster")) {
    primaryColor = "#1d4ed8"; secondaryColor = "#2563eb"; accentColor = "#eab308"; borderColor = "#fef08a";
  } else if (lower.includes("link") || lower.includes("zelda") || lower.includes("triforce")) {
    primaryColor = "#15803d"; secondaryColor = "#16a34a"; accentColor = "#eab308"; borderColor = "#fef08a";
  } else if (lower.includes("clive") || lower.includes("joshua") || lower.includes("phoenix") || lower.includes("eikon")) {
    primaryColor = "#b91c1c"; secondaryColor = "#dc2626"; accentColor = "#ea580c"; borderColor = "#fde047";
  } else if (lower.includes("leon") || lower.includes("kennedy") || lower.includes("resident")) {
    primaryColor = "#0f172a"; secondaryColor = "#1e293b"; accentColor = "#dc2626"; borderColor = "#f87171";
  } else if (lower.includes("crono") || lower.includes("lucca") || lower.includes("frog")) {
    primaryColor = "#6d28d9"; secondaryColor = "#7c3aed"; accentColor = "#06b6d4"; borderColor = "#67e8f9";
  } else if (lower.includes("tommy") || lower.includes("mafia") || lower.includes("paulie")) {
    primaryColor = "#27272a"; secondaryColor = "#3f3f46"; accentColor = "#a1a1aa"; borderColor = "#f4f4f5";
  }

  if (stylePreset === "cyberpunk") {
    primaryColor = "#0e7490"; secondaryColor = "#be185d"; accentColor = "#a855f7"; borderColor = "#22d3ee";
  } else if (stylePreset === "gold") {
    primaryColor = "#a16207"; secondaryColor = "#ca8a04"; accentColor = "#fef08a"; borderColor = "#ffffff";
  } else if (stylePreset === "dark") {
    primaryColor = "#090d16"; secondaryColor = "#111827"; accentColor = "#475569"; borderColor = "#94a3b8";
  }

  const labelText = nameClean.length > 9 ? nameClean.slice(0, 8) + "." : nameClean;
  const safeId = (normalizeHeroName(heroName) || "hero") + "_" + stylePreset;

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="bgGrad_${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="100%" stop-color="${secondaryColor}"/>
      </linearGradient>
      <linearGradient id="ringGrad_${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${accentColor}"/>
        <stop offset="100%" stop-color="${borderColor}"/>
      </linearGradient>
      <filter id="glow_${safeId}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <circle cx="64" cy="64" r="62" fill="url(#bgGrad_${safeId})" />
    <circle cx="64" cy="64" r="57" fill="none" stroke="url(#ringGrad_${safeId})" stroke-width="3.5" filter="url(#glow_${safeId})"/>
    <circle cx="64" cy="64" r="48" fill="#030712" opacity="0.3"/>
    <text x="64" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="900" text-anchor="middle" dominant-baseline="central">${emoji}</text>
    <rect x="20" y="96" width="88" height="22" rx="11" fill="#090d16" opacity="0.9" stroke="${borderColor}" stroke-width="1.5"/>
    <text x="64" y="107" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="900" fill="#f8fafc" text-anchor="middle" dominant-baseline="central" letter-spacing="0.5">${labelText.toUpperCase()}</text>
  </svg>`;

  try {
    const base64 = btoa(
      encodeURIComponent(svgContent).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
    return `data:image/svg+xml;base64,${base64}`;
  } catch {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  }
}

/**
 * Global localStorage key for custom hero uploaded avatars
 */
const GLOBAL_HERO_AVATARS_KEY = "youtube_global_hero_avatars";

export function getGlobalHeroAvatars(): Record<string, string> {
  try {
    const raw = localStorage.getItem(GLOBAL_HERO_AVATARS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading global hero avatars:", err);
  }
  return {};
}

export function saveGlobalHeroAvatar(heroName: string, dataUrl: string): void {
  if (!heroName || !dataUrl) return;
  const current = getGlobalHeroAvatars();
  const clean = cleanHeroName(heroName);
  const norm = normalizeHeroName(heroName);

  if (heroName) current[heroName] = dataUrl;
  if (clean) current[clean] = dataUrl;
  if (norm) current[norm] = dataUrl;

  // Add primary character root key for FF6/major characters to allow instant alias matching
  if (norm.includes("terra")) current["terra"] = dataUrl;
  else if (norm.includes("relm")) current["relm"] = dataUrl;
  else if (norm.includes("gau")) current["gau"] = dataUrl;
  else if (norm.includes("strago")) current["strago"] = dataUrl;
  else if (norm.includes("shadow")) current["shadow"] = dataUrl;
  else if (norm.includes("cyan")) current["cyan"] = dataUrl;
  else if (norm.includes("mog")) current["mog"] = dataUrl;
  else if (norm.includes("locke")) current["locke"] = dataUrl;
  else if (norm.includes("celes")) current["celes"] = dataUrl;
  else if (norm.includes("edgar")) current["edgar"] = dataUrl;
  else if (norm.includes("sabin")) current["sabin"] = dataUrl;
  else if (norm.includes("setzer")) current["setzer"] = dataUrl;
  else if (norm.includes("umaro")) current["umaro"] = dataUrl;
  else if (norm.includes("gogo")) current["gogo"] = dataUrl;

  try {
    localStorage.setItem(GLOBAL_HERO_AVATARS_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn("localStorage quota reached while saving hero avatar. Cleaning old cache...", err);
    try {
      // Save only normalized essential key if storage is tight
      const pruned: Record<string, string> = { [norm || heroName]: dataUrl };
      localStorage.setItem(GLOBAL_HERO_AVATARS_KEY, JSON.stringify(pruned));
    } catch {
      // Ignore if browser storage is fully blocked
    }
  }
}

export function removeGlobalHeroAvatar(heroName: string): void {
  const current = getGlobalHeroAvatars();
  const norm = normalizeHeroName(heroName);
  for (const k of Object.keys(current)) {
    if (normalizeHeroName(k) === norm || (norm.length >= 3 && normalizeHeroName(k).includes(norm))) {
      delete current[k];
    }
  }
  try {
    localStorage.setItem(GLOBAL_HERO_AVATARS_KEY, JSON.stringify(current));
  } catch (err) {
    console.error("Error deleting global hero avatar:", err);
  }
}

/**
 * Asynchronously resizes and center-crops an uploaded hero avatar image file to a lightweight 256x256 JPEG data URL (~10-15KB).
 * This prevents localStorage quota limits and ensures custom portraits render instantly across all cards and modals.
 */
export function resizeHeroAvatarImage(file: File, maxSize = 256): Promise<string> {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        resolve("");
        return;
      }

      let done = false;
      const timeoutId = setTimeout(() => {
        if (!done) {
          done = true;
          resolve(rawDataUrl);
        }
      }, 5000);

      const img = new Image();
      img.onload = () => {
        if (done) return;
        clearTimeout(timeoutId);
        done = true;
        try {
          const canvas = document.createElement("canvas");
          canvas.width = maxSize;
          canvas.height = maxSize;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          // Draw dark background fallback
          ctx.fillStyle = "#090d16";
          ctx.fillRect(0, 0, maxSize, maxSize);

          // Center crop square aspect ratio
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;

          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, maxSize, maxSize);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolve(compressedDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };

      img.onerror = () => {
        if (!done) {
          clearTimeout(timeoutId);
          done = true;
          resolve(rawDataUrl);
        }
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

/**
 * Safely looks up custom hero avatar image URL or data URL across name variants,
 * falling back to a generated vector hero portrait if no custom image is found.
 */
export function getHeroAvatarUrl(
  heroAvatars?: Record<string, string>,
  heroName?: string,
  stylePreset: string = "default"
): string {
  if (!heroName) return getBuiltInHeroAvatarSvg("Hero", stylePreset);

  const globalStore = getGlobalHeroAvatars();
  const mergedAvatars: Record<string, string> = {
    ...globalStore,
    ...(heroAvatars || {}),
  };

  if (Object.keys(mergedAvatars).length > 0) {
    const rawDirect = mergedAvatars[heroName];
    if (rawDirect && rawDirect.trim().length > 0) return rawDirect;

    const clean = cleanHeroName(heroName);
    const cleanVal = mergedAvatars[clean];
    if (cleanVal && cleanVal.trim().length > 0) return cleanVal;

    const normTarget = normalizeHeroName(heroName);
    if (normTarget) {
      if (mergedAvatars[normTarget] && mergedAvatars[normTarget].trim().length > 0) {
        return mergedAvatars[normTarget];
      }

      // 1. Normalized exact match
      for (const [key, val] of Object.entries(mergedAvatars)) {
        if (val && val.trim().length > 0 && normalizeHeroName(key) === normTarget) {
          return val;
        }
      }

      // Special alias root matches
      if (normTarget.includes("terra")) {
        if (mergedAvatars["terra"] && mergedAvatars["terra"].trim().length > 0) return mergedAvatars["terra"];
        if (mergedAvatars["terrabranford"] && mergedAvatars["terrabranford"].trim().length > 0) return mergedAvatars["terrabranford"];
      } else if (normTarget.includes("relm")) {
        if (mergedAvatars["relm"] && mergedAvatars["relm"].trim().length > 0) return mergedAvatars["relm"];
      } else if (normTarget.includes("gau")) {
        if (mergedAvatars["gau"] && mergedAvatars["gau"].trim().length > 0) return mergedAvatars["gau"];
      } else if (normTarget.includes("strago")) {
        if (mergedAvatars["strago"] && mergedAvatars["strago"].trim().length > 0) return mergedAvatars["strago"];
      } else if (normTarget.includes("cyan")) {
        if (mergedAvatars["cyan"] && mergedAvatars["cyan"].trim().length > 0) return mergedAvatars["cyan"];
      } else if (normTarget.includes("locke")) {
        if (mergedAvatars["locke"] && mergedAvatars["locke"].trim().length > 0) return mergedAvatars["locke"];
      } else if (normTarget.includes("celes")) {
        if (mergedAvatars["celes"] && mergedAvatars["celes"].trim().length > 0) return mergedAvatars["celes"];
      } else if (normTarget.includes("edgar")) {
        if (mergedAvatars["edgar"] && mergedAvatars["edgar"].trim().length > 0) return mergedAvatars["edgar"];
      } else if (normTarget.includes("sabin")) {
        if (mergedAvatars["sabin"] && mergedAvatars["sabin"].trim().length > 0) return mergedAvatars["sabin"];
      }

      // 2. Normalized substring / contains match
      for (const [key, val] of Object.entries(mergedAvatars)) {
        if (val && val.trim().length > 0) {
          const kNorm = normalizeHeroName(key);
          if (kNorm.length >= 3 && normTarget.length >= 3 && (kNorm.includes(normTarget) || normTarget.includes(kNorm))) {
            return val;
          }
        }
      }
    }
  }

  return getBuiltInHeroAvatarSvg(heroName, stylePreset);
}

/**
 * Returns only the emoji symbol for avatar icon circles
 */
export function getCharacterEmojiIcon(characterName: string): string {
  if (!characterName) return "👤";
  const badge = getCharacterBadgeIcon(characterName);
  const match = badge.match(/^[\p{Extended_Pictographic}\u{FE00}-\u{FE0F}\u{200D}\u{2600}-\u{27BF}]+/u);
  if (match) return match[0];
  return cleanHeroName(characterName).charAt(0).toUpperCase();
}

/**
 * Format game title or keyword to Title Case with acronym & numeral handling
 */
export function formatGameTitle(str: string): string {
  if (!str) return "";
  const lowercaseWords = new Set(["of", "the", "a", "an", "and", "in", "on", "at", "for", "to", "vs", "vs."]);
  const acronyms = new Set([
    "dmc", "ff", "re", "ds", "sh", "gow", "mgs", "ac", "p3", "p4", "p5", "p3r", "p4g", "p5r",
    "bg3", "sf6", "mhw", "mhr", "totk", "botw", "kh3", "ff7", "ff8", "ff9", "ff10", "ff12", "ff14", "ff15", "ff16",
    "ffvii", "ffvi", "ffxvi", "ffxv", "ffx", "ffxiv", "ffviii", "ffix", "ffxii", "fps", "rpg", "jrpg", "crpg", "gta"
  ]);

  const words = str.split(/\s+/);
  return words
    .map((word, index) => {
      if (!word) return "";
      const cleanWord = word.toLowerCase();
      if (acronyms.has(cleanWord)) {
        return cleanWord.toUpperCase();
      }
      if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii|xiii|xiv|xv|xvi)$/i.test(cleanWord)) {
        return cleanWord.toUpperCase();
      }
      if (index > 0 && index < words.length - 1 && lowercaseWords.has(cleanWord)) {
        return cleanWord;
      }
      return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    })
    .join(" ");
}
