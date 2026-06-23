import { useState, useRef } from "react";

function percentileToColor(p) {
  if (p >= 75) return { bar: "#3B8C3B", bg: "#EAF3DE", text: "#1a4f1a" };
  if (p >= 50) return { bar: "#7AAF2A", bg: "#EAF3DE", text: "#3B6D11" };
  if (p >= 35) return { bar: "#EF9F27", bg: "#FAEEDA", text: "#6b3d00" };
  if (p >= 20) return { bar: "#E06030", bg: "#FCEBEB", text: "#7a2200" };
  return { bar: "#E24B4A", bg: "#FCEBEB", text: "#7a1a1a" };
}

function MetricCard({ label, value, percentile, higherIsBetter, context }) {
  const hasP = typeof percentile === "number";
  const displayP = hasP ? (higherIsBetter ? percentile : 100 - percentile) : null;
  const color = hasP ? percentileToColor(displayP) : null;
  const suffix = displayP === 1 ? "st" : displayP === 2 ? "nd" : displayP === 3 ? "rd" : "th";
  return (
    <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)",
      padding: "10px 12px", border: hasP ? "1px solid " + color.bar + "44" : "none" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
        color: "var(--color-text-tertiary)", marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: hasP ? 8 : 0 }}>
        <div style={{ fontSize: 15, fontWeight: 500, fontFamily: "monospace",
          color: hasP ? color.text : "var(--color-text-primary)" }}>{value}</div>
        {hasP && (
          <div style={{ textAlign: "right", lineHeight: 1 }}>
            <span style={{ fontSize: 18, fontWeight: 500, fontFamily: "monospace", color: color.bar }}>{displayP}</span>
            <span style={{ fontSize: 10, color: color.bar, marginLeft: 1 }}>{suffix}</span>
          </div>
        )}
      </div>
      {hasP && (
        <div>
          <div style={{ height: 5, borderRadius: 3, background: "var(--color-border-tertiary)", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%",
              width: displayP + "%", borderRadius: 3, background: color.bar }} />
          </div>
          <div style={{ fontSize: 9, marginTop: 3, color: "var(--color-text-tertiary)", letterSpacing: "0.05em" }}>
            percentile vs peers{context ? " · " + context : ""}
          </div>
        </div>
      )}
    </div>
  );
}


function FlagItem({ severity, text }) {
  const s = {
    red:   { bg: "#FCEBEB", text: "#501313", border: "#E24B4A", icon: "●" },
    amber: { bg: "#FAEEDA", text: "#412402", border: "#EF9F27", icon: "◆" },
    blue:  { bg: "#E6F1FB", text: "#042C53", border: "#378ADD", icon: "◉" },
  }[severity] || { bg: "#FAEEDA", text: "#412402", border: "#EF9F27", icon: "◆" };
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12,
      lineHeight: 1.6, padding: "8px 12px", borderRadius: "var(--border-radius-md)",
      background: s.bg, color: s.text, borderLeft: "2px solid " + s.border }}>
      <span style={{ flexShrink: 0, marginTop: 2, fontSize: 8 }}>{s.icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Badge({ label, color }) {
  const C = {
    green: { bg: "#EAF3DE", text: "#3B6D11" }, amber: { bg: "#FAEEDA", text: "#854F0B" },
    red: { bg: "#FCEBEB", text: "#A32D2D" }, blue: { bg: "#E6F1FB", text: "#185FA5" },
    gray: { bg: "#F1EFE8", text: "#5F5E5A" },
  };
  const c = C[color] || C.gray;
  return (
    <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "4px 10px", borderRadius: 3, fontWeight: 500, background: c.bg, color: c.text }}>
      {label}
    </span>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ padding: "14px 24px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--color-text-tertiary)", marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  );
}

function SWOTGrid({ swot }) {
  const quadrants = [
    { key: "strengths",    label: "Strengths",    bg: "#EAF3DE", border: "#7AAF2A", text: "#1a4f1a", icon: "▲" },
    { key: "weaknesses",   label: "Weaknesses",   bg: "#FCEBEB", border: "#E24B4A", text: "#501313", icon: "▼" },
    { key: "opportunities",label: "Opportunities", bg: "#E6F1FB", border: "#378ADD", text: "#042C53", icon: "◆" },
    { key: "threats",      label: "Threats",      bg: "#FAEEDA", border: "#EF9F27", text: "#412402", icon: "⚠" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {quadrants.map(function(q) {
        const items = swot[q.key] || [];
        return (
          <div key={q.key} style={{ background: q.bg, borderRadius: "var(--border-radius-md)",
            border: "1px solid " + q.border + "66", padding: "12px 14px" }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
              color: q.text, marginBottom: 8 }}>{q.icon} {q.label}</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
              {items.map(function(item, i) {
                return (
                  <li key={i} style={{ fontSize: 12, lineHeight: 1.5, color: q.text, fontFamily: "sans-serif",
                    display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <span style={{ flexShrink: 0, marginTop: 1, fontSize: 7 }}>●</span>
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function BCGMatrix({ bcg }) {
  if (!bcg) return null;
  const x = Math.max(12, Math.min(88, bcg.market_share_score || 50));
  const y = Math.max(12, Math.min(88, bcg.growth_score || 50));
  const dotLeft = x;
  const dotTop = y;
  const label = bcg.label || "Unknown";
  const labelColor = { "Star": "#3B8C3B", "Cash Cow": "#185FA5", "Question Mark": "#854F0B", "Dog": "#A32D2D" }[label] || "#5F5E5A";

  const quadrants = [
    { label: "Dogs",           icon: "▪", color: "#A32D2D", bg: "#F7F4F1", top: true,  left: true  },
    { label: "Cash Cows",      icon: "$", color: "#185FA5", bg: "#EBF3FB", top: true,  left: false },
    { label: "Question Marks", icon: "?", color: "#854F0B", bg: "#FBF3E6", top: false, left: true  },
    { label: "Stars",          icon: "★", color: "#3B8C3B", bg: "#EBF5E6", top: false, left: false },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: labelColor, fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
          {label === "Star" ? "★ Star" : label === "Cash Cow" ? "$ Cash Cow" : label === "Question Mark" ? "? Question Mark" : "▪ Dog"}
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "sans-serif", lineHeight: 1.5 }}>{bcg.rationale}</div>
      </div>

      <div style={{ display: "flex", gap: 0 }}>

        <div style={{ display: "flex", flexDirection: "column", marginRight: 8, width: 70, flexShrink: 0 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6,
            borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", textTransform: "uppercase",
              letterSpacing: "0.06em", textAlign: "right", lineHeight: 1.4 }}>Low<br/>Growth</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 }}>
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", textTransform: "uppercase",
              letterSpacing: "0.06em", textAlign: "right", lineHeight: 1.4 }}>High<br/>Growth</span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#A32D2D", textAlign: "center",
              letterSpacing: "0.04em", paddingBottom: 4 }}>▪ Dogs</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#185FA5", textAlign: "center",
              letterSpacing: "0.04em", paddingBottom: 4 }}>$ Cash Cows</div>
          </div>

          <div style={{ position: "relative", border: "0.5px solid var(--color-border-secondary)",
            borderRadius: "var(--border-radius-md)", overflow: "hidden" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {quadrants.map(function(q, i) {
                return (
                  <div key={i} style={{
                    background: q.bg,
                    height: 130,
                    borderRight: q.left ? "0.5px solid var(--color-border-secondary)" : "none",
                    borderBottom: q.top ? "0.5px solid var(--color-border-secondary)" : "none",
                  }} />
                );
              })}
            </div>

            <div style={{
              position: "absolute",
              left: "calc(" + dotLeft + "% - 10px)",
              top: "calc(" + dotTop + "% - 10px)",
              width: 20, height: 20, borderRadius: "50%",
              background: labelColor, border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              zIndex: 10,
            }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginTop: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#854F0B", textAlign: "center",
              letterSpacing: "0.04em", paddingTop: 4 }}>? Question Marks</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#3B8C3B", textAlign: "center",
              letterSpacing: "0.04em", paddingTop: 4 }}>★ Stars</div>
          </div>

          <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: "var(--color-text-tertiary)",
            letterSpacing: "0.06em", textTransform: "uppercase" }}>
            ← Low Market Share · High Market Share →
          </div>
        </div>
      </div>
    </div>
  );
}


const STEPS = [
  "Searching company financials and market data...",
  "Identifying competitors and pulling their metrics...",
  "Building SWOT analysis and BCG positioning...",
  "Synthesizing diligence report...",
];

const EXAMPLES = ["AAPL", "NVDA", "TSLA", "AMZN", "META"];

const SYSTEM_PROMPT = "You are a financial diligence analyst with real-time web search. " +
  "Search authoritative sources: Yahoo Finance, SEC EDGAR, Reuters, Bloomberg, company IR pages, MarketWatch. " +
  "Return ONLY a raw JSON object — no markdown, no backticks, no text before or after the JSON.";

function buildPrompt(ticker) {
  return "Search the web for comprehensive financial diligence data on stock ticker: " + ticker + ". " +
    "Search for: (1) current financials and market data, (2) recent news and earnings, " +
    "(3) litigation and regulatory risks, (4) top 10 competitors with their market share and growth data, " +
    "(5) SWOT factors based on real research. " +
    "Return ONLY this JSON:\n" +
    "{\n" +
    '"company_name":"Full legal name",\n' +
    '"sector":"Sector",\n' +
    '"sources_searched":["list domains actually searched"],\n' +
    '"badges":[{"label":"e.g. S&P 500 / Mega Cap / High Growth / Profitable / High Debt","color":"green or amber or red or blue or gray"}],\n' +
    '"snapshot":"2-3 sentences: what they do, market position, business model",\n' +
    '"competitors":[{"name":"Company Name","ticker":"TICK"}],\n' +
    '"metrics":[\n' +
    '{"label":"Market Cap","value":"$Xt","higher_is_better":true,"percentile":0,"context":"rank context"},\n' +
    '{"label":"Revenue TTM","value":"$XB","higher_is_better":true,"percentile":0,"context":""},\n' +
    '{"label":"Revenue Growth YoY","value":"X%","higher_is_better":true,"percentile":0,"context":""},\n' +
    '{"label":"Gross Margin","value":"X%","higher_is_better":true,"percentile":0,"context":""},\n' +
    '{"label":"Net Margin","value":"X%","higher_is_better":true,"percentile":0,"context":""},\n' +
    '{"label":"EBITDA","value":"$XB","higher_is_better":true,"percentile":0,"context":""},\n' +
    '{"label":"Free Cash Flow","value":"$XB","higher_is_better":true,"percentile":0,"context":""},\n' +
    '{"label":"ROE","value":"X%","higher_is_better":true,"percentile":0,"context":""},\n' +
    '{"label":"P/E Ratio","value":"Xx","higher_is_better":false,"percentile":0,"context":""},\n' +
    '{"label":"EV/EBITDA","value":"Xx","higher_is_better":false,"percentile":0,"context":""},\n' +
    '{"label":"Debt/Equity","value":"X.Xx","higher_is_better":false,"percentile":0,"context":""},\n' +
    '{"label":"Current Ratio","value":"X.Xx","higher_is_better":true,"percentile":0,"context":""},\n' +
    '{"label":"52w Return","value":"X%","higher_is_better":true,"percentile":0,"context":""},\n' +
    '{"label":"52w Range","value":"$X - $X","higher_is_better":null,"percentile":null,"context":""}\n' +
    '],\n' +
    '"swot":{\n' +
    '"strengths":["3-5 specific, evidence-based strengths"],\n' +
    '"weaknesses":["3-5 specific, evidence-based weaknesses"],\n' +
    '"opportunities":["3-5 specific market or strategic opportunities"],\n' +
    '"threats":["3-5 specific competitive or macro threats"]\n' +
    '},\n' +
    '"bcg":{\n' +
    '"label":"Star or Cash Cow or Question Mark or Dog",\n' +
    '"market_share_score":0,\n' +
    '"growth_score":0,\n' +
    '"rationale":"1-2 sentences explaining the BCG classification"\n' +
    '},\n' +
    '"market_summary":"3-4 sentences on stock performance, valuation vs peers, analyst consensus",\n' +
    '"news_summary":"3-5 sentences on most significant recent developments",\n' +
    '"flags":[{"severity":"red or amber or blue","text":"specific concrete finding"}],\n' +
    '"litigation_notes":"2-3 sentences on lawsuits, regulatory actions, or state none found.",\n' +
    '"diligence_verdict":"3-5 sentence balanced analyst summary: thesis, risks, strengths, competitive position, outlook."\n' +
    "}\n" +
    "Rules: 10 competitors. 3-6 flags. percentile 0-100 (100=best in peer group). " +
    "market_share_score 0-100 (100=dominant share). growth_score 0-100 (100=fastest growing market). " +
    "BCG: Star=high share+high growth, Cash Cow=high share+low growth, Question Mark=low share+high growth, Dog=low share+low growth. " +
    "SWOT items must be specific and grounded in real data from searches, not generic. " +
    "Return raw JSON only.";
}

function extractJSON(text) {
  const t = text.trim();
  try { return JSON.parse(t); } catch(e) {}
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try { return JSON.parse(t.slice(start, end + 1)); } catch(e) {}
  }
  return null;
}

export default function DiligenceEngine() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  async function runDiligence() {
    const t = ticker.trim().toUpperCase();
    if (!t) return;
    setLoading(true);
    setReport(null);
    setError(null);
    setStepIdx(0);
    let idx = 0;
    intervalRef.current = setInterval(function() {
      idx++;
      if (idx < STEPS.length) setStepIdx(idx);
      else clearInterval(intervalRef.current);
    }, 8000);

    try {
      const messages = [{ role: "user", content: buildPrompt(t) }];
      let finalText = "";
      let iterations = 0;

      while (iterations < 12) {
        iterations++;
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 6000,
            system: SYSTEM_PROMPT,
            tools: [{ type: "web_search_20250305", name: "web_search" }],
            messages: messages
          })
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message || "API error");
        const content = data.content || [];

        if (data.stop_reason === "end_turn") {
          finalText = content.filter(function(b) { return b.type === "text"; })
            .map(function(b) { return b.text; }).join("");
          break;
        }
        if (data.stop_reason === "tool_use") {
          messages.push({ role: "assistant", content: content });
          const results = content.filter(function(b) { return b.type === "tool_use"; })
            .map(function(b) { return { type: "tool_result", tool_use_id: b.id, content: "Search executed." }; });
          if (results.length > 0) messages.push({ role: "user", content: results });
          continue;
        }
        finalText = content.filter(function(b) { return b.type === "text"; })
          .map(function(b) { return b.text; }).join("");
        break;
      }

      if (!finalText) throw new Error("No response from model");
      const parsed = extractJSON(finalText);
      if (!parsed) throw new Error("Could not parse report — please try again");
      clearInterval(intervalRef.current);
      setStepIdx(3);
      setReport(parsed);
    } catch(e) {
      clearInterval(intervalRef.current);
      setError("Analysis failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  const body = { fontSize: 13, lineHeight: 1.7, color: "var(--color-text-secondary)", fontFamily: "sans-serif" };

  return (
    <div style={{ fontFamily: "monospace", color: "var(--color-text-primary)" }}>
      <div style={{ border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-lg)",
        overflow: "hidden", background: "var(--color-background-primary)" }}>

        <div style={{ padding: "10px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)",
          display: "flex", alignItems: "center", gap: 12, background: "var(--color-background-secondary)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[0,1,2].map(function(i) { return (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-border-secondary)" }} />
            ); })}
          </div>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--color-text-tertiary)",
            textTransform: "uppercase", flex: 1, textAlign: "center" }}>
            Investment Scouting &amp; Diligence Engine — v0.3
          </div>
        </div>

        <div style={{ padding: "14px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)",
          display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--color-text-tertiary)",
            textTransform: "uppercase", whiteSpace: "nowrap" }}>▶ Ticker</span>
          <input value={ticker}
            onChange={function(e) { setTicker(e.target.value.toUpperCase()); }}
            onKeyDown={function(e) { if (e.key === "Enter" && !loading) runDiligence(); }}
            placeholder="e.g. AAPL, NVDA, TSLA, MSFT"
            maxLength={10}
            style={{ flex: 1, fontFamily: "monospace", fontSize: 15, fontWeight: 500,
              letterSpacing: "0.05em", background: "transparent", border: "none",
              outline: "none", color: "var(--color-text-primary)" }} />
          <button onClick={runDiligence} disabled={loading || !ticker.trim()}
            style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em",
              textTransform: "uppercase", padding: "7px 16px",
              border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)",
              background: "var(--color-text-primary)", color: "var(--color-background-primary)",
              cursor: (loading || !ticker.trim()) ? "not-allowed" : "pointer",
              opacity: (loading || !ticker.trim()) ? 0.4 : 1 }}>
            {loading ? "Researching..." : "Run analysis"}
          </button>
        </div>

        {!loading && !report && !error && (
          <div style={{ padding: "50px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--color-text-tertiary)",
              textTransform: "uppercase", marginBottom: 8 }}>
              Live search · Peer benchmarking · SWOT · BCG Matrix
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 20 }}>
              Pulls from Yahoo Finance, SEC EDGAR, Reuters &amp; more · 10 competitors benchmarked
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
              Try:{" "}
              {EXAMPLES.map(function(ex) { return (
                <span key={ex} onClick={function() { setTicker(ex); }}
                  style={{ display: "inline-block", padding: "2px 10px",
                    border: "0.5px solid var(--color-border-tertiary)",
                    borderRadius: 4, margin: "0 4px", cursor: "pointer" }}>{ex}</span>
              ); })}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ padding: "40px 24px" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--color-text-tertiary)", marginBottom: 20 }}>
              Researching {ticker.trim().toUpperCase()} —
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {STEPS.map(function(step, i) { return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12,
                  transition: "color 0.4s",
                  color: i <= stepIdx ? "var(--color-text-secondary)" : "var(--color-border-secondary)" }}>
                  <span style={{ fontSize: 8 }}>{i < stepIdx ? "●" : i === stepIdx ? "◉" : "○"}</span>
                  {step}
                </div>
              ); })}
            </div>
            <div style={{ marginTop: 20, fontSize: 11, color: "var(--color-text-tertiary)" }}>
              Allow 45–90 seconds — searching multiple live sources, benchmarking 10 competitors...
            </div>
          </div>
        )}

        {error && (
          <div style={{ padding: "30px 24px", textAlign: "center", color: "#A32D2D", fontSize: 13 }}>
            {error}
          </div>
        )}

        {report && (
          <div>
            <div style={{ padding: "20px 24px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)",
              display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "0.02em", lineHeight: 1 }}>
                  {ticker.trim().toUpperCase()}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4,
                  letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {report.company_name}{report.sector ? " · " + report.sector : ""}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", textAlign: "right", lineHeight: 1.8 }}>
                Live diligence report<br />
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>

            {report.sources_searched && report.sources_searched.length > 0 && (
              <div style={{ padding: "8px 24px", borderBottom: "0.5px solid var(--color-border-tertiary)",
                background: "var(--color-background-secondary)", display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--color-text-tertiary)", marginRight: 4 }}>Sources</span>
                {report.sources_searched.map(function(s, i) { return (
                  <span key={i} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 3,
                    background: "var(--color-background-primary)",
                    border: "0.5px solid var(--color-border-tertiary)",
                    color: "var(--color-text-tertiary)" }}>{s}</span>
                ); })}
              </div>
            )}

            <div style={{ padding: "12px 24px", display: "flex", gap: 8, flexWrap: "wrap",
              borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              {(report.badges || []).map(function(b, i) { return <Badge key={i} label={b.label} color={b.color} />; })}
            </div>

            <Section label="Company snapshot">
              <div style={body}>{report.snapshot}</div>
            </Section>

            {report.competitors && report.competitors.length > 0 && (
              <Section label={"Peer group — " + report.competitors.length + " competitors benchmarked"}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {report.competitors.map(function(c, i) { return (
                    <div key={i} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 3,
                      background: "var(--color-background-secondary)",
                      border: "0.5px solid var(--color-border-tertiary)",
                      color: "var(--color-text-secondary)", fontFamily: "monospace" }}>
                      <span style={{ fontWeight: 500 }}>{c.ticker}</span>
                      <span style={{ color: "var(--color-text-tertiary)", marginLeft: 5,
                        fontFamily: "sans-serif", fontSize: 10 }}>{c.name}</span>
                    </div>
                  ); })}
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                  Metric bars show percentile rank vs this peer group. Green = top performer · Red = bottom.
                </div>
              </Section>
            )}

            <Section label="Key metrics — peer-benchmarked">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
                {(report.metrics || []).map(function(m, i) { return (
                  <MetricCard key={i} label={m.label} value={m.value}
                    percentile={m.percentile} higherIsBetter={m.higher_is_better} context={m.context} />
                ); })}
              </div>
              <div style={{ marginTop: 12, ...body }}>{report.market_summary}</div>
            </Section>

            {report.swot && (
              <Section label="SWOT analysis">
                <SWOTGrid swot={report.swot} />
              </Section>
            )}

            {report.bcg && (
              <Section label="BCG growth-share matrix">
                <BCGMatrix bcg={report.bcg} />
              </Section>
            )}

            <Section label="Recent news and developments">
              <div style={body}>{report.news_summary}</div>
            </Section>

            <Section label="Risk flags and caution signals">
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(report.flags || []).map(function(f, i) { return <FlagItem key={i} severity={f.severity} text={f.text} />; })}
              </div>
            </Section>

            <Section label="Litigation and controversy">
              <div style={body}>{report.litigation_notes}</div>
            </Section>

            <Section label="Synthesized diligence notes">
              <div style={{ background: "var(--color-background-secondary)",
                border: "0.5px solid var(--color-border-secondary)",
                borderRadius: "var(--border-radius-md)", padding: "14px 16px" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "var(--color-text-tertiary)", marginBottom: 6 }}>Analyst summary</div>
                <div style={{ ...body, color: "var(--color-text-primary)" }}>{report.diligence_verdict}</div>
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
