import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { ClipboardList, Clock, Truck, CheckCircle, XCircle, ChevronRight, Hash, User, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import './ManageOrders.css';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/orders');
            setOrders(res.data);
        } catch (err) {
            toast.error('Failed to sync global order registry');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/admin/orders/${id}/status`, { status });
            toast.success(`Unit #${id} set to ${status}`);
            setOrders(orders.map(o => o.order_id === id ? { ...o, status } : o));
        } catch (err) {
            toast.error('Protocol violation: Status update failed');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} className="text-amber-500" />;
            case 'shipping': return <Truck size={16} className="text-blue-500" />;
            case 'delivered': return <CheckCircle size={16} className="text-emerald-500" />;
            case 'cancelled': return <XCircle size={16} className="text-red-500" />;
            default: return null;
        }
    };

    const filtered = statusFilter ? orders.filter(o => o.status === statusFilter) : orders;

    if (loading) return <div className="p-10 font-bold text-slate-400">Synchronizing fulfillments...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Order <span className="text-blue-600">Registry</span></h1>
                    <p className="text-slate-500 font-medium">Global build fulfillment and logistics monitoring.</p>
                </div>
                
                <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                    {['', 'pending', 'shipping', 'delivered', 'cancelled'].map(s => (
                        <button 
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}
                        >
                            {s || 'All Logs'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filtered.map((order, i) => (
                    <motion.div 
                        key={order.order_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:border-blue-200 transition-all group"
                    >
                        <div className="p-8 flex flex-col lg:flex-row items-center justify-between gap-10">
                            <div className="flex items-center gap-6 w-full lg:w-auto">
                                <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-xl shadow-slate-900/20 group-hover:scale-110 transition-transform">
                                    <Hash size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">LOG ID</p>
                                    <h3 className="text-xl font-black text-slate-900 leading-none">#NXS-{order.order_id.toString().padStart(6, '0')}</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-6 flex-grow">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><User size={10}/> Client</p>
                                    <p className="text-sm font-black text-slate-800">{order.user_name || 'Anonymous'}</p>
                                    <p className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]">{order.user_email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Valuation</p>
                                    <p className="text-sm font-black text-slate-900 tracking-tight">${order.total_price.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Chronology</p>
                                    <p className="text-sm font-bold text-slate-700">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</p>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(order.status)}
                                        <span className="text-xs font-black uppercase text-slate-700">{order.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                                <select 
                                    className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                    value={order.status}
                                    onChange={(e) => updateStatus(order.order_id, e.target.value)}
                                >
                                    <option value="pending">Mark Pending</option>
                                    <option value="shipping">Mark Shipped</option>
                                    <option value="delivered">Mark Delivered</option>
                                    <option value="cancelled">Void Order</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Progress visualize */}
                        <div className="h-1 bg-slate-100 w-full">
                             <div className={`h-full transition-all duration-1000 ${order.status === 'delivered' ? 'bg-emerald-500 w-full' : order.status === 'shipping' ? 'bg-blue-500 w-2/3' : order.status === 'cancelled' ? 'bg-red-500 w-full' : 'bg-amber-500 w-1/3'}`}></div>
                        </div>
                    </motion.div>
                ))}

                {filtered.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-200">
                        <ClipboardList size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active logs for this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;
