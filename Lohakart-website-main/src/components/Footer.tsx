import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUp, FileText, HelpCircle, Linkedin, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll to top when link is clicked
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // WhatsApp message handler
  const handleWhatsAppClick = () => {
    const phoneNumber = '919580002078'; // WhatsApp number without + and spaces
    const message = encodeURIComponent('Hello! I would like to inquire about Lohakart services.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const quickLinks = [
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About Us' },
    { to: '/news', label: 'Insights & News' },
    { to: '/careers', label: 'Career' },
  ];

  const services = [
    { to: '/products', label: 'Procurement Intelligence' },
    { to: '/services/carbon-accounting', label: 'Carbon Intelligence' },
    { to: '/services/fabrication', label: 'E - Factory Fabrication' },
    { to: '/services/recycling', label: 'Plant Intelligence' },
    { to: '/pricing', label: 'Market Intelligence' },
    { to: '/contact', label: 'AI Optimization' },
  ];

  return (
    <>
      <footer className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-slate-300 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#005081] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#be1800] rounded-full blur-3xl"></div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Company Info - Larger Column */}
            <div className="lg:col-span-4">
              <div className="mb-6">
                <img
                  src="/logo.png"
                  alt="Lohakart Logo"
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </div>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
                Leading B2B metal procurement platform providing low carbon, sustainable solutions for industrial needs across India.
              </p>
              <div className="space-y-4 text-slate-400 text-sm">
                {/* Address with Icon */}
                <div className="flex gap-3 group">
                  <MapPin className="h-5 w-5 text-[#be1800] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <p className="leading-relaxed">
                    <span className="font-semibold text-slate-300">INDIIUM VENTURES PRIVATE LIMITED</span><br />
                    Levana Cyber Heights 10th Floor, TCG 2/2 & 5/5,<br />
                    Vibhuti Khand, Gomti Nagar, Lucknow (U.P.) 226010
                  </p>
                </div>

                {/* Phone Numbers with Icon */}
                <div className="flex gap-3 group">
                  <Phone className="h-5 w-5 text-[#be1800] flex-shrink-0 mt-0.5 group-hover:rotate-12 transition-transform" />
                  <div className="space-y-2">
                    <a
                      href="tel:+919580002078"
                      className="block hover:text-[#be1800] transition-colors font-medium"
                    >
                      +91-9580002078
                    </a>
                  </div>
                </div>

                {/* Email with Icon */}
                <div className="flex gap-3 group">
                  <Mail className="h-5 w-5 text-[#be1800] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <a
                    href="mailto:business@lohakart.com"
                    className="hover:text-[#be1800] transition-colors font-medium"
                  >
                    business@lohakart.com
                  </a>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">Services</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.to}>
                    <Link
                      to={service.to}
                      onClick={scrollToTop}
                      className="text-slate-400 hover:text-[#be1800] transition-colors inline-block text-sm md:text-base hover:translate-x-1 transition-transform duration-200"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={scrollToTop}
                      className="text-slate-400 hover:text-[#be1800] transition-colors inline-block text-sm md:text-base hover:translate-x-1 transition-transform duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/contact"
                    onClick={scrollToTop}
                    className="text-slate-400 hover:text-[#be1800] transition-colors inline-block text-sm md:text-base hover:translate-x-1 transition-transform duration-200"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect with Lohakart - WhatsApp CTA */}
            <div className="lg:col-span-4">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 hover:border-[#005081]/50 transition-all duration-300 shadow-xl">
                <h4 className="text-white font-bold text-lg md:text-xl mb-3 md:mb-4">Connect with Lohakart</h4>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                  Explore how LohaKart can simplify your business processes, allowing you to concentrate solely on growth and success.
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold px-6 py-3 md:py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                >
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                  <span className="text-sm md:text-base">Chat on WhatsApp</span>
                </button>
                <p className="text-xs text-slate-400 mt-3 text-center">Quick response • Available Mon-Sat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 relative z-10">
          <div className="container mx-auto px-4 py-5 md:py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <p className="text-slate-400 text-xs md:text-sm text-center md:text-left">
                © {currentYear} Lohakart. All rights reserved.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3 md:gap-4">
                <a
                  href="https://www.linkedin.com/company/lohakart/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-800/80 hover:bg-[#005081] flex items-center justify-center transition-all hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
                </a>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-800/80 hover:bg-[#25D366] flex items-center justify-center transition-all hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>

              {/* Additional Links */}
              <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
                <Link
                  to="/terms"
                  onClick={scrollToTop}
                  className="text-slate-400 hover:text-[#be1800] transition-colors"
                >
                  Terms & Condition
                </Link>
                <span className="text-slate-600">|</span>
                <Link
                  to="/privacy"
                  onClick={scrollToTop}
                  className="text-slate-400 hover:text-[#be1800] transition-colors"
                >
                  Privacy Policy
                </Link>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="text-slate-400 hover:text-[#be1800] transition-colors"
                >
                  Need Help?
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#be1800] to-[#a01500] hover:from-[#a01500] hover:to-[#8a1200] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5 md:h-6 md:w-6 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}

      {/* Terms & Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#005081]/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#005081]" />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900">Terms & Conditions</DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 text-sm">
              Last updated: January 2025
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">1. Acceptance of Terms</h3>
              <p>
                By accessing and using Lohakart's services, you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">2. Use of Services</h3>
              <p>
                Lohakart provides B2B metal procurement, fabrication, and recycling services. You agree to use our services only for
                lawful purposes and in accordance with these Terms. You are responsible for ensuring that your use of the services
                complies with all applicable laws and regulations.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">3. Account Registration</h3>
              <p>
                To access certain features, you may be required to register for an account. You agree to provide accurate, current,
                and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">4. Pricing and Payment</h3>
              <p>
                All prices are subject to change without notice. Prices displayed are indicative and may vary based on order quantity,
                delivery location, and market conditions. Payment terms will be specified in individual purchase orders or agreements.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">5. Product Quality</h3>
              <p>
                We ensure all products meet industry standards and specifications. However, Lohakart reserves the right to make changes
                to products and services without prior notice. All products are subject to availability.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">6. Intellectual Property</h3>
              <p>
                All content, trademarks, and data on this website, including but not limited to software, databases, text, graphics,
                icons, and hyperlinks, are the property of or licensed to Lohakart and are protected by law.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">7. Limitation of Liability</h3>
              <p>
                Lohakart shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from
                your access to or use of, or inability to access or use, the services.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">8. Modifications to Terms</h3>
              <p>
                Lohakart reserves the right to modify these terms at any time. Continued use of the services after any such changes
                shall constitute your consent to such changes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">9. Contact Information</h3>
              <p>
                For any questions regarding these Terms & Conditions, please contact us at business@lohakart.com or call us at
                +91-9580002078.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Need Help Modal */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-green-600" />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900">Need Help?</DialogTitle>
            </div>
            <DialogDescription className="text-slate-600">
              Our support team is here to assist you. Reach out through any of the following channels.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {/* WhatsApp */}
            <div
              onClick={handleWhatsAppClick}
              className="bg-green-50 rounded-xl p-5 hover:bg-green-100 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Chat on WhatsApp</h4>
                  <p className="text-sm text-slate-700 font-medium">+91-9580002078</p>
                  <p className="text-xs text-slate-500 mt-2">Instant response • Click to chat</p>
                </div>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="bg-slate-50 rounded-xl p-5 hover:bg-slate-100 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#005081] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Call Us</h4>
                  <div className="space-y-2">
                    <a
                      href="tel:+919580002078"
                      className="block text-sm text-slate-700 hover:text-[#005081] transition-colors font-medium"
                    >
                      +91-9580002078
                    </a>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Mon-Sat, 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-slate-50 rounded-xl p-5 hover:bg-slate-100 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#be1800] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Email Us</h4>
                  <a
                    href="mailto:business@lohakart.com"
                    className="block text-sm text-slate-700 hover:text-[#be1800] transition-colors font-medium"
                  >
                    business@lohakart.com
                  </a>
                  <p className="text-xs text-slate-500 mt-2">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-slate-50 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Visit Us</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Levana Cyber Heights 10th Floor,<br />
                    TCG 2/2 & 5/5, Vibhuti Khand,<br />
                    Gomti Nagar, Lucknow (U.P.) 226010
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}