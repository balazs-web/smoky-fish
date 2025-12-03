'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowLeft, Minus, Plus, ChevronLeft, ChevronRight, Scale, Wine, AlertTriangle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useBasket } from '@/contexts/BasketContext';
import { getProducts, getUnits, getCategories } from '@/lib/store-service';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addItem } = useBasket();

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: getUnits,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Find the current product (only if active)
  const product = allProducts.find((p) => p.slug === slug && p.isActive);
  
  // Get all images
  const allImages = product 
    ? [product.imageUrl, ...(product.images || [])].filter(Boolean) as string[]
    : [];

  // Find category
  const category = product 
    ? categories.find((c) => c.id === product.categoryId)
    : null;

  // Find unit
  const unit = product 
    ? units.find((u) => u.id === product.unitId)
    : null;

  const formatPrice = (priceInCents: number): string => {
    return (priceInCents / 100).toLocaleString('hu-HU');
  };

  const handleAddToBasket = () => {
    if (product) {
      addItem(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const isLoading = productsLoading;

  // Product not found
  if (!isLoading && !product) {
    return (
      <div className="min-h-screen bg-[#F5F3EF]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <Package className="mx-auto h-16 w-16 text-gray-300" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Termék nem található</h1>
          <p className="mt-2 text-gray-500">A keresett termék nem létezik.</p>
          <Link href="/termekek">
            <Button className="mt-6 bg-[#1B5E4B] hover:bg-[#247a61]">
              Vissza a termékekhez
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Főoldal
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/termekek" className="text-gray-500 hover:text-gray-700">
              Termékek
            </Link>
            {category && (
              <>
                <span className="text-gray-300">/</span>
                <Link 
                  href={`/kategoria/${category.slug}`} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  {category.name}
                </Link>
              </>
            )}
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{product?.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ) : product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
                {allImages.length > 0 ? (
                  <>
                    <img
                      src={allImages[currentImageIndex]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    
                    {/* Navigation Arrows */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="h-6 w-6 text-gray-700" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        >
                          <ChevronRight className="h-6 w-6 text-gray-700" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Package className="h-24 w-24 text-gray-300" />
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {allImages.length > 1 && (
                <div className="flex gap-3">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? 'border-[#1B5E4B] shadow-md'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category Badge */}
              {category && (
                <Link 
                  href={`/kategoria/${category.slug}`}
                  className="inline-block text-sm font-medium text-[#1B5E4B] bg-[#1B5E4B]/10 px-3 py-1 rounded-full hover:bg-[#1B5E4B]/20 transition-colors"
                >
                  {category.name}
                </Link>
              )}

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#1B5E4B]">
                  {formatPrice(product.price)} Ft
                </span>
                {unit && (
                  <span className="text-lg text-gray-500">
                    / {unit.name}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-sm max-w-none text-gray-600">
                  <p className="whitespace-pre-line">{product.description}</p>
                </div>
              )}

              {/* Category Warnings */}
              {(category?.hasApproximateWeight || category?.isAlcohol18Plus) && (
                <div className="space-y-2">
                  {category?.hasApproximateWeight && (
                    <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
                      <Scale className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Hozzávetőleges súly</p>
                        <p className="text-sm text-amber-700">
                          A termék pontos súlya csomagoláskor derül ki. A végső ár a tényleges súly alapján kerül kiszámításra.
                        </p>
                      </div>
                    </div>
                  )}
                  {category?.isAlcohol18Plus && (
                    <div className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-3">
                      <Wine className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Csak 18 éven felülieknek</p>
                        <p className="text-sm text-red-700">
                          Ez a termék alkoholtartalmú. Vásárláshoz és átvételhez 18 éves kor feletti életkor szükséges.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mennyiség
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-r-none"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-l-none"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {unit && (
                    <span className="text-gray-500">
                      {unit.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button 
                size="lg"
                className={`w-full sm:w-auto px-12 transition-all ${
                  addedToCart 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-[#1B5E4B] hover:bg-[#247a61]'
                } text-white`}
                onClick={handleAddToBasket}
              >
                {addedToCart ? '✓ Hozzáadva!' : 'Kosárba'}
              </Button>

              {/* Additional Info */}
              <div className="border-t pt-6 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="h-5 w-5 text-[#1B5E4B]" />
                    <span>Gyors kiszállítás</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="h-5 w-5 text-[#1B5E4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Prémium minőség</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12">
          <Link 
            href="/termekek" 
            className="inline-flex items-center gap-2 text-[#1B5E4B] hover:text-[#247a61] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Vissza az összes termékhez
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
