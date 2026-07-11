# Indian F&O Market Analysis

Operating manuals (`SKILL.md` blueprints) that ground a worker/executor
model in the structural rules of the Indian Futures & Options market
before it performs any derivatives analysis. Each skill enforces a
rules-first discipline: no analysis on stale contract specs, no signal
calls without naming the underlying OI/PCR/VIX evidence, and explicit
handling of expiry, settlement, and session-timing constraints.

| Skill | Purpose |
| --- | --- |
| [`indian-fo-market-rules`](indian-fo-market-rules/SKILL.md) | Structural rulebook for NSE/BSE derivatives — index lot sizes, trading sessions, expiry cycles, settlement rules, and the core indicator set (futures premium/discount, India VIX, PCR, OI build-up classification) every analysis must be anchored to. |
| [`trading-risk-guardrails`](trading-risk-guardrails/SKILL.md) | Hard risk caps for F&O trading — 1-2% per-trade risk, SL-distance-based position sizing, 20% option-buying ceiling, defined-risk-only selling, and a strict no-averaging-down rule enforced via a pre-trade checklist. |
| [`trade-review-journal`](trade-review-journal/SKILL.md) | Fixed trade-review template — instrument, type, setup, entry/exit, P&L, and evidenced emotional-state classification — with process-over-outcome grading and journal-level pattern aggregation. |
