import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        const role = res.data.user.role;
        if (role === 'superadmin') {
          navigate('/superadmin/dashboard');
        } else if (role === 'schooladmin') {
          navigate('/schooladmin/dashboard');
        } else {
          // Default fallback (e.g. parent)
          navigate(ROUTES.DASHBOARD);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white flex flex-col"
    >
      {/* Top Header Section - Curved Black */}
      <div className="bg-black h-[40vh] relative flex flex-col items-center justify-center rounded-b-[40px] shadow-2xl overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="z-10 flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 bg-primary rounded-[24px] flex items-center justify-center">
            <Bus size={40} color="black" />
          </div>
          <div className="text-center">
            <h1 className="text-white text-2xl font-bold tracking-tight">Portal Login</h1>
            <p className="text-gray-400 text-sm mt-1">Access your tracking dashboard</p>
          </div>
        </motion.div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 px-8 pt-10 pb-6 flex flex-col">
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl text-center font-bold">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Mail size={20} />
              </div>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-gray-50 border-none rounded-[16px] py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-gray-50 border-none rounded-[16px] py-4 pl-12 pr-12 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { setEmail('admin@gmail.com'); setPassword('admin'); }}
              type="button"
              className="text-[10px] font-black text-primary bg-black px-4 py-2 rounded-full tracking-widest"
            >
              QUICK ADMIN
            </motion.button>
            <button type="button" className="text-xs font-bold text-gray-500 hover:text-primary transition-colors">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-black py-4 rounded-[16px] flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(250,204,21,0.2)] disabled:opacity-70"
          >
            {loading ? "AUTHENTICATING..." : "LOGIN NOW"}
            {!loading && <ArrowRight size={20} />}
          </motion.button>
        </form>

        {/* Social Login Divider */}
        <div className="mt-10 mb-8 flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gray-100" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or continue with</span>
          <div className="flex-1 h-[1px] bg-gray-100" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-[14px] text-xs font-bold hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-[14px] text-xs font-bold hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/303108/apple-black-logo.svg" className="w-5 h-5" alt="Apple" />
            Apple ID
          </button>
        </div>

        <div className="mt-auto pt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account? 
            <button className="ml-1 font-bold text-black hover:text-primary underline transition-colors">
              Request Access
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
