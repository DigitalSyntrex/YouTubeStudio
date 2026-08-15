// 9 Default Creator Avatars mapped directly to user-uploaded assets in /public and /src/assets/images
export interface CreatorAvatarPreset {
  id: string;
  name: string;
  role: string;
  color: string;
  url: string;
}

export const DEFAULT_CREATOR_AVATARS: CreatorAvatarPreset[] = [
  {
    id: "blitz",
    name: "Blitz",
    role: "Cyber Visor",
    color: "#00f2fe",
    url: "/blitz.png",
  },
  {
    id: "byte",
    name: "Byte",
    role: "Tactical HUD",
    color: "#f97316",
    url: "/byte.png",
  },
  {
    id: "glitch",
    name: "Glitch",
    role: "Neon Hacker",
    color: "#ec4899",
    url: "/glitch.png",
  },
  {
    id: "kairo",
    name: "Kairo",
    role: "Crystal Warrior",
    color: "#a855f7",
    url: "/kairo.png",
  },
  {
    id: "nex",
    name: "Nex",
    role: "Cyber Operative",
    color: "#06b6d4",
    url: "/nex.png",
  },
  {
    id: "nyx",
    name: "Nyx",
    role: "Mercenary Ranger",
    color: "#10b981",
    url: "/nyx.png",
  },
  {
    id: "raze",
    name: "Raze",
    role: "Combat Brawler",
    color: "#ef4444",
    url: "/raze.png",
  },
  {
    id: "rogue",
    name: "Rogue",
    role: "Shadow Shinobi",
    color: "#64748b",
    url: "/rogue.png",
  },
  {
    id: "vex",
    name: "Vex",
    role: "Goth Assassin",
    color: "#c084fc",
    url: "/vex.png",
  },
];
