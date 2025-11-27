import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product, Category, Unit, ProductFormData, CategoryFormData, UnitFormData } from '@/types';

// Helper to convert Firestore Timestamp to Date
const toDate = (timestamp: unknown): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date();
};

// ============ CATEGORIES ============

export async function getCategories(): Promise<Category[]> {
  const categoriesRef = collection(db, 'categories');
  const q = query(categoriesRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
    updatedAt: toDate(doc.data().updatedAt),
  })) as Category[];
}

export async function getActiveCategories(): Promise<Category[]> {
  const categoriesRef = collection(db, 'categories');
  const q = query(
    categoriesRef,
    where('isActive', '==', true),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
    updatedAt: toDate(doc.data().updatedAt),
  })) as Category[];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const docRef = doc(db, 'categories', id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: toDate(snapshot.data().createdAt),
    updatedAt: toDate(snapshot.data().updatedAt),
  } as Category;
}

export async function createCategory(data: CategoryFormData): Promise<string> {
  const categoriesRef = collection(db, 'categories');
  const now = Timestamp.now();
  
  const docRef = await addDoc(categoriesRef, {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  
  return docRef.id;
}

export async function updateCategory(id: string, data: Partial<CategoryFormData>): Promise<void> {
  const docRef = doc(db, 'categories', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, 'categories', id);
  await deleteDoc(docRef);
}

// ============ UNITS ============

export async function getUnits(): Promise<Unit[]> {
  const unitsRef = collection(db, 'units');
  const q = query(unitsRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
    updatedAt: toDate(doc.data().updatedAt),
  })) as Unit[];
}

export async function getActiveUnits(): Promise<Unit[]> {
  const unitsRef = collection(db, 'units');
  const q = query(
    unitsRef,
    where('isActive', '==', true),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
    updatedAt: toDate(doc.data().updatedAt),
  })) as Unit[];
}

export async function getUnitById(id: string): Promise<Unit | null> {
  const docRef = doc(db, 'units', id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: toDate(snapshot.data().createdAt),
    updatedAt: toDate(snapshot.data().updatedAt),
  } as Unit;
}

export async function createUnit(data: UnitFormData): Promise<string> {
  const unitsRef = collection(db, 'units');
  const now = Timestamp.now();
  
  const docRef = await addDoc(unitsRef, {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  
  return docRef.id;
}

export async function updateUnit(id: string, data: Partial<UnitFormData>): Promise<void> {
  const docRef = doc(db, 'units', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteUnit(id: string): Promise<void> {
  const docRef = doc(db, 'units', id);
  await deleteDoc(docRef);
}

// ============ PRODUCTS ============

export async function getProducts(): Promise<Product[]> {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
    updatedAt: toDate(doc.data().updatedAt),
  })) as Product[];
}

export async function getActiveProducts(): Promise<Product[]> {
  const productsRef = collection(db, 'products');
  const q = query(
    productsRef,
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
    updatedAt: toDate(doc.data().updatedAt),
  })) as Product[];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const productsRef = collection(db, 'products');
  const q = query(
    productsRef,
    where('isActive', '==', true),
    where('isFeatured', '==', true)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
    updatedAt: toDate(doc.data().updatedAt),
  })) as Product[];
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const productsRef = collection(db, 'products');
  const q = query(
    productsRef,
    where('categoryId', '==', categoryId),
    where('isActive', '==', true)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt),
    updatedAt: toDate(doc.data().updatedAt),
  })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, 'products', id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: toDate(snapshot.data().createdAt),
    updatedAt: toDate(snapshot.data().updatedAt),
  } as Product;
}

export async function createProduct(data: ProductFormData): Promise<string> {
  const productsRef = collection(db, 'products');
  const now = Timestamp.now();
  
  const docRef = await addDoc(productsRef, {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<void> {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
}
