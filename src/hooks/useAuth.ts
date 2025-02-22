import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { fireAuth } from "../firebase/firebase";
import notify from "../utils/notify";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
      setUser(user);
      setLoading(false);
    });
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

  return { user, isAuthenticated, authStatusLoading: loading, handleLogout };
};
