import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  defaultBenefitsConfig,
  type BenefitsConfig,
  type BenefitItem,
  type BenefitsColorId,
  type BenefitsBackgroundColorId,
} from "@/config/benefitsConfig";

const BENEFITS_DOC_PATH = ["settings", "benefits"] as const;

export async function fetchBenefitsConfig(): Promise<BenefitsConfig> {
  const [collection, id] = BENEFITS_DOC_PATH;
  const snapshot = await getDoc(doc(db, collection, id));

  if (!snapshot.exists()) {
    await setDoc(doc(db, collection, id), defaultBenefitsConfig, { merge: true });
    return defaultBenefitsConfig;
  }

  const data = snapshot.data() as
    | {
        items?: Partial<BenefitItem>[];
        color?: BenefitsColorId;
        backgroundColor?: BenefitsBackgroundColorId;
      }
    | undefined;

  const itemsSource = data?.items && Array.isArray(data.items) && data.items.length > 0
    ? data.items
    : defaultBenefitsConfig.items;

  const items: BenefitItem[] = itemsSource.map((item, index) => {
    const fallback = defaultBenefitsConfig.items[index] ?? defaultBenefitsConfig.items[0];

    return {
      id: item.id ?? fallback.id ?? `benefit-${index}`,
      label: item.label ?? fallback.label,
      icon: item.icon ?? fallback.icon,
    };
  });

  const color: BenefitsColorId = data?.color ?? defaultBenefitsConfig.color;
  const backgroundColor: BenefitsBackgroundColorId = data?.backgroundColor ?? defaultBenefitsConfig.backgroundColor;

  return {
    items,
    color,
    backgroundColor,
  };
}

export async function saveBenefitsConfig(config: BenefitsConfig): Promise<void> {
  const [collection, id] = BENEFITS_DOC_PATH;
  await setDoc(doc(db, collection, id), config, { merge: true });
}
