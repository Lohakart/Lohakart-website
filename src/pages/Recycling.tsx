import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
    Recycle,
    ArrowRight,
    ChevronRight,
    BarChart3,
    Factory,
    Leaf,
    Zap,
    ShieldCheck,
    Globe,
    TrendingUp,
    Settings,
    Truck,
    Droplets,
    Container,
    Flame,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    Hammer,
    Plane,
    Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function Recycling() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        metal_type: '',
        estimated_quantity: '',
        location: '',
        description: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please sign in to submit a recycling request.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            const { error } = await (supabase as any)
                .from('recycling_requests')
                .insert([
                    {
                        ...formData,
                        user_id: user.id,
                        status: 'Pending',
                        admin_is_read: false
                    }
                ]);

            if (error) throw error;

            toast({
                title: "Request Submitted Successfully",
                description: "Our recycling experts will review your request and contact you soon.",
            });
            setIsFormOpen(false);
            setFormData({
                company_name: '',
                contact_person: '',
                email: '',
                phone: '',
                metal_type: '',
                estimated_quantity: '',
                location: '',
                description: ''
            });
        } catch (error: any) {
            toast({
                title: "Submission Failed",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const recyclingProcess = [
        {
            icon: Container,
            title: "Collection & Sorting",
            description: "Strategic collection networks and advanced sensor-based sorting to categorize various metal alloys."
        },
        {
            icon: Settings,
            title: "Processing & Cleaning",
            description: "Removing contaminants and coatings through eco-friendly chemical and mechanical processes."
        },
        {
            icon: Hammer,
            title: "Shredding & Compacting",
            description: "Reducing large metal components into small, high-density pieces for efficient melting."
        },
        {
            icon: Flame,
            title: "Melting & Purification",
            description: "Energy-efficient furnace melting at precise temperatures to ensure maximum purity of the secondary metal."
        },
        {
            icon: Droplets,
            title: "Solidification",
            description: "Casting into standard industrial shapes like ingots or billets ready for remanufacturing."
        },
        {
            icon: ShieldCheck,
            title: "Quality Assurance",
            description: "Rigorous testing to ensure recycled metal meets or exceeds virgin material specifications."
        }
    ];

    const materials = [
        {
            name: "Ferrous Metals",
            desc: "Industrial steel scrap, heavy machinery parts, and structural beams.",
            recovery: 98,
            savings: 75,
            icon: Factory
        },
        {
            name: "Aluminum",
            desc: "Aerospace scrap, engine blocks, and industrial structural elements.",
            recovery: 95,
            savings: 95,
            icon: Plane
        },
        {
            name: "Copper & Brass",
            desc: "Electrical wiring, plumbing fixtures, and precision components.",
            recovery: 90,
            savings: 85,
            icon: Zap
        },
        {
            name: "Stainless Steel",
            desc: "High-grade medical, industrial, and food-grade scrap.",
            recovery: 92,
            savings: 70,
            icon: ShieldCheck
        }
    ];

    const metrics = [
        { label: "Tons Recycled Annually", value: "15,000+", icon: Container },
        { label: "Reduction in CO₂ Emissions", value: "60%", icon: Leaf },
        { label: "Energy Saved vs. Virgin", value: "85%", icon: Zap },
        { label: "Business Partners", value: "50+", icon: Users }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main>
                {/* HERO SECTION */}
                <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center bg-slate-950 overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-40">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
                        <img
                            src="/metal-recycling-solutions-b2b-lohakart.webp"
                            className="w-full h-full object-cover"
                            alt="Recycling Facility"
                        />
                    </div>

                    <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 py-16 md:py-20 lg:py-24">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-3xl"
                        >
                            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs md:text-sm font-bold uppercase tracking-wider mb-4 md:mb-6">
                                <Recycle className="w-3 h-3 md:w-4 md:h-4" />
                                Sustainability Leadership
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tight leading-tight">
                                Sustainable Metal <br />
                                <span className="text-green-500">Recycling Solutions</span>
                            </h1>
                            <p className="text-base md:text-lg lg:text-xl text-slate-300 leading-relaxed mb-6 md:mb-8 max-w-2xl">
                                Lohakart is redefining metal recycling through innovation and technology, driving a circular economy for metals while cutting environmental impact.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                                    <DialogTrigger asChild>
                                        <Button 
                                            size="lg" 
                                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-bold rounded-xl shadow-2xl transition-all hover:scale-105"
                                        >
                                            Request for Recycling <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-[95vw] sm:max-w-[600px] bg-white rounded-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh]">
                                        <DialogHeader className="mb-6">
                                            <DialogTitle className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Recycling Request</DialogTitle>
                                            <DialogDescription className="text-sm md:text-base text-slate-500">
                                                Please provide your industrial scrap details. Our experts will contact you for valuation and logistics.
                                            </DialogDescription>
                                        </DialogHeader>

                                        {!user ? (
                                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-[#be1800] mx-auto mb-4" />
                                                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">Authentication Required</h3>
                                                <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 px-4">You must be signed in to submit a recycling request.</p>
                                                <Link to="/auth">
                                                    <Button className="bg-[#005081] hover:bg-[#be1800] transition-colors text-sm md:text-base">Sign In Now</Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs md:text-sm font-bold text-slate-700">Company Name</label>
                                                        <Input name="company_name" value={formData.company_name} onChange={handleInputChange} required className="rounded-xl border-slate-200 h-10 md:h-11 text-sm md:text-base" placeholder="e.g. Acme Steels" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs md:text-sm font-bold text-slate-700">Contact Person</label>
                                                        <Input name="contact_person" value={formData.contact_person} onChange={handleInputChange} required className="rounded-xl border-slate-200 h-10 md:h-11 text-sm md:text-base" placeholder="John Doe" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs md:text-sm font-bold text-slate-700">Business Email</label>
                                                        <Input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="rounded-xl border-slate-200 h-10 md:h-11 text-sm md:text-base" placeholder="john@company.com" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs md:text-sm font-bold text-slate-700">Phone Number</label>
                                                        <Input name="phone" value={formData.phone} onChange={handleInputChange} required className="rounded-xl border-slate-200 h-10 md:h-11 text-sm md:text-base" placeholder="+91 ..." />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs md:text-sm font-bold text-slate-700">Metal Type</label>
                                                        <Input name="metal_type" value={formData.metal_type} onChange={handleInputChange} required className="rounded-xl border-slate-200 h-10 md:h-11 text-sm md:text-base" placeholder="e.g. HMS, Aluminum" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs md:text-sm font-bold text-slate-700">Estimated Quantity</label>
                                                        <Input name="estimated_quantity" value={formData.estimated_quantity} onChange={handleInputChange} required className="rounded-xl border-slate-200 h-10 md:h-11 text-sm md:text-base" placeholder="e.g. 50 Tons" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs md:text-sm font-bold text-slate-700">Pickup Location</label>
                                                    <Input name="location" value={formData.location} onChange={handleInputChange} required className="rounded-xl border-slate-200 h-10 md:h-11 text-sm md:text-base" placeholder="City, State" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs md:text-sm font-bold text-slate-700">Description / Specifications</label>
                                                    <Textarea name="description" value={formData.description} onChange={handleInputChange} className="rounded-xl border-slate-200 min-h-[100px] text-sm md:text-base" placeholder="Briefly describe the condition and type of scrap..." />
                                                </div>
                                                <Button type="submit" disabled={loading} className="w-full h-11 md:h-12 bg-green-600 hover:bg-green-700 rounded-xl text-sm md:text-base font-bold">
                                                    {loading ? "Submitting..." : "Submit Request"}
                                                </Button>
                                            </form>
                                        )}
                                    </DialogContent>
                                </Dialog>

                                <Link to="/contact" className="w-full sm:w-auto">
                                    <Button 
                                        size="lg" 
                                        variant="outline" 
                                        className="w-full border-2 border-white/40 hover:bg-white/10 h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-bold rounded-xl backdrop-blur-md "
                                    >
                                        Talk to Expert
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* RECYCLING PROCESS */}
                <section className="py-16 md:py-20 lg:py-24 bg-white">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                            <span className="text-green-600 font-bold tracking-widest text-xs md:text-sm uppercase mb-3 block">The Circular Path</span>
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">Our Recycling Process</h2>
                            <p className="text-sm md:text-base lg:text-lg text-slate-600">
                                At LohaKart, we employ an efficient, environmentally responsible process to recycle metals and minimize waste across the industrial supply chain.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {recyclingProcess.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative group p-6 md:p-8 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl"
                                >
                                    <div className="absolute -top-3 md:-top-4 -right-3 md:-right-4 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 text-sm md:text-base font-bold border-2 border-green-600 z-10">
                                        {idx + 1}
                                    </div>
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 md:mb-6 border border-white group-hover:bg-green-600 group-hover:text-white transition-colors duration-500 text-green-600">
                                        <step.icon className="w-6 h-6 md:w-7 md:h-7" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">{step.title}</h3>
                                    <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* MATERIALS GRID */}
                <section className="py-16 md:py-20 lg:py-24 bg-slate-50">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">Materials We Recycle</h2>
                            <div className="w-16 md:w-20 h-1 md:h-1.5 bg-green-500 mx-auto rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                            {materials.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                                >
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-green-600 border border-green-500/10 flex-shrink-0">
                                        <m.icon className="w-10 h-10 md:w-12 md:h-12" />
                                    </div>
                                    <div className="flex-1 space-y-4 text-center md:text-left">
                                        <div>
                                            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{m.name}</h3>
                                            <p className="text-sm md:text-base text-slate-500">{m.desc}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs md:text-sm font-bold uppercase text-slate-400">
                                                    <span>Recovery</span>
                                                    <span className="text-green-600">{m.recovery}%</span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${m.recovery}%` }}
                                                        className="h-full bg-green-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs md:text-sm font-bold uppercase text-slate-400">
                                                    <span>Saved</span>
                                                    <span className="text-blue-600">{m.savings}%</span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${m.savings}%` }}
                                                        className="h-full bg-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* IMPACT METRICS */}
                <section className="py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-green-500/5 rounded-full blur-[100px] -z-10" />
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Environmental Stewardship</h2>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                            {metrics.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-center space-y-3 md:space-y-4"
                                >
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3 md:mb-4">
                                        <m.icon className="w-7 h-7 md:w-8 md:h-8" />
                                    </div>
                                    <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">{m.value}</h4>
                                    <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wide">{m.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="py-16 md:py-24 lg:py-32 bg-slate-950 text-white relative overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <img
                            src="/stainless-steel-lohakart.webp"
                            className="w-full h-full object-cover"
                            alt="Sustainability Footer"
                        />
                    </div>

                    <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 tracking-tight leading-tight">
                                Ready to Transform Your <br />
                                <span className="text-green-500">Metal Waste?</span>
                            </h2>
                            <p className="text-sm md:text-base lg:text-lg text-slate-400 mb-8 md:mb-12 leading-relaxed">
                                Partner with LohaKart for sustainable, efficient, and profitable recycling solutions that drive your business toward a circular economy.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                                <Button
                                    onClick={() => setIsFormOpen(true)}
                                    size="lg"
                                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-bold rounded-xl shadow-2xl transition-all hover:scale-105"
                                >
                                    Request for Recycling <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                </Button>
                                <Link to="/contact" className="w-full sm:w-auto">
                                    <Button 
                                        size="lg" 
                                        variant="outline" 
                                        className="w-full border-2 border-white/40 text-black hover:bg-white/10 h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-bold rounded-xl backdrop-blur-md"
                                    >
                                        Contact Team
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}