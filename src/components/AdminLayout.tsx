import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Hammer,
  Briefcase,
  FileText,
  MessageSquare,
  Newspaper,
  Recycle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/news', label: 'News & Insights', icon: Newspaper },
  { path: '/admin/fabrication', label: 'Fabrication Requests', icon: Hammer },
  { path: '/admin/recycling', label: 'Recycling Requests', icon: Recycle },
  { path: '/admin/careers', label: 'Jobs', icon: Briefcase },
  { path: '/admin/applications', label: 'Applications', icon: FileText },
  { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/pricing', label: 'Pricing Index', icon: TrendingUp },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadOrdersCount, setUnreadOrdersCount] = useState(0);
  const [unreadFabricationCount, setUnreadFabricationCount] = useState(0);
  const [unreadApplicationsCount, setUnreadApplicationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadRecyclingCount, setUnreadRecyclingCount] = useState(0);


  useEffect(() => {
    fetchUnreadOrdersCount();
    fetchUnreadFabricationCount();
    fetchUnreadApplicationsCount();
    fetchUnreadMessagesCount();
    fetchUnreadRecyclingCount();
  }, [location.pathname]);

  const fetchUnreadOrdersCount = async () => {
    // @ts-ignore
    // @ts-ignore
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      // @ts-ignore
      .eq('is_read', false); // Requires 'is_read' column in orders table

    if (!error) {
      setUnreadOrdersCount(count || 0);
    }
  };

  const fetchUnreadFabricationCount = async () => {
    // @ts-ignore
    // @ts-ignore
    const { count, error } = await supabase
      .from('fabrication_requests')
      .select('*', { count: 'exact', head: true })
      // @ts-ignore
      .eq('is_read', false);

    if (!error) {
      setUnreadFabricationCount(count || 0);
    }
  };

  const fetchUnreadApplicationsCount = async () => {
    const { count, error } = await supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true })
      // @ts-ignore
      .eq('is_read', false);

    if (!error) {
      setUnreadApplicationsCount(count || 0);
    }
  };

  const fetchUnreadMessagesCount = async () => {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      // @ts-ignore
      .eq('is_read', false);

    if (!error) {
      setUnreadMessagesCount(count || 0);
    }
  };

  const fetchUnreadRecyclingCount = async () => {
    const { count, error } = await (supabase as any)
      .from('recycling_requests')
      .select('*', { count: 'exact', head: true })
      .eq('admin_is_read', false);

    if (!error) {
      setUnreadRecyclingCount(count || 0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-steel">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -300 }}
        className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-40 overflow-y-auto"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-8">
            Lohakart Admin
          </h1>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isOrders = item.label === 'Orders';

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isOrders && unreadOrdersCount > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                        {unreadOrdersCount}
                      </Badge>
                    )}
                    {item.label === 'Fabrication Requests' && unreadFabricationCount > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                        {unreadFabricationCount}
                      </Badge>
                    )}
                    {item.label === 'Applications' && unreadApplicationsCount > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                        {unreadApplicationsCount}
                      </Badge>
                    )}
                    {item.label === 'Messages' && unreadMessagesCount > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                        {unreadMessagesCount}
                      </Badge>
                    )}
                    {item.label === 'Recycling Requests' && unreadRecyclingCount > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                        {unreadRecyclingCount}
                      </Badge>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-8 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
