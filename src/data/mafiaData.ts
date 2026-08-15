import { Episode, PlaythroughSeries, QuestEntry } from "../types";

export const mafiaQuests: QuestEntry[] = [
  {
    id: "mq1",
    title: "Chapter 1: An Offer You Can't Refuse",
    category: "Main Story",
    actOrWorld: "Act I: Taxi Driver to Mobster",
    location: "Little Italy, Lost Heaven",
    episodePart: 1,
    recommendedLevel: "Chapter 1",
    prerequisites: "Game Opening",
    keyRewards: "Smith V12, Cigarette Card #01",
    isMissable: false,
    status: "completed",
    notes: "Help Paulie and Sam escape Morello's goons in a high-speed night taxi pursuit.",
  },
  {
    id: "mq2",
    title: "Chapter 2: Running Man",
    category: "Main Story",
    actOrWorld: "Act I: Taxi Driver to Mobster",
    location: "Lost Heaven Streets -> Salieri's Bar",
    episodePart: 1,
    recommendedLevel: "Chapter 2",
    prerequisites: "Complete Chapter 1",
    keyRewards: "Unlock Salieri's Bar Base",
    isMissable: false,
    status: "completed",
    notes: "Morello's thugs ambush Tommy's cab. Sprint through alleyways to reach Salieri's Bar.",
  },
  {
    id: "mq3",
    title: "Chapter 3: Molotov Party",
    category: "Main Story",
    actOrWorld: "Act I: Taxi Driver to Mobster",
    location: "Morello's Bar Garage",
    episodePart: 1,
    recommendedLevel: "Chapter 3",
    prerequisites: "Complete Chapter 2",
    keyRewards: "Lupara Shotgun, Baseball Bat",
    isMissable: false,
    status: "completed",
    notes: "Infiltrate Morello's garage with Paulie, smash luxury cars with bat and ignite with Molotovs.",
  },
  {
    id: "mq4",
    title: "Chapter 4: Ordinary Routine",
    category: "Main Story",
    actOrWorld: "Act I: Taxi Driver to Mobster",
    location: "Clark's Motel",
    episodePart: 1,
    recommendedLevel: "Chapter 4",
    prerequisites: "Complete Chapter 3",
    keyRewards: "Tommy Gun, Dime Detective #01, Protection Cash",
    isMissable: false,
    status: "completed",
    notes: "Collect protection money across Lost Heaven; rescue wounded Sam in Clark's Motel shootout.",
  },
  {
    id: "mq5",
    title: "Chapter 5: Fair Play",
    category: "Main Story",
    actOrWorld: "Act I: Racing & Street Wars",
    location: "Lost Heaven Race Track",
    episodePart: 2,
    recommendedLevel: "Chapter 5",
    prerequisites: "Complete Chapter 4",
    keyRewards: "Carrozella C-Seven Racecar, Cigarette Card #03",
    isMissable: false,
    status: "completed",
    notes: "Sabotage rival racer's car overnight, then win the 3-lap Lost Heaven Grand Prix.",
  },
  {
    id: "mq6",
    title: "Chapter 6: Sarah",
    category: "Main Story",
    actOrWorld: "Act I: Racing & Street Wars",
    location: "Little Italy Alleyways",
    episodePart: 2,
    recommendedLevel: "Chapter 6",
    prerequisites: "Complete Chapter 5",
    keyRewards: "Brass Knuckles, Sarah's Favor",
    isMissable: false,
    status: "completed",
    notes: "Escort Luigi's daughter Sarah home at night and defeat street gang in hand-to-hand brawl.",
  },
  {
    id: "mq7",
    title: "Chapter 7: Better Get Used To It",
    category: "Main Story",
    actOrWorld: "Act I: Racing & Street Wars",
    location: "Corleans Boarding School & Alleys",
    episodePart: 2,
    recommendedLevel: "Chapter 7",
    prerequisites: "Complete Chapter 6",
    keyRewards: "Service Revolver, Gangster Respect",
    isMissable: false,
    status: "completed",
    notes: "Raid the punk street gang hideout with Paulie and avenge the attack on Sarah.",
  },
  {
    id: "mq8",
    title: "Chapter 8: Saint's and Sinners",
    category: "Main Story",
    actOrWorld: "Act I: Racing & Street Wars",
    location: "Hotel Corleone & St. Michael's Church",
    episodePart: 2,
    recommendedLevel: "Chapter 8",
    prerequisites: "Complete Chapter 7",
    keyRewards: "Custom Suit Outfit, Super Science #02",
    isMissable: false,
    status: "completed",
    notes: "Bomb Hotel Corleone, assassinate Madame, and fight through St. Michael's Church funeral.",
  },
  {
    id: "mq9",
    title: "Chapter 9: A Trip to the Country",
    category: "Main Story",
    actOrWorld: "Act II: Countryside & Betrayal",
    location: "Northern Countryside Farm",
    episodePart: 3,
    recommendedLevel: "Chapter 9",
    prerequisites: "Complete Chapter 8",
    keyRewards: "Thompson M1928, Countryside Truck",
    isMissable: false,
    status: "completed",
    notes: "Investigate stormy farm during whiskey deal; defend truck during intense Morello ambush.",
  },
  {
    id: "mq10",
    title: "Chapter 10: Omerta",
    category: "Main Story",
    actOrWorld: "Act II: Countryside & Betrayal",
    location: "Lost Heaven International Airport",
    episodePart: 3,
    recommendedLevel: "Chapter 10",
    prerequisites: "Complete Chapter 9",
    keyRewards: "Salieri Account Ledgers, Cigarette Card #05",
    isMissable: false,
    status: "completed",
    notes: "Track Frank Colletti to airport after federal betrayal, spare his life, and recover ledgers.",
  },
  {
    id: "mq11",
    title: "Chapter 11: Visit to Rich People",
    category: "Main Story",
    actOrWorld: "Act II: Countryside & Betrayal",
    location: "Oakwood Prosecutor's Villa",
    episodePart: 3,
    recommendedLevel: "Chapter 11",
    prerequisites: "Complete Chapter 10",
    keyRewards: "Salvatore's Lockpicks, Prosecutor Ledger",
    isMissable: false,
    status: "completed",
    notes: "Infiltrate Prosecutor's Villa with safe-cracker Salvatore and steal evidence ledgers.",
  },
  {
    id: "mq12",
    title: "Chapter 12: Great Deal",
    category: "Main Story",
    actOrWorld: "Act II: War with Don Morello",
    location: "Multi-Story Parking Garage",
    episodePart: 4,
    recommendedLevel: "Chapter 12",
    prerequisites: "Complete Chapter 11",
    keyRewards: "Bootleg Canadian Whiskey",
    isMissable: false,
    status: "in_progress",
    notes: "Survive ambush during whiskey purchase in parking garage and escort truck out.",
  },
  {
    id: "mq13",
    title: "Chapter 13: Bon Appétit",
    category: "Main Story",
    actOrWorld: "Act II: War with Don Morello",
    location: "Pepe's Restaurant, North Park",
    episodePart: 4,
    recommendedLevel: "Chapter 13",
    prerequisites: "Complete Chapter 12",
    keyRewards: "Pepe's Gratitude, Lupara Shotgun",
    isMissable: false,
    status: "planned",
    notes: "Protect Don Salieri during sudden drive-by Tommy gun attack at Pepe's Restaurant.",
  },
  {
    id: "mq14",
    title: "Chapter 14: Happy Birthday!",
    category: "Main Story",
    actOrWorld: "Act II: War with Don Morello",
    location: "S.S. Manganano Steamer Ship",
    episodePart: 4,
    recommendedLevel: "Chapter 14",
    prerequisites: "Complete Chapter 13",
    keyRewards: "Golden Revolver, Sailor Uniform",
    isMissable: false,
    status: "planned",
    notes: "Board paddle steamer disguised as sailor and assassinate Councillor Ghillotti during fireworks.",
  },
  {
    id: "mq15",
    title: "Chapter 15: You Lucky Bastard",
    category: "Main Story",
    actOrWorld: "Act II: War with Don Morello",
    location: "Lost Heaven Harbor Docks",
    episodePart: 4,
    recommendedLevel: "Chapter 15",
    prerequisites: "Complete Chapter 14",
    keyRewards: "Cigarette Card #06, Harbor Key",
    isMissable: false,
    status: "planned",
    notes: "Survive multiple failed hits on Sergio Morello and eliminate him at Lost Heaven Harbor.",
  },
  {
    id: "mq16",
    title: "Chapter 16: Crème de la Crème",
    category: "Main Story",
    actOrWorld: "Act III: Downfall of Don Morello",
    location: "Lost Heaven Airport & Bridge",
    episodePart: 5,
    recommendedLevel: "Chapter 16",
    prerequisites: "Complete Chapter 15",
    keyRewards: "Cigarette Card #07 (Don Morello)",
    isMissable: false,
    status: "planned",
    notes: "Pursue Don Morello to Lost Heaven Airport and shoot down his plane to end his crime empire.",
  },
  {
    id: "mq17",
    title: "Chapter 17: Election Campaign",
    category: "Main Story",
    actOrWorld: "Act III: Downfall of Don Morello",
    location: "Lost Heaven State Prison Watchtower",
    episodePart: 5,
    recommendedLevel: "Chapter 17",
    prerequisites: "Complete Chapter 16",
    keyRewards: "Mosin-Nagant Sniper Rifle, Prison Key",
    isMissable: false,
    status: "planned",
    notes: "Navigate creepy abandoned prison tower and snipe corrupt politician on campaign stage.",
  },
  {
    id: "mq18",
    title: "Chapter 18: Just for Relaxation",
    category: "Main Story",
    actOrWorld: "Act III: Downfall of Don Morello",
    location: "Harbor Warehouse B",
    episodePart: 5,
    recommendedLevel: "Chapter 18",
    prerequisites: "Complete Chapter 17",
    keyRewards: "Diamond Cigar Crates",
    isMissable: false,
    status: "planned",
    notes: "Steal imported cigar crates from harbor warehouse and discover hidden raw diamonds.",
  },
  {
    id: "mq19",
    title: "Chapter 19: Moonlighting",
    category: "Main Story",
    actOrWorld: "Act III: The Finale",
    location: "First National Bank of Lost Heaven",
    episodePart: 6,
    recommendedLevel: "Chapter 19",
    prerequisites: "Complete Chapter 18",
    keyRewards: "$160,000 Vault Cash, Gold M1911",
    isMissable: false,
    status: "planned",
    notes: "Rob First National Bank with Paulie in unsanctioned heist and escape police dragnet.",
  },
  {
    id: "mq20",
    title: "Chapter 20: The Death of Art",
    category: "Main Story",
    actOrWorld: "Act III: The Finale",
    location: "Lost Heaven Art Gallery",
    episodePart: 6,
    recommendedLevel: "Chapter 20",
    prerequisites: "Complete Chapter 19",
    keyRewards: "Series 100% Completion Badge",
    isMissable: false,
    status: "planned",
    notes: "Find Paulie murdered, confront Sam Trapani at Lost Heaven Art Gallery, and complete story.",
  },
];

export const mafiaEpisodes: Episode[] = [
  {
    id: 301,
    partNumber: 1,
    world: "Act I: Taxi Driver to Mobster",
    title: "Mafia: Definitive Edition #01 - AN OFFER YOU CAN'T REFUSE & MOLOTOV PARTY! (Chapters 1-4)",
    shortTitle: "An Offer You Can't Refuse",
    altTitles: [
      "TAXI DRIVER TO MAFIA ENFORCER! - Mafia: Definitive Edition Playthrough Ep 1",
      "Joining Don Salieri's Family! - Mafia Remake Walkthrough #1",
      "Mafia Definitive Edition Episode 1: Escaping Morello & Clark's Motel Shootout",
    ],
    estDurationMinutes: 110,
    startPoint: "Lost Heaven 1930: Night Shift Taxi Ride in Little Italy",
    endPoint: "Clark's Motel Shootout & Rescuing Sam with Salieri's Money",
    keyEvents: [
      "Taxi rescue of Paulie Lombardo and Sam Trapani from Morello's hitmen",
      "Morello goons destroy Tommy's taxi; fleeing on foot to Salieri's Bar",
      "Joining the Salieri Family & meeting Don Ennio Salieri and Vincenzo",
      "Molotov Party: Retaliation on Morello's Bar garage & smashing cars",
      "Ordinary Routine: Protection money collection across Lost Heaven",
      "Clark's Motel Shootout: High-stakes rescue of wounded Sam Trapani",
    ],
    keyItemsAndEspers: [
      "Smith V12 @ Salieri's Garage",
      "Cigarette Card #01 (Tommy Angelo) @ Salieri's Bar",
      "Cigarette Card #02 (Don Salieri) @ Salieri's Office",
      "Dime Detective Magazine #01 @ Clark's Motel Bar",
      "Lupara Shotgun @ Vincenzo's Armory",
      "Mystery Fox #01 @ Clark's Motel Storage Room",
    ],
    partyMembers: ["Tommy Angelo", "Paulie Lombardo", "Sam Trapani", "Don Salieri"],
    status: "recorded",
    description: `Welcome to Episode 1 of our 100% Mafia: Definitive Edition Walkthrough & Let's Play Series!

In this 110-minute opener, humble Lost Heaven taxi driver Tommy Angelo gets thrust into the dangerous 1930s underworld when he aids Salieri mobsters Paulie Lombardo and Sam Trapani in escaping Morello's hitmen. After Morello's goons track down and wreck Tommy's cab, he flees to Salieri's Bar and pledges his loyalty to Don Ennio Salieri.

We take sweet revenge in "Molotov Party" by smashing Morello's luxury fleet, collect protection money across the city in "Ordinary Routine", and survive an intense gunfight at Clark's Motel to rescue Sam!

TIMESTAMPS:
00:00 - Chapter 1: An Offer You Can't Refuse (Night Taxi Chase)
18:30 - Chapter 2: Running Man (Fleeing Morello's Goons to Salieri's Bar)
36:15 - Chapter 3: Molotov Party (Infiltrating Morello's Garage)
54:00 - Chapter 4: Ordinary Routine (Protection Money Run)
1:18:40 - Clark's Motel Infiltration & Gunfight
1:38:20 - Rescuing Sam Trapani & Highway Pursuit Escape
1:47:00 - Episode Wrap-Up & Next Episode Teaser

SUBSCRIBE for the complete Mafia: Definitive Edition 100% Walkthrough!
#MafiaDefinitiveEdition #Mafia #TommyAngelo #SalieriFamily #Walkthrough #LetsPlay #2KGames`,
    chapters: [
      { timestamp: "00:00", title: "Chapter 1: An Offer You Can't Refuse" },
      { timestamp: "18:30", title: "Chapter 2: Running Man" },
      { timestamp: "36:15", title: "Chapter 3: Molotov Party" },
      { timestamp: "54:00", title: "Chapter 4: Ordinary Routine" },
      { timestamp: "1:18:40", title: "Clark's Motel Shootout" },
      { timestamp: "1:38:20", title: "Rescuing Sam & Highway Pursuit" },
      { timestamp: "1:47:00", title: "Wrap-Up & Episode Teaser" },
    ],
    tags: ["Mafia Definitive Edition", "Mafia 1 Remake", "Tommy Angelo", "Don Salieri", "Lost Heaven", "Paulie Lombardo", "Clark's Motel", "Action Adventure"],
    thumbnailConfig: {
      backgroundPreset: "city",
      featuredCharacter: "Tommy Angelo",
      overlayText: "TAXI TO MOBSTER!",
      subText: "EPISODE 01 • CHAPTERS 1-4",
      themeColor: "#dc2626",
    },
    bossStrategies: ["Clark's Motel Shootout: Cover behind the downstairs bar counter. Pick off Morello's goons on the upper balcony before advancing to rescue Sam."],
    equipmentNotes: "Grab the Lupara Shotgun from Vincenzo before starting the protection money run!",
  },
  {
    id: 302,
    partNumber: 2,
    world: "Act I: Racing & Street Wars",
    title: "Mafia: Definitive Edition #02 - GRAND PRIX RACING & HOTEL CORLEONE! (Chapters 5-8)",
    shortTitle: "Fair Play & Saints and Sinners",
    altTitles: [
      "I WON THE LOST HEAVEN GRAND PRIX! - Mafia: Definitive Edition Ep 2",
      "Hotel Corleone Infiltration & Church Funeral Shootout! - Mafia Remake #2",
      "Mafia Definitive Edition Episode 2: Racing Carrozella C-Seven & Escorting Sarah",
    ],
    estDurationMinutes: 115,
    startPoint: "Chapter 5: Fair Play (Sabotaging the Carrozella C-Seven at Race Track)",
    endPoint: "Chapter 8: Saint's and Sinners (Escaping St. Michael's Church Roof Funeral Shootout)",
    keyEvents: [
      "Fair Play: Night mission stealing and sabotaging rival racer's Carrozella C-Seven",
      "Winning the brutal Lost Heaven Grand Prix on Classic difficulty",
      "Sarah: Walking Luigi's daughter Sarah home and alleyway brawl with street hoodlums",
      "Better Get Used To It: Raiding Biff's street gang hideout in Little Italy",
      "Hotel Corleone: Infiltrating the hotel, planting bomb in Manager's office & assassinating Madame",
      "Saint's and Sinners: Rooftop shootout escape and St. Michael's Church funeral confrontation",
    ],
    keyItemsAndEspers: [
      "Carrozella C-Seven Racecar @ Lost Heaven Race Track",
      "Cigarette Card #03 (Frank Colletti) @ Salieri's Bar",
      "Cigarette Card #04 (Luigi Mariani) @ Hotel Corleone Lobby",
      "Super Science Stories #02 @ St. Michael's Church Belfry",
      "Brass Knuckles @ Sarah's Alleyway Brawl",
      "Custom Suit Outfit @ Hotel Corleone",
    ],
    partyMembers: ["Tommy Angelo", "Sarah", "Paulie Lombardo", "Sam Trapani", "Frank Colletti"],
    status: "recorded",
    description: `Episode 2 of our 100% Mafia: Definitive Edition Walkthrough!

In this 115-minute action-packed episode, Tommy steps up to drive the Carrozella C-Seven in the grueling Lost Heaven Grand Prix after Salieri's main driver is injured. After taking 1st place on the race track, Tommy walks Luigi's daughter Sarah home, defending her against a menacing street gang.

In "Hotel Corleone" and "Saint's and Sinners", Tommy executes a high-risk hit on the hotel manager and madame, detonates explosives inside the hotel, and fights his way through St. Michael's Church during a hostile mafia funeral!

TIMESTAMPS:
00:00 - Chapter 5: Fair Play (Racecar Sabotage & Grand Prix Victory)
28:15 - Chapter 6: Sarah (Alleyway Brawl & Escorting Sarah)
46:40 - Chapter 7: Better Get Used To It (Little Italy Street Gang Raid)
1:08:10 - Chapter 8: Hotel Corleone (Infiltration & Office Bombing)
1:32:00 - St. Michael's Church Funeral Shootout
1:50:30 - Rooftop Escape with Paulie & Episode Wrap-Up

SUBSCRIBE for more Mafia: Definitive Edition gameplay!
#MafiaDefinitiveEdition #FairPlay #HotelCorleone #TommyAngelo #LostHeavenGrandPrix #LetsPlay`,
    chapters: [
      { timestamp: "00:00", title: "Chapter 5: Fair Play (Race Sabotage & Grand Prix)" },
      { timestamp: "28:15", title: "Chapter 6: Sarah (Alleyway Brawl)" },
      { timestamp: "46:40", title: "Chapter 7: Better Get Used To It" },
      { timestamp: "1:08:10", title: "Chapter 8: Hotel Corleone Infiltration" },
      { timestamp: "1:32:00", title: "St. Michael's Church Shootout" },
      { timestamp: "1:50:30", title: "Rooftop Escape & Wrap-Up" },
    ],
    tags: ["Mafia Definitive Edition", "Fair Play Race", "Carrozella C-Seven", "Hotel Corleone", "Saint and Sinners", "Tommy Angelo", "Sarah", "Lost Heaven"],
    thumbnailConfig: {
      backgroundPreset: "race",
      featuredCharacter: "Tommy Angelo",
      overlayText: "GRAND PRIX & HOTEL HIT!",
      subText: "EPISODE 02 • CHAPTERS 5-8",
      themeColor: "#f59e0b",
    },
    bossStrategies: ["Grand Prix Race: Take the inside corner line on the 2nd hairpin turn and avoid hard braking. Keep vehicle balanced over jump hills."],
    equipmentNotes: "Collect the Cigarette Card inside Hotel Corleone's VIP lounge before planting the bomb!",
  },
  {
    id: 303,
    partNumber: 3,
    world: "Act II: Countryside & Betrayal",
    title: "Mafia: Definitive Edition #03 - COUNTRY FARM AMBUSH & PROSECUTOR VILLA HEIST! (Chapters 9-11)",
    shortTitle: "A Trip to Country & Omerta",
    altTitles: [
      "FRANK BETRAYED US?! - Mafia: Definitive Edition Ep 3",
      "Countryside Farm Ambush & Safe Cracking Villa Heist! - Mafia Remake #3",
      "Mafia Definitive Edition Episode 3: Airport Tracking, Ledgers & Salvatore",
    ],
    estDurationMinutes: 110,
    startPoint: "Chapter 9: A Trip to the Country (Stormy Night at North Country Farm)",
    endPoint: "Chapter 11: Visit to Rich People (Escaping Prosecutor's Oakwood Villa with Ledgers)",
    keyEvents: [
      "A Trip to the Country: Investigating the quiet country farm in a heavy thunderstorm",
      "Ambush by Morello's mobsters & defending truck with Tommy Gun shootout",
      "Omerta: Discovering Frank Colletti betrayed Don Salieri to federal authorities",
      "Tracking Frank to Lost Heaven International Airport & retrieving Salieri's account ledgers",
      "Tommy spares Frank's life and puts him on a plane to Europe with his family",
      "Visit to Rich People: Safe-cracker Salvatore joins Tommy to infiltrate Prosecutor's Villa in Oakwood",
      "Stealing the evidence ledgers from Villa safe and evading armed guards",
    ],
    keyItemsAndEspers: [
      "Thompson M1928 Tommy Gun @ Countryside Barn",
      "Salvatore's Lockpicks @ Oakwood Villa Gate",
      "Prosecutor's Evidence Ledger @ Villa Master Safe",
      "Cigarette Card #05 (Leo Galante) @ Airport Hangar",
      "Dime Detective Magazine #04 @ Countryside Farmhouse",
      "Lassiter V16 Executive Sedan @ Villa Driveway",
    ],
    partyMembers: ["Tommy Angelo", "Paulie Lombardo", "Sam Trapani", "Frank Colletti", "Salvatore"],
    status: "recorded",
    description: `Episode 3 of our 100% Mafia: Definitive Edition Walkthrough!

In this 110-minute episode, a routine whiskey pickup at a northern countryside farm turns into a bloodbath in "A Trip to the Country" as Morello's hitmen ambush Paulie and Sam during a torrential rainstorm.

Then, heartbreak strikes in "Omerta" when Don Salieri discovers his closest consigliere, Frank Colletti, has turned informant for the feds. Tommy tracks Frank to Lost Heaven International Airport, makes a life-altering choice, and retrieves Salieri's ledgers. Finally, Tommy pairs up with master safe-cracker Salvatore for a stealthy heist at the Prosecutor's Villa in Oakwood!

TIMESTAMPS:
00:00 - Chapter 9: A Trip to the Country (Rainy Farm Investigation)
24:10 - Barn Shootout & Truck Escort Defense
42:30 - Chapter 10: Omerta (Frank's Betrayal & Airport Tracking)
1:08:15 - Confronting Frank Colletti & Retrieving Ledgers
1:24:00 - Chapter 11: Visit to Rich People (Meeting Safe-cracker Salvatore)
1:38:50 - Infiltrating Prosecutor's Villa & Safe Cracking
1:46:15 - Police Pursuit Escape & Episode Wrap-Up

SUBSCRIBE for the full story playthrough!
#MafiaDefinitiveEdition #Omerta #FrankColletti #VisitToRichPeople #TommyAngelo #Salvatore #LetsPlay`,
    chapters: [
      { timestamp: "00:00", title: "Chapter 9: A Trip to the Country" },
      { timestamp: "24:10", title: "Barn Shootout & Truck Escort" },
      { timestamp: "42:30", title: "Chapter 10: Omerta (Airport Tracking)" },
      { timestamp: "1:08:15", title: "Confronting Frank & Airport Escape" },
      { timestamp: "1:24:00", title: "Chapter 11: Visit to Rich People" },
      { timestamp: "1:38:50", title: "Prosecutor's Villa Safe Cracking" },
      { timestamp: "1:46:15", title: "Villa Escape & Wrap-Up" },
    ],
    tags: ["Mafia Definitive Edition", "A Trip to the Country", "Omerta", "Frank Colletti", "Visit to Rich People", "Salvatore", "Tommy Angelo", "Lost Heaven"],
    thumbnailConfig: {
      backgroundPreset: "farm",
      featuredCharacter: "Tommy Angelo",
      overlayText: "BETRAYAL & VILLA HEIST!",
      subText: "EPISODE 03 • CHAPTERS 9-11",
      themeColor: "#10b981",
    },
    bossStrategies: ["Prosecutor Villa Stealth: Stick to bushes near the gazebo. Wait for guard patrol to turn around before letting Salvatore crack the safe."],
    equipmentNotes: "Search the airport hangar desk for the rare Leo Galante cigarette card before boarding the plane tarmac!",
  },
  {
    id: 304,
    partNumber: 4,
    world: "Act II: War with Don Morello",
    title: "Mafia: Definitive Edition #04 - STEAMER SHIP ASSASSINATION & HARBOR DOCK BATTLE! (Chapters 12-15)",
    shortTitle: "Great Deal & You Lucky Bastard",
    altTitles: [
      "ASSASSINATING MORELLO'S BROTHER AT THE HARBOR! - Mafia: Definitive Edition Ep 4",
      "Steamer Boat Party Hit & Pepe's Restaurant Ambush! - Mafia Remake #4",
      "Mafia Definitive Edition Episode 4: Great Deal Parking Garage & Sergio Morello",
    ],
    estDurationMinutes: 115,
    startPoint: "Chapter 12: Great Deal (Parking Garage Whiskey Deal Shootout)",
    endPoint: "Chapter 15: You Lucky Bastard (Defeating Sergio Morello at Lost Heaven Harbor)",
    keyEvents: [
      "Great Deal: Whiskey bootlegging deal in multi-story parking garage ambushed by Morello's goons",
      "Bon Appétit: Bodyguarding Don Salieri during lunch at Pepe's Restaurant during Tommy gun ambush",
      "Happy Birthday!: Infiltrating paddle steamer S.S. Manganano dressed as a sailor",
      "Public assassination of corrupt politician Councillor Ghillotti during fireworks speech",
      "You Lucky Bastard: Surviving multiple cursed failed hit attempts on Sergio Morello",
      "High-octane chase to Lost Heaven Harbor docks & final warehouse confrontation with Sergio Morello",
    ],
    keyItemsAndEspers: [
      "Sailor Uniform Disguise @ S.S. Manganano",
      "Golden Revolver @ Councillor's Suite",
      "Cigarette Card #06 (Sergio Morello) @ Harbor Dock Warehouse",
      "Lupara Short Barrel Shotgun @ Pepe's Kitchen",
      "Super Charge V8 Coupe @ Salieri's Garage",
    ],
    partyMembers: ["Tommy Angelo", "Paulie Lombardo", "Sam Trapani", "Don Salieri", "Pepe"],
    status: "edited",
    description: `Episode 4 of our 100% Mafia: Definitive Edition Walkthrough!

In this 115-minute action chapter, war erupts between the Salieri and Morello families! First, a whiskey transaction at the multi-story parking garage turns into chaos in "Great Deal". Next, Don Salieri barely survives a mob hit while dining at Pepe's Restaurant in "Bon Appétit".

In "Happy Birthday!", Tommy sneaks aboard the glamorous S.S. Manganano riverboat disguised as a sailor to assassinate corrupt Councillor Ghillotti under cover of fireworks. Finally, after four bizarre failed hit attempts on Sergio Morello in "You Lucky Bastard", Tommy chases Sergio to Lost Heaven Harbor for a dramatic final standoff!

TIMESTAMPS:
00:00 - Chapter 12: Great Deal (Parking Garage Bootleg Shootout)
22:15 - Chapter 13: Bon Appétit (Pepe's Restaurant Ambush & Counter-Attack)
44:50 - Chapter 14: Happy Birthday! (S.S. Manganano Steamer Infiltration)
1:08:30 - Fireworks Speech Assassination & Escape
1:22:10 - Chapter 15: You Lucky Bastard (Chasing Sergio Morello)
1:40:15 - Lost Heaven Harbor Dock Battle & Defeating Sergio
1:52:00 - Episode Wrap-Up & Next Preview

SUBSCRIBE for the final episodes!
#MafiaDefinitiveEdition #HappyBirthday #YouLuckyBastard #SergioMorello #TommyAngelo #LostHeaven #LetsPlay`,
    chapters: [
      { timestamp: "00:00", title: "Chapter 12: Great Deal (Garage Shootout)" },
      { timestamp: "22:15", title: "Chapter 13: Bon Appétit (Pepe's Restaurant)" },
      { timestamp: "44:50", title: "Chapter 14: Happy Birthday! (Steamer Infiltration)" },
      { timestamp: "1:08:30", title: "Fireworks Assassination & Escape" },
      { timestamp: "1:22:10", title: "Chapter 15: You Lucky Bastard" },
      { timestamp: "1:40:15", title: "Harbor Docks Battle & Defeating Sergio" },
      { timestamp: "1:52:00", title: "Wrap-Up & Next Teaser" },
    ],
    tags: ["Mafia Definitive Edition", "Great Deal", "Bon Appetit", "Happy Birthday", "You Lucky Bastard", "Sergio Morello", "Tommy Angelo", "Salieri"],
    thumbnailConfig: {
      backgroundPreset: "harbor",
      featuredCharacter: "Tommy Angelo",
      overlayText: "STEAMER SHIP HIT & WAR!",
      subText: "EPISODE 04 • CHAPTERS 12-15",
      themeColor: "#8b5cf6",
    },
    bossStrategies: ["Sergio Morello Harbor Standoff: Use the metal cargo containers for cover against sniper fire. Flank Sergio's warehouse position from the left side."],
    equipmentNotes: "Pick up the Golden Revolver inside the Ghillotti suite on S.S. Manganano lower deck!",
  },
  {
    id: 305,
    partNumber: 5,
    world: "Act III: Downfall of Don Morello",
    title: "Mafia: Definitive Edition #05 - END OF DON MORELLO & PRISON TOWER SNIPER HIT! (Chapters 16-18)",
    shortTitle: "Crème de la Crème & Election Campaign",
    altTitles: [
      "DEFEATING DON MORELLO! - Mafia: Definitive Edition Ep 5",
      "Lost Heaven Prison Tower Sniper Hit & Diamond Cigar Heist! - Mafia Remake #5",
      "Mafia Definitive Edition Episode 5: Airport Plane Pursuit & Lost Heaven Harbor",
    ],
    estDurationMinutes: 105,
    startPoint: "Chapter 16: Crème de la Crème (Chasing Don Morello from Opera House)",
    endPoint: "Chapter 18: Just for Relaxation (Discovering Diamonds in Harbor Cigar Crates)",
    keyEvents: [
      "Crème de la Crème: Intercepting Don Morello at Lost Heaven Theater",
      "High-speed pursuit through Lost Heaven to airport / bridge confrontation",
      "Shooting down Don Morello's plane and taking down the rival Crime Boss",
      "Election Campaign: Infiltrating abandoned Lost Heaven State Prison",
      "Long-range sniper assassination of corrupt politician from prison watchtower",
      "Just for Relaxation: Stealing imported cigar crates from Harbor Warehouse with Paulie",
      "Shocking discovery: The cigar crates contain smuggled raw diamonds instead of tobacco!",
    ],
    keyItemsAndEspers: [
      "Mosin-Nagant Sniper Rifle @ Prison Tower",
      "Diamond Cigar Crate @ Harbor Warehouse B",
      "Cigarette Card #07 (Don Morello) @ Morello's Wreckage",
      "Prison Cell Key @ Prison Custodian Desk",
      "Lassiter V16 Phaeton @ Salieri's Garage",
    ],
    partyMembers: ["Tommy Angelo", "Paulie Lombardo", "Sam Trapani", "Don Salieri"],
    status: "edited",
    description: `Episode 5 of our 100% Mafia: Definitive Edition Walkthrough!

In this 105-minute climax, the Salieri family strikes the fatal blow against Don Morello! In "Crème de la Crème", Tommy, Paulie, and Sam chase Don Morello to Lost Heaven International Airport and bring down his plane in a thrilling climax.

In "Election Campaign", Tommy navigates the creepy abandoned Lost Heaven State Prison tower to snipe a corrupt mayoral candidate. Finally, in "Just for Relaxation", Tommy and Paulie heist imported cigar crates from Lost Heaven Harbor—only to open them at Paulie's apartment and discover millions of dollars in stolen raw diamonds that Salieri kept secret!

TIMESTAMPS:
00:00 - Chapter 16: Crème de la Crème (Chasing Don Morello)
20:15 - Airport Tarmac Pursuit & Shooting Down Morello's Plane
38:40 - Chapter 17: Election Campaign (Abandoned Prison Infiltration)
1:02:10 - Prison Watchtower Sniper Hit & Police Escape
1:16:30 - Chapter 18: Just for Relaxation (Harbor Cigar Warehouse Heist)
1:34:00 - Opening Cigar Crates & Discovering Diamonds
1:41:15 - Episode Wrap-Up & Season Finale Teaser

SUBSCRIBE for the Grand Finale!
#MafiaDefinitiveEdition #DonMorello #ElectionCampaign #JustForRelaxation #TommyAngelo #LostHeaven`,
    chapters: [
      { timestamp: "00:00", title: "Chapter 16: Crème de la Crème" },
      { timestamp: "20:15", title: "Airport Pursuit & Morello's Downfall" },
      { timestamp: "38:40", title: "Chapter 17: Election Campaign (Prison)" },
      { timestamp: "1:02:10", title: "Watchtower Sniper Hit & Police Escape" },
      { timestamp: "1:16:30", title: "Chapter 18: Just for Relaxation (Heist)" },
      { timestamp: "1:34:00", title: "Discovering Diamonds & Paulie's Plan" },
      { timestamp: "1:41:15", title: "Wrap-Up & Season Finale Teaser" },
    ],
    tags: ["Mafia Definitive Edition", "Creme de la Creme", "Don Morello", "Election Campaign", "Just for Relaxation", "Tommy Angelo", "Paulie Lombardo"],
    thumbnailConfig: {
      backgroundPreset: "prison",
      featuredCharacter: "Tommy Angelo",
      overlayText: "DOWNFALL OF MORELLO!",
      subText: "EPISODE 05 • CHAPTERS 16-18",
      themeColor: "#ef4444",
    },
    bossStrategies: ["Prison Watchtower Sniper Hit: Align crosshairs slightly above the politician's chest on the podium to account for distance bullet drop."],
    equipmentNotes: "Collect Mosin-Nagant sniper rifle from Vincenzo's crate before heading to the State Prison!",
  },
  {
    id: 306,
    partNumber: 6,
    world: "Act III: The Finale",
    title: "Mafia: Definitive Edition #06 - BANK HEIST & ART GALLERY SHOWDOWN! (Chapters 19-20 Finale)",
    shortTitle: "Moonlighting & The Death of Art",
    altTitles: [
      "THE DEATH OF ART! GRAND FINALE - Mafia: Definitive Edition Ep 6",
      "First National Bank Heist & Sam Trapani Final Battle! - Mafia Remake Finale",
      "Mafia Definitive Edition Final Episode: Paulie's Fate, Art Gallery & 1951 Epilogue",
    ],
    estDurationMinutes: 110,
    startPoint: "Chapter 19: Moonlighting (Planning First National Bank Heist with Paulie)",
    endPoint: "Epilogue: Detective Norman Cafe Interview & 1951 Empire Bay Finale",
    keyEvents: [
      "Moonlighting: Unsanctioned bank heist at First National Bank of Lost Heaven with Paulie",
      "Cracking the main bank vault & escaping with $160,000 cash",
      "The Death of Art: Tommy visits Paulie's apartment and finds Paulie murdered",
      "Sam Trapani's call arranging a meeting at the Lost Heaven Art Gallery",
      "Betrayal revealed: Sam ordered Paulie's hit on Don Salieri's commands",
      "Epic multi-stage shootout across Lost Heaven Art Gallery exhibits",
      "Final showdown with Sam Trapani on gallery balcony",
      "Epilogue: Tommy testifies to Detective Norman & 1951 Empire Bay conclusion",
    ],
    keyItemsAndEspers: [
      "First National Vault Cash Bag @ First National Bank",
      "Custom Gold M1911 Pistol @ Paulie's Apartment",
      "Cigarette Card #08 (Paulie Lombardo) @ Paulie's Table",
      "Cigarette Card #09 (Sam Trapani) @ Gallery Marble Steps",
      "Lost Heaven Art Gallery Key @ Gallery Director Desk",
      "Detective Norman's Case File @ Cafe Epilogue",
    ],
    partyMembers: ["Tommy Angelo", "Paulie Lombardo", "Sam Trapani", "Detective Norman"],
    status: "published",
    description: `GRAND FINALE of our 100% Mafia: Definitive Edition Walkthrough & Let's Play Series!

In this 110-minute finale, Tommy and Paulie execute an unsanctioned heist at First National Bank of Lost Heaven in "Moonlighting", netting $160,000 in cash. But the celebration turns to tragedy when Tommy arrives at Paulie's apartment the next morning to find Paulie murdered in cold blood.

Sam Trapani calls Tommy to meet at the Lost Heaven Art Gallery. In "The Death of Art", Sam reveals Don Salieri ordered Paulie's execution for the bank heist and Frank's betrayal. What follows is an unforgettable, breathtaking shootout through marble gallery halls culminating in a tragic duel between former brothers.

Includes full ending credits & the emotional 1951 Empire Bay epilogue!

TIMESTAMPS:
00:00 - Chapter 19: Moonlighting (First National Bank Heist Plan)
22:40 - Cracking the Bank Vault & Police Escape
45:10 - Chapter 20: The Death of Art (Finding Paulie at Apartment)
1:02:15 - Infiltrating Lost Heaven Art Gallery
1:24:30 - Final Battle with Sam Trapani & Gallery Shootout
1:42:00 - Detective Norman Cafe Interview & Testifying
1:51:30 - Epilogue (1951 Empire Bay) & Final Game Review

THANK YOU for watching the entire Mafia: Definitive Edition Playthrough!
#MafiaDefinitiveEdition #TheDeathOfArt #BankHeist #TommyAngelo #SamTrapani #PaulieLombardo #MafiaEnding #LetsPlay`,
    chapters: [
      { timestamp: "00:00", title: "Chapter 19: Moonlighting (Bank Heist Plan)" },
      { timestamp: "22:40", title: "Bank Vault Heist & Police Pursuit" },
      { timestamp: "45:10", title: "Chapter 20: The Death of Art (Paulie's Apartment)" },
      { timestamp: "1:02:15", title: "Infiltrating Lost Heaven Art Gallery" },
      { timestamp: "1:24:30", title: "Final Duel with Sam Trapani" },
      { timestamp: "1:42:00", title: "Detective Norman Cafe Interview" },
      { timestamp: "1:51:30", title: "Epilogue (1951 Empire Bay) & Review" },
    ],
    tags: ["Mafia Definitive Edition", "The Death of Art", "Moonlighting", "Bank Heist", "Sam Trapani", "Paulie Lombardo", "Tommy Angelo", "Mafia Ending"],
    thumbnailConfig: {
      backgroundPreset: "art_gallery",
      featuredCharacter: "Tommy Angelo",
      overlayText: "THE DEATH OF ART! FINALE",
      subText: "EPISODE 06 • CHAPTERS 19-20 FINALE",
      themeColor: "#dc2626",
    },
    bossStrategies: ["Sam Trapani Art Gallery Duel: Retain cover behind marble pillars. Shoot Sam when he steps out to reload his Thompson submachine gun."],
    equipmentNotes: "Grab the Gold M1911 Pistol on Paulie's side table before heading to the Art Gallery!",
  },
];

export const mafiaPlaythroughSeries: PlaythroughSeries = {
  id: "mafia-definitive-edition",
  gameTitle: "Mafia: Definitive Edition",
  gameTitleLogo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 75" fill="none"><text x="10" y="46" font-family="'Arial Black', sans-serif" font-size="38" font-weight="900" fill="%23dc2626" letter-spacing="3">MAFIA</text><text x="12" y="66" font-family="sans-serif" font-size="10" font-weight="800" fill="%23f8fafc" letter-spacing="5">DEFINITIVE EDITION</text></svg>`,
  useTitleLogo: true,
  gameSynopsis: "Set in 1930s Prohibition-era Lost Heaven, taxi driver Tommy Angelo is inadvertently thrust into the Italian mob after helping two Salieri family enforcers escape an ambush. As Tommy rises through the ranks under Don Salieri, he navigates a deadly gang war against rival mob boss Don Morello while grappling with morality, loyalty, and betrayal.",
  gameSynopsisSource: "AI Web Scraped via Google Search Grounding",
  subtitle: "100% Walkthrough & Let's Play Series",
  badgeText: "MAFIA: DEFINITIVE EDITION",
  accentColor: "#dc2626",
  genre: "Action / Crime Drama",
  playthroughType: "100% Walkthrough",
  createdAt: "2026-08-10",
  episodes: mafiaEpisodes,
  quests: mafiaQuests,
};
