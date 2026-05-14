import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  'English (US)': {
    home: 'Home',
    trips: 'Trips',
    tracking: 'Live Map',
    profile: 'Profile',
    bus_info: 'Bus Info',
    notifications: 'Alerts',
    settings: 'Settings',
    search: 'Search...',
    driver: 'Driver',
    speed: 'Speed',
    distance: 'Distance',
    upcoming: 'Upcoming',
    completed: 'Completed',
    morning: 'Morning',
    evening: 'Evening',
    logout: 'Logout',
    student_details: 'Student Details',
    app_settings: 'App Settings',
    privacy: 'Privacy & Security',
    help: 'Help & Support',
    morning_pickup: 'Morning Pickup',
    evening_drop: 'Evening Drop'
  },
  'Hindi': {
    home: 'होम',
    trips: 'यात्राएं',
    tracking: 'लाइव मैप',
    profile: 'प्रोफ़ाइल',
    bus_info: 'बस जानकारी',
    notifications: 'अलर्ट',
    settings: 'सेटिंग्स',
    search: 'खोजें...',
    driver: 'ड्राइवर',
    speed: 'गति',
    distance: 'दूरी',
    upcoming: 'आगामी',
    completed: 'पूरा हुआ',
    morning: 'सुबह',
    evening: 'शाम',
    logout: 'लॉगआउट',
    student_details: 'छात्र विवरण',
    app_settings: 'ऐप सेटिंग्स',
    privacy: 'गोपनीयता और सुरक्षा',
    help: 'सहायता और समर्थन',
    morning_pickup: 'सुबह की पिकअप',
    evening_drop: 'शाम की ड्रॉप'
  },
  'Tamil': {
    home: 'முகப்பு',
    trips: 'பயணங்கள்',
    tracking: 'நேரலை வரைபடம்',
    profile: 'சுயவிவரம்',
    bus_info: 'பேருந்து தகவல்',
    notifications: 'அறிவிப்புகள்',
    settings: 'அமைப்புகள்',
    search: 'தேடல்...',
    driver: 'ஓட்டுநர்',
    speed: 'வேகம்',
    distance: 'தூரம்',
    upcoming: 'வரவிருக்கும்',
    completed: 'முடிந்தது',
    morning: 'காலை',
    evening: 'மாலை',
    logout: 'வெளியேறு',
    student_details: 'மாணவர் விவரங்கள்',
    app_settings: 'பயன்பாட்டு அமைப்புகள்',
    privacy: 'தனியுரிமை மற்றும் பாதுகாப்பு',
    help: 'உதவி மற்றும் ஆதரவு',
    morning_pickup: 'காலை பிக்கப்',
    evening_drop: 'மாலை டிராப்'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('app-language') || 'English (US)');

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['English (US)'];
    return langDict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
