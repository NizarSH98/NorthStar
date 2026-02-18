import { validateEvidence, validateClaim, validateRelationship } from '../src/models/types';
import { randomUUID } from 'crypto';

describe('Core Data Models', () => {
  describe('Evidence Validation', () => {
    it('validates complete evidence', () => {
      const evidence = {
        content: 'Test content',
        source_id: randomUUID(),
        content_hash: 'abc123'
      };
      expect(validateEvidence(evidence)).toBe(true);
    });

    it('rejects evidence without content', () => {
      const evidence = {
        source_id: randomUUID(),
        content_hash: 'abc123'
      };
      expect(validateEvidence(evidence)).toBe(false);
    });

    it('rejects evidence without source', () => {
      const evidence = {
        content: 'Test',
        content_hash: 'abc123'
      };
      expect(validateEvidence(evidence)).toBe(false);
    });
  });

  describe('Claim Validation', () => {
    it('validates claim with evidence', () => {
      const claim = {
        text: 'Test claim',
        evidence_refs: [randomUUID()]
      };
      expect(validateClaim(claim)).toBe(true);
    });

    it('rejects claim without evidence', () => {
      const claim = {
        text: 'Test claim',
        evidence_refs: []
      };
      expect(validateClaim(claim)).toBe(false);
    });
  });

  describe('Relationship Validation', () => {
    it('validates relationship with valid type', () => {
      const rel = {
        type: 'supports' as const,
        from_id: randomUUID(),
        to_id: randomUUID()
      };
      expect(validateRelationship(rel)).toBe(true);
    });

    it('accepts all valid relationship types', () => {
      const types = ['supports', 'disputes', 'corroborates', 'related'] as const;
      types.forEach(type => {
        const rel = {
          type,
          from_id: randomUUID(),
          to_id: randomUUID()
        };
        expect(validateRelationship(rel)).toBe(true);
      });
    });
  });
});
