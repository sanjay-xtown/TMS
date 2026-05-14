import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Shield, 
  UserPlus, 
  Key, 
  ToggleLeft, 
  MoreVertical,
  Mail,
  Building,
  Activity
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../../shared/components/ui';
import api from '../../../shared/api';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'school_admin',
    schoolId: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await api.get('/schools');
      setSchools(response.data.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/auth/admins');
      setAdmins(response.data.data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Admin Management</h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">Control Access & Manage School Administrators</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="!rounded-2xl h-14 !px-8 shadow-xl shadow-primary/20"
        >
          <UserPlus size={20} />
          Create Admin Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-6">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Shield size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Total Admins</p>
            <h4 className="text-2xl font-black">128</h4>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-6">
          <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center text-success">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Active Now</p>
            <h4 className="text-2xl font-black">24</h4>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-6">
          <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center text-warning">
            <Key size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Pending Access</p>
            <h4 className="text-2xl font-black">3</h4>
          </div>
        </Card>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="w-full md:w-96 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
             <input 
               type="text" 
               placeholder="Search by name or email..." 
               className="w-full bg-foreground/5 border-none rounded-xl pl-12 py-3 text-sm font-medium outline-none"
             />
           </div>
           <Badge variant="outline" className="h-10 px-4">All Schools Selected</Badge>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-foreground/[0.02] border-b border-border">
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Administrator</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Assigned School</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Status</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Last Activity</th>
                <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Synchronizing Security Credentials...</p>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">No administrative accounts found</p>
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="group hover:bg-foreground/[0.01] transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xs">
                          {admin.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight">{admin.name}</p>
                          <div className="flex items-center gap-2 text-foreground/40">
                            <Mail size={10} />
                            <span className="text-[10px] font-bold">{admin.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Building size={14} className="text-primary/40" />
                       <p className="text-xs font-bold text-foreground/60 uppercase">{admin.school?.schoolName || 'Platform Global'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant={admin.role === 'superadmin' ? 'success' : 'secondary'}>{admin.role}</Badge>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-foreground/30 uppercase tracking-widest">
                    {admin.lastLogin}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-primary/10 rounded-lg text-foreground/20 hover:text-primary transition-all" title="Reset Password">
                        <Key size={18} />
                      </button>
                      <button className="p-2 hover:bg-primary/10 rounded-lg text-foreground/20 hover:text-primary transition-all" title="Deactivate">
                        <ToggleLeft size={18} />
                      </button>
                      <button className="p-2 hover:bg-foreground/10 rounded-lg text-foreground/20 hover:text-foreground transition-all">
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

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-foreground/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <Card className="!p-12 space-y-10 relative overflow-hidden !bg-white !border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
               
               <div className="relative z-10">
                  <h3 className="text-4xl font-black uppercase tracking-tighter text-foreground">Create Identity</h3>
                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-[0.3em] mt-2">Assign administrative access</p>
               </div>

               <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSubmitting(true);
                    try {
                      await api.post('/auth/register-admin', formData);
                      setIsModalOpen(false);
                      setFormData({ name: '', email: '', password: '', role: 'school_admin', schoolId: '' });
                      fetchAdmins();
                      alert('Admin account created successfully!');
                    } catch (error) {
                      console.error('Registration failed:', error);
                      alert(error.response?.data?.message || 'Failed to create admin');
                    } finally {
                      setSubmitting(false);
                    }
                  }} 
                  className="space-y-6 relative z-10"
               >
                  <Input 
                    label="Full Name" 
                    placeholder="Enter admin name"
                    className="!bg-slate-50 !border-slate-200 !h-14"
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input 
                    label="Email Address" 
                    type="email" 
                    placeholder="admin@school.com"
                    className="!bg-slate-50 !border-slate-200 !h-14"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input 
                    label="Access Password" 
                    type="password" 
                    placeholder="Create a strong password"
                    className="!bg-slate-50 !border-slate-200 !h-14"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">Assigned School</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-14 text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none"
                      required
                      value={formData.schoolId}
                      onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                    >
                      <option value="" className="bg-white">Select an Institution</option>
                      {schools.map(school => (
                        <option key={school.id} value={school.id} className="bg-white">
                          {school.schoolName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-4 pt-6">
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
                        {submitting ? 'Creating...' : 'Grant Access'}
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

export default AdminManagement;
