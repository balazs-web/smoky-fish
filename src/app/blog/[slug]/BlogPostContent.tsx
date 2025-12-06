'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft, Share2, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/blog-service';
import { getCategories } from '@/lib/store-service';
import type { BlogPost, Category } from '@/types';

function formatDate(date: Date): string {
  return date.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function RelatedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          {post.mainImageUrl ? (
            <Image
              src={post.mainImageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-xs">Nincs kép</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-[#1B5E4B] transition-colors">
            {post.title}
          </h4>
          <p className="text-sm text-gray-500 line-clamp-2">{post.subtitle}</p>
        </div>
      </article>
    </Link>
  );
}

function CategoryPromoBox({ category }: { category: Category }) {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <Link
        href={`/kategoria/${category.slug}`}
        className="group block rounded-2xl bg-gradient-to-br from-[#1B5E4B] to-[#247a61] p-6 sm:p-8 text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/80 mb-1">
              Tetszett a cikk?
            </p>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Fedezd fel a {category.name.toLowerCase()} kínálatunkat!
            </h3>
            {category.description && (
              <p className="text-white/90 text-sm sm:text-base line-clamp-2 mt-1">
                {category.description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#1B5E4B] transition-all duration-300 group-hover:gap-3">
              {category.name} megtekintése
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function ShareButton() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link másolva a vágólapra!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1B5E4B] transition-colors"
    >
      <Share2 className="h-4 w-4" />
      Megosztás
    </button>
  );
}

export default function BlogPostContent({ slug }: { slug: string }) {
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => getBlogPostBySlug(slug),
    enabled: !!slug,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ['relatedPosts', post?.id],
    queryFn: () =>
      getRelatedPosts(post!.id, post!.tags, post!.categoryIds, 2),
    enabled: !!post,
  });

  // Get category names for badges
  const postCategories = categories?.filter((c: Category) =>
    post?.categoryIds.includes(c.id)
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF]">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-4">
          <div className="bg-gray-200 animate-pulse rounded-2xl" style={{ height: 'clamp(200px, 30vh, 300px)' }} />
        </div>
        <div className="relative -mt-12 pb-16 px-4 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 animate-pulse">
              <div className="h-6 bg-gray-200 rounded-full w-24 mb-5" />
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-6" />
              <div className="flex gap-6 pb-8 mb-8 border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-28" />
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#F5F3EF]">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Cikk nem található
          </h1>
          <p className="text-gray-600 mb-8">
            A keresett cikk nem létezik vagy eltávolításra került.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#1B5E4B] font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Vissza a bloghoz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <Navbar />

      {/* Hero image section - constrained */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-4">
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 'clamp(200px, 30vh, 300px)' }}>
          {post.mainImageUrl && (
            <Image
              src={post.mainImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          )}
          {/* Gradient fade at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F5F3EF] to-transparent" />
          
          {/* Back link on image */}
          <div className="absolute top-4 left-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
              Vissza a bloghoz
            </Link>
          </div>
        </div>
      </div>

      {/* Content card - overlaps the image slightly */}
      <div className="relative -mt-12 pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl px-6 py-8 sm:px-10 sm:py-10">
              {/* Category badges */}
              {postCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {postCategories.map((cat: Category) => (
                    <span
                      key={cat.id}
                      className="bg-[#1B5E4B] text-white text-sm px-4 py-1.5 rounded-full font-medium"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {post.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-8 mb-8 border-b border-gray-200">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTimeMinutes} perc olvasás
                </span>
                <div className="flex-1" />
                <ShareButton />
              </div>

              {/* Article Content */}
              <div
                className="blog-content max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <span className="text-sm text-gray-500 mr-3">Címkék:</span>
                  <div className="inline-flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Posts */}
              {relatedPosts && relatedPosts.length > 0 && (
                <div className="mt-16 pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Kapcsolódó cikkek
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                    ))}
                  </div>
                </div>
              )}

              {/* Category Promo Box */}
              {postCategories.length > 0 && (
                <CategoryPromoBox category={postCategories[0]} />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
