import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PropertyType, CalculatorFormData } from "@/lib/types";
import type { CalculatorPricingFormData } from "@/lib/calculator-pricing-types";

interface PropertyInformationStepProps {
  form: UseFormReturn<CalculatorFormData> | UseFormReturn<CalculatorPricingFormData>;
  isAdmin: boolean;
  watchPropertyType?: PropertyType;
  watchSquareFootage?: number;
}

export function PropertyInformationStep({
  form,
  isAdmin,
  watchPropertyType,
  watchSquareFootage,
}: PropertyInformationStepProps) {
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
      ) : (
        // Public view: Show inputs directly without divider or background
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyType">物業類型</Label>
            <Select
              value={watchPropertyType}
              onValueChange={(value) =>
                (form as UseFormReturn<CalculatorFormData>).setValue("propertyType", value as PropertyType)
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
                (form as UseFormReturn<CalculatorFormData>).setValue(
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
                    {...(form as UseFormReturn<CalculatorPricingFormData>).register(`basePricePerSqft.${type}`, {
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

