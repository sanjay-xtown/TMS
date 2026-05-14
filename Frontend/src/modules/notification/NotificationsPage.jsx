import React, { useState } from 'react';
import { 
  Bell, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Bus,
} from 'lucide-react';
import Header from '../../shared/components/Header';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'transport',
    title: 'Bus is Arriving',
    message: 'Bus TN37XY9999 is within 1 km of your pickup point.',
    time: '2 mins ago',
    icon: MapPin,
  },
  {
    id: 2,
    type: 'attendance',
    title: 'Student Boarded',
    message: 'Karthi has successfully boarded the bus at 3:45 PM.',
    time: '15 mins ago',
    icon: CheckCircle2,
  },
];

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = activeTab === 'all' 
    ? NOTIFICATIONS 
    : NOTIFICATIONS.filter(n => n.type === activeTab);

  return (
    <div className="matte-green-theme min-h-screen pb-32">
      <Header title="Alert Center" subtitle="Real-time Updates" />

      <div className="px-6 mt-6 space-y-8">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {['all', 'transport', 'attendance', 'alert'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-primary text-white shadow-sm' : 'bg-white/40 text-foreground/40 border border-black/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredNotifications.map((notif) => (
            <div key={notif.id} className="premium-card flex gap-5">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <notif.icon size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-extrabold text-sm text-foreground uppercase tracking-tight leading-none pt-1">{notif.title}</h4>
                  <span className="text-[9px] font-bold text-foreground/30">{notif.time}</span>
                </div>
                <p className="text-xs text-foreground/60 font-medium leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="py-20 text-center text-foreground/20 font-bold text-[10px] uppercase tracking-widest">
              No Updates Found
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default NotificationsPage;
