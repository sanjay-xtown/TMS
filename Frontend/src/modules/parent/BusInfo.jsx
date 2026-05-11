import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Bus, 
  User, 
  Phone, 
  ShieldCheck, 
  Calendar,
  Users,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const BusInfo = () => {
  const navigate = useNavigate();

  const details = [
    { label: 'Vehicle Type', value: 'Ashok Leyland 40S', icon: Info },
    { label: 'Registration', value: 'TN37XY9999', icon: ShieldCheck },
    { label: 'Year', value: '2022 Model', icon: Calendar },
    { label: 'Capacity', value: '40 Students', icon: Users },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pb-10"
    >
      {/* Top Banner */}
      <div className="h-[30vh] bg-black relative flex items-center justify-center rounded-b-[40px] overflow-hidden">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-6 p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center shadow-[0_20px_40px_rgba(250,204,21,0.2)]">
            <Bus size={48} color="black" />
          </div>
          <h2 className="text-white text-3xl font-black tracking-tighter">BUS-10</h2>
        </motion.div>
      </div>

      <div className="px-6 -mt-8 space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                <img src="https://i.pravatar.cc/100?img=12" alt="Driver" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Primary Driver</p>
                <h4 className="text-black font-black text-xl">Murugan</h4>
              </div>
            </div>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="p-4 bg-primary rounded-2xl text-black shadow-lg"
            >
              <Phone size={24} fill="black" />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {details.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <item.icon size={16} />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                </div>
                <p className="text-black font-black text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Attendant Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-md border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
              <User size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Bus Attendant</p>
              <h4 className="text-black font-black text-base">Selvi Lakshmi</h4>
            </div>
          </div>
          <button className="text-gray-300">
            <Phone size={20} />
          </button>
        </div>

        {/* Safety Badge */}
        <div className="bg-green-50 rounded-[32px] p-6 border border-green-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h4 className="text-green-800 font-black text-sm uppercase tracking-tight">Verified Vehicle</h4>
            <p className="text-green-600/70 text-xs font-bold leading-tight">All safety protocols and government norms are strictly followed.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BusInfo;
