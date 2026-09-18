import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function Article() {
    const { slug } = useParams();
    const [article, setArticle] = useState<any>(null);
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticle();
    }, [slug]);

    const fetchArticle = async () => {
        setLoading(true);
        try {
            // Fetch main article
            const { data, error } = await supabase
                .from('news_articles')
                .select('*')
                .eq('slug', slug)
                .eq('status', 'Published')
                .single();

            if (error) throw error;
            setArticle(data);

            // Fetch related articles (same category, excluding current)
            const { data: related, error: relatedError } = await supabase
                .from('news_articles')
                .select('*')
                .eq('category', data.category)
                .eq('status', 'Published')
                .neq('id', data.id)
                .limit(3);

            if (!relatedError) setRelatedArticles(related || []);

        } catch (error) {
            console.error('Error fetching article:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <div className="flex-1 container mx-auto px-4 py-20 animate-pulse">
                    <div className="h-10 w-2/3 bg-slate-200 mb-8 rounded-lg" />
                    <div className="h-[400px] w-full bg-slate-200 mb-8 rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-2/3 bg-slate-200 rounded" />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <div className="flex-1 container mx-auto px-4 py-32 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h2>
                    <p className="text-slate-500 mb-8">The article you're looking for might have been moved or deleted.</p>
                    <Link to="/news">
                        <Button className="bg-[#005081] hover:bg-[#003d63] text-white">Back to News</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1 mb-20">
                {/* Article Header */}
                <div className="bg-slate-50 py-12 md:py-20">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <Link to="/news" className="flex items-center text-[#005081] font-semibold mb-8 hover:gap-2 transition-all">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Insights
                        </Link>

                        <Badge variant="outline" className="mb-6 text-[#005081] border-[#005081]/20 px-4 py-1 rounded-full uppercase tracking-wider text-xs font-bold">
                            {article.category}
                        </Badge>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002b4d] mb-8 leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-slate-500 border-t border-slate-200 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#005081] flex items-center justify-center text-white font-bold text-lg">
                                    {article.author ? article.author[0] : 'L'}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 leading-none mb-1">{article.author || 'Lohakart Editor'}</p>
                                    <p className="text-xs text-slate-400">Industry Expert</p>
                                </div>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#be1800]" />
                                <span className="text-sm font-medium">{format(new Date(article.published_at || article.created_at), 'MMMM dd, yyyy')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="container mx-auto px-4 max-w-5xl -mt-10 md:-mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
                    >
                        <img
                            src={article.image_url || 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80'}
                            alt={article.title}
                            className="w-full aspect-video object-cover"
                        />
                    </motion.div>
                </div>

                {/* Content Area */}
                <div className="container mx-auto px-4 mt-16 lg:mt-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-7xl mx-auto">

                        <div className="lg:col-span-8">
                            <div className="prose prose-lg lg:prose-xl max-w-none prose-slate prose-headings:text-[#002b4d] prose-headings:font-extrabold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-img:rounded-3xl prose-a:text-[#005081] prose-a:no-underline hover:prose-a:underline font-serif">
                                <p className="text-xl md:text-2xl font-medium text-slate-500 leading-relaxed italic mb-12 py-6 border-l-4 border-[#be1800] pl-8 bg-slate-50/50 rounded-r-3xl">
                                    {article.excerpt}
                                </p>
                                {/* Render Content - Supports HTML since it's common for CMS/Blog content */}
                                <div dangerouslySetInnerHTML={{ __html: article.content }} className="whitespace-pre-wrap font-sans" />
                            </div>

                            {/* Tags/Categories bottom */}
                            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Posted in:</span>
                                    <Badge className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none px-4 py-1">
                                        {article.category}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-sm font-medium">Comments disabled for this post</span>
                                </div>
                            </div>
                        </div>

                        {/* Related / Sidebar */}
                        <div className="lg:col-span-4 space-y-12">
                            {relatedArticles.length > 0 && (
                                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                    <h3 className="text-xl font-bold text-[#002b4d] mb-8 flex items-center gap-2">
                                        <div className="w-2 h-6 bg-[#be1800] rounded-full" />
                                        Related Insights
                                    </h3>
                                    <div className="space-y-8">
                                        {relatedArticles.map((rel) => (
                                            <Link
                                                key={rel.id}
                                                to={`/news/${rel.slug}`}
                                                onClick={scrollToTop}
                                                className="group block"
                                            >
                                                <div className="flex gap-4">
                                                    <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden shadow-sm">
                                                        <img
                                                            src={rel.image_url || 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80'}
                                                            alt={rel.title}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <h4 className="font-bold text-slate-900 group-hover:text-[#005081] transition-colors line-clamp-2 leading-tight mb-2">
                                                            {rel.title}
                                                        </h4>
                                                        <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                            <span>{format(new Date(rel.published_at || rel.created_at), 'MMM dd')}</span>
                                                            <span className="mx-2">•</span>
                                                            <span className="text-[#be1800]">{rel.category}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link to="/news" onClick={scrollToTop}>
                                        <Button variant="outline" className="w-full mt-10 rounded-xl border-slate-200 text-[#005081] hover:bg-white hover:border-[#005081] transition-all">
                                            View All Updates
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
