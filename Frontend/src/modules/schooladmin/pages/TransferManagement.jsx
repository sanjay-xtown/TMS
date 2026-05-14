import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Bus, 
  User, 
  ShieldAlert,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Card, Button, Badge } from '../../../shared/components/ui';

const TransferManagement = () => {
  const [transfers] = useState([
    { id: 1, type: 'Emergency', student: 'Arjun Sarja', from: 'T-02', to: 'T-15', reason: 'Bus Breakdown', status: 'Completed', time: '10:30 AM' },
    { id: 2, type: 'Permanent', student: 'Meera Jasmine', from: 'T-05', to: 'T-08', reason: 'Address Change', status: 'Pending', time: 'Today' },
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Transfer Control</h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">Manage Student Transit Reassignments & Emergencies</p>
        </div>
        <Button className="!rounded-2xl h-14 !px-8 shadow-xl shadow-primary/20">
          <Plus size={20} />
          New Transfer Request
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Active Transfers List */}
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight ml-2">Recent Session Transfers</h2>
            {transfers.map((t) => (
              <Card key={t.id} className="!p-8 group hover:border-primary/20 transition-all">
                 <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-4">
                       <div className="flex items-center gap-3">
                          <Badge variant={t.type === 'Emergency' ? 'error' : 'warning'}>{t.type}</Badge>
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{t.time}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black">
                             {t.student[0]}
                          </div>
                          <div>
                             <h4 className="text-lg font-black uppercase tracking-tight">{t.student}</h4>
                             <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">Manual Reassignment</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-6 bg-foreground/[0.02] p-6 rounded-3xl border border-border">
                       <div className="text-center">
                          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-2">From</p>
                          <Badge variant="outline" className="!bg-white">Bus {t.from}</Badge>
                       </div>
                       <ArrowLeftRight size={24} className="text-primary animate-pulse" />
                       <div className="text-center">
                          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-2">To</p>
                          <Badge variant="success">Bus {t.to}</Badge>
                       </div>
                    </div>

                    <div className="text-right space-y-4">
                       <Badge variant={t.status === 'Completed' ? 'success' : 'outline'}>{t.status}</Badge>
                       <div className="flex items-center justify-end gap-2">
                          <Button variant="secondary" className="!p-3 !rounded-xl">
                             <ChevronRight size={18} />
                          </Button>
                       </div>
                    </div>
                 </div>
              </Card>
            ))}
         </div>

         {/* Emergency Sidebar */}
         <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tight ml-2">Breakdown Protocol</h2>
            <Card className="p-8 bg-error text-white space-y-8 relative overflow-hidden group">
               <div className="absolute right-[-10%] top-[-10%] opacity-10 rotate-12 transition-transform duration-700 group-hover:scale-110">
                  <ShieldAlert size={180} />
               </div>
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                     <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Emergency Hub</h3>
                  <p className="text-sm font-bold text-white/60 uppercase tracking-widest mt-2 leading-relaxed">Instantly redirect all students from a disabled bus to an active replacement.</p>
               </div>
               <Button className="!bg-white !text-error !rounded-2xl h-14 w-full relative z-10 !shadow-2xl">
                  Initiate Bulk Transfer
               </Button>
            </Card>

            <Card className="p-8 space-y-6">
               <h3 className="text-sm font-black uppercase tracking-tight">Active Replacement Fleet</h3>
               <div className="space-y-4">
                  {[
                    { id: 'T-15', status: 'Available', cap: 50 },
                    { id: 'T-18', status: 'Busy', cap: 35 },
                  ].map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.03] border border-border">
                       <div className="flex items-center gap-3">
                          <Bus size={18} className="text-primary" />
                          <span className="text-xs font-black uppercase">Bus {b.id}</span>
                       </div>
                       <Badge variant={b.status === 'Available' ? 'success' : 'outline'}>{b.cap} Seats</Badge>
                    </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default TransferManagement;
