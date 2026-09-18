import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    Recycle,
    Calendar,
    Building2,
    MapPin,
    User,
    Mail,
    Phone,
    Scale,
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    Eye,
    MessageSquare,
    Send,
    Trash2
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';

export default function AdminRecycling() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [adminResponse, setAdminResponse] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchRequests();
    }, []);

    async function fetchRequests() {
        try {
            const { data, error } = await (supabase as any)
                .from('recycling_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, newStatus: string) {
        setIsSubmitting(true);
        try {
            const { error } = await (supabase as any)
                .from('recycling_requests')
                .update({
                    status: newStatus,
                    admin_is_read: true,
                    admin_response: adminResponse,
                    user_is_read: false // Mark as unread for the user when admin updates it
                })
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Status Updated",
                description: `Request status changed to ${newStatus}`,
            });
            fetchRequests();
            if (selectedRequest) {
                setSelectedRequest({
                    ...selectedRequest,
                    status: newStatus,
                    admin_response: adminResponse
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function markAsRead(id: string) {
        try {
            const { error } = await (supabase as any)
                .from('recycling_requests')
                .update({ admin_is_read: true })
                .eq('id', id);

            if (error) throw error;
            fetchRequests();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    }

    async function deleteRequest(id: string) {
        if (!confirm('Are you sure you want to delete this recycling request? This action cannot be undone.')) {
            return;
        }

        try {
            const { error } = await (supabase as any)
                .from('recycling_requests')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Request Deleted",
                description: "Recycling request has been successfully deleted",
            });

            // Close dialog if this request is currently selected
            if (selectedRequest?.id === id) {
                setSelectedRequest(null);
            }

            fetchRequests();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Approved': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                        <Recycle className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Recycling Requests</h1>
                        <p className="text-slate-500">Manage industrial metal recycling inquiries</p>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-sm font-bold text-slate-900">Company</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-900">Metal Type</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-900">Quantity</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-900">Date</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-900">Status</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-900 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    Array(5).fill(0).map((_, idx) => (
                                        <tr key={idx} className="animate-pulse">
                                            <td colSpan={6} className="px-6 py-4 h-16 bg-slate-50/20" />
                                        </tr>
                                    ))
                                ) : requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <Recycle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-500 font-medium">No recycling requests found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr
                                            key={req.id}
                                            className={`hover:bg-slate-50/50 transition-colors ${!req.admin_is_read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900">{req.company_name}</span>
                                                    <span className="text-xs text-slate-500">{req.contact_person}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-medium">{req.metal_type}</td>
                                            <td className="px-6 py-4 text-slate-600 font-medium">{req.estimated_quantity}</td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">
                                                {format(new Date(req.created_at), 'MMM dd, yyyy')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={`rounded-full px-3 py-1 ${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedRequest(req);
                                                            setAdminResponse(req.admin_response || '');
                                                            if (!req.admin_is_read) markAsRead(req.id);
                                                        }}
                                                        className="hover:bg-blue-100 hover:text-blue-600 rounded-xl"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteRequest(req.id)}
                                                        className="hover:bg-red-100 hover:text-red-600 rounded-xl"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Request Detail Dialog */}
                <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                    <DialogContent className="sm:max-w-2xl bg-white rounded-[32px] p-8 overflow-y-auto max-h-[90vh]">
                        <DialogHeader className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(selectedRequest?.status)}`}>
                                    <Recycle className="w-6 h-6" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-black text-slate-900">Request Details</DialogTitle>
                                    <DialogDescription>Submitted on {selectedRequest && format(new Date(selectedRequest.created_at), 'PPPP')}</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {selectedRequest && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-3">
                                            <Building2 className="w-5 h-5 text-slate-400 mt-1" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company</p>
                                                <p className="text-slate-900 font-bold">{selectedRequest.company_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <User className="w-5 h-5 text-slate-400 mt-1" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Person</p>
                                                <p className="text-slate-900 font-bold">{selectedRequest.contact_person}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-slate-400 mt-1" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</p>
                                                <p className="text-slate-900 font-medium">{selectedRequest.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-slate-400 mt-1" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                                                <p className="text-slate-900 font-medium">{selectedRequest.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-3">
                                            <Recycle className="w-5 h-5 text-slate-400 mt-1" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Metal Type</p>
                                                <p className="text-slate-900 font-bold">{selectedRequest.metal_type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Scale className="w-5 h-5 text-slate-400 mt-1" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity</p>
                                                <p className="text-slate-900 font-bold">{selectedRequest.estimated_quantity}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</p>
                                                <p className="text-slate-900 font-medium">{selectedRequest.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileText className="w-5 h-5 text-slate-400" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</p>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed">{selectedRequest.description || 'No description provided.'}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-blue-600" />
                                        <p className="text-sm font-bold text-slate-900">Admin Response</p>
                                    </div>
                                    <Textarea
                                        value={adminResponse}
                                        onChange={(e) => setAdminResponse(e.target.value)}
                                        placeholder="Provide feedback, recycling instructions, or quote details..."
                                        className="rounded-2xl border-slate-200 focus:ring-blue-500 min-h-[120px]"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                                    <Button
                                        onClick={() => updateStatus(selectedRequest.id, 'Approved')}
                                        disabled={selectedRequest.status === 'Approved'}
                                        className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => updateStatus(selectedRequest.id, 'Completed')}
                                        disabled={selectedRequest.status === 'Completed'}
                                        className="bg-green-600 hover:bg-green-700 rounded-xl"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Mark Completed
                                    </Button>
                                    <Button
                                        onClick={() => updateStatus(selectedRequest.id, 'Cancelled')}
                                        disabled={selectedRequest.status === 'Cancelled'}
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => updateStatus(selectedRequest.id, 'Pending')}
                                        className="rounded-xl ml-auto"
                                    >
                                        <Clock className="w-4 h-4 mr-2" />
                                        Revert to Pending
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
