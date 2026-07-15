import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { MaterialQuality, CalculatorFormData } from "@/lib/types";
import type { CalculatorPricingFormData } from "@/lib/calculator-pricing-types";

interface MaterialQualityStepProps {
  form: UseFormReturn<CalculatorFormData> | UseFormReturn<CalculatorPricingFormData>;
  isAdmin: boolean;
  watchMaterialQuality?: MaterialQuality;
}

export function MaterialQualityStep({ form, isAdmin, watchMaterialQuality }: MaterialQualityStepProps) {
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
              <Label>材料級別</Label>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• 基本級別</div>
                <div>• 標準級別</div>
                <div>• 豪華級別</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Public view: Show radio options directly without divider or background
        <div className="space-y-4">
          <Label className="text-base sm:text-lg">材料級別</Label>
          <RadioGroup
            value={watchMaterialQuality}
            onValueChange={(value) =>
              (form as UseFormReturn<CalculatorFormData>).setValue(
                "materialQuality",
                value as MaterialQuality
              )
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
                    {...(form as UseFormReturn<CalculatorPricingFormData>).register(
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
      )}
    </div>
  );
}
