import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  School as SchoolIcon,
  Phone,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../../shared/components/ui';
import api from '../../../shared/api';

const SchoolManagement = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: '',
    address: '',
    phone: '',
    email: '',
    principalName: '',
    latitude: '',
    longitude: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await api.get('/schools');
      setSchools(response.data.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/schools', {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      });
      setIsModalOpen(false);
      setFormData({
        schoolName: '',
        address: '',
        phone: '',
        email: '',
        principalName: '',
        latitude: '',
        longitude: ''
      });
      fetchSchools();
      alert('School registered successfully!');
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.response?.data?.message || 'Failed to register school');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">School Management</h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">Directory of Registered Educational Institutions</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="!rounded-2xl h-14 !px-8 shadow-xl shadow-primary/20"
        >
          <Plus size={20} />
          Register New School
        </Button>
      </div>

      {/* Filters Area */}
      <Card className="!p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by school name, principal or location..." 
            className="w-full bg-foreground/5 border-none rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="secondary" className="!rounded-xl h-12 w-full md:w-auto">
            <Filter size={18} />
            Filters
          </Button>
          <Button variant="secondary" className="!rounded-xl h-12 w-full md:w-auto">
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Table Area */}
      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-foreground/[0.02] border-b border-border">
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">School Identity</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Contact Details</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Status</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Fleet Size</th>
                <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Manage</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Synchronizing School Records...</p>
                    </td>
                  </tr>
                ) : schools.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">No schools found in database</p>
                    </td>
                  </tr>
                ) : (
                  schools.map((school) => (
                    <tr key={school.id} className="group hover:bg-foreground/[0.01] transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl shadow-inner">
                            <SchoolIcon size={24} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-black uppercase tracking-tight">{school.schoolName}</p>
                            <div className="flex items-center gap-2 text-foreground/40">
                              <MapPin size={12} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{school.address}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-foreground/60">
                        <Mail size={12} className="text-primary/60" />
                        <span className="text-xs font-bold">{school.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/60">
                        <Phone size={12} className="text-primary/60" />
                        <span className="text-xs font-bold">{school.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant={school.status === 'Active' ? 'success' : 'error'}>{school.status || 'Active'}</Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black">{school.fleet || 0}</span>
                      <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Vehicles</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 hover:bg-primary/10 rounded-xl text-foreground/20 hover:text-primary transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2.5 hover:bg-error/10 rounded-xl text-foreground/20 hover:text-error transition-all">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2.5 hover:bg-foreground/10 rounded-xl text-foreground/20 hover:text-foreground transition-all">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-8 py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 bg-foreground/[0.01]">
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Showing 1 to 4 of 42 Schools</p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="!px-4 !py-2 !rounded-lg text-xs" disabled>Prev</Button>
            {[1, 2, 3, '...', 12].map((page, i) => (
              <button 
                key={i}
                className={`w-10 h-10 rounded-lg text-xs font-black transition-all ${page === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-foreground/5 text-foreground/60'}`}
              >
                {page}
              </button>
            ))}
            <Button variant="secondary" className="!px-4 !py-2 !rounded-lg text-xs">Next</Button>
          </div>
        </div>
      </Card>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-foreground/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            <Card className="!p-12 space-y-10 relative overflow-hidden !bg-white !border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
               
               <div className="relative z-10">
                  <h3 className="text-4xl font-black uppercase tracking-tighter text-foreground">Onboard New Institution</h3>
                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-[0.3em] mt-2">Initialize school system parameters</p>
               </div>

               <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <Input 
                    label="School Name" 
                    placeholder="Enter school name"
                    className="!bg-slate-50 !border-slate-200 !h-14"
                    required 
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  />
                  <Input 
                    label="Principal Name" 
                    placeholder="Head of institution"
                    className="!bg-slate-50 !border-slate-200 !h-14"
                    required
                    value={formData.principalName}
                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <Input 
                      label="Full Address" 
                      placeholder="Street, City, State, Zip"
                      className="!bg-slate-50 !border-slate-200 !h-14"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <Input 
                    label="Contact Email" 
                    type="email" 
                    placeholder="admin@school.com"
                    className="!bg-slate-50 !border-slate-200 !h-14"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input 
                    label="Phone Number" 
                    placeholder="+91 XXXXX XXXXX"
                    className="!bg-slate-50 !border-slate-200 !h-14"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input 
                    label="Latitude (Optional)" 
                    type="number" 
                    step="any"
                    placeholder="11.0123"
                    className="!bg-slate-50 !border-slate-200 !h-14"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  />
                  <Input 
                    label="Longitude (Optional)" 
                    type="number" 
                    step="any"
                    placeholder="76.9876"
                    className="!bg-slate-50 !border-slate-200 !h-14"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  />

                  <div className="md:col-span-2 flex gap-4 pt-6">
                     <Button 
                        type="button" 
                        variant="secondary" 
                        className="flex-1 !h-16 !rounded-2xl !bg-slate-100 !text-slate-600 uppercase font-black tracking-widest text-xs"
                        onClick={() => setIsModalOpen(false)}
                        disabled={submitting}
                     >
                        Cancel
                     </Button>
                     <Button 
                        type="submit" 
                        className="flex-1 !h-16 !rounded-2xl !bg-[#A3D139] hover:!bg-[#92C44E] !text-white uppercase font-black tracking-widest text-xs shadow-xl shadow-[#A3D139]/30"
                        disabled={submitting}
                     >
                        {submitting ? 'Processing...' : 'Complete Onboarding'}
                     </Button>
                  </div>
               </form>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SchoolManagement;
