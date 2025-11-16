import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getDb } from "../config";
import type { PortfolioProject } from "../../types";

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  try {
    const db = getDb();
    const q = query(collection(db, "portfolio"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PortfolioProject[];
  } catch (error) {
    console.error("Error getting portfolio projects:", error);
    return [];
  }
}

export async function createPortfolioProject(
  data: Omit<PortfolioProject, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const db = getDb();
    const docRef = doc(collection(db, "portfolio"));
    await setDoc(docRef, {
      ...data,
      createdAt: Timestamp.now().toDate().toISOString(),
      updatedAt: Timestamp.now().toDate().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating portfolio project:", error);
    throw error;
  }
}

export async function updatePortfolioProject(
  id: string,
  data: Partial<Omit<PortfolioProject, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  try {
    const db = getDb();
    const docRef = doc(db, "portfolio", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now().toDate().toISOString(),
    });
  } catch (error) {
    console.error("Error updating portfolio project:", error);
    throw error;
  }
}

export async function deletePortfolioProject(id: string): Promise<void> {
  try {
    const db = getDb();
    await deleteDoc(doc(db, "portfolio", id));
  } catch (error) {
    console.error("Error deleting portfolio project:", error);
    throw error;
  }
}
