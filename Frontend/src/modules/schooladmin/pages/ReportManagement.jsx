import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  Download, 
  Calendar, 
  User, 
  Bus, 
  MapPin, 
  Activity,
  ArrowRight,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  Shield,
  Printer
} from 'lucide-react';
import { Card, Button, Badge } from '../../../shared/components/ui';
import api from '../../../shared/api';
import { motion, AnimatePresence } from 'framer-motion';

const ReportManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        searchStudents();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setStudents([]);
    }
  }, [searchTerm]);

  const searchStudents = async () => {
    setSearching(true);
    try {
      const response = await api.get(`/students?search=${searchTerm}`);
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Error searching students:', error);
    } finally {
      setSearching(false);
    }
  };

  const fetchStudentReport = async (studentId) => {
    setLoading(true);
    try {
      const response = await api.get(`/students/${studentId}`);
      setReportData(response.data.data);
      setSelectedStudent(response.data.data);
      setSearchTerm('');
      setStudents([]);
    } catch (error) {
      console.error('Error fetching student report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 pb-20">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
          .card-print { border: 1px solid #eee !important; box-shadow: none !important; }
        }
      `}</style>

      {/* Header - Hidden on Print */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Campus Reports</h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">Institutional Audit & Student Analytics</p>
        </div>
        <div className="flex items-center gap-4">
           {selectedStudent && (
             <Button 
               onClick={handlePrint}
               variant="secondary" 
               className="!rounded-2xl h-14 !px-8 shadow-lg bg-white"
             >
               <Printer size={18} />
               Print Dossier
             </Button>
           )}
           <Button className="!rounded-2xl h-14 !px-8 shadow-xl shadow-primary/20">
             <Download size={18} />
             Export Registry
           </Button>
        </div>
      </div>

      {/* Student Selection - Hidden on Print */}
      <div className="max-w-2xl mx-auto space-y-4 no-print">
        <Card className="!p-4 border-none shadow-2xl bg-white rounded-[2rem] relative z-50">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" size={20} />
            <input 
              type="text" 
              placeholder="Search Student by Name or Roll No..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-16 bg-slate-50 border-none rounded-[1.5rem] pl-16 pr-6 text-sm font-black uppercase outline-none focus:ring-2 ring-primary/10 transition-all"
            />
            {searching && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </div>

          <AnimatePresence>
            {students.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 top-full mt-4 bg-white rounded-[2rem] shadow-2xl border border-slate-50 overflow-hidden z-50"
              >
                <div className="max-h-[300px] overflow-y-auto p-4 space-y-2 no-scrollbar">
                  {students.map((student) => (
                    <div 
                      key={student.id}
                      onClick={() => fetchStudentReport(student.id)}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl cursor-pointer group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase">{student.studentName}</p>
                          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{student.rollNo} • CLASS {student.class}-{student.section}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-foreground/10 group-hover:text-primary transition-all" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
        {!selectedStudent && !searchTerm && (
           <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 italic mt-6">Input student credentials to generate tactical report</p>
        )}
      </div>

      {/* Report Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-32 text-center"
          >
             <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Compiling Student Dossier...</p>
          </motion.div>
        ) : selectedStudent ? (
          <motion.div 
            key="report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Student Dossier Overview */}
            <Card className="!p-10 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden relative card-print">
               <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48" />
               
               <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start md:items-center">
                  <div className="w-40 h-40 bg-slate-50 rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center text-foreground/10 relative overflow-hidden shrink-0">
                     {selectedStudent.profilePhoto ? (
                       <img src={selectedStudent.profilePhoto} alt="Student" className="w-full h-full object-cover" />
                     ) : (
                       <User size={64} />
                     )}
                  </div>

                  <div className="flex-1 space-y-6">
                     <div className="space-y-2">
                        <div className="flex items-center gap-4">
                           <h2 className="text-5xl font-black uppercase tracking-tighter text-foreground">{selectedStudent.studentName}</h2>
                           <Badge variant="success" className="!px-4 !py-1.5 !rounded-xl text-[10px] uppercase font-black tracking-widest shadow-xl shadow-success/10">ACTIVE REGISTRY</Badge>
                        </div>
                        <p className="text-sm font-bold text-foreground/30 uppercase tracking-[0.4em]">Identification: {selectedStudent.rollNo} • Status: Tactical Clear</p>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 mb-1">Academic Grade</p>
                           <p className="text-lg font-black uppercase">Class {selectedStudent.class}-{selectedStudent.section}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 mb-1">Primary Guardian</p>
                           <p className="text-lg font-black uppercase">{selectedStudent.parent?.parentName || 'N/A'}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 mb-1">Assigned Transit</p>
                           <p className="text-lg font-black uppercase">{selectedStudent.bus?.busNumber || 'UNASSIGNED'}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 mb-1">Safety Index</p>
                           <div className="flex items-center gap-2">
                              <Shield className="text-success" size={18} />
                              <p className="text-lg font-black uppercase text-success">Excellent</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Contact Intelligence */}
               <Card className="!p-8 border-none shadow-2xl bg-slate-900 text-white rounded-[2.5rem] card-print">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-black uppercase tracking-tight">Guardian Intel</h3>
                     <Badge className="bg-white/10 text-white border-none">Verified</Badge>
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                           <Phone size={18} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase text-white/30">Emergency Contact</p>
                           <p className="text-sm font-black">{selectedStudent.parent?.phone || 'N/A'}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                           <MapPin size={18} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase text-white/30">Strategic Residence</p>
                           <p className="text-sm font-black uppercase truncate">{selectedStudent.address}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                           <Clock size={18} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase text-white/30">Pickup Point</p>
                           <p className="text-sm font-black uppercase">{selectedStudent.pickupPoint}</p>
                        </div>
                     </div>
                  </div>
                  <Button className="w-full mt-10 !h-14 !rounded-2xl !bg-primary !text-white text-[10px] font-black uppercase tracking-widest no-print">
                     Initiate Protocol
                  </Button>
               </Card>

               {/* Transit Metrics */}
               <Card className="lg:col-span-2 !p-10 border-none shadow-2xl bg-white rounded-[2.5rem] card-print">
                  <div className="flex items-center justify-between mb-10">
                     <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">Transit Log Analytics</h3>
                        <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mt-1">Last 7 Days Operational History</p>
                     </div>
                     <Badge variant="outline" className="!rounded-xl border-slate-100 uppercase">Archive-2024</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                     <div className="p-5 bg-slate-50 rounded-3xl border border-slate-50 text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-1">Attendance</p>
                        <p className="text-xl font-black">98.2%</p>
                     </div>
                     <div className="p-5 bg-slate-50 rounded-3xl border border-slate-50 text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-1">On-Time</p>
                        <p className="text-xl font-black">100%</p>
                     </div>
                     <div className="p-5 bg-slate-50 rounded-3xl border border-slate-50 text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-1">Alerts</p>
                        <p className="text-xl font-black text-success">0</p>
                     </div>
                     <div className="p-5 bg-slate-50 rounded-3xl border border-slate-50 text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-1">Status</p>
                        <p className="text-xl font-black text-primary">Stable</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     {[
                       { date: 'Today', morning: '07:45 AM', evening: '04:15 PM', status: 'Optimal' },
                       { date: 'Yesterday', morning: '07:42 AM', evening: '04:10 PM', status: 'Optimal' },
                       { date: '12 May', morning: '07:48 AM', evening: '04:20 PM', status: 'Optimal' },
                     ].map((log, i) => (
                       <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-6">
                             <div className="text-center w-16">
                                <p className="text-[9px] font-black uppercase text-foreground/30">{log.date}</p>
                             </div>
                             <div className="flex items-center gap-10">
                                <div className="flex items-center gap-3">
                                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                   <span className="text-xs font-black uppercase tracking-tight">{log.morning}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                   <span className="text-xs font-black uppercase tracking-tight">{log.evening}</span>
                                </div>
                             </div>
                          </div>
                          <Badge variant="success" className="!px-3 !py-1">{log.status}</Badge>
                       </div>
                     ))}
                  </div>
               </Card>
            </div>

            {/* Footer - Print Only */}
            <div className="hidden print-only mt-20 pt-10 border-t border-slate-200 text-center">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tactical Student Dossier • Generated by XTOWN Bus Tracker Enterprise • Confidential</p>
               <p className="text-[8px] font-bold text-slate-300 mt-2">Document ID: {selectedStudent.id?.toUpperCase()}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ReportManagement;
