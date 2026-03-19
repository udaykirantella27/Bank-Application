'use client';

export default function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pl-1">
          <div>
            <h1 className="text-[32px] font-extrabold text-[#0f172a] tracking-tight">Accounts Overview</h1>
            <p className="text-[#64748b] text-[15px] mt-1">Manage and track your financing applications securely.</p>
          </div>
          <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm self-start sm:self-auto">
            Cancel Application
          </button>
        </div>

        {/* Application Card */}
        <div className="bg-white rounded-t-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-12 min-h-[500px]">
          
          <div className="text-center mb-10 pt-2">
            <h2 className="text-2xl font-bold text-[#00b074] mb-2">Apply with QuincyBlessy</h2>
            <p className="text-gray-500 text-[15px]">Get approved in minutes with our streamlined process.</p>
          </div>

          <form className="max-w-3xl mx-auto space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-gray-700">Loan Amount ($)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] text-gray-900 focus:ring-1 focus:ring-[#00b074] focus:border-[#00b074] outline-none placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-gray-700">Term Duration</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] text-gray-900 focus:ring-1 focus:ring-[#00b074] focus:border-[#00b074] outline-none appearance-none bg-white">
                  <option>12 Months</option>
                  <option>24 Months</option>
                  <option>36 Months</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-gray-700">Employment Type</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] text-gray-900 focus:ring-1 focus:ring-[#00b074] focus:border-[#00b074] outline-none appearance-none bg-white">
                  <option>Full-time Employed</option>
                  <option>Self-Employed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-gray-700">Monthly Salary ($)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 4000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] text-gray-900 focus:ring-1 focus:ring-[#00b074] focus:border-[#00b074] outline-none placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-[13px] font-bold text-gray-700">Primary Purpose</label>
              <textarea 
                rows={4}
                placeholder="Please briefly explain why you need this loan..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] text-gray-900 focus:ring-1 focus:ring-[#00b074] focus:border-[#00b074] outline-none placeholder:text-gray-300 resize-none"
              />
            </div>
            
          </form>

        </div>

      </div>
    </div>
  );
}
