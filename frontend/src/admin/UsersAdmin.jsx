import { ShieldAlert } from 'lucide-react';
import '../styles/UsersAdmin.css';

export default function UsersAdmin() {
  return (
    <div className="pt-24 pb-20 text-center">
      <ShieldAlert size={60} className="text-red-600 mx-auto mb-6" />
      <h1 className="text-4xl font-black text-white italic uppercase tracking-[0.2em] mb-4">User Management</h1>
      <p className="text-gray-500 max-w-md mx-auto italic">This section is currently being updated. Manage operations through the main dashboard for now.</p>
    </div>
  );
}
