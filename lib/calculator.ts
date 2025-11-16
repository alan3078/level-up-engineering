import {
  CalculatorFormData,
  CalculationResult,
  PriceBreakdown,
  CalculatorPricing,
} from "./types";

// Default pricing fallback
const DEFAULT_PRICING: Omit<CalculatorPricing, "id" | "updatedAt"> = {
  basePricePerSqft: {
    公屋: 800,
    居屋: 1000,
    私樓: 1200,
    村屋: 900,
  },
  qualityMultipliers: {
    基本: 0.8,
    標準: 1.0,
    豪華: 1.5,
  },
  scopeMultipliers: {
    全屋: 1.0,
    局部裝修: 0.6,
  },
  roomBaseCosts: {
    bedroom: 15000,
    livingRoom: 25000,
    kitchen: 30000,
    bathroom: 20000,
  },
  specialRequirementGroups: [
    {
      id: "1",
      name: "結構改動",
      order: 0,
      items: [
        { id: "1-1", name: "拆牆", cost: 5000, order: 0 },
        { id: "1-2", name: "加建牆壁", cost: 8000, order: 1 },
      ],
    },
    {
      id: "2",
      name: "水電工程",
      order: 1,
      items: [
        { id: "2-1", name: "水電改動", cost: 15000, order: 0 },
        { id: "2-2", name: "全屋換線", cost: 25000, order: 1 },
      ],
    },
    {
      id: "3",
      name: "傢俬訂造",
      order: 2,
      items: [
        { id: "3-1", name: "訂造傢俬", cost: 30000, order: 0 },
        { id: "3-2", name: "廚櫃訂造", cost: 20000, order: 1 },
      ],
    },
  ],
  variance: 0.2,
};

export function calculateRenovationCost(
  data: CalculatorFormData,
  pricing?: CalculatorPricing | null
): CalculationResult {
  const {
    propertyType,
    squareFootage,
    roomConfig,
    renovationScope,
    materialQuality,
    specialRequirements,
  } = data;

  // Use provided pricing or fallback to default
  const pricingData = pricing || DEFAULT_PRICING;
  const basePricePerSqft = pricingData.basePricePerSqft[propertyType];
  const qualityMultiplier = pricingData.qualityMultipliers[materialQuality];
  const scopeMultiplier = pricingData.scopeMultipliers[renovationScope];

  const breakdown: PriceBreakdown[] = [];
  let baseCost = 0;

  // Base cost calculation

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
      pricingData.roomBaseCosts.bedroom *
      qualityMultiplier *
      scopeMultiplier;
    breakdown.push({
      item: "睡房裝修",
      description: `${roomConfig.bedrooms}間睡房`,
      quantity: roomConfig.bedrooms,
      unitPrice:
        pricingData.roomBaseCosts.bedroom * qualityMultiplier * scopeMultiplier,
      total: bedroomCost,
    });
    baseCost += bedroomCost;
  }

  if (roomConfig.livingRooms > 0) {
    const livingRoomCost =
      roomConfig.livingRooms *
      pricingData.roomBaseCosts.livingRoom *
      qualityMultiplier *
      scopeMultiplier;
    breakdown.push({
      item: "客廳裝修",
      description: `${roomConfig.livingRooms}間客廳`,
      quantity: roomConfig.livingRooms,
      unitPrice:
        pricingData.roomBaseCosts.livingRoom *
        qualityMultiplier *
        scopeMultiplier,
      total: livingRoomCost,
    });
    baseCost += livingRoomCost;
  }

  if (roomConfig.kitchens > 0) {
    const kitchenCost =
      roomConfig.kitchens *
      pricingData.roomBaseCosts.kitchen *
      qualityMultiplier *
      scopeMultiplier;
    breakdown.push({
      item: "廚房裝修",
      description: `${roomConfig.kitchens}間廚房`,
      quantity: roomConfig.kitchens,
      unitPrice:
        pricingData.roomBaseCosts.kitchen * qualityMultiplier * scopeMultiplier,
      total: kitchenCost,
    });
    baseCost += kitchenCost;
  }

  if (roomConfig.bathrooms > 0) {
    const bathroomCost =
      roomConfig.bathrooms *
      pricingData.roomBaseCosts.bathroom *
      qualityMultiplier *
      scopeMultiplier;
    breakdown.push({
      item: "浴室裝修",
      description: `${roomConfig.bathrooms}間浴室`,
      quantity: roomConfig.bathrooms,
      unitPrice:
        pricingData.roomBaseCosts.bathroom *
        qualityMultiplier *
        scopeMultiplier,
      total: bathroomCost,
    });
    baseCost += bathroomCost;
  }

  // Special requirements
  specialRequirements.forEach((reqName) => {
    // Search through all groups and items
    for (const group of pricingData.specialRequirementGroups) {
      const reqItem = group.items.find((r) => r.name === reqName);
      if (reqItem) {
        breakdown.push({
          item: reqItem.name,
          description: `${group.name} - ${reqItem.name}`,
          quantity: 1,
          unitPrice: reqItem.cost,
          total: reqItem.cost,
        });
        baseCost += reqItem.cost;
        break;
      }
    }
  });

  // Calculate min/max estimates using variance from pricing
  const variance = pricingData.variance;
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
