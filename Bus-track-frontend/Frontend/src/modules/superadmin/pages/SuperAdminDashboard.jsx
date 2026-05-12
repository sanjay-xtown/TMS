
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
        </div>

        {error && <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">{error}</div>}

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