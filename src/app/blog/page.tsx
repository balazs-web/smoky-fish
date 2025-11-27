'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { getPublishedBlogPosts } from '@/lib/blog-service';
import { getCategories } from '@/lib/store-service';
import type { BlogPost, Category } from '@/types';

function formatDate(date: Date): string {
  return date.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function BlogCard({ post, categories }: { post: BlogPost; categories: Category[] }) {
  // Get category names for this post
  const postCategories = categories.filter((c) => post.categoryIds.includes(c.id));

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
          {post.mainImageUrl ? (
            <img
              src={post.mainImageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-gray-400 text-sm">Nincs kép</span>
            </div>
          )}
          
          {/* Category badges */}
          {postCategories.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
              {postCategories.slice(0, 2).map((cat) => (
                <span
                  key={cat.id}
                  className="bg-[#1B5E4B] text-white text-xs px-2 py-1 rounded-full"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-[#1B5E4B] transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {post.subtitle}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-400 pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTimeMinutes} perc olvasás
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[16/10] bg-gray-200" />
      <div className="p-6 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="flex gap-4">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: getPublishedBlogPosts,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <Navbar />

      {/* Hero */}
      <header className="bg-[#1a1a1a] text-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Vissza a főoldalra
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Magazin & Gasztronómiai Tippek
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Fedezze fel receptjeinket, hasznos tippjeinket és ismerje meg a füstölt halak csodálatos világát.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="py-16 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <>
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => (
                <BlogCard key={post.id} post={post} categories={categories || []} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500 text-lg">Még nincsenek cikkek.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Hamarosan érkeznek az első bejegyzések!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
