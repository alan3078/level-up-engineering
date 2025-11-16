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
import type { Service } from "../../types";

export async function getServices(): Promise<Service[]> {
  try {
    const db = getDb();
    const q = query(collection(db, "services"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Service[];
  } catch (error) {
    console.error("Error getting services:", error);
    return [];
  }
}

export async function createService(
  data: Omit<Service, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const db = getDb();
    const docRef = doc(collection(db, "services"));
    await setDoc(docRef, {
      ...data,
      createdAt: Timestamp.now().toDate().toISOString(),
      updatedAt: Timestamp.now().toDate().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function updateService(
  id: string,
  data: Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  try {
    const db = getDb();
    const docRef = doc(db, "services", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now().toDate().toISOString(),
    });
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    const db = getDb();
    await deleteDoc(doc(db, "services", id));
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}
