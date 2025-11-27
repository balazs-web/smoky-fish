export type HeroConfig = {
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  eyebrow: string;
  description: string;
  backgroundImageUrl: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export const defaultHeroConfig: HeroConfig = {
  eyebrow: "Prémium grúz különlegességek",
  titleLine1: "Prémium Füstölt Lazac,",
  titleLine2: "Kézműves Sajtok & Eredeti",
  titleLine3: "Grúz Borok – Matyistore",
  description:
    "Hagyományos eljárással készített füstölt halak, érlelt kézműves sajtok és eredeti grúz borok – házhozszállítás Budapesten és Pest megyében.",
  backgroundImageUrl: "",
  primaryCtaLabel: "Füstölt halak vásárlása",
  primaryCtaHref: "#",
  secondaryCtaLabel: "Grúz borok és sajtok",
  secondaryCtaHref: "#",
};
