-- NorthStar Phase 1 Database Schema
-- Evidence-first news/politics graph platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Event Log (Append-Only)
CREATE TABLE event_log (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('evidence', 'claim', 'source', 'relationship')),
  entity_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('created', 'linked', 'updated')),
  payload JSONB NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_log_entity ON event_log(entity_type, entity_id, timestamp);
CREATE INDEX idx_event_log_timestamp ON event_log(timestamp DESC);

-- Prevent updates and deletes on event log
CREATE OR REPLACE FUNCTION prevent_event_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Event log is append-only - modifications not allowed';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_event_update 
  BEFORE UPDATE ON event_log
  FOR EACH ROW EXECUTE FUNCTION prevent_event_modification();

CREATE TRIGGER prevent_event_delete 
  BEFORE DELETE ON event_log
  FOR EACH ROW EXECUTE FUNCTION prevent_event_modification();

-- Sources
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  url TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('news_org', 'social', 'primary_doc', 'blog')),
  independence_score DECIMAL(3,2) CHECK (independence_score BETWEEN 0.0 AND 1.0),
  metadata JSONB DEFAULT '{}',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sources_type ON sources(type);

-- Evidence
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE RESTRICT,
  content_hash VARCHAR(64) UNIQUE NOT NULL,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX idx_evidence_source ON evidence(source_id);
CREATE INDEX idx_evidence_hash ON evidence(content_hash);
CREATE INDEX idx_evidence_created ON evidence(created_at DESC);
CREATE INDEX idx_evidence_metadata ON evidence USING GIN(metadata);

-- Claims
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_claims_created ON claims(created_at DESC);

-- Claim Evidence Junction (Immutable)
CREATE TABLE claim_evidence (
  claim_id UUID NOT NULL REFERENCES claims(id),
  evidence_id UUID NOT NULL REFERENCES evidence(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (claim_id, evidence_id)
);

-- Relationships
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('supports', 'disputes', 'corroborates', 'related')),
  from_id UUID NOT NULL,
  to_id UUID NOT NULL,
  observed BOOLEAN NOT NULL DEFAULT TRUE,
  evidence_ids UUID[] NOT NULL,
  algorithm VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255),
  CONSTRAINT require_algorithm_for_inferred CHECK (observed = TRUE OR algorithm IS NOT NULL)
);

CREATE INDEX idx_relationships_from ON relationships(from_id);
CREATE INDEX idx_relationships_to ON relationships(to_id);
CREATE INDEX idx_relationships_type_observed ON relationships(type, observed);
CREATE INDEX idx_relationships_created ON relationships(created_at DESC);

-- Source Relationships (for independence scoring)
CREATE TABLE source_relationships (
  source_a_id UUID NOT NULL REFERENCES sources(id),
  source_b_id UUID NOT NULL REFERENCES sources(id),
  relationship_type VARCHAR(50) NOT NULL CHECK (relationship_type IN ('same_ownership', 'affiliated', 'independent')),
  independence_score DECIMAL(3,2) CHECK (independence_score BETWEEN 0.0 AND 1.0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (source_a_id, source_b_id),
  CHECK (source_a_id < source_b_id)
);

-- Stats view
CREATE OR REPLACE VIEW platform_stats AS
SELECT
  (SELECT COUNT(*) FROM evidence) as total_evidence,
  (SELECT COUNT(*) FROM claims) as total_claims,
  (SELECT COUNT(*) FROM sources) as total_sources,
  (SELECT COUNT(*) FROM relationships WHERE observed = TRUE) as observed_relationships,
  (SELECT COUNT(*) FROM relationships WHERE observed = FALSE) as inferred_relationships,
  (SELECT COUNT(*) FROM event_log) as total_events;
