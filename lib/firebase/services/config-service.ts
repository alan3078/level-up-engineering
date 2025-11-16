import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { getDb } from "../config";

export interface ConfigItem {
  id?: string;
  group_id: string;
  key: string;
  value: string | number | boolean | object;
  label: string;
  description?: string;
  type:
    | "text"
    | "number"
    | "boolean"
    | "json"
    | "textarea"
    | "image"
    | "select";
  options?: { label: string; value: string }[];
  order: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ConfigGroup {
  id?: string;
  name: string;
  label: string;
  description?: string;
  order: number;
  created_at?: Date;
  updated_at?: Date;
}

// Get all config groups
export async function getConfigGroups(): Promise<ConfigGroup[]> {
  const db = getDb();
  const q = query(collection(db, "sys_config_group"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ConfigGroup[];
}

// Get config items by group
export async function getConfigItems(groupId: string): Promise<ConfigItem[]> {
  const db = getDb();
  const q = query(
    collection(db, "sys_config_item"),
    where("group_id", "==", groupId),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ConfigItem[];
}

// Get all config items
export async function getAllConfigItems(): Promise<ConfigItem[]> {
  const db = getDb();
  const q = query(collection(db, "sys_config_item"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ConfigItem[];
}

// Get config item by key
export async function getConfigItemByKey(
  key: string
): Promise<ConfigItem | null> {
  const db = getDb();
  const q = query(collection(db, "sys_config_item"), where("key", "==", key));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as ConfigItem;
}

// Update config item
export async function updateConfigItem(
  itemId: string,
  value: string | number | boolean | object
): Promise<void> {
  const db = getDb();
  const itemRef = doc(db, "sys_config_item", itemId);
  await updateDoc(itemRef, {
    value,
    updated_at: new Date(),
  });
}

// Create config group
export async function createConfigGroup(
  group: Omit<ConfigGroup, "id">
): Promise<string> {
  const db = getDb();
  const groupRef = doc(collection(db, "sys_config_group"));
  await setDoc(groupRef, {
    ...group,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return groupRef.id;
}

// Create config item
export async function createConfigItem(
  item: Omit<ConfigItem, "id">
): Promise<string> {
  const db = getDb();
  const itemRef = doc(collection(db, "sys_config_item"));
  await setDoc(itemRef, {
    ...item,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return itemRef.id;
}

// Delete config item
export async function deleteConfigItem(itemId: string): Promise<void> {
  const db = getDb();
  const itemRef = doc(db, "sys_config_item", itemId);
  await deleteDoc(itemRef);
}

// Remove duplicate config items (keep the first one for each key)
export async function removeDuplicateConfigItems(): Promise<void> {
  const allItems = await getAllConfigItems();
  const keyMap = new Map<string, ConfigItem[]>();

  // Group items by key
  for (const item of allItems) {
    if (!keyMap.has(item.key)) {
      keyMap.set(item.key, []);
    }
    keyMap.get(item.key)!.push(item);
  }

  // For each key with duplicates, keep the first one and delete the rest
  for (const [, items] of keyMap.entries()) {
    if (items.length > 1) {
      // Sort by created_at if available, otherwise keep the first one
      const sortedItems = items.sort((a, b) => {
        const aTime = a.created_at instanceof Date ? a.created_at.getTime() : 0;
        const bTime = b.created_at instanceof Date ? b.created_at.getTime() : 0;
        return aTime - bTime;
      });

      // Keep the first one, delete the rest
      for (let i = 1; i < sortedItems.length; i++) {
        if (sortedItems[i].id) {
          await deleteConfigItem(sortedItems[i].id!);
        }
      }
    }
  }
}

// Initialize default config groups and items
export async function initializeDefaultConfig(): Promise<void> {
  // Check if config already exists
  const existingGroups = await getConfigGroups();

  let companyGroupId: string;
  let siteGroupId: string;
  let calculatorGroupId: string;
  let contactGroupId: string;

  if (existingGroups.length > 0) {
    // Find existing groups
    const companyGroup = existingGroups.find((g) => g.name === "company");
    const siteGroup = existingGroups.find((g) => g.name === "site");
    const calculatorGroup = existingGroups.find((g) => g.name === "calculator");
    const contactGroup = existingGroups.find((g) => g.name === "contact");

    companyGroupId = companyGroup?.id || "";
    siteGroupId = siteGroup?.id || "";
    calculatorGroupId = calculatorGroup?.id || "";
    contactGroupId = contactGroup?.id || "";
  } else {
    // Create default groups
    companyGroupId = await createConfigGroup({
      name: "company",
      label: "公司資訊",
      description: "公司基本資訊設置",
      order: 1,
    });

    siteGroupId = await createConfigGroup({
      name: "site",
      label: "網站設置",
      description: "網站基本設置",
      order: 2,
    });

    calculatorGroupId = await createConfigGroup({
      name: "calculator",
      label: "計算器設置",
      description: "裝修成本計算器設置",
      order: 3,
    });

    contactGroupId = await createConfigGroup({
      name: "contact",
      label: "聯絡方式",
      description: "聯絡資訊設置",
      order: 4,
    });
  }

  // Create default config items
  const defaultItems: Omit<ConfigItem, "id">[] = [
    // Company info
    {
      group_id: companyGroupId,
      key: "company_name",
      value: "豐進裝修工程有限公司",
      label: "公司名稱",
      description: "公司全名",
      type: "text",
      order: 1,
    },
    {
      group_id: companyGroupId,
      key: "company_name_short",
      value: "豐進裝修工程",
      label: "公司簡稱",
      description: "公司簡短名稱",
      type: "text",
      order: 2,
    },
    {
      group_id: companyGroupId,
      key: "company_description",
      value:
        "豐進工程有限公司\n\n- 多年裝修經驗 信心保證 -\n\n承接大小工程，室內裝修設計，訂造/安裝傢俬\n\n服務承諾：免費上門度尺報價，絕不含隱藏收費，明碼實價，\n親力親為，包半年保養，絕不爛尾\n\n-請WhatsApp 64798033查詢-",
      label: "關於我們內容",
      description: "關於我們頁面顯示的完整內容（支援換行）",
      type: "textarea",
      order: 3,
    },
    // Site settings
    {
      group_id: siteGroupId,
      key: "site_title",
      value: "豐進裝修工程有限公司 - 專業裝修服務",
      label: "網站標題",
      description: "網站 SEO 標題",
      type: "text",
      order: 1,
    },
    {
      group_id: siteGroupId,
      key: "site_description",
      value:
        "豐進裝修工程有限公司 - 香港專業裝修公司，提供全屋裝修、室內設計、訂造傢俬等服務",
      label: "網站描述",
      description: "網站 SEO 描述",
      type: "textarea",
      order: 2,
    },
    {
      group_id: siteGroupId,
      key: "hero_title",
      value: "專業裝修服務",
      label: "首頁標題",
      description: "首頁 Hero 區域標題",
      type: "text",
      order: 3,
    },
    {
      group_id: siteGroupId,
      key: "hero_subtitle",
      value: "為您打造理想家居",
      label: "首頁副標題",
      description: "首頁 Hero 區域副標題",
      type: "text",
      order: 4,
    },
    // Calculator settings
    {
      group_id: calculatorGroupId,
      key: "calculator_base_price",
      value: 800,
      label: "基礎單價",
      description: "每平方呎基礎裝修價格（港幣）",
      type: "number",
      order: 1,
    },
    {
      group_id: calculatorGroupId,
      key: "calculator_min_price",
      value: 600,
      label: "最低單價",
      description: "每平方呎最低裝修價格（港幣）",
      type: "number",
      order: 2,
    },
    {
      group_id: calculatorGroupId,
      key: "calculator_max_price",
      value: 1200,
      label: "最高單價",
      description: "每平方呎最高裝修價格（港幣）",
      type: "number",
      order: 3,
    },
    // Contact settings
    {
      group_id: contactGroupId,
      key: "contact_phone",
      value: "+852 1234 5678",
      label: "電話",
      description: "聯絡電話",
      type: "text",
      order: 1,
    },
    {
      group_id: contactGroupId,
      key: "contact_email",
      value: "info@example.com",
      label: "電郵",
      description: "聯絡電郵",
      type: "text",
      order: 2,
    },
    {
      group_id: contactGroupId,
      key: "contact_address",
      value: "香港九龍",
      label: "地址",
      description: "公司地址",
      type: "textarea",
      order: 3,
    },
    {
      group_id: contactGroupId,
      key: "contact_whatsapp",
      value: "+852 1234 5678",
      label: "WhatsApp",
      description: "WhatsApp 聯絡號碼",
      type: "text",
      order: 4,
    },
    {
      group_id: contactGroupId,
      key: "contact_whatsapp_message",
      value: "您好，我想查詢裝修服務。",
      label: "WhatsApp 預設訊息",
      description: "點擊 WhatsApp 連結時預填的訊息",
      type: "textarea",
      order: 5,
    },
  ];

  // Remove duplicates first
  await removeDuplicateConfigItems();

  // Check existing items and only create missing ones
  const existingItems = await getAllConfigItems();
  const existingKeys = new Set(existingItems.map((item) => item.key));

  for (const item of defaultItems) {
    // Only create if the key doesn't exist
    if (!existingKeys.has(item.key)) {
      await createConfigItem(item);
    }
  }
}
