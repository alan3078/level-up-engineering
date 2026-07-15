"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import type { Locale } from "@/lib/i18n";
import enUS from "@/messages/en-US.json";
import zhHK from "@/messages/zh-HK.json";
import zhCN from "@/messages/zh-CN.json";

const messages = { "en-US": enUS, "zh-HK": zhHK, "zh-CN": zhCN };

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({
  locale: "en-US",
  setLocale: () => undefined,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en-US";
    const saved = window.localStorage.getItem("site-locale");
    return saved === "zh-HK" || saved === "zh-CN" ? saved : "en-US";
  });

  const updateLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    window.localStorage.setItem("site-locale", nextLocale);
    document.documentElement.lang = nextLocale;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: updateLocale }}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages[locale]}
        timeZone="Asia/Hong_Kong"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
