---
name: fresh-context-verification
description: >
  Agent execution framework that inserts fresh-context self-verification
  checkpoints into long-running work. Use for any multi-step task driven by
  a master spec, requirements file, or design document — migrations, large
  feature builds, document pipelines, batch transformations. At designated
  checkpoints the running agent must freeze, spin up an isolated
  verification sub-agent with no access to the worker's reasoning, and
  cross-examine the real-time outputs directly against the original master
  spec. Defends against context drift, goal erosion, and self-justifying
  review.
---

# Fresh-Context Self-Verification Framework

You are the executing agent operating under this framework. Its premise:
**after enough steps, you are no longer a reliable judge of your own work.**
Your accumulated context contains every rationalization, shortcut, and
misreading you've made — so verification must come from a context that
contains none of them.

## Prime Directives (non-negotiable)

1. **THE SPEC IS THE CONSTITUTION.** The project's original master spec
   file (requirements doc, design doc, task contract) is the sole authority
   at verification time. Your evolving interpretation of it is not.
   Identify and pin the spec file path at task start; if no master spec
   exists, write one first (a numbered restatement of the request) and get
   it into the repo/workspace before step 1.
2. **CHECKPOINTS ARE MANDATORY FREEZES.** At every designated checkpoint,
   stop producing new work. No "just one more file before I verify."
3. **THE VERIFIER STARTS COLD.** The verification sub-agent receives ONLY:
   the master spec, the artifacts produced so far, and the verification
   protocol. It must NOT receive your conversation history, your reasoning,
   your summaries of what you built, or your opinion of its correctness.
   Explaining your work to the verifier defeats the entire mechanism.
4. **VERDICTS BIND.** A checkpoint failure blocks forward progress until
   remediated and re-verified. You may dispute a verdict only by pointing
   at spec text, never at your intentions.
5. **NO SELF-GRADED FINALS.** The task cannot be declared complete without
   a passing terminal checkpoint from a fresh verifier.

## Phase 1 — Checkpoint planning (before execution)

Derive checkpoints from the work plan and write them down:

- One after **the first representative unit** of work (catches systematic
  misreading at minimum cost — the highest-value checkpoint).
- One at every **irreversibility boundary** (before a migration runs, a
  batch propagates, an API freezes, anything expensive to redo).
- One **terminal** checkpoint over the complete deliverable.
- For long uniform work, interval checkpoints roughly every 20–30% of
  units, tightened if any checkpoint fails.

For each checkpoint record: what artifacts exist by then, and which spec
sections govern them.

## Phase 2 — Freeze and package

At each checkpoint:

1. Stop. Flush partial work to disk so artifacts are inspectable.
2. Assemble the **verification package**: master spec path, list of
   artifact paths in scope, and the checkpoint's spec-section scope.
   Nothing else. Audit the package for smuggled context — progress notes,
   apologetic comments, "intent" docs you wrote mid-flight do not go in.

## Phase 3 — Spawn the isolated verifier

Launch a sub-agent (fresh context — a subagent tool, a separate session, or
where truly unavailable, a rigorously context-free self-pass as a last
resort, labeled as such) with a prompt of this shape:

> You are a verification agent. You have no knowledge of how these
> artifacts were produced and must not assume competence or good faith.
> Read the master spec at `<path>`. Then examine `<artifact paths>`.
> For every requirement in spec sections `<scope>`, report:
> COMPLIANT (cite artifact evidence), VIOLATION (cite spec text and the
> offending artifact location), MISSING (spec requires it, no artifact
> implements it), or UNVERIFIABLE (say what you'd need).
> Also report SPEC-SILENT observations: artifact behavior the spec doesn't
> sanction. Do not suggest fixes. Do not grade effort. Verdict only.

The verifier examines **real outputs** — files, diffs, rendered documents,
test runs — never descriptions of them.

## Phase 4 — Adjudicate

On receiving the report:

- **VIOLATION / MISSING** → remediate, then re-run the checkpoint (a fresh
  verifier instance — the old one is now contaminated by its own findings
  being targeted). Two consecutive failures at one checkpoint = stop and
  escalate to the user; the plan itself is likely wrong.
- **UNVERIFIABLE** → treat as failure of the package, not a pass; supply
  the missing evidence and re-run.
- **SPEC-SILENT** → decide deliberately: in scope (fix), acceptable
  (record in the drift log with justification), or spec gap (surface to the
  user).
- Disagreement with the verifier is resolved by spec text alone. If the
  spec genuinely supports your reading, record the ambiguity and both
  readings; if it matters, escalate rather than override.

## Phase 5 — Drift log and terminal gate

Maintain a running **drift log**: checkpoint id → verdict summary →
remediations → open ambiguities. The terminal checkpoint verifies the whole
deliverable against the whole spec, plus every remediation from earlier
checkpoints (regressions hide there).

Completion report to the user must include: checkpoint count, failures
found and fixed, the drift log, and any spec ambiguities left for their
decision. "It passed verification" without this record is not a pass.

## Why this works (keep in mind while tempted to skip it)

Context drift is invisible from inside the drifted context. The worker who
reinterpreted requirement 7 at step 40 will confidently re-approve that
reinterpretation at step 90. Only a reader who arrives cold — spec in one
hand, artifacts in the other — sees the gap. Protect the verifier's
coldness as the scarce resource it is.
