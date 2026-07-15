import * as z from "zod";

export const calculatorPricingSchema = z.object({
  basePricePerSqft: z.object({
    公屋: z.number().min(0),
    居屋: z.number().min(0),
    私樓: z.number().min(0),
    村屋: z.number().min(0),
  }),
  qualityMultipliers: z.object({
    基本: z.number().min(0),
    標準: z.number().min(0),
    豪華: z.number().min(0),
  }),
  scopeMultipliers: z.object({
    全屋: z.number().min(0),
    局部裝修: z.number().min(0),
  }),
  roomBaseCosts: z.object({
    bedroom: z.number().min(0),
    livingRoom: z.number().min(0),
    kitchen: z.number().min(0),
    bathroom: z.number().min(0),
  }),
  specialRequirementGroups: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      order: z.number(),
      items: z.array(
        z.object({
          id: z.string(),
          name: z.string().min(1),
          cost: z.number().min(0),
          order: z.number(),
        })
      ),
    })
  ),
  variance: z.number().min(0).max(1),
});

export type CalculatorPricingFormData = z.infer<typeof calculatorPricingSchema>;

export const defaultPricing: CalculatorPricingFormData = {
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
