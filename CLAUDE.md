# CLAUDE.md

> This file gives Claude Code the context it needs to work effectively on this project.
> Inspired by the core principles of [Get Shit Done](https://github.com/glittercowboy/get-shit-done) — distilled to the 20% that delivers 80% of the value.

## Project Overview

<!-- Replace with your project details -->

**What:** [One-line description of what this project does]
**Stack:** [e.g., Next.js 14 / TypeScript / Postgres / Drizzle ORM / Tailwind]
**Status:** [e.g., MVP in progress, Phase 2, Production]

## Build, Test, Run

```bash
# Development
npm run dev              # Start dev server (localhost:3000)

# Testing
npm test                 # Run full test suite
npm test -- path/to/file.test.ts  # Run single test file

# Quality
npm run typecheck        # TypeScript strict check
npm run lint             # ESLint
npm run lint:fix         # Auto-fix lint issues

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed dev data
```

## Architecture

<!-- Keep this short — just enough for Claude to know where things live -->

```
src/
├── app/           # Next.js app router pages & API routes
├── components/    # React components (co-located with styles)
├── lib/           # Shared utilities, config, constants
├── services/      # Business logic (no framework dependencies)
├── db/            # Schema definitions, migrations, queries
└── types/         # Shared TypeScript types
```

## Code Conventions

<!-- List things a linter won't catch — the stuff that trips Claude up -->

- TypeScript strict mode. No `any` types — use `unknown` and narrow.
- Named exports only, no default exports.
- Error handling via explicit return types, not thrown exceptions.
- Use `server actions` for mutations, API routes only for webhooks/external.
- Prefer composition over inheritance. No classes unless wrapping a library.
- Import order: node builtins → external packages → internal modules → relative.
- File naming: `kebab-case.ts` for files, `PascalCase` for components.

## Important Rules

<!-- The "don't shoot yourself in the foot" section -->

- **Always run `npm run typecheck` before considering a task done.**
- **Never edit existing migration files.** Create a new migration instead.
- **Don't install new dependencies without asking first.** Check if something in the stack already handles it.
- **Keep components under 200 lines.** Extract logic into hooks or utilities.
- **Write tests for business logic in `services/`.** UI tests are optional.

-----

# WORKFLOW: How to Approach Tasks

The following workflow patterns keep Claude effective across long sessions. Use them.

## Planning Before Coding

Before implementing anything non-trivial, create a brief plan:

1. **Understand** — What exactly needs to happen? What files are involved?
1. **Research** — Read the relevant existing code first. Don't assume.
1. **Plan** — List the specific changes needed, in order.
1. **Execute** — Make changes one file at a time, verifying as you go.
1. **Verify** — Run tests, typecheck, and manually confirm the feature works.

For complex features, write the plan to `.planning/PLAN.md` before starting so it survives context resets.

## Task Atomicity

Break work into small, focused units. Each unit should:

- Touch as few files as possible
- Be independently testable
- Get its own git commit with a descriptive message

**Bad:** "Build the entire auth system"
**Good:** "Create the login API endpoint" → "Add JWT token generation" → "Build login form component" → "Wire form to API" → "Add auth middleware"

## Git Discipline

- Commit after each meaningful unit of work, not at the end.
- Commit message format: `type(scope): description`
  - Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
  - Example: `feat(auth): add JWT login endpoint`
- Never commit `.env`, secrets, or generated files.

## Context Management

Claude's quality degrades as context fills up. Manage it:

- **Don't read entire files unnecessarily.** Use grep/search to find what you need.
- **Don't dump large outputs.** Redirect verbose commands to files, then read what matters.
- **Summarize completed work.** After finishing a chunk of tasks, write a brief summary to `.planning/STATE.md` so future sessions know what happened.
- **Keep `.planning/STATE.md` updated** with: current status, recent decisions, known issues, and what's next.

## State File

Maintain `.planning/STATE.md` as a living document across sessions:

```markdown
# Project State

## Current Focus
[What's being worked on right now]

## Recently Completed
- [Date] Description of what was done

## Key Decisions
- [Decision]: [Why] (don't revisit these)

## Known Issues
- [Issue]: [Status/plan]

## What's Next
- [ ] Next task 1
- [ ] Next task 2
```

## When Stuck

1. Re-read the error message carefully — don't guess.
1. Search the codebase for similar patterns.
1. Check if it's a known issue in `.planning/STATE.md`.
1. If a fix isn't working after 2 attempts, try a different approach entirely.
1. Don't keep applying the same fix repeatedly.

-----

# PROJECT PLAN

<!--
This section is optional but powerful for larger projects.
Define your roadmap here so Claude knows the big picture.
-->

## Requirements

### Must Have (v1)

- [ ] Requirement 1
- [ ] Requirement 2

### Should Have (v2)

- [ ] Requirement 3

### Out of Scope

- Thing that's explicitly not being built

## Phases

### Phase 1: [Name]

**Goal:** [What "done" looks like for this phase]

- [ ] Task 1
- [ ] Task 2

### Phase 2: [Name]

**Goal:** [What "done" looks like]

- [ ] Task 1
- [ ] Task 2

-----

# DECISIONS LOG

<!--
When you make significant technical decisions, log them here.
This prevents Claude from relitigating settled choices.
-->

|Date      |Decision                            |Rationale                                    |
|----------|------------------------------------|---------------------------------------------|
|YYYY-MM-DD|e.g., "Use Drizzle over Prisma"     |"Better TypeScript inference, lighter weight"|
|YYYY-MM-DD|e.g., "Server actions for mutations"|"Simpler than API routes for internal calls" |
