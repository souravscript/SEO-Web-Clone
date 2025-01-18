"use client";

import { useEffect, useState } from "react";
import { PiEyeThin, PiEyeSlashThin } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { handleSignup, handleLogin } from "@/lib/auth";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
//import { redirect } from "next/dist/server/api-utils";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedinUser,setLoggedinUser]=useState({})
  const dispatch=useDispatch()
  const router=useRouter()

  // Validation state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const validationErrors = { email: "", password: "", confirmPassword: "" };
    let isValid = true;

    // Email validation
    if (!email) {
      validationErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!password) {
      validationErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Confirm password validation (only for signup)
    if (isSignUp) {
      if (!confirmPassword) {
        validationErrors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (password !== confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(validationErrors);
    return isValid;
  };
  const oAuthHandler=()=>{
    handleSignInWithGoogle(dispatch)
  }
  const onSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    // Validate the form
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (isSignUp) {
        const { user, error } = await handleSignup(email, password);
        if (!error || user) {
          setIsSignupSuccessful(true);
          setEmail(email);
          setPassword("");
          setConfirmPassword("");
        }
      } else {
        await handleLogin(email, password,dispatch);
        router.push('/')
        //setLoggedinUser(user)
        // Optional: Add redirect or further action on successful login
        
      }
    } catch (error) {
      setErrorMessage(
        error.message || (isSignUp ? "Signup failed. Please try again." : "Login failed. Check your credentials.")
      );
      setIsSignupSuccessful(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({ email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <h1 className="text-2xl absolute top-[8rem] font-bold">SEO Engine</h1>
      <h2 className="text-3xl font-semibold mb-4 text-center">
              {isSignUp ? "New Here? Let's Get You Started!" : "Welcome Back!"}
            </h2>
      <div className="w-[450px] rounded-lg p-6">
        {isSignupSuccessful ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              Verification Email Sent!
            </h2>
            <p className="text-gray-600">
              A verification email has been sent to{" "}
              <span className="font-medium text-gray-800">{email}</span>.
              Please check your inbox to verify your account.
              <span>If verified then <Link href="/auth"><span>Login here</span></Link></span>
            </p>
            <button
              onClick={() => setIsSignupSuccessful(false)}
              className="mt-4 text-blue-500 hover:underline"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>

            {errorMessage && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 
                           px-4 py-3 rounded mb-4 text-center"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-md px-3 h-[50px]">
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-grow bg-gray-50 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <CiMail size={20} className="text-gray-500" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-md px-3 h-[50px]">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="flex-grow bg-gray-50 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {showPassword ? (
                    <PiEyeSlashThin
                      size={20}
                      className="text-gray-500 cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <PiEyeThin
                      size={20}
                      className="text-gray-500 cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Input (Signup Only) */}
              {isSignUp && (
                <div className="relative">
                  <div className="flex items-center border border-gray-300 rounded-md px-3 h-[50px]">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="flex-grow bg-gray-50 focus:outline-none"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {showConfirmPassword ? (
                      <PiEyeSlashThin
                        size={20}
                        className="text-gray-500 cursor-pointer"
                        onClick={() => setShowConfirmPassword(false)}
                      />
                    ) : (
                      <PiEyeThin
                        size={20}
                        className="text-gray-500 cursor-pointer"
                        onClick={() => setShowConfirmPassword(true)}
                      />
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-[50px] text-white font-medium py-2 rounded-md mt-4 
                  ${isSubmitting
                    ? "bg-yellow-400 cursor-not-allowed"
                    : "bg-tabColor hover:bg-yellow-600"
                  }`}
              >
                {isSubmitting
                  ? isSignUp
                    ? "Signing Up..."
                    : "Logging In..."
                  : isSignUp
                  ? "Sign Up"
                  : "Log In"}
              </button>
            </form>

            {/* Social Login Section */}
            {/* <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-500">
                or {isSignUp ? "Sign Up" : "Log In"} with
              </span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <div className="flex justify-between">
              <button
                onClick={oAuthHandler}
                type="button"
                className="flex items-center border border-gray-300 rounded-md px-4 py-2 w-[45%] hover:bg-gray-100"
              >
                <FcGoogle size={20} className="mr-2" />
                Google
              </button>
              <button
                type="button"
                className="flex items-center border border-gray-300 rounded-md px-4 py-2 w-[45%] hover:bg-gray-100"
              >
                <FaFacebook size={20} className="text-blue-600 mr-2" />
                Facebook
              </button>
            </div> */}

            {/* Toggle Auth Mode */}
            <div className="mt-4 text-center">
              <span className="text-[#A3A3A3] font-sans text-sm">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  onClick={toggleAuthMode}
                  className="text-blue-500 font-medium hover:underline"
                >
                  {isSignUp ? "Log In" : "Sign Up"}
                </button>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
