import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

// LOGIN validation
const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// SIGNUP validation (includes 10-digit phone)
const signupSchema = z.object({
  fullName: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().trim().email({ message: 'Invalid email address' }),
  phone: z.string().trim().regex(/^[0-9]{10}$/, { message: 'Phone number must be exactly 10 digits' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function Auth() {
  const { user, signIn, checkIsAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // redirect when user signs in
  useEffect(() => {
    if (user) {
      checkIsAdmin().then((isAdmin) => {
        navigate(isAdmin ? '/admin' : '/dashboard');
      });
    }
  }, [user, navigate, checkIsAdmin]);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');

  // Insert profile helper: upsert so it's idempotent
  const upsertProfile = async (userId: string, profileData: { full_name?: string; phone?: string; address?: string; city?: string; state?: string; pincode?: string; }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(
          { id: userId, ...profileData },
          { onConflict: 'id' }
        );

      if (error) {
        console.error('Profile upsert error:', error);
        return { ok: false, error };
      }

      return { ok: true };
    } catch (err) {
      console.error('Unexpected upsert error:', err);
      return { ok: false, error: err };
    }
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const u = session.user;
        try {
          const { data: existing, error: fetchErr } = await supabase.from('profiles').select('id').eq('id', u.id).maybeSingle();
          if (fetchErr) {
            console.error('Error checking existing profile:', fetchErr);
          } else if (!existing) {
            const meta = (u.user_metadata || {}) as any;
            const full_name = meta.full_name || meta.fullName || meta.name || '';
            const phone = meta.phone || meta.mobile || '';

            const res = await upsertProfile(u.id, { full_name, phone, address: '', city: '', state: '', pincode: '' });
            if (!res.ok) {
              console.error('Failed to create profile on SIGNED_IN:', res.error);
            }
          }
        } catch (err) {
          console.error('SIGNED_IN handler error:', err);
        }
      }
    });

    return () => sub?.subscription?.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginSchema.parse(loginForm);
    } catch (err) {
      if (err instanceof z.ZodError) return toast.error(err.errors[0].message);
    }

    setLoading(true);
    const { error } = await signIn(loginForm.email, loginForm.password);
    setLoading(false);

    if (error) toast.error(error.message || 'Failed to sign in');
    else toast.success('Signed in successfully!');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      signupSchema.parse(signupForm);
    } catch (err) {
      if (err instanceof z.ZodError) return toast.error(err.errors[0].message);
    }

    setLoading(true);

    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: signupForm.email,
      password: signupForm.password,
      options: {
        data: {
          full_name: signupForm.fullName,
          phone: signupForm.phone,
        },
      }
    });

    if (signUpErr) {
      setLoading(false);
      toast.error(signUpErr.message || 'Failed to sign up');
      return;
    }

    const userId = data?.user?.id;
    if (userId) {
      const { ok, error } = await upsertProfile(userId, {
        full_name: signupForm.fullName,
        phone: signupForm.phone,
        address: '',
        city: '',
        state: '',
        pincode: '',
      });

      setLoading(false);

      if (!ok) {
        toast.error('Account created but failed to save profile data.');
        return;
      }

      toast.success('Account created and profile saved! Please login.');
      setSignupForm({ fullName: '', email: '', phone: '', password: '' });
      return;
    }

    setLoading(false);
    toast.success('Check your email to confirm your account.');
    setSignupForm({ fullName: '', email: '', phone: '', password: '' });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return toast.error('Please enter your email');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      if (error) throw error;
      toast.success('Password reset link sent!');
      setResetEmail('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 font-outfit">
      {/* Light Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDUwODEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaC0ydjJoMnYtMmgydi0yaC0yem0tMiAydi0ySDMydjJoMnptMC0ydjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        
        {/* Animated Light Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 -left-20 w-80 h-80 bg-[#be1800]/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#005081]/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link to="/">
          <Button variant="ghost" className="text-[#005081] hover:bg-[#005081]/10 group gap-2 px-4 transition-all duration-300 border border-[#005081]/20">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg z-10 px-4"
      >
        <Card className="bg-white border-slate-200 shadow-2xl overflow-hidden">
          <CardHeader className="text-center space-y-2 pb-8 pt-10 px-8 bg-gradient-to-br from-slate-50 to-blue-50">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-block mx-auto mb-4"
            >
              <div className="w-16 h-16 bg-[#be1800] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-3xl">L</span>
              </div>
            </motion.div>
            <CardTitle className="text-3xl md:text-4xl font-black text-[#005081] tracking-tight">
              LohaKart <span className="text-[#be1800]">Portal</span>
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Secure access to India's premier B2B industrial marketplace
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <Tabs defaultValue="login" className="space-y-8">
              <TabsList className="grid grid-cols-3 w-full bg-slate-100 p-1 rounded-xl border border-slate-200">
                <TabsTrigger value="login" className="data-[state=active]:bg-[#be1800] data-[state=active]:text-white rounded-lg transition-all duration-300">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-[#be1800] data-[state=active]:text-white rounded-lg transition-all duration-300">Register</TabsTrigger>
                <TabsTrigger value="forgot" className="data-[state=active]:bg-[#be1800] data-[state=active]:text-white rounded-lg transition-all duration-300">Reset</TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                {/* LOGIN */}
                <TabsContent value="login" className="mt-0">
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleLogin}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label className="text-slate-700 text-sm font-semibold uppercase tracking-wider ml-1">Corporate Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#be1800] transition-colors" />
                        <Input
                          type="email"
                          className="bg-white border-slate-300 text-slate-900 pl-11 h-12 focus:border-[#be1800] focus:ring-[#be1800]/20 transition-all"
                          placeholder="name@company.com"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 text-sm font-semibold uppercase tracking-wider ml-1">Secure Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#be1800] transition-colors" />
                        <Input
                          type={showLoginPassword ? "text" : "password"}
                          className="bg-white border-slate-300 text-slate-900 pl-11 pr-11 h-12 focus:border-[#be1800] focus:ring-[#be1800]/20 transition-all"
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#be1800] transition-colors"
                        >
                          {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#be1800] hover:bg-[#a01500] h-12 text-lg font-bold shadow-lg transition-all active:scale-[0.98]" disabled={loading}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                          Verifying...
                        </span>
                      ) : 'Secure Sign In'}
                    </Button>
                  </motion.form>
                </TabsContent>

                {/* SIGNUP */}
                <TabsContent value="signup" className="mt-0">
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSignup}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label className="text-slate-700 text-sm font-semibold uppercase tracking-wider ml-1">Full Name</Label>
                      <div className="relative group">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#be1800] transition-colors" />
                        <Input
                          className="bg-white border-slate-300 text-slate-900 pl-11 h-12 focus:border-[#be1800] focus:ring-[#be1800]/20 transition-all"
                          placeholder="John Doe"
                          value={signupForm.fullName}
                          onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 text-sm font-semibold uppercase tracking-wider ml-1">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#be1800] transition-colors" />
                        <Input
                          type="email"
                          className="bg-white border-slate-300 text-slate-900 pl-11 h-12 focus:border-[#be1800] focus:ring-[#be1800]/20 transition-all"
                          placeholder="j.doe@example.com"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 text-sm font-semibold uppercase tracking-wider ml-1">Phone Number</Label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#be1800] transition-colors" />
                        <Input
                          type="tel"
                          className="bg-white border-slate-300 text-slate-900 pl-11 h-12 focus:border-[#be1800] focus:ring-[#be1800]/20 transition-all"
                          placeholder="9876543210"
                          maxLength={10}
                          value={signupForm.phone}
                          onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 text-sm font-semibold uppercase tracking-wider ml-1">Choose Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#be1800] transition-colors" />
                        <Input
                          type={showSignupPassword ? "text" : "password"}
                          className="bg-white border-slate-300 text-slate-900 pl-11 pr-11 h-12 focus:border-[#be1800] focus:ring-[#be1800]/20 transition-all"
                          placeholder="Min. 6 characters"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#be1800] transition-colors"
                        >
                          {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#be1800] hover:bg-[#a01500] h-12 text-lg font-bold transition-all" disabled={loading}>
                      {loading ? 'Processing...' : 'Create Account'}
                    </Button>
                  </motion.form>
                </TabsContent>

                {/* RESET */}
                <TabsContent value="forgot" className="mt-0">
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleForgotPassword}
                    className="space-y-5"
                  >
                    <div className="bg-blue-50 border border-[#005081]/20 rounded-xl p-4 mb-4">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        Enter your registered email address below. If an account exists, we'll send a secure password reset link.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 text-sm font-semibold uppercase tracking-wider ml-1">Registered Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#be1800] transition-colors" />
                        <Input
                          type="email"
                          className="bg-white border-slate-300 text-slate-900 pl-11 h-12 focus:border-[#be1800] focus:ring-[#be1800]/20 transition-all"
                          placeholder="your@email.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-[#be1800] hover:bg-[#a01500] h-12 text-lg font-bold transition-all">
                      Send Secure Link
                    </Button>
                  </motion.form>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </CardContent>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600 font-medium tracking-wide">
              © 2025 INDIIUM VENTURES PVT LTD
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}