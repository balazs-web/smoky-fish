"use client";

import React from "react";
import {
  type BenefitItem,
  type BenefitIconId,
  type BenefitsColorId,
  type BenefitsBackgroundColorId,
} from "@/config/benefitsConfig";
import {
  MapPin,
  Clock,
  Truck,
  Wine,
  ThermometerSnowflake,
  CreditCard,
  Star,
  Shield,
  Fish,
  Soup,
  Grape,
  WineOff,
  Beer,
  Flame,
  Package,
  Box,
  Store,
  ShoppingCart,
  ShoppingBag,
  Phone,
  MessageCircle,
  CalendarClock,
  Snowflake,
  Thermometer,
  ShieldCheck,
  Award,
  Gift,
} from "lucide-react";

const iconMap: Record<BenefitIconId, React.ReactNode> = {
  mapPin: <MapPin className="h-5 w-5" />,
  clock: <Clock className="h-5 w-5" />,
  truck: <Truck className="h-5 w-5" />,
  wine: <Wine className="h-5 w-5" />,
  cold: <ThermometerSnowflake className="h-5 w-5" />,
  card: <CreditCard className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
  shield: <Shield className="h-5 w-5" />,
  fish: <Fish className="h-5 w-5" />,
  salmon: <Soup className="h-5 w-5" />,
  cheese: <Soup className="h-5 w-5" />,
  grapes: <Grape className="h-5 w-5" />,
  bottle: <WineOff className="h-5 w-5" />,
  glass: <Beer className="h-5 w-5" />,
  flame: <Flame className="h-5 w-5" />,
  smoke: <Flame className="h-5 w-5" />,
  package: <Package className="h-5 w-5" />,
  box: <Box className="h-5 w-5" />,
  store: <Store className="h-5 w-5" />,
  cart: <ShoppingCart className="h-5 w-5" />,
  bag: <ShoppingBag className="h-5 w-5" />,
  phone: <Phone className="h-5 w-5" />,
  message: <MessageCircle className="h-5 w-5" />,
  calendar: <CalendarClock className="h-5 w-5" />,
  clockAlert: <CalendarClock className="h-5 w-5" />,
  snowflake: <Snowflake className="h-5 w-5" />,
  thermometer: <Thermometer className="h-5 w-5" />,
  shieldCheck: <ShieldCheck className="h-5 w-5" />,
  award: <Award className="h-5 w-5" />,
  gift: <Gift className="h-5 w-5" />,
};

const backgroundClasses: Record<BenefitsBackgroundColorId, { bg: string; border: string; text: string }> = {
  white: {
    bg: "bg-white",
    border: "border-neutral-200",
    text: "text-neutral-900",
  },
  black: {
    bg: "bg-neutral-950",
    border: "border-neutral-800",
    text: "text-neutral-100",
  },
  cream: {
    bg: "bg-[#fdf8f0]",
    border: "border-[#e8dcc8]",
    text: "text-neutral-900",
  },
  gold: {
    bg: "bg-[#f8efe1]",
    border: "border-[#C89A63]/40",
    text: "text-neutral-900",
  },
  gray: {
    bg: "bg-neutral-100",
    border: "border-neutral-300",
    text: "text-neutral-900",
  },
};

const colorClasses: Record<BenefitsColorId, { ring: string; text: string; hoverText: string }> = {
  emerald: {
    ring: "border-emerald-900/40 bg-emerald-50 hover:bg-emerald-100",
    text: "text-emerald-950",
    hoverText: "hover:text-emerald-900",
  },
  gold: {
    ring: "border-[#C89A63]/60 bg-[#f8efe1] hover:bg-[#f1e2c9]",
    text: "text-[#5b4324]",
    hoverText: "hover:text-[#3d2d18]",
  },
  black: {
    ring: "border-black/40 bg-neutral-200 hover:bg-neutral-300",
    text: "text-black",
    hoverText: "hover:text-black",
  },
  wine: {
    ring: "border-[#7b1e3a]/50 bg-[#fde7ef] hover:bg-[#f8d0df]",
    text: "text-[#4c1022]",
    hoverText: "hover:text-[#2c0713]",
  },
  gray: {
    ring: "border-neutral-500/40 bg-neutral-100 hover:bg-neutral-200",
    text: "text-neutral-800",
    hoverText: "hover:text-neutral-900",
  },
};

export function BenefitsStrip({ items, color, backgroundColor = "white" }: { items: BenefitItem[]; color: BenefitsColorId; backgroundColor?: BenefitsBackgroundColorId }) {
  const palette = colorClasses[color] ?? colorClasses.emerald;
  const bgPalette = backgroundClasses[backgroundColor] ?? backgroundClasses.white;
  return (
    <section className={`w-full border-b py-6 ${bgPalette.bg} ${bgPalette.border} ${bgPalette.text}`}>
      <div className="mx-auto max-w-6xl px-4">
        {/* Mobile: 3 columns grid, Tablet: 3 columns, Desktop: flex row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:flex lg:flex-nowrap lg:items-center lg:justify-between">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col items-center gap-1 text-center text-[10px] font-medium transition-transform transition-colors duration-200 hover:-translate-y-0.5 sm:text-xs lg:text-sm ${palette.text} ${palette.hoverText}`}
            >
              <div
                className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full border text-current transition-colors duration-200 sm:h-10 sm:w-10 ${palette.ring}`}
              >
                {iconMap[item.icon] ?? <span className="text-lg">•</span>}
              </div>
              <span className="max-w-[80px] sm:max-w-none leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
