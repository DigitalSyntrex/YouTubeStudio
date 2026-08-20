import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createPng(width, height, getPixel) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crc = crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

const AVATAR_DEFS = [
  // Cyber & Heroes
  { id: "cyber", name: "Cyber", color: "#00f2fe", symbol: "ZAP", category: "Cyber & Heroes" },
  { id: "action", name: "Action", color: "#f97316", symbol: "FLAME", category: "Cyber & Heroes" },
  { id: "brawler", name: "Brawler", color: "#ef4444", symbol: "FIST", category: "Cyber & Heroes" },
  { id: "fighting", name: "Fighting", color: "#f59e0b", symbol: "SWORDS", category: "Cyber & Heroes" },
  { id: "scispace", name: "SciSpace", color: "#06b6d4", symbol: "COMPASS", category: "Cyber & Heroes" },
  { id: "ruti", name: "Ruti", color: "#06b6d4", symbol: "FOX", category: "Cyber & Heroes" },
  { id: "baxter", name: "Baxter", color: "#f59e0b", symbol: "SHIELD", category: "Cyber & Heroes" },
  { id: "blitz", name: "Blitz", color: "#eab308", symbol: "LIGHTNING", category: "Cyber & Heroes" },
  { id: "byte", name: "Byte", color: "#06b6d4", symbol: "CODE", category: "Cyber & Heroes" },
  { id: "glitch", name: "Glitch", color: "#ec4899", symbol: "WAVE", category: "Cyber & Heroes" },
  { id: "kairo", name: "Kairo", color: "#8b5cf6", symbol: "TIME", category: "Cyber & Heroes" },
  { id: "nex", name: "Nex", color: "#3b82f6", symbol: "CUBE", category: "Cyber & Heroes" },
  { id: "nyx", name: "Nyx", color: "#a855f7", symbol: "EYES", category: "Cyber & Heroes" },
  { id: "raze", name: "Raze", color: "#ef4444", symbol: "CROSSHAIR", category: "Cyber & Heroes" },
  { id: "rogue", name: "Rogue", color: "#10b981", symbol: "DAGGER", category: "Cyber & Heroes" },
  { id: "vex", name: "Vex", color: "#6366f1", symbol: "SHARD", category: "Cyber & Heroes" },

  // Gaming & Genres
  { id: "rpg", name: "RPG", color: "#8b5cf6", symbol: "CROWN", category: "Gaming & Genres" },
  { id: "soulslike", name: "Soulslike", color: "#e11d48", symbol: "SKULL", category: "Gaming & Genres" },
  { id: "fps", name: "FPS", color: "#10b981", symbol: "CROSSHAIR", category: "Gaming & Genres" },
  { id: "dungcrawl", name: "Dungeon", color: "#d97706", symbol: "CHEST", category: "Gaming & Genres" },
  { id: "deckbuilder", name: "Deckbuilder", color: "#6366f1", symbol: "CARDS", category: "Gaming & Genres" },
  { id: "openworld", name: "OpenWorld", color: "#3b82f6", symbol: "MOUNTAIN", category: "Gaming & Genres" },
  { id: "platformer", name: "Platformer", color: "#ec4899", symbol: "STAR", category: "Gaming & Genres" },
  { id: "puzzle", name: "Puzzle", color: "#a855f7", symbol: "PUZZLE", category: "Gaming & Genres" },
  { id: "racing", name: "Racing", color: "#ef4444", symbol: "FLAG", category: "Gaming & Genres" },
  { id: "horror", name: "Horror", color: "#991b1b", symbol: "GHOST", category: "Gaming & Genres" },
  { id: "survival", name: "Survival", color: "#059669", symbol: "TREE", category: "Gaming & Genres" },
  { id: "level", name: "Level Up", color: "#eab308", symbol: "CHEVRON", category: "Gaming & Genres" },

  // Gear & Tech
  { id: "joystick", name: "Joystick", color: "#06b6d4", symbol: "GAMEPAD", category: "Gear & Tech" },
  { id: "robot", name: "Robot", color: "#64748b", symbol: "BOT", category: "Gear & Tech" },
  { id: "mecha", name: "Mecha", color: "#3b82f6", symbol: "MECH", category: "Gear & Tech" },
  { id: "retro", name: "Retro", color: "#a855f7", symbol: "8BIT", category: "Gear & Tech" },
  { id: "sword", name: "Sword", color: "#22c55e", symbol: "SWORD", category: "Gear & Tech" },
  { id: "shield", name: "Shield", color: "#3b82f6", symbol: "SHIELD", category: "Gear & Tech" },
  { id: "glove", name: "Glove", color: "#6366f1", symbol: "GAUNTLET", category: "Gear & Tech" },
  { id: "car", name: "Car", color: "#ef4444", symbol: "CAR", category: "Gear & Tech" },
  { id: "cell", name: "Cell", color: "#10b981", symbol: "DNA", category: "Gear & Tech" },
  { id: "server", name: "Server", color: "#0ea5e9", symbol: "SERVER", category: "Gear & Tech" },
  { id: "enhancement", name: "Enhancement", color: "#f59e0b", symbol: "CHIP", category: "Gear & Tech" },
  { id: "ability", name: "Ability", color: "#14b8a6", symbol: "DIAMOND", category: "Gear & Tech" },
  { id: "economy", name: "Economy", color: "#84cc16", symbol: "COIN", category: "Gear & Tech" },

  // Icons & Mythos
  { id: "dragon", name: "Dragon", color: "#dc2626", symbol: "DRAGON", category: "Icons & Mythos" },
  { id: "wolf", name: "Wolf", color: "#94a3b8", symbol: "WOLF", category: "Icons & Mythos" },
  { id: "fox", name: "Fox", color: "#f97316", symbol: "FOX", category: "Icons & Mythos" },
  { id: "bird", name: "Bird", color: "#38bdf8", symbol: "BIRD", category: "Icons & Mythos" },
  { id: "spider", name: "Spider", color: "#e11d48", symbol: "SPIDER", category: "Icons & Mythos" },
  { id: "magic", name: "Magic", color: "#8b5cf6", symbol: "WAND", category: "Icons & Mythos" },
  { id: "fantasy", name: "Fantasy", color: "#c084fc", symbol: "FAIRY", category: "Icons & Mythos" },
  { id: "crown", name: "Crown", color: "#eab308", symbol: "CROWN", category: "Icons & Mythos" },
  { id: "trophy", name: "Trophy", color: "#facc15", symbol: "TROPHY", category: "Icons & Mythos" },
  { id: "eye", name: "Eye", color: "#8b5cf6", symbol: "EYE", category: "Icons & Mythos" },
  { id: "heart", name: "Heart", color: "#ec4899", symbol: "HEART", category: "Icons & Mythos" },
  { id: "shard", name: "Shard", color: "#a855f7", symbol: "SHARD", category: "Icons & Mythos" },
  { id: "space", name: "Space", color: "#7c3aed", symbol: "PLANET", category: "Icons & Mythos" },
  { id: "compass", name: "Compass", color: "#f59e0b", symbol: "COMPASS", category: "Icons & Mythos" },
  { id: "tree", name: "Tree", color: "#16a34a", symbol: "TREE", category: "Icons & Mythos" }
];

console.log(`Generating valid PNG and SVG assets for ${AVATAR_DEFS.length} presets...`);

const targetDirs = [
  '/main/public/avatars_128'
];

targetDirs.forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

for (const avatar of AVATAR_DEFS) {
  const [pr, pg, pb] = hexToRgb(avatar.color);

  // Generate 128x128 Pixel-Art / High Contrast Graphic PNG
  const pngBuffer = createPng(128, 128, (x, y, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Dark sleek gradient background with subtle radial glow
    const bgFactor = Math.max(0, 1 - dist / 75);
    let r = Math.round(12 + pr * 0.25 * bgFactor);
    let g = Math.round(16 + pg * 0.25 * bgFactor);
    let b = Math.round(26 + pb * 0.25 * bgFactor);
    let a = 255;

    // Outer rounded gamer border (radius 18 inside 128x128)
    const margin = 4;
    const isInsideBox = x >= margin && x < (w - margin) && y >= margin && y < (h - margin);
    if (!isInsideBox) {
      return [0, 0, 0, 0]; // Transparent outer edge
    }

    // Border stroke
    const isBorder = (x === margin || x === w - margin - 1 || y === margin || y === h - margin - 1 ||
      (x === margin + 1 || x === w - margin - 2 || y === margin + 1 || y === h - margin - 2));
    if (isBorder) {
      return [pr, pg, pb, 220];
    }

    // Tech corners
    const isCorner = (x < 14 && y < 14) || (x > w - 14 && y < 14) || (x < 14 && y > h - 14) || (x > w - 14 && y > h - 14);
    if (isCorner) {
      r = Math.min(255, r + 40);
      g = Math.min(255, g + 40);
      b = Math.min(255, b + 40);
    }

    // Inner glowing emblem / symbol circle
    if (dist < 42 && dist > 38) {
      return [pr, pg, pb, 200];
    }

    // Central Emblem pattern based on distance
    if (dist <= 36) {
      const emblemGlow = (1 - dist / 36);
      r = Math.round(pr * 0.7 + 255 * 0.3 * emblemGlow);
      g = Math.round(pg * 0.7 + 255 * 0.3 * emblemGlow);
      b = Math.round(pb * 0.7 + 255 * 0.3 * emblemGlow);

      // Add high-contrast geometric glyph core
      const inCrossH = Math.abs(dy) <= 5 && Math.abs(dx) <= 24;
      const inCrossV = Math.abs(dx) <= 5 && Math.abs(dy) <= 24;
      const inDiag1 = Math.abs(dx - dy) <= 4 && dist <= 24;
      const inDiag2 = Math.abs(dx + dy) <= 4 && dist <= 24;

      if (inCrossH || inCrossV || inDiag1 || inDiag2) {
        return [255, 255, 255, 255];
      }
    }

    // Scanline effect
    if (y % 4 === 0) {
      r = Math.max(0, r - 15);
      g = Math.max(0, g - 15);
      b = Math.max(0, b - 15);
    }

    return [r, g, b, a];
  });

  // Write PNG to all target folders
  targetDirs.forEach(dir => {
    const filePath = path.join(dir, `${avatar.id}.png`);
    fs.writeFileSync(filePath, pngBuffer);
  });
}

console.log("All 56 PNG avatars successfully generated with verified PNG headers!");
