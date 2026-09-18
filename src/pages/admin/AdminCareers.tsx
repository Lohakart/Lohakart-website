import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, Plus, Edit2, Trash2, MapPin, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

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

export default function AdminCareers() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        type: 'Full-time',
        department: '',
        requirements: '',
        status: 'open'
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const requirementsArray = formData.requirements.split('\n').filter(r => r.trim() !== '');

        const jobData = {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            type: formData.type,
            department: formData.department,
            requirements: requirementsArray,
            status: formData.status
        };

        try {
            if (editingJob) {
                const { error } = await supabase
                    .from('jobs')
                    .update(jobData)
                    .eq('id', editingJob.id);
                if (error) throw error;
                toast.success('Job updated successfully');
            } else {
                const { error } = await supabase
                    .from('jobs')
                    .insert(jobData);
                if (error) throw error;
                toast.success('Job created successfully');
            }

            setIsDialogOpen(false);
            setEditingJob(null);
            resetForm();
            fetchJobs();
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save job');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job? This will also delete all associated applications.')) return;

        try {
            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Job deleted successfully');
            fetchJobs();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete job');
        }
    };

    const openEditDialog = (job: Job) => {
        setEditingJob(job);
        setFormData({
            title: job.title,
            description: job.description,
            location: job.location,
            type: job.type,
            department: job.department,
            requirements: job.requirements.join('\n'),
            status: job.status
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            location: '',
            type: 'Full-time',
            department: '',
            requirements: '',
            status: 'open'
        });
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-primary" />
                            Manage Jobs
                        </h1>
                        <p className="text-muted-foreground mt-1">Post and manage career opportunities at Lohakart</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setEditingJob(null);
                            resetForm();
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
                                <Plus className="w-5 h-5 mr-2" /> Post New Job
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingJob ? 'Edit Job Posting' : 'Post New Career Opportunity'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateOrUpdate} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Job Title</Label>
                                    <Input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Senior Frontend Engineer"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Department</Label>
                                        <Input
                                            required
                                            value={formData.department}
                                            onChange={e => setFormData({ ...formData, department: e.target.value })}
                                            placeholder="e.g. Engineering"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input
                                            required
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. Bengaluru (Remote)"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Job Type</Label>
                                        <Select value={formData.type} onValueChange={val => setFormData({ ...formData, type: val })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Full-time">Full-time</SelectItem>
                                                <SelectItem value="Part-time">Part-time</SelectItem>
                                                <SelectItem value="Contract">Contract</SelectItem>
                                                <SelectItem value="Internship">Internship</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select value={formData.status} onValueChange={val => setFormData({ ...formData, status: val })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="open">Open</SelectItem>
                                                <SelectItem value="closed">Closed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Job Description</Label>
                                    <Textarea
                                        required
                                        rows={6}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Detailed job description..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Requirements (One per line)</Label>
                                    <Textarea
                                        rows={5}
                                        value={formData.requirements}
                                        onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                        placeholder="Must have 5+ years experience&#10;Expertise in React and TypeScript..."
                                    />
                                </div>
                                <Button type="submit" className="w-full h-12 rounded-xl mt-4">
                                    {editingJob ? 'Update Posting' : 'Publish Opportunity'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
                    <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
                        <CardTitle>Job Postings</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                placeholder="Search jobs..."
                                className="pl-9 h-10 rounded-lg text-sm"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground">Loading opportunities...</div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">No jobs found.</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead>Title</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredJobs.map((job) => (
                                        <TableRow key={job.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="font-bold">{job.title}</TableCell>
                                            <TableCell>{job.department}</TableCell>
                                            <TableCell>{job.type}</TableCell>
                                            <TableCell className="text-sm text-slate-500">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={job.status === 'open' ? 'secondary' : 'outline'} className={`capitalize ${job.status === 'open' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}`}>
                                                    {job.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" onClick={() => openEditDialog(job)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600 text-red-500" onClick={() => handleDelete(job.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
