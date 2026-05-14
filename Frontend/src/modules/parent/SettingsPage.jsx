import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Moon, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Smartphone,
  ChevronRight,
  Info,
  LogOut,
  Zap,
  Lock,
  Layers,
  User,
  Volume2,
  Mail,
  Smartphone as PhoneIcon,
  MapPin
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { logout } from '../../shared/api/authService';
import { useLanguage } from '../../shared/context/LanguageContext';

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSection = location.state?.section || 'general';
  const [activeTab, setActiveTab] = useState(initialSection);
  const [activeModal, setActiveModal] = useState(null);

  const [notificationToggles, setNotificationToggles] = useState({
    busArrival: true,
    studentBoarded: true,
    emergency: true,
    appUpdates: false
  });

  const { language, setLanguage } = useLanguage();

  const [appState, setAppState] = useState({
    theme: localStorage.getItem('app-theme') || (document.body.classList.contains('dark-mode') ? 'Dark Mode' : 'Light Mode')
  });

  const translations = {
    'English (US)': { settings: 'Settings', general: 'General', notifications: 'Notifications', personalization: 'Personalization', theme: 'Theme Mode', language: 'Language', format: 'Regional Format', about: 'About TMS' },
    'Hindi': { settings: 'सेटिंग्स', general: 'सामान्य', notifications: 'सूचनाएं', personalization: 'निजीकरण', theme: 'थीम मोड', language: 'भाषा', format: 'क्षेत्रीय प्रारूप', about: 'TMS के बारे में' },
    'Tamil': { settings: 'அமைப்புகள்', general: 'பொதுவான', notifications: 'அறிவிப்புகள்', personalization: 'தனிப்பயனாக்கம்', theme: 'தீம் பயன்முறை', language: 'மொழி', format: 'வட்டார வடிவம்', about: 'TMS பற்றி' },
    'English (UK)': { settings: 'Settings', general: 'General', notifications: 'Notifications', personalization: 'Personalization', theme: 'Theme Style', language: 'Language', format: 'Regional Format', about: 'About TMS' }
  };

  const t = translations[language] || translations['English (US)'];

  useEffect(() => {
    localStorage.setItem('app-theme', appState.theme);
    if (appState.theme === 'Dark Mode') {
      document.body.classList.add('dark-mode');
    } else if (appState.theme === 'Light Mode') {
      document.body.classList.remove('dark-mode');
    } else if (appState.theme === 'System Default') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) document.body.classList.add('dark-mode');
      else document.body.classList.remove('dark-mode');
    }
  }, [appState.theme]);

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

  return (
    <div className="matte-green-theme min-h-screen pb-32">
      {/* Top Bar */}
      <div className="px-8 pt-16 pb-6 flex items-center gap-6 sticky top-0 z-30 bg-background/40 backdrop-blur-xl border-b border-black/[0.03]">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-3 bg-white/40 border border-black/5 rounded-2xl text-foreground/40"
        >
          <ArrowLeft size={24} />
        </motion.button>
        <h2 className="text-foreground text-2xl font-extrabold tracking-tighter uppercase">{t.settings}</h2>
      </div>

      <div className="px-6 mt-8">
        {/* Tab Switcher */}
        <div className="flex gap-2 bg-foreground/5 p-1.5 rounded-[24px] mb-10">
          {['general', 'notifications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-foreground/30'
              }`}
            >
              {tab === 'general' ? t.general : t.notifications}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'general' ? (
            <motion.div
              key="general"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 ml-2">{t.personalization}</p>
                <div className="premium-card !p-2 space-y-1">
                  {[
                    { id: 'theme', label: t.theme, value: appState.theme, icon: Moon },
                    { id: 'language', label: t.language, value: language, icon: Globe },
                    { id: 'format', label: t.format, value: 'India (IST)', icon: Layers },
                  ].map((item, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveModal(item.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-foreground/5 rounded-[24px] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                          <item.icon size={18} />
                        </div>
                        <span className="text-sm font-extrabold text-foreground tracking-tight">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-foreground/20 uppercase">{item.value}</span>
                        <ChevronRight size={14} className="text-foreground/10" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 ml-2">App & System</p>
                <div className="premium-card !p-2">
                   <button 
                     onClick={() => setActiveModal('about')}
                     className="w-full flex items-center justify-between p-4 hover:bg-foreground/5 rounded-[24px] transition-all group"
                   >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                          <Info size={18} />
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-extrabold text-foreground tracking-tight block">{t.about}</span>
                          <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">Version 1.0.42</span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-foreground/10" />
                    </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 ml-2">Push Alerts</p>
                <div className="premium-card !p-4 space-y-4">
                  {[
                    { key: 'busArrival', label: 'Bus Arrival Alert', desc: 'When bus is within 1km', icon: MapPin },
                    { key: 'studentBoarded', label: 'Boarding Status', desc: 'When student enters/leaves', icon: User },
                    { key: 'emergency', label: 'Emergency Alerts', desc: 'Delays or bus transfers', icon: Zap },
                    { key: 'appUpdates', label: 'System Updates', desc: 'New features and news', icon: Layers },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                          <item.icon size={18} />
                        </div>
                        <div>
                          <span className="text-sm font-extrabold text-foreground tracking-tight block leading-none mb-1">{item.label}</span>
                          <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">{item.desc}</span>
                        </div>
                      </div>
                      <Switch isOn={notificationToggles[item.key]} onToggle={() => toggleSwitch(item.key)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 ml-2">Other Channels</p>
                <div className="premium-card !p-2">
                   <button className="w-full flex items-center justify-between p-4 hover:bg-foreground/5 rounded-[24px] transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                          <Mail size={18} />
                        </div>
                        <span className="text-sm font-extrabold text-foreground tracking-tight">Email Notifications</span>
                      </div>
                      <span className="text-[9px] font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-lg">Managed</span>
                    </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

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
              className="bg-white/90 dark:bg-[#1A1C1E] rounded-[40px] p-8 w-full max-w-lg relative z-10 shadow-2xl border border-black/5 modal-surface transition-colors"
            >
              <div className="w-12 h-1.5 bg-foreground/10 rounded-full mx-auto mb-8" />
              
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black tracking-tight text-foreground uppercase">
                  {activeModal === 'theme' ? 'Theme Mode' : 
                   activeModal === 'language' ? 'Select Language' : 'System Information'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center text-foreground/20">
                   <ArrowLeft size={18} className="rotate-90" />
                </button>
              </div>

              {activeModal === 'theme' && (
                <div className="grid grid-cols-1 gap-3">
                  {['Light Mode', 'Dark Mode', 'System Default'].map((t) => (
                    <button 
                      key={t}
                      onClick={() => {setAppState(s => ({...s, theme: t})); setActiveModal(null)}}
                      className={`w-full p-5 rounded-[24px] border flex items-center justify-between transition-all ${appState.theme === t ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white/60 text-foreground/40 border-black/5'}`}
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
                      className={`w-full p-5 rounded-[24px] border flex items-center justify-between transition-all ${language === l ? 'bg-secondary text-white border-secondary shadow-lg' : 'bg-white/60 text-foreground/40 border-black/5'}`}
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
  );
};

const CheckCircle2 = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default SettingsPage;
