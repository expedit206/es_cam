import { ref, onMounted } from "vue";
import { messaging, getToken, onMessage } from "../firebase";
import apiClient from "../api";

export function useNotifications() {
  const deviceToken = ref("");
  const notificationPermission = ref("default");
  const error = ref(null);
  const notification = ref();
  const vapidKey =
    "BOJsPOWGG4JxSW7h2gEut-NdbDBn7Sx1GZdJjpphvVy2Xg9aG2mwCVVKCFah_SufBZlOWSeSToY7nY8mxQIt4pc"; // Ta clé publique complète
  // Vérifier la permission actuelle
  const checkPermission = () => {
    notificationPermission.value = Notification.permission;
    return Notification.permission;
  };

  // Demander la permission
  const requestPermission = async () => {
    try {
      console.log("Requesting notification permission...");

      // Vérifier si le navigateur supporte les notifications
      if (!("Notification" in window)) {
        throw new Error("This browser does not support notifications");
      }

      // Vérifier si Firebase Messaging est supporté
      if (!messaging) {
        throw new Error("Firebase Messaging is not supported");
      }

      // Demander la permission
      const permission = await Notification.requestPermission();
      notificationPermission.value = permission;

      if (permission === "granted") {
        console.log("Notification permission granted.");
        await getDeviceToken();
      } else {
        throw new Error("Notification permission denied");
      }
    } catch (err: any) {
      console.error("Error requesting permission:", err);
      error.value = err.message;
    }
  };

  const getDeviceToken = async () => {
    try {
      console.log("Getting device token...");

      // S'assurer que le service worker est enregistré
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      console.log("Service Worker registered:", registration);

      // Attendre que le service worker soit actif
      await navigator.serviceWorker.ready;

      const currentToken = await getToken(messaging, {
        vapidKey: vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        deviceToken.value = currentToken;
        console.log("Device token:", currentToken);

        await sendTokenToBackend(currentToken);
      } else {
        throw new Error(
          "No registration token available. Check your VAPID key."
        );
      }
    } catch (err: any) {
      console.error("Error getting device token:", err);
      error.value = err.message;

      // Log supplémentaire pour debug
      if (err.message.includes("applicationServerKey")) {
        console.error("VAPID Key issue. Please verify your VAPID key format.");
        console.error("Current VAPID key:", vapidKey);
      }
    }
  };

  // Envoyer le token au backend Laravel
  const sendTokenToBackend = async (token: string | null) => {
    try {
      // const response = await fetch("/api/device-token", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "X-CSRF-TOKEN": document
      //       .querySelector('meta[name="csrf-token"]')
      //       .getAttribute("content"),
      //   },
      //   body: JSON.stringify({ device_token: token }),
      // });
      const response = await apiClient.post("/token-store", {
        device_token: token,
      });
      console.log(response.data);
 

      console.log("Token sent to backend successfully");
    } catch (err: any) {
      console.error("Error sending token to backend:", err);
      error.value = err.message;
    }
  };

  // Écouter les messages en foreground
  const setupForegroundMessages = () => {
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);
      notification.value = payload ;

      // Afficher une notification native
      if (payload.notification) {
        const { title, body } = payload.notification;
        showNativeNotification(title, body);
      }
    });
  };

  // Afficher une notification native
  const showNativeNotification = (title : any, body: any) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/icon.png", // Remplace par le chemin de ton icône
      });
    }
  };

  // Initialiser au montage du composant
  onMounted(() => {
    checkPermission();
    setupForegroundMessages();
  });

  return {
    deviceToken,
    notificationPermission,
    error,
    notification,
    requestPermission,
    checkPermission,
    getDeviceToken,
  };
}
