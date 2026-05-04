import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Package, Users, DollarSign, ShoppingCart, TrendingUp, Layers, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 font-black text-slate-400">Booting Analytics Engine...</div>;

    const cards = [
        { title: 'Total Sales', value: `$${data.stats.totalSales.toLocaleString()}`, icon: <DollarSign />, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Inventory count', value: data.stats.productCount, icon: <Package />, trend: '+3', color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Registered Users', value: data.stats.userCount, icon: <Users />, trend: '+24', color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Total Orders', value: data.stats.orderCount, icon: <ShoppingCart />, trend: '+5.2%', color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 blur-[100px] opacity-10 pointer-events-none"></div>
                <div className="relative z-10 text-center md:text-left">
                    <h1 className="text-4xl font-black mb-2 tracking-tighter">Command <span className="text-blue-500">Center</span></h1>
                    <p className="text-slate-400 font-medium">System performance metrics and real-time inventory control.</p>
                </div>
                <div className="flex gap-4 mt-6 md:mt-0">
                    <Link to="/admin/products" className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
                        <Layers size={18} /> Catalog
                    </Link>
                    <Link to="/admin/orders" className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30">
                        <ClipboardList size={18} /> Orders
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden transition-all hover:bg-slate-50">
                        <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                            {card.icon}
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{card.title}</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{card.value}</h3>
                        <div className="mt-4 flex items-center gap-1.5">
                            <span className={`text-xs font-black ${card.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                {card.trend}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Since last week</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <TrendingUp className="text-blue-600" /> Revenue Flow
                        </h3>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold text-slate-400">Last 7 Units</div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.salesByDay}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff', padding: '12px' }}
                                    itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-10">
                        <LayoutGrid className="text-purple-600" /> High Velocity SKUs
                    </h3>
                    <div className="space-y-6 flex-grow">
                        {data.topProducts.map((p, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs shrink-0">
                                    0{i+1}
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{p.name}</p>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                                        <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${(p.sold / data.topProducts[0].sold) * 100}%` }}></div>
                                    </div>
                                </div>
                                <span className="font-black text-blue-600 text-sm pl-4">{p.sold}</span>
                            </div>
                        ))}
                        {data.topProducts.length === 0 && (
                            <p className="text-slate-400 font-medium italic text-center py-10">Waiting for movement data...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
