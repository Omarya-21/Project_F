import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import { Package, Clock, Truck, ChevronDown, ChevronUp, RefreshCw, ShoppingBag, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Admin orders load error:", err);
      setError('Could not fetch store orders data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchOnMount = async () => {
      try {
        const data = await getAllOrders();
        if (active) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Admin orders load error:", err);
        if (active) {
          setError('Could not fetch store orders data.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchOnMount();
    return () => {
      active = false;
    };
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Soft-update in UI state locally to avoid full loading flash
      setOrders(prev => prev.map(o => o.orderID === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Failed status update:", err);
      alert('Error updating order status.');
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      default:
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Order Processing</h1>
          <p className="text-gray-400 text-sm mt-1">Review active PC build purchases and manage delivery pipelines</p>
        </div>
        <button 
          onClick={fetchOrders}
          disabled={loading}
          className="p-3 bg-gray-950 border border-gray-800 hover:border-blue-500 rounded-xl text-gray-400 hover:text-white transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> {loading ? 'Syncing...' : 'Sync Logs'}
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500 italic font-mono uppercase tracking-widest animate-pulse">
          Fetching terminal order stream...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-6 rounded-2xl text-center font-bold">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-16 rounded-3xl text-center">
          <Package size={50} className="text-gray-800 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2 uppercase">No active operations</h3>
          <p className="text-gray-500">Wait for users to place premium PC part orders to begin dispatching.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = !!expandedOrders[order.orderID];
            return (
              <div 
                key={order.orderID}
                className={`border rounded-3xl overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-gray-900/40 border-gray-700' : 'bg-gray-900/90 border-gray-800/80 hover:border-gray-800'}`}
              >
                {/* Order Summary Row */}
                <div 
                  onClick={() => toggleExpand(order.orderID)}
                  className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 font-bold border border-blue-500/15">
                      #{order.orderID}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-white text-sm">
                          {order.user_name || 'Anonymous Builder'}
                        </span>
                        <span className="text-gray-500 text-xs font-mono">• {order.user_email}</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Clock size={12} />
                        <span>{new Date(order.order_date).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex md:flex-col justify-between md:items-end w-full md:w-auto mt-2 md:mt-0 border-t md:border-t-0 border-gray-800 pt-3 md:pt-0">
                    <span className="text-xs text-gray-400">
                      {order.items?.reduce((ttl, it) => ttl + it.quantity, 0) || 0} Components
                    </span>
                    <span className="text-lg font-black text-blue-500 font-mono">${parseFloat(order.total_price).toFixed(2)}</span>
                  </div>

                  {/* Status Dropdown Controls & Expansion action */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderID, e.target.value)}
                      className={`text-xs font-black uppercase tracking-wider px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 border ${getStatusStyle(order.status)} bg-black cursor-pointer`}
                    >
                      <option value="pending" className="bg-gray-900 text-amber-500">Pending</option>
                      <option value="shipped" className="bg-gray-900 text-blue-500">Shipped</option>
                      <option value="delivered" className="bg-gray-900 text-green-500">Delivered</option>
                      <option value="cancelled" className="bg-gray-900 text-red-500">Cancelled</option>
                    </select>

                    <button 
                      onClick={() => toggleExpand(order.orderID)}
                      className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Row */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t border-gray-800/80 bg-black/30"
                    >
                      <div className="p-6 md:p-8 space-y-6">
                        
                        {/* Ordered Items List */}
                        <div>
                          <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-1.5 mb-4">
                            <ShoppingBag size={12} className="text-blue-500" /> ORDERED PC COMPONENTS
                          </h4>
                          <div className="bg-gray-950 rounded-2xl border border-gray-800/50 p-4 divide-y divide-gray-900">
                            {order.items?.map((item) => (
                              <div key={item.orderItemID} className="py-4 flex justify-between items-center first:pt-0 last:pb-0 gap-4">
                                <div className="flex items-center gap-4">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-gray-900" />
                                  ) : (
                                    <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-gray-600">
                                      <Package size={18} />
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-bold text-white text-xs block">{item.name}</span>
                                    <span className="text-[10px] text-gray-500">{item.brand} (ID: {item.productID})</span>
                                  </div>
                                </div>
                                <div className="text-right flex flex-col">
                                  <span className="text-xs text-gray-400 font-bold">Qty: {item.quantity}</span>
                                  <span className="text-xs text-gray-500 font-mono">${parseFloat(item.price).toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Logistics / Dispatch destinations */}
                        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-850">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-1.5 mb-2">
                              <Truck size={12} className="text-blue-500" /> Shipping Address
                            </span>
                            <p className="text-xs text-gray-300 bg-gray-950 p-3 rounded-xl border border-gray-850 leading-relaxed font-mono">
                              {order.shipping_address || 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-1.5 mb-2">
                              <Activity size={12} className="text-blue-500" /> Transaction details
                            </span>
                            <div className="bg-gray-950 p-3 rounded-xl border border-gray-850 space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Method:</span>
                                <span className="text-gray-300 font-mono">Simulated Card Payment</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Clearance Status:</span>
                                <span className="text-green-500 font-bold uppercase">Authorized</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
