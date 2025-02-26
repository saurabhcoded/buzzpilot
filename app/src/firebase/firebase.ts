import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { projectEnums } from "../_constants/project_enums";

const firebaseConfig = {
  apiKey: projectEnums.firebase_apiKey,
  authDomain: projectEnums.firebase_authDomain,
  projectId: projectEnums.firebase_projectId,
  storageBucket: projectEnums.firebase_storageBucket,
  messagingSenderId: projectEnums.firebase_messagingSenderId,
  appId: projectEnums.firebase_appId,
  measurementId: projectEnums.firebase_measurementId,
};

const app = initializeApp(firebaseConfig);
export const fireAuth = getAuth(app);
export const fireDb = getFirestore(app);
export const fireStorage = getStorage(app);
export const fireAnalytics = getAnalytics(app);
