import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import { Bus, Plus, X, Loader2 } from 'lucide-react';
import { busService } from '../services/api';
import { useToast } from '../components/ToastProvider';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  busNumber: '',
  driverName: '',
  busRegisterNumber: '',
  capacity: 40,
  routeName: '',
};

/** Returns null if valid, or an error string */
const validateForm = (data) => {
  if (!data.busNumber?.trim()) return 'Bus display number is required.';
  if (!data.driverName?.trim()) return 'Driver name is required.';
  if (!data.routeName?.trim()) return 'Route name is required.';
  if (!data.busRegisterNumber?.trim()) return 'Register number is required.';
  const cap = Number(data.capacity);
  if (!cap || cap < 1 || isNaN(cap)) return 'Capacity must be a positive number.';
  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────
const BusesPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const { addToast } = useToast();

  // Always fetch from backend on mount — no stale state
  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const res = await busService.getAll();
      setBuses(res.data.data ?? []);
    } catch (err) {
      addToast('Failed to fetch buses', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Create bus ─────────────────────────────────────────────────────────────
  const handleCreateBus = async (e) => {
    e.preventDefault();
    setFormError('');

    // Client-side validation — catches NaN capacity before any network call
    const err = validateForm(formData);
    if (err) { setFormError(err); return; }

    setSubmitting(true);
    try {
      // Build a safe payload — trim strings, coerce capacity to number
      const payload = {
        busNumber: formData.busNumber.trim(),
        driverName: formData.driverName.trim(),
        busRegisterNumber: formData.busRegisterNumber.trim(),
        capacity: Number(formData.capacity),
        routeName: formData.routeName.trim(),
      };

      const res = await busService.create(payload);

      if (res.data.success) {
        addToast('Bus added successfully!', 'success');
        setIsModalOpen(false);
        setFormData(EMPTY_FORM);
        // Re-fetch from backend to get authoritative DB state (status, id, etc.)
        await fetchBuses();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add bus. Please try again.';
      setFormError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Close modal + full reset ───────────────────────────────────────────────
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  // ── Table columns ─────────────────────────────────────────────────────────
  const columns = [
    { label: 'Bus Number', key: 'busNumber' },
    { label: 'Driver Name', key: 'driverName' },
    { label: 'Route', key: 'routeName' },
    {
      label: 'Status',
      key: 'status',
      render: (val) => (
        <span className={`status-badge ${val === 'ACTIVE' ? 'active' : 'inactive'}`}>
          {val ?? 'ACTIVE'}
        </span>
      ),
    },
  ];

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    color: '#1e293b',
    background: '#fff',
  };

  return (
    <div className="dashboard-container">
      <Header title="Fleet Management" />
      <div className="content-area">
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="stats-grid" style={{ width: 'auto', gridTemplateColumns: '1fr' }}>
            <div className="stat-card orange">
              <div className="stat-icon"><Bus /></div>
              <div className="stat-info">
                <h3>Total Buses</h3>
                <p>{loading ? '...' : buses.length}</p>
              </div>
            </div>
          </div>
          <button
            className="auth-submit-btn"
            style={{ width: 'auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Add Bus
          </button>
        </div>

        {/* Table / empty state */}
        {buses.length === 0 && !loading ? (
          <div className="auth-card" style={{ textAlign: 'center', padding: '40px' }}>
            <Bus size={48} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
            <h3>No buses found</h3>
            <p style={{ opacity: 0.7, marginBottom: '20px' }}>You haven't added any buses to your fleet yet.</p>
            <button
              className="auth-submit-btn"
              style={{ width: 'auto', padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} /> Add Your First Bus
            </button>
          </div>
        ) : (
          <DataTable
            title="Fleet Database"
            columns={columns}
            data={buses}
            onSearch={(val) => console.log('Searching buses...', val)}
          />
        )}

        {/* ── Create Bus Modal ───────────────────────────────────────────── */}
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="auth-card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
              {/* Close */}
              <button onClick={handleCloseModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>

              <h2 style={{ marginBottom: '20px' }}>Add New Bus</h2>

              {/* Form-level error */}
              {formError && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateBus} className="auth-form">
                {/* Bus Display Number */}
                <div className="form-group">
                  <label>Bus Display Number *</label>
                  <input
                    type="text"
                    className="auth-input-wrapper"
                    style={inputStyle}
                    value={formData.busNumber}
                    onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                    required
                  />
                </div>

                {/* Driver Name */}
                <div className="form-group">
                  <label>Driver Name *</label>
                  <input
                    type="text"
                    className="auth-input-wrapper"
                    style={inputStyle}
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    required
                  />
                </div>

                {/* Route Name */}
                <div className="form-group">
                  <label>Route Name *</label>
                  <input
                    type="text"
                    className="auth-input-wrapper"
                    style={inputStyle}
                    value={formData.routeName}
                    onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                    required
                  />
                </div>

                {/* Register Number + Capacity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Register Number *</label>
                    <input
                      type="text"
                      className="auth-input-wrapper"
                      style={inputStyle}
                      value={formData.busRegisterNumber}
                      onChange={(e) => setFormData({ ...formData, busRegisterNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Capacity *</label>
                    <input
                      type="number"
                      className="auth-input-wrapper"
                      style={inputStyle}
                      min="1"
                      max="100"
                      value={formData.capacity}
                      onChange={(e) => {
                        // Guard against NaN — if field is emptied, keep previous value
                        const parsed = parseInt(e.target.value, 10);
                        setFormData({ ...formData, capacity: isNaN(parsed) ? '' : parsed });
                      }}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={submitting}>
                  {submitting ? <Loader2 className="spinner" size={20} /> : 'Save Bus'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusesPage;
