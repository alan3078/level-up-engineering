"use client";

import { useState, MouseEvent } from "react";
import { useForm } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Stepper } from "@/components/ui/stepper";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FixedLayout } from "@/components/layout/fixed-layout";
import {
  CalculatorFormData,
  PropertyType,
  RenovationScope,
  MaterialQuality,
  SpecialRequirement,
} from "@/lib/types";
import { calculateRenovationCost, formatCurrency } from "@/lib/calculator";
import { useCalculatorPricing } from "@/lib/hooks";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

const calculatorSchema = z.object({
  propertyType: z.enum(["公屋", "居屋", "私樓", "村屋"]),
  squareFootage: z.number().min(100).max(5000),
  roomConfig: z.object({
    bedrooms: z.number().min(0).max(10),
    livingRooms: z.number().min(0).max(5),
    kitchens: z.number().min(0).max(3),
    bathrooms: z.number().min(0).max(5),
  }),
  renovationScope: z.enum(["全屋", "局部裝修"]),
  materialQuality: z.enum(["基本", "標準", "豪華"]),
  specialRequirements: z.array(z.string()),
});

const STEPS = [
  "物業資料",
  "房間配置",
  "裝修範圍",
  "材料級別",
  "特殊要求",
  "報價結果",
];

export function CostCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [calculationResult, setCalculationResult] = useState<ReturnType<
    typeof calculateRenovationCost
  > | null>(null);
  const { data: pricing } = useCalculatorPricing();

  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      propertyType: "公屋",
      squareFootage: 300,
      roomConfig: {
        bedrooms: 2,
        livingRooms: 1,
        kitchens: 1,
        bathrooms: 1,
      },
      renovationScope: "全屋",
      materialQuality: "標準",
      specialRequirements: [],
    },
  });

  const watchPropertyType = form.watch("propertyType");
  const watchSquareFootage = form.watch("squareFootage");
  const watchRoomConfig = form.watch("roomConfig");
  const watchRenovationScope = form.watch("renovationScope");
  const watchMaterialQuality = form.watch("materialQuality");
  const watchSpecialRequirements = form.watch("specialRequirements");

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = await form.trigger(["propertyType", "squareFootage"]);
        break;
      case 1:
        isValid = await form.trigger("roomConfig");
        break;
      case 2:
        isValid = await form.trigger("renovationScope");
        break;
      case 3:
        isValid = await form.trigger("materialQuality");
        break;
      case 4:
        isValid = true; // Special requirements are optional
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      if (currentStep === STEPS.length - 2) {
        // Calculate before showing results
        const formData = form.getValues();
        const result = calculateRenovationCost(formData, pricing);
        setCalculationResult(result);
      }
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const toggleSpecialRequirement = (req: SpecialRequirement) => {
    const current = watchSpecialRequirements;
    const updated = current.includes(req)
      ? current.filter((r) => r !== req)
      : [...current, req];
    form.setValue("specialRequirements", updated);
  };

  const exportToPDF = async (e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!calculationResult) {
      const { toast } = await import("sonner");
      toast.error("沒有報價數據", {
        description: "請先完成計算",
      });
      return;
    }

    try {
      const { exportQuotationToPDF } = await import("@/lib/pdf-export");
      const formData = form.getValues();
      await exportQuotationToPDF(formData, calculationResult);

      // Show success message
      const { toast } = await import("sonner");
      toast.success("PDF 匯出成功", {
        description: "報價單已下載",
      });
    } catch (error) {
      console.error("Failed to export PDF:", error);
      const { toast } = await import("sonner");
      toast.error("PDF 匯出失敗", {
        description:
          error instanceof Error
            ? error.message
            : "請稍後再試或檢查瀏覽器控制台",
      });
    }
  };

  return (
    <FixedLayout>
      <div className="max-w-4xl mx-auto w-full">
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl">
              裝修成本計算器
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              填寫以下資料，我們會為您提供專業的裝修報價估算
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            <Stepper steps={STEPS} currentStep={currentStep} />

            <Separator />

            <form
              className="space-y-4 sm:space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {/* Step 1: Property Information */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">物業類型</Label>
                    <Select
                      value={watchPropertyType}
                      onValueChange={(value) =>
                        form.setValue("propertyType", value as PropertyType)
                      }
                    >
                      <SelectTrigger id="propertyType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="公屋">公屋</SelectItem>
                        <SelectItem value="居屋">居屋</SelectItem>
                        <SelectItem value="私樓">私樓</SelectItem>
                        <SelectItem value="村屋">村屋</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="squareFootage">實用面積 (平方呎)</Label>
                    <Input
                      id="squareFootage"
                      type="number"
                      min="100"
                      max="5000"
                      value={watchSquareFootage}
                      onChange={(e) =>
                        form.setValue(
                          "squareFootage",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      請輸入您的物業實用面積
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Room Configuration */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">睡房數量</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="0"
                        max="10"
                        value={watchRoomConfig.bedrooms}
                        onChange={(e) =>
                          form.setValue(
                            "roomConfig.bedrooms",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="livingRooms">客廳數量</Label>
                      <Input
                        id="livingRooms"
                        type="number"
                        min="0"
                        max="5"
                        value={watchRoomConfig.livingRooms}
                        onChange={(e) =>
                          form.setValue(
                            "roomConfig.livingRooms",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kitchens">廚房數量</Label>
                      <Input
                        id="kitchens"
                        type="number"
                        min="0"
                        max="3"
                        value={watchRoomConfig.kitchens}
                        onChange={(e) =>
                          form.setValue(
                            "roomConfig.kitchens",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">浴室數量</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="0"
                        max="5"
                        value={watchRoomConfig.bathrooms}
                        onChange={(e) =>
                          form.setValue(
                            "roomConfig.bathrooms",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Renovation Scope */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <Label className="text-base sm:text-lg">裝修範圍</Label>
                  <RadioGroup
                    value={watchRenovationScope}
                    onValueChange={(value) =>
                      form.setValue("renovationScope", value as RenovationScope)
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="全屋" id="full" />
                      <Label
                        htmlFor="full"
                        className="cursor-pointer flex-1 text-sm sm:text-base"
                      >
                        全屋裝修
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="局部裝修" id="partial" />
                      <Label
                        htmlFor="partial"
                        className="cursor-pointer flex-1 text-sm sm:text-base"
                      >
                        局部裝修
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Step 4: Material Quality */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <Label className="text-base sm:text-lg">材料級別</Label>
                  <RadioGroup
                    value={watchMaterialQuality}
                    onValueChange={(value) =>
                      form.setValue("materialQuality", value as MaterialQuality)
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="基本" id="basic" />
                      <Label
                        htmlFor="basic"
                        className="cursor-pointer flex-1 text-sm sm:text-base"
                      >
                        基本級別
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="標準" id="standard" />
                      <Label
                        htmlFor="standard"
                        className="cursor-pointer flex-1 text-sm sm:text-base"
                      >
                        標準級別
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="豪華" id="luxury" />
                      <Label
                        htmlFor="luxury"
                        className="cursor-pointer flex-1 text-sm sm:text-base"
                      >
                        豪華級別
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Step 5: Special Requirements */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <Label className="text-base sm:text-lg">
                    特殊要求 (可選多項)
                  </Label>
                  {pricing &&
                  pricing.specialRequirementGroups &&
                  pricing.specialRequirementGroups.length > 0 ? (
                    <div className="space-y-4 sm:space-y-6">
                      {pricing.specialRequirementGroups
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
                                      watchSpecialRequirements.includes(
                                        item.name
                                      )
                                        ? "default"
                                        : "outline"
                                    }
                                    className="cursor-pointer px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm transition-all hover:scale-105"
                                    onClick={() =>
                                      toggleSpecialRequirement(item.name)
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

              {/* Step 6: Results */}
              {currentStep === 5 && calculationResult && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    <Card>
                      <CardHeader className="pb-2 px-4 sm:px-6">
                        <CardDescription className="text-xs sm:text-sm">
                          最低估算
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6">
                        <CardTitle className="text-xl sm:text-2xl text-green-600">
                          {formatCurrency(calculationResult.minEstimate)}
                        </CardTitle>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2 px-4 sm:px-6">
                        <CardDescription className="text-xs sm:text-sm">
                          平均估算
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6">
                        <CardTitle className="text-xl sm:text-2xl text-primary">
                          {formatCurrency(calculationResult.averageEstimate)}
                        </CardTitle>
                      </CardContent>
                    </Card>
                    <Card className="sm:col-span-2 xl:col-span-1">
                      <CardHeader className="pb-2 px-4 sm:px-6">
                        <CardDescription className="text-xs sm:text-sm">
                          最高估算
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6">
                        <CardTitle className="text-xl sm:text-2xl text-orange-600">
                          {formatCurrency(calculationResult.maxEstimate)}
                        </CardTitle>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold">
                      詳細報價單
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs sm:text-sm">
                                項目
                              </TableHead>
                              <TableHead className="hidden sm:table-cell text-xs sm:text-sm">
                                說明
                              </TableHead>
                              <TableHead className="text-right text-xs sm:text-sm">
                                數量
                              </TableHead>
                              <TableHead className="text-right text-xs sm:text-sm">
                                單價
                              </TableHead>
                              <TableHead className="text-right text-xs sm:text-sm">
                                總計
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {calculationResult.breakdown.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium text-xs sm:text-sm">
                                  {item.item}
                                  <div className="sm:hidden text-muted-foreground text-xs mt-1">
                                    {item.description}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-muted-foreground text-xs sm:text-sm">
                                  {item.description}
                                </TableCell>
                                <TableCell className="text-right text-xs sm:text-sm">
                                  {item.quantity}
                                </TableCell>
                                <TableCell className="text-right text-xs sm:text-sm">
                                  {formatCurrency(item.unitPrice)}
                                </TableCell>
                                <TableCell className="text-right font-semibold text-xs sm:text-sm">
                                  {formatCurrency(item.total)}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="font-bold">
                              <TableCell
                                colSpan={3}
                                className="hidden sm:table-cell text-right text-sm sm:text-base"
                              >
                                總計
                              </TableCell>
                              <TableCell
                                colSpan={2}
                                className="sm:hidden text-right text-sm"
                              >
                                總計
                              </TableCell>
                              <TableCell className="text-right text-base sm:text-lg">
                                {formatCurrency(
                                  calculationResult.averageEstimate
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={exportToPDF}
                    className="w-full text-sm sm:text-base"
                    variant="outline"
                    disabled={!calculationResult}
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    匯出 PDF 報價單
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < STEPS.length - 1 && (
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="w-full sm:w-auto order-2 sm:order-1"
                    size="lg"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    上一步
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto order-1 sm:order-2"
                    size="lg"
                  >
                    下一步
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {currentStep === STEPS.length - 1 && (
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="w-full sm:w-auto order-2 sm:order-1"
                    size="lg"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    返回修改
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="w-full sm:w-auto order-1 sm:order-2"
                    size="lg"
                  >
                    重新計算
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </FixedLayout>
  );
}
