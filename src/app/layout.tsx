import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import { CookieBanner } from "@/components/CookieBanner";
import { fetchSiteConfigServer } from "@/lib/siteService.server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetchSiteConfigServer();
  
  return {
    title: config.seoTitle || config.siteTitle || config.storeName,
    description: config.seoDescription || config.siteTagline,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          {children}
          <CookieBanner />
        </AppProviders>
      </body>
    </html>
  );
}
