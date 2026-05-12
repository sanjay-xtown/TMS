import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Bus, 
  Info,
  Navigation
} from 'lucide-react';
import BottomNavbar from '../../shared/components/BottomNavbar';
import Header from '../../shared/components/Header';
import { ROUTES } from '../../config/routes';
import { useNavigate } from 'react-router-dom';

const ParentDashboard = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-24"
    >
      {/* Top Header */}
      <Header 
        title={
          <div className="flex items-center gap-2">
            Hi, Ravisankar!
            <span className="bg-primary/20 text-primary text-[8px] px-2 py-0.5 rounded-full border border-primary/20">DEMO</span>
          </div>
        } 
        subtitle="Monday, 11 May"
        rightElement={
          <button className="relative p-2 bg-white rounded-full shadow-sm">
            <Bell size={24} className="text-gray-700" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
          </button>
        }
      />

      <div className="px-5 space-y-6 mt-4">
        {/* Quick Status Bar */}
        <div className="bg-black rounded-[24px] p-5 flex items-center justify-between text-white shadow-xl overflow-hidden relative">
          <div className="absolute right-[-10%] top-[-20%] w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          
          <div className="flex items-center gap-4 z-10">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#FACC15]"
              />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Current Trip</p>
              <h3 className="text-lg font-black tracking-tight">On the way to home</h3>
            </div>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(ROUTES.TRACKING)}
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black z-10"
          >
            <Navigation size={20} fill="black" />
          </motion.button>
        </div>

        {/* Bus Information Card */}
        <div className="premium-card !bg-white border-none shadow-md overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Bus size={32} className="text-black" />
              </div>
              <div>
                <h4 className="text-black font-black text-xl">BUS-10</h4>
                <p className="text-gray-400 text-xs font-bold">Karthi • 7th-A</p>
              </div>
            </div>
            <div className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/20">
              LIVE
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-primary" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ETA</span>
              </div>
              <p className="text-black font-black text-lg">12 Mins</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={14} className="text-primary" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Distance</span>
              </div>
              <p className="text-black font-black text-lg">2.4 Km</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white overflow-hidden shadow-sm">
                <img src="https://i.pravatar.cc/100?img=12" alt="Driver" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Driver</p>
                <p className="text-black font-bold text-sm">Murugan</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-black rounded-full text-white shadow-lg"
            >
              <Phone size={20} fill="white" />
            </motion.button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(ROUTES.TRIPS)}
            className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <p className="font-bold text-sm text-gray-700">Trip History</p>
          </motion.div>

          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(ROUTES.BUS_INFO)}
            className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3"
          >
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
              <Info size={24} />
            </div>
            <p className="font-bold text-sm text-gray-700">Bus Details</p>
          </motion.div>
        </div>

        {/* Recent Alerts Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-black font-black text-xl tracking-tight">Recent Alerts</h3>
            <button 
              onClick={() => navigate(ROUTES.NOTIFICATIONS)}
              className="text-primary text-sm font-black flex items-center"
            >
              See All <ChevronRight size={16} />
            </button>
          </div>

          <div className="bg-white rounded-[24px] p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-inner">
              <MapPin size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">3:45 PM</p>
              <h5 className="text-black font-bold text-sm leading-tight">Bus crossed Saravanampatti</h5>
              <p className="text-gray-500 text-xs mt-0.5">Estimated 10 mins to reach home</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNavbar activeTab="home" />
    </motion.div>
  );
};

export default ParentDashboard;
