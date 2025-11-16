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
import type { Testimonial } from "../../types";

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const db = getDb();
    const q = query(collection(db, "testimonials"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Testimonial[];
  } catch (error) {
    console.error("Error getting testimonials:", error);
    return [];
  }
}

export async function createTestimonial(
  data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const db = getDb();
    const docRef = doc(collection(db, "testimonials"));
    await setDoc(docRef, {
      ...data,
      createdAt: Timestamp.now().toDate().toISOString(),
      updatedAt: Timestamp.now().toDate().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating testimonial:", error);
    throw error;
  }
}

export async function updateTestimonial(
  id: string,
  data: Partial<Omit<Testimonial, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  try {
    const db = getDb();
    const docRef = doc(db, "testimonials", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now().toDate().toISOString(),
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    const db = getDb();
    await deleteDoc(doc(db, "testimonials", id));
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }
}
