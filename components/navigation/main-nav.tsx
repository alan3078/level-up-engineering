"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FixedLayout } from "@/components/layout/fixed-layout";
import {
  Menu,
  X,
  Calculator,
  Home,
  Image as ImageIcon,
  Users,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfigItem } from "@/lib/hooks";
import { localizeValue, supportedLocales, type Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/providers/locale-provider";
import { useTranslations } from "next-intl";

const localeLabels: Record<Locale, string> = {
  "en-US": "Eng",
  "zh-HK": "繁中",
  "zh-CN": "简中",
};

export function MainNav() {
  const { locale, setLocale } = useLocale();
  const t = useTranslations("Navigation");
  const tc = useTranslations("Common");
  const navItems = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/calculator", label: t("calculator"), icon: Calculator },
    { href: "/portfolio", label: t("portfolio"), icon: ImageIcon },
    { href: "/about", label: t("about"), icon: Users },
    { href: "/contact", label: t("contact"), icon: MessageCircle },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: companyNameShort } = useConfigItem("company_name_short");
  const { data: companyName } = useConfigItem("company_name");

  const displayName = localizeValue(
    companyNameShort?.value ?? companyName?.value,
    locale,
    "Fung Chun Renovation"
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <FixedLayout>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/company_logo.png"
              alt={displayName}
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
            <span className="hidden sm:inline text-xl font-bold">{displayName}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div
              aria-label={tc("language")}
              className="flex items-center rounded-full border bg-muted/60 p-0.5 shadow-sm"
            >
              {supportedLocales.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLocale(item)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold transition-all",
                    locale === item
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {localeLabels[item]}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </FixedLayout>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <FixedLayout>
            <div className="py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="flex items-center justify-between border-t pt-4 mt-3">
                <span className="text-sm font-medium text-muted-foreground">
                  {tc("language")}
                </span>
                <div className="flex rounded-full border bg-muted/60 p-0.5">
                  {supportedLocales.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLocale(item)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                        locale === item
                          ? "bg-background text-primary shadow-sm"
                          : "text-muted-foreground"
                      )}
                    >
                      {localeLabels[item]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FixedLayout>
        </div>
      )}
    </nav>
  );
}
