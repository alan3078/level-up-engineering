export type PropertyType = "公屋" | "居屋" | "私樓" | "村屋";

export type RenovationScope = "全屋" | "局部裝修";

export type MaterialQuality = "基本" | "標準" | "豪華";

export type SpecialRequirement = string; // Dynamic, can be any string

export interface RoomConfiguration {
  bedrooms: number; // 房
  livingRooms: number; // 廳
  kitchens: number; // 廚
  bathrooms: number; // 廁
}

export interface CalculatorFormData {
  propertyType: PropertyType;
  squareFootage: number;
  roomConfig: RoomConfiguration;
  renovationScope: RenovationScope;
  materialQuality: MaterialQuality;
  specialRequirements: SpecialRequirement[];
}

export interface PriceBreakdown {
  item: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CalculationResult {
  minEstimate: number;
  maxEstimate: number;
  averageEstimate: number;
  breakdown: PriceBreakdown[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  propertyType: PropertyType;
  budgetRange: string;
  style: string;
  beforeImage: string;
  afterImage: string;
  cost: number;
  description: string;
  completedDate: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

// CMS Types
export interface SpecialRequirementItem {
  id: string;
  name: string;
  cost: number;
  order: number;
}

export interface SpecialRequirementGroup {
  id: string;
  name: string;
  order: number;
  items: SpecialRequirementItem[];
}

export interface CalculatorPricing {
  id: string;
  basePricePerSqft: Record<PropertyType, number>;
  qualityMultipliers: Record<MaterialQuality, number>;
  scopeMultipliers: Record<RenovationScope, number>;
  roomBaseCosts: {
    bedroom: number;
    livingRoom: number;
    kitchen: number;
    bathroom: number;
  };
  specialRequirementGroups: SpecialRequirementGroup[];
  variance: number; // ±20% variance for min/max estimates
  updatedAt: string;
}

export interface Service {
  id: string;
  icon: string; // Icon name from lucide-react
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  propertyType: PropertyType;
  rating: number;
  comment: string;
  initials: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface HeroStats {
  id: string;
  stats: Array<{
    icon: string;
    value: string;
    label: string;
  }>;
  updatedAt: string;
}
