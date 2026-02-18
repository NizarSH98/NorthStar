import { useState, useEffect } from 'react';
import { Relationship } from '../types';
import { api } from '../api';
import { formatDate } from '../utils/formatters';

export const RelationshipTable: React.FC = () => {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInferred, setShowInferred] = useState(false); // Default: OFF
  const [relationshipTypeFilter, setRelationshipTypeFilter] = useState('');

  useEffect(() => {
    loadRelationships();
  }, [showInferred, relationshipTypeFilter]);

  const loadRelationships = async () => {
    setLoading(true);
    try {
      const params: any = {
        observedOnly: !showInferred
      };
      if (relationshipTypeFilter) {
        params.relationshipType = relationshipTypeFilter;
      }

      const response = await api.getRelationships(params);
      setRelationships(response.data);
    } catch (error) {
      console.error('Failed to load relationships:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEntityPreview = (entity: any, type: string): string => {
    if (!entity) return 'Unknown';
    if (type === 'evidence') {
      return entity.content?.substring(0, 100) + '...' || entity.id;
    } else {
      return entity.text?.substring(0, 100) + '...' || entity.id;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Relationships</h2>

      {/* Disclaimer */}
      <div style={{
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        borderLeft: '4px solid #f59e0b'
      }}>
        <strong>⚠️ About Relationships:</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li><strong>Observed</strong> relationships are directly stated or evident in source material</li>
          <li><strong>Inferred</strong> relationships are detected by algorithms and may not be explicit</li>
          <li>Inferred relationships are <strong>hidden by default</strong> to maintain objectivity</li>
        </ul>
      </div>

      {/* Filters */}
      <div style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="showInferred"
            checked={showInferred}
            onChange={(e) => setShowInferred(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="showInferred" style={{ fontWeight: '500', cursor: 'pointer' }}>
            Show Inferred Relationships
          </label>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            Relationship Type:
          </label>
          <select
            value={relationshipTypeFilter}
            onChange={(e) => setRelationshipTypeFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            <option value="">All Types</option>
            <option value="supports">Supports</option>
            <option value="disputes">Disputes</option>
            <option value="corroborates">Corroborates</option>
            <option value="related">Related</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div style={{ marginBottom: '12px', color: '#6b7280', fontSize: '14px' }}>
            Showing {relationships.length} relationship{relationships.length !== 1 ? 's' : ''}
            {!showInferred && ' (observed only)'}
          </div>

          {/* Relationships Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>From</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>To</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Observed/Inferred</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Provenance</th>
                </tr>
              </thead>
              <tbody>
                {relationships.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                      No relationships found
                    </td>
                  </tr>
                ) : (
                  relationships.map((rel, index) => (
                    <tr
                      key={rel.id}
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        backgroundColor: rel.observed ? (index % 2 === 0 ? 'white' : '#f9fafb') : '#f3f4f6'
                      }}
                    >
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {rel.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px', maxWidth: '300px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                          {rel.from_type}: {rel.from_id}
                        </div>
                        <div style={{ fontSize: '14px' }}>
                          {getEntityPreview(rel.from, rel.from_type)}
                        </div>
                      </td>
                      <td style={{ padding: '12px', maxWidth: '300px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                          {rel.to_type}: {rel.to_id}
                        </div>
                        <div style={{ fontSize: '14px' }}>
                          {getEntityPreview(rel.to, rel.to_type)}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '6px 12px',
                          backgroundColor: rel.observed ? '#dbeafe' : '#fef3c7',
                          color: rel.observed ? '#1e40af' : '#92400e',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'inline-block'
                        }}>
                          {rel.observed ? 'OBSERVED' : 'INFERRED'}
                        </span>
                        {!rel.observed && (
                          <div style={{
                            fontSize: '11px',
                            color: '#9ca3af',
                            marginTop: '4px',
                            fontStyle: 'italic'
                          }}>
                            Confidence: {rel.metadata.confidence ? (rel.metadata.confidence * 100).toFixed(0) + '%' : 'N/A'}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#6b7280' }}>
                        <div>Created: {formatDate(rel.created_at)}</div>
                        {rel.created_by && <div>By: {rel.created_by}</div>}
                        {!rel.observed && rel.metadata.algorithm && (
                          <div style={{ marginTop: '4px', fontStyle: 'italic' }}>
                            Algorithm: {rel.metadata.algorithm}
                          </div>
                        )}
                        <div style={{ marginTop: '4px' }}>
                          Evidence: {rel.evidence_ids.length} item{rel.evidence_ids.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
