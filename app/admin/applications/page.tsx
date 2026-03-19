'use client';

export default function AdminApplicationsPage() {
  return (
    <div className="p-8 sm:p-10 lg:p-12 z-10 max-w-4xl h-full">
      <h1 className="text-[28px] font-black text-gray-900 mb-2">Submitted Applications</h1>
      <p className="text-[#9ca3af] text-[15px] mb-8">
        Review customer applications processed via our secure email tracking links.
      </p>

      <div className="bg-white border-0 shadow-md rounded-xl p-8 flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 font-medium">Application queue empty.</p>
      </div>
    </div>
  );
}
