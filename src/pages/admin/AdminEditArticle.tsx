import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Globe, FileText, Layout, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminEditArticle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'News',
        image_url: '',
        author: '',
        status: 'Draft',
        is_featured: false
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchArticle();
        }
    }, [id]);

    const fetchArticle = async () => {
        try {
            const { data, error } = await supabase
                .from('news_articles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) setFormData(data);
        } catch (error) {
            console.error('Error fetching article:', error);
            toast.error('Failed to load article');
            navigate('/admin/news');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `articles/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('news-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('news-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        setFormData(prev => ({ ...prev, title, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Pick only writable fields to avoid DB errors with read-only columns
            const writableData = {
                title: formData.title,
                slug: formData.slug,
                excerpt: formData.excerpt,
                content: formData.content,
                category: formData.category,
                image_url: formData.image_url,
                author: formData.author,
                status: formData.status,
                is_featured: formData.is_featured,
                published_at: formData.status === 'Published' ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            };

            let error;
            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('news_articles')
                    .update(writableData)
                    .eq('id', id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('news_articles')
                    .insert([writableData]);
                error = insertError;
            }

            if (error) throw error;

            toast.success(isEditing ? 'Article updated' : 'Article created');
            navigate('/admin/news');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save article');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-8 flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-[#005081] animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-8 max-w-5xl mx-auto space-y-8">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/news">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                                <ArrowLeft className="w-5 h-5 text-slate-500" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                {isEditing ? 'Edit Article' : 'New Article'}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {isEditing ? 'Update your content and settings' : 'Create a new post for your audience'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-[#005081]" />
                                    Main Content
                                </CardTitle>
                                <CardDescription>Focus on the core message and details</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-bold text-slate-700 uppercase tracking-wider">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                        placeholder="Enter a catchy title..."
                                        required
                                        className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all text-lg font-semibold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="excerpt" className="text-sm font-bold text-slate-700 uppercase tracking-wider">Excerpt (Brief Summary)</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                        placeholder="Briefly describe what this article is about..."
                                        className="min-h-[100px] rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content" className="text-sm font-bold text-slate-700 uppercase tracking-wider">Full Content (Markdown/HTML Support)</Label>
                                    <Textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                        placeholder="Write your full article content here..."
                                        className="min-h-[400px] rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all font-mono text-sm leading-relaxed"
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar / Settings Area */}
                    <div className="space-y-8">
                        {/* Publishing / Status */}
                        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                            <CardHeader className="bg-[#002b4d] text-white">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Globe className="w-5 h-5" />
                                    Publishing
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Draft (Hidden)</SelectItem>
                                            <SelectItem value="Published">Published (Public)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-bold text-amber-900">Featured Post</Label>
                                        <p className="text-xs text-amber-600">Show on homepage hero</p>
                                    </div>
                                    <Switch
                                        checked={formData.is_featured}
                                        onCheckedChange={(val) => setFormData(prev => ({ ...prev, is_featured: val }))}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full h-12 rounded-xl bg-[#005081] hover:bg-[#003d63] text-white shadow-lg shadow-blue-900/10 font-bold"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Article
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-[#005081]" />
                                    Metadata
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="News">News</SelectItem>
                                            <SelectItem value="Blogs">Blogs</SelectItem>
                                            <SelectItem value="Market Updates">Market Updates</SelectItem>
                                            <SelectItem value="Sustainability">Sustainability</SelectItem>
                                            <SelectItem value="Company Announcements">Company Announcements</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="author" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Author Name</Label>
                                    <Input
                                        id="author"
                                        value={formData.author}
                                        onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                        placeholder="Admin/Expert Name"
                                        className="h-11 rounded-xl bg-slate-50 border-slate-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug" className="text-xs font-bold text-slate-400 uppercase tracking-widest">URL Slug</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        placeholder="article-url-slug"
                                        className="h-11 rounded-xl bg-slate-50 border-slate-200 font-mono text-xs"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Preview */}
                        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-[#005081]" />
                                    Cover Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload New Image</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="h-11 rounded-xl bg-slate-50 border-slate-200 cursor-pointer pt-2"
                                                disabled={uploading}
                                            />
                                            {uploading && (
                                                <Button size="icon" disabled className="rounded-xl shrink-0">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-slate-200"></span>
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white px-2 text-slate-400 font-medium">Or Use URL</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="image_url" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Image URL</Label>
                                        <Input
                                            id="image_url"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                            placeholder="https://..."
                                            className="h-11 rounded-xl bg-slate-50 border-slate-200"
                                        />
                                    </div>
                                </div>
                                {formData.image_url && (
                                    <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm mt-4">
                                        <img
                                            src={formData.image_url}
                                            alt="Preview"
                                            className="w-full aspect-video object-cover"
                                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL')}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
