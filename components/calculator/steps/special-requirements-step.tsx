import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import type { CalculatorFormData, SpecialRequirement } from "@/lib/types";
import type { CalculatorPricingFormData } from "@/lib/calculator-pricing-types";

interface SpecialRequirementsStepProps {
  form: UseFormReturn<CalculatorFormData> | UseFormReturn<CalculatorPricingFormData>;
  isAdmin: boolean;
  specialRequirementGroups?: CalculatorPricingFormData["specialRequirementGroups"];
  watchSpecialRequirements?: SpecialRequirement[];
  toggleSpecialRequirement?: (req: SpecialRequirement) => void;
}

export function SpecialRequirementsStep({
  form,
  isAdmin,
  specialRequirementGroups,
  watchSpecialRequirements,
  toggleSpecialRequirement,
}: SpecialRequirementsStepProps) {
  return (
    <div className="space-y-6">
      {isAdmin ? (
        // Admin view: Show User section with divider and background
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
      ) : (
        // Public view: Show clickable badges directly without divider or background
        <div className="space-y-4">
          <Label className="text-base sm:text-lg">特殊要求 (可選多項)</Label>
          {specialRequirementGroups &&
          specialRequirementGroups.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {specialRequirementGroups
                .sort((a, b) => a.order - b.order)
                .map((group) => (
                  <div
                    key={group.id}
                    className="space-y-2 sm:space-y-3"
                  >
                    <Label className="text-sm sm:text-base font-semibold">
                      {group.name}
                    </Label>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {group.items
                        .sort((a, b) => a.order - b.order)
                        .map((item) => (
                          <Badge
                            key={item.id}
                            variant={
                              watchSpecialRequirements?.includes(
                                item.name
                              )
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm transition-all hover:scale-105"
                            onClick={() =>
                              toggleSpecialRequirement?.(item.name)
                            }
                          >
                            {item.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm sm:text-base text-muted-foreground">
              暫無特殊要求項目
            </p>
          )}
        </div>
      )}

      {/* Admin Section */}
      {isAdmin && (
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
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const current = (form as UseFormReturn<CalculatorPricingFormData>).getValues(
                  "specialRequirementGroups"
                );
                const newId = Date.now().toString();
                (form as UseFormReturn<CalculatorPricingFormData>).setValue("specialRequirementGroups", [
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
            {specialRequirementGroups &&
              specialRequirementGroups
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
                              const current = (form as UseFormReturn<CalculatorPricingFormData>).getValues(
                                "specialRequirementGroups"
                              );
                              (form as UseFormReturn<CalculatorPricingFormData>).setValue(
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
                            const current = (form as UseFormReturn<CalculatorPricingFormData>).getValues(
                              "specialRequirementGroups"
                            );
                            (form as UseFormReturn<CalculatorPricingFormData>).setValue(
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
                              const current = (form as UseFormReturn<CalculatorPricingFormData>).getValues(
                                "specialRequirementGroups"
                              );
                              const newItemId = `${group.id}-${Date.now()}`;
                              (form as UseFormReturn<CalculatorPricingFormData>).setValue(
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
                                    const current = (form as UseFormReturn<CalculatorPricingFormData>).getValues(
                                      "specialRequirementGroups"
                                    );
                                    (form as UseFormReturn<CalculatorPricingFormData>).setValue(
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
                                    const current = (form as UseFormReturn<CalculatorPricingFormData>).getValues(
                                      "specialRequirementGroups"
                                    );
                                    (form as UseFormReturn<CalculatorPricingFormData>).setValue(
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
                                    const current = (form as UseFormReturn<CalculatorPricingFormData>).getValues(
                                      "specialRequirementGroups"
                                    );
                                    (form as UseFormReturn<CalculatorPricingFormData>).setValue(
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
      )}
    </div>
  );
}

