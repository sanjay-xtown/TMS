import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  Settings,
  Bell,
  MoreVertical,
  CheckCircle,
  XCircle,
  Link
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../../shared/components/ui';
import api from '../../../shared/api';

const ParentManagement = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      const response = await api.get('/parents');
      setParents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching parents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Parent Directory</h1>
        <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">Guardian Accounts & Communication Hub</p>
      </div>

      <Card className="!p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
          <input 
            type="text" 
            placeholder="Search parents by name, email or phone..." 
            className="w-full bg-foreground/5 border-none rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none"
          />
        </div>
        <Button variant="secondary" className="!rounded-xl h-12">
          <Filter size={18} />
          Status
        </Button>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-foreground/[0.02] border-b border-border">
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Guardian Identity</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Contact Info</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Linked Student</th>
                <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">App Status</th>
                <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Synchronizing Parent Registry...</p>
                  </td>
                </tr>
              ) : parents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">No guardian accounts found</p>
                  </td>
                </tr>
              ) : (
                parents.map((parent) => (
                  <tr key={parent.id} className="group hover:bg-foreground/[0.01] transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs uppercase">
                          {parent.name?.[0] || 'P'}
                        </div>
                        <p className="text-sm font-black uppercase tracking-tight">{parent.name || 'Unknown Guardian'}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/60">
                          <Mail size={12} className="text-primary/40" />
                          {parent.email || 'No Email'}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/60">
                          <Phone size={12} className="text-primary/40" />
                          {parent.mobileNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <Link size={14} className="text-primary/40" />
                         <span className="text-xs font-black uppercase text-foreground/80">
                           {parent.children?.map(c => c.studentName).join(', ') || 'None Linked'}
                         </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                         <Badge variant={parent.fcmToken ? 'success' : 'outline'}>{parent.fcmToken ? 'App Linked' : 'No App'}</Badge>
                         <span className="text-[8px] font-black uppercase tracking-[0.2em] text-foreground/20">FCM Status</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2.5 hover:bg-primary/10 rounded-xl text-foreground/20 hover:text-primary transition-all">
                          <Bell size={18} />
                        </button>
                        <button className="p-2.5 hover:bg-primary/10 rounded-xl text-foreground/20 hover:text-primary transition-all">
                          <Settings size={18} />
                        </button>
                        <button className="p-2.5 hover:bg-foreground/10 rounded-xl text-foreground/20 hover:text-foreground transition-all">
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
    </div>
  );
};

export default ParentManagement;
