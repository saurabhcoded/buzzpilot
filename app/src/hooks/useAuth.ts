import { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { fireAuth, fireDb } from "../firebase/firebase";
import notify from "../utils/notify";
import { doc, getDoc } from "firebase/firestore";
const provider = new GoogleAuthProvider();

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      fireAuth,
      async (user): Promise<void> => {
        let userData = user;
        try {
          let userDbDoc = doc(fireDb, "users", user?.uid);
          let userDetailData = await getDoc(userDbDoc);
          if (userDetailData.exists()) {
            Object.assign(userData, { details: userDetailData.data() });
            // userData.details = ;
          }
          const userToken = await userData.getIdToken();
          localStorage.setItem("authToken", userToken);
          setUser(userData);
          setLoading(false);
        } catch (Error) {
          console.error(Error);
          localStorage.removeItem("authToken");
          setUser(null);
          setLoading(false);
        }
      }
    );
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(fireAuth);
      notify.success("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      notify.error("Error logging out:");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(fireAuth, provider);
      return { status: true, user: result.user };
    } catch (err) {
      return { status: false, error: err };
    }
  };

  return {
    user,
    isAuthenticated,
    authStatusLoading: loading,
    handleLogout,
    signInWithGoogle,
  };
};
