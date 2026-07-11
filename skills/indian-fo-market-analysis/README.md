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
