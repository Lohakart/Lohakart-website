import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Newspaper, Plus, Search, Filter, Edit, Trash2, Eye, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminNews() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    useEffect(() => {
        fetchArticles();
    }, [categoryFilter]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('news_articles')
                .select('*')
                .order('created_at', { ascending: false });

            if (categoryFilter !== 'All') {
                query = query.eq('category', categoryFilter);
            }

            const { data, error } = await query;

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
            toast.error('Failed to load articles');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        try {
            const { error } = await supabase
                .from('news_articles')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setArticles(prev => prev.filter(a => a.id !== id));
            toast.success('Article deleted');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete article');
        }
    };

    const toggleFeatured = async (id: string, current: boolean) => {
        try {
            const { error } = await supabase
                .from('news_articles')
                .update({ is_featured: !current })
                .eq('id', id);

            if (error) throw error;
            setArticles(prev => prev.map(a => a.id === id ? { ...a, is_featured: !current } : a));
            toast.success(current ? 'Removed from featured' : 'Marked as featured');
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update featured status');
        }
    };

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-slate-900">
                            <Newspaper className="w-8 h-8 text-[#005081]" />
                            News & Insights
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage articles, blogs, and market updates</p>
                    </div>
                    <Link to="/admin/news/new" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-[#005081] hover:bg-[#003d63] text-white rounded-xl h-12 px-6 shadow-lg shadow-blue-900/20">
                            <Plus className="w-5 h-5 mr-2" />
                            Create Article
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search articles by title..."
                            className="h-12 pl-11 rounded-xl bg-white border-slate-200 focus:ring-2 focus:ring-[#005081]/20 transition-all w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="h-12 rounded-xl bg-white border-slate-200 w-full">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-slate-400" />
                                    <SelectValue placeholder="All Categories" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Categories</SelectItem>
                                <SelectItem value="News">News</SelectItem>
                                <SelectItem value="Blogs">Blogs</SelectItem>
                                <SelectItem value="Market Updates">Market Updates</SelectItem>
                                <SelectItem value="Sustainability">Sustainability</SelectItem>
                                <SelectItem value="Company Announcements">Company Announcements</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card className="border-none shadow-sm overflow-hidden rounded-2xl bg-white">
                    <CardHeader className="bg-slate-50 border-b border-slate-100">
                        <CardTitle className="text-lg">Content List</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-12 text-center text-muted-foreground animate-pulse">Loading articles...</div>
                        ) : filteredArticles.length === 0 ? (
                            <div className="p-20 text-center text-muted-foreground flex flex-col items-center">
                                <Search className="w-12 h-12 text-slate-200 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900">No articles found</h3>
                                <p>Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="min-w-[800px] w-full">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50/50">
                                                <TableHead className="w-[100px] text-xs font-bold uppercase tracking-wider pl-6">Date</TableHead>
                                                <TableHead className="text-xs font-bold uppercase tracking-wider">Title & Category</TableHead>
                                                <TableHead className="text-xs font-bold uppercase tracking-wider">Status</TableHead>
                                                <TableHead className="text-xs font-bold uppercase tracking-wider text-center">Featured</TableHead>
                                                <TableHead className="text-right text-xs font-bold uppercase tracking-wider pr-6">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredArticles.map((article) => (
                                                <TableRow key={article.id} className="hover:bg-slate-50 transition-colors">
                                                    <TableCell className="text-sm pl-6">
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <Clock className="w-3 h-3" />
                                                            {format(new Date(article.created_at), 'MMM dd, yyyy')}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-[300px]" title={article.title}>{article.title}</div>
                                                        <Badge variant="outline" className="mt-1 text-[10px] text-slate-500 border-slate-200 font-medium">
                                                            {article.category}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`${article.status === 'Published'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                            : 'bg-amber-50 text-amber-700 border-amber-100'
                                                            } border rounded-full px-3 py-0.5 text-xs font-semibold whitespace-nowrap`}>
                                                            {article.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => toggleFeatured(article.id, article.is_featured)}
                                                            className={`${article.is_featured ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 hover:text-slate-400'} rounded-full`}
                                                        >
                                                            <Star className={`h-5 w-5 ${article.is_featured ? 'fill-amber-500' : ''}`} />
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-2 pr-6">
                                                        <div className="flex justify-end gap-1">
                                                            <Link to={`/news/${article.slug}`}>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-[#005081] hover:bg-[#005081]/5 rounded-xl">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Link to={`/admin/news/${article.id}`}>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                                                onClick={() => handleDelete(article.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
