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
      <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <h1>{title}</h1>
        {role === 'schooladmin' && schoolName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600 }}>
            <School size={14} />
            {schoolName}
          </div>
        )}
      </div>

      <div className="header-actions">
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
