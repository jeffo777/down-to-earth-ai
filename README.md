# Down To Earth AI — Website

> **UK business. Built by a tradesman with 25 years in the trade.**

AI receptionist and lead generation services built exclusively for **UK tradesmen**. This is the Astro-based website at [downtoearthai.co.uk](https://downtoearthai.co.uk).

## Critical Rules for All Agents

1. **UK focus is non-negotiable** — Every page, every piece of content must make it obvious this service is for UK tradesmen. "UK" must appear above the fold in either the `heroHeadline` or `heroSubhead` on every service page.
2. **Never use "Jaina"** — The AI receptionist is called "AI receptionist" or "Down To Earth AI receptionist". The name "Jaina" has been retired from all user-facing content.
3. **All content must be unique** — No programmatic content, no template spinning, no copy-pasting between pages. Every page is hand-crafted.
4. **Pricing comes from one source** — `src/data/pricing.json` is the single source of truth. Never hardcode prices.
5. **Read the full content rules** — See `.agent/workflows/content-rules.md` for complete guidelines before creating or editing any content.

## Tech Stack

- **Framework:** [Astro](https://astro.build) (static site generator)
- **Hosting:** Vercel
- **Domain:** downtoearthai.co.uk

## Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` (must produce 248 pages, 0 errors) |
| `npm run preview` | Preview production build locally |

## Key Files

| File | Purpose |
| :--- | :--- |
| `src/data/pricing.json` | Single source of truth for all prices |
| `.agent/workflows/content-rules.md` | Content rules for all agents |
| `public/llms.txt` | AI-discoverable business summary |
| `public/llms-full.txt` | Comprehensive AI-discoverable documentation |
| `src/layouts/` | 7 layout templates (all include UK trust badge) |
| `src/components/Footer.astro` | Shared footer with UK business tagline |

## Products

- **AI Receptionist** — £45/mo, phone + web chat included, +£23/channel add-ons
- **Lead Generation Websites** — From £997 one-off
- **AI Marketing** — £99/mo
- **Custom AI Automations** — Bespoke pricing

## Trades Served (13)

Plumbers, Electricians, Locksmiths, Gas Engineers, Drainage Engineers, Glaziers, Roofers, HVAC Engineers, Alarm & Security Installers, Pest Control, Garage Door Engineers, Builders, Appliance Repair Engineers
