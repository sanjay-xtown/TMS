import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Bus,
  ArrowRight,
  Search,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import Header from '../../shared/components/Header';
import api from '../../shared/api/axios';

const MyTrips = () => {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(localStorage.getItem('selectedChildId'));
  const [loading, setLoading] = useState(true);
  const [expandedTripId, setExpandedTripId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [journeyType, setJourneyType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/parents/profile');
        const profile = response.data.data;
        if (profile && Array.isArray(profile.children)) {
          setChildren(profile.children);
          if (!selectedChildId && profile.children.length > 0) {
            setSelectedChildId(profile.children[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch children for trips:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedChild = children.find(c => c.id === selectedChildId);
  const schoolName = selectedChild?.school?.schoolName || 'School Campus';
  const busNumber = selectedChild?.bus?.busNumber || 'Bus-Active';

  const generateTrips = () => {
    if (!selectedChild) return [];
    
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    return [
      { id: 1, status: 'Upcoming', type: 'Evening Drop', date: `Today, ${today}`, busId: busNumber, pickup: schoolName, destination: selectedChild.pickupPoint || 'Home' },
      { id: 2, status: 'Completed', type: 'Morning Pickup', date: `Today, ${today}`, busId: busNumber, pickup: selectedChild.pickupPoint || 'Home', destination: schoolName },
      { id: 3, status: 'Completed', type: 'Morning Pickup', date: `Yesterday, ${yesterday}`, busId: busNumber, pickup: selectedChild.pickupPoint || 'Home', destination: schoolName },
      { id: 4, status: 'Completed', type: 'Evening Drop', date: `Yesterday, ${yesterday}`, busId: busNumber, pickup: schoolName, destination: selectedChild.pickupPoint || 'Home' },
    ];
  };

  const allTrips = generateTrips();
  const TRIPS = allTrips.filter(t => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesType = journeyType === 'All' || t.type.includes(journeyType);
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      t.pickup?.toLowerCase().includes(searchLower) || 
      t.destination?.toLowerCase().includes(searchLower) ||
      t.busId?.toLowerCase().includes(searchLower) ||
      t.type?.toLowerCase().includes(searchLower) ||
      t.date?.toLowerCase().includes(searchLower) ||
      t.status?.toLowerCase().includes(searchLower);

    return matchesStatus && matchesType && matchesSearch;
  });

  const activeFilterCount = (statusFilter !== 'All' ? 1 : 0) + (journeyType !== 'All' ? 1 : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Syncing Journey...</p>
      </div>
    );
  }

  return (
    <div className="matte-green-theme min-h-screen pb-32">
      <Header title="Journey Logs" subtitle="History & Schedule" />
      
      <div className="px-6 mt-6 space-y-6">
        {/* Child Selector */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {children.map((child) => (
            <button 
              key={child.id} 
              onClick={() => setSelectedChildId(child.id)} 
              className={`px-6 py-3 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${selectedChildId === child.id ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white/40 text-foreground/40 border-black/5'}`}
            >
              {child.studentName.split(' ')[0]}
            </button>
          ))}
        </div>

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
              className="w-full bg-white/40 border border-black/5 rounded-[24px] pl-14 pr-6 py-4 text-sm font-bold placeholder:text-foreground/20 placeholder:font-bold outline-none focus:bg-white focus:border-primary/20 transition-all"
            />
          </div>
          <button 
            onClick={() => setShowFilterDrawer(true)}
            className={`w-14 h-14 rounded-[22px] flex items-center justify-center border transition-all relative ${activeFilterCount > 0 ? 'bg-primary border-primary text-white shadow-md' : 'bg-white/40 border-black/5'}`}
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
                className="fixed bottom-0 inset-x-0 bg-background rounded-t-[40px] p-8 z-[101] border-t border-black/5 shadow-2xl"
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
                              : 'bg-white/60 text-foreground/40 border border-black/5'
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
                              : 'bg-white/60 text-foreground/40 border border-black/5'
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
                <div className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center border border-black/5">
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
                    className="mt-6 pt-6 border-t border-dashed border-slate-200"
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
                          <div className={`absolute -left-[26px] top-1.5 w-[14px] h-[14px] rounded-full border-2 border-white shadow-sm ${step.status === 'completed' ? 'bg-primary' : 'bg-foreground/10'}`} />
                          
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
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-foreground/5 rounded-xl flex items-center justify-center">
                    <Bus size={18} className="text-foreground/40" />
                  </div>
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{trip.busId}</span>
                </div>
                <div className="flex items-center gap-3">
                  {trip.status === 'Completed' && (
                    <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/10">
                      <span className="text-[8px] font-bold text-primary uppercase">Reached</span>
                    </div>
                  )}
                  <span className="text-[8px] font-bold text-foreground/20 uppercase tracking-widest">{expandedTripId === trip.id ? 'Close' : 'Details'}</span>
                </div>
              </div>
            </div>
          ))}
          {TRIPS.length === 0 && (
            <div className="py-32 text-center">
              <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4 text-foreground/20">
                <Calendar size={32} />
              </div>
              <p className="text-foreground/30 font-bold text-[10px] uppercase tracking-[0.2em]">No logs found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTrips;
