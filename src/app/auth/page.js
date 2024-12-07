"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { PiEyeThin, PiEyeSlashThin } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { handleSignup, handleLogin } from "@/lib/auth";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onChange' // Validate on input change
  });

  // Watch password to compare in confirm password validation
  const password = watch("password");

  const validateForm = (data) => {
    const validationErrors = {};

    // Email validation
    if (!data.email) {
      validationErrors.email = { type: 'required', message: 'Email is required' };
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      validationErrors.email = { type: 'pattern', message: 'Invalid email format' };
    }

    // Password validation
    if (!data.password) {
      validationErrors.password = { type: 'required', message: 'Password is required' };
    } else if (data.password.length < 8) {
      validationErrors.password = { type: 'minLength', message: 'Password must be at least 8 characters' };
    }

    // Confirm password validation (only for signup)
    if (isSignUp) {
      if (!data.confirmPassword) {
        validationErrors.confirmPassword = { type: 'required', message: 'Please confirm your password' };
      } else if (data.password !== data.confirmPassword) {
        validationErrors.confirmPassword = { type: 'validate', message: 'Passwords do not match' };
      }
    }

    return validationErrors;
  };

  const onSubmit = async (data) => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Additional client-side validation
    const formErrors = validateForm(data);
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (isSignUp) {
        const {user,error} = await handleSignup(data.email, data.password, dispatch);
        if(!error || user){
          
          setIsSignupSuccessful(true);
          setEmail(data.email);
          reset();
        }
      } else {
        await handleLogin(data.email, data.password, dispatch);
        // Optional: Add redirect or further action on successful login
      }
    } catch (error) {
      // More detailed error handling
      const errorMsg = error.message || 
        (isSignUp 
          ? "Signup failed. Please try again." 
          : "Login failed. Check your credentials.");
      
      setErrorMessage(errorMsg);
      setIsSignupSuccessful(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage("");
    reset(); // Reset form when switching modes
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">SEO Engine</h1>

      <div className="w-[450px] bg-white shadow-lg rounded-lg p-6">
        {isSignupSuccessful ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              Verification Email Sent!
            </h2>
            <p className="text-gray-600">
              A verification email has been sent to{" "}
              <span className="font-medium text-gray-800">{email}</span>. 
              Please check your inbox to verify your account.
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
            <h2 className="text-xl font-semibold mb-4 text-center">
              {isSignUp ? "New Here? Let's Get You Started!" : "Welcome Back!"}
            </h2>

            {errorMessage && (
              <div 
                className="bg-red-50 border border-red-200 text-red-700 
                           px-4 py-3 rounded mb-4 text-center"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* Email Input */}
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-md px-3 h-[50px]">
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-grow focus:outline-none"
                    {...register("email")}
                  />
                  <CiMail size={20} className="text-gray-500" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-md px-3 h-[50px]">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="flex-grow focus:outline-none"
                    {...register("password")}
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Input (Signup Only) */}
              {isSignUp && (
                <div className="relative">
                  <div className="flex items-center border border-gray-300 rounded-md px-3 h-[50px]">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="flex-grow focus:outline-none"
                      {...register("confirmPassword")}
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white font-medium py-2 rounded-md mt-4 
                  ${isSubmitting 
                    ? 'bg-yellow-400 cursor-not-allowed' 
                    : 'bg-primaryYellow hover:bg-yellow-600'
                  }`}
              >
                {isSubmitting 
                  ? (isSignUp ? "Signing Up..." : "Logging In...") 
                  : (isSignUp ? "Sign Up" : "Log In")
                }
              </button>
            </form>

            {/* Social Login Section */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-500">
                or {isSignUp ? "Sign Up" : "Log In"} with
              </span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <div className="flex justify-between">
              <button 
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
            </div>

            {/* Switch between Login and Signup */}
            <div className="text-center mt-4 text-gray-600">
              <p>
                {isSignUp ? "Have an account?" : "Don't have an account?"}{" "}
                <span
                  className="text-blue-500 font-medium cursor-pointer"
                  onClick={toggleAuthMode}
                >
                  {isSignUp ? "Log In Now" : "Sign Up Now"}
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}