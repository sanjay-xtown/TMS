import React, { useState, useEffect } from 'react';
import { ChevronDown, User, School } from 'lucide-react';

const Header = ({ title }) => {
  const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('admin') || '{}');
  const role = localStorage.getItem('role') || 'superadmin';
  const [schoolName, setSchoolName] = useState(localStorage.getItem('schoolName') || '');

  useEffect(() => {
    const handleStorageChange = () => {
      setSchoolName(localStorage.getItem('schoolName') || '');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <header className="top-header">
      <div className="header-search">
        <div className="search-box" style={{ width: '360px' }}>
          <input type="text" placeholder="Search anything..." />
          <span className="search-hint" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', color: '#64748b', fontWeight: 700, border: '1px solid #e2e8f0' }}>Ctrl K</span>
        </div>
      </div>

      <div className="header-actions">
        {role === 'schooladmin' && schoolName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--sidebar-active)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '50px', fontSize: '0.8125rem', fontWeight: 700 }}>
            <School size={16} />
            {schoolName}
          </div>
        )}
        <div className="user-profile">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.username || user.email || 'User'}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{role === 'superadmin' ? 'Super Admin' : 'School Admin'}</div>
          </div>
          <ChevronDown size={14} color="#64748b" />
        </div>
      </div>
    </header>
  );
};

export default Header;
