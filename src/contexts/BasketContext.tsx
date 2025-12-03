"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Product, ProductVariant } from "@/types";

export interface BasketItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant; // Optional selected variant
}

export interface ShippingAddress {
  name: string;
  phone: string;
  email: string;
  postalCode: string;
  city: string;
  street: string;
  houseNumber: string;
  building?: string;
  floor?: string;
  door?: string;
  note?: string;
}

export interface BillingAddress {
  sameAsShipping: boolean;
  companyName?: string;
  taxNumber?: string;
  name: string;
  postalCode: string;
  city: string;
  street: string;
  houseNumber: string;
}

interface BasketContextType {
  items: BasketItem[];
  itemCount: number; // Number of unique items (lines)
  totalQuantity: number; // Total quantity of all items
  totalPrice: number; // Total price in cents
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearBasket: () => void;
  isBasketOpen: boolean;
  setIsBasketOpen: (open: boolean) => void;
  shippingAddress: ShippingAddress;
  setShippingAddress: (address: ShippingAddress) => void;
  billingAddress: BillingAddress;
  setBillingAddress: (address: BillingAddress) => void;
}

const defaultShippingAddress: ShippingAddress = {
  name: "",
  phone: "",
  email: "",
  postalCode: "",
  city: "",
  street: "",
  houseNumber: "",
  building: "",
  floor: "",
  door: "",
  note: "",
};

const defaultBillingAddress: BillingAddress = {
  sameAsShipping: true,
  companyName: "",
  taxNumber: "",
  name: "",
  postalCode: "",
  city: "",
  street: "",
  houseNumber: "",
};

const BasketContext = createContext<BasketContextType | undefined>(undefined);

const BASKET_STORAGE_KEY = "matyistore_basket";

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(
    defaultShippingAddress
  );
  const [billingAddress, setBillingAddress] = useState<BillingAddress>(
    defaultBillingAddress
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Load basket from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BASKET_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load basket from storage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save basket to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save basket to storage:", error);
      }
    }
  }, [items, isHydrated]);

  const addItem = useCallback((product: Product, quantity = 1, variant?: ProductVariant) => {
    setItems((prevItems) => {
      // Match by product ID and variant ID (if applicable)
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.variant?.id === variant?.id
      );

      if (existingIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
        return newItems;
      }

      return [...prevItems, { product, quantity, variant }];
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => 
        !(item.product.id === productId && item.variant?.id === variantId)
      )
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      setItems((prevItems) =>
        prevItems.filter((item) => 
          !(item.product.id === productId && item.variant?.id === variantId)
        )
      );
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        (item.product.id === productId && item.variant?.id === variantId)
          ? { ...item, quantity } 
          : item
      )
    );
  }, []);

  const clearBasket = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.length;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => {
      const basePrice = item.product.price;
      const priceModifier = item.variant?.priceModifier || 0;
      const itemPrice = basePrice + priceModifier;
      return sum + itemPrice * item.quantity;
    },
    0
  );

  return (
    <BasketContext.Provider
      value={{
        items,
        itemCount,
        totalQuantity,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearBasket,
        isBasketOpen,
        setIsBasketOpen,
        shippingAddress,
        setShippingAddress,
        billingAddress,
        setBillingAddress,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
}
