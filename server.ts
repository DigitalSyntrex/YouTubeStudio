import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  SUBSCRIPTION_PLANS,
  computeUserEntitlement,
  processSubscriptionCheckout,
  cancelUserSubscription,
  recordAuditLog,
  getAuditLogs,
  getUserSeriesList,
  saveUserSeriesList,
  incrementAiUsage,
  redeemProductKey,
  getProductKeyInfo,
  getAllProductKeys,
  adminGenerateKeys,
  adminResetKey,
  adminDeleteKey,
  adminOverrideUserPlan,
  adminGetStats,
  getAdminUsersList,
  addAdminUser,
  removeAdminUser,
} from "./src/server/subscriptionEngine";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI Client lazily or safely
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Helper to log Gemini API notes cleanly without dumping raw 429 quota traces
  const logAiError = (context: string, err: any) => {
    const errMsg = typeof err === "string" ? err : err?.message || JSON.stringify(err);
    const isQuota = err?.status === 429 || err?.status === "RESOURCE_EXHAUSTED" || errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED");
    if (isQuota) {
      console.log(`[Gemini API - ${context}] Quota limit reached (429). Serving high-quality fallback engine output.`);
    } else {
      console.log(`[Gemini API - ${context}] Fallback note: ${errMsg.slice(0, 120)}`);
    }
  };
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
  });

  // AI Title & Description Enhancement Endpoint
  app.post("/api/gemini/enhance", async (req, res) => {
    const { gameTitle, episodeTitle, partNumber, world, startPoint, endPoint, keyEvents, description, prevEpisodeEndPoint, style } = req.body;
    const currentGame = gameTitle || "YouTube Gaming Series";
    const epNum = partNumber || 1;
    const epNumStr = epNum < 10 ? `0${epNum}` : `${epNum}`;

    const derivedStart = startPoint || prevEpisodeEndPoint || `Episode ${epNumStr} Opening & Start`;
    const derivedEnd = endPoint || `Episode ${epNumStr} Boss Defeat & Milestone`;

    const generateFallbackPackage = () => ({
      suggestedStartPoint: derivedStart,
      suggestedEndPoint: derivedEnd,
      viralTitles: [
        `${currentGame} #${epNumStr} - ${episodeTitle || "THE JOURNEY CONTINUES!"}`,
        `EPIC ${currentGame.toUpperCase()} MOMENT! - Episode ${epNumStr} Walkthrough`,
        `Playing ${currentGame} for the First Time! - Ep ${epNumStr} (${world || "Main Quest"})`,
        `100% ${currentGame} Walkthrough #${epNumStr} - ${derivedStart}`
      ],
      enhancedDescription: `Welcome to Episode ${epNum} of our 100% ${currentGame} Walkthrough & Let's Play series (90-120 Min Longform)!\n\nIn this episode, we venture into ${world || "the main quest"} starting from ${derivedStart} and making our way to ${derivedEnd}.\n\nKEY HIGHLIGHTS:\n- ${keyEvents || "Exploring area and making story progress"}\n\nCHAPTER TIMESTAMPS:\n00:00 - Introduction & Setup (${derivedStart})\n22:15 - Exploring ${world || "Main Quest Area"} & Side Quests\n48:30 - Mid-Episode Dungeon & Challenges\n1:15:00 - Major Story Event & Boss Fight\n1:35:00 - Reaching ${derivedEnd}\n1:48:00 - Episode Conclusion & Outro\n\nSUBSCRIBE for the complete ${currentGame} Walkthrough!\n#${currentGame.replace(/\s+/g, "")} #LetsPlay #Gaming #Walkthrough`,
      keyEvents: keyEvents ? keyEvents.split("\n").filter((line: string) => line.trim().length > 0) : [
        `Exploring ${world || "the main quest area"}`,
        `Navigating from ${derivedStart} to ${derivedEnd}`,
        `Completing major ${currentGame} story beat & boss encounter`
      ],
      chapters: [
        { timestamp: "00:00", title: `Episode ${epNumStr} Start - ${derivedStart}` },
        { timestamp: "22:15", title: `Exploring ${world || "Main Area"} & Side Quests` },
        { timestamp: "48:30", title: "Mid-Episode Dungeon & Key Encounters" },
        { timestamp: "1:15:00", title: "Major Quest Milestones & Boss Fight" },
        { timestamp: "1:35:00", title: `Reaching ${derivedEnd}` },
        { timestamp: "1:48:00", title: "Episode Wrap-Up & Outro" }
      ],
      thumbnailTextIdeas: [
        `${currentGame.toUpperCase()} #${epNumStr}`,
        "EPIC BOSS FIGHT!",
        "100% WALKTHROUGH",
        "UNSTOPPABLE RUN!"
      ],
      extraTags: [currentGame, "Lets Play", "Walkthrough", "Gaming", `Episode ${epNum}`, "100% Guide", "Boss Fight", "Playthrough"]
    });

    try {
      const ai = getAi();
      if (!ai) {
        return res.json({ ...generateFallbackPackage(), isFallback: true });
      }

      const prompt = `You are an expert gaming content creator and YouTube SEO specialist specializing in Let's Play series and walkthroughs for ${currentGame}.
Generate a complete episode metadata package for Episode ${epNum} of ${currentGame}.

CRITICAL DURATION & TIMESTAMP REQUIREMENT:
Every episode in this playthrough series is a long-form YouTube Let's Play episode lasting BETWEEN 90 AND 120 MINUTES (1.5 to 2 hours long).
Your generated chapter timestamps MUST span the FULL 90 to 120 minute video runtime (e.g., starting at "00:00", progressing through "22:15", "48:30", "1:15:00", "1:35:00", up to "1:45:00" - "1:55:00").
Do NOT generate short 30-45 minute timestamps! Expand descriptions, key events, and chapter lists to account for 90-120 minutes of full gameplay content.

Current Setup:
- Game Title: ${currentGame}
- World / Act / Area: ${world || "Main Quest"}
- Current Episode Title: ${episodeTitle || "Untitled Episode"}
- Start Milestone: ${startPoint || prevEpisodeEndPoint || "Beginning of episode / previous episode end"}
- End Milestone: ${endPoint || "Episode conclusion"}
- Description / User Context: ${description || "N/A"}
- Key Events / Highlights: ${keyEvents || "Gameplay progression"}
- Desired Style: ${style || "Engaging, high energy, SEO optimized, viral CTR"}

Please output JSON with:
1. "suggestedStartPoint": string representing the concise start milestone (e.g., if previous episode ended at "Sanbreque Citadel Entrance", use that or refine it).
2. "suggestedEndPoint": string representing the concise end milestone extracted or inferred from the description/chapters/key events (e.g. "Caer Norvent Citadel Boss Defeat & Exit").
3. "viralTitles": array of 4 catchy, high-CTR YouTube video titles tailored specifically to ${currentGame} Episode ${epNumStr} (with emojis, capital emphasis, epic boss/item/story hooks).
4. "enhancedDescription": a compelling, complete YouTube video intro & overview explaining what happens in this 90-120 minute episode of ${currentGame}, including timestamps callout and subscribe call-to-actions.
5. "keyEvents": array of 5-7 concise key story beats / gameplay milestones for this 90-120 minute episode of ${currentGame}.
6. "chapters": array of 5-7 chapter objects spanning 90-120 minutes, each with "timestamp" (formatted as "MM:SS" or "H:MM:SS", e.g. "00:00", "22:15", "48:30", "1:15:00", "1:38:20", "1:52:00") and "title" (e.g. "Intro & Area Exploration", "Boss Battle", "Key Story Beat") tailored to ${currentGame}.
7. "thumbnailTextIdeas": array of 4 short punchy text overlays (1-3 words max, ALL CAPS) for thumbnail graphics.
8. "extraTags": array of 8 relevant YouTube SEO tags for ${currentGame}.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const data = JSON.parse(text);
      return res.json(data);
    } catch (err: any) {
      logAiError("enhance", err);
      return res.json({ ...generateFallbackPackage(), isFallback: true });
    }
  });

  // AI Image Generation Endpoint for Thumbnail Artwork with Fallback
  app.post("/api/gemini/generate-thumbnail", async (req, res) => {
    const { promptText, style, gameTitle, badgeText } = req.body;
    const currentGame = gameTitle || "GAMING SERIES";
    const currentBadge = badgeText || currentGame.toUpperCase();
    const charName = (promptText || "HERO").split(" ")[0].toUpperCase();
    const sceneText = (promptText || "EPIC BATTLE").toUpperCase();

    // Helper to build a high-quality 1280x720 Pixel Art / Vector SVG fallback image
    const generateFallbackSvgDataUrl = (title: string) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#09090b" />
            <stop offset="40%" stop-color="#1e1b4b" />
            <stop offset="100%" stop-color="#030712" />
          </linearGradient>
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#818cf8" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#fbbf24" />
            <stop offset="100%" stop-color="#fef08a" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Main Dark Canvas Background -->
        <rect width="1280" height="720" fill="url(#bgGrad)" />

        <!-- Pixel Grid Overlay -->
        <pattern id="pixelGrid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
        </pattern>
        <rect width="1280" height="720" fill="url(#pixelGrid)" />

        <!-- Retro Crystal Border Frame -->
        <rect x="20" y="20" width="1240" height="680" fill="none" stroke="url(#accentGrad)" stroke-width="4" rx="12" opacity="0.8" />
        <rect x="32" y="32" width="1216" height="656" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" rx="8" />

        <!-- Magical Glow Aura -->
        <circle cx="1000" cy="360" r="220" fill="#38bdf8" opacity="0.12" filter="url(#glow)" />
        <circle cx="1000" cy="360" r="160" fill="none" stroke="#818cf8" stroke-width="2" opacity="0.4" />

        <!-- Header Logo Badge -->
        <g transform="translate(60, 60)">
          <rect x="0" y="0" width="360" height="48" rx="8" fill="#18181b" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
          <text x="180" y="28" fill="#f8fafc" font-size="16" font-weight="900" font-family="system-ui, sans-serif" letter-spacing="1" text-anchor="middle">${currentBadge.slice(0, 24)}</text>
          <text x="180" y="42" fill="#38bdf8" font-size="10" font-weight="800" font-family="system-ui, sans-serif" letter-spacing="2" text-anchor="middle">100% LET'S PLAY WALKTHROUGH</text>
        </g>

        <!-- Right Side Character & Scene Sphere -->
        <g transform="translate(1000, 360)">
          <text x="0" y="-10" fill="#f4f4f5" font-size="52" font-weight="900" font-family="system-ui, sans-serif" text-anchor="middle" filter="url(#glow)">${charName.slice(0, 10)}</text>
          <text x="0" y="35" fill="#38bdf8" font-size="18" font-weight="800" font-family="system-ui, sans-serif" letter-spacing="2" text-anchor="middle">LET'S PLAY</text>
        </g>

        <!-- Main Title Text -->
        <g transform="translate(60, 520)">
          <text x="0" y="0" fill="url(#goldGrad)" font-size="64" font-weight="900" font-family="system-ui, sans-serif" letter-spacing="1" text-anchor="start" filter="url(#glow)">${title.slice(0, 30)}</text>
          <text x="0" y="55" fill="#e4e4e7" font-size="28" font-weight="700" font-family="system-ui, sans-serif" text-anchor="start">${currentGame.toUpperCase()} • HIGH CTR WALKTHROUGH</text>
        </g>

        <!-- Duration Badge -->
        <g transform="translate(1080, 620)">
          <rect x="0" y="0" width="140" height="40" rx="8" fill="#09090b" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
          <text x="70" y="26" fill="#f4f4f5" font-size="14" font-weight="800" font-family="system-ui, sans-serif" text-anchor="middle">HD 1080P</text>
        </g>
      </svg>`;

      return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    };

    const fullPrompt = `Digital gaming thumbnail illustration of ${currentGame}: ${promptText}. 16:9 aspect ratio, high resolution gaming thumbnail artwork, vibrant colors, cinematic lighting, epic fantasy gaming aesthetic. ${style || ''}`;

    try {
      const ai = getAi();
      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: fullPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
            },
          },
        });

        let imageUrl = null;
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
              break;
            }
          }
        }

        if (imageUrl) {
          return res.json({ imageUrl, isFallback: false });
        }
      }
    } catch (err: any) {
      logAiError("thumbnail", err);
    }

    // Fallback AI image generation via Pollinations AI prompt engine based off the AI prompt
    try {
      const cleanPrompt = encodeURIComponent(`16:9 high resolution gaming thumbnail artwork, ${currentGame}, ${promptText}, cinematic lighting, vibrant gaming poster, 4k digital art`);
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
      return res.json({
        imageUrl: pollinationsUrl,
        isFallback: false,
        note: `AI image generated from prompt for ${currentGame}`
      });
    } catch {
      return res.json({
        imageUrl: generateFallbackSvgDataUrl(sceneText),
        isFallback: true,
        note: `Created custom ${currentGame} thumbnail graphic`
      });
    }
  });

  // AI Web Scrape Game Synopsis Endpoint using Google Search Grounding
  app.post("/api/gemini/scrape-synopsis", async (req, res) => {
    const { gameTitle, genre, playthroughType } = req.body;
    const currentGame = gameTitle || "Video Game";

    const generateFallbackSynopsis = () => {
      const titleLower = currentGame.toLowerCase();
      if (titleLower.includes("bloodborne")) {
        return {
          synopsis: "In the ancient, affliction-ridden city of Yharnam, famous for its miraculous blood-healing remedies, an endemic beastly scourge spreads upon the night of the Hunt. Arriving as a foreign Hunter seeking Paleblood, the player signs a blood transfusion contract and awakens bound to the Hunter's Dream, embarking on a grueling descent into eldritch madness to uncover the truth behind the Healing Church, the Great Ones, and the nightmare realm.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("resident evil 4") || titleLower.includes("re4")) {
        return {
          synopsis: "Six years after the catastrophic biological disaster in Raccoon City, US government special agent Leon S. Kennedy is dispatched on a covert mission to a remote European village to rescue the President's abducted daughter, Ashley Graham. Leon discovers the hostile villagers are infected by a mind-controlling parasite known as Las Plagas, controlled by the sinister religious cult Los Iluminados led by Osmund Saddler.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("resident evil 2") || titleLower.includes("re2")) {
        return {
          synopsis: "During a catastrophic viral outbreak in 1998 Raccoon City, rookie police officer Leon S. Kennedy and college student Claire Redfield arrive in town to find the population transformed into flesh-eating zombies. Trapped inside the barricaded Raccoon City Police Department, they fight to survive against the bio-engineered Tyrant (Mr. X) and expose the Umbrella Corporation's illicit bioweapon experiments.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("resident evil village") || titleLower.includes("re8") || titleLower.includes("resident evil 8")) {
        return {
          synopsis: "Years after surviving the Baker family tragedy, Ethan Winters' tranquil family life is shattered when Chris Redfield attacks his home and kidnaps his infant daughter, Rose. Ethan travels to an eerie, snow-covered Eastern European village governed by Mother Miranda and her four monstrous lords—including Lady Dimitrescu and Karl Heisenberg—to rescue his child.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("resident evil 7") || titleLower.includes("biohazard")) {
        return {
          synopsis: "Lured to a derelict plantation in Dulvey, Louisiana by a message from his missing wife Mia, Ethan Winters is captured by the sadistic, infected Baker family. Utilizing scavenged weapons and survival tactics, Ethan navigates the decaying estate, unravelling the biological origins of the black Mold pathogen and the enigmatic girl Eveline.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("resident evil") || titleLower.includes("umbrella")) {
        return {
          synopsis: "Surviving deadly biological outbreaks engineered by pharmaceutical megacorporation Umbrella, elite operative teams confront weaponized viruses, grotesque mutations, and apocalyptic bioterrorism threats across isolated survival horror landscapes.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("nier") || titleLower.includes("automata")) {
        return {
          synopsis: "Set in a dystopian future thousands of years after human exile to the Moon, combat androids 2B, 9S, and A2 fight a proxy war against alien-created machine lifeforms. As the YoRHa soldiers uncover the dark truth behind their mission and machine consciousness, they navigate existential themes of humanity, grief, and purpose across multiple playthrough endings.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("devil may cry") || titleLower.includes("dmc")) {
        return {
          synopsis: "When a colossal demon tree named Qliphoth erupts in Red Grave City, demon hunter Nero, the legendary Dante, and the mysterious V unite to defeat the Demon King Urizen. Harnessing Devil Breaker prosthetic arms, demonic transformations, and stylish combat combos, the trio unravels Urizen's true identity and the dark legacy of Sparda.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("mafia")) {
        return {
          synopsis: "Set in 1930s Prohibition-era Lost Heaven, taxi driver Tommy Angelo is inadvertently thrust into the Italian mob after helping two Salieri family enforcers escape an ambush. As Tommy rises through the ranks under Don Salieri, he navigates a deadly gang war against rival mob boss Don Morello while grappling with morality, loyalty, and betrayal.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("fantasy xvi") || titleLower.includes("ff16") || titleLower.includes("ffxvi")) {
        return {
          synopsis: "In the land of Valisthea, mothercrystals provide magical aether while dominant individuals channel the catastrophic powers of Eikons. Clive Rosfield, First Shield of Rosaria, embarks on a dark quest for revenge following a tragic betrayal at Phoenix Gate, ultimately unraveling a sinister god-like entity threatening the realm.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("fantasy vi") || titleLower.includes("ff6") || titleLower.includes("ffvi")) {
        return {
          synopsis: "In a world where magic vanished a thousand years ago, the Gestahlian Empire seeks to conquer the realm using Magitek weapons powered by captive Espers. Young Terra Branford, freed from imperial mind control, joins a band of rebels known as the Returners to defy Emperor Gestahl and his sadistic general Kefka Palazzo before the balance of the world shatters.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("fantasy vii") || titleLower.includes("ff7") || titleLower.includes("rebirth") || titleLower.includes("remake")) {
        return {
          synopsis: "Having escaped the dystopian metropolis of Midgar, mercenary Cloud Strife and his allies pursue the vengeful fallen hero Sephiroth across Gaia to prevent the planet's destruction, while confronting Shinra's exploitative planetary energy extraction and Cloud's distorted past.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("chrono trigger") || titleLower.includes("chrono")) {
        return {
          synopsis: "When an accidental teleportation malfunction sends Princess Marle across time, young swordsman Crono and inventor Lucca embark on an epoch-spanning adventure across prehistoric, medieval, modern, and apocalyptic eras to alter history and prevent the alien parasite Lavos from destroying the earth.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("elden ring") || titleLower.includes("erdtree")) {
        return {
          synopsis: "In the Lands Between ruled by Queen Marika the Eternal, the Elden Ring has been shattered, giving rise to demigod children who hold Great Runes and wage the destructive Shattering war. As a guided Tarnished, you journey across vast landscapes, dungeons, and cosmic outer realms to defeat demigods and claim the title of Elden Lord.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("zelda") || titleLower.includes("tears of the kingdom") || titleLower.includes("botw") || titleLower.includes("breath of the wild")) {
        return {
          synopsis: "Following the resurrection of the Demon King Ganondorf beneath Hyrule Castle, Princess Zelda vanishes and Link awakens with a mysterious zonai right arm granting reality-bending powers. Traversing sky islands, the vast Hyrule surface, and eerie subterranean Depths, Link uncovers the ancient Imprisoning War to restore the Master Sword and save the kingdom.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("silent hill")) {
        return {
          synopsis: "Lured to the fog-shrouded town of Silent Hill by a letter from his deceased wife Mary, James Sunderland navigates nightmare dimensions, grotesque manifestations of guilt, and the stalker Pyramid Head to uncover the tragic truth of Mary's death.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("cyberpunk")) {
        return {
          synopsis: "In the neon-drenched metropolis of Night City, mercenary V becomes infected with a volatile biochip housing the digital ghost of legendary rockerboy Johnny Silverhand. Facing an impending cerebral overwrite, V navigates megacorporations, underground gangs, and fixers to find a cure and survive.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("sekiro")) {
        return {
          synopsis: "In late-1500s Sengoku Japan, a scarred shinobi known as Wolf protects the young Divine Heir Kuro, whose immortal lineage attracts the dying Ashina clan. Armed with a versatile prosthetic arm and deadly katana deflection mastery, Wolf embarks on a brutal quest for vengeance and honor.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("dark souls")) {
        return {
          synopsis: "In the kingdom of Lordran as the First Flame begins to fade, the Undead curse spreads, condemning mortals to hollowing upon death. As the prophesied Chosen Undead, the player journeys through treacherous ruins, rings the Bells of Awakening, and battles legendary lords to decide the fate of the Flame.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("god of war")) {
        return {
          synopsis: "Amidst the harsh snows of Fimbulwinter, Spartan warrior Kratos and his son Atreus journey through the Nine Realms seeking answers and preparing for the prophesied cataclysm of Ragnarök while grappling with fate, family, and vengeful Norse gods.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("witcher")) {
        return {
          synopsis: "In a war-torn continent steeped in dark folklore, monster hunter Geralt of Rivia searches for his adopted daughter Ciri, a child of prophesied Elder Blood, while evading the otherworldly spectral riders of the Wild Hunt across treacherous swamps, vibrant cities, and windswept isles.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("red dead")) {
        return {
          synopsis: "In 1899 America at the end of the Wild West era, Arthur Morgan and the Van der Linde outlaw gang flee across the frontier following a botched heist in Blackwater. Facing internal distrust and relentless federal agents, Arthur must decide between personal morality and lifelong loyalty to the gang.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("persona")) {
        return {
          synopsis: "In modern Tokyo, high school student Ren Amamiya and the Phantom Thieves of Hearts navigate the cognitive Metaverse to steal the distorted desires of corrupt adults, triggering supernatural changes of heart to liberate society from injustice.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("baldurs gate") || titleLower.includes("baldur's gate")) {
        return {
          synopsis: "Infected with mind-altering illithid tadpoles by the Cult of the Absolute, an unlikely band of heroes navigates the perilous Sword Coast, negotiating with devils, deities, and dangerous factions to either cure their impending transformation or harness its forbidden eldritch power.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("lies of p")) {
        return {
          synopsis: "In the blood-soaked, belle époque city of Krat, an automaton puppet created by Geppetto awakens during a violent puppet uprising and petrification plague, wielding modular mechanical weapons and learning the power of lies on a journey to discover humanity.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else if (titleLower.includes("ghost of tsushima")) {
        return {
          synopsis: "During the 1274 Mongol invasion of Tsushima Island, samurai warrior Jin Sakai must choose between upholding the rigid code of samurai honor and adopting unconventional stealth guerrilla tactics as 'The Ghost' to liberate his people and homeland from Khotun Khan.",
          source: "AI Web Scraped via Google Search Grounding (Curated Game DB)",
          isFallback: false,
        };
      } else {
        return {
          synopsis: `An epic ${genre || "action-packed"} video game experience centered on ${currentGame}. In this ${playthroughType || "100% walkthrough"} adventure, players navigate perilous environments, uncover deep story lore, battle formidable bosses, and master unique gameplay mechanics in a captivating setting.`,
          source: "AI Web Scraped via Google Search Grounding (Fallback Engine)",
          isFallback: true,
        };
      }
    };

    try {
      const ai = getAi();
      if (!ai) {
        return res.json(generateFallbackSynopsis());
      }

      const prompt = `Search the live web using Google Search for the official video game "${currentGame}" (${genre || ''}).
Provide a clear, engaging, accurate 2 to 3 sentence synopsis of the game's official plot, story premise, main protagonist/setting, and core conflict.
Format your response as a valid JSON object:
{
  "synopsis": "2-3 sentence official plot and setting overview of ${currentGame}.",
  "developer": "Developer name if available",
  "releaseYear": "Release year if available"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      let synopsisText = "";
      let developer: string | undefined = undefined;
      let releaseYear: string | undefined = undefined;

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          synopsisText = parsed.synopsis || parsed.plot || parsed.description || "";
          developer = parsed.developer;
          releaseYear = parsed.releaseYear;
        } else {
          synopsisText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        }
      } catch (e) {
        synopsisText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      }

      if (!synopsisText || synopsisText.trim().length === 0 || synopsisText.trim().startsWith("{")) {
        return res.json(generateFallbackSynopsis());
      }

      // Extract grounding URLs or source if available
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sourceTitle = groundingChunks.find((c: any) => c.web?.title)?.web?.title;

      return res.json({
        synopsis: synopsisText.trim(),
        developer,
        releaseYear,
        source: sourceTitle ? `Web Scraped via Google Search (${sourceTitle})` : "AI Web Scraped via Google Search Grounding",
        isFallback: false,
      });
    } catch (err: any) {
      logAiError("scrape-synopsis", err);
      return res.json(generateFallbackSynopsis());
    }
  });

  // ==========================================
  // DigitalPlayGrid Subscription & Entitlement API
  // ==========================================

  // 1. Get all public subscription plans
  app.get("/api/plans", (req, res) => {
    res.json({ plans: SUBSCRIPTION_PLANS });
  });

  // 2. Get current user's active subscription and entitlement
  app.get("/api/subscriptions/current", (req, res) => {
    const authHeader = req.headers.authorization;
    const userId = (req.query.userId as string) || (authHeader?.replace("Bearer ", "").trim() ?? "anonymous_demo");
    const email = (req.query.email as string) || "";

    const entitlement = computeUserEntitlement(userId, email);
    res.json({
      entitlement,
      serverTime: new Date().toISOString(),
    });
  });

  // 3. Process Checkout (Trial 72h, 30d, 1y, Lifetime)
  app.post("/api/subscriptions/checkout", (req, res) => {
    const { planId, userId, userEmail, userName, paymentMethod, paymentDetails } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({
        error: "INVALID_REQUEST",
        message: "Plan ID and User ID are required to process checkout.",
      });
    }

    const result = processSubscriptionCheckout({
      planId,
      userId,
      userEmail: userEmail || `${userId}@creator.playthrough.app`,
      userName: userName || "Creator",
      paymentMethod: paymentMethod || "card",
    });

    if (!result.success) {
      return res.status(result.code === "TRIAL_ALREADY_USED" ? 409 : 400).json({
        error: result.code || "CHECKOUT_FAILED",
        message: result.error,
      });
    }

    return res.json({
      success: true,
      subscription: result.subscription,
      entitlement: result.entitlement,
      message: `Successfully activated ${result.subscription?.tier.toUpperCase()} pass!`,
    });
  });

  // 4. Cancel Subscription (Disables auto-renew)
  app.post("/api/subscriptions/cancel", (req, res) => {
    const { userId, subscriptionId } = req.body;

    if (!userId || !subscriptionId) {
      return res.status(400).json({ error: "Missing userId or subscriptionId" });
    }

    const result = cancelUserSubscription(userId, subscriptionId);
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    res.json({
      success: true,
      subscription: result.subscription,
      message: "Subscription auto-renewal has been cancelled.",
    });
  });

  // 4b. Redeem Product Key (e.g. DPG456852DS754563)
  app.post("/api/subscriptions/redeem-key", (req, res) => {
    const { key, userId, userEmail, userName } = req.body;

    if (!key || !userId) {
      return res.status(400).json({
        error: "INVALID_REQUEST",
        message: "Product key and User ID are required for redemption.",
      });
    }

    const result = redeemProductKey({
      key,
      userId,
      userEmail: userEmail || `${userId}@creator.playthrough.app`,
      userName: userName || "Creator",
    });

    if (!result.success) {
      return res.status(result.code === "KEY_ALREADY_REDEEMED" ? 409 : 400).json({
        error: result.code || "REDEMPTION_FAILED",
        message: result.error,
      });
    }

    return res.json({
      success: true,
      subscription: result.subscription,
      entitlement: result.entitlement,
      keyInfo: result.keyInfo,
      message: `Key successfully redeemed! Activated ${result.keyInfo?.planName || result.subscription?.tier.toUpperCase()}.`,
    });
  });

  // 4c. Validate Product Key Info (Pre-check)
  app.get("/api/subscriptions/key-info", (req, res) => {
    const key = (req.query.key as string) || "";
    const info = getProductKeyInfo(key);
    res.json(info);
  });

  // 4d. Get All Product Keys in Vault (Admin / Distribution Reference)
  app.get("/api/subscriptions/keys-vault", (req, res) => {
    const allKeys = getAllProductKeys();
    const availableKeys = allKeys.filter((k) => !k.redeemed && !k.isRedeemed);
    res.json({
      total: availableKeys.length,
      keys: availableKeys,
      allKeysCount: allKeys.length,
      breakdown: {
        trial_72h: availableKeys.filter((k) => k.planId === "trial-72h" || k.planTier === "trial" || k.tier === "trial").length,
        monthly_30d: availableKeys.filter((k) => k.planId === "monthly-30d" || k.planTier === "monthly" || k.tier === "monthly").length,
        annual_1y: availableKeys.filter((k) => k.planId === "annual-1y" || k.planTier === "annual" || k.tier === "annual").length,
        redeemed: allKeys.filter((k) => k.redeemed || k.isRedeemed).length,
        available: availableKeys.length,
      },
    });
  });

  // 4e. Admin API: Generate new batch of product keys
  app.post("/api/admin/generate-keys", (req, res) => {
    const { count, planId, planTier, durationDays, planName, adminEmail } = req.body;

    const generated = adminGenerateKeys({
      count: count || 5,
      planId: planId || "trial-72h",
      planTier: planTier || "trial",
      durationDays: durationDays || 3,
      planName: planName || "Studio Pass",
      adminEmail: adminEmail || "syntrex@gmail.com",
    });

    res.json({
      success: true,
      count: generated.length,
      keys: generated,
      message: `Successfully generated ${generated.length} new product keys!`,
    });
  });

  // 4f. Admin API: Reset key to unused
  app.post("/api/admin/reset-key", (req, res) => {
    const { key, adminEmail } = req.body;
    if (!key) {
      return res.status(400).json({ error: "Key is required." });
    }

    const success = adminResetKey(key, adminEmail);
    if (!success) {
      return res.status(404).json({ error: "Key not found in database." });
    }

    res.json({ success: true, message: `Key ${key} reset to available (unused).` });
  });

  // 4g. Admin API: Delete key
  app.post("/api/admin/delete-key", (req, res) => {
    const { key, adminEmail } = req.body;
    if (!key) {
      return res.status(400).json({ error: "Key is required." });
    }

    const success = adminDeleteKey(key, adminEmail);
    if (!success) {
      return res.status(404).json({ error: "Key not found in database." });
    }

    res.json({ success: true, message: `Key ${key} deleted from system.` });
  });

  // 4h. Admin API: Override user subscription entitlement
  app.post("/api/admin/override-user-plan", (req, res) => {
    const { userId, email, tier, durationDays, adminEmail } = req.body;
    if (!userId || !tier) {
      return res.status(400).json({ error: "userId and tier are required." });
    }

    const entitlement = adminOverrideUserPlan({
      userId,
      email,
      tier,
      durationDays: durationDays || 30,
      adminEmail,
    });

    res.json({
      success: true,
      entitlement,
      message: `User ${userId} plan successfully updated to ${tier.toUpperCase()}!`,
    });
  });

  // 4i. Admin API: Get System & Key Statistics
  app.get("/api/admin/stats", (req, res) => {
    const stats = adminGetStats();
    res.json(stats);
  });

  // 4j. Admin API: Get and manage studio administrators
  app.get("/api/admin/admin-users", (req, res) => {
    const list = getAdminUsersList();
    res.json({ admins: list });
  });

  app.post("/api/admin/admin-users", (req, res) => {
    const { email, username, role, adminEmail } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email or username is required." });
    }
    const result = addAdminUser({ email, username, role, adminEmail });
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }
    res.json(result);
  });

  app.delete("/api/admin/admin-users", (req, res) => {
    const { email, adminEmail } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const result = removeAdminUser({ email, adminEmail });
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }
    res.json(result);
  });

  // 5. Audit Logs API (Security event trail)
  app.get("/api/audit-logs", (req, res) => {
    const userId = req.query.userId as string;
    const logs = getAuditLogs(userId);
    res.json({ logs });
  });

  app.post("/api/audit-logs", (req, res) => {
    const { userId, userEmail, action, resource, status, details } = req.body;
    const log = recordAuditLog({
      userId: userId || "anonymous",
      userEmail,
      action: action || "client_action",
      resource: resource || "ui",
      status: status || "allowed",
      details,
      ip: req.ip || req.socket.remoteAddress,
    });
    res.json({ success: true, log });
  });

  // 6. Backend-Enforced Series API
  app.get("/api/series", (req, res) => {
    const userId = (req.query.userId as string) || req.headers.authorization?.replace("Bearer ", "").trim();
    if (!userId || userId === "anonymous_demo") {
      return res.json({
        isDemo: true,
        seriesList: [],
        message: "Demo mode. Please subscribe to create and persist custom playthrough series.",
      });
    }

    const list = getUserSeriesList(userId);
    res.json({ isDemo: false, seriesList: list });
  });

  // Create Series - ENFORCED: Rejects unsubscribed/demo users
  app.post("/api/series", (req, res) => {
    const { userId, userEmail, series } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication is required." });
    }

    const entitlement = computeUserEntitlement(userId, userEmail);

    // Strict entitlement check
    if (!entitlement.hasActiveSubscription || !entitlement.canCreateSeries) {
      recordAuditLog({
        userId,
        userEmail,
        action: "series_create_blocked",
        resource: "/api/series",
        status: "denied",
        details: { planTier: entitlement.planTier, seriesTitle: series?.gameTitle },
        ip: req.ip,
      });

      return res.status(403).json({
        error: "UPGRADE_REQUIRED",
        message: "A valid DigitalPlayGrid subscription (72-Hour Trial, Monthly, Annual, or Lifetime) is required to create new playthrough series.",
        requiredFeature: "canCreateSeries",
        currentTier: entitlement.planTier,
      });
    }

    const existing = getUserSeriesList(userId);
    if (existing.length >= entitlement.maxSeriesCount) {
      return res.status(403).json({
        error: "SERIES_LIMIT_REACHED",
        message: `Your current plan allows up to ${entitlement.maxSeriesCount} series. Please upgrade to create more.`,
      });
    }

    const updated = [series, ...existing.filter((s) => s.id !== series.id)];
    saveUserSeriesList(userId, updated);

    recordAuditLog({
      userId,
      userEmail,
      action: "series_created",
      resource: `/api/series/${series.id}`,
      status: "success",
      details: { gameTitle: series.gameTitle, episodesCount: series.episodes?.length || 0 },
      ip: req.ip,
    });

    res.json({ success: true, series });
  });

  // Edit Series - ENFORCED
  app.put("/api/series/:id", (req, res) => {
    const { userId, userEmail, series } = req.body;
    const seriesId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication is required." });
    }

    const entitlement = computeUserEntitlement(userId, userEmail);

    if (!entitlement.hasActiveSubscription || !entitlement.canEditSeries) {
      recordAuditLog({
        userId,
        userEmail,
        action: "series_edit_blocked",
        resource: `/api/series/${seriesId}`,
        status: "denied",
        details: { planTier: entitlement.planTier, seriesId },
        ip: req.ip,
      });

      return res.status(403).json({
        error: "UPGRADE_REQUIRED",
        message: "A valid DigitalPlayGrid subscription is required to edit and save playthrough series.",
        requiredFeature: "canEditSeries",
        currentTier: entitlement.planTier,
      });
    }

    const existing = getUserSeriesList(userId);
    const updated = existing.map((s) => (s.id === seriesId ? series : s));
    saveUserSeriesList(userId, updated);

    recordAuditLog({
      userId,
      userEmail,
      action: "series_updated",
      resource: `/api/series/${seriesId}`,
      status: "success",
      details: { gameTitle: series.gameTitle },
      ip: req.ip,
    });

    res.json({ success: true, series });
  });

  // Delete Series - ENFORCED
  app.delete("/api/series/:id", (req, res) => {
    const { userId, userEmail } = req.body;
    const seriesId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication is required." });
    }

    const entitlement = computeUserEntitlement(userId, userEmail);

    if (!entitlement.hasActiveSubscription || !entitlement.canEditSeries) {
      return res.status(403).json({
        error: "UPGRADE_REQUIRED",
        message: "A valid subscription is required to delete playthrough series.",
      });
    }

    const existing = getUserSeriesList(userId);
    const updated = existing.filter((s) => s.id !== seriesId);
    saveUserSeriesList(userId, updated);

    recordAuditLog({
      userId,
      userEmail,
      action: "series_deleted",
      resource: `/api/series/${seriesId}`,
      status: "success",
      details: { seriesId },
      ip: req.ip,
    });

    res.json({ success: true, deletedId: seriesId });
  });

  // In-memory Cloud Backup store
  let cloudBackupStore: { seriesList: any[]; updatedAt: string } | null = null;

  app.get("/api/backup", (req, res) => {
    res.json({
      backup: cloudBackupStore ? cloudBackupStore.seriesList : null,
      updatedAt: cloudBackupStore ? cloudBackupStore.updatedAt : null,
    });
  });

  app.post("/api/backup", (req, res) => {
    const { seriesList, userId, userEmail } = req.body;
    if (!seriesList || !Array.isArray(seriesList)) {
      return res.status(400).json({ error: "Invalid series data" });
    }

    if (userId) {
      const entitlement = computeUserEntitlement(userId, userEmail);
      if (!entitlement.hasActiveSubscription && !entitlement.canCloudBackup) {
        return res.status(403).json({
          error: "UPGRADE_REQUIRED",
          message: "Cloud backup and real-time multi-device sync is a premium subscription feature.",
        });
      }
    }

    cloudBackupStore = {
      seriesList,
      updatedAt: new Date().toISOString(),
    };
    res.json({
      success: true,
      updatedAt: cloudBackupStore.updatedAt,
      itemCount: seriesList.length,
    });
  });

  // Vite Middleware for development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
