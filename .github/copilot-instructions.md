# Copilot Instructions — Evidence-first News/Politics Graph Platform

You are working in a repo that prioritizes:
- correctness and auditability over speed
- append-only history
- explicit evidence links for any claim or summary
- strict separation of observed vs inferred relationships

Rules:
1) Do not implement “truth scoring”. Only implement corroboration/dispute states based on evidence linkage and source-independence heuristics.
2) Any summarization output must reference underlying evidence/claims.
3) No silent rewriting of stored states; use append-only logs + versioned records.
4) Graph relationships must be typed and filterable.
5) Default UI must show observed-only relationships; inferred must be labeled + off by default.
6) Prefer simple, testable modules. Each feature must include basic tests and a minimal example dataset.

Workflow:
- For each issue: propose a plan, implement, add tests, run checks, then open PR with a clear description and verification steps.
