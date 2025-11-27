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
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { BlogPost, BlogPostFormData, BlogPostDoc } from '@/types';

const COLLECTION = 'blogPosts';

// Helper to convert Firestore doc to BlogPost
function docToBlogPost(id: string, data: BlogPostDoc): BlogPost {
  return {
    ...data,
    id,
    createdAt: (data.createdAt as Timestamp)?.toDate?.() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate?.() || new Date(),
    publishedAt: (data.publishedAt as Timestamp)?.toDate?.() || new Date(),
  };
}

// Get all blog posts (for admin)
export async function getBlogPosts(): Promise<BlogPost[]> {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => docToBlogPost(doc.id, doc.data() as BlogPostDoc));
}

// Get published blog posts (for public)
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    // Fetch all posts and filter client-side to avoid composite index requirement
    const q = query(collection(db, COLLECTION));
    const snapshot = await getDocs(q);
    const allPosts = snapshot.docs.map((doc) => docToBlogPost(doc.id, doc.data() as BlogPostDoc));
    
    return allPosts
      .filter((post) => post.isPublished)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  } catch (error) {
    console.error('Error fetching published blog posts:', error);
    return [];
  }
}

// Get published blog posts for homepage (limited)
export async function getFeaturedBlogPosts(count: number = 3): Promise<BlogPost[]> {
  try {
    // Fetch all posts and filter client-side to avoid composite index requirement
    const q = query(collection(db, COLLECTION));
    const snapshot = await getDocs(q);
    const allPosts = snapshot.docs.map((doc) => docToBlogPost(doc.id, doc.data() as BlogPostDoc));
    
    return allPosts
      .filter((post) => post.isPublished)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, count);
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    return [];
  }
}

// Get single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(collection(db, COLLECTION), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return docToBlogPost(doc.id, doc.data() as BlogPostDoc);
}

// Get single blog post by ID
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const docRef = doc(db, COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return docToBlogPost(snapshot.id, snapshot.data() as BlogPostDoc);
}

// Get related posts by tags (excluding current post)
export async function getRelatedPosts(
  currentPostId: string,
  tags: string[],
  categoryIds: string[],
  count: number = 2
): Promise<BlogPost[]> {
  // First try to get posts with matching tags
  const allPosts = await getPublishedBlogPosts();
  
  // Filter and score by relevance
  const scoredPosts = allPosts
    .filter((post) => post.id !== currentPostId)
    .map((post) => {
      let score = 0;
      // Score based on matching tags
      tags.forEach((tag) => {
        if (post.tags.includes(tag)) score += 2;
      });
      // Score based on matching categories
      categoryIds.forEach((catId) => {
        if (post.categoryIds.includes(catId)) score += 1;
      });
      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);

  return scoredPosts.map((item) => item.post);
}

// Calculate read time from content
export function calculateReadTime(content: string): number {
  // Strip HTML tags and count words
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  // Average reading speed: 200 words per minute
  return Math.max(1, Math.ceil(words / 200));
}

// Create blog post
export async function createBlogPost(data: BlogPostFormData): Promise<string> {
  const now = Timestamp.now();
  const readTime = data.readTimeMinutes || calculateReadTime(data.content);
  
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    readTimeMinutes: readTime,
    publishedAt: data.isPublished ? now : Timestamp.fromDate(data.publishedAt),
    createdAt: now,
    updatedAt: now,
  });
  
  return docRef.id;
}

// Update blog post
export async function updateBlogPost(id: string, data: Partial<BlogPostFormData>): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: Timestamp.now(),
  };
  
  // Recalculate read time if content changed
  if (data.content) {
    updateData.readTimeMinutes = data.readTimeMinutes || calculateReadTime(data.content);
  }
  
  // Update publishedAt if publishing for first time
  if (data.isPublished && data.publishedAt) {
    updateData.publishedAt = Timestamp.fromDate(data.publishedAt);
  }
  
  await updateDoc(docRef, updateData);
}

// Delete blog post
export async function deleteBlogPost(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}

// Generate unique slug from title
export async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const allPosts = await getBlogPosts();
  const existingSlugs = allPosts
    .filter((p) => p.id !== excludeId)
    .map((p) => p.slug);

  let slug = baseSlug;
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
