import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultSiteConfig, type SiteConfig } from "@/config/siteConfig";

const SITE_DOC_PATH = ["settings", "site"] as const;

// Server-side fetch for metadata generation
export async function fetchSiteConfigServer(): Promise<SiteConfig> {
  try {
    const [collection, id] = SITE_DOC_PATH;
    const snapshot = await getDoc(doc(db, collection, id));

    if (!snapshot.exists()) {
      return defaultSiteConfig;
    }

    const data = snapshot.data() as Partial<SiteConfig> | undefined;

    return {
      ...defaultSiteConfig,
      ...(data ?? {}),
    };
  } catch (error) {
    console.error("Error fetching site config for metadata:", error);
    return defaultSiteConfig;
  }
}
