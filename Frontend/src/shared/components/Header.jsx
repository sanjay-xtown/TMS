import React from 'react';
import { motion } from 'framer-motion';

const Header = ({ title, subtitle, rightElement }) => {
  return (
    <div className="bg-white px-6 pt-16 pb-6 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-gray-50">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{subtitle}</p>
        <h1 className="text-black text-2xl font-black tracking-tight">{title}</h1>
      </motion.div>
      
      {rightElement && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {rightElement}
        </motion.div>
      )}
    </div>
  );
};

export default Header;
