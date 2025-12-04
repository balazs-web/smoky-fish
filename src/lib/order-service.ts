import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import type { OrderData } from "./email-service";

// Order status enum
export type OrderStatus = "new" | "processing" | "shipped" | "delivered" | "cancelled";

// Anonymized order item (no customer data)
export interface SavedOrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number; // in cents
  totalPrice: number; // in cents
}

// Saved order structure - NO sensitive customer data
export interface SavedOrder {
  id: string;
  orderId: string; // Display ID like "MS-XXX-XXX"
  items: SavedOrderItem[];
  itemCount: number;
  subtotal: number; // in cents
  shippingCost: number; // in cents
  totalPrice: number; // in cents
  status: OrderStatus;
  invoiceId?: string;
  // Only save city/region for basic analytics, NOT full address
  deliveryCity?: string;
  deliveryPostcode?: string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Helper to convert Firestore Timestamp to Date
const toDate = (timestamp: unknown): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date();
};

/**
 * Save order to Firebase WITHOUT sensitive customer information
 */
export async function saveOrder(
  orderData: OrderData,
  invoiceId?: string
): Promise<SavedOrder> {
  const now = new Date();

  // Map items without customer data
  const savedItems: SavedOrderItem[] = orderData.items.map((item) => {
    const unitPrice = item.product.price + (item.variant?.priceModifier || 0);
    return {
      productId: item.product.id,
      productName: item.product.name,
      variantId: item.variant?.id,
      variantName: item.variant?.name,
      quantity: item.quantity,
      unitPrice,
      totalPrice: unitPrice * item.quantity,
    };
  });

  const savedOrder: Omit<SavedOrder, "id"> = {
    orderId: orderData.orderId,
    items: savedItems,
    itemCount: savedItems.length,
    subtotal: orderData.subtotal,
    shippingCost: orderData.shippingCost,
    totalPrice: orderData.totalPrice,
    status: "new",
    invoiceId: invoiceId || undefined,
    // Only city and postcode for delivery area analytics
    deliveryCity: orderData.shippingAddress.city,
    deliveryPostcode: orderData.shippingAddress.postalCode,
    createdAt: now,
    updatedAt: now,
  };

  // Use orderId as document ID for easy lookup
  const orderRef = doc(db, "orders", orderData.orderId);
  await setDoc(orderRef, {
    ...savedOrder,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });

  return {
    id: orderData.orderId,
    ...savedOrder,
  };
}

/**
 * Get all orders (for admin)
 */
export async function getOrders(limitCount?: number): Promise<SavedOrder[]> {
  const ordersRef = collection(db, "orders");
  let q = query(ordersRef, orderBy("createdAt", "desc"));
  
  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
    updatedAt: toDate(doc.data().updatedAt),
  })) as SavedOrder[];
}

/**
 * Get orders by status
 */
export async function getOrdersByStatus(status: OrderStatus): Promise<SavedOrder[]> {
  const ordersRef = collection(db, "orders");
  const q = query(
    ordersRef,
    where("status", "==", status),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
    updatedAt: toDate(doc.data().updatedAt),
  })) as SavedOrder[];
}

/**
 * Get single order by orderId
 */
export async function getOrder(orderId: string): Promise<SavedOrder | null> {
  const orderRef = doc(db, "orders", orderId);
  const snapshot = await getDoc(orderRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: toDate(snapshot.data().createdAt),
    updatedAt: toDate(snapshot.data().updatedAt),
  } as SavedOrder;
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: Timestamp.fromDate(new Date()),
  });
}

/**
 * Add invoice ID to order (if invoice was created later)
 */
export async function updateOrderInvoice(
  orderId: string,
  invoiceId: string
): Promise<void> {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    invoiceId,
    updatedAt: Timestamp.fromDate(new Date()),
  });
}
