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
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-between rounded-t-[35px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] safe-bottom">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`relative bottom-nav-item ${isActive ? 'active' : 'text-gray-300'}`}
          >
            {isActive && (
              <motion.div 
                layoutId="navGlow"
                className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#FACC15]" 
              />
            )}
            <tab.icon 
              size={26} 
              strokeWidth={isActive ? 2.5 : 2} 
              fill={isActive ? "currentColor" : "none"}
              className="transition-all duration-300"
            />
            <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isActive ? 'text-black' : 'text-gray-300'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavbar;
