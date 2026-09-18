import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3, RefreshCw, Calendar, AlertCircle } from 'lucide-react';

interface PriceIndex {
  id: string;
  product_name: string;
  price: number;
  change_percent: number | null;
  date: string;
}

export default function PricingIndex() {
  const [prices, setPrices] = useState<PriceIndex[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    const { data, error } = await supabase
      .from('pricing_index')
      .select('*')
      .order('product_name');
    
    if (!error && data) {
      setPrices(data);
    }
    setLoading(false);
  };

  const getTrendIcon = (change: number | null) => {
    if (!change || change === 0) return <Minus className="h-4 w-4 text-slate-400" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    return <TrendingDown className="h-4 w-4 text-[#be1800]" />;
  };

  const getTrendColor = (change: number | null) => {
    if (!change || change === 0) return 'bg-slate-100 text-slate-600 border-slate-200';
    return change > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-[#be1800] border-red-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative">
            <div className="h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 animate-spin rounded-full border-4 md:border-[5px] border-slate-100 border-t-[#be1800]"></div>
            <div className="absolute inset-0 flex items-center justify-center p-6 md:p-7 lg:p-8">
              <img 
                src="/Loha.png" 
                alt="Lohakart" 
                className="w-full h-full object-contain animate-pulse"
              />
            </div>
            <div className="absolute inset-0 -z-10">
              <div className="h-full w-full rounded-full bg-[#be1800]/5 animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 py-8 md:py-12 lg:py-16 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-red-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-40" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-blue-50 rounded-full blur-[100px] -ml-48 -mb-48 opacity-30" />
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-10 lg:mb-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-[#005081]/10 border border-[#005081]/20 text-[#005081] text-xs md:text-sm font-bold uppercase tracking-wider mb-4">
                  <BarChart3 className="w-3 h-3 md:w-4 md:h-4" />
                  Live Market Data
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4 leading-tight">
                  Daily <span className="text-[#be1800]">Pricing Index</span>
                </h1>
                <p className="text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed">
                  Real-time steel and metal prices updated daily based on market conditions.
                </p>
              </div>

              <div className="flex flex-row gap-3">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#005081]/10 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-[#005081]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Last Updated</p>
                      <p className="text-xs text-slate-500">
                        {prices[0] ? new Date(prices[0].date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short'
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Products</p>
                      <p className="text-lg font-bold text-slate-900">{prices.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent mt-6 md:mt-8" />
          </motion.div>

          {/* Pricing Cards Grid - Compact Version */}
          {prices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 md:py-20 bg-white rounded-2xl border border-dashed border-slate-200"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Pricing Data Available</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Pricing information will be displayed here once data is available.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {prices.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="h-full bg-white border-slate-200 hover:border-[#005081]/40 transition-all duration-300 overflow-hidden group shadow-sm hover:shadow-lg rounded-xl">
                    <CardHeader className="p-4 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm md:text-base font-bold text-slate-900 leading-tight line-clamp-2 flex-1">
                          {item.product_name}
                        </CardTitle>
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-[#005081]/10 transition-colors">
                          {getTrendIcon(item.change_percent)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      {/* Price Display */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Price</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl md:text-3xl font-bold text-[#005081] tracking-tight">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold text-slate-400">/ton</span>
                        </div>
                      </div>

                      {/* Change Indicator */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        {item.change_percent !== null && item.change_percent !== 0 ? (
                          <>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border font-bold text-xs ${getTrendColor(item.change_percent)}`}>
                              {getTrendIcon(item.change_percent)}
                              <span>
                                {item.change_percent > 0 && '+'}
                                {item.change_percent}%
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">vs. prev</span>
                          </>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200 font-bold text-xs">
                            <Minus className="h-3 w-3" />
                            <span>No Change</span>
                          </div>
                        )}
                      </div>

                      {/* Last Updated */}
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(item.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short'
                        })}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Info Section - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 md:mt-10"
          >
            <Card className="border-none shadow-sm rounded-xl md:rounded-2xl bg-gradient-to-br from-white to-slate-50 overflow-hidden">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#005081] flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 md:space-y-3">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900">About Our Pricing</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Our pricing index is updated daily based on market conditions, raw material costs, and industry demand. 
                      Prices are indicative and may vary based on order quantity and delivery location.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge className="bg-[#005081]/10 text-[#005081] border border-[#005081]/20 hover:bg-[#005081]/20 font-bold text-xs px-2.5 py-0.5">
                        Daily Updates
                      </Badge>
                      <Badge className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-bold text-xs px-2.5 py-0.5">
                        Live Data
                      </Badge>
                      <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-bold text-xs px-2.5 py-0.5">
                        Bulk Pricing
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Section - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 md:mt-10"
          >
            <Card className="border-none shadow-lg rounded-xl md:rounded-2xl bg-gradient-to-br from-[#005081] to-[#003d63] overflow-hidden text-white">
              <CardContent className="p-6 md:p-8 text-center">
                <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Need Custom Pricing?</h2>
                <p className="text-sm md:text-base text-white/90 mb-5 md:mb-6 max-w-2xl mx-auto">
                  Contact our sales team for bulk orders and customized solutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="/contact" className="inline-block">
                    <button className="w-full sm:w-auto bg-white text-[#005081] hover:bg-slate-100 font-bold px-6 py-3 rounded-xl transition-all shadow-lg text-sm">
                      Contact Sales Team
                    </button>
                  </a>
                  <a href="/products" className="inline-block">
                    <button className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold px-6 py-3 rounded-xl transition-all text-sm">
                      View All Products
                    </button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}