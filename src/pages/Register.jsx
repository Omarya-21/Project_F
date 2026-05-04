import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, UserPlus, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'motion/react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', { name, email, password });
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-600/10 border border-slate-100 overflow-hidden"
            >
                <div className="bg-slate-900 p-8 text-center relative">
                    <div className="absolute inset-0 bg-blue-600 opacity-10 pointer-events-none"></div>
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-2xl text-white shadow-lg relative z-10">
                        <UserPlus size={24} />
                    </div>
                    <h1 className="text-2xl font-black text-white relative z-10">Create Account</h1>
                    <p className="text-slate-400 mt-2 text-sm relative z-10">Join Nexus PC and save your builds.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Full Name</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-semibold"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Email Address</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-semibold"
                                placeholder="name@nexuspc.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Choose Password</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-semibold"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <Shield className="text-blue-600 shrink-0" size={20} />
                        <p className="text-[10px] text-blue-800 font-medium leading-relaxed">
                            By creating an account, I agree to the Nexus PC Terms of Service and acknowledge the compatibility warranty limitations.
                        </p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none mt-2"
                    >
                        {loading ? 'Creating Vault...' : (
                            <>
                                Register Account <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <div className="text-center pt-2">
                        <p className="text-sm font-medium text-slate-500">
                            Already a member? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
