import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Navigation, Bus, Activity } from 'lucide-react';
import { busService } from '../services/api';

const TrackingPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    setError('');
    try {
      // Uses the shared service layer (auth token injected by axios interceptor)
      const res = await busService.getAll();
      const data = res.data.data ?? [];
      setBuses(data);
      // Auto-select the first active bus for UX convenience
      if (data.length > 0 && !selectedBus) {
        setSelectedBus(data[0]);
      }
    } catch (err) {
      setError('Failed to load fleet data. Please try again.');
      console.error('TrackingPage fetchBuses error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Header title="Live Bus Tracking" />
      <div className="content-area">

        {/* Error banner */}
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', height: 'calc(100vh - 180px)' }}>
          
          {/* ── Bus List Sidebar ──────────────────────────────────────── */}
          <div className="auth-card" style={{ padding: '15px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bus size={18} /> Active Fleet
              {!loading && (
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.6 }}>
                  {buses.length} bus{buses.length !== 1 ? 'es' : ''}
                </span>
              )}
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                <Activity size={24} style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '0.85rem' }}>Loading fleet...</p>
              </div>
            ) : buses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                <Bus size={32} style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '0.85rem' }}>No buses registered yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {buses.map((bus) => (
                  <div
                    key={bus.id}
                    onClick={() => setSelectedBus(bus)}
                    className="menu-item"
                    style={{
                      background: selectedBus?.id === bus.id ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                      border: selectedBus?.id === bus.id ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
                      borderRadius: '8px',
                      padding: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{bus.busNumber}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Driver: {bus.driverName ?? '—'}</div>
                    {bus.routeName && (
                      <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '2px' }}>
                        Route: {bus.routeName}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: bus.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                      }} />
                      <span style={{ fontSize: '0.75rem' }}>{bus.status ?? 'ACTIVE'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Map / Detail Panel ────────────────────────────────────── */}
          <div className="auth-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a', border: '1px dashed #333' }}>
            {selectedBus ? (
              <div style={{ textAlign: 'center', opacity: 0.7, padding: '2rem' }}>
                <Navigation size={48} style={{ marginBottom: '15px', color: '#3b82f6' }} />
                <h3 style={{ marginBottom: '8px' }}>Bus {selectedBus.busNumber}</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Driver: {selectedBus.driverName ?? '—'}</p>
                {selectedBus.routeName && (
                  <p style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Route: {selectedBus.routeName}</p>
                )}
                <p style={{ fontSize: '0.75rem', marginTop: '20px', opacity: 0.5 }}>
                  Real-time GPS coordinates will be plotted here once tracking devices are connected.
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', opacity: 0.5 }}>
                <Navigation size={48} style={{ marginBottom: '15px' }} />
                <h3>Live Map Integration</h3>
                <p>Select a bus from the list to view its tracking details.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
