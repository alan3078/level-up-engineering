import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { CalculatorPricingFormData } from "@/lib/calculator-pricing-types";

interface OtherSettingsStepProps {
  form: UseFormReturn<CalculatorPricingFormData>;
}

export function OtherSettingsStep({ form }: OtherSettingsStepProps) {
  return (
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
  );
}
