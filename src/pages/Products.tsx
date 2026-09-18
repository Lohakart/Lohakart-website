import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ArrowLeft, Search, Filter, ShoppingCart, Info, CheckCircle2 } from 'lucide-react';

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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');

    if (!error && data) setCategories(data);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('name');

    if (!error && data) {
      setProducts(data);
    } else {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  let filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category_id === filter);

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCategoryName(p.category_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.metal_type?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      unit: product.unit || 'unit'
    }, product.min_order || 1);
    toast.success(`${product.name} added to cart`, {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
    });
  };

  if (loading) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          {/* Spinning Border */}
          <div className="h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 animate-spin rounded-full border-4 md:border-[5px] border-slate-100 border-t-[#be1800]"></div>
          
          {/* Logo Image */}
          <div className="absolute inset-0 flex items-center justify-center p-6 md:p-7 lg:p-8">
            <img 
              src="/Loha.png" 
              alt="Lohakart" 
              className="w-full h-full object-contain animate-pulse"
            />
          </div>
          
          {/* Optional: Pulsing background effect */}
          <div className="absolute inset-0 -z-10">
            <div className="h-full w-full rounded-full bg-[#be1800]/5 animate-ping"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-outfit relative overflow-hidden">
      <Navbar />

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] bg-red-50 rounded-full blur-[100px] sm:blur-[120px] lg:blur-[140px] -mr-48 sm:-mr-64 lg:-mr-96 -mt-48 sm:-mt-64 lg:-mt-96 opacity-60" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] bg-blue-50 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] -ml-32 sm:-ml-48 lg:-ml-64 -mb-32 sm:-mb-48 lg:-mb-64 opacity-40" />
      </div>

      <main className="flex-1 py-8 sm:py-10 lg:py-12 px-0 sm:px-6 lg:px-8 relative z-10">
        <div className="container mx-auto max-w-7xl px-0 sm:px-8">
          

          {/* Hero Section */}
          <section className="mb-12 sm:mb-14 lg:mb-16 px-4 sm:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-2xl w-full"
              >
                <Badge className="bg-[#be1800]/10 text-[#be1800] border-[#be1800]/20 hover:bg-[#be1800]/20 mb-3 sm:mb-4 font-black uppercase tracking-widest px-3 sm:px-4 py-1 text-[9px] sm:text-[10px]">Industrial Inventory</Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-4 sm:mb-6">
                  Premium <span className="relative inline-block">
                    <span className="relative z-10 text-[#be1800]">Metal</span>
                    <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-[#be1800]/10 fill-current" viewBox="0 0 100 20" preserveAspectRatio="none">
                      <path d="M0 10 Q 25 20 50 10 T 100 10" />
                    </svg>
                  </span> Solutions
                </h1>
                <p className="text-slate-500 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
                  Browse our high-grade, certified steel and aluminum components precision-engineered for professional industrial applications.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full md:w-auto"
              >
                <div className="relative group w-full sm:min-w-[280px] md:min-w-[300px]">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#be1800] transition-colors" />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full h-12 sm:h-14 bg-white border-slate-200 pl-10 sm:pl-11 rounded-xl sm:rounded-2xl shadow-sm focus:border-[#be1800] focus:ring-[#be1800]/10 transition-all font-bold text-slate-700 text-sm sm:text-base">
                      <SelectValue placeholder="Category Selection" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl sm:rounded-2xl border-slate-200 shadow-xl">
                      <SelectItem value="all" className="font-bold py-2 sm:py-3 text-sm sm:text-base">All Strategic Metals</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id} className="font-bold py-2 sm:py-3 capitalize text-sm sm:text-base">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            </div>

            <div className="h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent mt-8 sm:mt-10 lg:mt-12 w-full" />
          </section>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 px-4 sm:px-0">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="h-full flex flex-col bg-white border-slate-200 hover:border-[#be1800]/40 transition-all duration-500 overflow-hidden group shadow-sm hover:shadow-2xl hover:-translate-y-2 rounded-2xl sm:rounded-[2rem]">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-16 w-16 sm:h-20 sm:w-20 text-slate-100 group-hover:text-red-50 transition-colors" />
                        </div>
                      )}

                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 flex flex-col gap-2">
                        <Badge
                          variant={(product.stock_qty || 0) > 0 ? "default" : "secondary"}
                          className={`
                            ${(product.stock_qty || 0) > 0 ? "bg-[#be1800]/90" : "bg-slate-200 text-slate-600"} 
                            backdrop-blur-md font-black uppercase text-[9px] sm:text-[10px] tracking-widest px-2 sm:px-3 py-1 border-none shadow-lg
                          `}
                        >
                          {(product.stock_qty || 0) > 0 ? 'Verified Stock' : 'Out of Logistics'}
                        </Badge>
                        {product.featured && (
                          <Badge className="bg-amber-400 text-amber-950 font-black uppercase text-[9px] sm:text-[10px] tracking-widest px-2 sm:px-3 py-1 border-none shadow-lg">Premium Tier</Badge>
                        )}
                      </div>

                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 border border-white/20">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tighter text-slate-700">Real-time Pricing</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="flex-1 p-5 sm:p-6 lg:p-8">
                      <div className="flex flex-col h-full">
                        <div className="mb-4 sm:mb-6">
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <span className="text-[9px] sm:text-[10px] font-black text-[#be1800] uppercase tracking-[0.15em] sm:tracking-[0.2em]">{getCategoryName(product.category_id)}</span>
                            {product.grade && <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Grade: {product.grade}</span>}
                          </div>
                          <Link to={`/products/${product.id}`} className="block">
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-2 sm:mb-3 group-hover:text-[#be1800] transition-colors line-clamp-2">{product.name}</h3>
                          </Link>
                          <p className="text-slate-500 font-medium text-xs sm:text-sm line-clamp-2 leading-relaxed h-8 sm:h-10">
                            {product.description || 'Professional-grade industrial component with verified technical specifications.'}
                          </p>
                        </div>

                        <div className="mt-auto pt-4 sm:pt-6 border-t border-slate-100 flex items-end justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Market Quotation</span>
                            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
                              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">₹{product.price?.toLocaleString() || '---'}</span>
                              <span className="text-xs sm:text-sm font-bold text-slate-400">/{product.unit}</span>
                            </div>
                          </div>

                          {product.min_order && (
                            <div className="text-right flex-shrink-0">
                              <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">M.O.Q</span>
                              <span className="text-xs sm:text-sm font-black text-slate-700 whitespace-nowrap">{product.min_order} {product.unit}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-5 sm:p-6 lg:p-8 pt-0 flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Link to={`/products/${product.id}`} className="w-full sm:flex-1">
                        <Button
                          variant="outline"
                          className="w-full h-12 sm:h-14 border-slate-200 
                          hover:border-[#005081] hover:bg-slate-50 
                          hover:text-[#005081]
                          font-black uppercase tracking-widest 
                          rounded-xl sm:rounded-2xl transition-all 
                          text-[10px] sm:text-xs"
  >
                          <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          Details
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={(product.stock_qty || 0) <= 0}
                        className="w-full sm:flex-1 h-12 sm:h-14 bg-[#be1800] hover:bg-[#a01500] text-white font-black uppercase tracking-widest rounded-xl sm:rounded-2xl shadow-xl shadow-red-900/20 active:scale-[0.98] transition-all text-[10px] sm:text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Procure
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 sm:py-28 lg:py-32 bg-white rounded-2xl sm:rounded-[3rem] border border-dashed border-slate-200 mt-6 sm:mt-8 shadow-sm px-4 mx-4 sm:mx-0"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Package className="h-8 w-8 sm:h-10 sm:w-10 text-slate-200" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Inventory Ledger Clear</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto mb-6 sm:mb-8 text-sm sm:text-base px-4">
                {searchQuery ? `No industrial components matched your query: "${searchQuery}"` : 'We are currently updating our strategic inventory. Check back soon.'}
              </p>
              <Button
                variant="outline"
                onClick={() => setFilter('all')}
                className="font-black uppercase tracking-widest border-slate-200 rounded-xl text-xs sm:text-sm h-11 sm:h-12 px-6"
              >
                Reset Filter
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}