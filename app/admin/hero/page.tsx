"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { getHeroStats, updateHeroStats } from "@/lib/firebase/services";
import { toast } from "sonner";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";

const heroStatsSchema = z.object({
  stats: z
    .array(
      z.object({
        icon: z.string().min(1, "請輸入圖標名稱"),
        value: z.string().min(1, "請輸入數值"),
        label: z.string().min(1, "請輸入標籤"),
      })
    )
    .min(1, "至少需要一個統計項目"),
});

type HeroStatsFormData = z.infer<typeof heroStatsSchema>;

const defaultStats: HeroStatsFormData = {
  stats: [
    { icon: "Home", value: "500+", label: "完成項目" },
    { icon: "Palette", value: "20年", label: "專業經驗" },
    { icon: "Sparkles", value: "98%", label: "客戶滿意度" },
  ],
};

const iconOptions = [
  "Home",
  "Palette",
  "Sparkles",
  "Users",
  "Star",
  "Award",
  "Trophy",
  "CheckCircle",
  "Heart",
  "TrendingUp",
  "Zap",
  "Target",
];

export default function HeroAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const form = useForm<HeroStatsFormData>({
    resolver: zodResolver(heroStatsSchema),
    defaultValues: defaultStats,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stats",
  });

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const stats = await getHeroStats();
      if (stats) {
        form.reset({ stats: stats.stats });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
      toast.error("載入統計失敗");
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const onSubmit = async (data: HeroStatsFormData) => {
    try {
      setSaving(true);
      await updateHeroStats(data);
      toast.success("設定已儲存");
    } catch (error) {
      console.error("Error saving stats:", error);
      toast.error("儲存失敗");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">首頁統計設定</h1>
        <p className="text-muted-foreground mt-2">管理首頁顯示的統計數據</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>統計項目</CardTitle>
                <CardDescription>管理首頁顯示的統計數據</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ icon: "Home", value: "", label: "" })}
              >
                <Plus className="mr-2 h-4 w-4" />
                新增項目
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">項目 {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`stats.${index}.icon`}>圖標名稱</Label>
                        <select
                          id={`stats.${index}.icon`}
                          {...form.register(`stats.${index}.icon`)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {iconOptions.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`stats.${index}.value`}>數值</Label>
                        <Input
                          id={`stats.${index}.value`}
                          {...form.register(`stats.${index}.value`)}
                          placeholder="例如: 500+"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`stats.${index}.label`}>標籤</Label>
                        <Input
                          id={`stats.${index}.label`}
                          {...form.register(`stats.${index}.label`)}
                          placeholder="例如: 完成項目"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {fields.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                尚無統計項目，請點擊「新增項目」按鈕新增
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                儲存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                儲存設定
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
