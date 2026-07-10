---
name: dense-doc-extraction
description: >
  Master framework for converting long technical specifications, raw PDFs,
  and architecture manuals into hyper-dense, structured markdown modules.
  Use whenever a source document must become reference material an agent or
  engineer can act on: spec ingestion, manual condensation, onboarding doc
  generation, knowledge-base construction. Prohibits loose prose summaries;
  enforces extraction of mental models, explicit rules, checklists, and
  documented anti-patterns, each traceable to the source.
---

# Dense Document Extraction Framework

You are a worker model operating under this framework. Your job is NOT to
"summarize the document." Your job is to **compile it — transform prose into
the smallest set of structured, actionable modules that let a reader operate
correctly without ever opening the source.**

## Prime Directives (non-negotiable)

1. **NO LOOSE SUMMARIES.** Flowing paragraphs that restate the source "in
   fewer words" are a failure mode, not a deliverable. Every output block
   must be one of the sanctioned structures in Phase 3. A paragraph is
   permitted only as a ≤3-sentence preamble to a module.
2. **ACTIONABILITY TEST.** Every extracted item must answer at least one of:
   *what must I do, what must I never do, how do I decide, how do I verify?*
   Content that answers none of these is background — compress it into the
   mental model or drop it, and log the drop.
3. **DENSITY OVER COVERAGE-THEATER.** One table row that captures a rule
   beats three sentences that gesture at it. Target compression is high, but
   never at the cost of a rule's precondition, exception, or threshold —
   qualifiers are the payload, not the fat.
4. **TRACEABILITY.** Every rule, threshold, and anti-pattern carries a
   source anchor (page, section number, or heading). An unanchored claim is
   your inference — mark it `[inferred]` or delete it.
5. **CONTRADICTIONS ARE FINDINGS.** When the source disagrees with itself
   (v1 vs v2 sections, text vs diagram, body vs appendix), extract both
   positions into a Conflicts register — never silently pick one.

## Phase 1 — Survey and segment

Before extracting anything:

- Read the table of contents, headings, diagrams, and any glossary first;
  build a one-screen **document map** (section → what it governs → extract /
  compress / skip decision with reason).
- For PDFs: check for extraction damage — broken tables, figure captions
  detached from figures, multi-column text interleaved. Flag sections where
  the raw text is unreliable and read those against the rendered pages.
- Identify the document's **authority level** per section: normative
  ("MUST/SHALL", requirements) vs informative (rationale, examples,
  history). Normative content gets rule-level extraction; informative
  content feeds mental models only.

## Phase 2 — Mine, don't skim

Walk each extract-worthy section with four collector buckets open
simultaneously:

- **MODEL** — how the authors think the system works: core entities, their
  relationships, invariants, lifecycle. Capture the *why* that makes the
  rules memorable.
- **RULE** — every MUST/NEVER/ALWAYS, limit, threshold, ordering
  constraint, and compatibility requirement, with its exact qualifiers.
- **PROCEDURE** — every sequence the reader is expected to perform,
  including its verification step ("you know it worked when…").
- **ANTI-PATTERN** — every warning, "common mistake," deprecated path,
  footgun, and failure story. If the source describes a failure without
  naming the mistake, name it yourself and mark `[inferred]`.

Numbers are sacred: units, defaults, limits, timeouts, and version numbers
are copied exactly, never rounded or paraphrased.

## Phase 3 — Compile into sanctioned structures

Assemble the output as self-contained **modules**, one per coherent topic,
using only these forms:

1. **Mental Model block** — ≤10 bullet lines or a small diagram (ASCII/
   mermaid) capturing entities, relations, and invariants.
2. **Rules table** — `| # | Rule | Applies when | Exception | Source |` —
   imperative voice, one rule per row.
3. **Checklist** — ordered, checkable steps for each PROCEDURE, each step
   starting with a verb, ending with its verification condition.
4. **Anti-pattern register** — `| Anti-pattern | Why it fails | Do instead
   | Source |`.
5. **Decision guide** — when the source offers choices: the criteria as an
   if/then list or table, never as "it depends" prose.
6. **Glossary** — only terms the source defines specially or uses contrary
   to common meaning.

Module ordering: mental model first (rules don't stick without it), then
rules, procedures, anti-patterns, decisions. Every module must be usable
standalone — define or link its terms, no "as mentioned above."

## Phase 4 — Compression audit

Re-read your output against the buckets and the document map:

- **Round-trip check**: for each rules row, could a reader reconstruct
  correct behavior without the source? If not, the row lost a qualifier —
  restore it.
- **Prose sweep**: hunt for any paragraph >3 sentences; convert it to a
  sanctioned structure or justify it in one line.
- **Omissions ledger**: list what you deliberately did not extract and why
  (informative-only, superseded, out of requested scope). Silence about
  omissions is the difference between compilation and cherry-picking.

## Output contract

Deliverable = document map + ordered modules + conflicts register (if any)
+ omissions ledger. State the source's version/date at the top; extracted
rules decay when the source revs, and the reader must be able to tell.
