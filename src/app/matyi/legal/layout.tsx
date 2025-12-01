'use client';

import Link from 'next/link';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <header className="border-b border-neutral-800 bg-black/80 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">
            Matyi admin / Jogi oldalak
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/matyi"
              className="text-xs text-neutral-400 hover:text-[#C89A63] transition-colors"
            >
              ← Vissza az admin főoldalra
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
