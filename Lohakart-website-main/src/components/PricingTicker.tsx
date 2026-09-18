import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceIndex {
    id: string;
    product_name: string;
    price: number;
    change_percent: number | null;
    date: string;
}

interface PricingTickerProps {
    variant?: 'global' | 'contained';
}

export const PricingTicker = ({ variant = 'global' }: PricingTickerProps) => {
    const [pricing, setPricing] = useState<PriceIndex[]>([]);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        fetchPricing();

        // Refresh every 5 minutes
        const interval = setInterval(fetchPricing, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchPricing = async () => {
        const { data, error } = await supabase
            .from('pricing_index')
            .select('*')
            .order('product_name', { ascending: true });

        if (!error && data) {
            // Duplicate items to ensure smooth continuous scroll
            setPricing([...data, ...data]);
        }
    };

    if (pricing.length === 0) return null;

    const isGlobal = variant === 'global';

    return (
        <div
            className={`
                ${isGlobal ? 'bg-slate-900 border-b border-white/5 py-3 sticky top-20 z-40' : 'bg-blue-50/50 border border-blue-100 py-4 rounded-2xl md:rounded-3xl'}
                overflow-hidden relative group select-none
            `}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="flex whitespace-nowrap">
                <motion.div
                    animate={{
                        x: isPaused ? undefined : ["0%", "-50%"]
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: pricing.length * 4, // Slightly slower for readability
                            ease: "linear",
                        },
                    }}
                    className="flex gap-8 md:gap-16 items-center px-6"
                >
                    {pricing.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex items-center gap-3">
                            <span className={`${isGlobal ? 'text-white/60' : 'text-slate-500'} text-xs font-bold uppercase tracking-wider`}>
                                {item.product_name}
                            </span>
                            <span className={`${isGlobal ? 'text-white' : 'text-slate-900'} font-mono font-bold tracking-tight text-sm md:text-base`}>
                                ₹{Number(item.price).toLocaleString()}
                            </span>
                            {item.change_percent !== null && (
                                <div className={`flex items-center gap-1 text-xs font-bold ${item.change_percent > 0 ? (isGlobal ? 'text-emerald-400' : 'text-emerald-600') :
                                    item.change_percent < 0 ? (isGlobal ? 'text-rose-400' : 'text-rose-600') :
                                        'text-slate-400'
                                    }`}>
                                    {item.change_percent > 0 ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : item.change_percent < 0 ? (
                                        <TrendingDown className="h-3 w-3" />
                                    ) : (
                                        <Minus className="h-3 w-3" />
                                    )}
                                    <span>{item.change_percent > 0 ? '+' : ''}{item.change_percent}%</span>
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Decorative gradients for edges */}
            <div className={`absolute inset-y-0 left-0 w-12 bg-gradient-to-r ${isGlobal ? 'from-slate-900' : 'from-blue-50/50'} to-transparent z-10 pointer-events-none`} />
            <div className={`absolute inset-y-0 right-0 w-12 bg-gradient-to-l ${isGlobal ? 'from-slate-900' : 'from-blue-50/50'} to-transparent z-10 pointer-events-none`} />
        </div >
    );
};
