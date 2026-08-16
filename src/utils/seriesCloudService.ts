import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase";
import { PlaythroughSeries, Episode } from "../types";
import { defaultPlaythroughSeries } from "../data/episodesData";

// Clean string field: strip excessively large data URLs that would exceed Firestore 1MB doc limit
const sanitizeCloudString = (str: string | undefined, maxChars = 8000): string => {
  if (!str) return "";
  // If it's a data URL exceeding max size, strip base64 for cloud sync (keeps IndexedDB pristine)
  if (typeof str === "string" && str.startsWith("data:") && str.length > maxChars) {
    return "";
  }
  return str;
};

// Sanitize series object so it safely fits within Firestore's 1MB (1,048,576 bytes) document constraint
export const sanitizeSeriesForCloud = (series: PlaythroughSeries): PlaythroughSeries => {
  try {
    const cleanEpisodes: Episode[] = (series.episodes || []).map((ep) => {
      const cleanHeroAvatars: Record<string, string> = {};
      if (ep.heroAvatars && typeof ep.heroAvatars === "object") {
        for (const [heroName, avatarVal] of Object.entries(ep.heroAvatars)) {
          // If avatar is a huge base64 data URL, keep only short URLs
          if (avatarVal && typeof avatarVal === "string" && avatarVal.length <= 4000) {
            cleanHeroAvatars[heroName] = avatarVal;
          }
        }
      }

      return {
        ...ep,
        thumbnailConfig: {
          ...ep.thumbnailConfig,
          customImage: sanitizeCloudString(ep.thumbnailConfig?.customImage, 4000),
        },
        heroAvatars: cleanHeroAvatars,
      };
    });

    const cleanSeries: PlaythroughSeries = {
      ...series,
      coverImage: sanitizeCloudString(series.coverImage, 8000),
      gameTitleLogo: sanitizeCloudString(series.gameTitleLogo, 8000),
      episodes: cleanEpisodes,
    };

    // Verify document size
    const payloadSize = JSON.stringify(cleanSeries).length;
    if (payloadSize > 850000) {
      // If still too large, prune heavy description text or extra alt titles for cloud backup
      cleanSeries.episodes = cleanSeries.episodes.map((ep) => ({
        ...ep,
        description: (ep.description || "").slice(0, 1500),
        heroAvatars: {},
      }));
    }

    return cleanSeries;
  } catch (err) {
    console.warn("Failed to sanitize series for cloud, using original:", err);
    return series;
  }
};

export const fetchUserSeriesList = async (userId: string): Promise<PlaythroughSeries[]> => {
  try {
    const q = query(collection(db, "userSeries"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const seriesList: PlaythroughSeries[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      seriesList.push({
        id: data.id || docSnap.id.replace(`${userId}_`, ""),
        gameTitle: data.gameTitle || "Untitled Series",
        subtitle: data.subtitle || "",
        badgeText: data.badgeText || "100% RUN",
        accentColor: data.accentColor || "blue",
        playthroughType: data.playthroughType || "100% Walkthrough",
        coverImage: data.coverImage || "",
        gameTitleLogo: data.gameTitleLogo || data.gameLogoUrl || "",
        useTitleLogo: data.useTitleLogo ?? false,
        episodes: data.episodes || [],
        quests: data.quests || [],
        gameSynopsis: data.gameSynopsis || data.synopsis || "",
        gameSynopsisSource: data.gameSynopsisSource || "",
        createdAt: data.createdAt || "",
      });
    });

    if (seriesList.length === 0) {
      // Seed default initial series for new user in cloud safely
      const initialList = [...defaultPlaythroughSeries];
      for (const s of initialList) {
        saveUserSeries(userId, s).catch(() => {});
      }
      return initialList;
    }

    // Ensure all default curated series (such as Bloodborne, Mafia, FF16, etc.) are present in the list
    const existingCloudIds = new Set(seriesList.map((s) => s.id));
    const missingDefaults = defaultPlaythroughSeries.filter((ds) => !existingCloudIds.has(ds.id));
    if (missingDefaults.length > 0) {
      for (const missing of missingDefaults) {
        seriesList.push(missing);
        saveUserSeries(userId, missing).catch(() => {});
      }
    }

    return seriesList;
  } catch (error) {
    console.warn("Error fetching user series from Firestore, using local fallback:", error);
    return defaultPlaythroughSeries;
  }
};

export const saveUserSeries = async (userId: string, series: PlaythroughSeries): Promise<void> => {
  if (!userId || !series?.id) return;
  try {
    const cleanSeries = sanitizeSeriesForCloud(series);
    const docRef = doc(db, "userSeries", `${userId}_${series.id}`);
    await setDoc(docRef, {
      ...cleanSeries,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error: any) {
    // If still fails, write essential metadata only so cloud sync never breaks or throws
    console.warn("Firestore save fallback note:", error?.message || error);
    try {
      const docRef = doc(db, "userSeries", `${userId}_${series.id}`);
      const minimalEpisodes = (series.episodes || []).map((ep) => ({
        id: ep.id,
        partNumber: ep.partNumber,
        title: ep.title,
        shortTitle: ep.shortTitle,
        world: ep.world,
        startPoint: ep.startPoint,
        endPoint: ep.endPoint,
        estDurationMinutes: ep.estDurationMinutes,
        status: ep.status,
        keyEvents: ep.keyEvents || [],
        keyItemsAndEspers: ep.keyItemsAndEspers || [],
        partyMembers: ep.partyMembers || [],
        tags: ep.tags || [],
        chapters: ep.chapters || [],
        description: (ep.description || "").slice(0, 1000),
        thumbnailConfig: {
          backgroundPreset: ep.thumbnailConfig?.backgroundPreset || "vector",
          featuredCharacter: ep.thumbnailConfig?.featuredCharacter || "",
          overlayText: ep.thumbnailConfig?.overlayText || "",
          themeColor: ep.thumbnailConfig?.themeColor || "#3b82f6",
        },
      }));

      await setDoc(docRef, {
        id: series.id,
        gameTitle: series.gameTitle,
        subtitle: series.subtitle,
        badgeText: series.badgeText,
        accentColor: series.accentColor,
        playthroughType: series.playthroughType,
        coverImage: sanitizeCloudString(series.coverImage, 2000),
        gameTitleLogo: sanitizeCloudString(series.gameTitleLogo, 2000),
        episodes: minimalEpisodes,
        quests: series.quests || [],
        userId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (fallbackErr) {
      console.warn("Local storage fallback active for series:", series.id);
    }
  }
};

export const deleteUserSeries = async (userId: string, seriesId: string): Promise<void> => {
  try {
    const docRef = doc(db, "userSeries", `${userId}_${seriesId}`);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn("Error deleting series from Firestore:", error);
  }
};
