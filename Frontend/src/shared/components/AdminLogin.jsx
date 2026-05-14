import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Building,
  Globe
} from 'lucide-react';
import { Card, Button, Input } from './ui';
import { ROUTES } from '../../config/routes';
import api from '../api';

const AdminLogin = ({ type = 'SuperAdmin' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const isSuper = type === 'SuperAdmin';
  // Use the Matte Green system theme color
  const accentColor = '#88B04B'; 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      const { token, admin } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(admin));

      if (admin.role === 'superadmin') {
        navigate(ROUTES.SUPERADMIN_DASHBOARD);
      } else {
        navigate(ROUTES.SCHOOLADMIN_DASHBOARD);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Authentication Failed: Invalid credentials or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0C10] flex items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-700">
      <style>{`
        @keyframes aurora {
          0% { transform: translate(-10%, -10%) rotate(0deg) scale(1); }
          50% { transform: translate(10%, 10%) rotate(180deg) scale(1.2); }
          100% { transform: translate(-10%, -10%) rotate(360deg) scale(1); }
        }
        .aurora-blob {
          position: absolute;
          filter: blur(140px);
          opacity: 0.15;
          animation: aurora 30s infinite linear;
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }
      `}</style>

      {/* Modern Aurora Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Large Moving Blobs */}
        <div className="aurora-blob w-[1000px] h-[1000px] bg-[#88B04B] -top-[30%] -left-[20%] dark:opacity-20" />
        <div className="aurora-blob w-[800px] h-[800px] bg-slate-400 -bottom-[20%] -right-[10%] opacity-10 dark:opacity-10" style={{ animationDelay: '-10s', animationDirection: 'reverse' }} />
        <div className="aurora-blob w-[600px] h-[600px] bg-[#88B04B] top-[20%] right-[10%] opacity-5 dark:opacity-10" style={{ animationDelay: '-20s' }} />
        
        {/* Grain Texture Overdrive */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        
        {/* Soft Vignette */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 dark:to-black/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white/80 dark:bg-[#161B22]/90 backdrop-blur-3xl border border-white dark:border-white/5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] rounded-[3.5rem] p-10 md:p-14 relative overflow-hidden transition-all duration-700">
          
          <div className="flex flex-col items-center text-center gap-8 mb-12">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-20 h-20 rounded-[1.8rem] flex items-center justify-center shadow-lg relative overflow-hidden group/logo"
              style={{ backgroundColor: accentColor }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/logo:opacity-100 transition-opacity" />
              {isSuper ? <Globe size={38} className="text-white relative z-10" /> : <Building size={38} className="text-white relative z-10" />}
            </motion.div>
            
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-[#1A202C] dark:text-white uppercase leading-none">
                {type.replace(' ', '')} <span className="text-[#A0AEC0] dark:text-white/30 font-medium italic lowercase">access</span>
              </h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#CBD5E0] dark:text-white/20">XTOWN INFRASTRUCTURE SECURED</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#A0AEC0] dark:text-white/30 ml-2">Identity ID</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#CBD5E0] dark:text-white/10 group-focus-within:text-[#4A5568] dark:group-focus-within:text-white transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="admin@enterprise.io"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F0F4E8] dark:bg-white/[0.03] border-none rounded-2xl pl-16 pr-6 py-4.5 text-sm font-bold text-[#2D3748] dark:text-white outline-none focus:ring-2 ring-[#88B04B]/20 transition-all placeholder:text-[#A0AEC0] dark:placeholder:text-white/5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#A0AEC0] dark:text-white/30 ml-2">Secure Cipher</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#CBD5E0] dark:text-white/10 group-focus-within:text-[#4A5568] dark:group-focus-within:text-white transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[#F0F4E8] dark:bg-white/[0.03] border-none rounded-2xl pl-16 pr-14 py-4.5 text-sm font-bold text-[#2D3748] dark:text-white outline-none focus:ring-2 ring-[#88B04B]/20 transition-all placeholder:text-[#A0AEC0] dark:placeholder:text-white/5"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[#CBD5E0] dark:text-white/10 hover:text-[#4A5568] dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-lg border-2 border-[#E2E8F0] dark:border-white/5 flex items-center justify-center group-hover:border-[#CBD5E0] transition-all">
                  <div className="w-2.5 h-2.5 rounded-[3px] bg-[#88B04B] scale-0 group-hover:scale-100 transition-transform" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#CBD5E0] dark:text-white/20 transition-colors">Trust Node</span>
              </label>
              <button type="button" className="text-[9px] font-bold uppercase tracking-widest text-[#CBD5E0] dark:text-white/20 hover:text-[#4A5568] dark:hover:text-white transition-colors">Recovery?</button>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-18 !rounded-3xl !text-[11px] !font-black !uppercase !tracking-[0.3em] shadow-xl shadow-[#88B04B]/20 active:scale-[0.98] transition-all group/btn"
              style={{ backgroundColor: accentColor }}
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Verify Identity
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-12 flex items-center justify-center gap-3 text-[#E2E8F0] dark:text-white/5">
            <ShieldCheck size={16} />
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">End-to-End Enterprise Encryption</span>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[9px] font-bold text-[#CBD5E0] dark:text-white/10 uppercase tracking-[0.2em]">
           &copy; 2026 XTOWN • Transit Management System
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
