import { useState } from 'react';
import { EvidenceList } from './components/EvidenceList';
import { ClaimsList } from './components/ClaimsList';
import { RelationshipTable } from './components/RelationshipTable';

type View = 'evidence' | 'claims' | 'relationships';

function App() {
  const [currentView, setCurrentView] = useState<View>('evidence');

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>
            🌟 NorthStar
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Evidence-first Event Graph for Politics & News Intelligence
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 20px'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          gap: '4px'
        }}>
          <button
            onClick={() => setCurrentView('evidence')}
            style={{
              padding: '16px 24px',
              backgroundColor: currentView === 'evidence' ? '#3b82f6' : 'transparent',
              color: currentView === 'evidence' ? 'white' : '#6b7280',
              border: 'none',
              borderBottom: currentView === 'evidence' ? '3px solid #3b82f6' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            📄 Evidence
          </button>
          <button
            onClick={() => setCurrentView('claims')}
            style={{
              padding: '16px 24px',
              backgroundColor: currentView === 'claims' ? '#3b82f6' : 'transparent',
              color: currentView === 'claims' ? 'white' : '#6b7280',
              border: 'none',
              borderBottom: currentView === 'claims' ? '3px solid #3b82f6' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            💬 Claims
          </button>
          <button
            onClick={() => setCurrentView('relationships')}
            style={{
              padding: '16px 24px',
              backgroundColor: currentView === 'relationships' ? '#3b82f6' : 'transparent',
              color: currentView === 'relationships' ? 'white' : '#6b7280',
              border: 'none',
              borderBottom: currentView === 'relationships' ? '3px solid #3b82f6' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            🔗 Relationships
          </button>
        </div>
      </nav>

      {/* Disclaimer Banner */}
      <div style={{
        backgroundColor: '#fef3c7',
        padding: '16px 20px',
        borderBottom: '1px solid #fde68a'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', fontSize: '14px', color: '#92400e' }}>
          <strong>⚠️ Platform Principles:</strong> This system tracks evidence and corroboration, NOT truth. 
          Observed relationships are directly stated in sources. Inferred relationships are algorithmic and hidden by default. 
          All changes are append-only and auditable.{' '}
          <a href="#methodology" style={{ color: '#b45309', textDecoration: 'underline' }}>
            Learn about our methodology →
          </a>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {currentView === 'evidence' && <EvidenceList />}
        {currentView === 'claims' && <ClaimsList />}
        {currentView === 'relationships' && <RelationshipTable />}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#1e293b',
        color: '#94a3b8',
        textAlign: 'center',
        fontSize: '14px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ margin: 0 }}>
            NorthStar - Evidence-first Intelligence Platform | Phase 1: Basic UI | Read-Only View
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
