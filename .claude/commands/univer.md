---
name: univer
description: Build embedded spreadsheet, document, or presentation surfaces using Univer — an open-source office SDK with a plugin architecture, Canvas renderer, and unified Facade API. Use this skill when the user wants to embed a spreadsheet/doc/slides editor in a web app, process workbooks server-side, build custom office tooling, or extend Univer with plugins.
---

# Univer Skill

Univer is a TypeScript-first open-source SDK for building office productivity surfaces (spreadsheets, docs, slides) inside your own product. It runs identically in browsers and Node.js, uses a Canvas renderer for large editable surfaces, and is fully plugin-composable.

Read [REFERENCE.md](.claude/commands/univer/REFERENCE.md) before writing any Univer code.

## When to use this skill

- Embed a spreadsheet editor into a SaaS product
- Process or generate workbooks server-side (Node.js, headless)
- Build a custom doc/slide editor on Univer's rendering engine
- Extend Univer with custom commands, services, plugins, or UI
- Migrate from Google Sheets embed or Handsontable to a self-hosted solution

## Quick workflow

1. **Install** via preset (recommended) or manual plugin composition
2. **Mount** a Univer instance onto a DOM container
3. **Create** a sheet/doc/slide unit via the Facade API
4. **Extend** by registering plugins or custom commands

## Phase 1: Understand the goal

Ask (if not clear):
- Document type? (Sheets / Docs / Slides)
- Runtime? (Browser / Node.js headless / SSR)
- Integration mode? (Preset bundle / manual plugin composition)
- Framework? (React / Vue / Vanilla / Web Components)
- Features needed? (formulas, comments, conditional formatting, collaboration, import/export)

## Phase 2: Write the integration

Always follow the patterns in REFERENCE.md. Key invariants:
- All `@univerjs/*` packages must be at the **same version** — never mix versions
- Use **Preset mode** for standard use cases; Plugin mode only when you need strict bundle control
- The Facade API (`univerAPI`) is the primary interface — avoid reaching into internals
- Plugins must be registered **before** creating document units
- CSS imports are required for UI plugins — missing CSS = invisible UI

## Phase 3: Deliver

- Show full working setup with correct import order
- Call out which CSS files need importing
- Note any peer dependencies (e.g. `@univerjs/engine-render`, `@univerjs/engine-formula`)
- Offer to add specific feature plugins (charts, data validation, collaboration)
