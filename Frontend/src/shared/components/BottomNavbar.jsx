import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Map, Bell, User } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { motion } from 'framer-motion';

const BottomNavbar = ({ activeTab }) => {
  const navigate = useNavigate();

  const tabs = [
    { id: 'home', icon: Home, label: 'Home', path: ROUTES.DASHBOARD },
    { id: 'trips', icon: Map, label: 'Trips', path: ROUTES.TRIPS },
    { id: 'alerts', icon: Bell, label: 'Alerts', path: ROUTES.NOTIFICATIONS },
    { id: 'profile', icon: User, label: 'Profile', path: ROUTES.PROFILE },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 px-6 pointer-events-none">
      <div className="bg-card/80 backdrop-blur-[40px] border border-border rounded-[32px] p-2 flex items-center gap-1 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.12)] pointer-events-auto transition-colors duration-300">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate(tab.path)}
              className="relative flex-1 flex items-center justify-center py-3.5 rounded-[24px] transition-all duration-300 group outline-none"
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
              
              <div className="relative flex flex-col items-center">
                <tab.icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-all duration-300 ${isActive ? 'text-white' : 'text-foreground/40 group-hover:text-foreground'}`}
                />
                {!isActive && (
                  <span className="text-[8px] font-black uppercase tracking-widest mt-1 text-foreground/20">
                    {tab.label}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
