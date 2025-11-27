"use client";

import Link from "next/link";
import { ShoppingCart, Facebook, Instagram, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteConfig } from "@/lib/siteService";
import { defaultSiteConfig } from "@/config/siteConfig";

export function Navbar() {
  const { data: siteConfig } = useQuery({
    queryKey: ["siteConfig"],
    queryFn: fetchSiteConfig,
    staleTime: 0,
    refetchOnMount: true,
  });

  const logoSrc = siteConfig?.logoImageUrl || "";
  const siteTitle = siteConfig?.siteTitle || "Matyistore";
  const facebookUrl = siteConfig?.facebookUrl || "";
  const instagramUrl = siteConfig?.instagramUrl || "";
  const phoneNumber = siteConfig?.phoneNumber || "";

  return (
    <header className="w-full border-b border-black/10 bg-[#C89A63] text-black">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm bg-black/80">
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={`${siteTitle} logó`}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-[#C89A63]">M</span>
            )}
          </div>
          <span className="text-sm font-semibold tracking-wide uppercase">
            Matyistore
          </span>
        </div>

        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {/* Menü majd később: Főoldal, Termékek, Blog, Kiszállítás, Kapcsolat */}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {phoneNumber && (
            <a
              href={`tel:${phoneNumber.replace(/\s/g, "")}`}
              className="hidden items-center gap-1 text-xs font-medium hover:text-black/70 sm:flex"
            >
              <Phone className="h-4 w-4" />
              <span>{phoneNumber}</span>
            </a>
          )}
          <div className="flex items-center gap-2">
            {facebookUrl && (
              <Link
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-black/70"
              >
                <Facebook className="h-4 w-4" />
              </Link>
            )}
            {instagramUrl && (
              <Link
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-black/70"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            )}
            <Link href="#" aria-label="Kosár" className="hover:text-black/70">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
