import { useState, useEffect } from 'react';
import { AuditEvent } from '../types';
import { api } from '../api';
import { formatDate } from '../utils/formatters';

interface AuditTrailModalProps {
  entityType: string;
  entityId: string;
  onClose: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ entityType, entityId, onClose }) => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);

  useEffect(() => {
    loadAuditTrail();
  }, [entityType, entityId]);

  const loadAuditTrail = async () => {
    setLoading(true);
    try {
      const response = await api.getAuditTrail(entityType, entityId);
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to load audit trail:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEvent = (eventId: string) => {
    setExpandedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const exportAuditTrail = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-trail-${entityType}-${entityId}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getEventIcon = (eventType: string): string => {
    switch (eventType) {
      case 'created': return '✨';
      case 'updated': return '✏️';
      case 'linked': return '🔗';
      case 'state_changed': return '🔄';
      default: return '📝';
    }
  };

  const getEventColor = (eventType: string): string => {
    switch (eventType) {
      case 'created': return '#10b981';
      case 'updated': return '#3b82f6';
      case 'linked': return '#8b5cf6';
      case 'state_changed': return '#f59e0b';
      default: return '#6b7280';
    }
  };

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
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
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
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10
        }}>
          <div>
            <h2 style={{ margin: 0 }}>Audit Trail</h2>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              {entityType}: {entityId}
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

        {/* Content */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading audit trail...</div>
        ) : events.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            No audit events found
          </div>
        ) : (
          <>
            {/* Timeline */}
            <div style={{ padding: '24px' }}>
              <div style={{ position: 'relative' }}>
                {/* Timeline line */}
                <div style={{
                  position: 'absolute',
                  left: '20px',
                  top: '20px',
                  bottom: '20px',
                  width: '2px',
                  backgroundColor: '#e5e7eb'
                }} />

                {/* Events */}
                {events.map((event, index) => (
                  <div key={event.id} style={{ position: 'relative', marginBottom: '24px' }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute',
                      left: '12px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: getEventColor(event.event_type),
                      border: '3px solid white',
                      zIndex: 1
                    }} />

                    {/* Event card */}
                    <div style={{
                      marginLeft: '50px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: 'white'
                    }}>
                      <div
                        onClick={() => toggleEvent(event.id)}
                        style={{
                          padding: '16px',
                          cursor: 'pointer',
                          backgroundColor: expandedEvents.includes(event.id) ? '#f9fafb' : 'white'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '20px' }}>{getEventIcon(event.event_type)}</span>
                              <span style={{
                                padding: '4px 8px',
                                backgroundColor: getEventColor(event.event_type) + '20',
                                color: getEventColor(event.event_type),
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {event.event_type.toUpperCase().replace('_', ' ')}
                              </span>
                              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                Version {event.version}
                              </span>
                            </div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>
                              {formatDate(event.timestamp)}
                              {event.actor && ` • By: ${event.actor}`}
                            </div>
                          </div>
                          <div style={{ fontSize: '16px', color: '#9ca3af' }}>
                            {expandedEvents.includes(event.id) ? '▼' : '▶'}
                          </div>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {expandedEvents.includes(event.id) && (
                        <div style={{
                          padding: '16px',
                          backgroundColor: '#f9fafb',
                          borderTop: '1px solid #e5e7eb'
                        }}>
                          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
                            Changes:
                          </h4>
                          <pre style={{
                            margin: 0,
                            padding: '12px',
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '12px',
                            overflow: 'auto',
                            maxHeight: '200px'
                          }}>
                            {JSON.stringify(event.changes, null, 2)}
                          </pre>
                          <div style={{
                            marginTop: '12px',
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            <div>Event ID: {event.id}</div>
                            <div>Entity: {event.entity_type} / {event.entity_id}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'white'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {events.length} event{events.length !== 1 ? 's' : ''} in audit trail
              </div>
              <button
                onClick={exportAuditTrail}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📥 Export JSON
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
