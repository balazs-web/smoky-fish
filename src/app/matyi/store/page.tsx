'use client';

import { useQuery } from '@tanstack/react-query';
import { Package, FolderTree, Star, TrendingUp, Ruler } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts, getCategories, getUnits } from '@/lib/store-service';
import Link from 'next/link';

export default function StoreDashboard() {
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: units = [], isLoading: unitsLoading } = useQuery({
    queryKey: ['units'],
    queryFn: getUnits,
  });

  const activeProducts = products.filter((p) => p.isActive);
  const featuredProducts = products.filter((p) => p.isFeatured);
  const activeCategories = categories.filter((c) => c.isActive);

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      href: '/matyi/store/products',
      color: 'bg-blue-500',
    },
    {
      title: 'Active Products',
      value: activeProducts.length,
      icon: TrendingUp,
      href: '/matyi/store/products',
      color: 'bg-green-500',
    },
    {
      title: 'Featured Products',
      value: featuredProducts.length,
      icon: Star,
      href: '/matyi/store/products',
      color: 'bg-yellow-500',
    },
    {
      title: 'Categories',
      value: activeCategories.length,
      icon: FolderTree,
      href: '/matyi/store/categories',
      color: 'bg-purple-500',
    },
    {
      title: 'Units',
      value: units.filter((u) => u.isActive).length,
      icon: Ruler,
      href: '/matyi/store/units',
      color: 'bg-orange-500',
    },
  ];

  const getUnitName = (unitId: string): string => {
    const unit = units.find((u) => u.id === unitId);
    return unit?.name || '';
  };

  const isLoading = productsLoading || categoriesLoading || unitsLoading;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Overview of your store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {isLoading ? '...' : stat.value}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No products yet</p>
              <Link
                href="/matyi/store/products"
                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
              >
                Add your first product
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {(() => {
                        const validImage = product.imageUrl?.trim() || product.images?.find(img => img?.trim());
                        return validImage ? (
                          <img
                            src={validImage}
                            alt={product.name}
                            className="w-10 h-10 object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-gray-400" />
                        );
                      })()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {(product.price / 100).toLocaleString('hu-HU')} Ft
                        {product.unitId && ` / ${getUnitName(product.unitId)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.isFeatured && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        product.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
