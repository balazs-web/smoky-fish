'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  Upload,
  ExternalLink,
  Image as ImageIcon,
  ChevronLeft,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  generateUniqueSlug,
} from '@/lib/blog-service';
import { getCategories } from '@/lib/store-service';
import { uploadImage } from '@/lib/storage-service';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import type { BlogPost, BlogPostFormData, Category } from '@/types';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Cím kötelező'),
  subtitle: z.string().min(1, 'Alcím kötelező'),
  slug: z.string().min(1, 'Slug kötelező'),
  mainImageUrl: z.string(),
  content: z.string().min(1, 'Tartalom kötelező'),
  categoryIds: z.array(z.string()),
  tags: z.string(), // Comma-separated, will be split
  isPublished: z.boolean(),
  publishedAt: z.date(),
  readTimeMinutes: z.number().optional(),
});

type FormValues = z.infer<typeof blogPostSchema>;

function formatDate(date: Date): string {
  return date.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogAdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['adminBlogPosts'],
    queryFn: getBlogPosts,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      slug: '',
      mainImageUrl: '',
      content: '',
      categoryIds: [],
      tags: '',
      isPublished: false,
      publishedAt: new Date(),
    },
  });

  const watchTitle = watch('title');
  const watchMainImage = watch('mainImageUrl');

  // Auto-generate slug from title
  useEffect(() => {
    if (watchTitle && !editingPost) {
      generateUniqueSlug(watchTitle).then((slug) => {
        setValue('slug', slug);
      });
    }
  }, [watchTitle, editingPost, setValue]);

  const createMutation = useMutation({
    mutationFn: (data: BlogPostFormData) => createBlogPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      setIsDialogOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogPostFormData> }) =>
      updateBlogPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      setIsDialogOpen(false);
      setEditingPost(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      setIsDeleting(null);
    },
  });

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    reset({
      title: post.title,
      subtitle: post.subtitle,
      slug: post.slug,
      mainImageUrl: post.mainImageUrl,
      content: post.content,
      categoryIds: post.categoryIds,
      tags: post.tags.join(', '),
      isPublished: post.isPublished,
      publishedAt: post.publishedAt,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingPost(null);
    reset({
      title: '',
      subtitle: '',
      slug: '',
      mainImageUrl: '',
      content: '',
      categoryIds: [],
      tags: '',
      isPublished: false,
      publishedAt: new Date(),
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    const formData: BlogPostFormData = {
      ...data,
      tags: data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (editingPost) {
      await updateMutation.mutateAsync({ id: editingPost.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file, 'blog');
      setValue('mainImageUrl', url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Full-page editor view
  if (isDialogOpen) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-50">
        {/* Editor Header */}
        <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/95 backdrop-blur px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingPost(null);
                  reset();
                }}
                className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm">Vissza a listához</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Controller
                name="isPublished"
                control={control}
                render={({ field }) => (
                  <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg bg-neutral-800">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-[#C89A63] focus:ring-[#C89A63]"
                    />
                    <span className="text-sm text-neutral-200">Publikus</span>
                  </label>
                )}
              />
              {editingPost && (
                <Link
                  href={`/blog/${watch('slug')}`}
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Előnézet
                </Link>
              )}
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                className="bg-[#C89A63] text-black hover:bg-[#b8864f] hidden sm:flex"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting || createMutation.isPending || updateMutation.isPending
                  ? 'Mentés...'
                  : 'Mentés'}
              </Button>
            </div>
          </div>
        </header>

        {/* Editor Content */}
        <main className="px-6 py-8 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Main Content - Left Side */}
              <div className="xl:col-span-2 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <input
                    {...register('title')}
                    className="w-full bg-transparent text-3xl font-bold text-neutral-100 placeholder-neutral-600 outline-none border-b border-transparent focus:border-[#C89A63] pb-2 transition-colors"
                    placeholder="Cikk címe..."
                  />
                  {errors.title && (
                    <p className="text-xs text-red-400">{errors.title.message}</p>
                  )}
                </div>

                {/* Subtitle */}
                <div className="space-y-2">
                  <textarea
                    {...register('subtitle')}
                    rows={2}
                    className="w-full bg-transparent text-lg text-neutral-400 placeholder-neutral-600 outline-none resize-none border-b border-transparent focus:border-[#C89A63] pb-2 transition-colors"
                    placeholder="Rövid leírás, ami a kártyákon megjelenik..."
                  />
                  {errors.subtitle && (
                    <p className="text-xs text-red-400">{errors.subtitle.message}</p>
                  )}
                </div>

                {/* Rich Text Editor */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Tartalom</label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Kezdj el írni..."
                      />
                    )}
                  />
                  {errors.content && (
                    <p className="text-xs text-red-400">{errors.content.message}</p>
                  )}
                </div>
              </div>

              {/* Sidebar - Right Side */}
              <div className="space-y-6">
                {/* Main Image */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 space-y-3">
                  <label className="text-sm font-medium text-neutral-300">Fő kép</label>
                  <div className="aspect-video rounded-lg bg-neutral-800 overflow-hidden">
                    {watchMainImage ? (
                      <img src={watchMainImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600">
                        <ImageIcon className="h-10 w-10 mb-2" />
                        <span className="text-xs">Nincs kép</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      {...register('mainImageUrl')}
                      className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-[#C89A63]"
                      placeholder="Kép URL..."
                    />
                    <label className="flex items-center justify-center gap-2 cursor-pointer rounded bg-neutral-800 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-700 transition-colors">
                      <Upload className="h-4 w-4" />
                      Kép feltöltése
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                {/* Slug */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 space-y-3">
                  <label className="text-sm font-medium text-neutral-300">URL slug</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">/blog/</span>
                    <input
                      {...register('slug')}
                      className="flex-1 rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-[#C89A63]"
                      placeholder="cikk-url"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-xs text-red-400">{errors.slug.message}</p>
                  )}
                </div>

                {/* Categories */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 space-y-3">
                  <label className="text-sm font-medium text-neutral-300">Kategóriák</label>
                  <Controller
                    name="categoryIds"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-2">
                        {categories?.map((cat: Category) => (
                          <label
                            key={cat.id}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors ${
                              (field.value || []).includes(cat.id)
                                ? 'bg-[#1B5E4B] text-white'
                                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={(field.value || []).includes(cat.id)}
                              onChange={(e) => {
                                const currentValue = field.value || [];
                                if (e.target.checked) {
                                  field.onChange([...currentValue, cat.id]);
                                } else {
                                  field.onChange(currentValue.filter((id: string) => id !== cat.id));
                                }
                              }}
                            />
                            {cat.name}
                          </label>
                        ))}
                        {(!categories || categories.length === 0) && (
                          <p className="text-xs text-neutral-500">Nincsenek kategóriák</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Tags */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 space-y-3">
                  <label className="text-sm font-medium text-neutral-300">Címkék</label>
                  <input
                    {...register('tags')}
                    className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-[#C89A63]"
                    placeholder="recept, lazac, tipp"
                  />
                  <p className="text-[10px] text-neutral-500">Vesszővel elválasztva</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Floating Save Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              {editingPost ? 'Szerkesztés' : 'Új cikk'}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingPost(null);
                  reset();
                }}
                className="px-4 py-2 text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Mégse
              </button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                className="bg-[#C89A63] text-black hover:bg-[#b8864f] px-8 py-3 text-base"
                size="lg"
              >
                <Save className="h-5 w-5 mr-2" />
                {isSubmitting || createMutation.isPending || updateMutation.isPending
                  ? 'Mentés...'
                  : 'Cikk mentése'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-black/80 px-6 py-4">
        <div className="flex items-center justify-between pr-48">
          <div className="flex items-center gap-4">
            <Link
              href="/matyi"
              className="text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold tracking-tight">
              Blog kezelés
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/matyi/user-guides/blog"
              className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors rounded-lg hover:bg-neutral-800"
            >
              <HelpCircle className="h-4 w-4" />
              Használati útmutató
            </Link>
            <Button
              onClick={handleCreate}
              className="bg-[#C89A63] text-black hover:bg-[#b8864f]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Új cikk
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-8">
        {postsLoading ? (
          <div className="text-center py-12 text-neutral-400">Betöltés...</div>
        ) : posts && posts.length > 0 ? (
          <div className="rounded-lg border border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800 hover:bg-neutral-900/50">
                  <TableHead className="text-neutral-300">Kép</TableHead>
                  <TableHead className="text-neutral-300">Cím</TableHead>
                  <TableHead className="text-neutral-300">Státusz</TableHead>
                  <TableHead className="text-neutral-300">Dátum</TableHead>
                  <TableHead className="text-neutral-300 text-right">Műveletek</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id} className="border-neutral-800 hover:bg-neutral-900/50">
                    <TableCell>
                      {post.mainImageUrl ? (
                        <img
                          src={post.mainImageUrl}
                          alt={post.title}
                          className="h-12 w-20 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-20 bg-neutral-800 rounded flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-neutral-600" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-neutral-100">{post.title}</p>
                        <p className="text-xs text-neutral-500 truncate max-w-xs">
                          {post.subtitle}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.isPublished ? (
                        <Badge className="bg-green-900/50 text-green-400 border-green-800">
                          <Eye className="h-3 w-3 mr-1" />
                          Publikus
                        </Badge>
                      ) : (
                        <Badge className="bg-neutral-800 text-neutral-400 border-neutral-700">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Piszkozat
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-neutral-400 text-sm">
                      {formatDate(post.publishedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-neutral-400 hover:text-neutral-200 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 text-neutral-400 hover:text-neutral-200 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setIsDeleting(post.id)}
                          className="p-2 text-neutral-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-400 mb-4">Még nincsenek blog cikkek.</p>
            <Button
              onClick={handleCreate}
              className="bg-[#C89A63] text-black hover:bg-[#b8864f]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Első cikk létrehozása
            </Button>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle>Cikk törlése</DialogTitle>
          </DialogHeader>
          <p className="text-neutral-400">
            Biztosan törölni szeretnéd ezt a cikket? Ez a művelet nem vonható vissza.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleting(null)}
              className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800"
            >
              Mégse
            </Button>
            <Button
              onClick={() => isDeleting && deleteMutation.mutate(isDeleting)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Törlés...' : 'Törlés'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
