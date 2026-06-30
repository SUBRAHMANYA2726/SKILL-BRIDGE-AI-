import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserX, UserCheck, Shield, Trash2, Search, Download, LogOut, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, blockedUsers: 0, recentRegistrations: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/users?keyword=${search}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('${import.meta.env.VITE_API_URL || ''}/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const usersData = await usersRes.json();
      const statsData = await statsRes.json();

      if (usersRes.ok) setUsers(usersData);
      if (statsRes.ok) setStats(statsData);
    } catch (err) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (token) fetchDashboardData();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const toggleBlockUser = async (id) => {
    if (!window.confirm('Are you sure you want to change this user status?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/users/${id}/block`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('User status updated');
        fetchDashboardData();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to update user');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to completely delete this user? This cannot be undone.')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('User deleted');
        fetchDashboardData();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Email,Phone,Role,Status,Registration Date,Last Login'];
    const rows = users.map(u => 
      `${u._id},${u.fullName},${u.email},${u.phone},${u.role},${u.status},${new Date(u.createdAt).toLocaleDateString()},${u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "skillbridge_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exporting CSV...');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Admin Navbar */}
      <nav className="bg-slate-900 border-b border-white/10 p-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-500" />
          <span className="font-bold text-xl text-white">SkillBridge <span className="text-blue-500">Admin</span></span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-gray-400 text-sm hidden sm:block">Logged in as {user.fullName}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="glass-dark p-6 rounded-xl border border-white/10 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3>
            </div>
          </div>
          <div className="glass-dark p-6 rounded-xl border border-white/10 flex items-center gap-4">
            <div className="p-3 bg-green-500/20 text-green-400 rounded-lg"><UserCheck className="w-6 h-6" /></div>
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <h3 className="text-2xl font-bold text-white">{stats.activeUsers}</h3>
            </div>
          </div>
          <div className="glass-dark p-6 rounded-xl border border-white/10 flex items-center gap-4">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-lg"><UserX className="w-6 h-6" /></div>
            <div>
              <p className="text-gray-400 text-sm">Blocked Users</p>
              <h3 className="text-2xl font-bold text-white">{stats.blockedUsers}</h3>
            </div>
          </div>
          <div className="glass-dark p-6 rounded-xl border border-white/10 flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-lg"><LayoutDashboard className="w-6 h-6" /></div>
            <div>
              <p className="text-gray-400 text-sm">New This Week</p>
              <h3 className="text-2xl font-bold text-white">{stats.recentRegistrations}</h3>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="glass-dark rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> User Management
            </h2>
            
            <div className="flex gap-4 w-full sm:w-auto flex-wrap">
              <button 
                onClick={async () => {
                  try {
                    const res = await fetch('${import.meta.env.VITE_API_URL || ''}/api/admin/sync-jobs', {
                      method: 'POST',
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (res.ok) toast.success(data.message);
                    else toast.error(data.message || 'Failed to sync jobs');
                  } catch (err) {
                    toast.error('Network error triggering sync');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                <Search className="w-4 h-4" /> Force Sync Jobs
              </button>
              <div className="relative flex-1 sm:w-64">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text"
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <button onClick={handleExportCSV} className="bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{u.fullName}</div>
                      <div className="text-xs text-gray-500">ID: {u._id.substring(u._id.length - 6)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">{u.email}</div>
                      <div className="text-gray-500">{u.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex w-fit items-center gap-1 ${u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => toggleBlockUser(u._id)}
                            className={`text-sm font-medium ${u.status === 'active' ? 'text-amber-400 hover:text-amber-300' : 'text-green-400 hover:text-green-300'}`}
                          >
                            {u.status === 'active' ? 'Block' : 'Unblock'}
                          </button>
                          <button 
                            onClick={() => deleteUser(u._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
