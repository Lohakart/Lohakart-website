import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Briefcase, MapPin, Clock, Building2, Upload, Send, CheckCircle2, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    type: string;
    department: string;
    requirements: string[];
    status: string;
    created_at: string;
}

export default function Careers() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    // Application Form State
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [applying, setApplying] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('status', 'open')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load career opportunities');
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === 'all' || job.department === departmentFilter;
        return matchesSearch && matchesDept;
    });

    const departments = Array.from(new Set(jobs.map(j => j.department)));

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob || !resumeFile) return;

        setApplying(true);
        try {
            // 1. Upload Resume
            const fileExt = resumeFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `resumes/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, resumeFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl(filePath);

            // 2. Submit Application
            const { error: applyError } = await supabase
                .from('job_applications')
                .insert({
                    job_id: selectedJob.id,
                    user_id: user?.id || null,
                    full_name: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    resume_url: publicUrl,
                    cover_letter: form.coverLetter,
                });

            if (applyError) throw applyError;

            toast.success('Application submitted successfully!');
            setSelectedJob(null);
            setForm({ fullName: '', email: '', phone: '', coverLetter: '' });
            setResumeFile(null);
        } catch (error) {
            console.error('Application error:', error);
            toast.error('Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-24">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Badge variant="outline" className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
                            Join Our Team
                        </Badge>
                        <h1 className="text-5xl font-black mb-6 tracking-tight">Build the Future of Steel Logistics</h1>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            We're looking for passionate individuals to help us disrupt the metal procurement industry with technology and innovation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Jobs Listing */}
            <main className="container mx-auto px-4 py-20">
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <Input
                            placeholder="Search jobs by title or department..."
                            className="pl-10 h-12 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-slate-500" />
                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="w-[180px] h-12 rounded-xl">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map(dept => (
                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold">No opportunities found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map((job) => (
                            <motion.div
                                key={job.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Card className="h-full hover:shadow-xl transition-all border-none shadow-sm rounded-2xl overflow-hidden group">
                                    <CardHeader className="bg-white pb-2 flex flex-col justify-between h-full">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                    {job.department}
                                                </Badge>
                                                <Badge variant="outline" className="text-slate-500">
                                                    <Clock className="w-3 h-3 mr-1" /> {job.type}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors">{job.title}</CardTitle>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                                <MapPin className="w-4 h-4" /> {job.location}
                                            </div>
                                        </div>
                                        <div className="pt-6">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800"
                                                        onClick={() => setSelectedJob(job)}
                                                    >
                                                        View Details & Apply
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
                                                        <DialogDescription className="flex items-center gap-4 mt-2">
                                                            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.department}</span>
                                                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="space-y-6 pt-4">
                                                        <div>
                                                            <h4 className="font-bold mb-2">Description</h4>
                                                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                                                        </div>

                                                        {job.requirements && job.requirements.length > 0 && (
                                                            <div>
                                                                <h4 className="font-bold mb-2">Requirements</h4>
                                                                <ul className="list-disc pl-5 text-slate-600 space-y-1">
                                                                    {job.requirements.map((req, idx) => (
                                                                        <li key={idx}>{req}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        <div className="border-t pt-8">
                                                            <h3 className="text-xl font-bold mb-4">Apply for this position</h3>
                                                            <form onSubmit={handleApply} className="space-y-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label>Full Name</Label>
                                                                        <Input
                                                                            required
                                                                            value={form.fullName}
                                                                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label>Email</Label>
                                                                        <Input
                                                                            type="email"
                                                                            required
                                                                            value={form.email}
                                                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Phone Number</Label>
                                                                    <Input
                                                                        type="tel"
                                                                        required
                                                                        value={form.phone}
                                                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Resume (PDF)</Label>
                                                                    <div className="flex items-center gap-4">
                                                                        <Input
                                                                            type="file"
                                                                            accept=".pdf"
                                                                            required
                                                                            className="hidden"
                                                                            id="resume-upload"
                                                                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            className="w-full h-12 border-dashed border-2 hover:bg-slate-50"
                                                                            onClick={() => document.getElementById('resume-upload')?.click()}
                                                                        >
                                                                            <Upload className="w-4 h-4 mr-2" />
                                                                            {resumeFile ? resumeFile.name : 'Click to upload resume'}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Cover Letter (Optional)</Label>
                                                                    <Textarea
                                                                        rows={4}
                                                                        placeholder="Tell us why you're a good fit..."
                                                                        value={form.coverLetter}
                                                                        onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                                                                    />
                                                                </div>
                                                                <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700" disabled={applying}>
                                                                    {applying ? 'Submitting Application...' : 'Submit Application'}
                                                                    <Send className="ml-2 w-4 h-4" />
                                                                </Button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Benefits Section */}
            <section className="bg-white py-24 border-t border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why work at Lohakart?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">We offer a dynamic environment where you can grow your career and shape the future of a vital industry.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Innovation First', icon: CheckCircle2, desc: 'Work with the latest technologies to solve real-world industrial problems.' },
                            { title: 'Growth Mindset', icon: CheckCircle2, desc: 'Generous learning and development budgets for your professional growth.' },
                            { title: 'Competitive Rewards', icon: CheckCircle2, desc: 'Market-leading compensation packages and comprehensive healthcare.' },
                            { title: 'Global Impact', icon: CheckCircle2, desc: 'Scale a platform used by businesses across the country and soon beyond.' },
                            { title: 'Great Culture', icon: CheckCircle2, desc: 'A diverse, inclusive, and collaborative environment built on trust.' },
                            { title: 'Flexible Working', icon: CheckCircle2, desc: 'We value results over hours. Enjoy flexible work arrangements.' }
                        ].map((benefit, i) => (
                            <div key={i} className="flex gap-4 items-start p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="mt-1">
                                    <benefit.icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">{benefit.title}</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
