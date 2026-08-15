import { Episode, PlaythroughSeries } from "../types";
import { defaultFF16Quests } from "./questsData";
import { ff16PlaythroughSeries, ff16Episodes } from "./ff16Data";
import { mafiaPlaythroughSeries, mafiaEpisodes, mafiaQuests } from "./mafiaData";
import { bloodbornePlaythroughSeries, bloodborneEpisodes, bloodborneQuests } from "./bloodborneData";

export const initialEpisodes: Episode[] = [
  {
    id: 1,
    partNumber: 1,
    world: "World of Balance",
    title: "FF6 Pixel Remaster #01 - THE MAGITEK MAIDEN & MOOGLE DEFENSE! (Narshe to Figaro Castle)",
    shortTitle: "The Maiden & The Magitek",
    altTitles: [
      "I STOLE A MAGITEK ARMOR! - FF6 Pixel Remaster Walkthrough Ep 1",
      "Terra Wakes Up! - Final Fantasy VI Pixel Remaster Playthrough #1",
      "FF6 Pixel Remaster Episode 1: Narshe Escape & Moogle Army Battle"
    ],
    estDurationMinutes: 95,
    startPoint: "Game Opening: Magitek March across Narshe Snowfields",
    endPoint: "Reaching Figaro Castle & Meeting King Edgar Roni Figaro",
    keyEvents: [
      "Opening Magitek Armor march to Narshe in blizzard",
      "Narshe Mine Shafts & Whelk / Ymir Boss Fight",
      "Terra's reaction to the Frozen Esper",
      "Awakening in Arvis' House & Narshe Guard Chase",
      "Locke Cole arrival & 10-Moogle Defensive Tactical Battle",
      "Escape through Secret Narshe Caves & Chocobo Ride"
    ],
    keyItemsAndEspers: ["Mithril Knife", "Elixir (in clock)", "Phoenix Down", "Sleeping Bag"],
    partyMembers: ["Terra", "Locke", "Mog & Moogles", "Vicks", "Wedge"],
    status: "published",
    youtubeVideoId: "dQw4w9WgXcQ",
    videoStats: {
      views: 3450,
      likes: 248,
      comments: 42,
      lastUpdated: "2026-08-10T12:00:00.000Z",
      videoId: "dQw4w9WgXcQ"
    },
    description: `Welcome to Episode 1 of our 100% Final Fantasy VI Pixel Remaster Walkthrough & Let's Play!

We begin our epic journey in the snow-covered mining town of Narshe as the Gestahlian Empire deploys a mysterious young woman named Terra alongside Imperial soldiers Vicks and Wedge in heavy Magitek Armor. After infiltrating the mines and facing the giant electric shell Whelk, an encounter with a Frozen Esper triggers a strange resonance, freeing Terra from her slave crown.

With the help of treasure hunter Locke Cole and a legendary legion of Moogles led by Mog, we rescue Terra from Narshe's guards and make our daring escape across the desert to the mechanical stronghold of Figaro Castle!

TIMESTAMPS:
00:00 - Opening Cinematic & Magitek Snowfield March
08:15 - Infiltrating Narshe Mines
19:30 - Boss Fight: Whelk (Ymir Shell)
28:40 - The Frozen Esper & Slave Crown Shattered
38:10 - Awakening in Arvis' House & Guard Chase
49:00 - Locke's Entry & 10-Moogle Defensive Battle
1:12:45 - Navigating Narshe Secret Mine Cave
1:28:10 - Crossing Figaro Desert to Figaro Castle
1:32:00 - Meeting King Edgar & Episode Wrap-up

SUBSCRIBE for the complete FF VI Pixel Remaster Playthrough!
#FF6 #PixelRemaster #FinalFantasyVI #JRPG #LetsPlay #FinalFantasy`,
    chapters: [
      { timestamp: "00:00", title: "Opening Cinematic & Magitek March" },
      { timestamp: "08:15", title: "Infiltrating Narshe Mines" },
      { timestamp: "19:30", title: "Boss Fight: Whelk (Ymir Shell)" },
      { timestamp: "28:40", title: "The Frozen Esper Encounter" },
      { timestamp: "38:10", title: "Terra Awakens & Guard Chase" },
      { timestamp: "49:00", title: "Locke's Entry & Moogle Defense Battle" },
      { timestamp: "1:12:45", title: "Narshe Secret Passage Cave" },
      { timestamp: "1:28:10", title: "Desert Crossing to Figaro Castle" },
      { timestamp: "1:32:00", title: "Meeting King Edgar & Wrap-up" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Final Fantasy 6", "Narshe", "Terra Branford", "Locke Cole", "Whelk Boss", "Moogle Defense", "JRPG Let's Play"],
    thumbnailConfig: {
      backgroundPreset: "narshe",
      featuredCharacter: "Terra",
      overlayText: "MAGITEK AWAKENING",
      subText: "EPISODE 01 • NARSHE MINES",
      themeColor: "#3b82f6"
    },
    bossStrategies: [
      "Whelk/Ymir: Attack the main body only. DO NOT attack the Shell when it hides inside, or it counters with devastating Mega Volt!"
    ],
    equipmentNotes: "Search Arvis' clock for a hidden Elixir before leaving Narshe!"
  },
  {
    id: 2,
    partNumber: 2,
    world: "World of Balance",
    title: "FF6 Pixel Remaster #02 - SUBMERGING A CASTLE & MARTIAL ARTS MASTER! (Figaro to Mt. Kolts)",
    shortTitle: "Desert Kings & Martial Arts",
    altTitles: [
      "KEFKA BURNS FIGARO CASTLE! - FF6 Pixel Remaster Ep 2",
      "Sabin's Martial Arts Blitz! - Final Fantasy VI Pixel Remaster #2",
      "FF6 Pixel Remaster Episode 2: Submarines, AutoCrossbows & Mt. Kolts"
    ],
    estDurationMinutes: 100,
    startPoint: "Figaro Castle Tour & kefka's Demands",
    endPoint: "Reaching the Returners' Secret Hideout with Banon",
    keyEvents: [
      "Kefka Palazzo's arrival demanding Terra's surrender",
      "Kefka sets fire to Figaro Castle; Castle Submersion underground!",
      "Magitek Armor Escape on Chocobos & Magitek Armor boss",
      "South Figaro Town exploration & item hoarding",
      "Mt. Kolts trail climbing & Zaghrem / Cirpius encounters",
      "Vargas Boss Fight & Sabin's dramatic entrance with Blitz Pummel!"
    ],
    keyItemsAndEspers: ["AutoCrossbow Tool", "NoiseBlaster Tool", "BioBlaster Tool", "Hermes Sandals"],
    partyMembers: ["Terra", "Edgar", "Locke", "Sabin"],
    status: "uploaded",
    youtubeVideoId: "L_jWHffIx5E",
    videoStats: {
      views: 2180,
      likes: 165,
      comments: 28,
      lastUpdated: "2026-08-10T12:00:00.000Z",
      videoId: "L_jWHffIx5E"
    },
    description: `Episode 2 of our Final Fantasy VI Pixel Remaster 100% Walkthrough!

We tour the majestic Figaro Castle, but peace is short-lived when the maniacal Imperial General Kefka Palazzo arrives inspecting shoe sand and demanding Terra's surrender! When Edgar refuses, Kefka torches the castle, prompting Edgar to unleash Figaro's secret mechanism—submerging the entire castle beneath the desert dunes!

After riding chocobos to South Figaro, we trek up Mt. Kolts where we face the vengeful martial artist Vargas. Just as things get dire, Edgar's long-lost twin brother Sabin Rene Figaro leaps into battle, delivering a devastating Blitz to save the day!

TIMESTAMPS:
00:00 - Exploring Figaro Castle & Edgar's Tools
12:30 - Kefka Palazzo Arrives & Torches the Castle
22:15 - Castle Submersion & Chocobo Escape
33:00 - South Figaro Town Secrets & Shopping
51:40 - Ascending Mt. Kolts & Cave Puzzles
1:18:20 - Boss Fight: Vargas & Bear Companions
1:28:10 - Sabin Joins the Party with Blitz!
1:36:00 - Reaching Returners' Hideout

LIKE and SUBSCRIBE for more JRPG gameplay guides!
#FF6 #PixelRemaster #FinalFantasyVI #Edgar #Sabin #Kefka #FinalFantasy`,
    chapters: [
      { timestamp: "00:00", title: "Exploring Figaro Castle & Edgar's Tools" },
      { timestamp: "12:30", title: "Kefka Palazzo Arrives & Fire Attack" },
      { timestamp: "22:15", title: "Castle Submersion & Chocobo Escape" },
      { timestamp: "33:00", title: "South Figaro Town Secrets & Looting" },
      { timestamp: "51:40", title: "Ascending Mt. Kolts" },
      { timestamp: "1:18:20", title: "Boss Fight: Vargas" },
      { timestamp: "1:28:10", title: "Sabin Unleashes Blitz!" },
      { timestamp: "1:36:00", title: "Reaching Returners' Hideout" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Edgar Figaro", "Sabin Figaro", "Kefka", "Mt Kolts", "Vargas Boss", "AutoCrossbow", "Blitz Command"],
    thumbnailConfig: {
      backgroundPreset: "narshe",
      featuredCharacter: "Edgar",
      overlayText: "CASTLE SUBMERGED!",
      subText: "EPISODE 02 • KEFKA BURNS FIGARO",
      themeColor: "#eab308"
    },
    bossStrategies: [
      "Vargas: Focus down the two Ipoh bears first with Edgar's AutoCrossbow and Terra's Fire. When Sabin arrives, execute the Blitz command (Left, Right, Left + A) to defeat Vargas instantly!"
    ],
    equipmentNotes: "Buy AutoCrossbow and NoiseBlaster at Figaro Castle. Get Hermes Sandals at South Figaro!"
  },
  {
    id: 3,
    partNumber: 3,
    world: "World of Balance",
    title: "FF6 Pixel Remaster #03 - THE 3 SCENARIOS & IMPERIAL SIEGE! (Lethe River to Doma Castle)",
    shortTitle: "River Rafts & Divided Paths",
    altTitles: [
      "OCTOPUS ON A RIVER RAFT! - FF6 Pixel Remaster Ep 3",
      "The 3 Scenario Split! - Final Fantasy VI Pixel Remaster Playthrough #3",
      "FF6 Pixel Remaster Episode 3: Ultros, Imperial Poisoning & Cyan's Tragedy"
    ],
    estDurationMinutes: 110,
    startPoint: "Returners' Hideout Conference & Banon Decision",
    endPoint: "Sabin & Cyan Boarding the Ghost Phantom Train",
    keyEvents: [
      "Returners' Hideout strategy meeting with Banon (getting Genji Glove / Gauntlet)",
      "Lethe River Raft ride & Boss Fight: Ultros #1 (Tentacle slap mayhem!)",
      "The Iconic 3 Scenario Selection Screen!",
      "Scenario 1 (Terra/Edgar/Banon): Navigating Lethe River to Narshe",
      "Scenario 2 (Locke): Infiltrating occupied South Figaro, Celes Chere rescue, TunnelArmor boss",
      "Scenario 3 (Sabin): Imperial Camp infiltration, General Leo honor, Kefka poisons Doma Castle, Cyan Garamonde tragedy"
    ],
    keyItemsAndEspers: ["Genji Glove", "Cider", "Merchant/Guard Clothes", "Imperial Uniform"],
    partyMembers: ["Terra", "Edgar", "Banon", "Locke", "Celes", "Sabin", "Shadow", "Cyan"],
    status: "recorded",
    description: `Episode 3 of our Final Fantasy VI Pixel Remaster Walkthrough!

After conferring with Banon at the Returners' Hideout, we set sail on a wooden raft down the turbulent Lethe River. Suddenly, the eccentric purple octopus Ultros attacks! During the chaos, Sabin gets separated from the group, triggering FF6's legendary THREE SCENARIOS story split!

In Locke's Scenario, we use stealth, disguises, and rescue former Imperial General Celes Chere from execution in South Figaro. In Sabin's Scenario, we meet the mercenary Shadow, witness Kefka poison the water supply of Doma Castle, and help the grieving knight Cyan Garamonde escape!

TIMESTAMPS:
00:00 - Returners' Hideout & Genji Glove Choice
11:20 - Lethe River Raft Ride & Ultros #1 Boss
24:30 - The 3 Scenario Selection Split
26:15 - Scenario 1: Terra, Edgar & Banon River Route
38:40 - Scenario 2: Locke's Stealth Escape in South Figaro
52:10 - Rescuing Celes & Boss: TunnelArmor
1:04:30 - Scenario 3: Sabin & Shadow at Imperial Camp
1:25:00 - General Leo vs Kefka's Poison at Doma
1:42:15 - Cyan's Rage & Escaping Imperial Siege
1:48:00 - Reaching Phantom Forest & Train Tracks

Don't forget to LIKE and SHARE if you love classic FF6!
#FF6 #PixelRemaster #FinalFantasyVI #Ultros #Celes #Cyan #Sabin #LetsPlay`,
    chapters: [
      { timestamp: "00:00", title: "Returners' Hideout & Genji Glove" },
      { timestamp: "11:20", title: "Lethe River Raft & Ultros #1" },
      { timestamp: "24:30", title: "The 3 Scenario Selection" },
      { timestamp: "26:15", title: "Scenario 1: Terra & Banon to Narshe" },
      { timestamp: "38:40", title: "Scenario 2: Locke in South Figaro" },
      { timestamp: "52:10", title: "Rescuing Celes & TunnelArmor Boss" },
      { timestamp: "1:04:30", title: "Scenario 3: Sabin & Shadow's Journey" },
      { timestamp: "1:25:00", title: "Doma Castle Poisoning Tragedy" },
      { timestamp: "1:42:15", title: "Cyan Joins & Escaping Siege" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Ultros", "Celes Chere", "Cyan Garamonde", "3 Scenarios", "TunnelArmor", "Doma Castle", "Genji Glove"],
    thumbnailConfig: {
      backgroundPreset: "opera",
      featuredCharacter: "Sabin",
      overlayText: "ULTROS ATTACKS!",
      subText: "EPISODE 03 • THE 3 SCENARIOS",
      themeColor: "#ec4899"
    },
    bossStrategies: [
      "Ultros #1: Protect Banon at all costs! Banon's Health command heals the whole party for 0 MP every turn.",
      "TunnelArmor: Celes's Runic ability absorbs TunnelArmor's deadly magic attacks (Poison, Fire) into MP!"
    ],
    equipmentNotes: "Refuse Banon's offer 3 times at the hideout to receive the coveted Genji Glove (dual-wield weapons)!"
  },
  {
    id: 4,
    partNumber: 4,
    world: "World of Balance",
    title: "FF6 Pixel Remaster #04 - SUPLEXING A PHANTOM TRAIN & THE WILD BOY! (Phantom Train to Veldt)",
    shortTitle: "The Phantom Train & The Wild Boy",
    altTitles: [
      "I SUPLEXED A WHOLE TRAIN!! - FF6 Pixel Remaster Ep 4",
      "Sabin Suplexes the Ghost Train! - Final Fantasy VI Pixel Remaster #4",
      "FF6 Pixel Remaster Episode 4: Phantom Train, Gau & Serpent Trench"
    ],
    estDurationMinutes: 105,
    startPoint: "Boarding the Phantom Train in Phantom Forest",
    endPoint: "Complete Party Reunion at Narshe Gate",
    keyEvents: [
      "Boarding the haunted Phantom Train transporting souls to the underworld",
      "Phantom Train cars, ghostly passengers, ghost companion recruitment",
      "Cyan's heartbreaking goodbye to his deceased wife Elayne and son Owain",
      "Boss Fight: Phantom Train & Sabin's Legendary SUPLEX move!",
      "Baren Falls leap & arriving on the Veldt wild plains",
      "Meeting Gau the wild boy & feeding him Dried Meat",
      "Crescent Mountain dive through Serpent Trench to Nikeah port",
      "Rejoining Terra, Locke, Edgar, Celes & Banon at Narshe!"
    ],
    keyItemsAndEspers: ["Dried Meat", "Diving Helmet", "Earrings", "White Cape"],
    partyMembers: ["Sabin", "Cyan", "Shadow", "Gau", "Full Reunion Roster"],
    status: "recorded",
    description: `Episode 4 of our Final Fantasy VI Pixel Remaster 100% Walkthrough!

This episode features one of the most iconic moments in video game history! Sabin, Cyan, and Shadow board the ominous Phantom Train—a locomotive transporting departed souls to the afterlife. After navigating haunted train cars and witnessing Cyan's tragic farewell to his family, we battle the Phantom Train itself and perform Sabin's famous SUPLEX!

Afterward, we jump off Baren Falls onto the Veldt, recruit the wild child Gau by giving him Dried Meat, learn his Leap command, dive through the underwater Serpent Trench, and finally reunite all 3 character groups back in Narshe!

TIMESTAMPS:
00:00 - Boarding the Ominous Phantom Train
14:20 - Train Dining Car & Ghost Companions
28:00 - Boss Fight: Phantom Train (SUPLEX TIME!)
39:45 - Cyan's Heartbreaking Farewell to Elayne & Owain
52:10 - Baren Falls Jump & Arriving on the Veldt
1:08:30 - Recruiting Gau with Dried Meat & Learning Rage
1:24:00 - Serpent Trench Underwater Diving Course
1:38:15 - Port Town Nikeah & Boat Ride
1:42:00 - Grand Party Reunion at Narshe!

LIKE & SUBSCRIBE for more classic RPG moments!
#FF6 #PixelRemaster #FinalFantasyVI #Suplex #PhantomTrain #Gau #Sabin #LetsPlay`,
    chapters: [
      { timestamp: "00:00", title: "Boarding the Phantom Train" },
      { timestamp: "14:20", title: "Ghostly Train Cars & Meals" },
      { timestamp: "28:00", title: "Boss Fight: Phantom Train (SUPLEX!)" },
      { timestamp: "39:45", title: "Cyan's Tearful Farewell" },
      { timestamp: "52:10", title: "Baren Falls & The Veldt" },
      { timestamp: "1:08:30", title: "Recruiting Gau with Dried Meat" },
      { timestamp: "1:24:00", title: "Serpent Trench Underwater Trail" },
      { timestamp: "1:42:00", title: "Grand Party Reunion in Narshe" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Phantom Train", "Suplex", "Sabin Suplex", "Gau", "Veldt", "Cyan", "Serpent Trench"],
    thumbnailConfig: {
      backgroundPreset: "narshe",
      featuredCharacter: "Sabin",
      overlayText: "SUPLEX A TRAIN!",
      subText: "EPISODE 04 • PHANTOM TRAIN",
      themeColor: "#ef4444"
    },
    bossStrategies: [
      "Phantom Train: Use Sabin's Suplex Blitz (Up, Down, A)! Alternatively, throwing a Phoenix Down or Elixir instantly kills the undead Train boss!"
    ],
    equipmentNotes: "Buy Dried Meat at Mobliz town before attempting to recruit Gau on the Veldt!"
  },
  {
    id: 5,
    partNumber: 5,
    world: "World of Balance",
    title: "FF6 Pixel Remaster #05 - THE DEFENSE OF NARSHE & TERRA TRANSFORMS! (Narshe Battle to Zozo)",
    shortTitle: "The Battle for Narshe & The Frozen Esper",
    altTitles: [
      "TERRA TRANSFORMS INTO AN ESPER! - FF6 Pixel Remaster Ep 5",
      "Kefka Attacks Narshe! - Final Fantasy VI Pixel Remaster Playthrough #5",
      "FF6 Pixel Remaster Episode 5: Tactical Snow Battle & Zozo Slums"
    ],
    estDurationMinutes: 100,
    startPoint: "Narshe Strategy Room with Banon, Arvis & Eld'nar",
    endPoint: "Reaching the Top of Zozo Tower searching for Terra",
    keyEvents: [
      "Strategy planning to defend the Frozen Esper from Kefka's invasion army",
      "3-Squad Tactical RTS Battle on the snowy hills of Narshe",
      "Defeating Imperial Soldiers, Hell's Rider & Boss: Kefka Palazzo",
      "Terra's violent reaction to the Frozen Esper: Morphing into a pink Esper and flying away!",
      "Forming search party; visiting Figaro Castle & Jidoor rich town",
      "Entering the dangerous thief city of Zozo where everyone lies!",
      "Clock puzzles, Dadaluma boss fight, finding Terra with Ramuh Esper"
    ],
    keyItemsAndEspers: ["Ramuh Magicite", "Kirin Magicite", "Siren Magicite", "Stray Magicite", "Chainsaw Tool"],
    partyMembers: ["Terra (Esper form)", "Locke", "Celes", "Edgar", "Sabin", "Cyan", "Gau"],
    status: "not_started",
    description: `Episode 5 of our Final Fantasy VI Pixel Remaster Walkthrough!

Kefka marches an Imperial army on Narshe to seize the Frozen Esper! We divide our 7 heroes into 3 tactical defense squads to protect Banon on the snowy hills. After driving back the soldiers and defeating Kefka himself, Terra approaches the Esper—only to undergo a terrifying transformation, morphing into a glowing pink Esper and flying off into the sky in a frenzy!

We track Terra's flight path to the rainy, crime-ridden city of Zozo, where lying thieves control every alley. At the top of Zozo Tower, we find Terra resting under the protection of the Esper Ramuh, who entrusts us with the first magicites in the game!

TIMESTAMPS:
00:00 - Narshe War Room Strategy
10:15 - 3-Squad Tactical Snow Battle vs Imperial Army
26:40 - Boss Fight: Kefka Palazzo
38:00 - Terra's esper Transformation & Flight
49:30 - Figaro Castle Submarine Journey to Jidoor
1:08:15 - Infiltrating Zozo: The City of Lies
1:24:00 - Zozo Clock Puzzle & Chainsaw Secret
1:32:40 - Boss Fight: Dadaluma
1:38:00 - Ramuh Speaks & Unlocking Magicites!

SUBSCRIBE and hit the Notification Bell for Episode 6!
#FF6 #PixelRemaster #FinalFantasyVI #Terra #Kefka #Magicite #Espers #Zozo`,
    chapters: [
      { timestamp: "00:00", title: "Narshe War Room Strategy" },
      { timestamp: "10:15", title: "3-Squad Tactical Defense Battle" },
      { timestamp: "26:40", title: "Boss Fight: Kefka Palazzo" },
      { timestamp: "38:00", title: "Terra Transforms & Flies Away" },
      { timestamp: "49:30", title: "Figaro Submarine to Jidoor" },
      { timestamp: "1:08:15", title: "Infiltrating Zozo: City of Lies" },
      { timestamp: "1:24:00", title: "Zozo Clock Puzzle for Chainsaw" },
      { timestamp: "1:32:40", title: "Boss Fight: Dadaluma" },
      { timestamp: "1:38:00", title: "First Magicite: Ramuh!" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Narshe Battle", "Terra Esper", "Zozo", "Ramuh", "Magicite", "Chainsaw Tool", "Dadaluma"],
    thumbnailConfig: {
      backgroundPreset: "narshe",
      featuredCharacter: "Terra",
      overlayText: "TERRA TRANSFORMS!",
      subText: "EPISODE 05 • BATTLE FOR NARSHE",
      themeColor: "#8b5cf6"
    },
    bossStrategies: [
      "Kefka (Narshe): Blitz with Sabin, Edgar's AutoCrossbow, and Celes's Runic to absorb his Blizzara and Havoc Wing spells!",
      "Dadaluma: Dadaluma heals himself with Potions and summons Iron Fist adds. Burst him down with Edgar's Drill or BioBlaster."
    ],
    equipmentNotes: "Solve the clock puzzle in Zozo (6:10:50) to unlock Edgar's secret Chainsaw tool!"
  },
  {
    id: 6,
    partNumber: 6,
    world: "World of Balance",
    title: "FF6 Pixel Remaster #06 - OPERA HOUSE ARIA & HIJACKING AN AIRSHIP! (Jidoor to Vector)",
    shortTitle: "Opera House Starlight & The Airship Blackjack",
    altTitles: [
      "THE MOST ICONIC SCENE IN GAMING! - FF6 Pixel Remaster Ep 6",
      "Celes Sings the Opera! - Final Fantasy VI Pixel Remaster Playthrough #6",
      "FF6 Pixel Remaster Episode 6: Aria de Mezzo Carattere & Setzer's Airship"
    ],
    estDurationMinutes: 115,
    startPoint: "Jidoor Opera House Impresario encounter",
    endPoint: "Boarding Setzer's Airship Blackjack en route to Empire",
    keyEvents: [
      "Jidoor Impresario's dilemma: Gambler Setzer Gabbiani plans to kidnap opera star Maria!",
      "Celes Chere's resemblance to Maria; agreeing to perform on stage",
      "Learning Celes's lyrics & stage directions for 'Aria de Mezzo Carattere'",
      "Celes's Legendary Opera Performance scene with live orchestral audio!",
      "Locke discovering Ultros's letter & rafters timer challenge",
      "Boss Fight: Ultros #2 on the Opera Stage chandelier!",
      "Setzer kidnapping Celes/Maria onto the Airship Blackjack",
      "Coin toss trick with Edgar's rigged double-heads coin; Setzer joins the cause!"
    ],
    keyItemsAndEspers: ["Opera Script", "Coin of Figaro", "Airship Blackjack Unlocked"],
    partyMembers: ["Celes", "Locke", "Edgar", "Sabin", "Setzer"],
    status: "not_started",
    description: `Episode 6 of our Final Fantasy VI Pixel Remaster 100% Walkthrough!

We experience one of the most celebrated and emotional sequences in video game history—The Opera House! To reach the Imperial Capital of Vector, we need an airship. Impresario reveals that the gambler Setzer Gabbiani intends to kidnap opera diva Maria. Since Celes is a dead ringer for Maria, she agrees to take her place on stage!

We guide Celes through her memorable performance of "Aria de Mezzo Carattere", battle Ultros in the stage rafters, and trick Setzer into flying us to Vector using Edgar's rigged double-headed coin!

TIMESTAMPS:
00:00 - The Opera House Dilemma in Jidoor
12:15 - Dressing Room & Celes Memorizes the Lyrics
24:30 - Celes Sings "Aria de Mezzo Carattere" (Iconic Scene!)
38:00 - Locke's Rafters Run & Ultros's Letter
48:10 - Boss Fight: Ultros #2 on Stage
1:02:00 - Setzer Kidnaps Celes onto the Blackjack
1:18:40 - Edgar's Double-Headed Coin Trick
1:28:00 - Unlocking the Airship Blackjack & Flying to Vector

Leave a LIKE if the Opera music gave you chills!
#FF6 #PixelRemaster #FinalFantasyVI #OperaHouse #Celes #AriaDeMezzoCarattere #Setzer #Airship`,
    chapters: [
      { timestamp: "00:00", title: "Opera House Plan in Jidoor" },
      { timestamp: "12:15", title: "Dressing Room & Lyric Prep" },
      { timestamp: "24:30", title: "Aria de Mezzo Carattere Opera" },
      { timestamp: "38:00", title: "Locke's Rafters Dash" },
      { timestamp: "48:10", title: "Boss Fight: Ultros #2" },
      { timestamp: "1:02:00", title: "Airship Blackjack Infiltration" },
      { timestamp: "1:18:40", title: "Double-Headed Coin Trick" },
      { timestamp: "1:28:00", title: "Flying the Airship Blackjack" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Opera House", "Celes Opera", "Aria de Mezzo Carattere", "Setzer Gabbiani", "Airship Blackjack", "Ultros", "Jidoor"],
    thumbnailConfig: {
      backgroundPreset: "opera",
      featuredCharacter: "Celes",
      overlayText: "OPERATIC MASTERPIECE",
      subText: "EPISODE 06 • ARIA DE MEZZO CARATTERE",
      themeColor: "#38bdf8"
    },
    bossStrategies: [
      "Opera Lyrics: 1) 'Oh my hero, so far away...', 2) 'I'm the darkness, you're the starlight...', 3) 'Must I leave you, my heart's devotion...'",
      "Ultros #2: Push him off the rafters! Sabin's Aura Cannon and Fire spells hit his water weakness hard."
    ],
    equipmentNotes: "Equip Hermes Sandals on Locke during the rafters run to reach Ultros before the 5-minute timer expires!"
  },
  {
    id: 7,
    partNumber: 7,
    world: "World of Balance",
    title: "FF6 Pixel Remaster #07 - MAGITEK RESEARCH FACILITY & ESPER ESCAPE! (Vector to Narshe)",
    shortTitle: "Infiltration of Vector & The Esper Revolt",
    altTitles: [
      "STEALING ALL THE MAGICITES! - FF6 Pixel Remaster Ep 7",
      "Magitek Research Facility Raid! - Final Fantasy VI Pixel Remaster #7",
      "FF6 Pixel Remaster Episode 7: Vector Infiltration, Shiva, Ifrit & Mine Cart"
    ],
    estDurationMinutes: 120,
    startPoint: "Landing Airship Blackjack outside Imperial Capital Vector",
    endPoint: "Escaping Vector & Returning to Zozo with Magicites",
    keyEvents: [
      "Vector Capital infiltration with help from sympathizer old man",
      "Magitek Research Facility dungeon & conveyor belt mazes",
      "Boss Fight: Number 024 (Element Shift gimmick)",
      "Meeting trapped Espers Ifrit & Shiva; obtaining their Magicites!",
      "Professor Cid's laboratory & discovering Esper extraction horror",
      "Boss Fight: Number 128",
      "High-speed Mine Cart Escape minigame & boss: Magitek Cranes!",
      "Celes's loyalty test & tragic departure; returning to Terra in Zozo"
    ],
    keyItemsAndEspers: ["Ifrit Magicite", "Shiva Magicite", "Unicorn Magicite", "Maduin Magicite", "Catoblepas Magicite", "Phantom Magicite"],
    partyMembers: ["Celes", "Locke", "Edgar", "Sabin", "Terra"],
    status: "not_started",
    description: `Episode 7 of our Final Fantasy VI Pixel Remaster Walkthrough!

We land near the smog-choked Imperial Capital Vector and sneak past Imperial guards into the sinister Magitek Research Facility. Inside, we discover the Empire's dark secret: draining living Espers of their magic energy to fuel Magitek technology!

After battling element-shifting bosses, freeing Ifrit and Shiva, and confronting Professor Cid, Celes sacrifices her standing to save Locke from Kefka's lies. We escape on a high-speed mine cart ride, destroy the Magitek Cranes, and bring 6 new Magicites to awaken Terra!

TIMESTAMPS:
00:00 - Infiltrating the Imperial Capital Vector
14:30 - Magitek Research Facility Dungeon
29:10 - Boss Fight: Number 024 (Element Barrier)
41:00 - Meeting Ifrit & Shiva in the Esper Tubes
52:30 - Professor Cid's Lab & Esper Tragedy
1:06:00 - Boss Fight: Number 128
1:16:20 - High-Speed Mine Cart Escape Minigame!
1:28:00 - Boss Fight: Left & Right Magitek Cranes
1:42:00 - Flying back to Zozo & Terra Awakens!

LIKE and SUBSCRIBE for Episode 8!
#FF6 #PixelRemaster #FinalFantasyVI #Vector #Magitek #Ifrit #Shiva #Celes #Locke`,
    chapters: [
      { timestamp: "00:00", title: "Infiltrating Vector" },
      { timestamp: "14:30", title: "Magitek Research Facility" },
      { timestamp: "29:10", title: "Boss Fight: Number 024" },
      { timestamp: "41:00", title: "Ifrit & Shiva Encounters" },
      { timestamp: "52:30", title: "Cid's Lab & Magicite Extraction" },
      { timestamp: "1:06:00", title: "Boss Fight: Number 128" },
      { timestamp: "1:16:20", title: "Mine Cart Rollercoaster Escape" },
      { timestamp: "1:28:00", title: "Boss Fight: Magitek Cranes" },
      { timestamp: "1:42:00", title: "Terra Awakens & Maduin's Memory" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Vector", "Magitek Facility", "Ifrit", "Shiva", "Cid", "Mine Cart", "Cranes Boss"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Locke",
      overlayText: "MAGITEK FACILITY RAID!",
      subText: "EPISODE 07 • VECTOR INFILTRATION",
      themeColor: "#dc2626"
    },
    bossStrategies: [
      "Number 024: Use Scan/Libra or watch his spell cast to hit his changing elemental weakness!",
      "Magitek Cranes: Left Crane absorbs Fire, Right Crane absorbs Lightning. Focus one down at a time with opposing elements!"
    ],
    equipmentNotes: "Pick up the Break Blade, Flame Sabre, and Thunder Sabre in the Magitek Facility secret treasure rooms!"
  },
  {
    id: 8,
    partNumber: 8,
    world: "World of Balance",
    title: "FF6 Pixel Remaster #08 - THE SEALED GATE & IMPERIAL BANQUET! (Sealed Gate to Thamasa)",
    shortTitle: "The Sealed Gate & Imperial Banquet",
    altTitles: [
      "THE EMPEROR INVITES US TO DINNER! - FF6 Pixel Remaster Ep 8",
      "Imperial Banquet Minigame 100% Score! - Final Fantasy VI Pixel Remaster #8",
      "FF6 Pixel Remaster Episode 8: Opening the Sealed Gate & General Leo Alliance"
    ],
    estDurationMinutes: 105,
    startPoint: "Zozo Tower after Terra recalls her origins as Maduin's daughter",
    endPoint: "Sailing on the Imperial Ship from Albrook to Thamasa",
    keyEvents: [
      "Terra learns she is half-human, half-Esper (Maduin's story flashback)",
      "Journey to the Cave to the Sealed Gate near Vector",
      "Lava traps, hidden bridges & opening the Sealed Gate",
      "Espers breaking through the gate, destroying Vector in a rampage!",
      "Emperor Gestahl sueing for peace; The Famous Imperial Banquet Minigame!",
      "Talking to 24 soldiers, answering Gestahl's questions correctly for maximum rewards",
      "General Leo & Celes forming peaceful expedition team to Thamasa"
    ],
    keyItemsAndEspers: ["Tintinnabulum", "Ward Band", "Charms", "Atma Weapon (Later preparation)"],
    partyMembers: ["Terra", "Locke", "General Leo", "Celes"],
    status: "not_started",
    description: `Episode 8 of our Final Fantasy VI Pixel Remaster 100% Walkthrough!

Terra remembers her true origin as the daughter of Maduin and human woman Madeline. To stop the war, we travel to the Sealed Gate to communicate with the Espers. However, when the gate opens, enraged Espers burst through and lay waste to Vector!

In the aftermath, Emperor Gestahl hosts an official Imperial Banquet to negotiate peace. We play the legendary Banquet Minigame, talking to 24 soldiers and giving optimal answers to earn the highest score, free South Figaro, and gain access to the Imperial Armory. Then, we set sail with General Leo and Celes for the mysterious eastern island of Thamasa!

TIMESTAMPS:
00:00 - Terra's Origin Flashback (Maduin & Madeline)
14:15 - Cave to the Sealed Gate Dungeon
32:00 - Opening the Sealed Gate & Esper Rampage
46:30 - Return to Vector & Emperor Gestahl's Invitation
55:10 - The Imperial Banquet Minigame (100% Perfect Guide)
1:18:20 - Banquet Rewards & Imperial Armory Looting
1:28:00 - General Leo Alliance & Sailing from Albrook
1:35:00 - Arriving at the Mysterious Village of Thamasa

LIKE and SUBSCRIBE for Episode 9!
#FF6 #PixelRemaster #FinalFantasyVI #SealedGate #Gestahl #Banquet #GeneralLeo #Thamasa`,
    chapters: [
      { timestamp: "00:00", title: "Terra's Origin Flashback" },
      { timestamp: "14:15", title: "Cave to the Sealed Gate" },
      { timestamp: "32:00", title: "Opening Gate & Esper Rampage" },
      { timestamp: "46:30", title: "Invitation to Gestahl's Castle" },
      { timestamp: "55:10", title: "Imperial Banquet Minigame (100%)" },
      { timestamp: "1:18:20", title: "Banquet Rewards & Armory" },
      { timestamp: "1:28:00", title: "Sailing to Thamasa with Leo" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Sealed Gate", "Imperial Banquet", "Emperor Gestahl", "General Leo", "Thamasa", "Maduin"],
    thumbnailConfig: {
      backgroundPreset: "vector",
      featuredCharacter: "Terra",
      overlayText: "IMPERIAL BANQUET!",
      subText: "EPISODE 08 • THE SEALED GATE",
      themeColor: "#10b981"
    },
    bossStrategies: [
      "Banquet Quiz: Answer 'To our hometowns', 'Leave Kefka in jail', 'It was unforgivable', 'Celes is one of us', 'Why start the war?', 'Are the Espers too strong?'. Fight the Imperial Guard in 2 minutes!"
    ],
    equipmentNotes: "A perfect banquet score unlocks the Tintinnabulum accessory and Ward Band from Gestahl!"
  },
  {
    id: 9,
    partNumber: 9,
    world: "World of Balance",
    title: "FF6 Pixel Remaster #09 - THAMASA ON FIRE & GENERAL LEO'S TRAGEDY! (Thamasa to Floating Continent)",
    shortTitle: "Thamasa's Secret & General Leo's Stand",
    altTitles: [
      "KEFKA KILLS GENERAL LEO! - FF6 Pixel Remaster Ep 9",
      "The Burning Mansion of Thamasa! - Final Fantasy VI Pixel Remaster #9",
      "FF6 Pixel Remaster Episode 9: Strago, Relm, Esper Cave & Floating Continent Rises"
    ],
    estDurationMinutes: 110,
    startPoint: "Arriving at Thamasa Village where villagers hide magic",
    endPoint: "Floating Continent rising into the sky",
    keyEvents: [
      "Exploring Thamasa & meeting Blue Mage Strago Magus & artist Relm Arrowny",
      "Burning Mansion rescue minigame (saving Relm from Flame Eater boss)",
      "Esper Mountain Cave exploration & Ultros #3 boss (Relm's Sketch!)",
      "Meeting Yura and the Espers; peaceful treaty established",
      "Kefka's sudden betrayal & slaughter of the Espers",
      "General Leo's honorable duel vs Kefka & tragic death scene",
      "Kefka collecting Magicites; Gestahl raises the Floating Continent into the heavens!"
    ],
    keyItemsAndEspers: ["Shoat Magicite", "Alexander Magicite (Later)", "Heal Rod", "Ice Rod"],
    partyMembers: ["Terra", "Locke", "Strago", "Relm", "General Leo"],
    status: "not_started",
    description: `Episode 9 of our Final Fantasy VI Pixel Remaster Walkthrough!

We arrive at Thamasa, a village that secretly harbors descendants of the War of the Magi. When a fire breaks out in a mansion, Strago and Relm reveal their magical abilities to save the day! We journey to the Esper Cave, face Ultros again (where Relm paints a hilarious portrait of him!), and reach a peaceful truce with the Espers.

However, Kefka breaks the treaty, turning Espers into magicite and murdering the noble General Leo in cold blood! Kefka and Gestahl combine the power of the magicites to raise the ancient Floating Continent into the sky!

TIMESTAMPS:
00:00 - Thamasa Village Secrets
14:20 - Burning Mansion Fire Rescue Minigame
28:10 - Boss Fight: Flame Eater
39:00 - Strago & Relm Join the Search
51:30 - Esper Cave & Boss: Ultros #3 (Relm Sketches Ultros!)
1:08:00 - Truce with Yura & Esper Delegation
1:22:15 - Kefka's Betrayal & Esper Slaughter
1:35:00 - General Leo vs Kefka Duel & Tragedy
1:44:00 - The Floating Continent Rises into the Sky!

LIKE and SUBSCRIBE for the World of Balance Season Finale!
#FF6 #PixelRemaster #FinalFantasyVI #GeneralLeo #Kefka #Thamasa #Strago #Relm`,
    chapters: [
      { timestamp: "00:00", title: "Thamasa Village Secrets" },
      { timestamp: "14:20", title: "Burning Mansion Rescue" },
      { timestamp: "28:10", title: "Boss Fight: Flame Eater" },
      { timestamp: "39:00", title: "Exploring Esper Cave" },
      { timestamp: "51:30", title: "Boss: Ultros #3 & Relm's Sketch" },
      { timestamp: "1:08:00", title: "Peaceful Truce with Espers" },
      { timestamp: "1:22:15", title: "Kefka's Betrayal & Esper Slaughter" },
      { timestamp: "1:35:00", title: "General Leo vs Kefka Duel" },
      { timestamp: "1:44:00", title: "Floating Continent Rises!" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "General Leo", "Kefka", "Thamasa", "Strago", "Relm", "Floating Continent", "Flame Eater"],
    thumbnailConfig: {
      backgroundPreset: "floating_continent",
      featuredCharacter: "Shadow",
      overlayText: "GENERAL LEO FALLS!",
      subText: "EPISODE 09 • KEFKA'S BETRAYAL",
      themeColor: "#f97316"
    },
    bossStrategies: [
      "Flame Eater: Flame Eater spawns Balloon adds. Use Ice Rod or Ice magic to burst him quickly.",
      "Ultros #3: Have Relm use her Sketch command on Ultros to end the fight automatically!"
    ],
    equipmentNotes: "Buy Mystery Veils and Ice Rods at the Thamasa shop!"
  },
  {
    id: 10,
    partNumber: 10,
    world: "World of Balance",
    title: "FF6 Pixel Remaster #10 - THE FLOATING CONTINENT & END OF THE WORLD! (World of Balance Finale)",
    shortTitle: "Ascent of the Floating Continent",
    altTitles: [
      "THE WORLD IS DESTROYED!! - FF6 Pixel Remaster Ep 10 (FINALE)",
      "Floating Continent & Shadow's Sacrifice! - Final Fantasy VI Pixel Remaster #10",
      "FF6 Pixel Remaster Episode 10: Imperial Air Force, Atma Weapon & World Cataclysm"
    ],
    estDurationMinutes: 115,
    startPoint: "Boarding the Airship Blackjack to fly to Floating Continent",
    endPoint: "Destruction of the World of Balance & Cataclysm",
    keyEvents: [
      "Airship assault on Floating Continent vs Imperial Air Force & Sky Armor",
      "Boss Fight: Ultros & Chupon / Typhon on airship deck; Air Force boss",
      "Landing on Floating Continent; Shadow rejoining party",
      "Floating Continent maze dungeon & Atma / Ultima Weapon boss fight!",
      "Reaching Three Goddess Statues; Gestahl vs Kefka confrontation",
      "Kefka moving Goddess Statues out of alignment, betraying & killing Gestahl!",
      "CRITICAL CHOICE: Waiting for Shadow at the escape ship countdown timer (0:05 left!)",
      "The Rupture of the World & End of World of Balance!"
    ],
    keyItemsAndEspers: ["Murasame", "Beret", "Elixir", "Ribbon (Hidden in Floating Continent)"],
    partyMembers: ["Chosen 3 Party Members", "Shadow"],
    status: "not_started",
    description: `SEASON FINALE of the World of Balance! Episode 10 of our Final Fantasy VI Pixel Remaster 100% Walkthrough!

We launch our airship into the stratosphere to assault the Floating Continent! After battling through sky armors, Ultros, Chupon, and the massive Imperial Air Force machine, we land on the continent and reunite with Shadow.

Deep within the fortress, we defeat the legendary Atma Weapon! On the summit, Kefka goes mad with power, murders Emperor Gestahl, and moves the ancient Goddess Statues out of balance. We MUST WAIT FOR SHADOW before escaping the collapsing continent—leading to the apocalyptic cataclysm that shatters the planet into the World of Ruin!

TIMESTAMPS:
00:00 - Launching Airship into Imperial Air Force Fleet
12:15 - Boss Fight: Ultros & Chupon (Typhon)
22:40 - Boss Fight: Imperial Air Force Machine
35:00 - Landing on the Floating Continent & Shadow Joins
51:20 - Floating Continent Dungeon Maze
1:12:00 - Legendary Boss Fight: Atma (Ultima) Weapon!
1:25:30 - Summit Confrontation: Kefka Murders Gestahl
1:36:00 - The Escape Countdown (WAITING FOR SHADOW!)
1:44:00 - World Cataclysm & Destruction of Balance

LIKE and SUBSCRIBE for Season 2: The World of Ruin!
#FF6 #PixelRemaster #FinalFantasyVI #FloatingContinent #AtmaWeapon #Kefka #WorldOfRuin #EndOfTheWorld`,
    chapters: [
      { timestamp: "00:00", title: "Assaulting Imperial Fleet" },
      { timestamp: "12:15", title: "Boss: Ultros & Chupon" },
      { timestamp: "22:40", title: "Boss: Air Force Machine" },
      { timestamp: "35:00", title: "Landing on Floating Continent" },
      { timestamp: "51:20", title: "Continent Dungeon Traps" },
      { timestamp: "1:12:00", title: "Boss: Atma / Ultima Weapon" },
      { timestamp: "1:25:30", title: "Kefka Murders Gestahl" },
      { timestamp: "1:36:00", title: "CRITICAL: Waiting for Shadow!" },
      { timestamp: "1:44:00", title: "World Cataclysm Cutscene" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Floating Continent", "Atma Weapon", "Shadow", "World of Ruin", "Cataclysm", "Kefka", "Finale"],
    thumbnailConfig: {
      backgroundPreset: "floating_continent",
      featuredCharacter: "Shadow",
      overlayText: "WORLD DESTROYED!",
      subText: "EPISODE 10 • WORLD OF BALANCE FINALE",
      themeColor: "#b91c1c"
    },
    bossStrategies: [
      "Atma Weapon: High HP boss that casts Flare and Mind Blast. Keep Shell/Protect active and use Edgar's Drill/Chainsaw and Sabin's Phantom Rush/Aura Cannon.",
      "CRITICAL REMINDER: On the escape timer screen, select 'Gotta wait for Shadow!' at the glowing exit node and WAIT until 0:05 remaining on the clock!"
    ],
    equipmentNotes: "Equip Elmes Ring / Hermes Sandals to prevent Slow/Stop during Atma Weapon battle!"
  },
  {
    id: 11,
    partNumber: 11,
    world: "World of Ruin",
    title: "FF6 Pixel Remaster #11 - SOLITARY ISLAND & REBIRTH OF HOPE! (Celes Wakes Up to Figaro)",
    shortTitle: "Solitary Island & Rebirth of Hope",
    altTitles: [
      "CELES WAKES UP IN THE WORLD OF RUIN! - FF6 Pixel Remaster Ep 11",
      "Saving Cid on Solitary Island! - Final Fantasy VI Pixel Remaster #11",
      "FF6 Pixel Remaster Episode 11: Tzen Collapse, Sabin, Edgar disguised as Gerad"
    ],
    estDurationMinutes: 95,
    startPoint: "Celes waking up from a 1-year coma on Solitary Island",
    endPoint: "Unlocking Figaro Castle & Setting out to Kohlingen",
    keyEvents: [
      "Celes waking up after 1 year in coma cared for by Cid",
      "Solitary Island fishing minigame (saving Cid with Yummy Fish!)",
      "Celes building raft & sailing to desolate continent",
      "Albrook & Tzen town visits; saving child in collapsing house with Sabin!",
      "Sabin rejoins party! Journey to Nikeah",
      "Edgar disguised as thief leader 'Gerad'; following bandits through South Figaro Cave",
      "Figaro Castle submerged in sand stuck on mechanical tentacles!",
      "Boss Fight: Tentacles & freeing Figaro Castle!"
    ],
    keyItemsAndEspers: ["Quake Magicite", "Soul Sabre", "Royal Crown"],
    partyMembers: ["Celes", "Sabin", "Edgar"],
    status: "not_started",
    description: `WELCOME TO THE WORLD OF RUIN! Episode 11 of our Final Fantasy VI Pixel Remaster Walkthrough!

One year after the cataclysm, Celes awakens from a coma on a desolate island. After catching healthy fish to save grandfather Cid, Celes builds a raft and sets sail into a ruined world beneath red skies.

In Tzen, Celes reunites with Sabin while holding up a collapsing house to rescue a trapped child! Together they track rumors of Edgar to Nikeah, where Edgar operates in secret under the alias 'Gerad'. We infiltrate Figaro Castle underground, defeat the monstrous Tentacles, and reclaim Edgar and the castle!

TIMESTAMPS:
00:00 - Celes Awakens after 1 Year Coma
10:15 - Solitary Island Fishing Minigame (Saving Cid Guide!)
22:30 - Raft Voyage to Albrook & World of Ruin Map
35:00 - Tzen Judgement Day: Collapsing House Rescue
48:10 - Sabin Rejoins the Party!
1:02:00 - Nikeah & Meeting 'Gerad' (Edgar in Disguise)
1:18:40 - Infiltrating Submerged Figaro Castle Engine Room
1:28:10 - Boss Fight: The Tentacles
1:33:00 - Unlocking Figaro Castle Underground Transport

SUBSCRIBE as we rebuild our party in the World of Ruin!
#FF6 #PixelRemaster #FinalFantasyVI #WorldOfRuin #Celes #Sabin #Edgar #FigaroCastle`,
    chapters: [
      { timestamp: "00:00", title: "Celes Awakens from Coma" },
      { timestamp: "10:15", title: "Solitary Island Fishing (Saving Cid)" },
      { timestamp: "22:30", title: "Raft Voyage to Ruined Continent" },
      { timestamp: "35:00", title: "Tzen Collapsing House Rescue" },
      { timestamp: "48:10", title: "Sabin Rejoins!" },
      { timestamp: "1:02:00", title: "Meeting 'Gerad' in Nikeah" },
      { timestamp: "1:18:40", title: "Figaro Castle Engine Room" },
      { timestamp: "1:28:10", title: "Boss Fight: The Tentacles" },
      { timestamp: "1:33:00", title: "Unlocking Figaro Castle Transport" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "World of Ruin", "Celes Chere", "Solitary Island", "Cid", "Sabin", "Edgar", "Figaro Castle"],
    thumbnailConfig: {
      backgroundPreset: "world_ruin",
      featuredCharacter: "Celes",
      overlayText: "WORLD OF RUIN!",
      subText: "EPISODE 11 • REBIRTH OF HOPE",
      themeColor: "#a855f7"
    },
    bossStrategies: [
      "Saving Cid: Catch only fast-moving 'Yummy Fish' or 'Delicious Fish' in the ocean! Avoid slow-moving 'Rotten Fish'.",
      "Tentacles: Each of the 4 Tentacles absorbs a different element. Use Edgar's Chainsaw/Drill and Sabin's Blitz moves (non-elemental)!"
    ],
    equipmentNotes: "In Tzen during the collapsing house, grab the secret chest containing the Heal Rod before time runs out!"
  },
  {
    id: 12,
    partNumber: 12,
    world: "World of Ruin",
    title: "FF6 Pixel Remaster #12 - THE FALCON RISES & SEARCHING FOR FRIENDS! (Tomb of Daryl)",
    shortTitle: "The Falcon & Soaring Above the Ruin",
    altTitles: [
      "WE GOT OUR AIRSHIP BACK! - FF6 Pixel Remaster Ep 12",
      "Tomb of Daryl & Raising the Falcon! - Final Fantasy VI Pixel Remaster #12",
      "FF6 Pixel Remaster Episode 12: Setzer, Dullahan Boss & Searching for Friends"
    ],
    estDurationMinutes: 120,
    startPoint: "Arriving at Kohlingen Town searching for Setzer",
    endPoint: "Raising the Airship FALCON & Unlocking Open World Flying",
    keyEvents: [
      "Kohlingen Pub meeting with depressed Setzer Gabbiani",
      "Journey to Tomb of Daryl dungeon south of Kohlingen",
      "Flooding water puzzles, Present Monster tomb chest & tomb traps",
      "Boss Fight: Dullahan (Casting Northern Cross & Absorb MP)",
      "Reaching Daryl's secret airship vault; Setzer's emotional flashback with Daryl",
      "Raising the high-speed Airship FALCON from the deep waters!",
      "The Iconic 'Searching for Friends' overworld music theme plays!",
      "Pigeon sighting leading to Maranda, Jidoor & Zozo"
    ],
    keyItemsAndEspers: ["Quavr Magicite", "Genji Helmet", "Exp. Egg", "Airship FALCON Unlocked"],
    partyMembers: ["Celes", "Sabin", "Edgar", "Setzer"],
    status: "not_started",
    description: `Episode 12 of our Final Fantasy VI Pixel Remaster Walkthrough!

We find Setzer brooding in Kohlingen. Though the Blackjack was destroyed in the cataclysm, Setzer reveals that his former rival and beloved friend Daryl owned a legendary high-speed airship buried in her tomb!

We explore the flooded halls of the Tomb of Daryl, battle the undead horseman Dullahan, and witness Setzer's heartwarming memories of racing Daryl across the skies. Together, we raise the majestic Airship FALCON into the heavens as the beloved track "Searching for Friends" begins! Open world exploration in World of Ruin is now UNLOCKED!

TIMESTAMPS:
00:00 - Finding Setzer in Kohlingen Pub
12:30 - Entering Tomb of Daryl Dungeon
28:10 - Water Level Puzzles & Present Monster Chest
45:00 - Boss Fight: Dullahan
58:30 - Daryl's Vault & Setzer's Emotional Memories
1:12:00 - Raising the Airship FALCON!
1:22:15 - "Searching for Friends" Airship Flight (Chills!)
1:35:00 - Tracking the Messenger Pigeon to Maranda
1:48:00 - Setting Course to Gather All Remaining Heroes!

SUBSCRIBE as we soar through the World of Ruin!
#FF6 #PixelRemaster #FinalFantasyVI #AirshipFalcon #Setzer #SearchingForFriends #Daryl #JRPG`,
    chapters: [
      { timestamp: "00:00", title: "Finding Setzer in Kohlingen" },
      { timestamp: "12:30", title: "Tomb of Daryl Dungeon" },
      { timestamp: "28:10", title: "Water Level Switch Puzzles" },
      { timestamp: "45:00", title: "Boss Fight: Dullahan" },
      { timestamp: "58:30", title: "Setzer's Flashback with Daryl" },
      { timestamp: "1:12:00", title: "Raising the Airship FALCON!" },
      { timestamp: "1:22:15", title: "Searching for Friends Airship Flight" },
      { timestamp: "1:35:00", title: "Messenger Pigeon in Maranda" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Airship Falcon", "Setzer", "Daryl", "Tomb of Daryl", "Dullahan", "Searching for Friends", "World of Ruin"],
    thumbnailConfig: {
      backgroundPreset: "world_ruin",
      featuredCharacter: "Setzer",
      overlayText: "AIRSHIP REBORN!",
      subText: "EPISODE 12 • TOMB OF DARYL",
      themeColor: "#0284c7"
    },
    bossStrategies: [
      "Dullahan: Dullahan uses Ice and Holy spells. Cast Rascal/Rasp or Osmose to drain his 2,000 MP—when he runs out of MP, he dies instantly!"
    ],
    equipmentNotes: "Find the secret room in Tomb of Daryl to obtain the Experience Egg (doubles XP gain)!"
  },
  {
    id: 13,
    partNumber: 13,
    world: "World of Ruin",
    title: "FF6 Pixel Remaster #13 - RECRYSTALLIZING HOPE & PAINTINGS OF RUIN! (Terra, Cyan & Relm)",
    shortTitle: "The Dragon's Den & Gathering the Lost",
    altTitles: [
      "RECRUITING TERRA, CYAN & RELM! - FF6 Pixel Remaster Ep 13",
      "Owzer's Haunted Mansion & Phunbaba! - Final Fantasy VI Pixel Remaster #13",
      "FF6 Pixel Remaster Episode 13: Mobliz, Mt. Zozo & Chadarnook Painting Boss"
    ],
    estDurationMinutes: 115,
    startPoint: "Flying the Falcon to Mobliz town",
    endPoint: "Rejoining Terra, Cyan, and Relm to the party roster",
    keyEvents: [
      "Mobliz village visit: Terra acting as a mother protecting orphaned children",
      "Boss Fight: Phunbaba (Part 1 & Part 2) & Terra's Esper form return!",
      "Terra rejoins party with full magical power restored!",
      "Mt. Zozo climb with Rusty Key; finding Cyan's secret room & love letters to Lola",
      "Cyan Garamonde rejoins party!",
      "Jidoor Owzer's Haunted Mansion paintings & possession dungeon",
      "Boss Fight: Chadarnook (Demon / Goddess picture swap gimmick)",
      "Relm Arrowny rescued & rejoins party!"
    ],
    keyItemsAndEspers: ["Fenrir Magicite", "Starlet Magicite", "Books of Cyan", "Rust Rid"],
    partyMembers: ["Terra", "Cyan", "Relm", "Celes", "Sabin", "Edgar", "Setzer"],
    status: "not_started",
    description: `Episode 13 of our Final Fantasy VI Pixel Remaster Walkthrough!

With the Falcon airborne, we set out across the globe to reunite our scattered companions! In Mobliz, we find Terra caring for war orphans. When the demon Phunbaba strikes, Terra unlocks her Esper strength to defend the children and rejoins us!

Next, we climb Mt. Zozo to discover Cyan writing heartfelt letters to a grieving girl in Maranda. Finally, we explore Owzer's haunted art mansion in Jidoor, where demonic paintings possess the gallery. We defeat the picture demon Chadarnook and rescue Relm!

TIMESTAMPS:
00:00 - Flying Falcon to Mobliz Orphans
14:20 - Boss Fight: Phunbaba & Terra's Transformation
29:00 - Terra Rejoins the Party! (Fenrir Magicite)
42:15 - Mt. Zozo Ascent with Rust Rid
58:30 - Cyan's Secret Room & Letters to Lola
1:10:00 - Cyan Garamonde Rejoins!
1:22:15 - Owzer's Haunted Mansion Painting Dungeon
1:36:00 - Boss Fight: Chadarnook (Goddess & Demon Swap)
1:48:00 - Rescuing Relm Arrowny & Starlet Magicite

LIKE & SUBSCRIBE for Episode 14!
#FF6 #PixelRemaster #FinalFantasyVI #Terra #Cyan #Relm #Phunbaba #Chadarnook #JRPG`,
    chapters: [
      { timestamp: "00:00", title: "Mobliz Orphans & Terra" },
      { timestamp: "14:20", title: "Boss Fight: Phunbaba" },
      { timestamp: "29:00", title: "Terra Rejoins with Fenrir!" },
      { timestamp: "42:15", title: "Climbing Mt. Zozo" },
      { timestamp: "58:30", title: "Cyan's Secret Letters" },
      { timestamp: "1:10:00", title: "Cyan Garamonde Rejoins!" },
      { timestamp: "1:22:15", title: "Owzer's Haunted Painting Mansion" },
      { timestamp: "1:36:00", title: "Boss: Chadarnook" },
      { timestamp: "1:48:00", title: "Relm Arrowny Rejoins!" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Terra Branford", "Cyan Garamonde", "Relm Arrowny", "Phunbaba", "Chadarnook", "Owzer Mansion", "Mobliz"],
    thumbnailConfig: {
      backgroundPreset: "world_ruin",
      featuredCharacter: "Terra",
      overlayText: "TERRA RETURNS!",
      subText: "EPISODE 13 • GATHERING THE LOST",
      themeColor: "#ec4899"
    },
    bossStrategies: [
      "Phunbaba: Cast Poison/Biorad and hit him with Ice/Fire. Terra joins midway in permanent Morph mode!",
      "Chadarnook: Attack ONLY when Chadarnook shifts into the Demon form! When in Goddess form, stop physical attacks or she counters with Entice!"
    ],
    equipmentNotes: "Examine the glowing portrait in Owzer's house after defeating Chadarnook to claim the Starlet Magicite!"
  },
  {
    id: 14,
    partNumber: 14,
    world: "World of Ruin",
    title: "FF6 Pixel Remaster #14 - PHOENIX CAVE & LOCKE'S REUNION! (Star Mountain)",
    shortTitle: "Phoenix Cave & Reclaiming Locke",
    altTitles: [
      "LOCKE FINALLY REJOINS THE PARTY! - FF6 Pixel Remaster Ep 14",
      "Phoenix Cave 2-Party Co-op Dungeon! - Final Fantasy VI Pixel Remaster #14",
      "FF6 Pixel Remaster Episode 14: Red Dragon Boss, Phoenix Magicite & Rachel's Farewell"
    ],
    estDurationMinutes: 110,
    startPoint: "Landing Falcon atop Star-Shaped Mountain (Phoenix Cave)",
    endPoint: "Reclaiming Locke Cole & Treasures of South Figaro",
    keyEvents: [
      "Landing on Star Mountain; introduction to 2-Party Cooperative Dungeon mechanics",
      "Switching between Party A & Party B to press lava switches & open stone doors",
      "Boss Fight: Red Dragon (1st of the 8 Legendary Dragons!)",
      "Reaching deep cavern to find Locke Cole hunting for Phoenix Magicite",
      "Returning to Kohlingen; Phoenix Magicite reviving Rachel temporarily",
      "Rachel's emotional farewell blessing Locke to love Celes",
      "Locke rejoining party & handing over rare stolen treasures!"
    ],
    keyItemsAndEspers: ["Phoenix Magicite", "Valiant Knife", "X-Potion", "Flame Shield", "Ribbon"],
    partyMembers: ["Locke", "Celes", "Terra", "Edgar", "Sabin", "Setzer", "Cyan"],
    status: "not_started",
    description: `Episode 14 of our Final Fantasy VI Pixel Remaster Walkthrough!

We drop two separate parties onto the star-shaped Phoenix Cave! By coordinating levers, stepping on pressure plates, and freezing lava rivers, we navigate this intricate multi-party dungeon and defeat the Red Dragon—our first of the 8 Legendary Dragons!

At the core of the cave, we find treasure hunter Locke Cole! He seeks the Phoenix Magicite to fulfill his promise to restore his frozen love, Rachel. In a tearful scene in Kohlingen, Phoenix gives Rachel a brief moment of life to release Locke from his guilt and encourage his future with Celes. Locke rejoins our roster with incredible treasures!

TIMESTAMPS:
00:00 - Landing on Star Mountain (Phoenix Cave Entry)
12:15 - 2-Party Cooperative Puzzle Mechanics
29:40 - Lava River Freezing & Switch Operations
48:00 - Boss Fight: Red Dragon (1st Legendary Dragon!)
1:02:15 - Deep Cavern & Finding Locke Cole
1:18:40 - Returning to Kohlingen & Phoenix Magicite Miracle
1:32:00 - Rachel's Emotional Farewell to Locke
1:42:00 - Locke Rejoins with Rare Treasures!

SUBSCRIBE and hit LIKE for Locke's homecoming!
#FF6 #PixelRemaster #FinalFantasyVI #LockeCole #PhoenixCave #RedDragon #Celes #PhoenixMagicite`,
    chapters: [
      { timestamp: "00:00", title: "Phoenix Cave Entry" },
      { timestamp: "12:15", title: "2-Party Co-op Switches" },
      { timestamp: "29:40", title: "Lava River Puzzles" },
      { timestamp: "48:00", title: "Boss Fight: Red Dragon" },
      { timestamp: "1:02:15", title: "Finding Locke in Cavern" },
      { timestamp: "1:18:40", title: "Kohlingen & Phoenix Miracle" },
      { timestamp: "1:32:00", title: "Rachel's Farewell" },
      { timestamp: "1:42:00", title: "Locke Rejoins Party!" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Locke Cole", "Phoenix Cave", "Red Dragon", "Phoenix Magicite", "Celes", "Valiant Knife", "Rachel"],
    thumbnailConfig: {
      backgroundPreset: "world_ruin",
      featuredCharacter: "Locke",
      overlayText: "LOCKE REJOINED!",
      subText: "EPISODE 14 • PHOENIX CAVE",
      themeColor: "#f43f5e"
    },
    bossStrategies: [
      "Red Dragon: Cast Slow and Silence on Red Dragon. Equip Flame Shields or Ice Shields to negate his Fire3 / Flare Star attacks!"
    ],
    equipmentNotes: "Locke comes equipped with the Valiant Knife, which deals bonus damage as Locke's HP decreases!"
  },
  {
    id: 15,
    partNumber: 15,
    world: "World of Ruin",
    title: "FF6 Pixel Remaster #15 - FROZEN MINES OF NARSHE & YETI UNLEASHED! (Valigarmanda & Umaro)",
    shortTitle: "Yeti's Peak & Sasquatch Unleashed",
    altTitles: [
      "RECRUITING THE YETI UMARO! - FF6 Pixel Remaster Ep 15",
      "Narshe Frozen Mines & Ice Dragon! - Final Fantasy VI Pixel Remaster #15",
      "FF6 Pixel Remaster Episode 15: Valigarmanda, Cliff Jump & Bone Carver Yeti"
    ],
    estDurationMinutes: 90,
    startPoint: "Landing Falcon in snowy Narshe in World of Ruin",
    endPoint: "Recruiting Umaro the Yeti & Obtaining Tritoch / Valigarmanda",
    keyEvents: [
      "Exploring frozen, deserted town of Narshe filled with wild monsters",
      "Boss Fight: Ice Dragon (2nd Legendary Dragon!)",
      "Climbing to the top peak of Narshe to face the Frozen Esper Valigarmanda / Tritoch",
      "Boss Fight: Valigarmanda (Tri-elemental Magicite unlocked!)",
      "Jumping down the cliff hole into Umaro's Bone Cavern",
      "Navigating bridge traps, bone carver statues & Midgardsormr / Terrato Magicite",
      "Boss Fight: Umaro the Yeti!",
      "Mog commanding Umaro to join our team as a secret playable character!"
    ],
    keyItemsAndEspers: ["Tritoch / Valigarmanda Magicite", "Terrato Magicite", "Bone Club", "Green Cherry"],
    partyMembers: ["Mog", "Terra", "Locke", "Sabin", "Umaro"],
    status: "not_started",
    description: `Episode 15 of our Final Fantasy VI Pixel Remaster Walkthrough!

We return to snowy Narshe, now abandoned and overrun by monsters. Deep in the mines, we slay the Ice Dragon (our 2nd Legendary Dragon) and reach the mountain peak to confront the Frozen Esper Valigarmanda (Tritoch)!

After acquiring Tritoch's Magicite, a cavern opens behind the cliff. We jump down into a dark icy lair filled with bone statues and claim the Terrato Magicite. There we encounter the giant Sasquatch Umaro! After beating Umaro in battle, Mog steps in and orders the Yeti to join our party!

TIMESTAMPS:
00:00 - Return to Frozen Narshe
11:20 - Mine Shafts & Boss Fight: Ice Dragon (2nd Dragon)
26:40 - Climbing Narshe Summit Peak
38:15 - Boss Fight: Valigarmanda (Tritoch Esper)
49:30 - Cliff Hole Jump into Umaro's Lair
1:02:00 - Terrato Magicite & Bone Carver Traps
1:14:20 - Boss Fight: Umaro the Yeti!
1:22:00 - Mog Commands Umaro & Yeti Joins Party!

LIKE and SUBSCRIBE for secret character guides!
#FF6 #PixelRemaster #FinalFantasyVI #Umaro #Valigarmanda #Tritoch #Narshe #IceDragon #Mog`,
    chapters: [
      { timestamp: "00:00", title: "Return to Frozen Narshe" },
      { timestamp: "11:20", title: "Boss Fight: Ice Dragon" },
      { timestamp: "26:40", title: "Climbing Narshe Summit" },
      { timestamp: "38:15", title: "Boss: Valigarmanda (Tritoch)" },
      { timestamp: "49:30", title: "Cliff Jump into Yeti Cave" },
      { timestamp: "1:02:00", title: "Terrato Magicite Room" },
      { timestamp: "1:14:20", title: "Boss Fight: Umaro the Yeti" },
      { timestamp: "1:22:00", title: "Umaro Joins the Party!" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Umaro", "Valigarmanda", "Tritoch", "Narshe", "Ice Dragon", "Mog", "Terrato"],
    thumbnailConfig: {
      backgroundPreset: "narshe",
      featuredCharacter: "Mog",
      overlayText: "SECRET YETI UNLOCKED!",
      subText: "EPISODE 15 • UMARO THE SASQUATCH",
      themeColor: "#06b6d4"
    },
    bossStrategies: [
      "Valigarmanda: Valigarmanda is weak to Fire. Cast Firaga/Fire3 and use Sabin's Fire Blitz/Rising Phoenix.",
      "Umaro: Umaro hits extremely hard physically. Cast Slow and Sleep on him, then blast him with Poison/Fire magic!"
    ],
    equipmentNotes: "Equip Umaro with the Master's Scroll / Rage Ring and Bone Club for automatic multi-target massive damage!"
  },
  {
    id: 16,
    partNumber: 16,
    world: "World of Ruin",
    title: "FF6 Pixel Remaster #16 - SWALLOWED BY THE ZONE EATER & MIME MASTER! (Gogo & Shadow)",
    shortTitle: "The Mime in the Zone Eater",
    altTitles: [
      "SWALLOWED WHOLE BY A GIANT MONSTER! - FF6 Pixel Remaster Ep 16",
      "Recruiting Gogo the Mime & Shadow! - Final Fantasy VI Pixel Remaster #16",
      "FF6 Pixel Remaster Episode 16: Triangle Island, Zone Eater & Coliseum Duel"
    ],
    estDurationMinutes: 95,
    startPoint: "Flying to Triangle Island in northeast corner of world map",
    endPoint: "Recruiting Gogo the Mime & Rescuing Shadow from Dragon's Neck Coliseum",
    keyEvents: [
      "Triangle Island encounter: Getting intentionally swallowed by the giant Zone Eater monster!",
      "Zone Eater's Innards dungeon traversal & ceiling crush traps",
      "Meeting Gogo the secretive Mime master deep inside the monster!",
      "Gogo joins party with fully customizable command slots!",
      "Searching Cave on the Veldt for Shadow (or Relm depending on Floating Continent wait)",
      "Behemoth King boss fight & Shadow rescued to Thamasa",
      "Dragon's Neck Coliseum duel: Wager Striker sword to challenge Shadow to a duel",
      "Shadow permanently rejoins party!"
    ],
    keyItemsAndEspers: ["Fake Mustache", "Striker Blade", "Kagenui", "Behemoth Suit"],
    partyMembers: ["Gogo", "Shadow", "Terra", "Locke", "Sabin"],
    status: "not_started",
    description: `Episode 16 of our Final Fantasy VI Pixel Remaster Walkthrough!

We fly to Triangle Island and let our entire party get swallowed whole by the colossal Zone Eater monster! Inside the beast's stomach, we dodge falling ceiling traps and discover Gogo the Mime master, who can copy any party member's special abilities!

Next, we explore the Cave on the Veldt, defeat the Behemoth King, and rescue Shadow. By waging the Striker sword at the Dragon's Neck Coliseum, we challenge Shadow to a duel and convince him to rejoin us permanently!

TIMESTAMPS:
00:00 - Flying to Mysterious Triangle Island
08:15 - Getting Swallowed by the Zone Eater!
22:40 - Navigating Zone Eater's Digestive Tract & Falling Bridges
38:00 - Meeting Gogo the Mime Master
46:15 - Gogo Joins the Roster (Copy Ability Guide!)
58:30 - Cave on the Veldt & Boss Fight: Behemoth King
1:14:00 - Dragon's Neck Coliseum Betting Guide
1:22:15 - Striker Sword Duel vs Shadow
1:28:00 - Shadow Permanently Rejoins!

LIKE and SUBSCRIBE as our roster hits 14 characters!
#FF6 #PixelRemaster #FinalFantasyVI #Gogo #Mime #ZoneEater #Shadow #Coliseum #JRPG`,
    chapters: [
      { timestamp: "00:00", title: "Triangle Island Voyage" },
      { timestamp: "08:15", title: "Swallowed by Zone Eater!" },
      { timestamp: "22:40", title: "Zone Eater Ceiling Traps" },
      { timestamp: "38:00", title: "Meeting Gogo the Mime" },
      { timestamp: "46:15", title: "Gogo Joins the Roster!" },
      { timestamp: "58:30", title: "Cave on Veldt & Behemoth King" },
      { timestamp: "1:14:00", title: "Dragon's Neck Coliseum" },
      { timestamp: "1:22:15", title: "Coliseum Duel vs Shadow" },
      { timestamp: "1:28:00", title: "Shadow Permanently Rejoins" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Gogo", "Zone Eater", "Mime", "Shadow", "Coliseum", "Behemoth King", "Triangle Island"],
    thumbnailConfig: {
      backgroundPreset: "world_ruin",
      featuredCharacter: "Shadow",
      overlayText: "MIME MASTER UNLOCKED!",
      subText: "EPISODE 16 • SWALLOWED BY ZONE EATER",
      themeColor: "#6366f1"
    },
    bossStrategies: [
      "Zone Eater: Do not attack Zone Eater! Let it use its Ingest ability to swallow your whole team to enter the dungeon.",
      "Behemoth King: Undead version casts Meteor upon death. Have Celes use Runic or cast Reraise/Life3!"
    ],
    equipmentNotes: "Gogo can equip ANY 3 commands in the game (Blitz, Steal, Runic, Tools, Lore, Morph, SwdTech)!"
  },
  {
    id: 17,
    partNumber: 17,
    world: "World of Ruin",
    title: "FF6 Pixel Remaster #17 - CULT OF KEFKA TOWER & GRAND TRINE LORE! (Tower of Fanatics & Strago)",
    shortTitle: "Cult of Kefka Tower & Strago's Lore",
    altTitles: [
      "MAGIC ONLY TOWER & ULTIMA SPELL! - FF6 Pixel Remaster Ep 17",
      "Cult of Kefka Tower & MagiMaster! - Final Fantasy VI Pixel Remaster #17",
      "FF6 Pixel Remaster Episode 17: Cultists Tower, Strago, Ebot's Rock & Hidon"
    ],
    estDurationMinutes: 105,
    startPoint: "Flying to Cult of Kefka Tower (Tower of Fanatics)",
    endPoint: "Defeating Hidon at Ebot's Rock & Unlocking Grand Trine Lore",
    keyEvents: [
      "Tower of Fanatics / Cult of Kefka Tower: Magic Command Only dungeon restriction!",
      "Recruiting Strago Magus marching mindlessly in cult robes",
      "Climbing 100 flights of stairs against holy magic monsters (White Dragon - 3rd Dragon!)",
      "Boss Fight: MagiMaster (Wall Change & Ultima death counter spell!)",
      "Reflect / Rasp strategy to survive MagiMaster's dying Ultima spell",
      "Gem of Sight & Soul of Thamasa / Gem of Sight acquisition (Dual Cast Magic!)",
      "Ebot's Rock chest island & Coral feeding chest minigame",
      "Boss Fight: Hidon & Strago learning the rare 'Grand Trine' Lore!"
    ],
    keyItemsAndEspers: ["Gem of Sight", "Soul of Thamasa (Dualcast)", "Grand Trine Lore", "Pearl Lance"],
    partyMembers: ["Strago", "Relm", "Celes", "Terra"],
    status: "not_started",
    description: `Episode 17 of our Final Fantasy VI Pixel Remaster Walkthrough!

We climb the notorious Cult of Kefka Tower (Tower of Fanatics), where physical attacks are sealed and ONLY magic spells are allowed! We rescue Strago from the cultists, defeat the White Dragon (3rd Legendary Dragon), and face the MagiMaster at the spire.

The MagiMaster casts a devastating Ultima spell upon death! Using the Reflect / Rasp strategy, we survive his final explosion and claim the legendary Soul of Thamasa accessory (granting Dual Cast Magic!). Then we travel to Ebot's Rock, feed coral to a chest monster, and defeat Hidon so Strago can learn his strongest Lore spell: Grand Trine!

TIMESTAMPS:
00:00 - Approaching Cult of Kefka Tower
11:15 - Magic-Only Dungeon Rules & Climbing Stairs
26:40 - Boss Fight: White Dragon (3rd Dragon!)
38:00 - Top of Cult Tower & Soul of Thamasa Chest
49:15 - Boss Fight: MagiMaster (Surviving Dying Ultima!)
1:04:00 - Dual Cast Magic Showcase
1:18:20 - Ebot's Rock Island & Feeding Coral to Chest
1:32:00 - Boss Fight: Hidon & Grand Trine Lore
1:40:00 - Strago's Ultimate Magic Unlocked!

SUBSCRIBE and hit the bell for Episode 18!
#FF6 #PixelRemaster #FinalFantasyVI #CultOfKefka #MagiMaster #DualCast #Strago #GrandTrine #Ultima`,
    chapters: [
      { timestamp: "00:00", title: "Cult of Kefka Tower Entry" },
      { timestamp: "11:15", title: "Magic-Only Climbing Rules" },
      { timestamp: "26:40", title: "Boss Fight: White Dragon" },
      { timestamp: "38:00", title: "MagiMaster Summit Chamber" },
      { timestamp: "49:15", title: "Boss Fight: MagiMaster (Ultima Counter!)" },
      { timestamp: "1:04:00", title: "Soul of Thamasa Dualcast" },
      { timestamp: "1:18:20", title: "Ebot's Rock Coral Chest" },
      { timestamp: "1:32:00", title: "Boss: Hidon & Grand Trine" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Cult of Kefka", "MagiMaster", "Dualcast", "Soul of Thamasa", "Strago", "Grand Trine", "Tower of Fanatics"],
    thumbnailConfig: {
      backgroundPreset: "kefka_tower",
      featuredCharacter: "Setzer",
      overlayText: "DUALCAST UNLOCKED!",
      subText: "EPISODE 17 • CULT OF KEFKA TOWER",
      themeColor: "#f59e0b"
    },
    bossStrategies: [
      "MagiMaster: Cast Berserk on MagiMaster to stop his elemental Wall Changes! Cast Life3 / Reraise or MP drain him to 0 MP so his dying Ultima fizzles!"
    ],
    equipmentNotes: "Soul of Thamasa enables casting 2 magic spells per turn (e.g. Dualcast Ultima + Curaga)!"
  },
  {
    id: 18,
    partNumber: 18,
    world: "World of Ruin",
    title: "FF6 Pixel Remaster #18 - CYAN'S DREAMSCAPE & DOMA RESTORED! (Dream of Cyan)",
    shortTitle: "Cyan's Nightmare & Doma Restored",
    altTitles: [
      "INSIDE CYAN'S NIGHTMARE MIND! - FF6 Pixel Remaster Ep 18",
      "Cyan's Dreamscape & All 8 Bushidos! - Final Fantasy VI Pixel Remaster #18",
      "FF6 Pixel Remaster Episode 18: Three Dream Stooges, Wrecksoul & Alexander Esper"
    ],
    estDurationMinutes: 100,
    startPoint: "Sleeping at Doma Castle with Cyan in party",
    endPoint: "Cyan conquering his guilt & unlocking all 8 Bushido techniques",
    keyEvents: [
      "Sleeping in Doma Castle beds; entering Cyan's tortured subconscious dream",
      "Dreamscape World: Three Dream Stooges boss fight (Curley, Larry, Moe)",
      "Ghost Phantom Train nightmare section inside Cyan's mind",
      "Magitek Armor mine caverns & soul memory fragments",
      "Doma Castle Throne Room confrontion vs nightmare demon Wrecksoul!",
      "Cyan overcoming his grief for Elayne and Owain",
      "Cyan unlocking ALL 8 Bushido (SwdTech) techniques including Tempest & Dragon!",
      "Alexander Magicite & Masamune sword claimed in Doma Castle!"
    ],
    keyItemsAndEspers: ["Alexander Magicite", "Masamune Blade", "Aura Lance", "All 8 Bushidos Unlocked"],
    partyMembers: ["Cyan", "Terra", "Locke", "Celes"],
    status: "not_started",
    description: `Episode 18 of our Final Fantasy VI Pixel Remaster Walkthrough!

When we rest at ruined Doma Castle, three dream demons pull us into Cyan's nightmare mind! We navigate the bizarre dreamscape of Cyan's subconscious—including a demonic version of the Phantom Train and Magitek caves.

In Doma's throne room, we battle Wrecksoul, a demon feeding on Cyan's guilt over the loss of his family. By defeating the demon, Cyan finally forgives himself and transforms his grief into ultimate martial power, unlocking ALL 8 BUSHIDO (SwdTech) TECHNIQUES! We also acquire the Holy Esper Alexander!

TIMESTAMPS:
00:00 - Resting at Ruined Doma Castle
09:15 - Entering Cyan's Nightmare Subconscious
22:40 - Boss Fight: The Three Dream Stooges
38:00 - Nightmare Phantom Train & Magitek Mines
54:15 - Doma Castle Throne Room Nightmare
1:08:30 - Boss Fight: Wrecksoul & Possessed Party Member
1:24:00 - Cyan Overcomes his Grief (Emotional Scene)
1:32:15 - Unlocking ALL 8 Bushido Techniques!
1:38:00 - Claiming Alexander Magicite in Doma

LIKE and SUBSCRIBE for Episode 19!
#FF6 #PixelRemaster #FinalFantasyVI #Cyan #Bushido #DomaCastle #Alexander #Wrecksoul #Dreamscape`,
    chapters: [
      { timestamp: "00:00", title: "Resting at Doma Castle" },
      { timestamp: "09:15", title: "Entering Cyan's Dreamscape" },
      { timestamp: "22:40", title: "Boss: Three Dream Stooges" },
      { timestamp: "38:00", title: "Nightmare Phantom Train" },
      { timestamp: "54:15", title: "Doma Throne Room Confrontation" },
      { timestamp: "1:08:30", title: "Boss Fight: Wrecksoul" },
      { timestamp: "1:24:00", title: "Cyan's Resolution" },
      { timestamp: "1:32:15", title: "All 8 Bushidos Unlocked!" },
      { timestamp: "1:38:00", title: "Claiming Alexander Magicite" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Cyan", "Doma Castle", "Wrecksoul", "Alexander Esper", "Bushido", "Dreamscape", "SwdTech"],
    thumbnailConfig: {
      backgroundPreset: "world_ruin",
      featuredCharacter: "Cyan",
      overlayText: "CYAN'S NIGHTMARE!",
      subText: "EPISODE 18 • ALL 8 BUSHIDOS",
      themeColor: "#8b5cf6"
    },
    bossStrategies: [
      "Wrecksoul: Wrecksoul possesses one of your party members! Kill off the possessed party member to force Wrecksoul out into the open, then blast him with Ice/Holy magic!"
    ],
    equipmentNotes: "Bushido Dragon and Tempest deal massive defense-ignoring physical damage to all enemies!"
  },
  {
    id: 19,
    partNumber: 19,
    world: "World of Ruin",
    title: "FF6 Pixel Remaster #19 - THE 8 LEGENDARY DRAGONS & ANCIENT CASTLE! (Crusader & Ultima)",
    shortTitle: "The 8 Legendary Dragons & Ultimate Magicites",
    altTitles: [
      "DEFEATING ALL 8 DRAGONS! - FF6 Pixel Remaster Ep 19",
      "Ancient Castle, Raiden Esper & Crusader! - Final Fantasy VI Pixel Remaster #19",
      "FF6 Pixel Remaster Episode 19: Dragon Slayer, Master's Scroll & Ultima Weapon Setups"
    ],
    estDurationMinutes: 115,
    startPoint: "Hunting down the remaining Legendary Dragons across the world map",
    endPoint: "Ancient Castle exploration & Final Endgame Party Preparation",
    keyEvents: [
      "Hunting down the remaining Dragons: Storm Dragon (Mt. Zozo), Dirt Dragon (Opera House), Blue Dragon (Ancient Castle), Gold Dragon (Kefka Tower entrance), Skull Dragon",
      "Slaying all 8 Dragons & unlocking CRUSADER Magicite!",
      "Submerging Figaro Castle to discover Ancient Castle buried deep underground",
      "Petrified Queen story, Odin Magicite transformation into RAIDEN!",
      "Master's Scroll (Offering - 4x Attack) & Genji Glove combo setup",
      "Learning ULTIMA spell from Ragnarok / Paladin Shield",
      "100% Endgame party optimization & team division for Kefka's Tower!"
    ],
    keyItemsAndEspers: ["Crusader Magicite", "Raiden Magicite", "Ragnarok Magicite", "Master's Scroll", "Paladin Shield"],
    partyMembers: ["Terra", "Locke", "Celes", "Edgar", "Sabin", "Setzer", "Full Roster"],
    status: "not_started",
    description: `Episode 19 of our Final Fantasy VI Pixel Remaster 100% Walkthrough!

We hunt down the remaining 8 Legendary Dragons scattered across the ruined world (Storm, Dirt, Blue, Gold, Skull, Ice, Red, White) to unlock the supreme CRUSADER Magicite!

Then we take Figaro Castle underground to uncover the forgotten Ancient Castle. We learn the tragic story of the Queen turned to stone, upgrade Odin into the quick-strike Esper RAIDEN, obtain the Master's Scroll (4x strike relic!), teach our entire squad the ULTIMA spell, and configure optimal party builds for the final dungeon!

TIMESTAMPS:
00:00 - Hunting the 8 Legendary Dragons World Tour
14:15 - Boss: Storm Dragon (Mt. Zozo)
26:30 - Boss: Dirt Dragon (Opera House)
38:10 - Slaying the 8th Dragon & Unlocking Crusader Magicite!
52:00 - Submerging Figaro Castle to Ancient Castle Ruins
1:08:15 - Ancient Castle Dungeon & Blue Dragon Boss
1:22:40 - Queen's Tear & Upgrading Odin into RAIDEN!
1:34:00 - Master's Scroll (4x Attack) & Ultima Magic Setup
1:46:00 - Dividing 12 Heroes into 3 Squads for Kefka's Tower!

LIKE and SUBSCRIBE for the GRAND FINALE in Episode 20!
#FF6 #PixelRemaster #FinalFantasyVI #8Dragons #Crusader #Raiden #Ultima #MastersScroll #AncientCastle`,
    chapters: [
      { timestamp: "00:00", title: "8 Dragons Hunting Tour" },
      { timestamp: "14:15", title: "Boss: Storm Dragon" },
      { timestamp: "26:30", title: "Boss: Dirt Dragon" },
      { timestamp: "38:10", title: "Unlocking Crusader Magicite" },
      { timestamp: "52:00", title: "Discovering Ancient Castle" },
      { timestamp: "1:08:15", title: "Boss: Blue Dragon" },
      { timestamp: "1:22:40", title: "Upgrading Odin into RAIDEN" },
      { timestamp: "1:34:00", title: "Master's Scroll & Ultima Setup" },
      { timestamp: "1:46:00", title: "Dividing Squads for Finale" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "8 Dragons", "Crusader", "Raiden", "Ancient Castle", "Master's Scroll", "Ultima", "Endgame"],
    thumbnailConfig: {
      backgroundPreset: "kefka_tower",
      featuredCharacter: "Terra",
      overlayText: "8 DRAGONS SLAIN!",
      subText: "EPISODE 19 • ANCIENT CASTLE & ULTIMA",
      themeColor: "#eab308"
    },
    bossStrategies: [
      "Crusader Unlocked: Slaying all 8 Dragons grants Crusader, which casts elemental apocalypse on all enemies and allies!",
      "Master's Scroll: Combine Master's Scroll with Genji Glove and Valiant Knife / Ultima Weapon for 8 consecutive 9999 physical strikes!"
    ],
    equipmentNotes: "Uncurse the Cursed Shield by fighting 256 battles to obtain the god-tier Paladin Shield (absorbs all elements)!"
  },
  {
    id: 20,
    partNumber: 20,
    world: "World of Ruin",
    title: "FF6 Pixel Remaster #20 - KEFKA'S TOWER & DANCING MAD GOD KEFKA! (100% Game Finale)",
    shortTitle: "Kefka's Tower & The Grand Finale",
    altTitles: [
      "DEFEATING GOD KEFKA! - FF6 Pixel Remaster Ep 20 (SERIES FINALE)",
      "Kefka's Tower 3-Party Assault & Dancing Mad! - FF6 Pixel Remaster Finale",
      "FF6 Pixel Remaster Episode 20: Goddess Statues, God Kefka & Ending Cinematic"
    ],
    estDurationMinutes: 120,
    startPoint: "Dropping 3 Squads onto Kefka's Tower via Airship Falcon",
    endPoint: "Defeating God Kefka, Ending Cinematic & Credits Roll (100% Series Complete)",
    keyEvents: [
      "Dropping 3 distinct 4-character squads onto Kefka's Tower",
      "Kefka's Tower 3-Party cooperative switches, conveyor belts & boss gauntlet",
      "Boss Gauntlet: Inferno, Skull Dragon, Guardian, Goddess, Demon, Fiend!",
      "Reaching the Pinnacle of Kefka's Tower; rejoining all 12 heroes",
      "The Multi-Tier Statue Boss Battle (Visage, Tiger, Tools, Statues)",
      "DIVINE FINAL BOSS SHOWDOWN: Angel of Death God Kefka!",
      "Listening to Nobuo Uematsu's 18-minute masterpiece 'Dancing Mad'!",
      "Defeating God Kefka & escaping collapsing tower",
      "Individual character resolution vignettes, Magic leaving the world, ending credits!"
    ],
    keyItemsAndEspers: ["Fixed Dice", "Aegis Shield", "Rainbow Brush", "Save the Queen"],
    partyMembers: ["Full Roster (All 14 Playable Characters across 3 Teams)"],
    status: "not_started",
    description: `THE GRAND FINALE! Episode 20 of our 100% Final Fantasy VI Pixel Remaster Walkthrough!

We land our entire 12-hero coalition onto the summit of Kefka's Tower! Dividing into 3 squads, we navigate the labyrinth of trash and defeat the statutory bosses: Inferno, Guardian, Goddess, Demon, and Fiend!

At the pinnacle of the tower, we challenge God Kefka to the ultimate showdown! Accompanied by Nobuo Uematsu's epic 18-minute pipe organ masterpiece "Dancing Mad", we battle through 4 tiers of celestial constructs and destroy the god of ruin! Enjoy the complete ending cinematic, character wrap-ups, and credits!

TIMESTAMPS:
00:00 - Landing 3 Squads on Kefka's Tower
12:15 - 3-Party Switch Operations & Dungeon Puzzles
28:40 - Boss Gauntlet: Inferno & Guardian
45:00 - Boss Gauntlet: Goddess, Demon & Fiend
1:02:15 - The Pinnacle Meeting & Final Boss Setup
1:12:00 - Multi-Tier Boss Battle: Visage, Tiger & Statues
1:28:40 - FINAL BOSS: God Kefka Palazzo ("Dancing Mad" Phase)
1:44:00 - God Kefka Defeated & Escaping the Tower
1:52:15 - Ending Cinematic, Character Vignettes & Credits Roll!

THANK YOU for watching our complete 100% FF VI Pixel Remaster Series!
#FF6 #PixelRemaster #FinalFantasyVI #Kefka #GodKefka #DancingMad #FinalBoss #Finale #Ending`,
    chapters: [
      { timestamp: "00:00", title: "Assaulting Kefka's Tower" },
      { timestamp: "12:15", title: "3-Party Cooperative Switches" },
      { timestamp: "28:40", title: "Boss Gauntlet: Inferno & Guardian" },
      { timestamp: "45:00", title: "Boss Gauntlet: Goddess, Demon & Fiend" },
      { timestamp: "1:02:15", title: "Pinnacle Final Assembly" },
      { timestamp: "1:12:00", title: "Multi-Tier Statue Boss Battle" },
      { timestamp: "1:28:40", title: "FINAL BOSS: God Kefka (Dancing Mad)" },
      { timestamp: "1:44:00", title: "God Kefka Defeated & Tower Escape" },
      { timestamp: "1:52:15", title: "Ending Cinematic & Credits" }
    ],
    tags: ["Final Fantasy VI", "FF6 Pixel Remaster", "Kefka", "God Kefka", "Dancing Mad", "Kefka Tower", "Final Boss", "Ending", "Final Fantasy"],
    thumbnailConfig: {
      backgroundPreset: "kefka_tower",
      featuredCharacter: "Kefka",
      overlayText: "GOD KEFKA FINALE!",
      subText: "EPISODE 20 • 100% SERIES COMPLETE",
      themeColor: "#ef4444"
    },
    bossStrategies: [
      "God Kefka: God Kefka uses Forsaken (massive non-elemental damage to all) and Trine (Silence/Blind). Equip Ribbon on everyone! Use Dualcast Ultima, Master's Scroll Valiant Knife physical attacks, and Phantom Rush."
    ],
    equipmentNotes: "Congratulations on completing Final Fantasy VI Pixel Remaster!"
  }
];

export { ff16Episodes, mafiaPlaythroughSeries, mafiaEpisodes, mafiaQuests, bloodbornePlaythroughSeries, bloodborneEpisodes, bloodborneQuests };

export const defaultPlaythroughSeries: PlaythroughSeries[] = [
  bloodbornePlaythroughSeries,
  mafiaPlaythroughSeries,
  ff16PlaythroughSeries,
  {
    id: "ff6",
    gameTitle: "Final Fantasy VI Pixel Remaster",
    gameTitleLogo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" fill="none"><text x="10" y="45" font-family="'Times New Roman', serif" font-size="34" font-weight="900" fill="%23f8fafc" letter-spacing="2">FINAL FANTASY</text><text x="270" y="45" font-family="'Times New Roman', serif" font-size="36" font-weight="900" fill="%2338bdf8">VI</text><text x="12" y="65" font-family="sans-serif" font-size="10" font-weight="800" fill="%23f59e0b" letter-spacing="4">PIXEL REMASTER</text></svg>`,
    useTitleLogo: true,
    subtitle: "100% Walkthrough & Let's Play Series",
    badgeText: "FF6 PIXEL REMASTER",
    accentColor: "#38bdf8",
    genre: "JRPG / Retro",
    gameSynopsis: "A thousand years after the apocalyptic War of the Magi stripped magic from humanity, the ruthless Gestahlian Empire aims to conquer the world through Magitek machinery powered by captive Espers. Young magic-wielder Terra Branford, freed from imperial mind control, joins the Returners resistance to defy Emperor Gestahl and his psychotic general Kefka Palazzo before the balance of the cosmos is destroyed.",
    gameSynopsisSource: "AI Web Scraped via Google Search Grounding",
    playthroughType: "100% Walkthrough",
    createdAt: "2026-08-01",
    episodes: initialEpisodes,
  },
  {
    id: "chrono-trigger",
    gameTitle: "Chrono Trigger",
    gameTitleLogo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 70" fill="none"><text x="10" y="42" font-family="'Impact', sans-serif" font-size="36" font-weight="900" fill="%23ef4444" letter-spacing="2">CHRONO</text><text x="170" y="42" font-family="'Impact', sans-serif" font-size="36" font-weight="900" fill="%23f59e0b" letter-spacing="2">TRIGGER</text></svg>`,
    useTitleLogo: true,
    subtitle: "100% All Endings & Sidequests Walkthrough",
    badgeText: "CHRONO TRIGGER",
    accentColor: "#f59e0b",
    genre: "JRPG / Time Travel",
    gameSynopsis: "When a teleportation machine malfunction sends Princess Marle spiraling into the past at the Millennial Fair, young swordsman Crono and inventor Lucca embark on a journey across prehistoric, medieval, modern, apocalyptic, and magical antique eras. Discovering that a planet-devouring extraterrestrial parasite named Lavos will destroy the earth in 1999 AD, heroes from across time unite to alter history and save humanity.",
    gameSynopsisSource: "AI Web Scraped via Google Search Grounding",
    playthroughType: "100% Walkthrough",
    createdAt: "2026-08-05",
    episodes: [
      {
        id: 201,
        partNumber: 1,
        world: "1000 AD / 600 AD",
        title: "Chrono Trigger #01 - MILLENNIAL FAIR & TIME PORTAL DISCOVERY!",
        shortTitle: "Millennial Fair & Time Portal",
        altTitles: [
          "THE ACCIDENTAL TIME TRAVEL! - Chrono Trigger Ep 1",
          "Crono & Marle's First Meeting - Chrono Trigger 100% Walkthrough #1"
        ],
        estDurationMinutes: 105,
        startPoint: "Crono's House & Millennial Fair Gate",
        endPoint: "Reaching 600 AD Truce Canyon & Guardia Castle",
        keyEvents: [
          "Crono meets Princess Marle at the Millennial Fair",
          "Lucca's Telepod Demonstration & Pendant reaction",
          "Time Portal opens; Marle swallowed into 600 AD",
          "Crono leaps through the Gate to rescue Marle",
          "Infiltrating Guardia Castle 600 AD & Rescuing Princess Nadia"
        ],
        keyItemsAndEspers: ["Pendant", "Lode Sword", "Silver Points"],
        partyMembers: ["Crono", "Lucca"],
        status: "recorded",
        description: "Welcome to Episode 1 of our 100% Chrono Trigger Playthrough! In this 105-minute premiere episode, we explore the Millennial Fair, play mini-games, meet Princess Marle, test Lucca's Telepod invention, travel through the accidental Time Gate to 600 AD Truce Canyon, infiltrate Guardia Castle, and rescue Queen Leene!\n\nCHAPTER TIMESTAMPS:\n00:00 - Chrono's House & Millennial Fair Mini-Games\n22:15 - Meeting Princess Marle & Telepod Demo\n45:30 - Time Gate Opens & 600 AD Truce Canyon\n1:08:20 - Infiltrating 600 AD Guardia Castle\n1:28:40 - Manoria Cathedral Secret Passages\n1:42:00 - Boss Fight: Yakra & Returning to Guardia Castle\n\n#ChronoTrigger #JRPG #LetsPlay #TimeTravel #Crono",
        chapters: [
          { timestamp: "00:00", title: "Millennial Fair Exploration" },
          { timestamp: "22:15", title: "Lucca's Telepod & Pendant Reaction" },
          { timestamp: "45:30", title: "Time Portal to 600 AD" },
          { timestamp: "1:08:20", title: "Guardia Castle Exploration" },
          { timestamp: "1:28:40", title: "Manoria Cathedral Secret Passages" },
          { timestamp: "1:42:00", title: "Boss Fight: Yakra & Returning to Guardia Castle" }
        ],
        tags: ["Chrono Trigger", "Crono", "Marle", "Lucca", "JRPG", "Time Travel"],
        thumbnailConfig: {
          backgroundPreset: "vector",
          featuredCharacter: "Crono",
          overlayText: "TIME PORTAL AWAKENS!",
          subText: "EPISODE 01 • 1000 AD TO 600 AD",
          themeColor: "#f59e0b"
        },
        bossStrategies: ["Yakra: Focus Crono's Cyclone and Frog's Slurp Heal when low!"],
        equipmentNotes: "Don't pick up the pink bag at the fair before talking to the seller!"
      },
      {
        id: 202,
        partNumber: 2,
        world: "600 AD",
        title: "Chrono Trigger #02 - THE HERO FROG & MANORIA CATHEDRAL!",
        shortTitle: "Hero Frog & Manoria Cathedral",
        altTitles: ["FROG JOINS THE PARTY! - Chrono Trigger Walkthrough Ep 2"],
        estDurationMinutes: 90,
        startPoint: "Guardia Castle 600 AD",
        endPoint: "Defeating Yakra & Returning Princess Nadia to 1000 AD",
        keyEvents: [
          "Infiltrating Manoria Cathedral disguised as Nuns",
          "Frog's epic swordsman entry",
          "Yakra boss fight & saving Queen Leene"
        ],
        keyItemsAndEspers: ["SteelSaber", "Mid Ether"],
        partyMembers: ["Crono", "Lucca", "Frog"],
        status: "recorded",
        description: "Episode 2 of Chrono Trigger! We team up with the chivalrous knight Frog to infiltrate Manoria Cathedral and rescue Queen Leene!",
        chapters: [
          { timestamp: "00:00", title: "Entering Manoria Cathedral" },
          { timestamp: "18:30", title: "Frog Joins the Party" },
          { timestamp: "35:10", title: "Boss Fight: Yakra" }
        ],
        tags: ["Chrono Trigger", "Frog", "Yakra", "JRPG"],
        thumbnailConfig: {
          backgroundPreset: "vector",
          featuredCharacter: "Frog",
          overlayText: "ENTER THE HERO FROG!",
          subText: "EPISODE 02 • MANORIA CATHEDRAL",
          themeColor: "#10b981"
        },
        bossStrategies: ["Yakra: Keep party healed with Frog's Slurp."],
        equipmentNotes: "Equip Silver Bow on Lucca."
      }
    ]
  },
  {
    id: "elden-ring",
    gameTitle: "Elden Ring: Shadow of the Erdtree",
    subtitle: "100% All Bosses, Quests & Lore Walkthrough",
    badgeText: "ELDEN RING",
    accentColor: "#eab308",
    genre: "Action RPG / Soulsborne",
    playthroughType: "100% Walkthrough",
    episodes: [
      {
        id: 301,
        partNumber: 1,
        world: "Limgrave",
        title: "Elden Ring #01 - LANDS BETWEEN & MARGIT THE FELL OMEN!",
        shortTitle: "Limgrave & Margit Fell Omen",
        altTitles: ["THE TARNISHED AWAKENS! - Elden Ring 100% Walkthrough Ep 1"],
        estDurationMinutes: 110,
        startPoint: "Chapel of Anticipation & First Step",
        endPoint: "Stormveil Castle Gates & Margit Defeated",
        keyEvents: [
          "Meeting Melina & acquiring Torrent the Spectral Steed",
          "Tree Sentinel dodge strategy & Church of Elleh",
          "Stormfoot Catacombs & Erdtree Burial Watchdog",
          "Margit the Fell Omen boss fight with Sorcerer Rogier"
        ],
        keyItemsAndEspers: ["Spectral Steed Whistle", "Flask of Wondrous Physick", "Margit's Shackle"],
        partyMembers: ["Tarnished", "Melina", "Sorcerer Rogier"],
        status: "published",
        description: "Welcome to Episode 1 of our 100% Elden Ring Walkthrough! We step out into Limgrave, get Torrent, explore catacombs, and vanquish Margit the Fell Omen!\n\nTIMESTAMPS:\n00:00 - First Step & Tree Sentinel\n22:15 - Meeting Melina & Getting Torrent\n45:00 - Stormfoot Catacombs\n1:15:30 - Margit the Fell Omen Boss Fight\n\n#EldenRing #Margit #Soulsborne #LetsPlay",
        chapters: [
          { timestamp: "00:00", title: "Entering Limgrave" },
          { timestamp: "22:15", title: "Melina & Torrent" },
          { timestamp: "45:00", title: "Stormfoot Catacombs" },
          { timestamp: "1:15:30", title: "Boss: Margit the Fell Omen" }
        ],
        tags: ["Elden Ring", "Margit", "Limgrave", "Melina", "Soulsborne"],
        thumbnailConfig: {
          backgroundPreset: "vector",
          featuredCharacter: "Tarnished",
          overlayText: "MARGIT FELL OMEN!",
          subText: "EPISODE 01 • LIMGRAVE BEGINNINGS",
          themeColor: "#eab308"
        },
        bossStrategies: ["Margit: Use Margit's Shackle in Phase 1 twice to stun him!"],
        equipmentNotes: "Grab the Whetstone Knife at Gatefront Ruins!"
      }
    ]
  },
  {
    id: "totk",
    gameTitle: "Zelda: Tears of the Kingdom",
    subtitle: "100% Master Quest & Shrine Guide",
    badgeText: "TEARS OF THE KINGDOM",
    accentColor: "#10b981",
    genre: "Action Adventure / Open World",
    gameSynopsis: "Following the resurrection of the ancient Demon King Ganondorf beneath Hyrule Castle and the sudden vanishing of Princess Zelda, Link awakens with a mystical Zonai right arm endowed with reality-bending abilities. Traversing sky islands, the expansive Hyrule surface, and the subterranean Depths, Link uncovers the origins of the Imprisoning War and restores the Master Sword to defeat Ganondorf.",
    gameSynopsisSource: "AI Web Scraped via Google Search Grounding",
    playthroughType: "Blind Playthrough",
    episodes: [
      {
        id: 401,
        partNumber: 1,
        world: "Great Sky Island",
        title: "Zelda TOTK #01 - SKY ISLANDS & ULTRAHAND ABILITY!",
        shortTitle: "Great Sky Island & Ultrahand",
        altTitles: ["LINK'S NEW ARM! - Tears of the Kingdom Playthrough Ep 1"],
        estDurationMinutes: 110,
        startPoint: "Room of Awakening",
        endPoint: "Temple of Time & Descending to Hyrule Surface",
        keyEvents: [
          "Awakening with Rauru's Right Arm",
          "Exploring Great Sky Island & Ukouh Shrine (Ultrahand)",
          "In-isa Shrine (Fuse Ability & Zonai Crafting)",
          "Gutanbac Shrine (Ascend Ability & Cold Resistance)",
          "Temple of Time Door Unlock, Recall Ability & Descending to Hyrule"
        ],
        keyItemsAndEspers: ["Purah Pad", "Archaic Tunic", "Ultrahand Ability", "Fuse Ability", "Ascend Ability"],
        partyMembers: ["Link", "Rauru"],
        status: "published",
        description: "Welcome to Episode 1 of our 100% Zelda: Tears of the Kingdom Playthrough & Walkthrough! In this 110-minute premiere, Link awakens in Great Sky Island with Rauru's mystical right arm. We explore the sky realm, unlock Ultrahand, Fuse, and Ascend abilities, solve all Sky Shrines, build Zonai contraptions, and open the Temple of Time to descend onto the surface of Hyrule!\n\nCHAPTER TIMESTAMPS:\n00:00 - Introduction & Room of Awakening\n18:30 - Great Sky Island & Meeting Rauru\n38:15 - Ukouh Shrine & Ultrahand Ability\n58:40 - In-isa Shrine & Fuse Ability (Zonai Crafting)\n1:18:20 - Gutanbac Shrine & Ascend Ability (Cold Resistance)\n1:38:10 - Nachoyah Shrine & Recall Ability\n1:50:00 - Temple of Time & Descending to Hyrule Surface!\n\nSUBSCRIBE for the complete 100% Zelda TOTK Walkthrough!\n#Zelda #TearsOfTheKingdom #TOTK #Link #Ultrahand #Zonai #LetsPlay",
        chapters: [
          { timestamp: "00:00", title: "Introduction & Room of Awakening" },
          { timestamp: "18:30", title: "Great Sky Island & Meeting Rauru" },
          { timestamp: "38:15", title: "Ukouh Shrine & Ultrahand Ability" },
          { timestamp: "58:40", title: "In-isa Shrine & Fuse Ability" },
          { timestamp: "1:18:20", title: "Gutanbac Shrine & Ascend Ability" },
          { timestamp: "1:38:10", title: "Nachoyah Shrine & Recall Ability" },
          { timestamp: "1:50:00", title: "Temple of Time & Descending to Hyrule" }
        ],
        tags: ["Zelda", "Tears of the Kingdom", "TOTK", "Link", "Ultrahand"],
        thumbnailConfig: {
          backgroundPreset: "vector",
          featuredCharacter: "Link",
          overlayText: "ULTRAHAND MASTERED!",
          subText: "EPISODE 01 • GREAT SKY ISLAND",
          themeColor: "#10b981"
        },
        bossStrategies: ["Flux Construct I: Use Ultrahand to pull out the glowing core block!"],
        equipmentNotes: "Find Archaic Warm Greaves to resist cold!"
      }
    ]
  },
  {
    id: "resident-evil-4-remake",
    gameTitle: "Resident Evil 4: Remake",
    subtitle: "100% Hardcore / Professional Walkthrough & Collectibles",
    badgeText: "RESIDENT EVIL 4 REMAKE",
    accentColor: "#ef4444",
    genre: "Survival Horror / Action",
    gameSynopsis: "Six years after the catastrophic biological disaster in Raccoon City, US government special agent Leon S. Kennedy is dispatched on a covert mission to a remote European village to rescue the President's abducted daughter, Ashley Graham. Leon discovers the hostile villagers are infected by a mind-controlling parasite known as Las Plagas, controlled by the sinister religious cult Los Iluminados led by Osmund Saddler.",
    gameSynopsisSource: "AI Web Scraped via Google Search Grounding",
    playthroughType: "100% Walkthrough",
    episodes: [
      {
        id: 501,
        partNumber: 1,
        world: "Village Act (Chapters 1-3)",
        title: "Resident Evil 4 Remake #01 - VILLAGE SQUARE SIEGE & DEL LAGO BOSS!",
        shortTitle: "Village Siege & Del Lago",
        altTitles: [
          "SURVIVING THE PUEBLO VILLAGE! - Resident Evil 4 Remake Ep 1",
          "100% RE4 Remake Walkthrough #1 - Chainsaw Guy & Del Lago"
        ],
        estDurationMinutes: 105,
        startPoint: "European Countryside & Hunters Lodge",
        endPoint: "Lake Settlement & Del Lago Harpoon Battle",
        keyEvents: [
          "Infiltrating the Hunter's Lodge & First Ganado Encounter",
          "Surviving the iconic Pueblo Village Square Siege & Chainsaw Villager (Dr. Salvador)",
          "Meeting Luis Serra trapped in the Farm House basement",
          "Acquiring Boat Fuel and defeating Del Lago lake monster with harpoons"
        ],
        keyItemsAndEspers: ["SG-09 R Pistol", "W-870 Shotgun", "Insignia Key", "Boat Fuel", "Emerald"],
        partyMembers: ["Leon S. Kennedy", "Luis Serra"],
        status: "published",
        description: "Welcome to Episode 1 of our 100% Resident Evil 4 Remake Walkthrough! In this 105-minute epic opening, we survive the brutal Pueblo Village chainsaw attack, meet Luis Serra, collect early treasures, and face Del Lago in an intense boat battle!\n\nCHAPTER TIMESTAMPS:\n00:00 - Introduction & Hunter's Lodge\n18:30 - Pueblo Village Square Chainsaw Siege\n45:00 - Meeting Luis Serra & Farm Exploration\n1:12:15 - Fish Farm & Boat Fuel\n1:32:00 - Del Lago Harpoon Boss Battle\n\nSUBSCRIBE for the complete Resident Evil 4 Remake Walkthrough!\n#RE4Remake #ResidentEvil4 #LeonKennedy #DelLago #SurvivalHorror",
        chapters: [
          { timestamp: "00:00", title: "Introduction & Hunter's Lodge" },
          { timestamp: "18:30", title: "Pueblo Village Square Chainsaw Siege" },
          { timestamp: "45:00", title: "Meeting Luis Serra & Farm Exploration" },
          { timestamp: "1:12:15", title: "Fish Farm & Boat Fuel" },
          { timestamp: "1:32:00", title: "Boss Battle: Del Lago Lake Monster" }
        ],
        tags: ["Resident Evil 4 Remake", "RE4 Remake", "Leon Kennedy", "Del Lago", "Dr Salvador", "Chainsaw", "Walkthrough", "Hardcore"],
        thumbnailConfig: {
          backgroundPreset: "vector",
          featuredCharacter: "Leon",
          overlayText: "VILLAGE SIEGE SURVIVED!",
          subText: "EPISODE 01 • CHAPTERS 1-3",
          themeColor: "#ef4444"
        },
        bossStrategies: [
          "Village Square Siege: Run into the two-story house immediately to trigger Dr. Salvador, grab the W-870 Shotgun upstairs, and jump out the window onto the roof. Keep moving until the church bell rings!",
          "Del Lago: Aim harpoons ahead of Del Lago's swimming path. When it turns directly toward the boat with open jaws, land 2-3 clean mouth hits to interrupt its jump attack."
        ],
        equipmentNotes: "Craft Handgun Ammo & Flash Grenades early. Parry Ganado melee attacks with your Combat Knife!"
      },
      {
        id: 502,
        partNumber: 2,
        world: "Village Act (Chapters 4-6)",
        title: "Resident Evil 4 Remake #02 - EL GIGANTE, ASHLEY RESCUE & VILLA SIEGE!",
        shortTitle: "El Gigante & Villa Siege",
        altTitles: [
          "RESCUING ASHLEY GRAHAM! - Resident Evil 4 Remake Ep 2",
          "Bitores Méndez Barn Boss Battle - RE4 Remake 100% Walkthrough #2"
        ],
        estDurationMinutes: 110,
        startPoint: "Church Grounds & Quarry",
        endPoint: "Checkpoint Escape & Castle Drawbridge",
        keyEvents: [
          "Defeating El Gigante in the Quarry with assistance from the rescued Dog",
          "Solving the Stained Glass Window Puzzle to rescue Ashley Graham from the Church",
          "Defending the Cabin Villa Siege alongside Luis Serra against waves of Plagas",
          "Bella Sisters Chainsaw Ambush at the Mines",
          "Bitores Méndez (The Big Cheese) Burning Barn Boss Battle"
        ],
        keyItemsAndEspers: ["Red9 Pistol", "TMP Submachine Gun", "Church Emblem", "Small Key", "Yellow Herb"],
        partyMembers: ["Leon S. Kennedy", "Ashley Graham", "Luis Serra"],
        status: "published",
        description: "Episode 2 of our 100% Resident Evil 4 Remake Playthrough! Over 110 action-packed minutes as Leon rescues Ashley Graham, survives the legendary Villa Siege with Luis, battles El Gigante, and takes down Bitores Méndez!\n\nCHAPTER TIMESTAMPS:\n00:00 - Quarry & El Gigante Boss Fight\n24:10 - Church Stained Glass Puzzle & Rescuing Ashley\n52:30 - The Infamous Cabin Villa Siege\n1:20:00 - Bella Sisters Mines Ambush\n1:35:45 - Bitores Méndez Barn Boss Battle\n\nSUBSCRIBE for more RE4 Remake Guides!\n#RE4Remake #AshleyGraham #ElGigante #BitoresMendez #SurvivalHorror",
        chapters: [
          { timestamp: "00:00", title: "Quarry & El Gigante Boss Fight" },
          { timestamp: "24:10", title: "Rescuing Ashley Graham in Church" },
          { timestamp: "52:30", title: "Cabin Villa Siege with Luis Serra" },
          { timestamp: "1:20:00", title: "Bella Sisters Chainsaw Ambush" },
          { timestamp: "1:35:45", title: "Boss: Bitores Méndez (Big Cheese)" }
        ],
        tags: ["Resident Evil 4 Remake", "RE4 Remake", "Ashley Graham", "El Gigante", "Villa Siege", "Bitores Mendez", "Red9"],
        thumbnailConfig: {
          backgroundPreset: "vector",
          featuredCharacter: "Ashley",
          overlayText: "ASHLEY RESCUED!",
          subText: "EPISODE 02 • CHAPTERS 4-6",
          themeColor: "#f59e0b"
        },
        bossStrategies: [
          "El Gigante: Shoot its head until the Las Plagas parasite erupts from its back. Use the rifle or shotgun on the parasite. The dog will distract El Gigante!",
          "Bitores Méndez: Phase 1: Shoot his spine from the upper ledge. Phase 2: Dodge his burning beams and throw Flash Grenades when he swings across rafter beams."
        ],
        equipmentNotes: "Buy the Red9 Pistol from the Merchant at the Lake; upgrade firepower immediately."
      },
      {
        id: 503,
        partNumber: 3,
        world: "Castle Act (Chapters 7-9)",
        title: "Resident Evil 4 Remake #03 - SALAZAR'S CASTLE & WATER HALL NIGHTMARE!",
        shortTitle: "Castle Catapults & Water Hall",
        altTitles: [
          "WELCOME TO RAMON SALAZAR'S CASTLE! - RE4 Remake Ep 3",
          "Water Hall Gauntlet & Garrador Fight - RE4 Remake Walkthrough #3"
        ],
        estDurationMinutes: 115,
        startPoint: "Castle Entrance & Ramparts",
        endPoint: "Courtyard Maze & Armored Ashley Section",
        keyEvents: [
          "Surviving Castle Gate Catapult bombardment & raising the Cannon",
          "Blind Garrador Clawed Terror Boss Battle in the Dungeon",
          "Surviving the Water Hall (Audience Chamber) wave defense with Ashley",
          "Collecting the 3 Chimerical Statue Heads (Head of Lion, Goat, Serpent)",
          "Courtyard Hedge Maze Flying Novistadors & Armored Ashley playable section"
        ],
        keyItemsAndEspers: ["Stingray Rifle", "Riot Gun Shotgun", "Head of Lion", "Head of Goat", "Head of Serpent"],
        partyMembers: ["Leon S. Kennedy", "Ashley Graham"],
        status: "recorded",
        description: "Welcome to Episode 3 of our 100% Resident Evil 4 Remake Walkthrough! In this massive 115-minute Castle chapter, we blast through catapults, face the terrifying Garrador, beat the infamous Water Hall, and play as Ashley in the Grand Hall!\n\nCHAPTER TIMESTAMPS:\n00:00 - Castle Gate Catapults & Cannon\n22:30 - Dungeon Garrador Boss Battle\n48:15 - The Infamous Water Hall Gauntlet\n1:18:00 - Grand Hall & 3 Statue Heads\n1:40:00 - Armored Ashley Playable Chapter\n\n#RE4Remake #Garrador #WaterHall #AshleyGraham #RamonSalazar",
        chapters: [
          { timestamp: "00:00", title: "Castle Gate Catapults & Cannon" },
          { timestamp: "22:30", title: "Dungeon Garrador Boss Battle" },
          { timestamp: "48:15", title: "Water Hall Gauntlet" },
          { timestamp: "1:18:00", title: "Grand Hall & 3 Statue Heads" },
          { timestamp: "1:40:00", title: "Armored Ashley Playable Chapter" }
        ],
        tags: ["Resident Evil 4 Remake", "Garrador", "Water Hall", "Salazar Castle", "Stingray", "RE4 Walkthrough"],
        thumbnailConfig: {
          backgroundPreset: "vector",
          featuredCharacter: "Leon",
          overlayText: "WATER HALL SURVIVED!",
          subText: "EPISODE 03 • CHAPTERS 7-9",
          themeColor: "#38bdf8"
        },
        bossStrategies: [
          "Garrador: Walk quietly (don't run!). Crouch around corners and shoot the exposed Las Plagas parasite on its back with high-damage Sniper shots.",
          "Water Hall: Keep Ashley near Leon on 'Tight' command. Focus zealots carrying Ashley first, then use grenades on shield bearers."
        ],
        equipmentNotes: "Purchase the Stingray Sniper Rifle and Riot Gun Shotgun. Upgrade Stingray power for one-shot headshots on zealots."
      },
      {
        id: 504,
        partNumber: 4,
        world: "Castle Act (Chapters 10-12)",
        title: "Resident Evil 4 Remake #04 - VERDUGO, MINECART RIDE & RAMON SALAZAR!",
        shortTitle: "Verdugo & Ramon Salazar Boss",
        altTitles: [
          "FREEZING VERDUGO & MINECART CRAZINESS! - RE4 Remake Ep 4",
          "Ramon Salazar Monster Transformation - RE4 Remake 100% Walkthrough #4"
        ],
        estDurationMinutes: 110,
        startPoint: "Ballroom & Antechamber",
        endPoint: "Clock Tower Lift & Ramon Salazar Boss Battle",
        keyEvents: [
          "Fighting Verdugo (Salazar's Right Hand) using Liquid Nitrogen Showers",
          "High-speed Minecart Ride through the subterranean ruins with Luis Serra",
          "Double El Gigante Volcano Pit boss fight",
          "Major Jack Krauser Knife Duel 1",
          "Ascending the Clock Tower & Ramon Salazar Boss Fight"
        ],
        keyItemsAndEspers: ["Broken Butterfly Magnum", "Gold Chicken Egg", "Salazar Family Ring"],
        partyMembers: ["Leon S. Kennedy", "Luis Serra"],
        status: "recorded",
        description: "Episode 4 of Resident Evil 4 Remake! 110 minutes of pure thrill: we freeze Verdugo, ride the minecarts with Luis, fight two El Gigantes, duel Krauser, and defeat Ramon Salazar at the top of the Clock Tower!\n\nCHAPTER TIMESTAMPS:\n00:00 - Liquid Nitrogen Tank vs Verdugo\n25:40 - Subterranean Minecart Escort with Luis\n48:10 - Dual El Gigante Lava Pit Battle\n1:10:00 - Jack Krauser Knife Duel 1\n1:32:00 - Ramon Salazar Monster Boss Battle\n\n#RE4Remake #Verdugo #RamonSalazar #Minecart #Krauser",
        chapters: [
          { timestamp: "00:00", title: "Verdugo Liquid Nitrogen Boss Fight" },
          { timestamp: "25:40", title: "Minecart Ride with Luis Serra" },
          { timestamp: "48:10", title: "Dual El Gigante Lava Pit Fight" },
          { timestamp: "1:10:00", title: "Jack Krauser Knife Duel" },
          { timestamp: "1:32:00", title: "Boss: Ramon Salazar Transformation" }
        ],
        tags: ["Resident Evil 4 Remake", "Verdugo", "Ramon Salazar", "Krauser", "Minecart", "Magnum"],
        thumbnailConfig: {
          backgroundPreset: "vector",
          featuredCharacter: "Leon",
          overlayText: "SALAZAR DEFEATED!",
          subText: "EPISODE 04 • CHAPTERS 10-12",
          themeColor: "#8b5cf6"
        },
        bossStrategies: [
          "Verdugo: Trigger Liquid Nitrogen showers when Verdugo gets close to freeze him, then unleash Magnum & Shotgun shots for 3x damage!",
          "Ramon Salazar: Pro Tip: Throwing a Golden Chicken Egg directly at Salazar's open mouth deals massive damage and instantly stuns him!"
        ],
        equipmentNotes: "Buy the Broken Butterfly Magnum or Killer7 for boss bursts."
      },
      {
        id: 505,
        partNumber: 5,
        world: "Island Act (Chapters 13-14)",
        title: "Resident Evil 4 Remake #05 - REGENERADORES & MAJOR KRAUSER BOSS!",
        shortTitle: "Regeneradores & Krauser Boss",
        altTitles: [
          "THE NIGHTMARE REGENERADORES! - RE4 Remake Walkthrough Ep 5",
          "Major Jack Krauser Mutated Arm Fight - RE4 Remake 100% #5"
        ],
        estDurationMinutes: 115,
        startPoint: "Island Military Wharf & Searchlights",
        endPoint: "Ruined Ancient Arena & Krauser Defeated",
        keyEvents: [
          "Infiltrating the heavily guarded Island Military Wharf with Turrets & RPG Soldats",
          "Acquiring the Biosensor Scope & terrifying encounters with Regeneradores / Iron Maidens",
          "Operating on Ashley in the Incubator Room to destroy her Plagas parasite",
          "Navigating the Ruins Minefield trap gauntlet",
          "Epic Boss Fight: Mutated Major Jack Krauser"
        ],
        keyItemsAndEspers: ["Biosensor Scope", "LE 5 SMG", "Keycard Level 3", "Wrench", "Fighting Knife"],
        partyMembers: ["Leon S. Kennedy", "Ashley Graham"],
        status: "edited",
        description: "Welcome to Episode 5 of our 100% Resident Evil 4 Remake Walkthrough! In this 115-minute chapter, we enter the Island, use the Biosensor Scope to snip Regeneradores' parasites, save Ashley, and defeat Major Krauser in an epic duel!\n\nCHAPTER TIMESTAMPS:\n00:00 - Island Military Wharf Infiltration\n28:30 - Biosensor Scope & Regeneradores Nightmare\n55:10 - Parasite Extraction & Wrench Hunt\n1:22:00 - Ruins Trap Gauntlet\n1:38:00 - Boss Battle: Mutated Major Krauser\n\n#RE4Remake #Regenerador #Krauser #Island #BiosensorScope",
        chapters: [
          { timestamp: "00:00", title: "Island Wharf Infiltration" },
          { timestamp: "28:30", title: "Biosensor Scope & Regeneradores" },
          { timestamp: "55:10", title: "Ashley Parasite Extraction Surgery" },
          { timestamp: "1:22:00", title: "Ruins Minefield Gauntlet" },
          { timestamp: "1:38:00", title: "Boss: Mutated Major Jack Krauser" }
        ],
        tags: ["Resident Evil 4 Remake", "Regeneradores", "Krauser", "Biosensor Scope", "Island", "LE5"],
        thumbnailConfig: {
          backgroundPreset: "vector",
          featuredCharacter: "Leon",
          overlayText: "REGENERADORES NIGHTMARE!",
          subText: "EPISODE 05 • CHAPTERS 13-14",
          themeColor: "#10b981"
        },
        bossStrategies: [
          "Regeneradores: Attach the Biosensor Scope to the Stingray or LE 5. Target the glowing red heart parasites inside their bodies.",
          "Krauser: Perfect parrying with your knife is critical! When Krauser jumps off high ledges, dodge sprint sideways. Target his head when his mutated shield arm lowers."
        ],
        equipmentNotes: "Equip Biosensor Scope onto LE 5 or Stingray. Keep high durability on your Combat Knife for Krauser parries."
      },
      {
        id: 506,
        partNumber: 6,
        world: "Island Act (Chapters 15-16)",
        title: "Resident Evil 4 Remake #06 - LORD SADDLER FINAL BOSS & JET SKI ESCAPE!",
        shortTitle: "Lord Saddler & Jet Ski Finale",
        altTitles: [
          "FINAL BOSS LORD SADDLER! - RE4 Remake Walkthrough Ep 6 (FINALE)",
          "100% Resident Evil 4 Remake Complete - Jet Ski Sunrise Escape"
        ],
        estDurationMinutes: 100,
        startPoint: "Sanctuary Cliffside & Mike's Helicopter",
        endPoint: "Silo Platform, Ada Rocket Launcher & Jet Ski Sunrise",
        keyEvents: [
          "Sanctuary Cliffside assault with air support from Mike's Attack Helicopter",
          "Sanctuary Altar & Final Plagas Removal Chamber",
          "FINAL BOSS BATTLE: Lord Osmund Saddler Monster Transformation",
          "Ada Wong delivers the Special Red Rocket Launcher",
          "Countdown 2-Minute Jet Ski Rush Escape into the Sunrise"
        ],
        keyItemsAndEspers: ["Special Rocket Launcher", "Primal Knife", "Ashley's Sunglasses", "Golden Gold Bars"],
        partyMembers: ["Leon S. Kennedy", "Ashley Graham", "Ada Wong"],
        status: "published",
        description: "THE GRAND FINALE! Episode 6 of Resident Evil 4 Remake! 100 minutes of pure high-stakes climax: Mike's helicopter assault, defeating Lord Osmund Saddler with Ada's Special Rocket Launcher, and the legendary Jet Ski escape into the sunrise!\n\nCHAPTER TIMESTAMPS:\n00:00 - Mike's Attack Helicopter Fire Support\n25:10 - Sanctuary Shrine Altar Assault\n48:00 - FINAL BOSS: Lord Osmund Saddler\n1:20:00 - Special Rocket Launcher Climax\n1:28:30 - Jet Ski Escape & Sunrise Finale\n\n#RE4Remake #Saddler #AdaWong #JetSkiEscape #GrandFinale",
        chapters: [
          { timestamp: "00:00", title: "Mike's Helicopter Fire Support" },
          { timestamp: "25:10", title: "Sanctuary Shrine Altar Assault" },
          { timestamp: "48:00", title: "FINAL BOSS: Lord Osmund Saddler" },
          { timestamp: "1:20:00", title: "Ada Wong's Special Rocket Launcher" },
          { timestamp: "1:28:30", title: "Jet Ski Escape & Sunrise Finale" }
        ],
        tags: ["Resident Evil 4 Remake", "Saddler", "Ada Wong", "Jet Ski", "Finale", "100% Walkthrough"],
        thumbnailConfig: {
          backgroundPreset: "vector",
          featuredCharacter: "Leon",
          overlayText: "GRAND FINALE COMPLETE!",
          subText: "EPISODE 06 • 100% SERIES COMPLETE",
          themeColor: "#ef4444"
        },
        bossStrategies: [
          "Lord Saddler: Shoot the eyes on his giant spider legs to stagger him, then perform a melee knife stab on his main eye. When Ada throws the Special Rocket Launcher, fire immediately to finish the game!"
        ],
        equipmentNotes: "Congratulations on completing 100% Resident Evil 4 Remake Walkthrough!"
      }
    ]
  }
];

