import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  Bus, 
  AlertTriangle, 
  Clock, 
  History,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../../shared/components/ui';

const NotificationManagement = () => {
  const [activeTab, setActiveTab] = useState('Compose');
  const [history] = useState([
    { id: 1, title: 'Bus T-02 Delay', target: 'Parents (T-02)', date: 'May 13, 10:00 AM', status: 'Sent', type: 'Delay' },
    { id: 2, title: 'Morning Pickup Started', target: 'All Parents', date: 'May 13, 07:00 AM', status: 'Sent', type: 'Status' },
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Broadcast Center</h1>
        <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">Multi-Channel Notification & Alert Management</p>
      </div>

      <div className="flex gap-4">
         {['Compose', 'Scheduled', 'Sent History'].map((tab) => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/40 text-foreground/40 hover:bg-white/60'}`}
           >
             {tab}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Compose Area */}
         <div className="lg:col-span-2 space-y-6">
            <Card className="p-10 space-y-8">
               <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tight">Craft New Broadcast</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Notification Type</label>
                        <select className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-4 text-sm font-bold outline-none uppercase">
                           <option>General Announcement</option>
                           <option>Transit Delay Alert</option>
                           <option>Emergency Broadcast</option>
                           <option>Holiday Update</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Target Audience</label>
                        <select className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-4 text-sm font-bold outline-none uppercase">
                           <option>All Parents</option>
                           <option>Specific Bus Route</option>
                           <option>All Drivers</option>
                           <option>Custom List</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Message Subject</label>
                     <input 
                        type="text" 
                        placeholder="e.g., Tactical Update: Bus T-02 Routine"
                        className="w-full bg-foreground/5 border border-border rounded-xl px-6 py-4 text-sm font-bold outline-none"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Detailed Message Content</label>
                     <textarea 
                        rows="6"
                        placeholder="Enter the critical mission details here..."
                        className="w-full bg-foreground/5 border border-border rounded-xl px-6 py-4 text-sm font-bold outline-none resize-none"
                     ></textarea>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row gap-4 pt-6">
                  <Button className="flex-1 h-16 !rounded-2xl !text-sm !tracking-widest shadow-xl shadow-primary/20">
                     <Send size={20} />
                     Dispatch Now
                  </Button>
                  <Button variant="secondary" className="flex-1 h-16 !rounded-2xl !text-sm !tracking-widest">
                     <Clock size={20} />
                     Schedule Session
                  </Button>
               </div>
            </Card>
         </div>

         {/* Sidebar - Quick Alerts */}
         <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tight ml-2">Tactical Presets</h2>
            <Card className="p-8 space-y-6">
               <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">One-Click Presets</p>
               <div className="space-y-4">
                  {[
                    { label: 'Bus Breakdown', icon: AlertTriangle, color: 'text-error bg-error/10' },
                    { label: 'Heavy Rain Delay', icon: Clock, color: 'text-blue-500 bg-blue-500/10' },
                    { label: 'School Holiday', icon: Bell, color: 'text-primary bg-primary/10' },
                  ].map((preset, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-border hover:bg-foreground/[0.05] transition-all group">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${preset.color}`}>
                             <preset.icon size={20} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-tight">{preset.label}</span>
                       </div>
                       <Send size={16} className="text-foreground/20 group-hover:text-primary transition-colors" />
                    </button>
                  ))}
               </div>
            </Card>

            <Card className="p-8 space-y-6">
               <h3 className="text-sm font-black uppercase tracking-tight">Broadcast Health</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">FCM Server</span>
                     <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Push Queue</span>
                     <span className="text-xs font-bold">0 Pending</span>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default NotificationManagement;
