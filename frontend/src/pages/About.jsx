import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Zap, Globe, Package, Users } from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Systems Built', value: '5,000+', icon: <Cpu className="text-blue-500" /> },
    { label: 'Happy Clients', value: '4,800+', icon: <Users className="text-blue-500" /> },
    { label: 'Global Shipping', value: '24/7', icon: <Globe className="text-blue-500" /> },
    { label: 'Certified Parts', value: '10,000+', icon: <ShieldCheck className="text-blue-500" /> },
  ];

  return (
    <div className="pt-24 pb-20 px-4">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6"
        >
          Engineering the <span className="text-blue-600">Future</span> of Computing
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Omar's PC isn't just a store. We are a collection of hardware enthusiasts dedicated to pushing the boundaries of performance, aesthetics, and reliability.
        </motion.p>
      </section>

      {/* Origin Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-black uppercase italic tracking-widest text-blue-500">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Founded in 2024, Omar's PC emerged from a simple observation: the PC building market lacks the transparency and surgical precision that modern power users demand. 
          </p>
          <p className="text-gray-300 leading-relaxed">
            We don't just sell parts; we provide the backbone for your digital life. Whether you're a competitive gamer, an AI researcher, or a creative professional, we treat every component as a critical piece of infrastructure.
          </p>
          <div className="pt-4 flex gap-4">
            <div className="flex items-center gap-2 bg-blue-600/10 text-blue-500 px-4 py-2 rounded-full border border-blue-500/20 text-sm font-bold uppercase italic">
              <Zap size={16} /> Performance First
            </div>
            <div className="flex items-center gap-2 bg-blue-600/10 text-blue-500 px-4 py-2 rounded-full border border-blue-500/20 text-sm font-bold uppercase italic">
              <ShieldCheck size={16} /> 100% Original
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
            <Package size={80} className="text-blue-600 opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Headquarters / R&D Division</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl text-center hover:border-blue-500/50 transition-colors group"
          >
            <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <div className="text-3xl font-black italic text-white mb-1 uppercase tracking-tighter">{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Core Values */}
      <section className="text-center mb-20">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-12">The System Protocol</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-8 bg-gray-900 border border-gray-800 rounded-2xl">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Zap className="text-white" />
            </div>
            <h3 className="text-xl font-bold uppercase italic mb-4">Zero Bottleneck</h3>
            <p className="text-gray-400 text-sm leading-relaxed">We optimize every system path to ensure that hardware synergy is maximized. No wasted potential, no thermal throttling.</p>
          </div>
          <div className="p-8 bg-gray-900 border border-gray-800 rounded-2xl">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <ShieldCheck className="text-white" />
            </div>
            <h3 className="text-xl font-bold uppercase italic mb-4">Verification</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Every component undergoes a 24-point verification process. We only source directly from manufacturers to eliminate counterfeits.</p>
          </div>
          <div className="p-8 bg-gray-900 border border-gray-800 rounded-2xl">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Users className="text-white" />
            </div>
            <h3 className="text-xl font-bold uppercase italic mb-4">Community Focused</h3>
            <p className="text-gray-400 text-sm leading-relaxed">We are builders first. Our support team consists of technicians, not salespeople, ensuring your technical issues are solved instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
