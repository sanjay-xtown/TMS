import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './shared/context/LanguageContext';
import { ThemeProvider } from './shared/context/ThemeContext';
import { Toaster } from 'sonner';
import NotificationHandler from './NotificationHandler';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <div className="min-h-screen select-none">
            <Toaster position="top-center" richColors />
            <NotificationHandler />
            <AnimatePresence mode="wait">
              <AppRoutes />
            </AnimatePresence>
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
