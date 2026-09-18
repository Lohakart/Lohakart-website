import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart, ChevronDown, Cpu, Factory, FileText, Hammer, Leaf, Recycle, Search, ShoppingCart, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
  const { user, isAdmin } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchUnreadCounts();
    }

    const handleUpdate = () => fetchUnreadCounts();
    window.addEventListener('notificationsUpdated', handleUpdate);
    return () => window.removeEventListener('notificationsUpdated', handleUpdate);
  }, [user]);

  const fetchUnreadCounts = async () => {
    try {
      const [ordersRes, fabRes, recRes] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact' }).eq('user_id', user!.id).eq('user_is_read', false),
        supabase.from('fabrication_requests').select('id', { count: 'exact' }).eq('user_id', user!.id).eq('user_is_read', false),
        (supabase as any).from('recycling_requests').select('id', { count: 'exact' }).eq('user_id', user!.id).eq('user_is_read', false)
      ]);

      const count = (ordersRes.count || 0) + (fabRes.count || 0) + (recRes.count || 0);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
      scrollToTop();
    }
  };

  const handleBrochureDownload = () => {
    // Path to your brochure PDF file in the public folder
    const brochurePath = '/Lohakart%20Brochure.pdf';

    // Open the PDF in a new tab first
    const newWindow = window.open(brochurePath, '_blank');

    // Then trigger download after a short delay
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = brochurePath;
      link.download = 'Lohakart Brochure.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500);
  };

  const serviceItems = [
    { to: '/products', label: 'Procurement Intelligence', icon: ShoppingCart },
    { to: '/services/carbon-accounting', label: 'Carbon Intelligence', icon: Leaf },
    { to: '/services/fabrication', label: 'E - Factory Fabrication', icon: Hammer },
    { to: '/services/recycling', label: 'Plant Intelligence', icon: Factory },
    { to: '/pricing', label: 'Market Intelligence', icon: BarChart },
    { to: '/contact', label: 'AI Optimization', icon: Cpu },
  ];

  const navLinks = [
    { to: '/products', label: 'Products' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/news', label: 'News' },
    { to: '/vision-mission', label: 'Our Vision' },
    { to: '/contact', label: 'Contact Us' },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100"
        style={{ position: 'fixed', top: 0, left: 0, right: 0 }}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0" onClick={scrollToTop}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center"
              >
                <img
                  src="/logo.png"
                  alt="Lohakart Logo"
                  className="h-auto w-60 object-contain"
                  style={{ width: '15rem' }}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-1 flex-1 justify-center max-w-4xl">
              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  className="px-3 py-2 text-gray-600 hover:text-[#be1800] rounded-lg transition-all font-medium flex items-center gap-1 relative group whitespace-nowrap"
                >
                  Services
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#be1800] transition-all duration-300 group-hover:w-full"></span>
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                    >
                      <div className="py-2">
                        {serviceItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={item.to + item.label}
                              to={item.to}
                              onClick={scrollToTop}
                              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-slate-50 hover:text-[#be1800] transition-colors font-medium"
                            >
                              <IconComponent className="h-4 w-4 flex-shrink-0" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Regular Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={scrollToTop}
                  className="px-3 py-2 text-gray-600 hover:text-[#be1800] rounded-lg transition-all font-medium relative group whitespace-nowrap"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#be1800] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <div className="relative w-52 xl:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 h-11 border-slate-300 focus:border-black focus:ring-2 focus:ring-black/20 rounded-lg"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Brochure Button - Desktop */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBrochureDownload}
                className="hidden lg:flex relative hover:bg-slate-100 h-11 w-11 rounded-lg group"
              >
                <FileText className="h-5 w-5 text-gray-600 group-hover:text-[#be1800] transition-colors" />
              </Button>

              {/* Cart Button */}
              <Link to="/cart" onClick={scrollToTop}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-slate-100 h-11 w-11 rounded-lg group"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-[#be1800] transition-colors" />
                  {getItemCount() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#005081] text-xs flex items-center justify-center text-white font-semibold shadow-lg"
                    >
                      {getItemCount()}
                    </motion.span>
                  )}
                </Button>
              </Link>

              {/* User Button - Desktop */}
              {user ? (
                <Link to={isAdmin ? '/admin' : '/dashboard'} className="hidden lg:block" onClick={scrollToTop}>
                  <Button variant="outline" className="border-slate-300 hover:bg-slate-50 h-11 px-4 rounded-lg text-gray-600 hover:text-[#be1800] relative whitespace-nowrap transition-colors">
                    <User className="h-4 w-4 mr-2" />
                    {isAdmin ? 'Admin' : 'Dashboard'}
                    {!isAdmin && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                        <span className="h-2 w-2 bg-destructive rounded-full" />
                      </span>
                    )}
                  </Button>
                </Link>
              ) : (
                <Link to="/auth" className="hidden lg:block" onClick={scrollToTop}>
                  <Button className="bg-[#005081] hover:bg-[#be1800] text-white h-11 px-5 rounded-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap">
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden hover:bg-slate-100 p-2.5 rounded-lg transition-colors relative w-10 h-10 flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span
                    className={`block h-0.5 w-full bg-gray-600 transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                      }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-gray-600 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                      }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-gray-600 transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                      }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu Backdrop */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 xl:hidden z-40 top-20"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Mobile Menu Slide */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-20 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl xl:hidden overflow-y-auto z-50 border-r border-slate-200"
              >
                <div className="py-6 space-y-2 px-4">
                  {/* Mobile Search */}
                  <div className="pb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10 pr-4 h-11 border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Mobile Services */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-slate-50 hover:text-[#be1800] rounded-lg transition-colors font-medium"
                    >
                      Services
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileServicesOpen && (
                      <div className="pl-4 space-y-1">
                        {serviceItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={item.to + item.label}
                              to={item.to}
                              className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-slate-50 hover:text-[#be1800] rounded-lg transition-colors font-medium"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileServicesOpen(false);
                                scrollToTop();
                              }}
                            >
                              <IconComponent className="h-4 w-4 flex-shrink-0" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Mobile Nav Links */}
                  <div className="pt-2 space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block px-4 py-3 text-gray-600 hover:bg-slate-50 hover:text-[#be1800] rounded-lg transition-colors font-medium"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          scrollToTop();
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Actions */}
                  <div className="pt-6 border-t border-slate-200 space-y-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleBrochureDownload();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start border-slate-300 h-11 text-gray-600 hover:text-[#be1800] transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download Brochure
                    </Button>

                    <div className="h-3"></div>

                    {user ? (
                      <Link
                        to={isAdmin ? '/admin' : '/dashboard'}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          scrollToTop();
                        }}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start border-slate-300 h-11 text-gray-600 hover:text-[#be1800] relative transition-colors"
                        >
                          <User className="h-4 w-4 mr-2" />
                          {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                          {!isAdmin && unreadCount > 0 && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/auth" onClick={() => {
                        setMobileMenuOpen(false);
                        scrollToTop();
                      }}>
                        <Button className="w-full bg-[#005081] hover:bg-[#be1800] text-white h-11 shadow-sm transition-colors">
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20"></div>
    </>
  );
}