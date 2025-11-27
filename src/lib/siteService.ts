import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { defaultSiteConfig, type SiteConfig } from "@/config/siteConfig";

const SITE_DOC_PATH = ["settings", "site"] as const;

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const [collection, id] = SITE_DOC_PATH;
  const snapshot = await getDoc(doc(db, collection, id));

  if (!snapshot.exists()) {
    await setDoc(doc(db, collection, id), defaultSiteConfig, { merge: true });
    return defaultSiteConfig;
  }

  const data = snapshot.data() as Partial<SiteConfig> | undefined;

  return {
    ...defaultSiteConfig,
    ...(data ?? {}),
  };
}

export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  const [collection, id] = SITE_DOC_PATH;
  await setDoc(doc(db, collection, id), config, { merge: true });
}

export async function deleteSiteLogo(url: string): Promise<void> {
  if (!url || !url.includes("branding%2Flogo")) return;
  
  try {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/branding\/logo[^?]+/);
    if (match) {
      const path = match[0];
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
    }
  } catch (error) {
    console.warn("Could not delete old logo:", error);
  }
}

export async function uploadSiteLogo(file: File, oldUrl?: string): Promise<string> {
  if (oldUrl) {
    await deleteSiteLogo(oldUrl);
  }
  
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectRef = ref(storage, `branding/logo-${Date.now()}-${safeName}`);

  await uploadBytes(objectRef, file, {
    contentType: file.type,
  });

  const url = await getDownloadURL(objectRef);
  return url;
}
