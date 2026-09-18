import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Trash2, ShoppingCart, ArrowRight, ArrowLeft, Package, ShieldCheck, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  const subtotal = getTotalAmount();
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl"
          >
            {/* Empty Cart Icon */}
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative mb-8"
            >
              <div
                className="bg-white rounded-full p-10 inline-block shadow-xl relative"
                style={{
                  boxShadow: '0 20px 60px rgba(0, 80, 129, 0.15)'
                }}
              >
                <div
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    background: 'linear-gradient(135deg, #005081 0%, #be1800 100%)'
                  }}
                ></div>
                <ShoppingCart className="h-32 w-32 text-gray-300 relative z-10" />
              </div>
              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg"
                style={{ border: '2px solid #005081' }}
              >
                <ShoppingBag className="h-6 w-6" style={{ color: '#005081' }} />
              </motion.div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Start building your order by exploring our premium steel products.<br />
                Quality materials for your construction needs.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 hover:bg-white text-base font-medium transition-all duration-300"
                  style={{
                    borderColor: '#005081',
                    color: '#005081'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#005081';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#005081';
                  }}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-white text-base font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                  style={{ backgroundColor: '#005081' }}
                >
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
            >
              {[
                { icon: ShieldCheck, title: "Secure Transactions", desc: "Your data is safe with us" },
                { icon: Package, title: "Quality Products", desc: "Premium steel materials" },
                { icon: ShoppingBag, title: "Easy Ordering", desc: "Simple checkout process" }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <feature.icon className="h-8 w-8 mb-3" style={{ color: '#005081' }} />
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header with Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/">
              <Button
                variant="ghost"
                className="mb-4 transition-colors"
                style={{ color: '#005081' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00508110'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="h-8 w-8" style={{ color: '#005081' }} />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Product Icon */}
                        <div
                          className="flex-shrink-0 rounded-lg p-4 w-fit"
                          style={{ backgroundColor: '#00508115' }}
                        >
                          <Package className="h-12 w-12" style={{ color: '#005081' }} />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">
                            Unit Price: ₹{item.price.toLocaleString()} per {item.unit}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Quantity:</label>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="h-9 w-9 p-0 transition-colors"
                                style={{
                                  borderColor: '#005081',
                                  color: '#005081'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#005081';
                                  e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'white';
                                  e.currentTarget.style.color = '#005081';
                                }}
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                step="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-20 text-center h-9"
                                style={{ borderColor: '#005081' }}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-9 w-9 p-0 transition-colors"
                                style={{
                                  borderColor: '#005081',
                                  color: '#005081'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#005081';
                                  e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'white';
                                  e.currentTarget.style.color = '#005081';
                                }}
                              >
                                +
                              </Button>
                              <span className="text-sm text-gray-600 ml-1">{item.unit}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:gap-3 pt-4 md:pt-0 border-t md:border-t-0">
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                            <p className="text-2xl font-bold" style={{ color: '#005081' }}>
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="transition-colors"
                            style={{ color: '#be1800' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#be180010'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-24"
              >
                <Card className="border-gray-200 shadow-lg">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>GST (18%)</span>
                        <span className="font-medium text-gray-900">₹{gst.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total</span>
                          <span className="text-2xl font-bold" style={{ color: '#005081' }}>
                            ₹{total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full text-white transition-all duration-300 hover:shadow-lg"
                      size="lg"
                      style={{ backgroundColor: '#005081' }}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    {/* Trust Badges */}
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        <span>Secure Checkout</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Package className="h-5 w-5" style={{ color: '#005081' }} />
                        <span>Fast & Reliable Delivery</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-4">
                  <Link to="/products">
                    <Button
                      variant="outline"
                      className="w-full transition-colors"
                      style={{
                        borderColor: '#005081',
                        color: '#005081'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#005081';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#005081';
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}