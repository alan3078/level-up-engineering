"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Stepper } from "@/components/ui/stepper";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CalculatorFormData,
  PropertyType,
  RenovationScope,
  MaterialQuality,
  SpecialRequirement,
} from "@/lib/types";
import { calculateRenovationCost, formatCurrency } from "@/lib/calculator";
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
  specialRequirements: z.array(z.enum(["拆牆", "水電改動", "訂造傢俬"])),
});

const STEPS = ["物業資料", "房間配置", "裝修範圍", "材料級別", "特殊要求", "報價結果"];

export function CostCalculator() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [calculationResult, setCalculationResult] = React.useState<ReturnType<typeof calculateRenovationCost> | null>(null);

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
        const result = calculateRenovationCost(formData);
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

  const exportToPDF = async (e?: React.MouseEvent) => {
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
        description: error instanceof Error ? error.message : "請稍後再試或檢查瀏覽器控制台",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">裝修成本計算器</CardTitle>
          <CardDescription>
            填寫以下資料，我們會為您提供專業的裝修報價估算
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Stepper steps={STEPS} currentStep={currentStep} />

          <Separator />

          <form 
            className="space-y-6"
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
                      form.setValue("squareFootage", parseInt(e.target.value) || 0)
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">睡房數量</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      max="10"
                      value={watchRoomConfig.bedrooms}
                      onChange={(e) =>
                        form.setValue("roomConfig.bedrooms", parseInt(e.target.value) || 0)
                      }
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
                        form.setValue("roomConfig.livingRooms", parseInt(e.target.value) || 0)
                      }
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
                        form.setValue("roomConfig.kitchens", parseInt(e.target.value) || 0)
                      }
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
                        form.setValue("roomConfig.bathrooms", parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Renovation Scope */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Label>裝修範圍</Label>
                <RadioGroup
                  value={watchRenovationScope}
                  onValueChange={(value) =>
                    form.setValue("renovationScope", value as RenovationScope)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="全屋" id="full" />
                    <Label htmlFor="full" className="cursor-pointer">
                      全屋裝修
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="局部裝修" id="partial" />
                    <Label htmlFor="partial" className="cursor-pointer">
                      局部裝修
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 4: Material Quality */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Label>材料級別</Label>
                <RadioGroup
                  value={watchMaterialQuality}
                  onValueChange={(value) =>
                    form.setValue("materialQuality", value as MaterialQuality)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="基本" id="basic" />
                    <Label htmlFor="basic" className="cursor-pointer">
                      基本級別
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="標準" id="standard" />
                    <Label htmlFor="standard" className="cursor-pointer">
                      標準級別
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="豪華" id="luxury" />
                    <Label htmlFor="luxury" className="cursor-pointer">
                      豪華級別
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 5: Special Requirements */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <Label>特殊要求 (可選多項)</Label>
                <div className="flex flex-wrap gap-2">
                  {(["拆牆", "水電改動", "訂造傢俬"] as SpecialRequirement[]).map((req) => (
                    <Badge
                      key={req}
                      variant={watchSpecialRequirements.includes(req) ? "default" : "outline"}
                      className="cursor-pointer p-3 text-sm"
                      onClick={() => toggleSpecialRequirement(req)}
                    >
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Results */}
            {currentStep === 5 && calculationResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>最低估算</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-2xl text-green-600">
                        {formatCurrency(calculationResult.minEstimate)}
                      </CardTitle>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>平均估算</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-2xl text-primary">
                        {formatCurrency(calculationResult.averageEstimate)}
                      </CardTitle>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>最高估算</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-2xl text-orange-600">
                        {formatCurrency(calculationResult.maxEstimate)}
                      </CardTitle>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">詳細報價單</h3>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>項目</TableHead>
                          <TableHead>說明</TableHead>
                          <TableHead className="text-right">數量</TableHead>
                          <TableHead className="text-right">單價</TableHead>
                          <TableHead className="text-right">總計</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calculationResult.breakdown.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.item}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {item.description}
                            </TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.unitPrice)}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(item.total)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-bold">
                          <TableCell colSpan={4} className="text-right">
                            總計
                          </TableCell>
                          <TableCell className="text-right text-lg">
                            {formatCurrency(calculationResult.averageEstimate)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <Button 
                  type="button"
                  onClick={exportToPDF} 
                  className="w-full" 
                  variant="outline"
                  disabled={!calculationResult}
                >
                  <Download className="mr-2 h-4 w-4" />
                  匯出 PDF 報價單
                </Button>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < STEPS.length - 1 && (
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
                <Button type="button" onClick={handleNext}>
                  下一步
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {currentStep === STEPS.length - 1 && (
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  返回修改
                </Button>
                <Button type="button" onClick={() => setCurrentStep(0)}>
                  重新計算
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

