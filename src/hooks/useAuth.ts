import { auth, googleProvider } from "@/lib/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export function useAuth() {
  const [user, loading, error] = useAuthState(auth);

  const registerWithEmail = async (email: string, password: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return credential.user;
    } catch (err: any) {
      throw new Error(err.message || "Error al registrar usuario");
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return credential.user;
    } catch (err: any) {
      throw new Error(err.message || "Error al iniciar sesión");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err: any) {
      throw new Error(err.message || "Error al iniciar sesión con Google");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      throw new Error(err.message || "Error al cerrar sesión");
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (err) {
      console.error("Error obteniendo token:", err);
      return null;
    }
  };

  return {
    user,
    loading,
    error,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
    getIdToken,
  };
}
