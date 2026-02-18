import { useState, useEffect } from 'react';
import { Evidence, Source } from '../types';
import { api } from '../api';
import { formatDate, truncateText } from '../utils/formatters';

interface EvidenceListProps {
  onSelectEvidence?: (evidence: Evidence) => void;
}

export const EvidenceList: React.FC<EvidenceListProps> = ({ onSelectEvidence }) => {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sourceFilter, setSourceFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  useEffect(() => {
    loadEvidence();
    loadSources();
  }, [page, sourceFilter, dateFromFilter, dateToFilter]);

  const loadEvidence = async () => {
    setLoading(true);
    try {
      const params: any = { page, perPage: 10 };
      if (sourceFilter) params.source = sourceFilter;
      if (dateFromFilter) params.dateFrom = dateFromFilter;
      if (dateToFilter) params.dateTo = dateToFilter;

      const response = await api.getEvidence(params);
      setEvidence(response.data);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Failed to load evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSources = async () => {
    try {
      const response = await api.getSources();
      setSources(response.data);
    } catch (error) {
      console.error('Failed to load sources:', error);
    }
  };

  const getSourceName = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    return source ? source.name : sourceId;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Evidence List</h2>
      
      {/* Filters */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f9fafb', 
        borderRadius: '8px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            Source:
          </label>
          <select 
            value={sourceFilter} 
            onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            <option value="">All Sources</option>
            {sources.map(source => (
              <option key={source.id} value={source.id}>{source.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            Date From:
          </label>
          <input 
            type="date"
            value={dateFromFilter}
            onChange={(e) => { setDateFromFilter(e.target.value); setPage(1); }}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            Date To:
          </label>
          <input 
            type="date"
            value={dateToFilter}
            onChange={(e) => { setDateToFilter(e.target.value); setPage(1); }}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          />
        </div>

        {(sourceFilter || dateFromFilter || dateToFilter) && (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              onClick={() => { setSourceFilter(''); setDateFromFilter(''); setDateToFilter(''); setPage(1); }}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#6b7280', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Evidence Table */}
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
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Content</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Source</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Timestamp</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Metadata</th>
                </tr>
              </thead>
              <tbody>
                {evidence.map((item, index) => (
                  <tr 
                    key={item.id}
                    onClick={() => onSelectEvidence && onSelectEvidence(item)}
                    style={{ 
                      borderBottom: '1px solid #e5e7eb',
                      cursor: onSelectEvidence ? 'pointer' : 'default',
                      backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb'
                    }}
                    onMouseEnter={(e) => {
                      if (onSelectEvidence) e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f9fafb';
                    }}
                  >
                    <td style={{ padding: '12px', fontSize: '12px', color: '#6b7280' }}>{item.id}</td>
                    <td style={{ padding: '12px', maxWidth: '400px' }}>
                      {truncateText(item.content, 150)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '500' }}>{getSourceName(item.source_id)}</div>
                      {item.metadata.url && (
                        <a 
                          href={item.metadata.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Source →
                        </a>
                      )}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      {formatDate(item.timestamp)}
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#6b7280' }}>
                      {item.metadata.author && <div>Author: {item.metadata.author}</div>}
                      <div>Version: {item.version}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ 
            marginTop: '20px', 
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
    </div>
  );
};
