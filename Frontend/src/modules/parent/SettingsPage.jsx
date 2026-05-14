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
<<<<<<< HEAD
=======
import { logout } from '../../shared/api/authService';
import { useLanguage } from '../../shared/context/LanguageContext';
import { useTheme } from '../../shared/context/ThemeContext';
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)

const SettingsPage = () => {
  const navigate = useNavigate();

<<<<<<< HEAD
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
=======
  const [notificationToggles, setNotificationToggles] = useState({
    busArrival: true,
    studentBoarded: true,
    emergency: true,
    appUpdates: false
  });

  const { language, setLanguage } = useLanguage();

  const { isDarkMode, toggleTheme } = useTheme();
  
  const [appState, setAppState] = useState({
    theme: isDarkMode ? 'Dark Mode' : 'Light Mode'
  });

  const handleThemeChange = (mode) => {
    setAppState(s => ({...s, theme: mode}));
    if (mode === 'Dark Mode' && !isDarkMode) toggleTheme();
    if (mode === 'Light Mode' && isDarkMode) toggleTheme();
    if (mode === 'System Default') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark !== isDarkMode) toggleTheme();
    }
  };

  const translations = {
    'English (US)': { settings: 'Settings', general: 'General', notifications: 'Notifications', personalization: 'Personalization', theme: 'Theme Mode', language: 'Language', format: 'Regional Format', about: 'About TMS' },
    'Hindi': { settings: 'सेटिंग्स', general: 'सामान्य', notifications: 'सूचनाएं', personalization: 'निजीकरण', theme: 'थीम मोड', language: 'भाषा', format: 'क्षेत्रीय प्रारूप', about: 'TMS के बारे में' },
    'Tamil': { settings: 'அமைப்புகள்', general: 'பொதுவான', notifications: 'அறிவிப்புகள்', personalization: 'தனிப்பயனாக்கம்', theme: 'தீம் பயன்முறை', language: 'மொழி', format: 'வட்டார வடிவம்', about: 'TMS பற்றி' },
    'English (UK)': { settings: 'Settings', general: 'General', notifications: 'Notifications', personalization: 'Personalization', theme: 'Theme Style', language: 'Language', format: 'Regional Format', about: 'About TMS' }
  };

  const t = translations[language] || translations['English (US)'];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const toggleSwitch = (key) => {
    setNotificationToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Switch = ({ isOn, onToggle }) => (
    <div 
      onClick={onToggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-primary' : 'bg-foreground/10'}`}
    >
      <motion.div 
        animate={{ x: isOn ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </div>
  );
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-10"
    >
      {/* Top Bar */}
<<<<<<< HEAD
      <div className="bg-white px-6 pt-12 pb-6 flex items-center gap-6 shadow-sm sticky top-0 z-30">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-gray-100 rounded-2xl text-black"
=======
      <div className="px-8 pt-8 pb-4 flex items-center gap-6 sticky top-0 z-30 bg-background/60 backdrop-blur-xl border-b border-border">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-3 bg-card border border-border rounded-2xl text-foreground/40"
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-black text-2xl font-black tracking-tight">Settings</h2>
      </div>

<<<<<<< HEAD
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
=======
      <div className="px-6 mt-4">
        {/* Tab Switcher */}
        <div className="flex gap-2 bg-foreground/5 p-1.5 rounded-[24px] mb-6">
          {['general', 'notifications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === tab ? 'bg-card text-primary shadow-sm' : 'text-foreground/30'
              }`}
            >
              {tab === 'general' ? t.general : t.notifications}
            </button>
          ))}
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
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
<<<<<<< HEAD
    </motion.div>
=======

      {/* Settings Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8">
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
              className="bg-card backdrop-blur-xl rounded-[40px] p-8 w-full max-w-lg relative z-10 shadow-2xl border border-border modal-surface transition-colors"
            >
              <div className="w-12 h-1.5 bg-foreground/10 rounded-full mx-auto mb-8" />
              
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black tracking-tight text-foreground uppercase">
                  {activeModal === 'theme' ? 'Theme Mode' : 
                   activeModal === 'language' ? 'Select Language' : 'System Information'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="w-10 h-10 bg-card rounded-full flex items-center justify-center text-foreground/40">
                   <ArrowLeft size={18} className="rotate-90" />
                </button>
              </div>

              {activeModal === 'theme' && (
                <div className="grid grid-cols-1 gap-3">
                  {['Light Mode', 'Dark Mode', 'System Default'].map((t) => (
                    <button 
                      key={t}
                      onClick={() => {handleThemeChange(t); setActiveModal(null)}}
                      className={`w-full p-5 rounded-[24px] border flex items-center justify-between transition-all ${appState.theme === t ? 'bg-primary text-white border-primary shadow-lg' : 'bg-card text-foreground/40 border-border'}`}
                    >
                      <span className="font-extrabold text-sm uppercase tracking-widest">{t}</span>
                      {appState.theme === t && <CheckCircle2 size={18} />}
                    </button>
                  ))}
                </div>
              )}

              {activeModal === 'language' && (
                <div className="grid grid-cols-1 gap-3">
                  {['English (US)', 'English (UK)', 'Hindi', 'Tamil'].map((l) => (
                    <button 
                      key={l}
                      onClick={() => {setLanguage(l); setActiveModal(null)}}
                      className={`w-full p-5 rounded-[24px] border flex items-center justify-between transition-all ${language === l ? 'bg-secondary text-white border-secondary shadow-lg' : 'bg-card text-foreground/40 border-border'}`}
                    >
                      <span className="font-extrabold text-sm uppercase tracking-widest">{l}</span>
                      {language === l && <CheckCircle2 size={18} />}
                    </button>
                  ))}
                </div>
              )}

              {activeModal === 'about' && (
                <div className="space-y-6">
                  <div className="bg-primary/5 p-6 rounded-[32px] border border-primary/10 flex items-center gap-5">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white">
                      <Zap size={32} />
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-foreground leading-none">TMS Platform</h4>
                      <p className="text-[10px] font-bold text-foreground/30 uppercase mt-2">Build: May 2026 • v1.0.42</p>
                    </div>
                  </div>
                  <div className="space-y-3 px-2">
                    <div className="flex justify-between py-2 border-b border-black/5">
                      <span className="text-[10px] font-bold text-foreground/30 uppercase">Developer</span>
                      <span className="text-[10px] font-black text-primary uppercase">X-Town Labs</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-black/5">
                      <span className="text-[10px] font-bold text-foreground/30 uppercase">Encryption</span>
                      <span className="text-[10px] font-black text-primary uppercase">AES-256 Bit</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-black/5">
                      <span className="text-[10px] font-bold text-foreground/30 uppercase">License</span>
                      <span className="text-[10px] font-black text-primary uppercase">Enterprise Pro</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-full py-5 bg-foreground text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] mt-4"
                  >
                    Got it
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
  );
};

export default SettingsPage;
