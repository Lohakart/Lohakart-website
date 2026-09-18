import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Info, Calculator, ArrowRight, ShieldCheck, BarChart3, Globe, Recycle, Zap, Truck, AlertTriangle, Ship, Train, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Industry standard emission factors (Tonnes CO2e per Tonne of metal)
const FACTORS = {
    VIRGIN: 2.55,
    RECYCLED: 0.53,
    TRANSPORT: {
        truck: 0.0001, // 0.1 kg converted to tonnes
        rail: 0.00003, // 0.03 kg converted to tonnes
        ship: 0.00001, // 0.01 kg converted to tonnes
    }
};

const METAL_CATEGORIES = [
    'TMT Bars',
    'Structural Steel',
    'Hot Rolled Coil (HRC)',
    'Cold Rolled Coil (CRC)',
    'Galvanized Steel',
    'Stainless Steel',
    'Other steel products'
];

export default function CarbonAccounting() {
    const { user } = useAuth();

    // Calculator State
    const [metalCategory, setMetalCategory] = useState('TMT Bars');
    const [productionRoute, setProductionRoute] = useState('virgin');
    const [recycledPercentage, setRecycledPercentage] = useState<number>(50);
    const [quantity, setQuantity] = useState<number>(1);
    const [unit, setUnit] = useState('tonne');
    const [distance, setDistance] = useState<number>(0);
    const [transportMode, setTransportMode] = useState('truck');
    const [calculated, setCalculated] = useState(false);

    const results = useMemo(() => {
        // 1. Convert quantity to tonnes
        const quantityInTonnes = unit === 'kg' ? quantity / 1000 : quantity;

        // 2. Determine production emission factor
        let factor = FACTORS.VIRGIN;
        if (productionRoute === 'recycled') {
            factor = FACTORS.RECYCLED;
        } else if (productionRoute === 'mixed') {
            factor = ((100 - recycledPercentage) / 100 * FACTORS.VIRGIN) + (recycledPercentage / 100 * FACTORS.RECYCLED);
        }

        // 3. Production Emissions
        const productionEmissions = factor * quantityInTonnes;

        // 4. Transport Emissions
        const transportFactor = (FACTORS.TRANSPORT as any)[transportMode];
        const transportEmissions = quantityInTonnes * distance * transportFactor;

        // 5. Total
        const totalEmissions = productionEmissions + transportEmissions;

        // 6. Savings comparison (vs 100% Virgin)
        const virginComparison = FACTORS.VIRGIN * quantityInTonnes + transportEmissions;
        const savings = virginComparison - totalEmissions;

        return {
            quantityInTonnes,
            factor,
            production: productionEmissions,
            transport: transportEmissions,
            total: totalEmissions,
            perTonne: totalEmissions / (quantityInTonnes || 1),
            savings,
            virginComparison
        };
    }, [productionRoute, recycledPercentage, quantity, unit, distance, transportMode, metalCategory]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-slate-900 text-white">
                <div
  className="absolute inset-0 bg-cover bg-center opacity-20"
  style={{
    backgroundImage:
      "url('/carbon-lohakart-carbon-accounting-lohakart.jpg')",
  }}
/>
                <div className="container relative z-10 mx-auto px-4 text-center items-center flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <Badge variant="outline" className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
                            <Leaf className="w-3 h-3 mr-1" /> Carbon Industry Standard
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">🌱 Carbon Accounting</h1>
                        <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                            Transparent, data-driven carbon visibility for down stream processing. Build responsibly with industry-standard CO₂e calculations through process level carbon measurements.
                        </p>
                        <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}>
                            Start Accounting <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-16 space-y-24">

                {/* Intro */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold">Carbon Accounting for Services</h2>
                        <p className="text-lg text-muted-foreground">
                            Lohakart’s Carbon Accounting solution helps businesses understand the environmental impact of different services by accurately measuring carbon emissions associated with virgin and non-virgin (recycled) metals.
                        </p>
                        <div className="space-y-4">
                            {[
                                "Steel and metals are carbon-intensive materials",
                                "Emissions vary based on production methods",
                                "Sustainable sourcing is becoming a business requirement",
                                "Customers and regulators expect transparency",
                                "Carbon-aware decisions reduce long-term risk"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900/30">
                                        <ShieldCheck className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 dark:bg-slate-900/50 space-y-3">
                            <Zap className="w-8 h-8 text-amber-500" />
                            <h4 className="font-bold">Virgin Metal</h4>
                            <p className="text-xs text-muted-foreground">Produced directly from ore materials. High energy consumption and higher emissions.</p>
                            
                        </div>
                        <div className="p-6 rounded-3xl bg-green-50 border border-green-100 dark:bg-green-900/20 dark:border-green-800/50 space-y-3">
                            <Recycle className="w-8 h-8 text-green-600" />
                            <h4 className="font-bold">Non-Virgin</h4>
                            <p className="text-xs text-muted-foreground">Produced using recycled scrap metal. Significantly lower energy and footprint.</p>
                            
                        </div>
                    </div>
                </div>

                {/* Calculator Section */}
                <section id="calculator" className="scroll-mt-24">
                    <Card className="border-none shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                            {/* Inputs */}
                            <div className="lg:col-span-5 p-8 lg:p-10 space-y-10 bg-white dark:bg-slate-900">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2 flex items-center">
                                        <Calculator className="w-8 h-8 mr-3 text-primary" />
                                        CO₂e Calculator
                                    </h2>
                                    <p className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Strict Industrial Accounting</p>
                                </div>

                                {!user ? (
                                    <div className="bg-slate-50 p-10 rounded-2xl border-2 border-dashed border-slate-200 text-center dark:bg-slate-800/50 dark:border-slate-800">
                                        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold mb-2">Login Required</h3>
                                        <p className="text-muted-foreground mb-8">Access professional carbon accounting tools by signing into your account.</p>
                                        <Button onClick={() => window.location.href = '/auth'} className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12 text-lg">Sign In to Calculate</Button>
                                    </div>
                                ) : (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase text-slate-500">Metal Category</Label>
                                                <Select value={metalCategory} onValueChange={setMetalCategory}>
                                                    <SelectTrigger className="h-12 rounded-xl">
                                                        <SelectValue placeholder="Select metal category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {METAL_CATEGORIES.map(cat => (
                                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase text-slate-500">Production Route</Label>
                                                <Select value={productionRoute} onValueChange={setProductionRoute}>
                                                    <SelectTrigger className="h-12 rounded-xl">
                                                        <SelectValue placeholder="Select production route" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="virgin">Virgin (Ore-based, BF–BOF)</SelectItem>
                                                        <SelectItem value="recycled">Non-virgin (Recycled, EAF)</SelectItem>
                                                        <SelectItem value="mixed">Mixed Content (Custom %)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {productionRoute === 'mixed' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="space-y-2 p-4 bg-slate-50 rounded-xl dark:bg-slate-800"
                                                >
                                                    <Label className="text-xs font-bold text-slate-500">Recycled Content Percentage (%)</Label>
                                                    <div className="flex gap-4 items-center">
                                                        <Input
                                                            type="range"
                                                            min="1"
                                                            max="99"
                                                            value={recycledPercentage}
                                                            onChange={(e) => setRecycledPercentage(parseInt(e.target.value))}
                                                            className="accent-primary"
                                                        />
                                                        <span className="font-bold text-primary min-w-[3rem] text-center">{recycledPercentage}%</span>
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase text-slate-500">Quantity</Label>
                                                    <Input
                                                        type="number"
                                                        min="0.1"
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                                                        className="h-12 rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase text-slate-500">Unit</Label>
                                                    <Select value={unit} onValueChange={setUnit}>
                                                        <SelectTrigger className="h-12 rounded-xl">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="tonne">Tonnes</SelectItem>
                                                            <SelectItem value="kg">Kilograms</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase text-slate-500">Transport (km)</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={distance}
                                                        onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                                                        className="h-12 rounded-xl"
                                                        placeholder="Optional"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase text-slate-500">Mode</Label>
                                                    <Select value={transportMode} onValueChange={setTransportMode}>
                                                        <SelectTrigger className="h-12 rounded-xl">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="truck">Truck</SelectItem>
                                                            <SelectItem value="rail">Rail</SelectItem>
                                                            <SelectItem value="ship">Ship</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full h-14 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-xl"
                                            onClick={() => setCalculated(true)}
                                        >
                                            Process Accounting
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Outputs */}
                            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900/30 p-8 lg:p-12 relative overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {!calculated ? (
                                        <motion.div
                                            key="idle"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="h-full flex flex-col items-center justify-center text-center space-y-6"
                                        >
                                            <BarChart3 className="w-16 h-16 text-slate-300 animate-pulse" />
                                            <div className="max-w-xs">
                                                <h3 className="text-xl font-bold mb-2">Ready for Calculation</h3>
                                                <p className="text-muted-foreground text-sm">Fill in the procurement details to generate your industry-standard CO₂e results.</p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="active"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="space-y-8"
                                        >
                                            {/* Summary */}
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8 border-slate-200 dark:border-slate-800">
                                                <div>
                                                    <h3 className="text-sm font-bold uppercase text-slate-500 tracking-widest mb-2">Total Carbon Footprint</h3>
                                                    <div className="flex items-baseline gap-3">
                                                        <span className="text-6xl font-black text-primary tracking-tighter">{results.total.toFixed(3)}</span>
                                                        <span className="text-xl font-bold text-muted-foreground">tCO₂e</span>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3">
                                                    <Recycle className="w-6 h-6 text-green-600" />
                                                    <div className="text-left">
                                                        <p className="text-[10px] uppercase font-bold text-green-600">Carbon Savings</p>
                                                        <p className="text-xl font-black text-green-700">-{results.savings.toFixed(3)}<sup>t</sup></p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Detail Table */}
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Material</p>
                                                        <p className="text-sm font-bold">{metalCategory}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Quantity</p>
                                                        <p className="text-sm font-bold">{results.quantityInTonnes} Tonnes</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Route</p>
                                                        <p className="text-sm font-bold capitalize">{productionRoute === 'mixed' ? `${recycledPercentage}% Recycled` : productionRoute}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Transport</p>
                                                        <p className="text-sm font-bold capitalize">{transportMode} / {distance}km</p>
                                                    </div>
                                                </div>

                                                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                                                    <Table>
                                                        <TableHeader className="bg-slate-50 dark:bg-slate-800">
                                                            <TableRow>
                                                                <TableHead className="text-[10px] font-bold uppercase">Emission Source</TableHead>
                                                                <TableHead className="text-[10px] font-bold uppercase">Calculation Steps</TableHead>
                                                                <TableHead className="text-[10px] font-bold uppercase text-right">Result (tCO₂e)</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="font-medium text-sm">Production</TableCell>
                                                                <TableCell className="text-xs text-muted-foreground">{results.quantityInTonnes}t × {results.factor.toFixed(2)} factor</TableCell>
                                                                <TableCell className="text-right font-bold text-sm">{results.production.toFixed(3)}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="font-medium text-sm">Logistics</TableCell>
                                                                <TableCell className="text-xs text-muted-foreground">{results.quantityInTonnes}t × {distance}km × {(FACTORS.TRANSPORT as any)[transportMode].toFixed(5)}</TableCell>
                                                                <TableCell className="text-right font-bold text-sm">{results.transport.toFixed(3)}</TableCell>
                                                            </TableRow>
                                                            <TableRow className="bg-primary/5">
                                                                <TableCell className="font-black text-sm text-primary">Total</TableCell>
                                                                <TableCell className="text-xs font-medium text-primary/70">Sum of above</TableCell>
                                                                <TableCell className="text-right font-black text-primary text-base">{results.total.toFixed(3)}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>

                                            {/* Comparison */}
                                            <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="flex items-center gap-2 font-bold">
                                                        <Layers className="w-4 h-4 text-green-400" /> Comparison Insights
                                                    </h4>
                                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Efficiency: {((results.total / results.virginComparison) * 100).toFixed(0)}%</span>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                                                            <span>Selected Route</span>
                                                            <span>{results.total.toFixed(2)} tCO₂e</span>
                                                        </div>
                                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(results.total / results.virginComparison) * 100}%` }}
                                                                className="h-full bg-green-500"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                                                            <span>Virgin (BF–BOF) Baseline</span>
                                                            <span>{results.virginComparison.toFixed(2)} tCO₂e</span>
                                                        </div>
                                                        <div className="h-2 bg-white/10 rounded-full">
                                                            <div className="h-full bg-slate-600 w-full" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-[10px] text-slate-400 pt-2 italic">
                                                    * Assumptions: Virgin Steel (1.9 tCO2e/t), Recycled (0.4 tCO2e/t). No carbon offsets included.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Informational Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4 p-8 rounded-3xl bg-slate-100/50 dark:bg-slate-900">
                        <Globe className="w-8 h-8 text-primary" />
                        <h4 className="text-xl font-bold">Industry Factors</h4>
                        <p className="text-sm text-muted-foreground">Standard emission factors: Virgin (1.9), Recycled (0.4) per tonne. Logistics based on global tonne-km standards.</p>
                    </div>
                    <div className="space-y-4 p-8 rounded-3xl bg-slate-100/50 dark:bg-slate-900">
                        <ArrowRight className="w-8 h-8 text-green-600" />
                        <h4 className="text-xl font-bold">Transparent Math</h4>
                        <p className="text-sm text-muted-foreground">Clear breakdown of production and transport emissions. No hidden marketing offsets—just raw data.</p>
                    </div>
                    <div className="space-y-4 p-8 rounded-3xl bg-slate-100/50 dark:bg-slate-900">
                        <Recycle className="w-8 h-8 text-blue-600" />
                        <h4 className="text-xl font-bold">Mixed Content</h4>
                        <p className="text-sm text-muted-foreground">Weighted average calculations for products with partial recycled content to ensure procurement precision.</p>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
