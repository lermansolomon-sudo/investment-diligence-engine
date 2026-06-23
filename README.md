# Investment Scouting & Diligence Engine

An AI-powered investment diligence engine that generates a peer-benchmarked diligence report on any public company in under 90 seconds. Built as a working prototype using React and Anthropic's Claude API with live web search.

Given a stock ticker, the system searches authoritative financial sources in real time, identifies the company's top 10 competitors, computes percentile rankings across 14 key financial metrics, and synthesizes a SWOT analysis, BCG growth-share positioning, risk flags, litigation review, and an analyst-style verdict.

---

## Demo

> *Add a screenshot or short GIF of the running prototype here. Recommended: a screenshot of a completed NVDA or AAPL report showing the metric cards with percentile bars, SWOT grid, and BCG matrix.*

---

## What makes it interesting

- **Live multi-source web search.** Every report is grounded in real data from Yahoo Finance, SEC EDGAR, Reuters, Bloomberg, company investor-relations pages, and more — not training-data knowledge.
- **Peer benchmarking with percentile color coding.** Raw metrics in isolation are close to meaningless. The system identifies 10 direct competitors and shows every metric as a percentile rank vs. that peer group, with a red→amber→green color scale.
- **Directional awareness.** The system understands that higher P/E means more expensive (shown in red) while higher gross margin means stronger (shown in green). Most simple benchmarking tools miss this.
- **SWOT and BCG analysis.** Both are grounded in the actual research the system performed, not generic boilerplate.
- **Agentic loop.** Uses Anthropic's tool-use API to let Claude decide which sources to query, evaluate the results, and continue searching until it has enough to synthesize the report.

---

## How it works

```
User input (ticker)
   │
   ▼
React UI
   │
   ▼
Anthropic API (Claude Sonnet 4) + web search tool
   │
   ▼
Agentic loop:
  → search company financials
  → search news & filings
  → identify and search competitors
  → search litigation & risks
  → synthesize structured JSON output
   │
   ▼
Rendered report:
  metrics with percentile bars · SWOT · BCG · flags · verdict
```

---

## Tech stack

- **React** — single functional component using hooks
- **Anthropic API** (`claude-sonnet-4`)
- **Anthropic web search tool** (`web_search_20250305`)
- No backend, no database — the prototype runs entirely client-side against the Anthropic API

---

## Running it

### Option 1 — Run inside Claude (fastest)

1. Open a new conversation at [claude.ai](https://claude.ai)
2. Paste the contents of `diligence-engine.jsx` and ask Claude to render it as an artifact
3. Enter a ticker and click "Run analysis"

This is the path the prototype was designed for. The Claude artifact environment provides the API authentication automatically.

### Option 2 — Run locally with Vite

```bash
npm create vite@latest diligence-engine -- --template react
cd diligence-engine
npm install
```

Replace `src/App.jsx` with the contents of `diligence-engine.jsx`, then:

```bash
npm run dev
```

Running locally requires an Anthropic API key. The browser will block direct calls to `api.anthropic.com` unless you proxy them through a backend. The cleanest local setup is a small Express or Cloudflare Worker proxy that holds the API key server-side and forwards requests to the Anthropic API.

---

## Features

| Section | Description |
|---|---|
| **Sources panel** | Every domain the system actually searched, surfaced transparently |
| **Badges** | At-a-glance classification (mega cap, profitable, S&P 500, high growth, etc.) |
| **Company snapshot** | 2–3 sentences on business model and market position |
| **Peer group** | The 10 competitors used as the benchmarking set |
| **Metrics** | 14 financial metrics with values, percentile rank vs. peers, and direction-aware color coding |
| **Market summary** | Stock performance, valuation context, analyst sentiment |
| **SWOT** | Strengths, weaknesses, opportunities, threats — grounded in real research |
| **BCG matrix** | Star / Cash Cow / Question Mark / Dog classification with positioning rationale |
| **Recent news** | Significant developments from the searches |
| **Risk flags** | Severity-coded (red / amber / blue) concrete risks |
| **Litigation** | Lawsuits, regulatory actions, controversies |
| **Verdict** | Synthesized analyst summary — thesis, risks, outlook |

---

## Metrics tracked

- Market Cap
- Revenue (TTM)
- Revenue Growth YoY
- Gross Margin
- Net Margin
- EBITDA
- Free Cash Flow
- ROE
- P/E Ratio
- EV/EBITDA
- Debt / Equity
- Current Ratio
- 52-week Return
- 52-week Range

---

## Limitations

- **No inline citations.** The system lists the sources it searched but does not attach a specific citation to each individual claim. This is the next planned feature.
- **Coverage is uneven for small-cap and foreign-listed companies.** Major US-listed companies have rich coverage across the source set; smaller and international companies have spottier data.
- **No caching.** Every report re-runs all searches from scratch. Production would cache popular tickers.
- **No persistence.** Reports are not saved between sessions.

---

## What's next

- **Inline citations.** Attach specific source citations to each claim and numeric value.
- **Predictive layer.** Train a machine learning model on historical company metrics paired with outcomes (growth, stagnation, failure) to surface predictions on whether a company today resembles past winners or laggards.
- **Industry-specific reports.** Tailor the metric set and risk framework by sector (SaaS, biotech, real estate, financials).
- **PDF / DOCX export** for shareable diligence packets.

---

## Background

This prototype was built as the technical challenge for an AI Delivery Lead role. The goal was to demonstrate (a) hands-on ability to build a working AI-powered tool, (b) judgment about scope and architecture under time pressure, and (c) thoughtful use of AI tools as leverage rather than a crutch.

The full delivery plan covering production architecture, phased rollout, risks, and launch readiness is included as a separate document in this repo.

---

## License

MIT
