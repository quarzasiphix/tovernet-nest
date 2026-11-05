// Tovernet client panel push (Firebase Cloud Messaging, same Firebase project as KsięgaI).
// Lives at the site root so its scope covers /panel/. Config comes from the registration
// URL's query string (lib/tovernet/push.ts), so that file is the only place it is defined.
//
// The server sends data-only messages (ksiegai fcm.ts sendDataPushToTokens), so this worker
// renders them and owns the click: it focuses an open panel tab or opens the panel link.
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const swParams = new URL(self.location.href).searchParams;
firebase.initializeApp({
  apiKey: swParams.get('apiKey'),
  authDomain: swParams.get('authDomain'),
  projectId: swParams.get('projectId'),
  storageBucket: swParams.get('storageBucket'),
  messagingSenderId: swParams.get('messagingSenderId'),
  appId: swParams.get('appId'),
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;
  const data = payload.data || {};
  self.registration.showNotification(data.title || 'Tovernet', {
    body: data.body || '',
    icon: '/embed/tovernet-logo.png',
    badge: '/embed/tovernet-logo.png',
    tag: data.tag || undefined,
    renotify: Boolean(data.tag),
    data: { actionUrl: data.action_url || '/panel/' },
  });
});

self.addEventListener('notificationclick', (event) => {
  if (event.notification.data && event.notification.data.FCM_MSG) return;
  event.notification.close();
  // Same-origin path only: links always point at the panel.
  let path = '/panel/';
  try {
    const target = new URL((event.notification.data && event.notification.data.actionUrl) || '/panel/', self.location.origin);
    path = `${target.pathname}${target.search}${target.hash}`;
  } catch (e) {
    path = '/panel/';
  }
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (new URL(client.url).pathname.startsWith('/panel') && 'focus' in client) {
          client.postMessage({ type: 'tovernet-push-click', path });
          return client.focus();
        }
      }
      return clients.openWindow ? clients.openWindow(path) : undefined;
    }),
  );
});
