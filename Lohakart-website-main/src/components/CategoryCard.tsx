import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from "react-router-dom";

interface CategoryCardProps {
    title: string;
    description: string;
    image: string;
    items: string[];
}

export const CategoryCard = ({ title, description, image, items }: CategoryCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Split items into two columns if many
    const midPoint = Math.ceil(items.length / 2);
    const leftItems = items.slice(0, midPoint);
    const rightItems = items.slice(midPoint);

    return (
        <div
            className="perspective-1000 w-full h-[450px] cursor-pointer group"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="relative w-full h-full preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                    <Card className="w-full h-full overflow-hidden border-none shadow-xl rounded-3xl relative">
                        <img
                            src={image}
                            alt={title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                            <h3 className="text-2xl font-bold mb-2 tracking-tight">{title}</h3>
                            <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 mb-4">
                                {description}
                            </p>
                            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-blue-400 group-hover:text-white transition-colors cursor-pointer">
                                View Details <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <Card className="w-full h-full bg-white border-2 border-slate-100 shadow-2xl rounded-3xl p-8 flex flex-col">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
                            <div className="h-1 w-12 bg-blue-600 rounded-full" />
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-2 pb-4">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex items-center text-slate-600 text-sm group/item hover:text-blue-600 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mr-2 group-hover/item:bg-blue-600 transition-colors" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link to="/products">
                        <div className="mt-4 pt-4 border-t border-slate-50">
                            <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors">
                                Explore All Products
                            </button>
                        </div>
                        </Link>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
};
