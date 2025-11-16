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

const navItems = [
  { href: "/", label: "首頁", icon: Home },
  { href: "/calculator", label: "成本計算器", icon: Calculator },
  { href: "/portfolio", label: "作品集", icon: ImageIcon },
  { href: "/about", label: "關於我們", icon: Users },
  { href: "/contact", label: "聯絡我們", icon: MessageCircle },
];

export function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: companyNameShort } = useConfigItem("company_name_short");
  const { data: companyName } = useConfigItem("company_name");

  const displayName =
    companyNameShort && typeof companyNameShort.value === "string"
      ? companyNameShort.value
      : companyName && typeof companyName.value === "string"
        ? companyName.value
        : "豐進裝修工程";

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
            </div>
          </FixedLayout>
        </div>
      )}
    </nav>
  );
}
