"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getConfigGroups,
  getConfigItems,
  updateConfigItem,
  initializeDefaultConfig,
  ConfigGroup,
  ConfigItem,
} from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Save, RefreshCw, Loader2, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toI18nField, type I18nField } from "@/lib/i18n";

export default function SettingsPage() {
  const [groups, setGroups] = useState<ConfigGroup[]>([]);
  const [itemsByGroup, setItemsByGroup] = useState<
    Record<string, ConfigItem[]>
  >({});
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  const loadConfig = useCallback(async () => {
    try {
      setLoadingConfig(true);
      // Initialize default config if needed
      await initializeDefaultConfig();

      const configGroups = await getConfigGroups();
      setGroups(configGroups);

      if (configGroups.length > 0 && !activeTab) {
        setActiveTab(configGroups[0].id || "");
      }

      // Load items for each group and remove duplicates
      const itemsMap: Record<string, ConfigItem[]> = {};
      for (const group of configGroups) {
        if (group.id) {
          const items = await getConfigItems(group.id);
          // Remove duplicates by key (keep the first one)
          const seenKeys = new Set<string>();
          const uniqueItems = items.filter((item) => {
            if (seenKeys.has(item.key)) {
              return false;
            }
            seenKeys.add(item.key);
            return true;
          });
          itemsMap[group.id] = uniqueItems;
        }
      }
      setItemsByGroup(itemsMap);
    } catch (error) {
      console.error("Error loading config:", error);
      toast.error("載入設置失敗", {
        description: error instanceof Error ? error.message : "未知錯誤",
      });
    } finally {
      setLoadingConfig(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleValueChange = (
    itemId: string,
    newValue: string | number | boolean
  ) => {
    setItemsByGroup((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((groupId) => {
        updated[groupId] = updated[groupId].map((item) =>
          item.id === itemId ? { ...item, value: newValue } : item
        );
      });
      return updated;
    });
  };

  const handleI18nValueChange = (
    itemId: string,
    field: "value" | "zh-HK" | "zh-CN",
    nextValue: string
  ) => {
    setItemsByGroup((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((groupId) => {
        updated[groupId] = updated[groupId].map((item) => {
          if (item.id !== itemId) return item;
          const value = toI18nField(item.value) as I18nField<string>;
          return {
            ...item,
            value:
              field === "value"
                ? { ...value, value: nextValue }
                : { ...value, i18n: { ...value.i18n, [field]: nextValue || null } },
          };
        });
      });
      return updated;
    });
  };

  const handleSave = async (groupId: string) => {
    try {
      setSaving(true);
      const items = itemsByGroup[groupId] || [];

      for (const item of items) {
        if (item.id) {
          await updateConfigItem(item.id, item.value);
        }
      }

      toast.success("設置已保存", {
        description: "配置已成功更新",
      });
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("保存失敗", {
        description: error instanceof Error ? error.message : "未知錯誤",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);

      for (const group of groups) {
        if (group.id) {
          const items = itemsByGroup[group.id] || [];
          for (const item of items) {
            if (item.id) {
              await updateConfigItem(item.id, item.value);
            }
          }
        }
      }

      toast.success("所有設置已保存", {
        description: "所有配置已成功更新",
      });
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("保存失敗", {
        description: error instanceof Error ? error.message : "未知錯誤",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loadingConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">載入設置中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            系統設置
          </h1>
          <p className="text-muted-foreground mt-2">管理網站的所有配置選項</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={loadConfig}
            variant="outline"
            disabled={loadingConfig}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loadingConfig ? "animate-spin" : ""}`}
            />
            重新載入
          </Button>
          <Button onClick={handleSaveAll} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "保存中..." : "保存所有"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <TabsTrigger key={group.id} value={group.id || ""}>
              {group.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {groups.map((group) => (
          <TabsContent key={group.id} value={group.id || ""} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{group.label}</CardTitle>
                    {group.description && (
                      <CardDescription className="mt-2">
                        {group.description}
                      </CardDescription>
                    )}
                  </div>
                  <Button
                    onClick={() => handleSave(group.id || "")}
                    disabled={saving}
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    保存
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {itemsByGroup[group.id || ""]?.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <Label htmlFor={item.id}>
                      {item.label}
                      {item.description && (
                        <span className="text-muted-foreground text-sm ml-2">
                          ({item.description})
                        </span>
                      )}
                    </Label>

                    {(item.type === "text" || item.type === "textarea") && (() => {
                      const value = toI18nField(item.value) as I18nField<string>;
                      const Field = item.type === "textarea" ? Textarea : Input;
                      return (
                        <div className="grid gap-3 rounded-lg border bg-muted/20 p-3 sm:grid-cols-3">
                          {(["value", "zh-HK", "zh-CN"] as const).map((locale) => (
                            <div key={locale} className="space-y-1">
                              <Label className="text-xs">{locale === "value" ? "English" : locale === "zh-HK" ? "繁中" : "简中"}</Label>
                              <Field
                                value={locale === "value" ? value.value : value.i18n?.[locale] ?? ""}
                                onChange={(event) => handleI18nValueChange(item.id || "", locale, event.target.value)}
                                rows={item.type === "textarea" ? 3 : undefined}
                              />
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {item.type === "number" && (
                      <Input
                        id={item.id}
                        type="number"
                        value={item.value as number}
                        onChange={(e) =>
                          handleValueChange(
                            item.id || "",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    )}

                    {item.type === "boolean" && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={item.id}
                          checked={item.value as boolean}
                          onCheckedChange={(checked) =>
                            handleValueChange(item.id || "", checked)
                          }
                        />
                        <Label htmlFor={item.id} className="cursor-pointer">
                          {item.value ? "啟用" : "停用"}
                        </Label>
                      </div>
                    )}

                    {item.type === "select" && item.options && (
                      <Select
                        value={item.value as string}
                        onValueChange={(value) =>
                          handleValueChange(item.id || "", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {item.type === "json" && (
                      <Textarea
                        id={item.id}
                        value={JSON.stringify(item.value, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            handleValueChange(item.id || "", parsed);
                          } catch {
                            // Invalid JSON, keep as string
                            handleValueChange(item.id || "", e.target.value);
                          }
                        }}
                        rows={6}
                        className="font-mono text-sm"
                      />
                    )}
                  </div>
                ))}

                {(!itemsByGroup[group.id || ""] ||
                  itemsByGroup[group.id || ""].length === 0) && (
                  <p className="text-muted-foreground text-center py-8">
                    此組別暫無配置項
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
