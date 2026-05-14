import React, { useEffect } from 'react';
import { onMessage, getMessagingInstance } from './firebase/firebase';
import { toast } from 'sonner';

const NotificationHandler = () => {
  useEffect(() => {
    let unsubscribe;

    const setupListener = async () => {
      const messaging = await getMessagingInstance();
      if (!messaging) return;

      // Handle foreground messages
      unsubscribe = onMessage(messaging, (payload) => {
        console.log('[NotificationHandler] Foreground message received:', payload);
        
        const { title, body } = payload.notification;
        
        // 1. Show a professional toast
        toast.success(title, {
          description: body,
          duration: 5000,
        });

        // 2. Also show native notification if permission granted (as a backup)
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/pwa-192x192.png'
          });
        }
      });
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return null;
};

export default NotificationHandler;
