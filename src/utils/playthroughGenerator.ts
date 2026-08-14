import { Episode, PlaythroughSeries, BossEntry, LootEntry } from "../types";
import { getProtagonistForGame } from "./gameProtagonists";

export interface PlaythroughGeneratorOptions {
  gameTitle: string;
  subtitle?: string;
  badgeText?: string;
  genre?: string;
  accentColor?: string;
  totalPlaytimeHours?: number;
  targetEpisodeMinutes?: number; // 90, 105, 120
  numEpisodes?: number;
  playthroughType?: string; // e.g. "Blind Playthrough", "100% Walkthrough", "Challenge Run", "Other"
  playthroughStyle?: "100% Completion & Collectibles" | "Story Walkthrough & Bosses" | "Ongoing Playthrough" | "Speedrun & Secrets";
}

// Preset game themes with realistic acts, bosses, and loot
const GAME_PRESETS: Record<string, {
  acts: string[];
  bosses: string[];
  loot: string[];
  keyLocations: string[];
}> = {
  rpg: {
    acts: ["Act 1: Proving Grounds & Origins", "Act 2: Expansion & Hidden Kingdoms", "Act 3: Shadow Realm & Deep Dungeons", "Act 4: Endgame, Citadel & Finale"],
    bosses: ["Vanguard Commander", "Shadow Chimera", "Ancient Dragon Leviathan", "Demon Lord Overseer", "Archmage Eldrin", "Celestial Titan Final Form"],
    loot: ["Mythic Starter Blade", "Gigas Power Ring", "Elder Sorcerer Grimoire", "Relic Shield of Aegis", "Dragon Slayer Greatsword", "Crown of the Eternal King"],
    keyLocations: ["Royal Capital Outskirts", "Forbidden Whispering Forest", "Sunken Crypt of the Forgotten", "High Mountain Summit Apex", "Dimensional Void Gate"]
  },
  horror: {
    acts: ["Chapter 1: Arrival & Disturbance", "Chapter 2: The Depths of Fog", "Chapter 3: Nightmarish Reality", "Chapter 4: Escape & Final Revelation"],
    bosses: ["Executioner Monster", "Fleshy Abomination", "Corrupted Priest", "Manifestation of Guilt", "Final Nightmare Sovereign"],
    loot: ["Emergency Shotgun", "Steel Pipe & Flashlight", "Submachine Gun", "Magnum Handgun", "Indestructible Combat Knife"],
    keyLocations: ["Abandoned Apartments", "Damp Underground Sewer", "Dilapidated Hospital", "Mist-shrouded Lake", "Subterranean Laboratory"]
  },
  souls: {
    acts: ["Region 1: Outer Wall & Gatekeeper", "Region 2: Sunken Ruins & Poison Swamps", "Region 3: Capital City Apex", "Region 4: Shadow Citadel & Godhead"],
    bosses: ["Fell Sentinel", "Rotten Behemoth", "God-King of the Flame", "Starscourge Phantom", "Consort of the Shadow God"],
    loot: ["Flask of Wondrous Grace", "Moonlit Crescent Katana", "Mimic Spirit Ashes", "Blasphemous Flame Sword", "Circlet of Light"],
    keyLocations: ["Limgrave Gatehold", "Caelid Rot Wastes", "Capital Royal Terrace", "Shadow Keep Sanctuary", "Gate of Divinity"]
  },
  action: {
    acts: ["Phase 1: Infiltration & Awakening", "Phase 2: Rising Conflict & Arsenal Upgrade", "Phase 3: Enemy Stronghold Assault", "Phase 4: Climax & World Salvation"],
    bosses: ["Heavy Mech Crusher", "Cybernetic Assassin", "Warship Behemoth", "Supreme Commander", "Ultimate Omega Weapon"],
    loot: ["Plasma Rifle", "Hyper Dash Boots", "Shield Generator Chip", "Nuclear Rocket Launcher", "Legendary Hero Armor"],
    keyLocations: ["Shattered City Sector 7", "High-Tech Weapons Lab", "Volcanic Base Crater", "Orbital Space Station", "Enemy Fortress Core"]
  }
};

export function generateFullPlaythroughSeries(options: PlaythroughGeneratorOptions): {
  series: PlaythroughSeries;
  bosses: BossEntry[];
  loot: LootEntry[];
} {
  const {
    gameTitle,
    subtitle = "100% Walkthrough & Let's Play Series",
    badgeText = gameTitle.toUpperCase(),
    genre = "Action / RPG",
    accentColor = "#38bdf8",
    totalPlaytimeHours = 20,
    targetEpisodeMinutes = 105, // Default 90-120 min average
    playthroughType = "100% Walkthrough",
    playthroughStyle = "100% Completion & Collectibles",
  } = options;

  // Calculate total episodes needed based on 90-120 min format
  const calculatedEpisodes = Math.max(
    1,
    options.numEpisodes || Math.ceil((totalPlaytimeHours * 60) / targetEpisodeMinutes)
  );

  const seriesId = `series-gen-${Date.now()}`;

  // Match genre preset
  const genreLower = genre.toLowerCase() + " " + gameTitle.toLowerCase();
  let presetKey = "rpg";
  if (genreLower.includes("horror") || genreLower.includes("survival")) presetKey = "horror";
  else if (genreLower.includes("souls") || genreLower.includes("elden") || genreLower.includes("dark")) presetKey = "souls";
  else if (genreLower.includes("action") || genreLower.includes("shooter") || genreLower.includes("fps")) presetKey = "action";

  const preset = GAME_PRESETS[presetKey] || GAME_PRESETS.rpg;

  const generatedEpisodes: Episode[] = [];
  const generatedBosses: BossEntry[] = [];
  const generatedLoot: LootEntry[] = [];

  for (let i = 1; i <= calculatedEpisodes; i++) {
    const epNumStr = i < 10 ? `0${i}` : `${i}`;
    const progressFrac = (i - 1) / Math.max(1, calculatedEpisodes - 1);

    // Determine Act/World
    let actName = preset.acts[0];
    if (progressFrac >= 0.75) actName = preset.acts[3];
    else if (progressFrac >= 0.5) actName = preset.acts[2];
    else if (progressFrac >= 0.25) actName = preset.acts[1];

    // Determine location
    const locationIdx = Math.min(preset.keyLocations.length - 1, Math.floor(progressFrac * preset.keyLocations.length));
    const location = preset.keyLocations[locationIdx];

    // Titles
    let epTitle = `${gameTitle} #${epNumStr} - THE JOURNEY BEGINS! | ${playthroughStyle} (90-120 Mins)`;
    let shortTitle = `Ep ${i}: The Beginning`;
    let altTitle = `Playing ${gameTitle} Part ${i} in 90-120 Minute Longform Format`;

    if (i === calculatedEpisodes) {
      epTitle = `${gameTitle} #${epNumStr} - THE FINAL BOSS & SECRET ENDING! | 100% Full Playthrough`;
      shortTitle = `Ep ${i}: Finale & Ending`;
      altTitle = `Defeating the Final Boss in ${gameTitle} (Episode ${i})`;
    } else if (i === Math.ceil(calculatedEpisodes / 2)) {
      epTitle = `${gameTitle} #${epNumStr} - MAJOR BOSS SHOWDOWN & RARE LOOT! | 100% Walkthrough`;
      shortTitle = `Ep ${i}: Midgame Climax`;
      altTitle = `${gameTitle} Episode ${i} - Huge Boss Fight & New Map Unlocked`;
    } else if (i > 1) {
      const flavorWords = [
        "UNCOVERING HIDDEN SECRETS",
        "THE DANGEROUS DUNGEON",
        "NEW WEAPONS & EPIC BOSS",
        "INTO THE SHADOW REALM",
        "SECRET COLLECTIBLES & SIDE QUESTS",
        "THE MYTHIC TEMPLE",
        "UNSTOPPABLE POWERS UNLOCKED"
      ];
      const flavor = flavorWords[(i - 2) % flavorWords.length];
      epTitle = `${gameTitle} #${epNumStr} - ${flavor}! | 100% Walkthrough`;
      shortTitle = `Ep ${i}: ${flavor.slice(0, 18)}`;
    }

    // Progression points
    const startPoint = i === 1 ? "Game Intro & Opening Tutorial" : `Entering ${location} (Part ${i})`;
    const endPoint = i === calculatedEpisodes ? "Final Boss Slain & 100% Credits" : `${location} Cleared & Next Zone Unlocked`;

    // 90-120 min formatted timestamps
    const durMins = targetEpisodeMinutes;
    const t1 = "00:00";
    const t2 = formatMinutesToTimestamp(Math.round(durMins * 0.2));
    const t3 = formatMinutesToTimestamp(Math.round(durMins * 0.45));
    const t4 = formatMinutesToTimestamp(Math.round(durMins * 0.7));
    const t5 = formatMinutesToTimestamp(Math.round(durMins * 0.88));

    const chapters = [
      { timestamp: t1, title: "Introduction & Session Overview" },
      { timestamp: t2, title: `Exploring ${location}` },
      { timestamp: t3, title: "Major Objective & Encounter" },
      { timestamp: t4, title: "Rare Collectibles & Boss Fight" },
      { timestamp: t5, title: "Wrap-up & Episode Recap" }
    ];

    // Boss & Loot for this episode
    const bossName = `${preset.bosses[(i - 1) % preset.bosses.length]} (Part ${i})`;
    const lootName = preset.loot[(i - 1) % preset.loot.length];

    const keyEvents = [
      `${t1} - Episode intro and gear preparation`,
      `${t2} - Exploring ${location} for hidden chests`,
      `${t3} - Defeating major enemies and progression puzzle`,
      `${t4} - Boss fight: ${bossName}`,
      `${t5} - Collecting ${lootName} & episode conclusion`
    ];

    // Boss entry
    const bossId = `gen_boss_${seriesId}_${i}`;
    generatedBosses.push({
      id: bossId,
      name: bossName,
      episodePart: i,
      location: location,
      world: actName,
      hp: `${(i * 1500 + 2000).toLocaleString()}`,
      weakness: i % 2 === 0 ? "Fire / Critical Strikes" : "Lightning / Parries",
      stealCommon: "Hi-Potion / Ammo",
      stealRare: "Rare Relic / Upgrade Material",
      dropLoot: lootName,
      strategyTip: `Use elemental weaknesses and stagger windows during Phase 2. Avoid AoE attacks when ${bossName} charges!`,
      isMissable: i % 3 === 0,
      defeated: false
    });

    // Loot entry
    const lootId = `gen_loot_${seriesId}_${i}`;
    generatedLoot.push({
      id: lootId,
      name: lootName,
      category: i % 3 === 0 ? "Weapon/Armor" : i % 2 === 0 ? "Relic" : "Key Item",
      episodePart: i,
      location: location,
      description: `Obtained in Episode ${i} during ${actName}. Vital for 100% completion!`,
      isMissable: i % 3 === 0,
      collected: false
    });

    // YouTube description
    const description = `Welcome to Episode ${i} of our ${playthroughType} for ${gameTitle}! 🎮\nIn this longform ${durMins}-minute video, we explore ${location}, defeat ${bossName}, and collect ${lootName}.\n\n⏱️ CHAPTER TIMESTAMPS:\n${t1} - Introduction & Goals\n${t2} - Exploring ${location}\n${t3} - Main Quest Progress\n${t4} - Boss Fight: ${bossName}\n${t5} - Loot Roundup & Recap\n\n🛡️ LOOT & BOSSES IN THIS EPISODE:\n• Boss: ${bossName}\n• Loot: ${lootName}\n\nIf you enjoyed this ${playthroughType}, leave a LIKE & SUBSCRIBE for more!\n\n#${gameTitle.replace(/\s+/g, "")} #${playthroughType.replace(/\s+/g, "")} #LetsPlay #Gaming`;

    // Get authentic protagonist for game
    const protagonist = getProtagonistForGame(gameTitle);
    const partyList = protagonist.split(/[,&/]/).map((s) => s.trim()).filter(Boolean);

    // Thumbnail config
    const thumbnailConfig = {
      backgroundPreset: "vector" as const,
      featuredCharacter: protagonist,
      overlayText: i === 1 ? "JOURNEY BEGINS!" : i === calculatedEpisodes ? "FINAL BOSS!" : `EPISODE ${epNumStr}`,
      subText: `${gameTitle.toUpperCase()} • ${playthroughType.toUpperCase()}`,
      themeColor: accentColor
    };

    generatedEpisodes.push({
      id: Date.now() + i,
      partNumber: i,
      world: actName,
      title: epTitle,
      shortTitle: shortTitle,
      altTitles: [altTitle],
      estDurationMinutes: durMins,
      startPoint: startPoint,
      endPoint: endPoint,
      keyEvents: keyEvents,
      keyItemsAndEspers: [lootName],
      partyMembers: partyList.length > 0 ? partyList : [protagonist],
      status: "not_started",
      description: description,
      chapters: chapters,
      tags: [gameTitle, playthroughType, "Lets Play", "Walkthrough", "Gameplay", "Full Playthrough"],
      thumbnailConfig: thumbnailConfig,
      bossStrategies: [`Defeat ${bossName} using elemental staggering and dodging.`],
      equipmentNotes: `Equip ${lootName} before heading into the next zone.`
    });
  }

  const series: PlaythroughSeries = {
    id: seriesId,
    gameTitle: gameTitle.trim(),
    subtitle: subtitle.trim(),
    badgeText: badgeText.trim().toUpperCase(),
    accentColor: accentColor,
    genre: genre,
    playthroughType: playthroughType,
    createdAt: new Date().toISOString().split("T")[0],
    episodes: generatedEpisodes
  };

  return { series, bosses: generatedBosses, loot: generatedLoot };
}

function formatMinutesToTimestamp(mins: number): string {
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  const minsStr = remainingMins < 10 ? `0${remainingMins}` : `${remainingMins}`;
  if (hours > 0) {
    return `${hours}:${minsStr}:00`;
  }
  return `${minsStr}:00`;
}
