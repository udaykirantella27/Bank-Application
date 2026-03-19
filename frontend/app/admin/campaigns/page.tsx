'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Search, Calendar, IndianRupee } from 'lucide-react';

export default function AdminCampaignsPage() {
  const [history, setHistory] = useState<Array<{ id: string, email: string, phone: string, amount: string, sentAt: string, status: string }>>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/campaigns`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch campaign history', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-8 sm:p-10 lg:p-12 z-10 max-w-5xl h-full">
      <div className="flex justify-between items-center text-gray-900 mb-8">
        <div>
          <h1 className="text-[28px] font-black text-gray-900 mb-2">Campaigns Overview</h1>
          <p className="text-[#9ca3af] text-[15px]">
            Manage and track the performance of your active promotional campaigns.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="flex items-center gap-2 bg-white border-0 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      <div className="bg-white border-0 shadow-md rounded-xl text-gray-900 overflow-hidden">
        {/* Table Header Filter Bar */}
        <div className="p-4 bg-gray-50/50 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white shadow-sm border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b074]/20 transition-all hover:shadow-md"
            />
          </div>
          <p className="text-sm font-medium text-gray-500">
            Total Sends: <span className="text-gray-900 font-bold">{history.length}</span>
          </p>
        </div>

        {loading && history.length === 0 ? (
          <div className="p-16 flex justify-center text-gray-400">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="bg-gray-50 p-16 flex flex-col items-center justify-center text-center">
            <p className="text-gray-500 font-medium">No active campaigns.</p>
            <p className="text-sm text-gray-400 mt-2">Generate a promotional offer from the Overview dashboard to start tracking stats.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-gray-700 font-bold uppercase tracking-wider text-[11px] border-0">
                <tr>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Sent At</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/50">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{record.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {record.phone}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold text-[#00b074]">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {parseInt(record.amount).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-300" />
                      {new Date(record.sentAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e6f7ec]/60 text-[#00b074] border border-[#00b074]/20">
                        {record.status}
                      </span>
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
