import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Package, MessageSquare, Star, User } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  sku: string | null;
  name: string;
  slug: string | null;
  category_id: string | null;
  metal_type: string | null;
  grade: string | null;
  specs: any | null;
  images: string[] | null;
  datasheets: string[] | null;
  stock_qty: number | null;
  min_order: number | null;
  supplier_id: string | null;
  active: boolean;
  featured: boolean;
  description: string | null;
  price: number;
  unit: string;
  created_at: string;
  updated_at: string;
  unread_reviews_count?: number;
}

interface Category {
  id: string;
  name: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  is_read: boolean;
  profiles: {
    full_name: string | null;
  } | null;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Reviews State
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [currentProductReviews, setCurrentProductReviews] = useState<Review[]>([]);
  const [selectedProductForReviews, setSelectedProductForReviews] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    slug: '',
    category_id: '',
    metal_type: '',
    grade: '',
    description: '',
    stock_qty: '0',
    min_order: '1',
    supplier_id: '',
    price: '0',
    unit: 'ton',
    active: true,
    featured: false,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');

    if (!error && data) setCategories(data);
  };

  const fetchProducts = async () => {
    const { data: productsData, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && productsData) {
      // Fetch unread review counts for each product
      const productsWithCounts = await Promise.all(productsData.map(async (product) => {
        const { count } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', product.id)
          .eq('is_read', false);

        return {
          ...product,
          unread_reviews_count: count || 0
        };
      }));

      setProducts(productsWithCounts);
    }
    setLoading(false);
  };

  const fetchReviews = async (productId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          full_name
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCurrentProductReviews(data);
    }
  };

  const markReviewsAsRead = async (productId: string) => {
    // Optimistically update local state
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, unread_reviews_count: 0 } : p
    ));

    const { error } = await supabase
      .from('reviews')
      .update({ is_read: true })
      .eq('product_id', productId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking reviews as read:', error);
    }
  };

  const openReviewsDialog = (product: Product) => {
    setSelectedProductForReviews(product);
    setCurrentProductReviews([]);
    fetchReviews(product.id);

    // Mark as read if there are unread reviews
    if (product.unread_reviews_count && product.unread_reviews_count > 0) {
      markReviewsAsRead(product.id);
    }

    setReviewsDialogOpen(true);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploading(true);
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile);

    setUploading(false);

    if (uploadError) {
      toast.error('Failed to upload image');
      return null;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrl = await uploadImage();

    // Build product data - only include fields that exist in your table
    const productData: any = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      active: formData.active,
      featured: formData.featured,
    };

    // Only add optional fields if they have values
    if (formData.sku) productData.sku = formData.sku;
    if (formData.category_id) productData.category_id = formData.category_id;
    if (formData.metal_type) productData.metal_type = formData.metal_type;
    if (formData.grade) productData.grade = formData.grade;
    if (formData.description) productData.description = formData.description;
    if (formData.stock_qty) productData.stock_qty = parseInt(formData.stock_qty);
    if (formData.min_order) productData.min_order = parseInt(formData.min_order);
    if (formData.supplier_id) productData.supplier_id = formData.supplier_id;
    if (formData.price) productData.price = parseFloat(formData.price);
    if (formData.unit) productData.unit = formData.unit;

    // Handle images array
    if (imageUrl) {
      const existingImages = editingProduct?.images || [];
      productData.images = [...existingImages, imageUrl];
    }

    console.log('Sending product data:', productData); // Debug log

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (!error) {
        toast.success('Product updated successfully');
        fetchProducts();
        resetForm();
      } else {
        toast.error('Failed to update product');
        console.error(error);
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (!error) {
        toast.success('Product added successfully');
        fetchProducts();
        resetForm();
      } else {
        toast.error('Failed to add product');
        console.error(error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (!error) {
      toast.success('Product deleted');
      fetchProducts();
    } else {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      slug: '',
      category_id: '',
      metal_type: '',
      grade: '',
      description: '',
      stock_qty: '0',
      min_order: '1',
      supplier_id: '',
      price: '0',
      unit: 'ton',
      active: true,
      featured: false,
    });
    setImageFile(null);
    setEditingProduct(null);
    setDialogOpen(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku || '',
      name: product.name,
      slug: product.slug || '',
      category_id: product.category_id || '',
      metal_type: product.metal_type || '',
      grade: product.grade || '',
      description: product.description || '',
      stock_qty: product.stock_qty?.toString() || '0',
      min_order: product.min_order?.toString() || '1',
      supplier_id: product.supplier_id || '',
      price: product.price?.toString() || '0',
      unit: product.unit || 'ton',
      active: product.active,
      featured: product.featured,
    });
    setDialogOpen(true);
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProduct(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Product Name *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>SKU</Label>
                    <Input
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Metal Type</Label>
                    <Input
                      value={formData.metal_type}
                      onChange={(e) => setFormData({ ...formData, metal_type: e.target.value })}
                      placeholder="e.g., Steel, Iron"
                    />
                  </div>
                  <div>
                    <Label>Grade</Label>
                    <Input
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="e.g., 500, 550"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price (Amount)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Input
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="e.g., ton, kg, piece"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Stock Quantity</Label>
                    <Input
                      type="number"
                      value={formData.stock_qty}
                      onChange={(e) => setFormData({ ...formData, stock_qty: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Minimum Order</Label>
                    <Input
                      type="number"
                      value={formData.min_order}
                      onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Product Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  {editingProduct?.images && editingProduct.images.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">Current: {editingProduct.images.length} image(s)</p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <Label>Featured</Label>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={uploading}>
                    {uploading ? 'Uploading...' : editingProduct ? 'Update' : 'Add'} Product
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Reviews Dialog */}
        <Dialog open={reviewsDialogOpen} onOpenChange={setReviewsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Product Reviews</DialogTitle>
              {selectedProductForReviews && (
                <p className="text-sm text-muted-foreground">
                  Showing reviews for {selectedProductForReviews.name}
                </p>
              )}
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full pr-4">
              <div className="space-y-4">
                {currentProductReviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No reviews yet.
                  </div>
                ) : (
                  currentProductReviews.map((review) => (
                    <div key={review.id} className={`border rounded-lg p-4 ${review.is_read ? 'bg-slate-50' : 'bg-blue-50 border-blue-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-sm">
                            {review.profiles?.full_name || 'Anonymous'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-slate-700">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-steel transition-all">
                <CardHeader className="pb-3">
                  {product.images && product.images.length > 0 ? (
                    <div className="relative h-40 mb-3 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative h-40 mb-3 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{getCategoryName(product.category_id)}</p>
                  {product.sku && (
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description || 'No description available'}
                  </p>
                  <div className="space-y-2 mb-4">
                    {product.metal_type && (
                      <div className="text-sm">
                        <span className="font-semibold">Type:</span> {product.metal_type}
                        {product.grade && ` - Grade ${product.grade}`}
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="font-semibold">Stock:</span> {product.stock_qty || 0} units
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Price:</span> ₹{product.price?.toLocaleString() || '0'} / {product.unit || 'ton'}
                    </div>
                    {!product.active && (
                      <div className="text-sm text-destructive font-semibold">Inactive</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => openReviewsDialog(product)} className="w-full relative">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Reviews
                      {(product.unread_reviews_count || 0) > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600">
                          {product.unread_reviews_count}
                        </Badge>
                      )}
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(product)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)} className="flex-1">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground">Click "Add Product" to create your first product.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
