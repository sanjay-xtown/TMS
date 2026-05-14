import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, Smartphone, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Fingerprint } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { parentLogin } from '../../shared/api/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await parentLogin(mobileNumber, password);
      
      // Integrate Firebase Notification Request
      try {
        const { requestNotificationPermission, syncFcmTokenWithBackend } = await import('../../firebase/getToken');
        const token = await requestNotificationPermission();
        if (token) {
          await syncFcmTokenWithBackend(token);
        }
      } catch (fcmError) {
        console.error('[FCM] Setup failed during login:', fcmError.message);
      }

      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="matte-green-theme min-h-screen w-screen flex flex-col items-center justify-center p-4 sm:p-6 font-['Outfit'] relative overflow-x-hidden bg-[#0A1A12]"
    >
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          <img 
            src="/premium_bus_login_bg_1778661407910.png" 
            alt="" 
            className="w-full h-full object-cover opacity-60 brightness-75 grayscale-[0.2]"
          />
        </motion.div>
        
        {/* Advanced Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1A12]/80 via-[#0A1A12]/40 to-[#0A1A12]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A12]/60 via-transparent to-[#0A1A12]/60" />
        
        {/* Dynamic Light Rays */}
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            x: ['-20%', '20%']
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(136,176,75,0.2)_0%,transparent_70%)]"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md flex flex-col justify-center items-center py-4">
        
        {/* Floating Logo Badge */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 sm:mb-10 flex flex-col items-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-3xl rounded-2xl sm:rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/20 mb-4 sm:mb-6 group relative overflow-hidden">
              <Bus size={32} className="text-primary sm:w-10 sm:h-10 relative z-10 drop-shadow-[0_0_15px_rgba(136,176,75,0.5)]" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.6em] text-white/60 text-center">X-TOWN</h2>
            <div className="h-[2px] w-6 sm:w-8 bg-primary rounded-full" />
          </div>
        </motion.div>

        {/* Premium Login Card */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-[#12221A]/60 backdrop-blur-[30px] rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/10 p-6 sm:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative"
        >
          {/* Welcome Text */}
          <div className="mb-6 sm:mb-10 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-3">Parent's Login</h1>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl"
            >
              <p className="text-red-400 text-[10px] font-black uppercase text-center tracking-wider">{error}</p>
            </motion.div>
          )}

          {/* Form Section */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-2 block">Identity (Mobile)</label>
              <div className="relative group">
                <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors">
                  <Smartphone size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input 
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl pl-14 sm:pl-16 pr-6 py-4 sm:py-5 text-sm font-bold text-white placeholder:text-white/10 focus:bg-white focus:text-foreground focus:border-primary/40 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-2 block">Password</label>
              <div className="relative group">
                <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors">
                  <Lock size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl pl-14 sm:pl-16 pr-12 sm:pr-14 py-4 sm:py-5 text-sm font-bold text-white placeholder:text-white/10 focus:bg-white focus:text-foreground focus:border-primary/40 transition-all outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-black py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 sm:gap-4 text-xs uppercase tracking-[0.2em] mt-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">Login</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Card Footer Actions - Simplified */}
          <div className="mt-8 flex justify-center items-center px-4">
            <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em]">Authorized Access Only</p>
          </div>
        </motion.div>

        {/* Security Info Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 sm:mt-12 flex flex-col items-center gap-4 sm:gap-6"
        >
          
          <div className="flex gap-6 sm:gap-8">
            <button className="text-[9px] sm:text-[10px] font-black text-white/20 uppercase hover:text-white transition-colors tracking-widest">Support</button>
            <button className="text-[9px] sm:text-[10px] font-black text-white/20 uppercase hover:text-white transition-colors tracking-widest">Terms</button>
            <button className="text-[9px] sm:text-[10px] font-black text-white/20 uppercase hover:text-white transition-colors tracking-widest">Privacy</button>
          </div>
        </motion.div>
      </div>

      {/* Cinematic Frame Accents - Hidden on small mobile */}
      <div className="hidden sm:block absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0A1A12] to-transparent z-20 pointer-events-none" />
      <div className="hidden sm:block absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0A1A12] to-transparent z-20 pointer-events-none" />
    </motion.div>
  );
};

export default LoginPage;
