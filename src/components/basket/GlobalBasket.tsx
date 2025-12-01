"use client";

import { useQuery } from "@tanstack/react-query";
import { getUnits, getStoreSettings } from "@/lib/store-service";
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

  return <BasketSheet units={units} storeSettings={storeSettings} />;
}
