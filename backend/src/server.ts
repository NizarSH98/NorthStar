import express, { Request, Response } from 'express';
import cors from 'cors';
import {
  mockSources,
  mockEvidence,
  mockClaims,
  mockRelationships,
  mockAuditEvents
} from '../data/mockData';
import { QueryParams } from './types';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all sources
app.get('/api/sources', (req: Request, res: Response) => {
  res.json({ data: mockSources, total: mockSources.length });
});

// Get source by ID
app.get('/api/sources/:id', (req: Request, res: Response) => {
  const source = mockSources.find(s => s.id === req.params.id);
  if (!source) {
    return res.status(404).json({ error: 'Source not found' });
  }
  res.json({ data: source });
});

// Get all evidence with filtering and pagination
app.get('/api/evidence', (req: Request, res: Response) => {
  const {
    page = 1,
    perPage = 10,
    source,
    dateFrom,
    dateTo
  } = req.query as any;

  let filtered = [...mockEvidence];

  // Filter by source
  if (source) {
    filtered = filtered.filter(e => e.source_id === source);
  }

  // Filter by date range
  if (dateFrom) {
    filtered = filtered.filter(e => e.timestamp >= dateFrom);
  }
  if (dateTo) {
    filtered = filtered.filter(e => e.timestamp <= dateTo);
  }

  // Sort by timestamp (newest first)
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Pagination
  const pageNum = parseInt(page as string);
  const perPageNum = parseInt(perPage as string);
  const start = (pageNum - 1) * perPageNum;
  const end = start + perPageNum;
  const paginated = filtered.slice(start, end);

  res.json({
    data: paginated,
    total: filtered.length,
    page: pageNum,
    perPage: perPageNum,
    totalPages: Math.ceil(filtered.length / perPageNum)
  });
});

// Get evidence by ID
app.get('/api/evidence/:id', (req: Request, res: Response) => {
  const evidence = mockEvidence.find(e => e.id === req.params.id);
  if (!evidence) {
    return res.status(404).json({ error: 'Evidence not found' });
  }

  // Get source info
  const source = mockSources.find(s => s.id === evidence.source_id);

  res.json({
    data: {
      ...evidence,
      source
    }
  });
});

// Get all claims with pagination
app.get('/api/claims', (req: Request, res: Response) => {
  const { page = 1, perPage = 10 } = req.query as any;

  const pageNum = parseInt(page as string);
  const perPageNum = parseInt(perPage as string);
  const start = (pageNum - 1) * perPageNum;
  const end = start + perPageNum;
  const paginated = mockClaims.slice(start, end);

  res.json({
    data: paginated,
    total: mockClaims.length,
    page: pageNum,
    perPage: perPageNum,
    totalPages: Math.ceil(mockClaims.length / perPageNum)
  });
});

// Get claim by ID with full details
app.get('/api/claims/:id', (req: Request, res: Response) => {
  const claim = mockClaims.find(c => c.id === req.params.id);
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }

  // Get all linked evidence
  const linkedEvidence = mockEvidence.filter(e => 
    claim.evidence_refs.includes(e.id)
  ).map(e => {
    const source = mockSources.find(s => s.id === e.source_id);
    return { ...e, source };
  });

  // Get relationships for this claim
  const relationships = mockRelationships.filter(r => 
    r.from_id === claim.id || r.to_id === claim.id
  );

  res.json({
    data: {
      ...claim,
      linkedEvidence,
      relationships
    }
  });
});

// Get relationships with filtering
app.get('/api/relationships', (req: Request, res: Response) => {
  const {
    observedOnly = 'true',
    relationshipType,
    entityId
  } = req.query as any;

  let filtered = [...mockRelationships];

  // Filter by observed flag
  if (observedOnly === 'true') {
    filtered = filtered.filter(r => r.observed === true);
  }

  // Filter by relationship type
  if (relationshipType) {
    filtered = filtered.filter(r => r.type === relationshipType);
  }

  // Filter by entity ID
  if (entityId) {
    filtered = filtered.filter(r => 
      r.from_id === entityId || r.to_id === entityId
    );
  }

  // Enrich with entity details
  const enriched = filtered.map(rel => {
    let fromEntity, toEntity;
    
    if (rel.from_type === 'evidence') {
      fromEntity = mockEvidence.find(e => e.id === rel.from_id);
    } else {
      fromEntity = mockClaims.find(c => c.id === rel.from_id);
    }

    if (rel.to_type === 'evidence') {
      toEntity = mockEvidence.find(e => e.id === rel.to_id);
    } else {
      toEntity = mockClaims.find(c => c.id === rel.to_id);
    }

    return {
      ...rel,
      from: fromEntity,
      to: toEntity
    };
  });

  res.json({
    data: enriched,
    total: enriched.length
  });
});

// Get audit trail for an entity
app.get('/api/audit/:entityType/:entityId', (req: Request, res: Response) => {
  const { entityType, entityId } = req.params;

  const events = mockAuditEvents.filter(e => 
    e.entity_type === entityType && e.entity_id === entityId
  );

  // Sort by timestamp (newest first)
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json({
    data: events,
    total: events.length
  });
});

// Get all audit events
app.get('/api/audit', (req: Request, res: Response) => {
  const events = [...mockAuditEvents];
  
  // Sort by timestamp (newest first)
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json({
    data: events,
    total: events.length
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NorthStar API server running on http://localhost:${PORT}`);
  console.log(`📊 Mock data loaded: ${mockEvidence.length} evidence, ${mockClaims.length} claims, ${mockRelationships.length} relationships`);
});
