import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus } from 'lucide-react';
import { ROUTES } from '../../config/routes';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(ROUTES.LOGIN);
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

      {/* Logo Container */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-24 h-24 bg-primary rounded-[28px] flex items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.3)]">
          <Bus size={48} color="black" strokeWidth={2.5} />
        </div>
        
        <div className="text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white text-3xl font-black tracking-tighter"
          >
            SCHOOL BUS
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-primary font-bold tracking-[0.3em] text-xs mt-1"
          >
            TRACKING SYSTEM
          </motion.p>
        </div>
      </motion.div>

      {/* Loading Indicator */}
      <div className="absolute bottom-16 w-32 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-full h-full bg-primary shadow-[0_0_10px_#FACC15]"
        />
      </div>

      <p className="absolute bottom-8 text-gray-500 text-[10px] font-medium tracking-widest uppercase">
        Premium Student Transport
      </p>
    </motion.div>
  );
};

export default SplashScreen;
