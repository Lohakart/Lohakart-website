
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Lightbulb,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Globe,
  Award,
  CheckCircle2,
  ArrowRight,
  Package,
  Truck,
  Settings,
  Sparkles,
  Leaf
} from 'lucide-react';
import { useRef } from 'react';

export default function About() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  const stats = [
    { value: '2500+', label: 'B2B Clients', sublabel: 'Active Partners', color: 'from-blue-500 to-cyan-500' },
    { value: '15K+', label: 'Tons/Month', sublabel: 'Material Delivered', color: 'from-green-500 to-emerald-500' },
    { value: '500+', label: 'Cities', sublabel: 'Pan India Coverage', color: 'from-purple-500 to-pink-500' },
    { value: '98%', label: 'Satisfaction', sublabel: 'Client Rating', color: 'from-amber-500 to-orange-500' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Every material undergoes rigorous quality checks to meet industry standards and exceed client expectations.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'Leveraging cutting-edge technology and data-driven insights to revolutionize the metal supply chain.',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'Customer Centric',
      description: 'Building lasting partnerships through exceptional service, transparency, and dedicated support.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and circular economy principles in every aspect of our operations.',
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  const services = [
    {
      icon: Package,
      title: 'Quality Sourcing',
      description: 'High-quality raw materials with multiple grades and sizes available instantly.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Settings,
      title: 'Precision Fabrication',
      description: 'Advanced fabrication services with state-of-the-art technology and expertise.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Leaf,
      title: 'Carbon Calculation',
      description: 'Measure process-level carbon emissions across production, procurement, and recycling',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const cardHover = {
    scale: 1.05,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - White Background with Professional Design */}
        <motion.section
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative bg-white py-16 md:py-24 lg:py-32 overflow-hidden"
        >
          {/* Subtle Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient Orbs */}
            <motion.div
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#005081]/5 to-[#be1800]/5 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                y: [0, 30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-[#be1800]/5 to-[#005081]/5 rounded-full blur-3xl"
            />
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#005081_1px,transparent_1px),linear-gradient(to_bottom,#005081_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>
          </div>

          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl mx-auto"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center mb-8"
              >
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#005081]/10 to-[#be1800]/10 border border-[#005081]/20 backdrop-blur-sm">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Award className="w-4 h-4 text-[#005081]" />
                  </motion.div>
                  <span className="text-xs md:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-[#005081] to-[#be1800] bg-clip-text text-transparent">
                    Leading B2B Metal Platform
                  </span>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
                  Transforming the Metal
                  <br />
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="relative inline-block"
                  >
                    <span className="bg-gradient-to-r from-[#005081] to-[#be1800] bg-clip-text text-transparent relative z-10">
                      Supply Chain
                    </span>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-[#005081]/10 to-[#be1800]/10 -z-10"
                    />
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                      className="absolute -right-12 top-0 lg:-right-16"
                    >
                      <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-[#be1800]" />
                    </motion.div>
                  </motion.span>
                </h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto"
                >
                  At LohaKart, we are transforming the way businesses source, procure, and manage raw materials through our innovative B2B e-commerce digital platform.
                </motion.p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => navigate('/products')}
                    className="bg-gradient-to-r from-[#005081] to-[#003d63] hover:from-[#003d63] hover:to-[#002b4d] text-white px-8 py-6 rounded-2xl font-bold text-base shadow-xl shadow-[#005081]/20 hover:shadow-2xl hover:shadow-[#005081]/30 inline-flex items-center gap-3 group transition-all"
                  >
                    Explore Products
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/contact')}
                    className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-6 rounded-2xl font-bold text-base transition-all shadow-lg hover:shadow-xl"
                  >
                    Get in Touch
                  </Button>
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-16 flex justify-center gap-12 opacity-30"
              >
                {[Package, Settings, Leaf].map((Icon, index) => (
                  <motion.div
                    key={index}
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      duration: 2 + index, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  >
                    <Icon className="w-8 h-8 text-slate-300" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Animated Stats Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white relative">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 border border-slate-100 relative overflow-hidden"
            >
              {/* Animated Background Gradient */}
              <motion.div
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-[#005081]/5 via-[#be1800]/5 to-[#005081]/5 -z-10"
              />

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center group cursor-default relative"
                  >
                    {/* Hover Gradient */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl`}
                    />
                    
                    <div className="relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                        className={`text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2`}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-xs md:text-sm font-bold text-slate-900 mb-1">{stat.label}</div>
                      <div className="text-xs text-slate-500">{stat.sublabel}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About Us with Slide In Animation */}
        <section className="py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#005081]/5 to-[#be1800]/5 rounded-full blur-3xl -z-10"
          />

          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4"
                >
                  About Us
                </motion.h2>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "80px" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-1.5 bg-gradient-to-r from-[#005081] to-[#be1800] mx-auto rounded-full mb-6"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-base md:text-lg text-slate-600 leading-relaxed"
                >
                  Lohakart is building the intelligence layer for the steel industry. We help steel producers, buyers, and processors make better decisions under cost and carbon constraints—using real operational data and practical decision intelligence.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#005081]/5 to-[#be1800]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="text-sm md:text-base text-slate-600 leading-relaxed relative z-10">
                  Lohakart exists to change that. Our platform combines carbon intelligence, operational modeling, and enterprise-grade decision tools to bring clarity to how steel is sourced, produced, fabricated, and recycled.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* What We Do - Enhanced Cards */}
        <section className="py-16 md:py-20 lg:py-24 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005081]/10 border border-[#005081]/20 text-[#005081] text-sm font-bold uppercase tracking-wider mb-4"
              >
                <Target className="w-4 h-4" />
                Our Services
              </motion.div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">What We Do</h2>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
                Lohakart delivers a unified decision platform across the steel lifecycle, enabling enterprises to:
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={itemVariants}
                  whileHover={cardHover}
                >
                  <Card className="h-full border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group bg-white">
                    <CardContent className="p-6 md:p-8 relative">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg flex items-center justify-center mb-6 relative z-10`}
                      >
                        <service.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 relative z-10">{service.title}</h3>
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed relative z-10">{service.description}</p>

                      {/* Progress Bar */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.6 }}
                        className={`h-1 bg-gradient-to-r ${service.gradient} mt-6 rounded-full origin-left`}
                      />

                      {/* Hover Gradient */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-lg text-center">
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  We leverage advanced technology and industry expertise to streamline operations, allowing businesses to focus on their core activities.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Values - Staggered Grid */}
        <section className="py-16 md:py-20 lg:py-24 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Our Core Values</h2>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
                The principles that guide everything we do at LohaKart
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  variants={itemVariants}
                  whileHover={cardHover}
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group bg-white">
                    <CardContent className="p-6 md:p-8 relative">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 shadow-lg`}
                      >
                        <value.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-slate-900 mb-3">{value.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{value.description}</p>

                      {/* Hover Gradient */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Innovative Solutions - Parallax Effect */}
        <section className="py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#005081]/10 to-[#be1800]/10 rounded-full blur-3xl"
          />

          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#be1800]/10 border border-[#be1800]/20 text-[#be1800] text-sm font-bold uppercase tracking-wider mb-4">
                    <Lightbulb className="w-4 h-4" />
                    Innovation
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Innovative Solutions</h2>
                  <p className="text-base text-slate-600 leading-relaxed mb-6">
                    At LohaKart, we pride ourselves on delivering innovative solutions that address the evolving needs of the metal supply chain. Our approach combines cutting-edge technology with industry best practices to create tailored solutions that enhance efficiency, reduce costs, and improve overall performance.
                  </p>
                  <motion.ul
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-3"
                  >
                    {['Data-driven insights', 'Optimized sourcing processes', 'Advanced fabrication', 'Streamlined logistics'].map((item, index) => (
                      <motion.li
                        key={item}
                        variants={itemVariants}
                        className="flex items-center gap-3 text-base text-slate-700 group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.4 }}
                        >
                          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                        </motion.div>
                        <span className="group-hover:text-[#005081] transition-colors">{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#005081]/10 via-[#be1800]/5 to-[#005081]/10 p-12 flex items-center justify-center shadow-2xl">
                    <div className="text-center">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Lightbulb className="w-32 h-32 text-[#005081] mx-auto mb-6" />
                      </motion.div>
                      <p className="text-lg font-bold text-slate-900">Staying ahead in a competitive market</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Goals - Dark Theme */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#fff_1px,_transparent_1px)] bg-[length:40px_40px] opacity-5"
          />

          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold uppercase tracking-wider mb-4"
              >
                <TrendingUp className="w-4 h-4" />
                Vision
              </motion.div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Future Goals</h2>
              <p className="text-base md:text-lg text-white/90 leading-relaxed">
                At LohaKart, our future goals are centered around advancing our position as a leader in the metal supply chain industry while driving innovation and sustainability.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            >
              {[
                { title: 'AI-Driven Analytics', description: 'Advanced technological solutions for predictive insights and optimization' },
                { title: 'Enhanced Automation', description: 'Streamlined fabrication processes through cutting-edge automation' },
                { title: 'R&D Investment', description: 'Continuous innovation to stay at the forefront of industry trends' },
                { title: 'Sustainable Growth', description: 'Expanding capabilities while maintaining environmental responsibility' }
              ].map((goal, index) => (
                <motion.div
                  key={goal.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' as any }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10 transition-all cursor-default"
                >
                  <h3 className="text-lg md:text-xl font-bold mb-3">{goal.title}</h3>
                  <p className="text-sm md:text-base text-white/80 leading-relaxed">{goal.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 md:py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 md:mb-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005081]/10 border border-[#005081]/20 text-[#005081] text-xs md:text-sm font-bold uppercase tracking-wider mb-6"
              >
                <Users className="w-4 h-4" />
                People
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6">Our Team</h2>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto">
                At LohaKart, our strength lies in our diverse and talented team of industry experts, skilled professionals, and innovative thinkers, all dedicated to delivering exceptional service and solutions.
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-[#005081]/20 via-[#be1800]/20 to-[#005081]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl p-10 md:p-14 lg:p-16 border border-slate-100 shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Our Culture</h3>
                      <p className="text-base text-slate-600 leading-relaxed">
                        We foster a culture of collaboration, mutual respect, and continuous learning, enabling our team members to grow and excel. With experience spanning various sectors, we understand the unique challenges our clients face.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Our Commitment</h3>
                      <p className="text-base text-slate-600 leading-relaxed">
                        We are committed to pushing the boundaries of what's possible in the metal supply chain. Together, we strive to provide the highest quality service, ensuring our partners and clients achieve their goals.
                      </p>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center pt-8 border-t border-slate-200"
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => navigate('/contact')}
                        className="bg-[#005081] hover:bg-[#003d63] text-white px-8 py-6 rounded-2xl font-bold text-base transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-3 group"
                      >
                        Join Our Team
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-[#005081]/10 rounded-full blur-3xl"
          />

          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-[#be1800]/10 rounded-full blur-3xl"
          />

          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6"
              >
                Ready to Transform Your Supply Chain?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg text-slate-600 leading-relaxed mb-10"
              >
                Join thousands of businesses optimizing their metal procurement with LohaKart
              </motion.p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-[#005081] hover:bg-[#003d63] text-white px-10 py-6 rounded-2xl font-bold text-base transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-3 group"
                  >
                    Get Started
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/products')}
                    className="border-2 border-[#005081] text-[#005081] hover:bg-[#005081] hover:text-white px-10 py-6 rounded-2xl font-bold text-base transition-all shadow-lg hover:shadow-xl"
                  >
                    View Products
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}