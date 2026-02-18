import { Source, Evidence, Claim, Relationship, AuditEvent } from '../src/types';

// Mock sources with varying independence
export const mockSources: Source[] = [
  {
    id: 'source-1',
    name: 'National News Agency',
    url: 'https://example-nna.com',
    independence_score: 0.8,
    verified_at: '2026-01-15T10:00:00Z',
    metadata: { type: 'news', country: 'US' }
  },
  {
    id: 'source-2',
    name: 'Independent Reporter Blog',
    url: 'https://example-reporter.com',
    independence_score: 0.9,
    verified_at: '2026-01-20T14:30:00Z',
    metadata: { type: 'independent', country: 'UK' }
  },
  {
    id: 'source-3',
    name: 'Government Press Office',
    url: 'https://example-gov.org',
    independence_score: 0.4,
    verified_at: '2026-01-10T09:00:00Z',
    metadata: { type: 'official', country: 'US' }
  },
  {
    id: 'source-4',
    name: 'Local News Network',
    url: 'https://example-local.com',
    independence_score: 0.7,
    verified_at: '2026-01-25T11:00:00Z',
    metadata: { type: 'news', country: 'US' }
  }
];

// Mock evidence pieces
export const mockEvidence: Evidence[] = [
  {
    id: 'evidence-1',
    content: 'City council voted 7-2 in favor of the new infrastructure bill during the February 10th session. The vote was recorded at 3:45 PM EST.',
    source_id: 'source-1',
    timestamp: '2026-02-10T20:45:00Z',
    created_at: '2026-02-10T21:00:00Z',
    version: 1,
    metadata: {
      url: 'https://example-nna.com/city-council-vote-2026-02-10',
      author: 'Jane Smith',
      content_hash: 'abc123'
    }
  },
  {
    id: 'evidence-2',
    content: 'The infrastructure proposal includes $50M for road repairs and $30M for public transit improvements, according to the official council documents.',
    source_id: 'source-3',
    timestamp: '2026-02-10T19:00:00Z',
    created_at: '2026-02-10T19:15:00Z',
    version: 1,
    metadata: {
      url: 'https://example-gov.org/council-docs/infrastructure-proposal',
      author: 'Official Records',
      content_hash: 'def456'
    }
  },
  {
    id: 'evidence-3',
    content: 'Local residents expressed concerns about the timeline during public comment period. Three speakers questioned the feasibility of completing projects within two years.',
    source_id: 'source-4',
    timestamp: '2026-02-11T10:30:00Z',
    created_at: '2026-02-11T11:00:00Z',
    version: 1,
    metadata: {
      url: 'https://example-local.com/resident-concerns-infrastructure',
      author: 'Bob Johnson',
      content_hash: 'ghi789'
    }
  },
  {
    id: 'evidence-4',
    content: 'Independent analysis shows similar infrastructure projects in comparable cities typically take 3-4 years to complete, not the proposed 2 years.',
    source_id: 'source-2',
    timestamp: '2026-02-12T14:00:00Z',
    created_at: '2026-02-12T14:30:00Z',
    version: 1,
    metadata: {
      url: 'https://example-reporter.com/infrastructure-timeline-analysis',
      author: 'Dr. Sarah Chen',
      content_hash: 'jkl012'
    }
  },
  {
    id: 'evidence-5',
    content: 'Council member Martinez stated, "We have secured commitments from three contractors to begin work by March 15th." This was confirmed in the official meeting minutes.',
    source_id: 'source-1',
    timestamp: '2026-02-10T20:50:00Z',
    created_at: '2026-02-10T21:05:00Z',
    version: 1,
    metadata: {
      url: 'https://example-nna.com/council-meeting-details',
      author: 'Jane Smith',
      content_hash: 'mno345'
    }
  }
];

// Mock claims
export const mockClaims: Claim[] = [
  {
    id: 'claim-1',
    text: 'City council approved $80M infrastructure bill on February 10, 2026',
    evidence_refs: ['evidence-1', 'evidence-2'],
    version: 1,
    created_at: '2026-02-11T09:00:00Z',
    corroboration_state: 'multi-source-independent',
    metadata: {
      confidence: 0.95,
      event_type: 'council_vote'
    }
  },
  {
    id: 'claim-2',
    text: 'Infrastructure projects will be completed within 2 years',
    evidence_refs: ['evidence-2'],
    version: 1,
    created_at: '2026-02-11T09:30:00Z',
    corroboration_state: 'disputed',
    metadata: {
      confidence: 0.6,
      disputed_by: ['claim-3']
    }
  },
  {
    id: 'claim-3',
    text: 'Similar infrastructure projects typically take 3-4 years to complete',
    evidence_refs: ['evidence-4'],
    version: 1,
    created_at: '2026-02-12T15:00:00Z',
    corroboration_state: 'single-source',
    metadata: {
      confidence: 0.8,
      analysis_type: 'comparative'
    }
  },
  {
    id: 'claim-4',
    text: 'Residents have concerns about project timeline feasibility',
    evidence_refs: ['evidence-3'],
    version: 1,
    created_at: '2026-02-11T12:00:00Z',
    corroboration_state: 'single-source',
    metadata: {
      confidence: 0.9,
      sentiment: 'skeptical'
    }
  }
];

// Mock relationships
export const mockRelationships: Relationship[] = [
  {
    id: 'rel-1',
    type: 'supports',
    from_id: 'evidence-1',
    from_type: 'evidence',
    to_id: 'claim-1',
    to_type: 'claim',
    observed: true,
    evidence_ids: ['evidence-1'],
    created_at: '2026-02-11T09:00:00Z',
    metadata: {}
  },
  {
    id: 'rel-2',
    type: 'supports',
    from_id: 'evidence-2',
    from_type: 'evidence',
    to_id: 'claim-1',
    to_type: 'claim',
    observed: true,
    evidence_ids: ['evidence-2'],
    created_at: '2026-02-11T09:00:00Z',
    metadata: {}
  },
  {
    id: 'rel-3',
    type: 'supports',
    from_id: 'evidence-2',
    from_type: 'evidence',
    to_id: 'claim-2',
    to_type: 'claim',
    observed: true,
    evidence_ids: ['evidence-2'],
    created_at: '2026-02-11T09:30:00Z',
    metadata: {}
  },
  {
    id: 'rel-4',
    type: 'disputes',
    from_id: 'claim-3',
    from_type: 'claim',
    to_id: 'claim-2',
    to_type: 'claim',
    observed: false, // INFERRED
    evidence_ids: ['evidence-4'],
    created_at: '2026-02-12T15:30:00Z',
    created_by: 'timeline_analyzer_v1',
    metadata: {
      confidence: 0.75,
      algorithm: 'timeline_conflict_detector'
    }
  },
  {
    id: 'rel-5',
    type: 'supports',
    from_id: 'evidence-4',
    from_type: 'evidence',
    to_id: 'claim-3',
    to_type: 'claim',
    observed: true,
    evidence_ids: ['evidence-4'],
    created_at: '2026-02-12T15:00:00Z',
    metadata: {}
  },
  {
    id: 'rel-6',
    type: 'corroborates',
    from_id: 'evidence-3',
    from_type: 'evidence',
    to_id: 'evidence-4',
    to_type: 'evidence',
    observed: false, // INFERRED
    evidence_ids: ['evidence-3', 'evidence-4'],
    created_at: '2026-02-12T16:00:00Z',
    created_by: 'corroboration_detector_v1',
    metadata: {
      confidence: 0.65,
      algorithm: 'sentiment_alignment_scorer'
    }
  },
  {
    id: 'rel-7',
    type: 'supports',
    from_id: 'evidence-5',
    from_type: 'evidence',
    to_id: 'claim-1',
    to_type: 'claim',
    observed: true,
    evidence_ids: ['evidence-5'],
    created_at: '2026-02-11T09:05:00Z',
    metadata: {}
  }
];

// Mock audit events
export const mockAuditEvents: AuditEvent[] = [
  {
    id: 'audit-1',
    entity_type: 'evidence',
    entity_id: 'evidence-1',
    event_type: 'created',
    timestamp: '2026-02-10T21:00:00Z',
    actor: 'ingestion_pipeline',
    changes: { status: 'created' },
    version: 1
  },
  {
    id: 'audit-2',
    entity_type: 'claim',
    entity_id: 'claim-1',
    event_type: 'created',
    timestamp: '2026-02-11T09:00:00Z',
    actor: 'claim_creator',
    changes: { status: 'created' },
    version: 1
  },
  {
    id: 'audit-3',
    entity_type: 'claim',
    entity_id: 'claim-1',
    event_type: 'linked',
    timestamp: '2026-02-11T09:00:00Z',
    actor: 'claim_creator',
    changes: { evidence_added: ['evidence-1', 'evidence-2'] },
    version: 1
  },
  {
    id: 'audit-4',
    entity_type: 'claim',
    entity_id: 'claim-2',
    event_type: 'state_changed',
    timestamp: '2026-02-12T15:30:00Z',
    actor: 'corroboration_engine',
    changes: {
      old_state: 'single-source',
      new_state: 'disputed',
      reason: 'conflicting_claim_detected'
    },
    version: 2
  },
  {
    id: 'audit-5',
    entity_type: 'relationship',
    entity_id: 'rel-4',
    event_type: 'created',
    timestamp: '2026-02-12T15:30:00Z',
    actor: 'timeline_analyzer_v1',
    changes: {
      type: 'disputes',
      inferred: true,
      confidence: 0.75
    },
    version: 1
  }
];
