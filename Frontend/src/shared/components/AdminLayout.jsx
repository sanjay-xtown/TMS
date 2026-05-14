import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  LogOut, 
  ChevronRight, 
  Sun, 
  Moon,
  Bell,
  Search,
  User
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui';

const AdminLayout = ({ children, menuItems, role = 'Admin' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col glass border-r border-border transition-all duration-300 z-50 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-4 h-24 shrink-0">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h2 className="text-lg font-black tracking-tight leading-none uppercase">{role}</h2>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mt-1">Bus Tracker</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative
                ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'}
              `}
            >
              <item.icon size={20} className="shrink-0" />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-bold text-sm tracking-tight whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isSidebarOpen && item.badge && (
                <span className="ml-auto bg-white/20 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-foreground text-background text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-border mt-auto">
          <Button 
            variant="ghost" 
            className="w-full !justify-start !px-4"
            onClick={() => navigate('/')}
          >
            <LogOut size={20} className="text-error" />
            {isSidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
          </Button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-foreground/40 hover:text-primary transition-colors"
          >
            <ChevronRight className={`transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 shrink-0 border-b border-border glass flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-foreground/60 hover:text-primary transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-foreground/5 px-4 py-2 rounded-xl border border-border w-96">
            <Search size={18} className="text-foreground/30" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-foreground/30"
            />
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-foreground/5 text-foreground/60 transition-all"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-foreground/5 text-foreground/60 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-background"></span>
            </button>

            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-border">
              <div className="hidden md:block text-right">
                <p className="text-xs font-black uppercase tracking-tight leading-none">Admin User</p>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">{role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 no-scrollbar pb-32">
          {children || <Outlet />}
        </div>
      </main>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-background z-[70] flex flex-col border-r border-border"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-xl">S</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight uppercase leading-none">{role}</h2>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">Dashboard</p>
                  </div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} className="text-foreground/60" />
                </button>
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-4 px-4 py-4 rounded-2xl transition-all
                      ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/60 hover:bg-foreground/5'}
                    `}
                  >
                    <item.icon size={22} />
                    <span className="font-bold text-base tracking-tight">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="p-6 border-t border-border">
                <Button variant="danger" className="w-full !rounded-2xl" onClick={() => navigate('/')}>
                  <LogOut size={20} />
                  Sign Out
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
