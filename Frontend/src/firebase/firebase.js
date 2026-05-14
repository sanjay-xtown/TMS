import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, isSupported } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Messaging initialization with support check
let messaging = null;

// Initialize messaging only if supported (requires HTTPS or localhost)
const initMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      return messaging;
    }
    console.warn('[Firebase] Messaging not supported in this environment (likely due to insecure origin/IP).');
    return null;
  } catch (err) {
    console.error('[Firebase] Failed to check messaging support:', err);
    return null;
  }
};

// Async initialization export
export const getMessagingInstance = initMessaging;

const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, messaging, analytics, onMessage };
