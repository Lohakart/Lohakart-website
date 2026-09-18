import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Newspaper, BookOpen, TrendingUp, Leaf, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const categories = [
    { name: 'All', icon: Newspaper },
    { name: 'News', icon: Newspaper },
    { name: 'Blogs', icon: BookOpen },
    { name: 'Market Updates', icon: TrendingUp },
    { name: 'Sustainability', icon: Leaf },
    { name: 'Company Announcements', icon: Megaphone },
];

export default function News() {
    const [articles, setArticles] = useState<any[]>([]);
    const [featuredArticle, setFeaturedArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchArticles();
    }, [activeCategory]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('news_articles')
                .select('*')
                .eq('status', 'Published')
                .order('published_at', { ascending: false });

            if (activeCategory !== 'All') {
                query = query.eq('category', activeCategory);
            }

            const { data, error } = await query;

            if (error) throw error;

            if (data) {
                // Set featured article (only explicitly marked is_featured)
                const featured = data.find(a => a.is_featured);
                setFeaturedArticle(featured);
                setArticles(data);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="bg-[#002b4d] py-12 sm:py-16 md:py-20 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#fff_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
                    </div>
                    <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl mx-auto"
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2">Lohakart News & Insights</h1>
                            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed px-4">
                                Stay Updated with the Latest from the Metal Industry. Market trends, expert opinions, and company announcements.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20 pb-12 sm:pb-16 md:pb-20">
                    {/* Featured Article - Compact & Professional */}
                    {featuredArticle && activeCategory === 'All' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-10 sm:mb-12 md:mb-16"
                        >
                            <Card className="overflow-hidden border-none shadow-xl rounded-xl sm:rounded-2xl bg-white">
                                <div className="grid grid-cols-1 lg:grid-cols-[45%_55%]">
                                    {/* Image Section */}
                                    <div className="relative h-64 sm:h-80 lg:h-[400px] overflow-hidden">
                                        <img
                                            src={featuredArticle.image_url || ''}
                                            alt={featuredArticle.title}
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden" />
                                        <Badge className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#be1800] hover:bg-[#be1800] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-lg">
                                            Featured
                                        </Badge>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                                        <Badge variant="outline" className="w-fit mb-3 text-[#005081] border-[#005081]/20 text-xs font-bold">
                                            {featuredArticle.category}
                                        </Badge>
                                        
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight line-clamp-2">
                                            {featuredArticle.title}
                                        </h2>
                                        
                                        <p className="text-slate-600 text-sm sm:text-base mb-4 sm:mb-5 line-clamp-2 leading-relaxed">
                                            {featuredArticle.excerpt}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-500 mb-5 sm:mb-6 pb-4 sm:pb-5 border-b border-slate-100">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                <span className="text-xs sm:text-sm">{format(new Date(featuredArticle.published_at || featuredArticle.created_at), 'MMM dd, yyyy')}</span>
                                            </div>
                                            <span className="text-slate-300">•</span>
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                <span className="text-xs sm:text-sm">{featuredArticle.author || 'Lohakart Team'}</span>
                                            </div>
                                        </div>
                                        
                                        <Link to={`/news/${featuredArticle.slug}`} onClick={scrollToTop}>
                                            <Button className="bg-[#005081] hover:bg-[#003d63] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold group w-full sm:w-auto transition-all shadow-lg hover:shadow-xl">
                                                Read Full Article
                                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Filters - Horizontal Scroll on Mobile */}
                    <div className="mb-8 sm:mb-10 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                        <div className="flex sm:flex-wrap items-center sm:justify-center gap-2 sm:gap-3 min-w-max sm:min-w-0 pb-2 sm:pb-0">
                            {categories.map((cat) => (
                                <Button
                                    key={cat.name}
                                    variant={activeCategory === cat.name ? "default" : "outline"}
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={`rounded-full px-4 sm:px-5 py-2 whitespace-nowrap text-xs sm:text-sm transition-all duration-300 flex-shrink-0 ${activeCategory === cat.name
                                        ? "bg-[#005081] hover:bg-[#003d63] shadow-lg shadow-blue-900/10 text-white"
                                        : "bg-white hover:bg-slate-100 border-slate-200 text-slate-600"
                                        }`}
                                >
                                    <cat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                                    {cat.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Listing Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-[380px] sm:h-[420px] bg-slate-200 animate-pulse rounded-xl sm:rounded-2xl" />
                            ))}
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-16 sm:py-20 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
                            <Newspaper className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 px-4">No articles found</h3>
                            <p className="text-slate-500 text-sm sm:text-base px-4">Try selecting a different category or check back later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                            {articles.map((article, index) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                >
                                    <Link to={`/news/${article.slug}`} onClick={scrollToTop} className="group block h-full">
                                        <Card className="h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-xl sm:rounded-2xl bg-white flex flex-col">
                                            <div className="relative h-48 sm:h-56 overflow-hidden">
                                                <img
                                                    src={article.image_url || ''}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 hover:bg-white border-none shadow-sm text-xs font-bold">
                                                    {article.category}
                                                </Badge>
                                            </div>
                                            <CardContent className="p-5 sm:p-6 flex-1 flex flex-col">
                                                <div className="flex items-center gap-2 text-slate-400 text-xs mb-3 flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {format(new Date(article.published_at || article.created_at), 'MMM dd, yyyy')}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1 text-[#be1800]">
                                                        {article.author || 'Lohakart'}
                                                    </span>
                                                </div>
                                                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-[#005081] transition-colors leading-tight line-clamp-2">
                                                    {article.title}
                                                </h3>
                                                <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                                                    {article.excerpt}
                                                </p>
                                                <div className="mt-auto pt-3 border-t border-slate-50 flex items-center text-[#005081] font-semibold text-sm group-hover:gap-2 transition-all">
                                                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}