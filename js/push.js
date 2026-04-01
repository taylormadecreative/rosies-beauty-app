/* =====================================================
   ROSIE'S BEAUTY SPA — PUSH NOTIFICATIONS
   FCM registration, token management, permissions
   ===================================================== */

const Push = {
  currentToken: null,

  async init(userId) {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.log('[Push] Not supported in this browser');
      return;
    }

    if (!VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY === 'YOUR_VAPID_PUBLIC_KEY') {
      console.log('[Push] VAPID key not configured — skipping push registration');
      return;
    }

    const profile = App.currentProfile;
    if (!profile) return;

    const hasAnyNotifEnabled = profile.notification_prefs &&
      Object.values(profile.notification_prefs).some(v => v === true);
    if (!hasAnyNotifEnabled) {
      console.log('[Push] All notifications disabled in user prefs');
      return;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { console.log('[Push] Permission denied'); return; }
    }
    if (Notification.permission !== 'granted') { console.log('[Push] Permission not granted'); return; }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: Push._urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      const token = JSON.stringify(subscription);
      this.currentToken = token;
      const platform = Push._detectPlatform();
      await SupabaseData.savePushToken(userId, token, platform);
      console.log('[Push] Token saved');
    } catch (err) {
      console.error('[Push] Registration failed:', err);
    }
  },

  _detectPlatform() {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
    if (/Android/.test(ua)) return 'android';
    return 'web';
  },

  _urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
};

const VAPID_PUBLIC_KEY = 'BOfwyd54KDeYFRZZgvRuYVTvuWa69klFJVN0J_sujbbHZSgF-U8rnHiyKoAnfSnotHal27D-eQXpP-YTz3bho8Q';
