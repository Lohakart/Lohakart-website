import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BarChart3,
    ChevronRight,
    Cpu,
    Database,
    Factory,
    Globe,
    Heart,
    Leaf,
    RefreshCcw,
    ShieldCheck,
    Target,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VisionMission() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const coreValues = [
        {
            icon: Cpu,
            title: "Innovation at Core",
            description: "Driving the next generation of industrial intelligence through AI-integrated steel lifecycle management."
        },
        {
            icon: Leaf,
            title: "Sustainability First",
            description: "Pioneering the transition to carbon-neutral steel with real-time carbon accounting and green metal access."
        },
        {
            icon: ShieldCheck,
            title: "Integrity & Trust",
            description: "Building unshakeable foundations of transparency in every transaction across the global ecosystem."
        },
        {
            icon: Users,
            title: "Customer-Centricity",
            description: "Empowering our partners with tools that drive profitability, speed, and environmental stewardship."
        },
        {
            icon: TrendingUp,
            title: "Impact at Scale",
            description: "Delivering world-class solutions that transform local industries into global enterprise powerhouses."
        }
    ];

    const missionCards = [
        {
            icon: Database,
            title: "AI-Powered Steel Lifecycle",
            description: "Digitizing every stage from production to delivery using predictive analytics and smart routing."
        },
        {
            icon: Factory,
            title: "Green Steel Access",
            description: "Democratizing access to high-quality, sustainable steel through a transparent marketplace."
        },
        {
            icon: BarChart3,
            title: "Carbon Accounting",
            description: "Providing real-time visibility into the environmental impact of every gram of metal sourced."
        },
        {
            icon: Globe,
            title: "Transparent Marketplace",
            description: "A frictionless global platform for carbon-aware steel buying and recycling."
        },
        {
            icon: Zap,
            title: "Supply Chain Efficiency",
            description: "Optimizing the industrial flow to reduce waste, cost, and time-to-delivery."
        },
        {
            icon: RefreshCcw,
            title: "Carbon-Aware Ecosystem",
            description: "Fostering a circular economy where steel is reused and recycled with maximum efficiency."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main>
                {/* HERO SECTION */}
                <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-10 sm:top-20 right-0 w-48 h-48 sm:w-96 sm:h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #005081 0%, transparent 70%)' }}></div>
                        <div className="absolute bottom-10 sm:bottom-20 left-0 w-48 h-48 sm:w-96 sm:h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #be1800 0%, transparent 70%)' }}></div>
                    </div>

                    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span 
                                className="inline-block px-4 sm:px-6 py-2 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6 sm:mb-8 shadow-lg"
                                style={{ backgroundColor: '#005081' }}
                            >
                                Our Vision & Mission
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-6 sm:mb-8 tracking-tight leading-tight px-4">
                                Make every tonne of steel <br />
                                <span className="relative inline-block mt-2">
                                    <span style={{ color: '#005081' }}>more intelligent.</span>
                                    <div className="absolute bottom-1 sm:bottom-2 left-0 w-full h-3 sm:h-4 opacity-20" style={{ backgroundColor: '#be1800' }}></div>
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
                                Lohakart is building the intelligence layer for steel, connecting plant, market and supply-chain data to help businesses understand what is happening, what it means, and what to do next.
                            </p>
                            {/* Process Flow */}
                            <div className="mb-8 sm:mb-12 px-4">
                                <div className="inline-flex items-center flex-wrap justify-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-md text-xs sm:text-sm md:text-base font-semibold text-gray-800 tracking-wide">
                                    <span>Data</span>
                                    <span className="text-[#be1800] font-black text-sm sm:text-base">→</span>
                                    <span>Intelligence</span>
                                    <span className="text-[#be1800] font-black text-sm sm:text-base">→</span>
                                    <span>Decision</span>
                                    <span className="text-[#be1800] font-black text-sm sm:text-base">→</span>
                                    <span>Optimization</span>
                                    <span className="text-[#be1800] font-black text-sm sm:text-base">→</span>
                                    <span style={{ color: '#005081' }}>Execution</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
                                <Link to="/contact" className="w-full sm:w-auto">
                                    <Button 
                                        size="lg" 
                                        className="w-full sm:w-auto text-white min-w-[200px] text-base font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2"
                                        style={{ backgroundColor: '#005081', borderColor: '#005081' }}
                                    >
                                        Join Our Mission <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link to="/products" className="w-full sm:w-auto">
                                    <Button 
                                        size="lg" 
                                        className="w-full sm:w-auto bg-white hover:bg-[#005081] text-[#005081] hover:text-white min-w-[200px] text-base font-semibold transition-all border-2 shadow-md hover:shadow-xl"
                                        style={{ borderColor: '#005081' }}
                                    >
                                        Explore Products
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* OUR VISION */}
                <section className="py-16 sm:py-20 lg:py-24 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl" style={{ backgroundColor: '#00508115' }}>
                                        <Target className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: '#005081' }} />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide" style={{ color: '#005081' }}>Our Vision</h2>
                                </div>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                    Building the <span style={{ color: '#005081' }}>Future</span>
                                </h3>
                                <div className="p-5 sm:p-6 rounded-2xl bg-gray-50 border-l-4" style={{ borderColor: '#005081' }}>
                                    <div className="text-base sm:text-lg text-gray-700 leading-relaxed">
                                        <p className="mb-3 text-gray-800">
                                            Steel is becoming more complex — from procurement and production to energy, cost, materials and carbon.
                                        </p>
                                        <p className="font-bold text-gray-900 mb-2">
                                            Our long-term ambition is simple:
                                        </p>
                                        <p className="mb-3 text-gray-800">
                                            Make Lohakart the decision infrastructure running alongside every serious steel business.
                                        </p>
                                        <p className="font-bold mb-3" style={{ color: '#005081' }}>
                                            From steel commerce to steel intelligence. <br />
                                            From intelligence to execution.
                                        </p>
                                        <p className="text-sm text-gray-600 italic pt-2 border-t border-gray-200">
                                            This is the version I’d recommend for the homepage. It preserves the vision, technology ambition, and endgame without making the visitor read a long manifesto.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                                        <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: '#00508115' }}>
                                            <Globe className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#005081' }} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Global Stewardship</h4>
                                            <p className="text-xs sm:text-sm text-gray-600">Leading green industrial practices</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                                        <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: '#be180015' }}>
                                            <Heart className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#be1800' }} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Sustainable Impact</h4>
                                            <p className="text-xs sm:text-sm text-gray-600">Carbon-neutral operations</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative mt-8 lg:mt-0"
                            >
                                <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative group">
                                    <img
                                        src="/vision-mission-metals-b2b-lohakart.jpg"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt="Vision Illustration"
                                    />
                                    <div className="absolute inset-0 opacity-20 group-hover:opacity-0 transition-opacity duration-700" style={{ backgroundColor: '#005081' }}></div>
                                </div>
                                <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-8 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border-2 max-w-[200px] sm:max-w-[250px]" style={{ borderColor: '#005081' }}>
                                    <Leaf className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3" style={{ color: '#005081' }} />
                                    <p className="font-bold text-gray-900 text-xs sm:text-sm">100% Commitment to Carbon Awareness</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* INTELLIGENT STEEL ECOSYSTEM */}
                <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
                            <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest mb-4" style={{ color: '#005081' }}>
                                Intelligent Steel Ecosystem
                            </h2>
                            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed px-4">
                                At LohaKart, we envision a transformative steel ecosystem where artificial intelligence meets sustainability
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
                            {[
                                { icon: Cpu, title: "AI-Powered Intelligence", bgColor: '#00508115', iconColor: '#005081' },
                                { icon: Leaf, title: "Sustainable Operations", bgColor: '#00508115', iconColor: '#005081' },
                                { icon: TrendingUp, title: "Faster Growth", bgColor: '#be180015', iconColor: '#be1800' },
                                { icon: Globe, title: "Global Impact", bgColor: '#00508115', iconColor: '#005081' }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -10 }}
                                    className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 text-center flex flex-col items-center hover:shadow-lg transition-all"
                                >
                                    <div 
                                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6"
                                        style={{ backgroundColor: feature.bgColor }}
                                    >
                                        <feature.icon className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: feature.iconColor }} />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{feature.title}</h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2030 VISION ROADMAP */}
                <section className="py-16 sm:py-20 lg:py-24 bg-white overflow-hidden relative">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6 sm:gap-8 max-w-6xl mx-auto">
                            <div className="max-w-2xl">
                                <span className="font-bold uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4 block" style={{ color: '#005081' }}>
                                    Future Horizons
                                </span>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">2030 Vision</h2>
                                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                    Creating an intelligent, sustainable steel ecosystem that transforms how industries access, utilize, and recycle steel.
                                </p>
                            </div>
                        </div>

                        <div className="relative pt-8 sm:pt-12 max-w-6xl mx-auto">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 hidden md:block" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                                {[
                                    { year: "2024", goal: "Foundation & AI Integration", desc: "Establishing the core intelligent marketplace architecture." },
                                    { year: "2026", goal: "Continental Expansion", desc: "Scaling sustainable supply chains across multiple regions." },
                                    { year: "2030", goal: "Global Circularity", desc: "Achieving a fully closed-loop carbon-neutral steel ecosystem." }
                                ].map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.2 }}
                                        className="relative"
                                    >
                                        <div 
                                            className="absolute -top-[21px] left-0 w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white hidden md:flex"
                                            style={{ backgroundColor: idx === 2 ? '#be1800' : '#005081' }}
                                        >
                                            {idx + 1}
                                        </div>
                                        <div className="pt-0 md:pt-12 p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
                                            <span 
                                                className="text-3xl sm:text-4xl font-black block mb-3 sm:mb-4 opacity-50"
                                                style={{ color: idx === 2 ? '#be1800' : '#005081' }}
                                            >
                                                {step.year}
                                            </span>
                                            <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">{step.goal}</h4>
                                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* OUR MISSION */}
                <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mb-12 sm:mb-16">
                            <span className="font-bold uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4 block" style={{ color: '#005081' }}>
                                Our Mission
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Transforming Steel</h2>
                            <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                                <p>
                                    We use data and AI to help steel businesses make better decisions across procurement, materials, energy, production, cost, carbon and logistics.
                                </p>
                                <div>
                                    <p className="font-semibold text-gray-900 mb-2">
                                        Lohakart connects fragmented industrial and market data to transform:
                                    </p>
                                    <div className="pl-4 py-2 border-l-4 border-[#005081] space-y-1 font-semibold text-gray-900 bg-white/60 rounded-r-xl">
                                        <p>Data into Intelligence.</p>
                                        <p>Intelligence into Decisions.</p>
                                        <p style={{ color: '#005081' }}>Decisions into Measurable Value.</p>
                                    </div>
                                </div>
                                <p className="font-medium text-gray-900">
                                    Our mission is to help every steel business operate more efficiently, intelligently and sustainably.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {missionCards.map((card, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -10 }}
                                    className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white border border-gray-200 transition-all hover:shadow-xl group"
                                >
                                    <div 
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 transition-all group-hover:scale-110"
                                        style={{ 
                                            backgroundColor: '#00508115',
                                            color: '#005081'
                                        }}
                                    >
                                        <card.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{card.title}</h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{card.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CORE VALUES */}
                <section className="py-16 sm:py-20 lg:py-24 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 sm:mb-16">
                            <span className="font-bold uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4 block" style={{ color: '#005081' }}>
                                Core Values
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">What Drives Us</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                            {coreValues.map((value, idx) => (
                                <motion.div
                                    key={idx}
                                    viewport={{ once: true }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    className="bg-gray-50 p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-200 flex flex-col items-center text-center hover:shadow-lg transition-all"
                                >
                                    <div 
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                                        style={{ backgroundColor: '#00508115' }}
                                    >
                                        <value.icon className="w-8 h-8 sm:w-9 sm:h-9" style={{ color: '#005081' }} />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{value.title}</h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{value.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* JOIN OUR MISSION CTA */}
                <section className="py-20 sm:py-28 lg:py-32 bg-gradient-to-br from-gray-50 to-white overflow-hidden relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full opacity-5" style={{ backgroundColor: '#005081' }}></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl relative">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight leading-tight">
                                Lead the Revolution <br />
                                <span style={{ color: '#005081' }}>Join Our Mission</span>
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                                Partner with LohaKart in building an intelligent, sustainable steel ecosystem that powers global growth while honoring our planet.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
                                <Link to="/contact" className="w-full sm:w-auto">
                                    <Button 
                                        size="lg" 
                                        className="w-full sm:w-auto text-white min-w-[220px] text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2"
                                        style={{ backgroundColor: '#005081', borderColor: '#005081' }}
                                    >
                                        Partner With Us <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link to="/products" className="w-full sm:w-auto">
                                    <Button 
                                        size="lg" 
                                        className="w-full sm:w-auto bg-white hover:bg-[#be1800] text-[#be1800] hover:text-white min-w-[220px] text-base sm:text-lg font-semibold transition-all border-2 shadow-md hover:shadow-xl"
                                        style={{ borderColor: '#be1800' }}
                                    >
                                        Browse Products
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