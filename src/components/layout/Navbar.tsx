"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, Facebook, Instagram, Phone, Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchSiteConfig } from "@/lib/siteService";
import { useBasket } from "@/contexts/BasketContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const { data: siteConfig } = useQuery({
    queryKey: ["siteConfig"],
    queryFn: fetchSiteConfig,
    staleTime: 0,
    refetchOnMount: true,
  });

  const { itemCount, setIsBasketOpen } = useBasket();

  const logoSrc = siteConfig?.logoImageUrl || "";
  const storeName = siteConfig?.storeName || "Smoky Fish";
  const siteTitle = siteConfig?.siteTitle || storeName;
  const facebookUrl = siteConfig?.facebookUrl || "";
  const instagramUrl = siteConfig?.instagramUrl || "";
  const phoneNumber = siteConfig?.phoneNumber || "";

  // Navigation links - anchor links on homepage, full URLs on other pages
  const navLinks = [
    { href: isHomePage ? "#fooldal" : "/", label: "Főoldal" },
    { href: isHomePage ? "#kategoriak" : "/#kategoriak", label: "Kategóriák" },
    { href: isHomePage ? "#termekek" : "/#termekek", label: "Kiemelt termékek" },
    { href: "/termekek", label: "Összes termék" },
    { href: isHomePage ? "#rolunk" : "/#rolunk", label: "Rólunk" },
    { href: isHomePage ? "#blog" : "/#blog", label: "Blog" },
  ];

  return (
    <header className="w-full border-b border-black/10 bg-[#C89A63] text-black">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Links to Home */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm bg-black/80">
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={`${siteTitle} logó`}
                fill
                className="object-contain"
                sizes="40px"
              />
            ) : (
              <span className="text-lg font-bold text-[#C89A63]">SF</span>
            )}
          </div>
          <span className="text-sm font-semibold tracking-wide uppercase">
            {storeName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-6 text-sm font-medium lg:flex">
          {navLinks.map((link) => 
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-black/70 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-black/70 transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
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
                className="hidden sm:block hover:text-black/70"
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
                className="hidden sm:block hover:text-black/70"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            )}
            <button
              onClick={() => setIsBasketOpen(true)}
              aria-label="Kosár"
              className="relative hover:text-black/70"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1B5E4B] text-xs font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menü"
              className="lg:hidden hover:text-black/70 ml-1"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black/10 bg-[#C89A63]">
          <nav className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => 
              link.href.startsWith("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium hover:text-black/70 transition-colors py-2 border-b border-black/10 last:border-0"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium hover:text-black/70 transition-colors py-2 border-b border-black/10 last:border-0"
                >
                  {link.label}
                </Link>
              )
            )}
            {/* Social links in mobile menu */}
            <div className="flex items-center gap-4 pt-2 mt-2 border-t border-black/10">
              {facebookUrl && (
                <Link
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-black/70"
                >
                  <Facebook className="h-5 w-5" />
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
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
              {phoneNumber && (
                <a
                  href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                  className="flex items-center gap-1 text-sm font-medium hover:text-black/70"
                >
                  <Phone className="h-5 w-5" />
                  <span>{phoneNumber}</span>
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
