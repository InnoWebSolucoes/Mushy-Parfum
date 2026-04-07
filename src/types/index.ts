export type Season = "spring" | "summer" | "autumn" | "winter";
export type Occasion = "daily" | "evening" | "formal" | "romantic" | "special";
export type Category = "oud" | "floral" | "amber" | "citrus" | "oriental" | "woody" | "fresh";
export type Gender = "masculine" | "feminine" | "unisex";

export interface FragranceNote {
  name: string;
  description: string;
  image: string;
  emoji: string;
}

export interface PerformanceData {
  longevity: number; // hours
  sillage: number; // 1-10
  projection: number; // 1-10
  sillageClothes: number; // 1-10
  compliments: number; // 1-10
  seductionScore: number; // 1-10
  seductionPhrase: string;
  seasons: Season[];
  occasions: Occasion[];
}

export interface SizeOption {
  ml: number;
  price: number; // EUR
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglinePt: string;
  description: string;
  descriptionPt: string;
  category: Category;
  gender: Gender;
  sizes: SizeOption[];
  images: {
    primary: string;
    hero: string;
    bottle: string;
  };
  accentColor: string; // CSS color for product theme
  notes: {
    top: FragranceNote[];
    heart: FragranceNote[];
    base: FragranceNote[];
  };
  performance: PerformanceData;
  featured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  relatedIds: string[];
}

export interface CartItem {
  product: Product;
  selectedSize: SizeOption;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: "card" | "mbway";
  customerEmail: string;
  createdAt: Date;
  status: "pending" | "paid" | "failed";
}
