import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signIn from "../firebase/auth/signin";
import FormControls from "./FormControl";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCheckmarkCircle, IoWarningOutline } from "react-icons/io5";
import Spinner from "./Spinner";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const LoginComp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate();
  const [errorCode, setErrorCode] = useState("");


  const handleForm = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorCode("Please enter both email and password.");
      return;
    }

    setLoading(true);

    const { result, error } = await signIn(email, password);

    if (error) {
      setLoading(false);
      setErrorCode("Incorrect login details!");
      return console.log(error);
    }

    // Check user role immediately after successful sign-in
    const db = getFirestore();
    const userRef = doc(db, "users", result.user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === "admin") {
        setErrorCode("");
        setSuccessMessage("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboardAdx/stats");
        }, 2000); // Redirect after 2 seconds
      } else {
        setLoading(false);
        setErrorCode("Access denied: Admins only.");
      }
    } else {
      setLoading(false);
      setErrorCode("User data not found.");
    }
  };


  return (
    <>
    {successMessage ? 
        (
            <Spinner/>
        ) : (
            <div className="form-wrapper flex flex-col items-start">
            <div className="w-full text-center pb-4">
              <h1 className="text-[24px] sm:text-[28px] font-medium pb-1">
                Welcome Back
              </h1>
              <p className="text-[#b0b0b0] text-[14px] sm:text-[13px] font-light">
                Enter your email and password to login
              </p>
            </div>
            <div className="w-full flex flex-col items-center space-y-3 sm:space-y-4">
              <FormControls
                label="Email"
                type="email"
                id="email"
                placeholder="Your email"
                value={email}
                setValue={setEmail}
              />
              <FormControls
                label="Password"
                type="password"
                id="password"
                placeholder="**********"
                value={password}
                setValue={setPassword}
              />
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center space-y-6 sm:space-y-4 w-full sm:w-[47%]">
                  <button
                    className="bg-[#ffffff] uppercase hover:bg-[#c2fa7c] w-full ease-in duration-300 text-[#000] text-[15px] justify-center text-center font-medium h-[50px] border-none outline-none rounded-[12px] flex items-center px-6"
                    onClick={handleForm}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        Logging in
                        <AiOutlineLoading3Quarters
                          size={18}
                          className="animate-spin ml-[12px]"
                        />
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </div>
            </div>
      

          </div>

        )
    }
                {errorCode && (
              <div className="z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4 top-6">
                <div className="w-full text-[#ff4d4d] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">
                  <IoWarningOutline size={16} />
                  <span className="text-[15px]">{errorCode}</span>
                </div>
              </div>
            )}
      
            {successMessage && (
              <div className="z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4 top-6">
                <div className="w-full text-[#4dff4d] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">
                  <IoCheckmarkCircle size={16} />
                  <span className="text-[15px]">{successMessage}</span>
                </div>
              </div>
            )}
</>
  );
};

export default LoginComp;
