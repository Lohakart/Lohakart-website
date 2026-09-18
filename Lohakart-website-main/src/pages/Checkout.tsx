import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Package, CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const { cart, clearCart, getTotalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const clean = (value: string) => value?.trim() || "";

  const generateFullAddress = () => {
    const parts = [
      clean(address.street),
      clean(address.city),
      clean(address.state),
    ].filter(Boolean);

    return `${parts.join(", ")}${address.pincode ? ` - ${clean(address.pincode)}` : ""}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fullAddress = generateFullAddress();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user!.id,
          total_amount: getTotalAmount() * 1.18,
          status: 'pending',
          shipping_address: fullAddress,
          user_is_read: true,
        }
      ])
      .select()
      .single();

    if (orderError || !order) {
      toast.error('Failed to place order');
      setLoading(false);
      return;
    }

    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    setLoading(false);

    if (itemsError) {
      toast.error('Failed to save order items');
    } else {
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/dashboard');
    }
  };

  const subtotal = getTotalAmount();
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header with Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/cart')}
              className="mb-4 hover:bg-[#005081]/10"
              style={{ color: '#005081' }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-8 w-8" style={{ color: '#005081' }} />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
            </div>
            <p className="text-gray-600">Complete your order details</p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#005081' }}>
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-900 hidden md:inline">Cart</span>
              </div>
              <div className="w-12 md:w-24 h-1" style={{ backgroundColor: '#005081' }}></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#005081' }}>
                  2
                </div>
                <span className="text-sm font-medium hidden md:inline" style={{ color: '#005081' }}>Checkout</span>
              </div>
              <div className="w-12 md:w-24 h-1 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  3
                </div>
                <span className="text-sm font-medium text-gray-500 hidden md:inline">Complete</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-gray-200 shadow-sm mb-6">
                  <CardHeader className="border-b border-gray-200 bg-white">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5" style={{ color: '#005081' }} />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <Label htmlFor="street" className="text-gray-700 font-medium">Street Address *</Label>
                        <Input
                          id="street"
                          value={address.street}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                          placeholder="Enter your street address"
                          required
                          className="mt-1.5 focus:ring-[#005081] focus:border-[#005081]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="city" className="text-gray-700 font-medium">City *</Label>
                          <Input
                            id="city"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            placeholder="City"
                            required
                            className="mt-1.5 focus:ring-[#005081] focus:border-[#005081]"
                          />
                        </div>

                        <div>
                          <Label htmlFor="state" className="text-gray-700 font-medium">State *</Label>
                          <Input
                            id="state"
                            value={address.state}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                            placeholder="State"
                            required
                            className="mt-1.5 focus:ring-[#005081] focus:border-[#005081]"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="pincode" className="text-gray-700 font-medium">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          placeholder="6-digit pincode"
                          required
                          className="mt-1.5 focus:ring-[#005081] focus:border-[#005081]"
                          maxLength={6}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full text-white hover:opacity-90"
                        size="lg"
                        disabled={loading}
                        style={{ backgroundColor: '#005081' }}
                      >
                        {loading ? 'Processing...' : 'Place Order'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-24"
              >
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader className="border-b border-gray-200 bg-white">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5" style={{ color: '#005081' }} />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    {/* Items List */}
                    <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-sm">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">
                              Qty: {item.quantity} {item.unit} × ₹{item.price.toLocaleString()}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>GST (18%)</span>
                        <span className="font-medium text-gray-900">₹{gst.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total</span>
                          <span className="text-2xl font-bold" style={{ color: '#005081' }}>
                            ₹{total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Important Note */}
                    <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#be1800' + '10', border: '1px solid #be1800' + '30' }}>
                      <p className="text-sm font-medium" style={{ color: '#be1800' }}>
                        Please review your order carefully before placing
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}