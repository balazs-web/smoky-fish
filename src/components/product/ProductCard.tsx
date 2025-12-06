'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronLeft, ChevronRight, Eye, Scale, Wine, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product, Unit, Category } from '@/types';

interface ProductCardProps {
  product: Product;
  unit?: Unit;
  category?: Category;
  onAddToBasket: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, unit, category, onAddToBasket, className = '' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter out empty/invalid image URLs
  const images = [product.imageUrl, ...(product.images || [])]
    .filter((url): url is string => Boolean(url?.trim()));
  const hasMultipleImages = images.length > 1;

  const formatPrice = (priceInCents: number): string => {
    return (priceInCents / 100).toLocaleString('hu-HU');
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {images.length > 0 ? (
          <>
            <Image
              src={images[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              quality={75}
            />
            
            {/* Image navigation arrows - only show on hover with multiple images */}
            {hasMultipleImages && isHovered && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all z-10"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all z-10"
                >
                  <ChevronRight className="h-4 w-4 text-gray-700" />
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex 
                          ? 'bg-[#1B5E4B] scale-110' 
                          : 'bg-white/70 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-300" />
          </div>
        )}

        {/* Quick view link overlay */}
        <Link 
          href={`/termek/${product.slug}`}
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-[#1B5E4B] hover:text-white transition-colors">
            <Eye className="h-4 w-4" />
            Részletek
          </span>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/termek/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] hover:text-[#1B5E4B] transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="mt-2 mb-3">
          <span className="text-xl font-bold text-[#1B5E4B]">
            {formatPrice(product.price)} Ft
          </span>
          {unit && (
            <span className="text-sm text-gray-500 ml-1">
              / {unit.name}
            </span>
          )}
        </div>

        {/* Description preview on hover */}
        <div className={`overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-20 opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
          {product.description && (
            <p className="text-xs text-gray-600 line-clamp-3 whitespace-pre-line">
              {product.description}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button 
          className="w-full bg-[#1B5E4B] hover:bg-[#247a61] text-white"
          onClick={(e) => {
            e.preventDefault();
            onAddToBasket(product);
          }}
        >
          Kosárba
        </Button>
      </div>

      {/* Badges container - top right */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
        {/* Variants badge */}
        {product.variants && product.variants.length > 0 && (
          <div className="bg-[#1B5E4B] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Layers className="h-3 w-3" />
            {product.variants.length} típus
          </div>
        )}
        
        {/* Image count badge */}
        {hasMultipleImages && (
          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {images.length} kép
          </div>
        )}
        
        {/* Warning badges */}
        {category?.isAlcohol18Plus && (
          <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Wine className="h-3 w-3" />
            18+
          </div>
        )}
        {category?.hasApproximateWeight && (
          <div className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Scale className="h-3 w-3" />
            ~tömeg
          </div>
        )}
      </div>
    </div>
  );
}
