import { requireSupabase } from "./client";
import type {
  CalculatorPricing,
  HeroStats,
  PortfolioProject,
  Service,
  Testimonial,
} from "@/lib/types";
import { toI18nField, type Localized } from "@/lib/i18n";

export interface ConfigItem {
  id?: string;
  group_id: string;
  key: string;
  value: string | number | boolean | object;
  label: string;
  description?: string;
  type: "text" | "number" | "boolean" | "json" | "textarea" | "image" | "select";
  options?: { label: string; value: string }[];
  order: number;
}

export interface ConfigGroup {
  id?: string;
  name: string;
  label: string;
  description?: string;
  order: number;
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function localizedFields<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[]
) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) =>
      fields.includes(key as keyof T) && value !== undefined
        ? [key, toI18nField(value as Localized)]
        : [key, value]
    )
  );
}

export async function getServices(): Promise<Service[]> {
  const { data, error } = await requireSupabase().from("services").select("*").order("order");
  if (error) return [];
  return (data ?? []) as Service[];
}
export async function createService(data: Omit<Service, "id" | "createdAt" | "updatedAt">) {
  const { data: row, error } = await requireSupabase().from("services").insert(localizedFields(data, ["title", "description"])).select("id").single();
  throwIfError(error); return row!.id as string;
}
export async function updateService(id: string, data: Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>) {
  const { error } = await requireSupabase().from("services").update(localizedFields(data, ["title", "description"])).eq("id", id); throwIfError(error);
}
export async function deleteService(id: string) { const { error } = await requireSupabase().from("services").delete().eq("id", id); throwIfError(error); }

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await requireSupabase().from("testimonials").select("*").order("order");
  if (error) return []; return (data ?? []) as Testimonial[];
}
export async function createTestimonial(data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">) {
  const { data: row, error } = await requireSupabase().from("testimonials").insert(localizedFields(data, ["comment"])).select("id").single(); throwIfError(error); return row!.id as string;
}
export async function updateTestimonial(id: string, data: Partial<Omit<Testimonial, "id" | "createdAt" | "updatedAt">>) { const { error } = await requireSupabase().from("testimonials").update(localizedFields(data, ["comment"])).eq("id", id); throwIfError(error); }
export async function deleteTestimonial(id: string) { const { error } = await requireSupabase().from("testimonials").delete().eq("id", id); throwIfError(error); }

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const { data, error } = await requireSupabase().from("portfolio").select("*").order("order"); if (error) return []; return (data ?? []) as PortfolioProject[];
}
export async function createPortfolioProject(data: Omit<PortfolioProject, "id" | "createdAt" | "updatedAt">) { const { data: row, error } = await requireSupabase().from("portfolio").insert(localizedFields(data, ["title", "budgetRange", "style", "description"])).select("id").single(); throwIfError(error); return row!.id as string; }
export async function updatePortfolioProject(id: string, data: Partial<Omit<PortfolioProject, "id" | "createdAt" | "updatedAt">>) { const { error } = await requireSupabase().from("portfolio").update(localizedFields(data, ["title", "budgetRange", "style", "description"])).eq("id", id); throwIfError(error); }
export async function deletePortfolioProject(id: string) { const { error } = await requireSupabase().from("portfolio").delete().eq("id", id); throwIfError(error); }

export async function getCalculatorPricing(): Promise<CalculatorPricing | null> { const { data, error } = await requireSupabase().from("calculator_pricing").select("*").eq("id", "pricing").maybeSingle(); if (error) return null; return data as CalculatorPricing | null; }
export async function updateCalculatorPricing(data: Omit<CalculatorPricing, "id" | "updatedAt">) { const { error } = await requireSupabase().from("calculator_pricing").upsert({ id: "pricing", ...data }, { onConflict: "id" }); throwIfError(error); }

export async function getHeroStats(): Promise<HeroStats | null> { const { data, error } = await requireSupabase().from("hero_stats").select("*").eq("id", "stats").maybeSingle(); if (error) return null; return data as HeroStats | null; }
export async function updateHeroStats(data: Omit<HeroStats, "id" | "updatedAt">) { const { error } = await requireSupabase().from("hero_stats").upsert({ id: "stats", ...data }, { onConflict: "id" }); throwIfError(error); }

export async function getConfigGroups(): Promise<ConfigGroup[]> { const { data, error } = await requireSupabase().from("config_groups").select("*").order("order"); if (error) return []; return (data ?? []) as ConfigGroup[]; }
export async function getConfigItems(groupId: string): Promise<ConfigItem[]> { const { data, error } = await requireSupabase().from("config_items").select("*").eq("group_id", groupId).order("order"); if (error) return []; return (data ?? []) as ConfigItem[]; }
export async function getAllConfigItems(): Promise<ConfigItem[]> { const { data, error } = await requireSupabase().from("config_items").select("*").order("order"); if (error) return []; return (data ?? []) as ConfigItem[]; }
export async function getConfigItemByKey(key: string): Promise<ConfigItem | null> { const { data, error } = await requireSupabase().from("config_items").select("*").eq("key", key).maybeSingle(); if (error) return null; return data as ConfigItem | null; }
export async function updateConfigItem(itemId: string, value: ConfigItem["value"]) { const { error } = await requireSupabase().from("config_items").update({ value }).eq("id", itemId); throwIfError(error); }
export async function createConfigGroup(group: Omit<ConfigGroup, "id">) { const { data, error } = await requireSupabase().from("config_groups").insert(group).select("id").single(); throwIfError(error); return data!.id as string; }
export async function createConfigItem(item: Omit<ConfigItem, "id">) { const { data, error } = await requireSupabase().from("config_items").insert(item).select("id").single(); throwIfError(error); return data!.id as string; }
export async function deleteConfigItem(itemId: string) { const { error } = await requireSupabase().from("config_items").delete().eq("id", itemId); throwIfError(error); }

export async function initializeDefaultConfig(): Promise<void> {
  const client = requireSupabase();
  const { count, error } = await client.from("config_groups").select("id", { count: "exact", head: true });
  throwIfError(error);
  if (!count) {
    const { error: seedError } = await client.rpc("seed_default_config");
    throwIfError(seedError);
  }
}
