"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Settings,
  Calculator,
  Users,
  Image as ImageIcon,
  Star,
  Home,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useConfigItem } from "@/lib/hooks";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // Use safe auth state hook that handles undefined auth
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const isLoginPage = pathname === "/admin/login";
  
  // Get company name from config
  const { data: companyNameShort } = useConfigItem("company_name_short");
  const { data: companyName } = useConfigItem("company_name");
  
  const displayName =
    companyNameShort && typeof companyNameShort.value === "string"
      ? companyNameShort.value
      : companyName && typeof companyName.value === "string"
        ? companyName.value
        : "豐進裝修工程";

  useEffect(() => {
    // Don't check authentication on login page
    if (isLoginPage) {
      // Use setTimeout to avoid calling setState synchronously in effect
      setTimeout(() => {
        setAuthenticated(true);
        setChecking(false);
      }, 0);
      return;
    }

    const checkAuth = async () => {
      if (!supabase) {
        toast.error("Supabase 未初始化");
        router.push("/admin/login");
        setChecking(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) setAuthenticated(true);
      else router.push("/admin/login");
      setChecking(false);
    };

    checkAuth();
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    try {
      if (supabase) await supabase.auth.signOut();
      toast.success("已登出");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("登出失敗");
    }
  };

  // Show login page without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const navItems = [
    { href: "/admin", label: "儀表板", icon: Home },
    { href: "/admin/calculator", label: "計算器設定", icon: Calculator },
    { href: "/admin/services", label: "服務項目", icon: Settings },
    { href: "/admin/testimonials", label: "客戶評價", icon: Star },
    { href: "/admin/portfolio", label: "作品集", icon: ImageIcon },
    { href: "/admin/hero", label: "首頁統計", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image
              src="/company_logo.png"
              alt={displayName}
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">{displayName}</h1>
              <span className="text-xs text-muted-foreground">CMS 管理後台</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              管理員
            </span>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-6 px-4 py-6">
        <aside className="w-64 border-r pr-6">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
