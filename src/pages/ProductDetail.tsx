import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, Shield, CheckCircle, Star, User, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  sku: string | null;
  name: string;
  slug: string | null;
  category_id: string | null;
  metal_type: string | null;
  grade: string | null;
  specs?: any | null;
  images: string[] | null;
  stock_qty: number | null;
  min_order: number | null;
  active: boolean;
  featured: boolean;
  description: string | null;
  price: number;
  unit: string;
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
  profiles: {
    full_name: string | null;
  } | null;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
    if (id) fetchReviews(id);
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      setProduct(data);

      if (data.category_id) {
        const { data: catData } = await supabase
          .from('categories')
          .select('*')
          .eq('id', data.category_id)
          .maybeSingle();

        if (catData) setCategory(catData);
      }
      if (data.min_order) setQuantity(data.min_order);
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
      setReviews(data);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        unit: product.unit || 'unit'
      }, quantity);
      toast.success(`Added ${quantity} ${product.unit}(s) of ${product.name} to cart`);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to leave a review');
      navigate('/auth');
      return;
    }
    if (!product) return;

    setSubmittingReview(true);
    const { error } = await supabase
      .from('reviews')
      .insert([
        {
          product_id: product.id,
          user_id: user.id,
          rating,
          comment,
        },
      ]);

    setSubmittingReview(false);

    if (error) {
      toast.error('Failed to submit review');
      console.error(error);
    } else {
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchReviews(product.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4 text-slate-900">Product not found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const minOrderQty = product.min_order || 1;

  // NEW: Increment function
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  // NEW: Decrement function
  const decrementQuantity = () => {
    setQuantity(prev => Math.max(minOrderQty, prev - 1));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Link to="/products">
            <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all hover:bg-[#005081]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Image & Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-2">
                <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-slate-100">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-24 w-24 text-slate-300" />
                    </div>
                  )}

                  {product.featured && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none px-3 py-1">Featured Product</Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust Indicators (Small) */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-sm text-slate-900">Pan-India Delivery</div>
                    <div className="text-xs text-slate-500">Tracked shipping</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-sm text-slate-900">Quality Certified</div>
                    <div className="text-xs text-slate-500">ISI marked</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Details & Action */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                  {category?.name || 'Uncategorized'}
                </Badge>
                {product.sku && (
                  <span className="text-sm text-slate-400">SKU: {product.sku}</span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">₹{product.price?.toLocaleString() || 'N/A'}</span>
                  <span className="text-xl text-slate-500">/{product.unit}</span>
                </div>
                <Badge
                  variant={(product.stock_qty || 0) > 0 ? "default" : "secondary"}
                  className={`px-3 py-1 text-sm ${(product.stock_qty || 0) > 0 ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {(product.stock_qty || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
                <div className="mb-6">
                  <Label htmlFor="quantity" className="text-base font-semibold mb-3 block">Quantity ({product.unit}s)</Label>
                  
                  {/* NEW: Quantity Controls with +/- Buttons */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={decrementQuantity}
                        disabled={(product.stock_qty || 0) <= 0}
                        className="h-12 w-12 rounded-none hover:bg-slate-200 disabled:opacity-50"
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      
                      <div className="w-24 h-12 flex items-center justify-center border-x-2 border-slate-200 bg-white">
                        <span className="text-2xl font-bold text-slate-900">{quantity}</span>
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={incrementQuantity}
                        disabled={(product.stock_qty || 0) <= 0}
                        className="h-12 w-12 rounded-none hover:bg-slate-200 disabled:opacity-50"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">{product.unit}s</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    Minimum order: <span className="font-medium text-slate-900">{minOrderQty} {product.unit}s</span>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={(product.stock_qty || 0) <= 0}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-[#005081] hover:bg-[#be1800] shadow-lg shadow-blue-600/20"
                >
                  Add to Cart
                </Button>

                <p className="text-xs text-center text-slate-400 mt-4">
                  *Bulk pricing available for orders above 50 tons
                </p>
              </div>

              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start bg-white border-b border-slate-200 rounded-none h-12 p-0 mb-6">
                  <TabsTrigger
                    value="description"
                    className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#be1800] data-[state=active]:text-[#005081] rounded-none bg-transparent"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="specs"
                    className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#be1800] data-[state=active]:text-[#005081] rounded-none bg-transparent"
                  >
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#be1800] data-[state=active]:text-[#005081] rounded-none bg-transparent"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {product.description || 'No detailed description available for this product.'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <span className="text-slate-700">Premium quality steel grade</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <span className="text-slate-700">Rust and corrosion resistant</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <span className="text-slate-700">High tensile strength</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <span className="text-slate-700">Certified for industrial use</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="specs" className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {product.metal_type && (
                      <div className="flex justify-between py-3 border-b border-slate-100">
                        <span className="font-medium text-slate-500">Metal Type</span>
                        <span className="font-semibold text-slate-900">{product.metal_type}</span>
                      </div>
                    )}
                    {product.grade && (
                      <div className="flex justify-between py-3 border-b border-slate-100">
                        <span className="font-medium text-slate-500">Grade</span>
                        <span className="font-semibold text-slate-900">{product.grade}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="font-medium text-slate-500">Unit</span>
                      <span className="font-semibold text-slate-900">{product.unit}</span>
                    </div>
                    {product.min_order && (
                      <div className="flex justify-between py-3 border-b border-slate-100">
                        <span className="font-medium text-slate-500">Minimum Order</span>
                        <span className="font-semibold text-slate-900">{product.min_order} {product.unit}s</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="font-medium text-slate-500">Certification</span>
                      <span className="font-semibold text-slate-900">ISI / ISO 9001</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  {/* Write Review Section */}
                  <div className="mb-8 border-b border-slate-100 pb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>
                    {user ? (
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <Label className="mb-2 block">Rating</Label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                              >
                                <Star
                                  className={`h-6 w-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="comment" className="mb-2 block">Comment</Label>
                          <Textarea
                            id="comment"
                            placeholder="Share your experience with this product..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            className="min-h-[100px]"
                          />
                        </div>
                        <Button type="submit" disabled={submittingReview}>
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </form>
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-6 text-center border border-slate-100">
                        <p className="text-slate-600 mb-4">Please log in to write a review.</p>
                        <Link to="/auth">
                          <Button variant="outline">Sign In</Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900">Customer Reviews ({reviews.length})</h3>

                    {reviews.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        No reviews yet. Be the first to share your thoughts!
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <div key={review.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-100 rounded-full p-1">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-semibold text-slate-900">
                                {review.profiles?.full_name || 'Anonymous User'}
                              </span>
                            </div>
                            <span className="text-sm text-slate-400">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            {review.comment}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}