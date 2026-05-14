import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  User, 
  Bus as BusIcon, 
  MapPin, 
  MoreVertical,
  Edit2,
  Trash2,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  X,
  Save,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge, Input } from '../../../shared/components/ui';
import api from '../../../shared/api';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    rollNo: '',
    class: '',
    section: '',
    pickupPoint: '',
    currentBusId: '',
    parent: {
      parentName: '',
      email: '',
      mobileNumber: '',
      address: ''
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, busesRes] = await Promise.all([
        api.get('/students'),
        api.get('/bus')
      ]);
      setStudents(studentsRes.data.data || []);
      setBuses(busesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/students', formData);
      setIsModalOpen(false);
      fetchData();
      setFormData({
        studentName: '', rollNo: '', class: '', section: '', pickupPoint: '', currentBusId: '',
        parent: { parentName: '', email: '', mobileNumber: '', address: '' }
      });
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Failed to enroll student. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this student from the registry?')) {
      try {
        await api.delete(`/students/${id}`);
        fetchData();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase">Student Registry</h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">Enrollment & Transit Assignment Control</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="!rounded-2xl h-16 !px-10 shadow-2xl shadow-primary/20 !bg-primary hover:scale-105 transition-all"
        >
          <Plus size={24} />
          Enroll New Student
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <Card className="lg:col-span-3 !p-4 flex flex-col md:flex-row items-center gap-4 border-none shadow-xl bg-white">
            <div className="flex-1 w-full relative">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
               <input 
                 type="text" 
                 placeholder="Search by name, admission ID, or class..." 
                 className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold uppercase tracking-tight outline-none focus:ring-2 ring-primary/20 transition-all"
               />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
               <Button variant="secondary" className="!rounded-2xl h-14 !px-6 !bg-slate-50 border-none">
                 <Filter size={18} />
                 Class
               </Button>
               <Button variant="secondary" className="!rounded-2xl h-14 !px-6 !bg-slate-50 border-none">
                 Bus Route
               </Button>
            </div>
         </Card>
         <Card className="!p-4 flex items-center justify-center border-none shadow-xl bg-white">
            <Badge variant="outline" className="h-12 px-8 !rounded-2xl border-primary/20 text-primary font-black text-xs">{students.length} Registered</Badge>
         </Card>
      </div>

      <Card className="!p-0 overflow-hidden border-none shadow-2xl bg-white">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="text-left px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/30">Student Identity</th>
                <th className="text-left px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/30">Academic Node</th>
                <th className="text-left px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/30">Transit Details</th>
                <th className="text-left px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/30">Guardian Link</th>
                <th className="text-left px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/30">Status</th>
                <th className="text-right px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/30">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-32 text-center">
                    <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Accessing Cloud Registry...</p>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-32 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 italic">No records identified in current node</p>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="group hover:bg-slate-50/30 transition-all">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-foreground/20 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          <User size={28} />
                        </div>
                        <div>
                          <p className="text-base font-black uppercase tracking-tight text-foreground">{student.studentName}</p>
                          <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.2em] mt-1">{student.rollNo}</p>
                        </div>
                      </div>
                    </td>
                  <td className="px-10 py-8">
                    <div className="space-y-1.5">
                       <p className="text-sm font-black uppercase tracking-tight text-foreground/70">Class {student.class}</p>
                       <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Section {student.section}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-3">
                       <div className="flex items-center gap-2.5 text-primary">
                          <BusIcon size={14} />
                          <span className="text-xs font-black uppercase tracking-tight">
                            {student.bus?.busNumber || 'Fleet Pending'}
                          </span>
                       </div>
                       <div className="flex items-center gap-2.5 text-foreground/30">
                          <MapPin size={12} />
                          <span className="text-[10px] font-bold uppercase truncate max-w-[150px] tracking-widest">
                            {student.pickupPoint || 'Unmapped Node'}
                          </span>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-foreground/20 group-hover:text-primary transition-all">
                          <User size={18} />
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-tight text-foreground/60">
                            {student.parent?.parentName || 'Unknown'}
                          </p>
                          <p className="text-[10px] font-bold text-foreground/30 uppercase mt-0.5">
                            {student.parent?.mobileNumber}
                          </p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <Badge variant={student.status === 'Active' ? 'success' : 'error'} className="!px-4 !py-1 !rounded-xl">
                      {student.status || 'Active'}
                    </Badge>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-12 h-12 hover:bg-primary rounded-2xl text-foreground/10 hover:text-white transition-all flex items-center justify-center shadow-xl shadow-transparent hover:shadow-primary/20">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="w-12 h-12 hover:bg-error rounded-2xl text-foreground/10 hover:text-white transition-all flex items-center justify-center shadow-xl shadow-transparent hover:shadow-error/20"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="w-12 h-12 hover:bg-slate-900 rounded-2xl text-foreground/10 hover:text-white transition-all flex items-center justify-center">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Enrollment Modal */}
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
              className="relative w-full max-w-4xl !bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col h-full">
                {/* Modal Header */}
                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                      <GraduationCap size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tight">Enroll Student</h2>
                      <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mt-1">Registry Entry • Node Alpha</p>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-foreground/20 hover:text-error hover:bg-error/10 transition-all">
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleEnroll} className="p-10 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Student Info */}
                    <div className="space-y-8">
                       <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary px-2">Student Profile</h3>
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Student Name</label>
                             <input 
                                required
                                value={formData.studentName}
                                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                                className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-sm font-black uppercase outline-none focus:ring-2 ring-primary/20 transition-all"
                                placeholder="E.g. JONATHAN DOE"
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Roll Number</label>
                                <input 
                                   required
                                   value={formData.rollNo}
                                   onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                                   className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-sm font-black uppercase outline-none"
                                   placeholder="STU-2024"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Class</label>
                                <input 
                                   required
                                   value={formData.class}
                                   onChange={(e) => setFormData({...formData, class: e.target.value})}
                                   className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-sm font-black uppercase outline-none"
                                   placeholder="X"
                                />
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Section</label>
                                <input 
                                   required
                                   value={formData.section}
                                   onChange={(e) => setFormData({...formData, section: e.target.value})}
                                   className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-sm font-black uppercase outline-none"
                                   placeholder="A"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Assign Bus</label>
                                <select 
                                   value={formData.currentBusId}
                                   onChange={(e) => setFormData({...formData, currentBusId: e.target.value})}
                                   className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-sm font-black uppercase outline-none cursor-pointer"
                                >
                                   <option value="">Select Vehicle</option>
                                   {buses.map(bus => (
                                     <option key={bus.id} value={bus.id}>Bus {bus.busNumber}</option>
                                   ))}
                                </select>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Stopping Point</label>
                             <div className="relative">
                                <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" />
                                <input 
                                   value={formData.pickupPoint}
                                   onChange={(e) => setFormData({...formData, pickupPoint: e.target.value})}
                                   className="w-full h-16 bg-slate-50 rounded-2xl pl-14 pr-6 text-sm font-black uppercase outline-none"
                                   placeholder="STOP NAME"
                                />
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Parent Info */}
                    <div className="space-y-8">
                       <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 px-2">Parent/Guardian Profile</h3>
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Parent Name</label>
                             <input 
                                required
                                value={formData.parent.parentName}
                                onChange={(e) => setFormData({...formData, parent: {...formData.parent, parentName: e.target.value}})}
                                className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-sm font-black uppercase outline-none"
                                placeholder="E.g. ROBERT DOE"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Mobile Number</label>
                             <div className="relative">
                                <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" />
                                <input 
                                   required
                                   value={formData.parent.mobileNumber}
                                   onChange={(e) => setFormData({...formData, parent: {...formData.parent, mobileNumber: e.target.value}})}
                                   className="w-full h-16 bg-slate-50 rounded-2xl pl-14 pr-6 text-sm font-black uppercase outline-none"
                                   placeholder="00000 00000"
                                />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Email ID</label>
                             <div className="relative">
                                <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" />
                                <input 
                                   required
                                   value={formData.parent.email}
                                   onChange={(e) => setFormData({...formData, parent: {...formData.parent, email: e.target.value}})}
                                   className="w-full h-16 bg-slate-50 rounded-2xl pl-14 pr-6 text-sm font-black uppercase outline-none"
                                   placeholder="PARENT@MAIL.COM"
                                />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-foreground/30 px-2">Home Address</label>
                             <textarea 
                                value={formData.parent.address}
                                onChange={(e) => setFormData({...formData, parent: {...formData.parent, address: e.target.value}})}
                                className="w-full h-32 bg-slate-50 rounded-2xl p-6 text-sm font-black uppercase outline-none resize-none"
                                placeholder="STREET, AREA, CITY"
                             />
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="pt-10 flex gap-4">
                     <Button 
                       type="button"
                       onClick={() => setIsModalOpen(false)}
                       variant="secondary" 
                       className="flex-1 !h-20 !rounded-3xl !text-sm !font-black !uppercase tracking-widest border-none !bg-slate-100"
                     >
                       Cancel
                     </Button>
                     <Button 
                       type="submit"
                       disabled={submitting}
                       className="flex-[2] !h-20 !rounded-3xl !text-sm !font-black !uppercase tracking-widest !bg-primary shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all"
                     >
                       {submitting ? 'Saving...' : 'Submit Enrollment'}
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

export default StudentManagement;
