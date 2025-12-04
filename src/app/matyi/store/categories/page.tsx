'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, GripVertical, FolderTree, Scale, Wine } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { ImageUpload } from '@/components/ui/image-upload';
import { AccentWarning, hasAccents } from '@/components/ui/accent-warning';

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/store-service';
import { uploadImage, deleteImage } from '@/lib/storage-service';
import { generateSlug } from '@/lib/slug';
import type { Category, CategoryFormData } from '@/types';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.number().min(0),
  isActive: z.boolean(),
  hasApproximateWeight: z.boolean().optional(),
  isAlcohol18Plus: z.boolean().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAccentWarning, setShowAccentWarning] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      order: 0,
      isActive: true,
      hasApproximateWeight: false,
      isAlcohol18Plus: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryFormData> }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Find the category to get its image URL for cleanup
      const category = categories.find((c) => c.id === id);
      if (category?.imageUrl) {
        await deleteImage(category.imageUrl);
      }
      return deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteConfirmId(null);
    },
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setImageUrls([]);
    setOriginalImageUrl(null);
    form.reset({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      order: categories.length,
      isActive: true,
      hasApproximateWeight: false,
      isAlcohol18Plus: false,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setImageUrls(category.imageUrl ? [category.imageUrl] : []);
    setOriginalImageUrl(category.imageUrl || null);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      order: category.order,
      isActive: category.isActive,
      hasApproximateWeight: category.hasApproximateWeight || false,
      isAlcohol18Plus: category.isAlcohol18Plus || false,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setImageUrls([]);
    setOriginalImageUrl(null);
    form.reset();
  };

  const onSubmit = async (data: CategoryFormValues) => {
    const imageUrl = imageUrls[0] || '';
    const formData = { ...data, imageUrl };

    // Clean up old image if it was replaced
    if (editingCategory && originalImageUrl && originalImageUrl !== imageUrl) {
      await deleteImage(originalImageUrl);
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleImageUpload = useCallback(
    async (file: File): Promise<string> => {
      const path = `categories/${editingCategory?.id || 'new-' + Date.now()}`;
      return uploadImage(file, path);
    },
    [editingCategory]
  );

  const handleImageRemove = useCallback(async (url: string): Promise<void> => {
    // Only delete from storage if it's not the original (we'll clean that up on save)
    if (url !== originalImageUrl) {
      await deleteImage(url);
    }
  }, [originalImageUrl]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    if (!editingCategory) {
      form.setValue('slug', generateSlug(name));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value;
    form.setValue('slug', slug);
    if (hasAccents(slug)) {
      setShowAccentWarning(true);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-600 mt-1">Manage your product categories</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No categories yet</p>
              <Button variant="link" onClick={handleOpenCreate}>
                Create your first category
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Order</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-400">
                        <GripVertical className="w-4 h-4" />
                        {category.order}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {category.imageUrl ? (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="w-10 h-10 object-cover"
                            />
                          ) : (
                            <FolderTree className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">{category.slug}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={category.isActive ? 'default' : 'secondary'}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {category.hasApproximateWeight && (
                          <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">
                            <Scale className="h-3 w-3 mr-1" />
                            ~tömeg
                          </Badge>
                        )}
                        {category.isAlcohol18Plus && (
                          <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50">
                            <Wine className="h-3 w-3 mr-1" />
                            18+
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(category)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmId(category.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...form.register('name')}
                onChange={handleNameChange}
                placeholder="e.g., Cheese"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...form.register('slug')}
                onChange={handleSlugChange}
                placeholder="e.g., cheese"
              />
              {form.formState.errors.slug && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Category description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUpload
                value={imageUrls}
                onChange={setImageUrls}
                onUpload={handleImageUpload}
                onRemove={handleImageRemove}
                maxImages={1}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                {...form.register('order', { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={form.watch('isActive')}
                onCheckedChange={(checked) => form.setValue('isActive', checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            {/* Category Warnings */}
            <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">Figyelmeztetések a kategória termékeihez</p>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="hasApproximateWeight"
                  checked={form.watch('hasApproximateWeight') || false}
                  onCheckedChange={(checked) => form.setValue('hasApproximateWeight', checked)}
                />
                <Label htmlFor="hasApproximateWeight" className="text-sm text-amber-900">
                  ⚖️ Hozzávetőleges tömeg (csomagoláskor derül ki)
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isAlcohol18Plus"
                  checked={form.watch('isAlcohol18Plus') || false}
                  onCheckedChange={(checked) => form.setValue('isAlcohol18Plus', checked)}
                />
                <Label htmlFor="isAlcohol18Plus" className="text-sm text-amber-900">
                  🍷 Alkohol - csak 18 éven felülieknek
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Slug Warning Dialog */}
      <AccentWarning 
        isOpen={showAccentWarning} 
        onClose={() => setShowAccentWarning(false)}
        onClearSlug={() => form.setValue('slug', '')}
      />
    </div>
  );
}
