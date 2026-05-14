import { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Bus,
  Users,
  Link as LinkIcon,
  Hash,
  User,
  Phone,
  CreditCard,
  Activity,
  UserCheck,
  MapPin,
  Route as RouteIcon,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";

import BusMapWidget from "./BusMapWidget";

export default function SchoolAdminDashboard() {
  const [view, setView] = useState("dashboard");
  const [stats, setStats] = useState({ totalBuses: 0, totalDrivers: 0, totalRoutes: 0, totalStudents: 0 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("schooladmin_token");
  const API_URL = "http://localhost:5000/api/schooladmin";

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setStats(res.data.stats);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const fetchData = async (endpoint) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      setError(`Failed to fetch ${endpoint}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    if (view === "buses") fetchData("buses");
    if (view === "drivers") fetchData("drivers");
    if (view === "routes") fetchData("routes");
    if (view === "students") fetchData("students");
  }, [view]);

  return (
    <div className="schooladmin-page">
      {/* SIDEBAR */}
      <aside className="schooladmin-sidebar">
        <div className="schooladmin-sidebar-brand">
          <div className="schooladmin-sidebar-logo">🚍</div>
          <div className="schooladmin-sidebar-title">
            School<span className="schooladmin-sidebar-title-accent">Admin</span>
          </div>
        </div>

        <div className="schooladmin-sidebar-menu">
          <NavItem active={view === "dashboard"} onClick={() => setView("dashboard")} icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem active={view === "buses"} onClick={() => setView("buses")} icon={<Bus size={18} />} label="Bus Fleet" />
          <NavItem active={view === "drivers"} onClick={() => setView("drivers")} icon={<UserCheck size={18} />} label="Drivers" />
          <NavItem active={view === "routes"} onClick={() => setView("routes")} icon={<RouteIcon size={18} />} label="Routes" />
          <NavItem active={view === "students"} onClick={() => setView("students")} icon={<Users size={18} />} label="Students" />
          <NavItem active={view === "live"} onClick={() => setView("live")} icon={<MapPin size={18} />} label="Live Tracking" />
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/schooladmin/login";
          }}
          className="schooladmin-signout"
        >
          Sign Out
        </button>
      </aside>

      {/* MAIN */}
      <main className="schooladmin-main">
        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div className="schooladmin-content">
            <h1 className="schooladmin-h1">School Overview</h1>

            <div className="schooladmin-stats-grid">
              <StatCard title="Total Buses" value={stats.totalBuses} variant="green" icon={<Bus size={22} />} />
              <StatCard title="Total Students" value={stats.totalStudents} variant="blue" icon={<Users size={22} />} />
              <StatCard title="Drivers" value={stats.totalDrivers} variant="orange" icon={<UserCheck size={22} />} />
              <StatCard title="Routes" value={stats.totalRoutes} variant="purple" icon={<RouteIcon size={22} />} />
            </div>

            <div className="schooladmin-welcome-card">
              <h3>Welcome back, Admin</h3>
              <p>
                Manage your school's transportation system efficiently. Track live locations, manage drivers, and optimize routes from one place.
              </p>
            </div>
          </div>
        )}

        {/* LIST VIEWS (Buses, Drivers, Routes, Students) */}
        {(view === "buses" || view === "drivers" || view === "routes" || view === "students") && (
          <div className="schooladmin-content">
            <div className="schooladmin-list-header">
              <h1 className="schooladmin-h1">{view} Management</h1>
              {view !== "students" && (
                <button className="schooladmin-btn-primary">
                  <Plus size={16} /> Add New
                </button>
              )}
            </div>

            <div className="schooladmin-table-card">
              <table className="schooladmin-table">
                <thead>
                  <tr>
                    <th>Name / ID</th>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: 24, color: "#6B7B72" }}>
                        Loading data...
                      </td>
                    </tr>
                  ) : data.length > 0 ? (
                    data.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="schooladmin-table-strong">{item.busNumber || item.driverName || item.routeName || item.studentName}</div>
                          <div className="schooladmin-table-muted">{String(item.id).slice(0, 8)}...</div>
                        </td>
                        <td>
                          <span style={{ color: "#5B6B63" }}>
                            {item.capacity ? `Capacity: ${item.capacity}` : item.phone || item.startLocation || item.grade}
                          </span>
                        </td>
                        <td>
                          <span className="schooladmin-badge">Active</span>
                        </td>
                        <td>
                          <div className="schooladmin-action-row">
                            <button className="schooladmin-icon-btn"> <Edit size={16} /> </button>
                            <button className="schooladmin-icon-btn schooladmin-icon-btn-danger"> <Trash2 size={16} /> </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: 24, color: "#6B7B72" }}>
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOTTOM WIDGET: LIVE BUS TRACKING SECTION */}
        <div className="schooladmin-live-section">
          <BusMapWidget />
        </div>

        {/* Optional: keep a simple placeholder for live view; widget is always at bottom */}
        {view === "live" && (
          <div className="schooladmin-live-note">
            <h2 className="schooladmin-live-note-title">Real-time Tracking</h2>
            <p className="schooladmin-live-note-text">Use the live map widget below to see the moving bus (loop route demo).</p>
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }) {
  return (
    <div onClick={onClick} className={`schooladmin-nav-item ${active ? "active" : ""}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

function StatCard({ icon, title, value, variant }) {
  const variantClass = `schooladmin-stat-${variant}`;
  return (
    <div className={`schooladmin-stat-card ${variantClass}`}>
      <div className="schooladmin-stat-icon">{icon}</div>
      <div>
        <div className="schooladmin-stat-title">{title}</div>
        <div className="schooladmin-stat-value">{value}</div>
      </div>
    </div>
  );
}

