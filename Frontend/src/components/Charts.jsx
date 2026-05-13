import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const TrendChart = ({ data }) => {
  return (
    <div className="chart-card" style={{ minWidth: 0 }}>
      <div className="chart-header">
        <h3>Weekly Activity Trend</h3>
        <select style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>
      <div style={{ height: '300px', width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const DistributionChart = ({ data }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="chart-card" style={{ minWidth: 0 }}>
      <div className="chart-header">
        <h3>Distribution</h3>
      </div>
      <div style={{ height: '300px', width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
