importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBIgkNaXGC3p5j0srms401lC6XR_2Noy6U",
  authDomain: "espace-cameroun.firebaseapp.com",
  projectId: "espace-cameroun",
  storageBucket: "espace-cameroun.firebasestorage.app",
  messagingSenderId: "47497828463",
  appId: "1:47497828463:web:a732910fbde0676dae159a",
  measurementId: "G-HWV5LGV32B",
});

const messaging = firebase.messaging();

// Gestion des messages en background
messaging.onBackgroundMessage((payload) => {
  console.log("📱 Notification reçue en background:", payload);

  const notificationTitle = payload.notification?.title || "Espace Cameroun";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/src/assets/images/logo.png",
    badge: "/src/assets/images/logo.png",
    image: payload.notification?.image,
    data: payload.data || {},
    actions: [
      {
        action: "open",
        title: "Ouvrir",
      },
      {
        action: "close",
        title: "Fermer",
      },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gestion du clic sur la notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === "open" || action === "") {
    const urlToOpen = data?.action_url || "/";

    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        // Vérifier si une fenêtre est déjà ouverte
        for (let client of windowClients) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }

        // Ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});
