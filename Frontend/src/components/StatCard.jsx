import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, color, trend, trendValue }) => {
  return (
    <motion.div 
      className="stat-card"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={`stat-icon-box ${color}`}>
        {icon}
      </div>
      <div className="stat-info">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
        {trend && (
          <div className={`trend ${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '4px' }}>from yesterday</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
