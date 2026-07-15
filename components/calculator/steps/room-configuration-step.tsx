import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { CalculatorFormData } from "@/lib/types";
import type { CalculatorPricingFormData } from "@/lib/calculator-pricing-types";

interface RoomConfigurationStepProps {
  form: UseFormReturn<CalculatorFormData> | UseFormReturn<CalculatorPricingFormData>;
  isAdmin: boolean;
  watchRoomConfig?: CalculatorFormData["roomConfig"];
}

export function RoomConfigurationStep({ form, isAdmin, watchRoomConfig }: RoomConfigurationStepProps) {
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
      ) : (
        // Public view: Show inputs directly without divider or background
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">睡房數量</Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              max="10"
              value={watchRoomConfig?.bedrooms}
              onChange={(e) =>
                (form as UseFormReturn<CalculatorFormData>).setValue(
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
              value={watchRoomConfig?.livingRooms}
              onChange={(e) =>
                (form as UseFormReturn<CalculatorFormData>).setValue(
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
              value={watchRoomConfig?.kitchens}
              onChange={(e) =>
                (form as UseFormReturn<CalculatorFormData>).setValue(
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
              value={watchRoomConfig?.bathrooms}
              onChange={(e) =>
                (form as UseFormReturn<CalculatorFormData>).setValue(
                  "roomConfig.bathrooms",
                  parseInt(e.target.value) || 0
                )
              }
              className="w-full"
            />
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
            <Label>房間基礎成本 (HKD)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedroom" className="text-sm">
                  睡房
                </Label>
                <Input
                  id="bedroom"
                  type="number"
                  {...(form as UseFormReturn<CalculatorPricingFormData>).register("roomBaseCosts.bedroom", {
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
                  {...(form as UseFormReturn<CalculatorPricingFormData>).register("roomBaseCosts.livingRoom", {
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
                  {...(form as UseFormReturn<CalculatorPricingFormData>).register("roomBaseCosts.kitchen", {
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
                  {...(form as UseFormReturn<CalculatorPricingFormData>).register("roomBaseCosts.bathroom", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
