import React, { useState, useEffect } from 'react';
import { sendWhatsApp } from '../utils/whatsapp';



import Header from '../components/Header';
import DataTable from '../components/DataTable';
import { UserPlus, GraduationCap, X, Loader2, Users, CheckCircle } from 'lucide-react';
import { studentService, busService, parentService } from '../services/api';
import { useToast } from '../components/ToastProvider';

// ─── Constants ────────────────────────────────────────────────────────────────
const EMPTY_STUDENT_FORM = {
  studentName: '',
  class: '',
  section: '',
  gender: 'Male',
  address: '',
  pickupPoint: '',
  busId: '',
};

const EMPTY_PARENT_FORM = {
  parentName: '',
  mobileNumber: '',
};

// Parent tab modes
const PARENT_MODE = { SELECT: 'select', CREATE: 'create' };

// ─── Validators ───────────────────────────────────────────────────────────────
const validateStudentForm = (data) => {
  if (!data.studentName?.trim()) return 'Student name is required.';
  if (!data.class?.trim()) return 'Class is required.';
  if (!data.section?.trim()) return 'Section is required.';
  if (!data.address?.trim()) return 'Address is required.';
  if (!data.pickupPoint?.trim()) return 'Pickup point is required.';
  return null;
};

const validateParentForm = (data) => {
  if (!data.parentName?.trim()) return 'Parent name is required.';
  if (!data.mobileNumber?.trim()) return 'Mobile number is required.';
  const digits = data.mobileNumber.replace(/\D/g, '');
  if (digits.length < 10) return 'Mobile number must be at least 10 digits.';
  return null;
};

// ─── Shared input style removed in favor of CSS classes ───────────────────────

// ─── Component ────────────────────────────────────────────────────────────────
const StudentsPage = () => {
  // ── WhatsApp test (scoped inside component) ──
  const testWhatsApp = () => {
    const url = 'https://wa.me/917305217401?text=test';

    console.log('TEST BUTTON CLICKED');
    console.log('TEST URL:', url);

    const win = window.open(url, '_blank');
    console.log('WINDOW RESULT:', win);

    if (!win) {
      alert('Popup blocked or browser prevented opening');
    }
  };

  // ── List state ───────────────────────────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Modal state ──────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Student form state ───────────────────────────────────────────────────
  const [formData, setFormData] = useState(EMPTY_STUDENT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // ── Parent section state ─────────────────────────────────────────────────
  const [parentMode, setParentMode] = useState(PARENT_MODE.SELECT);
  const [selectedParentId, setSelectedParentId] = useState('');        // from dropdown
  const [parentForm, setParentForm] = useState(EMPTY_PARENT_FORM);    // new parent inputs
  const [parentFormError, setParentFormError] = useState('');
  const [creatingParent, setCreatingParent] = useState(false);
  const [createdParent, setCreatedParent] = useState(null);            // newly created parent object

  const { addToast } = useToast();

  // ── Fetch on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, busesRes, parentsRes] = await Promise.allSettled([
        studentService.getAll(),
        busService.getAll(),
        parentService.getAll(),
      ]);

      if (studentsRes.status === 'fulfilled') setStudents(studentsRes.value.data.data ?? []);
      if (busesRes.status === 'fulfilled')    setBuses(busesRes.value.data.data ?? []);
      if (parentsRes.status === 'fulfilled')  setParents(parentsRes.value.data.data ?? []);
    } catch (err) {
      addToast('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Switch parent tab ─────────────────────────────────────────────────────
  const switchParentMode = (mode) => {
    setParentMode(mode);
    setParentFormError('');
    setCreatedParent(null);
    setSelectedParentId('');
    setParentForm(EMPTY_PARENT_FORM);
  };

  // ── Create new parent inline ──────────────────────────────────────────────
  const handleCreateParent = async () => {
    setParentFormError('');
    const err = validateParentForm(parentForm);
    if (err) { setParentFormError(err); return; }

    setCreatingParent(true);
    try {
      const res = await parentService.create({
        parentName: parentForm.parentName.trim(),
        mobileNumber: parentForm.mobileNumber.trim(),
      });

      if (res.data.success) {
        const newParent = res.data.data;
        // Add to local parents list so it's available in the dropdown too
        setParents((prev) => [...prev, newParent]);
        setCreatedParent(newParent);
        addToast(`Parent "${newParent.parentName}" created! Password = last 4 digits of phone.`, 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create parent. Please try again.';
      setParentFormError(msg);
    } finally {
      setCreatingParent(false);
    }
  };

  // ── Resolve final parentId before submit ──────────────────────────────────
  const resolveParentId = () => {
    if (parentMode === PARENT_MODE.SELECT) {
      return selectedParentId || null;   // null = no parent selected (optional)
    }
    // CREATE mode
    return createdParent ? createdParent.id : null;
  };

  // ── Submit student ────────────────────────────────────────────────────────
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setFormError('');

    // 1. Validate student fields
    const studentErr = validateStudentForm(formData);
    if (studentErr) { setFormError(studentErr); return; }

    // 2. Validate parent section in CREATE mode: parent must be created before submit
    if (parentMode === PARENT_MODE.CREATE && !createdParent) {
      setFormError('Please create the parent first by clicking "Create Parent" below.');
      return;
    }

    const parentId = resolveParentId();

    setSubmitting(true);
    try {
      // Build clean payload — only include defined optional fields
      const payload = {
        studentName: formData.studentName.trim(),
        class: formData.class.trim(),
        section: formData.section.trim(),
        gender: formData.gender,
        address: formData.address.trim(),
        pickupPoint: formData.pickupPoint.trim(),
      };
      if (formData.busId) payload.busId = formData.busId;
      if (parentId)       payload.parentId = parentId;

      const res = await studentService.create(payload);

      if (res.data.success) {
        addToast('Student added successfully!', 'success');
        handleCloseModal();
        // Re-fetch from backend to get authoritative DB state
        await fetchData();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add student. Please try again.';
      setFormError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Close modal + full reset ──────────────────────────────────────────────
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(EMPTY_STUDENT_FORM);
    setFormError('');
    setParentMode(PARENT_MODE.SELECT);
    setSelectedParentId('');
    setParentForm(EMPTY_PARENT_FORM);
    setParentFormError('');
    setCreatedParent(null);
  };

  // ── Table columns ─────────────────────────────────────────────────────────
  const columns = [
    { label: 'Student Name', key: 'studentName' },
    { label: 'Class', key: 'class' },
    { label: 'Section', key: 'section' },
    {
      label: 'Assigned Bus',
      key: 'busId',
      render: (val) => val ? `Bus #${val}` : <span style={{ opacity: 0.5 }}>Not Assigned</span>,
    },
    {
      label: 'Parent',
      key: 'parentId',
      render: (val) => val ? <span style={{ color: '#10b981' }}>Linked ✓</span> : <span style={{ opacity: 0.5 }}>—</span>,
    },
  ];

  // ── Parent tab button style helper ────────────────────────────────────────
  const tabStyle = (active) => ({
    flex: 1,
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.82rem',
    transition: 'all 0.2s',
    background: active ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(255,255,255,0.06)',
    color: active ? '#fff' : '#94a3b8',
  });

  return (
    <div className="dashboard-container">
      <Header title="Student Management" />
      <div className="content-area">

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="stats-grid" style={{ width: 'auto', gridTemplateColumns: '1fr' }}>
            <div className="stat-card blue">
              <div className="stat-icon"><GraduationCap /></div>
              <div className="stat-info">
                <h3>Total Students</h3>
                <p>{loading ? '...' : students.length}</p>
              </div>
            </div>
          </div>
          <button
            className="auth-submit-btn"
            style={{ width: 'auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus size={18} /> Add Student
          </button>
        </div>

        {/* ── Table / empty state ───────────────────────────────────────── */}
        {students.length === 0 && !loading ? (
          <div className="auth-card" style={{ textAlign: 'center', padding: '40px' }}>
            <GraduationCap size={48} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
            <h3>No students found</h3>
            <p style={{ opacity: 0.7, marginBottom: '20px' }}>You haven't added any students to your school yet.</p>
            <button
              className="auth-submit-btn"
              style={{ width: 'auto', padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setIsModalOpen(true)}
            >
              <UserPlus size={18} /> Add Your First Student
            </button>
          </div>
        ) : (
          <DataTable
            title="All Students"
            columns={columns}
            data={students}
            onSearch={(val) => console.log('Searching...', val)}
          />
        )}

        {/* ══════════════════ CREATE STUDENT MODAL ══════════════════════ */}
        {isModalOpen && (
          <div className="modal-overlay" style={{ overflowY: 'auto', padding: '20px 0' }}>
            <div className="modal-content" style={{ margin: 'auto', maxWidth: '540px' }}>
              <div className="modal-header">
                <div>
                  <h2 style={{ marginBottom: '4px' }}>Add New Student</h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Fill in student details and link a parent below.</p>
                </div>
                <button onClick={handleCloseModal} className="close-btn">
                  <X size={20} />
                </button>
              </div>

              <div className="modal-form">
                {/* Form-level error */}
                {formError && (
                  <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
                    {formError}
                  </div>
                )}


<form onSubmit={handleCreateStudent} className="auth-form">




                {/* ── SECTION 1: Student Details ──────────────────────────── */}
                <div style={{ marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Student Details
                </div>

                <div className="form-group">
                  <label>Student Name *</label>
                  <input type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Class *</label>
                    <input type="text"
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      required />
                  </div>
                  <div className="form-group">
                    <label>Section *</label>
                    <input type="text"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Assign Bus (Optional)</label>
                  <select
                    value={formData.busId}
                    onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
                    style={{ padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9375rem', background: '#f8fafc' }}
                  >
                    <option value="">Select Bus</option>
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>{b.busNumber} — {b.routeName ?? ''}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                  <div className="form-group">
                    <label>Address *</label>
                    <input type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required />
                  </div>
                  <div className="form-group">
                    <label>Pickup Point *</label>
                    <input type="text"
                      value={formData.pickupPoint}
                      onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
                      required />
                  </div>
                </div>

                {/* ── SECTION 2: Parent Details ─────────────────────────────── */}
                <div style={{ marginTop: '20px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Parent Details (Optional)
                  </div>

                  {/* Tab toggle */}
                  <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px', marginBottom: '14px' }}>
                    <button type="button" style={tabStyle(parentMode === PARENT_MODE.SELECT)}
                      onClick={() => switchParentMode(PARENT_MODE.SELECT)}>
                      <Users size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                      Select Existing
                    </button>
                    <button type="button" style={tabStyle(parentMode === PARENT_MODE.CREATE)}
                      onClick={() => switchParentMode(PARENT_MODE.CREATE)}>
                      <UserPlus size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                      Create New Parent
                    </button>
                  </div>

                  {/* ── Tab A: Select existing parent ─────────────────────── */}
                  {parentMode === PARENT_MODE.SELECT && (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Select Parent</label>
                      <select
                        value={selectedParentId}
                        onChange={(e) => setSelectedParentId(e.target.value)}
                        style={{ padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9375rem', background: '#f8fafc' }}
                      >
                        <option value="">— No Parent (skip) —</option>
                        {parents.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.parentName} — {p.mobileNumber}
                          </option>
                        ))}
                      </select>
                      {parents.length === 0 && (
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                          No parents registered yet. Switch to "Create New Parent" to add one.
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── Tab B: Create new parent inline ───────────────────── */}
                  {parentMode === PARENT_MODE.CREATE && (
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>

                      {/* Success banner after parent created */}
                      {createdParent ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#10b981' }}>
                          <CheckCircle size={18} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Parent Created ✓</div>
                            <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>
                              {createdParent.parentName} | {createdParent.mobileNumber} | Password: last 4 digits
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setCreatedParent(null); setParentForm(EMPTY_PARENT_FORM); }}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.78rem' }}
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Parent form error */}
                          {parentFormError && (
                            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px', fontSize: '0.8rem' }}>
                              {parentFormError}
                            </div>
                          )}

                          <div className="form-group">
                            <label style={{ fontSize: '0.82rem' }}>Parent Name *</label>
                            <input type="text"
                              placeholder="e.g. Ramesh Kumar"
                              value={parentForm.parentName}
                              onChange={(e) => setParentForm({ ...parentForm, parentName: e.target.value })} />
                          </div>

                          <div className="form-group" style={{ marginTop: '10px' }}>
                            <label style={{ fontSize: '0.82rem' }}>Mobile Number * <span style={{ opacity: 0.5 }}>(min 10 digits — last 4 = auto password)</span></label>
                            <input type="text"
                              placeholder="e.g. 9876543210"
                              value={parentForm.mobileNumber}
                              onChange={(e) => setParentForm({ ...parentForm, mobileNumber: e.target.value })} />
                          </div>

                          <button
                            type="button"
                            className="auth-submit-btn"
                            style={{ width: 'auto', padding: '9px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onClick={handleCreateParent}
                            disabled={creatingParent}
                          >
                            {creatingParent
                              ? <><Loader2 className="spinner" size={15} /> Creating...</>
                              : <><UserPlus size={15} /> Create Parent</>}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="modal-footer" style={{ marginTop: '20px', padding: '1.5rem 0 0 0', background: 'none', borderTop: 'none' }}>
                  <button type="submit" className="btn-primary" disabled={submitting || creatingParent}>
                    {submitting ? <><Loader2 className="spinner" size={20} /> Saving...</> : 'Save Student'}
                  </button>
                </div>
              </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentsPage;
