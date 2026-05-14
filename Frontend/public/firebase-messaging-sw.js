importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// These values are required for the background service worker
// They can be hardcoded here or passed via query params if using a build step
// For simplicity in a PWA, we usually hardcode the essential IDs
firebase.initializeApp({
  apiKey: "AIzaSyDs66mEFn8YFh_7MU9j-yDJGXUsUpyoe2Q",
  authDomain: "sbt-xtown.firebaseapp.com",
  projectId: "sbt-xtown",
  storageBucket: "sbt-xtown.firebasestorage.app",
  messagingSenderId: "111341194960",
  appId: "1:111341194960:web:1100952df465b4b483d8d5"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png', // Adjust path as needed
    badge: '/pwa-192x192.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
