'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hexagon, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check mock session
    const storedEmail = localStorage.getItem('bank_user_email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('bank_user_email');
    localStorage.removeItem('bank_user_role');
    window.location.href = '/login';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-0 gap-4">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="transition-transform duration-700 ease-in-out group-hover:rotate-180">
              <Hexagon className="h-8 w-8 text-[#00b074] stroke-[2.5] animate-draw transition-all" />
            </span>
            <span className="font-extrabold text-[#111827] text-2xl tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-[#00b074] to-[#008f5d]">
              QuincyBlessy
            </span>
          </Link>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {email ? (
              <>
                <div className="hidden sm:flex items-center px-4 py-2 bg-white border-0 shadow-sm rounded-full">
                  <span className="text-sm font-medium text-gray-900">{email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-[#00b074] text-white hover:bg-[#009b66] px-5 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}
