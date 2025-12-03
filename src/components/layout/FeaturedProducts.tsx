'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getUnits, getCategories } from '@/lib/store-service';
import { AddToBasketModal } from '@/components/basket/AddToBasketModal';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product, Unit, Category } from '@/types';

export function FeaturedProducts() {
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

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Filter featured and active products
  const featuredProducts = allProducts.filter((p) => p.isFeatured && p.isActive);

  const handleAddToBasket = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getUnit = (unitId: string): Unit | undefined => {
    return units.find((u) => u.id === unitId);
  };

  const getCategory = (categoryId: string): Category | undefined => {
    return categories.find((c) => c.id === categoryId);
  };

  if (productsLoading) {
    return (
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-10">
            Kiemelt Termékeink
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[280px] bg-white rounded-2xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-10">
          Kiemelt Termékeink
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              unit={getUnit(product.unitId)}
              category={getCategory(product.categoryId)}
              onAddToBasket={handleAddToBasket}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[280px] bg-[#F5F3EF]"
            />
          ))}
        </div>
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
    </section>
  );
}
