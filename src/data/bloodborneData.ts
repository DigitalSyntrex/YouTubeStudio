import { Episode, PlaythroughSeries, QuestEntry, BossEntry, LootEntry } from "../types";

// ==========================================
// BLOODBORNE - HERO & CHARACTER PROFILES
// ==========================================
export interface BloodborneHeroProfile {
  id: string;
  name: string;
  title: string;
  factionOrRole: string;
  origin: string;
  trickWeapon: string;
  firearm: string;
  biography: string;
  keyAbilities: string[];
}

export const bloodborneHeroProfiles: BloodborneHeroProfile[] = [
  {
    id: "the_good_hunter",
    name: "The Good Hunter",
    title: "Paleblood Hunter & Slayer of Nightmares",
    factionOrRole: "Hunter of the Dream",
    origin: "Foreigner / Yharnam Traveler",
    trickWeapon: "Saw Cleaver / Ludwig's Holy Blade / Holy Moonlight Sword",
    firearm: "Hunter Pistol / Evelyn",
    biography: "An afflicted outsider who journeyed to the gothic city of Yharnam seeking Paleblood ministration. Bound to the Hunter's Dream by Gehrman, the Hunter awakens repeatedly across the bloody Night of the Hunt to uncover the cosmic horrors of Byrgenwerth and the Healing Church.",
    keyAbilities: ["Visceral Counter / Parrying", "Rally Regain Mechanic", "Trick Weapon Transformed Combos", "Hunter Tools & Arcane Spells", "Beast Blood Pellet Burst"]
  },
  {
    id: "plain_doll",
    name: "The Plain Doll",
    title: "Caretaker of the Hunter's Dream",
    factionOrRole: "Great One Conduit / Dream Guide",
    origin: "Hunter's Dream Workshop",
    trickWeapon: "None (Channels Blood Echoes)",
    firearm: "None",
    biography: "A gentle porcelain doll crafted by Gehrman in the likeness of his former apprentice, Lady Maria. Animated by mysterious eldritch power, she channels Blood Echoes to bestow strength upon the Hunter and watches over the Dream with unconditional affection.",
    keyAbilities: ["Blood Echo Channeling", "Hunter Stat Augmentation", "Tears of Blood Resonance", "Dream Watcher"]
  },
  {
    id: "gehrman_first_hunter",
    name: "Gehrman, the First Hunter",
    title: "Keeper of the Dream & Old Hunter Patriarch",
    factionOrRole: "Old Hunters / Dream Host",
    origin: "Abandoned Old Workshop",
    trickWeapon: "Burial Blade (Scythe)",
    firearm: "Hunter Blunderbuss",
    biography: "The founding father of the workshop hunters who devised swift, acrobatic combat against the beastly scourge. Wheelchair-bound in the waking dream, Gehrman waits for the dawn to sever hunters from the nightmare or defend the Moon Presence's eternal contract.",
    keyAbilities: ["Wind-Slash Scythe Charge", "Instant Quickening Teleport", "Aerial Burial Slice", "High-Stagger Blunderbuss Blast"]
  },
  {
    id: "eileen_the_crow",
    name: "Eileen the Crow",
    title: "Hunter of Hunters",
    factionOrRole: "Crow Hunter Covenant",
    origin: "Foreign Lands",
    trickWeapon: "Blade of Mercy (Dual Daggers)",
    firearm: "Hunter Pistol",
    biography: "A veteran hunter wearing a raven cloak and beak mask tasked with executing hunters who have succumbed to bloodlust and the scourge of beasts. She aids the Hunter in Yharnam while pursuing Henryk and the treacherous Bloody Crow of Cainhurst.",
    keyAbilities: ["Crowfeather Step", "Rapid Blade Flurry", "Visceral Ambush", "Hunter of Hunters Badge"]
  },
  {
    id: "lady_maria",
    name: "Lady Maria of the Astral Clocktower",
    title: "Master of the Astral Clocktower & Cainhurst Royal",
    factionOrRole: "Old Hunters / Vileblood Descent",
    origin: "Castle Cainhurst / Research Hall",
    trickWeapon: "Rakuyo (Dual Twin Blades)",
    firearm: "Evelyn Repeating Pistol",
    biography: "One of Gehrman's first pupils and a distant relative of Queen Annalise. Tormented by guilt over the desecration of the Fishing Hamlet, she cast her weapon down a well and watches over the Research Hall patients to keep the secret of Kos buried forever.",
    keyAbilities: ["Rakuyo Blood & Fire Arc", "Visceral Riposte Grab", "Extended Blood Flame Trails", "Astral Clocktower Teleport"]
  },
  {
    id: "alfred_executioner",
    name: "Alfred, Hunter of Vilebloods",
    title: "Martyr Logarius's Devout Disciple",
    factionOrRole: "Healing Church Executioners",
    origin: "Cathedral Ward",
    trickWeapon: "Logarius' Wheel",
    firearm: "Church Blunderbuss",
    biography: "A zealous executioner dedicated to the teachings of Master Logarius. Obsessed with exterminating the blasphemous Vilebloods of Cainhurst Castle and delivering holy retribution to Queen Annalise.",
    keyAbilities: ["Logarius Wheel Spin Buff", "Radiance Caryll Rune", "Holy Ground Hammer Smash"]
  },
  {
    id: "ludwig_holy_blade",
    name: "Ludwig, the Holy Blade",
    title: "First Church Hunter & The Accursed Beast",
    factionOrRole: "Healing Church Workshop",
    origin: "Cathedral Ward / Hunter's Nightmare",
    trickWeapon: "Holy Moonlight Sword",
    firearm: "Ludwig's Rifle",
    biography: "The valiant leader of the Healing Church hunters who recruited Yharnam citizens to hunt the beast scourge. Corrupted by the nightmare into a monstrous equine abomination, Ludwig regains his noble mind upon catching sight of his guiding moonlight.",
    keyAbilities: ["Moonlight Wave Slash", "Ceiling Drop Crushing Charge", "Beast Flail & Acid Spit", "Arcane Moonlight Pillar Explosion"]
  }
];

// ==========================================
// BLOODBORNE - QUEST LINES & ARCS
// ==========================================
export const bloodborneQuests: QuestEntry[] = [
  {
    id: "bb_q1",
    title: "The Night of the Hunt & Hunter's Dream Initiation",
    category: "Main Story",
    actOrWorld: "Central Yharnam",
    location: "Iosefka's Clinic -> 1st Floor Sickroom -> Hunter's Dream",
    episodePart: 1,
    recommendedLevel: "BL 1 - 10",
    prerequisites: "Game Start",
    keyRewards: "Saw Cleaver / Hunter Axe / Threaded Cane, Hunter Pistol, Saw Hunter Badge",
    isMissable: false,
    status: "completed",
    notes: "Awaken in Iosefka's Clinic, succumb to the first Netherbeast Lycanthrope to reach the Hunter's Dream, choose starter trick weapon and firearm.",
  },
  {
    id: "bb_q2",
    title: "Eileen the Crow: Hunter of Hunters Covenant Arc",
    category: "Side Quest",
    actOrWorld: "Central Yharnam -> Cathedral Ward -> Grand Cathedral",
    location: "Central Yharnam Rafters -> Tomb of Oedon -> Grand Cathedral Steps",
    episodePart: 3,
    recommendedLevel: "BL 10 - 75",
    prerequisites: "Talk to Eileen in Central Yharnam rafters before defeating Vicar Amelia",
    keyRewards: "Crow Hunter Badge, Blade of Mercy, Crowfeather Set, Hunter Oath Rune (+Stamina Regen)",
    isMissable: true,
    status: "in_progress",
    notes: "CRITICAL: Do NOT hit Eileen. 1) Talk in rafters. 2) Help defeat Henryk in Tomb of Oedon. 3) Defeat Bloody Crow of Cainhurst at Grand Cathedral post-Blood Moon.",
  },
  {
    id: "bb_q3",
    title: "Father Gascoigne & The Tiny Music Box Tragedy",
    category: "Side Quest",
    actOrWorld: "Central Yharnam",
    location: "Central Yharnam Window -> Tomb of Oedon",
    episodePart: 2,
    recommendedLevel: "BL 10 - 18",
    prerequisites: "Talk to Gascoigne's Young Daughter in Central Yharnam window",
    keyRewards: "Tiny Music Box, Red Jeweled Brooch, Tear Blood Gem",
    isMissable: true,
    status: "completed",
    notes: "Use Tiny Music Box up to 3 times during Gascoigne fight to stagger him. Inspect Red Brooch or give to daughter for tragic storyline.",
  },
  {
    id: "bb_q4",
    title: "Alfred & The Extermination of Vileblood Queen Annalise",
    category: "Character Arc",
    actOrWorld: "Cathedral Ward -> Cainhurst Castle",
    location: "Cathedral Ward Tomb -> Forsaken Castle Cainhurst Throne Room",
    episodePart: 11,
    recommendedLevel: "BL 45 - 65",
    prerequisites: "Acquire Unopened Summons in Cainhurst & deliver to Alfred",
    keyRewards: "Wheel Hunter Badge, Logarius' Wheel, Radiance Oath Rune, Queenly Flesh",
    isMissable: true,
    status: "planned",
    notes: "Give Unopened Cainhurst Summons to Alfred. He crushes Queen Annalise into pulp. Use Queenly Flesh at Altar of Despair to resurrect her later.",
  },
  {
    id: "bb_q5",
    title: "Impostor Iosefka & Third Umbilical Cord Harvesting",
    category: "Secret/Optional",
    actOrWorld: "Central Yharnam / Forbidden Woods Shortcut",
    location: "Forbidden Woods Cave -> Iosefka's Clinic Back Entrance",
    episodePart: 7,
    recommendedLevel: "BL 35 - 55",
    prerequisites: "Reach back entrance of Iosefka's Clinic after Blood Moon (defeating Rom)",
    keyRewards: "One Third of Umbilical Cord (Cord 1/3), Cainhurst Summons, Oedon Writ",
    isMissable: true,
    status: "planned",
    notes: "CRITICAL: Do NOT kill Iosefka before the Blood Moon! Visit her after Rom when she is writhing on the operating table to harvest the Umbilical Cord safely.",
  },
  {
    id: "bb_q6",
    title: "Arianna the Vileblood Prostitute Sanctuary & Birth",
    category: "Side Quest",
    actOrWorld: "Cathedral Ward -> Oedon Tomb Sanctuary",
    location: "Cathedral Ward Alley -> Oedon Chapel -> Tomb of Oedon Aqueduct",
    episodePart: 4,
    recommendedLevel: "BL 20 - 70",
    prerequisites: "Send Arianna to Oedon Chapel (NOT Iosefka's Clinic)",
    keyRewards: "Arianna's Shoes, Blood of Arianna, One Third of Umbilical Cord (Cord 2/3)",
    isMissable: true,
    status: "planned",
    notes: "Tell Arianna about Oedon Chapel. Do NOT send the Suspicious Beggar there (he kills everyone). After defeating Micolash, kill her celestial offspring for the 2nd Umbilical Cord.",
  },
  {
    id: "bb_q7",
    title: "Djura the Powder Keg: Old Yharnam Gatling Gun Truce",
    category: "Secret/Optional",
    actOrWorld: "Old Yharnam",
    location: "Old Yharnam Clocktower Roof",
    episodePart: 3,
    recommendedLevel: "BL 25 - 40",
    prerequisites: "Encounter Darkbeast Paarl & enter Old Yharnam from behind without killing beasts",
    keyRewards: "Powder Keg Hunter Badge, Stake Driver, Rifle Spear, Brush Off Dust Gesture",
    isMissable: true,
    status: "planned",
    notes: "Sneak up behind Djura from Graveyard of the Darkbeast. Agree to spare the beasts of Old Yharnam to befriend him and gain his badge peacefully.",
  },
  {
    id: "bb_q8",
    title: "Forsaken Castle Cainhurst & Martyr Logarius's Crown of Illusions",
    category: "Secret/Optional",
    actOrWorld: "Hemwick Charnel Lane -> Castle Cainhurst",
    location: "Hemwick Crossroads Obelisk -> Forsaken Castle Cainhurst",
    episodePart: 10,
    recommendedLevel: "BL 50 - 65",
    prerequisites: "Acquire Cainhurst Summons & approach obelisk in Hemwick",
    keyRewards: "Crown of Illusions, Chikage, Evelyn, Knight's Set, Cainhurst Badge, Join Vilebloods",
    isMissable: true,
    status: "planned",
    notes: "Ride ghost carriage to Castle Cainhurst. Defeat Martyr Logarius and equip Crown of Illusions to reveal Queen Annalise's secret throne.",
  },
  {
    id: "bb_q9",
    title: "Upper Cathedral Ward & The Healing Church Cosmic Choir",
    category: "Secret/Optional",
    actOrWorld: "Upper Cathedral Ward / Orphanage",
    location: "Yahar'gul Unseen Village Key -> Upper Cathedral Ward Gate",
    episodePart: 14,
    recommendedLevel: "BL 65 - 80",
    prerequisites: "Find Upper Cathedral Key in Yahar'gul prison cell",
    keyRewards: "Cosmic Eye Watcher Badge, A Call Beyond, Great Isz Chalice, Make Contact Gesture",
    isMissable: true,
    status: "planned",
    notes: "Survive Brainsucker hordes, defeat Celestial Emissary, break window to face Ebrietas Daughter of the Cosmos and access Altar of Despair.",
  },
  {
    id: "bb_q10",
    title: "The Old Hunters DLC: Ludwig, Maria & The Orphan of Kos",
    category: "Side Quest",
    actOrWorld: "Hunter's Nightmare -> Research Hall -> Fishing Hamlet",
    location: "Oedon Chapel Amygdala Portal -> Astral Clocktower -> Coast of Kos",
    episodePart: 16,
    recommendedLevel: "BL 75 - 95",
    prerequisites: "Acquire Eye of a Blood-drunk Hunter after defeating Vicar Amelia",
    keyRewards: "Holy Moonlight Sword, Rakuyo, Whirligig Saw, Kos Parasite, Bloodletter, Milkweed Rune",
    isMissable: false,
    status: "planned",
    notes: "Complete the masterwork 4-episode DLC saga: Slay Ludwig, scale the Research Hall, defeat Lady Maria, conquer the Fishing Hamlet and defeat the Orphan of Kos.",
  },
  {
    id: "bb_q11",
    title: "Childhood's Beginning: The True Eldritch Transcendence Ending",
    category: "Point of No Return",
    actOrWorld: "Hunter's Dream",
    location: "Hunter's Dream Great Tree",
    episodePart: 20,
    recommendedLevel: "BL 85 - 100",
    prerequisites: "Consume 3 One Third of Umbilical Cords before confronting Gehrman",
    keyRewards: "Old Hunter Badge, Burial Blade, Moon Presence Trophy, Childhood's Beginning (Great One)",
    isMissable: true,
    status: "planned",
    notes: "Consume all 3 Umbilical Cords, refuse Gehrman's offer, slay Gehrman the First Hunter, resist the Moon Presence's gaze and defeat the Moon Presence to become an infant Great One!",
  }
];

// ==========================================
// BLOODBORNE - BOSS CATALOG & STRATEGIES
// ==========================================
export const bloodborneBosses: BossEntry[] = [
  {
    id: "bb_cleric_beast",
    name: "Cleric Beast",
    episodePart: 1,
    location: "Great Bridge (Central Yharnam)",
    world: "Central Yharnam",
    hp: "3,015",
    weakness: "Serration (+20% Dmg) / Fire Paper / Head Visceral",
    stealCommon: "Quicksilver Bullets x10",
    stealRare: "Blood Vials x10",
    dropLoot: "Sword Hunter Badge (+1 Insight)",
    strategyTip: "Target the giant left arm and lock onto the head. Fire 2-3 pistol shots at the head to trigger a devastating Visceral Attack. Stay behind its right hip!",
    isMissable: true,
    defeated: true,
  },
  {
    id: "bb_father_gascoigne",
    name: "Father Gascoigne (The Hunter Turned Beast)",
    episodePart: 2,
    location: "Tomb of Oedon",
    world: "Central Yharnam",
    hp: "2,031",
    weakness: "Gun Parrying / Tiny Music Box / Fire",
    stealCommon: "Blood Vial x5",
    stealRare: "Quicksilver Bullet x5",
    dropLoot: "Oedon Tomb Key & Red Jeweled Brooch",
    strategyTip: "Phase 1: Parry his axe swings with gunshot riposte. Phase 2: Use Tiny Music Box to stun him for 4 seconds. Phase 3 (Beast): Dodge TOWARD his swipes, toss Molotov Cocktails!",
    isMissable: false,
    defeated: true,
  },
  {
    id: "bb_blood_starved_beast",
    name: "Blood-starved Beast",
    episodePart: 3,
    location: "Church of the Good Chalice",
    world: "Old Yharnam",
    hp: "3,470",
    weakness: "Pungent Blood Cocktail / Fire Paper / Serration",
    stealCommon: "Antidote x3",
    stealRare: "Fire Paper x2",
    dropLoot: "Pthumeru Chalice & Blood Echoes (6,600)",
    strategyTip: "Toss a Pungent Blood Cocktail into a corner. The beast will ignore you for 8 seconds. Get behind it and execute a fully charged R2 backstab + Visceral! Keep Antidotes ready.",
    isMissable: true,
    defeated: true,
  },
  {
    id: "bb_vicar_amelia",
    name: "Vicar Amelia",
    episodePart: 4,
    location: "Grand Cathedral",
    world: "Cathedral Ward",
    hp: "5,375",
    weakness: "Fire Paper / Serration / Numbing Mist (Heal Block)",
    stealCommon: "Blood Vial x6",
    stealRare: "Numbing Mist x2",
    dropLoot: "Gold Pendant & Access to Forbidden Woods Password",
    strategyTip: "Break her left and right limbs to stagger her into visceral states. When she clasps her hands to pray and heal, immediately toss Numbing Mist to cancel her recovery!",
    isMissable: false,
    defeated: true,
  },
  {
    id: "bb_witch_of_hemwick",
    name: "The Witch of Hemwick (x2)",
    episodePart: 5,
    location: "Witch's Abode",
    world: "Hemwick Charnel Lane",
    hp: "2,611 (Shared)",
    weakness: "0 Insight Strategy / Arcane / Physical",
    stealCommon: "Pebbles x10",
    stealRare: "Blood Vial x4",
    dropLoot: "Rune Workshop Tool & Bloodshot Eyeball x4",
    strategyTip: "PRO TIP: Enter the boss arena with 0 Insight (spend at Hunter's Dream bath). The Mad Ones will NEVER SPAWN! The witches are completely helpless and easy to backstab.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "bb_shadows_of_yharnam",
    name: "Shadows of Yharnam (Trio)",
    episodePart: 8,
    location: "Forbidden Grave",
    world: "Forbidden Woods",
    hp: "3,646 (Combined)",
    weakness: "Bolt Paper / Gun Parrying / Giant Tombstone Looping",
    stealCommon: "Fire Paper x2",
    stealRare: "Shaman Bone Blade",
    dropLoot: "Blood Rapture Caryll Rune (+200 HP on Visceral)",
    strategyTip: "Focus kill order: 1) Katana aggressive swordsman (parry him easily). 2) Katana/Candle pyromancer. 3) Fireball mage. Use giant gravestone to block fireball projectiles.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "bb_rom_vacuous_spider",
    name: "Rom, the Vacuous Spider",
    episodePart: 9,
    location: "Moonside Lake",
    world: "Byrgenwerth",
    hp: "5,071",
    weakness: "Bolt Paper / Unarmored Soft Abdomen (Flanks)",
    stealCommon: "Blue Elixir x2",
    stealRare: "Sedative x3",
    dropLoot: "Kin Coldblood (12) & Blood Moon Cinematic Trigger",
    strategyTip: "Do not hit Rom's hard armored face! Clear small spiders in Phase 1. Buff with Beast Blood Pellet + Bolt Paper on bare abdomen. When she rolls onto back, run sideways to avoid meteors!",
    isMissable: false,
    defeated: true,
  },
  {
    id: "bb_darkbeast_paarl",
    name: "Darkbeast Paarl",
    episodePart: 6,
    location: "Graveyard of the Darkbeast",
    world: "Hypogean Gaol / Yahar'gul",
    hp: "4,552",
    weakness: "Serration / Fire Paper / Limb Breaking",
    stealCommon: "Bolt Paper x2",
    stealRare: "Quicksilver Bullets x6",
    dropLoot: "Spark Hunter Badge (Unlocks Tonitrus)",
    strategyTip: "Do not lock on! Roll directly beneath its ribs and hit its skinny legs with overhead heavy attacks. Breaking a leg discharges its electrical aura and knocks it to the floor for free damage.",
    isMissable: true,
    defeated: true,
  },
  {
    id: "bb_the_one_reborn",
    name: "The One Reborn",
    episodePart: 12,
    location: "Advent Plaza",
    world: "Yahar'gul, Unseen Village",
    hp: "10,375",
    weakness: "Bolt Paper / Fire / Kill Balcony Bell Ringers First",
    stealCommon: "Blood Vial x10",
    stealRare: "Sedative x2",
    dropLoot: "Yellow Backbone x3 & Access to Lecture Building 2F",
    strategyTip: "Run up the spiral staircases on the left and right sides immediately to slay the 6 chime maidens hurling fireballs. Then drop down and burst its center limbs with Bolt Paper.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "bb_martyr_logarius",
    name: "Martyr Logarius",
    episodePart: 10,
    location: "Cainhurst Castle Rooftops",
    world: "Forsaken Castle Cainhurst",
    hp: "9,081",
    weakness: "Gun Parrying / Backstab Sword Charge / Viscerals",
    stealCommon: "Numbing Mist x2",
    stealRare: "Blood Vial x5",
    dropLoot: "Crown of Illusions & Trophy",
    strategyTip: "Phase 1: Dodge forward-left through skull magic. When he charges red buff aura, backstab him to allow parries! Phase 2: Shoot the sword planted in ground to stop spectral daggers.",
    isMissable: true,
    defeated: true,
  },
  {
    id: "bb_amygdala",
    name: "Amygdala (Lesser Great One)",
    episodePart: 13,
    location: "Amygdala's Chamber",
    world: "Nightmare Frontier",
    hp: "6,404",
    weakness: "Head & Glowing Arms (High Multiplier) / Arcane / Bolt",
    stealCommon: "Lead Elixir x2",
    stealRare: "Blood Vial x6",
    dropLoot: "Ailing Loran Chalice & 21,000 Blood Echoes",
    strategyTip: "Bait its 7-slam attack, then rush in to smash its low-hanging head with jump attacks. In Phase 3 when it rips off its own arms, stand by its tail and wait for it to jump—don't move and charge R2!",
    isMissable: true,
    defeated: true,
  },
  {
    id: "bb_celestial_emissary",
    name: "Celestial Emissary",
    episodePart: 14,
    location: "Lumenflower Gardens",
    world: "Upper Cathedral Ward",
    hp: "2,764",
    weakness: "Thrust Damage / Bolt Paper / Shaman Bone Blade",
    stealCommon: "Blue Elixir x3",
    stealRare: "Sedative x2",
    dropLoot: "Communion Caryll Rune (+Blood Vial Capacity)",
    strategyTip: "Identify the real alien who doesn't sprint aggressively. When it grows into a colossal mushroom giant, hit it with Thrust attacks or Bolt Paper. Shaman Bone Blade turns minions on him!",
    isMissable: true,
    defeated: true,
  },
  {
    id: "bb_ebrietas",
    name: "Ebrietas, Daughter of the Cosmos",
    episodePart: 15,
    location: "Altar of Despair",
    world: "Upper Cathedral Ward",
    hp: "12,493",
    weakness: "Thrust Damage / Bolt Paper / Soft Head Target",
    stealCommon: "Frenzy Coldblood x1",
    stealRare: "Sedative x4",
    dropLoot: "Great Isz Chalice & Access to Altar of Despair Resurrections",
    strategyTip: "Position between her two split tail flaps behind her. Attack her soft head after head-slams. When she casts A Call Beyond laser star barrage, sprint continuously in a wide circle!",
    isMissable: true,
    defeated: true,
  },
  {
    id: "bb_micolash",
    name: "Micolash, Host of the Nightmare",
    episodePart: 18,
    location: "Mensis Loft",
    world: "Nightmare of Mensis",
    hp: "5,250",
    weakness: "Poison Knives (Balcony Cheese) / Beast Roar / Arcane Interruption",
    stealCommon: "Quicksilver Bullets x12",
    stealRare: "Sedative x3",
    dropLoot: "Mensis Cage Helm & 48,400 Blood Echoes",
    strategyTip: "Herd him into the first room. In Phase 2, stand on the balcony above his locked room and throw 3 Poison Knives. He will teleport in place and succumb to poison without casting A Call Beyond!",
    isMissable: false,
    defeated: true,
  },
  {
    id: "bb_mergos_wet_nurse",
    name: "Mergo's Wet Nurse",
    episodePart: 19,
    location: "Lunarium Apex",
    world: "Nightmare of Mensis",
    hp: "14,081",
    weakness: "Bolt Paper / Rapid Poison / Back Hips Blind Spot",
    stealCommon: "Blood Vial x10",
    stealRare: "Sedative x5",
    dropLoot: "One Third of Umbilical Cord (Cord 3/3)",
    strategyTip: "Hug her rear feathers! Her multi-sword whirlwind strikes only hit the front 180 degrees. When purple nightmare fog descends, run in clockwise circles around the arena perimeter until fog lifts.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "bb_ludwig_dlc",
    name: "Ludwig, the Accursed / Holy Blade (DLC)",
    episodePart: 16,
    location: "Underground Corpse Pile",
    world: "The Hunter's Nightmare (DLC)",
    hp: "16,650",
    weakness: "Serration (Phase 1) / Fire Paper / Gun Parries (Phase 2)",
    stealCommon: "Blood Vial x10",
    stealRare: "Fire Paper x3",
    dropLoot: "Holy Moonlight Sword & Guidance Caryll Rune",
    strategyTip: "Phase 1: Roll left through his biting charges. When blood drips from ceiling, sprint across the room. Phase 2: Stay close to his legs and circle clockwise. Parry his sword slashes!",
    isMissable: false,
    defeated: true,
  },
  {
    id: "bb_living_failures_dlc",
    name: "Living Failures (DLC)",
    episodePart: 17,
    location: "Lumenwood Garden (DLC)",
    world: "Research Hall (DLC)",
    hp: "20,580 (Shared Pool)",
    weakness: "Bolt Paper / Visceral Attacks / Heir Rune Blood Echo Glitch",
    stealCommon: "Blue Elixir x4",
    stealRare: "Sedative x4",
    dropLoot: "Astral Clocktower Key & Millions of Echoes (with Heir runes)",
    strategyTip: "Use the large central Lumenwood tree as cover from arcane homing orbs. Backstab the physical spellcasters. When the sky turns cosmic black, hide behind the tree on the right side.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "bb_lady_maria_dlc",
    name: "Lady Maria of the Astral Clocktower (DLC)",
    episodePart: 17,
    location: "Astral Clocktower (DLC)",
    world: "Astral Clocktower (DLC)",
    hp: "14,081",
    weakness: "Gun Parrying / Augur of Ebrietas Backstabs / Fast R1 Stagger",
    stealCommon: "Quicksilver Bullets x12",
    stealRare: "Blood Vial x8",
    dropLoot: "Celestial Dial & Unlocks Fishing Hamlet",
    strategyTip: "Master parry timings! Fire your pistol just as her blade arm reaches maximum pullback. Equip Clawmark rune for 5,000+ damage viscerals. In Phase 3, dodge forward-left into her blood flames.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "bb_orphan_of_kos_dlc",
    name: "Orphan of Kos (DLC Final Boss)",
    episodePart: 18,
    location: "Coast of Kos",
    world: "Fishing Hamlet (DLC)",
    hp: "19,217",
    weakness: "Backstab Fishing / Gun Parrying / Fighting in Water",
    stealCommon: "Blood Vial x12",
    stealRare: "Quicksilver Bullets x12",
    dropLoot: "Kos Parasite Weapon & 60,000 Blood Echoes",
    strategyTip: "Fight out in the deep water! The arena is completely flat and Kos' corpse lightning wave is much easier to dodge far out in the bay. Backstab him when he jumps overhead or leaps to slam placenta.",
    isMissable: false,
    defeated: true,
  },
  {
    id: "bb_laurence_dlc",
    name: "Laurence, the First Vicar (DLC Secret)",
    episodePart: 19,
    location: "Hunter's Nightmare Grand Cathedral",
    world: "The Hunter's Nightmare (DLC)",
    hp: "21,243",
    weakness: "Serration / Bolt Paper / Arcane Projectiles (Simon's Bowblade)",
    stealCommon: "Fire Paper x4",
    stealRare: "Blood Vial x10",
    dropLoot: "Beast's Embrace Caryll Rune (Transforms Hunter into Beast)",
    strategyTip: "Acquire Laurence's Skull in Research Hall elevator. Phase 1: Heavy fire explosions; dodge backward after swipes. Phase 2 (Legless): Circle his smaller left side as he crawls in lava circles.",
    isMissable: true,
    defeated: true,
  },
  {
    id: "bb_gehrman_final",
    name: "Gehrman, the First Hunter",
    episodePart: 20,
    location: "Hunter's Dream (Ash Fields Under Great Tree)",
    world: "Hunter's Dream",
    hp: "14,293",
    weakness: "Gun Parrying / Bolt Paper / Quickstep Viscerals",
    stealCommon: "Quicksilver Bullets x10",
    stealRare: "Blood Vial x10",
    dropLoot: "Old Hunter Badge (Unlocks Burial Blade Scythe)",
    strategyTip: "Choose 'Refuse' when Gehrman offers to awaken you. In 2-handed scythe form, shoot him right as he pulls back his heavy swing for guaranteed riposte. Avoid standing still when he leaps into the air.",
    isMissable: true,
    defeated: true,
  },
  {
    id: "bb_moon_presence_true_final",
    name: "Moon Presence (Flora, True Eldritch Boss)",
    episodePart: 20,
    location: "Hunter's Dream (Blood Moon Sky)",
    world: "Hunter's Dream",
    hp: "8,909",
    weakness: "Bolt Paper / Blood Pellets / Rally Regain Mechanic",
    stealCommon: "Blood Vial x10",
    stealRare: "Quicksilver Bullets x10",
    dropLoot: "Childhood's Beginning 100% Secret Ending (Great One Infant)",
    strategyTip: "Triggers only if you consumed 3 Umbilical Cords before Gehrman! When it casts its Gaze of Doom (reducing your HP to 1), DO NOT PANIC OR RUN AWAY. Rush forward and attack aggressively—the Rally mechanic restores all your HP instantly!",
    isMissable: true,
    defeated: true,
  }
];

// ==========================================
// BLOODBORNE - KEY LOOT, WEAPONS & RUNES
// ==========================================
export const bloodborneLoot: LootEntry[] = [
  {
    id: "bb_saw_cleaver",
    name: "Saw Cleaver",
    category: "Weapon/Armor",
    episodePart: 1,
    location: "Hunter's Dream / Central Yharnam Sewers",
    description: "Iconic serrated trick weapon. Grants +20% bonus damage against all beast enemies.",
    isMissable: false,
    collected: true,
  },
  {
    id: "bb_threaded_cane",
    name: "Threaded Cane",
    category: "Weapon/Armor",
    episodePart: 1,
    location: "Hunter's Dream",
    description: "Gentleman's cane transforming into a serrated bladed whip for crowd control.",
    isMissable: false,
    collected: true,
  },
  {
    id: "bb_hunter_axe",
    name: "Hunter Axe",
    category: "Weapon/Armor",
    episodePart: 1,
    location: "Hunter's Dream",
    description: "Heavy executioner axe. Transformed charged R2 'Spin-to-Win' flattens all humanoids.",
    isMissable: false,
    collected: true,
  },
  {
    id: "bb_ludwigs_holy_blade",
    name: "Ludwig's Holy Blade",
    category: "Weapon/Armor",
    episodePart: 5,
    location: "Purchased with Radiant Sword Hunter Badge",
    description: "Silver longsword slotting into a heavy greatsword sheath. Highest physical scaling in game.",
    isMissable: false,
    collected: true,
  },
  {
    id: "bb_chikage",
    name: "Chikage (Vileblood Katana)",
    category: "Weapon/Armor",
    episodePart: 10,
    location: "Cainhurst Castle Vileblood Shop",
    description: "Foreign curved katana. Sheathing coats the blade in blood for immense Bloodtinge damage.",
    isMissable: true,
    collected: true,
  },
  {
    id: "bb_blade_of_mercy",
    name: "Blade of Mercy",
    category: "Weapon/Armor",
    episodePart: 9,
    location: "Eileen the Crow Questline Reward",
    description: "Dual siderite daggers with blistering attack speed and dodge-attack damage multipliers.",
    isMissable: true,
    collected: true,
  },
  {
    id: "bb_holy_moonlight_sword",
    name: "Holy Moonlight Sword (DLC)",
    category: "Weapon/Armor",
    episodePart: 16,
    location: "Defeating Ludwig, the Holy Blade",
    description: "Legendary arcane greatsword firing moonlight projectile waves on charged attacks.",
    isMissable: false,
    collected: true,
  },
  {
    id: "bb_rakuyo",
    name: "Rakuyo (Lady Maria's Blades)",
    category: "Weapon/Armor",
    episodePart: 18,
    location: "Fishing Hamlet Shark Giant Well",
    description: "Elegant dual twinblade and dagger favored by Lady Maria. Fluid spinning martial combos.",
    isMissable: true,
    collected: true,
  },
  {
    id: "bb_whirligig_saw",
    name: "Whirligig Saw (Pizza Cutter)",
    category: "Weapon/Armor",
    episodePart: 16,
    location: "Hunter's Nightmare Church Cellar",
    description: "Colossal motorized buzzsaw. Holding L2 continuously shreds beast bosses with serration.",
    isMissable: false,
    collected: true,
  },
  {
    id: "bb_evelyn",
    name: "Evelyn (Cainhurst Pistol)",
    category: "Weapon/Armor",
    episodePart: 10,
    location: "Castle Cainhurst Library Chest",
    description: "Custom engraved pistol with supreme S-tier Bloodtinge scaling.",
    isMissable: true,
    collected: true,
  },
  {
    id: "bb_old_hunter_bone",
    name: "Old Hunter Bone",
    category: "Tool",
    episodePart: 6,
    location: "Abandoned Old Workshop Grave",
    description: "Arcane tool granting instant quickstep rolling and vanishing teleportation speed.",
    isMissable: true,
    collected: true,
  },
  {
    id: "bb_augur_of_ebrietas",
    name: "Augur of Ebrietas",
    category: "Tool",
    episodePart: 12,
    location: "Lecture Building 1F Room",
    description: "Summons eldritch tentacles from the cosmos. Can parry enemies even while 2-handing weapons!",
    isMissable: false,
    collected: true,
  },
  {
    id: "bb_a_call_beyond",
    name: "A Call Beyond",
    category: "Tool",
    episodePart: 14,
    location: "Upper Cathedral Ward Rafters",
    description: "Channels the wrath of Great Ones to shower the arena in homing star lasers.",
    isMissable: true,
    collected: true,
  },
  {
    id: "bb_blood_rock",
    name: "Blood Rock (+10 Weapon Slab)",
    category: "Key Item",
    episodePart: 19,
    location: "Mensis Loft Bottomless Pit / Fishing Hamlet",
    description: "Rare cosmic mineral required to reinforce a weapon from +9 to +10 maximum power.",
    isMissable: true,
    collected: true,
  },
  {
    id: "bb_cord_1",
    name: "One Third of Umbilical Cord (Iosefka)",
    category: "Key Item",
    episodePart: 9,
    location: "Iosefka's Clinic (Post-Rom Blood Moon)",
    description: "1st Cord: Harvested from pregnant Impostor Iosefka resting on the clinic table.",
    isMissable: true,
    collected: true,
  },
  {
    id: "bb_cord_2",
    name: "One Third of Umbilical Cord (Abandoned Workshop)",
    category: "Key Item",
    episodePart: 6,
    location: "Abandoned Old Workshop Altar",
    description: "2nd Cord: Discovered upon the altar of the real-world source of the Hunter's Dream.",
    isMissable: true,
    collected: true,
  },
  {
    id: "bb_cord_3",
    name: "One Third of Umbilical Cord (Mergo's Wet Nurse)",
    category: "Key Item",
    episodePart: 19,
    location: "Defeating Mergo's Wet Nurse in Mensis Apex",
    description: "3rd Cord: Left behind by the Great One wet nurse protecting infant Great One Mergo.",
    isMissable: false,
    collected: true,
  }
];

// ==========================================
// BLOODBORNE - COMPLETE 20-EPISODE 35-HOUR PLAYTHROUGH
// ==========================================
export const bloodborneEpisodes: Episode[] = [
  {
    id: 1001,
    partNumber: 1,
    world: "Central Yharnam",
    title: "Bloodborne #01 - THE NIGHT OF THE HUNT BEGINS! (Iosefka's Clinic & Cleric Beast)",
    shortTitle: "Night of the Hunt & Cleric Beast",
    altTitles: [
      "AWAKENING IN YHARNAM! - Bloodborne 100% Walkthrough Ep 1",
      "Cleric Beast On The Bridge! - Bloodborne First Playthrough #1",
      "Bloodborne Episode 1: Central Yharnam Mob & First Boss Fight"
    ],
    estDurationMinutes: 105,
    startPoint: "Iosefka's Clinic: Blood Transfusion & Awakening",
    endPoint: "Defeating the Cleric Beast on Great Bridge & Leveling Up",
    keyEvents: [
      "Blood Transfusion contract & werewolf encounter in 1st Floor Sickroom",
      "Transported to the Hunter's Dream; selecting Saw Cleaver & Hunter Pistol",
      "Navigating Central Yharnam street bonfire mob & brick trolls",
      "Meeting Gilbert through the window for Yharnam lore",
      "Sewers exploration: acquiring Hunter Set & Saw Hunter Badge",
      "Cleric Beast boss battle on the Great Bridge & Plain Doll awakening"
    ],
    keyItemsAndEspers: ["Saw Cleaver", "Hunter Pistol", "Hunter Garb Set", "Saw Hunter Badge", "Sword Hunter Badge"],
    partyMembers: ["The Good Hunter", "Plain Doll", "Gehrman"],
    status: "published",
    youtubeVideoId: "bb_ep01_hunt",
    videoStats: {
      views: 18450,
      likes: 1320,
      comments: 215,
      lastUpdated: "2026-08-12T12:00:00.000Z",
      videoId: "bb_ep01_hunt"
    },
    description: `Welcome to Episode 1 of our complete 100% Bloodborne Playthrough & Walkthrough! (35-Hour Definitive Edition)

We awaken in the nightmare-plagued gothic city of Yharnam on the fateful Night of the Hunt. After signing the blood contract and receiving our first weapons from the messengers in the Hunter's Dream, we fight through the burning streets of Central Yharnam, bypass the angry mob, explore the sewer aqueducts to secure the Hunter Armor, and confront the screaming Cleric Beast on the Great Bridge!

TIMESTAMPS:
00:00 - Opening Cinematic & Blood Transfusion Contract
07:45 - 1st Floor Sickroom & Dying to the Werewolf
14:20 - The Hunter's Dream: Choosing Saw Cleaver & Pistol
26:30 - Central Yharnam Street Mob & Bonfire Patrol
44:15 - Gilbert's Window & Shortcut Gates Opened
58:30 - Central Yharnam Sewers & Hunter Garb Set
1:18:45 - The Great Bridge & Brick Troll Encounters
1:32:00 - Boss Fight: Cleric Beast (Head Visceral Strategy)
1:41:15 - Awakening the Plain Doll & First Stat Upgrades

SUBSCRIBE for the complete 100% Bloodborne Series!
#Bloodborne #Soulsborne #FromSoftware #LetsPlay #Walkthrough #PlayStation`,
    chapters: [
      { timestamp: "00:00", title: "Opening Cinematic & Blood Contract" },
      { timestamp: "07:45", title: "Iosefka's Clinic & Werewolf Encounter" },
      { timestamp: "14:20", title: "Hunter's Dream Weapon Selection" },
      { timestamp: "26:30", title: "Central Yharnam Street Bonfire" },
      { timestamp: "44:15", title: "Gilbert's Window & Gate Shortcuts" },
      { timestamp: "58:30", title: "Central Yharnam Sewers Exploration" },
      { timestamp: "1:18:45", title: "Great Bridge & Giant Crows" },
      { timestamp: "1:32:00", title: "Boss Fight: Cleric Beast" },
      { timestamp: "1:41:15", title: "Plain Doll Channeling Blood Echoes" }
    ],
    tags: ["Bloodborne", "Central Yharnam", "Cleric Beast", "Saw Cleaver", "FromSoftware", "Soulsborne Walkthrough", "Let's Play"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "The Good Hunter",
      overlayText: "THE HUNT BEGINS!",
      subText: "EPISODE 01 • CENTRAL YHARNAM & CLERIC BEAST",
      themeColor: "#e11d48"
    },
    bossStrategies: [
      "Cleric Beast: Lock onto head and shoot 3 times with Hunter Pistol to stagger into a Visceral Attack. Stay glued to its smaller right side."
    ],
    equipmentNotes: "Equip Hunter Garb found in the sewer rafters immediately for superior physical and blood defense.",
    missableAlerts: [
      {
        itemName: "Eileen the Crow: Rafters Initiation & 'Shake Off Cape' Gesture",
        category: "NPC Quest",
        location: "Central Yharnam (Hidden rafters above sewer canal behind breakable barrels near dog cages)",
        howToGet: "Break barrels on the right side of the warehouse entrance above the dry canal, drop down to the rafters, and speak to Eileen repeatedly until she grants 'Shake Off Cape' gesture and 4x Bold Hunter's Marks.",
        lockoutTrigger: "Defeating Vicar Amelia or entering Forbidden Woods without speaking to Eileen here causes her questline to fail or makes her permanently hostile at Grand Cathedral later.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Must speak to Eileen in the rafters BEFORE defeating Vicar Amelia! If missed now, her entire Hunter of Hunters questline fails and the 'Hunter' Oath Rune (+Stamina recovery rate) CANNOT be obtained this playthrough!"
      },
      {
        itemName: "Tiny Music Box (Father Gascoigne Stun Item & Young Girl Quest)",
        category: "Key Item",
        location: "Central Yharnam lit window (Up the iron ladder past the sewer fountain)",
        howToGet: "Climb the iron ladder near the sewer gate fountain, talk to Viola's young daughter through the window, agree to search for her mother, and receive the Tiny Music Box.",
        lockoutTrigger: "Defeating Rom, the Vacuous Spider (Blood Moon trigger) permanently kills all window NPCs in Yharnam.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Obtain the Tiny Music Box before triggering the Blood Moon! Without it, Father Gascoigne cannot be stunned and the Red/White Ribbon questline is permanently locked out."
      },
      {
        itemName: "Flamesprayer Firearm (Gilbert at Central Yharnam Lamp)",
        category: "Weapon",
        location: "Central Yharnam Lamp (Window right next to the lamp post)",
        howToGet: "Talk to Gilbert through the window immediately after entering Cathedral Ward / defeating Father Gascoigne to receive the Flamesprayer for free.",
        lockoutTrigger: "Blood Moon (defeating Rom) causes Gilbert to turn into a beast and permanently locks out receiving the Flamesprayer for free.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Speak to Gilbert immediately upon entering Cathedral Ward to claim the Flamesprayer firearm before the beastly scourge claims him!"
      }
    ]
  },
  {
    id: 1002,
    partNumber: 2,
    world: "Central Yharnam -> Cathedral Ward",
    title: "Bloodborne #02 - FATHER GASCOIGNE & THE TOMB OF OEDON TRAGEDY!",
    shortTitle: "Father Gascoigne & Music Box",
    altTitles: [
      "BEASTS ALL OVER THE SHOP! - Bloodborne Ep 2",
      "Father Gascoigne Boss Fight! - Bloodborne 100% Walkthrough #2",
      "Bloodborne Episode 2: The Tiny Music Box & Entering Cathedral Ward"
    ],
    estDurationMinutes: 100,
    startPoint: "Central Yharnam Great Bridge Lamp",
    endPoint: "Cathedral Ward Oedon Chapel Lamp & Meeting Chapel Dweller",
    keyEvents: [
      "Locating Viola's Daughter at the window; receiving the Tiny Music Box",
      "Navigating the sewer giant pig tunnels & collecting Saw Hunter Badge",
      "Meeting Eileen the Crow on the high sewer rafters",
      "Confronting Father Gascoigne in the Tomb of Oedon graveyard",
      "Using Tiny Music Box to stun Gascoigne during his human and beast forms",
      "Unlocking Cathedral Ward and meeting the Oedon Chapel Dweller"
    ],
    keyItemsAndEspers: ["Tiny Music Box", "Red Jeweled Brooch", "Oedon Tomb Key", "Saw Hunter Badge"],
    partyMembers: ["The Good Hunter", "Eileen the Crow", "Oedon Chapel Dweller"],
    status: "published",
    youtubeVideoId: "bb_ep02_gascoigne",
    videoStats: {
      views: 15200,
      likes: 1140,
      comments: 178,
      lastUpdated: "2026-08-12T12:00:00.000Z",
      videoId: "bb_ep02_gascoigne"
    },
    description: `Episode 2 of our Bloodborne 100% Walkthrough!

We meet the tragic daughter of Father Gascoigne, obtain the mysterious Tiny Music Box, explore the deepest aqueduct tunnels, introduce ourselves to Eileen the Crow, and battle Father Gascoigne across the gravestones of Tomb of Oedon before unlocking the massive gates of Cathedral Ward!

TIMESTAMPS:
00:00 - Window Quest: Gascoigne's Daughter & Music Box
18:30 - Sewer Giant Boar & Visceral Execution
34:10 - Secret Rafters: Meeting Eileen the Crow
48:25 - Elevator Shortcut to Tomb of Oedon
1:02:40 - Boss Fight: Father Gascoigne (Parrying & Beast Phase)
1:22:15 - Inspecting the Red Jeweled Brooch
1:35:00 - Entering Cathedral Ward & Oedon Chapel Safe Haven

#Bloodborne #FatherGascoigne #CathedralWard #Soulsborne`,
    chapters: [
      { timestamp: "00:00", title: "Gascoigne's Daughter & Music Box" },
      { timestamp: "18:30", title: "Sewer Giant Boar Tunnels" },
      { timestamp: "34:10", title: "Meeting Eileen the Crow" },
      { timestamp: "48:25", title: "Elevator Shortcut to Tomb" },
      { timestamp: "1:02:40", title: "Boss Fight: Father Gascoigne" },
      { timestamp: "1:22:15", title: "Red Jeweled Brooch Decision" },
      { timestamp: "1:35:00", title: "Entering Cathedral Ward" }
    ],
    tags: ["Bloodborne", "Father Gascoigne", "Tomb of Oedon", "Tiny Music Box", "Cathedral Ward", "Eileen the Crow"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Father Gascoigne",
      overlayText: "BEASTS ALL OVER THE SHOP!",
      subText: "EPISODE 02 • TOMB OF OEDON TRAGEDY",
      themeColor: "#dc2626"
    },
    bossStrategies: [
      "Father Gascoigne: Parry his rolling axe attacks with pistol shot. Use Tiny Music Box when he transforms into a beast, then toss 2 Molotov Cocktails!"
    ],
    equipmentNotes: "Do NOT consume the Red Brooch; give it to the daughter or keep it for the Tear Gem later.",
    missableAlerts: [
      {
        itemName: "Red Jeweled Brooch & Viola's Memento",
        category: "Key Item",
        location: "Tomb of Oedon (Corpse on the roof overlooking Gascoigne's graveyard arena)",
        howToGet: "Drop down onto the rooftop from the upper staircase in Tomb of Oedon and inspect the dead woman's body to retrieve the Red Jeweled Brooch.",
        lockoutTrigger: "Skipping the rooftop pickup before advancing deep into Cathedral Ward / Blood Moon.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Pick up the Red Jeweled Brooch immediately after defeating Father Gascoigne! Inspecting it yields the Red Blood Gem (+Physical Atk) or triggers the daughter's ribbon arc."
      },
      {
        itemName: "'Triumph' Gesture (Oedon Chapel Dweller)",
        category: "Gesture",
        location: "Cathedral Ward (Oedon Chapel Dweller hunchback)",
        howToGet: "Talk to the red-cloaked Oedon Chapel Dweller after sending your first civilian survivor (e.g., Lonely Old Woman or Arianna) to Oedon Chapel.",
        lockoutTrigger: "If all survivors are killed or sent to Iosefka's clinic, or if the Dweller is killed, this gesture is permanently lost.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Send at least one friendly survivor to Oedon Chapel to receive the 'Triumph' gesture from the Chapel Dweller before the Blood Moon!"
      },
      {
        itemName: "Saw Hunter Badge (Central Yharnam Sewer Tunnel)",
        category: "Key Item",
        location: "Central Yharnam Sewers (Next to the Giant Boar in the canal tunnel)",
        howToGet: "Slay or sneak behind the Giant Man-Eating Boar in the sewer canal tunnel and loot the corpse right beside it to acquire the Saw Hunter Badge.",
        lockoutTrigger: "Failing to pick up this badge locks you out of purchasing the Saw Cleaver, Saw Spear, Hunter Axe, Threaded Cane, Hunter Pistol, and Hunter Blunderbuss from the Dream shop.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Collect the Saw Hunter Badge from the sewer boar tunnel to unlock all starter trick weapons and firearms at the Messengers' bath!"
      }
    ]
  },
  {
    id: 1003,
    partNumber: 3,
    world: "Old Yharnam",
    title: "Bloodborne #03 - OLD YHARNAM ASHES & DJURA'S GATLING GUN! (Blood-starved Beast)",
    shortTitle: "Old Yharnam & Blood-starved Beast",
    altTitles: [
      "SURVIVING THE GATLING GUN! - Bloodborne Ep 3",
      "Blood-starved Beast Cocktail Cheese! - Bloodborne 100% Walkthrough #3"
    ],
    estDurationMinutes: 110,
    startPoint: "Cathedral Ward Lower Plaza -> Old Yharnam Sealed Door",
    endPoint: "Defeating Blood-starved Beast & Acquiring Pthumeru Chalice",
    keyEvents: [
      "Unlocking the forbidden seal to burned Old Yharnam",
      "Dodging Djura's high-caliber rooftop Gatling gun fire",
      "Infiltrating the abandoned Church of the Good Chalice",
      "Meeting Alfred at the tomb altar to learn Church lore",
      "Defeating the Blood-starved Beast using Pungent Blood Cocktails",
      "Acquiring the first Pthumeru Chalice to unlock Chalice Dungeons"
    ],
    keyItemsAndEspers: ["Pthumeru Chalice", "Hunter's Torch", "Antidotes", "Fire Paper"],
    partyMembers: ["The Good Hunter", "Alfred (Summon)", "Djura the Hunter"],
    status: "published",
    description: "Episode 3: We descend into the burning, ruined district of Old Yharnam, dodge rooftop Gatling gun fire from Djura, and face the venomous Blood-starved Beast in the Church of the Good Chalice!",
    chapters: [
      { timestamp: "00:00", title: "Entering Burned Old Yharnam" },
      { timestamp: "22:15", title: "Djura's Gatling Gun Barrage" },
      { timestamp: "45:30", title: "Lower Rooftops & Shortcut Ladders" },
      { timestamp: "1:12:00", title: "Summoning Alfred the Executioner" },
      { timestamp: "1:28:40", title: "Boss Fight: Blood-starved Beast" },
      { timestamp: "1:44:00", title: "Pthumeru Chalice Acquired" }
    ],
    tags: ["Bloodborne", "Old Yharnam", "Blood-starved Beast", "Djura", "Pthumeru Chalice"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Blood-starved Beast",
      overlayText: "VENOMOUS NIGHTMARE!",
      subText: "EPISODE 03 • OLD YHARNAM & CHALICE UNLOCK",
      themeColor: "#9333ea"
    },
    bossStrategies: [
      "Blood-starved Beast: Throw Pungent Blood Cocktail into the right-hand corner wall. Attack from behind with Fire Paper. Use Antidotes in Phase 3."
    ],
    equipmentNotes: "Hunter's Torch deals bonus fire damage against cloaked beasts in Old Yharnam.",
    missableAlerts: [
      {
        itemName: "'Pray' Gesture & Fire Paper x3 (Alfred the Hunter of Vilebloods)",
        category: "Gesture",
        location: "Cathedral Ward (Balcony altar overlooking the entrance plaza to Old Yharnam)",
        howToGet: "Speak to Alfred praying at the chapel altar and select 'Cooperate with him' to receive Fire Paper x3 and the 'Pray' gesture.",
        lockoutTrigger: "Attacking Alfred or skipping his dialogue before the Blood Moon locks out his questline and the Wheel Hunter Badge.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Cooperate with Alfred now to receive the 'Pray' gesture and initiate the Executioner questline for Logarius' Wheel!"
      },
      {
        itemName: "Charred Hunter Garb Set (Hidden Old Yharnam Attic)",
        category: "Armor",
        location: "Old Yharnam (Hidden dilapidated attic with a werewolf jumping through the door)",
        howToGet: "Drop onto the rooftop on the right path under Djura's tower, enter the broken attic window, and loot the Charred Hunter Set from the corpse on the wooden boards.",
        lockoutTrigger: "Very easy to overlook due to heavy Gatling gun suppressing fire.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: The Charred Hunter Set provides the HIGHEST FIRE DEFENSE in the base game, crucial for Vicar Amelia and Laurence the First Vicar!"
      }
    ]
  },
  {
    id: 1004,
    partNumber: 4,
    world: "Cathedral Ward",
    title: "Bloodborne #04 - VICAR AMELIA & THE HEALING CHURCH SECRETS!",
    shortTitle: "Vicar Amelia & Grand Cathedral",
    altTitles: [
      "THE BEAST OF THE GRAND CATHEDRAL! - Bloodborne Ep 4",
      "Vicar Amelia 100% Walkthrough - Bloodborne Playthrough #4"
    ],
    estDurationMinutes: 95,
    startPoint: "Oedon Chapel -> Cathedral Ward Plaza",
    endPoint: "Defeating Vicar Amelia & Inspecting Laurence's Skull",
    keyEvents: [
      "Purchasing Hunter Chief Emblem to open Cathedral Ward gates",
      "Sending Arianna and Skeptical Man to Oedon Chapel safe haven",
      "Climbing the monumental Grand Cathedral stairs",
      "Vicar Amelia transformation and climatic beast battle",
      "Using Numbing Mist to cancel Amelia's self-healing prayers",
      "Touching Laurence's skull altar to trigger the 'Fear the Old Blood' flashback"
    ],
    keyItemsAndEspers: ["Gold Pendant", "Hunter Chief Emblem", "Numbing Mist", "Gold Blood Gem"],
    partyMembers: ["The Good Hunter", "Arianna", "Vicar Amelia"],
    status: "published",
    description: "Episode 4: We open the monumental gates of Cathedral Ward, rescue civilians for Oedon Chapel, and slay Vicar Amelia at the altar of the Grand Cathedral to learn the Byrgenwerth password!",
    chapters: [
      { timestamp: "00:00", title: "Cathedral Ward Gate Access" },
      { timestamp: "18:40", title: "Rescuing Arianna the Prostitute" },
      { timestamp: "35:10", title: "Church Servants & Wooden Shield" },
      { timestamp: "54:30", title: "Grand Cathedral Staircase Ascent" },
      { timestamp: "1:08:15", title: "Boss Fight: Vicar Amelia" },
      { timestamp: "1:26:00", title: "The Old Blood Memory Cutscene" }
    ],
    tags: ["Bloodborne", "Vicar Amelia", "Cathedral Ward", "Grand Cathedral", "Healing Church", "Lore"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Vicar Amelia",
      overlayText: "FEAR THE OLD BLOOD!",
      subText: "EPISODE 04 • GRAND CATHEDRAL & VICAR AMELIA",
      themeColor: "#f59e0b"
    },
    bossStrategies: [
      "Vicar Amelia: Break her hind legs with heavy Fire Paper attacks. When she clasps hands to heal, throw Numbing Mist immediately."
    ],
    equipmentNotes: "Crush the Gold Pendant to receive a powerful +12.6% Physical Atk Blood Gem.",
    missableAlerts: [
      {
        itemName: "Eileen the Crow: Oedon Tomb Henryk Duel Assistance",
        category: "NPC Quest",
        location: "Tomb of Oedon (Gascoigne's boss arena)",
        howToGet: "Open the front gates of Cathedral Ward using the Hunter Chief Emblem, talk to Eileen standing outside Oedon Chapel's front-left doorway until she warns you about Henryk, then immediately go to Tomb of Oedon to help her defeat Henryk. DO NOT HIT EILEEN!",
        lockoutTrigger: "Entering Forbidden Woods or defeating Vicar Amelia without assisting Eileen results in Eileen dying off-screen or turning permanently hostile at Grand Cathedral.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Eileen MUST survive the Henryk fight! If you enter Forbidden Woods without helping her, her questline fails permanently and the 'Hunter' Stamina Oath Rune and Blade of Mercy badge CANNOT be obtained!"
      },
      {
        itemName: "'Curtsy' Gesture & Arianna Sanctuary in Oedon Chapel",
        category: "NPC Quest",
        location: "Cathedral Ward Lower Alley (Red lit door near the fountain)",
        howToGet: "Knock on Arianna's door in the lower alley, tell her about Oedon Chapel safe haven, and visit her in Oedon Chapel to receive the 'Curtsy' gesture and Arianna's Blood.",
        lockoutTrigger: "Defeating Rom, the Vacuous Spider (Blood Moon) permanently seals all residential doors in Cathedral Ward.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Send Arianna to Oedon Chapel (NEVER Iosefka's clinic) BEFORE defeating Rom! If she is not in Oedon Chapel, her One Third of Umbilical Cord is PERMANENTLY LOST for the True Ending!"
      },
      {
        itemName: "Gold Pendant & Gold Blood Gem",
        category: "Key Item",
        location: "Grand Cathedral (Altar / Vicar Amelia drop)",
        howToGet: "Defeat Vicar Amelia to receive the Gold Pendant. Crush it in your inventory to acquire the powerful Gold Blood Gem (+12.6% Physical ATK vs Beasts).",
        lockoutTrigger: "Leaving the area or not collecting loot.",
        warning: "⚠️ Collect the Gold Pendant from Vicar Amelia to trigger the 'Fear the Old Blood' Laurence memory skull altar and get the best early physical gem!"
      }
    ]
  },
  {
    id: 1005,
    partNumber: 5,
    world: "Hemwick Charnel Lane",
    title: "Bloodborne #05 - HEMWICK CHARNEL LANE & RUNE WORKSHOP TOOL!",
    shortTitle: "Hemwick Charnel & Witch Boss",
    altTitles: [
      "UNLOCKING CARYLL RUNES! - Bloodborne Ep 5",
      "The 0 Insight Witch Trick! - Bloodborne 100% Walkthrough #5"
    ],
    estDurationMinutes: 90,
    startPoint: "Cathedral Ward Left Exit",
    endPoint: "Witch's Abode & Unlocking the Rune Workshop Memory Tool",
    keyEvents: [
      "Exploring the eerie cliffside cemeteries of Hemwick Charnel Lane",
      "Defeating crazed witch executioners and hunting hounds",
      "Discovering the horse carriage obelisk for Castle Cainhurst",
      "Witch of Hemwick boss encounter with 0 Insight cheese strategy",
      "Entering the secret basement to claim the Rune Workshop Tool",
      "Equipping first Caryll Runes in the Hunter's Dream"
    ],
    keyItemsAndEspers: ["Rune Workshop Tool", "Bloodshot Eyeball x4", "Lake Caryll Rune", "Bone Ash Set"],
    partyMembers: ["The Good Hunter", "Plain Doll"],
    status: "published",
    description: "Episode 5: We journey through the creepy misty roads of Hemwick Charnel Lane, slay the Witch of Hemwick with the 0-Insight strategy, and retrieve the indispensable Rune Workshop Tool!",
    chapters: [
      { timestamp: "00:00", title: "Road to Hemwick Charnel Lane" },
      { timestamp: "20:15", title: "Hemwick Mill & Madwomen Mobs" },
      { timestamp: "42:30", title: "Castle Cainhurst Obelisk Discovery" },
      { timestamp: "1:02:00", title: "Boss Fight: Witch of Hemwick" },
      { timestamp: "1:18:45", title: "Unlocking Rune Workshop Tool" }
    ],
    tags: ["Bloodborne", "Hemwick Charnel Lane", "Witch of Hemwick", "Caryll Runes", "Rune Workshop Tool"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "The Witch of Hemwick",
      overlayText: "RUNE WORKSHOP UNLOCKED!",
      subText: "EPISODE 05 • HEMWICK & CARYLL RUNES",
      themeColor: "#10b981"
    },
    bossStrategies: [
      "Witch of Hemwick: Enter with 0 Insight to prevent Mad One shadow stalkers from spawning at all. Walk up and backstab the invisible witches."
    ],
    equipmentNotes: "Equip Lake (+3% Physical DMG reduction) and Communion runes at the Hunter's Dream altar.",
    missableAlerts: [
      {
        itemName: "Rune Workshop Tool (Mandatory to Equip Caryll Runes)",
        category: "Tool",
        location: "Witch's Abode (Secret cellar room behind the Witch of Hemwick arena)",
        howToGet: "Descend the stone staircase at the back of the Witch of Hemwick boss room into the secret cellar, inspect the hunter corpse tied to the wooden chair, and loot the Rune Workshop Tool.",
        lockoutTrigger: "Overlooking the cellar staircase and teleporting back to the Dream immediately.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: You MUST retrieve the Rune Workshop Tool from the corpse behind the Witch of Hemwick! Without this key tool, you CANNOT equip any Caryll Runes or Oath Runes in the Hunter's Dream!"
      },
      {
        itemName: "Lake Caryll Rune (+3% Physical Damage Reduction)",
        category: "Rune",
        location: "Hemwick Charnel Lane (Cliffside path overlooking the lake before the barn)",
        howToGet: "Navigate the winding cliff path past the Molotov madwomen and loot the isolated corpse at the cliff ledge overlooking the moonlit lake.",
        lockoutTrigger: "Overlooked in the dark foliage.",
        warning: "⚠️ One of the best early-game defensive runes; provides flat physical damage resistance against all enemy attacks."
      }
    ]
  },
  {
    id: 1006,
    partNumber: 6,
    world: "Abandoned Workshop & Hypogean Gaol",
    title: "Bloodborne #06 - ABANDONED OLD WORKSHOP & SNATCHER PRISON KIDNAPPING!",
    shortTitle: "Real Dream & Darkbeast Paarl",
    altTitles: [
      "I FOUND THE REAL HUNTER'S DREAM! - Bloodborne Ep 6",
      "Kidnapped by Snatchers! - Bloodborne 100% Walkthrough #6"
    ],
    estDurationMinutes: 100,
    startPoint: "Healing Church Workshop Tower",
    endPoint: "Defeating Darkbeast Paarl & Unlocking Old Yharnam Shortcut",
    keyEvents: [
      "Ascending Healing Church Workshop tower; claiming Radiant Sword Hunter Badge",
      "Secret pit drop sequence into the real-world Abandoned Old Workshop",
      "Collecting the 1st One Third of Umbilical Cord, Doll Clothes & Old Hunter Bone",
      "Intentionally getting slain by a Death Dealer Snatcher to access Hypogean Gaol",
      "Rescuing Adella the Nun in the prison basement",
      "Slaying Darkbeast Paarl with limb-breaking tactics"
    ],
    keyItemsAndEspers: ["One Third of Umbilical Cord", "Old Hunter Bone", "Doll Outfit", "Spark Hunter Badge", "Tonitrus"],
    partyMembers: ["The Good Hunter", "Adella the Nun", "Defector Antal"],
    status: "published",
    description: "Episode 6: We perform the secret platform drop to find the real Abandoned Old Workshop in the waking world, get kidnapped to Hypogean Gaol prison, and conquer Darkbeast Paarl!",
    chapters: [
      { timestamp: "00:00", title: "Healing Church Workshop Tower" },
      { timestamp: "18:40", title: "Pit Drop to Abandoned Old Workshop" },
      { timestamp: "32:15", title: "Collecting 1st Umbilical Cord & Doll Gear" },
      { timestamp: "48:50", title: "Snatcher Kidnapping to Hypogean Gaol" },
      { timestamp: "1:08:20", title: "Rescuing Adella the Nun" },
      { timestamp: "1:24:00", title: "Boss Fight: Darkbeast Paarl" }
    ],
    tags: ["Bloodborne", "Abandoned Old Workshop", "Umbilical Cord", "Hypogean Gaol", "Darkbeast Paarl", "Lore"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Darkbeast Paarl",
      overlayText: "THE SECRET DREAM & JAIL!",
      subText: "EPISODE 06 • ABANDONED WORKSHOP & PAARL",
      themeColor: "#38bdf8"
    },
    bossStrategies: [
      "Darkbeast Paarl: Don't lock on. Roll under its ribs and strike its legs with high-stagger blunt weapons to discharge its electrical charge."
    ],
    equipmentNotes: "Old Hunter Bone enables high-speed flash-step evasions for 15 seconds.",
    missableAlerts: [
      {
        itemName: "One Third of Umbilical Cord (Cord 1/4 - Abandoned Old Workshop)",
        category: "Key Item",
        location: "Abandoned Old Workshop (Secret drop down wooden rafters in Healing Church Workshop pit)",
        howToGet: "Carefully drop onto the middle wooden platform in the Healing Church Workshop pit, open the secret wooden double doors to enter the real-world Abandoned Old Workshop, and loot the altar table to obtain the 1st One Third of Umbilical Cord.",
        lockoutTrigger: "Failing to collect all 3 Umbilical Cords prevents fighting the Moon Presence and unlocking the True Eldritch Ending.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Collect this guaranteed Umbilical Cord now! It requires no NPC prerequisites and is essential for unlocking the True Ending and Moon Presence boss fight!"
      },
      {
        itemName: "Old Hunter Bone & Doll Clothes Set",
        category: "Tool",
        location: "Abandoned Old Workshop (Chests & Grave Altar)",
        howToGet: "Loot the grave altar and chests in the Abandoned Old Workshop to retrieve the Old Hunter Bone (enables teleport flash-step dodge) and the full Doll Armor Set.",
        lockoutTrigger: "Hidden secret area.",
        warning: "⚠️ The Doll Armor set sells for over 35,000 Blood Echoes or provides great elemental defense early on!"
      },
      {
        itemName: "'Church Bow (Female)' Gesture & Adella the Nun Rescue",
        category: "Gesture",
        location: "Hypogean Gaol (Prison basement cell reached via Snatcher sack kidnap)",
        howToGet: "Equip Healing Church attire (Father Gascoigne Set, Black Church Set, or Executioner Set), speak to Adella crying in the corner, tell her about Oedon Chapel safe haven, and receive the 'Church Bow (Female)' gesture.",
        lockoutTrigger: "Defeating Rom (Blood Moon) permanently destroys Hypogean Gaol, kills Adella, and locks out her gesture and blood vials!",
        warning: "⚠️ PERMANENT MISSABLE WARNING: You MUST get captured by a Snatcher and rescue Adella BEFORE defeating Rom! Once the Blood Moon rises, Adella is killed in the prison!"
      }
    ]
  },
  {
    id: 1007,
    partNumber: 7,
    world: "Forbidden Woods",
    title: "Bloodborne #07 - FORBIDDEN WOODS & IOSEFKA'S SECRET CLINIC SHORTCUT!",
    shortTitle: "Forbidden Woods & Iosefka Shortcut",
    altTitles: [
      "THE SNAKE INFESTED FOREST! - Bloodborne Ep 7",
      "Secret Shortcut to Iosefka's Clinic! - Bloodborne Walkthrough #7"
    ],
    estDurationMinutes: 115,
    startPoint: "Cathedral Ward Password Gate",
    endPoint: "Finding Cainhurst Summons & Meeting Valtr Master of the League",
    keyEvents: [
      "Whispering 'Fear the Old Blood' to enter the dense Forbidden Woods",
      "Traversing the trap-filled windmill village & snake parasite infected mobs",
      "Meeting Valtr, Master of the League and joining The League covenant",
      "Navigating the deep poisonous cave beneath the windmill",
      "Climbing the giant ladders back up into Central Yharnam & Iosefka's Clinic",
      "Claiming the Cainhurst Summons and discovering Iosefka's celestial experiments"
    ],
    keyItemsAndEspers: ["Cainhurst Summons", "Impurity Oath Rune", "Graveguard Set", "White Church Set"],
    partyMembers: ["The Good Hunter", "Valtr Master of the League", "Impostor Iosefka"],
    status: "published",
    description: "Episode 7: We venture through the massive Forbidden Woods, survive giant viper nests, join Valtr's League, and find the underground toxic cavern leading directly to the back of Iosefka's Clinic!",
    chapters: [
      { timestamp: "00:00", title: "Password Gate & Entering Woods" },
      { timestamp: "25:30", title: "Windmill Village & Spike Traps" },
      { timestamp: "48:15", title: "Meeting Valtr & The League Covenant" },
      { timestamp: "1:10:40", title: "Toxic Cavern & Giant Eels" },
      { timestamp: "1:32:15", title: "Back Entrance to Iosefka's Clinic" },
      { timestamp: "1:46:00", title: "Acquiring Cainhurst Summons" }
    ],
    tags: ["Bloodborne", "Forbidden Woods", "Iosefka's Clinic", "Cainhurst Summons", "Valtr", "League"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "The Good Hunter",
      overlayText: "SNAKE FOREST & CLINIC SECRETS",
      subText: "EPISODE 07 • FORBIDDEN WOODS & SHORTCUT",
      themeColor: "#10b981"
    },
    bossStrategies: [
      "Giant Viper Clusters: Use Fire Paper and keep moving. Bait lunges, then punish from side flanks."
    ],
    equipmentNotes: "Keep the Cainhurst Summons safe in your inventory to trigger the ghost coach at Hemwick!",
    missableAlerts: [
      {
        itemName: "Cainhurst Summons (Access to Forsaken Castle Cainhurst)",
        category: "Key Item",
        location: "Iosefka's Clinic 1st Floor Sickroom (Back entrance via Forbidden Woods poison cave)",
        howToGet: "Navigate the deep toxic cavern behind the dog cages in Forbidden Woods, climb the long iron ladder to Central Yharnam, enter Iosefka's rear window, and loot the Cainhurst Summons on the operating table in the starting room.",
        lockoutTrigger: "Failing to pick up the Cainhurst Summons permanently locks out the entire Forsaken Castle Cainhurst optional world, Queen Annalise, Martyr Logarius, Chikage, Evelyn, and Vileblood covenant!",
        warning: "⚠️ PERMANENT MISSABLE WARNING: The Cainhurst Summons is the ONLY item that summons the ghost stagecoach at Hemwick Crossing! Without it, you are PERMANENTLY LOCKED OUT of Castle Cainhurst and all its trophies!"
      },
      {
        itemName: "CRITICAL TIMING: Impostor Iosefka (DO NOT KILL BEFORE BLOOD MOON!)",
        category: "Boss / Ending",
        location: "Iosefka's Clinic 3rd Floor Hallway",
        howToGet: "When exploring the clinic, Impostor Iosefka will warn you from behind the upstairs doorway. DO NOT ENGAGE OR KILL HER YET! Turn around and leave her alive until AFTER defeating Rom the Vacuous Spider!",
        lockoutTrigger: "Killing Impostor Iosefka before the Blood Moon (defeating Rom) only drops the Oedon Writ rune and PERMANENTLY DESTROYS her One Third of Umbilical Cord!",
        warning: "⚠️ CRITICAL PERMANENT MISSABLE WARNING: DO NOT KILL IMPOSTOR IOSEFKA IN EPISODE 7! If you slay her before Rom, her One Third of Umbilical Cord is PERMANENTLY DESTROYED, risking locking you out of the 3-Cord True Eldritch Ending!"
      },
      {
        itemName: "Impurity Oath Rune (Valtr, Master of the League)",
        category: "Rune",
        location: "Forbidden Woods (Windmill hut shortcut near the first lamp)",
        howToGet: "Speak to Valtr inside the windmill hut and agree to join The League covenant to receive the Impurity Oath Rune (+Max HP in co-op).",
        lockoutTrigger: "Attacking Valtr or killing him prematurely.",
        warning: "⚠️ Pledging to the League unlocks NPC summon phantoms for Shadows of Yharnam, Ludwig, and Laurence!"
      }
    ]
  },
  {
    id: 1008,
    partNumber: 8,
    world: "Forbidden Woods",
    title: "Bloodborne #08 - SHADOWS OF YHARNAM & THE CLOCKTOWER CONFLICT!",
    shortTitle: "Shadows of Yharnam Trio",
    altTitles: [
      "3-V-1 BOSS FIGHT IN THE WOODS! - Bloodborne Ep 8",
      "Shadows of Yharnam Defeated! - Bloodborne 100% Walkthrough #8"
    ],
    estDurationMinutes: 90,
    startPoint: "Forbidden Woods Lower Swamp",
    endPoint: "Forbidden Grave Defeated & Entering Byrgenwerth Gate",
    keyEvents: [
      "Navigating the lower snake swamp & encountering Celestial Kin",
      "Unlocking the double elevator shortcuts back to Valtr's windmill",
      "Assisting Eileen the Crow in the Tomb of Oedon against hunter Henryk",
      "Confronting the Shadows of Yharnam Nazgul-like trio at the Forbidden Grave",
      "Managing Phase 3 giant demonic snake summon spell",
      "Opening the gateway into Byrgenwerth Academy"
    ],
    keyItemsAndEspers: ["Blood Rapture Caryll Rune", "Clockwise Metamorphosis (+10% HP)", "Anti-Clockwise Metamorphosis"],
    partyMembers: ["The Good Hunter", "Henryk", "Eileen the Crow"],
    status: "published",
    description: "Episode 8: We complete Eileen the Crow's quest in Tomb of Oedon by vanquishing Henryk, unlock all Forbidden Woods shortcuts, and conquer the Shadows of Yharnam boss trio!",
    chapters: [
      { timestamp: "00:00", title: "Deep Snake Marsh & Swamp" },
      { timestamp: "18:40", title: "Tomb of Oedon: Aiding Eileen vs Henryk" },
      { timestamp: "38:15", title: "Double Elevator Shortcuts" },
      { timestamp: "55:30", title: "Boss Fight: Shadows of Yharnam" },
      { timestamp: "1:18:00", title: "Entering Byrgenwerth Gates" }
    ],
    tags: ["Bloodborne", "Shadows of Yharnam", "Henryk", "Eileen the Crow", "Byrgenwerth", "Forbidden Woods"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Shadows of Yharnam",
      overlayText: "TRIO OF SHADOWS!",
      subText: "EPISODE 08 • FORBIDDEN GRAVE & BYRGENWERTH",
      themeColor: "#ef4444"
    },
    bossStrategies: [
      "Shadows of Yharnam: Kill the aggressive Katana swordsman first with pistol parries. Kill the Candle swordsman second. Rush the fireball caster before he summons giant swamp snakes."
    ],
    equipmentNotes: "Equip Clockwise and Anti-Clockwise Metamorphosis runes for +10% HP and +15% Stamina.",
    missableAlerts: [
      {
        itemName: "CRITICAL WARNING: Suspicious Beggar (NEVER Send to Oedon Chapel!)",
        category: "NPC Quest",
        location: "Forbidden Woods (Windmill roof rafters)",
        howToGet: "Talk to the man eating corpses on the windmill roof. Send him to Iosefka's Clinic (where he turns into a harmless blue alien) OR fight him on the roof (he transforms into Abhorrent Beast) to get the Beast Caryll Rune.",
        lockoutTrigger: "If you send him to Oedon Chapel, he systematically murders every single survivor in the chapel one by one (including Arianna, permanently destroying her Umbilical Cord!).",
        warning: "⚠️ CRITICAL PERMANENT MISSABLE WARNING: NEVER send the Suspicious Beggar to Oedon Chapel! If sent to the chapel, he will murder Arianna and PERMANENTLY DESTROY her Umbilical Cord for the True Ending!"
      },
      {
        itemName: "Anti-Clockwise & Clockwise Metamorphosis Runes",
        category: "Rune",
        location: "Forbidden Woods (Deep snake ravine secret caves)",
        howToGet: "Explore the deep snake marsh ravine thoroughly before the boss gate to find the Tier 2 Anti-Clockwise Metamorphosis (+15% Stamina) and Clockwise Metamorphosis (+10% HP) runes.",
        lockoutTrigger: "Very easy to get lost or miss in the massive swamp.",
        warning: "⚠️ The essential staple runes for all endgame PvP and high-level PvE builds!"
      }
    ]
  },
  {
    id: 1009,
    partNumber: 9,
    world: "Byrgenwerth",
    title: "Bloodborne #09 - BYRGENWERTH, MASTER WILLEM & ROM THE VACUOUS SPIDER!",
    shortTitle: "Byrgenwerth & Rom The Blood Moon",
    altTitles: [
      "THE BLOOD MOON RISES! - Bloodborne Ep 9",
      "Rom the Vacuous Spider 100% Walkthrough - Bloodborne #9",
      "Byrgenwerth Moonside Lake & Eldritch Awakening"
    ],
    estDurationMinutes: 95,
    startPoint: "Byrgenwerth Gate Entrance",
    endPoint: "Moonside Lake Defeat of Rom & Blood Moon Cinematic",
    keyEvents: [
      "Exploring Byrgenwerth Academy grounds, killing Garden of Eyes and Brainsuckers",
      "Confronting Choir Intelligencer Yurie hunter in the library",
      "Meeting the silent Master Willem pointing out toward the Moonside Lake",
      "Plunging from the balcony into the ethereal Moonside Lake dimension",
      "Slaying Rom, the Vacuous Spider using Beast Blood Pellet & Bolt Paper burst",
      "Triggering the Blood Moon: The cosmic veil falls across Yharnam!"
    ],
    keyItemsAndEspers: ["Eye Caryll Rune (+Item Discovery)", "Kin Coldblood (12)", "Lunarium Key", "Student Set"],
    partyMembers: ["The Good Hunter", "Master Willem", "Queen Yharnam (Vision)"],
    status: "published",
    description: "Episode 9: The pivotal turning point of Bloodborne! We explore Master Willem's Byrgenwerth Academy, dive into the Moonside Lake, slay Rom the Vacuous Spider, and shatter the cosmic illusion to reveal the blood-red Moon!",
    chapters: [
      { timestamp: "00:00", title: "Byrgenwerth Academy Grounds" },
      { timestamp: "18:20", title: "Hunter Duel: Yurie the Last Scholar" },
      { timestamp: "35:40", title: "Meeting Master Willem on the Balcony" },
      { timestamp: "46:15", title: "Leap of Faith into Moonside Lake" },
      { timestamp: "58:30", title: "Boss Fight: Rom the Vacuous Spider" },
      { timestamp: "1:20:00", title: "The Blood Moon Cinematic & Queen Yharnam" }
    ],
    tags: ["Bloodborne", "Byrgenwerth", "Rom Vacuous Spider", "Master Willem", "Blood Moon", "Moonside Lake"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Rom the Vacuous Spider",
      overlayText: "THE BLOOD MOON RISES!",
      subText: "EPISODE 09 • BYRGENWERTH & ROM SPIDER",
      themeColor: "#a855f7"
    },
    bossStrategies: [
      "Rom: Clear the baby spiders in Phase 1 without hitting Rom. Pop Beast Blood Pellet + Bolt Paper on bare abdomen. In Phase 2/3, sprint in an S-curve when meteors fall from the sky."
    ],
    equipmentNotes: "Master Willem drops the Eye Rune (+50 Item Discovery) when slain.",
    missableAlerts: [
      {
        itemName: "🚨 ULTIMATE POINT OF NO RETURN: Slaying Rom (Blood Moon Trigger)",
        category: "Boss / Ending",
        location: "Byrgenwerth (Moonside Lake)",
        howToGet: "Defeating Rom the Vacuous Spider triggers the Blood Moon cinematic and shifts the world state into the second half of the game.",
        lockoutTrigger: "Defeating Rom triggers the Blood Moon! This PERMANENTLY kills all window NPCs in Yharnam, locks out Gilbert's dialogue, locks out rescuing Arianna and Adella if not already in chapel, locks Eileen's quest if Henryk was not killed, and closes off pre-Blood Moon Hypogean Gaol!",
        warning: "⚠️ CRITICAL GLOBAL POINT OF NO RETURN: Complete all NPC rescues (Arianna, Adella), get the Tiny Music Box, Flamesprayer, and finish the Eileen vs Henryk duel BEFORE killing Rom! Slaying Rom permanently locks out these quests!"
      },
      {
        itemName: "Master Willem: 'Eye' Caryll Rune (+50 Item Discovery)",
        category: "Rune",
        location: "Byrgenwerth Balcony (Seated in rocking chair facing the lake)",
        howToGet: "Slay Master Willem in his rocking chair on the balcony before jumping into the lake to collect the Tier 2 Eye Caryll Rune.",
        lockoutTrigger: "Leaving without killing him; though he remains until endgame, collecting it now boosts chunk drop rates.",
        warning: "⚠️ Master Willem drops the crucial Eye Rune which drastically boosts drop rates for Blood Stone Chunks and rare Blood Gems!"
      },
      {
        itemName: "Student Set & Arcane Lake Caryll Rune",
        category: "Armor",
        location: "Byrgenwerth Academy (2nd Floor Library Chest & Grounds)",
        howToGet: "Loot the chest on the 2nd floor library after obtaining the Lunarium Key, and collect the Arcane Lake Caryll Rune (+7% Arcane DMG reduction).",
        lockoutTrigger: "Overlooking hidden corners in Byrgenwerth.",
        warning: "⚠️ Arcane Lake Rune provides critical protection against Rom's meteor barrage and Micolash's A Call Beyond!"
      }
    ]
  },
  {
    id: 1010,
    partNumber: 10,
    world: "Forsaken Castle Cainhurst",
    title: "Bloodborne #10 - FORSAKEN CASTLE CAINHURST & MARTYR LOGARIUS!",
    shortTitle: "Castle Cainhurst & Martyr Logarius",
    altTitles: [
      "SECRET SNOW CASTLE! - Bloodborne Ep 10",
      "Martyr Logarius Boss Fight! - Bloodborne 100% Walkthrough #10",
      "Unlocking Queen Annalise & Vileblood Covenant"
    ],
    estDurationMinutes: 110,
    startPoint: "Hemwick Obelisk -> Ghost Carriage Ride",
    endPoint: "Defeating Martyr Logarius, Wearing Crown of Illusions & Joining Vilebloods",
    keyEvents: [
      "Boarding the phantom horse carriage through the frozen mountains",
      "Infiltrating the haunted gothic halls of Forsaken Castle Cainhurst",
      "Battling Bloodlickers, Gargoyles and phantom swordmaidens",
      "Collecting the Evelyn pistol, Chikage badge and Knight's Set",
      "Epic rooftop showdown with Martyr Logarius using pistol parries",
      "Equipping the Crown of Illusions to reveal Queen Annalise's secret throne room"
    ],
    keyItemsAndEspers: ["Crown of Illusions", "Evelyn Pistol", "Cainhurst Badge (Chikage)", "Knight's Armor Set", "Corruption Oath Rune"],
    partyMembers: ["The Good Hunter", "Queen Annalise", "Martyr Logarius"],
    status: "published",
    description: "Episode 10: We travel to the optional frozen wonderland of Forsaken Castle Cainhurst, fight past vampire gargoyles, defeat the relentless Martyr Logarius on the snowy rooftops, and pledge allegiance to Queen Annalise!",
    chapters: [
      { timestamp: "00:00", title: "Ghost Carriage to Castle Cainhurst" },
      { timestamp: "19:45", title: "Courtyard Bloodlickers & Great Hall" },
      { timestamp: "39:30", title: "Library Exploration & Evelyn Pistol" },
      { timestamp: "58:15", title: "Snowy Rooftops & Gargoyles" },
      { timestamp: "1:15:30", title: "Boss Fight: Martyr Logarius" },
      { timestamp: "1:36:00", title: "Crown of Illusions & Queen Annalise" }
    ],
    tags: ["Bloodborne", "Castle Cainhurst", "Martyr Logarius", "Queen Annalise", "Chikage", "Evelyn", "Vilebloods"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Martyr Logarius",
      overlayText: "FROZEN CASTLE CAINHURST!",
      subText: "EPISODE 10 • LOGARIUS & VILEBLOOD QUEEN",
      themeColor: "#0ea5e9"
    },
    bossStrategies: [
      "Martyr Logarius: Shoot the glowing sword stuck in the ground during Phase 2. Backstab him when he kneels to charge his red aura to preserve your ability to gun parry."
    ],
    equipmentNotes: "Equip the Crown of Illusions at the rooftop throne to reveal the hidden Vileblood chamber.",
    missableAlerts: [
      {
        itemName: "'Respect' Gesture, Cainhurst Badge (Chikage & Evelyn) & 'Corruption' Rune",
        category: "NPC Quest",
        location: "Castle Cainhurst (Queen's Throne Room behind Logarius throne)",
        howToGet: "Equip Crown of Illusions after defeating Logarius to reveal the secret throne room. Kneel before Queen Annalise, pledge allegiance to the Vilebloods, and receive the 'Respect' gesture, Cainhurst Badge, and Corruption Oath Rune.",
        lockoutTrigger: "Giving Alfred the Unopened Summons and letting him pulverize Queen Annalise before you kneel to join the covenant locks out the Corruption Rune and Respect gesture until you resurrect her at the Altar of Despair!",
        warning: "⚠️ PERMANENT MISSABLE WARNING: You MUST kneel before Queen Annalise and join the Vileblood covenant BEFORE giving Alfred the Cainhurst Summons in Episode 11!"
      },
      {
        itemName: "Unopened Cainhurst Summons (Alfred's Quest Key)",
        category: "Key Item",
        location: "Castle Cainhurst (Table to the right of Queen Annalise's throne)",
        howToGet: "Pick up the Unopened Cainhurst Summons letter from the table inside Queen Annalise's secret chamber.",
        lockoutTrigger: "Overlooking the table pickup.",
        warning: "⚠️ Mandatory item to deliver to Alfred to trigger his quest finale and obtain the Wheel Hunter Badge (Logarius' Wheel)!"
      },
      {
        itemName: "Evelyn Pistol & Knight's Garb Set",
        category: "Weapon",
        location: "Castle Cainhurst (Library Chests)",
        howToGet: "Jump from the library bookshelf table onto the elevated chest to get Evelyn (highest scaling Bloodtinge firearm in the game) and loot the Knight's Garb Set.",
        lockoutTrigger: "Overlooked platforming chest.",
        warning: "⚠️ The Evelyn is the undisputed #1 firearm for all Bloodtinge / Skill builds in Bloodborne!"
      }
    ]
  },
  {
    id: 1011,
    partNumber: 11,
    world: "Cathedral Ward & Cainhurst",
    title: "Bloodborne #11 - ALFRED'S BLOODY REVENGE & BLOODY CROW OF CAINHURST!",
    shortTitle: "Alfred's Revenge & Bloody Crow",
    altTitles: [
      "THE HARDEST HUNTER IN BLOODBORNE! - Bloodborne Ep 11",
      "Alfred Destroys Queen Annalise! - Bloodborne Walkthrough #11",
      "Eileen the Crow Grand Cathedral Finale"
    ],
    estDurationMinutes: 95,
    startPoint: "Castle Cainhurst Throne Room",
    endPoint: "Defeating the Bloody Crow & Completing Eileen's Covenant",
    keyEvents: [
      "Delivering Unopened Cainhurst Summons to Alfred at Cathedral Ward",
      "Returning to Cainhurst to witness Alfred's frantic execution of Queen Annalise",
      "Collecting the Wheel Hunter Badge (Logarius' Wheel) & Radiance Rune",
      "Returning to the Grand Cathedral steps to find wounded Eileen the Crow",
      "The legendary duel against the Chikage-wielding Bloody Crow of Cainhurst",
      "Receiving the Crow Hunter Badge, Blade of Mercy, and Hunter Oath Rune"
    ],
    keyItemsAndEspers: ["Logarius' Wheel", "Wheel Hunter Badge", "Crow Hunter Badge", "Blade of Mercy", "Hunter Oath Rune (+Stamina)"],
    partyMembers: ["The Good Hunter", "Eileen the Crow", "Bloody Crow of Cainhurst", "Alfred"],
    status: "published",
    description: "Episode 11: We finish Alfred's zealous questline as he unleashes wrath upon Cainhurst, and face the most notoriously difficult NPC duel in the game: the Bloody Crow of Cainhurst in the Grand Cathedral!",
    chapters: [
      { timestamp: "00:00", title: "Delivering Summons to Alfred" },
      { timestamp: "16:30", title: "Alfred's Carnage at Cainhurst Throne" },
      { timestamp: "32:45", title: "Wounded Eileen on Cathedral Steps" },
      { timestamp: "45:00", title: "Duel: The Bloody Crow of Cainhurst" },
      { timestamp: "1:15:30", title: "Crow Hunter Badge & Blade of Mercy" }
    ],
    tags: ["Bloodborne", "Bloody Crow of Cainhurst", "Eileen the Crow", "Alfred", "Logarius Wheel", "Blade of Mercy"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Eileen the Crow",
      overlayText: "BLOODY CROW OF CAINHURST!",
      subText: "EPISODE 11 • ALFRED & EILEEN FINALE",
      themeColor: "#3b82f6"
    },
    bossStrategies: [
      "Bloody Crow of Cainhurst: Bait his two-handed transformed Chikage state—he drains his own HP. Dodge sideways when he fires his repeating pistol. Use thrust attacks when he rolls."
    ],
    equipmentNotes: "Equip the Hunter Oath Rune for +10% stamina recovery rate.",
    missableAlerts: [
      {
        itemName: "Crow Hunter Badge (Blade of Mercy) & 'Hunter' Oath Rune (+Stamina)",
        category: "NPC Quest",
        location: "Grand Cathedral (Entrance steps & Grand Cathedral interior)",
        howToGet: "Talk to wounded Eileen on the Grand Cathedral steps, enter the cathedral to defeat the Bloody Crow of Cainhurst in single combat, then speak to Eileen again outside to receive the Crow Hunter Badge and 'Hunter' Oath Rune.",
        lockoutTrigger: "Failing Eileen's previous steps causes her to turn hostile as the boss inside Grand Cathedral, permanently locking out the 'Hunter' Oath Rune!",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Speak to Eileen on the steps, vanquish the Bloody Crow, and talk to Eileen once more to claim the best stamina rune in the game and Blade of Mercy badge!"
      },
      {
        itemName: "Wheel Hunter Badge (Logarius' Wheel), 'Roar' Gesture & 'Radiance' Rune",
        category: "Weapon",
        location: "Castle Cainhurst Throne -> Cathedral Ward Balcony Altar",
        howToGet: "Deliver Unopened Summons to Alfred in Cathedral Ward to get the 'Roar' gesture and Wheel Hunter Badge. Visit Cainhurst to see his bloody frenzy, then return to Alfred's original altar in Cathedral Ward where he perishes, dropping the 'Radiance' Oath Rune.",
        lockoutTrigger: "Killing Alfred before delivering summons or missing his corpse at the original altar.",
        warning: "⚠️ Unlocks Logarius' Wheel, Gold Ardeo cone helmet, and the Radiance covenant rune!"
      },
      {
        itemName: "Queenly Flesh (Reviving Queen Annalise)",
        category: "Key Item",
        location: "Castle Cainhurst (Pulverized remains on Annalise's throne)",
        howToGet: "Loot the mashed fleshy remains on Queen Annalise's throne after Alfred's execution to acquire the Queenly Flesh key item.",
        lockoutTrigger: "Overlooking the throne pickup before leaving.",
        warning: "⚠️ Mandatory key item used at the Altar of Despair in Episode 15 to resurrect Queen Annalise to life!"
      }
    ]
  },
  {
    id: 1012,
    partNumber: 12,
    world: "Yahar'gul, Unseen Village",
    title: "Bloodborne #12 - YAHAR'GUL UNSEEN VILLAGE & THE ONE REBORN!",
    shortTitle: "Yahar'gul Blood Moon & One Reborn",
    altTitles: [
      "THE AMYGDALAS ON BUILDINGS! - Bloodborne Ep 12",
      "The One Reborn Boss Fight! - Bloodborne 100% Walkthrough #12"
    ],
    estDurationMinutes: 105,
    startPoint: "Yahar'gul Unseen Village Entrance",
    endPoint: "Defeating The One Reborn & Teleporting to Lecture Building",
    keyEvents: [
      "Exploring Yahar'gul during the Blood Moon: Lesser Amygdalas clinging to towers",
      "Bypassing respawning cram-cram mobs powered by Chime Maidens",
      "Surviving the laser barrage Amygdala on the grand staircase",
      "Defeating the hostile 3-Hunter gank squad in the chapel jail",
      "Acquiring the Upper Cathedral Key from the locked iron cage cell",
      "Confronting The One Reborn in Advent Plaza and slaying balcony bell ringers"
    ],
    keyItemsAndEspers: ["Upper Cathedral Key", "Moon Caryll Rune (+Blood Echoes)", "Tiny Tonitrus", "Augur of Ebrietas"],
    partyMembers: ["The Good Hunter", "Defector Antal (Summon)"],
    status: "published",
    description: "Episode 12: We navigate the horrific, cosmic nightmare of Blood Moon Yahar'gul, retrieve the secret Upper Cathedral Key, dispatch the chapel 3-hunter squad, and annihilate The One Reborn!",
    chapters: [
      { timestamp: "00:00", title: "Blood Moon Yahar'gul Entrance" },
      { timestamp: "22:15", title: "Chime Maidens & Respawning Enemies" },
      { timestamp: "44:30", title: "Chapel 3-Hunter Gank Squad Duel" },
      { timestamp: "1:02:15", title: "Upper Cathedral Key Secret Pickup" },
      { timestamp: "1:18:40", title: "Boss Fight: The One Reborn" },
      { timestamp: "1:36:00", title: "Accessing Byrgenwerth Lecture Hall" }
    ],
    tags: ["Bloodborne", "Yahar'gul", "The One Reborn", "Upper Cathedral Key", "Unseen Village", "Amygdala"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "The Good Hunter",
      overlayText: "UNSEEN VILLAGE HORRORS!",
      subText: "EPISODE 12 • YAHAR'GUL & THE ONE REBORN",
      themeColor: "#8b5cf6"
    },
    bossStrategies: [
      "The One Reborn: Run up the spiral stairs on both sides to kill all 6 bell maidens first. Buff with Bolt Paper and attack its midsection legs."
    ],
    equipmentNotes: "Upper Cathedral Key is mandatory for accessing Upper Cathedral Ward in Episode 14.",
    missableAlerts: [
      {
        itemName: "Upper Cathedral Key (Access to Upper Cathedral Ward & Ebrietas)",
        category: "Key Item",
        location: "Yahar'gul Chapel (Dropped from laser Amygdala rooftop through a broken fence cage)",
        howToGet: "From the second Yahar'gul lamp, run past the laser Amygdala, drop through a hole in the railing onto a hidden ledge, drop into the iron cage cell from above, and loot the Upper Cathedral Key from the seated corpse.",
        lockoutTrigger: "Overlooking the cage drop permanently locks you out of Upper Cathedral Ward, Celestial Emissary, Ebrietas Daughter of the Cosmos, Cosmic Eye Watcher Badge, and A Call Beyond!",
        warning: "⚠️ PERMANENT MISSABLE WARNING: The Upper Cathedral Key is the ONLY key that unlocks the massive golden gates of Upper Cathedral Ward! Do NOT miss this hidden cage drop!"
      },
      {
        itemName: "One Third of Umbilical Cord (Cord 2/4 - Impostor Iosefka Post-Rom)",
        category: "Key Item",
        location: "Iosefka's Clinic (Operating table on 3rd floor)",
        howToGet: "After defeating Rom the Vacuous Spider (Blood Moon active), return to Iosefka's Clinic via the Forbidden Woods shortcut. Slay the writhing Impostor Iosefka on the operating table to harvest the 2nd One Third of Umbilical Cord!",
        lockoutTrigger: "Failing to visit the clinic or killing her before Rom.",
        warning: "⚠️ Harvest the 2nd Umbilical Cord from Impostor Iosefka now while she is incapacitated by the Blood Moon!"
      },
      {
        itemName: "Tiny Tonitrus Arcane Hunter Tool",
        category: "Tool",
        location: "Yahar'gul Unseen Village (Chest guarded by brick troll & chime maiden)",
        howToGet: "Unlock the iron gate in the lower streets and open the treasure chest to claim the Tiny Tonitrus (calls down lightning bolts).",
        lockoutTrigger: "Easy to overlook in the chaotic dark alleys.",
        warning: "⚠️ Powerful Arcane tool for clearing clustered mobs and lightning-weak enemies."
      }
    ]
  },
  {
    id: 1013,
    partNumber: 13,
    world: "Nightmare Frontier",
    title: "Bloodborne #13 - NIGHTMARE FRONTIER, PATCHES THE SPIDER & AMYGDALA!",
    shortTitle: "Nightmare Frontier & Amygdala",
    altTitles: [
      "PATCHES KICKS ME INTO POISON! - Bloodborne Ep 13",
      "Amygdala Boss Fight! - Bloodborne 100% Walkthrough #13"
    ],
    estDurationMinutes: 100,
    startPoint: "Lecture Building 1F Portal",
    endPoint: "Amygdala Defeated & Ailing Loran Chalice Claimed",
    keyEvents: [
      "Traversing the alien cliffs and poison bogs of the Nightmare Frontier",
      "Surviving Frenzy gaze from Winter Lantern singing brain-monsters",
      "Trusty Patches the Spider kicks the Hunter off the cliff into toxic muck",
      "Navigating rock-throwing giant yetis and swamp shortcuts",
      "Confronting Great One Amygdala in her colossal canyon arena",
      "Slaying Amygdala and acquiring the Ailing Loran Chalice"
    ],
    keyItemsAndEspers: ["Ailing Loran Chalice", "Lead Elixir", "Great Deep Sea Rune", "Tonsil Stone"],
    partyMembers: ["The Good Hunter", "Patches the Spider", "Amygdala"],
    status: "published",
    description: "Episode 13: We enter the twisted Nightmare Frontier, survive Frenzy Winter Lanterns, get betrayed by Patches the Spider, and bring down the multi-armed Great One Amygdala!",
    chapters: [
      { timestamp: "00:00", title: "Lecture Building 1F & Scholar Slimes" },
      { timestamp: "18:30", title: "Entering Nightmare Frontier" },
      { timestamp: "38:45", title: "Winter Lantern Frenzy Strategy" },
      { timestamp: "52:10", title: "Patches' Trap & Toxic Swamp" },
      { timestamp: "1:12:30", title: "Boss Fight: Amygdala" },
      { timestamp: "1:32:00", title: "Ailing Loran Chalice Claimed" }
    ],
    tags: ["Bloodborne", "Nightmare Frontier", "Amygdala", "Patches the Spider", "Winter Lantern", "Ailing Loran"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Amygdala",
      overlayText: "AMYGDALA OF THE NIGHTMARE!",
      subText: "EPISODE 13 • FRONTIER & LORAN CHALICE",
      themeColor: "#d97706"
    },
    bossStrategies: [
      "Amygdala: Bait her head slam by standing directly in front at mid-range, then dash in and land heavy jumping attacks on her fragile skull. When she rips off her arms in Phase 3, stay behind her tail; when she jumps, stand completely still."
    ],
    equipmentNotes: "Sedatives and Frenzy-resist attire are mandatory to survive Winter Lantern Frenzy attacks.",
    missableAlerts: [
      {
        itemName: "'Beg for Life' Gesture & Anti-Clockwise Metamorphosis (Patches the Spider)",
        category: "Gesture",
        location: "Lecture Building 1F (Secret ladder room behind the giant giant)",
        howToGet: "After Patches pushes you off the cliff in the Frontier, enter the 2nd Floor of Lecture Building in Episode 14/19, climb down the secret ladder to the 1st Floor locked room, and talk to Patches the Spider. Forgive him to receive the 'Beg for Life' gesture and Anti-Clockwise Metamorphosis (+15% Stamina) rune.",
        lockoutTrigger: "Attacking Patches before exhausting his apology dialogue.",
        warning: "⚠️ Forgive Patches to unlock the 'Beg for Life' gesture and acquire the high-tier stamina rune!"
      },
      {
        itemName: "Great Deep Sea Caryll Rune (+100 All Resistances)",
        category: "Rune",
        location: "Nightmare Frontier (Deep toxic swamp cave guarded by Winter Lantern)",
        howToGet: "Equip Frenzy resist attire and Sedatives, kill the Winter Lantern singing in the deep poison bog cave, and loot the Great Deep Sea Rune (+100 Frenzy, Poison, and Arcane resist).",
        lockoutTrigger: "Dying to Frenzy in the swamp.",
        warning: "⚠️ Essential defensive rune for traversing the Nightmare of Mensis brain frenzy!"
      }
    ]
  },
  {
    id: 1014,
    partNumber: 14,
    world: "Upper Cathedral Ward",
    title: "Bloodborne #14 - UPPER CATHEDRAL WARD & THE COSMIC CHOIR SECRETS!",
    shortTitle: "Upper Cathedral & Celestial Choir",
    altTitles: [
      "TERRIFYING BRAINSUCKER MANSION! - Bloodborne Ep 14",
      "A Call Beyond Spell Acquired! - Bloodborne Walkthrough #14"
    ],
    estDurationMinutes: 95,
    startPoint: "Healing Church Workshop Upper Door",
    endPoint: "Defeating Celestial Emissary & Breaking Grand Window",
    keyEvents: [
      "Unlocking Upper Cathedral Ward with the secret key",
      "Surviving the dark Orphanage mansion crawling with Insight-stealing Brainsuckers",
      "Restoring power to the chandelier & acquiring Cosmic Eye Watcher Badge",
      "Learning the 'Make Contact' gesture from the petrified scholar",
      "Confronting the alien Celestial Emissary in the Lumenflower Gardens",
      "Breaking the stained glass window behind the lamp to reveal the secret altar"
    ],
    keyItemsAndEspers: ["Cosmic Eye Watcher Badge", "A Call Beyond", "Great Isz Chalice", "Make Contact Gesture", "Communion Rune"],
    partyMembers: ["The Good Hunter", "Plain Doll"],
    status: "published",
    description: "Episode 14: We unlock Upper Cathedral Ward, brave the terrifying Brainsucker mansion, learn the iconic 'Make Contact' cosmic gesture, and conquer the Celestial Emissary!",
    chapters: [
      { timestamp: "00:00", title: "Unlocking Upper Cathedral Ward Gate" },
      { timestamp: "20:15", title: "The Dark Orphanage & Brainsucker Gauntlet" },
      { timestamp: "44:30", title: "Make Contact Gesture Discovery" },
      { timestamp: "1:02:00", title: "Boss Fight: Celestial Emissary" },
      { timestamp: "1:18:15", title: "Breaking the Grand Window" }
    ],
    tags: ["Bloodborne", "Upper Cathedral Ward", "Celestial Emissary", "Make Contact", "Cosmic Choir", "A Call Beyond"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "The Good Hunter",
      overlayText: "UPPER CATHEDRAL CHOIR!",
      subText: "EPISODE 14 • BRAINSUCKERS & EMISSARY",
      themeColor: "#06b6d4"
    },
    bossStrategies: [
      "Celestial Emissary: Use Thrust attacks or Bolt Paper. Use Shaman Bone Blade on the giant form to turn small aliens against him."
    ],
    equipmentNotes: "Cosmic Eye Watcher Badge unlocks Blood Stone Chunks and Poison Knives at the shop.",
    missableAlerts: [
      {
        itemName: "'Make Contact' Gesture (Crucial for Tier 3 Moon Rune)",
        category: "Gesture",
        location: "Upper Cathedral Ward (Balcony statue of petrified scholar in the Orphanage)",
        howToGet: "Interact with the petrified scholar corpse standing frozen in the 'Make Contact' pose on the outdoor balcony overlooking the city.",
        lockoutTrigger: "Skipping the statue pickup prevents communicating with the giant Brain of Mensis in Episode 19.",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Obtain 'Make Contact' now! It is MANDATORY to perform in front of the Brain of Mensis for 60 seconds in Episode 19 to receive the best +30% Blood Echo Rune in the game!"
      },
      {
        itemName: "Cosmic Eye Watcher Badge (Blood Stone Chunks at Bath Shop)",
        category: "Key Item",
        location: "Upper Cathedral Ward (Orphanage dark hall corpse guarded by Brainsucker)",
        howToGet: "Loot the corpse in the dark corridor of the Orphanage to acquire the Cosmic Eye Watcher Badge.",
        lockoutTrigger: "Overlooking the dark hallway corpse.",
        warning: "⚠️ Unlocks Blood Stone Chunks, Beast Blood Pellets, Sedatives, and Poison Knives for purchase with Insight at the Hunter's Dream bath!"
      }
    ]
  },
  {
    id: 1015,
    partNumber: 15,
    world: "Upper Cathedral Ward",
    title: "Bloodborne #15 - EBRIETAS, DAUGHTER OF THE COSMOS & ALTAR OF DESPAIR!",
    shortTitle: "Ebrietas & Altar of Despair",
    altTitles: [
      "THE GREATEST COSMIC BOSS! - Bloodborne Ep 15",
      "Ebrietas Daughter of the Cosmos Walkthrough - Bloodborne #15"
    ],
    estDurationMinutes: 90,
    startPoint: "Lumenflower Gardens Broken Window",
    endPoint: "Defeating Ebrietas & Resurrecting Queen Annalise",
    keyEvents: [
      "Descending through the Grand Cathedral elevator into the Altar of Despair",
      "Acquiring A Call Beyond ultimate arcane projectile tool in the rafters",
      "Confronting Ebrietas, Daughter of the Cosmos in the subterranean cavern",
      "Dodging her deadly forward flying charge and laser star storm",
      "Slaying Ebrietas to claim the Great Isz Chalice",
      "Placing Queenly Flesh upon the Rom corpse altar to revive Queen Annalise"
    ],
    keyItemsAndEspers: ["Great Isz Chalice", "A Call Beyond", "Queenly Flesh (Resurrected)"],
    partyMembers: ["The Good Hunter", "Ebrietas", "Queen Annalise"],
    status: "published",
    description: "Episode 15: We descend deep into the Altar of Despair beneath Upper Cathedral Ward, defeat Ebrietas Daughter of the Cosmos in an epic arcane showdown, and restore the Vileblood Queen!",
    chapters: [
      { timestamp: "00:00", title: "Descent to the Altar of Despair" },
      { timestamp: "18:30", title: "Acquiring A Call Beyond Arcane Tool" },
      { timestamp: "35:10", title: "Boss Fight: Ebrietas Daughter of Cosmos" },
      { timestamp: "1:02:40", title: "Great Isz Chalice Acquired" },
      { timestamp: "1:18:00", title: "Resurrecting Queen Annalise at the Altar" }
    ],
    tags: ["Bloodborne", "Ebrietas", "Altar of Despair", "Great Isz Chalice", "A Call Beyond", "Cosmic Horror"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Ebrietas",
      overlayText: "DAUGHTER OF THE COSMOS!",
      subText: "EPISODE 15 • EBRIETAS & ISZ CHALICE",
      themeColor: "#6366f1"
    },
    bossStrategies: [
      "Ebrietas: Stand between her rear twin tail fins to avoid sweep attacks. Hit her head with Thrust attacks. When she casts A Call Beyond, sprint in a continuous circle."
    ],
    equipmentNotes: "A Call Beyond requires 40 Arcane and 7 Quicksilver Bullets to unleash massive homing star damage.",
    missableAlerts: [
      {
        itemName: "A Call Beyond Arcane Hunter Tool",
        category: "Tool",
        location: "Lumenflower Gardens (Upper balcony reached through the broken window)",
        howToGet: "Break the glass window behind Celestial Emissary lamp, follow the high balcony walkway, and loot the corpse overlooking the cavern to claim A Call Beyond.",
        lockoutTrigger: "Overlooking the broken window pathway.",
        warning: "⚠️ The ultimate Arcane projectile spell in the game; unleashes a nova of homing cosmic stars!"
      },
      {
        itemName: "Resurrecting Queen Annalise (Altar of Despair)",
        category: "NPC Quest",
        location: "Altar of Despair (Corpse of Rom behind Ebrietas boss arena)",
        howToGet: "After defeating Ebrietas, interact with the petrified Rom altar at the back of the cavern and offer the 'Queenly Flesh' collected in Episode 11 to resurrect Queen Annalise.",
        lockoutTrigger: "Forgetting to visit the altar leaves Queen Annalise dead for the rest of the playthrough.",
        warning: "⚠️ Restores Queen Annalise to life, allowing you to turn in Blood Dregs for covenant rewards!"
      }
    ]
  },
  {
    id: 1016,
    partNumber: 16,
    world: "The Hunter's Nightmare (DLC)",
    title: "Bloodborne #16 - THE OLD HUNTERS DLC: LUDWIG THE ACCURSED & HOLY BLADE!",
    shortTitle: "Old Hunters DLC: Ludwig Boss",
    altTitles: [
      "THE GREATEST DLC EVER MADE! - Bloodborne The Old Hunters Ep 16",
      "Ludwig The Holy Blade Boss Fight! - Bloodborne Walkthrough #16"
    ],
    estDurationMinutes: 115,
    startPoint: "Oedon Chapel Amygdala Portal -> Hunter's Nightmare",
    endPoint: "Defeating Ludwig & Acquiring Holy Moonlight Sword",
    keyEvents: [
      "Receiving Eye of a Blood-drunk Hunter & entering The Hunter's Nightmare",
      "Fighting through blood-drunk old hunters wielding Beast Cutters and Boom Hammers",
      "Collecting the Whirligig Saw (Pizza Cutter) and Beasthunter Saif",
      "Surviving the blood river gauntlet and giant executioners",
      "Meeting Simon the Harrowed at the shortcut door",
      "Legendary 2-phase battle against Ludwig the Accursed and Ludwig the Holy Blade",
      "Acquiring the iconic Holy Moonlight Sword and Guidance Rune"
    ],
    keyItemsAndEspers: ["Holy Moonlight Sword", "Whirligig Saw", "Beasthunter Saif", "Boom Hammer", "Guidance Caryll Rune"],
    partyMembers: ["The Good Hunter", "Simon the Harrowed", "Valtr Beast Eater (Summon)", "Ludwig"],
    status: "published",
    description: "Episode 16: We begin the legendary 'The Old Hunters' DLC! We fight through the warped Hunter's Nightmare, collect the Whirligig Saw, and conquer Ludwig the Accursed / Ludwig the Holy Blade!",
    chapters: [
      { timestamp: "00:00", title: "Entering The Hunter's Nightmare" },
      { timestamp: "25:30", title: "Blood-Drunk Hunters & Beast Cutter" },
      { timestamp: "48:15", title: "Whirligig Saw (Pizza Cutter) Pickup" },
      { timestamp: "1:08:40", title: "Meeting Simon the Harrowed" },
      { timestamp: "1:22:15", title: "Boss Fight: Ludwig the Accursed / Holy Blade" },
      { timestamp: "1:44:00", title: "Claiming the Holy Moonlight Sword" }
    ],
    tags: ["Bloodborne", "The Old Hunters", "Ludwig", "Holy Moonlight Sword", "Whirligig Saw", "DLC Walkthrough"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Ludwig the Holy Blade",
      overlayText: "LUDWIG THE HOLY BLADE!",
      subText: "EPISODE 16 • THE OLD HUNTERS DLC PREMIERE",
      themeColor: "#0284c7"
    },
    bossStrategies: [
      "Ludwig: Phase 1: Roll left through his charges. Phase 2 (Moonlight Sword): Stay glued to his left hip; dodge through moonlight slashes and gun parry his slow windups."
    ],
    equipmentNotes: "Holy Moonlight Sword scales heavily with Strength, Skill, and Arcane.",
    missableAlerts: [
      {
        itemName: "Holy Moonlight Sword (Ludwig's Severed Head)",
        category: "Weapon",
        location: "Underground Corpse Pile (Ludwig's boss arena)",
        howToGet: "Equip Church attire and speak to Ludwig's talking severed horse head in the corner, answer 'YES' when he asks if the church hunters were honorable, OR slay the head directly to claim the Holy Moonlight Sword.",
        lockoutTrigger: "Leaving without talking to or striking the head.",
        warning: "⚠️ One of the most iconic weapons in FromSoftware history; delivers crushing moonlight beams with L2!"
      },
      {
        itemName: "Whirligig Saw (The 'Pizza Cutter')",
        category: "Weapon",
        location: "The Hunter's Nightmare (Lower tombstone courtyard below the bridge)",
        howToGet: "Drop down the rocky cliffs under the bridge near the Nightmare Church lamp and loot the glowing corpse surrounded by snail beasts to claim the Whirligig Saw.",
        lockoutTrigger: "Overlooking the lower cliff drops.",
        warning: "⚠️ The undisputed #1 PvE boss-shredder in Bloodborne; transforms into a spinning buzzsaw with continuous L2 hold!"
      },
      {
        itemName: "Simon the Harrowed: DLC Quest Initiation",
        category: "NPC Quest",
        location: "Hunter's Nightmare (Shortcut hallway next to the first lamp)",
        howToGet: "Unlock the iron shortcut gate near the first lamp, talk to Simon the bow hunter leaning against the wall, and choose 'Nightmares are fascinating' to begin his questline.",
        lockoutTrigger: "Attacking Simon causes his questline to fail prematurely.",
        warning: "⚠️ Simon's questline rewards the Bowblade and the Underground Cell Inner Chamber Key in Episode 18!"
      }
    ]
  },
  {
    id: 1017,
    partNumber: 17,
    world: "Research Hall & Astral Clocktower (DLC)",
    title: "Bloodborne #17 - RESEARCH HALL, LIVING FAILURES & LADY MARIA!",
    shortTitle: "Research Hall & Lady Maria",
    altTitles: [
      "LADY MARIA OF THE ASTRAL CLOCKTOWER! - Bloodborne DLC Ep 17",
      "Research Hall 100% Walkthrough - Bloodborne #17"
    ],
    estDurationMinutes: 110,
    startPoint: "Underground Corpse Pile -> Research Hall",
    endPoint: "Defeating Lady Maria & Entering the Fishing Hamlet",
    keyEvents: [
      "Scaling the massive laboratory staircases of the Healing Church Research Hall",
      "Assisting Saint Adeline with Brain Fluid to acquire the Milkweed Rune",
      "Rotating the giant central staircase mechanism",
      "Defeating the Living Failures cosmic spellcasters in Lumenwood Garden",
      "Opening the grand doors of the Astral Clocktower",
      "Masterwork duel against Lady Maria of the Astral Clocktower",
      "Using the Celestial Dial to open the portal into the Fishing Hamlet"
    ],
    keyItemsAndEspers: ["Celestial Dial", "Milkweed Rune (Lumenwood)", "Loch Shield", "Blacksky Eye", "Maria's Hunter Set"],
    partyMembers: ["The Good Hunter", "Lady Maria", "Saint Adeline", "Simon the Harrowed"],
    status: "published",
    description: "Episode 17: We scale the eerie Research Hall, aid Saint Adeline, defeat the Living Failures, and engage in one of the most cinematic duels in gaming history against Lady Maria of the Astral Clocktower!",
    chapters: [
      { timestamp: "00:00", title: "Research Hall Laboratory Ascent" },
      { timestamp: "24:30", title: "Saint Adeline Brain Fluid Quest" },
      { timestamp: "46:15", title: "Rotating the Giant Staircase" },
      { timestamp: "1:02:40", title: "Boss Fight: Living Failures" },
      { timestamp: "1:18:20", title: "Boss Fight: Lady Maria of Astral Clocktower" },
      { timestamp: "1:42:00", title: "The Celestial Dial & Fishing Hamlet" }
    ],
    tags: ["Bloodborne", "Lady Maria", "Astral Clocktower", "Research Hall", "Living Failures", "Old Hunters DLC"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Lady Maria",
      overlayText: "LADY MARIA CLOCKTOWER!",
      subText: "EPISODE 17 • RESEARCH HALL & MARIA DUEL",
      themeColor: "#e11d48"
    },
    bossStrategies: [
      "Lady Maria: Master pistol parries! Shoot right as her weapon arm reaches full extension. In Phase 3 (Blood Flame), dodge forward-left directly through her blade trails."
    ],
    equipmentNotes: "Equip Clawmark runes for massive 5,000+ damage visceral counters against Maria.",
    missableAlerts: [
      {
        itemName: "'Milkweed' Oath Rune & Brain Fluid x3 (Saint Adeline Quest)",
        category: "Rune",
        location: "Research Hall 1F (Tied patient Saint Adeline in the side room)",
        howToGet: "Collect 2 Brain Fluids from enlarged head patients on the high rafters, deliver them to Saint Adeline. After rotating stairs and resting, strike her detached head on the floor to get the 3rd Brain Fluid, and give it to her to receive the Milkweed Oath Rune (Lumenwood form).",
        lockoutTrigger: "Killing Adeline before completing the 3 Brain Fluid deliveries permanently locks out the Milkweed Rune and the Kos Parasite transformation!",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Deliver all 3 Brain Fluids to Saint Adeline! The Milkweed Rune is the ONLY rune that unlocks the full moveset of the Kos Parasite weapon!"
      },
      {
        itemName: "Laurence's Skull (Secret Sub-Basement Elevator Chamber)",
        category: "Key Item",
        location: "Research Hall (Lower elevator mechanism before the main hall)",
        howToGet: "Step onto the altar elevator from Ludwig's corpse pile, ride it up, then send the platform back down while stepping off to reveal the lower elevator shaft with Laurence's Skull sitting on the altar.",
        lockoutTrigger: "Missing Laurence's Skull prevents waking the secret DLC boss Laurence, the First Vicar in Episode 19!",
        warning: "⚠️ PERMANENT MISSABLE WARNING: You MUST collect Laurence's Skull from the lower elevator platform to awaken Laurence the First Vicar in the Nightmare Grand Cathedral!"
      },
      {
        itemName: "Blacksky Eye Arcane Projectile Tool",
        category: "Tool",
        location: "Research Hall (Balcony Key locked door on 1st Floor)",
        howToGet: "Use the Balcony Key received from Saint Adeline to unlock the glass patio doors, step outside into the garden, and loot the corpse in the wheelchair to acquire Blacksky Eye.",
        lockoutTrigger: "Failing Adeline's quest locks the balcony door.",
        warning: "⚠️ Best 1-bullet cost sniper Arcane tool in the game!"
      }
    ]
  },
  {
    id: 1018,
    partNumber: 18,
    world: "Fishing Hamlet (DLC)",
    title: "Bloodborne #18 - FISHING HAMLET, RAKUYO SHARKS & ORPHAN OF KOS!",
    shortTitle: "Fishing Hamlet & Orphan of Kos",
    altTitles: [
      "THE HARDEST SOULSBORNE BOSS EVER! - Bloodborne DLC Ep 18",
      "Orphan of Kos Defeated! - Bloodborne 100% Walkthrough #18",
      "Shark Giant Well & Unlocking Rakuyo"
    ],
    estDurationMinutes: 120,
    startPoint: "Fishing Hamlet Coast",
    endPoint: "Defeating the Orphan of Kos & Slaying the Nightmare Phantom",
    keyEvents: [
      "Infiltrating the cursed Fishing Hamlet where Byrgenwerth committed its original sin",
      "Receiving the Bowblade and key from dying Simon the Harrowed",
      "Surviving Brador's phantom bell invasions across the village",
      "Dropping down the notorious well to slay twin Shark Giants for Lady Maria's Rakuyo",
      "Reaching the coast of the dead Great One Kos",
      "Climactic battle against the Orphan of Kos out in the ocean waters",
      "Slaying the shadow phantom of Kos to free the Hunter's Nightmare"
    ],
    keyItemsAndEspers: ["Rakuyo (Twin Blades)", "Kos Parasite", "Simon's Bowblade", "Bloodletter", "Great Deep Sea Rune"],
    partyMembers: ["The Good Hunter", "Simon the Harrowed", "Orphan of Kos", "Brador"],
    status: "published",
    description: "Episode 18: The grand finale of The Old Hunters DLC! We conquer the dreaded Shark Giant well to obtain the Rakuyo, avenge Simon, and conquer the greatest challenge in Soulsborne: the Orphan of Kos!",
    chapters: [
      { timestamp: "00:00", title: "Entering the Cursed Fishing Hamlet" },
      { timestamp: "22:15", title: "Simon's Dying Words & Bowblade" },
      { timestamp: "44:30", title: "The Dreaded Shark Giant Well (Rakuyo)" },
      { timestamp: "1:08:15", title: "Lighthouse Hut & Brador Assassins" },
      { timestamp: "1:26:00", title: "Boss Fight: Orphan of Kos (Water Strategy)" },
      { timestamp: "1:52:00", title: "Nightmare Slain: Freeing the Hunters" }
    ],
    tags: ["Bloodborne", "Orphan of Kos", "Fishing Hamlet", "Rakuyo", "Old Hunters DLC", "FromSoftware"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Orphan of Kos",
      overlayText: "ORPHAN OF KOS FINALE!",
      subText: "EPISODE 18 • FISHING HAMLET & RAKUYO",
      themeColor: "#f43f5e"
    },
    bossStrategies: [
      "Orphan of Kos: Fight out in the ocean water for flat terrain. In Phase 1, walk forward under his jump attack to backstab him. In Phase 2, dodge forward-right through his berserk slams."
    ],
    equipmentNotes: "Rakuyo is the premier Skill weapon in Bloodborne; pair with +27.2% Physical Blood Gems.",
    missableAlerts: [
      {
        itemName: "Rakuyo Trick Weapon (Twin Shark Giants Well Gauntlet)",
        category: "Weapon",
        location: "Fishing Hamlet (Submerged well in the village square)",
        howToGet: "Slide down the well ladder, battle the first anchor-wielding Shark Giant to half HP, use a Shaman Bone Blade when the second shark drops from the ceiling so they slaughter each other, and loot the Rakuyo from the second shark corpse.",
        lockoutTrigger: "The Rakuyo is ONLY dropped by the well shark giants.",
        warning: "⚠️ The signature dual trick weapon of Lady Maria; requires conquering the most infamous non-boss encounter in Bloodborne!"
      },
      {
        itemName: "Simon's Bowblade & Underground Cell Inner Chamber Key",
        category: "Weapon",
        location: "Fishing Hamlet (Lighthouse Hut lamp)",
        howToGet: "Talk to dying Simon collapsed next to the Lighthouse Hut lamp to receive Simon's Bowblade and the Underground Cell Inner Chamber Key.",
        lockoutTrigger: "Do not attack him earlier.",
        warning: "⚠️ The key opens Brador's prison cell to acquire the Bloodletter trick weapon!"
      },
      {
        itemName: "Bloodletter Trick Weapon & Brador's Beast Hide Set",
        category: "Weapon",
        location: "Underground Corpse Pile Jail (Locked cell at the very end)",
        howToGet: "Use Simon's key to unlock Brador's cell, assassinate Brador inside, and loot the Bloodletter mace and his 4-piece Beast Hide armor set.",
        lockoutTrigger: "Missing the cell key.",
        warning: "⚠️ Premier Bloodtinge strength weapon that deals massive transformed blood damage at the cost of a small HP stab!"
      }
    ]
  },
  {
    id: 1019,
    partNumber: 19,
    world: "Nightmare of Mensis & Laurence",
    title: "Bloodborne #19 - NIGHTMARE OF MENSIS, MERGO'S WET NURSE & LAURENCE!",
    shortTitle: "Mensis Loft & Wet Nurse",
    altTitles: [
      "THE MOTHER BRAIN & MERGO'S WET NURSE! - Bloodborne Ep 19",
      "Laurence the First Vicar Secret Boss! - Bloodborne #19"
    ],
    estDurationMinutes: 110,
    startPoint: "Lecture Building 2F -> Mensis Loft",
    endPoint: "Defeating Laurence the First Vicar & Slaying Mergo's Wet Nurse",
    keyEvents: [
      "Surviving the Frenzy tower light in the Nightmare of Mensis",
      "Defeating Micolash, Host of the Nightmare in the running library labyrinth",
      "Dropping the colossal Brain of Mensis into the abyss & 'Make Contact' for Tier 3 Moon Rune",
      "Acquiring the 1st Blood Rock (+10 upgrade) from the bottomless pit",
      "Defeating secret DLC boss Laurence, the First Vicar in the Nightmare Grand Cathedral",
      "Ascending to Lunarium Apex and slaying Mergo's Wet Nurse for the 3rd Umbilical Cord"
    ],
    keyItemsAndEspers: ["Blood Rock (+10)", "One Third of Umbilical Cord (3/3)", "Mensis Cage", "Moon Rune (+30% Echoes)", "Beast's Embrace Rune"],
    partyMembers: ["The Good Hunter", "Micolash", "Mergo's Wet Nurse", "Laurence the First Vicar"],
    status: "published",
    description: "Episode 19: We scale the Nightmare of Mensis, defeat Micolash, drop the Brain of Mensis, conquer secret DLC boss Laurence the First Vicar, and defeat Mergo's Wet Nurse to collect our final Umbilical Cord!",
    chapters: [
      { timestamp: "00:00", title: "Mensis Frenzy Tower Approach" },
      { timestamp: "22:45", title: "Boss Fight: Micolash Host of Nightmare" },
      { timestamp: "46:15", title: "Dropping Brain of Mensis & Moon Rune" },
      { timestamp: "1:05:30", title: "Secret DLC Boss: Laurence First Vicar" },
      { timestamp: "1:28:00", title: "Boss Fight: Mergo's Wet Nurse" },
      { timestamp: "1:45:00", title: "3rd Umbilical Cord Acquired & Dream on Fire" }
    ],
    tags: ["Bloodborne", "Nightmare of Mensis", "Mergo's Wet Nurse", "Laurence the First Vicar", "Micolash", "Blood Rock"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Mergo's Wet Nurse",
      overlayText: "MERGO'S WET NURSE!",
      subText: "EPISODE 19 • MENSIS LOFT & ALL 3 CORDS",
      themeColor: "#8b5cf6"
    },
    bossStrategies: [
      "Mergo's Wet Nurse: Hug her backside feather robes. When she casts purple nightmare fog, run in continuous clockwise circles around the arena edge until fog lifts."
    ],
    equipmentNotes: "Reinforce your primary weapon (Saw Cleaver/Ludwig/Rakuyo) to +10 with the Blood Rock!",
    missableAlerts: [
      {
        itemName: "One Third of Umbilical Cord (Cord 3/4 - Arianna's Infant)",
        category: "Key Item",
        location: "Cathedral Ward Aqueduct (Tomb of Oedon lower sewer tunnel)",
        howToGet: "After defeating Micolash, return to Oedon Chapel, follow the bloody trail down to the aqueduct room where Arianna is weeping with her Great One infant, and slay the infant to harvest the 3rd One Third of Umbilical Cord and Arianna's Shoes.",
        lockoutTrigger: "If Arianna died, was sent to Iosefka, was murdered by the Suspicious Beggar, or if you killed Adella while Arianna was present, this cord is permanently lost!",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Harvest Arianna's Umbilical Cord in the aqueduct now! This guarantees having 3 Umbilical Cords ready for the True Ending!"
      },
      {
        itemName: "Tier 3 'Moon' Caryll Rune (+30% Echoes - 60s Make Contact with Brain of Mensis)",
        category: "Rune",
        location: "Nightmare of Mensis (Pitch-black abyss basement reached via cage elevator)",
        howToGet: "Pull the lever in the loft rafters to drop the colossal Brain of Mensis into the abyss. Take the iron cage elevator down to the pitch-black basement, stand right in front of the giant glowing eye, perform the 'Make Contact' gesture, and HOLD THE POSE WITHOUT MOVING FOR 60 SECONDS until your arms shift to receive the Tier 3 Moon Rune (+30% Blood Echoes). Slay it afterward for the Living String Chalice catalyst.",
        lockoutTrigger: "Killing the Brain before completing the 60-second Make Contact pose permanently locks out the Tier 3 Moon Rune for the entire playthrough!",
        warning: "⚠️ CRITICAL PERMANENT MISSABLE WARNING: DO NOT ATTACK THE BRAIN OF MENSIS BEFORE PERFORMING 'MAKE CONTACT' FOR 60 SECONDS! If you kill it first, the Tier 3 Moon Rune is PERMANENTLY LOST!"
      },
      {
        itemName: "Blood Rock (+10 Max Weapon Upgrade Catalyst)",
        category: "Key Item",
        location: "Nightmare of Mensis (Chasm bridge where the Brain of Mensis was originally hanging)",
        howToGet: "After dropping the Brain of Mensis, cross the newly accessible wooden bridge and drop through the hole to loot the Blood Rock from the corpse in the chasm.",
        lockoutTrigger: "This is the ONLY guaranteed natural Blood Rock in the entire base game!",
        warning: "⚠️ The single Blood Rock in the base game; mandatory to bring your primary weapon from +9 to +10 maximum power!"
      },
      {
        itemName: "Secret DLC Boss: Laurence, the First Vicar & Beast's Embrace Rune",
        category: "Boss / Ending",
        location: "The Hunter's Nightmare (Grand Cathedral Altar)",
        howToGet: "With Laurence's Skull in your inventory, approach the burning cleric beast slumped on the altar in the Nightmare Grand Cathedral to awaken Laurence the First Vicar. Slay him to claim the Beast's Embrace Oath Rune (Beast Claw werewolf transformation).",
        lockoutTrigger: "Missing Laurence's Skull prevents this fight.",
        warning: "⚠️ Unlocks the hidden DLC boss fight and the Beast's Embrace Rune which turns the Hunter into a feral werewolf!"
      }
    ]
  },
  {
    id: 1020,
    partNumber: 20,
    world: "Hunter's Dream (Finale)",
    title: "Bloodborne #20 - GEHRMAN, MOON PRESENCE & CHILDHOOD'S BEGINNING! (100% Series Finale)",
    shortTitle: "Gehrman & Moon Presence Finale",
    altTitles: [
      "BECOMING A GREAT ONE! - Bloodborne 100% True Ending Finale Ep 20",
      "Gehrman & Moon Presence Boss Fights - Bloodborne Series Finale",
      "Bloodborne 100% Walkthrough Episode 20: 35-Hour Series Complete"
    ],
    estDurationMinutes: 115,
    startPoint: "Hunter's Dream (Workshop Engulfed in Flames)",
    endPoint: "Defeating Moon Presence & Unlocking Childhood's Beginning Trophy",
    keyEvents: [
      "Consuming all 3 One Third of Umbilical Cords inside the burning Hunter's Dream",
      "Meeting Gehrman beneath the great white flower tree in the ash fields",
      "Refusing Gehrman's offer to awaken, triggering the masterwork duel",
      "Defeating Gehrman the First Hunter and resisting the Moon Presence's descent",
      "The Moon Presence boss encounter: Flora of the Blood Moon",
      "Using the Rally mechanic to recover from the Gaze of Doom (1 HP burst)",
      "Childhood's Beginning cinematic: Transcending humanity into an infant Great One!",
      "35-Hour 100% Playthrough Recap and Final Platinum Stats"
    ],
    keyItemsAndEspers: ["Old Hunter Badge", "Burial Blade Scythe", "Childhood's Beginning Trophy", "Platinum Playthrough Complete"],
    partyMembers: ["The Good Hunter", "Plain Doll", "Gehrman the First Hunter", "Moon Presence (Flora)"],
    status: "published",
    youtubeVideoId: "bb_ep20_finale",
    videoStats: {
      views: 32800,
      likes: 2840,
      comments: 490,
      lastUpdated: "2026-08-14T12:00:00.000Z",
      videoId: "bb_ep20_finale"
    },
    description: `The Grand 100% Series Finale of our 35-Hour Bloodborne Walkthrough!

Having consumed all three One Third of Umbilical Cords, we enter the flower fields beneath the Great Tree in the burning Hunter's Dream. We refuse Gehrman's offer of mercy, defeat the First Hunter in an unforgettable scythe duel, defy the descent of the Moon Presence, and transcend the hunt forever to become an infant Great One in the arms of the Plain Doll.

TIMESTAMPS:
00:00 - Hunter's Dream in Flames & Final Preparations
08:30 - Consuming 3 One Third of Umbilical Cords
18:45 - Meeting Gehrman Beneath the Great Tree & Refusing the Offer
32:10 - Boss Fight: Gehrman, the First Hunter (Burial Blade Scythe Duel)
58:30 - The Moon Presence Descends from the Blood Moon
1:08:40 - Boss Fight: Moon Presence (Flora & Gaze of Doom Strategy)
1:24:15 - True 100% Secret Ending: Childhood's Beginning Cinematic
1:35:00 - 35-Hour Series Retrospective, Build Breakdown & Platinum Trophy Recap

Thank you all for watching this complete 35-hour Bloodborne series!
#Bloodborne #Gehrman #MoonPresence #ChildhoodsBeginning #FromSoftware #SeriesFinale`,
    chapters: [
      { timestamp: "00:00", title: "Hunter's Dream in Flames" },
      { timestamp: "08:30", title: "Consuming 3 Umbilical Cords" },
      { timestamp: "18:45", title: "Gehrman's Offer Under the Tree" },
      { timestamp: "32:10", title: "Boss Fight: Gehrman, the First Hunter" },
      { timestamp: "58:30", title: "The Moon Presence Descends" },
      { timestamp: "1:08:40", title: "Boss Fight: Moon Presence (Flora)" },
      { timestamp: "1:24:15", title: "True Secret Ending: Childhood's Beginning" },
      { timestamp: "1:35:00", title: "35-Hour 100% Series Retrospective" }
    ],
    tags: ["Bloodborne", "Gehrman", "Moon Presence", "Childhood's Beginning", "Bloodborne Ending", "True Ending", "Series Finale"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Gehrman",
      overlayText: "BECOMING A GREAT ONE!",
      subText: "EPISODE 20 • 35-HOUR 100% SERIES COMPLETE",
      themeColor: "#ef4444"
    },
    bossStrategies: [
      "Gehrman: Parry him when he pulls back the 2-handed scythe. Use Bolt Paper for bonus damage.",
      "Moon Presence: When it casts Gaze of Doom reducing HP to 1, attack immediately to Rally all health back."
    ],
    equipmentNotes: "Congratulations on completing 100% of Bloodborne and The Old Hunters DLC!",
    missableAlerts: [
      {
        itemName: "🚨 ULTIMATE REQUIREMENT: Consume 3x One Third of Umbilical Cords BEFORE Talking to Gehrman",
        category: "Boss / Ending",
        location: "Hunter's Dream (Anywhere before triggering dialogue under the Great Tree)",
        howToGet: "Open your inventory, locate your 'One Third of Umbilical Cord' items, and USE / CONSUME AT LEAST THREE CORDS (Cord 1: Abandoned Old Workshop, Cord 2: Impostor Iosefka Post-Rom, Cord 3: Mergo's Wet Nurse, or Cord 4: Arianna's Infant).",
        lockoutTrigger: "Speaking to Gehrman and triggering the final battle sequence without consuming 3 Cords locks you into the 'Honoring Wishes' ending or 'Yharnam Sunrise' ending and permanently locks out the Moon Presence boss fight and 'Childhood's Beginning' True Ending!",
        warning: "⚠️ CRITICAL PERMANENT MISSABLE WARNING: You MUST consume 3 Umbilical Cords BEFORE speaking to Gehrman! If you trigger the fight without consuming them, the Moon Presence will NOT spawn and you CANNOT get the True Eldritch Ending this playthrough!"
      },
      {
        itemName: "Choose 'REFUSE' Under the Great Tree (Unlocks Gehrman Boss Fight)",
        category: "Boss / Ending",
        location: "Hunter's Dream (Ash flower fields beneath the Great Tree)",
        howToGet: "When Gehrman offers to show you mercy and sever your ties to the dream, select 'REFUSE'.",
        lockoutTrigger: "Selecting 'Submit your life' instantly triggers the Yharnam Sunrise cutscene, skips both final boss battles, and immediately restarts the game into New Game+ without the Old Hunter Badge or Childhood's Beginning trophy!",
        warning: "⚠️ PERMANENT MISSABLE WARNING: Always select 'REFUSE' when Gehrman prompts you! Choosing 'Submit' ends the game immediately with no boss fights!"
      },
      {
        itemName: "Old Hunter Badge & Burial Blade Scythe",
        category: "Weapon",
        location: "Hunter's Dream (Gehrman drop / Messengers Shop)",
        howToGet: "Defeating Gehrman awards the Old Hunter Badge, allowing you to purchase the Burial Blade trick scythe and Gehrman's Hunter Set from the bath shop.",
        lockoutTrigger: "Choosing 'Submit your life' prevents getting the Old Hunter Badge.",
        warning: "⚠️ Unlocks the signature Burial Blade scythe and Gehrman's hunter attire in New Game+!"
      }
    ]
  }
];

// ==========================================
// BLOODBORNE - COMPLETE PLAYTHROUGH SERIES OBJECT
// ==========================================
export const bloodbornePlaythroughSeries: PlaythroughSeries = {
  id: "bloodborne",
  gameTitle: "Bloodborne",
  gameTitleLogo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" fill="none"><text x="12" y="46" font-family="'Cinzel', 'Georgia', serif" font-size="34" font-weight="900" fill="%23f8fafc" letter-spacing="3">BLOODBORNE</text><text x="14" y="66" font-family="sans-serif" font-size="10" font-weight="800" fill="%23e11d48" letter-spacing="4">THE OLD HUNTERS • 100% GUIDE</text></svg>`,
  useTitleLogo: true,
  subtitle: "100% All Bosses, DLC & Secret True Ending Walkthrough",
  badgeText: "BLOODBORNE 100%",
  accentColor: "#e11d48",
  genre: "Action RPG / Soulsborne",
  gameSynopsis: "In the ancient, affliction-ridden city of Yharnam, famous for its miraculous blood-healing remedies, an endemic beastly scourge spreads upon the night of the Hunt. Arriving as a foreign Hunter seeking Paleblood, the player signs a blood transfusion contract and awakens bound to the Hunter's Dream, embarking on a grueling descent into eldritch madness to uncover the truth behind the Healing Church, the Great Ones, and the nightmare realm.",
  gameSynopsisSource: "AI Web Scraped via Google Search Grounding",
  playthroughType: "100% Walkthrough & Let's Play (35 Hours)",
  createdAt: "2026-08-14",
  episodes: bloodborneEpisodes,
  quests: bloodborneQuests,
};
