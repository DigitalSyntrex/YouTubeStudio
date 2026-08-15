import { Episode, PlaythroughSeries, QuestEntry, BossEntry, LootEntry } from "../types";

// ==========================================
// FINAL FANTASY XVI - HERO & CHARACTER PROFILES
// ==========================================
export interface HeroProfile {
  id: string;
  name: string;
  title: string;
  dominantEikon: string;
  element: string;
  role: string;
  weapon: string;
  biography: string;
  keyAbilities: string[];
}

export const ff16HeroProfiles: HeroProfile[] = [
  {
    id: "clive_rosfield",
    name: "Clive Rosfield",
    title: "First Shield of Rosaria & The Mythos",
    dominantEikon: "Ifrit (Dark Eikon of Fire)",
    element: "Fire / All Eikonic Elements",
    role: "Main Protagonist & Eikonic Vessel",
    weapon: "Gotterdammerung / Invictus / Ragnarok",
    biography: "Firstborn son of Archduke Elwin Rosfield. Though passed over by the Phoenix in favor of his younger brother Joshua, Clive swore an oath as Rosaria's First Shield. After surviving 13 years as a Branded Imperial assassin, he embraces his destiny as Mythos—the vessel capable of absorbing all Eikonic forces.",
    keyAbilities: ["Precision Dodge & Counter", "Limit Break", "Ignition", "Gigaflare", "Zantetsuken Level 5", "Diamond Dust"]
  },
  {
    id: "joshua_rosfield",
    name: "Joshua Rosfield",
    title: "Dominant of the Phoenix & Rosaria Prince",
    dominantEikon: "Phoenix (Eikon of Fire)",
    element: "Fire & Flames of Rebirth",
    role: "Deuteragonist & Scholar",
    weapon: "Rosarian Flame Staff & Spells",
    biography: "Clive's beloved younger brother and Archduke Elwin's successor. Awoken as the Dominant of Phoenix during childhood. Presumed dead during the Tragedy of Phoenix Gate, Joshua survived in secret, traveling Valisthea as a hooded scholar searching for the origin of the Blight and Ultima.",
    keyAbilities: ["Flames of Rebirth", "Curaga Shield", "Scarlet Cyclone", "Phoenix Shift", "Celestial Fusion"]
  },
  {
    id: "jill_warrick",
    name: "Jill Warrick",
    title: "Dominant of Shiva & Princess of the Northern Territories",
    dominantEikon: "Shiva (Eikon of Ice)",
    element: "Ice & Frost",
    role: "Companion & Romantic Partner",
    weapon: "Icebound Rapier",
    biography: "Ward of the Rosfield house taken from the Northern Territories to secure peace. Forced into battle by the Iron Kingdom as Shiva's Dominant, she was rescued by Clive and Cid. Jill remains Clive's fiercest support and emotional anchor throughout his crusade.",
    keyAbilities: ["Diamond Dust", "Mesmerize", "Rime Frost Ward", "Precision Thrust"]
  },
  {
    id: "cidolfus_telamon",
    name: "Cidolfus Telamon (Cid)",
    title: "Dominant of Ramuh & Founder of the Hideaway",
    dominantEikon: "Ramuh (Eikon of Lightning)",
    element: "Lightning & Storms",
    role: "Mentor & Outlaw Leader",
    weapon: "Lightning Broadsword",
    biography: "Former Lord Commander of Waloed who turned outlaw after refusing King Barnabas's tyrannical visions. Cid established the Hideaway sanctuary for Branded slaves and Bearers to die on their own terms. His mantle and vision are inherited by Clive.",
    keyAbilities: ["Judgment Bolt", "Lightning Rod", "Pile Drive", "Thunderstorm Surge"]
  },
  {
    id: "dion_lesage",
    name: "Dion Lesage",
    title: "Prince of Sanbreque & Dominant of Bahamut",
    dominantEikon: "Bahamut (Eikon of Light)",
    element: "Holy Light & Stars",
    role: "Dragoon Prince & Allied Hero",
    weapon: "Holy Lance Dragon's Tail",
    biography: "The noble leader of Sanbreque's Holy Dragoons and heir to the throne. Driven to grief by his stepmother Anabella's deceit, Dion lost control of Eikon Bahamut over the Crystalline Dominion before joining Clive and Joshua in the final assault on Origin.",
    keyAbilities: ["Megaflare", "Gigaflare", "Dragon Leap", "Flare Breath", "Holy Wings"]
  },
  {
    id: "torgal",
    name: "Torgal the Frost Wolf",
    title: "Clive's Loyal Companion Hound",
    dominantEikon: "Fenrir / Frost Wolf Instinct",
    element: "Frost & Physical Strikes",
    role: "Combat Canine Companion",
    weapon: "Fangs & Frost Aura",
    biography: "Discovered as a pup in the Northern Territories by Archduke Elwin and raised alongside Clive and Joshua. Torgal possesses ancient frost wolf lineage, aiding Clive in battle with aerial juggles and emergency healing.",
    keyAbilities: ["Sic (Aerial Launcher)", "Ravage (Heavy Bite)", "Heal (Regenerative Howl)", "Frost Claw"]
  }
];

// ==========================================
// FINAL FANTASY XVI - QUEST LINES & ARCS
// ==========================================
export const ff16Quests: QuestEntry[] = [
  {
    id: "ff16_q1",
    title: "Rosaria's Tragedy & Phoenix Gate Sanctuary",
    category: "Main Story",
    actOrWorld: "Rosaria (Prologue)",
    location: "Stillwind Swamps -> Phoenix Gate",
    episodePart: 1,
    recommendedLevel: "Lv 1 - 10",
    prerequisites: "Game Start",
    keyRewards: "Rosarian Oath Blade, Goblin Coin, Unlock Young Clive",
    isMissable: false,
    status: "completed",
    notes: "Prologue arc. Defeat Morbol in Stillwind Swamps and witness Joshua awakening as Phoenix.",
  },
  {
    id: "ff16_q2",
    title: "The Shield of Rosaria & Reaching Cid's Hideaway",
    category: "Main Story",
    actOrWorld: "Sanbreque Front",
    location: "Sanbreque Bastion -> Hideaway",
    episodePart: 2,
    recommendedLevel: "Lv 10 - 15",
    prerequisites: "Complete Prologue",
    keyRewards: "Recruit Torgal & Jill, Broadsword +1, Forge Unlocked",
    isMissable: false,
    status: "completed",
    notes: "Rescuing Jill Warrick from Imperial executioners and meeting Cidolfus Telamon.",
  },
  {
    id: "ff16_q3",
    title: "Infiltrating Caer Norvent & Garuda Eikon Awakening",
    category: "Main Story",
    actOrWorld: "Holy Empire of Sanbreque",
    location: "Caer Norvent -> Eye of the Tempest",
    episodePart: 3,
    recommendedLevel: "Lv 15 - 20",
    prerequisites: "Lostwing Hamlet Info",
    keyRewards: "Wind Shard, Garuda's Blessing Eikonic Powers",
    isMissable: false,
    status: "completed",
    notes: "Infiltrate Caer Norvent fortress, defeat Benedikta Harman, and awaken Eikon Ifrit.",
  },
  {
    id: "ff16_q4",
    title: "The Fire Within & Shattering Drake's Head",
    category: "Main Story",
    actOrWorld: "Phoenix Gate Ruins",
    location: "Phoenix Gate -> Oriflamme",
    episodePart: 4,
    recommendedLevel: "Lv 20 - 25",
    prerequisites: "Defeat Garuda",
    keyRewards: "Invictus Flame Sword, Limit Break Unlocked, Fire Shard",
    isMissable: false,
    status: "completed",
    notes: "Confront Shadow Clive to master Ifrit's flames. Assault Drake's Head Mothercrystal.",
  },
  {
    id: "ff16_q5",
    title: "Hugo Kupka's Revenge & Eikon Titan Lost",
    category: "Main Story",
    actOrWorld: "Dhalmekian Republic",
    location: "Velkroy Desert -> Drake's Fang",
    episodePart: 7,
    recommendedLevel: "Lv 25 - 32",
    prerequisites: "5-Year Time Skip",
    keyRewards: "Earth Shard, Titan's Blessing Eikonic Powers, Coral Sword",
    isMissable: false,
    status: "completed",
    notes: "Lead resistance as 'Cid' 5 years later. Slay Hugo Kupka and mountain-sized Titan Lost.",
  },
  {
    id: "ff16_q6",
    title: "Crystalline Dominion Coup & Space Eikon Bahamut",
    category: "Main Story",
    actOrWorld: "Crystalline Dominion",
    location: "Dominion Capital -> Space Orbit",
    episodePart: 9,
    recommendedLevel: "Lv 32 - 38",
    prerequisites: "Defeat Titan Lost",
    keyRewards: "Light Shard, Bahamut's Blessing, Gigaflare, Excalibur",
    isMissable: false,
    status: "completed",
    notes: "Reunite with living brother Joshua. Merge into Ifrit Risen to fight Eikon Bahamut in orbit.",
  },
  {
    id: "ff16_q7",
    title: "Kingdom of Waloed & Odin's Blade Zantetsuken",
    category: "Main Story",
    actOrWorld: "Ash Continent",
    location: "Waloed Fortress -> Drake's Spine",
    episodePart: 11,
    recommendedLevel: "Lv 38 - 44",
    prerequisites: "Enterprise Ship Upgrade",
    keyRewards: "Dark Shard, Odin's Blessing, Zantetsuken Slash, Ragnarok",
    isMissable: false,
    status: "completed",
    notes: "Infiltrate Waloed ghost kingdom and defeat King Barnabas Tharmr at Drake's Spine.",
  },
  {
    id: "ff16_q8",
    title: "Blacksmith's Blues IV & Gotterdammerung Crafting",
    category: "Side Quest",
    actOrWorld: "New Hideaway",
    location: "Blackthorne's Forge & Hunt Locations",
    episodePart: 13,
    recommendedLevel: "Lv 44 - 48",
    prerequisites: "Complete Blacksmith's Blues I-III",
    keyRewards: "Gotterdammerung Recipe & Gotterdammerung Sword (375 Atk)",
    isMissable: true,
    status: "in_progress",
    notes: "CRITICAL: Complete all 4 forge quests and defeat S-Rank Hunts for Orichalcum & Darksteel materials.",
  },
  {
    id: "ff16_q9",
    title: "S-Rank Hunts: Svarog, Behemoth King & Pandemonium",
    category: "Secret/Optional",
    actOrWorld: "Valisthea Hunt Board",
    location: "Sanbreque Caverns & Waloed Vidargris",
    episodePart: 13,
    recommendedLevel: "Lv 45 - 50",
    prerequisites: "Unlock Nektar's Hunt Board",
    keyRewards: "Orichalcum, Darksteel, Primitive Battlehorn, 100,000 Gil",
    isMissable: false,
    status: "in_progress",
    notes: "Hunt down Valisthea's most powerful S-Rank mark monsters for crafting Gotterdammerung.",
  },
  {
    id: "ff16_q10",
    title: "Origin Citadel Climax & Creator Ultimalius",
    category: "Point of No Return",
    actOrWorld: "Sky Citadel Origin",
    location: "Origin Citadel Core",
    episodePart: 15,
    recommendedLevel: "Lv 48 - 55",
    prerequisites: "Gather all Eikonic Shards",
    keyRewards: "Valisthea Peace, Ultima Weapon Shard, 100% Series Complete",
    isMissable: false,
    status: "planned",
    notes: "POINT OF NO RETURN: Complete all side quests & hunts before mounting Enterprise to sky citadel Origin.",
  }
];

// ==========================================
// FINAL FANTASY XVI - BOSSES & LOOT
// ==========================================
export const ff16Bosses: BossEntry[] = [
  {
    id: "ff16_gigas_morbol",
    name: "Gigas & Morbol Swamp Monster",
    episodePart: 1,
    location: "Stillwind Swamps",
    world: "Rosaria (Prologue)",
    hp: "3,800",
    weakness: "Precision Dodge / Fire",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Magiced Ash, Dragon Talon",
    strategyTip: "Dodge sideways when Morbol uses Bad Breath. Precision Dodge its tentacles for counterattacks.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "ff16_radiant_knight",
    name: "Radiant Knight & Phoenix vs Ifrit",
    episodePart: 1,
    location: "Phoenix Gate Sanctuary",
    world: "Rosaria (Prologue)",
    hp: "25,000",
    weakness: "Aerial Fireball / Precision Evade",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Fire Shard, Phoenix Feather",
    strategyTip: "In Phoenix Eikon flight mode, maintain aerial fireballs while evading Ifrit's Hellfire lunges.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "ff16_midnight_raven",
    name: "Midnight Raven Assassin",
    episodePart: 3,
    location: "Caer Norvent Keep",
    world: "Holy Empire of Sanbreque",
    hp: "14,000",
    weakness: "Parry / Phoenix Shift",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Imperial Silk, Meteorite",
    strategyTip: "Watch for his teleport strike. Precision Dodge when his blade glows purple.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "ff16_garuda",
    name: "Benedikta Harman & Eikon Garuda",
    episodePart: 3,
    location: "Eye of the Tempest",
    world: "Holy Empire of Sanbreque",
    hp: "45,000",
    weakness: "Deadly Embrace Pull / Wildfire Dash",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Wind Shard, Garuda's Talon",
    strategyTip: "Use Garuda's Deadly Embrace claw when her stagger bar hits 50% to bring her crashing to the ground!",
    isMissable: false,
    defeated: true,
  },
  {
    id: "ff16_shadow_clive",
    name: "Shadow Clive (The Inner Flame)",
    episodePart: 4,
    location: "Phoenix Gate Underground Ruins",
    world: "Rosaria Catacombs",
    hp: "28,000",
    weakness: "Limit Break / Precision Block",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Invictus Flame Sword, Demon Heart",
    strategyTip: "Activate Limit Break when Shadow Clive charges Hellfire to break his concentration instantly.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "ff16_typhon",
    name: "Typhon the Transgressor",
    episodePart: 5,
    location: "Drake's Head Core",
    world: "Astral Realm",
    hp: "72,000",
    weakness: "Ignition / Backlash",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Dark Shard, Fallen Wing",
    strategyTip: "Dodge sideways away from gravity spheres. Use Ignition to carry Typhon during stagger phases.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "ff16_hugo_titan",
    name: "Hugo Kupka & Eikon Titan Lost",
    episodePart: 8,
    location: "Drake's Fang Mothercrystal",
    world: "Dhalmekian Republic",
    hp: "250,000",
    weakness: "Titanic Block Counter / Wildfire Climb",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Earth Shard, Titan's Heart",
    strategyTip: "Use Titanic Block to absorb Hugo's Geocrush. As Ifrit, climb Titan Lost's stone arm and shoot Ether Nodes.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "ff16_bahamut",
    name: "Prince Dion Lesage & Eikon Bahamut",
    episodePart: 10,
    location: "Crystalline Dominion Space Orbit",
    world: "Crystalline Dominion",
    hp: "450,000",
    weakness: "Ifrit Risen Fusion / Megaflare Evade",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Light Shard, Bahamut's Crown",
    strategyTip: "As celestial Ifrit Risen, dodge Bahamut's Gigaflare rays in orbit and punish during his wing recharge.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "ff16_barnabas_odin",
    name: "King Barnabas Tharmr & Eikon Odin",
    episodePart: 12,
    location: "Drake's Spine Citadel Tower",
    world: "Kingdom of Waloed",
    hp: "380,000",
    weakness: "Dancing Steel / Parrying Zantetsuken",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Dark Shard, Odin's Blade",
    strategyTip: "Parry Barnabas's sword thrusts to open high stagger windows. Fill Zantetsuken to Lv 5 for massive bursts.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "ff16_svarog",
    name: "S-Rank Hunt: Svarog the Ruin Dragon",
    episodePart: 13,
    location: "Mornebrume Caverns",
    world: "Holy Empire of Sanbreque",
    hp: "520,000",
    weakness: "Diamond Dust Freeze / Impulse",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Orichalcum, Fallen Wing, Amber",
    strategyTip: "Equip Fireward Bit accessory. Use Diamond Dust at 50% stagger for instant full stagger!",
    isMissable: false,
    defeated: true,
  },
  {
    id: "ff16_behemoth_king",
    name: "S-Rank Hunt: Behemoth King",
    episodePart: 13,
    location: "Vidargris Plains",
    world: "Kingdom of Waloed",
    hp: "680,000",
    weakness: "Gigaflare / Zantetsuken Lv 5",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Behemoth Shackle, Orichalcum",
    strategyTip: "Dodge when Behemoth King casts Comet. Reserve Gigaflare for its staggered window.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "ff16_leviathan",
    name: "Lost Eikon: Leviathan the Waterbearer",
    episodePart: 14,
    location: "Mysidia Tidal Abyss",
    world: "Mysidia Coast",
    hp: "750,000",
    weakness: "Water Barrier Penetration / Spitfire",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Water Shard, Tidal Pearl",
    strategyTip: "Keep Ifrit's Water Barrier active during Tsunami. Time Spitfire to break Leviathan's shield before the countdown expires.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "ff16_ultimalius",
    name: "Creator Ultimalius (Final Boss)",
    episodePart: 15,
    location: "Origin Citadel Core",
    world: "Sky Citadel Origin",
    hp: "1,200,000",
    weakness: "All Eikonic Abilities Combined",
    stealCommon: "N/A",
    stealRare: "N/A",
    dropLoot: "Ultima Weapon Shard, Valisthea Peace",
    strategyTip: "Rotate Gigaflare, Diamond Dust, and Zantetsuken Lv 5 in sequence during stagger states for 200,000+ total damage!",
    isMissable: false,
    defeated: true,
  }
];

export const ff16Loot: LootEntry[] = [
  {
    id: "ff16_loot_1",
    name: "Rosarian Oath Blade",
    category: "Weapon/Armor",
    episodePart: 1,
    location: "Rosalith Keep Armory",
    description: "Clive's initial sword passed down by Archduke Elwin Rosfield.",
    isMissable: false,
    collected: true,
  },
  {
    id: "ff16_loot_2",
    name: "Invictus (Rosarian Flame Blade)",
    category: "Weapon/Armor",
    episodePart: 4,
    location: "Phoenix Gate Ruins",
    description: "Iconic Rosarian heirloom blade imbued with Fire Eikonic resonance.",
    isMissable: false,
    collected: true,
  },
  {
    id: "ff16_loot_3",
    name: "Wind Shard (Garuda's Blessing)",
    category: "Key Item",
    episodePart: 3,
    location: "Eye of the Tempest Peak",
    description: "Unlocks Eikon Garuda skills (Gouge, Aerial Blast, Rook's Gambit, Deadly Embrace).",
    isMissable: false,
    collected: true,
  },
  {
    id: "ff16_loot_4",
    name: "Coral Sword",
    category: "Weapon/Armor",
    episodePart: 7,
    location: "Blackthorne's Forge (New Hideaway)",
    description: "High stagger sword crafted using Earth Shard materials.",
    isMissable: false,
    collected: true,
  },
  {
    id: "ff16_loot_5",
    name: "Earth Shard (Titan's Blessing)",
    category: "Key Item",
    episodePart: 8,
    location: "Drake's Fang Mothercrystal",
    description: "Unlocks Eikon Titan skills (Titanic Block, Windup, Raging Fists, Upheaval).",
    isMissable: false,
    collected: true,
  },
  {
    id: "ff16_loot_6",
    name: "Excalibur Blade",
    category: "Weapon/Armor",
    episodePart: 9,
    location: "Blackthorne's Forge",
    description: "High-tier craftable broadsword obtained after Crystalline Dominion arc.",
    isMissable: false,
    collected: true,
  },
  {
    id: "ff16_loot_7",
    name: "Light Shard (Bahamut's Blessing)",
    category: "Key Item",
    episodePart: 10,
    location: "Crystalline Dominion Space Orbit",
    description: "Unlocks Eikon Bahamut skills (Megaflare, Gigaflare, Impulse, Flare Breath).",
    isMissable: false,
    collected: true,
  },
  {
    id: "ff16_loot_8",
    name: "Ragnarok Blade",
    category: "Weapon/Armor",
    episodePart: 12,
    location: "Blacksmith's Blues IV Quest Reward",
    description: "Legendary sword rewarded for completing all 4 forge storyline quests.",
    isMissable: true,
    collected: true,
  },
  {
    id: "ff16_loot_9",
    name: "Dark Shard (Odin's Blessing)",
    category: "Key Item",
    episodePart: 12,
    location: "Drake's Spine Citadel Tower",
    description: "Unlocks Eikon Odin skills (Arm of Darkness, Zantetsuken, Dancing Steel, Rift Slip).",
    isMissable: false,
    collected: true,
  },
  {
    id: "ff16_loot_10",
    name: "Orichalcum (S-Rank Crafting Metal)",
    category: "Key Item",
    episodePart: 13,
    location: "Svarog & Behemoth King Hunts",
    description: "Ultra-rare crafting metal required to forge Gotterdammerung.",
    isMissable: false,
    collected: true,
  },
  {
    id: "ff16_loot_11",
    name: "GOTTERDAMMERUNG (Blade of Ruin)",
    category: "Weapon/Armor",
    episodePart: 13,
    location: "Blackthorne's Forge (Endgame)",
    description: "Ultimate craftable sword in Final Fantasy XVI (375 Attack / 375 Stagger).",
    isMissable: true,
    collected: true,
  }
];

// ==========================================
// FINAL FANTASY XVI - 38-HOUR YOUTUBE PLAYTHROUGH EPISODES
// Total Duration: 2,280 mins = EXACTLY 38.0 Hours
// ==========================================
export const ff16Episodes: Episode[] = [
  {
    id: 601,
    partNumber: 1,
    world: "Rosaria (Prologue)",
    title: "Final Fantasy XVI #01 - ROSARIA'S TRAGEDY & THE PHOENIX AWAKENING!",
    shortTitle: "Rosaria's Tragedy & Phoenix Gate",
    altTitles: [
      "IFRIT vs PHOENIX EIKON AWAKENING! - Final Fantasy XVI Playthrough Ep 1",
      "Tragedy at Phoenix Gate! - Final Fantasy 16 Let's Play #1",
      "FF16 Episode 1: Clive Rosfield, Torgal & The Fall of Rosaria"
    ],
    estDurationMinutes: 150, // 2.5 hrs
    startPoint: "Night at Stillwind Swamps & Goblin Skirmish",
    endPoint: "Tragic Eikon Awakening at Phoenix Gate (Phoenix vs Dark Eikon Ifrit)",
    keyEvents: [
      "Infiltrating Stillwind Swamps to hunt the Goblin Chieftain with Wade and Tyler",
      "Boss Fight: Gigas & Morbol in the swamps",
      "Clive Rosfield's training spar with Lord Commander Murdoch at Rosalith Keep",
      "Meeting Archduke Elwin Rosfield, Lady Anabella & younger brother Joshua Rosfield",
      "Night of Fire at Phoenix Gate: Sanbreque Imperial treason & betrayal",
      "Joshua's Dominant awakening as Eikon Phoenix",
      "Clive's traumatic transformation into the mysterious Dark Eikon Ifrit"
    ],
    keyItemsAndEspers: ["Rosarian Oath Blade", "Dragon Talon", "Phoenix Feather", "Goblin Coin"],
    partyMembers: ["Clive Rosfield (Age 15)", "Joshua Rosfield", "Wade", "Tyler", "Torgal (Pup)"],
    status: "published",
    description: `Welcome to Episode 1 of our 100% Final Fantasy XVI Playthrough & Let's Play!\n\nWe step into the dark fantasy realm of Valisthea as 15-year-old First Shield Clive Rosfield. After proving our blade in Stillwind Swamps against Gigas and Morbol, we return to Rosalith Keep to prepare for the night of ceremony at Phoenix Gate.\n\nTragedy strikes when Sanbreque forces betray Archduke Elwin Rosfield. Under immense emotional agony, young Joshua awakens as the Eikon of Fire, Phoenix. Soon, a second, impossible Dark Eikon—Ifrit—emerges from the flames in a cataclysmic clash that changes Valisthea forever!\n\nCHAPTER TIMESTAMPS:\n00:00 - Introduction & Stillwind Swamps Infiltration\n22:30 - Boss: Gigas & Morbol Swamp Monster\n48:15 - Rosalith Keep: Sword Training with Murdoch\n1:12:00 - Meeting Joshua, Lady Anabella & Archduke Elwin\n1:38:00 - Arrival at Phoenix Gate Sanctuary\n2:02:10 - Betrayal & The Night of Fire Climax\n2:18:45 - Eikon Battle: Phoenix vs Dark Eikon Ifrit\n2:28:00 - Aftermath & Episode Wrap-up\n\nSUBSCRIBE for the full FF16 100% Walkthrough!\n#FF16 #FinalFantasyXVI #FinalFantasy16 #CliveRosfield #JoshuaRosfield #Phoenix #Ifrit #PS5 #LetsPlay`,
    chapters: [
      { timestamp: "00:00", title: "Stillwind Swamps Infiltration" },
      { timestamp: "22:30", title: "Boss: Gigas & Morbol" },
      { timestamp: "48:15", title: "Rosalith Keep Sword Training" },
      { timestamp: "1:12:00", title: "Meeting Joshua & Archduke Elwin" },
      { timestamp: "1:38:00", title: "Arrival at Phoenix Gate" },
      { timestamp: "2:02:10", title: "Sanbreque Betrayal & Night of Fire" },
      { timestamp: "2:18:45", title: "Eikon Battle: Phoenix vs Ifrit" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Clive Rosfield", "Joshua Rosfield", "Phoenix Gate", "Ifrit", "Eikon", "Final Fantasy 16"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "NIGHT OF FIRE!",
      subText: "EPISODE 01 • PROLOGUE & PHOENIX GATE",
      themeColor: "#ef4444"
    },
    bossStrategies: [
      "Morbol: Dodge sideways when Morbol uses Bad Breath. Execute Precision Dodges to fill Clive's stagger meter quickly.",
      "Dark Eikon Ifrit vs Phoenix: Fire Hellfire aerial fireballs while keeping distance. Use Precision Evades when Ifrit lunges."
    ],
    equipmentNotes: "Equip Rosarian Oath Blade. Practice Precision Dodge timings in the prologue tutorial."
  },
  {
    id: 602,
    partNumber: 2,
    world: "Sanbreque Front & Hideaway",
    title: "Final Fantasy XVI #02 - THE SHIELD OF ROSARIA & CID'S HIDEAWAY!",
    shortTitle: "The Shield & Cid's Hideaway",
    altTitles: [
      "CLIVE 13 YEARS LATER! - Final Fantasy 16 Let's Play #2",
      "Meeting Cidolfus & Torgal! - FF16 Walkthrough Episode 2"
    ],
    estDurationMinutes: 180, // 3.0 hrs
    startPoint: "Sanbreque Front 13 Years Later: Branded Imperial Wyvern Squad",
    endPoint: "Lostwing Hamlet & Uncovering the Dominant of Wind (Benedikta Harman)",
    keyEvents: [
      "Clive serving as an Imperial Branded assassin 13 years after Phoenix Gate",
      "Eikon Clash: Dominant of Ice (Shiva) vs Dominant of Earth (Titan)",
      "Rescuing Lady Jill Warrick from Imperial execution",
      "Intervention by Cidolfus Telamon & adult hound Torgal",
      "Arrival at Cid's Hideaway: Haven for Bearers & Branded slaves",
      "Unlocking Blacksmith's Forge with Blackthorne & Otto's Board",
      "Trekking to Greatwood & Lostwing Hamlet to investigate the Dominant of Wind"
    ],
    keyItemsAndEspers: ["Broadsword", "Stamina Ring", "Cid's Wine", "Wyvern Brand"],
    partyMembers: ["Clive Rosfield", "Cidolfus Telamon", "Torgal", "Jill Warrick"],
    status: "published",
    description: `Episode 2 of Final Fantasy XVI!\n\nThirteen years after the tragedy of Phoenix Gate, Clive Rosfield lives as a Branded slave soldier for the Holy Empire of Sanbreque. Deployed to assassinate the Dominant of Ice during a colossal clash between Shiva and Titan, Clive discovers the target is his childhood friend Jill Warrick!\n\nRefusing to kill her, Clive is rescued by the enigmatic outlaw Cidolfus Telamon and reunited with his faithful direwolf hound Torgal. We arrive at Cid's Hideaway, a sanctuary dedicated to freeing Bearers, before venturing to Lostwing to track down Benedikta Harman!\n\nTIMESTAMPS:\n00:00 - Sanbreque Front 13 Years Later\n18:20 - Eikon Clash: Shiva vs Titan\n42:00 - Rescuing Jill Warrick & Cid's Entrance\n1:10:15 - Arriving at Cid's Hideaway Sanctuary\n1:38:00 - Meeting Blackthorne at the Forge & Otto\n2:15:30 - Journeying through the Greatwood\n2:55:00 - Infiltrating Lostwing Hamlet & Benedikta Encounter\n\n#FF16 #FinalFantasy16 #Cidolfus #Torgal #Shiva #Titan #JRPG`,
    chapters: [
      { timestamp: "00:00", title: "Sanbreque Front 13 Years Later" },
      { timestamp: "18:20", title: "Eikon Clash: Shiva vs Titan" },
      { timestamp: "42:00", title: "Rescuing Jill Warrick & Cid's Entrance" },
      { timestamp: "1:10:15", title: "Cid's Hideaway Sanctuary" },
      { timestamp: "1:38:00", title: "Blacksmith's Forge & Hideaway Services" },
      { timestamp: "2:15:30", title: "The Greatwood Exploration" },
      { timestamp: "2:55:00", title: "Lostwing Hamlet & Benedikta" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Cid Telamon", "Torgal", "Jill Warrick", "Shiva", "Titan", "Walkthrough"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "CID'S HIDEAWAY!",
      subText: "EPISODE 02 • SHIVA VS TITAN",
      themeColor: "#38bdf8"
    },
    bossStrategies: [
      "Shiva's Dominant: Use Phoenix Shift to close gaps when Shiva casts Frostbite. Parrying her sword swings opens up huge combo windows.",
      "Fafnir Dragon: Stay beside Fafnir's flank. When it curls into a ball for Spin Attack, dodge inward toward the center."
    ],
    equipmentNotes: "Craft the Broadsword +1 at Blackthorne's Forge in Cid's Hideaway."
  },
  {
    id: 603,
    partNumber: 3,
    world: "Caer Norvent & Eye of the Tempest",
    title: "Final Fantasy XVI #03 - THE WIND EIKON & GARUDA'S FURY!",
    shortTitle: "Wind Eikon & Garuda's Fury",
    altTitles: [
      "CLIVE STEALS GARUDA'S EIKON POWER! - Final Fantasy 16 Ep 3",
      "Eikon Ifrit vs Eikon Garuda Battle! - FF16 Walkthrough #3"
    ],
    estDurationMinutes: 180, // 3.0 hrs
    startPoint: "Caer Norvent Keep Infiltration",
    endPoint: "Eye of the Tempest Peak: Eikon Ifrit vs Eikon Garuda",
    keyEvents: [
      "Infiltrating Caer Norvent Fortress under cover of darkness with Cid & Torgal",
      "Boss Fight: Midnight Raven assassin",
      "Clashing with Benedikta Harman & Clive absorbing Eikon Garuda's Wind Powers!",
      "Benedikta's mental breakdown & transformation into Eikon Garuda",
      "The Eye of the Tempest hurricane assault",
      "Clive's full Prime Transformation: Eikon Ifrit awakens to face Garuda!",
      "Acquiring Wind Shard & unlocking Garuda Eikonic Abilities (Deadly Embrace, Gouge, Rook's Gambit)"
    ],
    keyItemsAndEspers: ["Wind Shard", "Bastard Sword", "Garuda's Blessing", "Wind Feather"],
    partyMembers: ["Clive Rosfield", "Cidolfus Telamon", "Torgal"],
    status: "published",
    description: `Episode 3 of Final Fantasy XVI! Intense dark fantasy action!\n\nWe infiltrate Caer Norvent keep to confront Benedikta Harman. During a fierce battle, Clive unconsciously absorbs the Eikon of Wind's power into himself! Driven mad by the loss of her Eikon, Benedikta triggers a tempestuous transformation into Eikon Garuda!\n\nClive, Cid, and Torgal navigate the devastating hurricane to reach the peak of the Eye of the Tempest, where Clive fully awakens as the Eikon Ifrit in a mind-blowing Eikon vs Eikon boss battle!\n\nCHAPTER TIMESTAMPS:\n00:00 - Infiltrating Caer Norvent Keep\n35:10 - Boss: Midnight Raven Assassin\n1:12:00 - Confronting Benedikta Harman\n1:45:30 - Clive Absorbs Garuda's Wind Power!\n2:18:00 - Eye of the Tempest Hurricane Trail\n2:45:00 - EIKON BOSS: Eikon Ifrit vs Eikon Garuda\n\n#FF16 #Garuda #Ifrit #Benedikta #EikonBattle #FinalFantasy16`,
    chapters: [
      { timestamp: "00:00", title: "Infiltrating Caer Norvent Keep" },
      { timestamp: "35:10", title: "Boss: Midnight Raven Assassin" },
      { timestamp: "1:12:00", title: "Confronting Benedikta Harman" },
      { timestamp: "1:45:30", title: "Clive Absorbs Wind Eikon Power" },
      { timestamp: "2:18:00", title: "Eye of the Tempest Hurricane" },
      { timestamp: "2:45:00", title: "EIKON BOSS: Ifrit vs Garuda" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Garuda", "Ifrit", "Benedikta Harman", "Eikon Battle", "Wind Shard"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "GARUDA VANQUISHED!",
      subText: "EPISODE 03 • WIND EIKON AWAKENED",
      themeColor: "#10b981"
    },
    bossStrategies: [
      "Benedikta: Use Deadly Embrace (Garuda Claw) when Benedikta is at 50% stagger to pull her down for free punish combos!",
      "Eikon Garuda: In Ifrit form, use Wildfire dashes to dodge Aerial Blast tornados, then execute Backlash counters."
    ],
    equipmentNotes: "Craft Bastard Sword using the Wind Shard at Blackthorne's Forge."
  },
  {
    id: 604,
    partNumber: 4,
    world: "Phoenix Gate Ruins Catacombs",
    title: "Final Fantasy XVI #04 - ACCEPTING THE FLAME & SHADOW CLIVE!",
    shortTitle: "Accepting the Flame & Shadow Clive",
    altTitles: [
      "CLIVE CONFRONTS HIS PAST! - Final Fantasy 16 Let's Play #4",
      "Ifrit Fully Mastered! - FF16 Walkthrough Episode 4"
    ],
    estDurationMinutes: 150, // 2.5 hrs
    startPoint: "Journey to Phoenix Gate Ruins Sanctuary",
    endPoint: "Defeating Shadow Clive & Unlocking Full Limit Break",
    keyEvents: [
      "Returning to Phoenix Gate Ruins to discover the truth behind the Second Eikon of Fire",
      "Exploring Fallen Ancient Underground Vaults and defeating ancient defense automatons",
      "Boss Battle: Shadow Clive (Facing Clive's inner trauma and guilt over Joshua)",
      "Clive accepting that HE is the Dark Eikon Ifrit",
      "Unlocking Limit Break mode, Ignition, and Firelight abilities"
    ],
    keyItemsAndEspers: ["Invictus Sword", "Demon Heart", "Ignition Skill"],
    partyMembers: ["Clive Rosfield", "Jill Warrick", "Torgal"],
    status: "published",
    description: `Episode 4 of Final Fantasy XVI!\n\nClive returns to the ruins of Phoenix Gate where his tragedy began. Deep inside the Fallen Ancient Catacombs, Clive faces a phantom projection of himself—Shadow Clive. By confronting his grief, Clive accepts his true identity as the Eikon Ifrit, unlocking full mastery over the flames and Limit Break!`,
    chapters: [
      { timestamp: "00:00", title: "Phoenix Gate Ruins Descent" },
      { timestamp: "45:00", title: "Fallen Ancient Catacombs" },
      { timestamp: "1:20:00", title: "Boss: Shadow Clive" },
      { timestamp: "2:00:00", title: "Unlocking Limit Break & Ignition" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Shadow Clive", "Ifrit", "Limit Break", "Phoenix Gate"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "ACCEPTING IFRIT!",
      subText: "EPISODE 04 • LIMIT BREAK UNLOCKED",
      themeColor: "#ef4444"
    },
    bossStrategies: [
      "Shadow Clive: Activate Limit Break when Shadow Clive charges Hellfire to break his channel and deliver double stagger damage."
    ],
    equipmentNotes: "Equip Invictus blade."
  },
  {
    id: 605,
    partNumber: 5,
    world: "Oriflamme & Drake's Head Mothercrystal",
    title: "Final Fantasy XVI #05 - SHATTERING DRAKE'S HEAD & CID'S SACRIFICE!",
    shortTitle: "Drake's Head & Cid's Sacrifice",
    altTitles: [
      "THE FIRST MOTHERCRYSTAL FALLS! - Final Fantasy 16 Ep 5",
      "Cid's Final Stand & Legacy! - FF16 Walkthrough #5"
    ],
    estDurationMinutes: 180, // 3.0 hrs
    startPoint: "Infiltrating Holy Capital Oriflamme",
    endPoint: "Destruction of Drake's Head & Passing Cid's Lighter to Clive",
    keyEvents: [
      "Infiltrating the Holy Capital Oriflamme with Cid and Jill",
      "Assaulting Drake's Head Mothercrystal crystalline core",
      "Ultima emerging from the crystalline heart to summon Typhon the Transgressor",
      "Boss Battle: Typhon the Transgressor inside the Astral Realm",
      "Cidolfus Telamon sacrificing his life to save Clive and shatter the Mothercrystal",
      "Clive taking Cid's lighter and assuming the name 'Cid'"
    ],
    keyItemsAndEspers: ["Fire Shard", "Cid's Lighter", "Astral Core Fragment"],
    partyMembers: ["Clive Rosfield", "Cidolfus Telamon", "Jill Warrick", "Torgal"],
    status: "published",
    description: `Episode 5 of Final Fantasy XVI!\n\nCid leads Clive and Jill into Oriflamme to destroy the Mothercrystal Drake's Head. But deep inside the crystal core, an ancient god named Ultima appears. Cid makes the ultimate sacrifice to shatter the Mothercrystal and pass his mantle to Clive!`,
    chapters: [
      { timestamp: "00:00", title: "Infiltrating Oriflamme Capital" },
      { timestamp: "42:00", title: "Drake's Head Crystal Core" },
      { timestamp: "1:25:00", title: "Boss: Typhon the Transgressor" },
      { timestamp: "2:30:00", title: "Cid's Sacrifice & Legacy" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Drakes Head", "Typhon", "Cid", "Mothercrystal"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "CID'S SACRIFICE!",
      subText: "EPISODE 05 • DRAKE'S HEAD SHATTERED",
      themeColor: "#f97316"
    },
    bossStrategies: [
      "Typhon: Dodge sideways away from gravity spheres. Use Ignition to carry Typhon across the arena during staggered states."
    ],
    equipmentNotes: "Keep Cid's Lighter key item in inventory."
  },
  {
    id: 606,
    partNumber: 6,
    world: "5 Years Later: New Hideaway",
    title: "Final Fantasy XVI #06 - FIVE YEARS LATER & THE NEW HIDEAWAY!",
    shortTitle: "5 Years Later & New Hideaway",
    altTitles: [
      "CLIVE BECOMES CID! - Final Fantasy 16 Let's Play #6",
      "Mid's Airship Workshop & Dhalmekian March - FF16 Ep 6"
    ],
    estDurationMinutes: 150, // 2.5 hrs
    startPoint: "New Hideaway Sanctuary Five Years After Drake's Head",
    endPoint: "Crossing the Velkroy Desert in Dhalmekia",
    keyEvents: [
      "Five-year time skip: Clive leading the Resistance under the name 'Cid'",
      "Exploring the expanded New Hideaway & Mid's Airship workshop",
      "Meeting Otto, Gav, Harpocrates, Vivian Ninetails & Blackthorne",
      "Marching into Dhalmekian Republic through the Velkroy Desert"
    ],
    keyItemsAndEspers: ["Mid's Blueprint", "Hideaway Coin", "Velkroy Map"],
    partyMembers: ["Clive Rosfield (Cid)", "Jill Warrick", "Torgal", "Mid"],
    status: "published",
    description: `Episode 6 of Final Fantasy XVI!\n\nFive years have passed since Cid's passing. Clive now carries Cid's name and leads the outlaw sanctuary from the New Hideaway. We explore the expanded base, meet Mid, and march into the Dhalmekian Republic!`,
    chapters: [
      { timestamp: "00:00", title: "Five-Year Time Skip Intro" },
      { timestamp: "45:00", title: "New Hideaway Services & Mid" },
      { timestamp: "1:30:00", title: "Crossing Velkroy Desert" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "New Hideaway", "Clive", "Mid", "Velkroy"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "CLIVE IS CID!",
      subText: "EPISODE 06 • FIVE YEARS LATER",
      themeColor: "#a855f7"
    },
    bossStrategies: ["Desert Bandits: Use Garuda's Gouge for quick group stagger."],
    equipmentNotes: "Upgrade armor at Blackthorne's forge."
  },
  {
    id: 607,
    partNumber: 7,
    world: "Rosalith Ruins & Dhalmekian Republic",
    title: "Final Fantasy XVI #07 - ROSALITH RECLAIMED & HUGO KUPKA'S WRATH!",
    shortTitle: "Rosalith Reclaimed & Hugo Kupka",
    altTitles: [
      "BATTLE FOR ROSALITH! - Final Fantasy 16 Let's Play #7",
      "Clive vs Hugo Kupka Clash! - FF16 Walkthrough #7"
    ],
    estDurationMinutes: 180, // 3.0 hrs
    startPoint: "Infiltrating Rosalith Castle Ruins",
    endPoint: "Defeating Hugo Kupka (Semi-Prime Titan) at Rosalith Keep",
    keyEvents: [
      "Infiltrating the ruined castle of Rosalith occupied by Hugo Kupka's mercenaries",
      "Boss Fight: Hugo Kupka (Semi-Prime Titan)",
      "Severing Hugo Kupka's hands and escaping as Mount Krokos rumbles",
      "Infiltrating Drake's Fang Mothercrystal inside Mount Krokos"
    ],
    keyItemsAndEspers: ["Coral Sword", "Dhalmekian Signet", "Titan's Ring"],
    partyMembers: ["Clive Rosfield", "Jill Warrick", "Torgal"],
    status: "published",
    description: `Episode 7 of Final Fantasy XVI!\n\nDriven by vengeance over Benedikta, Hugo Kupka occupies Clive's childhood home of Rosalith. Clive confronts Kupka in a violent brawl, severing his hands before pursuing him to Drake's Fang Mothercrystal!`,
    chapters: [
      { timestamp: "00:00", title: "Infiltrating Rosalith Castle Ruins" },
      { timestamp: "1:05:00", title: "Boss: Hugo Kupka (Semi-Prime)" },
      { timestamp: "2:15:00", title: "Mount Krokos & Drake's Fang Approach" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Rosalith", "Hugo Kupka", "Titan", "Coral Sword"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "ROSALITH BRAWL!",
      subText: "EPISODE 07 • HUGO KUPKA SLAIN",
      themeColor: "#eab308"
    },
    bossStrategies: ["Hugo Kupka: Time Titanic Precision Block to absorb his punches and deliver instant counterattacks."],
    equipmentNotes: "Equip Coral Sword."
  },
  {
    id: 608,
    partNumber: 8,
    world: "Drake's Fang & Mount Krokos",
    title: "Final Fantasy XVI #08 - COLOSSAL EIKON TITAN LOST!",
    shortTitle: "Colossal Titan Lost Eikon",
    altTitles: [
      "MOUNTAIN-SIZED EIKON BOSS! - Final Fantasy 16 Ep 8",
      "Ifrit vs Titan Lost Battle! - FF16 Walkthrough #8"
    ],
    estDurationMinutes: 180, // 3.0 hrs
    startPoint: "Drake's Fang Mothercrystal Interior",
    endPoint: "Defeating Titan Lost & Acquiring Earth Shard",
    keyEvents: [
      "Hugo Kupka consuming Mothercrystal energy to become mountain-sized Titan Lost",
      "Epic Eikon Battle: Eikon Ifrit sprinting up the stone body of Titan Lost",
      "Shattering Titan Lost's heart core and acquiring Earth Shard",
      "Unlocking Eikon Titan Skills (Titanic Block, Windup, Raging Fists, Upheaval)"
    ],
    keyItemsAndEspers: ["Earth Shard", "Titan's Heart", "Titan's Blessing"],
    partyMembers: ["Clive Rosfield", "Jill Warrick", "Torgal"],
    status: "published",
    description: `Episode 8 of Final Fantasy XVI!\n\nHugo Kupka consumes the Mothercrystal's raw ether, mutating into Titan Lost—a mountain-sized Eikon! Clive becomes Eikon Ifrit to scale the colossal stone beast in an epic cinematic battle!`,
    chapters: [
      { timestamp: "00:00", title: "Drake's Fang Core" },
      { timestamp: "45:00", title: "EIKON BOSS: Ifrit vs Titan Lost Phase 1" },
      { timestamp: "1:30:00", title: "EIKON BOSS: Titan Lost Phase 2 (Climbing the Mountain)" },
      { timestamp: "2:20:00", title: "Acquiring Earth Shard & Titan Powers" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Titan Lost", "Ifrit", "Earth Shard", "Eikon"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "TITAN LOST SLAIN!",
      subText: "EPISODE 08 • MOUNTAIN EIKON CLASH",
      themeColor: "#eab308"
    },
    bossStrategies: ["Titan Lost: Focus fire on the glowing Ether Nodes along Titan's spine with Ifrit's Fireball while running up its arm."],
    equipmentNotes: "Master Windup and Titanic Block in Eikon menu."
  },
  {
    id: 609,
    partNumber: 9,
    world: "Crystalline Dominion Neutral Zone",
    title: "Final Fantasy XVI #09 - BROTHERS REUNITED & THE PALACE COUP!",
    shortTitle: "Brothers Reunited & Palace Coup",
    altTitles: [
      "REUNITING WITH JOSHUA ROSFIELD! - Final Fantasy 16 Ep 9",
      "Sanbreque Palace Betrayal! - FF16 Walkthrough #9"
    ],
    estDurationMinutes: 180, // 3.0 hrs
    startPoint: "Infiltrating Crystalline Dominion Capital",
    endPoint: "Reunion with Joshua Rosfield & Prince Dion's Grief",
    keyEvents: [
      "Infiltrating the Crystalline Dominion ahead of Sanbreque's military occupation",
      "Emotional reunion between Clive Rosfield and his living younger brother Joshua Rosfield!",
      "Discovering Anabella's treason and Prince Dion Lesage's palace coup",
      "Prince Dion losing control of Eikon Bahamut over the city"
    ],
    keyItemsAndEspers: ["Excalibur", "Dominion Seal", "Joshua's Rosary"],
    partyMembers: ["Clive Rosfield", "Joshua Rosfield", "Jill Warrick", "Torgal"],
    status: "published",
    description: `Episode 9 of Final Fantasy XVI!\n\nClive travels to the Crystalline Dominion and is reunited with his brother Joshua Rosfield! Meanwhile, Prince Dion Lesage discovers Anabella's betrayal and launches a coup, losing control of Eikon Bahamut!`,
    chapters: [
      { timestamp: "00:00", title: "Dominion Capital Infiltration" },
      { timestamp: "50:00", title: "Reunion with Joshua Rosfield!" },
      { timestamp: "1:40:00", title: "Sanbreque Palace Coup" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Joshua Rosfield", "Clive", "Dominion", "Dion"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Joshua",
      overlayText: "JOSHUA IS ALIVE!",
      subText: "EPISODE 09 • BROTHERS REUNITED",
      themeColor: "#6366f1"
    },
    bossStrategies: ["Sanbreque Dragoons: Use Titan's Upheaval to break dragoon shields."],
    equipmentNotes: "Craft Excalibur blade at Blackthorne's forge."
  },
  {
    id: 610,
    partNumber: 10,
    world: "Crystalline Dominion Space Orbit",
    title: "Final Fantasy XVI #10 - CELESTIAL IFRIT RISEN vs EIKON BAHAMUT!",
    shortTitle: "Celestial Ifrit Risen vs Bahamut",
    altTitles: [
      "ORBITAL SPACE EIKON BATTLE! - Final Fantasy 16 Ep 10",
      "Ifrit Risen vs Eikon Bahamut! - FF16 Walkthrough #10"
    ],
    estDurationMinutes: 210, // 3.5 hrs
    startPoint: "Bahamut Casting Megaflare over Crystalline Dominion",
    endPoint: "Defeating Bahamut in Space Orbit & Acquiring Light Shard",
    keyEvents: [
      "Bahamut raining down Megaflare over the Crystalline Dominion",
      "Combination Fusion: Ifrit and Phoenix merging into celestial deity Ifrit Risen",
      "Orbital Space Battle: Ifrit Risen vs Eikon Bahamut above the clouds",
      "Saving Dion Lesage & acquiring Light Shard (Gigaflare, Megaflare, Impulse)"
    ],
    keyItemsAndEspers: ["Light Shard", "Bahamut's Blessing", "Bahamut's Crown"],
    partyMembers: ["Clive Rosfield", "Joshua Rosfield", "Dion Lesage"],
    status: "published",
    description: `Episode 10 of Final Fantasy XVI! Astronomical Eikon warfare!\n\nTo save the realm from Bahamut's Megaflare, Ifrit and Phoenix perform a celestial fusion into Ifrit Risen, soaring into space for an insane orbital battle against the Dragon King Bahamut!`,
    chapters: [
      { timestamp: "00:00", title: "Bahamut's Megaflare Cataclysm" },
      { timestamp: "35:00", title: "Celestial Fusion: Ifrit Risen" },
      { timestamp: "1:20:00", title: "ORBITAL SPACE EIKON BOSS: Bahamut Phase 1" },
      { timestamp: "2:30:00", title: "ORBITAL SPACE EIKON BOSS: Bahamut Phase 2" },
      { timestamp: "3:10:00", title: "Acquiring Light Shard & Gigaflare" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Bahamut", "Ifrit Risen", "Gigaflare", "Light Shard"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "SPACE EIKON CLASH!",
      subText: "EPISODE 10 • IFRIT RISEN VS BAHAMUT",
      themeColor: "#6366f1"
    },
    bossStrategies: ["Bahamut: Charge Megaflare Dodge and unleash Gigaflare during Bahamut's recovery animation for 100,000+ damage!"],
    equipmentNotes: "Equip Gigaflare in Eikonic ability slot."
  },
  {
    id: 611,
    partNumber: 11,
    world: "Ash Continent & Kingdom of Waloed",
    title: "Final Fantasy XVI #11 - VOYAGE TO ASH & KING BARNABAS THARMR!",
    shortTitle: "Voyage to Ash & King Barnabas",
    altTitles: [
      "BARNABAS SEVERS THE OCEAN! - Final Fantasy 16 Ep 11",
      "Kingdom of Waloed Ghost Realm - FF16 Walkthrough #11"
    ],
    estDurationMinutes: 180, // 3.0 hrs
    startPoint: "Sailing Enterprise Ship to Ash Continent",
    endPoint: "King Barnabas Slicing the Ocean in Two with Zantetsuken",
    keyEvents: [
      "Voyaging aboard Mid's airship Enterprise to the desolate Ash Continent",
      "Exploring the ghost Kingdom of Waloed overrun by Akashic dead",
      "King Barnabas Tharmr severing the ocean in half with Odin's blade Zantetsuken",
      "Clive and Jill's emotional beachside vow (Shiva's frost power passed to Clive)"
    ],
    keyItemsAndEspers: ["Shiva's Blessing", "Enterprise Crest", "Waloed Map"],
    partyMembers: ["Clive Rosfield", "Joshua Rosfield", "Jill Warrick", "Torgal"],
    status: "published",
    description: `Episode 11 of Final Fantasy XVI!\n\nWe set sail aboard the Enterprise to Ash, the eastern continent ruled by King Barnabas Tharmr. Barnabas demonstrates terrifying power, literally severing the ocean in half with Zantetsuken!`,
    chapters: [
      { timestamp: "00:00", title: "Sailing Enterprise to Ash" },
      { timestamp: "55:00", title: "Waloed Ghost Kingdom Exploration" },
      { timestamp: "1:50:00", title: "Barnabas Slicing the Ocean" },
      { timestamp: "2:40:00", title: "Clive & Jill's Shiva Vow" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Waloed", "Barnabas", "Zantetsuken", "Shiva"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Jill",
      overlayText: "OCEAN SEVERED!",
      subText: "EPISODE 11 • KINGDOM OF WALOED",
      themeColor: "#8b5cf6"
    },
    bossStrategies: ["Akashic Knights: Freeze targets with Diamond Dust before delivering Zantetsuken sweeps."],
    equipmentNotes: "Master Shiva's Diamond Dust in Eikon menu."
  },
  {
    id: 612,
    partNumber: 12,
    world: "Drake's Spine Citadel Tower",
    title: "Final Fantasy XVI #12 - ULTIMATE SWORD DUEL: CLIVE vs ODIN!",
    shortTitle: "Clive vs Odin Sword Duel",
    altTitles: [
      "DEFEATING KING BARNABAS & ODIN! - Final Fantasy 16 Ep 12",
      "Unlocking Zantetsuken Level 5! - FF16 Walkthrough #12"
    ],
    estDurationMinutes: 180, // 3.0 hrs
    startPoint: "Infiltrating Drake's Spine Citadel Tower",
    endPoint: "Defeating King Barnabas Tharmr & Acquiring Dark Shard",
    keyEvents: [
      "Infiltrating Drake's Spine Citadel Tower in Waloed",
      "Master Sword Duel: Clive Rosfield vs King Barnabas Tharmr (Eikon Odin)",
      "Slaying Barnabas and acquiring the Dark Shard",
      "Unlocking Eikon Odin Skills (Arm of Darkness, Zantetsuken Lv 5, Dancing Steel, Rift Slip)"
    ],
    keyItemsAndEspers: ["Dark Shard", "Ragnarok Blade", "Odin's Blade"],
    partyMembers: ["Clive Rosfield", "Joshua Rosfield", "Torgal"],
    status: "published",
    description: `Episode 12 of Final Fantasy XVI!\n\nClive ascends the tower of Drake's Spine for an ultimate sword duel against King Barnabas Tharmr. Defeating Odin yields the Dark Shard, granting Clive access to Zantetsuken Level 5!`,
    chapters: [
      { timestamp: "00:00", title: "Drake's Spine Tower Ascent" },
      { timestamp: "1:00:00", title: "BOSS: Clive vs Barnabas Sword Duel Phase 1" },
      { timestamp: "2:00:00", title: "BOSS: Eikon Odin Phase 2" },
      { timestamp: "2:45:00", title: "Acquiring Dark Shard & Zantetsuken" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Odin", "Barnabas", "Zantetsuken", "Ragnarok"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "ODIN DEFEATED!",
      subText: "EPISODE 12 • ZANTETSUKEN UNLOCKED",
      themeColor: "#8b5cf6"
    },
    bossStrategies: ["Barnabas: Parry his sword thrusts to open high stagger windows and fill Zantetsuken gauge with Dancing Steel."],
    equipmentNotes: "Craft Ragnarok Blade at Blackthorne's forge upon completing Blacksmith's Blues IV."
  },
  {
    id: 613,
    partNumber: 13,
    world: "Nektar's Hunt Board & Endgame Forge",
    title: "Final Fantasy XVI #13 - S-RANK HUNTS & GOTTERDAMMERUNG!",
    shortTitle: "S-Rank Hunts & Gotterdammerung",
    altTitles: [
      "CRAFTING THE ULTIMATE SWORD GOTTERDAMMERUNG! - Final Fantasy 16 Ep 13",
      "Svarog & Behemoth King S-Rank Hunts! - FF16 Walkthrough #13"
    ],
    estDurationMinutes: 180, // 3.0 hrs
    startPoint: "Nektar the Moogle's Hunt Board at New Hideaway",
    endPoint: "Crafting GOTTERDAMMERUNG Blade (375 Atk / 375 Stagger) at Forge",
    keyEvents: [
      "Hunting S-Rank Marks: Svarog the Ruin Dragon & Behemoth King",
      "Collecting Orichalcum, Darksteel, and Primitive Battlehorn materials",
      "Completing Blacksmith's Blues IV side quest chain",
      "Crafting GOTTERDAMMERUNG (The Blade of Ruin - 375 Attack / 375 Stagger) with Blackthorne!"
    ],
    keyItemsAndEspers: ["GOTTERDAMMERUNG Blade", "Orichalcum", "Darksteel", "Behemoth Shackle"],
    partyMembers: ["Clive Rosfield", "Torgal"],
    status: "published",
    description: `Episode 13 of Final Fantasy XVI!\n\nWe conquer Valisthea's most powerful S-Rank bounty marks—Svarog the Ruin Dragon and Behemoth King! With rare Orichalcum and Darksteel, we craft the ultimate weapon: GOTTERDAMMERUNG!`,
    chapters: [
      { timestamp: "00:00", title: "Nektar's Hunt Board Overview" },
      { timestamp: "35:00", title: "S-Rank Hunt: Svarog the Ruin Dragon" },
      { timestamp: "1:15:00", title: "S-Rank Hunt: Behemoth King" },
      { timestamp: "2:10:00", title: "Crafting GOTTERDAMMERUNG Blade!" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Gotterdammerung", "Svarog", "Behemoth King", "Hunt Board"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "GOTTERDAMMERUNG!",
      subText: "EPISODE 13 • ULTIMATE WEAPON CRAFTED",
      themeColor: "#38bdf8"
    },
    bossStrategies: ["Svarog: Equip Fireward Bit and use Diamond Dust at 50% stagger for instant full stagger bar depletion."],
    equipmentNotes: "Equip Gotterdammerung (375 Attack / 375 Stagger)."
  },
  {
    id: 614,
    partNumber: 14,
    world: "Mysidia Coast & The Rising Tide",
    title: "Final Fantasy XVI #14 - LEVIATHAN THE LOST EIKON OF WATER!",
    shortTitle: "Leviathan the Lost Eikon",
    altTitles: [
      "THE LOST EIKON OF WATER! - Final Fantasy 16 Ep 14",
      "Ifrit vs Leviathan Tidal Wave Battle! - FF16 Walkthrough #14"
    ],
    estDurationMinutes: 180, // 3.0 hrs
    startPoint: "Journey to Northern Mysidia Sanctuary Coast",
    endPoint: "Defeating Leviathan the Waterbearer & Acquiring Water Shard",
    keyEvents: [
      "Traveling to the hidden northern realm of Mysidia with Shula",
      "Uncovering the ancient mythos of the Lost Eikon Leviathan",
      "Epic Eikon Clash: Eikon Ifrit vs Eikon Leviathan in the tidal abyss",
      "Acquiring Water Shard & Leviathan Eikonic Abilities"
    ],
    keyItemsAndEspers: ["Water Shard", "Tidal Pearl", "Leviathan's Blessing"],
    partyMembers: ["Clive Rosfield", "Joshua Rosfield", "Shula", "Torgal"],
    status: "published",
    description: `Episode 14 of Final Fantasy XVI!\n\nWe journey to Mysidia's coast to uncover the lost history of Leviathan the Waterbearer. Clive becomes Eikon Ifrit to battle Leviathan across a towering tidal wave wall!`,
    chapters: [
      { timestamp: "00:00", title: "Arrival at Mysidia Coast" },
      { timestamp: "50:00", title: "The Lost Eikon Lore" },
      { timestamp: "1:40:00", title: "EIKON BOSS: Ifrit vs Leviathan" },
      { timestamp: "2:40:00", title: "Acquiring Water Shard" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Leviathan", "Mysidia", "Ifrit", "Water Shard"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "LEVIATHAN SLAIN!",
      subText: "EPISODE 14 • LOST EIKON OF WATER",
      themeColor: "#06b6d4"
    },
    bossStrategies: ["Leviathan: Keep Water Barrier up during Leviathan's Tsunami casting channel and use Spitfire to break its shield."],
    equipmentNotes: "Master Water Serpent skills."
  },
  {
    id: 615,
    partNumber: 15,
    world: "Sky Citadel Origin & Valisthea Climax",
    title: "Final Fantasy XVI #15 - GRAND FINALE: ORIGIN & CREATOR ULTIMALIUS!",
    shortTitle: "Grand Finale: Origin & Ultimalius",
    altTitles: [
      "100% ENDING & FINAL BOSS ULTIMALIUS! - Final Fantasy 16 Ep 15",
      "Clive Rosfield's Final Destiny! - FF16 Walkthrough FINALE"
    ],
    estDurationMinutes: 210, // 3.5 hrs
    startPoint: "Hideaway Farewell Gathering & Ascending to Sky Citadel Origin",
    endPoint: "Origin Citadel Core: Slaying Creator Ultimalius & 100% Ending Cutscenes",
    keyEvents: [
      "Hideaway farewell gatherings with Jill Warrick, Otto, Gav, Mid, Blackthorne & Harpocrates",
      "Enterprise ascending into the sky to assault the crystalline citadel Origin",
      "Joshua Rosfield passing the Eikon Phoenix power to Clive inside Origin sanctuary",
      "FINAL BOSS GAUNTLET: Ultima Prime, Ultimalius (The Creator God)",
      "Clive channeling ALL Eikonic forces (Fire, Wind, Lightning, Earth, Light, Dark) into one ultimate punch",
      "Destroying the last Mothercrystal & ending the Blight forever across Valisthea",
      "Emotional Sunrise Ending & Post-Credits Epilogue"
    ],
    keyItemsAndEspers: ["Ultima Weapon Shard", "Valisthean Peace", "Joshua's Journal", "Clive's Quill"],
    partyMembers: ["Clive Rosfield", "Joshua Rosfield", "Dion Lesage"],
    status: "published",
    description: `THE GRAND FINALE! Episode 15 of our 100% Final Fantasy XVI Walkthrough!\n\nClive, Joshua, and Dion mount their final assault on Origin, the floating ancient citadel. In an unforgettable battle across the stars, Clive absorbs all Eikonic forces to become Mythos, confronting Ultimalius before freeing Valisthea forever!\n\nCHAPTER TIMESTAMPS:\n00:00 - Hideaway Farewell Gathering (Jill, Otto, Gav, Mid)\n32:00 - Enterprise Flying into Origin Sky Citadel\n1:05:00 - Citadel Infiltration & Ultima's Sanctuary\n1:42:00 - Joshua's Legacy & Phoenix Passed to Clive\n2:15:00 - FINAL BOSS Phase 1: Ultima Prime\n2:55:00 - FINAL BOSS Phase 2: Ultimalius (Creator God)\n3:30:00 - The Final Punch & Destruction of the Mothercrystals\n3:42:15 - Sunrise Ending Cutscene & Post-Credits Epilogue\n\nTHANK YOU for watching our 38-Hour FF16 100% Series!`,
    chapters: [
      { timestamp: "00:00", title: "Hideaway Farewell Gathering" },
      { timestamp: "32:00", title: "Enterprise Flying to Origin Citadel" },
      { timestamp: "1:05:00", title: "Citadel Infiltration & Sanctuary" },
      { timestamp: "1:42:00", title: "Joshua's Legacy & Phoenix Passed" },
      { timestamp: "2:15:00", title: "FINAL BOSS Phase 1: Ultima Prime" },
      { timestamp: "2:55:00", title: "FINAL BOSS Phase 2: Ultimalius" },
      { timestamp: "3:30:00", title: "The Final Punch & Mothercrystals Destroyed" },
      { timestamp: "3:42:15", title: "Sunrise Ending & Post-Credits Epilogue" }
    ],
    tags: ["Final Fantasy XVI", "FF16", "Ultimalius", "Ultima", "Finale", "100% Ending", "Clive Rosfield", "Final Boss"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Clive",
      overlayText: "GRAND FINALE COMPLETE!",
      subText: "EPISODE 15 • 100% SERIES COMPLETE",
      themeColor: "#ef4444"
    },
    bossStrategies: [
      "Ultimalius: Rotate Gigaflare, Diamond Dust, and Zantetsuken Level 5 in sequence during stagger states for 200,000+ total burst damage!"
    ],
    equipmentNotes: "Congratulations on completing 100% Final Fantasy XVI Playthrough!"
  }
];

// ==========================================
// FINAL FANTASY XVI PLAYTHROUGH SERIES OBJECT
// ==========================================
export const ff16PlaythroughSeries: PlaythroughSeries = {
  id: "final-fantasy-xvi",
  gameTitle: "Final Fantasy XVI",
  gameTitleLogo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 80" fill="none"><text x="10" y="45" font-family="'Times New Roman', serif" font-size="34" font-weight="900" fill="%23f8fafc" letter-spacing="2">FINAL FANTASY</text><text x="280" y="45" font-family="'Times New Roman', serif" font-size="36" font-weight="900" fill="%23ef4444">XVI</text><text x="12" y="65" font-family="sans-serif" font-size="10" font-weight="800" fill="%23f59e0b" letter-spacing="4">VALISTHEA • 100% GUIDE</text></svg>`,
  useTitleLogo: true,
  gameSynopsis: "In the land of Valisthea, mothercrystals provide magical aether while dominant individuals channel the catastrophic powers of Eikons. Clive Rosfield, First Shield of Rosaria, embarks on a dark quest for revenge following a tragic betrayal at Phoenix Gate, ultimately unraveling a sinister god-like entity threatening the realm.",
  gameSynopsisSource: "AI Web Scraped via Google Search Grounding",
  subtitle: "Main Story & Eikon Power 100% Walkthrough",
  badgeText: "FINAL FANTASY XVI",
  accentColor: "#ef4444",
  genre: "Action RPG / Dark Fantasy",
  playthroughType: "100% Walkthrough",
  createdAt: "2026-08-08",
  episodes: ff16Episodes,
  quests: ff16Quests,
};
