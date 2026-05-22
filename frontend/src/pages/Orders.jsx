import { useState, useEffect } from 'react';
import { getMyOrders, cancelOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, Truck, CreditCard, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(!!user);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error("Orders load failed:", err);
      setError('Failed to fetch your order history.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderID) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action will restore product quantities to stock and is irreversible.')) {
      return;
    }
    try {
      setError('');
      await cancelOrder(orderID);
      // reload
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error("Order cancellation failed:", err);
      setError(err.response?.data?.message || 'Failed to cancel the order. Please try again.');
    }
  };

  useEffect(() => {
    let active = true;
    if (user) {
      const fetchOnMount = async () => {
        try {
          const data = await getMyOrders();
          if (active) {
            setOrders(data);
          }
        } catch (err) {
          console.error("Orders load failed:", err);
          if (active) {
            setError('Failed to fetch your order history.');
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };
      fetchOnMount();
    }
    return () => {
      active = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="pt-24 pb-20 text-center px-4">
        <div className="max-w-md bg-gray-900 border border-gray-800 p-8 rounded-3xl mx-auto shadow-xl">
          <Package size={50} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Access Locked</h2>
          <p className="text-gray-400 mb-6">Please log in to see your build order history.</p>
          <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all inline-block">
            Log In now
          </Link>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-green-500/10 text-green-500 border border-green-500/30';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border border-red-500/30';
      default:
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/30';
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Your Orders</h1>
          <p className="text-gray-400 text-sm mt-1">Track status and dispatch logs of your premium parts</p>
        </div>
        <button 
          onClick={fetchOrders} 
          className="p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-all flex items-center gap-2 text-xs uppercase tracking-widest font-black"
          title="Refresh List"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading your components list...</div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-6 rounded-2xl text-center">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-16 rounded-3xl text-center">
          <Package size={50} className="text-gray-800 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">No PC parts ordered yet</h3>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Build your dream workstation today and place your first order!</p>
          <Link to="/products" className="bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-wider text-xs hover:bg-blue-600 hover:text-white transition-all">
            Browse Inventory
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <motion.div 
              key={order.orderID}
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden"
            >
              {/* Order Header Info */}
              <div className="p-6 md:p-8 border-b border-gray-800 bg-gray-800/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-mono text-gray-500">ORDER #{order.orderID}</span>
                    <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <Clock size={12} />
                    <span>Placed on {new Date(order.order_date).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                  <div>
                    <span className="text-xs text-gray-500 block uppercase tracking-wider font-bold">Total Paid</span>
                    <span className="text-2xl font-black text-blue-500 font-mono">${parseFloat(order.total_price).toFixed(2)}</span>
                  </div>
                  {order.status?.toLowerCase() === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.orderID)}
                      className="px-3 py-1.5 bg-red-600/15 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Items in Order */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="divide-y divide-gray-800/60">
                  {order.items?.map((item) => (
                    <div key={item.orderItemID} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-gray-800 bg-gray-900" />
                        ) : (
                          <div className="w-14 h-14 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center text-gray-600">
                            <Package size={20} />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-white text-sm hover:text-blue-500 transition-colors">
                            <Link to={`/products/${item.productID}`}>{item.name}</Link>
                          </h4>
                          <span className="text-xs text-gray-500">{item.brand}</span>
                        </div>
                      </div>
                      <div className="text-right sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end border-t border-gray-850 sm:border-t-0 pt-2 sm:pt-0">
                        <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                        <span className="font-mono text-sm text-gray-300 font-bold">${parseFloat(item.price).toFixed(2)} each</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Details inside orders */}
                <div className="mt-8 pt-6 border-t border-gray-800/80 flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-1 mb-2">
                      <Truck size={12} className="text-blue-500" /> SHIPPING DESTINATION
                    </span>
                    <p className="text-xs text-gray-300 max-w-md">{order.shipping_address || 'Standard Address'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-1 mb-2">
                      <CreditCard size={12} className="text-blue-500" /> PAYMENT PROCESSOR
                    </span>
                    <p className="text-xs text-gray-400 font-mono">SIMULATION_GATEWAY // SUCCESS // PAID</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
