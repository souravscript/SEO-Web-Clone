"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { PiEyeThin } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { handleSignup, handleLogin } from "@/lib/auth"; // Import your handler functions
import { redirect } from "next/dist/server/api-utils";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and signup
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false); // Success state
  const [email, setEmail] = useState(""); // Track email for the message
  const [errorMessage, setErrorMessage] = useState(""); // Track error message
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password, confirmPassword } = data;

    setEmail(email);
    setErrorMessage(""); // Clear any previous error messages

    if (isSignUp && password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      if (isSignUp) {
        const user = await handleSignup(email, password, dispatch);
        if (user) {
          setIsSignupSuccessful(true);
        }
      } else {
        const user=await handleLogin(email, password, dispatch);
        // No need to handle redirection here as it's handled in handleLogin
        if(user){
          redirect("/")
        }
      }
    } catch (error) {
      setErrorMessage(error.message || (isSignUp ? "Signup failed" : "Login failed. Please check your credentials."));
      setIsSignupSuccessful(false);
    }
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
              <span className="font-medium text-gray-800">{email}</span>. Please
              check your inbox to verify your account.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              {isSignUp
                ? "New Here? Let’s Get You Started!"
                : "Welcome Back!"}
            </h2>

            {errorMessage && (
              <p className="text-red-500 text-center mb-2">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="flex items-center border border-gray-300 rounded-md px-3 h-[50px]">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-grow focus:outline-none"
                  {...register("email", { required: "Email is required" })}
                />
                <CiMail size={20} className="text-gray-500" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}

              <div className="flex items-center border border-gray-300 rounded-md px-3 h-[50px]">
                <input
                  type="password"
                  placeholder="Password"
                  className="flex-grow focus:outline-none"
                  {...register("password", { required: "Password is required" })}
                />
                <PiEyeThin size={20} className="text-gray-500" />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}

              {isSignUp && (
                <div className="flex items-center border border-gray-300 rounded-md px-3 h-[50px]">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="flex-grow focus:outline-none"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                    })}
                  />
                  <PiEyeThin size={20} className="text-gray-500" />
                </div>
              )}
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-primaryYellow text-white font-medium py-2 rounded-md mt-4 hover:bg-yellow-600"
              >
                {isSignUp ? "Sign Up" : "Log In"}
              </button>
            </form>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-500">
                or {isSignUp ? "Sign Up" : "Log In"} with
              </span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <div className="flex justify-between">
              <button className="flex items-center border border-gray-300 rounded-md px-4 py-2 w-[45%] hover:bg-gray-100">
                <FcGoogle size={20} className="mr-2" />
                Google
              </button>
              <button className="flex items-center border border-gray-300 rounded-md px-4 py-2 w-[45%] hover:bg-gray-100">
                <FaFacebook size={20} className="text-blue-600 mr-2" />
                Facebook
              </button>
            </div>

            <div className="text-center mt-4 text-gray-600">
              <p>
                {isSignUp ? "Have an account?" : "Don't have an account?"}{" "}
                <span
                  className="text-blue-500 font-medium cursor-pointer"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMessage(""); // Clear errors when toggling
                  }}
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