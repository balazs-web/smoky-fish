'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowRight, FolderOpen } from 'lucide-react';
import { getCategories } from '@/lib/store-service';
import { cn } from '@/lib/utils';

export function CategoryCards() {
  const { data: allCategories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Filter active categories client-side to avoid Firestore index issues
  const categories = allCategories.filter((c) => c.isActive);

  if (isLoading) {
    return (
      <section className="bg-[#F5F3EF] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't hide the section - show placeholder if no categories
  if (categories.length === 0) {
    return (
      <section className="bg-[#F5F3EF] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No categories available yet</p>
        </div>
      </section>
    );
  }

  // Determine grid columns based on number of categories
  const getGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1 max-w-md';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-3xl';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl';
    if (count === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl';
    if (count === 5) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl';
    if (count === 6) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  return (
    <section className="bg-[#F5F3EF] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex justify-center">
        <div className={cn('grid gap-6 w-full mx-auto', getGridClass(categories.length))}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategoria/${category.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Background Image */}
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-1 text-sm text-white/80 line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* Button */}
                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-[#1B5E4B] px-4 py-2 text-sm font-medium text-white transition-all duration-300 group-hover:bg-[#247a61] group-hover:gap-3">
                    {category.name}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
