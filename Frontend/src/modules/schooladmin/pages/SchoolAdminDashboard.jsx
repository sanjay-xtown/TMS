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
<<<<<<< HEAD
    <div className="schooladmin-page">
      {/* SIDEBAR */}
      <aside className="schooladmin-sidebar">
        <div className="schooladmin-sidebar-brand">
          <div className="schooladmin-sidebar-logo">🚍</div>
          <div className="schooladmin-sidebar-title">
            School<span className="schooladmin-sidebar-title-accent">Admin</span>
          </div>
=======
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">School Bus Dashboard</h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">{user?.name || 'School Admin'} • Admin Control</p>
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
        </div>

        <div className="schooladmin-sidebar-menu">
          <NavItem active={view === "dashboard"} onClick={() => setView("dashboard")} icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem active={view === "buses"} onClick={() => setView("buses")} icon={<Bus size={18} />} label="Bus Fleet" />
          <NavItem active={view === "drivers"} onClick={() => setView("drivers")} icon={<UserCheck size={18} />} label="Drivers" />
          <NavItem active={view === "routes"} onClick={() => setView("routes")} icon={<RouteIcon size={18} />} label="Routes" />
          <NavItem active={view === "students"} onClick={() => setView("students")} icon={<Users size={18} />} label="Students" />
          <NavItem active={view === "live"} onClick={() => setView("live")} icon={<MapPin size={18} />} label="Live Tracking" />
        </div>

<<<<<<< HEAD
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
=======
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: loading ? '...' : stats.totalStudents, icon: Users, color: 'text-blue-500' },
          { label: 'Total Buses', value: loading ? '...' : stats.busFleet, icon: Bus, color: 'text-primary' },
          { label: 'Buses on Road', value: loading ? '...' : stats.activeTrips, icon: Navigation, color: 'text-purple-500' },
          { label: 'New Alerts', value: '0', icon: AlertTriangle, color: 'text-success' },
        ].map((stat, i) => (
          <Card key={i} className="p-6 relative group cursor-pointer hover:border-primary/20 transition-all">
             <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded-xl bg-foreground/[0.03] ${stat.color}`}>
                 <stat.icon size={24} />
               </div>
               <Badge variant="outline">Live</Badge>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">{stat.label}</p>
             <h4 className="text-2xl font-black">{stat.value}</h4>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Map Preview Placeholder */}
        <Card className="!p-0 h-[500px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-foreground/5 animate-pulse" />
          {/* Mock Map UI */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <MapPin size={40} className="text-primary animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest">Live Bus Tracking</p>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-2">8 Buses currently on active routes</p>
              </div>
              <Button onClick={() => window.location.href='/schooladmin/tracking'} className="!rounded-xl h-12 !px-8">View Live Map</Button>
            </div>
          </div>
          <div className="absolute top-6 left-6 z-10 glass p-4 rounded-2xl border border-border">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-success rounded-full pulse-live" />
                <span className="text-[10px] font-black uppercase tracking-widest">All Systems Normal</span>
             </div>
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
          </div>
        )}

<<<<<<< HEAD
        {/* BOTTOM WIDGET: LIVE BUS TRACKING SECTION */}
        <div className="schooladmin-live-section">
          <BusMapWidget />
=======
        {/* Recent Notifications & Alerts */}
        <div className="space-y-6">
          <Card className="p-8 space-y-6">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-black uppercase tracking-tight">Recent Alerts</h3>
               <button className="text-primary text-[10px] font-black uppercase tracking-widest">Mark All Read</button>
            </div>
            <div className="space-y-4">
               {[
                 { title: 'Bus T-08 Delay', desc: 'Heavy traffic at Race Course junction. Delayed by 15 mins.', time: '5m ago', color: 'bg-warning' },
                 { title: 'Bus Change', desc: 'Student transfer from T-02 to T-15 completed.', time: '12m ago', color: 'bg-primary' },
                 { title: 'Emergency Alert', desc: 'No active emergencies recorded.', time: 'Stable', color: 'bg-success' },
               ].map((alert, i) => (
                 <div key={i} className="flex gap-4 p-4 rounded-2xl bg-foreground/[0.03] border border-border group hover:bg-foreground/[0.05] transition-all">
                    <div className={`w-1.5 rounded-full ${alert.color}`} />
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-black uppercase tracking-tight">{alert.title}</p>
                          <span className="text-[9px] font-bold text-foreground/30 uppercase">{alert.time}</span>
                       </div>
                       <p className="text-[11px] font-bold text-foreground/60 leading-relaxed uppercase">{alert.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </Card>

          <Card className="p-8 bg-primary text-white overflow-hidden relative group cursor-pointer">
             <div className="absolute right-[-10%] bottom-[-10%] opacity-10 rotate-12 transition-transform duration-700 group-hover:scale-110">
                <Navigation size={200} />
             </div>
             <div className="relative z-10 space-y-6">
                <div>
                   <h4 className="text-2xl font-black uppercase tracking-tighter">Emergency Alert</h4>
                   <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mt-2">Send instant alerts to parents and drivers</p>
                </div>
                <Button variant="secondary" className="!bg-white !text-primary !rounded-xl !px-10 h-14">
                   Send Alert
                   <ArrowRight size={18} />
                </Button>
             </div>
          </Card>
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
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

