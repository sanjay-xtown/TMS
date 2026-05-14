import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Bus, 
  User, 
  Phone, 
  Wifi, 
  WifiOff, 
  Edit2, 
  Trash2, 
  Settings,
  Activity,
  MapPin,
  Clock,
  MoreVertical,
  X,
  Save,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge, Input } from '../../../shared/components/ui';
import api from '../../../shared/api';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    busNumber: '',
    busRegisterNumber: '',
    driverName: '',
    gpsProvider: 'Traccar',
    gpsDeviceId: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await api.get('/bus');
      setBuses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching buses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/bus', formData);
      setIsModalOpen(false);
      fetchBuses();
      setFormData({
        busNumber: '', busRegisterNumber: '', driverName: '', gpsProvider: 'Traccar', gpsDeviceId: '', status: 'Active'
      });
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register vehicle. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to decommission this vehicle asset?')) {
      try {
        await api.delete(`/bus/${id}`);
        fetchBuses();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase">Fleet Operations</h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">Vehicle Asset & Telematics Management</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="!rounded-2xl h-16 !px-10 shadow-2xl shadow-primary/20 !bg-primary hover:scale-105 transition-all"
        >
          <Plus size={24} />
          Register New Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full py-32 text-center">
            <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Synchronizing Fleet Telematics...</p>
          </div>
        ) : buses.length === 0 ? (
          <div className="col-span-full py-32 text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 italic">No active vehicles identified in current fleet</p>
          </div>
        ) : (
          buses.map((bus) => (
          <Card key={bus.id} className="p-10 space-y-8 group border-none shadow-xl bg-white hover:shadow-2xl transition-all rounded-[2rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700" />
            
            <div className="flex justify-between items-start relative z-10">
               <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                  <Bus size={36} />
               </div>
               <div className="flex flex-col items-end gap-3">
                  <Badge variant={bus.status === 'Active' ? 'success' : 'warning'} className="!px-4 !py-1.5 !rounded-xl text-[10px] font-black uppercase tracking-widest">{bus.status}</Badge>
                  <div className="flex items-center gap-2">
                     <div className={`w-2.5 h-2.5 rounded-full ${bus.tracking === 'Online' ? 'bg-success animate-pulse' : 'bg-slate-300'}`} />
                     <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${bus.tracking === 'Online' ? 'text-success' : 'text-slate-400'}`}>{bus.tracking || 'Offline'}</span>
                  </div>
               </div>
            </div>

            <div className="relative z-10">
               <h4 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">Bus {bus.busNumber}</h4>
               <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.3em] mt-2">{bus.busRegisterNumber}</p>
            </div>

            <div className="pt-8 border-t border-slate-50 space-y-6 relative z-10">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-foreground/20 group-hover:text-primary transition-all">
                     <User size={20} />
                  </div>
                  <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-foreground/20">Assigned Captain</p>
                     <p className="text-sm font-black uppercase text-foreground/70">{bus.driverName || 'No Captain Assigned'}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                     <p className="text-[8px] font-black uppercase tracking-widest text-foreground/20 mb-2">GPS Node</p>
                     <Badge variant="outline" className="!bg-white !text-[8px] !border-primary/10 !text-primary !py-1 !px-3">{bus.gpsProvider || 'Standard'}</Badge>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                     <p className="text-[8px] font-black uppercase tracking-widest text-foreground/20 mb-2">Device ID</p>
                     <p className="text-[10px] font-black font-mono text-foreground/60">{bus.gpsDeviceId || 'UNLINKED'}</p>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-3 pt-4 relative z-10">
               <Button variant="secondary" className="flex-1 !h-14 !rounded-2xl !bg-slate-50 border-none hover:!bg-primary hover:!text-white transition-all shadow-xl shadow-transparent hover:shadow-primary/10">
                  <Edit2 size={18} />
               </Button>
               <Button 
                onClick={() => handleDelete(bus.id)}
                variant="secondary" 
                className="flex-1 !h-14 !rounded-2xl !bg-slate-50 border-none hover:!bg-error hover:!text-white transition-all shadow-xl shadow-transparent hover:shadow-error/10"
               >
                  <Trash2 size={18} />
               </Button>
               <Button variant="secondary" className="!h-14 !w-14 !p-0 !rounded-2xl !bg-slate-50 border-none hover:!bg-slate-900 hover:!text-white transition-all">
                  <MoreVertical size={20} />
               </Button>
            </div>
          </Card>
        ))
      )}

        <Card 
          onClick={() => setIsModalOpen(true)}
          className="p-10 border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-center gap-6 hover:bg-primary/5 hover:border-primary/20 transition-all group cursor-pointer rounded-[2.5rem]"
        >
           <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:bg-primary/10 group-hover:scale-110 transition-all shadow-inner">
              <Plus size={40} />
           </div>
           <div>
              <p className="text-lg font-black uppercase tracking-tight text-foreground/40 group-hover:text-primary transition-colors">Add Bus Asset</p>
              <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.2em] mt-2 italic">Scale your transit fleet network</p>
           </div>
        </Card>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl !bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col">
                {/* Modal Header */}
                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">Register Vehicle</h2>
                      <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mt-1">Fleet Asset Registry • V2.0</p>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-foreground/20 hover:text-error hover:bg-error/10 transition-all">
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleRegister} className="p-10 space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Bus Identifier</label>
                        <input 
                           required
                           value={formData.busNumber}
                           onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
                           className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-sm font-black uppercase outline-none focus:ring-2 ring-primary/20 transition-all"
                           placeholder="E.G. B-104"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Govt Registration No</label>
                        <input 
                           required
                           value={formData.busRegisterNumber}
                           onChange={(e) => setFormData({...formData, busRegisterNumber: e.target.value})}
                           className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-sm font-black uppercase outline-none focus:ring-2 ring-primary/20 transition-all"
                           placeholder="TN-66-A-XXXX"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Assigned Driver Name</label>
                     <div className="relative">
                        <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" />
                        <input 
                           required
                           value={formData.driverName}
                           onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                           className="w-full h-16 bg-slate-50 rounded-2xl pl-14 pr-6 text-sm font-black uppercase outline-none focus:ring-2 ring-primary/20 transition-all"
                           placeholder="FULL NAME"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">GPS Provider</label>
                        <select 
                           value={formData.gpsProvider}
                           onChange={(e) => setFormData({...formData, gpsProvider: e.target.value})}
                           className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-sm font-black uppercase outline-none cursor-pointer"
                        >
                           <option value="Traccar">Traccar Engine</option>
                           <option value="Standard">Standard GPS</option>
                           <option value="Enterprise">Enterprise Node</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Hardware Device ID</label>
                        <input 
                           required
                           value={formData.gpsDeviceId}
                           onChange={(e) => setFormData({...formData, gpsDeviceId: e.target.value})}
                           className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-sm font-black font-mono outline-none focus:ring-2 ring-primary/20 transition-all"
                           placeholder="XXXX-XXXX"
                        />
                     </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                     <Button 
                       type="button"
                       onClick={() => setIsModalOpen(false)}
                       variant="secondary" 
                       className="flex-1 !h-20 !rounded-3xl !text-sm !font-black !uppercase tracking-widest border-none !bg-slate-50"
                     >
                       Cancel
                     </Button>
                     <Button 
                       type="submit"
                       disabled={submitting}
                       className="flex-[2] !h-20 !rounded-3xl !text-sm !font-black !uppercase tracking-widest !bg-primary shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all"
                     >
                       {submitting ? 'Registering Asset...' : 'Authorize Asset'}
                       <Save size={20} />
                     </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusManagement;
