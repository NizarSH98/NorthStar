# NorthStar - Evidence & Claim Viewer UI

Phase 1 implementation of the NorthStar evidence-first intelligence platform.

## Overview

This is a **read-only UI** for viewing evidence, claims, and relationships with full provenance tracking. The system implements append-only principles and maintains a clear separation between observed and inferred relationships.

## Features

### 🎯 Core Functionality

- **Evidence List**: Browse all evidence with source attribution, timestamps, and metadata
  - Filter by source and date range
  - Pagination for large datasets
  - Direct links to source URLs
  
- **Claims View**: Explore claims with corroboration status
  - View all linked evidence for each claim
  - See relationship graph (simple list view)
  - Understand corroboration states (single-source, multi-source-independent, disputed)
  
- **Relationship Table**: Visualize connections between evidence and claims
  - **Observed relationships** (directly stated in sources) shown by default
  - **Inferred relationships** (algorithmic) hidden by default with explicit toggle
  - Filter by relationship type (supports, disputes, corroborates, related)
  - Full provenance metadata for each relationship
  
- **Audit Trail**: Complete history of all changes
  - Timeline view of all events
  - Version tracking
  - Export to JSON
  - No deletion or silent updates

### 🔒 Key Principles

1. **Read-Only**: No edit or delete functionality - append-only architecture
2. **Evidence-First**: Every claim must link to evidence
3. **Observed vs Inferred**: Clear visual distinction, inferred OFF by default
4. **Provenance**: Full audit trail for every entity
5. **No Truth Scoring**: Only tracks corroboration and source independence

## Project Structure

```
NorthStar/
├── backend/
│   ├── src/
│   │   ├── server.ts          # Express API server
│   │   └── types.ts            # TypeScript type definitions
│   └── data/
│       └── mockData.ts         # Sample dataset
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EvidenceList.tsx
│   │   │   ├── ClaimsList.tsx
│   │   │   ├── ClaimDetail.tsx
│   │   │   ├── RelationshipTable.tsx
│   │   │   └── AuditTrailModal.tsx
│   │   ├── api/
│   │   │   └── index.ts        # API client
│   │   ├── types/
│   │   │   └── index.ts        # Frontend types
│   │   ├── utils/
│   │   │   └── formatters.ts   # Utility functions
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── package.json
```

## Installation

### Prerequisites

- Node.js 18+ and npm

### Setup

1. Install dependencies:
```bash
npm install
cd frontend && npm install && cd ..
```

2. Run both backend and frontend:
```bash
npm run dev
```

This will start:
- Backend API server on http://localhost:3001
- Frontend dev server on http://localhost:3000

### Individual Commands

```bash
# Run backend only
npm run backend

# Run frontend only (from frontend directory)
cd frontend && npm run dev

# Build for production
npm run build
```

## API Endpoints

The backend provides the following endpoints (Issue #7 - Graph Query API stub):

### Evidence
- `GET /api/evidence` - List evidence (with filters: source, dateFrom, dateTo, page, perPage)
- `GET /api/evidence/:id` - Get evidence by ID with source details

### Claims
- `GET /api/claims` - List claims (with pagination)
- `GET /api/claims/:id` - Get claim with linked evidence and relationships

### Relationships
- `GET /api/relationships` - List relationships (filters: observedOnly, relationshipType, entityId)

### Audit
- `GET /api/audit/:entityType/:entityId` - Get audit trail for specific entity
- `GET /api/audit` - Get all audit events

### Sources
- `GET /api/sources` - List all sources
- `GET /api/sources/:id` - Get source by ID

## Data Model

### Evidence
- Unique ID, content, source reference
- Timestamp and creation metadata
- Immutable once created

### Claim
- Text statement with version tracking
- Required evidence references (minimum 1)
- Corroboration state (computed from evidence graph)

### Relationship
- Typed connections (supports, disputes, corroborates, related)
- Observed (direct) vs Inferred (algorithmic) flag
- Provenance metadata (creator, algorithm, confidence)

### Source
- Name, URL, verification status
- Independence score (0.0-1.0)
- Metadata (type, country, etc.)

## UI Features Detail

### Corroboration States

- **Single Source**: Evidence from only one source
- **Multi-Source Independent**: Evidence from 2+ independent sources
- **Disputed**: Conflicting claims with supporting evidence

**Note**: These are NOT truth scores. They only indicate evidence linkage patterns.

### Relationship Types

- **Supports**: Evidence/claim supports another claim
- **Disputes**: Evidence/claim contradicts another claim
- **Corroborates**: Multiple pieces of evidence align
- **Related**: General connection between entities

### Observed vs Inferred

- **Observed**: Directly stated or evident in source material (shown by default)
- **Inferred**: Detected by algorithms, may not be explicit (hidden by default)

All inferred relationships show:
- Algorithm name
- Confidence score
- "INFERRED" label (yellow/amber styling)

## Testing

Mock data includes:
- 4 diverse sources (news, independent, government, local)
- 5 evidence pieces about a city council infrastructure vote
- 4 claims with various corroboration states
- 7 relationships (5 observed, 2 inferred)
- 5 audit events demonstrating history tracking

## Acceptance Criteria Status

- [x] Can view evidence with full metadata
- [x] Claim view shows all linked evidence pieces
- [x] Relationship view clearly labels observed vs inferred
- [x] Inferred relationships are off by default
- [x] Audit trail shows creation time, version, provenance
- [x] No edit functionality (append-only, read-only UI)

## Future Enhancements (Phase 2+)

- Advanced graph visualization
- Real-time updates
- Search and advanced filtering
- User authentication
- Actual database backend (currently uses mock data)
- Claim creation workflow
- Source reliability dashboard

## License

ISC

## Contributing

This is a Phase 1 MVP implementation. See PRD.md for the full product roadmap.
