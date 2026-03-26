'use client';

import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, Clock, IndianRupee, Search, RefreshCw, Filter, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Application {
  id: string;
  user_id: string;
  name: string;
  email: string;
  loan_amount: number;
  loan_purpose: string;
  employment_type: string;
  monthly_salary: number;
  term_months: number;
  status: string;
  created_at: string;
}

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchApps = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('loan_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter && filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) {
         console.error('Supabase query error:', error);
         return;
      }

      // Map raw db to Application
      const mappedApps = (data || []).map((app: any) => ({
         id: app.id,
         user_id: app.user_id,
         name: 'Registered Customer',
         email: 'Secure User',
         loan_amount: app.loan_amount,
         loan_purpose: app.loan_purpose,
         employment_type: app.employment_type,
         monthly_salary: app.monthly_salary,
         term_months: app.term_months || 24,
         status: app.status,
         created_at: app.created_at,
      }));

      setApps(mappedApps);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, [filter]);

  const handleAction = async (appId: string, action: 'approved' | 'rejected') => {
    setActionLoading(appId);
    try {
      const { error } = await supabase
        .from('loan_applications')
        .update({ status: action })
        .eq('id', appId);
        
      if (!error) {
        setApps(prev => prev.map(a => a.id === appId ? { ...a, status: action } : a));
        setSelectedApp(null);
      } else {
        console.error('Failed to update status:', error);
      }
    } catch (err) {
      console.error('Failed to update application', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = apps.filter(a =>
    (a.name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[status] || '';
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Loan Applications</h1>
          <p className="text-slate-500 text-sm">Review, approve or reject customer loan applications</p>
        </div>
        <button onClick={fetchApps} disabled={loading} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-sm disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00b074]/20 focus:border-[#00b074] outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="h-12 w-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No applications found</p>
            <p className="text-sm text-slate-400 mt-1">
              {filter !== 'all' ? `No ${filter} applications. Try changing the filter.` : 'Applications will appear here once customers apply.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Applicant</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Purpose</th>
                  <th className="px-6 py-3">Salary</th>
                  <th className="px-6 py-3">Term</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{app.name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{app.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#00b074] flex items-center gap-0.5">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {Number(app.loan_amount).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{app.loan_purpose}</td>
                    <td className="px-6 py-4 text-slate-500">₹{Number(app.monthly_salary).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-slate-500">{app.term_months}M</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(app.status)}`}>
                        {app.status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                        {app.status === 'pending' && <Clock className="h-3 w-3" />}
                        {app.status === 'rejected' && <XCircle className="h-3 w-3" />}
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(app.id, 'approved')}
                              disabled={actionLoading === app.id}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === app.id ? '...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleAction(app.id, 'rejected')}
                              disabled={actionLoading === app.id}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm fade-in" onClick={() => setSelectedApp(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative slide-up" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedApp(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg">&times;</button>
            <h2 className="text-xl font-black text-slate-900 mb-1">Application Details</h2>
            <p className="text-sm text-slate-400 mb-6">ID: {selectedApp.id.slice(0, 8)}...</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[11px] text-slate-400 font-bold uppercase">Name</p><p className="text-sm font-semibold text-slate-800">{selectedApp.name || 'N/A'}</p></div>
                <div><p className="text-[11px] text-slate-400 font-bold uppercase">Email</p><p className="text-sm font-semibold text-slate-800">{selectedApp.email}</p></div>
                <div><p className="text-[11px] text-slate-400 font-bold uppercase">Loan Amount</p><p className="text-sm font-bold text-[#00b074]">₹{Number(selectedApp.loan_amount).toLocaleString('en-IN')}</p></div>
                <div><p className="text-[11px] text-slate-400 font-bold uppercase">Monthly Salary</p><p className="text-sm font-semibold text-slate-800">₹{Number(selectedApp.monthly_salary).toLocaleString('en-IN')}</p></div>
                <div><p className="text-[11px] text-slate-400 font-bold uppercase">Purpose</p><p className="text-sm font-semibold text-slate-800 capitalize">{selectedApp.loan_purpose}</p></div>
                <div><p className="text-[11px] text-slate-400 font-bold uppercase">Employment</p><p className="text-sm font-semibold text-slate-800 capitalize">{selectedApp.employment_type?.replace('_', ' ')}</p></div>
                <div><p className="text-[11px] text-slate-400 font-bold uppercase">Term</p><p className="text-sm font-semibold text-slate-800">{selectedApp.term_months} months</p></div>
                <div><p className="text-[11px] text-slate-400 font-bold uppercase">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>
              </div>
            </div>

            {selectedApp.status === 'pending' && (
              <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => handleAction(selectedApp.id, 'approved')}
                  disabled={actionLoading === selectedApp.id}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve Loan
                </button>
                <button
                  onClick={() => handleAction(selectedApp.id, 'rejected')}
                  disabled={actionLoading === selectedApp.id}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <XCircle className="h-4 w-4" /> Reject Loan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
