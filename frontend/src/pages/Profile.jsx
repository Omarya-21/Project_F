import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Shield, Clock, Settings, Package } from 'lucide-react';
import '../styles/Profile.css';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-8 mb-12 bg-gray-900/50 p-8 rounded-3xl border border-gray-800">
          <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-4xl italic">
            {user?.name?.[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">{user?.name}</h1>
            <p className="text-gray-500 font-mono text-sm tracking-widest">{user?.email}</p>
            <div className="flex gap-2 mt-4">
              <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic">{user?.role} Access</span>
              <span className="bg-gray-800 text-gray-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic">Sector Verified</span>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl">
            <h3 className="text-xl font-black mb-8 border-b border-gray-800 pb-4 flex items-center gap-2 uppercase italic tracking-widest">
              <Settings size={20} className="text-blue-500" /> Security Node
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-gray-500 mb-2">Password Status</label>
                <div className="text-sm font-bold text-white flex justify-between items-center">
                  <span>ENCRYPTED_SHA256</span>
                  <button className="text-blue-500 hover:text-white transition-colors">UPDATE</button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-gray-500 mb-2">MFA Status</label>
                <div className="text-sm font-bold text-gray-600">INACTIVE</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl">
            <h3 className="text-xl font-black mb-8 border-b border-gray-800 pb-4 flex items-center gap-2 uppercase italic tracking-widest">
              <Clock size={20} className="text-blue-500" /> Logged Ops
            </h3>
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <Package size={40} className="text-gray-800 mb-4" />
              <p className="text-gray-600 text-sm italic">No recent deployment logs found in this sector.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
