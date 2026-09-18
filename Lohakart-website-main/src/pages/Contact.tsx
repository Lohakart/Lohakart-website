import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Clock, Headphones, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }).max(100),
  email: z.string().trim().email({ message: 'Invalid email address' }).max(255),
  message: z.string().trim().min(10, { message: 'Message must be at least 10 characters' }).max(1000),
});

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      contactSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setLoading(true);
    const { error } = await supabase
      .from('contact_messages')
      .insert([formData]);

    setLoading(false);

    if (error) {
      toast.error('Failed to send message. Please try again.');
    } else {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="py-16 md:py-24 text-center px-4 relative overflow-hidden" style={{ backgroundColor: '#005081' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, #be1800 0%, transparent 70%)' }}></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, #be1800 0%, transparent 70%)' }}></div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto relative z-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-4">
              Contact Us
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Ready to start your project? Our team of steel experts is here to assist you with quotes, specifications, and logistics.
            </p>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Phone Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-white hover:shadow-xl transition-all border border-gray-200 rounded-2xl overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300" style={{ backgroundColor: '#00508115' }}>
                      <Phone className="h-7 w-7" style={{ color: '#005081' }} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Phone Number</h3>
                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Mon-Sat, 9 AM - 6 PM
                    </p>
                    <div className="space-y-2">
                      <a href="tel:+919580002078" className="block font-semibold text-base hover:underline transition-colors" style={{ color: '#005081' }}>
                        +91-9580002078
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white hover:shadow-xl transition-all border border-gray-200 rounded-2xl overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300" style={{ backgroundColor: '#be180015' }}>
                      <Mail className="h-7 w-7" style={{ color: '#be1800' }} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-500 text-sm mb-4">For all written queries</p>
                    <a href="mailto:business@lohakart.com" className="font-semibold text-base hover:underline break-all transition-colors" style={{ color: '#be1800' }}>
                      business@lohakart.com
                    </a>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Address Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white hover:shadow-xl transition-all border border-gray-200 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300" style={{ backgroundColor: '#00508115' }}>
                      <MapPin className="h-7 w-7" style={{ color: '#005081' }} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3">Corporate Office</h3>
                    <p className="text-gray-700 font-semibold mb-2">INDIIUM VENTURES PRIVATE LIMITED</p>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      Levana Cyber Heights 10th Floor,<br />
                      TCG 2/2 & 5/5, Vibhuti Khand,<br />
                      Gomti Nagar, Lucknow (U.P.) 226010
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Support Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl text-center" style={{ backgroundColor: '#00508110' }}
              >
                <Headphones className="h-10 w-10 mx-auto mb-3" style={{ color: '#005081' }} />
                <h4 className="font-bold text-gray-900 mb-2">24/7 Support Available</h4>
                <p className="text-sm text-gray-600">Our team is always ready to help you</p>
              </motion.div>
            </div>

            {/* Contact Form & Map */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardContent className="p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: '#005081' }}>
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Send Us a Message</h2>
                        <p className="text-gray-600 text-sm">We'll respond within 24 hours</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base font-semibold text-gray-700">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="h-12 bg-gray-50 border-gray-300 focus:border-[#005081] focus:ring-[#005081] transition-all rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-semibold text-gray-700">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-12 bg-gray-50 border-gray-300 focus:border-[#005081] focus:ring-[#005081] transition-all rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-base font-semibold text-gray-700">Your Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your requirements, project details, or any questions you have..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={6}
                          required
                          className="bg-gray-50 border-gray-300 focus:border-[#005081] focus:ring-[#005081] transition-all resize-none rounded-lg"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl rounded-xl"
                        style={{ backgroundColor: '#005081' }}
                        disabled={loading}
                        onMouseEnter={(e) => {
                          if (!loading) e.currentTarget.style.backgroundColor = '#be1800';
                        }}
                        onMouseLeave={(e) => {
                          if (!loading) e.currentTarget.style.backgroundColor = '#005081';
                        }}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Send Message
                            <Send className="h-5 w-5" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-[400px] w-full">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.448558742878!2d81.002!3d26.855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDUxJzE4LjAiTiA4McKwMDAnMDcuMiJF!5e0!3m2!1sen!2sin!4v1635764000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Office Location"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="py-16 md:py-20" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Have Questions About Our Products?
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Explore our comprehensive catalog or speak with our experts to find the perfect solution
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/products">
                  <Button 
                    size="lg" 
                    className="text-white h-12 px-8 rounded-xl font-semibold shadow-lg transition-all"
                    style={{ backgroundColor: '#005081' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#be1800'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#005081'}
                  >
                    Browse Products
                  </Button>
                </a>
                <a href="tel:+919580002078">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="h-12 px-8 rounded-xl font-semibold border-2 transition-all"
                    style={{ 
                      borderColor: '#005081',
                      color: '#005081'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#005081';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#005081';
                    }}
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}