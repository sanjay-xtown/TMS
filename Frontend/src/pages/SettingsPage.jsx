import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash2, Plus, Settings as SettingsIcon, Globe, Loader2, Database } from 'lucide-react';
import { settingsService } from '../services/api';
import { useToast } from '../components/ToastProvider';
import Header from '../components/Header';
import '../styles/App.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newField, setNewField] = useState({ key: '', value: '' });
  const { addToast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsService.getAll();
      setSettings(res.data.data ?? []);
    } catch (err) {
      addToast("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = async (e) => {
    e.preventDefault();
    // Trim before validation to prevent whitespace-only fields slipping through
    const trimmedKey = newField.key.trim();
    const trimmedValue = newField.value.trim();
    if (!trimmedKey || !trimmedValue) {
      addToast("Key and Value are required", "error");
      return;
    }

    setSubmitting(true);
    try {
      await settingsService.add({ key: trimmedKey, value: trimmedValue });
      addToast("Configuration saved successfully", "success");
      setNewField({ key: '', value: '' });
      fetchSettings();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save config", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await settingsService.delete(id);
      addToast("Deleted successfully", "success");
      fetchSettings();
    } catch (err) {
      addToast("Delete failed", "error");
    }
  };

  return (
    <div className="dashboard-container">
      <Header title="System Configuration" />
      
      <div className="content-area">
        <div className="charts-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="chart-card">
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database size={20} color="#3b82f6" />
                <h3>Active Custom Configurations</h3>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}><Loader2 className="spinner" /></div>
            ) : (
              <div className="settings-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {settings.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No custom fields found.</p>
                ) : (
                  settings.map((s) => (
                    <motion.div 
                      key={s.id} 
                      className="stat-card" 
                      style={{ padding: '1rem 1.5rem', justifyContent: 'space-between' }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{s.key}</span>
                        <span style={{ fontSize: '1rem', fontWeight: 700 }}>{s.value}</span>
                      </div>
                      <button className="icon-btn delete" onClick={() => handleDelete(s.id)}>
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9' }}>
              <h4 style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>ADD NEW CONFIGURATION</h4>
              <form onSubmit={handleAddField} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem' }}>
                <div className="form-group">
                  <input 
                    placeholder="Field Key (e.g. support_email)" 
                    value={newField.key} 
                    onChange={e => setNewField({...newField, key: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <input 
                    placeholder="Field Value" 
                    value={newField.value} 
                    onChange={e => setNewField({...newField, value: e.target.value})} 
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ height: '46px' }}>
                  {submitting ? <Loader2 className="spinner" /> : <><Plus size={20} /> Add Field</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
