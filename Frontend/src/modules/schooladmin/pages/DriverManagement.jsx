import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  CreditCard, 
  ShieldCheck, 
  MoreVertical,
  Edit2,
  Trash2,
  Bus,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../../shared/components/ui';

const DriverManagement = () => {
  const [drivers] = useState([
    { id: 1, name: 'S. Raja', empId: 'DRV001', phone: '+91 90000 12345', license: 'TN3820240001', bus: 'T-02', status: 'On Route', rating: 4.8 },
    { id: 2, name: 'M. Mani', empId: 'DRV002', phone: '+91 90000 12346', license: 'TN3820240002', bus: 'T-05', status: 'On Break', rating: 4.5 },
    { id: 3, name: 'P. Selvam', empId: 'DRV003', phone: '+91 90000 12347', license: 'TN3820240003', bus: 'T-08', status: 'Offline', rating: 4.9 },
    { id: 4, name: 'K. Kumar', empId: 'DRV004', phone: '+91 90000 12348', license: 'TN3820240004', bus: 'T-12', status: 'On Route', rating: 4.7 },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Transit Captains</h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">Driver Workforce & Certification Management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {drivers.map((driver) => (
          <Card key={driver.id} className="p-8 space-y-6 group">
            <div className="flex justify-between items-start">
               <div className="relative">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                     <User size={32} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-4 border-white flex items-center justify-center">
                     <CheckCircle2 size={10} className="text-white" />
                  </div>
               </div>
               <Badge variant={driver.status === 'On Route' ? 'success' : 'outline'}>{driver.status}</Badge>
            </div>

            <div>
               <h4 className="text-xl font-black tracking-tight text-foreground uppercase leading-none">{driver.name}</h4>
               <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-2">ID: {driver.empId}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
               <div className="flex items-center gap-3">
                  <Phone size={14} className="text-primary/40" />
                  <span className="text-xs font-bold text-foreground/60">{driver.phone}</span>
               </div>
               <div className="flex items-center gap-3">
                  <CreditCard size={14} className="text-primary/40" />
                  <span className="text-xs font-bold text-foreground/60 uppercase">{driver.license}</span>
               </div>
               <div className="flex items-center gap-3">
                  <Bus size={14} className="text-primary/40" />
                  <span className="text-xs font-black uppercase text-primary">Bus {driver.bus}</span>
               </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
               <div className="flex items-center gap-1">
                  <span className="text-lg font-black">{driver.rating}</span>
                  <span className="text-[10px] font-bold text-foreground/20 uppercase">Rating</span>
               </div>
               <div className="flex gap-1">
                  <button className="p-2 hover:bg-primary/10 rounded-lg text-foreground/20 hover:text-primary transition-all">
                     <Edit2 size={16} />
                  </button>
                  <button className="p-2 hover:bg-foreground/10 rounded-lg text-foreground/20 hover:text-foreground transition-all">
                     <MoreVertical size={16} />
                  </button>
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DriverManagement;
