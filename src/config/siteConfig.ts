export type SiteConfig = {
  storeName: string;
  siteTitle: string;
  siteTagline: string;
  logoImageUrl: string;
  seoTitle?: string;
  seoDescription?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  phoneNumber?: string;
  // Footer contact emails
  contactEmail?: string;
  wholesaleEmail?: string;
  supportEmail?: string;
  // Footer store info
  footerStoreName?: string;
  footerTagline?: string;
};

export const defaultSiteConfig: SiteConfig = {
  storeName: "Matyistore",
  siteTitle: "Matyistore – Prémium füstölt lazac, sajtok és grúz borok",
  siteTagline: "Kézműves füstölt különlegességek és eredeti grúz borok Budapesten és Pest megyében.",
  logoImageUrl: "",
  seoTitle: "Matyistore – Prémium füstölt lazac, sajtok és grúz borok",
  seoDescription:
    "Füstölt halak, érlelt kézműves sajtok és eredeti grúz borok házhozszállítással Budapesten és Pest megyében.",
  facebookUrl: "",
  instagramUrl: "",
  phoneNumber: "",
  contactEmail: "",
  wholesaleEmail: "",
  supportEmail: "",
  footerStoreName: "Prémium Élelmiszer",
  footerTagline: "Kiváló minőség egyenesen a gyártótól az asztalra.",
};
