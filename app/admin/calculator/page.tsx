"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { Separator } from "@/components/ui/separator";
import { Stepper } from "@/components/ui/stepper";
import { Badge } from "@/components/ui/badge";
import { useCalculatorPricing, useUpdateCalculatorPricing } from "@/lib/hooks";
import { FixedLayout } from "@/components/layout/fixed-layout";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import type {
  PropertyType,
  MaterialQuality,
  RenovationScope,
} from "@/lib/types";

const calculatorPricingSchema = z.object({
  basePricePerSqft: z.object({
    公屋: z.number().min(0),
    居屋: z.number().min(0),
    私樓: z.number().min(0),
    村屋: z.number().min(0),
  }),
  qualityMultipliers: z.object({
    基本: z.number().min(0),
    標準: z.number().min(0),
    豪華: z.number().min(0),
  }),
  scopeMultipliers: z.object({
    全屋: z.number().min(0),
    局部裝修: z.number().min(0),
  }),
  roomBaseCosts: z.object({
    bedroom: z.number().min(0),
    livingRoom: z.number().min(0),
    kitchen: z.number().min(0),
    bathroom: z.number().min(0),
  }),
  specialRequirementGroups: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      order: z.number(),
      items: z.array(
        z.object({
          id: z.string(),
          name: z.string().min(1),
          cost: z.number().min(0),
          order: z.number(),
        })
      ),
    })
  ),
  variance: z.number().min(0).max(1),
});

type CalculatorPricingFormData = z.infer<typeof calculatorPricingSchema>;

const defaultPricing: CalculatorPricingFormData = {
  basePricePerSqft: {
    公屋: 800,
    居屋: 1000,
    私樓: 1200,
    村屋: 900,
  },
  qualityMultipliers: {
    基本: 0.8,
    標準: 1.0,
    豪華: 1.5,
  },
  scopeMultipliers: {
    全屋: 1.0,
    局部裝修: 0.6,
  },
  roomBaseCosts: {
    bedroom: 15000,
    livingRoom: 25000,
    kitchen: 30000,
    bathroom: 20000,
  },
  specialRequirementGroups: [
    {
      id: "1",
      name: "結構改動",
      order: 0,
      items: [
        { id: "1-1", name: "拆牆", cost: 5000, order: 0 },
        { id: "1-2", name: "加建牆壁", cost: 8000, order: 1 },
      ],
    },
    {
      id: "2",
      name: "水電工程",
      order: 1,
      items: [
        { id: "2-1", name: "水電改動", cost: 15000, order: 0 },
        { id: "2-2", name: "全屋換線", cost: 25000, order: 1 },
      ],
    },
    {
      id: "3",
      name: "傢俬訂造",
      order: 2,
      items: [
        { id: "3-1", name: "訂造傢俬", cost: 30000, order: 0 },
        { id: "3-2", name: "廚櫃訂造", cost: 20000, order: 1 },
      ],
    },
  ],
  variance: 0.2,
};

const STEPS = [
  "物業資料",
  "房間配置",
  "裝修範圍",
  "材料級別",
  "特殊要求",
  "其他設定",
];

export default function CalculatorAdminPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { data: pricing, isLoading } = useCalculatorPricing();
  const updatePricing = useUpdateCalculatorPricing();

  const form = useForm<CalculatorPricingFormData>({
    resolver: zodResolver(calculatorPricingSchema),
    defaultValues: defaultPricing,
  });

  const specialRequirementGroups = useWatch({
    control: form.control,
    name: "specialRequirementGroups",
  });

  useEffect(() => {
    if (pricing) {
      form.reset({
        basePricePerSqft: pricing.basePricePerSqft,
        qualityMultipliers: pricing.qualityMultipliers,
        scopeMultipliers: pricing.scopeMultipliers,
        roomBaseCosts: pricing.roomBaseCosts,
        specialRequirementGroups: pricing.specialRequirementGroups || [],
        variance: pricing.variance,
      });
    }
  }, [pricing, form]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: CalculatorPricingFormData) => {
    try {
      await updatePricing.mutateAsync(data);
      toast.success("設定已儲存");
    } catch (error) {
      console.error("Error saving pricing:", error);
      toast.error("儲存失敗");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <FixedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">計算器價格設定</h1>
          <p className="text-muted-foreground mt-2">
            管理裝修成本計算器的價格配置和倍數設定
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">價格配置</CardTitle>
            <CardDescription>為每個步驟配置對應的價格設定</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Stepper steps={STEPS} currentStep={currentStep} />
            <Separator />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Property Information */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Separator className="flex-1" />
                      <Badge
                        variant="secondary"
                        className="px-4 py-1.5 text-sm font-semibold"
                      >
                        User
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                      <div className="space-y-2">
                        <Label>物業類型</Label>
                        <div className="text-sm text-muted-foreground">
                          用戶可選擇：公屋、居屋、私樓、村屋
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>實用面積 (平方呎)</Label>
                        <div className="text-sm text-muted-foreground">
                          用戶輸入：100 - 5000 平方呎
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Separator className="flex-1" />
                      <Badge
                        variant="default"
                        className="px-4 py-1.5 text-sm font-semibold"
                      >
                        Admin
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    <div className="space-y-4">
                      <Label>每平方呎基礎價格 (HKD)</Label>
                      {(["公屋", "居屋", "私樓", "村屋"] as PropertyType[]).map(
                        (type) => (
                          <div key={type} className="space-y-2">
                            <Label
                              htmlFor={`basePrice-${type}`}
                              className="text-sm"
                            >
                              {type}
                            </Label>
                            <Input
                              id={`basePrice-${type}`}
                              type="number"
                              {...form.register(`basePricePerSqft.${type}`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Room Configuration */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Separator className="flex-1" />
                      <Badge
                        variant="secondary"
                        className="px-4 py-1.5 text-sm font-semibold"
                      >
                        User
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>睡房數量</Label>
                          <div className="text-sm text-muted-foreground">
                            0 - 10
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>客廳數量</Label>
                          <div className="text-sm text-muted-foreground">
                            0 - 5
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>廚房數量</Label>
                          <div className="text-sm text-muted-foreground">
                            0 - 3
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>浴室數量</Label>
                          <div className="text-sm text-muted-foreground">
                            0 - 5
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Separator className="flex-1" />
                      <Badge
                        variant="default"
                        className="px-4 py-1.5 text-sm font-semibold"
                      >
                        Admin
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    <div className="space-y-4">
                      <Label>房間基礎成本 (HKD)</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bedroom" className="text-sm">
                            睡房
                          </Label>
                          <Input
                            id="bedroom"
                            type="number"
                            {...form.register("roomBaseCosts.bedroom", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="livingRoom" className="text-sm">
                            客廳
                          </Label>
                          <Input
                            id="livingRoom"
                            type="number"
                            {...form.register("roomBaseCosts.livingRoom", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="kitchen" className="text-sm">
                            廚房
                          </Label>
                          <Input
                            id="kitchen"
                            type="number"
                            {...form.register("roomBaseCosts.kitchen", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bathroom" className="text-sm">
                            浴室
                          </Label>
                          <Input
                            id="bathroom"
                            type="number"
                            {...form.register("roomBaseCosts.bathroom", {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Renovation Scope */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Separator className="flex-1" />
                      <Badge
                        variant="secondary"
                        className="px-4 py-1.5 text-sm font-semibold"
                      >
                        User
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                      <div className="space-y-2">
                        <Label>裝修範圍</Label>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>• 全屋裝修</div>
                          <div>• 局部裝修</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Separator className="flex-1" />
                      <Badge
                        variant="default"
                        className="px-4 py-1.5 text-sm font-semibold"
                      >
                        Admin
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    <div className="space-y-4">
                      <Label>裝修範圍倍數</Label>
                      {(["全屋", "局部裝修"] as RenovationScope[]).map(
                        (scope) => (
                          <div key={scope} className="space-y-2">
                            <Label
                              htmlFor={`scope-${scope}`}
                              className="text-sm"
                            >
                              {scope}
                            </Label>
                            <Input
                              id={`scope-${scope}`}
                              type="number"
                              step="0.1"
                              {...form.register(`scopeMultipliers.${scope}`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Material Quality */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Separator className="flex-1" />
                      <Badge
                        variant="secondary"
                        className="px-4 py-1.5 text-sm font-semibold"
                      >
                        User
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                      <div className="space-y-2">
                        <Label>材料級別</Label>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>• 基本級別</div>
                          <div>• 標準級別</div>
                          <div>• 豪華級別</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Separator className="flex-1" />
                      <Badge
                        variant="default"
                        className="px-4 py-1.5 text-sm font-semibold"
                      >
                        Admin
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    <div className="space-y-4">
                      <Label>材料級別倍數</Label>
                      {(["基本", "標準", "豪華"] as MaterialQuality[]).map(
                        (quality) => (
                          <div key={quality} className="space-y-2">
                            <Label
                              htmlFor={`quality-${quality}`}
                              className="text-sm"
                            >
                              {quality}
                            </Label>
                            <Input
                              id={`quality-${quality}`}
                              type="number"
                              step="0.1"
                              {...form.register(
                                `qualityMultipliers.${quality}`,
                                {
                                  valueAsNumber: true,
                                }
                              )}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Special Requirements */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Separator className="flex-1" />
                      <Badge
                        variant="secondary"
                        className="px-4 py-1.5 text-sm font-semibold"
                      >
                        User
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                      <div className="space-y-2">
                        <Label>特殊要求 (可選多項)</Label>
                        <div className="text-sm text-muted-foreground space-y-3">
                          {specialRequirementGroups &&
                          specialRequirementGroups.length > 0 ? (
                            specialRequirementGroups
                              .sort((a, b) => a.order - b.order)
                              .map((group) => (
                                <div key={group.id} className="space-y-1">
                                  <div className="font-semibold">
                                    {group.name}
                                  </div>
                                  {group.items
                                    .sort((a, b) => a.order - b.order)
                                    .map((item) => (
                                      <div key={item.id} className="ml-4">
                                        • {item.name}
                                      </div>
                                    ))}
                                </div>
                              ))
                          ) : (
                            <div className="text-muted-foreground/60">
                              暫無特殊要求項目
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Separator className="flex-1" />
                        <Badge
                          variant="default"
                          className="px-4 py-1.5 text-sm font-semibold"
                        >
                          Admin
                        </Badge>
                        <Separator className="flex-1" />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const current = form.getValues(
                            "specialRequirementGroups"
                          );
                          const newId = Date.now().toString();
                          form.setValue("specialRequirementGroups", [
                            ...current,
                            {
                              id: newId,
                              name: "",
                              order: current.length,
                              items: [],
                            },
                          ]);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        新增群組
                      </Button>
                    </div>
                    <div className="space-y-6">
                      {specialRequirementGroups
                        .sort((a, b) => a.order - b.order)
                        .map((group) => (
                          <Card key={group.id} className="p-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 space-y-2">
                                  <Label
                                    htmlFor={`group-name-${group.id}`}
                                    className="text-sm font-semibold"
                                  >
                                    群組名稱
                                  </Label>
                                  <Input
                                    id={`group-name-${group.id}`}
                                    value={group.name}
                                    onChange={(e) => {
                                      const current = form.getValues(
                                        "specialRequirementGroups"
                                      );
                                      form.setValue(
                                        "specialRequirementGroups",
                                        current.map((g) =>
                                          g.id === group.id
                                            ? { ...g, name: e.target.value }
                                            : g
                                        )
                                      );
                                    }}
                                    placeholder="例如：結構改動"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="ml-4"
                                  onClick={() => {
                                    const current = form.getValues(
                                      "specialRequirementGroups"
                                    );
                                    form.setValue(
                                      "specialRequirementGroups",
                                      current.filter((g) => g.id !== group.id)
                                    );
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <Separator />

                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">項目</Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const current = form.getValues(
                                        "specialRequirementGroups"
                                      );
                                      const newItemId = `${group.id}-${Date.now()}`;
                                      form.setValue(
                                        "specialRequirementGroups",
                                        current.map((g) =>
                                          g.id === group.id
                                            ? {
                                                ...g,
                                                items: [
                                                  ...g.items,
                                                  {
                                                    id: newItemId,
                                                    name: "",
                                                    cost: 0,
                                                    order: g.items.length,
                                                  },
                                                ],
                                              }
                                            : g
                                        )
                                      );
                                    }}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    新增項目
                                  </Button>
                                </div>

                                {group.items
                                  .sort((a, b) => a.order - b.order)
                                  .map((item) => (
                                    <div
                                      key={item.id}
                                      className="grid grid-cols-12 gap-4 items-end p-3 bg-muted/30 rounded-lg"
                                    >
                                      <div className="col-span-5 space-y-2">
                                        <Label
                                          htmlFor={`item-name-${item.id}`}
                                          className="text-xs"
                                        >
                                          名稱
                                        </Label>
                                        <Input
                                          id={`item-name-${item.id}`}
                                          value={item.name}
                                          onChange={(e) => {
                                            const current = form.getValues(
                                              "specialRequirementGroups"
                                            );
                                            form.setValue(
                                              "specialRequirementGroups",
                                              current.map((g) =>
                                                g.id === group.id
                                                  ? {
                                                      ...g,
                                                      items: g.items.map((i) =>
                                                        i.id === item.id
                                                          ? {
                                                              ...i,
                                                              name: e.target
                                                                .value,
                                                            }
                                                          : i
                                                      ),
                                                    }
                                                  : g
                                              )
                                            );
                                          }}
                                          placeholder="例如：拆牆"
                                          className="h-9"
                                        />
                                      </div>
                                      <div className="col-span-5 space-y-2">
                                        <Label
                                          htmlFor={`item-cost-${item.id}`}
                                          className="text-xs"
                                        >
                                          成本 (HKD)
                                        </Label>
                                        <Input
                                          id={`item-cost-${item.id}`}
                                          type="number"
                                          value={item.cost}
                                          onChange={(e) => {
                                            const current = form.getValues(
                                              "specialRequirementGroups"
                                            );
                                            form.setValue(
                                              "specialRequirementGroups",
                                              current.map((g) =>
                                                g.id === group.id
                                                  ? {
                                                      ...g,
                                                      items: g.items.map((i) =>
                                                        i.id === item.id
                                                          ? {
                                                              ...i,
                                                              cost:
                                                                parseFloat(
                                                                  e.target.value
                                                                ) || 0,
                                                            }
                                                          : i
                                                      ),
                                                    }
                                                  : g
                                              )
                                            );
                                          }}
                                          className="h-9"
                                        />
                                      </div>
                                      <div className="col-span-2">
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => {
                                            const current = form.getValues(
                                              "specialRequirementGroups"
                                            );
                                            form.setValue(
                                              "specialRequirementGroups",
                                              current.map((g) =>
                                                g.id === group.id
                                                  ? {
                                                      ...g,
                                                      items: g.items.filter(
                                                        (i) => i.id !== item.id
                                                      ),
                                                    }
                                                  : g
                                              )
                                            );
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}

                                {group.items.length === 0 && (
                                  <div className="text-center py-4 text-sm text-muted-foreground">
                                    暫無項目，點擊「新增項目」來添加
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}

                      {(!specialRequirementGroups ||
                        specialRequirementGroups.length === 0) && (
                        <div className="text-center py-8 text-muted-foreground">
                          暫無特殊要求群組，點擊「新增群組」來添加
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Other Settings */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Separator className="flex-1" />
                      <Badge
                        variant="default"
                        className="px-4 py-1.5 text-sm font-semibold"
                      >
                        Admin
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="variance">價格變動範圍</Label>
                        <Input
                          id="variance"
                          type="number"
                          step="0.01"
                          {...form.register("variance", {
                            valueAsNumber: true,
                          })}
                        />
                        <p className="text-sm text-muted-foreground">
                          最低和最高估算的變動百分比 (0-1)，例如：0.2 表示 ±20%
                          的變動範圍
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  上一步
                </Button>
                <div className="flex gap-2">
                  {currentStep < STEPS.length - 1 ? (
                    <Button type="button" onClick={handleNext}>
                      下一步
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={updatePricing.isPending}>
                      {updatePricing.isPending ? (
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
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FixedLayout>
  );
}
