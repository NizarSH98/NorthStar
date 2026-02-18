CREATE TABLE event_log (
  event_id UUID PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_event_log_entity ON event_log(entity_type, entity_id, timestamp);

CREATE TABLE sources (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT,
  independence_score DECIMAL(3,2)
);

CREATE TABLE evidence (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  source_id UUID REFERENCES sources(id),
  content_hash VARCHAR(64) UNIQUE NOT NULL
);

CREATE TABLE claims (
  id UUID PRIMARY KEY,
  text TEXT NOT NULL,
  version INTEGER DEFAULT 1
);
