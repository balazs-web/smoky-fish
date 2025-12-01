'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { getFeaturedBlogPosts } from '@/lib/blog-service';
import type { BlogPost } from '@/types';

function formatDate(date: Date): string {
  return date.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          {post.mainImageUrl ? (
            <Image
              src={post.mainImageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-gray-400 text-sm">Nincs kép</span>
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
          <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
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
        <div className="flex gap-4 pt-2">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function BlogSection() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['featuredBlogPosts'],
    queryFn: () => getFeaturedBlogPosts(3),
  });

  // Don't show section if no posts
  if (!isLoading && (!posts || posts.length === 0)) {
    return null;
  }

  return (
    <section className="bg-[#F5F3EF] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Magazin & Gasztronómiai Tippek
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fedezze fel receptjeinket, tippjeinket és a füstölt halak világát.
          </p>
        </div>

        {/* Grid */}
        <div className={`grid gap-8 mx-auto ${
          !isLoading && posts?.length === 1 
            ? 'grid-cols-1 max-w-md' 
            : !isLoading && posts?.length === 2 
              ? 'grid-cols-1 md:grid-cols-2 max-w-3xl' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl'
        }`}>
          {isLoading ? (
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          ) : (
            posts?.map((post) => <BlogCard key={post.id} post={post} />)
          )}
        </div>

        {/* View All Link */}
        {posts && posts.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#1B5E4B] font-medium hover:underline"
            >
              Összes cikk megtekintése
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
