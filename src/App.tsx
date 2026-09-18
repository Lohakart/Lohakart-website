import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import PricingIndex from "./pages/PricingIndex";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminRecycling from "./pages/admin/AdminRecycling";
import AdminSettings from "./pages/admin/AdminSettings";
import Fabrication from "./pages/Fabrication";
import AdminFabrication from "./pages/admin/AdminFabrication";
import AdminCareers from "./pages/admin/AdminCareers";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminMessages from "./pages/admin/AdminMessages";
import CarbonAccounting from "./pages/CarbonAccounting";
import Recycling from "./pages/Recycling";
import Careers from "./pages/Careers";
import News from "./pages/News";
import Article from "./pages/Article";
import VisionMission from "./pages/VisionMission";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AdminNews from "./pages/admin/AdminNews";
import AdminEditArticle from "./pages/admin/AdminEditArticle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/pricing" element={<PricingIndex />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services/fabrication" element={<Fabrication />} />
              <Route path="/services/carbon-accounting" element={<CarbonAccounting />} />
              <Route path="/services/recycling" element={<Recycling />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<Article />} />
              <Route path="/vision-mission" element={<VisionMission />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/pricing" element={<AdminRoute><AdminPricing /></AdminRoute>} />
              <Route path="/admin/fabrication" element={<AdminRoute><AdminFabrication /></AdminRoute>} />
              <Route path="/admin/careers" element={<AdminRoute><AdminCareers /></AdminRoute>} />
              <Route path="/admin/applications" element={<AdminRoute><AdminApplications /></AdminRoute>} />
              <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
              <Route path="/admin/news" element={<AdminRoute><AdminNews /></AdminRoute>} />
              <Route path="/admin/news/new" element={<AdminRoute><AdminEditArticle /></AdminRoute>} />
              <Route path="/admin/news/:id" element={<AdminRoute><AdminEditArticle /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
              <Route path="/admin/recycling" element={<AdminRoute><AdminRecycling /></AdminRoute>} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
