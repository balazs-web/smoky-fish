'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Star, Package, X, Layers } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  getProducts,
  getCategories,
  getUnits,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/store-service';
import { generateSlug } from '@/lib/slug';
import { uploadImage, deleteImage, deleteImages } from '@/lib/storage-service';
import type { Product, ProductFormData, Category, Unit, ProductVariant } from '@/types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  unitId: z.string().min(1, 'Unit is required'),
  imageUrl: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  stock: z.number().min(0),
});

type ProductFormValues = z.infer<typeof productSchema>;

function formatPrice(priceInCents: number): string {
  return `${(priceInCents / 100).toLocaleString('hu-HU')} Ft`;
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVariantName, setNewVariantName] = useState('');

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

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      categoryId: '',
      unitId: '',
      imageUrl: '',
      isFeatured: false,
      isActive: true,
      stock: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductFormData> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Find the product to get its images for cleanup
      const product = products.find((p) => p.id === id);
      const imagesToDelete = [
        product?.imageUrl,
        ...(product?.images || []),
      ].filter(Boolean) as string[];
      
      if (imagesToDelete.length > 0) {
        await deleteImages(imagesToDelete);
      }
      return deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteConfirmId(null);
    },
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setImageUrls([]);
    setOriginalImageUrls([]);
    setVariants([]);
    setNewVariantName('');
    form.reset({
      name: '',
      slug: '',
      description: '',
      price: 0,
      categoryId: '', // Force user to select a category
      unitId: '', // Force user to select a unit
      imageUrl: '',
      isFeatured: false,
      isActive: true,
      stock: 0,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    // Combine imageUrl and images array for editing
    const existingImages = [
      product.imageUrl,
      ...(product.images || []),
    ].filter(Boolean) as string[];
    setImageUrls(existingImages);
    setOriginalImageUrls(existingImages);
    setVariants(product.variants || []);
    setNewVariantName('');
    form.reset({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price / 100, // Convert cents to display value
      categoryId: product.categoryId,
      unitId: product.unitId || '',
      imageUrl: product.imageUrl || '',
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      stock: product.stock,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setImageUrls([]);
    setOriginalImageUrls([]);
    setVariants([]);
    setNewVariantName('');
    form.reset();
  };

  const onSubmit = async (data: ProductFormValues) => {
    // First image goes to imageUrl, rest go to images array
    const imageUrl = imageUrls[0] || '';
    const images = imageUrls.slice(1);
    
    const formData = {
      ...data,
      price: Math.round(data.price * 100), // Convert to cents
      imageUrl,
      images,
      variants: variants.length > 0 ? variants : undefined,
    };

    // Clean up removed images
    if (editingProduct) {
      const removedImages = originalImageUrls.filter(
        (url) => !imageUrls.includes(url)
      );
      if (removedImages.length > 0) {
        await deleteImages(removedImages);
      }
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleImageUpload = useCallback(
    async (file: File): Promise<string> => {
      const path = `products/${editingProduct?.id || 'new-' + Date.now()}`;
      return uploadImage(file, path);
    },
    [editingProduct]
  );

  const handleImageRemove = useCallback(
    async (url: string): Promise<void> => {
      // Only delete immediately if it's a new upload (not in original)
      if (!originalImageUrls.includes(url)) {
        await deleteImage(url);
      }
    },
    [originalImageUrls]
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    if (!editingProduct) {
      form.setValue('slug', generateSlug(name));
    }
  };

  // Variant management functions
  const addVariant = () => {
    if (!newVariantName.trim()) return;
    const newVariant: ProductVariant = {
      id: `variant-${Date.now()}`,
      name: newVariantName.trim(),
      priceModifier: 0,
      isAvailable: true,
    };
    setVariants([...variants, newVariant]);
    setNewVariantName('');
  };

  const removeVariant = (variantId: string) => {
    setVariants(variants.filter((v) => v.id !== variantId));
  };

  const updateVariant = (variantId: string, updates: Partial<ProductVariant>) => {
    setVariants(variants.map((v) => 
      v.id === variantId ? { ...v, ...updates } : v
    ));
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const getUnitName = (unitId: string): string => {
    const unit = units.find((u) => u.id === unitId);
    return unit?.name || '';
  };

  const activeCategories = categories.filter((c) => c.isActive);
  const activeUnits = units.filter((u) => u.isActive);

  const filteredProducts =
    filterCategory === 'all'
      ? products
      : products.filter((p) => p.categoryId === filterCategory);

  const isLoading = productsLoading || categoriesLoading || unitsLoading;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600 mt-1">Manage your store products</p>
        </div>
        <Button onClick={handleOpenCreate} disabled={activeCategories.length === 0 || activeUnits.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {(activeCategories.length === 0 || activeUnits.length === 0) && !categoriesLoading && !unitsLoading && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-4">
            <p className="text-yellow-800">
              {activeCategories.length === 0 && activeUnits.length === 0
                ? 'You need to create at least one active category and one active unit before adding products.'
                : activeCategories.length === 0
                ? 'You need to create at least one active category before adding products.'
                : 'You need to create at least one active unit before adding products.'}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Products</CardTitle>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No products found</p>
              {activeCategories.length > 0 && activeUnits.length > 0 && (
                <Button variant="link" onClick={handleOpenCreate}>
                  Create your first product
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {(product.imageUrl || product.images?.[0]) ? (
                            <img
                              src={product.imageUrl || product.images?.[0]}
                              alt={product.name}
                              className="w-10 h-10 object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 flex items-center gap-2">
                            {product.name}
                            {product.isFeatured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                            {product.variants && product.variants.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Layers className="w-3 h-3 mr-1" />
                                {product.variants.length} változat
                              </Badge>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryName(product.categoryId)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        {formatPrice(product.price)}
                        {product.unitId && (
                          <span className="text-gray-500 font-normal text-sm">
                            {' '}/ {getUnitName(product.unitId)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? 'Active' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmId(product.id)}
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Create Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  onChange={handleNameChange}
                  placeholder="e.g., Aged Cheddar"
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
                  placeholder="e.g., aged-cheddar"
                />
                {form.formState.errors.slug && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Product description..."
                rows={3}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Ft)</Label>
                <Input
                  id="price"
                  type="number"
                  step="1"
                  {...form.register('price', { valueAsNumber: true })}
                  placeholder="0"
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  {...form.register('stock', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId" className="flex items-center gap-1">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.watch('categoryId')}
                  onValueChange={(value) => form.setValue('categoryId', value, { shouldValidate: true })}
                >
                  <SelectTrigger className={form.formState.errors.categoryId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Válassz kategóriát..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.isActive).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.categoryId && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitId" className="flex items-center gap-1">
                  Unit <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.watch('unitId')}
                  onValueChange={(value) => form.setValue('unitId', value, { shouldValidate: true })}
                >
                  <SelectTrigger className={form.formState.errors.unitId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Válassz egységet..." />
                  </SelectTrigger>
                  <SelectContent>
                    {units.filter(u => u.isActive).map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.unitId && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.unitId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Images (up to 3)</Label>
              <ImageUpload
                value={imageUrls}
                onChange={setImageUrls}
                onUpload={handleImageUpload}
                onRemove={handleImageRemove}
                maxImages={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Product Variants/Subtypes */}
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-gray-600" />
                <Label className="text-sm font-medium">Termék változatok (opcionális)</Label>
              </div>
              <p className="text-xs text-gray-500">
                Adj hozzá változatokat, ha a terméknek több típusa van (pl. különböző ízek, fajták).
              </p>
              
              {/* Add new variant */}
              <div className="flex gap-2">
                <Input
                  placeholder="Változat neve (pl. Natúr, Füstölt...)"
                  value={newVariantName}
                  onChange={(e) => setNewVariantName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addVariant();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariant}
                  disabled={!newVariantName.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Existing variants */}
              {variants.length > 0 && (
                <div className="space-y-2 mt-3">
                  {variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center gap-2 rounded-md border bg-white p-2"
                    >
                      <span className="flex-1 text-sm font-medium">{variant.name}</span>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          placeholder="Ár +/-"
                          value={variant.priceModifier ? variant.priceModifier / 100 : ''}
                          onChange={(e) => updateVariant(variant.id, { 
                            priceModifier: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : 0 
                          })}
                          className="w-20 h-8 text-xs"
                        />
                        <span className="text-xs text-gray-500">Ft</span>
                      </div>
                      <Switch
                        checked={variant.isAvailable}
                        onCheckedChange={(checked) => updateVariant(variant.id, { isAvailable: checked })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(variant.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={form.watch('isActive')}
                  onCheckedChange={(checked) => form.setValue('isActive', checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isFeatured"
                  checked={form.watch('isFeatured')}
                  onCheckedChange={(checked) => form.setValue('isFeatured', checked)}
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this product? This action cannot be undone.
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
    </div>
  );
}
