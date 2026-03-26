'use client';

import { useState, useEffect } from 'react';
import { Headphones, Star, Phone, Mail, CheckCircle2, Clock, RefreshCw, Award, Target, Users } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedLoans: number;
  closedLoans: number;
  rating: number;
  status: 'online' | 'away' | 'offline';
  specialization: string;
}

const demoAgents: Agent[] = [
  { id: '1', name: 'Priya Sharma', email: 'priya@qib-bank.com', phone: '+91 98765 43210', assignedLoans: 24, closedLoans: 18, rating: 4.8, status: 'online', specialization: 'Home Loans' },
  { id: '2', name: 'Rajesh Kumar', email: 'rajesh@qib-bank.com', phone: '+91 87654 32109', assignedLoans: 19, closedLoans: 15, rating: 4.6, status: 'online', specialization: 'Business Loans' },
  { id: '3', name: 'Anita Patel', email: 'anita@qib-bank.com', phone: '+91 76543 21098', assignedLoans: 32, closedLoans: 28, rating: 4.9, status: 'away', specialization: 'Personal Loans' },
  { id: '4', name: 'Vikram Singh', email: 'vikram@qib-bank.com', phone: '+91 65432 10987', assignedLoans: 15, closedLoans: 11, rating: 4.5, status: 'offline', specialization: 'Vehicle Loans' },
  { id: '5', name: 'Meera Nair', email: 'meera@qib-bank.com', phone: '+91 54321 09876', assignedLoans: 28, closedLoans: 24, rating: 4.7, status: 'online', specialization: 'Education Loans' },
];

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAgents(demoAgents);
      setLoading(false);
    }, 400);
  }, []);

  const totalAssigned = agents.reduce((s, a) => s + a.assignedLoans, 0);
  const totalClosed = agents.reduce((s, a) => s + a.closedLoans, 0);
  const avgRating = agents.length > 0 ? (agents.reduce((s, a) => s + a.rating, 0) / agents.length).toFixed(1) : '0';
  const onlineCount = agents.filter(a => a.status === 'online').length;

  const statusColors: Record<string, string> = {
    online: 'bg-emerald-400',
    away: 'bg-amber-400',
    offline: 'bg-slate-300',
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Headphones className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Relationship Managers</h1>
            <p className="text-slate-500 text-sm">Track agent performance and loan assignments</p>
          </div>
        </div>
        <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }} disabled={loading} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-sm disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Agents', value: onlineCount, icon: Users, color: '#10b981' },
          { label: 'Assigned Loans', value: totalAssigned, icon: Target, color: '#3b82f6' },
          { label: 'Closed Loans', value: totalClosed, icon: CheckCircle2, color: '#8b5cf6' },
          { label: 'Avg. Rating', value: avgRating, icon: Award, color: '#f59e0b' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${kpi.color}12` }}>
              <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
            </div>
            <p className="text-2xl font-black text-slate-900">{loading ? '—' : kpi.value}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Agent Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-16 text-center text-slate-400">Loading agents...</div>
        ) : (
          agents.map((agent, i) => (
            <div key={agent.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all slide-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                      <span className="text-sm font-black text-indigo-600">{agent.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${statusColors[agent.status]}`} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{agent.name}</p>
                    <p className="text-[11px] text-slate-400">{agent.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-full">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-amber-700">{agent.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <p className="text-lg font-black text-slate-900">{agent.assignedLoans}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Assigned</p>
                </div>
                <div className="bg-emerald-50 rounded-lg px-3 py-2">
                  <p className="text-lg font-black text-emerald-700">{agent.closedLoans}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Closed</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{agent.email}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
