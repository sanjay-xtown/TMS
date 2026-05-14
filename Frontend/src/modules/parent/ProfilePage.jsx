import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  LogOut, 
  Shield, 
  Bell, 
  CreditCard,
  Heart,
  Settings,
  HelpCircle,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { logout } from '../../shared/api/authService';
import api from '../../shared/api/axios';
import { AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../shared/context/LanguageContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [parentInfo, setParentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/parents/profile');
        setParentInfo(response.data.data);
      } catch (err) {
        console.error('Failed to fetch parent profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const [activeModal, setActiveModal] = React.useState(null);

  const menuItems = [
    { id: 'students', label: t('student_details'), icon: User, color: 'text-primary', bg: 'bg-primary/10' },
    { id: 'privacy', label: t('privacy'), icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 'settings', label: t('app_settings'), icon: Settings, color: 'text-slate-400', bg: 'bg-slate-400/10', path: ROUTES.SETTINGS, state: { section: 'general' } },
    { id: 'help', label: t('help'), icon: HelpCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Syncing Profile...</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="matte-green-theme min-h-screen pb-32"
    >
      {/* Top Profile Card */}
      <div className="pt-12 pb-16 px-8 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
        
        <div className="flex flex-col items-center gap-6 relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="w-32 h-32 bg-white/40 rounded-[40px] p-2 border border-black/5 shadow-sm relative group">
              <img 
                src={`https://ui-avatars.com/api/?name=${parentInfo?.parentName || 'P'}&background=88B04B&color=fff&size=200`} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-[32px]" 
              />
            </div>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-[-2px] right-[-2px] w-10 h-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-background text-white shadow-lg"
            >
              <Star size={18} fill="white" />
            </motion.button>
          </motion.div>

          <div className="text-center">
            <h2 className="text-foreground text-4xl font-extrabold tracking-tighter leading-none mb-3">{parentInfo?.parentName || 'Ravisankar'}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-foreground/30 text-[10px] font-bold uppercase tracking-[0.2em]">Parent ID: {parentInfo?.id?.substring(0, 8).toUpperCase() || 'P-24082'}</span>
            </div>
          </div>

          <div className="flex gap-4 w-full mt-8 max-w-xs">
            <div className="w-full bg-white/40 rounded-[24px] p-5 border border-black/5 text-center">
              <p className="text-foreground/30 text-[9px] font-bold uppercase tracking-widest mb-1">Account Status</p>
              <p className="text-primary font-extrabold text-xl leading-none uppercase">Authorized</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6 space-y-8 relative z-20">
        {/* Contact Info Card */}
        <motion.div variants={itemVariants} className="premium-card space-y-6">
          <div className="flex items-center gap-5 group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Phone size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-0.5">Mobile Number</p>
              <p className="text-foreground font-extrabold text-sm">{parentInfo?.mobileNumber || '+91 98765 43210'}</p>
            </div>
          </div>
          
          <div className="h-px bg-foreground/5 w-full" />

          <div className="flex items-center gap-5 group">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
              <Mail size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-0.5">Email Address</p>
              <p className="text-foreground font-extrabold text-sm">{parentInfo?.email || 'ravi@xtown.com'}</p>
            </div>
          </div>

          <div className="h-px bg-foreground/5 w-full" />

          <div className="flex items-center gap-5 group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-0.5">Residential Address</p>
              <p className="text-foreground font-extrabold text-sm line-clamp-1">{parentInfo?.address || 'Peelamedu, Coimbatore'}</p>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="space-y-4">
          <h3 className="text-foreground font-black text-lg tracking-tight ml-2">Control Center</h3>
          <motion.div variants={itemVariants} className="premium-card !p-2 space-y-1">
            {menuItems.map((item, idx) => (
              <motion.button
                key={idx}
                whileTap={{ x: 5 }}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path, { state: item.state });
                  } else {
                    setActiveModal(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between p-4 hover:bg-slate-100 transition-all rounded-[24px] group`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                    <item.icon size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-foreground font-bold text-sm group-hover:translate-x-1 transition-transform">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-muted group-hover:text-primary transition-colors" />
              </motion.button>
            ))}
          </motion.div>
        </div>

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full py-5 bg-foreground/5 text-foreground font-extrabold rounded-[28px] flex items-center justify-center gap-3 border border-black/5 transition-all uppercase tracking-[0.2em] text-xs"
        >
          <LogOut size={20}  color='red' />
          {t('logout')}
        </motion.button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8 sm:items-center sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="modal-surface rounded-[40px] p-8 w-full max-w-lg relative z-10 shadow-2xl border border-black/5"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">
                  {activeModal === 'students' ? 'Student Profiles' : 
                   activeModal === 'privacy' ? 'Privacy Vault' : 'Support Center'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center text-foreground/20">
                  <LogOut size={18} className="rotate-90" />
                </button>
              </div>

              {activeModal === 'students' && (
                <div className="space-y-6">
                  {parentInfo?.children?.map((child, idx) => (
                    <div key={idx} className="flex items-center gap-5 p-5 bg-white/40 rounded-[32px] border border-black/5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm">
                        <img 
                          src={child.profilePhoto ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${child.profilePhoto}` : `https://ui-avatars.com/api/?name=${child.studentName}&background=88B04B&color=fff`} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-foreground text-lg leading-tight uppercase">{child.studentName}</h4>
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mt-1">{child.school?.schoolName || 'Main Campus'}</p>
                        <div className="flex items-center gap-3 mt-3">
                           <div className="px-2 py-0.5 bg-primary text-white rounded-[8px] text-[9px] font-bold uppercase">Bus: {child.bus?.busNumber || 'N/A'}</div>
                           <div className="px-2 py-0.5 bg-accent/20 text-foreground/60 rounded-[8px] text-[9px] font-bold uppercase">ID: {child.id.substring(0,6)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'privacy' && (
                <div className="space-y-4">
                  <div className="p-5 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4">
                     <ShieldCheck className="text-green-500" size={32} />
                     <div>
                       <h4 className="font-black text-green-600 text-sm uppercase">Encryption Active</h4>
                       <p className="text-[10px] font-bold text-green-700/60 uppercase">Your data is secured with AES-256</p>
                     </div>
                  </div>
                  <button className="w-full py-4 bg-slate-50 rounded-2xl text-[11px] font-black uppercase text-slate-500 border border-slate-100">Change Password</button>
                  <button className="w-full py-4 bg-slate-50 rounded-2xl text-[11px] font-black uppercase text-slate-500 border border-slate-100">Biometric Login</button>
                </div>
              )}

              {activeModal === 'help' && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle size={40} className="text-red-400" />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg uppercase">Need Assistance?</h4>
                  <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed px-8">Our support team is available 24/7 for emergency bus inquiries.</p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
                      <Phone size={20} className="text-primary" />
                      <span className="text-[9px] font-black uppercase">Call Support</span>
                    </button>
                    <button className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
                      <Mail size={20} className="text-secondary" />
                      <span className="text-[9px] font-black uppercase">Email Us</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfilePage;
