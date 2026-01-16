import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


export const firebaseConfig = {
  apiKey: "AIzaSyBIgkNaXGC3p5j0srms401lC6XR_2Noy6U",
  authDomain: "espace-cameroun.firebaseapp.com",
  projectId: "espace-cameroun",
  storageBucket: "espace-cameroun.firebasestorage.app",
  messagingSenderId: "47497828463",
  appId: "1:47497828463:web:a732910fbde0676dae159a",
  measurementId: "G-HWV5LGV32B",
};

// Initialize Firebase
// export const firebaseApp = initializeApp(firebaseConfig);
// export const messaging = getMessaging(firebaseApp);


const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };