import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Loader2, Phone } from 'lucide-react';
import { schoolAdminService } from '../services/api';
import { useToast } from '../components/ToastProvider';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import '../styles/App.css';

const SchoolAdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    schoolName: '',
    schoolLocation: '',
    adminName: '',
    adminEmail: '',
    password: '',
    whatsappNumber: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await schoolAdminService.getAll();
      setAdmins(res.data.data ?? []);
    } catch (err) {
      addToast("Failed to fetch admins", "error");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.schoolName) newErrors.schoolName = "Required";
    if (!formData.schoolLocation) newErrors.schoolLocation = "Required";
    if (!formData.adminName) newErrors.adminName = "Required";
    if (!formData.adminEmail) newErrors.adminEmail = "Required";
    if (!formData.whatsappNumber) newErrors.whatsappNumber = "Required";
    if (!currentAdmin && !formData.password) newErrors.password = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppRedirect = (data) => {
    const message = `🏫 *School Admin Invitation*%0A%0AHello *${data.adminName}*,%0A%0AYou have been added as School Admin for *${data.schoolName}*.%0A%0A*Login Details:*%0AEmail: ${data.adminEmail}%0APassword: ${data.password}%0A%0A*Login here:*%0Ahttp://localhost:5173/login`;
    const whatsappUrl = `https://wa.me/${data.whatsappNumber.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (currentAdmin) {
        await schoolAdminService.update(currentAdmin.id, formData);
        addToast("Admin updated successfully", "success");
      } else {
        await schoolAdminService.create(formData);
        addToast("Invitation sent successfully!", "success");
        handleWhatsAppRedirect(formData);
      }
      setIsModalOpen(false);
      fetchAdmins();
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed";
      addToast(msg, "error");
      if (msg.includes("Email")) {
        setErrors({ ...errors, adminEmail: msg });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { label: 'School', key: 'schoolName' },
    { label: 'Admin', key: 'adminName' },
    { label: 'Email', key: 'adminEmail' },
    { 
      label: 'WhatsApp', 
      key: 'whatsappNumber',
      render: (val) => <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontWeight: 600 }}><Phone size={14} /> {val}</div>
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="action-btns">
          <button className="icon-btn edit" onClick={() => openModal(row)}><Edit2 size={16} /></button>
          <button className="icon-btn delete" onClick={() => handleDelete(row.id)}><Trash2 size={16} /></button>
        </div>
      )
    }
  ];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await schoolAdminService.delete(id);
        addToast("Deleted successfully", "success");
        fetchAdmins();
      } catch (err) {
        addToast("Delete failed", "error");
      }
    }
  };

  const openModal = (admin = null) => {
    if (admin) {
      setCurrentAdmin(admin);
      setFormData({ ...admin, password: '' });
    } else {
      setCurrentAdmin(null);
      setFormData({ schoolName: '', schoolLocation: '', adminName: '', adminEmail: '', password: '', whatsappNumber: '7305217401' });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      <Header title="School Administration" />
      
      <div className="content-area">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <button className="btn-primary" onClick={() => openModal()}>
            <Plus size={20} /> Add School Admin
          </button>
        </div>

        {loading ? <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="spinner" /></div> : (
          <DataTable title="School Admin Directory" columns={columns} data={admins} onSearch={() => {}} />
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div className="modal-content" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="modal-header">
                <h2>{currentAdmin ? 'Edit Administrator' : 'Register New Admin'}</h2>
                <button className="close-btn" onClick={() => { setIsModalOpen(false); setErrors({}); }}><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>School Name</label>
                    <input className={errors.schoolName ? 'error' : ''} value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value})} required />
                    {errors.schoolName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.schoolName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input className={errors.schoolLocation ? 'error' : ''} value={formData.schoolLocation} onChange={e => setFormData({...formData, schoolLocation: e.target.value})} required />
                    {errors.schoolLocation && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.schoolLocation}</span>}
                  </div>
                  <div className="form-group">
                    <label>Admin Name</label>
                    <input className={errors.adminName ? 'error' : ''} value={formData.adminName} onChange={e => setFormData({...formData, adminName: e.target.value})} required />
                    {errors.adminName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.adminName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Admin Email</label>
                    <input type="email" className={errors.adminEmail ? 'error' : ''} value={formData.adminEmail} onChange={e => setFormData({...formData, adminEmail: e.target.value})} required />
                    {errors.adminEmail && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.adminEmail}</span>}
                  </div>
                  <div className="form-group">
                    <label>WhatsApp Number</label>
                    <input className={errors.whatsappNumber ? 'error' : ''} value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} required />
                    {errors.whatsappNumber && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.whatsappNumber}</span>}
                  </div>
                  <div className="form-group">
                    <label>{currentAdmin ? 'New Password (Optional)' : 'Password'}</label>
                    <input type="password" className={errors.password ? 'error' : ''} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!currentAdmin} />
                    {errors.password && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.password}</span>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? <Loader2 className="spinner" size={18} /> : 'Confirm & Send Invitation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchoolAdminPage;
