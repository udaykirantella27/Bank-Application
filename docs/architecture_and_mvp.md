# QIB — Architecture & MVP Plan

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    QIB Frontend (Next.js 16)            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Home     │ │ Features │ │ Admin    │ │ Dashboard │  │
│  │ Page     │ │ (6 pages)│ │ Panel    │ │           │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────────────────────────────────────────────┐   │
│  │           AIChatbot (floating widget)            │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────┐ ┌──────────────┐   │
│  │ Navbar   │ │ Features │ │ Auth │ │ Shared       │   │
│  │ (+ menu) │ │ Layout   │ │      │ │ Components   │   │
│  └──────────┘ └──────────┘ └──────┘ └──────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │ API Routes
┌─────────────────────────┴───────────────────────────────┐
│                  Next.js API Layer                       │
│  /api/chatbot  /api/risk-scoring  /api/transactions     │
│  /api/esg      /api/loans         /api/sendPromo        │
│  /api/campaigns /api/notifications /api/documents       │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────┐
│              Supabase (PostgreSQL + Auth + Storage)      │
│  users │ loan_applications │ risk_assessments            │
│  transactions │ api_partners │ data_consents             │
│  esg_scores │ green_investments │ embed_widgets          │
│  chatbot_sessions │ chatbot_messages │ documents         │
│  accessibility_audits │ loan_status                      │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action → React Component → API Route → Supabase Query → Response
                                    ↓ (fallback)
                               Mock Data Engine
                                    ↓
                              JSON Response → UI Update
```

### Chatbot Flow
```
User Input → Intent Classifier → Feature Handler → Response Generator
                                       ↓ (low confidence)
                                 Fallback Handler → Quick Actions
                                       ↓ (escalation)
                                 Human Agent Routing
```

## MVP Plan

### Phase 1 — Foundation (Current ✅)
- [x] 6 advanced feature pages with rich UI
- [x] AI chatbot with simulated responses
- [x] 4 backend APIs (chatbot, risk-scoring, transactions, ESG)
- [x] Extended DB schema (8 new tables with RLS)
- [x] Updated homepage, navbar, admin panel
- [x] Full rebrand to QIB

### Phase 2 — Intelligence (Weeks 1-3)
- [ ] Connect chatbot to OpenAI/Gemini API for dynamic responses
- [ ] Real ML model integration for risk scoring (TensorFlow.js)
- [ ] Live UPI 3.0 payment gateway integration
- [ ] Push notifications for transaction alerts

### Phase 3 — Open Banking (Weeks 4-6)
- [ ] OAuth 2.0 authorization server implementation
- [ ] Partner onboarding portal with API key management
- [ ] Data consent management UI for customers
- [ ] Webhook system for real-time partner notifications

### Phase 4 — Production Scale (Weeks 7-10)
- [ ] Embedded SDK npm package (@qib/embed-sdk)
- [ ] Real ESG data feeds from carbon credit APIs
- [ ] Automated WCAG testing in CI/CD pipeline
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Mobile-responsive PWA with offline support
