import connectToDatabase from "@/db/db-connect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req){
    await connectToDatabase()
    try{  
        const {email,fullName,profilePic}=await req.json();
        if(!email){
            return NextResponse.json({message:"No email recieved"})
        }
        const newUser=User.create({
            email,
            fullName:"",
            profilePic:""
        })
        return NextResponse.status(201).json({"user registered":newUser});
    }catch(err){
        return NextResponse.status(400).json({ success: false, error: err.message });
    }
}