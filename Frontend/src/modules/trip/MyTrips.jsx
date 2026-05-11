import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Bus,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import BottomNavbar from '../../shared/components/BottomNavbar';
import Header from '../../shared/components/Header';

const TRIPS = [
  {
    id: 1,
    status: 'Upcoming',
    type: 'Morning Pickup',
    time: '07:30 AM',
    date: 'Tomorrow, 12 May',
    busId: 'BUS-10',
    pickup: 'Singanallur Stop',
    destination: 'Coimbatore International School',
    isLive: false
  },
  {
    id: 2,
    status: 'Completed',
    type: 'Evening Drop',
    time: '03:45 PM',
    date: 'Today, 11 May',
    busId: 'BUS-10',
    pickup: 'CIS Campus',
    destination: 'Singanallur Stop',
    isLive: false
  },
  {
    id: 3,
    status: 'Completed',
    type: 'Morning Pickup',
    time: '07:30 AM',
    date: 'Today, 11 May',
    busId: 'BUS-10',
    pickup: 'Singanallur Stop',
    destination: 'CIS Campus',
    isLive: false
  }
];

const MyTrips = () => {
  const [filter, setFilter] = useState('All');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-24"
    >
      <Header 
        title="My Trips" 
        subtitle="Manage student transit history"
        rightElement={
          <button className="p-2 bg-white rounded-full shadow-sm">
            <Filter size={24} className="text-gray-700" />
          </button>
        }
      />

      <div className="px-5 mt-4 space-y-6">
        {/* Status Filter */}
        <div className="flex gap-4 border-b border-gray-200">
          {['All', 'Upcoming', 'Completed'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`pb-3 px-1 text-sm font-black uppercase tracking-widest transition-all relative ${
                filter === item ? 'text-black' : 'text-gray-400'
              }`}
            >
              {item}
              {filter === item && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Trips List */}
        <div className="space-y-6">
          {TRIPS.filter(t => filter === 'All' || t.status === filter).map((trip, index) => (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              key={trip.id}
              className="premium-card !bg-white border-none shadow-sm relative overflow-hidden group"
            >
              {/* Trip Header */}
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${trip.status === 'Upcoming' ? 'bg-primary/10 text-primary' : 'bg-green-50 text-green-500'}`}>
                    {trip.status === 'Upcoming' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
                  </div>
                  <div>
                    <h4 className="text-black font-black text-sm tracking-tight">{trip.type}</h4>
                    <p className="text-gray-400 text-[10px] font-bold uppercase">{trip.date}</p>
                  </div>
                </div>
                <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                  trip.status === 'Upcoming' ? 'bg-primary text-black' : 'bg-gray-100 text-gray-400'
                }`}>
                  {trip.status}
                </div>
              </div>

              {/* Path Visualization */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pickup</p>
                  <p className="text-black font-bold text-sm truncate">{trip.pickup}</p>
                </div>
                <div className="flex flex-col items-center gap-1 px-2">
                  <ArrowRight size={16} className="text-primary" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Drop</p>
                  <p className="text-black font-bold text-sm truncate">{trip.destination}</p>
                </div>
              </div>

              {/* Trip Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Bus size={16} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">{trip.busId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">{trip.time}</span>
                  </div>
                </div>
                <button className="text-gray-300 group-hover:text-primary transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Decorative accent for upcoming trip */}
              {trip.status === 'Upcoming' && (
                <div className="absolute top-0 right-0 w-1 h-full bg-primary" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNavbar activeTab="trips" />
    </motion.div>
  );
};

export default MyTrips;
