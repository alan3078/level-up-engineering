export type PropertyType = "公屋" | "居屋" | "私樓" | "村屋";

export type RenovationScope = "全屋" | "局部裝修";

export type MaterialQuality = "基本" | "標準" | "豪華";

export type SpecialRequirement = "拆牆" | "水電改動" | "訂造傢俬";

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
}

