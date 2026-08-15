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
import { PlaythroughSeries } from "../types";
import { defaultPlaythroughSeries } from "../data/episodesData";

export const fetchUserSeriesList = async (userId: string): Promise<PlaythroughSeries[]> => {
  try {
    const q = query(collection(db, "userSeries"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const seriesList: PlaythroughSeries[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      seriesList.push({
        id: data.id || docSnap.id,
        gameTitle: data.gameTitle || "Untitled Series",
        subtitle: data.subtitle || "",
        badgeText: data.badgeText || "100% RUN",
        accentColor: data.accentColor || "blue",
        playthroughType: data.playthroughType || "100% Walkthrough",
        coverImage: data.coverImage || "",
        gameTitleLogo: data.gameTitleLogo || data.gameLogoUrl || "",
        useTitleLogo: data.useTitleLogo ?? true,
        episodes: data.episodes || [],
        quests: data.quests || [],
        gameSynopsis: data.gameSynopsis || data.synopsis || "",
        gameSynopsisSource: data.gameSynopsisSource || "",
        createdAt: data.createdAt || "",
      });
    });

    if (seriesList.length === 0) {
      // Seed default initial series for new user in cloud
      const initialList = [...defaultPlaythroughSeries];
      for (const s of initialList) {
        await saveUserSeries(userId, s);
      }
      return initialList;
    }

    return seriesList;
  } catch (error) {
    console.error("Error fetching user series from Firestore:", error);
    return defaultPlaythroughSeries;
  }
};

export const saveUserSeries = async (userId: string, series: PlaythroughSeries): Promise<void> => {
  try {
    const docRef = doc(db, "userSeries", `${userId}_${series.id}`);
    await setDoc(docRef, {
      ...series,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error("Error saving series to Firestore:", error);
  }
};

export const deleteUserSeries = async (userId: string, seriesId: string): Promise<void> => {
  try {
    const docRef = doc(db, "userSeries", `${userId}_${seriesId}`);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting series from Firestore:", error);
  }
};
