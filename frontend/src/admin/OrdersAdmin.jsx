import { ClipboardList } from 'lucide-react';
import '../styles/OrdersAdmin.css';

export default function OrdersAdmin() {
  return (
    <div className="pt-32 text-center text-gray-500 flex flex-col items-center">
      <ClipboardList size={48} className="mb-4 opacity-20" />
      <span className="font-mono text-xs tracking-widest italic uppercase">No orders found.</span>
    </div>
  );
}
