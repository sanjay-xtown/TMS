import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { LayoutDashboard, LogOut, User, Bus, MapPin, Users, Bell } from 'lucide-react';
import '../styles/App.css';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/superadmin/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  if (loading) return <div className="loader-overlay"><div className="spinner-large"></div></div>;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-box">BT</div>
          <h2>BusTrack</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active"><LayoutDashboard size={20} /> Dashboard</a>
          <a href="#" className="nav-item"><Bus size={20} /> Fleets</a>
          <a href="#" className="nav-item"><MapPin size={20} /> Routes</a>
          <a href="#" className="nav-item"><Users size={20} /> Staff</a>
          <a href="#" className="nav-item"><Bell size={20} /> Alerts</a>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-title">
            <h1>Welcome back, Admin</h1>
            <p>Here's what's happening today</p>
          </div>
          <div className="header-profile">
            <div className="profile-info">
              <span>{profile?.email}</span>
              <small>SuperAdmin</small>
            </div>
            <div className="profile-avatar">
              <User size={24} />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue"><Bus size={24} /></div>
            <div className="stat-data">
              <h3>24</h3>
              <p>Active Buses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><MapPin size={24} /></div>
            <div className="stat-data">
              <h3>12</h3>
              <p>Active Routes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Users size={24} /></div>
            <div className="stat-data">
              <h3>1,240</h3>
              <p>Daily Passengers</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple"><Bell size={24} /></div>
            <div className="stat-data">
              <h3>3</h3>
              <p>System Alerts</p>
            </div>
          </div>
        </section>

        {/* Placeholder for content */}
        <div className="content-card">
          <div className="card-header">
            <h2>Live Tracking Overview</h2>
            <button className="btn-primary">View Full Map</button>
          </div>
          <div className="placeholder-map">
            <div className="map-overlay">
              <p>Real-time Bus Locations Loading...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
