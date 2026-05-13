import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Info,
  Maximize2,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const LiveTracking = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-[#121416] flex flex-col relative overflow-hidden"
    >

      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-[#111111]">
        {/* Simple Mock Map Elements (Grid Lines for Map feel) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#FACC15 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Mock Roads */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50,300 Q200,250 500,200 T900,150" stroke="#FACC15" strokeWidth="40" fill="none" strokeLinecap="round" />
          <path d="M200,-50 L250,900" stroke="#FACC15" strokeWidth="30" fill="none" strokeLinecap="round" />
        </svg>

        {/* Animated Bus Marker */}
        <motion.div 
          animate={{ 
            left: ["20%", "40%", "35%", "60%", "80%"],
            top: ["60%", "55%", "45%", "40%", "30%"],
            rotate: [12, 10, -5, -8, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0.3, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-6 bg-primary/40 rounded-full blur-xl"
            />
            <div className="w-14 h-14 bg-primary rounded-[20px] flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.6)] border-[3px] border-black">
              <Navigation size={28} fill="black" />
            </div>
            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black px-3 py-1.5 rounded-full text-[10px] font-black text-primary border border-primary/30 shadow-2xl">
              BUS-10 • 42 KM/H
            </div>
          </div>
        </motion.div>

        {/* Pickup Marker */}
        <div className="absolute top-[30%] left-[80%] z-0 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-primary"
            >
              <MapPin size={20} className="text-black" fill="black" />
            </motion.div>
            <div className="mt-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Home</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-none">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="p-4 bg-black/80 backdrop-blur-md rounded-2xl text-white border border-white/10 pointer-events-auto"
        >
          <ArrowLeft size={24} />
        </motion.button>
        
        <div className="bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center pointer-events-auto">
          <h2 className="text-white font-black text-sm tracking-tight uppercase">Live Tracking</h2>
          <p className="text-primary text-[10px] font-black tracking-widest">EN ROUTE</p>
        </div>

        <button className="p-4 bg-black/80 backdrop-blur-md rounded-2xl text-white border border-white/10 pointer-events-auto">
          <Compass size={24} />
        </button>
      </div>

      {/* Map Actions Side */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <button className="p-3 bg-black/80 backdrop-blur-md rounded-xl text-white border border-white/10">
          <Maximize2 size={20} />
        </button>
      </div>

      {/* Bottom Tracking Card Overlay */}
      <div className="mt-auto p-6 z-20 pb-10">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black rounded-[32px] p-6 border border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-black">
                <Clock size={32} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-primary text-[10px] font-black tracking-widest uppercase">Estimated Arrival</p>
                <h3 className="text-white text-3xl font-black tracking-tighter">04:15 PM</h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">Distance</p>
              <p className="text-white text-xl font-black">1.8 KM</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-white/5 rounded-full mb-6 overflow-hidden relative">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "70%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-primary relative"
            >
              <div className="absolute right-0 top-0 w-8 h-full bg-white/20 blur-sm" />
            </motion.div>
          </div>

          <div className="flex items-center gap-4 py-6 border-y border-white/5">
            <div className="w-12 h-12 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <img src="https://i.pravatar.cc/100?img=12" alt="Driver" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-base leading-none">Murugan</h4>
              <p className="text-gray-500 text-xs mt-1">Bus Driver • BUS-10</p>
            </div>
            <div className="flex gap-2">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/5 rounded-xl text-white border border-white/10"
              >
                <Info size={20} />
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-primary rounded-xl text-black"
              >
                <Phone size={20} fill="black" />
              </motion.button>
            </div>
          </div>

          {/* Stop Info */}
          <div className="mt-6 flex items-start gap-4">
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#FACC15]" />
              <div className="w-[1px] h-4 bg-white/10" />
              <div className="w-2 h-2 bg-white/20 rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-primary text-[10px] font-black uppercase">Next Stop</p>
              <h5 className="text-white font-bold text-sm">Singanallur Post Office</h5>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[10px] font-bold uppercase">ETA</p>
              <p className="text-white font-bold text-sm">4 Mins</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LiveTracking;
