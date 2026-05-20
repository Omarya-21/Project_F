import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Zap, Shield, ChevronLeft, ChevronRight, Layers, Database, HardDrive, CircleDollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const HERO_SLIDES = [
  {
    title: "NEXT-GEN GAME STATIONS",
    subtitle: "Uncompromising frames and tactical thermals. Featuring Ryzen™ Zen 5 & GeForce RTX™ 4090.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1200&h=500",
    buttonText: "Browse Graphics Power",
    link: "/category/GPU"
  },
  {
    title: "SURGICAL AI WORKSTATIONS",
    subtitle: "Scale local machine learning and complex calculations with extreme computing solutions.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200&h=500",
    buttonText: "Explore Processors",
    link: "/category/CPU"
  },
  {
    title: "ELITE STORAGE DEPOT",
    subtitle: "Zero bottleneck. Read speeds up to 7,500 MB/s with direct manufacturer warranty protection.",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1200&h=500",
    buttonText: "Upgrade Storage",
    link: "/category/Rom"
  }
];

const CATEGORIES = [
  { name: 'CPU', desc: 'Surgical single-core and multi-threaded cores', path: '/category/CPU', icon: <Cpu className="text-blue-500" size={24} /> },
  { name: 'GPU', desc: 'Powerhouse cards for elite refresh rates', path: '/category/GPU', icon: <Layers className="text-blue-500" size={24} /> },
  { name: 'RAM', desc: 'Ultra-low latency memory channels', path: '/category/RAM', icon: <Zap className="text-blue-500" size={24} /> },
  { name: 'Storage', desc: 'Premium NVMe drives with structural heatsinks', path: '/category/Rom', icon: <HardDrive className="text-blue-500" size={24} /> },
  { name: 'Motherboard', desc: 'Foundational sockets and high-power VRMs', path: '/category/Motherboard', icon: <Database className="text-blue-500" size={24} /> },
  { name: 'PSU', desc: 'Certified clean power delivery blocks', path: '/category/PSU', icon: <CircleDollarSign className="text-blue-500" size={24} /> }
];

const BRANDS = [
  { name: 'NVIDIA', type: 'GPU & AI' },
  { name: 'AMD', type: 'CPU & Radeon' },
  { name: 'INTEL', type: 'Core Processor' },
  { name: 'ASUS ROG', type: 'Mainboards' },
  { name: 'CORSAIR', type: 'RAM & Cooling' },
  { name: 'MSI', type: 'Gaming Gear' },
  { name: 'GIGABYTE', type: 'Aorus Series' },
  { name: 'WD_BLACK', type: 'Gaming Storage' }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="pt-20 space-y-24">
      {/* 1. Dynamic Hero Picture Slider */}
      <section className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden bg-black/40 border-b border-gray-900">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%), url(${HERO_SLIDES[currentSlide].image})` }}
            />
          </AnimatePresence>
        </div>

        {/* Slide Copy */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
          <div className="max-w-3xl">
            <motion.span 
              key={`span-${currentSlide}`}
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-xs font-black tracking-[0.3em] text-blue-500 uppercase bg-blue-950/40 border border-blue-800/60 px-4 py-1.5 rounded-full inline-block mb-4"
            >
              Hardware Protocol
            </motion.span>
            
            <AnimatePresence mode="wait">
              <motion.h1
                key={`h1-${currentSlide}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black text-white italic tracking-tighter mb-4 leading-none"
              >
                {HERO_SLIDES[currentSlide].title}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`p-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-300 text-sm md:text-lg mb-8"
              >
                {HERO_SLIDES[currentSlide].subtitle}
              </motion.p>
            </AnimatePresence>

            <motion.div key={`btn-${currentSlide}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Link to={HERO_SLIDES[currentSlide].link} className="inline-flex bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-xl text-xs uppercase tracking-widest italic items-center gap-2 transform transition-all shadow-[0_4px_25px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 cursor-pointer">
                {HERO_SLIDES[currentSlide].buttonText} <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Carousel Direction Controls */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/60 border border-gray-800 rounded-full hover:border-blue-500 hover:text-white text-gray-400 flex items-center justify-center transition-all cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/60 border border-gray-800 rounded-full hover:border-blue-500 hover:text-white text-gray-400 flex items-center justify-center transition-all cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slices Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-8 h-1 transition-all rounded ${currentSlide === i ? 'bg-blue-600' : 'bg-gray-700/60'}`}
            />
          ))}
        </div>
      </section>

      {/* 2. PC Architecture Categories Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center md:text-left mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-widest text-blue-500 uppercase block mb-1">Catalog Matrix</span>
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight text-white leading-none">Browse Components</h2>
          </div>
          <p className="text-gray-400 text-sm max-w-sm">
            Configure, sync, and acquire surgical computer elements perfectly structured for latency and load.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link 
              key={i} 
              to={cat.path}
              className="bg-gray-900 border border-gray-800 hover:border-blue-500 p-8 rounded-2xl group transition-all transform hover:scale-[1.02] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-white uppercase italic tracking-wide group-hover:text-blue-500 transition-colors">{cat.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{cat.desc}</p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs text-blue-500 font-black uppercase tracking-widest select-none">
                Examine Matrix <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Badges Matrix */}
      <section className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-12 border-y border-gray-900">
        <div className="flex bg-gray-900/30 border border-gray-800/30 rounded-2xl p-6 items-start gap-4">
          <Cpu className="text-blue-500 shrink-0" size={32} />
          <div>
            <h3 className="text-sm font-bold text-white uppercase mb-1">Next-Gen Sockets</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Only current standard models AMD AM5 or Intel LGA1700 are cleared for system selection.</p>
          </div>
        </div>
        <div className="flex bg-gray-900/30 border border-gray-800/30 rounded-2xl p-6 items-start gap-4">
          <Zap className="text-blue-500 shrink-0" size={32} />
          <div>
            <h3 className="text-sm font-bold text-white uppercase mb-1">Synergy Checked</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Integrated AI agent runs calculations instantly evaluating component compatibility parameters.</p>
          </div>
        </div>
        <div className="flex bg-gray-900/30 border border-gray-800/30 rounded-2xl p-6 items-start gap-4">
          <Shield className="text-blue-500 shrink-0" size={32} />
          <div>
            <h3 className="text-sm font-bold text-white uppercase mb-1">Lifetime Guard</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Every individual motherboard, chip, block, and chassis comes backed with verified brand warranty.</p>
          </div>
        </div>
      </section>

      {/* 3. Sleek Brand Partner Showcase (Above the Footer) */}
      <section className="py-12 bg-black border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase block mb-8">
            OFFICIAL SHIPMENT & DISTRIBUTOR DEPOT
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 justify-center items-center">
            {BRANDS.map((b, i) => (
              <div 
                key={i} 
                className="bg-gray-900/30 hover:bg-gray-900/85 border border-gray-800/40 p-5 rounded-xl transition-all select-none hover:border-gray-700 text-center"
              >
                <div className="text-sm font-black text-gray-400 uppercase tracking-tighter italic group-hover:text-white">
                  {b.name}
                </div>
                <div className="text-[8px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                  {b.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

