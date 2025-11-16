import {
  PropertyType,
  RenovationScope,
  MaterialQuality,
  SpecialRequirement,
  RoomConfiguration,
  CalculatorFormData,
  CalculationResult,
  PriceBreakdown,
} from "./types";

// Base pricing per square foot (HKD)
const BASE_PRICE_PER_SQFT: Record<PropertyType, number> = {
  公屋: 800,
  居屋: 1000,
  私樓: 1200,
  村屋: 900,
};

// Material quality multipliers
const QUALITY_MULTIPLIERS: Record<MaterialQuality, number> = {
  基本: 0.8,
  標準: 1.0,
  豪華: 1.5,
};

// Renovation scope multipliers
const SCOPE_MULTIPLIERS: Record<RenovationScope, number> = {
  全屋: 1.0,
  局部裝修: 0.6,
};

// Room type base costs (HKD)
const ROOM_BASE_COSTS = {
  bedroom: 15000,
  livingRoom: 25000,
  kitchen: 30000,
  bathroom: 20000,
};

// Special requirement costs
const SPECIAL_REQUIREMENT_COSTS: Record<SpecialRequirement, number> = {
  拆牆: 5000,
  水電改動: 15000,
  訂造傢俬: 30000,
};

export function calculateRenovationCost(
  data: CalculatorFormData
): CalculationResult {
  const {
    propertyType,
    squareFootage,
    roomConfig,
    renovationScope,
    materialQuality,
    specialRequirements,
  } = data;

  const breakdown: PriceBreakdown[] = [];
  let baseCost = 0;

  // Base cost calculation
  const basePricePerSqft = BASE_PRICE_PER_SQFT[propertyType];
  const qualityMultiplier = QUALITY_MULTIPLIERS[materialQuality];
  const scopeMultiplier = SCOPE_MULTIPLIERS[renovationScope];

  const baseAreaCost =
    squareFootage * basePricePerSqft * qualityMultiplier * scopeMultiplier;

  breakdown.push({
    item: "基礎裝修",
    description: `${propertyType} ${squareFootage}平方呎 ${materialQuality}級別 ${renovationScope}`,
    quantity: squareFootage,
    unitPrice: basePricePerSqft * qualityMultiplier * scopeMultiplier,
    total: baseAreaCost,
  });

  baseCost += baseAreaCost;

  // Room-specific costs
  if (roomConfig.bedrooms > 0) {
    const bedroomCost =
      roomConfig.bedrooms *
      ROOM_BASE_COSTS.bedroom *
      qualityMultiplier *
      scopeMultiplier;
    breakdown.push({
      item: "睡房裝修",
      description: `${roomConfig.bedrooms}間睡房`,
      quantity: roomConfig.bedrooms,
      unitPrice: ROOM_BASE_COSTS.bedroom * qualityMultiplier * scopeMultiplier,
      total: bedroomCost,
    });
    baseCost += bedroomCost;
  }

  if (roomConfig.livingRooms > 0) {
    const livingRoomCost =
      roomConfig.livingRooms *
      ROOM_BASE_COSTS.livingRoom *
      qualityMultiplier *
      scopeMultiplier;
    breakdown.push({
      item: "客廳裝修",
      description: `${roomConfig.livingRooms}間客廳`,
      quantity: roomConfig.livingRooms,
      unitPrice:
        ROOM_BASE_COSTS.livingRoom * qualityMultiplier * scopeMultiplier,
      total: livingRoomCost,
    });
    baseCost += livingRoomCost;
  }

  if (roomConfig.kitchens > 0) {
    const kitchenCost =
      roomConfig.kitchens *
      ROOM_BASE_COSTS.kitchen *
      qualityMultiplier *
      scopeMultiplier;
    breakdown.push({
      item: "廚房裝修",
      description: `${roomConfig.kitchens}間廚房`,
      quantity: roomConfig.kitchens,
      unitPrice: ROOM_BASE_COSTS.kitchen * qualityMultiplier * scopeMultiplier,
      total: kitchenCost,
    });
    baseCost += kitchenCost;
  }

  if (roomConfig.bathrooms > 0) {
    const bathroomCost =
      roomConfig.bathrooms *
      ROOM_BASE_COSTS.bathroom *
      qualityMultiplier *
      scopeMultiplier;
    breakdown.push({
      item: "浴室裝修",
      description: `${roomConfig.bathrooms}間浴室`,
      quantity: roomConfig.bathrooms,
      unitPrice:
        ROOM_BASE_COSTS.bathroom * qualityMultiplier * scopeMultiplier,
      total: bathroomCost,
    });
    baseCost += bathroomCost;
  }

  // Special requirements
  specialRequirements.forEach((req) => {
    const reqCost = SPECIAL_REQUIREMENT_COSTS[req];
    breakdown.push({
      item: req,
      description: req,
      quantity: 1,
      unitPrice: reqCost,
      total: reqCost,
    });
    baseCost += reqCost;
  });

  // Calculate min/max estimates (±20% variance)
  const variance = 0.2;
  const minEstimate = Math.round(baseCost * (1 - variance));
  const maxEstimate = Math.round(baseCost * (1 + variance));
  const averageEstimate = Math.round(baseCost);

  return {
    minEstimate,
    maxEstimate,
    averageEstimate,
    breakdown,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-HK", {
    style: "currency",
    currency: "HKD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

