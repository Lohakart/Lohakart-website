import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  LogOut,
  User as UserIcon,
  MapPin,
  Hammer,
  ExternalLink,
  MessageCircle,
  Recycle,
  ArrowLeft,
  Settings,
  Bell,
  Calendar,
  CreditCard,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [fabricationRequests, setFabricationRequests] = useState<any[]>([]);
  const [recyclingRequests, setRecyclingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [unreadOrders, setUnreadOrders] = useState(0);
  const [unreadFabrication, setUnreadFabrication] = useState(0);
  const [unreadRecycling, setUnreadRecycling] = useState(0);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchFabricationRequests();
      fetchRecyclingRequests();
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && unreadOrders > 0) {
      markOrdersAsRead();
    } else if (activeTab === 'fabrication' && unreadFabrication > 0) {
      markFabricationAsRead();
    } else if (activeTab === 'recycling' && unreadRecycling > 0) {
      markRecyclingAsRead();
    }
  }, [activeTab, unreadOrders, unreadFabrication, unreadRecycling]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          quantity,
          price
        )
      `)
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
      setUnreadOrders(data.filter((o: any) => o.user_is_read === false).length);
      if (activeTab === 'orders') markOrdersAsRead();
    }
  };

  const fetchFabricationRequests = async () => {
    const { data } = await supabase
      .from('fabrication_requests')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (data) {
      setFabricationRequests(data);
      setUnreadFabrication(data.filter((f: any) => f.user_is_read === false).length);
      if (activeTab === 'fabrication') markFabricationAsRead();
    }
    setLoading(false);
  };

  const fetchRecyclingRequests = async () => {
    const { data } = await (supabase as any)
      .from('recycling_requests')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (data) {
      setRecyclingRequests(data);
      setUnreadRecycling(data.filter((r: any) => r.user_is_read === false).length);
      if (activeTab === 'recycling') markRecyclingAsRead();
    }
    setLoading(false);
  };

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();

    if (data) {
      setProfile({
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
      });
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user!.id);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
    }
    setProfileLoading(false);
  };

  const markOrdersAsRead = async () => {
    if (!user || unreadOrders === 0) return;
    const { error } = await supabase
      .from('orders')
      .update({ user_is_read: true })
      .eq('user_id', user.id)
      .eq('user_is_read', false);

    if (!error) {
      setUnreadOrders(0);
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    }
  };

  const markFabricationAsRead = async () => {
    if (!user || unreadFabrication === 0) return;
    const { error } = await supabase
      .from('fabrication_requests')
      .update({ user_is_read: true })
      .eq('user_id', user.id)
      .eq('user_is_read', false);

    if (!error) {
      setUnreadFabrication(0);
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    }
  };

  const markRecyclingAsRead = async () => {
    if (!user || unreadRecycling === 0) return;
    const { error } = await (supabase as any)
      .from('recycling_requests')
      .update({ user_is_read: true })
      .eq('user_id', user.id)
      .eq('user_is_read', false);

    if (!error) {
      setUnreadRecycling(0);
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
      confirmed: 'bg-blue-500/20 text-blue-500 border-blue-500/50',
      processing: 'bg-orange-500/20 text-orange-500 border-orange-500/50',
      shipped: 'bg-purple-500/20 text-purple-500 border-purple-500/50',
      delivered: 'bg-green-500/20 text-green-500 border-green-500/50',
      cancelled: 'bg-red-500/20 text-red-500 border-red-500/50',
      quoted: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50',
      replied: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50',
      rejected: 'bg-red-500/20 text-red-500 border-red-500/50',
    };
    return statusMap[status.toLowerCase()] || 'bg-slate-500/20 text-slate-500 border-slate-500/50';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-outfit relative overflow-hidden">
      <Navbar />

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-100/40 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -ml-64 -mb-64" />
      </div>

      <main className="flex-1 py-8 sm:py-10 lg:py-12 px-0 sm:px-6 lg:px-8 relative z-10">
        <div className="container mx-auto max-w-7xl">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <Link to="/">
                <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 group gap-2 px-0 mb-4 transition-all">
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Marketplace
                </Button>
              </Link>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                  <UserIcon className="h-8 w-8 text-[#be1800]" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                    Partner <span className="text-[#be1800]">Dashboard</span>
                  </h1>
                  <p className="text-slate-500 font-medium">Empowering your industrial supply chain</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <Button onClick={signOut} variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-bold gap-2 shadow-sm">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Stats / Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              <Card className="bg-white border-slate-200 shadow-sm overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#be1800]" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Profile Abstract</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-slate-900 truncate">{profile.full_name || 'Anonymous User'}</span>
                      <span className="text-slate-500 text-sm font-medium">{user?.email}</span>
                    </div>
                    <div className="h-px bg-slate-100 w-full" />
                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPin className="h-4 w-4 text-[#be1800]" />
                      <span className="text-sm font-medium">{profile.city || 'Location not set'}, {profile.state || 'IN'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{orders.length}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Hammer className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{fabricationRequests.length}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fabrication</p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <Recycle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{recyclingRequests.length}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recycling Projects</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="orders" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-slate-100 border border-slate-200 p-1.5 rounded-2xl h-auto flex flex-wrap mb-8">
                  {[
                    { val: 'orders', label: 'My Orders', unread: unreadOrders, icon: Package },
                    { val: 'fabrication', label: 'Fabrication', unread: unreadFabrication, icon: Hammer },
                    { val: 'recycling', label: 'Recycling', unread: unreadRecycling, icon: Recycle },
                    { val: 'profile', label: 'Profile', unread: 0, icon: Settings },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.val}
                      value={tab.val}
                      className="relative flex-1 min-w-[120px] gap-2 py-3 px-4 data-[state=active]:bg-[#be1800] data-[state=active]:text-white rounded-xl transition-all duration-300 font-bold text-slate-600"
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                      {tab.unread > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 text-[10px] items-center justify-center font-black text-white">
                            {tab.unread}
                          </span>
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <AnimatePresence mode="wait">
                  {/* ORDERS CONTENT */}
                  <TabsContent value="orders" className="space-y-6 focus-visible:outline-none">
                    {orders.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 rounded-3xl p-20 text-center shadow-sm">
                        <Package className="h-20 w-20 mx-auto text-slate-200 mb-6" />
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Transaction History Clear</h3>
                        <p className="text-slate-500 font-medium">You haven't placed any industrial orders yet.</p>
                      </motion.div>
                    ) : (
                      <div className="grid gap-6">
                        {orders.map((order, idx) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <Card className="bg-white border-slate-200 hover:border-[#be1800]/50 transition-all overflow-hidden group shadow-sm hover:shadow-md">
                              <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-red-50 transition-colors">
                                      <FileText className="h-6 w-6 text-slate-400 group-hover:text-[#be1800]" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Invoice Reference</p>
                                      <h3 className="text-xl font-black text-slate-900">#LKN-{order.id.slice(0, 8).toUpperCase()}</h3>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="text-right hidden sm:block">
                                      <p className="text-xs font-bold text-slate-400 uppercase">Date of Issue</p>
                                      <p className="text-sm font-black text-slate-700">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <Badge className={`${getStatusColor(order.status)} px-4 py-1.5 rounded-full font-black text-[10px] uppercase border shadow-sm`}>
                                      {order.status}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Bill Materials</p>
                                  {order.order_items?.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center py-4 px-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                                      <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#be1800]" />
                                        <span className="text-slate-900 font-bold">{item.product_name} <span className="text-slate-500 font-medium ml-2">x {item.quantity}</span></span>
                                      </div>
                                      <span className="text-slate-900 font-black">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100">
                                  <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-slate-400 uppercase">Valuation</span>
                                      <span className="text-2xl font-black text-[#be1800]">₹{order.total_amount.toLocaleString()}</span>
                                    </div>
                                    <div className="h-10 w-px bg-slate-100 hidden sm:block" />
                                    <div className="hidden md:flex flex-col">
                                      <span className="text-xs font-bold text-slate-400 uppercase">Shipping Terminal</span>
                                      <span className="text-sm font-medium text-slate-600 max-w-[300px] truncate">{order.shipping_address}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* FABRICATION CONTENT */}
                  <TabsContent value="fabrication" className="space-y-6 focus-visible:outline-none">
                    {fabricationRequests.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 rounded-3xl p-20 text-center shadow-sm">
                        <Hammer className="h-20 w-20 mx-auto text-slate-200 mb-6" />
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No Active Blueprints</h3>
                        <p className="text-slate-500 font-medium mb-6">Launch your industrial fabrication project today.</p>
                        <Link to="/services/fabrication">
                          <Button className="bg-[#be1800] hover:bg-[#a01500] font-black uppercase tracking-widest px-8 shadow-md">Submit RFQ</Button>
                        </Link>
                      </motion.div>
                    ) : (
                      <div className="grid gap-6">
                        {fabricationRequests.map((request, idx) => (
                          <motion.div
                            key={request.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <Card className="bg-white border-slate-200 hover:border-[#be1800]/50 transition-all overflow-hidden relative shadow-sm hover:shadow-md">
                              {request.status === 'quoted' && <div className="absolute top-0 right-0 p-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-bl-xl uppercase px-3 shadow-lg z-20">New Quote Available</div>}

                              <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
                                      <Hammer className="h-6 w-6 text-[#be1800]" />
                                    </div>
                                    <div>
                                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Fabrication Project Analysis</h3>
                                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{new Date(request.created_at).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <Badge className={`${getStatusColor(request.status)} px-4 py-1.5 rounded-full font-black text-[10px] uppercase border`}>
                                    {request.status}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                  <div className="md:col-span-2 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Project Specifications</p>
                                    <p className="text-slate-700 font-medium italic leading-relaxed">"{request.message}"</p>
                                  </div>

                                  {request.quote_amount && (
                                    <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col justify-center shadow-sm">
                                      <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Eng. Valuation</p>
                                      <p className="text-3xl font-black text-emerald-700 tracking-tight">₹{parseFloat(request.quote_amount).toLocaleString()}</p>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-100">
                                  {request.file_url && (
                                    <a
                                      href={request.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-all shadow-sm"
                                    >
                                      <ExternalLink className="h-4 w-4 text-[#be1800]" />
                                      View Blueprints
                                    </a>
                                  )}

                                  {request.admin_response && (
                                    <div className="w-full mt-4 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4 shadow-sm">
                                      <MessageCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                      <div>
                                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Technical Response</p>
                                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">{request.admin_response}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* RECYCLING CONTENT */}
                  <TabsContent value="recycling" className="space-y-6 focus-visible:outline-none">
                    {recyclingRequests.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 rounded-3xl p-20 text-center shadow-sm">
                        <Recycle className="h-20 w-20 mx-auto text-slate-200 mb-6" />
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Sustainability Ledger Empty</h3>
                        <p className="text-slate-500 font-medium mb-6">No industrial recycling mandates found.</p>
                        <Link to="/services/recycling">
                          <Button className="bg-[#be1800] hover:bg-[#a01500] font-black uppercase tracking-widest px-8 shadow-md">Submit Reclamation</Button>
                        </Link>
                      </motion.div>
                    ) : (
                      <div className="grid gap-6">
                        {recyclingRequests.map((request, idx) => (
                          <motion.div
                            key={request.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <Card className="bg-white border-slate-200 hover:border-[#be1800]/50 transition-all overflow-hidden shadow-sm hover:shadow-md">
                              <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100">
                                      <Recycle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{request.metal_type} Reclamation</h3>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="h-3 w-3 text-slate-400" />
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{new Date(request.created_at).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <Badge className={`${getStatusColor(request.status)} px-4 py-1.5 rounded-full font-black text-[10px] uppercase border`}>
                                    {request.status}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                  <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <Package className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Est. Tonnage</p>
                                      <p className="text-lg font-black text-slate-900">{request.estimated_quantity}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                      <MapPin className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Logistics Hub</p>
                                      <p className="text-lg font-black text-slate-900 truncate max-w-[200px]">{request.location}</p>
                                    </div>
                                  </div>
                                </div>

                                {request.description && (
                                  <div className="mb-6 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Reclamation Directive</p>
                                    <p className="text-slate-700 italic text-sm font-medium">"{request.description}"</p>
                                  </div>
                                )}

                                {request.admin_response && (
                                  <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex gap-4 shadow-sm">
                                    <MessageCircle className="h-6 w-6 text-[#be1800] flex-shrink-0" />
                                    <div>
                                      <p className="text-xs font-black text-[#be1800] uppercase tracking-widest mb-2">Administrative Dispatch</p>
                                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">{request.admin_response}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* PROFILE CONTENT */}
                  <TabsContent value="profile" className="focus-visible:outline-none">
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/30">
                          <CardTitle className="text-2xl font-black text-slate-900">Identity Credentials</CardTitle>
                          <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Manage your corporate profile and shipping directives</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                          <form onSubmit={updateProfile} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                <Label htmlFor="full_name" className="text-slate-400 font-bold uppercase text-xs tracking-widest ml-1">Full Legal Name</Label>
                                <div className="relative group">
                                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#be1800] transition-colors" />
                                  <Input
                                    id="full_name"
                                    className="bg-slate-50 border-slate-200 text-slate-900 pl-11 h-12 rounded-xl focus:bg-white focus:border-[#be1800] focus:ring-[#be1800]/10 transition-all font-bold"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    placeholder="Enter full name"
                                  />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <Label htmlFor="phone" className="text-slate-400 font-bold uppercase text-xs tracking-widest ml-1">Secure Hotline</Label>
                                <div className="relative group">
                                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#be1800] transition-colors" />
                                  <Input
                                    id="phone"
                                    className="bg-slate-50 border-slate-200 text-slate-900 pl-11 h-12 rounded-xl focus:bg-white focus:border-[#be1800] focus:ring-[#be1800]/10 transition-all font-bold"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    placeholder="+91 0000000000"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <Label htmlFor="address" className="text-slate-400 font-bold uppercase text-xs tracking-widest ml-1">Primary Terminal Address</Label>
                              <div className="relative group">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#be1800] transition-colors" />
                                <Input
                                  id="address"
                                  className="bg-slate-50 border-slate-200 text-slate-900 pl-11 h-12 rounded-xl focus:bg-white focus:border-[#be1800] focus:ring-[#be1800]/10 transition-all font-bold"
                                  value={profile.address}
                                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                  placeholder="Registered Office/Factory Address"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              <div className="space-y-3">
                                <Label htmlFor="city" className="text-slate-400 font-bold uppercase text-xs tracking-widest ml-1">Operational City</Label>
                                <Input
                                  id="city"
                                  className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:bg-white focus:border-[#be1800] transition-all font-bold"
                                  value={profile.city}
                                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                  placeholder="City"
                                />
                              </div>
                              <div className="space-y-3">
                                <Label htmlFor="state" className="text-slate-400 font-bold uppercase text-xs tracking-widest ml-1">Federal State</Label>
                                <Input
                                  id="state"
                                  className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:bg-white focus:border-[#be1800] transition-all font-bold"
                                  value={profile.state}
                                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                                  placeholder="State"
                                />
                              </div>
                              <div className="space-y-3">
                                <Label htmlFor="pincode" className="text-slate-400 font-bold uppercase text-xs tracking-widest ml-1">Postal Code</Label>
                                <Input
                                  id="pincode"
                                  className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:bg-white focus:border-[#be1800] transition-all font-bold"
                                  value={profile.pincode}
                                  onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                                  placeholder="000000"
                                />
                              </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 flex justify-end">
                              <Button
                                type="submit"
                                disabled={profileLoading}
                                className="bg-[#be1800] hover:bg-[#a01500] text-white px-12 h-12 font-black rounded-xl shadow-lg shadow-red-900/20 active:scale-[0.98] transition-all"
                              >
                                {profileLoading ? (
                                  <span className="flex items-center gap-2">
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                    Syncing Profile...
                                  </span>
                                ) : 'Save Identity Updates'}
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
