const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const { getStorage } = require("firebase/storage");
const fireAdmin = require("firebase-admin");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const fireAuth = getAuth(app);
const fireDb = getFirestore(app);
const fireStorage = getStorage(app);
fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(
    JSON.parse(process.env.FIREBASE_ADMIN_APIKEY)
  ),
});

module.exports = {
  fireAuth,
  fireDb,
  fireStorage,
  fireAdmin,
};
