import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
//import { authenticate } from "@/lib/authenticate";
import { authenticateWithCookie } from "@/lib/authenticateWithCookie";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req){
    await connectToDatabase();
    try{
      const { user, error } = await authenticate(req);
      console.log("auth token", req.headers)
        
      if (error) {
          return NextResponse.json(
              { error: "Error with the authentication" }, 
              { status: 401 }
          );
      }
      //console.log("user from token", user);
      const authUser = await User.findOne({ supabaseId: user.sub });
      //console.log("auth user from token", authUser.token);
      if (!authUser) {
          return NextResponse.json(
              { message: "User not found" }, 
              { status: 404 }
          );
      }
        const {fullName,phoneNumber}=await req.json();
        if(!fullName || !phoneNumber ){
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

      
        const response=await User.updateOne({supabaseId: user.id},{fullName,phoneNumber});

        if(!response){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        console.log("auth user in profile", response)
        return NextResponse.json({response:response},{status:200});

    }catch(err){
        console.error("Error generating token:", err);
            return NextResponse.json(
              { message: "Internal server error" },
              { status: 500 }
            );
    }

}


export async function GET(req) {
    await connectToDatabase();
    try {
      const { user, error } = await authenticate(req);
        
      if (error) {
          return NextResponse.json(
              { error: "Error with the authentication" }, 
              { status: 401 }
          );
      }
      //console.log("user from token", user);
      const authUser = await User.findOne({ supabaseId: user.sub });
      //console.log("auth user from token", authUser.token);
      if (!authUser) {
          return NextResponse.json(
              { message: "User not found" }, 
              { status: 404 }
          );
      }
      //console.log("auth user from profile", authUser);
      //const { fullName, phoneNumber, email } = authUser;
  
      return NextResponse.json(
        { authUser },
        { status: 200 }
      );
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }