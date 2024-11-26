"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { PiEyeThin } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { handleLogin, handleSignup,  } from "@/lib/auth"; // Import your handler functions
import { redirect } from "next/navigation";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true); // State to toggle between Sign Up and Login
  const dispatch = useDispatch(); // Redux dispatch
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // react-hook-form

  const onSubmit = async (data) => {
    const { email, password, confirmPassword } = data;

    if (isSignUp && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    
      if (isSignUp) {
        const user = await handleSignup(email, password, dispatch);
        if (user) alert("Signup successful!");
      } else {
        const user = await handleLogin(email, password, dispatch);
        if (user) alert("Login successful!");
      }
    
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">SEO Engine</h1>

      {/* Auth Card */}
      <div className="w-[450px] bg-white shadow-lg rounded-lg p-6">
        {/* Heading */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isSignUp ? "New Here? Let’s Get You Started!" : "Welcome Back!"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password (Only for Sign Up) */}
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

          {/* Sign Up/Login Button */}
          <button
            type="submit"
            className="w-full bg-primaryYellow text-white font-medium py-2 rounded-md mt-4 hover:bg-yellow-600"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">
            or {isSignUp ? "Sign Up" : "Log In"} with
          </span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Buttons */}
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

        {/* Footer */}
        <div className="text-center mt-4 text-gray-600">
          <p>
            {isSignUp ? "Have an account?" : "Don't have an account?"}{" "}
            <span
              className="text-blue-500 font-medium cursor-pointer"
              onClick={() => setIsSignUp(!isSignUp)} // Toggle the mode
            >
              {isSignUp ? "Log In Now" : "Sign Up Now"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
