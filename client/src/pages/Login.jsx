import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.user);
            toast.success('Logged in successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-600/10 border border-slate-100 overflow-hidden"
            >
                <div className="bg-slate-900 p-10 text-center relative">
                    <div className="absolute inset-0 bg-blue-600 opacity-10 pointer-events-none"></div>
                    <h1 className="text-3xl font-black text-white relative z-10">Welcome Back</h1>
                    <p className="text-slate-400 mt-2 relative z-10">Access your parts and build history.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                                placeholder="name@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                         <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer">Remember me</label>
                         </div>
                         <Link to="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot password?</Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none mt-4"
                    >
                        {loading ? 'Initializing...' : (
                            <>
                                Sign In <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <div className="text-center pt-6 border-t border-slate-100">
                        <p className="text-sm font-medium text-slate-500">
                            Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create a free account</Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
