type projectEnumsT = {
  firebase_apiKey: string;
  firebase_authDomain: string;
  firebase_projectId: string;
  firebase_storageBucket: string;
  firebase_messagingSenderId: string;
  firebase_appId: string;
  firebase_measurementId: string;
  google_clientId: string;
};

export const projectEnums: projectEnumsT = {
  firebase_apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  firebase_authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  firebase_projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  firebase_storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  firebase_messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  firebase_appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  firebase_measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
  google_clientId: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID
};
