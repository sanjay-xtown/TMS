import { useState } from "react";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SchoolAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/schooladmin/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("schooladmin_token", res.data.token);
        localStorage.setItem("schoolId", res.data.admin.schoolId);
        navigate("/schooladmin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-[#0B1220] border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            School<span className="text-purple-500">Admin</span>
          </h1>
          <p className="text-gray-400 text-sm">Portal Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm text-gray-400 block mb-2 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-3 text-gray-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.com"
                className="w-full bg-[#111827] border border-white/10 pl-12 pr-4 py-3 rounded-xl text-white outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2 ml-1">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-3 text-gray-500">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111827] border border-white/10 pl-12 pr-12 py-3 rounded-xl text-white outline-none focus:border-purple-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-500 uppercase tracking-widest font-medium">
          School Administration Portal
        </p>
      </div>
    </div>
  );
}
