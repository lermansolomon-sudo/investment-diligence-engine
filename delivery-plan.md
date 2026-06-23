# Investment Scouting & Diligence Engine
## Delivery Plan & Architecture

**Prepared by:** Solomon Lerman
**Engagement context:** Ajaia commercializing the Investment Scouting & Diligence Engine for financial services clients (PE, VC, IB, corporate strategy, family offices) and as an internal asset.

> **Note on prototype vs. plan:** The prototype demonstrates the core agentic workflow end-to-end with live multi-source search, peer benchmarking, SWOT, BCG positioning, and severity-coded risk flags. This delivery plan describes the productionized version of that system. Items in the plan that go beyond the prototype are explicitly the work this engagement scopes.

---

## 1. Solution Architecture

The system is structured as a six-layer agentic AI workflow.

### Layer breakdown

**Data sources (external)**
- Market data: Yahoo Finance, Polygon.io, Alpha Vantage
- Filings: SEC EDGAR (10-K, 10-Q, 8-K, 13F, S-1)
- News: Reuters, Bloomberg, NewsAPI, company IR pages
- Litigation & regulatory: CourtListener, SEC litigation releases, FTC/DOJ press releases
- Fundamentals & peer data: Financial Modeling Prep, Macrotrends
- Optional premium tier: Refinitiv, FactSet (for enterprise clients)

**Ingestion layer**
- On-demand calls at query time for most data (the prototype's model)
- Optional caching for popular tickers to reduce API spend at scale
- Source adapters normalize each API into a unified internal schema
- When the same metric exists on multiple sources, we cross-check and use the consensus value, ignoring any outlier

**Analysis & synthesis layer (the AI core)**
- LLM orchestrator (Claude) with web-search tool access for real-time grounding
- Structured prompting that returns typed JSON for downstream rendering
- Peer-group identification and percentile computation across 10 direct competitors
- SWOT and BCG positioning derived from grounded inputs
- Risk-flag generation with severity classification (red / amber / blue)

**Storage & memory layer**
- Postgres for structured records: companies, peer groups, historical diligence reports
- Vector store for filings and analyst notes (enables semantic search over past reports)
- Cache layer for recently-queried tickers
- Internal audit log of every LLM call: prompt, response, sources, model version, timestamp — used for debugging and quality monitoring, not client-facing

**Workflow orchestration**
- Event-driven pipeline so each layer scales independently
- Retry logic for transient failures
- Human-in-the-loop checkpoint for high-stakes reports (configurable per client tier)

**Output & reporting layer**
- Web app (the prototype's UI, productionized) for interactive use
- PDF / DOCX export for client-shareable reports
- API endpoint for clients embedding diligence into their own workflows
- Every claim attributed to a reputable named source

### Human review & internal quality monitoring
- **Pre-publish analyst review** for reports flagged high-risk (litigation present, contested data, low source agreement)
- **Internal quality monitoring**: our team continuously samples reports against ground-truth source data to catch drift early. Failures here trigger engineering investigation, not client-visible warnings.
- **Client feedback loop**: thumbs up/down on each report section feeds back into prompt tuning

---

## 2. Delivery Phases

| Phase | Duration | Key activities | Exit criteria |
|---|---|---|---|
| **1. Discovery & alignment** | 1–2 weeks | Stakeholder interviews, use-case definition, success metrics, data-source approval, compliance scoping | Signed scope doc, prioritized feature list |
| **2. Data source validation** | 2 weeks | API access provisioning, sample data quality audit, peer-data accuracy testing | Verified data quality on ≥20 test tickers, source SLAs documented |
| **3. Prototype / MVP build** | 3–4 weeks | Core agentic loop, JSON schema, percentile + SWOT + BCG synthesis, basic UI | Working end-to-end flow for any S&P 500 ticker |
| **4. Internal QA & golden-set testing** | 2 weeks | 50-ticker test suite covering edge cases (small-caps, foreign listings, recent IPOs, distressed names), red-team for hallucinations | <5% hallucination rate, all critical risks flagged correctly |
| **5. Pilot launch** | 3–4 weeks | 2–3 design partners use it on real deals, weekly iteration cycles | Strong pilot feedback, 2–3 case studies |
| **6. Iteration & scale-up** | Ongoing | Premium data sources, vertical-specific reports, enterprise SSO, audit trails | First paying client signed |

**Total: ~12–15 weeks from kickoff to first paying client.**

---

## 3. Dependencies & Risks

### Dependencies
- API access agreements with premium data providers (required for commercial deployment, not the prototype)
- LLM provider stability and pricing (Anthropic API as primary, with fallback architecture)
- Pilot client commitment to provide structured feedback
- Internal engineering capacity for orchestration and infrastructure

### Top risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Hallucination or unreliable synthesis** | High | High | Force grounded citations on every numeric claim, cross-source validation, analyst review gate for high-stakes outputs |
| **Inconsistent public-data quality** | Medium | High | Multi-source cross-validation, source allowlist of reputable providers, only surface values with high source agreement |
| **Compliance & regulatory framing** | Medium | High | Position as research-acceleration tool, not investment advice; legal review of output disclaimers |
| **LLM cost runaway at scale** | Medium | Medium | Per-report cost budgets, caching for repeat queries, tiered model usage |

The remaining risks (rate limits, stakeholder alignment, security) are real but standard-practice mitigations apply and they are not on the critical path.

---

## 4. Launch Readiness Criteria

Before moving from pilot to general availability, all of the following must be true:

### Technical readiness
- End-to-end uptime ≥99.5% over a rolling 30-day window
- p95 report generation time under 90 seconds
- Automated test suite covering the 50-ticker golden set, green on every deploy
- Source failover tested and verified

### Output quality
- Hallucination rate <5% on golden set (verified against ground-truth sources)
- Risk-flag precision ≥80% on red-flag class (verified by senior analyst review)
- Numeric metrics within ±5% of source-of-truth values on 95% of tickers
- All claims attributed to a named, reputable source

### Review process
- Analyst-in-the-loop workflow live for reports flagged high-risk
- Feedback mechanism (thumbs up/down + comments) wired in
- Weekly internal sampling of reports against source data, run by the engineering team to catch quality drift

### Stakeholder sign-off
- Pilot clients sign off on case studies
- Legal sign-off on output disclaimers and Terms of Service
- Security review (SOC 2 readiness or equivalent if required by clients) complete
- Executive sponsor approval on pricing and packaging

### Operational support
- Runbook for common failure modes (source outage, LLM rate-limit, malformed input)
- On-call rotation for the first 90 days post-launch
- Support tier-1 (in-app help) and tier-2 (engineer escalation) defined

---

## 5. Client / Executive Status Update

**To:** Executive sponsor
**From:** Solomon Lerman, AI Delivery Lead
**Re:** Investment Scouting & Diligence Engine — Week 6 update
**Status:** 🟢 On track

---

The prototype is built and working. It generates a full diligence report on any major public company in under a minute, pulling live from the sources our pilot clients trust. We're moving into internal testing this week ahead of the pilot launch in week 10.

Two things worth flagging:

First, every pilot partner we've spoken to has said the same thing: they want to see exactly where every number and claim comes from. We're building that source attribution in next, before pilot kickoff.

Second, the tool works well for major US-listed companies but is less reliable for smaller and foreign-listed ones. We're working on this, but it will shape how we position coverage with pilot clients.

Neither of these threatens the timeline. We're on track to launch with two design partners in week 10.

**One decision I need from you this week:** sign-off on the pilot pricing structure. I'll send a one-pager ahead of our Thursday check-in.

— Solomon
