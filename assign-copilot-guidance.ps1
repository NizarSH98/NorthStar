# assign-copilot-guidance.ps1 - Add Copilot prompting guidance to all Phase 1 issues

$copilotGuidance = @{
    1 = @"
## 🤖 Copilot Implementation Guidance

**Context for Copilot:**
"This is an evidence-first news/politics graph platform. We need type-safe, immutable data models with full audit trails. All models must support append-only history and explicit versioning."

**Recommended Copilot Prompts:**

\`\`\`
# Prompt 1: Create the Evidence model
Create a TypeScript interface for an Evidence model with these fields:
- id (UUID)
- content (string)
- source_id (UUID reference)
- timestamp (ISO datetime)
- metadata (flexible object)
- content_hash (SHA-256)
- created_at (timestamp)
- version (integer)
Make all fields immutable after creation.

# Prompt 2: Create the Claim model
Create a Claim model with:
- id, text, evidence_refs (array of UUIDs)
- version, created_at
- Ensure evidence_refs is immutable once set
- Add validation that evidence_refs cannot be empty

# Prompt 3: Create the Relationship model
Create a Relationship model with:
- type: enum of 'supports' | 'disputes' | 'corroborates' | 'related'
- from_id, to_id (entity references)
- observed: boolean (default true for observed, false for inferred)
- evidence_ids: array of supporting evidence
- provenance: who/when/how it was created

# Prompt 4: Add validation functions
Create validation functions for each model that:
- Check required fields
- Validate UUID formats
- Ensure timestamps are valid
- Verify enum values for relationship types
\`\`\`

**Key Principles to Remind Copilot:**
- No mutable state after creation
- All changes create new versions
- Every model must have created_at and version
- Evidence references must be validated before use

**Testing Prompts:**
\`\`\`
# Create unit tests for Evidence model validation
# Create test cases for immutability constraints
# Test that relationships require valid evidence_ids
\`\`\`
"@

    2 = @"
## 🤖 Copilot Implementation Guidance

**Context for Copilot:**
"We need an append-only event store where all state changes are recorded as immutable events. Events can never be deleted or modified. This is critical for auditability and evidence integrity."

**Recommended Copilot Prompts:**

\`\`\`
# Prompt 1: Design event log schema
Create a PostgreSQL schema for an event_log table with:
- event_id (UUID primary key)
- entity_type (string enum: evidence, claim, source, relationship)
- entity_id (UUID)
- event_type (string: created, linked, updated)
- payload (JSONB with full event data)
- timestamp (timestamptz with default now())
- Add index on (entity_type, entity_id, timestamp)
- Make table INSERT-only (no UPDATE or DELETE)

# Prompt 2: Create append-only write API
Create a Node.js/TypeScript function that:
- Accepts event data (entity_type, entity_id, event_type, payload)
- Validates event structure
- Inserts into event_log table
- Returns the event_id and timestamp
- Throws error if validation fails
- Never allows updates or deletes

# Prompt 3: Implement event replay function
Create a function to reconstruct entity state by:
- Querying all events for a given entity_id
- Replaying events in timestamp order
- Building current state from event sequence
- Returning both state and event history

# Prompt 4: Add query API
Create functions to:
- Get all events for an entity
- Get events in a time range
- Get events by type
- Include pagination for large event sets
\`\`\`

**Key Principles:**
- Events are immutable - no UPDATE or DELETE queries
- Use database constraints to enforce append-only
- Every write returns an event_id for tracking
- Event payload must be complete (no partial updates)

**Testing Prompts:**
\`\`\`
# Test that UPDATE and DELETE operations fail
# Test event replay produces correct state
# Test concurrent inserts work correctly
\`\`\`
"@

    3 = @"
## 🤖 Copilot Implementation Guidance

**Context for Copilot:**
"Build a pipeline to ingest evidence from external sources. Every evidence piece must have a source, timestamp, and content hash for deduplication. This is the entry point for all data."

**Recommended Copilot Prompts:**

\`\`\`
# Prompt 1: Create ingestion API endpoint
Create a REST endpoint POST /api/evidence/ingest that:
- Accepts JSON: { content, source_id, metadata }
- Validates required fields
- Generates UUID for evidence
- Computes SHA-256 content hash
- Checks for duplicate by content_hash
- Stores in database via event store
- Returns { evidence_id, status, content_hash }

# Prompt 2: Create evidence parser for article format
Create a parser function for news articles:
- Input: { title, body, url, author, published_date, source }
- Extract metadata (word_count, language, etc.)
- Generate structured evidence object
- Validate URL format
- Handle missing optional fields

# Prompt 3: Create parser for social media format
Create parser for Twitter/X posts:
- Input: { text, author_handle, post_url, timestamp, likes, retweets }
- Extract hashtags and mentions
- Store engagement metrics in metadata
- Validate timestamp format
- Handle images/media references

# Prompt 4: Implement duplicate detection
Create a function that:
- Computes content hash before insert
- Queries existing evidence by content_hash
- Returns existing evidence_id if duplicate found
- Otherwise proceeds with insert
- Logs duplicate detection events
\`\`\`

**Key Principles:**
- Source attribution is mandatory - reject if missing
- Content hash enables exact deduplication
- Metadata should be extensible for different formats
- Each ingestion creates an event in event log

**Testing Prompts:**
\`\`\`
# Test duplicate detection with same content
# Test validation rejects missing source_id
# Test parsing both article and social formats
# Test API returns proper error codes
\`\`\`
"@

    4 = @"
## 🤖 Copilot Implementation Guidance

**Context for Copilot:**
"Claims must always be backed by evidence. A claim without evidence is not allowed. Evidence links are immutable once created. Claims represent statements that can be verified."

**Recommended Copilot Prompts:**

\`\`\`
# Prompt 1: Create claim creation API
Create POST /api/claims endpoint that:
- Accepts: { text, evidence_ids: UUID[] }
- Validates evidence_ids array is not empty
- Checks all evidence_ids exist in database
- Creates claim with immutable evidence reference
- Generates claim creation event
- Returns { claim_id, version, evidence_count }

# Prompt 2: Implement evidence validation
Create a function that:
- Takes array of evidence_ids
- Queries database to verify all IDs exist
- Returns validation result with missing IDs if any
- Rejects claim creation if any evidence missing
- Logs validation failures

# Prompt 3: Create claim versioning system
When a claim needs update:
- Create new version with new UUID
- Link to previous version
- Preserve original evidence links
- Add new evidence to new version
- Event log tracks version chain

# Prompt 4: Build claim retrieval with evidence
Create GET /api/claims/:id endpoint that:
- Returns claim with full text
- Includes array of linked evidence objects
- Shows creation metadata (who, when, version)
- Includes audit trail of all events
- Populates source info for each evidence piece
\`\`\`

**Key Principles:**
- Minimum 1 evidence piece required per claim
- Evidence links cannot be modified after creation
- Store claim text verbatim (no auto-summarization)
- All changes create new versions, not updates

**Testing Prompts:**
\`\`\`
# Test claim creation fails with empty evidence_ids
# Test claim creation fails with invalid evidence_ids
# Test evidence links are immutable
# Test claim includes full evidence details on retrieval
\`\`\`
"@

    5 = @"
## 🤖 Copilot Implementation Guidance

**Context for Copilot:**
"Relationships connect claims and evidence with explicit typing. Observed relationships are direct/manual. Inferred relationships are computed. Default queries show observed only."

**Recommended Copilot Prompts:**

\`\`\`
# Prompt 1: Define relationship type enum
Create TypeScript enum:
type RelationshipType = 'supports' | 'disputes' | 'corroborates' | 'related'

Create relationship model with:
- id, type (RelationshipType)
- from_id, to_id (UUID references)
- observed (boolean, default true)
- evidence_ids (supporting evidence)
- algorithm (required if observed=false)
- created_at, created_by

# Prompt 2: Create relationship API
Create POST /api/relationships endpoint that:
- Validates relationship type is valid enum
- Checks from_id and to_id exist
- Requires evidence_ids for observed relationships
- Requires algorithm field for inferred (observed=false)
- Prevents circular references
- Creates relationship event

# Prompt 3: Implement circular dependency check
Create function to detect cycles:
- Build directed graph from relationships
- Check if adding new edge creates cycle
- Use DFS or similar algorithm
- Return error if cycle detected
- Allow self-references only for specific types

# Prompt 4: Build relationship query with filters
Create GET /api/relationships endpoint with filters:
- ?type=supports (filter by relationship type)
- ?observed=true (default: only observed)
- ?from_id=UUID (relationships from entity)
- ?to_id=UUID (relationships to entity)
- Include provenance in response
\`\`\`

**Key Principles:**
- Observed true for human-created, false for computed
- Inferred relationships must cite algorithm/rule
- Filter observed-only by default in all UIs
- Each relationship needs evidence justification

**Testing Prompts:**
\`\`\`
# Test relationship creation with all types
# Test circular reference detection
# Test query filters (type, observed)
# Test inferred relationships require algorithm field
\`\`\`
"@

    6 = @"
## 🤖 Copilot Implementation Guidance

**Context for Copilot:**
"Source independence scoring helps detect corroboration. Independent sources strengthen claims. This is NOT truth scoring - only independence measurement."

**Recommended Copilot Prompts:**

\`\`\`
# Prompt 1: Define source independence schema
Create Source model with:
- id, name, url, type (news_org, social, primary_doc)
- independence_score (float 0.0-1.0)
- ownership (string, for grouping)
- related_sources (array of source IDs)
- verified_at, metadata

# Prompt 2: Implement independence scoring
Create function to calculate independence:
- Check if sources share ownership (score: 0.0)
- Check if sources are related/affiliated (score: 0.3)
- Check if sources are independent (score: 1.0)
- Consider publication network overlap
- Return score with explanation
- DO NOT compute truth values

# Prompt 3: Create source relationship API
Create endpoints to:
- POST /api/sources/:id/relationships
  Add ownership/affiliation links between sources
- GET /api/sources/:id/independence?compare_to=other_id
  Calculate independence between two sources
- Explain scoring logic in response

# Prompt 4: Build source metadata store
Store for each source:
- Ownership structure
- Editorial board overlap
- Funding sources (if public)
- Publication partnerships
- Sister organizations
\`\`\`

**Key Principles:**
- Independence is about sources, NOT truth
- Score based on observable relationships
- Document all scoring heuristics
- Make limitations explicit in docs
- No automatic "truth" or "reliability" scores

**Testing Prompts:**
\`\`\`
# Test same ownership gives 0.0 score
# Test independent sources give 1.0 score
# Test scoring is symmetric (A to B = B to A)
# Test documentation explains limitations
\`\`\`
"@

    7 = @"
## 🤖 Copilot Implementation Guidance

**Context for Copilot:**
"Query API provides read access to the graph. Default behavior hides inferred relationships. Support traversal with depth limits. Include full provenance."

**Recommended Copilot Prompts:**

\`\`\`
# Prompt 1: Create evidence query API
Create GET /api/evidence with filters:
- ?source_id=UUID
- ?from_date=ISO8601&to_date=ISO8601
- ?content_hash=sha256
- Include pagination (limit, offset)
- Return evidence with source details
- Include creation metadata

# Prompt 2: Create claims query API
Create GET /api/claims with filters:
- ?evidence_id=UUID (claims using this evidence)
- ?text_search=query (full-text search)
- Return claims with linked evidence
- Include relationship counts
- Support pagination

# Prompt 3: Implement graph traversal
Create POST /api/graph/traverse:
- Input: { start_id, max_depth, relationship_types?, observed_only=true }
- BFS/DFS traversal from start entity
- Respect max_depth limit (default: 3)
- Filter by relationship types
- Default: observed relationships only
- Return graph structure with nodes and edges

# Prompt 4: Build audit trail retrieval
Create GET /api/entities/:id/history:
- Return all events for entity from event log
- Show version history
- Include relationship changes
- Display who/when for each change
- Support filtering by event_type
\`\`\`

**Key Principles:**
- Inferred relationships hidden by default
- Always include provenance metadata
- Paginate large result sets
- Graph traversal needs depth limits
- Return full audit trail on request

**Testing Prompts:**
\`\`\`
# Test default query excludes inferred relationships
# Test graph traversal respects max_depth
# Test pagination works for large results
# Test audit trail shows complete history
\`\`\`
"@

    8 = @"
## 🤖 Copilot Implementation Guidance

**Context for Copilot:**
"Corroboration tracks multi-source evidence, NOT truth. States are computed from the graph. No manual truth labels. Distinguish from fact-checking."

**Recommended Copilot Prompts:**

\`\`\`
# Prompt 1: Define corroboration states
Create enum:
type CorroborationState = 
  | 'single-source'           // Only one source
  | 'multi-source-dependent'  // Multiple but related sources
  | 'multi-source-independent' // 2+ independent sources
  | 'disputed'                // Conflicting claims exist

Add to Claim model:
- corroboration_state (computed, not stored)
- corroboration_metadata { source_count, independence_scores }

# Prompt 2: Implement corroboration computation
Create function computeCorroborationState(claim_id):
- Get all evidence for claim
- Get sources for each evidence
- Calculate source independence
- Check for conflicting claims (disputes relationship)
- Return state based on:
  * 1 source -> single-source
  * Multiple related sources -> multi-source-dependent
  * 2+ independent sources -> multi-source-independent
  * Conflicting claims -> disputed

# Prompt 3: Build state tracking system
Create derived view that:
- Computes corroboration_state for all claims
- Updates when new evidence or relationships added
- Generates state_change events
- Caches computed values with refresh trigger

# Prompt 4: Create corroboration query API
Create GET /api/claims/:id/corroboration:
- Return current state
- List all evidence pieces
- Show source independence scores
- Display conflicting claims if disputed
- Explain state calculation
- Include disclaimer: "Not a truth assessment"
\`\`\`

**Key Principles:**
- States computed from graph, never manual labels
- Independent = independence_score >= 0.8
- Disputed requires explicit "disputes" relationship
- No truth/reliability/credibility scores
- Document difference from fact-checking clearly

**Testing Prompts:**
\`\`\`
# Test single source gives single-source state
# Test 2 independent sources gives multi-source-independent
# Test related sources gives multi-source-dependent
# Test disputes relationship triggers disputed state
\`\`\`
"@

    9 = @"
## 🤖 Copilot Implementation Guidance

**Context for Copilot:**
"Testing requires comprehensive coverage with realistic fixture data. Tests must verify append-only constraints and evidence linkage. CI runs on every commit."

**Recommended Copilot Prompts:**

\`\`\`
# Prompt 1: Set up testing framework
Create package.json with Jest (or pytest for Python):
- Install testing framework
- Configure test scripts
- Set up coverage reporting
- Configure 80% coverage threshold
- Add test command to CI workflow

# Prompt 2: Create fixture data
Generate fixture data file:
- 5 diverse sources (CNN, Twitter, Reuters, Primary Doc, Blog)
- Set independence scores and relationships
- 15 evidence pieces across sources
- 10 claims with varying evidence counts
- Both observed and inferred relationships
- Include edge cases (single evidence, circular refs)

# Prompt 3: Write unit tests for models
For each model (Evidence, Claim, Source, Relationship):
- Test validation logic
- Test required fields enforcement
- Test immutability after creation
- Test UUID generation
- Test timestamp defaults
- Test enum value validation

# Prompt 4: Write integration tests
Create tests for:
- Evidence ingestion end-to-end
- Claim creation with evidence validation
- Relationship creation with cycle detection
- Graph traversal with depth limits
- Event log append-only enforcement
- Duplicate evidence detection

# Prompt 5: Create CI configuration
Create .github/workflows/test.yml:
- Run tests on push and PR
- Fail if coverage below 80%
- Run linting
- Verify append-only constraints
- Test all API endpoints
\`\`\`

**Key Principles:**
- 80% minimum coverage for core modules
- Test data must be realistic and diverse
- Verify append-only constraints thoroughly
- Test evidence linkage requirements
- Include end-to-end workflow tests

**Testing Prompts:**
\`\`\`
# Test that events cannot be updated or deleted
# Test that claims require evidence
# Test fixture data loads successfully
# Test CI fails on coverage drop
\`\`\`
"@

    10 = @"
## 🤖 Copilot Implementation Guidance

**Context for Copilot:**
"Database schema must support append-only event log plus entity tables. Use migrations for versioning. Index for query performance. Enforce constraints."

**Recommended Copilot Prompts:**

\`\`\`
# Prompt 1: Create initial migration
Create SQL migration 001_initial_schema.sql:
- event_log table (event_id PK, entity_type, entity_id, event_type, payload JSONB, timestamp)
- evidence table (id, content, source_id FK, content_hash, metadata JSONB, created_at)
- claims table (id, text, version, created_at)
- sources table (id, name, url, independence_score, metadata JSONB)
- relationships table (id, type, from_id, to_id, observed, evidence_ids, created_at)
- claim_evidence junction table (claim_id FK, evidence_id FK, immutable)

# Prompt 2: Add indexes
Create indexes for:
- event_log: (entity_type, entity_id, timestamp)
- evidence: (source_id), (content_hash), (created_at)
- claims: (created_at)
- relationships: (from_id), (to_id), (type, observed)
- Use GIN index on JSONB metadata columns

# Prompt 3: Add constraints
Add constraints:
- Foreign keys with CASCADE for reads, RESTRICT for deletes
- NOT NULL on required fields
- CHECK constraints for enums (relationship_type)
- UNIQUE on evidence.content_hash
- CHECK independence_score BETWEEN 0.0 AND 1.0
- Trigger to prevent UPDATE/DELETE on event_log

# Prompt 4: Create migration tool setup
Set up migration framework (e.g., node-pg-migrate, Flyway, Alembic):
- Initialize migration tracking table
- Create up/down migration scripts
- Add rollback capability
- Document migration process
- Test migrations on fresh database

# Prompt 5: Generate ER diagram
Create documentation with:
- Entity-relationship diagram
- Table descriptions
- Index rationale
- Constraint explanations
- Migration versioning strategy
\`\`\`

**Key Principles:**
- Event log is append-only (use trigger to enforce)
- All entities have immutable IDs
- Foreign keys maintain referential integrity
- Indexes optimize common query patterns
- Migrations are reversible

**Testing Prompts:**
\`\`\`
# Test event_log prevents UPDATE and DELETE
# Test migrations can initialize fresh database
# Test constraints reject invalid data
# Test indexes improve query performance
\`\`\`
"@

    11 = @"
## 🤖 Copilot Implementation Guidance

**Context for Copilot:**
"Build read-only UI showing evidence and claims with provenance. Default view hides inferred relationships. Show audit trails on demand. No edit functionality."

**Recommended Copilot Prompts:**

\`\`\`
# Prompt 1: Create evidence list view
Build React component (or similar):
- Display table/list of evidence pieces
- Show: content (truncated), source name, timestamp
- Include metadata preview
- Link to source if URL available
- Add filters: source, date range
- Pagination for large lists

# Prompt 2: Build claim detail view
Create component to show:
- Full claim text
- List of all linked evidence (expandable)
- Each evidence shows: content, source, timestamp
- Relationship graph (simple list view)
- Corroboration state with explanation
- Button to view full audit trail

# Prompt 3: Create relationship visualization
Build component:
- List relationships as table
- Columns: Type, From, To, Observed/Inferred
- Filter toggle: "Show inferred relationships" (off by default)
- Visual distinction for inferred (grayed out, labeled)
- Click to see supporting evidence for relationship
- Show provenance: who created, when, based on what

# Prompt 4: Implement audit trail modal
Create component that shows:
- Timeline of all events for entity
- Each event: type, timestamp, who, what changed
- Version history if applicable
- Event payload details (expandable)
- Link to related entities
- Export audit log button

# Prompt 5: Add UI disclaimers
Include prominent text:
- "Corroboration ≠ Truth Assessment"
- "Inferred relationships are algorithmic, not verified"
- Explain observed vs inferred
- Link to methodology documentation
\`\`\`

**Key Principles:**
- Read-only view (no edit/delete buttons)
- Inferred relationships OFF by default
- Always show provenance when available
- Clear labeling of observed vs inferred
- Audit trail available on demand

**Testing Prompts:**
\`\`\`
# Test inferred relationships hidden by default
# Test audit trail displays all events
# Test filters work correctly
# Test no edit functionality exposed
\`\`\`
"@

    12 = @"
## 🤖 Copilot Implementation Guidance

**Context for Copilot:**
"Comprehensive documentation covering architecture, API contracts, data models, and decision rationale. Must be maintainable and kept in sync with code."

**Recommended Copilot Prompts:**

\`\`\`
# Prompt 1: Create architecture overview
Write docs/architecture.md:
- System overview diagram (data flow)
- Components: Ingestion → Event Store → Query Layer → UI
- Append-only design rationale
- Evidence-first principles explanation
- Technology stack and justification
- Scaling considerations

# Prompt 2: Generate API documentation
Create docs/api.md with OpenAPI/Swagger format:
- All endpoints with methods
- Request/response schemas
- Example requests with curl
- Example responses with full JSON
- Error codes and messages
- Authentication if applicable
- Rate limiting if applicable

# Prompt 3: Document data models
Write docs/data-models.md:
- Each entity (Evidence, Claim, Source, Relationship)
- Field descriptions with types and constraints
- Validation rules
- Relationship cardinalities
- Event log structure
- Example JSON for each model

# Prompt 4: Create testing guide
Write docs/testing.md:
- How to run tests
- Coverage requirements
- How to add new tests
- Fixture data location and format
- CI/CD pipeline overview
- How to debug test failures

# Prompt 5: Create deployment guide
Write docs/deployment.md:
- Setup instructions (dependencies)
- Database migration process
- Environment variables
- Running locally
- Production deployment steps
- Monitoring and logging

# Prompt 6: Document design decisions
Create docs/decisions.md (ADR format):
- Why append-only event store
- Why no truth scoring
- Why default to observed-only
- Why immutable evidence links
- Why evidence required for claims
- Trade-offs and limitations

# Prompt 7: Create limitations document
Write docs/limitations.md:
- What this system does NOT do
- Difference from fact-checking
- Independence scoring limitations
- Corroboration ≠ truth
- When to use and not use this tool
\`\`\`

**Key Principles:**
- Keep docs in sync with code
- Include examples everywhere
- Explain "why" not just "what"
- Document limitations explicitly
- Provide setup and usage guides

**Testing Prompts:**
\`\`\`
# Create README that covers basic setup
# Generate API docs from code comments
# Create examples for each API endpoint
# Document all decision rationales
\`\`\`
"@
}

Write-Host "Adding Copilot prompting guidance to all Phase 1 issues..." -ForegroundColor Cyan
Write-Host ""

$success = 0
$failed = 0

foreach ($issueNum in 1..12) {
    try {
        Write-Host "Adding guidance to Issue #$issueNum..." -NoNewline
        
        $guidance = $copilotGuidance[$issueNum]
        $result = gh issue comment $issueNum --body $guidance 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ✓" -ForegroundColor Green
            $success++
        } else {
            Write-Host " ✗" -ForegroundColor Red
            Write-Host "  Error: $result" -ForegroundColor Red
            $failed++
        }
        
        Start-Sleep -Milliseconds 500
    }
    catch {
        Write-Host " ✗" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Success: $success" -ForegroundColor Green
Write-Host "  Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($success -gt 0) {
    Write-Host "✓ All issues now have Copilot prompting guidance!" -ForegroundColor Green
    Write-Host "  Developers can use these prompts to implement each task effectively." -ForegroundColor Cyan
}
