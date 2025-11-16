import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { getDb } from "../config";
import type { HeroStats } from "../../types";

export async function getHeroStats(): Promise<HeroStats | null> {
  try {
    const db = getDb();
    const docRef = doc(db, "hero", "stats");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as HeroStats;
    }
    return null;
  } catch (error) {
    console.error("Error getting hero stats:", error);
    return null;
  }
}

export async function updateHeroStats(
  data: Omit<HeroStats, "id" | "updatedAt">
): Promise<void> {
  try {
    const db = getDb();
    const docRef = doc(db, "hero", "stats");
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: Timestamp.now().toDate().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating hero stats:", error);
    throw error;
  }
}
