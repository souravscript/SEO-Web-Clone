import connectToDatabase from "@/db/db-connect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req){
    await connectToDatabase()
    try{  
        const {email,supabaseId}=await req.json();
        if(!email){
            return NextResponse.json({message:"No email recieved"},{status:404})
        }
        const newUser=await User.create({
            email,
            supabaseId,
            fullName:"",
            profilePic:""
        })
        return NextResponse.json({"user registered":newUser},{status:201});
    }catch(err){
        return NextResponse.json({ success: false, error: err.message },{status:400});
    }
}