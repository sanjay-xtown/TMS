import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Bus,
  Settings,
  ChevronRight,
  Filter
} from 'lucide-react';
import BottomNavbar from '../../shared/components/BottomNavbar';
import Header from '../../shared/components/Header';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'transport',
    title: 'Bus is Arriving',
    message: 'Bus TN37XY9999 is within 1 km of your pickup point.',
    time: '2 mins ago',
    icon: MapPin,
    color: 'bg-primary',
    textColor: 'text-black'
  },
  {
    id: 2,
    type: 'attendance',
    title: 'Student Boarded',
    message: 'Karthi has successfully boarded the bus at 3:45 PM.',
    time: '15 mins ago',
    icon: CheckCircle2,
    color: 'bg-green-500',
    textColor: 'text-white'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Emergency Transfer',
    message: 'Emergency transfer alert for Bus TN37XY9999. Checking replacement.',
    time: '1 hour ago',
    icon: AlertTriangle,
    color: 'bg-red-500',
    textColor: 'text-white'
  },
  {
    id: 4,
    type: 'transport',
    title: 'School Reached',
    message: 'The bus has safely reached the school campus.',
    time: 'Morning',
    icon: Bus,
    color: 'bg-blue-500',
    textColor: 'text-white'
  }
];

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = activeTab === 'all' 
    ? NOTIFICATIONS 
    : NOTIFICATIONS.filter(n => n.type === activeTab);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-24"
    >
      <Header 
        title="Alerts" 
        subtitle="Stay updated with real-time news"
        rightElement={
          <button className="p-2 bg-white rounded-full shadow-sm">
            <Settings size={24} className="text-gray-700" />
          </button>
        }
      />

      <div className="px-5 mt-4 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'transport', 'attendance', 'alert'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeTab === tab 
                ? 'bg-black text-white border-black shadow-lg scale-105' 
                : 'bg-white text-gray-400 border-gray-100 hover:border-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm relative overflow-hidden group"
              >
                <div className="flex gap-4 items-start relative z-10">
                  <div className={`w-12 h-12 ${notif.color} ${notif.textColor} rounded-2xl flex items-center justify-center shrink-0 shadow-lg`}>
                    <notif.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-black font-black text-base tracking-tight">{notif.title}</h4>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{notif.time}</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{notif.message}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${notif.color}`} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notif.type}</span>
                      </div>
                      <button className="text-primary group-hover:translate-x-1 transition-transform">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Shimmer effect for transport notifications */}
                {notif.type === 'transport' && (
                  <div className="absolute top-0 right-0 w-24 h-full bg-primary/5 -skew-x-12 translate-x-12 group-hover:translate-x-0 transition-transform duration-700" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNotifications.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Bell size={40} />
              </div>
              <h3 className="text-gray-400 font-bold">No notifications yet</h3>
              <p className="text-gray-300 text-sm">We'll notify you when something happens.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNavbar activeTab="alerts" />
    </motion.div>
  );
};

export default NotificationsPage;
