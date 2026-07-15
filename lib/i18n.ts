export const supportedLocales = ["en-US", "zh-HK", "zh-CN"] as const;
export type Locale = (typeof supportedLocales)[number];

export interface I18nField<T = string> {
  value: T;
  i18n?: Partial<Record<Exclude<Locale, "en-US">, T | null>>;
}

export type Localized<T = string> = T | I18nField<T>;

export function isI18nField<T>(value: Localized<T>): value is I18nField<T> {
  return typeof value === "object" && value !== null && "value" in value;
}

export function localize<T>(value: Localized<T>, locale: Locale): T {
  if (!isI18nField(value)) return value;
  return (locale === "en-US" ? value.value : value.i18n?.[locale] ?? value.value) as T;
}

export function toI18nField<T>(value: Localized<T>): I18nField<T> {
  return isI18nField(value) ? value : { value };
}

export function localizeValue(
  value: unknown,
  locale: Locale,
  fallback: string
): string {
  if (typeof value === "string") return value;
  if (isI18nField<string>(value as Localized<string>)) {
    return localize(value as Localized<string>, locale);
  }
  return fallback;
}
