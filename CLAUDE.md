# CLAUDE.md

> Project context for Claude Code. Managed with [GSD](https://github.com/glittercowboy/get-shit-done).

## Project Overview

**What:** AeroSpec — Predictive actuator configurator & procurement platform for formulation chemists and packaging engineers
**Stack:** Next.js 16 / TypeScript 5.9 (strict) / PostgreSQL / Drizzle ORM / Tailwind CSS 4 / React Three Fiber / Stripe
**Status:** Phase 3 complete (MVP + SaaS + Procurement). Deployed at spencer-poc.vercel.app

## Build, Test, Run

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
```

## Architecture

```
src/
├── app/           # Next.js app router pages & API routes
│   ├── api/       # 15 API endpoints (predict, auth, billing, procurements, etc.)
│   └── */page.tsx # Pages: home, configure, results, compare, procurement, cart, orders, analytics
├── components/    # React components (ActuatorViewer3D, WorkflowBreadcrumb, etc.)
├── lib/           # Shared utilities (data.ts: 27 actuators, 25 fluids, 12 spray types)
├── db/            # Drizzle schema & client (tenants, users, configs, procurements)
├── auth/          # JWT auth utilities
└── middleware.ts   # Request auth/routing middleware
```

## Code Conventions

- TypeScript strict mode. No `any` types — use `unknown` and narrow.
- Named exports only, no default exports.
- Error handling via explicit return types, not thrown exceptions.
- Use `server actions` for mutations, API routes only for webhooks/external.
- Prefer composition over inheritance. No classes unless wrapping a library.
- Import order: node builtins → external packages → internal modules → relative.
- File naming: `kebab-case.ts` for files, `PascalCase` for components.

## Important Rules

- **Always run `npm run build` before considering a task done.**
- **Never edit existing migration files.** Create a new migration instead.
- **Don't install new dependencies without asking first.** Check if something in the stack already handles it.
- **Keep components under 200 lines.** Extract logic into hooks or utilities.
- **Write tests for business logic in `services/`.** UI tests are optional.

-----

# GSD WORKFLOW

This project uses [Get Shit Done](https://github.com/glittercowboy/get-shit-done) for structured development. Use `/gsd:*` commands instead of ad-hoc workflows.

## Core Workflow

```
/gsd:new-project     → Initialize project structure
/gsd:discuss-phase   → Scope and discuss a phase
/gsd:research-phase  → Deep research before planning
/gsd:plan-phase      → Create atomic task plans
/gsd:execute-phase   → Execute with fresh context per task
/gsd:verify-work     → Verify completed work
```

## Quick Tasks

For small, well-understood changes that don't need full planning:

```
/gsd:quick           → Skip planning, atomic commits
```

## Project Management

```
/gsd:progress        → Check overall progress
/gsd:add-phase       → Add a new phase to roadmap
/gsd:complete-milestone → Archive and tag a milestone
/gsd:pause-work      → Create handoff state for later
/gsd:resume-work     → Pick up where you left off
/gsd:debug           → Structured debugging workflow
```

## Planning Files

All planning artifacts live in `.planning/`:

| File | Purpose |
|---|---|
| `.planning/STATE.md` | Living short-term memory — current position, recent decisions, blockers |
| `.planning/PLAN.md` | Current implementation plan |
| `.planning/phases/` | Per-phase context, plans, and summaries (created by GSD) |

## Git Discipline

GSD commits outcomes, not process:

- **One commit per task** — atomic, revertable
- **Format:** `type(phase-plan): task-name`
- **Types:** `feat`, `fix`, `test`, `refactor`, `perf`, `chore`
- Never commit `.env`, secrets, or generated files.

## Context Management

- Keep `.planning/STATE.md` under 100 lines — it's a digest, not an archive.
- Use `/gsd:pause-work` to save session state before context fills up.
- Use `/gsd:resume-work` to restore context in a fresh session.

## When Stuck

1. Re-read the error message carefully — don't guess.
2. Search the codebase for similar patterns.
3. Check `.planning/STATE.md` for known issues.
4. Use `/gsd:debug` for structured debugging.
5. If a fix isn't working after 2 attempts, try a different approach entirely.

-----

# DECISIONS LOG

|Date      |Decision                                      |Rationale                                          |
|----------|----------------------------------------------|---------------------------------------------------|
|2025-02-21|Next.js 16 + Drizzle ORM                      |App router for SSR, Drizzle for typed DB queries    |
|2025-02-21|Clinical Brutalist design system               |Professional, engineering-focused aesthetic          |
|2025-02-22|URL params for cross-page data flow            |Shareable, bookmarkable, no state sync issues       |
|2025-02-22|React Three Fiber for 3D actuator visualization|Interactive parametric viewer in-browser             |
|2026-02-22|GSD framework for development workflow         |Structured planning, atomic commits, context management|
