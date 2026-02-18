Phase 1 Issues: Foundation & Core Data Layer
Issue 1: Define Core Data Models
Goal: Establish type-safe data models for Evidence, Claims, Sources, and Relationships.

Scope:

Define Evidence model (id, content, source_id, timestamp, metadata)
Define Claim model (id, text, evidence_refs[], version, created_at)
Define Source model (id, name, url, independence_score, verified_at)
Define Relationship model (type, from_id, to_id, observed/inferred flag, evidence_ids[])
Include immutability markers and version fields
Acceptance Criteria:

 All models defined with TypeScript interfaces/types or Python dataclasses
 Each model includes audit fields (created_at, version)
 Relationship types enumerated (supports, disputes, corroborates, related)
 Documentation includes field descriptions and constraints
 Basic validation logic for required fields
Risks: Schema changes later may require migration strategy
Dependencies: None
Priority: Critical (blocks all other work)

Issue 2: Set Up Append-Only Event Store
Goal: Implement append-only storage for all state changes.

Scope:

Choose storage backend (PostgreSQL with event log table or purpose-built event store)
Create event log schema (event_id, entity_type, entity_id, event_type, payload, timestamp)
Implement append-only write API
Add read API for event replay
Acceptance Criteria:

 Events cannot be deleted or modified after creation
 Each event has monotonic ID/timestamp
 Can replay events to reconstruct entity state
 Write operations return event IDs
 Basic query API for event ranges and entity history
Risks: Storage growth requires retention policy planning
Dependencies: Issue 1 (data models)
Priority: Critical

Issue 3: Implement Evidence Ingestion Pipeline
Goal: Create pipeline to ingest evidence from external sources.

Scope:

Define ingestion API (REST endpoint or file import)
Validate incoming evidence structure
Extract metadata (source, timestamp, content hash)
Store evidence records
Generate ingestion event
Acceptance Criteria:

 Can ingest evidence via API with proper validation
 Each evidence piece assigned unique ID and content hash
 Source attribution is mandatory
 Duplicate detection based on content hash
 Returns ingestion status and evidence ID
 Includes at least 2 example source formats (Article, Tweet/Social)
Risks: Source format diversity may require extensible parser architecture
Dependencies: Issue 1, Issue 2
Priority: High

Issue 4: Build Claim Creation with Evidence Linkage
Goal: Allow creation of claims explicitly linked to supporting evidence.

Scope:

Claim creation API requiring ≥1 evidence reference
Validate evidence IDs exist before claim creation
Store claim with immutable evidence references
Generate claim creation event
Acceptance Criteria:

 Cannot create claim without valid evidence IDs
 Claim text is stored verbatim (no automatic summarization)
 Evidence links are immutable once created
 API returns claim ID and version
 Audit trail captures who/when claim was created
Risks: Need versioning strategy if claims need updates
Dependencies: Issue 2, Issue 3
Priority: High

Issue 5: Implement Typed Relationship System
Goal: Create system for defining relationships between claims/evidence with explicit typing.

Scope:

Define relationship types (supports, disputes, corroborates, related)
Create relationship API with type enforcement
Mark relationships as observed (direct) vs inferred
Store relationship provenance (who created, based on what evidence)
Default queries return observed-only
Acceptance Criteria:

 Relationships must specify type from enumerated list
 Observed flag is mandatory and defaults to true
 Inferred relationships require algorithm/rule reference
 Can query relationships filtered by type and observed flag
 API prevents circular dependency creation
 Each relationship links to supporting evidence
Risks: Inference logic complexity grows; keep Phase 1 simple
Dependencies: Issue 1, Issue 4
Priority: High

Issue 6: Create Source Independence Heuristics
Goal: Implement basic source independence scoring to support corroboration detection.

Scope:

Define independence factors (ownership, author, publication network)
Create source metadata schema
Implement simple independence score (0.0–1.0)
Store independence relationships between sources
No automatic truth scoring—only independence tracking
Acceptance Criteria:

 Sources have independence_score field
 Can mark sources as related/independent
 Score calculation is documented and testable
 Does not compute "truth" scores
 Includes test cases with known independent/dependent source pairs
Risks: Oversimplification; document limitations clearly
Dependencies: Issue 1
Priority: Medium

Issue 7: Build Graph Query API (Read Layer)
Goal: Provide API to query entities and traverse relationships.

Scope:

Query evidence by source, time range, content hash
Query claims by evidence reference
Traverse relationships (get related claims, evidence trail)
Filter relationships by type and observed flag
Return full audit trail on request
Acceptance Criteria:

 Can retrieve entity by ID with full history
 Can query relationships with type/observed filters
 Graph traversal supports depth limits
 Responses include provenance metadata
 Default behavior hides inferred relationships
 Pagination for large result sets
Risks: Query performance on large graphs requires indexing strategy
Dependencies: Issue 1, Issue 4, Issue 5
Priority: High

Issue 8: Implement Corroboration State Tracking
Goal: Track corroboration/dispute states based on evidence linkage, not truth assessment.

Scope:

Define corroboration states (single-source, multi-source-independent, disputed)
Compute state from evidence + source independence
Store state as derived view (not source of truth)
Update state when new evidence/relationships added
Acceptance Criteria:

 States computed from evidence graph (not manual labels)
 "Corroborated" requires ≥2 independent sources
 "Disputed" requires conflicting claims with evidence
 State changes generate audit events
 No "truth score"—only evidence linkage states
 Documentation clarifies difference from fact-checking
Risks: Heuristics may be too simple; plan for refinement
Dependencies: Issue 4, Issue 5, Issue 6
Priority: Medium

Issue 9: Set Up Testing Infrastructure
Goal: Establish testing framework with minimal example datasets.

Scope:

Choose test framework (pytest, Jest, etc.)
Create fixture data (3–5 sources, 10–15 evidence pieces, 5–10 claims)
Write unit tests for core models and validation
Write integration tests for ingestion and query flows
Set up CI/CD pipeline for automated test runs
Acceptance Criteria:

 All core modules have ≥80% test coverage
 Fixture dataset includes observed and inferred relationships
 Tests verify append-only constraints
 Tests verify evidence linkage requirements
 CI runs tests on every commit
 Includes at least one end-to-end test
Risks: Test data may not cover edge cases; iterate incrementally
Dependencies: Issue 1, Issue 2
Priority: High

Issue 10: Create Database Schema and Migrations
Goal: Implement production-ready database schema with versioned migrations.

Scope:

Design schema for Evidence, Claims, Sources, Relationships, Events
Implement indexes for common query patterns
Create migration tool/framework
Add constraints for data integrity (foreign keys, required fields)
Document schema design decisions
Acceptance Criteria:

 Schema supports append-only event log
 All relationships have foreign key constraints
 Indexes on entity IDs, timestamps, content hashes
 Migration scripts are reversible
 Schema documented with ER diagram
 Can initialize fresh database from migrations
Risks: Schema changes require careful migration planning
Dependencies: Issue 1
Priority: Critical

Issue 11: Build Basic UI—Evidence & Claim Viewer
Goal: Create minimal read-only UI to view evidence and claims with provenance.

Scope:

Display evidence list with source attribution
Show claim detail with linked evidence
Visualize relationships (simple list/table view)
Show audit trail on demand
Default to observed-only relationships with toggle for inferred
Acceptance Criteria:

 Can view evidence with full metadata
 Claim view shows all linked evidence pieces
 Relationship view clearly labels observed vs inferred
 Inferred relationships are off by default
 Audit trail shows creation time, version, provenance
 No edit functionality (append-only)
Risks: Graph visualization may be complex; defer advanced viz to Phase 2
Dependencies: Issue 7
Priority: Medium

Issue 12: Document Architecture and API Contracts
Goal: Create comprehensive documentation for Phase 1 system.

Scope:

Architecture overview (data flow, storage, query layer)
API documentation (endpoints, request/response formats)
Data model reference
Testing and deployment guide
Decision log for key architectural choices
Acceptance Criteria:

 README covers system setup and basic usage
 API docs include example requests/responses
 Architecture doc explains append-only design
 Data model docs describe all entities and relationships
 Includes examples of valid vs invalid operations
 Documents limitations and future Phase 2 scope
Risks: Keeping docs in sync with code requires discipline
Dependencies: All other issues
Priority: Medium

Dependency Order Summary
Start immediately: Issues 1, 6, 9 (no blockers)
After Issue 1: Issues 2, 10
After Issue 2: Issues 3, 4
After Issue 4: Issues 5, 7, 8
After Issue 7: Issue 11
Final: Issue 12 (documents completed system)