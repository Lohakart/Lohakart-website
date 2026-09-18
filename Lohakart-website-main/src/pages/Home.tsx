import { CategoryCard } from '@/components/CategoryCard';
import { Footer } from '@/components/Footer';
import { HeroCarousel } from '@/components/HeroCarousel';
import { Navbar } from '@/components/Navbar';
import { PricingTicker } from '@/components/PricingTicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart,
  BarChart3,
  Building2,
  Calendar,
  Car,
  ChevronRight,
  Clock, Factory, Cpu,
  FileCheck,
  Fuel,
  Globe,
  Hammer,
  Lightbulb,
  Plane,
  Recycle,
  Settings,
  Shield,
  ShoppingCart,
  Star,
  TrendingUp, Truck,
  Tv,
  User as UserIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [latestNews, setLatestNews] = useState<any[]>([]);

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('status', 'Published')
        .order('published_at', { ascending: false })
        .limit(3);
      if (data) setLatestNews(data);
    } catch (err) {
      console.error('Error fetching latest news:', err);
    }
  };

  const categoryData = [
    {
      title: 'Ferrous Metals',
      description: 'Comprehensive range of steel products for structural, industrial, and construction applications.',
      image: '/ferrous-metal-sourcing-b2b-lohakart.webp',
      items: ['Mild Steel', 'Stainless Steel', 'TMT Bar', 'Round Bar', 'Angles', 'Channels', 'Beams', 'Flats', 'Billets']
    },
    {
      title: 'Non-Ferrous Metals',
      description: 'High-quality aluminium, copper, zinc, and alloy products for specialized industrial needs.',
      image: '/non-ferrous-metal-sourcing-b2b-lohakart.webp',
      items: ['Aluminium Wire Rod', 'Copper Cathode', 'Copper Wire Rod', 'Aluminium Alloy Ingot', 'Lead Ingot', 'Zinc Ingot']
    },
    {
      title: 'Manufacturing & Fabrication',
      description: 'Precision engineered fabrication solutions from laser cutting to heavy machining job works.',
      image: '/manufacturing-fabrication-services-b2b-lohakart.webp',
      items: ['Heavy Fabrication', 'Laser Cutting', 'CNC Bending', 'Castings', 'Forgings', 'Machining', 'Job Works']
    },
    {
      title: 'Metal Recycling',
      description: 'Sustainable metal scrap processing and rare metal recycling for a greener industrial future.',
      image: '/metal-recycling-solutions-b2b-lohakart.webp',
      items: ['Steel Recycling', 'Aluminium Recycling', 'Copper Recycling', 'Lead Recycling', 'Rare Metal Recycling']
    }
  ];

  const services = [
    {
      icon: ShoppingCart,
      title: 'Procurement Intelligence',
      description: 'Smarter sourcing, purchasing and logistics decisions.',
      link: '/products'
    },
    {
      icon: BarChart3,
      title: 'Carbon Intelligence',
      description: 'Carbon visibility across steel procurement and production.',
      link: '/services/carbon-accounting'
    },
    {
      icon: Hammer,
      title: 'E - Factory Fabrication',
      description: 'Custom metal fabrication services using state-of-the-art CNC and laser technology.',
      link: '/services/fabrication'
    },
    {
      icon: Factory,
      title: 'Plant Intelligence',
      description: 'Cost, energy, material, yield and production intelligence.',
      link: '/services/recycling'
    },
    {
      icon: BarChart,
      title: 'Market Intelligence',
      description: 'Pricing, supplier and market intelligence.',
      link: '/pricing'
    },
    {
      icon: Cpu,
      title: 'AI Optimization',
      description: 'Recommendations that connect economics, operations and sustainability.',
      link: '/contact'
    }
  ];

  const sectors = [
    { icon: Building2, name: 'Infra & Construction', image: '/infrastructure-construction-sector-lohakart.webp' },
    { icon: Car, name: 'Automotive & Transport', image: '/automotive-transportation-sector-lohakart.webp' },
    { icon: Settings, name: 'Machinery & Equipment', image: '/machinery-equipment-sector-lohakart.webp' },
    { icon: Lightbulb, name: 'Renewable Energy', image: '/renewable-energy-sector-lohakart.webp' },
    { icon: Plane, name: 'Defense & Aerospace', image: '/defense-aerospace-sector-lohakart.webp' },
    { icon: Fuel, name: 'Oil & Gas Industries', image: '/oil-gas-sector-lohakart.webp' },
    { icon: Tv, name: 'Consumer Appliances', image: '/consumer-appliances-sector-lohakart.webp' },
    { icon: Factory, name: 'Manufacturing', image: '/manufacturing-heavy-industries-lohakart.webp' }
  ];

  const stats = [
    { value: '250+', label: 'B2B Clients', sublabel: 'Contractors & Builders' },
    { value: '1500+', label: 'Tons/Month', sublabel: 'Material Delivered' },
    { value: '50+', label: 'Cities', sublabel: 'Pan India Coverage' },
    { value: '98%', label: 'Satisfaction', sublabel: 'Client Rating' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Uncompromised Quality',
      description: 'Every product is ISI certified and rigorously tested for industrial standards and durability.'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Track your procurement trends, carbon footprint, and market pricing in a single dashboard.'
    },
    {
      icon: Clock,
      title: '24/7 Expert Support',
      description: 'Our dedicated account managers are available around the clock to assist with your industrial needs.'
    },
    {
      icon: FileCheck,
      title: 'Seamless Compliance',
      description: 'Automated documentation, mill certificates, and tax compliance for all your transactions.'
    }
  ];

  const benefits = [
    {
      title: 'Bulk Pricing Advantage',
      description: 'Access exclusive wholesale rates by connecting directly with primary metal manufacturers.',
      icon: BarChart3
    },
    {
      title: 'Flexible Credit Lines',
      description: 'Specialized financing options designed to support the cash flow needs of growing enterprises.',
      icon: Building2
    },
    {
      title: 'Pan-India Logistics',
      description: 'Smart routing and heavy vehicle network ensuring the lowest shipping costs nationwide.',
      icon: Globe
    }
  ];

  const testimonials = [
    {
      quote: "Lohakart has transformed how we source structural steel. Their transparent pricing and quality assurance are unmatched in the industry.",
      author: "Govind Maurya",
      role: " Project Manager, Utkarsh Steel",
      image: "/man1.jpg"
    },
    {
      quote: "The platform streamlines metal procurement with transparent sourcing and integrated carbon accounting, aligning perfectly with sustainability goals for future-ready industries.",
      author: "Waseem Akram",
      role: "Operations Director, JKW Construction",
      image: "/man2.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <PricingTicker variant="global" />

      <main className="flex-1">
        {/* Hero Section */}
       <section>
  <HeroCarousel />
  
  {/* Stats Bar - Now flows after carousel instead of overlapping */}
  <div className="backdrop-blur-md border-t" style={{ backgroundColor: 'rgba(0, 80, 129, 0.95)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
            <div className="text-xs font-semibold text-white/90 mb-1">{stat.label}</div>
            <div className="text-xs text-white/60">{stat.sublabel}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</section>

        {/* Why Choose Us */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase tracking-widest mb-3 block" style={{ color: '#005081' }}>
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Industry-Leading Excellence</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Delivering unmatched quality and service across every touchpoint</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300" style={{ backgroundColor: '#00508115' }}>
                    <feature.icon className="w-7 h-7 transition-colors duration-300" style={{ color: '#005081' }} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Categories Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-sm font-bold uppercase tracking-widest mb-3 block" style={{ color: '#005081' }}>
                  Product Portfolio
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Our Categories
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Lohakart provides end-to-end industrial solutions across ferrous and non-ferrous metals, powered by advanced fabrication technology.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {categoryData.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CategoryCard {...category} />
                </motion.div>
              ))}
            </div>

            <div className="mt-20">
              <PricingTicker variant="contained" />
            </div>
          </div>
        </section>

        {/* Latest News & Insights */}
        {latestNews.length > 0 && (
          <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div className="max-w-2xl">
                  <span className="text-sm font-bold uppercase tracking-widest mb-3 block" style={{ color: '#be1800' }}>
                    Knowledge Center
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Latest News & Insights</h2>
                </div>
                <Link to="/news">
                  <Button 
                    className="text-white font-semibold rounded-xl h-12 px-6 transition-all shadow-md hover:shadow-lg"
                    style={{ backgroundColor: '#005081' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#be1800'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#005081'}
                  >
                    View All Articles <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestNews.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/news/${article.slug}`}>
                      <Card className="h-full border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group rounded-2xl bg-white">
                        <div className="aspect-[16/9] overflow-hidden relative">
                          <img
                            src={article.image_url || 'https://images.unsplash.com/photo-1504917595217-d4dc5f64977a?auto=format&fit=crop&q=80'}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wide text-gray-900 shadow-sm">
                              {article.category}
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(article.published_at), 'MMM dd, yyyy')}
                            </div>
                            <div className="flex items-center gap-1">
                              <UserIcon className="w-3 h-3" />
                              Admin
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#005081] transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {article.excerpt}
                          </p>
                          <div className="text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all" style={{ color: '#be1800' }}>
                            Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Our Services Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-sm font-bold uppercase tracking-widest mb-3 block" style={{ color: '#005081' }}>
                  Core Capabilities
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                  Comprehensive Services
                </h2>
                <p className="text-gray-600">End-to-end solutions for your industrial metal needs</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-2xl p-8">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300" style={{ backgroundColor: '#00508115' }}>
                      <service.icon className="w-7 h-7 transition-colors duration-300" style={{ color: '#005081' }} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <Link to={service.link}>
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto font-bold transition-colors bg-transparent hover:bg-transparent"
                        style={{ color: '#005081' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#be1800';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#005081';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Learn More <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sectors We Cater To */}
        <section className="py-24 bg-gray-900 text-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl"
              >
                <span className="text-sm font-bold uppercase tracking-widest mb-3 block" style={{ color: '#be1800' }}>
                  Market Reach
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Sectors We Cater To
                </h2>
                <p className="text-gray-400 text-lg">
                  Delivering specialized metal solutions to diverse high-growth industries across the globe.
                </p>
              </motion.div>

              <Link to="/contact">
                <Button 
                  className="h-12 px-8 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg"
                  style={{ backgroundColor: '#005081', color: 'white' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#be1800';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#005081';
                  }}
                >
                  Get Industry Solutions <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {sectors.map((sector, index) => (
                <motion.div
                  key={sector.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative h-64 group overflow-hidden rounded-2xl"
                >
                  <img
                    src={sector.image}
                    alt={sector.name}
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gray-900/70 group-hover:bg-gray-900/40 transition-all duration-300" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: '#005081' }}>
                      <sector.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold">{sector.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* B2B Benefits */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase tracking-widest mb-3 block" style={{ color: '#005081' }}>
                B2B Excellence
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Lohakart Advantage</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Specialized B2B services designed to streamline your industrial supply chain</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#00508115' }}>
                    <benefit.icon className="w-7 h-7" style={{ color: '#005081' }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-bold uppercase tracking-widest mb-3 block" style={{ color: '#be1800' }}>
                  Success Stories
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Partners Say</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((t, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 relative"
                  >
                    <Star className="absolute top-8 right-8 w-6 h-6 text-amber-400 fill-amber-400 opacity-30" />
                    <p className="text-gray-700 italic mb-8 leading-relaxed">"{t.quote}"</p>
                    <div className="flex items-center gap-4">
                      <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full border-2 border-gray-200" />
                      <div>
                        <div className="font-bold text-gray-900">{t.author}</div>
                        <div className="text-xs text-gray-500">{t.role}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <Card 
              className="border-none rounded-3xl p-12 md:p-20 text-white overflow-hidden relative shadow-2xl"
              style={{ backgroundColor: '#005081' }}
            >
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#be1800' }}></div>
              <div className="max-w-3xl relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                  Ready to optimize your metal procurement?
                </h2>
                <p className="text-lg text-white/90 mb-10 leading-relaxed">
                  Join thousands of businesses transforming their supply chain with Lohakart
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/products">
                    <Button 
                      className="bg-white hover:bg-gray-100 h-14 px-8 rounded-xl text-base font-bold shadow-xl transition-all"
                      style={{ color: '#005081' }}
                    >
                      View Product Catalog
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button 
                      className="h-14 px-8 rounded-xl text-base font-bold text-white transition-all border-2"
                      style={{ 
                        borderColor: 'white',
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#be1800';
                        e.currentTarget.style.borderColor = '#be1800';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'white';
                      }}
                    >
                      Speak with Expert
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}