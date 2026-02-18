// Frontend types matching backend API models

export interface Source {
  id: string;
  name: string;
  url: string;
  independence_score: number;
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
  source?: Source; // Populated by API
}

export interface Claim {
  id: string;
  text: string;
  evidence_refs: string[];
  version: number;
  created_at: string;
  corroboration_state: 'single-source' | 'multi-source-independent' | 'disputed';
  metadata: Record<string, any>;
  linkedEvidence?: Evidence[]; // Populated by API
  relationships?: Relationship[]; // Populated by API
}

export type RelationshipType = 'supports' | 'disputes' | 'corroborates' | 'related';

export interface Relationship {
  id: string;
  type: RelationshipType;
  from_id: string;
  from_type: 'evidence' | 'claim';
  to_id: string;
  to_type: 'evidence' | 'claim';
  observed: boolean;
  evidence_ids: string[];
  created_at: string;
  created_by?: string;
  metadata: {
    confidence?: number;
    algorithm?: string;
    [key: string]: any;
  };
  from?: Evidence | Claim; // Populated by API
  to?: Evidence | Claim; // Populated by API
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

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  perPage?: number;
  totalPages?: number;
}
