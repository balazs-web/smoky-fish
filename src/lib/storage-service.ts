import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload an image to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'categories/category-id' or 'products/product-id')
 * @returns The download URL of the uploaded image
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const fileName = `${timestamp}.${extension}`;
  const fullPath = `${path}/${fileName}`;
  
  const storageRef = ref(storage, fullPath);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  
  return downloadUrl;
}

/**
 * Delete an image from Firebase Storage by its URL
 * @param imageUrl - The full download URL of the image
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;
  
  try {
    // Extract the path from the Firebase Storage URL
    const decodedUrl = decodeURIComponent(imageUrl);
    const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
    
    if (pathMatch && pathMatch[1]) {
      const path = pathMatch[1];
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    }
  } catch (error) {
    // Log but don't throw - the image might already be deleted
    console.error('Failed to delete image:', error);
  }
}

/**
 * Delete multiple images from Firebase Storage
 * @param imageUrls - Array of image URLs to delete
 */
export async function deleteImages(imageUrls: string[]): Promise<void> {
  await Promise.all(imageUrls.filter(Boolean).map(deleteImage));
}
