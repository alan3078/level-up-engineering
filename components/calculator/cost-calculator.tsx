"use client";

import { useState, MouseEvent, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Stepper } from "@/components/ui/stepper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnimatedHouseStepper } from "@/components/calculator/animated-house-stepper";
import { AnimatedStepContent } from "@/components/calculator/animated-step-content";
import { AnimatedButton } from "@/components/calculator/animated-button";
import { FixedLayout } from "@/components/layout/fixed-layout";
import {
  CalculatorFormData,
  SpecialRequirement,
} from "@/lib/types";
import { calculateRenovationCost, formatCurrency } from "@/lib/calculator";
import { useCalculatorPricing, useUpdateCalculatorPricing } from "@/lib/hooks";
import { ChevronLeft, ChevronRight, Download, Save, Loader2 } from "lucide-react";
import {
  PropertyInformationStep,
  RoomConfigurationStep,
  RenovationScopeStep,
  MaterialQualityStep,
  SpecialRequirementsStep,
  OtherSettingsStep,
} from "@/components/calculator/steps";
import { calculatorPricingSchema, defaultPricing, type CalculatorPricingFormData } from "@/lib/calculator-pricing-types";

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

const PUBLIC_STEPS = [
  "物業資料",
  "房間配置",
  "裝修範圍",
  "材料級別",
  "特殊要求",
  "報價結果",
];

const ADMIN_STEPS = [
  "物業資料",
  "房間配置",
  "裝修範圍",
  "材料級別",
  "特殊要求",
  "其他設定",
];

interface CostCalculatorProps {
  isAdmin?: boolean;
}

export function CostCalculator({ isAdmin = false }: CostCalculatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);
  const [calculationResult, setCalculationResult] = useState<ReturnType<
    typeof calculateRenovationCost
  > | null>(null);
  const { data: pricing, isLoading } = useCalculatorPricing();
  const updatePricing = useUpdateCalculatorPricing();

  const STEPS = isAdmin ? ADMIN_STEPS : PUBLIC_STEPS;
  const direction = currentStep > prevStep ? "forward" : "backward";

  // Admin form
  const adminForm = useForm<CalculatorPricingFormData>({
    resolver: zodResolver(calculatorPricingSchema),
    defaultValues: defaultPricing,
  });

  // Public form
  const publicForm = useForm<CalculatorFormData>({
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

  const form = isAdmin ? adminForm : publicForm;

  const watchPropertyType = publicForm.watch("propertyType");
  const watchSquareFootage = publicForm.watch("squareFootage");
  const watchRoomConfig = publicForm.watch("roomConfig");
  const watchRenovationScope = publicForm.watch("renovationScope");
  const watchMaterialQuality = publicForm.watch("materialQuality");
  const watchSpecialRequirements = publicForm.watch("specialRequirements");

  const specialRequirementGroups = useWatch({
    control: adminForm.control,
    name: "specialRequirementGroups",
  });

  // Load admin pricing data
  useEffect(() => {
    if (isAdmin && pricing) {
      adminForm.reset({
        basePricePerSqft: pricing.basePricePerSqft,
        qualityMultipliers: pricing.qualityMultipliers,
        scopeMultipliers: pricing.scopeMultipliers,
        roomBaseCosts: pricing.roomBaseCosts,
        specialRequirementGroups: pricing.specialRequirementGroups || [],
        variance: pricing.variance,
      });
    }
  }, [isAdmin, pricing, adminForm]);

  const handleNext = async () => {
    if (isAdmin) {
      // Admin mode - no validation, just navigate
      setPrevStep(currentStep);
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      return;
    }

    // Public mode - validate before proceeding
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = await publicForm.trigger(["propertyType", "squareFootage"]);
        break;
      case 1:
        isValid = await publicForm.trigger("roomConfig");
        break;
      case 2:
        isValid = await publicForm.trigger("renovationScope");
        break;
      case 3:
        isValid = await publicForm.trigger("materialQuality");
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
        const formData = publicForm.getValues();
        const result = calculateRenovationCost(formData, pricing);
        setCalculationResult(result);
      }
      setPrevStep(currentStep);
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handlePrevious = () => {
    setPrevStep(currentStep);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const toggleSpecialRequirement = (req: SpecialRequirement) => {
    const current = watchSpecialRequirements;
    const updated = current.includes(req)
      ? current.filter((r) => r !== req)
      : [...current, req];
    publicForm.setValue("specialRequirements", updated);
  };

  const onAdminSubmit = async (data: CalculatorPricingFormData) => {
    try {
      await updatePricing.mutateAsync(data);
      const { toast } = await import("sonner");
      toast.success("設定已儲存");
    } catch (error) {
      console.error("Error saving pricing:", error);
      const { toast } = await import("sonner");
      toast.error("儲存失敗");
    }
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
      const formData = publicForm.getValues();
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

  if (isAdmin && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <FixedLayout>
      <div className={isAdmin ? "space-y-6" : "max-w-4xl mx-auto w-full"}>
        {isAdmin && (
          <div>
            <h1 className="text-3xl font-bold">計算器價格設定</h1>
            <p className="text-muted-foreground mt-2">
              管理裝修成本計算器的價格配置和倍數設定
            </p>
          </div>
        )}
        
        <Card>
          <CardHeader className={isAdmin ? undefined : "px-4 sm:px-6"}>
            <CardTitle className={isAdmin ? "text-2xl" : "text-xl sm:text-2xl md:text-3xl"}>
              {isAdmin ? "價格配置" : "裝修成本計算器"}
            </CardTitle>
            <CardDescription className={isAdmin ? undefined : "text-sm sm:text-base"}>
              {isAdmin ? "為每個步驟配置對應的價格設定" : "填寫以下資料，我們會為您提供專業的裝修報價估算"}
            </CardDescription>
          </CardHeader>
          <CardContent className={isAdmin ? "space-y-6" : "space-y-4 sm:space-y-6 px-4 sm:px-6"}>
            {isAdmin ? (
              <Stepper steps={STEPS} currentStep={currentStep} />
            ) : (
              <AnimatedHouseStepper steps={STEPS} currentStep={currentStep} />
            )}

            <Separator />

            <form
              className={isAdmin ? "space-y-6" : "space-y-4 sm:space-y-6"}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isAdmin && currentStep === STEPS.length - 1) {
                  adminForm.handleSubmit(onAdminSubmit)(e);
                }
              }}
            >
              <AnimatedStepContent step={currentStep} direction={direction}>
                {/* Step 1: Property Information */}
                {currentStep === 0 && (
                  <PropertyInformationStep
                    form={form}
                    isAdmin={isAdmin}
                    watchPropertyType={watchPropertyType}
                    watchSquareFootage={watchSquareFootage}
                  />
                )}

                {/* Step 2: Room Configuration */}
                {currentStep === 1 && (
                  <RoomConfigurationStep
                    form={form}
                    isAdmin={isAdmin}
                    watchRoomConfig={watchRoomConfig}
                  />
                )}

                {/* Step 3: Renovation Scope */}
                {currentStep === 2 && (
                  <RenovationScopeStep
                    form={form}
                    isAdmin={isAdmin}
                    watchRenovationScope={watchRenovationScope}
                  />
                )}

                {/* Step 4: Material Quality */}
                {currentStep === 3 && (
                  <MaterialQualityStep
                    form={form}
                    isAdmin={isAdmin}
                    watchMaterialQuality={watchMaterialQuality}
                  />
                )}

                {/* Step 5: Special Requirements */}
                {currentStep === 4 && (
                  <SpecialRequirementsStep
                    form={form}
                    isAdmin={isAdmin}
                    specialRequirementGroups={isAdmin ? specialRequirementGroups : pricing?.specialRequirementGroups}
                    watchSpecialRequirements={watchSpecialRequirements}
                    toggleSpecialRequirement={toggleSpecialRequirement}
                  />
                )}

                {/* Step 6: Admin Other Settings */}
                {isAdmin && currentStep === 5 && <OtherSettingsStep form={adminForm} />}

                {/* Step 6: Public Results */}
                {!isAdmin && currentStep === 5 && calculationResult && (
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
                    
                    <Card className="border-2 border-primary">
                      <CardHeader className="pb-2 px-4 sm:px-6">
                        <CardDescription className="text-xs sm:text-sm font-semibold">
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

                  <AnimatedButton
                    type="button"
                    onClick={exportToPDF}
                    className="w-full text-sm sm:text-base"
                    variant="outline"
                    disabled={!calculationResult}
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    匯出 PDF 報價單
                  </AnimatedButton>
                </div>
              )}
              </AnimatedStepContent>

              {/* Navigation Buttons */}
              {isAdmin ? (
                // Admin navigation
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <AnimatedButton
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      上一步
                    </AnimatedButton>
                    <div className="flex gap-2">
                      {currentStep < STEPS.length - 1 ? (
                        <AnimatedButton type="button" onClick={handleNext}>
                          下一步
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </AnimatedButton>
                      ) : (
                        <AnimatedButton type="submit" disabled={updatePricing.isPending}>
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
                        </AnimatedButton>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                // Public navigation
                <>
                  {currentStep < STEPS.length - 1 && (
                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                      <AnimatedButton
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        className="w-full sm:w-auto order-2 sm:order-1"
                        size="lg"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        上一步
                      </AnimatedButton>
                      <AnimatedButton
                        type="button"
                        onClick={handleNext}
                        className="w-full sm:w-auto order-1 sm:order-2"
                        size="lg"
                      >
                        下一步
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </AnimatedButton>
                    </div>
                  )}

                  {currentStep === STEPS.length - 1 && (
                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                      <AnimatedButton
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        className="w-full sm:w-auto order-2 sm:order-1"
                        size="lg"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        返回修改
                      </AnimatedButton>
                      <AnimatedButton
                        type="button"
                        onClick={() => {
                          setPrevStep(currentStep);
                          setCurrentStep(0);
                        }}
                        className="w-full sm:w-auto order-1 sm:order-2"
                        size="lg"
                      >
                        重新計算
                      </AnimatedButton>
                    </div>
                  )}
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </FixedLayout>
  );
}
