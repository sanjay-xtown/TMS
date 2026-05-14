import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Map, Bell, User } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const BottomNavbar = ({ activeTab }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', icon: Home, label: t('home'), path: ROUTES.DASHBOARD },
    { id: 'trips', icon: Map, label: t('trips'), path: ROUTES.TRIPS },
    { id: 'alerts', icon: Bell, label: t('notifications'), path: ROUTES.NOTIFICATIONS },
    { id: 'profile', icon: User, label: t('profile'), path: ROUTES.PROFILE },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 px-6 pointer-events-none matte-green-theme">
      <div className="bg-white/60 backdrop-blur-[40px] border border-white/40 rounded-[32px] p-2 flex items-center gap-1 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.12)] pointer-events-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate(tab.path)}
              className="relative flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[24px] transition-all duration-300 group outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-primary shadow-md shadow-primary/20"
                  transition={{ 
                    type: "spring", 
                    stiffness: 380, 
                    damping: 30,
                    mass: 1
                  }}
                  style={{ borderRadius: 24 }}
                />
              )}
              
              <motion.div 
                animate={{ 
                  scale: isActive ? 1.05 : 1,
                  y: isActive ? 0 : 0
                }}
                className="relative z-10"
              >
                <tab.icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-foreground/30 group-hover:text-foreground/50'}`}
                />
              </motion.div>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0, x: -5 }}
                    animate={{ opacity: 1, width: 'auto', x: 0 }}
                    exit={{ opacity: 0, width: 0, x: 5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative z-10 text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap overflow-hidden"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
