import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
    Hammer,
    Ruler,
    FileCheck,
    Truck,
    Cog,
    Layers,
    ShieldCheck,
    Upload
} from 'lucide-react';

export default function Fabrication() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        company_name: '',
        message: '',
    });

    const uploadFile = async () => {
        if (!file) return null;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('fabrication-drawings')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Upload Error:', uploadError);
            throw new Error('Failed to upload file');
        }

        const { data } = supabase.storage
            .from('fabrication-drawings')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must be logged in to submit a fabrication request');
            navigate('/auth');
            return;
        }

        setLoading(true);

        try {
            let fileUrl = null;
            if (file) {
                fileUrl = await uploadFile();
            }

            // @ts-ignore
            const { error } = await supabase
                .from('fabrication_requests')
                .insert([
                    {
                        ...formData,
                        user_id: user.id,
                        file_url: fileUrl,
                        status: 'pending',
                        user_is_read: true
                    }
                ] as any);

            if (error) throw error;

            toast.success('Request submitted successfully! We will get back to you soon.');
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                company_name: '',
                message: '',
            });
            setFile(null);
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const services = [
        {
            title: 'Structural Steel Fabrication',
            description: 'Beams, columns, trusses, frames, and load-bearing structures with engineering precision.',
            icon: Layers
        },
        {
            title: 'Custom MS & SS Fabrication',
            description: 'Industrial equipment, supports, and enclosures tailored to your specific requirements.',
            icon: Cog
        },
        {
            title: 'Sheet Metal Fabrication',
            description: 'Precision cutting, bending, and assembly for panels, ducts, and cabinets.',
            icon: Ruler
        },
        {
            title: 'Heavy Industrial Fabrication',
            description: 'Large-scale components for factories, warehouses, and infrastructure projects.',
            icon: Hammer
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/metal-fabrication-services-b2b-lohakart.webp')] bg-cover bg-center opacity-35"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Precision Metal Fabrication
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-300 max-w-3xl mx-auto mb-8"
                    >
                        From structural fabrication to custom industrial components, we transform your drawings into reliable, low carbon engineered products.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Button size="lg" className="bg-[#be1800] hover:bg-[#a01500]" onClick={() => document.getElementById('rfq-form')?.scrollIntoView({ behavior: 'smooth' })}>
                            Request a Quote
                        </Button>
                    </motion.div>
                </div>
            </div>

            <main className="flex-1 bg-slate-50">
                {/* E-Manufacturing Network Intro */}
                <section className="py-16 bg-white border-b">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto"
                        >
                            <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-4 py-1">E-Manufacturing network</Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Fabrication & Processing</h2>
                            <p className="text-lg text-slate-600 leading-relaxed italic">
                                Utilize our E-manufacturing network for a streamlined production experience, enhancing the efficiency of your supply chain.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* New Specialized Services Grid */}
                <section className="py-20 container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "Heavy Industrial Fabrication",
                                desc: "Expert heavy industrial fabrication services for large-scale manufacturing and construction, provided by LohaKart.",
                                sub: "Precision-driven solutions for all heavy industrial fabrication needs.",
                                img: "/heavy-industrial-fabrication-services-lohakart.webp"
                            },
                            {
                                title: "Sheet Metal Fabrication",
                                desc: "High-precision sheet metal fabrication services for diverse industrial applications, offered by LohaKart.",
                                sub: "Expertly crafted solutions for precise sheet metal fabrication projects.",
                                img: "/sheet-metal-fabrication-services-lohakart.webp"
                            },
                            {
                                title: "Castings & Forgings",
                                desc: "Custom castings and forgings for manufacturing and industrial projects, provided by LohaKart’s expert team.",
                                sub: "Precise castings and Forgings services for tailored metal solutions.",
                                img: "/castings-forgings-metal-fabrication-lohakart.webp"
                            },
                            {
                                title: "Cut to Length",
                                desc: "Accurate cut-to-length metal processing for customized requirements, available at LohaKart.",
                                sub: "Providing accurate, customized metal cut-to-length services efficiently.",
                                img: "/cut-to-length-metal-services-lohakart.webp"
                            },
                            {
                                title: "Slitting",
                                desc: "Precision metal slitting services for tailored industrial and manufacturing needs, provided by LohaKart.",
                                sub: "Delivering precise, high-quality metal slitting for various applications.",
                                img: "/metal-slitting-services-lohakart.webp"
                            },
                            {
                                title: "Shearing, Bending & Rolling",
                                desc: "Professional shearing, bending, and rolling services for metal fabrication, available from LohaKart.",
                                sub: "Expert shearing, bending, and rolling for custom metal fabrication.",
                                img: "/shearing-bending-rolling-metal-fabrication-lohakart.webp"
                            },
                            {
                                title: "Laser Cutting & Welding",
                                desc: "Advanced laser cutting and welding services for precise and high-quality metal fabrication, offered by LohaKart.",
                                sub: "Precision laser cutting and welding for flawless metal fabrication.",
                                img: "/laser-cutting-welding-metal-services-lohakart.webp"
                            },
                            {
                                title: "CNC Machining & Job Works",
                                desc: "CNC machining and job work services for accurate and efficient metal processing, provided by LohaKart.",
                                sub: "Reliable CNC machining and job works for custom solutions.",
                                img: "/cnc-machining-job-works-lohakart.webp"
                            }
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative h-[400px] rounded-2xl overflow-hidden shadow-xl cursor-default"
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${service.img})` }}
                                ></div>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent group-hover:via-slate-900/60 transition-colors duration-300"></div>

                                {/* Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                    <div className="mb-2 w-10 h-1 bg-orange-500 transition-all duration-300 group-hover:w-20"></div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors">{service.title}</h3>
                                    <p className="text-sm text-slate-200 mb-4 line-clamp-3 opacity-90 group-hover:opacity-100 transition-opacity">
                                        {service.desc}
                                    </p>
                                    <div className="h-px bg-white/20 mb-4"></div>
                                    <p className="text-xs font-semibold text-orange-200 uppercase tracking-wider">
                                        {service.sub}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Capabilities Grid */}
                <section className="py-16 container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Capabilities</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            We deliver high-quality fabrication solutions across diverse industries using certified materials and modern techniques.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow border-slate-200">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                            <service.icon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                                        <CardDescription>{service.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Process Section */}
                <section className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Our Fabrication Process</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                { title: 'Analysis', desc: 'Requirement analysis based on drawings', icon: FileCheck },
                                { title: 'Fabrication', desc: 'Precision cutting, welding, and assembly', icon: Hammer },
                                { title: 'Quality Check', desc: 'Strict inspection for accuracy & strength', icon: ShieldCheck },
                                { title: 'Delivery', desc: 'Timely dispatch to your location', icon: Truck },
                            ].map((step, i) => (
                                <div key={i} className="text-center relative">
                                    <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-700">
                                        <step.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                                    <p className="text-slate-500 text-sm">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* RFQ Form Section */}
                <section id="rfq-form" className="py-16 container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <Card className="shadow-xl">
                            <CardHeader className="text-center bg-slate-900 text-white rounded-t-xl py-8">
                                <CardTitle className="text-2xl mb-2">Request a Fabrication Quote</CardTitle>
                                <CardDescription className="text-slate-300">
                                    Share your requirements and drawings. We'll get back to you with a detailed quote.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="full_name">Full Name *</Label>
                                            <Input
                                                id="full_name"
                                                required
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company_name">Company Name</Label>
                                            <Input
                                                id="company_name"
                                                value={formData.company_name}
                                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Project Description *</Label>
                                        <Textarea
                                            id="message"
                                            required
                                            placeholder="Describe your requirement, material grade, dimensions, and quantity..."
                                            className="min-h-[120px]"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="drawing">Upload Drawing (PDF, Image, DXF)</Label>
                                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
                                            <Input
                                                id="drawing"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            />
                                            <Label htmlFor="drawing" className="cursor-pointer block">
                                                <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                                                <span className="text-blue-600 font-medium hover:underline">Click to upload</span>
                                                <span className="text-slate-500"> or drag and drop</span>
                                                {file && (
                                                    <div className="mt-2 text-sm font-semibold text-green-600">
                                                        Selected: {file.name}
                                                    </div>
                                                )}
                                            </Label>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full bg-[#be1800] hover:bg-[#a01500] text-lg py-6" disabled={loading}>
                                        {loading ? 'Submitting Request...' : 'Submit Request'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
