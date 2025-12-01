'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { 
  Fish, 
  Beef, 
  Sun, 
  Leaf, 
  Shield, 
  Thermometer, 
  Award,
  Package,
  Flame,
  Snowflake,
  CheckCircle,
  Star
} from 'lucide-react';
import { fetchAboutProductsConfig } from '@/lib/aboutProductsService';
import { defaultAboutProductsConfig, type IconItem, type ProcessStep } from '@/config/aboutProductsConfig';

const iconMap: Record<string, React.ReactNode> = {
  fish: <Fish className="h-6 w-6" />,
  beef: <Beef className="h-6 w-6" />,
  sun: <Sun className="h-6 w-6" />,
  leaf: <Leaf className="h-6 w-6" />,
  shield: <Shield className="h-6 w-6" />,
  thermometer: <Thermometer className="h-6 w-6" />,
  award: <Award className="h-6 w-6" />,
  package: <Package className="h-6 w-6" />,
  flame: <Flame className="h-6 w-6" />,
  snowflake: <Snowflake className="h-6 w-6" />,
  check: <CheckCircle className="h-6 w-6" />,
  star: <Star className="h-6 w-6" />,
};

function ImagePlaceholder({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${className}`}>
      <Package className="h-12 w-12 text-gray-400" />
    </div>
  );
}

export function AboutProducts() {
  const { data } = useQuery({
    queryKey: ['aboutProductsConfig'],
    queryFn: fetchAboutProductsConfig,
    initialData: defaultAboutProductsConfig,
  });

  const config = data ?? defaultAboutProductsConfig;

  return (
    <div className="bg-white">
      {/* Section 1: Hero */}
      <section className="relative bg-[#1a1a1a] text-white overflow-hidden">
        {config.hero.imageUrl ? (
          <Image 
            src={config.hero.imageUrl} 
            alt={config.hero.title}
            fill
            className="object-cover opacity-40"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]" />
        )}
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="text-sm tracking-widest text-[#C89A63] uppercase mb-4">
            {config.hero.subtitle}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            {config.hero.title}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl">
            {config.hero.description}
          </p>
        </div>
      </section>

      {/* Section 2: Natural Product */}
      <section className="bg-[#F5F3EF] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {config.naturalProduct.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {config.naturalProduct.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              {config.naturalProduct.imageUrl ? (
                <Image 
                  src={config.naturalProduct.imageUrl} 
                  alt={config.naturalProduct.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <ImagePlaceholder className="w-full h-full rounded-2xl" />
              )}
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {config.naturalProduct.features.map((feature) => (
                <div 
                  key={feature.id}
                  className="bg-white rounded-xl p-6 shadow-sm text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1B5E4B]/10 text-[#1B5E4B] mb-4">
                    {iconMap[feature.icon] || <Star className="h-6 w-6" />}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Cold Smoking */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {config.coldSmoking.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {config.coldSmoking.shortDescription}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              {config.coldSmoking.imageUrl ? (
                <Image 
                  src={config.coldSmoking.imageUrl} 
                  alt={config.coldSmoking.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <ImagePlaceholder className="w-full h-full rounded-2xl" />
              )}
            </div>
            
            {/* Long Description */}
            <div>
              <p className="text-gray-600 leading-relaxed">
                {config.coldSmoking.longDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Smoking Process */}
      <section className="bg-[#F5F3EF] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {config.smokingProcess.title}
            </h2>
            <p className="text-gray-600">
              {config.smokingProcess.subtitle}
            </p>
          </div>
          
          <div className="space-y-8">
            {config.smokingProcess.steps.map((step, idx) => (
              <div 
                key={step.id}
                className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    {step.imageUrl ? (
                      <Image src={step.imageUrl} alt={step.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                    ) : (
                      <ImagePlaceholder className="w-full h-full" />
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="w-full md:w-1/2">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C89A63] text-white flex items-center justify-center font-bold">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Quality Standards */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {config.qualityStandards.title}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.qualityStandards.items.map((item) => (
              <div 
                key={item.id}
                className="group relative bg-[#F5F3EF] rounded-xl p-6 text-center overflow-hidden cursor-pointer min-h-[200px]"
              >
                {/* Background Image with Smoky Reveal */}
                {item.imageUrl && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
                    <Image 
                      src={item.imageUrl} 
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {/* Smoky overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    {/* Animated smoke effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 delay-200 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-pulse" />
                  </div>
                )}
                
                {/* Content - fades out on hover when image exists */}
                <div className={`relative z-10 transition-all duration-500 ${item.imageUrl ? 'group-hover:opacity-0 group-hover:translate-y-2' : ''}`}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1B5E4B] text-white mb-4">
                    {iconMap[item.icon] || <CheckCircle className="h-6 w-6" />}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                
                {/* Hover content - appears over image */}
                {item.imageUrl && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 translate-y-4 group-hover:translate-y-0">
                    <h3 className="font-bold text-white text-lg mb-1 drop-shadow-lg">{item.title}</h3>
                    <p className="text-sm text-white/90 drop-shadow-md">{item.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Premium Packaging */}
      <section className="bg-[#F5F3EF] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {config.premiumPackaging.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {config.premiumPackaging.description}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {config.premiumPackaging.images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                {img ? (
                  <Image src={img} alt={`Csomagolás ${idx + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                ) : (
                  <ImagePlaceholder className="w-full h-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
