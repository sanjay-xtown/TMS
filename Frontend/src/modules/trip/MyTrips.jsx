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
<<<<<<< HEAD
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
=======
    <div className="matte-green-theme min-h-screen pb-32">
      <Header title="Journey Logs" subtitle="History & Schedule" />
      
      <div className="px-6 mt-6 space-y-6">
        {/* Child Selector */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {children.map((child) => (
            <button 
              key={child.id} 
              onClick={() => setSelectedChildId(child.id)} 
              className={`px-6 py-3 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${selectedChildId === child.id ? 'bg-primary text-white border-primary shadow-sm' : 'bg-card text-foreground/40 border-border'}`}
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
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

<<<<<<< HEAD
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
=======
        {/* Search & Filter Button Group */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 z-20" style={{ color: '#FACC15' }}>
              <Search size={20} />
            </div>
            <input 
              type="text"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border rounded-[24px] pl-14 pr-6 py-4 text-sm font-bold placeholder:text-foreground/20 placeholder:font-bold outline-none focus:bg-card/80 focus:border-primary/20 transition-all text-foreground"
            />
          </div>
          <button 
            onClick={() => setShowFilterDrawer(true)}
            className={`w-14 h-14 rounded-[22px] flex items-center justify-center border transition-all relative ${activeFilterCount > 0 ? 'bg-primary border-primary text-white shadow-md' : 'bg-card border-border'}`}
            style={{ color: activeFilterCount > 0 ? '#FFFFFF' : '#FACC15' }}
          >
            <SlidersHorizontal size={22} />
            {activeFilterCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background">
                {activeFilterCount}
              </div>
            )}
          </button>
        </div>

        {/* Filter Drawer / Modal */}
        <AnimatePresence>
          {showFilterDrawer && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilterDrawer(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 inset-x-0 bg-background rounded-t-[40px] p-8 z-[101] border-t border-border shadow-2xl"
              >
                <div className="w-12 h-1.5 bg-foreground/10 rounded-full mx-auto mb-8" />
                
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black tracking-tight text-foreground uppercase">Filter Journeys</h3>
                  <button onClick={() => {setStatusFilter('All'); setJourneyType('All'); setSearchTerm('')}} className="text-[10px] font-bold text-primary uppercase tracking-widest">Reset All</button>
                </div>

                <div className="space-y-8">
                  {/* Status Section */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Select Status</p>
                    <div className="flex flex-wrap gap-3">
                      {['All', 'Upcoming', 'Completed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            statusFilter === status 
                              ? 'bg-primary text-white shadow-md' 
                              : 'bg-card text-foreground/40 border border-border'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Type Section */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Journey Type</p>
                    <div className="flex flex-wrap gap-3">
                      {['All', 'Morning', 'Evening'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setJourneyType(type)}
                          className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            journeyType === type 
                              ? 'bg-secondary text-white shadow-md' 
                              : 'bg-card text-foreground/40 border border-border'
                          }`}
                        >
                          {type === 'All' ? 'Any Type' : type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowFilterDrawer(false)}
                    className="w-full py-5 bg-primary text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] shadow-lg mt-4 active:scale-[0.98] transition-all"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {TRIPS.map((trip) => (
            <div 
              key={trip.id} 
              onClick={() => setExpandedTripId(expandedTripId === trip.id ? null : trip.id)}
              className="premium-card group cursor-pointer"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${trip.status === 'Upcoming' ? 'bg-primary animate-pulse' : 'bg-primary'}`} />
                  <span className="font-bold text-[10px] uppercase text-foreground tracking-widest">{trip.type}</span>
                </div>
                <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">{trip.date}</span>
              </div>
              
              <div className="flex items-center gap-4 bg-foreground/[0.03] p-5 rounded-2xl">
                <div className="flex-1 overflow-hidden">
                  <p className="text-[8px] font-bold text-foreground/30 uppercase tracking-widest mb-1">From</p>
                  <p className="text-[11px] font-extrabold truncate text-foreground/80">{trip.pickup}</p>
                </div>
                <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center border border-border">
                  <ArrowRight size={14} className="text-primary" />
                </div>
                <div className="flex-1 overflow-hidden text-right">
                  <p className="text-[8px] font-bold text-foreground/30 uppercase tracking-widest mb-1">To</p>
                  <p className="text-[11px] font-extrabold truncate text-foreground/80">{trip.destination}</p>
                </div>
              </div>

              {/* Expandable Timeline Section */}
              <AnimatePresence>
                {expandedTripId === trip.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 pt-6 border-t border-dashed border-border"
                  >
                    <div className="relative space-y-8 pl-8">
                      {/* Vertical Line */}
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-foreground/5" />
                      
                      {/* Timeline Items */}
                      {[
                        { label: 'Bus Started', time: '07:30 AM', status: 'completed' },
                        { label: trip.type.includes('Morning') ? 'Student Picked' : 'Student Dropped', time: '07:45 AM', status: 'completed' },
                        { label: trip.type.includes('Morning') ? 'Arrived School' : 'Bus Parked', time: '08:15 AM', status: trip.status === 'Completed' ? 'completed' : 'pending' }
                      ].map((step, idx) => (
                        <div key={idx} className="relative">
                          {/* Dot */}
                          <div className={`absolute -left-[26px] top-1.5 w-[14px] h-[14px] rounded-full border-2 border-background shadow-sm ${step.status === 'completed' ? 'bg-primary' : 'bg-foreground/10'}`} />
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className={`text-[11px] font-extrabold uppercase tracking-tight ${step.status === 'completed' ? 'text-foreground' : 'text-foreground/20'}`}>
                                {step.label}
                              </h5>
                              <p className="text-[8px] font-bold text-foreground/30 uppercase tracking-widest mt-0.5">Automated Check-in</p>
                            </div>
                            <span className="text-[10px] font-bold text-primary opacity-60">{step.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 pt-6 border-t border-foreground/5 flex items-center justify-between">
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
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
