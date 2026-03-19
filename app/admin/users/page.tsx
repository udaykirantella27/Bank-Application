'use client';

export default function AdminUsersPage() {
  return (
    <div className="p-8 sm:p-10 lg:p-12 z-10 max-w-4xl h-full">
      <h1 className="text-[28px] font-black text-gray-900 mb-2">User Directory</h1>
      <p className="text-[#9ca3af] text-[15px] mb-8">
        Manage customer accounts, verify identities, and update access permissions.
      </p>

      <div className="bg-white border-0 shadow-md rounded-xl p-8 flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 font-medium">No users found matching current filters.</p>
      </div>
    </div>
  );
}
