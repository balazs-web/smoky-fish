import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type LegalPageType = "impresszum" | "aszf" | "adatkezeles" | "szallitas";

export interface LegalPage {
  title: string;
  content: string; // HTML content
  updatedAt: Date;
}

export const legalPageTitles: Record<LegalPageType, string> = {
  impresszum: "Impresszum",
  aszf: "Általános Szerződési Feltételek",
  adatkezeles: "Adatkezelési Nyilatkozat",
  szallitas: "Szállítási Feltételek",
};

export const defaultLegalPages: Record<LegalPageType, LegalPage> = {
  impresszum: {
    title: "Impresszum",
    content: "<p>Az impresszum tartalma...</p>",
    updatedAt: new Date(),
  },
  aszf: {
    title: "Általános Szerződési Feltételek",
    content: "<p>Az ÁSZF tartalma...</p>",
    updatedAt: new Date(),
  },
  adatkezeles: {
    title: "Adatkezelési Nyilatkozat",
    content: "<p>Az adatkezelési nyilatkozat tartalma...</p>",
    updatedAt: new Date(),
  },
  szallitas: {
    title: "Szállítási Feltételek",
    content: "<p>A szállítási feltételek tartalma...</p>",
    updatedAt: new Date(),
  },
};

export async function getLegalPage(type: LegalPageType): Promise<LegalPage> {
  const docRef = doc(db, "legal", type);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return defaultLegalPages[type];
  }

  const data = snapshot.data();
  return {
    title: data.title || defaultLegalPages[type].title,
    content: data.content || defaultLegalPages[type].content,
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
}

export async function getAllLegalPages(): Promise<Record<LegalPageType, LegalPage>> {
  const types: LegalPageType[] = ["impresszum", "aszf", "adatkezeles", "szallitas"];
  const pages: Record<string, LegalPage> = {};

  for (const type of types) {
    pages[type] = await getLegalPage(type);
  }

  return pages as Record<LegalPageType, LegalPage>;
}

export async function saveLegalPage(
  type: LegalPageType,
  data: { title: string; content: string }
): Promise<void> {
  const docRef = doc(db, "legal", type);
  await setDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
}
