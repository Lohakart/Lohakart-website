import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, User as UserIcon, Mail, Phone, Calendar, Briefcase, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Application {
    id: string;
    job_id: string;
    full_name: string;
    email: string;
    phone: string;
    resume_url: string;
    cover_letter: string;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    is_read: boolean;
    created_at: string;
    jobs: {
        title: string;
        department: string;
    };
}

export default function AdminApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data, error } = await supabase
                .from('job_applications')
                .select(`
          *,
          jobs (
            title,
            department
          )
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data as unknown as Application[] || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('job_applications')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            toast.success(`Status updated to ${newStatus}`);
            fetchApplications();
            if (selectedApp?.id === id) {
                setSelectedApp({ ...selectedApp, status: newStatus as any });
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update status');
        }
    };

    const markAsRead = async (app: Application) => {
        if (app.is_read) return;
        try {
            const { error } = await supabase
                .from('job_applications')
                .update({ is_read: true })
                .eq('id', app.id);

            if (error) throw error;
            fetchApplications();
            // Notify other components if needed
            window.dispatchEvent(new Event('applicationsUpdated'));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'accepted': return <Badge className="bg-green-500 hover:bg-green-600">Accepted</Badge>;
            case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
            case 'reviewed': return <Badge className="bg-blue-500 hover:bg-blue-600">Reviewed</Badge>;
            default: return <Badge variant="outline" className="text-amber-600 border-amber-500 bg-amber-50">Pending</Badge>;
        }
    };

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
                        <FileText className="w-8 h-8 text-blue-600" />
                        Job Applications
                    </h1>
                    <p className="text-muted-foreground mt-1">Review and manage candidate applications</p>
                </div>

                <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-12 text-center text-muted-foreground">Loading applications...</div>
                        ) : applications.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <FileText className="w-16 h-16 text-slate-200 mx-auto" />
                                <div>
                                    <h3 className="text-xl font-bold">No applications yet</h3>
                                    <p className="text-muted-foreground">New applications will appear here once users apply.</p>
                                </div>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Candidate</TableHead>
                                        <TableHead>Applied For</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.map((app) => (
                                        <TableRow
                                            key={app.id}
                                            className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${!app.is_read ? 'bg-blue-50/30' : ''}`}
                                            onClick={() => {
                                                setSelectedApp(app);
                                                markAsRead(app);
                                            }}
                                        >
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold flex items-center gap-2">
                                                        {app.full_name}
                                                        {!app.is_read && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {app.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{app.jobs?.title}</span>
                                                    <span className="text-xs text-muted-foreground">{app.jobs?.department}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-500">
                                                {format(new Date(app.created_at), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Dialog open={selectedApp?.id === app.id} onOpenChange={(open) => !open && setSelectedApp(null)}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="rounded-lg hover:bg-white hover:shadow-sm">
                                                            Detail <ChevronRight className="w-4 h-4 ml-1" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                                                <UserIcon className="w-6 h-6 text-primary" />
                                                                {app.full_name}
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Candidate for {app.jobs?.title} ({app.jobs?.department})
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                                            <div className="space-y-6">
                                                                <div className="space-y-3">
                                                                    <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Contact Information</h4>
                                                                    <div className="space-y-2">
                                                                        <p className="flex items-center gap-3 text-sm font-medium"><Mail className="w-4 h-4 text-blue-500" /> {app.email}</p>
                                                                        <p className="flex items-center gap-3 text-sm font-medium"><Phone className="w-4 h-4 text-green-500" /> {app.phone}</p>
                                                                        <p className="flex items-center gap-3 text-sm font-medium"><Calendar className="w-4 h-4 text-orange-500" /> Applied on {format(new Date(app.created_at), 'MMMM do, yyyy')}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Application Status</h4>
                                                                    <Select
                                                                        value={app.status}
                                                                        onValueChange={(val) => handleStatusUpdate(app.id, val)}
                                                                    >
                                                                        <SelectTrigger className="w-full h-12 rounded-xl">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="pending">Pending Review</SelectItem>
                                                                            <SelectItem value="reviewed">Reviewed</SelectItem>
                                                                            <SelectItem value="accepted">Accepted</SelectItem>
                                                                            <SelectItem value="rejected">Rejected</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                <div className="pt-4">
                                                                    <Button
                                                                        className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border-none shadow-none"
                                                                        asChild
                                                                    >
                                                                        <a href={app.resume_url} target="_blank" rel="noopener noreferrer">
                                                                            <Download className="w-4 h-4 mr-2" /> Download Resume (PDF)
                                                                        </a>
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Cover Letter</h4>
                                                                <div className="p-6 bg-slate-50 rounded-2xl text-sm leading-relaxed text-slate-700 whitespace-pre-wrap min-h-[200px] border border-slate-100">
                                                                    {app.cover_letter || "No cover letter provided."}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-3 justify-end pt-8 border-t">
                                                            <Button variant="outline" className="rounded-xl px-6" onClick={() => handleStatusUpdate(app.id, 'rejected')}>Reject</Button>
                                                            <Button className="bg-green-600 hover:bg-green-700 rounded-xl px-6" onClick={() => handleStatusUpdate(app.id, 'accepted')}>Accept Candidate</Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
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
