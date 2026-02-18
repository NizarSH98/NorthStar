import { UUID } from 'crypto';

export interface Evidence {
  readonly id: UUID;
  readonly content: string;
  readonly source_id: UUID;
  readonly timestamp: Date;
  readonly metadata: Record<string, any>;
  readonly content_hash: string;
  readonly created_at: Date;
  readonly version: number;
}

export interface Claim {
  readonly id: UUID;
  readonly text: string;
  readonly evidence_refs: UUID[];
  readonly version: number;
  readonly created_at: Date;
}

export interface Source {
  readonly id: UUID;
  readonly name: string;
  readonly url: string;
  readonly type: 'news_org' | 'social' | 'primary_doc' | 'blog';
  readonly independence_score: number;
  readonly metadata: Record<string, any>;
  readonly verified_at: Date;
}

export type RelationshipType = 'supports' | 'disputes' | 'corroborates' | 'related';

export interface Relationship {
  readonly id: UUID;
  readonly type: RelationshipType;
  readonly from_id: UUID;
  readonly to_id: UUID;
  readonly observed: boolean;
  readonly evidence_ids: UUID[];
  readonly algorithm?: string;
  readonly created_at: Date;
  readonly created_by: string;
}
