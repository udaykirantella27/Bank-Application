# QIB — Feature Brief

## 1. AI-Driven Risk Scoring
ML models analyze 200+ data points for real-time credit risk assessment with 94.7% accuracy.

- **Models**: XGBoost (94%), LSTM (91%), Random Forest (89%), Logistic Regression baseline (82%)
- **Latency**: Average 14ms per assessment, scoring 1,200+ applications daily
- **Factors**: Payment history (35%), credit utilization (30%), account age (15%), credit mix (10%), recent inquiries (10%)

## 2. Real-Time Payments with Instant Settlement
Sub-second instant settlement via UPI 3.0, IMPS, and next-gen payment rails.

- **Settlement**: UPI 3.0 < 0.5s, IMPS < 2s, RTGS < 5s (vs NEFT at 2-4 hours)
- **Pipeline**: Initiation → Auth → AI Fraud Check → Clearing → Settlement in 340ms end-to-end
- **Throughput**: 30K+ daily transactions, ₹48.2 Cr volume, 99.97% success rate

## 3. Open Banking with Secure APIs
Standards-compliant APIs with OAuth 2.0, mTLS, and JWT for seamless third-party integrations.

- **Endpoints**: 6 core APIs (accounts, payments, transactions, consent, products, consent revocation)
- **Security**: OAuth 2.0 + MFA for sensitive ops, mTLS + JWT for data consent, API key for catalog
- **Partners**: 24 active integrations, 5.1M API calls/day, A+ security score

## 4. Embodied UX for Accessibility
WCAG 2.2 AA/AAA compliant inclusive banking with voice commands and adaptive interfaces.

- **Compliance**: 7/8 WCAG rules passing, Lighthouse score 98/100
- **Modes**: Visual (96%), Auditory (94%), Motor (91%), Cognitive (93%) support
- **Features**: Keyboard-only navigation, voice commands, screen reader optimized, reduced motion support

## 5. Embedded Finance
White-label BNPL, lending widgets, and payment SDKs for partner platforms.

- **Widgets**: BNPL (2,400+ installs), Credit Line (1,800+), Payment Gateway (3,200+), KYC (950+)
- **Partners**: Shopify India, Zomato, MakeMyTrip, Swiggy, Nykaa
- **Revenue**: ₹10.4 Cr from partner integrations

## 6. ESG & Sustainability Analytics
Environmental, Social & Governance impact tracking with AI-powered insights.

- **Score**: Composite ESG 82/100 (AA Rating) — E:85, S:78, G:83
- **Portfolio**: ₹488 Cr across Green Bonds (32%), Renewable Energy (24%), Sustainable Infra (18%)
- **Impact**: 12,400 tonnes CO₂ offset, 8.2M litres water saved, 45 MW clean energy funded
