import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );


    const { error } = await supabase.auth.signOut();
  // Clear cookies by setting them with an empty value and maxAge 0
  response.cookies.set({
    name: "accessToken",
    value: "",
    maxAge: 0, // Expire immediately
    path: "/", // Ensure this matches the original cookie path
  });

  response.cookies.set({
    name: "refreshToken",
    value: "",
    maxAge: 0,
    path: "/",
  });

  if(error){
    console.log("Logout Error:", error.message);
    return NextResponse.json(
      { message: error.message || "Logout failed" },
      { status: 400 }
    );
  }
  return NextResponse.json(
    {message: "Logout successful"},{status: 200})
}
