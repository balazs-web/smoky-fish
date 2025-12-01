'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { AddToBasketModal } from '@/components/basket/AddToBasketModal';
import { getProducts, getUnits, getCategories } from '@/lib/store-service';
import type { Product, Unit } from '@/types';

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

  const getUnitName = (unitId: string): string => {
    const unit = units.find((u) => u.id === unitId);
    return unit?.name || '';
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || '';
  };

  const formatPrice = (priceInCents: number): string => {
    return (priceInCents / 100).toLocaleString('hu-HU');
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

      {/* Products Grid */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const imageUrl = product.imageUrl || product.images?.[0];
              
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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
                    {/* Category Badge */}
                    {product.categoryId && (
                      <span className="inline-block text-xs font-medium text-[#1B5E4B] bg-[#1B5E4B]/10 px-2 py-1 rounded mb-2">
                        {getCategoryName(product.categoryId)}
                      </span>
                    )}
                    
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
