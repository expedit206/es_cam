import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.espacecameroun.redirect",
  appName: "EspaceCM",
  webDir: "dist",

  server: {
    androidScheme: "https",
    // Désactiver l'intercepteur pour les domaines approuvés
    allowNavigation: ["api.espacecameroun.com"],
  },
  plugins: {
    CapacitorHttp: {
      enabled: false, // Désactiver l'intercepteur HTTP
    },
    GoogleSignIn: {
      scopes: ["profile", "email"],
      serverClientId:
        "47497828463-h4d7vi0ha3nioop5c2nreoj720nsaofi.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
