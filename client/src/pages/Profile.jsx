import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Package, Settings, LogOut, ChevronRight, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-900/5 overflow-hidden"
            >
                {/* Profile Header */}
                <div className="bg-slate-900 p-10 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center gap-10 relative">
                    <div className="absolute inset-0 bg-blue-600 opacity-5 pointer-events-none"></div>
                    <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-2xl ring-8 ring-white/5 relative z-10">
                        <UserIcon size={56} strokeWidth={2.5} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <h1 className="text-4xl font-black text-white leading-none">{user.name}</h1>
                            <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest leading-none">
                                {user.role === 'admin' ? 'System Administrator' : 'Priority Member'}
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-lg">{user.email}</p>
                    </div>
                </div>

                {/* Profile Actions */}
                <div className="p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/orders" className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 group transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                <Package size={24} />
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800">Build History</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Track and manage your previous hardware orders.</p>
                    </Link>

                    <Link to="/cart" className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 group transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                <HardDrive size={24} />
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800">Current Parts</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Review the components currently in your staging area.</p>
                    </Link>

                    <button title='settings' className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 group transition-all text-left">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                <Settings size={24} />
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800">Account Settings</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Update your security credentials and profile information.</p>
                    </button>

                    <button onClick={logout} className="p-6 rounded-3xl bg-red-50 border border-red-50 hover:border-red-200 group transition-all text-left">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                                <LogOut size={24} />
                            </div>
                        </div>
                        <h3 className="text-lg font-black text-red-600">Secure Sign Out</h3>
                        <p className="text-sm font-medium text-red-400 mt-1">End your current session across all build terminals.</p>
                    </button>
                </div>

                <div className="bg-slate-50 p-8 text-center border-t border-slate-100 italic font-medium text-slate-400 text-sm">
                    Member since May 2026 • Verified Hardware Partner
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
