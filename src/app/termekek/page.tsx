'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AddToBasketModal } from '@/components/basket/AddToBasketModal';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts, getUnits, getCategories } from '@/lib/store-service';
import type { Product, Unit, Category } from '@/types';

export default function AllProductsPage() {
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

  const { data: allCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Filter to only active products and categories client-side
  const products = allProducts.filter((p) => p.isActive);
  const categories = allCategories.filter((c) => c.isActive);

  const handleAddToBasket = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getUnit = (unitId: string): Unit | undefined => {
    return units.find((u) => u.id === unitId);
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <Navbar />
      
      {/* Header */}
      <div className="bg-[#1B5E4B] text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Vissza a főoldalra
          </Link>
          <h1 className="text-3xl font-bold sm:text-4xl">Összes Termék</h1>
          <p className="mt-2 text-white/80">
            {products.length} termék
          </p>
        </div>
      </div>

      {/* Products by Category */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
            <p className="mt-2 text-gray-500">Jelenleg nincsenek elérhető termékek.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Group products by category */}
            {categories
              .filter((category) => products.some((p) => p.categoryId === category.id))
              .map((category) => {
                const categoryProducts = products.filter((p) => p.categoryId === category.id);
                
                return (
                  <section key={category.id} id={`category-${category.slug}`}>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {categoryProducts.length} termék
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-6">
                      {categoryProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          unit={getUnit(product.unitId)}
                          category={category}
                          onAddToBasket={handleAddToBasket}
                          className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[280px]"
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            
            {/* Products without category */}
            {products.filter((p) => !p.categoryId).length > 0 && (
              <section id="category-other">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Egyéb termékek</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {products.filter((p) => !p.categoryId).length} termék
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6">
                  {products
                    .filter((p) => !p.categoryId)
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        unit={getUnit(product.unitId)}
                        onAddToBasket={handleAddToBasket}
                        className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[280px]"
                      />
                    ))}
                </div>
              </section>
            )}
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
