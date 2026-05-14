
import { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  School,
  Users,
  BarChart3,
  Plus,
  X,
  Mail,
  User,
  MapPin,
  Phone,
  Lock,
} from "lucide-react";

export default function SuperAdminDashboard() {
  const [openSchool, setOpenSchool] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openQuick, setOpenQuick] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // API States
  const [schools, setSchools] = useState([]);
<<<<<<< HEAD
  const [stats, setStats] = useState({ totalSchools: 0, totalBuses: 0, totalStudents: 0, totalAdmins: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // School Form State
  const [schoolForm, setSchoolForm] = useState({
    schoolName: "",
    principalName: "",
    email: "",
    phone: "",
    address: "",
=======
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    busFleet: 0,
    activeAdmins: 0,
    fleetHealth: [
      { label: 'Active', val: '0%', color: 'text-primary', percentage: 0 },
      { label: 'Standby', val: '0%', color: 'text-blue-400', percentage: 0 },
      { label: 'Alerts', val: '0%', color: 'text-error', percentage: 0 },
      { label: 'Offline', val: '0%', color: 'text-slate-500', percentage: 0 }
    ]
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
  });

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/api/superadmin";

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, schoolsRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard-stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/schools`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (schoolsRes.data.success) setSchools(schoolsRes.data.data);
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSchoolSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/schools`, schoolForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setOpenSchool(false);
        setSchoolForm({ schoolName: "", principalName: "", email: "", phone: "", address: "" });
        fetchDashboardData();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add school");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-[22%] bg-[#0B1220] border-r border-white/10 p-6 flex flex-col justify-between">

        <div>
          <h1 className="text-2xl font-bold mb-10">
            Track<span className="text-purple-500">Pro</span>
          </h1>

          <nav className="space-y-6 text-sm">

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <LayoutDashboard size={18} />
              Dashboard
            </div>

            <div
              onClick={() => setOpenSchool(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer"
            >
              <School size={18} />
              Add School
            </div>

            <div
              onClick={() => setOpenAdmin(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer"
            >
              <Users size={18} />
              Add School Admin
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5">
              <BarChart3 size={18} />
              Analytics
            </div>

          </nav>
        </div>
<<<<<<< HEAD

        {/* ================= QUICK CREATE BUTTON ================= */}
        <button
          onClick={() => setOpenQuick(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 py-3 rounded-xl font-medium"
        >
          <Plus size={18} />
          Quick Create
        </button>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8">

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-semibold">Super Admin Dashboard</h2>

          <input
            placeholder="Search..."
            className="bg-[#111827] border border-white/10 px-4 py-2 rounded-xl text-sm outline-none"
          />
=======
        <div className="flex items-center gap-4">
          <button className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-foreground/40 hover:text-primary hover:scale-105 transition-all">
            <Bell size={24} />
          </button>
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
        </div>

<<<<<<< HEAD
        {error && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">{error}</div>}
=======
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Institutions" value={loading ? '...' : stats.totalSchools} icon={SchoolIcon} trend="+4.5" color="bg-primary" subText="Units" />
        <StatCard title="Platform Admins" value={loading ? '...' : stats.activeAdmins} icon={Users} trend="+0.8" color="bg-blue-500" subText="Active" />
        <StatCard title="Student Population" value={loading ? '...' : stats.totalStudents} icon={ShieldCheck} trend="+12.4" color="bg-purple-500" subText="Total" />
        <StatCard title="Buses" value={loading ? '...' : stats.busFleet} icon={Bus} trend="+2.4" color="bg-amber-500" subText="Vehicles" />
      </div>
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)

        <div className="grid grid-cols-4 gap-6">

          {[
            ["Total Schools", stats.totalSchools || 0],
            ["Admins", stats.totalAdmins || 0],
            ["Buses", stats.totalBuses || 0],
            ["Drivers", stats.totalDrivers || 0],
          ].map(([title, value]) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <p className="text-gray-400 text-sm">{title}</p>
              <h1 className="text-3xl font-bold mt-2">{value}</h1>
            </div>
          ))}

        </div>

      </main>

      {/* ================= QUICK CREATE MODAL ================= */}
      {openQuick && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="w-[400px] bg-white/5 border border-white/10 p-6 rounded-2xl relative">

            <button
              onClick={() => setOpenQuick(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-6">Quick Create</h2>

            <div className="space-y-4">

              <button
                onClick={() => {
                  setOpenQuick(false);
                  setOpenSchool(true);
                }}
                className="w-full bg-purple-600 py-2 rounded-xl hover:bg-purple-700"
              >
                + Add School
              </button>

              <button
                onClick={() => {
                  setOpenQuick(false);
                  setOpenAdmin(true);
                }}
                className="w-full bg-indigo-600 py-2 rounded-xl hover:bg-indigo-700"
              >
                + Add Admin
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= ADD SCHOOL MODAL ================= */}
      {openSchool && (
        <Modal title="Add School" onClose={() => setOpenSchool(false)}>
          <Input 
            icon={<School size={16} />} 
            label="School Name" 
            value={schoolForm.schoolName}
            onChange={(e) => setSchoolForm({ ...schoolForm, schoolName: e.target.value })}
          />
          <Input 
            icon={<User size={16} />} 
            label="Principal Name" 
            value={schoolForm.principalName}
            onChange={(e) => setSchoolForm({ ...schoolForm, principalName: e.target.value })}
          />
          <Input 
            icon={<Mail size={16} />} 
            label="Email" 
            value={schoolForm.email}
            onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
          />
          <Input 
            icon={<Phone size={16} />} 
            label="Contact Number" 
            value={schoolForm.phone}
            onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
          />
          <Input 
            icon={<MapPin size={16} />} 
            label="Address" 
            value={schoolForm.address}
            onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
          />
          <Button onClick={handleSchoolSubmit} loading={loading} />
        </Modal>
      )}

      {/* ================= ADD ADMIN MODAL ================= */}
      {openAdmin && (
        <Modal title="Add School Admin" onClose={() => setOpenAdmin(false)}>

          <div className="grid grid-cols-2 gap-4">

            <Input icon={<User size={16} />} label="Admin Name" />
            <Input icon={<Mail size={16} />} label="Email" />
            <Input icon={<School size={16} />} label="School Name" />
            <Input icon={<MapPin size={16} />} label="Location" />
            <Input icon={<Phone size={16} />} label="Phone Number" />

            <div className="col-span-2">
              <p className="text-sm text-gray-400 mb-1">Password</p>

              <div className="relative">

                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Lock size={16} />
                </div>

<<<<<<< HEAD
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-[#111827] border border-white/10 pl-10 pr-16 py-2 rounded-xl outline-none"
                  placeholder="Set password"
                />

                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-xs text-gray-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

=======
        {/* Platform Growth */}
        <Card className="lg:col-span-4 p-10 space-y-10 bg-white border-none shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-all duration-1000" />
          
          <div className="relative z-10 space-y-1">
            <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">App Growth</h3>
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp size={14} />
              <p className="text-[10px] font-black uppercase tracking-widest">+12.4% New Users</p>
            </div>
          </div>

          {/* Smooth Growth Chart (Simulated Area Chart) */}
          <div className="relative z-10 h-40 flex items-end justify-between px-2 pt-10">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <motion.path
                 initial={{ pathLength: 0, opacity: 0 }}
                 animate={{ pathLength: 1, opacity: 1 }}
                 transition={{ duration: 2, ease: "easeInOut" }}
                 d="M0,80 Q10,75 20,60 T40,40 T60,50 T80,20 T100,10 L100,100 L0,100 Z"
                 fill="url(#growthGradient)"
                 className="opacity-20"
               />
               <motion.path
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 2, ease: "easeInOut" }}
                 d="M0,80 Q10,75 20,60 T40,40 T60,50 T80,20 T100,10"
                 fill="none"
                 stroke="#88B04B"
                 strokeWidth="3"
                 strokeLinecap="round"
               />
               <defs>
                 <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#88B04B" />
                   <stop offset="100%" stopColor="transparent" />
                 </linearGradient>
               </defs>
            </svg>
            <div className="w-full flex justify-between absolute bottom-0 left-0 right-0 px-4 mb-[-24px]">
               {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map(m => (
                 <span key={m} className="text-[8px] font-black uppercase text-foreground/20">{m}</span>
               ))}
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-8 pt-8">
             <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30">New Units</p>
                <div className="flex items-baseline gap-2">
                   <h4 className="text-3xl font-black text-foreground">14</h4>
                   <span className="text-[9px] font-bold text-success">+2</span>
                </div>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30">Target Reach</p>
                <div className="flex items-baseline gap-2">
                   <h4 className="text-3xl font-black text-foreground">85%</h4>
                   <span className="text-[9px] font-bold text-success">Optimal</span>
                </div>
             </div>
          </div>

          <div className="relative z-10 space-y-6 pt-2">
            {[
              { label: 'Security Compliance', val: '99.8%', icon: ShieldCheck, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'API Availability', val: '99.9%', icon: Server, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Incident Response', val: '4m 12s', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            ].map((node, i) => (
              <div key={i} className="flex items-center justify-between group/item">
                <div className="flex items-center gap-4">
                   <div className={`p-3 rounded-2xl ${node.bg} ${node.color} group-hover/item:scale-110 transition-all`}>
                     <node.icon size={18} />
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">{node.label}</span>
                </div>
                <span className="text-base font-black text-foreground">{node.val}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 pt-4">
             <Button className="w-full !h-16 !rounded-2xl !bg-white !text-slate-900 !text-xs !font-black !uppercase tracking-widest hover:!scale-105 transition-all">
                System Logs
                <ArrowUpRight size={18} />
             </Button>
          </div>
        </Card>
      </div>

      {/* Advanced Registry Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <Card className="lg:col-span-9 p-10 space-y-10 bg-white border-none shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Recent Deployments</h3>
                <p className="text-[11px] font-bold text-foreground/30 uppercase tracking-[0.2em] mt-1">Live institutional registry updates</p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={14} />
                    <input type="text" placeholder="Search registry..." className="w-full h-12 bg-slate-50 rounded-xl pl-12 pr-4 text-[10px] font-black uppercase outline-none focus:ring-1 ring-primary/20 transition-all" />
                 </div>
                 <Button variant="secondary" className="!h-12 !w-12 !p-0 !rounded-xl">
                    <Download size={18} />
                 </Button>
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
              </div>
            </div>

          </div>

          <Button />
        </Modal>
      )}

    </div>
  );
}

/* ================= MODAL ================= */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-[520px] bg-[#0B1220] border border-white/10 rounded-2xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        <div className="space-y-4">{children}</div>

<<<<<<< HEAD
=======
         {/* Quick Command Grid */}
         <div className="lg:col-span-3 flex flex-col gap-8">
            <h3 className="text-xl font-black uppercase tracking-tight text-foreground px-2">Quick Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
               {[
                 { label: 'Register Unit', icon: PlusCircle, path: ROUTES.SCHOOL_MANAGEMENT, color: 'bg-primary' },
                 { label: 'System Settings', icon: Settings, path: ROUTES.PLATFORM_SETTINGS, color: 'bg-slate-600' },
                 { label: 'Global Reports', icon: Download, path: ROUTES.REPORTS_ANALYTICS, color: 'bg-blue-600' },
               ].map((action, i) => (
                 <button 
                   key={i}
                   onClick={() => action.path !== '#' && navigate(action.path)}
                   className="p-6 bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex flex-col items-center justify-center text-center gap-4 group border-none"
                 >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${action.color} group-hover:rotate-12 transition-all`}>
                      <action.icon size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 group-hover:text-foreground transition-colors">{action.label}</span>
                 </button>
               ))}
            </div>
         </div>
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
      </div>
    </div>
  );
}

/* ================= INPUT ================= */
function Input({ label, icon, value, onChange, type = "text" }) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <div className="relative">
        <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>
        <input 
          type={type}
          value={value}
          onChange={onChange}
          className="w-full bg-[#111827] border border-white/10 pl-10 px-4 py-2 rounded-xl outline-none focus:border-purple-500/50 transition-colors" 
        />
      </div>
    </div>
  );
}

/* ================= BUTTON ================= */
function Button({ onClick, loading }) {
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className={`w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 py-2 rounded-xl font-medium transition-opacity ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
    >
      {loading ? "Processing..." : "Submit"}
    </button>
  );
}