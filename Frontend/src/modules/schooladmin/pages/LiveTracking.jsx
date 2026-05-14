import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Activity, 
  Bus, 
  ShieldCheck, 
  Clock, 
  Phone,
  Maximize2,
  Minimize2,
  Filter,
  Search,
  ChevronRight,
  X
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge } from '../../../shared/components/ui';
import api from '../../../shared/api';

// Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const busIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/fluency/96/bus.png',
  iconSize: [45, 45],
  iconAnchor: [22, 22],
  popupAnchor: [0, -20]
});

const selectedBusIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/fluency/96/bus.png',
  iconSize: [60, 60],
  iconAnchor: [30, 30],
  popupAnchor: [0, -30],
  className: 'bus-marker-selected'
});

const MapController = ({ center, fleet, selectedBusId }) => {
  const map = useMap();
  const lastFollowedId = React.useRef(null);
  
  useEffect(() => {
    // If a specific bus is selected and it's a NEW selection or coordinates moved
    if (center && Array.isArray(center) && isValidCoord(center[0], center[1])) {
      const isNewSelection = lastFollowedId.current !== selectedBusId;
      
      if (isNewSelection) {
        map.flyTo(center, 16, { animate: true, duration: 1.5 });
        lastFollowedId.current = selectedBusId;
      } else {
        // Just pan smoothly if it's the same bus moving
        map.panTo(center, { animate: true, duration: 0.5 });
      }
    } else if (fleet && fleet.length > 0 && !selectedBusId) {
      // Fit to all buses if no specific bus is selected
      lastFollowedId.current = null;
      const validMarkers = fleet
        .filter(b => isValidCoord(b.latitude, b.longitude))
        .map(b => [parseFloat(b.latitude), parseFloat(b.longitude)]);
      
      if (validMarkers.length > 0) {
        const bounds = L.latLngBounds(validMarkers);
        map.fitBounds(bounds, { padding: [50, 50], animate: true });
      }
    }
  }, [center, map, fleet, selectedBusId]);
  return null;
};

const isValidCoord = (lat, lng) => {
  const pLat = parseFloat(lat);
  const pLng = parseFloat(lng);
  return !isNaN(pLat) && !isNaN(pLng);
};

const LiveTracking = () => {
  const [selectedBus, setSelectedBus] = useState(null);
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([11.0168, 76.9558]); 

  useEffect(() => {
    fetchBuses();
    const interval = setInterval(fetchBuses, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await api.get('/tracking/fleet/status');
      const fleet = response.data.data || [];
      setBuses(fleet);
      
      // If a bus is selected, update its data from the fresh list
      if (selectedBus) {
        const updated = fleet.find(b => b.id === selectedBus.id);
        if (updated) setSelectedBus(updated);
      }
    } catch (error) {
      console.error('Error fetching live fleet telemetry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBusSelect = (bus) => {
    setSelectedBus(bus);
    if (isValidCoord(bus.latitude, bus.longitude)) {
      setMapCenter([parseFloat(bus.latitude), parseFloat(bus.longitude)]);
    }
  };

  const filteredBuses = buses.filter(bus => 
    bus.busNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.busRegisterNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      <style>{`
        .bus-marker-selected {
          filter: drop-shadow(0 0 15px rgba(136, 176, 75, 0.6));
          z-index: 1000 !important;
        }
        .leaflet-container {
          background: #f8fafc !important;
          border-radius: 2rem;
        }
      `}</style>

      {/* Sidebar - Fleet List */}
      <Card className="w-96 !p-0 flex flex-col shrink-0 overflow-hidden border-none shadow-2xl bg-white">
        <div className="p-8 border-b border-slate-50 space-y-6 bg-slate-50/30">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tight">Active Fleet</h2>
              <Badge variant="outline" className="!rounded-xl !border-primary/20 text-primary">{buses.length} Units</Badge>
           </div>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
              <input 
                type="text" 
                placeholder="Find bus or driver..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border-none rounded-2xl pl-12 pr-6 py-4 text-xs font-bold uppercase tracking-tight outline-none shadow-sm focus:ring-2 ring-primary/10 transition-all"
              />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
            {loading && buses.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Syncing Cloud Fleet...</p>
              </div>
            ) : filteredBuses.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 italic">No matches found</p>
              </div>
            ) : (
              filteredBuses.map((bus) => (
                <div 
                  key={bus.id}
                  onClick={() => handleBusSelect(bus)}
                  className={`p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer group relative overflow-hidden ${selectedBus?.id === bus.id ? 'bg-primary border-primary text-white shadow-xl scale-[1.02]' : 'bg-white border-slate-50 hover:border-primary/20 hover:bg-slate-50/50 shadow-sm'}`}
                >
                   <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedBus?.id === bus.id ? 'bg-white/20' : 'bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                            <Bus size={24} />
                         </div>
                         <div>
                            <p className="text-base font-black uppercase tracking-tight leading-none">Bus {bus.busNumber}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ${selectedBus?.id === bus.id ? 'text-white/60' : 'text-foreground/30'}`}>{bus.driverName || 'Captain Unassigned'}</p>
                         </div>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${bus.tracking === 'Online' ? 'bg-success animate-pulse' : 'bg-slate-200'}`} />
                   </div>
                   
                   <div className="flex justify-between items-end relative z-10">
                      <div className="space-y-1">
                         <p className={`text-[9px] font-black uppercase tracking-widest ${selectedBus?.id === bus.id ? 'text-white/40' : 'text-foreground/20'}`}>Node Status</p>
                         <p className="text-xs font-black uppercase tracking-tight">{bus.trackingStatus || 'IDLE'}</p>
                      </div>
                      <div className={`p-2 rounded-xl transition-all ${selectedBus?.id === bus.id ? 'bg-white/10' : 'bg-slate-50 text-foreground/20 group-hover:text-primary group-hover:bg-primary/10'}`}>
                        <ChevronRight size={16} />
                      </div>
                   </div>
                </div>
              ))
            )}
         </div>
      </Card>

      {/* Main Map View */}
      <Card className="flex-1 !p-0 relative overflow-hidden border-none shadow-2xl bg-white rounded-[2.5rem]">
         <MapContainer 
           center={mapCenter} 
           zoom={13} 
           zoomControl={false} 
           className="h-full w-full z-0"
         >
           <TileLayer 
             url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
           />
           <MapController 
              selectedBusId={selectedBus?.id}
              center={selectedBus && isValidCoord(selectedBus.latitude, selectedBus.longitude) ? [parseFloat(selectedBus.latitude), parseFloat(selectedBus.longitude)] : null} 
              fleet={selectedBus ? null : buses}
            />

            {buses.map((bus) => (
              isValidCoord(bus.latitude, bus.longitude) && (
                <Marker 
                  key={`${bus.id}-${selectedBus?.id === bus.id}`}
                  position={[parseFloat(bus.latitude), parseFloat(bus.longitude)]}
                  icon={selectedBus?.id === bus.id ? selectedBusIcon : busIcon}
                  zIndexOffset={selectedBus?.id === bus.id ? 1000 : 0}
                  eventHandlers={{
                    click: () => handleBusSelect(bus)
                  }}
                >
                  <Popup>
                    <div className="p-2 text-center min-w-[120px]">
                       <p className="text-[10px] font-black uppercase text-foreground/40 mb-1">Fleet Unit</p>
                       <p className="text-sm font-black uppercase text-primary">Bus {bus.busNumber}</p>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
         </MapContainer>

         {/* Map Interface Overlay Controls */}
         <div className="absolute top-8 right-8 flex flex-col gap-4 z-[1000]">
            <button className="w-14 h-14 bg-white/80 backdrop-blur-md border border-white rounded-2xl flex items-center justify-center text-foreground/40 hover:text-primary transition-all shadow-xl hover:scale-110 active:scale-95">
               <Maximize2 size={24} />
            </button>
            <button className="w-14 h-14 bg-white/80 backdrop-blur-md border border-white rounded-2xl flex items-center justify-center text-foreground/40 hover:text-primary transition-all shadow-xl hover:scale-110 active:scale-95">
               <Activity size={24} />
            </button>
         </div>

         {/* Floating Status Card */}
         <AnimatePresence>
           {selectedBus && (
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 50, opacity: 0 }}
               className="absolute bottom-8 inset-x-8 z-[1000] pointer-events-none"
             >
               <div className="bg-white/95 backdrop-blur-2xl border border-white shadow-2xl rounded-[2.5rem] p-6 pointer-events-auto flex items-center justify-between relative overflow-hidden gap-6">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />
                  
                  {/* Left Side: Bus Profile */}
                  <div className="flex items-center gap-5 shrink-0 relative z-10">
                     <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 relative">
                        <Bus size={32} />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-4 border-white flex items-center justify-center">
                           <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        </div>
                     </div>
                     <div className="space-y-0.5">
                          <div className="flex items-center gap-3">
                             <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground leading-none">Bus {selectedBus.busNumber}</h3>
                             <Badge variant="success" className="!px-2 !py-0.5 !rounded-lg text-[8px] uppercase font-black tracking-widest">{selectedBus.trackingStatus || 'Active'}</Badge>
                          </div>
                          <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">{selectedBus.driverName || 'Captain'}</p>
                     </div>
                  </div>

                  {/* Middle: Telemetry Data */}
                  <div className="flex-1 flex items-center justify-between px-8 border-x border-slate-100 min-w-0 relative z-10 gap-4">
                     <div className="text-center min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-widest text-foreground/20 mb-1">Velocity</p>
                        <p className="text-xl font-black text-primary truncate leading-none">
                          {selectedBus.speed || '0'} 
                          <span className="text-[9px] opacity-30 ml-0.5 font-bold">KM/H</span>
                        </p>
                     </div>
                     <div className="w-px h-8 bg-slate-50" />
                     <div className="text-center min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-widest text-foreground/20 mb-1">Registry</p>
                        <p className="text-xl font-black text-foreground truncate leading-none">{selectedBus.busRegisterNumber?.slice(-4) || 'XXXX'}</p>
                     </div>
                     <div className="w-px h-8 bg-slate-50" />
                     <div className="text-center min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-widest text-foreground/20 mb-1">Signal Status</p>
                        <div className="flex items-center justify-center gap-1">
                           <div className="w-1 h-3 bg-success rounded-full" />
                           <div className="w-1 h-4 bg-success rounded-full" />
                           <div className="w-1 h-5 bg-success rounded-full" />
                           <span className="text-[9px] font-black text-success ml-1 uppercase">EXCELLENT</span>
                        </div>
                     </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="flex items-center gap-3 shrink-0 relative z-10">
                     <Button className="!rounded-2xl h-16 !px-8 !bg-primary shadow-xl shadow-primary/10 hover:scale-[1.02] transition-all !text-[10px] !font-black !uppercase tracking-widest flex items-center gap-3">
                        <Phone size={16} />
                        Contact Driver
                     </Button>
                     <button 
                       onClick={() => setSelectedBus(null)}
                       className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-foreground/20 hover:text-error hover:bg-error/5 transition-all shadow-sm"
                     >
                        <X size={24} />
                     </button>
                  </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>

         {/* Signal/Status Indicator overlay */}
         <div className="absolute top-8 left-8 z-[1000] bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white shadow-xl flex items-center gap-4">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-foreground/60">Fleet Telemetry Connected</span>
         </div>
      </Card>
    </div>
  );
};

export default LiveTracking;
