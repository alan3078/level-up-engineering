"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { isAdmin, checkAdminSession } from "@/lib/auth/admin";
import { useSafeAuthState } from "@/lib/hooks/use-safe-auth-state";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Settings, Users, FileText, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [user, loading] = useSafeAuthState(auth);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!loading && user) {
        const adminStatus = await isAdmin(user);
        setIsAdminUser(adminStatus);

        if (!adminStatus && !checkAdminSession()) {
          toast.error("權限不足", {
            description: "您沒有訪問此頁面的權限",
          });
          router.push("/admin/login");
        }
      } else if (!loading && !user) {
        router.push("/admin/login");
      }
      setChecking(false);
    };

    checkAdmin();
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  if (!isAdminUser && !checkAdminSession()) {
    return null;
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="opacity-50 cursor-not-allowed">
          <div className="pointer-events-none">
            <CardHeader>
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <CardTitle className="text-muted-foreground">項目管理</CardTitle>
              <CardDescription>管理作品集項目</CardDescription>
            </CardHeader>
          </div>
        </Card>

        <Card className="opacity-50 cursor-not-allowed">
          <div className="pointer-events-none">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-muted-foreground mb-2" />
              <CardTitle className="text-muted-foreground">報價管理</CardTitle>
              <CardDescription>查看和管理報價記錄</CardDescription>
            </CardHeader>
          </div>
        </Card>

        <Card className="opacity-50 cursor-not-allowed">
          <div className="pointer-events-none">
            <CardHeader>
              <Users className="h-10 w-10 text-muted-foreground mb-2" />
              <CardTitle className="text-muted-foreground">用戶管理</CardTitle>
              <CardDescription>管理用戶帳號</CardDescription>
            </CardHeader>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/settings">
            <CardHeader>
              <Settings className="h-10 w-10 text-primary mb-2" />
              <CardTitle>系統設置</CardTitle>
              <CardDescription>網站配置和設置</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
}
