// Core data models for Evidence-first Graph Platform

export interface Source {
  id: string;
  name: string;
  url: string;
  independence_score: number; // 0.0 to 1.0
  verified_at: string;
  metadata: Record<string, any>;
}

export interface Evidence {
  id: string;
  content: string;
  source_id: string;
  timestamp: string;
  created_at: string;
  version: number;
  metadata: {
    url?: string;
    author?: string;
    content_hash?: string;
    [key: string]: any;
  };
}

export interface Claim {
  id: string;
  text: string;
  evidence_refs: string[]; // Evidence IDs
  version: number;
  created_at: string;
  corroboration_state: 'single-source' | 'multi-source-independent' | 'disputed';
  metadata: Record<string, any>;
}

export type RelationshipType = 'supports' | 'disputes' | 'corroborates' | 'related';

export interface Relationship {
  id: string;
  type: RelationshipType;
  from_id: string;
  from_type: 'evidence' | 'claim';
  to_id: string;
  to_type: 'evidence' | 'claim';
  observed: boolean; // true = observed, false = inferred
  evidence_ids: string[]; // Supporting evidence for this relationship
  created_at: string;
  created_by?: string;
  metadata: {
    confidence?: number;
    algorithm?: string; // For inferred relationships
    [key: string]: any;
  };
}

export interface AuditEvent {
  id: string;
  entity_type: 'evidence' | 'claim' | 'relationship' | 'source';
  entity_id: string;
  event_type: 'created' | 'updated' | 'linked' | 'state_changed';
  timestamp: string;
  actor?: string;
  changes: Record<string, any>;
  version: number;
}

// Query parameters
export interface QueryParams {
  page?: number;
  perPage?: number;
  source?: string;
  dateFrom?: string;
  dateTo?: string;
  observedOnly?: boolean;
  relationshipType?: RelationshipType;
}
