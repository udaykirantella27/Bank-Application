'use client';

import { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, Mail, Phone, Calendar, Shield, UserCircle2 } from 'lucide-react';

interface UserRecord {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  created_at: string;
  loan_count: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 lg:pt-6 lg:px-12 lg:pb-12 max-w-6xl fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-black text-gray-900 tracking-tight">User Directory</h1>
          <p className="text-slate-500 text-sm">Manage customer accounts and permissions</p>
        </div>
        <button onClick={fetchUsers} disabled={loading} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-sm disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00b074]/20 focus:border-[#00b074] outline-none transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Applications</th>
                  <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                          <UserCircle2 className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{user.name || 'Unnamed'}</p>
                          <p className="text-[11px] text-slate-400">{user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs mb-0.5">
                        <Mail className="h-3 w-3 text-slate-400" /> {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <Phone className="h-3 w-3" /> {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${user.role === 'admin'
                          ? 'bg-violet-50 text-violet-700 border-violet-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{user.loan_count || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Calendar className="h-3 w-3" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
