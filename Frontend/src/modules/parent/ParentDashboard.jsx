import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bus, 
  MapPin, 
  Clock, 
  User, 
  Navigation, 
  Calendar, 
  ArrowRight,
  Phone,
  Settings
} from 'lucide-react';
import { ROUTES } from '../../config/routes';
import api from '../../shared/api/axios';
import Header from '../../shared/components/Header';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [parentData, setParentData] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [etaData, setEtaData] = useState({ minutes: '--', km: '--' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/parents/profile');
        const data = response.data.data;
        setParentData(data);
        if (data.children?.length > 0) {
          setChildren(data.children);
          const initialChild = localStorage.getItem('selectedChildId') || data.children[0].id;
          setSelectedChildId(initialChild);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedChild = children.find(c => c.id === selectedChildId);

  useEffect(() => {
    const fetchETA = async () => {
      if (!selectedChildId || !selectedChild?.currentBusId) return;
      try {
        const response = await api.get(`/tracking/${selectedChild.currentBusId}`);
        const location = response.data.data;
        if (location) {
          // Road Distance logic maintained
          const osrmResponse = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${location.longitude},${location.latitude};${selectedChild.pickupLng},${selectedChild.pickupLat}?overview=false`
          );
          const osrmData = await osrmResponse.json();
          if (osrmData.routes?.length > 0) {
             setEtaData({
               minutes: Math.round(osrmData.routes[0].duration / 60).toString().padStart(2, '0'),
               km: (osrmData.routes[0].distance / 1000).toFixed(1)
             });
          }
        }
      } catch (err) { console.error(err); }
    };
    fetchETA();
    const interval = setInterval(fetchETA, 10000);
    return () => clearInterval(interval);
  }, [selectedChildId, selectedChild?.currentBusId]);

  if (loading) return null;

  return (
    <div className="matte-green-theme min-h-screen bg-background/20 pb-32">
      <Header 
        title={`Hi, ${parentData?.parentName?.split(' ')[0] || 'Parent'}`}
        subtitle="School Bus Tracker"
      />

      <div className="px-6 space-y-6 mt-6">
        {/* 1. Child Selection (Pills) */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                setSelectedChildId(child.id);
                localStorage.setItem('selectedChildId', child.id);
              }}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                selectedChildId === child.id 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-white text-foreground/40 border border-black/5'
              }`}
            >
              {child.studentName.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* 2. Child Info Card */}
        {selectedChild && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur-md rounded-[32px] p-6 border border-black/5 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-2xl shrink-0">
                  {selectedChild.studentName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-foreground uppercase tracking-tight text-lg truncate">{selectedChild.studentName}</h4>
                  <p className="text-[11px] font-bold text-foreground/60 uppercase tracking-widest">Class {selectedChild.class} • Section {selectedChild.section}</p>
                </div>
              </div>
              
              <div className="shrink-0 w-10 h-10 bg-white/80 shadow-sm border border-black/5 rounded-2xl flex items-center justify-center text-foreground/40 hover:bg-primary/10 hover:text-primary transition-colors">
                <User size={18} />
              </div>
            </div>

            <div className="space-y-3 mt-6 pt-6 border-t border-black/5">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Bus size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Active Vehicle</p>
                  <p className="text-[14px] font-black text-foreground uppercase">{selectedChild.bus?.busNumber || 'T-02'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Pickup Point</p>
                  <p className="text-[14px] font-black text-foreground uppercase leading-tight">{selectedChild.pickupPoint}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. Bus Arriving In Card */}
        {selectedChild && (
          <motion.div 
            onClick={() => navigate(ROUTES.TRACKING)}
            className="bg-primary rounded-[32px] p-7 text-white shadow-xl relative overflow-hidden group cursor-pointer"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Transit Status</p>
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-white font-black text-2xl uppercase tracking-tighter">Bus Arriving In</h4>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-6xl font-black tracking-tighter">{etaData.minutes}</span>
                    <span className="text-lg font-bold opacity-40 uppercase">Min</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl mb-2">
                    <MapPin size={12} className="text-accent" />
                    <span className="text-[11px] font-bold">{etaData.km} KM AWAY</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest bg-white text-primary px-4 py-2 rounded-xl shadow-sm">Track Now</p>
                </div>
              </div>
            </div>
            <div className="absolute right-[-5%] top-[-5%] opacity-10 rotate-12">
              <Bus size={150} />
            </div>
          </motion.div>
        )}

        {/* 4. Small Action Cards Grid */}
        <div className="grid grid-cols-2 gap-4 pb-10">
          {/* Bus Info small card */}
          <div onClick={() => navigate(ROUTES.BUS_INFO)} className="bg-white/40 p-6 rounded-[32px] border border-black/5 flex flex-col gap-4 group hover:bg-white transition-all cursor-pointer min-h-[140px] justify-between">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Bus size={20} />
            </div>
            <div>
              <p className="font-black text-[11px] uppercase tracking-widest text-foreground">Bus Info</p>
              <p className="text-[9px] font-bold text-foreground/60 uppercase mt-1 tracking-widest">Vehicle Details</p>
            </div>
          </div>

          {/* Trip Logs small card */}
          <div onClick={() => navigate(ROUTES.TRIPS)} className="bg-white/40 p-6 rounded-[32px] border border-black/5 flex flex-col gap-4 group hover:bg-white transition-all cursor-pointer min-h-[140px] justify-between">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <Calendar size={20} />
            </div>
            <div>
              <p className="font-black text-[11px] uppercase tracking-widest text-foreground">Trip Logs</p>
              <p className="text-[9px] font-bold text-foreground/60 uppercase mt-1 tracking-widest">History</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
