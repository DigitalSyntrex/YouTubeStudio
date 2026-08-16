// 45 Resized 128x128 Creator Avatars mapped directly to assets in /src/assets/avatars_128
import abilityImg from "../assets/avatars_128/ability.png";
import actionImg from "../assets/avatars_128/action.png";
import birdImg from "../assets/avatars_128/bird.png";
import brawlerImg from "../assets/avatars_128/brawler.png";
import carImg from "../assets/avatars_128/car.png";
import cellImg from "../assets/avatars_128/cell.png";
import compassImg from "../assets/avatars_128/compass.png";
import crownImg from "../assets/avatars_128/crown.png";
import cyberImg from "../assets/avatars_128/cyber.png";
import deckbuilderImg from "../assets/avatars_128/deckbuilder.png";
import dragonImg from "../assets/avatars_128/dragon.png";
import dungcrawlImg from "../assets/avatars_128/dungcrawl.png";
import economyImg from "../assets/avatars_128/economy.png";
import enhancementImg from "../assets/avatars_128/enhancement.png";
import eyeImg from "../assets/avatars_128/eye.png";
import fantasyImg from "../assets/avatars_128/fantasy.png";
import fightingImg from "../assets/avatars_128/fighting.png";
import foxImg from "../assets/avatars_128/fox.png";
import fpsImg from "../assets/avatars_128/fps.png";
import gloveImg from "../assets/avatars_128/glove.png";
import heartImg from "../assets/avatars_128/heart.png";
import horrorImg from "../assets/avatars_128/horror.png";
import joystickImg from "../assets/avatars_128/joystick.png";
import levelImg from "../assets/avatars_128/level.png";
import magicImg from "../assets/avatars_128/magic.png";
import mechaImg from "../assets/avatars_128/mecha.png";
import openworldImg from "../assets/avatars_128/openworld.png";
import platformerImg from "../assets/avatars_128/platformer.png";
import puzzleImg from "../assets/avatars_128/puzzle.png";
import racingImg from "../assets/avatars_128/racing.png";
import retroImg from "../assets/avatars_128/retro.png";
import robotImg from "../assets/avatars_128/robot.png";
import rpgImg from "../assets/avatars_128/rpg.png";
import scispaceImg from "../assets/avatars_128/scispace.png";
import serverImg from "../assets/avatars_128/server.png";
import shardImg from "../assets/avatars_128/shard.png";
import shieldImg from "../assets/avatars_128/shield.png";
import soulslikeImg from "../assets/avatars_128/soulslike.png";
import spaceImg from "../assets/avatars_128/space.png";
import spiderImg from "../assets/avatars_128/spider.png";
import survivalImg from "../assets/avatars_128/survival.png";
import swordImg from "../assets/avatars_128/sword.png";
import treeImg from "../assets/avatars_128/tree.png";
import trophyImg from "../assets/avatars_128/trophy.png";
import wolfImg from "../assets/avatars_128/wolf.png";

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
    url: cyberImg || "/avatars_128/cyber.png",
    category: "Cyber & Heroes",
  },
  {
    id: "action",
    name: "Action",
    role: "Action Hero",
    color: "#f97316",
    url: actionImg || "/avatars_128/action.png",
    category: "Cyber & Heroes",
  },
  {
    id: "brawler",
    name: "Brawler",
    role: "Combat Brawler",
    color: "#ef4444",
    url: brawlerImg || "/avatars_128/brawler.png",
    category: "Cyber & Heroes",
  },
  {
    id: "fighting",
    name: "Fighting",
    role: "Fighter Pro",
    color: "#f59e0b",
    url: fightingImg || "/avatars_128/fighting.png",
    category: "Cyber & Heroes",
  },
  {
    id: "scispace",
    name: "SciSpace",
    role: "Cosmic Vanguard",
    color: "#06b6d4",
    url: scispaceImg || "/avatars_128/scispace.png",
    category: "Cyber & Heroes",
  },

  // --- Gaming & Genres ---
  {
    id: "rpg",
    name: "RPG",
    role: "Quest Legend",
    color: "#8b5cf6",
    url: rpgImg || "/avatars_128/rpg.png",
    category: "Gaming & Genres",
  },
  {
    id: "soulslike",
    name: "Soulslike",
    role: "Ember Knight",
    color: "#e11d48",
    url: soulslikeImg || "/avatars_128/soulslike.png",
    category: "Gaming & Genres",
  },
  {
    id: "fps",
    name: "FPS",
    role: "Tactical Operative",
    color: "#10b981",
    url: fpsImg || "/avatars_128/fps.png",
    category: "Gaming & Genres",
  },
  {
    id: "dungcrawl",
    name: "Dungeon",
    role: "Dungeon Delver",
    color: "#d97706",
    url: dungcrawlImg || "/avatars_128/dungcrawl.png",
    category: "Gaming & Genres",
  },
  {
    id: "deckbuilder",
    name: "Deckbuilder",
    role: "Card Strategist",
    color: "#6366f1",
    url: deckbuilderImg || "/avatars_128/deckbuilder.png",
    category: "Gaming & Genres",
  },
  {
    id: "openworld",
    name: "OpenWorld",
    role: "Realm Explorer",
    color: "#3b82f6",
    url: openworldImg || "/avatars_128/openworld.png",
    category: "Gaming & Genres",
  },
  {
    id: "platformer",
    name: "Platformer",
    role: "Jump Master",
    color: "#ec4899",
    url: platformerImg || "/avatars_128/platformer.png",
    category: "Gaming & Genres",
  },
  {
    id: "puzzle",
    name: "Puzzle",
    role: "Enigma Solver",
    color: "#a855f7",
    url: puzzleImg || "/avatars_128/puzzle.png",
    category: "Gaming & Genres",
  },
  {
    id: "racing",
    name: "Racing",
    role: "Apex Driver",
    color: "#ef4444",
    url: racingImg || "/avatars_128/racing.png",
    category: "Gaming & Genres",
  },
  {
    id: "horror",
    name: "Horror",
    role: "Survival Dread",
    color: "#991b1b",
    url: horrorImg || "/avatars_128/horror.png",
    category: "Gaming & Genres",
  },
  {
    id: "survival",
    name: "Survival",
    role: "Wilderness Survivor",
    color: "#059669",
    url: survivalImg || "/avatars_128/survival.png",
    category: "Gaming & Genres",
  },
  {
    id: "level",
    name: "Level Up",
    role: "Stage Master",
    color: "#eab308",
    url: levelImg || "/avatars_128/level.png",
    category: "Gaming & Genres",
  },

  // --- Gear & Tech ---
  {
    id: "joystick",
    name: "Joystick",
    role: "Retro Gamer",
    color: "#06b6d4",
    url: joystickImg || "/avatars_128/joystick.png",
    category: "Gear & Tech",
  },
  {
    id: "robot",
    name: "Robot",
    role: "Cyber Mech",
    color: "#64748b",
    url: robotImg || "/avatars_128/robot.png",
    category: "Gear & Tech",
  },
  {
    id: "mecha",
    name: "Mecha",
    role: "Titan Frame",
    color: "#3b82f6",
    url: mechaImg || "/avatars_128/mecha.png",
    category: "Gear & Tech",
  },
  {
    id: "retro",
    name: "Retro",
    role: "8-Bit Classic",
    color: "#a855f7",
    url: retroImg || "/avatars_128/retro.png",
    category: "Gear & Tech",
  },
  {
    id: "sword",
    name: "Sword",
    role: "Blade Master",
    color: "#22c55e",
    url: swordImg || "/avatars_128/sword.png",
    category: "Gear & Tech",
  },
  {
    id: "shield",
    name: "Shield",
    role: "Aegis Guard",
    color: "#3b82f6",
    url: shieldImg || "/avatars_128/shield.png",
    category: "Gear & Tech",
  },
  {
    id: "glove",
    name: "Glove",
    role: "Power Gauntlet",
    color: "#6366f1",
    url: gloveImg || "/avatars_128/glove.png",
    category: "Gear & Tech",
  },
  {
    id: "car",
    name: "Car",
    role: "Speed Racer",
    color: "#ef4444",
    url: carImg || "/avatars_128/car.png",
    category: "Gear & Tech",
  },
  {
    id: "cell",
    name: "Cell",
    role: "Bio Tech",
    color: "#10b981",
    url: cellImg || "/avatars_128/cell.png",
    category: "Gear & Tech",
  },
  {
    id: "server",
    name: "Server",
    role: "Core Mainframe",
    color: "#0ea5e9",
    url: serverImg || "/avatars_128/server.png",
    category: "Gear & Tech",
  },
  {
    id: "enhancement",
    name: "Enhancement",
    role: "Overclock Node",
    color: "#f59e0b",
    url: enhancementImg || "/avatars_128/enhancement.png",
    category: "Gear & Tech",
  },
  {
    id: "ability",
    name: "Ability",
    role: "Skill Mastery",
    color: "#14b8a6",
    url: abilityImg || "/avatars_128/ability.png",
    category: "Gear & Tech",
  },
  {
    id: "economy",
    name: "Economy",
    role: "Tycoon Strategist",
    color: "#84cc16",
    url: economyImg || "/avatars_128/economy.png",
    category: "Gear & Tech",
  },

  // --- Icons & Mythos ---
  {
    id: "dragon",
    name: "Dragon",
    role: "Mythic Dragon",
    color: "#dc2626",
    url: dragonImg || "/avatars_128/dragon.png",
    category: "Icons & Mythos",
  },
  {
    id: "wolf",
    name: "Wolf",
    role: "Alpha Wolf",
    color: "#94a3b8",
    url: wolfImg || "/avatars_128/wolf.png",
    category: "Icons & Mythos",
  },
  {
    id: "fox",
    name: "Fox",
    role: "Shadow Fox",
    color: "#f97316",
    url: foxImg || "/avatars_128/fox.png",
    category: "Icons & Mythos",
  },
  {
    id: "bird",
    name: "Bird",
    role: "Avian Scout",
    color: "#38bdf8",
    url: birdImg || "/avatars_128/bird.png",
    category: "Icons & Mythos",
  },
  {
    id: "spider",
    name: "Spider",
    role: "Night Crawler",
    color: "#e11d48",
    url: spiderImg || "/avatars_128/spider.png",
    category: "Icons & Mythos",
  },
  {
    id: "magic",
    name: "Magic",
    role: "Arcane Wizard",
    color: "#8b5cf6",
    url: magicImg || "/avatars_128/magic.png",
    category: "Icons & Mythos",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    role: "High Fantasy",
    color: "#c084fc",
    url: fantasyImg || "/avatars_128/fantasy.png",
    category: "Icons & Mythos",
  },
  {
    id: "crown",
    name: "Crown",
    role: "Royal Monarch",
    color: "#eab308",
    url: crownImg || "/avatars_128/crown.png",
    category: "Icons & Mythos",
  },
  {
    id: "trophy",
    name: "Trophy",
    role: "Golden Champion",
    color: "#facc15",
    url: trophyImg || "/avatars_128/trophy.png",
    category: "Icons & Mythos",
  },
  {
    id: "eye",
    name: "Eye",
    role: "All-Seeing Eye",
    color: "#8b5cf6",
    url: eyeImg || "/avatars_128/eye.png",
    category: "Icons & Mythos",
  },
  {
    id: "heart",
    name: "Heart",
    role: "Life Crystal",
    color: "#ec4899",
    url: heartImg || "/avatars_128/heart.png",
    category: "Icons & Mythos",
  },
  {
    id: "shard",
    name: "Shard",
    role: "Prism Shard",
    color: "#a855f7",
    url: shardImg || "/avatars_128/shard.png",
    category: "Icons & Mythos",
  },
  {
    id: "space",
    name: "Space",
    role: "Cosmic Void",
    color: "#7c3aed",
    url: spaceImg || "/avatars_128/space.png",
    category: "Icons & Mythos",
  },
  {
    id: "compass",
    name: "Compass",
    role: "Wayfinder",
    color: "#f59e0b",
    url: compassImg || "/avatars_128/compass.png",
    category: "Icons & Mythos",
  },
  {
    id: "tree",
    name: "Tree",
    role: "World Tree",
    color: "#16a34a",
    url: treeImg || "/avatars_128/tree.png",
    category: "Icons & Mythos",
  },
];
