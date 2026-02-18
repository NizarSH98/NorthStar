# NorthStar - One-Click Development

## Run Everything

```powershell
.\develop-all.ps1
```

That's it. Watch it build itself.

## Or Use GitHub

Go to: https://github.com/NizarSH98/NorthStar/actions/workflows/auto-develop.yml

Click "Run workflow"

---

## What It Does

- Creates all code files
- Implements Phase 1 features
- Runs tests
- Auto-commits progress
- Closes completed issues

## Tech Stack

- TypeScript
- PostgreSQL
- Express
- Jest

## Project Structure

```
src/
  models/      # Data types
  storage/     # Event store + DB
  api/         # REST endpoints
  graph/       # Relationships
tests/         # Automated tests
```

## Phase 1 Features

✓ Evidence-first data models
✓ Append-only event store  
✓ Evidence ingestion
✓ Claim creation with evidence links
✓ Typed relationships (observed/inferred)
✓ Source independence scoring
✓ Graph query API
✓ Corroboration tracking

## Principles

- Append-only (no updates/deletes)
- Evidence required for claims
- No truth scoring
- Explicit provenance
- Immutable after creation
