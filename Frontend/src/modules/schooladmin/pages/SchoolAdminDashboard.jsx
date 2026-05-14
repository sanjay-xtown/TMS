import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Bus, 
  MapPin, 
  Navigation, 
  Clock, 
  UserCheck, 
  AlertTriangle,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Card, Badge, Button } from '../../../shared/components/ui';
import api from '../../../shared/api';

const SchoolAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    busFleet: 0,
    activeTrips: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/school-admin');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching school stats:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Campus Transit Hub</h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">{user?.name || 'School Admin'} • Operational Command</p>
        </div>
        <div className="flex items-center gap-3 bg-white/40 glass p-2 rounded-2xl border border-border">
          <Calendar size={18} className="text-primary ml-2" />
          <span className="text-[10px] font-black uppercase tracking-widest px-4 border-l border-border py-2">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Enrolled Students', value: loading ? '...' : stats.totalStudents, icon: Users, color: 'text-blue-500' },
          { label: 'Active Fleet', value: loading ? '...' : stats.busFleet, icon: Bus, color: 'text-primary' },
          { label: 'In Transit Now', value: loading ? '...' : stats.activeTrips, icon: Navigation, color: 'text-purple-500' },
          { label: 'Alerts Pending', value: '0', icon: AlertTriangle, color: 'text-success' },
        ].map((stat, i) => (
          <Card key={i} className="p-6 relative group cursor-pointer hover:border-primary/20 transition-all">
             <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded-xl bg-foreground/[0.03] ${stat.color}`}>
                 <stat.icon size={24} />
               </div>
               <Badge variant="outline">Live</Badge>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">{stat.label}</p>
             <h4 className="text-2xl font-black">{stat.value}</h4>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Map Preview Placeholder */}
        <Card className="!p-0 h-[500px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-foreground/5 animate-pulse" />
          {/* Mock Map UI */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <MapPin size={40} className="text-primary animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest">Fleet Monitoring Live</p>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-2">8 Buses currently on active routes</p>
              </div>
              <Button onClick={() => window.location.href='/schooladmin/tracking'} className="!rounded-xl h-12 !px-8">Enter Tracking Command Center</Button>
            </div>
          </div>
          <div className="absolute top-6 left-6 z-10 glass p-4 rounded-2xl border border-border">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-success rounded-full pulse-live" />
                <span className="text-[10px] font-black uppercase tracking-widest">All Systems Nominal</span>
             </div>
          </div>
        </Card>

        {/* Recent Notifications & Alerts */}
        <div className="space-y-6">
          <Card className="p-8 space-y-6">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-black uppercase tracking-tight">Active Alerts</h3>
               <button className="text-primary text-[10px] font-black uppercase tracking-widest">Mark All Read</button>
            </div>
            <div className="space-y-4">
               {[
                 { title: 'Bus T-08 Delay', desc: 'Heavy traffic at Race Course junction. Delayed by 15 mins.', time: '5m ago', color: 'bg-warning' },
                 { title: 'Replacement Sync', desc: 'Student transfer from T-02 to T-15 completed.', time: '12m ago', color: 'bg-primary' },
                 { title: 'Emergency Alert', desc: 'No active emergencies recorded.', time: 'Stable', color: 'bg-success' },
               ].map((alert, i) => (
                 <div key={i} className="flex gap-4 p-4 rounded-2xl bg-foreground/[0.03] border border-border group hover:bg-foreground/[0.05] transition-all">
                    <div className={`w-1.5 rounded-full ${alert.color}`} />
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-black uppercase tracking-tight">{alert.title}</p>
                          <span className="text-[9px] font-bold text-foreground/30 uppercase">{alert.time}</span>
                       </div>
                       <p className="text-[11px] font-bold text-foreground/60 leading-relaxed uppercase">{alert.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </Card>

          <Card className="p-8 bg-primary text-white overflow-hidden relative group cursor-pointer">
             <div className="absolute right-[-10%] bottom-[-10%] opacity-10 rotate-12 transition-transform duration-700 group-hover:scale-110">
                <Navigation size={200} />
             </div>
             <div className="relative z-10 space-y-6">
                <div>
                   <h4 className="text-2xl font-black uppercase tracking-tighter">Emergency Broadcast</h4>
                   <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mt-2">Send instant alerts to parents and drivers</p>
                </div>
                <Button variant="secondary" className="!bg-white !text-primary !rounded-xl !px-10 h-14">
                   Launch Alert System
                   <ArrowRight size={18} />
                </Button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;
