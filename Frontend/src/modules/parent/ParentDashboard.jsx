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
<<<<<<< HEAD
=======
  const [parentData, setParentData] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [etaData, setEtaData] = useState({ minutes: '--', km: '--' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[DASHBOARD] Fetching parent profile...');
        const response = await api.get('/parents/profile');
        const data = response.data.data;
        console.log('[DASHBOARD] Profile retrieved:', data.parentName, data.mobileNumber);
        setParentData(data);
        if (data.children?.length > 0) {
          setChildren(data.children);
          const storedChildId = localStorage.getItem('selectedChildId');
          const isChildValid = data.children.some(child => child.id === storedChildId);
          
          const initialChildId = isChildValid ? storedChildId : data.children[0].id;
          setSelectedChildId(initialChildId);
          localStorage.setItem('selectedChildId', initialChildId);
        } else {
          setChildren([]);
          setSelectedChildId(null);
          localStorage.removeItem('selectedChildId');
        }
      } catch (err) {
        console.error('[DASHBOARD] Fetch failed:', err);
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
        const response = await api.get(`/tracking/live-location/${selectedChild.currentBusId}`);
        const location = response.data.data;
        
        const busLat = parseFloat(location?.latitude);
        const busLng = parseFloat(location?.longitude);
        const pickupLat = parseFloat(selectedChild?.pickupLat);
        const pickupLng = parseFloat(selectedChild?.pickupLng);

        if (busLat && busLng && pickupLat && pickupLng) {
          console.log(`[ETA] Calculating: Bus(${busLat}, ${busLng}) -> Student(${pickupLat}, ${pickupLng})`);
          
          // Haversine Distance (as immediate fallback/validation)
          const R = 6371; // km
          const dLat = (pickupLat - busLat) * Math.PI / 180;
          const dLon = (pickupLng - busLng) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(busLat * Math.PI / 180) * Math.cos(pickupLat * Math.PI / 180) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const directDist = R * c;

          try {
            const osrmResponse = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${busLng},${busLat};${pickupLng},${pickupLat}?overview=false`
            ).catch(() => null);
            
            const osrmData = osrmResponse ? await osrmResponse.json() : null;
            
            if (osrmData?.routes?.length > 0) {
               const route = osrmData.routes[0];
               setEtaData({
                 minutes: Math.max(1, Math.round(route.duration / 60)).toString().padStart(2, '0'),
                 km: (route.distance / 1000).toFixed(1)
               });
            } else {
               // Fallback to Haversine + Heuristic (2 mins per km + 2 mins buffer)
               setEtaData({
                 minutes: Math.max(2, Math.round(directDist * 2 + 2)).toString().padStart(2, '0'),
                 km: directDist.toFixed(1)
               });
            }
          } catch (osrmErr) {
            setEtaData({
              minutes: Math.max(2, Math.round(directDist * 2 + 2)).toString().padStart(2, '0'),
              km: directDist.toFixed(1)
            });
          }
        } else {
          setEtaData({ minutes: '--', km: '--' });
        }
      } catch (err) { 
        console.error('[ETA] Error:', err); 
        setEtaData({ minutes: '--', km: '--' });
      }
    };
    fetchETA();
    const interval = setInterval(fetchETA, 10000);
    return () => clearInterval(interval);
  }, [selectedChildId, selectedChild?.currentBusId]);

  if (loading) return null;
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)

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

<<<<<<< HEAD
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
=======
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
                : 'bg-card text-foreground/40 border border-border'
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
            className="bg-card backdrop-blur-md rounded-[32px] p-6 border border-border shadow-sm relative overflow-hidden"
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
              
              <div className="shrink-0 w-10 h-10 bg-card shadow-sm border border-border rounded-2xl flex items-center justify-center text-foreground/40 hover:bg-primary/10 hover:text-primary transition-colors">
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
          <div onClick={() => navigate(ROUTES.BUS_INFO)} className="bg-card p-6 rounded-[32px] border border-border flex flex-col gap-4 group hover:bg-card/80 transition-all cursor-pointer min-h-[140px] justify-between">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Bus size={20} />
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
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

<<<<<<< HEAD
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-primary" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ETA</span>
              </div>
              <p className="text-black font-black text-lg">12 Mins</p>
=======
          {/* Trip Logs small card */}
          <div onClick={() => navigate(ROUTES.TRIPS)} className="bg-card p-6 rounded-[32px] border border-border flex flex-col gap-4 group hover:bg-card/80 transition-all cursor-pointer min-h-[140px] justify-between">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <Calendar size={20} />
>>>>>>> df6ca18 (completed Parent Ui design and Super admin school page merge the admin field)
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
