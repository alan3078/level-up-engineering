import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { getDb } from "../config";
import type { CalculatorPricing } from "../../types";

export async function getCalculatorPricing(): Promise<CalculatorPricing | null> {
  try {
    const db = getDb();
    const docRef = doc(db, "calculator", "pricing");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CalculatorPricing;
    }
    return null;
  } catch (error) {
    console.error("Error getting calculator pricing:", error);
    return null;
  }
}

export async function updateCalculatorPricing(
  data: Omit<CalculatorPricing, "id" | "updatedAt">
): Promise<void> {
  try {
    const db = getDb();
    const docRef = doc(db, "calculator", "pricing");
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: Timestamp.now().toDate().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating calculator pricing:", error);
    throw error;
  }
}
