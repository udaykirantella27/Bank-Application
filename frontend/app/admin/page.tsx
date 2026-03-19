'use client';

import { useState } from 'react';
import { ShieldCheck, Megaphone, XCircle } from 'lucide-react';

export default function AdminPage() {
  const [email, setEmail] = useState('john@example.com');
  const [phone, setPhone] = useState('+91 9999999999');
  const [amount, setAmount] = useState('50000');
  const [message, setMessage] = useState('Optional custom preamble before the generic offer template...');
  const [loading, setLoading] = useState(false);
  const [successStatus, setSuccessStatus] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorStatus(false);
    setSuccessStatus(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/sendPromo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, amount, message }),
      });

      if (!response.ok) throw new Error('API Error');
      setSuccessStatus(true);
    } catch {
      setErrorStatus(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-8 sm:p-10 lg:p-12 z-10 max-w-4xl h-full">
      {/* Background Watermark */}
      <div className="absolute right-0 top-10 pointer-events-none opacity-[0.03] text-gray-900 transform rotate-12 -translate-y-12 translate-x-12">
        <Megaphone className="w-[40rem] h-[40rem]" />
      </div>

      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Megaphone className="h-8 w-8 text-[#e6f7ec] stroke-[#00b074] stroke-[1.5] fill-[#e6f7ec]" />
          <h1 className="text-[28px] font-black text-gray-900">Send Promotional Loan Offer</h1>
        </div>
        <p className="text-[#9ca3af] text-[15px]">
          Generate secure instant-apply links sent concurrently via Email (Nodemailer) and SMS (MSG91).
        </p>
      </div>

      <form onSubmit={handleSend} className="space-y-6 mt-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 group">
            <label className="block text-[13px] font-bold text-gray-600 transition-colors group-focus-within:text-[#00b074]">Customer Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-white shadow-sm rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-[#00b074]/20 outline-none transition-all hover:shadow-md border-0"
            />
          </div>
          
          <div className="space-y-1.5 group">
            <label className="block text-[13px] font-bold text-gray-600 transition-colors group-focus-within:text-[#00b074]">Customer Phone (Optional)</label>
            <input 
              type="text" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-3.5 bg-white shadow-sm rounded-xl text-sm text-gray-500 focus:ring-2 focus:ring-[#00b074]/20 outline-none transition-all hover:shadow-md border-0"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-2 group">
          <label className="block text-[13px] font-bold text-gray-600 transition-colors group-focus-within:text-[#00b074]">Pre-approved Loan Amount (₹)</label>
          <input 
            type="text" 
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-4 py-3.5 bg-white shadow-sm rounded-xl text-xl font-bold text-[#00b074] focus:ring-2 focus:ring-[#00b074]/20 outline-none transition-all hover:shadow-md border-0"
          />
        </div>

        <div className="space-y-1.5 pt-2 group">
          <label className="block text-[13px] font-bold text-gray-600 transition-colors group-focus-within:text-[#00b074]">Personalized Message</label>
          <textarea 
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full px-4 py-3.5 bg-white shadow-sm rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-[#00b074]/20 outline-none resize-none transition-all hover:shadow-md border-0"
          />
          <p className="text-[11px] text-[#8ea7c5] mt-1 font-medium">
            The secure application link <span className="text-gray-400">&apos;?offer=XYZ&apos;</span> will be injected automatically below this message.
          </p>
        </div>

        {errorStatus && (
          <div className="flex items-center gap-2 px-4 py-3.5 bg-red-50 border border-red-100 rounded-lg mt-4">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-semibold text-red-600">Email sending failed</span>
          </div>
        )}

        {successStatus && (
          <div className="flex items-center gap-2 px-4 py-3.5 bg-emerald-50 border border-emerald-100 rounded-lg mt-4">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-600">Offer link sent successfully</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-3.5 rounded-lg text-[15px] font-bold flex items-center justify-center gap-2 transition-colors focus:ring-4 focus:ring-slate-200 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>Sending Secure Offer Link...</>
            ) : (
              <>
                <Megaphone className="h-4 w-4" />
                Send Secure Offer Link
              </>
            )}
          </button>
        </div>


      </form>
    </div>
  );
}
