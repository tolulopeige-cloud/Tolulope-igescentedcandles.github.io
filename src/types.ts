export type WaxTypeId = 'soy' | 'coconut' | 'beeswax';
export type ContainerTypeId = 'amber' | 'black' | 'ceramic' | 'crystal';
export type CandleSizeId = '4oz' | '8oz' | '12oz';
export type WickTypeId = 'cotton' | 'wood';
export type LabelStyleId = 'classic' | 'minimalist' | 'vintage' | 'botanical';

export interface WaxType {
  id: WaxTypeId;
  name: string;
  description: string;
  priceNgn: number;
}

export interface ContainerType {
  id: ContainerTypeId;
  name: string;
  description: string;
  priceNgn: number;
  image: string;
  colorClass: string;
}

export interface CandleSize {
  id: CandleSizeId;
  name: string;
  description: string;
  priceNgn: number;
}

export interface WickType {
  id: WickTypeId;
  name: string;
  description: string;
  priceNgn: number;
}

export interface ScentOption {
  id: string;
  name: string;
  description: string;
  notes: string;
  category: 'Floral' | 'Woody' | 'Sweet & Warm' | 'Fresh & Herbal' | 'Spicy';
  color: string;
}

export interface CustomLabel {
  text: string;
  subtitle: string;
  style: LabelStyleId;
}

export interface CustomCandle {
  id: string;
  wax: WaxTypeId;
  container: ContainerTypeId;
  size: CandleSizeId;
  wick: WickTypeId;
  scents: Record<string, number>; // maps scent id to percentage (sum = 100)
  scentIntensity: 'subtle' | 'balanced' | 'strong';
  label: CustomLabel;
  priceNgn: number;
}

export interface StandardProduct {
  id: string;
  name: string;
  description: string;
  priceNgn: number;
  container: ContainerTypeId;
  size: CandleSizeId;
  wick: WickTypeId;
  scents: string[];
  image: string;
  tag?: string;
  rating: number;
}

export interface CartItem {
  id: string;
  type: 'custom' | 'standard';
  customCandle?: CustomCandle;
  standardProduct?: StandardProduct;
  quantity: number;
}

export interface LagosDeliveryArea {
  id: string;
  name: string;
  feeNgn: number;
  time: string;
}
