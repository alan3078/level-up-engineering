import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { RenovationScope, CalculatorFormData } from "@/lib/types";
import type { CalculatorPricingFormData } from "@/lib/calculator-pricing-types";

interface RenovationScopeStepProps {
  form: UseFormReturn<CalculatorFormData> | UseFormReturn<CalculatorPricingFormData>;
  isAdmin: boolean;
  watchRenovationScope?: RenovationScope;
}

export function RenovationScopeStep({ form, isAdmin, watchRenovationScope }: RenovationScopeStepProps) {
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
              <Label>裝修範圍</Label>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• 全屋裝修</div>
                <div>• 局部裝修</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Public view: Show radio options directly without divider or background
        <div className="space-y-4">
          <Label className="text-base sm:text-lg">裝修範圍</Label>
          <RadioGroup
            value={watchRenovationScope}
            onValueChange={(value) =>
              (form as UseFormReturn<CalculatorFormData>).setValue(
                "renovationScope",
                value as RenovationScope
              )
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
                    {...(form as UseFormReturn<CalculatorPricingFormData>).register(`scopeMultipliers.${scope}`, {
                      valueAsNumber: true,
                    })}
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
