import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FileText, Download, Mail, Phone, Calendar, User, Search, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FabricationRequest {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    company_name: string | null;
    message: string;
    file_url: string | null;
    status: 'pending' | 'quoted' | 'replied' | 'rejected';
    created_at: string;
    admin_response: string | null;
    quote_amount: number | null;
    is_read: boolean;
}

export default function AdminFabrication() {
    const [requests, setRequests] = useState<FabricationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<FabricationRequest | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [quoteAmount, setQuoteAmount] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        fetchRequests();
        markRequestsAsRead();
    }, []);

    const markRequestsAsRead = async () => {
        // @ts-ignore
        const { error } = await supabase
            .from('fabrication_requests')
            .update({ is_read: true })
            .eq('is_read', false);

        if (error) {
            console.error('Error marking fabrication requests as read:', error);
        }
    };

    const fetchRequests = async () => {
        // @ts-ignore
        const { data, error } = await supabase
            .from('fabrication_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setRequests(data as unknown as FabricationRequest[]);
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (status: FabricationRequest['status']) => {
        if (!selectedRequest) return;

        // @ts-ignore
        const { error } = await supabase
            .from('fabrication_requests')
            .update({
                status,
                quote_amount: quoteAmount ? parseFloat(quoteAmount) : null,
                admin_response: responseMessage,
                user_is_read: false
            })
            .eq('id', selectedRequest.id);

        if (!error) {
            toast.success(`Request marked as ${status}`);
            fetchRequests();
            setDialogOpen(false);
        } else {
            toast.error('Failed to update request');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this fabrication request?')) return;

        // @ts-ignore
        const { error } = await supabase
            .from('fabrication_requests')
            .delete()
            .eq('id', id);

        if (!error) {
            toast.success('Request deleted');
            fetchRequests();
        } else {
            toast.error('Failed to delete request');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'quoted': return 'default'; // primary/black
            case 'replied': return 'secondary'; // gray
            case 'rejected': return 'destructive'; // red
            default: return 'outline'; // white/border
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Fabrication Requests</h1>
                    <p className="text-muted-foreground">Manage RFQs and fabrications drawings</p>
                </div>

                <div className="grid gap-4">
                    {requests.length === 0 ? (
                        <Card className="p-12 text-center text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No fabrication requests found.</p>
                        </Card>
                    ) : (
                        requests.map((request) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className={`hover:shadow-md transition-all ${!request.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/10' : ''}`}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-bold text-lg">{request.full_name}</span>
                                                    <Badge variant={getStatusColor(request.status)} className="capitalize">
                                                        {request.status}
                                                    </Badge>
                                                    {!request.is_read && (
                                                        <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                                                    )}
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>

                                                {request.company_name && (
                                                    <div className="text-sm font-medium text-slate-600">
                                                        Company: {request.company_name}
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-4 w-4" /> {request.email}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-4 w-4" /> {request.phone}
                                                    </div>
                                                </div>

                                                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm border">
                                                    <span className="font-semibold block mb-1">Requirement:</span>
                                                    {request.message}
                                                </div>

                                                {request.file_url && (
                                                    <div className="mt-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <a href={request.file_url} target="_blank" rel="noopener noreferrer">
                                                                <Download className="h-4 w-4 mr-2" />
                                                                View Attached Drawing
                                                            </a>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2 min-w-[150px] justify-center">
                                                <Dialog open={dialogOpen && selectedRequest?.id === request.id} onOpenChange={(open) => {
                                                    if (open) {
                                                        setSelectedRequest(request);
                                                        setQuoteAmount(request.quote_amount?.toString() || '');
                                                        setResponseMessage(request.admin_response || '');
                                                    }
                                                    setDialogOpen(open);
                                                }}>
                                                    <DialogTrigger asChild>
                                                        <Button>Respond / Quote</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Respond to Request</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>Full Name</Label>
                                                                    <Input value={request.full_name} disabled />
                                                                </div>
                                                                <div>
                                                                    <Label>Company</Label>
                                                                    <Input value={request.company_name || '-'} disabled />
                                                                </div>
                                                            </div>

                                                            <div className="border-t pt-4">
                                                                <Label>Quote Amount (₹)</Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0.00"
                                                                    value={quoteAmount}
                                                                    onChange={(e) => setQuoteAmount(e.target.value)}
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Response Message</Label>
                                                                <Textarea
                                                                    placeholder="Enter quote details or reply to customer..."
                                                                    rows={4}
                                                                    value={responseMessage}
                                                                    onChange={(e) => setResponseMessage(e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="flex gap-2 justify-end pt-2">
                                                                <Button variant="outline" onClick={() => handleUpdateStatus('rejected')}>
                                                                    Reject
                                                                </Button>
                                                                <Button variant="secondary" onClick={() => handleUpdateStatus('replied')}>
                                                                    Mark Replied
                                                                </Button>
                                                                <Button onClick={() => handleUpdateStatus('quoted')}>
                                                                    Send Quote
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(request.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Request
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
