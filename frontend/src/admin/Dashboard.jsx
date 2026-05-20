import { useState, useEffect } from 'react';
import { Package, RefreshCw, BarChart3, Users, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStats, getAllOrders } from '../services/orderService';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [dbStats, setDbStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    activeOrders: 0,
    deliveredShipments: 0,
    totalRevenue: 0,
    stockAlerts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  const loadData = async () => {
    try {
      const statsData = await getStats();
      const ordersData = await getAllOrders();
      setDbStats(statsData);
      setRecentOrders(ordersData.slice(0, 5));
    } catch (err) {
      console.error("Dashboard loaded error:", err);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchOnMount = async () => {
      try {
        const statsData = await getStats();
        const ordersData = await getAllOrders();
        if (active) {
          setDbStats(statsData);
          setRecentOrders(ordersData.slice(0, 5));
        }
      } catch (err) {
        console.error("Dashboard loaded error:", err);
      }
    };
    fetchOnMount();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="pt-24 pb-20">
      <h1 className="text-4xl font-black mb-12 text-white border-l-4 border-blue-600 pl-4 uppercase italic tracking-tighter">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <BarChart3 className="text-blue-500 mb-4" size={32} />
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Revenue</h3>
          <p className="text-3xl font-black text-white">${dbStats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <ClipboardList className="text-blue-500 mb-4" size={32} />
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Active Orders</h3>
          <p className="text-3xl font-black text-white">{dbStats.activeOrders}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
           <Package className="text-blue-500 mb-4" size={32} />
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Stock Alerts</h3>
           <p className={`text-3xl font-black ${dbStats.stockAlerts > 0 ? 'text-red-500' : 'text-green-500'}`}>{dbStats.stockAlerts}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <Users className="text-blue-500 mb-4" size={32} />
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Verified Users</h3>
          <p className="text-3xl font-black text-white">{dbStats.totalUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black uppercase tracking-widest italic">Recent Activity</h2>
            <button onClick={loadData} className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"><RefreshCw size={18} className="text-gray-500" /></button>
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm italic">
                No recent orders placed yet.
              </div>
            ) : (
              recentOrders.map(o => (
                <div key={o.orderID || o.id} className="flex items-center justify-between p-4 bg-black rounded-xl border border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold uppercase">
                      {o.user_name ? o.user_name[0] : 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Order #{o.orderID} - <span className="text-blue-500 uppercase text-xs">{o.status}</span></h4>
                      <p className="text-[10px] text-gray-400 font-mono">
                        Customer: {o.user_name || 'User'} ({o.user_email}) | Total: ${parseFloat(o.total_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-600">{new Date(o.order_date).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 h-fit">
          <h2 className="text-xl font-black mb-8 uppercase tracking-widest italic">Quick Links</h2>
          <div className="space-y-3">
            <Link to="/admin/products" className="block w-full text-center bg-white text-black font-black py-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest text-sm">
              Manage Products
            </Link>
            <Link to="/admin/users" className="block w-full text-center bg-gray-800 text-white font-black py-4 rounded-xl hover:bg-blue-600 transition-all uppercase tracking-widest text-sm">
              Manage Users
            </Link>
            <Link to="/admin/orders" className="block w-full text-center bg-gray-800 text-white font-black py-4 rounded-xl hover:bg-blue-600 transition-all uppercase tracking-widest text-sm">
              Manage Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
