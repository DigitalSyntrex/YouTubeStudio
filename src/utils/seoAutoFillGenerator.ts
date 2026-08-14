import { Episode } from "../types";

export interface SeoAutoFillResult {
  episodeId: number;
  suggestedTitle: string;
  alternativeTitles: string[];
  suggestedTags: string[];
  suggestedDescription: string;
  chapters: { timestamp: string; title: string }[];
}

export type SeoStyleOption = "viral" | "walkthrough" | "lore" | "boss";

/**
 * Client-side core plot beat SEO Auto-Fill synthesizer.
 * Guarantees instantaneous, high-CTR, SEO-optimized title, tag, and description packages
 * for every episode based on game core plot beats.
 */
export function generateSeoPackageForEpisode(
  episode: Episode,
  gameTitle: string,
  style: SeoStyleOption = "walkthrough"
): SeoAutoFillResult {
  const epNum = episode.partNumber;
  const epNumStr = epNum < 10 ? `0${epNum}` : `${epNum}`;
  const cleanGame = gameTitle || "RPG Playthrough";
  const worldStr = episode.world || "Main Quest";
  const startStr = episode.startPoint || "Starting Location";
  const endStr = episode.endPoint || "Destination";
  const shortTitleStr = episode.shortTitle || episode.title || `Part ${epNumStr}`;
  
  const mainKeyEvent = episode.keyEvents && episode.keyEvents.length > 0
    ? episode.keyEvents[0]
    : `Journey from ${startStr} to ${endStr}`;

  const partyStr = episode.partyMembers && episode.partyMembers.length > 0
    ? episode.partyMembers.join(", ")
    : "";

  const itemsStr = episode.keyItemsAndEspers && episode.keyItemsAndEspers.length > 0
    ? episode.keyItemsAndEspers.join(", ")
    : "";

  const bossStr = episode.bossStrategies && episode.bossStrategies.length > 0
    ? episode.bossStrategies[0].split(":")[0]
    : "";

  // 1. Generate Title Options based on SEO Style
  let primaryTitle = "";
  const altTitles: string[] = [];

  if (style === "viral") {
    primaryTitle = `${shortTitleStr.toUpperCase()}! - ${cleanGame} #${epNumStr} (${startStr})`;
    altTitles.push(`THE MOST EPIC MOMENT IN ${cleanGame.toUpperCase()}! - Ep ${epNumStr}`);
    altTitles.push(`Can We Survive ${worldStr.toUpperCase()}? - ${cleanGame} #${epNumStr}`);
    altTitles.push(`100% UNSTOPPABLE RUN! - ${cleanGame} Walkthrough #${epNumStr}`);
  } else if (style === "boss") {
    const bossHighlight = bossStr || shortTitleStr;
    primaryTitle = `HOW TO DEFEAT ${bossHighlight.toUpperCase()}! - ${cleanGame} #${epNumStr}`;
    altTitles.push(`EPIC BOSS BATTLE & REWARDS! - ${cleanGame} Ep ${epNumStr} (${worldStr})`);
    altTitles.push(`${cleanGame} #${epNumStr} - Boss Guide & Strategy: ${bossHighlight}`);
    altTitles.push(`FLAWLESS BOSS VICTORY! - ${cleanGame} Part ${epNumStr}`);
  } else if (style === "lore") {
    primaryTitle = `The Story of ${startStr} & ${worldStr} - ${cleanGame} Ep ${epNumStr}`;
    altTitles.push(`${cleanGame} Lore & Story Walkthrough #${epNumStr} - ${shortTitleStr}`);
    altTitles.push(`Uncovering the Secrets of ${worldStr} - ${cleanGame} #${epNumStr}`);
    altTitles.push(`${cleanGame} #${epNumStr} - ${shortTitleStr} (${startStr} ➔ ${endStr})`);
  } else {
    // Default: 100% Walkthrough
    primaryTitle = `${cleanGame} 100% Walkthrough #${epNumStr} - ${shortTitleStr} (${worldStr})`;
    altTitles.push(`${cleanGame} Ep ${epNumStr} - ${shortTitleStr} (${startStr} ➔ ${endStr})`);
    altTitles.push(`100% ${cleanGame} Playthrough #${epNumStr} - ${startStr} to ${endStr}`);
    altTitles.push(`${shortTitleStr.toUpperCase()}! - ${cleanGame} Walkthrough Ep ${epNumStr}`);
  }

  // 2. Generate SEO Tags
  const tagSet = new Set<string>();
  tagSet.add(cleanGame);
  tagSet.add(`${cleanGame} Walkthrough`);
  tagSet.add(`${cleanGame} Lets Play`);
  tagSet.add(`${cleanGame} Gameplay`);
  tagSet.add(`${cleanGame} Part ${epNum}`);
  tagSet.add(`${cleanGame} Episode ${epNumStr}`);
  tagSet.add("100% Walkthrough");
  tagSet.add("Gaming");
  tagSet.add("Let's Play");
  if (worldStr) tagSet.add(worldStr);
  if (shortTitleStr) tagSet.add(shortTitleStr);
  if (bossStr) tagSet.add(bossStr);
  if (partyStr) partyStr.split(",").map((p) => p.trim()).forEach((p) => p && tagSet.add(p));

  const tags = Array.from(tagSet).slice(0, 12);

  // 3. Generate Chapter Timestamps (90-120 Minute Longform Format)
  const chapters = [
    { timestamp: "00:00", title: `Introduction & ${startStr}` },
    { timestamp: "22:15", title: `Exploring ${worldStr} & Area Secrets` },
    { timestamp: "48:30", title: `Dungeon Progression: ${shortTitleStr}` },
    { timestamp: "1:15:00", title: `Major Quest Encounters & Story Beat` },
    { timestamp: "1:35:00", title: `Milestone & ${endStr}` },
    { timestamp: "1:48:00", title: `Episode Outro & Next Part Teaser` },
  ];

  if (bossStr) {
    chapters.splice(3, 0, { timestamp: "1:08:00", title: `Boss Encounter: ${bossStr}` });
  }

  // 4. Generate Rich Description
  let descriptionLines: string[] = [];

  descriptionLines.push(`Welcome to Episode ${epNum} of our 100% ${cleanGame} Walkthrough & Let's Play series!`);
  descriptionLines.push(``);
  descriptionLines.push(`📍 EPISODE OVERVIEW & PLOT BEATS:`);
  descriptionLines.push(`In this episode, we venture into ${worldStr}, starting our quest at ${startStr} and navigating all key challenges to reach ${endStr}.`);
  descriptionLines.push(``);

  if (episode.keyEvents && episode.keyEvents.length > 0) {
    descriptionLines.push(`🔥 KEY STORY HIGHLIGHTS:`);
    episode.keyEvents.forEach((ke) => {
      descriptionLines.push(`• ${ke}`);
    });
    descriptionLines.push(``);
  } else {
    descriptionLines.push(`🔥 KEY STORY HIGHLIGHTS:`);
    descriptionLines.push(`• ${mainKeyEvent}`);
    descriptionLines.push(`• Progressing from ${startStr} to ${endStr}`);
    descriptionLines.push(`• Unlocking area secrets & 100% items`);
    descriptionLines.push(``);
  }

  if (partyStr) {
    descriptionLines.push(`👥 ACTIVE PARTY MEMBERS: ${partyStr}`);
  }
  if (itemsStr) {
    descriptionLines.push(`✨ KEY ITEMS / LOOT: ${itemsStr}`);
  }
  if (partyStr || itemsStr) {
    descriptionLines.push(``);
  }

  descriptionLines.push(`⏱️ CHAPTER TIMESTAMPS:`);
  chapters.forEach((ch) => {
    descriptionLines.push(`${ch.timestamp} - ${ch.title}`);
  });
  descriptionLines.push(``);

  descriptionLines.push(`🏷️ SEO KEYWORDS & TAGS:`);
  descriptionLines.push(tags.map((t) => `#${t.replace(/[^a-zA-Z0-9]/g, "")}`).filter((t) => t.length > 1).join(" "));
  descriptionLines.push(``);

  descriptionLines.push(`--------------------------------------------------`);
  descriptionLines.push(`🔔 SUBSCRIBE & Ring the Bell for full ${cleanGame} walkthrough episodes!`);
  descriptionLines.push(`💬 Drop a comment below with your favorite strategy or moment from ${worldStr}!`);

  const description = descriptionLines.join("\n");

  return {
    episodeId: episode.id,
    suggestedTitle: primaryTitle,
    alternativeTitles: altTitles,
    suggestedTags: tags,
    suggestedDescription: description,
    chapters,
  };
}

/**
 * Batch auto-fill function for an entire series list of episodes.
 */
export function autoFillSeriesEpisodesSeo(
  episodes: Episode[],
  gameTitle: string,
  style: SeoStyleOption = "walkthrough"
): Episode[] {
  return episodes.map((ep) => {
    const seo = generateSeoPackageForEpisode(ep, gameTitle, style);
    return {
      ...ep,
      title: seo.suggestedTitle,
      altTitles: seo.alternativeTitles,
      tags: seo.suggestedTags,
      description: seo.suggestedDescription,
      chapters: seo.chapters,
    };
  });
}
