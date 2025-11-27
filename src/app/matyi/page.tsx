"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultHeroConfig, type HeroConfig } from "@/config/heroConfig";
import {
  defaultBenefitsConfig,
  type BenefitsConfig,
  type BenefitIconId,
  type BenefitsColorId,
  type BenefitsBackgroundColorId,
} from "@/config/benefitsConfig";
import { defaultSiteConfig, type SiteConfig } from "@/config/siteConfig";
import { Button } from "@/components/ui/button";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchHeroConfig,
  saveHeroConfig,
  uploadHeroImage,
} from "@/lib/heroService";
import {
  fetchBenefitsConfig,
  saveBenefitsConfig,
} from "@/lib/benefitsService";
import {
  fetchSiteConfig,
  saveSiteConfig,
  uploadSiteLogo,
} from "@/lib/siteService";

const heroSchema = z.object({
  eyebrow: z.string().min(1, "Kötelező mező"),
  titleLine1: z.string().min(1, "Kötelező mező"),
  titleLine2: z.string().min(1, "Kötelező mező"),
  titleLine3: z.string().min(1, "Kötelező mező"),
  description: z.string().min(1, "Kötelező mező"),
  backgroundImageUrl: z.string(),
  primaryCtaLabel: z.string().min(1, "Kötelező mező"),
  primaryCtaHref: z.string().min(1, "Kötelező mező"),
  secondaryCtaLabel: z.string().min(1, "Kötelező mező"),
  secondaryCtaHref: z.string().min(1, "Kötelező mező"),
});

type HeroFormValues = z.infer<typeof heroSchema>;

const benefitsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1, "Kötelező mező"),
        icon: z.string().min(1, "Kötelező mező"),
      }),
    )
    .min(1, "Legalább egy előnyt adj meg"),
  color: z.string().min(1, "Kötelező mező"),
  backgroundColor: z.string().min(1, "Kötelező mező"),
});

type BenefitsFormValues = z.infer<typeof benefitsSchema>;

const siteSchema = z.object({
  siteTitle: z.string().min(1, "Kötelező mező"),
  siteTagline: z.string().min(1, "Kötelező mező"),
  logoImageUrl: z.string().min(1, "Kötelező mező"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  facebookUrl: z.string().url("Érvényes URL szükséges").or(z.literal("")).optional(),
  instagramUrl: z.string().url("Érvényes URL szükséges").or(z.literal("")).optional(),
  phoneNumber: z.string().optional(),
});

type SiteFormValues = z.infer<typeof siteSchema>;

const benefitsIconMap: Record<BenefitIconId, React.ReactNode> = {
	mapPin: <MapPin className="h-4 w-4" />,
	clock: <Clock className="h-4 w-4" />,
	truck: <Truck className="h-4 w-4" />,
	wine: <Wine className="h-4 w-4" />,
	cold: <ThermometerSnowflake className="h-4 w-4" />,
	card: <CreditCard className="h-4 w-4" />,
	star: <Star className="h-4 w-4" />,
	shield: <Shield className="h-4 w-4" />,
	fish: <Fish className="h-4 w-4" />,
	salmon: <Soup className="h-4 w-4" />,
	cheese: <Soup className="h-4 w-4" />,
	grapes: <Grape className="h-4 w-4" />,
	bottle: <WineOff className="h-4 w-4" />,
	glass: <Beer className="h-4 w-4" />,
	flame: <Flame className="h-4 w-4" />,
	smoke: <Flame className="h-4 w-4" />,
	package: <Package className="h-4 w-4" />,
	box: <Box className="h-4 w-4" />,
	store: <Store className="h-4 w-4" />,
	cart: <ShoppingCart className="h-4 w-4" />,
	bag: <ShoppingBag className="h-4 w-4" />,
	phone: <Phone className="h-4 w-4" />,
	message: <MessageCircle className="h-4 w-4" />,
	calendar: <CalendarClock className="h-4 w-4" />,
	clockAlert: <CalendarClock className="h-4 w-4" />,
	snowflake: <Snowflake className="h-4 w-4" />,
	thermometer: <Thermometer className="h-4 w-4" />,
	shieldCheck: <ShieldCheck className="h-4 w-4" />,
	award: <Award className="h-4 w-4" />,
	gift: <Gift className="h-4 w-4" />,
};

export default function MatyiAdminPage() {
  const [previewHero, setPreviewHero] = useState<HeroConfig>(defaultHeroConfig);
  const [isHeroSectionOpen, setIsHeroSectionOpen] = useState(true);
  const [isBenefitsSectionOpen, setIsBenefitsSectionOpen] = useState(true);
  const [isSiteSectionOpen, setIsSiteSectionOpen] = useState(true);

  const {
    data: loadedHero,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["heroConfig"],
    queryFn: fetchHeroConfig,
    initialData: defaultHeroConfig,
  });

  const {
    data: loadedBenefits,
    isLoading: isBenefitsLoading,
    isFetching: isBenefitsFetching,
  } = useQuery<BenefitsConfig>({
    queryKey: ["benefitsConfig"],
    queryFn: fetchBenefitsConfig,
    initialData: defaultBenefitsConfig,
  });

  const {
    data: loadedSite,
    isLoading: isSiteLoading,
    isFetching: isSiteFetching,
  } = useQuery<SiteConfig>({
    queryKey: ["siteConfig"],
    queryFn: fetchSiteConfig,
    initialData: defaultSiteConfig,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: defaultHeroConfig,
  });

  const {
    control: benefitsControl,
    register: registerBenefits,
    handleSubmit: handleSubmitBenefits,
    reset: resetBenefits,
    formState: {
      errors: benefitsErrors,
      isSubmitting: isBenefitsSubmitting,
    },
  } = useForm<BenefitsFormValues>({
    resolver: zodResolver(benefitsSchema),
    defaultValues: {
      items: defaultBenefitsConfig.items,
      color: defaultBenefitsConfig.color,
      backgroundColor: defaultBenefitsConfig.backgroundColor,
    },
  });

  const {
    register: registerSite,
    handleSubmit: handleSubmitSite,
    reset: resetSite,
    setValue: setValueSite,
    getValues: getValuesSite,
    formState: { errors: siteErrors, isSubmitting: isSiteSubmitting },
  } = useForm<SiteFormValues>({
    resolver: zodResolver(siteSchema),
    defaultValues: defaultSiteConfig,
  });

  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } =
    useFieldArray({
      control: benefitsControl,
      name: "items",
    });

  useEffect(() => {
    if (loadedHero) {
      reset(loadedHero);
      setPreviewHero(loadedHero);
    }
  }, [loadedHero, reset]);

  useEffect(() => {
    if (loadedBenefits) {
      resetBenefits({
        items: loadedBenefits.items,
        color: loadedBenefits.color,
        backgroundColor: loadedBenefits.backgroundColor,
      });
    }
  }, [loadedBenefits, resetBenefits]);

  useEffect(() => {
    if (loadedSite) {
      resetSite(loadedSite);
    }
  }, [loadedSite, resetSite]);

  const saveMutation = useMutation({
    mutationKey: ["heroConfig", "save"],
    mutationFn: async (values: HeroFormValues) => {
      await saveHeroConfig(values);
      return values as HeroConfig;
    },
    onSuccess: (values) => {
      setPreviewHero(values);
    },
  });

  const saveBenefitsMutation = useMutation({
    mutationKey: ["benefitsConfig", "save"],
    mutationFn: async (values: BenefitsFormValues) => {
      const toConfig = (formValues: BenefitsFormValues): BenefitsConfig => {
        const items = formValues.items.map((item, index) => {
          const fallback = defaultBenefitsConfig.items[index];

          return {
            id: item.id || fallback?.id || `benefit-${index}`,
            label: item.label,
            icon:
              (item.icon as BenefitIconId) ||
              fallback?.icon ||
              defaultBenefitsConfig.items[0]?.icon,
          };
        });

        const color: BenefitsColorId =
          (formValues.color as BenefitsColorId) ?? defaultBenefitsConfig.color;

        const backgroundColor: BenefitsBackgroundColorId =
          (formValues.backgroundColor as BenefitsBackgroundColorId) ?? defaultBenefitsConfig.backgroundColor;

        return { items, color, backgroundColor };
      };

      const configObject = toConfig(values);
      await saveBenefitsConfig(configObject);
      return configObject;
    },
  });

  const saveSiteMutation = useMutation({
    mutationKey: ["siteConfig", "save"],
    mutationFn: async (values: SiteFormValues) => {
      const configObject: SiteConfig = {
        ...defaultSiteConfig,
        ...values,
      };
      await saveSiteConfig(configObject);
      return configObject;
    },
  });

  const onSubmit = async (values: HeroFormValues) => {
    await saveMutation.mutateAsync(values);
  };

  const onSubmitBenefits = async (values: BenefitsFormValues) => {
    await saveBenefitsMutation.mutateAsync(values);
  };

  const onSubmitSite = async (values: SiteFormValues) => {
    await saveSiteMutation.mutateAsync(values);
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadHeroImage(file);
    setValue("backgroundImageUrl", url, { shouldDirty: true });
    setPreviewHero((prev) => ({
      ...prev,
      backgroundImageUrl: url,
    }));
  };

  const handleLogoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const oldUrl = getValuesSite("logoImageUrl");
      const url = await uploadSiteLogo(file, oldUrl);
      setValueSite("logoImageUrl", url, { shouldDirty: true });
    } catch (error) {
      console.error("Logo upload failed:", error);
      alert("Hiba a logó feltöltésekor. Kérlek próbáld újra.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <header className="border-b border-neutral-800 bg-black/80 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">
            Matyi admin / CRM
          </h1>
          <p className="text-xs text-neutral-400">
            Hős szekció beállításai
          </p>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl justify-end px-4 pt-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          className="border border-neutral-700 bg-black/40 text-xs text-neutral-200 hover:bg-neutral-900 hover:text-neutral-100"
          onClick={() => setIsHeroSectionOpen((open) => !open)}
        >
          {isHeroSectionOpen ? "Hero szekció elrejtése" : "Hero szekció megnyitása"}
        </Button>
      </div>

      {isHeroSectionOpen && (
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:flex-row">
          <section className="w-full lg:w-1/2">
          <h2 className="text-sm font-semibold text-neutral-200">
            Hero szöveg, kép &amp; gombok
          </h2>
          <p className="mb-4 text-xs text-neutral-400">
            Itt tudod beállítani a nyitóoldal hős szekciójának szövegét,
            háttérképét és gombjait. A módosítások Firestore-ban tárolódnak,
            így a nyitóoldal automatikusan frissül.
          </p>

          {(isLoading || isFetching) && (
            <p className="mb-3 text-xs text-neutral-500">
              Betöltés folyamatban...
            </p>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-lg border border-neutral-800 bg-black/40 p-4 text-sm"
          >
            <div className="space-y-1">
              <label className="block text-xs font-medium text-neutral-200">
                Kiemelő sor (eyebrow)
              </label>
              <input
                className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                {...register("eyebrow")}
              />
              {errors.eyebrow && (
                <p className="text-xs text-red-400">
                  {errors.eyebrow.message}
                </p>
              )}
            </div>

            {(["titleLine1", "titleLine2", "titleLine3"] as const).map((key, idx) => (
              <div key={key} className="space-y-1">
                <label className="block text-xs font-medium text-neutral-200">
                  Címsor {idx + 1}
                </label>
                <input
                  className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                  {...register(key)}
                />
                {errors[key] && (
                  <p className="text-xs text-red-400">{errors[key]?.message}</p>
                )}
              </div>
            ))}

            <div className="space-y-1">
              <label className="block text-xs font-medium text-neutral-200">
                Leírás
              </label>
              <textarea
                rows={3}
                className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-neutral-200">
                Háttérkép URL
              </label>
              <input
                className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                {...register("backgroundImageUrl")}
              />
              {errors.backgroundImageUrl && (
                <p className="text-xs text-red-400">
                  {errors.backgroundImageUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-neutral-200">
                Háttérkép feltöltése
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-xs text-neutral-300 file:mr-2 file:rounded file:border-0 file:bg-[#C89A63] file:px-3 file:py-1 file:text-xs file:font-medium file:text-black hover:file:bg-[#b8864f]"
              />
              <p className="text-[10px] text-neutral-500">
                A feltöltött kép URL-je automatikusan bekerül a háttérkép
                mezőbe. Tárold itt a Firebase Storage-ból származó képeket.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-200">
                  Elsődleges CTA szöveg
                </label>
                <input
                  className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                  {...register("primaryCtaLabel")}
                />
                {errors.primaryCtaLabel && (
                  <p className="text-xs text-red-400">
                    {errors.primaryCtaLabel.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-200">
                  Elsődleges CTA hivatkozás
                </label>
                <input
                  className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                  {...register("primaryCtaHref")}
                />
                {errors.primaryCtaHref && (
                  <p className="text-xs text-red-400">
                    {errors.primaryCtaHref.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-200">
                  Másodlagos CTA szöveg
                </label>
                <input
                  className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                  {...register("secondaryCtaLabel")}
                />
                {errors.secondaryCtaLabel && (
                  <p className="text-xs text-red-400">
                    {errors.secondaryCtaLabel.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-200">
                  Másodlagos CTA hivatkozás
                </label>
                <input
                  className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                  {...register("secondaryCtaHref")}
                />
                {errors.secondaryCtaHref && (
                  <p className="text-xs text-red-400">
                    {errors.secondaryCtaHref.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || saveMutation.isPending}
                className="bg-[#C89A63] text-black hover:bg-[#b8864f]"
              >
                {isSubmitting || saveMutation.isPending
                  ? "Mentés..."
                  : "Mentés & előnézet frissítése"}
              </Button>
            </div>
          </form>
        </section>

        <section className="w-full lg:w-1/2">
          <h2 className="mb-3 text-sm font-semibold text-neutral-200">
            Előnézet
          </h2>
          <div className="relative overflow-hidden rounded-lg border border-neutral-800 bg-black">
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url(${previewHero.backgroundImageUrl})` }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />

            <div className="relative px-6 py-10">
              <p className="text-xs font-medium tracking-[0.25em] text-[#C89A63] uppercase">
                {previewHero.eyebrow}
              </p>
              <h3 className="mt-3 text-xl font-semibold leading-tight">
                {previewHero.titleLine1}
                <br />
                {previewHero.titleLine2}
                <br />
                {previewHero.titleLine3}
              </h3>
              <p className="mt-3 text-xs text-neutral-200">
                {previewHero.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button className="bg-[#C89A63] text-black hover:bg-[#b8864f]">
                  {previewHero.primaryCtaLabel}
                </Button>
                <Button
                  variant="outline"
                  className="border-white/60 bg-transparent text-white hover:bg-white/10"
                >
                  {previewHero.secondaryCtaLabel}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      )}

      <div className="mx-auto flex max-w-6xl justify-end px-4 pt-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          className="border border-neutral-700 bg-black/40 text-xs text-neutral-200 hover:bg-neutral-900 hover:text-neutral-100"
          onClick={() => setIsBenefitsSectionOpen((open) => !open)}
        >
          {isBenefitsSectionOpen
            ? "Előnyök sáv elrejtése"
            : "Előnyök sáv megnyitása"}
        </Button>
      </div>

      {isBenefitsSectionOpen && (
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <section className="w-full lg:w-2/3">
            <h2 className="text-sm font-semibold text-neutral-200">
              Előnyök sáv szövegei
            </h2>
            <p className="mb-4 text-xs text-neutral-400">
              Itt tudod beállítani a fehér sávban megjelenő rövid szövegeket és
              ikonokat a nyitóoldalon.
            </p>

            {(isBenefitsLoading || isBenefitsFetching) && (
              <p className="mb-3 text-xs text-neutral-500">
                Előnyök betöltése folyamatban...
              </p>
            )}

            <form
              onSubmit={handleSubmitBenefits(onSubmitBenefits)}
              className="space-y-4 rounded-lg border border-neutral-800 bg-black/40 p-4 text-sm"
            >
              <div className="space-y-3">
                {benefitFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col gap-2 rounded-md border border-neutral-800 bg-black/40 p-3 md:flex-row md:items-center"
                  >
                    <div className="flex-1 space-y-1">
                      <label className="block text-xs font-medium text-neutral-200">
                        Szöveg
                      </label>
                      <input
                        className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                        {...registerBenefits(`items.${index}.label` as const)}
                      />
                    </div>

                    <div className="w-full space-y-1 md:w-48">
                      <label className="block text-xs font-medium text-neutral-200">
                        Ikon
                      </label>
                      <select
                        className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                        {...registerBenefits(`items.${index}.icon` as const)}
                      >
                        <option value="mapPin">Hely (térképtű)</option>
                        <option value="clock">Idő / kiszállítási napok</option>
                        <option value="truck">Szállítás / futár</option>
                        <option value="wine">Bor / ital</option>
                        <option value="cold">Hűtött szállítás</option>
                        <option value="card">Bankkártyás fizetés</option>
                        <option value="star">Kiemelt előny</option>
                        <option value="shield">Biztonság / garancia</option>
                      </select>
                    </div>

                    <div className="flex items-end justify-end md:self-stretch">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-neutral-700 bg-transparent px-2 py-1 text-[11px] text-neutral-300 hover:bg-neutral-900"
                        onClick={() => removeBenefit(index)}
                        disabled={benefitFields.length <= 1}
                      >
                        Eltávolítás
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-neutral-700 bg-transparent px-3 py-1 text-xs text-neutral-200 hover:bg-neutral-900"
                  onClick={() =>
                    appendBenefit({
                      id: "",
                      label: "",
                      icon: "mapPin",
                    })
                  }
                >
                  Új előny hozzáadása
                </Button>

                <div className="space-y-1 text-xs">
                  <label className="block text-xs font-medium text-neutral-200">
                    Ikon szín
                  </label>
                  <select
                    className="w-full min-w-[180px] rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    {...registerBenefits("color")}
                  >
                    <option value="emerald">Zöld (alapértelmezett)</option>
                    <option value="gold">Arany (márka szín)</option>
                    <option value="black">Fekete</option>
                    <option value="wine">Bordó (bor)</option>
                    <option value="gray">Semleges szürke</option>
                  </select>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="block text-xs font-medium text-neutral-200">
                    Sáv háttérszín
                  </label>
                  <select
                    className="w-full min-w-[180px] rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    {...registerBenefits("backgroundColor")}
                  >
                    <option value="white">Fehér (alapértelmezett)</option>
                    <option value="black">Fekete</option>
                    <option value="cream">Krém</option>
                    <option value="gold">Arany</option>
                    <option value="gray">Szürke</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isBenefitsSubmitting || saveBenefitsMutation.isPending}
                  className="bg-[#C89A63] text-black hover:bg-[#b8864f]"
                >
                  {isBenefitsSubmitting || saveBenefitsMutation.isPending
                    ? "Mentés..."
                    : "Előnyök mentése"}
                </Button>
              </div>
            </form>
          </section>
        </main>
      )}

      <div className="mx-auto flex max-w-6xl justify-end px-4 pt-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          className="border border-neutral-700 bg-black/40 text-xs text-neutral-200 hover:bg-neutral-900 hover:text-neutral-100"
          onClick={() => setIsSiteSectionOpen((open) => !open)}
        >
          {isSiteSectionOpen
            ? "Oldal beállítások elrejtése"
            : "Oldal beállítások megnyitása"}
        </Button>
      </div>

      {isSiteSectionOpen && (
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <section className="w-full lg:w-2/3">
            <h2 className="text-sm font-semibold text-neutral-200">
              Oldal logó, cím és SEO beállítások
            </h2>
            <p className="mb-4 text-xs text-neutral-400">
              Itt tudod beállítani az oldal alapvető megjelenését: logó, cím és
              alap SEO meta adatok.
            </p>

            {(isSiteLoading || isSiteFetching) && (
              <p className="mb-3 text-xs text-neutral-500">
                Oldal beállítások betöltése folyamatban...
              </p>
            )}

            <form
              onSubmit={handleSubmitSite(onSubmitSite)}
              className="space-y-4 rounded-lg border border-neutral-800 bg-black/40 p-4 text-sm"
            >
              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-200">
                  Oldal címe
                </label>
                <input
                  className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                  {...registerSite("siteTitle")}
                />
                {siteErrors.siteTitle && (
                  <p className="text-xs text-red-400">
                    {siteErrors.siteTitle.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-200">
                  Rövid leírás / tagline
                </label>
                <input
                  className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                  {...registerSite("siteTagline")}
                />
                {siteErrors.siteTagline && (
                  <p className="text-xs text-red-400">
                    {siteErrors.siteTagline.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-200">
                  Logó kép URL
                </label>
                <input
                  className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                  {...registerSite("logoImageUrl")}
                />
                {siteErrors.logoImageUrl && (
                  <p className="text-xs text-red-400">
                    {siteErrors.logoImageUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-200">
                  Logó feltöltése
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-xs text-neutral-300 file:mr-2 file:rounded file:border-0 file:bg-[#C89A63] file:px-3 file:py-1 file:text-xs file:font-medium file:text-black hover:file:bg-[#b8864f]"
                />
                <p className="text-[10px] text-neutral-500">
                  Optimális méret: 200×200 px, PNG vagy SVG formátum, átlátszó
                  háttérrel. Új logó feltöltésekor a régi automatikusan törlődik.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-200">
                  SEO cím (title tag)
                </label>
                <input
                  className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                  {...registerSite("seoTitle")}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-200">
                  SEO leírás (meta description)
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                  {...registerSite("seoDescription")}
                />
              </div>

              <div className="border-t border-neutral-800 pt-4">
                <h3 className="mb-3 text-xs font-semibold text-neutral-300">
                  Közösségi média és kapcsolat
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-200">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/matyistore"
                      className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                      {...registerSite("facebookUrl")}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-200">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/matyistore"
                      className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                      {...registerSite("instagramUrl")}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-200">
                      Telefonszám
                    </label>
                    <input
                      type="tel"
                      placeholder="+36 30 123 4567"
                      className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                      {...registerSite("phoneNumber")}
                    />
                    <p className="text-[10px] text-neutral-500">
                      A navbar-ban megjelenik, kattintható híváskezdeményezéssel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSiteSubmitting || saveSiteMutation.isPending}
                  className="bg-[#C89A63] text-black hover:bg-[#b8864f]"
                >
                  {isSiteSubmitting || saveSiteMutation.isPending
                    ? "Mentés..."
                    : "Oldal beállítások mentése"}
                </Button>
              </div>
            </form>
          </section>
        </main>
      )}
    </div>
  );
}
