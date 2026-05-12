import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Moon, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Smartphone,
  ChevronRight,
  Info,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const SettingsPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Preferences',
      items: [
        { label: 'Dark Mode', icon: Moon, value: 'Auto', color: 'text-purple-500' },
        { label: 'Language', icon: Globe, value: 'English (US)', color: 'text-blue-500' },
        { label: 'Push Notifications', icon: Bell, value: 'Enabled', color: 'text-orange-500' },
      ]
    },
    {
      title: 'Security',
      items: [
        { label: 'Two-Factor Auth', icon: ShieldCheck, value: 'Disabled', color: 'text-green-500' },
        { label: 'App Lock', icon: Smartphone, value: 'Biometric', color: 'text-gray-700' },
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-10"
    >
      {/* Top Bar */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center gap-6 shadow-sm sticky top-0 z-30">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-gray-100 rounded-2xl text-black"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-black text-2xl font-black tracking-tight">Settings</h2>
      </div>

      <div className="p-6 space-y-10">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] ml-2">
              {section.title}
            </h3>
            <div className="bg-white rounded-[32px] p-2 shadow-sm border border-gray-100 overflow-hidden">
              {section.items.map((item, iIdx) => (
                <button
                  key={iIdx}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-2xl ${iIdx !== section.items.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-gray-50 ${item.color} rounded-xl flex items-center justify-center`}>
                      <item.icon size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-black font-bold text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs font-bold">{item.value}</span>
                    <ChevronRight size={18} className="text-gray-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* About Card */}
        <div className="bg-black rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute right-[-5%] top-[-10%] w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black">
              <Info size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-black text-lg">App Information</h4>
              <p className="text-primary text-[10px] font-black uppercase tracking-widest">Version 1.0.42</p>
            </div>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            School Bus Tracking System is a premium solution for real-time student transit safety.
          </p>
        </div>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(ROUTES.LOGIN)}
          className="w-full py-5 bg-white text-red-500 font-black rounded-[32px] flex items-center justify-center gap-3 border border-red-50 shadow-sm"
        >
          <LogOut size={20} />
          LOGOUT ACCOUNT
        </motion.button>

        <p className="text-center text-gray-300 text-[10px] font-bold uppercase tracking-widest pt-4">
          Developed with ❤️ by X-Town Team
        </p>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
