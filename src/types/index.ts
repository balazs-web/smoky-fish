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
  createdAt: Date;
  updatedAt: Date;
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
