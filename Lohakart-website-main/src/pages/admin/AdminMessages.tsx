import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail, Trash2, CheckCircle, Clock, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';

interface ContactMessage {
    id: string;
    created_at: string;
    name: string;
    email: string;
    message: string;
    is_read: boolean;
}

export default function AdminMessages() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            // @ts-ignore
            setMessages(data || []);

            // Mark all fetched messages as read
            // @ts-ignore
            const unreadIds = data?.filter(m => !m.is_read).map(m => m.id) || [];
            if (unreadIds.length > 0) {
                await supabase
                    .from('contact_messages')
                    // @ts-ignore
                    .update({ is_read: true })
                    .in('id', unreadIds);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const { error } = await supabase
                .from('contact_messages')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) {
                setIsViewOpen(false);
            }
            toast.success('Message deleted');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete message');
        }
    };

    const openMessage = (msg: ContactMessage) => {
        setSelectedMessage(msg);
        setIsViewOpen(true);
    };

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <MessageSquare className="w-8 h-8 text-primary" />
                            Contact Messages
                        </h1>
                        <p className="text-muted-foreground mt-1">Manage user inquiries from the Contact Us page</p>
                    </div>
                </div>

                <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
                    <CardHeader className="bg-white border-b">
                        <CardTitle>Inquiries</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground animate-pulse">Loading messages...</div>
                        ) : messages.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">No messages yet.</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead className="w-[180px]">Date</TableHead>
                                        <TableHead className="w-[240px]">Sender</TableHead>
                                        <TableHead>Message</TableHead>
                                        <TableHead className="text-right w-[110px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {messages.map((msg) => (
                                        <TableRow 
                                            key={msg.id} 
                                            className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                                            onClick={() => openMessage(msg)}
                                        >
                                            <TableCell className="text-sm align-top py-4">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">
                                                        {format(new Date(msg.created_at), 'MMM dd, yyyy HH:mm')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4">
                                                <div className="font-semibold text-slate-900">{msg.name || 'Anonymous'}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 break-all">
                                                    <Mail className="w-3 h-3 flex-shrink-0" /> {msg.email}
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4">
                                                <p className="text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
                                                    {msg.message}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right align-top py-4" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        title="View Message"
                                                        onClick={() => openMessage(msg)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        title="Delete Message"
                                                        onClick={() => handleDelete(msg.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* View Full Message Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                            <MessageSquare className="w-5 h-5 text-[#005081]" />
                            Inquiry Details
                        </DialogTitle>
                        <DialogDescription>
                            {selectedMessage && `Received on ${format(new Date(selectedMessage.created_at), 'MMMM dd, yyyy at HH:mm')}`}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMessage && (
                        <div className="space-y-4 py-2">
                            <div className="bg-slate-50 p-4 rounded-xl space-y-2.5 border border-slate-100">
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sender Name</span>
                                    <p className="text-base font-semibold text-slate-900">{selectedMessage.name || 'Anonymous'}</p>
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                                    <p className="text-sm text-slate-800 flex items-center gap-1.5 font-medium mt-0.5">
                                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                                        <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                                            {selectedMessage.email}
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Message</span>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm whitespace-pre-wrap break-words leading-relaxed max-h-[350px] overflow-y-auto">
                                    {selectedMessage.message}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex sm:justify-between items-center gap-2 pt-2">
                        {selectedMessage && (
                            <a href={`mailto:${selectedMessage.email}?subject=Reply to your inquiry on Lohakart`}>
                                <Button className="gap-2 bg-[#005081] hover:bg-[#003e64] text-white">
                                    <Mail className="w-4 h-4" /> Reply via Email
                                </Button>
                            </a>
                        )}
                        <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
