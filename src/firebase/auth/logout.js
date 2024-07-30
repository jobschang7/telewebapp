import { getAuth, signOut } from 'firebase/auth';
import firebase_app from '../config';

const auth = getAuth(firebase_app);

const logout = async () => {
  try {
    await signOut(auth);
    console.log("Sign out successful");
  } catch (error) {
    console.error("Sign out error:", error);
  }
};

export default logout;
