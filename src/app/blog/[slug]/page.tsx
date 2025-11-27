import { getPublishedBlogPosts } from '@/lib/blog-service';
import BlogPostContent from './BlogPostContent';

// Generate static paths for all blog posts at build time
export async function generateStaticParams() {
  try {
    const posts = await getPublishedBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostContent slug={slug} />;
}
