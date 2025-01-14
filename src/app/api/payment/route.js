import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function PUT(req) {
    await connectToDatabase();
    try {
        const { user, error } = await authenticate(req);
        
        if (!user || error) {
            return NextResponse.json(
                { message: "Error with the authentication" }, 
                { status: 500 }
            );
        }
        //console.log("user from payment", user);
        const authUser = await User.findOne({ supabaseId: user.sub });
        //console.log("auth user from token", authUser.token);
        if (!authUser) {
            return NextResponse.json(
                { message: "User not found" }, 
                { status: 404 }
            );
        }
        //console.log("auth user from payment", authUser.token);
        const { amount } = await req.json();
        
        if (!amount) {
            return NextResponse.json(
                { message: "Amount not received" }, 
                { status: 400 }
            );
        }
        
        
        console.log("Amount from token", amount);
        authUser.token += amount;  // Corrected variable name
        await authUser.save();  
        console.log("User token from token", authUser.token);
        return NextResponse.json(
            { token: authUser.token }, 
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: err.message }, 
            { status: 501 }
        );
    }
}