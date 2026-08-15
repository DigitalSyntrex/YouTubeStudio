// 30 Creator Avatars (9 Cyber Originals + 21 Themed Icons) mapped directly to assets in /src/assets/images and /public
import blitzImg from "../assets/images/blitz.png";
import byteImg from "../assets/images/byte.png";
import glitchImg from "../assets/images/glitch.png";
import kairoImg from "../assets/images/kairo.png";
import nexImg from "../assets/images/nex.png";
import nyxImg from "../assets/images/nyx.png";
import razeImg from "../assets/images/raze.png";
import rogueImg from "../assets/images/rogue.png";
import vexImg from "../assets/images/vex.png";

import birdImg from "../assets/images/bird.png";
import carImg from "../assets/images/car.png";
import cellImg from "../assets/images/cell.png";
import compassImg from "../assets/images/compass.png";
import crownImg from "../assets/images/crown.png";
import dragonImg from "../assets/images/dragon.png";
import eyeImg from "../assets/images/eye.png";
import foxImg from "../assets/images/fox.png";
import gloveImg from "../assets/images/glove.png";
import heartImg from "../assets/images/heart.png";
import joystickImg from "../assets/images/joystick.png";
import robotImg from "../assets/images/robot.png";
import serverImg from "../assets/images/server.png";
import shardImg from "../assets/images/shard.png";
import shieldImg from "../assets/images/shield.png";
import spaceImg from "../assets/images/space.png";
import spiderImg from "../assets/images/spider.png";
import swordImg from "../assets/images/sword.png";
import treeImg from "../assets/images/tree.png";
import trophyImg from "../assets/images/trophy.png";
import wolfImg from "../assets/images/wolf.png";

export interface CreatorAvatarPreset {
  id: string;
  name: string;
  role: string;
  color: string;
  url: string;
  category?: "Cyber & Heroes" | "Icons & Mythos" | "Gear & Tech";
}

export const DEFAULT_CREATOR_AVATARS: CreatorAvatarPreset[] = [
  // --- Original Cyber Operatives ---
  {
    id: "blitz",
    name: "Blitz",
    role: "Cyber Visor",
    color: "#00f2fe",
    url: blitzImg || "/blitz.png",
    category: "Cyber & Heroes",
  },
  {
    id: "byte",
    name: "Byte",
    role: "Tactical HUD",
    color: "#f97316",
    url: byteImg || "/byte.png",
    category: "Cyber & Heroes",
  },
  {
    id: "glitch",
    name: "Glitch",
    role: "Neon Hacker",
    color: "#ec4899",
    url: glitchImg || "/glitch.png",
    category: "Cyber & Heroes",
  },
  {
    id: "kairo",
    name: "Kairo",
    role: "Crystal Warrior",
    color: "#a855f7",
    url: kairoImg || "/kairo.png",
    category: "Cyber & Heroes",
  },
  {
    id: "nex",
    name: "Nex",
    role: "Cyber Operative",
    color: "#06b6d4",
    url: nexImg || "/nex.png",
    category: "Cyber & Heroes",
  },
  {
    id: "nyx",
    name: "Nyx",
    role: "Mercenary Ranger",
    color: "#10b981",
    url: nyxImg || "/nyx.png",
    category: "Cyber & Heroes",
  },
  {
    id: "raze",
    name: "Raze",
    role: "Combat Brawler",
    color: "#ef4444",
    url: razeImg || "/raze.png",
    category: "Cyber & Heroes",
  },
  {
    id: "rogue",
    name: "Rogue",
    role: "Shadow Shinobi",
    color: "#64748b",
    url: rogueImg || "/rogue.png",
    category: "Cyber & Heroes",
  },
  {
    id: "vex",
    name: "Vex",
    role: "Goth Assassin",
    color: "#c084fc",
    url: vexImg || "/vex.png",
    category: "Cyber & Heroes",
  },

  // --- 21 Newly Added Creator Avatars ---
  {
    id: "bird",
    name: "Bird",
    role: "Avian Scout",
    color: "#38bdf8",
    url: birdImg || "/bird.png",
    category: "Icons & Mythos",
  },
  {
    id: "car",
    name: "Car",
    role: "Speed Racer",
    color: "#ef4444",
    url: carImg || "/car.png",
    category: "Gear & Tech",
  },
  {
    id: "cell",
    name: "Cell",
    role: "Bio Tech",
    color: "#10b981",
    url: cellImg || "/cell.png",
    category: "Gear & Tech",
  },
  {
    id: "compass",
    name: "Compass",
    role: "Wayfinder",
    color: "#f59e0b",
    url: compassImg || "/compass.png",
    category: "Icons & Mythos",
  },
  {
    id: "crown",
    name: "Crown",
    role: "Monarch",
    color: "#eab308",
    url: crownImg || "/crown.png",
    category: "Icons & Mythos",
  },
  {
    id: "dragon",
    name: "Dragon",
    role: "Mythic Dragon",
    color: "#dc2626",
    url: dragonImg || "/dragon.png",
    category: "Icons & Mythos",
  },
  {
    id: "eye",
    name: "Eye",
    role: "All-Seeing Eye",
    color: "#8b5cf6",
    url: eyeImg || "/eye.png",
    category: "Icons & Mythos",
  },
  {
    id: "fox",
    name: "Fox",
    role: "Shadow Fox",
    color: "#f97316",
    url: foxImg || "/fox.png",
    category: "Icons & Mythos",
  },
  {
    id: "glove",
    name: "Glove",
    role: "Power Gauntlet",
    color: "#6366f1",
    url: gloveImg || "/glove.png",
    category: "Gear & Tech",
  },
  {
    id: "heart",
    name: "Heart",
    role: "Life Crystal",
    color: "#ec4899",
    url: heartImg || "/heart.png",
    category: "Icons & Mythos",
  },
  {
    id: "joystick",
    name: "Joystick",
    role: "Retro Gamer",
    color: "#06b6d4",
    url: joystickImg || "/joystick.png",
    category: "Gear & Tech",
  },
  {
    id: "robot",
    name: "Robot",
    role: "Cyber Mech",
    color: "#64748b",
    url: robotImg || "/robot.png",
    category: "Gear & Tech",
  },
  {
    id: "server",
    name: "Server",
    role: "Core Mainframe",
    color: "#0ea5e9",
    url: serverImg || "/server.png",
    category: "Gear & Tech",
  },
  {
    id: "shard",
    name: "Shard",
    role: "Prism Shard",
    color: "#a855f7",
    url: shardImg || "/shard.png",
    category: "Icons & Mythos",
  },
  {
    id: "shield",
    name: "Shield",
    role: "Aegis Guard",
    color: "#3b82f6",
    url: shieldImg || "/shield.png",
    category: "Gear & Tech",
  },
  {
    id: "space",
    name: "Space",
    role: "Cosmic Void",
    color: "#7c3aed",
    url: spaceImg || "/space.png",
    category: "Icons & Mythos",
  },
  {
    id: "spider",
    name: "Spider",
    role: "Night Crawler",
    color: "#e11d48",
    url: spiderImg || "/spider.png",
    category: "Icons & Mythos",
  },
  {
    id: "sword",
    name: "Sword",
    role: "Blade Master",
    color: "#22c55e",
    url: swordImg || "/sword.png",
    category: "Gear & Tech",
  },
  {
    id: "tree",
    name: "Tree",
    role: "World Tree",
    color: "#16a34a",
    url: treeImg || "/tree.png",
    category: "Icons & Mythos",
  },
  {
    id: "trophy",
    name: "Trophy",
    role: "Golden Champion",
    color: "#facc15",
    url: trophyImg || "/trophy.png",
    category: "Icons & Mythos",
  },
  {
    id: "wolf",
    name: "Wolf",
    role: "Alpha Wolf",
    color: "#94a3b8",
    url: wolfImg || "/wolf.png",
    category: "Icons & Mythos",
  },
];
