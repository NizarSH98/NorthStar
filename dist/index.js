"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const crypto_1 = require("crypto");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// In-memory storage for demo (replace with event store for production)
const sources = new Map();
const evidence = new Map();
const claims = new Map();
const relationships = new Map();
// Sources endpoints
app.post('/api/sources', (req, res) => {
    const id = (0, crypto_1.randomUUID)();
    const source = {
        id,
        name: req.body.name,
        url: req.body.url,
        type: req.body.type,
        independence_score: req.body.independence_score || 0.5,
        metadata: req.body.metadata || {},
        verified_at: new Date()
    };
    sources.set(id, source);
    res.status(201).json(source);
});
app.get('/api/sources', (req, res) => {
    res.json(Array.from(sources.values()));
});
app.get('/api/sources/:id', (req, res) => {
    const source = sources.get(req.params.id);
    if (!source)
        return res.status(404).json({ error: 'Source not found' });
    res.json(source);
});
// Evidence endpoints
app.post('/api/evidence', (req, res) => {
    const source_id = req.body.source_id;
    // Validate: Evidence REQUIRES source
    if (!source_id || !sources.has(source_id)) {
        return res.status(400).json({ error: 'Evidence requires valid source_id' });
    }
    const id = (0, crypto_1.randomUUID)();
    const now = new Date();
    const ev = {
        id,
        content: req.body.content,
        source_id,
        timestamp: new Date(req.body.timestamp || now),
        metadata: req.body.metadata || {},
        content_hash: req.body.content_hash || '',
        created_at: now,
        version: 1
    };
    evidence.set(id, ev);
    res.status(201).json(ev);
});
app.get('/api/evidence', (req, res) => {
    res.json(Array.from(evidence.values()));
});
app.get('/api/evidence/:id', (req, res) => {
    const ev = evidence.get(req.params.id);
    if (!ev)
        return res.status(404).json({ error: 'Evidence not found' });
    res.json(ev);
});
// Claims endpoints
app.post('/api/claims', (req, res) => {
    const evidence_refs = req.body.evidence_refs || [];
    // Validate: Claims REQUIRE evidence
    if (evidence_refs.length === 0) {
        return res.status(400).json({ error: 'Claims require at least one evidence reference' });
    }
    // Validate all evidence exists
    for (const ev_id of evidence_refs) {
        if (!evidence.has(ev_id)) {
            return res.status(400).json({ error: `Evidence ${ev_id} not found` });
        }
    }
    const id = (0, crypto_1.randomUUID)();
    const claim = {
        id,
        text: req.body.text,
        evidence_refs,
        version: 1,
        created_at: new Date()
    };
    claims.set(id, claim);
    res.status(201).json(claim);
});
app.get('/api/claims', (req, res) => {
    res.json(Array.from(claims.values()));
});
app.get('/api/claims/:id', (req, res) => {
    const claim = claims.get(req.params.id);
    if (!claim)
        return res.status(404).json({ error: 'Claim not found' });
    res.json(claim);
});
// Relationships endpoints
app.post('/api/relationships', (req, res) => {
    const id = (0, crypto_1.randomUUID)();
    const rel = {
        id,
        type: req.body.type,
        from_id: req.body.from_id,
        to_id: req.body.to_id,
        observed: req.body.observed ?? true,
        evidence_ids: req.body.evidence_ids || [],
        algorithm: req.body.algorithm,
        created_at: new Date(),
        created_by: req.body.created_by || 'system'
    };
    relationships.set(id, rel);
    res.status(201).json(rel);
});
app.get('/api/relationships', (req, res) => {
    const observed_only = req.query.observed === 'true';
    let rels = Array.from(relationships.values());
    if (observed_only) {
        rels = rels.filter(r => r.observed);
    }
    res.json(rels);
});
app.get('/api/relationships/:id', (req, res) => {
    const rel = relationships.get(req.params.id);
    if (!rel)
        return res.status(404).json({ error: 'Relationship not found' });
    res.json(rel);
});
// Stats endpoint
app.get('/api/stats', (req, res) => {
    res.json({
        sources: sources.size,
        evidence: evidence.size,
        claims: claims.size,
        relationships: relationships.size,
        observed_relationships: Array.from(relationships.values()).filter(r => r.observed).length,
        inferred_relationships: Array.from(relationships.values()).filter(r => !r.observed).length
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ NorthStar API running on http://localhost:${PORT}`);
    console.log(`   Evidence-first news/politics graph platform`);
    console.log(`   Ready to enforce PRD requirements`);
});
exports.default = app;
