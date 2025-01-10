import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req){
    await connectToDatabase();
    try{
        const {user,error}=await authenticate(req)
        console.log("user from profile", user.sub);
        if (error) {
            return NextResponse.json({ error: error }, { status: 401 });
        }
        const authUser = await User.findOne({ supabaseId: user.sub });
        if (!authUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        console.log("auth user from profile", authUser);
        const {fullName,phoneNumber}=await req.json();
        if(!fullName || !phoneNumber ){
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        const response=await User.updateOne({supabaseId: user.sub},{fullName,phoneNumber});

        if(!response){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        NextResponse.json({response},{status:200});

    }catch(err){
        console.error("Error generating token:", error);
            return NextResponse.json(
              { message: "Internal server error" },
              { status: 500 }
            );
    }

}