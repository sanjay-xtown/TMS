import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, MapPin, Phone, Building2, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { useToast } from '../components/ToastProvider';
import { useAuth } from '../contexts/AuthContext';
import { schoolService } from '../services/api';

const SchoolSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { updateSchoolId } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await schoolService.create(formData);
      if (res.data.success) {
        addToast('School created successfully!', 'success');

        // Sync schoolId into AuthContext (and localStorage) so
        // downstream pages immediately see the new school without reload.
        updateSchoolId(res.data.school.id);
        localStorage.setItem('schoolName', res.data.school.name);

        // Reset form state
        setFormData({ name: '', address: '', city: '', phone: '' });

        // Navigate (React Router — no full reload needed now)
        navigate('/schooladmin/dashboard', { replace: true });
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create school', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Header title="School Setup" />
      <div className="content-area" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="auth-card" style={{ width: '100%', marginTop: '20px' }}>
          <div className="auth-header">
            <div className="auth-logo-badge">
              <Building2 size={28} />
            </div>
            <h1>Create Your School</h1>
            <p>Enter your school details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>School Name</label>
              <div className="auth-input-wrapper">
                <School className="auth-input-icon" size={18} />
                <input
                  type="text"
                  placeholder="e.g. St. Xavier's International"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Full Address</label>
              <div className="auth-input-wrapper">
                <MapPin className="auth-input-icon" size={18} />
                <input
                  type="text"
                  placeholder="Street name, Area"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>City</label>
                <div className="auth-input-wrapper">
                  <Building2 className="auth-input-icon" size={18} />
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="auth-input-wrapper">
                  <Phone className="auth-input-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Contact Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading ? (
                <Loader2 className="spinner" size={20} />
              ) : (
                <>
                  <Building2 size={18} /> Create School
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SchoolSetup;
