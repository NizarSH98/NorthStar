import { useState, useEffect } from 'react';
import { Claim } from '../types';
import { api } from '../api';
import { formatDate, getCorroborationColor, getCorroborationLabel } from '../utils/formatters';
import { ClaimDetail } from './ClaimDetail';

export const ClaimsList: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadClaims();
  }, [page]);

  const loadClaims = async () => {
    setLoading(true);
    try {
      const response = await api.getClaims({ page, perPage: 10 });
      setClaims(response.data);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Failed to load claims:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Claims</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Claims List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {claims.map((claim) => (
              <div
                key={claim.id}
                onClick={() => setSelectedClaim(claim.id)}
                style={{
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: getCorroborationColor(claim.corroboration_state) + '20',
                        color: getCorroborationColor(claim.corroboration_state),
                        fontWeight: '600',
                        fontSize: '12px'
                      }}>
                        {getCorroborationLabel(claim.corroboration_state)}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      margin: '0 0 12px 0',
                      color: '#111827'
                    }}>
                      {claim.text}
                    </p>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      display: 'flex',
                      gap: '16px',
                      flexWrap: 'wrap'
                    }}>
                      <div>ID: {claim.id}</div>
                      <div>{claim.evidence_refs.length} evidence piece{claim.evidence_refs.length !== 1 ? 's' : ''}</div>
                      <div>Created: {formatDate(claim.created_at)}</div>
                      <div>Version: {claim.version}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', color: '#9ca3af' }}>
                    →
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Page {page} of {totalPages}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: '8px 16px',
                  backgroundColor: page === 1 ? '#e5e7eb' : '#3b82f6',
                  color: page === 1 ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: page === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: '8px 16px',
                  backgroundColor: page === totalPages ? '#e5e7eb' : '#3b82f6',
                  color: page === totalPages ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <ClaimDetail
          claimId={selectedClaim}
          onClose={() => setSelectedClaim(null)}
        />
      )}
    </div>
  );
};
