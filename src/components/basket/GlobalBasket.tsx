"use client";

import { useQuery } from "@tanstack/react-query";
import { getUnits, getStoreSettings, getCategories } from "@/lib/store-service";
import { BasketSheet } from "./BasketSheet";

export function GlobalBasket() {
  const { data: units = [] } = useQuery({
    queryKey: ["units"],
    queryFn: getUnits,
  });

  const { data: storeSettings } = useQuery({
    queryKey: ["storeSettings"],
    queryFn: getStoreSettings,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return <BasketSheet units={units} storeSettings={storeSettings} categories={categories} />;
}
