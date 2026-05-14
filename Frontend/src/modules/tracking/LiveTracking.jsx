import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Bus as BusIcon,
  ShieldCheck,
  LocateFixed
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ROUTES } from '../../config/routes';
import api from '../../shared/api/axios';

// Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const schoolIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/color/96/school.png', 
  iconSize: [50, 50],
  iconAnchor: [25, 50],
});

const busIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/fluency/96/bus.png',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  className: 'bus-marker-blinking'
});

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div class="user-dot"><div class="user-dot-pulse"></div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const isValidCoord = (lat, lng) => {
  const pLat = parseFloat(lat);
  const pLng = parseFloat(lng);
  return !isNaN(pLat) && !isNaN(pLng);
};

const createStudentIcon = (photoUrl, name) => {
  if (photoUrl) {
    return L.divIcon({
      className: 'custom-student-marker',
      html: `
        <div class="student-marker-wrapper">
           <img src="https://img.icons8.com/color/48/marker--v1.png" class="pin-bg" />
           <div class="student-photo-overlay">
             <img src="${photoUrl}" onerror="this.src='https://ui-avatars.com/api/?name=${name}&background=0F4C5C&color=fff'" />
           </div>
        </div>
      `,
      iconSize: [40, 45],
      iconAnchor: [20, 45],
    });
  }
  return new L.Icon({
    iconUrl: 'https://img.icons8.com/color/96/marker--v1.png',
    iconSize: [45, 45],
    iconAnchor: [22, 45],
  });
};

const MapController = ({ center, schoolPos, homePos }) => {
  const map = useMap();
  const hasFitInitially = useRef(false);
  
  useEffect(() => {
    if (!center || !schoolPos || !homePos) return;
    if (isNaN(center[0]) || isNaN(center[1])) return;
    if (hasFitInitially.current) return;

    const markers = [center, schoolPos, homePos];
    const bounds = L.latLngBounds(markers);
    map.fitBounds(bounds, { padding: [80, 80], animate: true });
    hasFitInitially.current = true;
  }, [center, schoolPos, homePos, map]);

  return null;
};

const LocateControl = ({ onLocate }) => {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    setLocating(true);
    map.locate({ enableHighAccuracy: true })
      .on('locationfound', (e) => {
        map.flyTo(e.latlng, 17, { animate: true });
        onLocate(e.latlng);
        setLocating(false);
      })
      .on('locationerror', (err) => {
        console.warn("Location error:", err.message);
        alert("Unable to find your location. Please ensure GPS is enabled.");
        setLocating(false);
      });
  };

  return (
    <button 
      onClick={handleLocate}
      disabled={locating}
      className={`absolute right-6 top-32 z-[1000] p-4 bg-white/60 backdrop-blur-xl rounded-[24px] border border-black/[0.03] shadow-sm text-primary active:scale-95 transition-all pointer-events-auto ${locating ? 'animate-pulse' : ''}`}
    >
      <LocateFixed size={24} />
    </button>
  );
};

const LiveTracking = () => {
  const navigate = useNavigate();
  const [busData, setBusData] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const [busPos, setBusPos] = useState([11.0168, 76.9558]); 
  const [loading, setLoading] = useState(true);
  const pollInterval = useRef(null);

  const [homePos, setHomePos] = useState([11.0055, 76.9410]);
  const [schoolPos, setSchoolPos] = useState([11.0250, 76.9700]);
  const [routePath, setRoutePath] = useState([]);
  const [distance, setDistance] = useState(0);
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const selectedChildId = localStorage.getItem('selectedChildId');
        const response = await api.get('/parents/profile');
        const profile = response.data.data;
        
        if (profile && Array.isArray(profile.children)) {
          const child = profile.children.find(c => c.id === selectedChildId) || profile.children[0];
          setActiveChild(child);
          if (child) {
            if (child.pickupLat && child.pickupLng) {
              setHomePos([parseFloat(child.pickupLat), parseFloat(child.pickupLng)]);
            }
            if (child.school && child.school.latitude) {
              setSchoolPos([parseFloat(child.school.latitude), parseFloat(child.school.longitude)]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial context:', err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchLiveLocation = async () => {
      const identifiers = [
        activeChild?.currentBusId,
        activeChild?.bus?.driverMobileNumber
      ].filter(Boolean);

      if (identifiers.length === 0) {
        setLoading(false);
        return;
      }
      
      for (const id of identifiers) {
        try {
          const response = await api.get(`/tracking/live-location/${id}`);
          const location = response.data.data;
          
          if (location && location.latitude && location.longitude) {
            const lat = parseFloat(location.latitude);
            const lng = parseFloat(location.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              setBusPos([lat, lng]);
              setBusData(prev => ({
                ...prev,
                ...location,
                speed: location.speed,
                trackingStatus: location.trackingStatus,
                lastUpdated: location.lastUpdated
              }));
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn(`Tracking fetch failed for identifier ${id}:`, err.message);
        }
      }
      setLoading(false);
    };

    fetchLiveLocation();
    pollInterval.current = setInterval(fetchLiveLocation, 5000);
    return () => clearInterval(pollInterval.current);
  }, [activeChild]);

  useEffect(() => {
    const fetchRoadRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${busPos[1]},${busPos[0]};${homePos[1]},${homePos[0]}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRoutePath(coords);
          setDistance((data.routes[0].distance / 1000).toFixed(1));
        }
      } catch (error) {
        console.error("Error fetching road route:", error);
      }
    };

    if (busPos && homePos) {
      fetchRoadRoute();
    }
  }, [busPos, homePos]);

  if (loading) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Calibrating Map...</p>
      </div>
    );
  }

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'Just now';
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} mins ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    return then.toLocaleDateString();
  };

  const dynamicBusIcon = new L.Icon({
    iconUrl: 'https://img.icons8.com/fluency/96/bus.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    className: busData?.trackingStatus === 'LIVE' ? 'bus-marker-blinking' : ''
  });

  const isDarkMode = document.body.classList.contains('dark-mode');

  return (
    <div className={`h-screen flex flex-col relative overflow-hidden bg-white ${isDarkMode ? 'dark-mode' : ''}`}>
      <style>{`
        @keyframes bus-blink {
          0% { opacity: 1; filter: drop-shadow(0 0 0 rgba(136, 176, 75, 0.4)); }
          50% { opacity: 0.7; filter: drop-shadow(0 0 20px rgba(136, 176, 75, 1)); }
          100% { opacity: 1; filter: drop-shadow(0 0 0 rgba(136, 176, 75, 0.4)); }
        }
        .bus-marker-blinking {
          animation: bus-blink 1.5s infinite ease-in-out;
        }
        .student-marker-wrapper {
          position: relative;
          width: 40px;
          height: 45px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }
        .pin-bg {
          width: 40px;
          height: 40px;
        }
        .student-photo-overlay {
          position: absolute;
          top: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          overflow: hidden;
          background: #fff;
          border: 1.5px solid #fff;
        }
        .student-photo-overlay img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .user-dot {
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          position: relative;
        }
        .user-dot-pulse {
          position: absolute;
          width: 300%;
          height: 300%;
          background: rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          top: -100%;
          left: -100%;
          animation: pulse-dot 2s infinite ease-out;
        }
        @keyframes pulse-dot {
          0% { transform: scale(0.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .leaflet-container {
          background: ${isDarkMode ? '#121416' : '#f8f9fa'} !important;
        }
      `}</style>
      <div className="absolute inset-0 z-0">
        <MapContainer center={busPos} zoom={15} zoomControl={false} className="h-full w-full">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <MapController center={busPos} schoolPos={schoolPos} homePos={homePos} />
          
          {routePath.length > 0 && isValidCoord(busPos[0], busPos[1]) && isValidCoord(homePos[0], homePos[1]) && (
            <>
              <Polyline positions={routePath} color="#88B04B" weight={8} opacity={0.15} lineJoin="round" />
              <Polyline positions={routePath} color="#88B04B" weight={4} opacity={1} lineJoin="round" />
            </>
          )}

          <Marker position={schoolPos} icon={schoolIcon} zIndexOffset={500} />
          <Marker 
            position={homePos} 
            icon={createStudentIcon(
              activeChild?.profilePhoto ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${activeChild.profilePhoto}` : null, 
              activeChild?.studentName || 'Student'
            )} 
          />
          {isValidCoord(busPos[0], busPos[1]) && (
            <Marker position={busPos} icon={dynamicBusIcon} zIndexOffset={1000}>
              <Popup>
                <div className="p-2 min-w-[140px]">
                  <h4 className="font-extrabold text-[10px] uppercase text-foreground/30 mb-3 border-b border-foreground/5 pb-2">Live Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-[10px] font-bold text-foreground/40 uppercase">Driver</span>
                      <span className="text-[10px] font-extrabold text-foreground uppercase">{busData?.driverName || 'Raja'}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-[10px] font-bold text-foreground/40 uppercase">Speed</span>
                      <span className="text-[10px] font-extrabold text-primary uppercase">{Math.round(busData?.speed || 0)} KM</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {userPos && (
            <Marker position={userPos} icon={userLocationIcon} zIndexOffset={2000} />
          )}

          <LocateControl onLocate={(latlng) => setUserPos(latlng)} />
        </MapContainer>
      </div>

      <div className="absolute top-0 inset-x-0 p-6 z-10 flex items-center justify-between pointer-events-none">
        <button onClick={() => navigate(ROUTES.DASHBOARD)} className="p-4 bg-white/60 backdrop-blur-xl rounded-[24px] border border-black/[0.03] shadow-sm pointer-events-auto active:scale-95 transition-all text-foreground/40">
          <ArrowLeft size={24} />
        </button>
        <div className="bg-white/60 backdrop-blur-xl px-6 py-4 rounded-[24px] border border-black/[0.03] shadow-sm flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${busData?.trackingStatus === 'LIVE' ? 'bg-primary animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${busData?.trackingStatus === 'LIVE' ? 'text-foreground/80' : 'text-red-500'}`}>
              {busData?.busNumber || 'Route'} • {busData?.trackingStatus || 'LIVE'}
            </span>
          </div>
        </div>
        <div className="w-14" />
      </div>

      <div className="absolute bottom-0 inset-x-0 z-10 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <motion.div 
          initial={{ y: 100, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-lg border border-black/[0.03] overflow-hidden"
        >
          <div className="p-4 flex items-center justify-between border-b border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/40 border border-black/5 p-0.5">
                <img src={`https://ui-avatars.com/api/?name=${busData?.driverName || 'Driver'}&background=88B04B&color=fff&bold=true`} alt="" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <p className="text-[8px] font-bold text-foreground/30 uppercase tracking-widest mb-0.5">Transit Captain</p>
                <h4 className="font-extrabold text-lg text-foreground uppercase tracking-tight leading-none">{busData?.driverName || 'Active'}</h4>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-14 h-12 bg-primary text-white rounded-2xl flex flex-col items-center justify-center">
                <p className="text-[7px] font-bold opacity-60 uppercase leading-none mb-1">Bus</p>
                <span className="text-[11px] font-black uppercase tracking-widest leading-none">{busData?.busNumber || 'T-02'}</span>
              </div>
              
              {activeChild?.bus?.driverMobileNumber && (
                <motion.a 
                  whileTap={{ scale: 0.9 }}
                  href={`tel:${activeChild.bus.driverMobileNumber}`}
                  className="w-14 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-colors"
                >
                  <Phone size={20} fill="currentColor" />
                </motion.a>
              )}
            </div>
          </div>
          
          <div className="px-5 py-4 grid grid-cols-2 gap-4">
            <div className="bg-white/40 p-3 rounded-[20px] border border-black/5">
              <span className="text-[8px] font-bold text-foreground/30 uppercase tracking-widest block mb-1">Remaining</span>
              <p className="text-xl font-extrabold text-foreground tracking-tighter">{distance} <span className="text-[10px] opacity-40">KM</span></p>
            </div>
            <div className="bg-white/40 p-3 rounded-[20px] border border-black/5">
              <span className="text-[8px] font-bold text-foreground/30 uppercase tracking-widest block mb-1">Live Speed</span>
              <p className="text-xl font-extrabold text-primary tracking-tighter">{Math.round(busData?.speed || 0)} <span className="text-[10px] opacity-40">KM</span></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveTracking;
