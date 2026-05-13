import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import { UserCheck, UserPlus, Send, Loader2, X, MessageCircle } from 'lucide-react';
import { parentService, studentService } from '../services/api';
import { useToast } from '../components/ToastProvider';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  parentName: '',
  mobileNumber: '',
  address: '',
  studentId: '',
};

/** Returns null if valid, or a human-readable error string */
const validateForm = (data) => {
  if (!data.parentName?.trim()) return 'Parent name is required.';
  if (!data.mobileNumber?.trim()) return 'Mobile number is required.';
  // Strip non-digit chars before length check (handles spaces / dashes)
  const digits = data.mobileNumber.replace(/\D/g, '');
  if (digits.length < 10) return 'Mobile number must be at least 10 digits.';
  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────
const ParentsPage = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [createdParent, setCreatedParent] = useState(null);
  const [waBlockedUrl, setWaBlockedUrl]   = useState(null); // shown when popup is blocked
  const { addToast } = useToast();
  const lastWaUrlRef = useRef(null); // always holds latest WA URL for fallback

  // ── Expose test function on window so DevTools console can call it ─────────
  useEffect(() => {
    window.testWhatsApp = () => {
      const url = 'https://wa.me/917305217401?text=TestFromConsole';
      console.log('[TEST] testWhatsApp() called. URL:', url);
      const w = window.open(url, '_blank');
      if (!w) {
        console.error('[TEST] ❌ window.open returned null — popup blocked!');
        alert('Popup blocked!\nGo to address bar → 🔒 icon → Allow Popups.');
      } else {
        console.log('[TEST] ✅ window.open succeeded.');
      }
    };
    console.info('[DEBUG] Type testWhatsApp() in DevTools console to test WA directly.');
    return () => { delete window.testWhatsApp; };
  }, []);

  // ── WhatsApp Helper ────────────────────────────────────────────────────────
  /** Build the wa.me URL. Returns null if mobile is missing/invalid. */
  const buildWhatsAppUrl = (parent) => {
    console.log('[WA] buildWhatsAppUrl called with:', parent);

    if (!parent?.mobileNumber) {
      console.error('[WA] FAIL — mobileNumber missing:', parent);
      return null;
    }

    // Strip ALL non-digit chars (+91, spaces, dashes, etc.)
    const digits = String(parent.mobileNumber).replace(/\D/g, '');
    console.log('[WA] digits extracted:', digits);

    if (digits.length < 10) {
      console.error('[WA] FAIL — too short after stripping:', digits);
      return null;
    }

    // Always last 10 digits to avoid double-91
    const mobile10 = digits.slice(-10);
    const password  = mobile10.slice(-4);
    const name      = parent.parentName || 'Parent';

    const message =
`Hello ${name},
Your Bus Tracking Login Details:

Name: ${name}
Mobile: ${mobile10}
Password: ${password}

Please keep this safe.`;

    const url = `https://wa.me/91${mobile10}?text=${encodeURIComponent(message)}`;
    console.log('[WA] URL built:', url);
    return url;
  };

  /**
   * Send WhatsApp.
   * If preOpenedWindow is provided — navigate it (bypasses popup blocker).
   * Otherwise try window.open directly.
   */
  const sendWhatsApp = (parent, preOpenedWindow = null) => {
    console.log('[WA] sendWhatsApp called. parent:', parent, '| preOpenedWindow:', preOpenedWindow);

    const url = buildWhatsAppUrl(parent);

    if (!url) {
      addToast('Invalid mobile number — WhatsApp not opened.', 'error');
      if (preOpenedWindow) preOpenedWindow.close();
      return;
    }

    if (preOpenedWindow) {
      console.log('[WA] Navigating pre-opened window to:', url);
      try {
        preOpenedWindow.location.href = url;
        console.log('[WA] Navigation set successfully.');
      } catch (navErr) {
        console.error('[WA] Navigation failed:', navErr);
        // Hard fallback — try a fresh window.open
        const fb = window.open(url, '_blank');
        if (!fb) {
          alert('WhatsApp blocked by popup blocker.\n\nPlease:\n1. Click the popup-blocked icon in your browser address bar\n2. Allow popups for this site\n3. Then click the green WhatsApp button in the success screen.');
        }
      }
    } else {
      console.log('[WA] No pre-opened window — calling window.open directly.');
      const newTab = window.open(url, '_blank');
      if (!newTab || newTab.closed) {
        console.warn('[WA] window.open returned null — popup blocked.');
        alert('WhatsApp blocked by popup blocker.\n\nPlease:\n1. Click the popup-blocked icon in your browser address bar\n2. Allow popups for this site\n3. Then click the green WhatsApp button in the success screen.');
      } else {
        console.log('[WA] window.open succeeded.');
      }
    }
  };


  // Always fetch from backend on mount — no stale state
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [parentsRes, studentsRes] = await Promise.allSettled([
        parentService.getAll(),
        studentService.getAll(),
      ]);

      if (parentsRes.status === 'fulfilled') setParents(parentsRes.value.data.data ?? []);
      if (studentsRes.status === 'fulfilled') setStudents(studentsRes.value.data.data ?? []);
    } catch (err) {
      addToast('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Create parent ──────────────────────────────────────────────────────────
  const handleCreateParent = async (e) => {
    e.preventDefault();
    setFormError('');

    // Client-side validation before any API call
    const err = validateForm(formData);
    if (err) { setFormError(err); return; }

    setSubmitting(true);

    // ─────────────────────────────────────────────────────────────────────────
    // DEFINITIVE FIX:
    // We already have parentName + mobileNumber in formData BEFORE the API
    // call. So build the full WhatsApp URL now, synchronously, and open it
    // immediately — still inside the user-gesture handler, guaranteed not
    // blocked by any browser popup policy.
    // If the API call later fails, we close this tab.
    // ─────────────────────────────────────────────────────────────────────────
    const rawMobile  = formData.mobileNumber.trim().replace(/\D/g, '');
    const mobile10   = rawMobile.slice(-10);
    const password   = mobile10.slice(-4);
    const parentName = formData.parentName.trim();

    // STEP 1: Log cleaned data
    console.log('═══════════ WhatsApp Debug ═══════════');
    console.log('STEP 1 — rawMobile :', rawMobile);
    console.log('STEP 1 — mobile10  :', mobile10);
    console.log('STEP 1 — password  :', password);
    console.log('STEP 1 — parentName:', parentName);

    const waMessage = encodeURIComponent(
`Hello ${parentName},
Your Bus Tracking Login Details:

Name: ${parentName}
Mobile: ${mobile10}
Password: ${password}

Please keep this safe.`
    );
    const waUrl = `https://wa.me/91${mobile10}?text=${waMessage}`;
    lastWaUrlRef.current = waUrl;
    setWaBlockedUrl(null); // reset any previous blocked banner

    // STEP 2: Log URL
    console.log('STEP 2 — WhatsApp URL:', waUrl);

    // Open WhatsApp NOW — user-gesture context is still active
    console.log('STEP 3 — Calling window.open...');
    const waWindow = window.open(waUrl, '_blank');
    console.log('STEP 3 — waWindow result:', waWindow);

    if (!waWindow) {
      console.error('STEP 3 — ❌ POPUP BLOCKED. window.open returned null.');
      setWaBlockedUrl(waUrl); // show clickable fallback link in UI
      addToast(
        'Popup blocked! Click the link below to open WhatsApp manually.',
        'error'
      );
    } else {
      console.log('STEP 3 — ✅ WhatsApp window opened successfully.');
    }

    // ── Now make the API call ──────────────────────────────────────────────
    try {
      const payload = {
        parentName,
        mobileNumber: formData.mobileNumber.trim(),
        address: formData.address.trim() || null,
      };
      if (formData.studentId) payload.studentId = formData.studentId;

      console.log('[ParentCreate] Sending payload:', payload);
      const res = await parentService.create(payload);
      console.log('STEP 4 — API res.data:', res.data);
      console.log('STEP 4 — success flag:', res.data.success);

      if (res.data.success) {
        console.log('STEP 4 — ✅ Parent saved in DB successfully');
        addToast('Parent added successfully! WhatsApp opened.', 'success');

        const newParent = res.data.data ?? { parentName, mobileNumber: payload.mobileNumber };
        setCreatedParent(newParent);
        setFormData(EMPTY_FORM);
        await fetchData();
      } else {
        // API failed — close the WhatsApp tab we opened
        waWindow?.close();
        const msg = res.data.message || 'Parent creation failed.';
        setFormError(msg);
        addToast(msg, 'error');
      }
    } catch (err) {
      // Network / server error — close the WhatsApp tab we opened
      waWindow?.close();
      const msg = err.response?.data?.message || 'Failed to add parent. Please try again.';
      setFormError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Send WhatsApp invitation ───────────────────────────────────────────────
  const handleSendInvitation = async (parentId) => {
    setSendingId(parentId);
    try {
      const res = await parentService.sendInvitation(parentId);
      if (res.data.success) {
        addToast('Invitation sent successfully!', 'success');
        // Optimistic update for invite status only (no full re-fetch needed)
        setParents((prev) =>
          prev.map((p) => (p.id === parentId ? { ...p, invitationSent: true } : p))
        );
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send invitation', 'error');
    } finally {
      setSendingId(null);
    }
  };

  // ── Close modal + full reset ───────────────────────────────────────────────
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(EMPTY_FORM);
    setFormError('');
    setCreatedParent(null);
  };

  // ── Table columns ─────────────────────────────────────────────────────────
  const columns = [
    { label: 'Parent Name', key: 'parentName' },
    { label: 'Phone', key: 'mobileNumber' },
    {
      label: 'Invite Status',
      key: 'invitationSent',
      render: (sent) => (
        <span className={`status-badge ${sent ? 'active' : 'inactive'}`}>
          {sent ? 'Sent' : 'Pending'}
        </span>
      ),
    },
    {
      label: 'Actions',
      key: 'id',
      render: (id, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="auth-submit-btn"
            style={{ padding: '8px 16px', fontSize: '0.8rem', width: 'auto', opacity: row.invitationSent ? 0.5 : 1 }}
            onClick={() => handleSendInvitation(id)}
            disabled={sendingId === id || row.invitationSent}
            title="Send Email Invitation"
          >
            {sendingId === id ? (
              <Loader2 className="spinner" size={14} />
            ) : (
              <>
                <Send size={14} style={{ marginRight: '8px' }} />
                {row.invitationSent ? 'Invite Sent' : 'Email Invite'}
              </>
            )}
          </button>
          
          <button
            className="auth-submit-btn"
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.8rem', 
              width: 'auto', 
              background: '#25D366', 
              borderColor: '#25D366' 
            }}
            onClick={() => sendWhatsApp(row)}
            title="Send via WhatsApp"
          >
            <MessageCircle size={14} style={{ marginRight: '8px' }} />
            WhatsApp
          </button>
        </div>
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
      <Header title="Parent Management" />
      <div className="content-area">
          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div className="stats-grid" style={{ width: 'auto', gridTemplateColumns: '1fr' }}>
              <div className="stat-card purple">
                <div className="stat-icon"><UserCheck /></div>
                <div className="stat-info">
                  <h3>Total Parents</h3>
                  <p>{loading ? '...' : parents.length}</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

              {/* ── DIAGNOSTIC: popup-blocked fallback link ── */}
              {waBlockedUrl && (
                <a
                  href={waBlockedUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '10px 16px',
                    background: '#25D366',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    animation: 'pulse 1.5s infinite',
                  }}
                >
                  <MessageCircle size={16} /> Open WhatsApp (popup was blocked)
                </a>
              )}

              {/* ── TEST BUTTON: click to verify popup permission ── */}
              <button
                className="auth-submit-btn"
                style={{ width: 'auto', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: '#128C7E', borderColor: '#128C7E', fontSize: '0.8rem' }}
                onClick={() => {
                  console.log('[TEST] Button clicked — running testWhatsApp()');
                  window.testWhatsApp();
                }}
              >
                <MessageCircle size={15} /> Test WhatsApp
              </button>

              <button
                className="auth-submit-btn"
                style={{ width: 'auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => setIsModalOpen(true)}
              >
                <UserPlus size={18} /> Add Parent
              </button>
            </div>
          </div>

        {/* Table / empty state */}
        {parents.length === 0 && !loading ? (
          <div className="auth-card" style={{ textAlign: 'center', padding: '40px' }}>
            <UserCheck size={48} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
            <h3>No parents found</h3>
            <p style={{ opacity: 0.7, marginBottom: '20px' }}>You haven't added any parents to your school yet.</p>
            <button
              className="auth-submit-btn"
              style={{ width: 'auto', padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setIsModalOpen(true)}
            >
              <UserPlus size={18} /> Add Your First Parent
            </button>
          </div>
        ) : (
          <DataTable
            title="Parent Database"
            columns={columns}
            data={parents}
            onSearch={(val) => console.log('Searching parents...', val)}
          />
        )}

        {/* ── Create Parent Modal ────────────────────────────────────────── */}
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="auth-card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
              {/* Close */}
              <button onClick={handleCloseModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>

              <h2 style={{ marginBottom: '20px' }}>Add New Parent</h2>

              {/* Form-level error */}
              {formError && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
                  {formError}
                </div>
              )}

              {createdParent ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ color: '#10b981', marginBottom: '20px' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: '#ecfdf5', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 15px'
                    }}>
                      <UserCheck size={32} />
                    </div>
                    <h3 style={{ color: 'white' }}>Parent Added Successfully!</h3>
                  </div>

                  <div style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    marginBottom: '25px', 
                    textAlign: 'left',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <p style={{ marginBottom: '8px' }}><strong>Name:</strong> {createdParent.parentName}</p>
                    <p style={{ marginBottom: '8px' }}><strong>Mobile:</strong> {createdParent.mobileNumber}</p>
                    <p><strong>Password:</strong> {createdParent.mobileNumber.replace(/\D/g, '').slice(-4)}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button 
                      type="button"
                      className="auth-submit-btn" 
                      onClick={() => sendWhatsApp(createdParent)}
                      style={{ background: '#25D366', borderColor: '#25D366' }}
                    >
                      <MessageCircle size={18} style={{ marginRight: '8px' }} />
                      Send Credentials via WhatsApp
                    </button>
                    
                    <button 
                      type="button"
                      className="auth-submit-btn" 
                      onClick={handleCloseModal}
                      style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.1)' }}
                    >
                      Done & Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateParent} className="auth-form">
                  {/* Parent Name */}
                  <div className="form-group">
                    <label>Parent Name *</label>
                    <input
                      type="text"
                      className="auth-input-wrapper"
                      style={inputStyle}
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      required
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="form-group">
                    <label>Phone Number * (last 4 digits = auto password)</label>
                    <input
                      type="text"
                      className="auth-input-wrapper"
                      style={inputStyle}
                      placeholder="e.g. 9876543210"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      required
                    />
                  </div>

                  {/* Link Student (optional) */}
                  <div className="form-group">
                    <label>Link Student (Optional)</label>
                    <select
                      className="auth-input-wrapper"
                      style={inputStyle}
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    >
                      <option value="">Select Student</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.studentName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Address */}
                  <div className="form-group">
                    <label>Address (Optional)</label>
                    <input
                      type="text"
                      className="auth-input-wrapper"
                      style={inputStyle}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '20px' }}>
                    * Password is auto-generated from the last 4 digits of the mobile number.
                  </p>

                  <button type="submit" className="auth-submit-btn" disabled={submitting}>
                    {submitting ? <Loader2 className="spinner" size={20} /> : 'Save Parent'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentsPage;
