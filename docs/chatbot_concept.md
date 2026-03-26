# QIB AI Chatbot — Concept Document

## Persona
**Name**: QIB AI Assistant  
**Role**: Digital Banking Companion  
**Tone**: Professional, friendly, concise. Uses emoji sparingly for warmth.  
**Personality**: Helpful expert who simplifies complex banking into clear guidance.

## Capabilities
| Capability | Description |
|---|---|
| Loan Management | Status checks, EMI calculators, application guidance |
| Risk Analysis | Credit score explanations, improvement tips |
| Payments | Payment method recommendations, transaction status |
| ESG Reports | Sustainability scores, green portfolio summaries |
| Feature Navigation | Guides users to relevant feature pages |
| Account Help | Balance inquiries, security alerts, document uploads |

## Conversation Flows

### Happy Path
```
User: "What is my loan status?"
Bot: Shows loan details (ID, amount, EMI, next due date)
Bot: Offers follow-up actions (payment history, download statement)
```

### Escalation Path
```
User: "I want to dispute a charge"
Bot: Acknowledges the request
Bot: Collects basic info (transaction ID, date, amount)
Bot: Routes to human agent with context pre-filled
```

### Error/Fallback Path
```
User: <unclear message>
Bot: "I can help with loans, payments, risk scores, and more. Could you be more specific?"
Bot: Shows quick action buttons for common tasks
```

## Guardrails
1. **No financial advice** — Informational only, always includes disclaimers
2. **PII protection** — Never displays full account numbers, masks sensitive data
3. **Toxicity filter** — Rejects harmful/abusive content gracefully
4. **Message length** — Max 500 characters per user message
5. **Rate limiting** — Max 30 messages per session to prevent abuse
6. **Audit trail** — All conversations logged for compliance

## Integration Points
- **Routing**: Intent classification routes to feature-specific handlers
- **Fallback**: Unclassified intents → generic help → human agent escalation
- **Data Privacy**: No PII stored in logs, session-based isolation, GDPR compliant
- **APIs**: `/api/chatbot` for responses, `/api/risk-scoring`, `/api/transactions`, `/api/esg` for data

## Accessibility
- Full keyboard navigation (Tab, Enter, Escape)
- ARIA labels on all interactive elements
- Screen reader compatible message structure
- Reduced motion support (respects `prefers-reduced-motion`)
- High contrast text and controls
