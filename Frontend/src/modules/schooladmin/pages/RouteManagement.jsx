import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Navigation, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Clock, 
  Bus,
  ArrowRight
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../../shared/components/ui';

const RouteManagement = () => {
  const [routes] = useState([
    { id: 1, name: 'North Loop - Race Course', stops: 12, distance: '15 KM', time: '45 Mins', bus: 'T-02', status: 'Active' },
    { id: 2, name: 'South Loop - Gandhipuram', stops: 8, distance: '10 KM', time: '30 Mins', bus: 'T-05', status: 'Active' },
    { id: 3, name: 'East Express - Peelamedu', stops: 15, distance: '18 KM', time: '55 Mins', bus: 'T-08', status: 'Active' },
    { id: 4, name: 'West Loop - RS Puram', stops: 10, distance: '12 KM', time: '40 Mins', bus: 'T-12', status: 'Active' },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Route Optimization</h1>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-[0.3em] mt-1">Network Planning & Stop Management</p>
        </div>
        <Button className="!rounded-2xl h-14 !px-8 shadow-xl shadow-primary/20">
          <Plus size={20} />
          Design New Route
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {routes.map((route) => (
          <Card key={route.id} className="!p-8 group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                     <Navigation size={28} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black uppercase tracking-tight">{route.name}</h3>
                     <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mt-1">Transit Corridor</p>
                  </div>
               </div>
               <Badge variant="success">{route.status}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-foreground/[0.02] rounded-3xl border border-border">
               <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-1">Stops</p>
                  <p className="text-lg font-black">{route.stops}</p>
               </div>
               <div className="text-center border-x border-border">
                  <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-1">Distance</p>
                  <p className="text-lg font-black">{route.distance}</p>
               </div>
               <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-1">Duration</p>
                  <p className="text-lg font-black">{route.time}</p>
               </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                     <Bus size={18} />
                  </div>
                  <span className="text-sm font-black uppercase text-foreground/60">Assigned: {route.bus}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Button variant="secondary" className="!px-4 !py-2 !rounded-xl text-xs">Manage Stops</Button>
                  <button className="p-3 hover:bg-foreground/10 rounded-xl text-foreground/20 hover:text-foreground transition-all">
                     <MoreVertical size={20} />
                  </button>
               </div>
            </div>
          </Card>
        ))}

        <Card className="border-dashed border-2 border-border flex flex-col items-center justify-center text-center p-10 gap-4 hover:bg-foreground/[0.02] transition-all cursor-pointer group">
           <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/20 group-hover:text-primary group-hover:bg-primary/10 transition-all">
              <MapPin size={32} />
           </div>
           <div>
              <p className="text-base font-black uppercase tracking-tight">Expand Transit Network</p>
              <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">Map new student pickup clusters</p>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default RouteManagement;
