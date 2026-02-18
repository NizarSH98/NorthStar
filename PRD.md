# PRD — Evidence-first Event Graph for Politics & News Intelligence

## 0) Vision
Build a low-stress, objective, up-to-date political/news intelligence platform that:
- Organizes reality into canonical Events
- Separates Evidence and Claims from summaries
- Exposes disputes instead of hiding them
- Connects Events, Actors, Places, and Policies through navigable relationships
- Uses progressive disclosure so users understand fast without overload

Non-goals:
- No engagement-optimized feed
- No “truth machine” assertions
- No hidden synthesis without traceable evidence links

## 1) Guiding Principles (Constitution)
1. Evidence-first: every displayed claim links to evidence.
2. Append-only history: updates never silently rewrite prior states.
3. Observed vs inferred separation: inferred links are always labeled and off by default.
4. Disputes stay visible until resolved.
5. Rank by relevance + corroboration + diversity, never by engagement.
6. Progressive disclosure: Brief → Evidence → Relationships → Deep dive.

## 2) Target Users
- Citizen: wants a calm, reliable briefing for a place/topic.
- Journalist/Researcher: needs auditability, source trails, and relationship navigation.
- Policy watcher: wants policy lifecycles and downstream related events.

## 3) Core Objects (Conceptual Data Model)
Nodes:
- Event: canonical real-world occurrence
- EvidenceItem: article / official document / dataset / transcript
- Claim: atomic statement extracted from evidence (Phase 2+)
- Actor: person / party / company / NGO
- Institution
- Place: town / city / country / international region
- Policy: bill / decree / regulation
- Dataset/Metric: numeric indicators and time series (Phase 3+)

Edges (examples):
- Event -> has_evidence -> EvidenceItem
- Event -> occurred_in -> Place
- Event -> involves -> Actor
- Event -> references -> Policy
- EvidenceItem -> asserts -> Claim (Phase 2+)
- Claim -> supports/contradicts -> Claim (Phase 2+)
- Actor -> member_of -> Institution (Phase 3+)
- Policy -> amends -> Policy (Phase 3+)
- Event -> related_to -> Event (observed) (Phase 3+)
- Event -> may_lead_to -> Event (inferred) (Phase 3+)

## 4) Product Phases (each phase independently shippable)

### Phase 1 — Structured Event Ledger (Working Draft)
Goal:
- Fully working system that deduplicates content into canonical Events
- Attaches EvidenceItems
- Tracks update history (append-only)
- Enables filtering by place/topic/time
- Basic relationship navigation (Event <-> Place/Actor/Policy)

Scope:
- Nodes: Event, EvidenceItem, Actor, Place, Policy
- No Claims yet.
- No inferred relationships.

User Experience:
- Home: scope selector (Town/City/Country/International), topic filters, timeline list.
- Event Page: neutral summary, evidence list, involved actors, place, update history.

Reliability Guarantees:
- No deletion of Events (only status transitions).
- Evidence always visible and linked.
- Update history append-only.

Exit Criteria:
- 100+ events, dedupe quality acceptable.
- Filters work at all scope levels.
- Event page is consistently structured.

---

### Phase 2 — Claims + Corroboration + Dispute
Goal:
- Separate “what happened” (Event) from “who claims what” (Claim).
- Introduce corroboration and dispute views.

Scope:
- Add Claim nodes.
- EvidenceItem -> asserts -> Claim
- Claim classification: Observable / Interpretive / Predictive
- Corroboration indicators: Unverified / Corroborated / Disputed
- Claim-to-claim support/contradiction.

User Experience:
- Event Page adds: claim list with confidence markers, disputed toggle, evidence per claim.

Reliability Guarantees:
- Claims never merged silently.
- Observable vs interpretive claims visually distinct.
- Disputed claims remain visible.

Exit Criteria:
- Claims attached to >= 60% of events.
- Dispute view works and is understandable to non-experts.

---

### Phase 3 — Relationship Graph + Policy Lifecycle
Goal:
- Turn platform into navigable knowledge map across actors, policies, and events.

Scope:
- Actor pages: related events, co-actors, policy links.
- Policy pages: lifecycle timeline, amendments, related events, stakeholders.
- Observed vs inferred edges introduced (inferred off by default).

User Experience:
- Graph view with filters:
  - observed-only toggle
  - edge type filters
  - time window
  - geography scope

Reliability Guarantees:
- Observed edges must reference explicit evidence.
- Inferred edges always labeled and disabled by default.

Exit Criteria:
- Actor and policy pages provide clear, useful navigation.
- Graph view remains usable at scale.

---

### Phase 4 — Low-Stress Intelligence (Cognitive Load Control)
Goal:
- Make understanding effortless without sacrificing objectivity.

Scope:
- Auto briefing: 5–10 neutral bullets per selected scope/topic.
- Change detection: highlight only meaningful updates since last visit.
- “What would resolve this?” checklists for disputed clusters.
- Transparent scoring: corroboration + diversity + primary evidence presence.

Reliability Guarantees:
- Briefing bullets trace to claims + evidence.
- No hidden narrative synthesis.

Exit Criteria:
- A user can understand a city/country situation in < 5 minutes.
- Users can avoid noise yet not miss major developments.

---

### Phase 5 — Institutional-Grade Trust & Openness (Optional)
Goal:
- Become infrastructure-grade.

Scope:
- Public methodology and correction policy.
- Immutable audit log.
- Open export formats + API (within licensing).
- Governance model for source reliability policies.

Exit Criteria:
- External users can verify changes and reproduce views from timestamps.

## 5) Key Screens (MVP to Advanced)
- Briefing Home (scope/topic/time)
- Event Page (summary, evidence, updates, then claims/graph in later phases)
- Actor Page (events, connections, policies)
- Policy Page (timeline, amendments, related events, stakeholders)
- Graph Explorer (observed by default)

## 6) Quality Gates (Non-negotiable)
- Every event summary must link to evidence.
- Every claim must link to evidence.
- Disputes never hidden.
- Observed vs inferred separation enforced everywhere.
- Append-only update history; no silent rewriting.
