---
name: tdd-first-enforcement
description: >
  Advanced Test-Driven Development enforcement framework. Use for any task
  that produces functional code — new features, bug fixes, refactors with
  behavior guarantees. Dictates that before any functional code may be
  generated, the executing model must first construct mock fixtures,
  integration test configurations, and edge-case unit assertions that
  intentionally fail upfront, verify they fail for the right reasons, and
  only then implement to green. Prohibits test-after rationalization and
  tests written to match code.
---

# TDD-First Enforcement Framework

You are an executing model operating under this framework. Its core
inversion: **tests are not how you check the code — tests are how you
specify it.** Functional code is the *last* artifact you produce, and it
exists solely to turn an already-failing, already-trusted test suite green.

## Prime Directives (non-negotiable)

1. **NO FUNCTIONAL CODE BEFORE RED.** You may not write, generate, or edit
   any production code until the test suite for the change exists, runs,
   and **fails**. Stubs/interfaces needed only to make tests *compile* are
   permitted, but must contain no logic (throw "not implemented" / return
   nothing).
2. **FAILURES MUST BE THE RIGHT FAILURES.** A test failing on an import
   error, typo, or broken fixture proves nothing. Run the suite and read
   every failure message: each must fail on the *asserted behavior being
   absent*, not on harness breakage. Record the red output verbatim.
3. **TESTS ENCODE THE SPEC, NOT THE IMPLEMENTATION.** Assertions come from
   the requirements, the API contract, and the failure modes — never from
   peeking at how you plan to implement. If you catch yourself writing an
   assertion because "that's what the code will return," stop and derive
   it from the spec instead.
4. **NEVER WEAKEN A TEST TO PASS IT.** Once red is recorded, the assertion
   set is a contract. Loosening an assertion, deleting a case, or widening
   a tolerance to reach green requires an explicit, logged justification
   tied to spec text — and is otherwise prohibited.
5. **GREEN IS NECESSARY, NOT SUFFICIENT.** After green: refactor under the
   suite, then adversarially audit the suite itself (Phase 6).

## Phase 1 — Behavior inventory

Before writing a single test, enumerate what the change must do:

- **Happy paths**: each distinct input class → expected output.
- **Edge cases**: empty/null/zero, boundaries (off-by-one at every limit),
  unicode/encoding, duplicates, ordering, concurrency where applicable,
  maximum sizes, malformed input.
- **Failure behavior**: what must error, with which error type/message,
  and what must be left unchanged after the error (no partial writes).
- **Invariants**: properties that must hold across all inputs
  (idempotency, round-trips, conservation of totals).

Each row gets an ID. Every test you write cites a row; every row gets at
least one test or a written reason it can't be tested.

## Phase 2 — Fixtures and mocks first

Build the test bed before the tests:

- **Mock fixtures**: representative data objects for every input class in
  the inventory — including the ugly ones (boundary sizes, hostile
  strings, realistic-not-idealized records). Fixtures live in dedicated
  files/factories, not copy-pasted inline per test.
- **Test doubles**: mock/stub every external collaborator (network, DB,
  clock, filesystem, third-party APIs) at the seam the architecture
  provides. Doubles must be *contract-faithful*: they return shapes the
  real dependency actually returns, including its documented error shapes.
  A mock that's friendlier than reality manufactures false greens.
- **Determinism**: freeze time, seed randomness, pin ordering. A test that
  can flake cannot serve as a spec.

## Phase 3 — Integration test configuration

Comprehensive means both altitudes:

- **Unit assertions** for every inventory row at the function/class level.
- **Integration configuration**: the harness that wires real components
  together across the seam under change — test containers/in-memory
  substitutes for infrastructure, app bootstrapping, migration/seed
  scripts for schema-touching work, and at least one end-to-end path per
  user-visible behavior. Configure this *now*, while it can still fail
  honestly, not after the code exists to shape it.

Match the repo's existing test framework, layout, and naming — discover
them first; do not import a new test stack into a project that has one.

## Phase 4 — Red: write failing tests and prove the red

1. Write all tests from the inventory. Name each for the behavior it
   specifies (`rejects_expired_token`, not `test_case_7`).
2. Run the full new suite. **Every new test must fail.**
3. Audit each failure message: does it fail because the behavior is
   missing (assertion error, NotImplemented) — or because the harness is
   broken (import/syntax/fixture errors)? Fix harness breakage until every
   red is a *behavioral* red.
4. Any new test that passes before implementation is a defect: it either
   tests nothing or tests existing behavior — rewrite it or reclassify it
   as a pinned regression test.
5. Record the red run output. This is the baseline that makes green
   meaningful.

## Phase 5 — Green: implement to the contract

Now, and only now, write functional code — the *minimum* that satisfies
the assertions. Run the suite after each coherent slice; watch reds
convert. When implementation reveals the spec was wrong (not merely
inconvenient), update the inventory and tests *first*, re-record red, then
continue — the tests always lead.

Full green = new suite passes AND the pre-existing suite still passes.

## Phase 6 — Refactor and audit the suite

- Refactor implementation freely under the green suite; it is your net.
- Then attack your own tests: temporarily break the implementation in 2–3
  plausible ways (invert a condition, drop an edge branch) and confirm the
  suite catches each. A mutation the suite misses = a missing assertion —
  add it. Revert the sabotage.
- Verify no assertion was weakened since Phase 4 (diff the tests against
  the red-run versions).

## Output contract

Final report: behavior inventory with test coverage per row, the recorded
red output, the green output, pre-existing-suite status, mutation-audit
results, and any spec deviations with justification. A change delivered
without its recorded red run did not follow this framework — say so rather
than implying it did.
