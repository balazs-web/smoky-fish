import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { defaultHeroConfig, type HeroConfig } from "@/config/heroConfig";

const HERO_DOC_PATH = ["settings", "hero"] as const;

export async function fetchHeroConfig(): Promise<HeroConfig> {
  const [collection, id] = HERO_DOC_PATH;
  const snapshot = await getDoc(doc(db, collection, id));

  if (!snapshot.exists()) {
    // Initialize with defaults if not present
    await setDoc(doc(db, collection, id), defaultHeroConfig, { merge: true });
    return defaultHeroConfig;
  }

  const data = snapshot.data() as Partial<HeroConfig> | undefined;
  return {
    ...defaultHeroConfig,
    ...(data ?? {}),
  };
}

export async function saveHeroConfig(config: HeroConfig): Promise<void> {
  const [collection, id] = HERO_DOC_PATH;
  await setDoc(doc(db, collection, id), config, { merge: true });
}

export async function uploadHeroImage(file: File): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectRef = ref(
    storage,
    `hero/hero-bg-${Date.now()}-${safeName}`,
  );

  await uploadBytes(objectRef, file, {
    contentType: file.type,
  });

  const url = await getDownloadURL(objectRef);
  return url;
}
