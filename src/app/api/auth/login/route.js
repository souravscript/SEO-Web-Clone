import connectToDatabase from "@/db/db-connect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"; // Ensure Supabase client is set up
import { supabase } from "@/lib/supabase";

//const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function POST(req) {
  await connectToDatabase();

  try {
    // Parse request body
    const { email, password } = await req.json();

    // Validate email input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are both required" },
        { status: 400 }
      );
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Supabase login error:", error.message);
      return NextResponse.json(
        { message: error.message || "Supabase login failed" },
        { status: 400 }
      );
    }

    // Extract tokens and user data
    const { session, user } = data;
    const { access_token, refresh_token } = session;


    const authUser=await User.findOne({supabaseId:user.id})
    console.log("auth user in login ",authUser)
    // Set a secure cookie with the access token
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: authUser.fullName,
          phoneNumber:authUser.phoneNumber
          // Include other user fields as needed
        },
        token:authUser.token,
        message: "Login successful",
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "access_token",
      value: access_token,
      //httpOnly: true, // Secure cookie, not accessible via JavaScript
      //secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/", // Available to all routes
    });

    // Optionally store the refresh token in another cookie
    response.cookies.set({
      name: "refresh_token",
      value: refresh_token,
      //httpOnly: true,
      //secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}