import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronRight, Hash } from 'lucide-react';
import { motion } from 'motion/react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my-orders');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} className="text-amber-500" />;
            case 'shipping': return <Truck size={16} className="text-blue-500" />;
            case 'delivered': return <CheckCircle size={16} className="text-emerald-500" />;
            case 'cancelled': return <XCircle size={16} className="text-red-500" />;
            default: return null;
        }
    };

    if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center font-bold">Retrieving build history...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Order <span className="text-blue-600">History</span></h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                    <Package size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500 font-bold">No orders found.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, i) => (
                        <motion.div 
                            key={order.order_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:border-blue-200 transition-colors"
                        >
                            <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6 text-center md:text-left">
                                    <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-xl shadow-slate-900/20">
                                        <Hash size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Reference ID</p>
                                        <h3 className="text-xl font-black text-slate-900">#NXS-{order.order_id.toString().padStart(6, '0')}</h3>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-10 justify-center">
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                                            {getStatusIcon(order.status)}
                                            <span className="text-xs font-bold capitalize text-slate-700">{order.status}</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Investment</p>
                                        <p className="text-sm font-black text-slate-900">${order.total_price.toLocaleString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Placed On</p>
                                        <p className="text-sm font-bold text-slate-700">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <button className="flex items-center gap-2 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 px-6 py-3 rounded-xl font-bold transition-all border border-transparent hover:border-blue-100">
                                    View Log <ChevronRight size={18} />
                                </button>
                            </div>
                            
                            {/* Simple inline progress bar */}
                            <div className="h-1 bg-slate-100 w-full overflow-hidden">
                                <div className={`h-full ${order.status === 'delivered' ? 'bg-emerald-500 w-full' : order.status === 'shipping' ? 'bg-blue-500 w-2/3' : order.status === 'cancelled' ? 'bg-red-500 w-full' : 'bg-amber-500 w-1/3'}`}></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
