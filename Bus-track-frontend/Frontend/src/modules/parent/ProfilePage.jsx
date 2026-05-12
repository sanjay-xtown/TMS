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
      <div className="bg-black pt-16 pb-20 px-8 rounded-b-[50px] relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-28 h-28 bg-white/10 rounded-[35px] p-1 backdrop-blur-md border border-white/20 shadow-2xl">
              <img src="https://i.pravatar.cc/200?img=11" alt="Profile" className="w-full h-full object-cover rounded-[30px]" />
            </div>
            <button className="absolute bottom-[-5px] right-[-5px] w-10 h-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-black text-black">
              <User size={18} fill="black" />
            </button>
          </div>

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
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-2xl ${idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
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
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(ROUTES.LOGIN)}
          className="w-full py-4 bg-red-50 text-red-500 font-black rounded-[24px] flex items-center justify-center gap-3 border border-red-100"
        >
          <LogOut size={20} />
          LOGOUT SESSION
        </motion.button>
      </div>

      <BottomNavbar activeTab="profile" />
    </motion.div>
  );
};

export default ProfilePage;
