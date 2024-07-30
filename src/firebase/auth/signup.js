//* Import firebase_app from config.js, signInWithEmailAndPassword, and getAuth from firebase/auth
import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

//* Initialize Firebase
const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

//* Sign up (create user)
export default async function signUp(email, password, fullName, phoneNumber, selectedCourse) {
  let result = null,
    error = null;
  try {
    //* Create user with email and password (sign up)
    result = await createUserWithEmailAndPassword(auth, email, password);
    
    //* Get user details
    const user = result.user;

    //* Store user details in Firestore
    await setDoc(doc(db, "Academy Users", user.uid), {
      email: user.email,
      user_id: user.uid,
      full_name: fullName,
      phone_number: phoneNumber,
      selected_course: selectedCourse,

    });




  } catch (e) {
    //! Handle errors here
    error = e;
  }

  return { result, error };
}
