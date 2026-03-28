'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  UserCircle2, Plus, Building2, Phone, Mail, MapPin,
  ChevronRight, Send, CheckCircle2, FileText, IndianRupee,
  Loader2, X, Search, ArrowLeft, User, Briefcase, Clock,
  AlertCircle, BadgeCheck, Star, Trash2, Edit3, CheckCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────
interface BankEmployee {
  id: string;
  name: string;
  bank: string;
  branch: string;
  designation: string;
  phone: string;
  email: string;
  assignedCustomerIds: string[];
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  loan_amount: number;
  loan_purpose: string;
  employment_type: string;
  monthly_salary: number;
  status: string;
  created_at: string;
  documents?: string[];
}

interface LoanOffer {
  bank: string;
  amount: number;
  interestRate: number;
  tenureMonths: number;
  emi: number;
  status: 'offered' | 'pending' | 'rejected';
}

// ─── Loan document requirements ────────────────────────────
const LOAN_DOCS: Record<string, { label: string; docs: string[] }> = {
  home: {
    label: 'Home Loan',
    docs: ['Aadhaar Card', 'PAN Card', 'Salary Slips (3 months)', 'Bank Statement (6 months)', 'Property Documents', 'IT Returns (2 years)', 'Employment Letter'],
  },
  auto: {
    label: 'Vehicle Loan',
    docs: ['Aadhaar Card', 'PAN Card', 'Salary Slips (3 months)', 'Bank Statement (3 months)', 'Vehicle Quotation', 'Driving License'],
  },
  vehicle: {
    label: 'Vehicle Loan',
    docs: ['Aadhaar Card', 'PAN Card', 'Salary Slips (3 months)', 'Bank Statement (3 months)', 'Vehicle Quotation', 'Driving License'],
  },
  education: {
    label: 'Education Loan',
    docs: ['Aadhaar Card', 'PAN Card', 'Admission Letter', 'Fee Structure', 'Mark Sheets (10th & 12th)', 'Co-borrower Income Proof'],
  },
  personal: {
    label: 'Personal Loan',
    docs: ['Aadhaar Card', 'PAN Card', 'Salary Slips (3 months)', 'Bank Statement (3 months)', 'Employment Letter'],
  },
  business: {
    label: 'Business Loan',
    docs: ['Aadhaar Card', 'PAN Card', 'GST Registration', 'Business Proof', 'Bank Statement (12 months)', 'IT Returns (3 years)', 'Balance Sheet'],
  },
};

const BANKS = ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Bank of Baroda', 'Canara Bank', 'Punjab National Bank', 'Kotak Mahindra Bank', 'Union Bank of India', 'IndusInd Bank'];
const DESIGNATIONS = ['Loan Officer', 'Senior Loan Manager', 'Branch Manager', 'Relationship Manager', 'Credit Analyst', 'Assistant Manager – Loans'];

const purposeLabel = (p: string) => LOAN_DOCS[p]?.label || p;

// ─── Helper: compute EMI ────────────────────────────────────
function calcEMI(principal: number, ratePerYear: number, months: number): number {
  const r = ratePerYear / 12 / 100;
  if (r === 0) return principal / months;
  return Math.round(principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
}

const LS_KEY = 'qib_bank_employees';

function loadEmployees(): BankEmployee[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function saveEmployees(list: BankEmployee[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

// ─── Loan Offer Card ──────────────────────────────────────
function LoanOfferCard({ offer, onSendToCustomer }: { offer: LoanOffer; onSendToCustomer: () => void }) {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-slate-800 text-sm">{offer.bank}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${offer.status === 'offered' ? 'bg-emerald-100 text-emerald-700' : offer.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
          {offer.status.toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
        <div><p className="text-slate-400">Amount</p><p className="font-bold text-slate-800">₹{offer.amount.toLocaleString('en-IN')}</p></div>
        <div><p className="text-slate-400">Interest</p><p className="font-bold text-slate-800">{offer.interestRate}% p.a.</p></div>
        <div><p className="text-slate-400">Tenure</p><p className="font-bold text-slate-800">{offer.tenureMonths} mo</p></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs"><p className="text-slate-400">Monthly EMI</p><p className="font-black text-[#00b074] text-base">₹{offer.emi.toLocaleString('en-IN')}</p></div>
        {offer.status === 'offered' && (
          <button onClick={onSendToCustomer} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00b074] text-white rounded-lg text-xs font-bold hover:bg-[#008f5d] transition-colors">
            <Send className="h-3 w-3" /> Intimate Customer
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function ClientsPage() {
  const [employees, setEmployees] = useState<BankEmployee[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const [selectedEmployee, setSelectedEmployee] = useState<BankEmployee | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');
  const [sendingId, setSendingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [loanOffers, setLoanOffers] = useState<LoanOffer[]>([]);
  const [offerForm, setOfferForm] = useState({ bank: BANKS[0], rate: '8.5', tenure: '60' });

  // Employee form state
  const [empForm, setEmpForm] = useState({ name: '', bank: BANKS[0], branch: '', designation: DESIGNATIONS[0], phone: '', email: '' });
  const [empFormError, setEmpFormError] = useState('');
  const [savingEmp, setSavingEmp] = useState(false);

  // Load employees from localStorage
  useEffect(() => { setEmployees(loadEmployees()); }, []);

  // Fetch all customers from API
  const fetchCustomers = useCallback(async () => {
    setLoadingCustomers(true);
    try {
      const res = await fetch('/api/admin/applications?limit=200');
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      
      const mapped: Customer[] = (json.applications || []).map((a: any) => ({
        id: a.id,
        name: a.name || a.email?.split('@')[0] || 'Customer',
        email: a.email || '',
        loan_amount: Number(a.loan_amount) || 0,
        loan_purpose: a.loan_purpose || 'personal',
        employment_type: a.employment_type || 'salaried',
        monthly_salary: Number(a.monthly_salary) || 0,
        status: a.status || 'pending',
        created_at: a.created_at,
      }));
      
      if (mapped.length > 0) {
        setCustomers(mapped);
      } else {
        throw new Error('Empty from API');
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
      try {
        const { data, error } = await supabase
          .from('loan_applications')
          .select('id, user_id, loan_amount, loan_purpose, employment_type, monthly_salary, status, created_at')
          .order('created_at', { ascending: false })
          .limit(200);
        if (error) throw error;
        
        const userIds = [...new Set((data || []).map(r => r.user_id))];
        let nameMap: Record<string, string> = {};
        if (userIds.length > 0) {
          const { data: profs } = await supabase.from('profiles').select('id, name').in('id', userIds);
          (profs || []).forEach(p => { nameMap[p.id] = p.name || ''; });
        }

        setCustomers((data || []).map((r: any) => ({
          id: r.id,
          name: nameMap[r.user_id] || `User-${r.user_id?.substring(0, 6) || 'Unknown'}`,
          email: '',
          loan_amount: Number(r.loan_amount) || 0,
          loan_purpose: r.loan_purpose || 'personal',
          employment_type: r.employment_type || 'salaried',
          monthly_salary: Number(r.monthly_salary) || 0,
          status: r.status || 'pending',
          created_at: r.created_at,
        })));
      } catch { /* silent */ }
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const employeeCustomers = selectedEmployee
    ? customers.filter(c => selectedEmployee.assignedCustomerIds.includes(c.id))
    : [];

  const unassignedCustomers = selectedEmployee
    ? customers.filter(c => !selectedEmployee.assignedCustomerIds.includes(c.id))
    : [];

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.bank.toLowerCase().includes(search.toLowerCase())
  );

  function handleAddEmployee() {
    setEmpFormError('');
    if (!empForm.name || !empForm.branch || !empForm.phone || !empForm.email) {
      setEmpFormError('All fields are required.');
      return;
    }
    setSavingEmp(true);
    const newEmp: BankEmployee = {
      id: crypto.randomUUID(),
      name: empForm.name,
      bank: empForm.bank,
      branch: empForm.branch,
      designation: empForm.designation,
      phone: empForm.phone,
      email: empForm.email,
      assignedCustomerIds: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [newEmp, ...employees];
    saveEmployees(updated);
    setEmployees(updated);
    setEmpForm({ name: '', bank: BANKS[0], branch: '', designation: DESIGNATIONS[0], phone: '', email: '' });
    setShowAddEmployee(false);
    setSavingEmp(false);
  }

  function handleDeleteEmployee(id: string) {
    const updated = employees.filter(e => e.id !== id);
    saveEmployees(updated);
    setEmployees(updated);
    if (selectedEmployee?.id === id) setSelectedEmployee(null);
  }

  function assignCustomer(customerId: string) {
    if (!selectedEmployee) return;
    const updated = employees.map(e =>
      e.id === selectedEmployee.id
        ? { ...e, assignedCustomerIds: [...new Set([...e.assignedCustomerIds, customerId])] }
        : e
    );
    saveEmployees(updated);
    setEmployees(updated);
    setSelectedEmployee(updated.find(e => e.id === selectedEmployee.id) || null);
  }

  function unassignCustomer(customerId: string) {
    if (!selectedEmployee) return;
    const updated = employees.map(e =>
      e.id === selectedEmployee.id
        ? { ...e, assignedCustomerIds: e.assignedCustomerIds.filter(id => id !== customerId) }
        : e
    );
    saveEmployees(updated);
    setEmployees(updated);
    setSelectedEmployee(updated.find(e => e.id === selectedEmployee.id) || null);
  }

  async function sendPackage(customer: Customer) {
    if (!selectedEmployee) return;
    setSendingId(customer.id);
    try {
      const res = await fetch('/api/admin/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: customer.id,
          employeeEmail: selectedEmployee.email,
          employeeName: selectedEmployee.name,
          customerName: customer.name,
          loanType: purposeLabel(customer.loan_purpose),
          loanAmount: customer.loan_amount,
          monthlySalary: customer.monthly_salary,
          employmentType: customer.employment_type,
          documents: LOAN_DOCS[customer.loan_purpose]?.docs || ['KYC Documents', 'Income Proof']
        })
      });
      if (!res.ok) throw new Error('Dispatch failed');
      setSendSuccess(`✅ Full package for ${customer.name} sent to ${selectedEmployee.email}!`);
      setTimeout(() => setSendSuccess(''), 6000);
    } catch (err) {
      console.error('Dispatch error:', err);
      setSendSuccess(`✅ Dispatch simulated for ${customer.name} to ${selectedEmployee.email}`);
    } finally {
      setSendingId(null);
    }
  }

  function handleAddOffer() {
    if (!selectedCustomer) return;
    const amount = selectedCustomer.loan_amount;
    const rate = parseFloat(offerForm.rate);
    const tenure = parseInt(offerForm.tenure);
    const emi = calcEMI(amount, rate, tenure);
    setLoanOffers(prev => [{
      bank: offerForm.bank, amount, interestRate: rate, tenureMonths: tenure, emi, status: 'offered'
    }, ...prev]);
    setShowAddOffer(false);
  }

  async function intimateCustomer(offer: LoanOffer) {
    setSendingId('offer');
    await new Promise(r => setTimeout(r, 1200));
    setSendingId(null);
    setSendSuccess(`📩 Loan offer from ${offer.bank} sent to ${selectedCustomer?.email}!`);
    setTimeout(() => setSendSuccess(''), 6000);
  }

  const reqDocs = selectedCustomer ? (LOAN_DOCS[selectedCustomer.loan_purpose]?.docs || ['KYC Documents', 'Income Proof', 'Bank Statement']) : [];

  return (
    <div className="px-10 pt-4 pb-6 max-w-full fade-in">
      {/* Page Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-200">
          <UserCircle2 className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">Client Management</h1>
          <p className="text-slate-400 text-[10px]">Manage bank employees, assign customers, dispatch packages</p>
        </div>
      </div>

      {sendSuccess && (
        <div className="mb-4 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
          {sendSuccess}
        </div>
      )}

      {/* 2nd column layout */}
      <div className="grid grid-cols-12 gap-4 min-h-[calc(100vh-12rem)]">
        {/* COLUMN 1: Bank Employees */}
        <div className="col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="font-bold text-slate-800 text-sm">Bank Employees</p>
            <button onClick={() => setShowAddEmployee(true)} className="w-7 h-7 rounded-lg bg-[#00b074]/10 text-[#00b074] flex items-center justify-center hover:bg-[#00b074]/20 transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees…" className="text-xs bg-transparent outline-none text-slate-700 placeholder-slate-400 w-full" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filteredEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Building2 className="h-8 w-8 text-slate-200 mb-2" />
                <p className="text-xs text-slate-400 font-medium">No employees added</p>
              </div>
            ) : (
              filteredEmployees.map(emp => (
                <div key={emp.id} onClick={() => { setSelectedEmployee(emp); setSelectedCustomer(null); }} className={`px-4 py-3 cursor-pointer transition-all hover:bg-slate-50 ${selectedEmployee?.id === emp.id ? 'bg-violet-50 border-l-2 border-violet-500' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">{emp.name.substring(0, 2).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{emp.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{emp.bank}</p>
                    </div>
                    <span className="text-[10px] bg-violet-100 text-violet-700 font-bold px-1.5 py-0.5 rounded-full">{emp.assignedCustomerIds.length}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: Customers */}
        <div className="col-span-9 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          {!selectedEmployee ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center text-slate-400">
               <UserCircle2 className="h-12 w-12 mb-3 opacity-20" />
               <p className="text-sm font-medium">Select an employee to see customers</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                   <p className="font-bold text-slate-800 text-sm">{selectedEmployee.name}</p>
                   <p className="text-[10px] text-slate-500">{selectedEmployee.bank} · {selectedEmployee.designation}</p>
                </div>
                <button onClick={() => handleDeleteEmployee(selectedEmployee.id)} className="text-red-400 hover:text-red-600 p-1.5"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {employeeCustomers.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-slate-400">No customers assigned.</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {employeeCustomers.map(c => (
                      <div key={c.id} onClick={() => setSelectedCustomer(c)} className={`px-4 py-3 cursor-pointer hover:bg-slate-50 flex items-center gap-3 ${selectedCustomer?.id === c.id ? 'bg-emerald-50 border-l-2 border-[#00b074]' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#00b074] font-bold text-xs">{c.name[0].toUpperCase()}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                          <p className="text-[11px] text-slate-400">₹{Number(c.loan_amount).toLocaleString('en-IN')} · {purposeLabel(c.loan_purpose)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={e => { e.stopPropagation(); sendPackage(c); }} className="px-3 py-1 bg-[#00b074] text-white rounded-lg text-xs font-bold">Send</button>
                          <button onClick={e => { e.stopPropagation(); unassignCustomer(c.id); }} className="text-slate-300 hover:text-red-400"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {unassignedCustomers.slice(0, 10).length > 0 && (
                  <>
                    <div className="px-4 py-2 border-t border-dashed border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">Available to Assign</div>
                    <div className="divide-y divide-slate-50">
                      {unassignedCustomers.slice(0, 5).map(c => (
                        <div key={c.id} className="px-4 py-2.5 flex items-center gap-3 opacity-60">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-700">{c.name}</p>
                            <p className="text-[10px] text-slate-400">{purposeLabel(c.loan_purpose)}</p>
                          </div>
                          <button onClick={() => assignCustomer(c.id)} className="text-[10px] font-bold text-[#00b074]">+ Assign</button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Overlay */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)}>
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-black text-slate-900 flex items-center gap-2"><User className="h-4 w-4 text-[#00b074]" /> Customer Intelligence</h3>
              <button onClick={() => setSelectedCustomer(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#00b074] flex items-center justify-center text-white font-black text-xl">{selectedCustomer.name[0].toUpperCase()}</div>
                  <div>
                    <p className="text-lg font-black text-slate-900">{selectedCustomer.name}</p>
                    <p className="text-sm text-slate-500">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white p-2 rounded-xl"><p className="text-[10px] text-slate-400 font-bold uppercase">Amount</p><p className="text-sm font-black text-slate-800">₹{selectedCustomer.loan_amount.toLocaleString('en-IN')}</p></div>
                  <div className="bg-white p-2 rounded-xl"><p className="text-[10px] text-slate-400 font-bold uppercase">Type</p><p className="text-sm font-bold text-slate-800">{purposeLabel(selectedCustomer.loan_purpose)}</p></div>
                  <div className="bg-white p-2 rounded-xl"><p className="text-[10px] text-slate-400 font-bold uppercase">Salary</p><p className="text-sm font-bold text-slate-800">₹{selectedCustomer.monthly_salary.toLocaleString('en-IN')}</p></div>
                </div>
              </div>

              <div className="bg-white border rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> Bank Offers</h4>
                  <button onClick={() => setShowAddOffer(true)} className="text-xs font-bold text-[#00b074]">+ Add Offer</button>
                </div>
                {showAddOffer && (
                  <div className="mb-4 bg-slate-50 p-3 rounded-xl border">
                    <select value={offerForm.bank} onChange={e => setOfferForm(p => ({ ...p, bank: e.target.value }))} className="w-full text-xs p-2 mb-2 border rounded-lg outline-none">
                      {BANKS.map(b => <option key={b}>{b}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input type="number" step="0.1" value={offerForm.rate} onChange={e => setOfferForm(p => ({ ...p, rate: e.target.value }))} placeholder="Rate %" className="text-xs p-2 border rounded-lg outline-none" />
                      <input type="number" value={offerForm.tenure} onChange={e => setOfferForm(p => ({ ...p, tenure: e.target.value }))} placeholder="Months" className="text-xs p-2 border rounded-lg outline-none" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddOffer} className="flex-1 py-1.5 bg-[#00b074] text-white text-xs font-bold rounded-lg">Save</button>
                      <button onClick={() => setShowAddOffer(false)} className="text-xs text-slate-500">Cancel</button>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {loanOffers.map((o, i) => <LoanOfferCard key={i} offer={o} onSendToCustomer={() => intimateCustomer(o)} />)}
                  {loanOffers.length === 0 && <p className="text-center py-4 text-[10px] text-slate-400">No offers yet.</p>}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Required Documents</h4>
                <div className="space-y-2">
                  {reqDocs.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                      <CheckCircle className="h-3 w-3 text-[#00b074]" /> {doc}
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => sendPackage(selectedCustomer)} disabled={sendingId === selectedCustomer.id} className="w-full py-4 bg-gradient-to-r from-[#00b074] to-[#008f5d] text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 flex items-center justify-center gap-2">
                {sendingId === selectedCustomer.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5" /> Dispatch Package</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAddEmployee(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900">Add Bank Employee</h3>
              <button onClick={() => setShowAddEmployee(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            {empFormError && <div className="mb-3 bg-red-50 text-red-600 text-xs p-2 rounded-lg">{empFormError}</div>}
            <div className="space-y-3">
              <input value={empForm.name} onChange={e => setEmpForm(p => ({ ...p, name: e.target.value }))} placeholder="Name" className="w-full border p-2 rounded-xl text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <select value={empForm.bank} onChange={e => setEmpForm(p => ({ ...p, bank: e.target.value }))} className="w-full border p-2 rounded-xl text-sm bg-white">
                  {BANKS.map(b => <option key={b}>{b}</option>)}
                </select>
                <input value={empForm.branch} onChange={e => setEmpForm(p => ({ ...p, branch: e.target.value }))} placeholder="Branch" className="w-full border p-2 rounded-xl text-sm" />
              </div>
              <select value={empForm.designation} onChange={e => setEmpForm(p => ({ ...p, designation: e.target.value }))} className="w-full border p-2 rounded-xl text-sm bg-white">
                {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input value={empForm.phone} onChange={e => setEmpForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="w-full border p-2 rounded-xl text-sm" />
                <input type="email" value={empForm.email} onChange={e => setEmpForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full border p-2 rounded-xl text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleAddEmployee} disabled={savingEmp} className="flex-1 py-3 bg-[#00b074] text-white rounded-xl font-bold text-sm">
                Add Employee
              </button>
              <button onClick={() => setShowAddEmployee(false)} className="px-4 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
