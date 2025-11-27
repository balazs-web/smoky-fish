export type BenefitIconId =
  | "mapPin"
  | "clock"
  | "truck"
  | "wine"
  | "cold"
  | "card"
  | "star"
  | "shield"
  | "fish"
  | "salmon"
  | "cheese"
  | "grapes"
  | "bottle"
  | "glass"
  | "flame"
  | "smoke"
  | "package"
  | "box"
  | "store"
  | "cart"
  | "bag"
  | "phone"
  | "message"
  | "calendar"
  | "clockAlert"
  | "snowflake"
  | "thermometer"
  | "shieldCheck"
  | "award"
  | "gift";

export type BenefitsColorId =
  | "emerald"
  | "gold"
  | "black"
  | "wine"
  | "gray";

export type BenefitsBackgroundColorId =
  | "white"
  | "black"
  | "cream"
  | "gold"
  | "gray";

export type BenefitItem = {
  id: string;
  label: string;
  icon: BenefitIconId;
};

export type BenefitsConfig = {
  items: BenefitItem[];
  color: BenefitsColorId;
  backgroundColor: BenefitsBackgroundColorId;
};

export const defaultBenefitsConfig: BenefitsConfig = {
  items: [
    { id: "area", label: "Budapest + Pest megye only", icon: "mapPin" },
    {
      id: "delivery-days",
      label: "Csütörtök és péntek kiszállítás",
      icon: "clock",
    },
    {
      id: "free-shipping",
      label: "Ingyenes szállítás 25 000 Ft felett",
      icon: "truck",
    },
    {
      id: "georgian-wine",
      label: "100% eredeti grúz borok",
      icon: "wine",
    },
    { id: "cold-delivery", label: "Hűtött házhozszállítás", icon: "cold" },
    { id: "card-payment", label: "Bankkártyás fizetés", icon: "card" },
  ],
  color: "emerald",
  backgroundColor: "white",
};
