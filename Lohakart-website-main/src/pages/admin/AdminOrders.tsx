import { AdminLayout } from '@/components/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, MapPin, Package, User, Trash2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Profile {
  full_name: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  created_at: string;
  is_read: boolean;
  profiles?: Profile | null;
  order_items?: OrderItem[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
    markOrdersAsRead();
  }, []);

  const markOrdersAsRead = async () => {
    // Mark all unread orders as read
    const { error } = await supabase
      .from('orders')
      .update({ is_read: true })
      .eq('is_read', false); // Assume default is false

    if (error) {
      console.error('Error marking orders as read:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Order fetch error:", error);
        toast.error("Failed to load orders");
        setLoading(false);
        return;
      }

      const userIds = [...new Set(ordersData.map((o) => o.user_id))];

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

      const profileMap = Object.fromEntries(
        (profileData || []).map((p) => [p.id, p])
      );

      const mergedOrders = ordersData.map((order) => ({
        ...order,
        profiles: profileMap[order.user_id] || null,
      }));

      setOrders(mergedOrders);
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        user_is_read: false
      })
      .eq("id", orderId);

    if (!error) {
      toast.success("Order status updated");
      fetchOrders();
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (!error) {
      toast.success("Order deleted successfully");
      fetchOrders();
    } else {
      toast.error("Failed to delete order");
      console.error(error);
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    if (status === "delivered") return "default";
    if (status === "cancelled") return "destructive";
    return "secondary";
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
          <h1 className="text-4xl font-bold mb-2">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID or User Name..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {orders
            .filter((order) => {
              const query = searchQuery.toLowerCase().trim();
              if (!query) return true;

              const orderIdMatches = order.id.toLowerCase().includes(query) ||
                (`#${order.id.slice(0, 8)}`).toLowerCase().includes(query);
              const userNameMatches = order.profiles?.full_name?.toLowerCase().includes(query);

              return orderIdMatches || userNameMatches;
            })
            .map((order, index) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className={`hover:shadow-steel transition-all ${!order.is_read ? 'border-l-4 border-l-blue-500' : ''}`}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                          <Badge variant={getStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
                          {!order.is_read && (
                            <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v)}>
                          <SelectTrigger className="w-[160px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button variant="outline" onClick={() => { setSelectedOrder(order); setDialogOpen(true); }}>
                          View Details
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* Customer */}
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">{order.profiles?.full_name || "Unknown User"}</p>
                          <p className="text-sm text-muted-foreground">{order.profiles?.phone || "No phone"}</p>
                        </div>
                      </div>

                      {/* Shipping Address (Full Line) */}
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm">{order.shipping_address}</p>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-bold text-lg">₹{Number(order.total_amount).toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{order.order_items?.length || 0} items</p>
                        </div>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>

        {orders.length === 0 && (
          <Card className="p-12">
            <div className="text-center space-y-2">
              <Package className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">No Orders</h3>
            </div>
          </Card>
        )}
      </div>

      {/* DETAILS MODAL */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">

              {/* Customer Section */}
              <div>
                <h3 className="font-semibold mb-2">Customer Details</h3>
                <p><strong>Name:</strong> {selectedOrder.profiles?.full_name}</p>
                <p><strong>Phone:</strong> {selectedOrder.profiles?.phone}</p>
                <p><strong>Address:</strong> {selectedOrder.shipping_address}</p>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mt-6 mb-2">Items</h3>
                {selectedOrder.order_items?.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 flex justify-between">
                      <span>{item.product_name}</span>
                      <span>₹{item.price} × {item.quantity}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
