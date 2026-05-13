import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  School,
  Bus,
  Users,
  Settings,
  LogOut,
  Navigation,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const role = auth.role || 'superadmin';

  const handleLogout = () => {
    // Clears localStorage AND React auth state atomically.
    // ProtectedRoute immediately detects unauthenticated state
    // and redirects to /login — no stale data ever survives.
    logout();
    navigate('/login', { replace: true });
  };

  const menuItems =
    role === 'superadmin'
      ? [
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/superadmin/dashboard' },
          { icon: <School size={20} />, label: 'School Admins', path: '/school-admins' },
          { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
        ]
      : [
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/schooladmin/dashboard' },
          { icon: <School size={20} />, label: 'School Setup', path: '/school-setup' },
          { icon: <Users size={20} />, label: 'Students', path: '/schooladmin/students' },
          { icon: <Bus size={20} />, label: 'Buses', path: '/schooladmin/buses' },
          { icon: <Navigation size={20} />, label: 'Tracking', path: '/schooladmin/tracking' },
        ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">BT</div>
        <span className="brand-name">BusTrack</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ padding: '1rem' }}>
        <button
          onClick={handleLogout}
          className="menu-item logout"
          style={{
            background: 'transparent',
            border: 'none',
            width: '100%',
            color: '#ef4444',
            cursor: 'pointer',
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
