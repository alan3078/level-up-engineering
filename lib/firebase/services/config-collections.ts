import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { getDb } from "../config";

export interface SysConfigItem {
  id?: string;
  key: string;
  value: string;
  label: string;
  description?: string;
  type:
    | "text"
    | "number"
    | "boolean"
    | "textarea"
    | "image"
    | "color"
    | "select";
  groupId: string;
  order: number;
  options?: { label: string; value: string }[]; // For select type
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SysConfigGroup {
  id?: string;
  name: string;
  label: string;
  description?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Config Groups
export async function getConfigGroups(): Promise<SysConfigGroup[]> {
  const db = getDb();
  const snapshot = await getDocs(collection(db, "sys_config_group"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as SysConfigGroup[];
}

export async function getConfigGroup(
  id: string
): Promise<SysConfigGroup | null> {
  const db = getDb();
  const docRef = doc(db, "sys_config_group", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as SysConfigGroup;
}

export async function createConfigGroup(
  data: Omit<SysConfigGroup, "id">
): Promise<string> {
  const db = getDb();
  const docRef = doc(collection(db, "sys_config_group"));
  await setDoc(docRef, {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return docRef.id;
}

export async function updateConfigGroup(
  id: string,
  data: Partial<SysConfigGroup>
): Promise<void> {
  const db = getDb();
  const docRef = doc(db, "sys_config_group", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function deleteConfigGroup(id: string): Promise<void> {
  const db = getDb();
  // Also delete all items in this group
  const items = await getConfigItemsByGroup(id);
  for (const item of items) {
    if (item.id) {
      await deleteConfigItem(item.id);
    }
  }
  const docRef = doc(db, "sys_config_group", id);
  await deleteDoc(docRef);
}

// Config Items
export async function getConfigItems(): Promise<SysConfigItem[]> {
  const db = getDb();
  const snapshot = await getDocs(collection(db, "sys_config_item"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as SysConfigItem[];
}

export async function getConfigItemsByGroup(
  groupId: string
): Promise<SysConfigItem[]> {
  const db = getDb();
  const q = query(
    collection(db, "sys_config_item"),
    where("groupId", "==", groupId)
  );
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as SysConfigItem[];

  return items.sort((a, b) => a.order - b.order);
}

export async function getConfigItem(
  key: string
): Promise<SysConfigItem | null> {
  const db = getDb();
  const q = query(collection(db, "sys_config_item"), where("key", "==", key));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  } as SysConfigItem;
}

export async function getConfigValue(key: string): Promise<string | null> {
  const item = await getConfigItem(key);
  return item?.value || null;
}

export async function createConfigItem(
  data: Omit<SysConfigItem, "id">
): Promise<string> {
  const db = getDb();
  const docRef = doc(collection(db, "sys_config_item"));
  await setDoc(docRef, {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return docRef.id;
}

export async function updateConfigItem(
  id: string,
  data: Partial<SysConfigItem>
): Promise<void> {
  const db = getDb();
  const docRef = doc(db, "sys_config_item", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function deleteConfigItem(id: string): Promise<void> {
  const db = getDb();
  const docRef = doc(db, "sys_config_item", id);
  await deleteDoc(docRef);
}
