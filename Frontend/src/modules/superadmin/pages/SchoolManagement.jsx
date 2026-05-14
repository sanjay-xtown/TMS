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
  ExternalLink,
  Eye
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
    longitude: '',
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSchoolId, setCurrentSchoolId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      // Don't send empty admin fields on edit
      if (isEditing) {
        delete payload.adminName;
        delete payload.adminEmail;
        delete payload.adminPassword;
        await api.put(`/schools/${currentSchoolId}`, payload);
        alert('School updated successfully!');
      } else {
        await api.post('/schools', payload);
        alert('School registered with primary admin successfully!');
      }

      setIsModalOpen(false);
      resetForm();
      fetchSchools();
    } catch (error) {
      console.error('Operation failed:', error);
      alert(error.response?.data?.message || 'Failed to process request');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      schoolName: '',
      address: '',
      phone: '',
      email: '',
      principalName: '',
      latitude: '',
      longitude: '',
      adminName: '',
      adminEmail: '',
      adminPassword: ''
    });
    setIsEditing(false);
    setCurrentSchoolId(null);
  };

  const handleEdit = (school) => {
    setFormData({
      schoolName: school.schoolName,
      address: school.address,
      phone: school.phone,
      email: school.email,
      principalName: school.principalName || '',
      latitude: school.latitude || '',
      longitude: school.longitude || '',
      adminName: '',
      adminEmail: '',
      adminPassword: ''
    });
    setCurrentSchoolId(school.id);
    setIsEditing(true);
    setIsDetailsOpen(false);
    setIsModalOpen(true);
    setExpandedRow(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this institution? This action is irreversible.')) {
      try {
        await api.delete(`/schools/${id}`);
        fetchSchools();
        setIsDetailsOpen(false);
        alert('School deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete school');
      }
    }
    setExpandedRow(null);
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = 
      school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (school.principalName && school.principalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      school.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Active' && (school.status === 'Active' || !school.status)) ||
      (statusFilter === 'Inactive' && school.status === 'Inactive');

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSchools.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-foreground/5 border-none rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none focus:ring-1 ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 bg-foreground/5 border-none rounded-xl px-6 text-xs font-black uppercase outline-none focus:ring-1 ring-primary/20 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
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
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Administrator</th>
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
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">No matching schools found</p>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((school) => (
                    <tr 
                      key={school.id} 
                      className="group hover:bg-foreground/[0.01] transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedSchool(school);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl shadow-inner">
                            <SchoolIcon size={24} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-black uppercase tracking-tight group-hover:text-primary transition-colors underline decoration-dotted underline-offset-4 decoration-primary/30">{school.schoolName}</p>
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
                    {school.admins && school.admins.length > 0 ? (
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-tight">{school.admins[0].name}</p>
                        <p className="text-[10px] font-bold text-foreground/30">{school.admins[0].email}</p>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-foreground/20 uppercase">No Admin</span>
                    )}
                  </td>
                  <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {expandedRow === school.id ? (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2"
                        >
                          <button 
                            className="p-2.5 hover:bg-primary/10 rounded-xl text-primary transition-all shadow-sm"
                            title="Edit School"
                            onClick={() => handleEdit(school)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="p-2.5 hover:bg-error/10 rounded-xl text-error transition-all shadow-sm"
                            title="Delete School"
                            onClick={() => handleDelete(school.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                          <button 
                            className="p-2.5 hover:bg-foreground/5 rounded-xl text-foreground/40 transition-all"
                            onClick={() => setExpandedRow(null)}
                          >
                            <Plus size={16} className="rotate-45" />
                          </button>
                        </motion.div>
                      ) : (
                        <button 
                          onClick={() => setExpandedRow(school.id)}
                          className="p-2.5 bg-foreground/5 hover:bg-primary/10 rounded-xl text-foreground/20 hover:text-primary transition-all group/eye"
                          title="View Actions"
                        >
                          <Eye size={18} className="group-hover/eye:scale-110 transition-transform" />
                        </button>
                      )}
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
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSchools.length)} of {filteredSchools.length} Entries
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              className="!px-4 !py-2 !rounded-lg text-xs" 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page}
                onClick={() => paginate(page)}
                className={`w-10 h-10 rounded-lg text-xs font-black transition-all ${currentPage === page ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-foreground/5 text-foreground/60'}`}
              >
                {page}
              </button>
            ))}

            <Button 
              variant="secondary" 
              className="!px-4 !py-2 !rounded-lg text-xs"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
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
            <Card className="!p-6 space-y-4 relative overflow-hidden !bg-white !border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]">
               <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-3xl" />
               
               <div className="relative z-10">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-foreground">
                    {isEditing ? 'Update Institution' : 'Onboard New Institution'}
                  </h3>
               </div>

               <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  <Input 
                    label="School Name" 
                    placeholder="Enter school name"
                    className="!bg-slate-50 !border-slate-200 !h-12 text-xs"
                    required 
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  />
                  <Input 
                    label="Principal Name" 
                    placeholder="Head of institution"
                    className="!bg-slate-50 !border-slate-200 !h-12 text-xs"
                    required
                    value={formData.principalName}
                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  />
                  <div className="md:col-span-2">
                    <Input 
                      label="Full Address" 
                      placeholder="Street, City, State, Zip"
                      className="!bg-slate-50 !border-slate-200 !h-12 text-xs"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <Input 
                    label="Contact Email" 
                    type="email" 
                    placeholder="admin@school.com"
                    className="!bg-slate-50 !border-slate-200 !h-12 text-xs"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input 
                    label="Phone Number" 
                    placeholder="+91 XXXXX XXXXX"
                    className="!bg-slate-50 !border-slate-200 !h-12 text-xs"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input 
                    label="Latitude (Optional)" 
                    type="number" 
                    step="any"
                    placeholder="11.0123"
                    className="!bg-slate-50 !border-slate-200 !h-12 text-xs"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  />
                  <Input 
                    label="Longitude (Optional)" 
                    type="number" 
                    step="any"
                    placeholder="76.9876"
                    className="!bg-slate-50 !border-slate-200 !h-12 text-xs"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  />

                  {!isEditing && (
                    <div className="md:col-span-2 space-y-4 pt-2">
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-100" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Admin Access</span>
                        <div className="h-px flex-1 bg-slate-100" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                          label="Admin Name" 
                          placeholder="Administrator's name"
                          className="!bg-slate-50 !border-slate-200 !h-12 text-xs"
                          required={!isEditing}
                          value={formData.adminName}
                          onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                        />
                        <Input 
                          label="Admin Email" 
                          type="email"
                          placeholder="admin.login@school.com"
                          className="!bg-slate-50 !border-slate-200 !h-12 text-xs"
                          required={!isEditing}
                          value={formData.adminEmail}
                          onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                        />
                        <div className="md:col-span-2">
                          <Input 
                            label="Initial Password" 
                            type="password"
                            placeholder="••••••••"
                            className="!bg-slate-50 !border-slate-200 !h-12 text-xs"
                            required={!isEditing}
                            value={formData.adminPassword}
                            onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="md:col-span-2 flex gap-3 pt-4">
                     <Button 
                        type="button" 
                        variant="secondary" 
                        className="flex-1 !h-12 !rounded-xl !bg-slate-100 !text-slate-600 uppercase font-black tracking-widest text-[10px]"
                        onClick={() => setIsModalOpen(false)}
                        disabled={submitting}
                     >
                        Cancel
                     </Button>
                     <Button 
                        type="submit" 
                        className="flex-1 !h-12 !rounded-xl !bg-[#A3D139] hover:!bg-[#92C44E] !text-white uppercase font-black tracking-widest text-[10px] shadow-lg shadow-[#A3D139]/20"
                        disabled={submitting}
                     >
                        {submitting ? '...' : isEditing ? 'Update' : 'Complete'}
                     </Button>
                  </div>
               </form>
            </Card>
          </motion.div>
        </div>
      )}
      {/* Details Popup */}
      {isDetailsOpen && selectedSchool && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-foreground/60 backdrop-blur-xl">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 40 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="w-full max-w-lg"
           >
              <Card className="!p-0 overflow-hidden !bg-white border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)]">
                 <div className="bg-primary/5 p-10 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary font-black text-3xl shadow-inner mb-6">
                       <SchoolIcon size={40} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">{selectedSchool.schoolName}</h3>
                    <Badge variant={selectedSchool.status === 'Inactive' ? 'error' : 'success'} className="mt-2">
                       {selectedSchool.status || 'Active'}
                    </Badge>
                 </div>

                 <div className="p-10 space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Principal</p>
                          <p className="text-sm font-bold">{selectedSchool.principalName || 'Not Assigned'}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Contact Email</p>
                          <p className="text-sm font-bold">{selectedSchool.email}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Phone Number</p>
                          <p className="text-sm font-bold">{selectedSchool.phone}</p>
                       </div>
                       <div className="col-span-2 space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Location Address</p>
                          <p className="text-sm font-bold uppercase tracking-tight">{selectedSchool.address}</p>
                       </div>
                    </div>

                    {selectedSchool.admins && selectedSchool.admins.length > 0 && (
                       <div className="pt-6 border-t border-slate-100">
                          <div className="flex items-center gap-4 mb-6">
                             <div className="h-px flex-1 bg-slate-100" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Administrative Control</span>
                             <div className="h-px flex-1 bg-slate-100" />
                          </div>
                          <div className="grid grid-cols-2 gap-8">
                             <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Primary Admin</p>
                                <p className="text-sm font-bold">{selectedSchool.admins[0].name}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Login Identity</p>
                                <p className="text-sm font-bold">{selectedSchool.admins[0].email}</p>
                             </div>
                          </div>
                       </div>
                    )}

                    <Button 
                      variant="secondary" 
                      className="w-full !h-14 !rounded-xl text-xs uppercase font-black tracking-widest mt-4"
                      onClick={() => setIsDetailsOpen(false)}
                    >
                       Close Details
                    </Button>
                 </div>
              </Card>
           </motion.div>
        </div>
      )}
    </div>
  );
};

export default SchoolManagement;
