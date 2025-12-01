'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteConfig } from '@/lib/siteService';
import { getLegalPage, type LegalPageType, legalPageTitles } from '@/lib/legal-service';
import { LegalModal } from '@/components/layout/LegalModal';

export function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [activeLegalPage, setActiveLegalPage] = useState<LegalPageType | null>(null);

  const { data: siteConfig } = useQuery({
    queryKey: ['siteConfig'],
    queryFn: fetchSiteConfig,
  });

  const { data: legalContent } = useQuery({
    queryKey: ['legalPage', activeLegalPage],
    queryFn: () => (activeLegalPage ? getLegalPage(activeLegalPage) : null),
    enabled: !!activeLegalPage,
  });

  const footerStoreName = siteConfig?.footerStoreName || 'Prémium Élelmiszer';
  const footerTagline = siteConfig?.footerTagline || 'Kiváló minőség egyenesen a gyártótól az asztalra.';
  const phoneNumber = siteConfig?.phoneNumber || '';
  const contactEmail = siteConfig?.contactEmail || '';
  const wholesaleEmail = siteConfig?.wholesaleEmail || '';
  const supportEmail = siteConfig?.supportEmail || '';
  const facebookUrl = siteConfig?.facebookUrl || '';
  const instagramUrl = siteConfig?.instagramUrl || '';
  const storeName = siteConfig?.storeName || 'Matyistore';

  // Navigation links - same as navbar
  const navLinks = [
    { href: isHomePage ? '#fooldal' : '/', label: 'Főoldal' },
    { href: '/termekek', label: 'Termékek' },
    { href: isHomePage ? '#rolunk' : '/#rolunk', label: 'Rólunk' },
    { href: isHomePage ? '#blog' : '/#blog', label: 'Blog' },
  ];

  // Legal page links
  const legalLinks: { type: LegalPageType; label: string }[] = [
    { type: 'impresszum', label: 'Impresszum' },
    { type: 'aszf', label: 'ÁSZF' },
    { type: 'adatkezeles', label: 'Adatkezelési nyilatkozat' },
    { type: 'szallitas', label: 'Szállítási feltételek' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-[#C89A63] text-black">
        {/* Main footer content */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Store branding */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold">{footerStoreName}</h3>
              <p className="text-sm text-black/70">{footerTagline}</p>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider">Navigáció</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith('#') ? (
                      <a
                        href={link.href}
                        className="text-sm text-black/70 hover:text-black transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-black/70 hover:text-black transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal/Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider">Információk</h3>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.type}>
                    <button
                      onClick={() => setActiveLegalPage(link.type)}
                      className="text-sm text-black/70 hover:text-black transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider">Kapcsolat</h3>
              <ul className="space-y-2">
                {phoneNumber && (
                  <li>
                    <a
                      href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-sm text-black/70 hover:text-black transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {phoneNumber}
                    </a>
                  </li>
                )}
                {contactEmail && (
                  <li>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="flex items-center gap-2 text-sm text-black/70 hover:text-black transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {contactEmail}
                    </a>
                  </li>
                )}
                {wholesaleEmail && (
                  <li>
                    <a
                      href={`mailto:${wholesaleEmail}`}
                      className="flex items-center gap-2 text-sm text-black/70 hover:text-black transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {wholesaleEmail}
                    </a>
                  </li>
                )}
                {supportEmail && (
                  <li>
                    <a
                      href={`mailto:${supportEmail}`}
                      className="flex items-center gap-2 text-sm text-black/70 hover:text-black transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {supportEmail}
                    </a>
                  </li>
                )}
              </ul>

              {/* Social Icons */}
              {(facebookUrl || instagramUrl) && (
                <div className="flex items-center gap-3 pt-2">
                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="text-black/70 hover:text-black transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="text-black/70 hover:text-black transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-black/10">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-black/60">
              © {currentYear} {storeName}. Minden jog fenntartva.
            </p>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      <LegalModal
        isOpen={!!activeLegalPage}
        onClose={() => setActiveLegalPage(null)}
        title={activeLegalPage ? legalPageTitles[activeLegalPage] : ''}
        content={legalContent?.content || ''}
      />
    </>
  );
}
