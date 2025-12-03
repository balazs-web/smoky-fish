// Product and Category types for the webshop

export interface Unit {
  id: string;
  name: string; // e.g., "10 dkg", "Csomag", "Üveg"
  shortName: string; // e.g., "10dkg", "csomag", "üveg"
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  // Warning flags for all products in this category
  hasApproximateWeight?: boolean; // Weight only known when packed
  isAlcohol18Plus?: boolean; // Age restriction for alcohol
  createdAt: Date;
  updatedAt: Date;
}

// Product variant/subtype (e.g., different cheese types within one product)
export interface ProductVariant {
  id: string;
  name: string; // e.g., "Natúr", "Füstölt", "Fűszeres"
  priceModifier?: number; // Optional price difference in cents (can be negative or positive)
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // Price in cents/smallest currency unit
  categoryId: string;
  unitId: string; // Reference to Unit
  imageUrl?: string;
  images?: string[];
  variants?: ProductVariant[]; // Optional subtypes/variants
  isFeatured: boolean;
  isActive: boolean;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

// Form types for creating/updating
export type UnitFormData = Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>;
export type CategoryFormData = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

// Firestore document types (with Timestamp instead of Date)
export interface CategoryDoc extends Omit<Category, 'createdAt' | 'updatedAt'> {
  createdAt: unknown; // Firestore Timestamp
  updatedAt: unknown;
}

export interface ProductDoc extends Omit<Product, 'createdAt' | 'updatedAt'> {
  createdAt: unknown;
  updatedAt: unknown;
}

// Blog types
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  mainImageUrl: string;
  content: string; // HTML from WYSIWYG
  categoryIds: string[]; // links to product categories
  tags: string[]; // for related content matching
  publishedAt: Date;
  isPublished: boolean;
  readTimeMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPostFormData {
  slug: string;
  title: string;
  subtitle: string;
  mainImageUrl: string;
  content: string;
  categoryIds: string[];
  tags: string[];
  isPublished: boolean;
  publishedAt: Date;
  readTimeMinutes?: number;
}

export interface BlogPostDoc extends Omit<BlogPost, 'createdAt' | 'updatedAt' | 'publishedAt'> {
  createdAt: unknown;
  updatedAt: unknown;
  publishedAt: unknown;
}

// Store Settings
export interface StoreSettings {
  id: string;
  shippingCost: number; // in cents
  freeShippingThreshold?: number; // in cents, optional - free shipping above this amount
  updatedAt: Date;
}
