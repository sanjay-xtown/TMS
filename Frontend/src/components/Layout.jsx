import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/App.css';

const Layout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Layout;
