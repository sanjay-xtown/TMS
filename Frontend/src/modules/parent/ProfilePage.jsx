import React from 'react';
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
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import BottomNavbar from '../../shared/components/BottomNavbar';

const ProfilePage = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Student Details', icon: User, color: 'bg-blue-50 text-blue-500' },
    { label: 'Notifications', icon: Bell, color: 'bg-orange-50 text-orange-500' },
    { label: 'Privacy & Security', icon: Shield, color: 'bg-green-50 text-green-500' },
    { label: 'Payment History', icon: CreditCard, color: 'bg-purple-50 text-purple-500' },
    { label: 'Help & Support', icon: Heart, color: 'bg-red-50 text-red-500' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-32"
    >
      {/* Top Profile Card */}
<<<<<<< HEAD
      <div className="bg-black pt-16 pb-20 px-8 rounded-b-[50px] relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-28 h-28 bg-white/10 rounded-[35px] p-1 backdrop-blur-md border border-white/20 shadow-2xl">
              <img src="https://i.pravatar.cc/200?img=11" alt="Profile" className="w-full h-full object-cover rounded-[30px]" />
=======
      <div className="pt-8 pb-10 px-8 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
        
        <div className="flex flex-col items-center gap-6 relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="w-24 h-24 bg-card rounded-[32px] p-2 border border-border shadow-sm relative group">
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
            <h2 className="text-foreground text-3xl font-extrabold tracking-tighter leading-none mb-2">{parentInfo?.parentName || 'Ravisankar'}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-foreground/30 text-[10px] font-bold uppercase tracking-[0.2em]">Parent ID: {parentInfo?.id?.substring(0, 8).toUpperCase() || 'P-24082'}</span>
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
            </div>
            <button className="absolute bottom-[-5px] right-[-5px] w-10 h-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-black text-black">
              <User size={18} fill="black" />
            </button>
          </div>

<<<<<<< HEAD
          <div className="text-center">
            <h2 className="text-white text-2xl font-black tracking-tight">Ravisankar</h2>
            <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mt-1">Premium Member</p>
          </div>

          <div className="flex gap-4 w-full mt-4">
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Children</p>
              <p className="text-white font-black">01</p>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Status</p>
              <p className="text-green-500 font-black uppercase text-[10px]">Active</p>
=======
          <div className="flex gap-4 w-full mt-4 max-w-xs">
            <div className="w-full premium-card text-center">
              <p className="text-foreground/30 text-[9px] font-bold uppercase tracking-widest mb-1">Account Status</p>
              <p className="text-primary font-extrabold text-xl leading-none uppercase">Authorized</p>
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-10 space-y-8">
        {/* Contact Info Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
              <Phone size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Number</p>
              <p className="text-black font-bold text-sm">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
              <Mail size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
              <p className="text-black font-bold text-sm">ravi@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <h3 className="text-black font-black text-xl tracking-tight ml-2">Settings & Tools</h3>
          <div className="bg-white rounded-[32px] p-2 shadow-md border border-gray-100 overflow-hidden">
            {menuItems.map((item, idx) => (
              <motion.button
                key={idx}
                whileTap={{ x: 5 }}
<<<<<<< HEAD
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-2xl ${idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
=======
                onClick={() => {
                  if (item.path) {
                    navigate(item.path, { state: item.state });
                  } else {
                    setActiveModal(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between p-4 hover:bg-foreground/5 transition-all rounded-[24px] group`}
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                    <item.icon size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-black font-bold text-sm">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
<<<<<<< HEAD
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(ROUTES.LOGIN)}
          className="w-full py-4 bg-red-50 text-red-500 font-black rounded-[24px] flex items-center justify-center gap-3 border border-red-100"
=======
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full py-5 bg-foreground/5 text-foreground font-extrabold rounded-[28px] flex items-center justify-center gap-3 border border-border transition-all uppercase tracking-[0.2em] text-xs"
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
        >
          <LogOut size={20} />
          LOGOUT SESSION
        </motion.button>
      </div>

<<<<<<< HEAD
      <BottomNavbar activeTab="profile" />
=======
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
              className="modal-surface bg-card rounded-[40px] p-8 w-full max-w-lg relative z-10 shadow-2xl border border-border"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">
                  {activeModal === 'students' ? 'Student Profiles' : 
                   activeModal === 'privacy' ? 'Privacy Vault' : 'Support Center'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-foreground/20">
                  <LogOut size={18} className="rotate-90" />
                </button>
              </div>

              {activeModal === 'students' && (
                <div className="space-y-6">
                  {parentInfo?.children?.map((child, idx) => (
                    <div key={idx} className="flex items-center gap-5 p-5 bg-card rounded-[32px] border border-border">
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
                  <div className="p-5 bg-primary/5 rounded-3xl border border-primary/10 flex items-center gap-4">
                     <ShieldCheck className="text-primary" size={32} />
                     <div>
                       <h4 className="font-black text-primary text-sm uppercase">Encryption Active</h4>
                       <p className="text-[10px] font-bold text-primary/60 uppercase">Your data is secured with AES-256</p>
                     </div>
                  </div>
                  <button className="w-full py-4 bg-foreground/5 rounded-2xl text-[11px] font-black uppercase text-foreground/40 border border-border">Change Password</button>
                  <button className="w-full py-4 bg-foreground/5 rounded-2xl text-[11px] font-black uppercase text-foreground/40 border border-border">Biometric Login</button>
                </div>
              )}

              {activeModal === 'help' && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle size={40} className="text-red-500/60" />
                  </div>
                  <h4 className="font-black text-foreground text-lg uppercase">Need Assistance?</h4>
                  <p className="text-[11px] font-bold text-foreground/40 uppercase leading-relaxed px-8">Our support team is available 24/7 for emergency bus inquiries.</p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button className="p-4 bg-card rounded-2xl border border-border flex flex-col items-center gap-2">
                      <Phone size={20} className="text-primary" />
                      <span className="text-[9px] font-black uppercase text-foreground">Call Support</span>
                    </button>
                    <button className="p-4 bg-card rounded-2xl border border-border flex flex-col items-center gap-2">
                      <Mail size={20} className="text-secondary" />
                      <span className="text-[9px] font-black uppercase text-foreground">Email Us</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
    </motion.div>
  );
};

export default ProfilePage;
