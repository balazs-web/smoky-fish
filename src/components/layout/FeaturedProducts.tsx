'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { getProducts, getUnits } from '@/lib/store-service';
import { Button } from '@/components/ui/button';
import { AddToBasketModal } from '@/components/basket/AddToBasketModal';
import type { Product, Unit } from '@/types';

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

  // Filter featured and active products
  const featuredProducts = allProducts.filter((p) => p.isFeatured && p.isActive);

  const handleAddToBasket = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getUnit = (unitId: string): Unit | undefined => {
    return units.find((u) => u.id === unitId);
  };

  const getUnitName = (unitId: string): string => {
    const unit = units.find((u) => u.id === unitId);
    return unit?.name || '';
  };

  const formatPrice = (priceInCents: number): string => {
    return (priceInCents / 100).toLocaleString('hu-HU');
  };

  if (productsLoading) {
    return (
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-10">
            Kiemelt Termékeink
          </h2>
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
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  // Determine grid class based on number of products for proper centering
  const getGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1 max-w-xs';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-xl';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl';
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-10">
          Kiemelt Termékeink
        </h2>
        <div className={`grid gap-6 mx-auto ${getGridClass(featuredProducts.length)}`}>
          {featuredProducts.map((product) => {
            const imageUrl = product.imageUrl || product.images?.[0];
            
            return (
              <div
                key={product.id}
                className="group bg-[#F5F3EF] rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Product Image - Clickable */}
                <Link href={`/termek/${product.slug}`}>
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/termek/${product.slug}`}>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] hover:text-[#1B5E4B] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* Price */}
                  <div className="mt-2 mb-4">
                    <span className="text-xl font-bold text-[#1B5E4B]">
                      {formatPrice(product.price)} Ft
                    </span>
                    {product.unitId && (
                      <span className="text-sm text-gray-500 ml-1">
                        / {getUnitName(product.unitId)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button 
                    className="w-full bg-[#1B5E4B] hover:bg-[#247a61] text-white"
                    onClick={() => handleAddToBasket(product)}
                  >
                    Kosárba
                  </Button>
                </div>
              </div>
            );
          })}
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
