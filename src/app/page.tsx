"use client";

import { Navbar } from "@/components/layout/Navbar";
import { BenefitsStrip } from "@/components/layout/BenefitsStrip";
import { CategoryCards } from "@/components/layout/CategoryCards";
import { FeaturedProducts } from "@/components/layout/FeaturedProducts";
import { AboutProducts } from "@/components/layout/AboutProducts";
import { BlogSection } from "@/components/layout/BlogSection";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { defaultHeroConfig } from "@/config/heroConfig";
import { defaultBenefitsConfig } from "@/config/benefitsConfig";
import { useQuery } from "@tanstack/react-query";
import { fetchHeroConfig } from "@/lib/heroService";
import { fetchBenefitsConfig } from "@/lib/benefitsService";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["heroConfig"],
    queryFn: fetchHeroConfig,
    initialData: defaultHeroConfig,
  });

  const hero = data ?? defaultHeroConfig;
  const { data: benefitsData } = useQuery({
    queryKey: ["benefitsConfig"],
    queryFn: fetchBenefitsConfig,
    initialData: defaultBenefitsConfig,
  });

  const benefits = benefitsData ?? defaultBenefitsConfig;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="relative isolate overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${hero.backgroundImageUrl})` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />

        <section id="fooldal" className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs font-medium tracking-[0.25em] text-[#C89A63] uppercase">
              {hero.eyebrow}
            </p>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {hero.titleLine1}
              <br />
              {hero.titleLine2}
              <br />
              {hero.titleLine3}
            </h1>
            <p className="max-w-xl text-sm text-neutral-200 md:text-base">
              {hero.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-[#C89A63] text-black hover:bg-[#b8864f]">
                {hero.primaryCtaLabel}
              </Button>
              <Button
                variant="outline"
                className="border-white/60 bg-transparent text-white hover:bg-white/10"
              >
                {hero.secondaryCtaLabel}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <BenefitsStrip items={benefits.items} color={benefits.color} backgroundColor={benefits.backgroundColor} />
      <div id="kategoriak">
        <CategoryCards />
      </div>
      <div id="termekek">
        <FeaturedProducts />
      </div>
      <div id="rolunk">
        <AboutProducts />
      </div>
      <div id="blog">
        <BlogSection />
      </div>

      <Footer />
    </div>
  );
}
