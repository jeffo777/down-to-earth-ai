---
description: Project content rules for Down To Earth AI website
---

# Content Rules — READ BEFORE ANY WORK

## CRITICAL: Unique AI-Generated Content Only

Every single page on the Down To Earth AI website MUST contain **100% unique, AI-generated content**.

### Strictly Prohibited:
- **No programmatic content generation** — do not use scripts, loops, or templates to mass-produce page content
- **No content spinning** — do not take one page's content and swap words/phrases to create "variants"
- **No placeholder or Lorem Ipsum text** — every word must be meaningful and final
- **No copy-pasting between pages** — each page's headlines, subheads, scenarios, steps, and FAQs must be written from scratch

### Required For Every Page:
- **"UK" must appear above the fold** — every page must mention "UK" in either the `heroHeadline` or `heroSubhead`. For hub pages use "for UK [Trade]" in the headline (e.g. "AI Receptionist For UK Plumbers"). For channel pages with creative headlines, end the subhead with "Built for UK tradesmen." This is non-negotiable.
- **Never use the name "Jaina"** — the AI receptionist is called "AI receptionist" or "Down To Earth AI receptionist". The name "Jaina" has been retired from all user-facing content.
- **No gendered pronouns for the AI receptionist** — never use "she", "her", "he", or "him" when referring to the AI receptionist. Use "it", "its", "your AI receptionist", or rephrase the sentence. Gendered pronouns are fine for customer characters in scenarios.
- Unique headline and subhead that speaks directly to the specific trade + channel combination
- Unique real-world scenario set in Yorkshire/Leeds with trade-specific terminology
- Unique 3-step "How It Works" section with trade-relevant details
- Unique FAQs (10 per Trade × Channel page, 15 per Lead Generation page) — no duplicates across pages
- UK English spelling and terminology throughout (e.g. "colour" not "color", "recognise" not "recognize")
- UK-specific references: Gas Safe, NICEIC, NAPIT, BPCA, Part P, EICRs, stopcocks, consumer units, letting agents, EPC, etc.
- **Varied UK locations** — use a mix of Yorkshire, other UK regions, and no-location references. Do NOT over-index on Yorkshire/Leeds in FAQs as this signals geographic limitation to Google. Scenarios can use Yorkshire but FAQs should vary widely (e.g. some with no location, some with general UK references, occasional Yorkshire mentions)
- Prices in GBP (£)

### Quality Bar:
Each page should read as if it were hand-written by a copywriter who deeply understands that specific trade. A plumber's page should feel different to read than an electrician's page — different language, different concerns, different scenarios.

## CRITICAL: AI Receptionist Actual Capabilities — DO NOT HALLUCINATE

### Core Interaction Flow (ALL Channels)
Every interaction follows this sequence:
1. **Capture lead details** — name, contact info, location
2. **Understand the nature of the work** — what's the problem, what do they need
3. **Assess urgency** — is this urgent or routine?
4. **Route accordingly** — escalate urgent, or promise callback for routine

> **This workflow is fully customisable per business owner.**

### Tier 1: CONVERSATIONAL — AI Phone Answering + Website Chat
- Full back-and-forth conversation to capture details and provide helpful info
- Answers with the business name, has a real conversation
- Captures: lead details (name, number), problem details, customer requirements
- Provides as much helpful information as possible about the business and services
- Assesses urgency during the conversation
- If urgent → offers escalation to business owner or human receptionist
- If not urgent → explains the business owner will call back as soon as they're free
- Website Chat: people know it's a chatbot — conversational is expected and natural
- **Does NOT**: quote prices, give technical advice, book appointments, diagnose faults remotely

### Tier 2: ONE REPLY ONLY — WhatsApp, Facebook Messenger, Instagram DM, Google Business Profile, Email, SMS
- Captures lead details and nature of work from the customer's message
- Sends ONE professional reply acknowledging the enquiry
- Assesses urgency from the message content
- If urgent → escalation path (business owner first → if no answer, rerouted to Down To Earth human receptionists who call the customer)
- If not urgent → reply tells customer the business owner will call back when free
- **NO back-and-forth conversation**
- **Does NOT**: quote prices, give technical advice, book appointments, diagnose faults, discuss specifications

### Tier 3: FALLBACK — Missed Call Text Back
- The AI receptionist answers every call via AI Phone Answering — MCTB is the safety net
- Activates ONLY if: the customer hangs up before the AI receptionist answers, or the call gets disconnected
- Sends ONE text acknowledging the call: currently busy on a job, will be in touch when finished
- **NO conversation, NO back-and-forth, NO detail capture, NO diagnosis, NO scheduling**

### Escalation Path (applies to all tiers)
- If the enquiry is urgent or the customer requests a human:
  1. Business owner is contacted first
  2. If business owner doesn't answer → rerouted to Down To Earth human receptionists
  3. Human receptionist calls the customer directly

### Urgent Triggers Include:
Active leaks, safety concerns, gas smells, electrical hazards, vulnerable occupants (elderly, children, disabled), insurance compliance deadlines, business-critical breakdowns, security breaches, customer explicitly requesting a human.

### What the AI Receptionist NEVER Does (on any channel)
- ❌ Provides pricing or quotes
- ❌ Gives technical or trade-specific advice
- ❌ Books appointments or schedules visits
- ❌ Diagnoses faults remotely
- ❌ Discusses product specifications or recommendations
- ❌ Has extended multi-message text conversations (phone and website chat only)

## CRITICAL: Pricing Architecture — Centralised JSON Config

### Single Source of Truth: `src/data/pricing.json`

All pricing across the entire site is managed from one file: `src/data/pricing.json`. This file contains every price, fee, minute limit, overage rate, and channel cost. When prices change, update this file first — layouts and the pricing page will automatically reflect the change.

### Current Pricing Model (April 2026)

| Product | Setup | Monthly | Notes |
|---------|-------|---------|-------|
| **AI Receptionist (base)** | £299 | **£45/month** | Includes AI Phone Answering + Website Chat |
| **Additional channels** | — | **£23/month each** | WhatsApp, SMS, Email, Facebook, Instagram, GBP, MCTB |
| **Talk time** | — | 100 minutes included | 20p/min overage |
| **AI Marketing** | £199 | £99/month | Photos-in, content-out |
| **Lead Gen Website** | From £997 | — | One-off build |
| **Custom Automations** | Bespoke | Bespoke | — |

### How Pricing Flows Through the Site

1. **Layouts** (7 total) import `pricing.json` and inject values into:
   - SchemaOrg structured data (`price` attribute)
   - Hero price badges (e.g., "Only £45/month")
   - CTA button fallback text (e.g., "£299 setup · £45/month")

2. **Pricing page** (`pricing.astro`) imports `pricing.json` directly — every price, feature line, and FAQ answer is dynamic.

3. **Individual pages** (200+) have prices in their frontmatter (`heroPrice`, `price` fields) and FAQ prose — these are **hardcoded strings** for SEO purposes but must match `pricing.json` values.

### Rules for Referencing Prices in Content

- **AI Receptionist**: Always say "£45/month" or "£45/mo", never "£99/month" (that's the old price)
- **Base plan includes**: "AI Phone Answering and Website Chat" — always mention both
- **Additional channels**: Always say "£23/month per channel" or "£23 per channel"
- **Talk time**: Always say "100 minutes" — never "5 hours" (old model)
- **Overage**: Always say "20p per minute" or "20p/min"
- **AI Marketing**: "£99/month" is correct — this is the marketing product, NOT the receptionist
- **Setup fee**: "£299" for receptionist, "£199" for marketing
- **No contracts, 30-day money-back guarantee** — always include

### Updating Prices in the Future

1. Edit `src/data/pricing.json` — layouts and pricing page auto-update
2. Run a PowerShell bulk-replace for meta titles, descriptions, and frontmatter (`heroPrice`, `price` fields) across all 200+ pages
3. Manually review and update FAQ prose that mentions specific prices
4. Rebuild: `npx astro build`

