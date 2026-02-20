import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import "./assets/css/main.css";
import router from "./router/";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import apiClient from "./api/index";
import { createHead } from "@vueuse/head";

import { i18n } from "./utils/language/index.ts";

// Initialiser la langue au démarrage
i18n.init();



// Fonction pour générer l'URL de base dynamiquement
const getBaseUrl = () => {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:8000";
  }
  return "https://api.espacecameroun.com";
};

// Configurer axios
apiClient.defaults.headers.common["Accept"] = "application/json";
const token = localStorage.getItem("token");
if (token) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Configurer Echo pour Pusher
window.Pusher = Pusher;
window.Echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: import.meta.env.VITE_API_URL.includes("https"),
  enabledTransports: ["ws", "wss"],
  authEndpoint: `${getBaseUrl()}/broadcasting/auth`, // URL dynamique
  auth: {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  },
});

window.Echo.connector.pusher.connection.bind("connected", () => {
//  //console.log("✅ Connecté à Pusher");
});
window.Echo.connector.pusher.connection.bind("error", (err) => {
//  console.error("❌ Erreur Pusher:", err);
});


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js") // Path to your Service Worker file
      .then((registration) => {
        //console.log(
        //   "Service Worker registered with scope:",
        //   registration.scope
        // );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
// Boot Vue
library.add(fas);
const head = createHead();
const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());

app.use(head);
app.use(router);
app.use(Toast);
app.mount("#app");
