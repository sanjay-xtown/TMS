import React from 'react';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';

const Header = ({ title, subtitle, rightElement }) => {
  return (
    <div className="px-6 pt-8 pb-4 sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-4 h-[2px] bg-primary rounded-full" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 leading-none">
              {subtitle}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none"
          >
            {title && title.includes(',') ? (
              <>
                <span>{title.split(',')[0]}</span>
                <span className="text-primary">{title.split(',')[1]}</span>
              </>
            ) : (
              title
            )}
          </motion.h1>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {rightElement || (
             <div className="w-10 h-10 bg-card rounded-[18px] border border-border flex items-center justify-center shadow-sm relative group active:scale-95 transition-all">
                <Map size={18} className="text-primary group-hover:scale-110 transition-transform" />
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse" />
             </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Header;
