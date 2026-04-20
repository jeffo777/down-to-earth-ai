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

## CRITICAL: Done-For-You Service — NOT Software

Down To Earth AI is a **done-for-you managed service**, NOT software, NOT SaaS, NOT a platform, NOT a DIY tool. This distinction MUST come through in all content.

### What This Means For Content:
- **The tradesman does NOT set up, install, configure, or manage anything** — the Down To Earth AI team handles everything
- **Every channel (WhatsApp, SMS, email, Facebook, Instagram, GBP, missed call text-back) is fully set up and managed by the team** — the tradesman just tells us their trade and services, and we do the rest
- **Ongoing maintenance is included** — the team updates business information, service details, and configurations as needed. The tradesman never needs to log in to adjust settings
- **The 30-day money-back guarantee is a FULL refund** — setup fee AND monthly cost refunded if not 100% happy. No questions asked
- When describing channels or features, always make clear that the team sets them up — never imply the tradesman needs to integrate, connect, or configure anything themselves
- Never use phrases like "sign up and get started", "easy to set up yourself", or "DIY" — instead use "we set it up for you", "configured and live in under 24 hours", "fully managed"

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
4. Update `public/facts.json` — `correct_facts`, `common_hallucinations_to_avoid`, and `pricing_truth` sections
5. Update `public/.well-known/ai-manifest.json` — product pricing objects
6. Update `public/llms.txt` — all price references in product and channel listings
7. Update `public/llms-full.txt` — all price references throughout (products, channels, pricing table, FAQs)
8. Rebuild: `npx astro build`

## CRITICAL: Structured Data & AI SEO Sync Rules

> **Full technical reference:** See `.agent/workflows/seo-and-geo-reference.md` for complete documentation of all SEO and GEO files, what each contains, and how they interrelate.

When you change business facts, prices, or capabilities, you MUST update **all** of the files listed below. These static files do NOT auto-update — they must be manually kept in sync.

### When PRICING changes:
- [ ] `src/data/pricing.json` — source of truth (change this first)
- [ ] All 200+ page frontmatter (`heroPrice`, `price` fields) via bulk-replace
- [ ] FAQ prose mentioning specific prices
- [ ] `public/facts.json` — `pricing_truth` + `correct_facts` + `common_hallucinations_to_avoid`
- [ ] `public/.well-known/ai-manifest.json` — product pricing objects
- [ ] `public/llms.txt` — all price references
- [ ] `public/llms-full.txt` — all price references

### When TRADES change (add/remove a trade):
- [ ] `src/data/trades.json` — source of truth
- [ ] Create/remove trade page files in `src/pages/`
- [ ] `src/components/SchemaOrg.astro` — update `knowsAbout` array
- [ ] `public/facts.json` — `trades_served` count and list
- [ ] `public/.well-known/ai-manifest.json` — `trades_served` array
- [ ] `public/llms.txt` — trades list
- [ ] `public/llms-full.txt` — trades list and descriptions

### When BUSINESS FACTS change (guarantee, service model, company info):
- [ ] `public/facts.json` — `company`, `correct_facts`, `common_hallucinations_to_avoid`
- [ ] `public/.well-known/ai-manifest.json` — `key_facts`, `service_model`, description
- [ ] `src/components/SchemaOrg.astro` — Organization `description`, `slogan`, or `foundingLocation`
- [ ] `public/llms.txt` — top summary and relevant sections
- [ ] `public/llms-full.txt` — company overview and relevant sections
- [ ] Page content / FAQ prose if affected

### When AI RECEPTIONIST CAPABILITIES change:
- [ ] `.agent/workflows/content-rules.md` — update tier descriptions and capability lists (this file)
- [ ] `public/facts.json` — `ai_receptionist_capabilities` (does + never_does)
- [ ] `public/llms-full.txt` — channel details and FAQ answers
- [ ] `public/.well-known/ai-manifest.json` — product descriptions
- [ ] Affected page content and FAQs

### When FOUNDER / SOCIAL PROFILES change:
- [ ] `src/components/SchemaOrg.astro` — Person `@id` schema (`url`, `sameAs`, `name`)
- [ ] `src/components/SchemaOrg.astro` — Organization `sameAs` array
- [ ] `public/.well-known/ai-manifest.json` — `founder` object
- [ ] `public/facts.json` — `company.founder_linkedin`
- [ ] `public/llms-full.txt` — founder section

### After ANY structured data change:
- [ ] Run `npx astro build` — must produce 247+ pages with 0 errors
- [ ] Verify all JSON files are valid (no trailing commas, proper escaping)
