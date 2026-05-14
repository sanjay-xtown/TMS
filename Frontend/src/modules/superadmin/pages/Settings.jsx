import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Globe, 
  Bell, 
  Lock, 
  Palette, 
  Database, 
  Cpu,
  Save,
  RefreshCcw,
  User,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  School,
  Ban,
  CheckCircle,
  Search
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../../shared/components/ui';
import api from '../../../shared/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('General');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [schools, setSchools] = useState([]);
  const [fetchingSchools, setFetchingSchools] = useState(false);

  const [settings, setSettings] = useState({
    appName: 'XTOWN School Tracker',
    contactEmail: 'support@xtown.com',
    maintenanceMode: false,
    autoBackup: true,
    notificationEmails: true,
    smsAlerts: false,
    theme: 'Enterprise Dark',
    apiKey: 'xt_live_4492_fa19_8e21_c154'
  });

  const fetchSchools = async () => {
    setFetchingSchools(true);
    try {
      const response = await api.get('/schools');
      console.log(`[Settings] Received ${response.data?.data?.length} institutions.`);
      setSchools(response.data.data || []);
    } catch (error) {
      console.error('[Settings] Critical API failure during school retrieval:', error);
      alert('Network Error: Unable to access institution registry.');
    } finally {
      setFetchingSchools(false);
    }
  };

  const toggleSchoolStatus = async (schoolId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await api.patch(`/schools/${schoolId}/status`, { status: newStatus });
      setSchools(schools.map(s => s.id === schoolId ? { ...s, status: newStatus } : s));
    } catch (error) {
      alert('Failed to update school status');
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (activeTab === 'Governance') {
      fetchSchools();
    }
  }, [activeTab]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Platform configurations synchronized successfully!');
    }, 1500);
  };

  const tabs = [
    { id: 'General', icon: Globe },
    { id: 'School Access', icon: School },
    { id: 'Security', icon: Shield },
    { id: 'Notifications', icon: Bell },
    { id: 'Database', icon: Database },
    { id: 'Profile', icon: User }
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase leading-none">System Settings</h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-3">Manage App Settings & Schools</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="!rounded-2xl h-14 !px-10 shadow-xl shadow-primary/20"
        >
          {saving ? <RefreshCcw className="animate-spin" /> : <Save size={20} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Rail */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 p-5 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-2' : 'bg-white text-foreground/40 hover:bg-slate-50'}`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-primary'} />
              <span className="text-xs font-black uppercase tracking-widest">{tab.id}</span>
            </button>
          ))}
          
          <div className="mt-10 p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
             <Cpu size={32} className="text-primary mb-4" />
             <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">System Health</p>
             <p className="text-sm font-bold">Node V20.12.0</p>
             <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-[9px] font-black uppercase text-success">Optimized</span>
             </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-9">
          <Card className="!p-10 border-none shadow-2xl bg-white min-h-[600px]">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-12"
             >
                {/* General Settings */}
                {activeTab === 'General' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <Input 
                         label="Platform Name" 
                         value={settings.appName}
                         onChange={(e) => setSettings({...settings, appName: e.target.value})}
                         className="!h-14 !bg-slate-50"
                       />
                       <Input 
                         label="Contact Support Email" 
                         value={settings.contactEmail}
                         onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                         className="!h-14 !bg-slate-50"
                       />
                    </div>
                    
                    <div className="space-y-6">
                       <h3 className="text-lg font-black uppercase tracking-tight text-foreground/60 border-b border-slate-50 pb-4">App Settings</h3>
                       <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                                <RefreshCcw size={20} />
                             </div>
                             <div>
                                <p className="text-sm font-black uppercase">Maintenance Mode</p>
                                <p className="text-[10px] font-bold text-foreground/30">Disable public access during system upgrades</p>
                             </div>
                          </div>
                          <button 
                            onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                            className={`w-14 h-8 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-amber-500' : 'bg-slate-200'}`}
                          >
                             <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                          </button>
                       </div>
                    </div>
                  </>
                )}

                {/* Security Settings */}
                {activeTab === 'Security' && (
                  <div className="space-y-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">Enterprise API Key</label>
                        <div className="relative group">
                           <input 
                             type={showPassword ? 'text' : 'password'}
                             value={settings.apiKey}
                             readOnly
                             className="w-full h-14 bg-slate-900 text-primary font-mono text-sm px-6 rounded-2xl border-none outline-none"
                           />
                           <button 
                             onClick={() => setShowPassword(!showPassword)}
                             className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                           >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="!bg-slate-50 border-none !p-6 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <Lock className="text-primary" size={20} />
                              <span className="text-xs font-black uppercase tracking-widest">Two-Factor Auth</span>
                           </div>
                           <Badge variant="outline">Recommended</Badge>
                        </Card>
                        <Card className="!bg-slate-50 border-none !p-6 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <Palette className="text-primary" size={20} />
                              <span className="text-xs font-black uppercase tracking-widest">Branding Lock</span>
                           </div>
                           <Badge variant="success">Active</Badge>
                        </Card>
                     </div>
                  </div>
                )}

                {/* Profile Settings */}
                {activeTab === 'Profile' && (
                  <div className="space-y-10">
                     <div className="flex items-center gap-8 border-b border-slate-50 pb-10">
                        <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl">
                           SA
                        </div>
                        <div>
                           <h3 className="text-2xl font-black uppercase tracking-tight">Super Administrator</h3>
                           <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest mt-1">Platform Identity Node • Active Session</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Input label="Display Name" defaultValue="Super Admin" className="!h-14 !bg-slate-50" />
                        <Input label="Work Email" defaultValue="superadmin@example.com" className="!h-14 !bg-slate-50" />
                        <Input label="Phone Number" defaultValue="+91 98765 43210" className="!h-14 !bg-slate-50" />
                        <div className="flex items-end pb-1">
                           <Button variant="secondary" className="w-full !h-14 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest">Update Credentials</Button>
                        </div>
                     </div>
                  </div>
                )}

                {/* Database Settings */}
                {activeTab === 'Database' && (
                  <div className="space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <StatItem label="Storage Usage" value="4.2 GB / 20 GB" progress={21} />
                        <StatItem label="Connection Load" value="84 / 1000" progress={8.4} />
                     </div>

                     <div className="p-8 bg-slate-900 rounded-3xl space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <RefreshCcw className="text-primary" size={18} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Automated Backups</span>
                           </div>
                           <Badge variant="success">Every 6 Hours</Badge>
                        </div>
                        <Button className="w-full !h-14 !bg-white !text-slate-900 !rounded-xl !text-[10px] !font-black !uppercase">Trigger Manual Snapshot</Button>
                     </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === 'Notifications' && (
                   <div className="space-y-6">
                      <ToggleItem 
                        title="Emergency SMS Alerts" 
                        desc="Broadcast critical safety alerts to all active administrators" 
                        active={settings.smsAlerts} 
                        icon={Smartphone}
                        onToggle={() => setSettings({...settings, smsAlerts: !settings.smsAlerts})}
                      />
                      <ToggleItem 
                        title="Weekly Performance Reports" 
                        desc="Auto-generate and email institution performance summaries" 
                        active={settings.notificationEmails} 
                        icon={Mail}
                        onToggle={() => setSettings({...settings, notificationEmails: !settings.notificationEmails})}
                      />
                   </div>
                )}

                {/* Governance Settings */}
                {activeTab === 'School Access' && (
                  <div className="space-y-10">
                    <div className="flex justify-between items-end">
                       <div>
                          <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Manage Schools</h3>
                          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mt-1">Block or Unblock schools registered on the app</p>
                       </div>
                       <div className="relative w-72">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={14} />
                          <input type="text" placeholder="Search schools..." className="w-full h-12 bg-slate-50 rounded-xl pl-12 pr-4 text-[9px] font-black uppercase outline-none" />
                       </div>
                    </div>

                    <div className="space-y-4">
                       {fetchingSchools ? (
                         <div className="py-20 flex flex-col items-center justify-center text-foreground/20 gap-4">
                            <RefreshCcw className="animate-spin" size={32} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Schools...</p>
                         </div>
                       ) : schools.length === 0 ? (
                         <div className="py-20 text-center text-[10px] font-bold text-foreground/20 uppercase tracking-widest">No Schools Found</div>
                       ) : (
                         schools.map((school) => (
                           <div key={school.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-primary/20 transition-all">
                              <div className="flex items-center gap-6">
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${school.status === 'active' ? 'bg-primary' : 'bg-slate-400'}`}>
                                    <School size={24} />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black uppercase tracking-tight">{school.schoolName}</p>
                                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mt-1">{school.email}</p>
                                    <Badge variant={school.status === 'active' ? 'success' : 'error'} className="mt-2 !text-[8px] !px-3">
                                       {school.status === 'active' ? 'Active Access' : 'Access Revoked'}
                                    </Badge>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <div className="text-right mr-4 hidden md:block">
                                    <p className="text-[9px] font-black uppercase text-foreground/30">Action</p>
                                    <p className="text-[11px] font-bold text-foreground/60">{school.status === 'active' ? 'Revoke Access' : 'Grant Access'}</p>
                                 </div>
                                 <button 
                                   onClick={() => toggleSchoolStatus(school.id, school.status)}
                                   className={`w-14 h-8 rounded-full transition-all relative ${school.status === 'active' ? 'bg-primary' : 'bg-slate-300'}`}
                                 >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${school.status === 'active' ? 'left-7' : 'left-1'}`} />
                                 </button>
                              </div>
                           </div>
                         ))
                       )}
                    </div>
                  </div>
                )}
             </motion.div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ToggleItem = ({ title, desc, active, onToggle, icon: Icon }) => (
  <div className="flex items-center justify-between p-8 bg-slate-50 rounded-3xl border border-slate-100/50 hover:border-primary/20 transition-all">
    <div className="flex items-center gap-6">
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${active ? 'bg-primary text-white shadow-lg' : 'bg-white text-foreground/20 shadow-sm'}`}>
          <Icon size={24} />
       </div>
       <div>
          <p className="text-sm font-black uppercase tracking-tight">{title}</p>
          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mt-1">{desc}</p>
       </div>
    </div>
    <button 
      onClick={onToggle}
      className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-primary' : 'bg-slate-200'}`}
    >
       <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

const StatItem = ({ label, value, progress }) => (
  <div className="space-y-4">
     <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{label}</span>
        <span className="text-sm font-bold">{value}</span>
     </div>
     <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(136,176,75,0.3)]"
        />
     </div>
  </div>
);

export default Settings;
