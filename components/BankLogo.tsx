'use client';

interface BankLogoProps {
    size?: number;
    className?: string;
    animated?: boolean;
}

export default function BankLogo({ size = 36, className = '', animated = true }: BankLogoProps) {
    return (
        <div
            className={`bank-logo-wrapper ${animated ? 'bank-logo-animated' : ''} ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="bank-logo-svg"
                style={{ width: '100%', height: '100%' }}
            >
                {/* Outer glow circle */}
                <circle
                    cx="32"
                    cy="32"
                    r="30"
                    className="bank-logo-glow-ring"
                    fill="none"
                    stroke="url(#logoGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                />

                {/* Shield/badge background */}
                <path
                    d="M32 6 L56 18 V36 C56 48 45 57 32 60 C19 57 8 48 8 36 V18 Z"
                    fill="url(#shieldGradient)"
                    className="bank-logo-shield"
                    strokeLinejoin="round"
                />

                {/* Bank building roof (triangle) */}
                <path
                    d="M32 16 L46 26 H18 Z"
                    fill="white"
                    opacity="0.95"
                    className="bank-logo-roof"
                />

                {/* Roof line */}
                <rect x="16" y="25" width="32" height="3" rx="1" fill="white" opacity="0.9" className="bank-logo-lintel" />

                {/* Pillars */}
                <rect x="20" y="29" width="4" height="14" rx="1.5" fill="white" opacity="0.85" className="bank-logo-pillar bank-logo-pillar-1" />
                <rect x="30" y="29" width="4" height="14" rx="1.5" fill="white" opacity="0.85" className="bank-logo-pillar bank-logo-pillar-2" />
                <rect x="40" y="29" width="4" height="14" rx="1.5" fill="white" opacity="0.85" className="bank-logo-pillar bank-logo-pillar-3" />

                {/* Base/steps */}
                <rect x="14" y="43" width="36" height="3" rx="1" fill="white" opacity="0.9" className="bank-logo-base" />
                <rect x="12" y="46" width="40" height="2.5" rx="1" fill="white" opacity="0.7" className="bank-logo-step" />

                {/* Coin / dollar sign accent */}
                <circle cx="50" cy="14" r="7" fill="url(#coinGradient)" className="bank-logo-coin" />
                <text
                    x="50"
                    y="18"
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="Inter, sans-serif"
                    className="bank-logo-coin-text"
                >
                    ₹
                </text>

                {/* Gradients */}
                <defs>
                    <linearGradient id="logoGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#00b074" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="shieldGradient" x1="8" y1="6" x2="56" y2="60" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#00b074" />
                        <stop offset="50%" stopColor="#009963" />
                        <stop offset="100%" stopColor="#008f5d" />
                    </linearGradient>
                    <linearGradient id="coinGradient" x1="43" y1="7" x2="57" y2="21" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
