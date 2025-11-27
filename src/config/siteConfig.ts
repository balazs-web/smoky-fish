export type SiteConfig = {
  siteTitle: string;
  siteTagline: string;
  logoImageUrl: string;
  seoTitle?: string;
  seoDescription?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  phoneNumber?: string;
};

export const defaultSiteConfig: SiteConfig = {
  siteTitle: "Matyistore – Prémium füstölt lazac, sajtok és grúz borok",
  siteTagline: "Kézműves füstölt különlegességek és eredeti grúz borok Budapesten és Pest megyében.",
  logoImageUrl: "",
  seoTitle: "Matyistore – Prémium füstölt lazac, sajtok és grúz borok",
  seoDescription:
    "Füstölt halak, érlelt kézműves sajtok és eredeti grúz borok házhozszállítással Budapesten és Pest megyében.",
  facebookUrl: "",
  instagramUrl: "",
  phoneNumber: "",
};
