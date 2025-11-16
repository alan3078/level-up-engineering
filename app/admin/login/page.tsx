"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("請輸入有效的電郵地址"),
  password: z.string().min(6, "密碼至少需要6個字符"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@system.com",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Check if Firebase is configured
    if (!auth) {
      toast.error("Firebase 未初始化", {
        description:
          "請檢查 Firebase 配置。如果尚未配置，請先設置 .env.local 文件。",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);

      // Check if user is admin
      const isAdmin = data.email === "admin@system.com";

      if (isAdmin) {
        // Store admin status in both keys for compatibility
        sessionStorage.setItem("isAdmin", "true");
        sessionStorage.setItem("admin_authenticated", "true");
        sessionStorage.setItem("userEmail", data.email);

        toast.success("登入成功", {
          description: "歡迎回來！",
        });

        router.push("/admin");
      } else {
        toast.error("權限不足", {
          description: "您沒有管理員權限",
        });
        await auth.signOut();
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      let errorMessage = "登錄失敗，請稍後再試";

      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === "auth/user-not-found") {
          errorMessage = "用戶不存在";
        } else if (firebaseError.code === "auth/wrong-password") {
          errorMessage = "密碼錯誤";
        } else if (firebaseError.code === "auth/invalid-email") {
          errorMessage = "無效的電郵地址";
        }
      }

      toast.error("登錄失敗", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">管理員登入</CardTitle>
          <CardDescription className="text-center">
            請使用管理員帳號登錄以訪問管理後台
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">電郵地址</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@system.com"
                {...form.register("email")}
                disabled={isLoading}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密碼</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
                disabled={isLoading}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登入中...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  登入
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
