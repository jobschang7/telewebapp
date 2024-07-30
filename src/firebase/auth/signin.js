// firebase/auth/signin.js

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase_app from "../config";

const auth = getAuth(firebase_app);

const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { result: userCredential, error: null };
  } catch (error) {
    return { result: null, error };
  }
};

export default signIn;
