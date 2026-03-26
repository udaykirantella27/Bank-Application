'use client';

import { LanguageProvider } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            {children}
            <LanguageSwitcher />
        </LanguageProvider>
    );
}
