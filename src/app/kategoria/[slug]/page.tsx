'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { AddToBasketModal } from '@/components/basket/AddToBasketModal';
import { getProducts, getUnits, getCategories } from '@/lib/store-service';
import type { Product, Unit } from '@/types';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: getUnits,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Find the current category
  const category = categories.find((c) => c.slug === slug);
  
  // Filter products by category (only active products)
  const products = category 
    ? allProducts.filter((p) => p.categoryId === category.id && p.isActive)
    : [];

  const handleAddToBasket = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getUnit = (unitId: string): Unit | undefined => {
    return units.find((u) => u.id === unitId);
  };

  const isLoading = productsLoading || categoriesLoading;

  // Category not found
  if (!isLoading && !category) {
    return (
      <div className="min-h-screen bg-[#F5F3EF]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <Package className="mx-auto h-16 w-16 text-gray-300" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Kategória nem található</h1>
          <p className="mt-2 text-gray-500">A keresett kategória nem létezik.</p>
          <Link href="/">
            <Button className="mt-6 bg-[#1B5E4B] hover:bg-[#247a61]">
              Vissza a főoldalra
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <Navbar />
      
      {/* Header */}
      <div className="relative">
        {/* Background Image */}
        {category?.imageUrl && (
          <div className="absolute inset-0 h-full">
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}
        
        <div className={`relative py-12 ${category?.imageUrl ? 'text-white' : 'bg-[#1B5E4B] text-white'}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Vissza a főoldalra
            </Link>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-white/20 rounded w-64 mb-2" />
                <div className="h-5 bg-white/20 rounded w-32" />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold sm:text-4xl">{category?.name}</h1>
                {category?.description && (
                  <p className="mt-2 text-white/80 max-w-2xl">{category.description}</p>
                )}
                <p className="mt-2 text-white/60">
                  {products.length} termék
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Nincsenek termékek</h2>
            <p className="mt-2 text-gray-500">Ebben a kategóriában jelenleg nincsenek elérhető termékek.</p>
            <Link href="/termekek">
              <Button className="mt-6 bg-[#1B5E4B] hover:bg-[#247a61]">
                Összes termék megtekintése
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                unit={getUnit(product.unitId)}
                category={category}
                onAddToBasket={handleAddToBasket}
                className="bg-white"
              />
            ))}
          </div>
        )}
      </div>

      {/* Add to Basket Modal */}
      <AddToBasketModal
        product={selectedProduct}
        unit={selectedProduct?.unitId ? getUnit(selectedProduct.unitId) : undefined}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      <Footer />
    </div>
  );
}
