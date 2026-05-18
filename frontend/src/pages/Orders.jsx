import { Package } from 'lucide-react';
import '../styles/Orders.css';

export default function Orders() {
  return (
    <div className="pt-24 pb-20">
      <h1 className="text-3xl font-black mb-10 text-white italic uppercase tracking-widest">Your Orders</h1>
      <div className="bg-gray-900 border border-gray-800 p-12 rounded-3xl text-center">
        <Package size={48} className="text-gray-800 mx-auto mb-6" />
        <p className="text-gray-500 italic">You haven't placed any orders yet.</p>
      </div>
    </div>
  );
}
