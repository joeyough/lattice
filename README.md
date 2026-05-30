# Lattice — Engagement Platform Demo

A reverse-engineered template for the public-affairs / land-use lobbying vertical: a public-facing project engagement site, an internal ops command dashboard for the lobbying firm, and a builder console for scaffolding new projects. One React app, three surfaces, two visual styles.

This is a **demo template** — the front-end is wired, the back-end is stubbed. The intent is to demonstrate the product architecture and design direction at a level a sophisticated buyer (government-affairs firm, civic-tech investor, MSP partner) can react to.

---

## What's inside

### Three surfaces, toggleable from the top bar

| Surface | Who sees it | What it does |
|---|---|---|
| **Public** | Residents, business owners, agencies | Project information, document Q&A with cited AI answers, interactive map with pin-drop comments, comment portal with real-name + ZIP verification, "How we're listening" responsiveness matrix, hearing schedule with one-click supporter activation. Phase-aware — content reshapes as the entitlement moves from pre-submittal → referral → hearing prep. |
| **Internal** | The lobbying firm's ops team | Comment cluster analytics (BERTopic-style), opposition heuristic heatmap, AI-drafted "we heard you" response queue with human approval, council-member tracker, daily AI insights digest. |
| **Builder** | The platform owner | Sequential setup wizard: project basics → jurisdiction & document ingestion → site/zoning → process timeline → stakeholders → AI configuration → branding & disclosure → launch. The ingestion step runs an animated terminal showing the real RAG pipeline work (parsing, hierarchical chunking, embeddings, pgvector indexing, citation validation). |

### Two visual styles, toggleable

- **Editorial (Style A)** — Bloomberg / Brookings aesthetic. Fraunces + IBM Plex. Cream and navy with burnt-orange accent. The Palantir-coded version.
- **Accessible (Style B)** — Civic-tech aesthetic targeting WCAG 2.1 AA. **Atkinson Hyperlegible** (literally designed for low vision) + **Public Sans** (the USWDS standard). Larger type, plain English, high contrast, light theme for both public and internal views. The version a 65-year-old HOA president can actually use.

---

## Running it

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`. Toggle Style, View, and Phase from the top bar.

---

## Architecture (what's not built yet)

This pack is the front-end template. To make this a real product:

| Layer | Tool |
|---|---|
| Auth + RBAC (the AI gate) | Clerk |
| DB + vectors | Postgres on Neon + pgvector |
| ORM | Drizzle |
| Document ingestion | Unstructured.io + custom hierarchical chunker |
| AI generation | Anthropic Claude API + Voyage embeddings |
| Map data | Mapbox GL JS + ArcGIS Feature Services |
| Multi-channel comment ingestion | Resend (email) + Twilio (SMS/voicemail → Whisper) |
| Hosting | Vercel (front) + Neon (db) + Railway (workers) |
| Audit + compliance | Postgres RLS + custom audit log table |

Hosting cost per active project at scale: **~$200–400/month**.

---

## Built with

- React 18 + Vite
- Tailwind CSS
- Recharts (data viz)
- Lucide React (icons)
- Atkinson Hyperlegible, Public Sans, Fraunces, IBM Plex Sans/Mono (Google Fonts, loaded inline)

---

## What's intentionally NOT in the demo

- Real auth / RBAC (mocked via UI toggle)
- Real document ingestion (the terminal animation is scripted — but the architecture it implies is real)
- Real map data (SVG-rendered mock with abstracted parcels)
- Real comment moderation pipeline
- Backend persistence (everything is local state)
- Production accessibility audit (Style B targets WCAG 2.1 AA but a full ARIA + screen-reader pass is needed before shipping)

---

## License

Proprietary / unlicensed. Demo only. Do not redistribute without permission.
