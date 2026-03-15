'use client';

import { ShieldCheck, Activity, Megaphone, FileText, Users, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Overview', href: '/admin', icon: Activity },
    { name: 'Campaigns', href: '/admin/campaigns', icon: Megaphone },
    { name: 'Applications', href: '/admin/applications', icon: FileText },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Affiliates', href: '/admin/affiliates', icon: LinkIcon },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-white relative overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-100 flex-shrink-0 flex flex-col py-8 px-4 bg-white z-10">
        <div className="mb-6 px-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Admin Control</p>
          <div className="flex items-center gap-2 bg-[#e6f7ec]/50 text-[#00b074] px-3 py-2 rounded-lg font-medium text-sm mb-6">
            <ShieldCheck className="h-4 w-4" />
            Elevated Access
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${isActive ? 'bg-[#0f172a] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#00b074]' : ''}`} />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

    </div>
  );
}
