# AI Workflow Note

This is a short note on how I used AI tools to complete this assignment, what those tools accelerated, and what judgment and decisions stayed with me.

## Tools used

- **Claude (Opus 4.7)** as my primary collaborator for code generation, iterative debugging, and document drafting.
- **ChatGPT (GPT-5)** in parallel as a domain research assistant, used specifically to think through which financial metrics professional investors actually rely on and how they frame relative valuation.

I used both intentionally — Claude for the build and structured writing, ChatGPT for fast domain exploration in a parallel thread. The two roles didn't overlap and gave me more leverage than using one alone would have.

## How I used them

### Prototype build (Claude)

I treated Claude as a pair-programming partner, not a solo author. The workflow was iterative:

1. I described the system I wanted (input → live web search → structured diligence report)
2. Claude generated an initial React artifact
3. I tested it, hit errors (CORS issues, JSON parsing failures, syntax issues from incremental patching), and fed each error back
4. We debugged together and the prototype evolved from a simple HTML widget into a full agentic loop with the Anthropic API's web-search tool, multi-source synthesis, peer benchmarking, SWOT, and a BCG matrix

The major architectural and feature decisions were mine:
- **Multi-source web search instead of a single API.** When Claude suggested a single-API approach for simplicity, I pushed back because the assignment explicitly asked for multiple sources. Switching to Anthropic's web-search tool made the prototype substantially stronger.
- **Competitor benchmarking with percentile-based color coding.** This was my idea, informed by my parallel ChatGPT research on how investors think about relative valuation rather than absolute metrics. I asked Claude to implement it with directional awareness (some metrics are higher-is-better, others lower-is-better) — a detail that matters in real diligence.
- **SWOT and BCG matrix additions.** Both came from me wanting the output to look like real consultant-grade analysis, not just a metrics dashboard.
- **UI corrections.** The first percentile bars looked like random colored bars; I pushed for the percentile number to be the dominant visual element. The first BCG matrix had labels overlapping the chart; I pushed for clean quadrant labels outside the graph area.

### Delivery plan (Claude)

I asked Claude to draft the five-section delivery plan, then ran a careful editorial pass:
- Caught vague language ("quarantine anomalous sources") and made Claude justify or rewrite it
- Caught a client-vs-internal confusion around confidence scoring and had it cut from the client-facing layer
- Cut the risk table from nine items to four because the original made the project look more dangerous than it is
- Specifically asked Claude to dejargon the executive status email after deciding the technical sections should keep their domain vocabulary but the exec memo should not

### Domain research (ChatGPT)

I used ChatGPT in a separate thread to validate my intuitions about which metrics matter to which kinds of investors (VC, PE, IB) and how comparable-company analysis actually works. This informed both the prototype's metric selection and the architecture doc's framing around peer benchmarking. I did not use ChatGPT to write any of the deliverables themselves.

## What AI accelerated

- Boilerplate React component scaffolding
- Document structuring and first-pass drafting
- Recall of standard financial metric definitions and directionality
- Debugging cycle time (Claude could read errors and respond faster than I could trace them manually)
- Implementation of the agentic web-search loop, which would have taken much longer to figure out from API docs

## What stayed with me

- The feature roadmap (competitor benchmarking, percentile color-coding, SWOT, BCG)
- The framing decisions (generic vendor, prototype-vs-plan distinction, exec-email tone)
- Quality control on every output — pushing back when the AI was vague, generic, or got the audience wrong
- The decision to use a single robust agentic workflow rather than building multiple parallel API integrations
- The trade-off between feature creep and finishing on time (I locked the prototype well before the assignment ended)

## Tradeoffs I accepted

- The prototype runs in a Claude artifact rather than a standalone deployed app. This was a deliberate trade-off for speed and a working demo. For a real engagement, the same code would run in a containerized backend with proper API key management.
- The prototype uses Anthropic's web search rather than direct API integrations with Bloomberg, FactSet, or paid financial data providers. Real production would layer those in — and the delivery plan calls this out.
- I didn't add inline citation rendering (showing which claim came from which source). This would be the next feature I'd build. The architecture already supports it; the UI work is what I traded against time.

## Reflection

The role this assignment is hiring for is fundamentally about *judgment about AI* — when to use it, when to push back on it, and how to combine it with human direction to produce work that's both faster and better than either alone. My goal across this assignment was to be the person directing the work, with Claude and ChatGPT as the leverage. The AI accelerated execution. The decisions, scope control, and quality bar were mine.
