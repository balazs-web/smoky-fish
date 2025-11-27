import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { AboutProductsConfig, defaultAboutProductsConfig } from '@/config/aboutProductsConfig';

const DOC_ID = 'aboutProducts';
const COLLECTION = 'siteConfig';

export async function fetchAboutProductsConfig(): Promise<AboutProductsConfig> {
  try {
    const docRef = doc(db, COLLECTION, DOC_ID);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return snapshot.data() as AboutProductsConfig;
    }
    
    return defaultAboutProductsConfig;
  } catch (error) {
    console.error('Error fetching about products config:', error);
    return defaultAboutProductsConfig;
  }
}

export async function saveAboutProductsConfig(config: AboutProductsConfig): Promise<void> {
  const docRef = doc(db, COLLECTION, DOC_ID);
  await setDoc(docRef, config);
}
