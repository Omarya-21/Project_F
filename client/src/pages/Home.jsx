import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Target, ShieldCheck, ArrowRight, Cpu, Monitor, Database } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import './Home.css';

const Home = () => {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/products?limit=8');
                setFeatured(res.data.slice(0, 8));
            } catch (err) {
                console.error(err);
            }
        };
        fetchFeatured();
    }, []);

    const categories = [
        { name: 'Processors', icon: <Cpu />, slug: 'CPU', color: 'bg-blue-500' },
        { name: 'Graphics Cards', icon: <Monitor />, slug: 'GPU', color: 'bg-purple-500' },
        { name: 'Motherboards', icon: <Zap />, slug: 'Motherboard', color: 'bg-amber-500' },
        { name: 'Memory', icon: <Database />, slug: 'RAM', color: 'bg-emerald-500' },
    ];

    return (
        <div className="space-y-16 pb-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2000" 
                        alt="Gaming PC background"
                        className="w-full h-full object-cover opacity-30 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-xl"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                            Ultimate Performance
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                            BEYOND <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">HARDWARE.</span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                            Custom build the PC of your dreams with premium parts and intelligent compatibility validation.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/products" className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 group">
                                Browse Hardware
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
                                Builders Login
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick Categories */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat, i) => (
                        <Link 
                            key={cat.name} 
                            to={`/products?category=${cat.slug}`}
                            className="group p-6 bg-white rounded-3xl border border-slate-200 hover:border-blue-500 transition-all flex flex-col items-center gap-4 text-center shadow-sm hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
                                {React.cloneElement(cat.icon, { size: 32 })}
                            </div>
                            <span className="font-bold text-slate-800">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Featured Components</h2>
                        <p className="text-slate-500">Pick top-rated parts for your next build.</p>
                    </div>
                    <Link to="/products" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                        View All <ChevronRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featured.map((p) => (
                        <ProductCard key={p.product_id} product={p} />
                    ))}
                </div>
            </section>

            {/* PC Builder Promo */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                         <div className="w-full h-full bg-gradient-to-l from-blue-600/30 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                                Intelligent <span className="text-blue-500">Compatibility.</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Don't worry about socket match or wattage issues. Our system checks every part in your cart and warns you about potential conflicts in real-time.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                                <div className="flex items-center gap-3 text-white font-medium">
                                    <ShieldCheck className="text-emerald-500" /> Socket Match
                                </div>
                                <div className="flex items-center gap-3 text-white font-medium">
                                    <Zap className="text-amber-500" /> Wattage Calc
                                </div>
                                <div className="flex items-center gap-3 text-white font-medium">
                                    <Target className="text-blue-500" /> RAM Sync
                                </div>
                            </div>
                            <Link to="/products" className="inline-block bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-colors">
                                Start Your Build
                            </Link>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="relative">
                                <div className="w-64 h-64 md:w-80 md:h-80 bg-blue-600 rounded-full blur-[80px] opacity-20 absolute -top-10 -right-10"></div>
                                <Cpu className="w-48 h-48 md:w-64 md:h-64 text-blue-500/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
