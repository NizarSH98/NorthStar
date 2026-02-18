import { useState, useEffect } from 'react';
import { Claim } from '../types';
import { api } from '../api';
import { formatDate, getCorroborationColor, getCorroborationLabel } from '../utils/formatters';
import { AuditTrailModal } from './AuditTrailModal';

interface ClaimDetailProps {
  claimId: string;
  onClose: () => void;
}

export const ClaimDetail: React.FC<ClaimDetailProps> = ({ claimId, onClose }) => {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState<string[]>([]);

  useEffect(() => {
    loadClaim();
  }, [claimId]);

  const loadClaim = async () => {
    setLoading(true);
    try {
      const response = await api.getClaimById(claimId);
      setClaim(response.data);
    } catch (error) {
      console.error('Failed to load claim:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEvidence = (evidenceId: string) => {
    setExpandedEvidence(prev => 
      prev.includes(evidenceId) 
        ? prev.filter(id => id !== evidenceId)
        : [...prev, evidenceId]
    );
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (!claim) {
    return <div style={{ padding: '20px' }}>Claim not found</div>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 12px 0' }}>Claim Detail</h2>
            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: getCorroborationColor(claim.corroboration_state) + '20',
              color: getCorroborationColor(claim.corroboration_state),
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {getCorroborationLabel(claim.corroboration_state)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Claim Text */}
        <div style={{ padding: '24px' }}>
          <h3 style={{ marginTop: 0, color: '#111827' }}>Claim</h3>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.7',
            color: '#374151',
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: '8px',
            borderLeft: '4px solid #3b82f6'
          }}>
            {claim.text}
          </p>

          <div style={{ 
            marginTop: '16px', 
            fontSize: '14px', 
            color: '#6b7280',
            display: 'flex',
            gap: '20px'
          }}>
            <div>ID: {claim.id}</div>
            <div>Version: {claim.version}</div>
            <div>Created: {formatDate(claim.created_at)}</div>
          </div>
        </div>

        {/* Corroboration Explanation */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '16px',
            borderRadius: '8px',
            borderLeft: '4px solid #f59e0b'
          }}>
            <strong>⚠️ Important:</strong> Corroboration tracking is based on source independence and evidence linkage. 
            This is <strong>not</strong> a truth assessment or fact-checking score.
          </div>
        </div>

        {/* Linked Evidence */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          <h3>Linked Evidence ({claim.linkedEvidence?.length || 0})</h3>
          {claim.linkedEvidence && claim.linkedEvidence.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {claim.linkedEvidence.map((evidence) => (
                <div
                  key={evidence.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    onClick={() => toggleEvidence(evidence.id)}
                    style={{
                      padding: '16px',
                      cursor: 'pointer',
                      backgroundColor: expandedEvidence.includes(evidence.id) ? '#f9fafb' : 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                        {evidence.source?.name || evidence.source_id}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {formatDate(evidence.timestamp)}
                      </div>
                    </div>
                    <div style={{ fontSize: '20px', color: '#9ca3af' }}>
                      {expandedEvidence.includes(evidence.id) ? '▼' : '▶'}
                    </div>
                  </div>
                  
                  {expandedEvidence.includes(evidence.id) && (
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <p style={{ margin: '0 0 12px 0', lineHeight: '1.6' }}>
                        {evidence.content}
                      </p>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        <div>Evidence ID: {evidence.id}</div>
                        {evidence.metadata.author && <div>Author: {evidence.metadata.author}</div>}
                        {evidence.metadata.url && (
                          <a 
                            href={evidence.metadata.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#3b82f6', textDecoration: 'none' }}
                          >
                            View Source →
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#6b7280', fontStyle: 'italic' }}>No evidence linked</div>
          )}
        </div>

        {/* Relationships */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          <h3>Relationships ({claim.relationships?.length || 0})</h3>
          {claim.relationships && claim.relationships.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {claim.relationships.map((rel) => (
                <div
                  key={rel.id}
                  style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: rel.observed ? 'white' : '#f3f4f6',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: rel.observed ? '#10b981' : '#f59e0b',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {rel.type.toUpperCase()}
                      </span>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: rel.observed ? '#dbeafe' : '#fef3c7',
                        color: rel.observed ? '#1e40af' : '#92400e',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {rel.observed ? 'OBSERVED' : 'INFERRED'}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', marginTop: '8px', color: '#6b7280' }}>
                      {rel.from_type}: {rel.from_id} → {rel.to_type}: {rel.to_id}
                    </div>
                    {!rel.observed && rel.metadata.algorithm && (
                      <div style={{ fontSize: '12px', marginTop: '4px', color: '#9ca3af', fontStyle: 'italic' }}>
                        Algorithm: {rel.metadata.algorithm}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#6b7280', fontStyle: 'italic' }}>No relationships</div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={() => setShowAuditTrail(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            View Audit Trail
          </button>
        </div>
      </div>

      {showAuditTrail && (
        <AuditTrailModal
          entityType="claim"
          entityId={claimId}
          onClose={() => setShowAuditTrail(false)}
        />
      )}
    </div>
  );
};
