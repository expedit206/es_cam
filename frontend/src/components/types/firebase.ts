export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
//   measurementId: string |null;
}

export interface NotificationPayload {
  notification?: {
    title: string;
    body: string;
    image?: string;
  };
  data?: {
    [key: string]: string;
  };
}

export interface NotificationState {
  deviceToken: string | null;
  notificationPermission: NotificationPermission;
  error: string | null;
  notification: NotificationPayload | null;
}
