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
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
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
    <div className="min-h-screen bg-[#0F1115] text-white flex">

      {/* SIDEBAR */}
      <aside className="w-[22%] bg-[#161B22] border-r border-white/10 p-6 flex flex-col justify-between">

        <div>
          <h1 className="text-2xl font-bold mb-8">
            School<span className="text-purple-500">Admin</span>
          </h1>

          <div className="space-y-2">
            <NavItem 
              active={view === "dashboard"} 
              onClick={() => setView("dashboard")} 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
            />
            <NavItem 
              active={view === "buses"} 
              onClick={() => setView("buses")} 
              icon={<Bus size={18} />} 
              label="Bus Fleet" 
            />
            <NavItem 
              active={view === "drivers"} 
              onClick={() => setView("drivers")} 
              icon={<UserCheck size={18} />} 
              label="Drivers" 
            />
            <NavItem 
              active={view === "routes"} 
              onClick={() => setView("routes")} 
              icon={<RouteIcon size={18} />} 
              label="Routes" 
            />
            <NavItem 
              active={view === "students"} 
              onClick={() => setView("students")} 
              icon={<Users size={18} />} 
              label="Students" 
            />
            <NavItem 
              active={view === "live"} 
              onClick={() => setView("live")} 
              icon={<MapPin size={18} />} 
              label="Live Tracking" 
            />
          </div>
        </div>

        <button 
          onClick={() => { localStorage.clear(); window.location.href = "/schooladmin/login"; }}
          className="text-gray-400 hover:text-white text-sm"
        >
          Sign Out
        </button>

      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div>
            <h1 className="text-2xl font-semibold mb-8">School Overview</h1>
            <div className="grid grid-cols-4 gap-6">
              <StatCard icon={<Bus className="text-blue-400" />} title="Total Buses" value={stats.totalBuses} />
              <StatCard icon={<Users className="text-green-400" />} title="Total Students" value={stats.totalStudents} />
              <StatCard icon={<UserCheck className="text-purple-400" />} title="Drivers" value={stats.totalDrivers} />
              <StatCard icon={<RouteIcon className="text-orange-400" />} title="Routes" value={stats.totalRoutes} />
            </div>

            <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-3xl">
               <h3 className="text-lg font-medium mb-4">Welcome back, Admin</h3>
               <p className="text-gray-400">Manage your school's transportation system efficiently. Track live locations, manage drivers, and optimize routes from one place.</p>
            </div>
          </div>
        )}

        {/* LIST VIEWS (Buses, Drivers, Routes, Students) */}
        {(view === "buses" || view === "drivers" || view === "routes" || view === "students") && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold capitalize">{view} Management</h1>
              {view !== "students" && (
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl transition text-sm">
                  <Plus size={16} /> Add New
                </button>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 text-sm">
                  <tr>
                    <th className="p-4">Name / ID</th>
                    <th className="p-4">Details</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {loading ? (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading data...</td></tr>
                  ) : data.length > 0 ? data.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition">
                      <td className="p-4">
                        <div className="font-medium text-white">{item.busNumber || item.driverName || item.routeName || item.studentName}</div>
                        <div className="text-xs text-gray-500">{item.id.slice(0, 8)}...</div>
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {item.capacity ? `Capacity: ${item.capacity}` : item.phone || item.startLocation || item.grade}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-xs font-medium">Active</span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition text-blue-400"><Edit size={16} /></button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition text-red-400"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-500">No records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LIVE TRACKING PLACEHOLDER */}
        {view === "live" && (
          <div>
            <h1 className="text-2xl font-semibold mb-8">Real-time Tracking</h1>
            <div className="w-full h-[600px] bg-[#161B22] border border-white/10 rounded-3xl flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.google.com/maps/about/images/mymaps/mymaps-desktop-16x9.png')] bg-cover"></div>
               <div className="z-10 text-center">
                  <MapPin size={48} className="text-purple-500 mx-auto mb-4 animate-bounce" />
                  <p className="text-lg font-medium">Tracking System Ready</p>
                  <p className="text-gray-500 text-sm mt-2">Connecting to live GPS fleet data...</p>
               </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
        active
          ? "bg-purple-600/10 text-purple-400 border-l-4 border-purple-500"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-purple-500/30 transition-all group">
      <div className="bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-gray-400 text-xs uppercase tracking-wider">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function Input({ label, icon, value, onChange }) {
  return (
    <div className="mb-4">
      <p className="text-xs text-gray-400 mb-2 ml-1">{label}</p>
      <div className="relative">
        <div className="absolute left-3 top-2.5 text-gray-500">{icon}</div>
        <input 
          value={value}
          onChange={onChange}
          className="w-full bg-[#111827] border border-white/10 pl-10 p-2.5 rounded-xl outline-none focus:border-purple-500/50 transition-colors" 
        />
      </div>
    </div>
  );
}