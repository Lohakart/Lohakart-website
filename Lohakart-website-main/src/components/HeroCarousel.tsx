import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
    {
        id: 1,
        title: "Enterprise Grade AI Intelligence Engine for Steel",
        description: "Connecting procurement, plant operations, market intelligence and carbon to help steel businesses make smarter decisions.",
        tagline: "From Data → Intelligence → Decision → Optimization → Execution",
        image: "/metal-trading-b2b-solutions-lohakart-metal-materials.webp",
        cta: "Explore Lohakart",
        link: "/products"
    },
    {
        id: 2,
        title: "Precision Engineering-Advanced Metal Fabrication",
        description: "Optimize fabrication routes, yields, and timelines while tracking embedded carbon across downstream steel processing.",
        image: "/img2.jpg",
        cta: "Custom Fabrication",
        link: "/services/fabrication"
    },
    {
        id: 3,
        title: "Circular Economy-Data Driven Sustainable Metal Recycling",
        description: "Maximize scrap utilization, lower emissions, and quantify avoided carbon through optimized recycling pathways.",
        image: "/img1.jpg",
        cta: "Start Recycling",
        link: "/services/recycling"
    }
];

export function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative h-[500px] sm:h-[600px] md:h-[calc(100vh-130px)] min-h-[500px] max-h-[850px] w-full overflow-hidden bg-slate-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[10000ms] ease-linear"
                        style={{ backgroundImage: `url(${slides[current].image})` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-900/40 to-slate-950/60" />

                    {/* Content - Perfectly Centered */}
                    <div className="relative container mx-auto px-4 sm:px-6 h-full flex items-center justify-center">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="max-w-5xl w-full text-center"
                        >
                            {/* Title - Responsive text sizing */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-6 md:mb-8 tracking-tight leading-tight px-2 drop-shadow-2xl">
                                {slides[current].title}
                            </h1>

                            {/* Description */}
                            <p className={`text-sm sm:text-base md:text-lg lg:text-xl text-white max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg px-4 ${slides[current].tagline ? 'mb-4 sm:mb-5' : 'mb-6 sm:mb-8 md:mb-12'}`}>
                                {slides[current].description}
                            </p>

                            {/* Process Tagline Flow */}
                            {slides[current].tagline && (
                                <div className="mb-6 sm:mb-8 md:mb-10 px-4">
                                    <div className="inline-flex items-center flex-wrap justify-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/25 text-xs sm:text-sm md:text-base font-semibold text-white tracking-wide shadow-2xl">
                                        <span>From Data</span>
                                        <span className="text-[#be1800] font-black text-sm sm:text-base">→</span>
                                        <span>Intelligence</span>
                                        <span className="text-[#be1800] font-black text-sm sm:text-base">→</span>
                                        <span>Decision</span>
                                        <span className="text-[#be1800] font-black text-sm sm:text-base">→</span>
                                        <span>Optimization</span>
                                        <span className="text-[#be1800] font-black text-sm sm:text-base">→</span>
                                        <span className="text-emerald-400">Execution</span>
                                    </div>
                                </div>
                            )}

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                                <Link to={slides[current].link} className="w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        className="bg-[#be1800] hover:bg-[#d41d00] text-white w-full sm:min-w-[200px] h-12 sm:h-14 text-base sm:text-lg font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                                    >
                                        {slides[current].cta} <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    </Button>
                                </Link>
                                <Link to="/contact" className="w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        className="bg-[#005081] hover:bg-[#006ba3] text-white w-full sm:min-w-[200px] h-12 sm:h-14 text-base sm:text-lg font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                                    >
                                        Talk to Us
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows - Simple, No Background Circle */}
            <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 text-white hover:text-[#005081] transition-all duration-300 hover:scale-125 active:scale-95 p-2 focus:outline-none"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 drop-shadow-2xl" strokeWidth={3} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 text-white hover:text-[#005081] transition-all duration-300 hover:scale-125 active:scale-95 p-2 focus:outline-none"
                aria-label="Next slide"
            >
                <ChevronRight className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 drop-shadow-2xl" strokeWidth={3} />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 bg-slate-950/40 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`transition-all duration-300 rounded-full ${current === index
                            ? 'bg-[#be1800] w-8 sm:w-10 h-2.5 sm:h-3 shadow-lg shadow-[#be1800]/50'
                            : 'bg-white/60 hover:bg-white w-2.5 sm:w-3 h-2.5 sm:h-3 hover:scale-125'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}