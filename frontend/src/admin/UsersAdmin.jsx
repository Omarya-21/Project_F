import { useState, useEffect } from 'react';
import { Shield, UserPlus, Users, Search, RefreshCw, Check, AtSign, KeyRound, User } from 'lucide-react';
import { getUsers, updateUserRole } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function UsersAdmin() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // New admin register form state
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [registering, setRegistering] = useState(false);

  const reloadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch stores user list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchOnMount = async () => {
      try {
        const data = await getUsers();
        if (active) {
          setUsers(data);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setError('Failed to fetch store user entries.');
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

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newAdmin.password.length <= 8) {
      setError('Password must contain more than 8 characters.');
      return;
    }

    try {
      setRegistering(true);
      
      // Register through a post request. To prevent logging out the current admin,
      // we bypass the normal registration AuthContext hook and directly hit register endpoint
      // so the logged-in token is preserved, or we create a dedicated route.
      // Wait, register automatically returns token and is usually for a new user,
      // let's build a secure admin-controlled user creation in backend!
      // Let's check backend authController if we can hit normal register, but then the client handles the token manually.
      // It is cleaner to request registration. Since the admin has a dedicated route or is using a custom endpoint,
      // let's check if we can make a custom endpoint in authController/authRoutes, or call standard register endpoint but ignore the response token.
      // Let's see: `const response = await axios.post('/api/auth/register', ...)` is clean.
      const payload = {
        name: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
        role: newAdmin.role
      };
      
      // We will perform a direct axios request so we don't clobber the logged in token in useAuth
      await axios.post('/api/auth/register', payload);

      setSuccess(`Successfully added new ${newAdmin.role}: ${newAdmin.name}!`);
      setNewAdmin({ name: '', email: '', password: '', role: 'admin' });
      reloadUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to register the new user/admin.');
    } finally {
      setRegistering(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    setError('');
    setSuccess('');
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';

    // Prevent active user from removing their own admin status
    if (userId === currentUser?.id) {
      setError('You are forbidden from changing your own administrator permissions.');
      return;
    }

    try {
      await updateUserRole(userId, nextRole);
      setSuccess(`Role changed to ${nextRole} successfully.`);
      reloadUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Access denied. Only registered Admins may modify rosters.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-900 pb-6">
        <div>
          <span className="text-xs font-black tracking-widest text-blue-500 uppercase block mb-1">Roster Management</span>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">User & Admin Matrix</h1>
        </div>
        <button 
          onClick={reloadUsers}
          className="self-start md:self-auto p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-all flex items-center gap-2 text-xs uppercase tracking-widest font-black cursor-pointer"
        >
          <RefreshCw size={14} /> Refresh Directory
        </button>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-800/40 text-red-400 p-4 rounded-xl text-xs font-black uppercase tracking-wider">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="bg-green-950/40 border border-green-800/40 text-green-400 p-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2">
          <Check size={14} /> {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Create User / Admin Form */}
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 p-8 rounded-3xl h-fit space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-blue-500">
            <UserPlus size={20} />
            <h2 className="text-xl font-black uppercase tracking-wide italic">Add New Account</h2>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Registered personnel gain immediate interface entry. First-tier users default to "User", but can be granted administrative privileges here.
          </p>

          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text"
                  required
                  placeholder="Intel Spec Specialist"
                  className="w-full bg-black border border-gray-800 rounded-xl pl-11 pr-4 py-3.5 text-white focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email Registered</label>
              <div className="relative">
                <AtSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="email"
                  required
                  placeholder="specialist@nexus.com"
                  className="w-full bg-black border border-gray-800 rounded-xl pl-11 pr-4 py-3.5 text-white focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Password (8+ chars)</label>
              <div className="relative">
                <KeyRound size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-black border border-gray-800 rounded-xl pl-11 pr-4 py-3.5 text-white focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Roster Role Assignment</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'user', label: 'Standard User' },
                  { id: 'admin', label: 'Administrator' }
                ].map(r => {
                  const isSelected = newAdmin.role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setNewAdmin({ ...newAdmin, role: r.id })}
                      className={`py-3.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-500 text-white' 
                          : 'bg-black border-gray-800 text-gray-500 hover:border-gray-700'
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={registering}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <UserPlus size={14} /> {registering ? 'Creating Account...' : `Authorize ${newAdmin.role === 'admin' ? 'Admin' : 'User'}`}
            </button>
          </form>
        </div>

        {/* Right Side: Users Directory Table */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-gray-800/80">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-blue-500" />
              <h2 className="text-xl font-black uppercase tracking-wide italic">Roster Matrix</h2>
              <span className="text-[10px] bg-gray-800 text-gray-400 font-mono px-2 py-0.5 rounded-full uppercase tracking-widest">
                {users.length} Total Accounts
              </span>
            </div>
            
            {/* Search Input */}
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search name, email, credentials..." 
                className="w-full bg-black border border-gray-800 text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-[9px] uppercase tracking-[0.2em] font-black border-b border-gray-800">
                  <th className="pb-4 pl-4">Account ID</th>
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Email Address</th>
                  <th className="pb-4">Active Authorization</th>
                  <th className="pb-4 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500 italic text-xs">
                      <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-blue-500" /> Loading account logs...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500 italic text-xs">
                      No accounts found matching the search matrix.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = u.userID === currentUser?.id;
                    return (
                      <tr key={u.userID} className="group hover:bg-gray-800/15 transition-colors">
                        <td className="py-4 pl-4 font-mono text-xs text-gray-500">#{u.userID}</td>
                        <td className="py-4 font-bold text-white text-xs">{u.name}</td>
                        <td className="py-4 font-mono text-xs text-blue-400 select-all">{u.email}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            u.role === 'admin' 
                              ? 'bg-red-500/10 text-red-400 border border-red-800/30' 
                              : 'bg-blue-500/10 text-blue-400 border border-blue-800/30'
                          }`}>
                            <Shield size={10} /> {u.role}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-right">
                          {isSelf ? (
                            <span className="text-[10px] text-gray-500 uppercase font-bold italic select-none">Current Admin (You)</span>
                          ) : (
                            <button
                              onClick={() => handleRoleToggle(u.userID, u.role)}
                              className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer ${
                                u.role === 'admin' 
                                  ? 'bg-red-950/20 text-red-400 border-red-900 hover:bg-red-900/40 hover:text-white' 
                                  : 'bg-blue-950/20 text-blue-400 border-blue-900 hover:bg-blue-900/40 hover:text-white'
                              }`}
                            >
                              {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
